import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DEPLOY_PATH  = path.join(process.cwd(), "data", "cert-requests.json");
const TMP_PATH     = "/tmp/ilkwang-cert-requests.json";
const TMP_TS_PATH  = "/tmp/ilkwang-cert-requests-ts.txt";
const TMP_SHA_PATH = "/tmp/ilkwang-cert-sha.txt";
const GH_FILE_PATH = "data/cert-requests.json";
const CACHE_TTL    = 30;

export interface CertRequest {
  id: number;
  memberName: string;
  memberEmail: string;
  type: string;
  purpose: string;
  requestedAt: string;
  status: "pending" | "approved";
  issuedAt: string | null;
  approvedBy: string | null;
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

async function readRequests(): Promise<CertRequest[]> {
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

async function writeRequests(data: CertRequest[]): Promise<void> {
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
        const ok = await ghWriteText(GH_FILE_PATH, json, sha, "DB: 증명서 신청 데이터 업데이트");
        if (ok) {
          const updated = await ghReadText(GH_FILE_PATH);
          if (updated) { try { await writeFile(TMP_SHA_PATH, updated.sha, "utf-8"); } catch { /* no-op */ } }
          console.log("[cert] GitHub 저장 성공");
        } else {
          const fresh = await ghReadText(GH_FILE_PATH);
          if (fresh) {
            const retry = await ghWriteText(GH_FILE_PATH, json, fresh.sha, "DB: 증명서 신청 데이터 업데이트");
            if (retry) {
              const afterRetry = await ghReadText(GH_FILE_PATH);
              if (afterRetry) { try { await writeFile(TMP_SHA_PATH, afterRetry.sha, "utf-8"); } catch { /* no-op */ } }
              console.log("[cert] GitHub 저장 성공 (재시도)");
            } else {
              console.warn("[cert] GitHub 저장 실패 (재시도 후)");
            }
          }
        }
      } else {
        console.warn("[cert] SHA 없음 — GitHub 읽기 실패");
      }
    } catch (e) {
      console.warn("[cert] GitHub write 오류:", e);
    }
  }

  try {
    await writeFile(TMP_PATH, json, "utf-8");
    await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
  } catch { /* no-op */ }
  try { await writeFile(DEPLOY_PATH, json, "utf-8"); } catch { /* Vercel 무시 */ }
}

/** GET — 목록 조회 (관리자: 전체 / 일반회원: 본인 것만) */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "인증 실패" }, { status: 401 });

  const all = await readRequests();

  if (session.role >= 5) {
    return NextResponse.json(all);
  }
  // 일반 회원 — 이메일로 본인 것만
  const mine = all.filter((r) => r.memberEmail === session.username);
  return NextResponse.json(mine);
}

/** POST — 증명서 신청 (회원) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "인증 실패" }, { status: 401 });

  try {
    const { type, purpose } = await req.json();
    if (!type) return NextResponse.json({ error: "증명서 종류를 선택해주세요." }, { status: 400 });

    const all = await readRequests();
    const newReq: CertRequest = {
      id:          Date.now(),
      memberName:  session.displayName,
      memberEmail: session.username,
      type,
      purpose:     purpose?.trim() || "",
      requestedAt: new Date().toISOString().slice(0, 10),
      status:      "pending",
      issuedAt:    null,
      approvedBy:  null,
    };
    all.unshift(newReq);
    await writeRequests(all);
    return NextResponse.json({ success: true, request: newReq });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

/** PATCH — 증명서 승인 (관리자) */
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const { id } = await req.json();
    const all = await readRequests();
    const idx = all.findIndex((r) => r.id === id);
    if (idx < 0) return NextResponse.json({ error: "신청을 찾을 수 없습니다." }, { status: 404 });

    all[idx] = {
      ...all[idx],
      status:     "approved",
      issuedAt:   new Date().toISOString().slice(0, 10),
      approvedBy: session.displayName,
    };
    await writeRequests(all);
    return NextResponse.json({ success: true, request: all[idx] });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
