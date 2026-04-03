import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readAccounts, writeAccounts, refreshLongLivedToken, isTokenExpired } from "@/lib/instagram";

/** POST — 토큰 갱신 (관리자 전용) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) {
    return NextResponse.json({ error: "권한 부족" }, { status: 403 });
  }

  try {
    const { accountId } = await req.json();
    if (!accountId) {
      return NextResponse.json({ error: "accountId 필요" }, { status: 400 });
    }

    const accounts = await readAccounts();
    const idx = accounts.findIndex((a) => a.id === accountId);
    if (idx < 0) return NextResponse.json({ error: "계정 없음" }, { status: 404 });

    const account = accounts[idx];
    if (!account.accessToken) {
      return NextResponse.json({ error: "토큰 없음" }, { status: 400 });
    }
    if (isTokenExpired(account.tokenExpiresAt)) {
      return NextResponse.json({ error: "토큰 만료됨 — Facebook 개발자 콘솔에서 재발급 필요" }, { status: 400 });
    }

    const result = await refreshLongLivedToken(account.accessToken);
    if (!result) {
      return NextResponse.json({ error: "갱신 실패" }, { status: 500 });
    }

    accounts[idx].accessToken = result.access_token;
    accounts[idx].tokenExpiresAt = new Date(Date.now() + result.expires_in * 1000).toISOString();

    await writeAccounts(accounts);
    return NextResponse.json({
      success: true,
      expiresAt: accounts[idx].tokenExpiresAt,
    });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
