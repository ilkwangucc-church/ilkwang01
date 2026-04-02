import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인 페이지는 통과
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 관리자 세션 쿠키 확인
  const session = req.cookies.get("admin_session")?.value;

  if (!session || session.length < 10) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 기본 토큰 형식 검증 (base64 디코딩 가능 여부)
  try {
    const raw = Buffer.from(session, "base64").toString("utf8");
    if (!raw.includes("||")) throw new Error("invalid token");
  } catch {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
