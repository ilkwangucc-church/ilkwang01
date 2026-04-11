"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", category: "예배", content: "",
    pinned: false, published: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "저장 중 오류가 발생했습니다.");
        return;
      }
      router.push("/dashboard/notices/announcements");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/notices/announcements" className="text-gray-400 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">공지안내 작성</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required
            placeholder="공지 제목을 입력하세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">분류</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30">
            <option>예배</option><option>행사</option><option>청년부</option>
            <option>훈련</option><option>안내</option><option>기타</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={10} required
            placeholder="공지 내용을 입력하세요..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none" />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} className="w-4 h-4 text-orange-500 rounded" />
            상단 고정
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 text-[#2E7D32] rounded" />
            즉시 공개
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-lg font-medium text-sm hover:bg-[#1B5E20] transition-colors disabled:opacity-50">
            {saving ? "저장 중..." : "저장하기"}
          </button>
          <Link href="/dashboard/notices/announcements"
            className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 text-center">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
