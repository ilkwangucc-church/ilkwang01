"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      setSent(true);
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
          <div className="bg-white px-8 pt-10" style={{ paddingBottom: 0 }}>
            <div className="text-center mb-8">
              <div className="flex flex-col items-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo01.png" alt="일광교회" className="h-10 w-auto mb-2" />
                <span className="font-nanum text-[11px] text-gray-500 tracking-wide leading-none">행복과 영원으로 초대하는</span>
                <span className="font-noto-black text-[22px] text-[#1a2744] leading-none">일광교회</span>
              </div>
            </div>
            <div className="w-full rounded-xl overflow-hidden mt-3 mb-2">
              <div className="bg-gray-200 px-5 py-2.5 text-center">
                <span className="text-gray-700 text-base font-semibold">비밀번호 찾기</span>
              </div>
              <div className="bg-gray-100 px-5 py-2 text-center">
                <span className="text-gray-500 text-xs">가입하신 이메일로 재설정 안내를 보내드립니다</span>
              </div>
            </div>

            {sent ? (
              /* 전송 완료 화면 */
              <div className="mt-[15px] pb-8 text-center space-y-4">
                <div className="w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#2E7D32" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 font-semibold text-base mb-1">이메일을 확인해주세요</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    <span className="text-[#2E7D32] font-medium">{email}</span>으로<br />
                    비밀번호 재설정 안내를 보내드렸습니다.
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  이메일이 오지 않으면 스팸함을 확인하거나<br />
                  교회 사무실로 문의해주세요.
                </p>
              </div>
            ) : (
              /* 이메일 입력 폼 */
              <form onSubmit={handleSubmit} className="space-y-5 mt-[15px]">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">가입하신 이메일</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-sm transition-colors"
                  />
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
                  {loading ? "전송 중..." : "재설정 이메일 보내기"}
                </button>
              </form>
            )}
          </div>

          {/* 하단 영역 — 연한 회색 배경 (투톤) */}
          <div className="bg-gray-50 px-8 py-5 text-center space-y-2">
            <p className="text-sm text-gray-500">
              <Link href="/login" className="text-[#2E7D32] font-medium hover:underline">← 로그인으로 돌아가기</Link>
            </p>
            <p className="text-xs text-gray-400">
              아직 계정이 없으신가요?{" "}
              <Link href="/register" className="text-gray-500 hover:text-[#2E7D32] hover:underline">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
