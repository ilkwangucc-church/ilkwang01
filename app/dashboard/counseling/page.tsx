"use client";
import { useState } from "react";
import { HeartHandshake, Lock, CheckCircle2 } from "lucide-react";

export default function CounselingPage() {
  const [form, setForm] = useState({ category: "일반상담", name: "", phone: "", content: "", anonymous: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <CheckCircle2 className="w-16 h-16 text-[#2E7D32] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">상담 신청이 접수되었습니다</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            담당 교역자가 확인 후 연락드리겠습니다.<br />
            보통 1~3일 이내에 답변이 이루어집니다.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ category: "일반상담", name: "", phone: "", content: "", anonymous: false }); }}
            className="mt-6 px-6 py-2.5 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
          >
            새 상담 신청
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-[#2E7D32]" /> 상담신청
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">모든 상담 내용은 담당 교역자만 확인합니다</p>
      </div>

      <div className="bg-[#E8F5E9] rounded-xl p-4 flex items-start gap-3 border border-[#C8E6C9]">
        <Lock className="w-4 h-4 text-[#2E7D32] mt-0.5 shrink-0" />
        <p className="text-sm text-[#2E7D32] leading-relaxed">
          상담 내용은 철저히 비밀이 보장됩니다. 담당 교역자 외에는 어떤 내용도 공개되지 않습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">상담 유형</label>
          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          >
            <option>일반상담</option>
            <option>신앙상담</option>
            <option>가정상담</option>
            <option>직장·진로상담</option>
            <option>청년상담</option>
            <option>기타</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox" id="anonymous" name="anonymous"
            checked={form.anonymous} onChange={handleChange}
            className="w-4 h-4 accent-[#2E7D32]"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700 cursor-pointer">익명으로 신청하기</label>
        </div>

        {!form.anonymous && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required={!form.anonymous}
                placeholder="이름"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
              <input
                type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="010-0000-0000"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            상담 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content" value={form.content} onChange={handleChange} required
            rows={6}
            placeholder="상담하고 싶은 내용을 자유롭게 작성해 주세요. 모든 내용은 담당 교역자만 확인합니다."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3 bg-[#2E7D32] text-white rounded-xl font-medium text-sm hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
        >
          {loading ? "제출 중..." : "상담 신청하기"}
        </button>
      </form>
    </div>
  );
}
