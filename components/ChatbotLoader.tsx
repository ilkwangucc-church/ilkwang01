"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * 챗봇 위젯 로더
 * - 관리자/로그인 페이지에서는 숨김 (/admin, /login, /signup)
 * - 그 외 모든 공개 페이지에서 표시
 */
export default function ChatbotLoader() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboard = pathname.startsWith("/dashboard");
  if (isAdmin || isAuth || isDashboard) return null;
  return (
    <Script
      src="/chatbot-embed.js"
      strategy="afterInteractive"
      data-api-base=""
    />
  );
}
