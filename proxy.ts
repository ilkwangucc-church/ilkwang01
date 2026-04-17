import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로그인/비밀번호 찾기/재설정 페이지는 통과
  if (
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return NextResponse.next();
  }

  // /admin/* 요청은 /dashboard/*로 리다이렉트
  if (pathname.startsWith("/admin")) {
    const newPath = pathname.replace("/admin", "/dashboard");
    return NextResponse.redirect(new URL(newPath, req.url));
  }

  // 관리자 세션 쿠키 확인
  const session = req.cookies.get("admin_session")?.value;

  if (!session || session.length < 10) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 기본 토큰 형식 검증
  try {
    const raw = Buffer.from(session, "base64").toString("utf8");
    if (!raw.includes("||")) throw new Error("invalid token");
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
