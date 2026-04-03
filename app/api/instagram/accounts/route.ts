import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readAccounts, writeAccounts, type InstagramAccount } from "@/lib/instagram";

/** GET — 전체 계정 목록 (비관리자는 토큰 마스킹) */
export async function GET(req: NextRequest) {
  try {
    const accounts = await readAccounts();

    const token = req.cookies.get("admin_session")?.value;
    const session = token ? verifySessionToken(token) : null;
    const isAdmin = session && session.role >= 5;

    const safe = accounts.map((a) => ({
      ...a,
      accessToken: isAdmin ? a.accessToken : a.accessToken ? "***" : "",
      instagramUserId: isAdmin ? a.instagramUserId : a.instagramUserId ? "***" : "",
    }));

    return NextResponse.json(safe);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

/** POST — 계정 추가/수정 (관리자 전용) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) {
    return NextResponse.json({ error: "권한 부족" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, dept, handle, gradient, bio, url, accessToken, instagramUserId } = body;

    if (!id || !dept || !handle) {
      return NextResponse.json({ error: "필수 항목 누락 (id, dept, handle)" }, { status: 400 });
    }

    const accounts = await readAccounts();
    const existing = accounts.findIndex((a) => a.id === id);

    const tokenExpiresAt = accessToken
      ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      : "";

    const entry: InstagramAccount = {
      id,
      dept,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      gradient: gradient || "from-purple-500 to-pink-500",
      bio: bio || "",
      url: url || `https://www.instagram.com/${handle.replace("@", "")}/`,
      accessToken: accessToken || "",
      instagramUserId: instagramUserId || "",
      tokenExpiresAt,
      isActive: !!accessToken,
    };

    if (existing >= 0) {
      accounts[existing] = entry;
    } else {
      accounts.push(entry);
    }

    await writeAccounts(accounts);
    return NextResponse.json({ success: true, account: { ...entry, accessToken: "***" } });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
