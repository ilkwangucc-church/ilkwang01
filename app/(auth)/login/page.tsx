"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "아이디/이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      sessionStorage.setItem("admin_user", JSON.stringify({
        username: data.username,
        role: data.role,
        displayName: data.displayName,
      }));

      router.push("/dashboard");
    } catch {
      setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-lg overflow-hidden">
          {/* 상단 영역 — 흰색 배경 */}
          <div className="bg-white px-8 pt-10 pb-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo01.png" alt="일광교회" className="h-10 w-auto mb-2" />
                <span className="font-nanum text-[11px] text-gray-500 tracking-wide">행복과 영원으로 초대하는</span>
                <span className="font-noto-black text-[22px] text-[#1a2744] mt-1">일광교회</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
              <p className="text-gray-500 text-sm mt-1">일광교회 성도 포털</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">아이디 / 이메일</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="아이디 또는 이메일 입력"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPw ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2E7D32] text-white rounded-xl font-semibold hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </form>
          </div>

          {/* 하단 영역 — 연한 회색 배경 (투톤) */}
          <div className="bg-gray-50 px-8 py-5 text-center space-y-2">
            <p className="text-sm text-gray-500">
              아직 계정이 없으신가요?{" "}
              <Link href="/register" className="text-[#2E7D32] font-medium hover:underline">회원가입</Link>
            </p>
            <p className="text-xs text-gray-400">
              비밀번호를 잊으셨나요?{" "}
              <Link href="/contact" className="text-gray-500 hover:text-[#2E7D32] hover:underline">교회 사무실에 문의</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
