"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="text-gray-500 text-sm mt-1">일광교회 성도 포털에 오신 것을 환영합니다</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "이름", name: "name", type: "text", placeholder: "홍길동" },
              { label: "이메일", name: "email", type: "email", placeholder: "your@email.com" },
              { label: "휴대폰", name: "phone", type: "tel", placeholder: "010-0000-0000" },
              { label: "비밀번호", name: "password", type: "password", placeholder: "8자 이상" },
              { label: "비밀번호 확인", name: "confirm", type: "password", placeholder: "비밀번호 재입력" },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/40 focus:border-[#2E7D32] text-sm transition-colors"
                />
              </div>
            ))}

            <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3 leading-relaxed">
              회원가입 후 이름과 휴대폰 번호로 <strong>교적</strong>과 연동하면
              성도 등급이 부여됩니다. 교적 매칭은 교회 사무실의 확인 후 처리됩니다.
            </div>

            {message && (
              <div className={`text-sm rounded-lg px-4 py-3 ${message.includes("완료") ? "text-green-700 bg-green-50 border border-green-200" : "text-red-700 bg-red-50 border border-red-200"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2E7D32] text-white rounded-xl font-semibold hover:bg-[#1B5E20] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "처리 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
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
