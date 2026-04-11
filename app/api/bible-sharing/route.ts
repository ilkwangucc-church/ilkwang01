import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DEPLOY_PATH  = path.join(process.cwd(), "data", "bible-sharing.json");
const TMP_PATH     = "/tmp/ilkwang-bible-sharing.json";
const TMP_TS_PATH  = "/tmp/ilkwang-bible-sharing-ts.txt";
const TMP_SHA_PATH = "/tmp/ilkwang-bible-sharing-sha.txt";
const GH_FILE_PATH = "data/bible-sharing.json";
const CACHE_TTL    = 30;

export interface BibleSharing {
  id:         number;
  memberName: string;
  text:       string;
  date:       string;
  book:       string;
  chapter:    number | null;
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
    if (!res.ok) console.warn(`[bible-sharing] GitHub PUT 실패: ${res.status}`);
    return res.ok;
  } catch (e) {
    console.warn("[bible-sharing] GitHub PUT 예외:", e);
    return false;
  }
}

async function readSharings(): Promise<BibleSharing[]> {
  if (hasGithub()) {
    try {
      const ts  = await readFile(TMP_TS_PATH, "utf-8").catch(() => "0");
      const age = (Date.now() - parseInt(ts)) / 1000;
      if (age < CACHE_TTL) return JSON.parse(await readFile(TMP_PATH, "utf-8"));
    } catch { /* ignore */ }
    const gh = await ghReadText(GH_FILE_PATH);
    if (gh) {
      try {
        await writeFile(TMP_PATH, gh.content);
        await writeFile(TMP_TS_PATH, String(Date.now()));
        await writeFile(TMP_SHA_PATH, gh.sha);
      } catch { /* ignore */ }
      return JSON.parse(gh.content);
    }
  }
  try { return JSON.parse(await readFile(DEPLOY_PATH, "utf-8")); }
  catch { return []; }
}

async function writeSharings(data: BibleSharing[]): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  if (hasGithub()) {
    try {
      let sha: string | null = null;
      try { sha = await readFile(TMP_SHA_PATH, "utf-8"); } catch { /* no-op */ }
      if (!sha) { const cur = await ghReadText(GH_FILE_PATH); sha = cur?.sha ?? null; }

      if (sha) {
        const ok = await ghWriteText(GH_FILE_PATH, json, sha, "DB: 성경통독 말씀나눔 업데이트");
        if (ok) {
          const updated = await ghReadText(GH_FILE_PATH);
          if (updated) { try { await writeFile(TMP_SHA_PATH, updated.sha); } catch { /* no-op */ } }
        } else {
          const fresh = await ghReadText(GH_FILE_PATH);
          if (fresh) {
            const retry = await ghWriteText(GH_FILE_PATH, json, fresh.sha, "DB: 성경통독 말씀나눔 업데이트");
            if (retry) {
              const ar = await ghReadText(GH_FILE_PATH);
              if (ar) { try { await writeFile(TMP_SHA_PATH, ar.sha); } catch { /* no-op */ } }
            }
          }
        }
      }
    } catch (e) { console.warn("[bible-sharing] GitHub write 오류:", e); }
  }

  try { await writeFile(TMP_PATH, json); await writeFile(TMP_TS_PATH, String(Date.now())); } catch { /* no-op */ }
  try { await writeFile(DEPLOY_PATH, json); } catch { /* no-op */ }
}

/** GET
 *  ?book=창세기&chapter=1   → 해당 책/장 나눔
 *  ?all=1                   → 전체 (커뮤니티 게시판용, 최신 100개)
 *  (파라미터 없음)           → 전체 반환
 */
export async function GET(req: NextRequest) {
  const sp      = req.nextUrl.searchParams;
  const book    = sp.get("book");
  const chapter = sp.get("chapter");
  const all     = sp.get("all");

  const data = await readSharings();

  if (all) {
    return NextResponse.json(data.slice(0, 100), { headers: { "Cache-Control": "no-store" } });
  }
  if (book) {
    const filtered = data.filter((s) =>
      s.book === book && (chapter === null || s.chapter === parseInt(chapter))
    );
    return NextResponse.json(filtered, { headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(data.slice(0, 100), { headers: { "Cache-Control": "no-store" } });
}

/** POST — { text, book, chapter? } */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session)  return NextResponse.json({ error: "세션이 만료되었습니다." }, { status: 401 });

  try {
    const { text, book, chapter } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
    if (!book?.trim()) return NextResponse.json({ error: "책 정보가 없습니다." }, { status: 400 });

    const entry: BibleSharing = {
      id:         Date.now(),
      memberName: session.displayName || session.username,
      text:       text.trim(),
      date:       new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, "-").replace(".", ""),
      book,
      chapter:    chapter ?? null,
    };

    const data = await readSharings();
    data.unshift(entry);                       // 최신순
    await writeSharings(data);
    return NextResponse.json({ success: true, entry });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** DELETE — { id } (관리자 or 본인) */
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session)  return NextResponse.json({ error: "세션 만료" }, { status: 401 });

  try {
    const { id } = await req.json();
    const data   = await readSharings();
    const entry  = data.find((s) => s.id === id);

    // 본인 글이거나 role >= 5 (관리자)
    const isOwn   = entry?.memberName === (session.displayName || session.username);
    const isAdmin = session.role >= 5;
    if (!isOwn && !isAdmin) return NextResponse.json({ error: "권한 없음" }, { status: 403 });

    const updated = data.filter((s) => s.id !== id);
    await writeSharings(updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
