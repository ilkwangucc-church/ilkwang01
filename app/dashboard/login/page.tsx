import { redirect } from "next/navigation";

// 대시보드 전용 로그인 페이지 제거 — 일반 로그인 페이지(/login)로 통합
export default function DashboardLoginPage() {
  redirect("/login");
}
