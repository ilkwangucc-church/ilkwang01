import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DEPLOY_PATH  = path.join(process.cwd(), "data", "sermon-comments.json");
const TMP_PATH     = "/tmp/ilkwang-sermon-comments.json";
const TMP_TS_PATH  = "/tmp/ilkwang-sermon-comments-ts.txt";
const TMP_SHA_PATH = "/tmp/ilkwang-sermon-comments-sha.txt";
const GH_FILE_PATH = "data/sermon-comments.json";
const CACHE_TTL    = 30;

export interface SermonComment {
  id: number;
  sermonId: number;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

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
    return res.ok;
  } catch { return false; }
}

async function readComments(): Promise<SermonComment[]> {
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
      } catch { /* ignore */ }
      return JSON.parse(gh.content);
    }
  }
  try { return JSON.parse(await readFile(DEPLOY_PATH, "utf-8")); }
  catch { return []; }
}

async function writeComments(data: SermonComment[]): Promise<void> {
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
        const ok = await ghWriteText(GH_FILE_PATH, json, sha, "DB: 은혜나눔 댓글 업데이트");
        if (ok) {
          const updated = await ghReadText(GH_FILE_PATH);
          if (updated) { try { await writeFile(TMP_SHA_PATH, updated.sha, "utf-8"); } catch { /* no-op */ } }
          console.log("[comments] GitHub 저장 성공");
        } else {
          const fresh = await ghReadText(GH_FILE_PATH);
          if (fresh) {
            const retry = await ghWriteText(GH_FILE_PATH, json, fresh.sha, "DB: 은혜나눔 댓글 업데이트");
            if (retry) {
              const afterRetry = await ghReadText(GH_FILE_PATH);
              if (afterRetry) { try { await writeFile(TMP_SHA_PATH, afterRetry.sha, "utf-8"); } catch { /* no-op */ } }
              console.log("[comments] GitHub 저장 성공 (재시도)");
            } else {
              console.warn("[comments] GitHub 저장 실패 (재시도 후)");
            }
          }
        }
      } else {
        console.warn("[comments] SHA 없음 — GitHub 읽기 실패");
      }
    } catch (e) {
      console.warn("[comments] GitHub write 오류:", e);
    }
  }

  try {
    await writeFile(TMP_PATH, json, "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch { /* no-op */ }
  try { await writeFile(DEPLOY_PATH, json, "utf-8"); } catch { /* Vercel 무시 */ }
}

/** GET — 은혜나눔 목록 (?sermonId=xxx) */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "인증 실패" }, { status: 401 });

  const sermonId = Number(req.nextUrl.searchParams.get("sermonId"));
  const all = await readComments();
  const result = sermonId ? all.filter((c) => c.sermonId === sermonId) : all;
  return NextResponse.json(result);
}

/** POST — 은혜나눔 작성 */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "인증 실패" }, { status: 401 });

  try {
    const { sermonId, content } = await req.json();
    if (!sermonId || !content?.trim()) return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });

    const all = await readComments();
    const newComment: SermonComment = {
      id:          Date.now(),
      sermonId:    Number(sermonId),
      authorName:  session.displayName,
      authorEmail: session.username,
      content:     content.trim(),
      createdAt:   new Date().toISOString().slice(0, 10),
    };
    all.push(newComment);
    await writeComments(all);
    return NextResponse.json({ success: true, comment: newComment });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** DELETE — 은혜나눔 삭제 (관리자 or 본인) */
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "인증 실패" }, { status: 401 });

  try {
    const { id } = await req.json();
    const all = await readComments();
    const target = all.find((c) => c.id === id);
    if (!target) return NextResponse.json({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
    if (session.role < 5 && target.authorEmail !== session.username)
      return NextResponse.json({ error: "권한 부족" }, { status: 403 });

    await writeComments(all.filter((c) => c.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
