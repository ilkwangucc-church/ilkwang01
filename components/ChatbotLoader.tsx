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
  // 버전 쿼리 — 위젯 파일 수정 시 숫자만 올리면 배포 후 즉시 새 버전 적용
  const WIDGET_VERSION = "2.0.0-light";
  return (
    <Script
      src={`/chatbot-embed.js?v=${WIDGET_VERSION}`}
      strategy="afterInteractive"
      data-api-base=""
    />
  );
}
