import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";

/** GET /api/admin/auth/me — 현재 로그인된 관리자 정보 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "인증되지 않음" }, { status: 401 });
  }
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "세션 만료" }, { status: 401 });
  }
  return NextResponse.json(session);
}
