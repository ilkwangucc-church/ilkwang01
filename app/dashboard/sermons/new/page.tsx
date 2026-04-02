"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewSermonPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", preacher: "담임목사", date: "", category: "주일예배",
    scripture: "", youtube_url: "", description: "", published: true,
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // TODO: Supabase INSERT into sermons
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.push("/dashboard/sermons");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/sermons" className="text-gray-400 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">설교 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        {[
          { label: "설교 제목", name: "title", type: "text", placeholder: "예: 부활의 증인으로 살라" },
          { label: "설교자", name: "preacher", type: "text", placeholder: "담임목사" },
          { label: "설교 날짜", name: "date", type: "date" },
          { label: "본문 말씀", name: "scripture", type: "text", placeholder: "예: 고전 15:1-11" },
          { label: "YouTube 링크", name: "youtube_url", type: "url", placeholder: "https://youtube.com/watch?v=..." },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={form[f.name as keyof typeof form] as string}
              onChange={handleChange}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32]"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">예배 분류</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30">
            <option>주일예배</option>
            <option>수요예배</option>
            <option>새벽기도</option>
            <option>특별예배</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">설교 요약</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            placeholder="설교 요약 내용을 입력하세요..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" name="published" checked={form.published}
            onChange={handleChange} className="w-4 h-4 text-[#2E7D32] rounded" />
          <label htmlFor="published" className="text-sm text-gray-700">즉시 공개</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-lg font-medium text-sm hover:bg-[#1B5E20] transition-colors disabled:opacity-50">
            {saving ? "저장 중..." : "저장하기"}
          </button>
          <Link href="/dashboard/sermons" className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 text-center">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
