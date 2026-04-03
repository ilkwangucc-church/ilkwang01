"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    setMessage("");
    // TODO: Supabase Auth signUp
    await new Promise((r) => setTimeout(r, 800));
    setMessage("회원가입이 완료되었습니다. 이메일 인증 후 로그인하세요.");
    setLoading(false);
  }

  const EyeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );

  const EyeOffIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  const isPasswordField = (name: string) => name === "password" || name === "confirm";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-lg overflow-hidden">
          {/* 상단 영역 — 흰색 배경 */}
          <div className="bg-white px-8 pt-6" style={{ paddingBottom: 10 }}>
            <div className="text-center mb-5">
              <div className="flex flex-col items-center mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo01.png" alt="일광교회" className="h-10 w-auto mb-2" />
                <span className="font-nanum text-[11px] text-gray-500 tracking-wide leading-none">행복과 영원으로 초대하는</span>
                <span className="font-noto-black text-[22px] text-[#1a2744] leading-none">일광교회</span>
              </div>
            </div>
            <div className="w-full rounded-xl overflow-hidden mt-3 mb-2">
              <div className="bg-gray-200 px-5 py-2.5 text-center">
                <span className="text-gray-700 text-base font-semibold">회원가입</span>
              </div>
              <div className="bg-gray-100 px-5 py-2 text-center">
                <span className="text-gray-500 text-xs">일광교회 성도 포털에 오신 것을 환영합니다</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: "이름", name: "name", type: "text", placeholder: "홍길동" },
                { label: "이메일", name: "email", type: "email", placeholder: "your@email.com" },
                { label: "휴대폰", name: "phone", type: "tel", placeholder: "010-0000-0000" },
                { label: "비밀번호", name: "password", type: "password", placeholder: "8자 이상" },
                { label: "비밀번호 확인", name: "confirm", type: "password", placeholder: "비밀번호 재입력" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {isPasswordField(f.name) ? (
                    <div className="relative">
                      <input
                        type={(f.name === "password" ? showPw : showConfirm) ? "text" : "password"}
                        name={f.name}
                        value={form[f.name as keyof typeof form]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required
                        className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-sm transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => f.name === "password" ? setShowPw(!showPw) : setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {(f.name === "password" ? showPw : showConfirm) ? EyeOffIcon : EyeIcon}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-sm transition-colors"
                    />
                  )}
                </div>
              ))}

              {message && (
                <div className={`text-sm rounded-lg px-4 py-3 ${message.includes("완료") ? "text-green-700 bg-green-50 border border-green-200" : "text-red-700 bg-red-50 border border-red-200"}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2E7D32] text-white rounded-xl font-semibold hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
                style={{ marginTop: 25 }}
              >
                {loading ? "처리 중..." : "회원가입"}
              </button>
            </form>
          </div>

          {/* 하단 영역 — 연한 회색 배경 (투톤) */}
          <div className="bg-gray-50 px-8 py-5 text-center">
            <p className="text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-[#2E7D32] font-medium hover:underline">로그인</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
