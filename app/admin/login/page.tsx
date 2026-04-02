"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/layout/Logo";
import { Lock, Mail } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      // 로그인 성공 — 세션 정보 저장 후 리다이렉트
      sessionStorage.setItem("admin_user", JSON.stringify({
        username: data.username,
        role: data.role,
        displayName: data.displayName,
      }));

      router.push(redirect);
    } catch {
      setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-xl px-4 py-2">
              <Logo size="sm" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-white">관리자 로그인</h1>
          <p className="text-gray-400 text-sm mt-1">일광교회 관리자 전용</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="관리자 이메일 입력"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2E7D32] text-white rounded-xl font-semibold hover:bg-[#1B5E20] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "로그인 중..." : "관리자 로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
