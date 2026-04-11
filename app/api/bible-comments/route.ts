import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DEPLOY_PATH  = path.join(process.cwd(), "data", "bible-comments.json");
const TMP_PATH     = "/tmp/ilkwang-bible-comments.json";
const TMP_TS_PATH  = "/tmp/ilkwang-bible-comments-ts.txt";
const TMP_SHA_PATH = "/tmp/ilkwang-bible-comments-sha.txt";
const GH_FILE_PATH = "data/bible-comments.json";
const CACHE_TTL    = 30;

export interface BibleComment {
  id: number;
  memberName: string;
  text: string;
  date: string;
}

// key: videoId
type CommentMap = Record<string, BibleComment[]>;

function hasGithub() {
  return !!(process.env.GITHUB_DB_TOKEN && process.env.GITHUB_DB_REPO);
}

async function ghReadText(ghPath: string): Promise<{ content: string; sha: string } | null> {
  const token = process.env.GITHUB_DB_TOKEN!;
  const repo  = process.env.GITHUB_DB_REPO!;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${ghPath}`,
      { headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { content: string; sha: string };
    return { content: Buffer.from(json.content, "base64").toString("utf-8"), sha: json.sha };
  } catch { return null; }
}

async function ghWriteText(ghPath: string, text: string, sha: string, msg: string): Promise<boolean> {
  const token = process.env.GITHUB_DB_TOKEN!;
  const repo  = process.env.GITHUB_DB_REPO!;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${ghPath}`,
      {
        method: "PUT",
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, content: Buffer.from(text).toString("base64"), sha }),
        cache: "no-store",
      }
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[bible-comments] GitHub PUT 실패: ${res.status} — ${body.slice(0, 200)}`);
    }
    return res.ok;
  } catch (e) {
    console.warn("[bible-comments] GitHub PUT 예외:", e);
    return false;
  }
}

async function readComments(): Promise<CommentMap> {
  if (hasGithub()) {
    try {
      const ts  = await readFile(TMP_TS_PATH, "utf-8").catch(() => "0");
      const age = (Date.now() - parseInt(ts)) / 1000;
      if (age < CACHE_TTL) return JSON.parse(await readFile(TMP_PATH, "utf-8"));
    } catch { /* ignore */ }
    const gh = await ghReadText(GH_FILE_PATH);
    if (gh) {
      try {
        await writeFile(TMP_PATH, gh.content, "utf-8");
        await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
        await writeFile(TMP_SHA_PATH, gh.sha, "utf-8");
      } catch { /* ignore */ }
      return JSON.parse(gh.content);
    }
  }
  try { return JSON.parse(await readFile(DEPLOY_PATH, "utf-8")); }
  catch { return {}; }
}

async function writeComments(data: CommentMap): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  if (hasGithub()) {
    try {
      let sha: string | null = null;
      try { sha = await readFile(TMP_SHA_PATH, "utf-8"); } catch { /* no-op */ }

      if (!sha) {
        const current = await ghReadText(GH_FILE_PATH);
        sha = current?.sha ?? null;
      }

      if (sha) {
        const ok = await ghWriteText(GH_FILE_PATH, json, sha, "DB: 성경통독 댓글 업데이트");
        if (ok) {
          const updated = await ghReadText(GH_FILE_PATH);
          if (updated) {
            try { await writeFile(TMP_SHA_PATH, updated.sha, "utf-8"); } catch { /* no-op */ }
          }
          console.log("[bible-comments] GitHub 저장 성공");
        } else {
          const fresh = await ghReadText(GH_FILE_PATH);
          if (fresh) {
            const retry = await ghWriteText(GH_FILE_PATH, json, fresh.sha, "DB: 성경통독 댓글 업데이트");
            if (retry) {
              const afterRetry = await ghReadText(GH_FILE_PATH);
              if (afterRetry) {
                try { await writeFile(TMP_SHA_PATH, afterRetry.sha, "utf-8"); } catch { /* no-op */ }
              }
              console.log("[bible-comments] GitHub 저장 성공 (재시도)");
            } else {
              console.warn("[bible-comments] GitHub 저장 실패 (재시도 후)");
            }
          }
        }
      } else {
        console.warn("[bible-comments] SHA 없음 — GitHub 읽기 실패");
      }
    } catch (e) {
      console.warn("[bible-comments] GitHub write 오류:", e);
    }
  }

  try {
    await writeFile(TMP_PATH, json, "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch { /* no-op */ }

  try { await writeFile(DEPLOY_PATH, json, "utf-8"); } catch { /* no-op */ }
}

/** GET — ?videoId=xxx : 해당 영상 댓글 */
export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");
  if (!videoId) return NextResponse.json({ error: "videoId 파라미터 필요" }, { status: 400 });

  const data = await readComments();
  return NextResponse.json(data[videoId] ?? [], { headers: { "Cache-Control": "no-store" } });
}

/** POST — { videoId, text } : 댓글 작성 (로그인 필요) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "세션이 만료되었습니다." }, { status: 401 });

  try {
    const { videoId, text } = await req.json();
    if (!videoId?.trim()) return NextResponse.json({ error: "videoId 필요" }, { status: 400 });
    if (!text?.trim())    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });

    const data = await readComments();
    if (!data[videoId]) data[videoId] = [];

    const comment: BibleComment = {
      id:         Date.now(),
      memberName: session.displayName || session.username,
      text:       text.trim(),
      date:       new Date().toISOString().slice(0, 10),
    };
    data[videoId].unshift(comment);
    await writeComments(data);
    return NextResponse.json({ success: true, comment });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** DELETE — { videoId, id } : 관리자만 삭제 */
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { videoId, id } = await req.json();
    const data = await readComments();
    if (data[videoId]) {
      data[videoId] = data[videoId].filter((c) => c.id !== id);
    }
    await writeComments(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
