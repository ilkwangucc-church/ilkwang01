import { redirect } from "next/navigation";

// 관리자 전용 로그인 제거 — 일반 로그인(/login)으로 통합
export default function AdminLoginPage() {
  redirect("/login");
}
