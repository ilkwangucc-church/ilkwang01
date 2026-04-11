import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DEPLOY_PATH  = path.join(process.cwd(), "data", "notices.json");
const TMP_PATH     = "/tmp/ilkwang-notices.json";
const TMP_TS_PATH  = "/tmp/ilkwang-notices-ts.txt";
const TMP_SHA_PATH = "/tmp/ilkwang-notices-sha.txt";
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
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`[notices] GitHub PUT 실패: ${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
    }
    return res.ok;
  } catch (e) {
    console.warn("[notices] GitHub PUT 예외:", e);
    return false;
  }
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
        await writeFile(TMP_SHA_PATH, gh.sha, "utf-8");  // SHA 캐시
      } catch { /* ignore */ }
      return JSON.parse(gh.content);
    }
  }
  try { return JSON.parse(await readFile(DEPLOY_PATH, "utf-8")); }
  catch { return []; }
}

async function writeNotices(data: Notice[]): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  // 1. GitHub 영구 저장 (writeMembers 패턴 동일 적용)
  if (hasGithub()) {
    try {
      // SHA: /tmp 캐시 우선 → 없으면 GitHub에서 직접 읽기
      let sha: string | null = null;
      try { sha = await readFile(TMP_SHA_PATH, "utf-8"); } catch { /* no-op */ }

      if (!sha) {
        const current = await ghReadText(GH_FILE_PATH);
        sha = current?.sha ?? null;
      }

      if (sha) {
        const ok = await ghWriteText(GH_FILE_PATH, json, sha, "DB: 공지 데이터 업데이트");
        if (ok) {
          const updated = await ghReadText(GH_FILE_PATH);
          if (updated) {
            try { await writeFile(TMP_SHA_PATH, updated.sha, "utf-8"); } catch { /* no-op */ }
          }
          console.log("[notices] GitHub 저장 성공");
        } else {
          // SHA 불일치 시 1회 재시도
          const fresh = await ghReadText(GH_FILE_PATH);
          if (fresh) {
            const retry = await ghWriteText(GH_FILE_PATH, json, fresh.sha, "DB: 공지 데이터 업데이트");
            if (retry) {
              const afterRetry = await ghReadText(GH_FILE_PATH);
              if (afterRetry) {
                try { await writeFile(TMP_SHA_PATH, afterRetry.sha, "utf-8"); } catch { /* no-op */ }
              }
              console.log("[notices] GitHub 저장 성공 (재시도)");
            } else {
              console.warn("[notices] GitHub 저장 실패 (재시도 후)");
            }
          }
        }
      } else {
        console.warn("[notices] SHA 없음 — GitHub 읽기 실패");
      }
    } catch (e) {
      console.warn("[notices] GitHub write 오류:", e);
    }
  }

  // 2. /tmp 캐시 항상 갱신 (현재 인스턴스에서 즉시 반영)
  try {
    await writeFile(TMP_PATH, json, "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch { /* no-op */ }

  // 3. 로컬 파일 (Vercel에서는 실패 — 무시)
  try { await writeFile(DEPLOY_PATH, json, "utf-8"); } catch { /* no-op */ }
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
