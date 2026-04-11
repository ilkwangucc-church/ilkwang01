import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DEPLOY_PATH  = path.join(process.cwd(), "data", "sermons.json");
const TMP_PATH     = "/tmp/ilkwang-sermons.json";
const TMP_TS_PATH  = "/tmp/ilkwang-sermons-ts.txt";
const TMP_SHA_PATH = "/tmp/ilkwang-sermons-sha.txt";
const GH_FILE_PATH = "data/sermons.json";
const CACHE_TTL    = 30;

export interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  category: string;
  youtubeUrl: string;
  youtubeId: string;
  description: string;
  published: boolean;
}

function hasGithub() {
  return !!(process.env.GITHUB_DB_TOKEN && process.env.GITHUB_DB_REPO);
}

function extractYoutubeId(url: string): string {
  if (!url) return "";
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
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

async function readSermons(): Promise<Sermon[]> {
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
  catch { return []; }
}

async function writeSermons(data: Sermon[]): Promise<void> {
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
        const ok = await ghWriteText(GH_FILE_PATH, json, sha, "DB: 설교 데이터 업데이트");
        if (ok) {
          const updated = await ghReadText(GH_FILE_PATH);
          if (updated) { try { await writeFile(TMP_SHA_PATH, updated.sha, "utf-8"); } catch { /* no-op */ } }
          console.log("[sermons] GitHub 저장 성공");
        } else {
          const fresh = await ghReadText(GH_FILE_PATH);
          if (fresh) {
            const retry = await ghWriteText(GH_FILE_PATH, json, fresh.sha, "DB: 설교 데이터 업데이트");
            if (retry) {
              const afterRetry = await ghReadText(GH_FILE_PATH);
              if (afterRetry) { try { await writeFile(TMP_SHA_PATH, afterRetry.sha, "utf-8"); } catch { /* no-op */ } }
              console.log("[sermons] GitHub 저장 성공 (재시도)");
            } else {
              console.warn("[sermons] GitHub 저장 실패 (재시도 후)");
            }
          }
        }
      } else {
        console.warn("[sermons] SHA 없음 — GitHub 읽기 실패");
      }
    } catch (e) {
      console.warn("[sermons] GitHub write 오류:", e);
    }
  }

  try {
    await writeFile(TMP_PATH, json, "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch { /* no-op */ }
  try { await writeFile(DEPLOY_PATH, json, "utf-8"); } catch { /* Vercel 무시 */ }
}

/** GET — 설교 목록 (회원: published만 / 관리자: 전체) */
export async function GET(req: NextRequest) {
  const sermons = await readSermons();
  const token = req.cookies.get("admin_session")?.value;
  const session = token ? verifySessionToken(token) : null;

  if (session && session.role >= 5) {
    return NextResponse.json(sermons, { headers: { "Cache-Control": "no-store" } });
  }
  const pub = sermons.filter((s) => s.published);
  return NextResponse.json(pub, { headers: { "Cache-Control": "public, s-maxage=60" } });
}

/** POST — 설교 등록 (관리자) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { title, preacher, date, scripture, category, youtubeUrl, description, published } = await req.json();
    if (!title?.trim()) return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
    if (!youtubeUrl?.trim()) return NextResponse.json({ error: "유튜브 URL을 입력해주세요." }, { status: 400 });

    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) return NextResponse.json({ error: "유효한 유튜브 URL을 입력해주세요." }, { status: 400 });

    const sermons = await readSermons();
    const newSermon: Sermon = {
      id:          Date.now(),
      title:       title.trim(),
      preacher:    preacher?.trim() || "담임목사",
      date:        date || new Date().toISOString().slice(0, 10),
      scripture:   scripture?.trim() || "",
      category:    category || "주일예배",
      youtubeUrl:  youtubeUrl.trim(),
      youtubeId,
      description: description?.trim() || "",
      published:   published !== false,
    };
    sermons.unshift(newSermon);
    await writeSermons(sermons);
    return NextResponse.json({ success: true, sermon: newSermon });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** PATCH — 설교 수정 (관리자) */
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id, ...fields } = await req.json();
    const sermons = await readSermons();
    const idx = sermons.findIndex((s) => s.id === id);
    if (idx < 0) return NextResponse.json({ error: "설교를 찾을 수 없습니다." }, { status: 404 });

    if (fields.youtubeUrl) {
      fields.youtubeId = extractYoutubeId(fields.youtubeUrl);
      if (!fields.youtubeId) return NextResponse.json({ error: "유효한 유튜브 URL을 입력해주세요." }, { status: 400 });
    }

    sermons[idx] = { ...sermons[idx], ...fields };
    await writeSermons(sermons);
    return NextResponse.json({ success: true, sermon: sermons[idx] });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** DELETE — 설교 삭제 (관리자) */
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id } = await req.json();
    const sermons = await readSermons();
    await writeSermons(sermons.filter((s) => s.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
