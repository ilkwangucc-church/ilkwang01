"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewOfferingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", type: "십일조", amount: "", date: new Date().toISOString().split("T")[0], memo: "" });
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.push("/admin/offerings");
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/offerings" className="text-gray-400 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">헌금 입금 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {[
          { label: "헌금자 이름", name: "name", type: "text", placeholder: "홍길동 (익명 가능)" },
          { label: "입금 날짜", name: "date", type: "date" },
          { label: "금액 (원)", name: "amount", type: "number", placeholder: "100000" },
          { label: "메모", name: "memo", type: "text", placeholder: "선택사항" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
            <input type={f.type} name={f.name} value={form[f.name as keyof typeof form]} onChange={handleChange}
              placeholder={f.placeholder} required={f.name !== "memo"}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">헌금 종류</label>
          <select name="type" value={form.type} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30">
            <option>십일조</option><option>주일헌금</option><option>감사헌금</option>
            <option>선교헌금</option><option>건축헌금</option><option>기타</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-lg font-medium text-sm hover:bg-[#1B5E20] transition-colors disabled:opacity-50">
            {saving ? "저장 중..." : "등록하기"}
          </button>
          <Link href="/admin/offerings" className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 text-center">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
