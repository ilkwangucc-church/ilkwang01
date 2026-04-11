import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DEPLOY_PATH  = path.join(process.cwd(), "data", "notices.json");
const TMP_PATH     = "/tmp/ilkwang-notices.json";
const TMP_TS_PATH  = "/tmp/ilkwang-notices-ts.txt";
const GH_FILE_PATH = "data/notices.json";
const CACHE_TTL    = 30;

export interface Notice {
  id: number;
  title: string;
  category: string;
  content: string;
  pinned: boolean;
  published: boolean;
  date: string;
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

async function readNotices(): Promise<Notice[]> {
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

async function writeNotices(data: Notice[]): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  if (hasGithub()) {
    const gh = await ghReadText(GH_FILE_PATH);
    if (gh) {
      const ok = await ghWriteText(GH_FILE_PATH, json, gh.sha, "DB: 공지 데이터 업데이트");
      if (ok) {
        try {
          await writeFile(TMP_PATH, json, "utf-8");
          await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
        } catch { /* ignore */ }
        return;
      }
    }
  }
  await writeFile(DEPLOY_PATH, json, "utf-8");
}

/** GET — 공지 목록 (공개: published만 / 관리자: 전체) */
export async function GET(req: NextRequest) {
  const notices = await readNotices();
  const token = req.cookies.get("admin_session")?.value;
  const session = token ? verifySessionToken(token) : null;

  if (session && session.role >= 5) {
    // 관리자: 전체 반환
    return NextResponse.json(notices, { headers: { "Cache-Control": "no-store" } });
  }
  // 일반 공개: published + 최근 10개
  const pub = notices.filter((n) => n.published).slice(0, 10);
  return NextResponse.json(pub, { headers: { "Cache-Control": "no-store" } });
}

/** POST — 공지 작성 (관리자만) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { title, category, content, pinned, published } = await req.json();
    if (!title?.trim()) return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });

    const notices = await readNotices();
    const newNotice: Notice = {
      id:        Date.now(),
      title:     title.trim(),
      category:  category || "안내",
      content:   content?.trim() || "",
      pinned:    !!pinned,
      published: published !== false,
      date:      new Date().toISOString().slice(0, 10),
    };
    // 고정 글은 앞으로
    if (newNotice.pinned) notices.unshift(newNotice);
    else {
      const pinEnd = notices.findLastIndex((n) => n.pinned);
      notices.splice(pinEnd + 1, 0, newNotice);
    }
    await writeNotices(notices);
    return NextResponse.json({ success: true, notice: newNotice });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** PATCH — 공지 수정 (관리자만): published / pinned 토글 등 */
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id 필요" }, { status: 400 });

    const notices = await readNotices();
    const idx = notices.findIndex((n) => n.id === id);
    if (idx === -1) return NextResponse.json({ error: "공지를 찾을 수 없습니다." }, { status: 404 });

    notices[idx] = { ...notices[idx], ...fields };
    await writeNotices(notices);
    return NextResponse.json({ success: true, notice: notices[idx] });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** DELETE — 공지 삭제 (관리자만) */
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id } = await req.json();
    const notices = await readNotices();
    await writeNotices(notices.filter((n) => n.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
