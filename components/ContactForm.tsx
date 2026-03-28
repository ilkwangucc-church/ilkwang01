"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("done");
        setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <h2 className="font-nanum-extrabold text-2xl text-gray-800 mb-6">문의 보내기</h2>
      {status === "done" ? (
        <div className="bg-[#E8F5E9] rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-nanum-extrabold text-[#2E7D32] text-lg">문의가 접수되었습니다!</p>
          <p className="text-gray-600 text-sm mt-2">빠른 시일 내에 답변 드리겠습니다.</p>
          <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-[#2E7D32] underline">다시 보내기</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-nanum-bold text-gray-600 mb-1">이름 *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E7D32]"
                placeholder="홍길동" />
            </div>
            <div>
              <label className="block text-xs font-nanum-bold text-gray-600 mb-1">연락처</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E7D32]"
                placeholder="010-0000-0000" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-nanum-bold text-gray-600 mb-1">이메일 *</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E7D32]"
              placeholder="example@email.com" />
          </div>
          <div>
            <label className="block text-xs font-nanum-bold text-gray-600 mb-1">제목 *</label>
            <input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E7D32]"
              placeholder="문의 제목을 입력하세요" />
          </div>
          <div>
            <label className="block text-xs font-nanum-bold text-gray-600 mb-1">내용 *</label>
            <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2E7D32] resize-none"
              placeholder="문의 내용을 입력하세요" />
          </div>
          <button type="submit" disabled={status === "sending"}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2E7D32] text-white font-nanum-bold rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-60">
            <Send className="w-4 h-4" />
            {status === "sending" ? "전송 중..." : "문의 보내기"}
          </button>
          {status === "error" && <p className="text-red-500 text-xs text-center">전송에 실패했습니다. 다시 시도해 주세요.</p>}
        </form>
      )}
    </div>
  );
}
