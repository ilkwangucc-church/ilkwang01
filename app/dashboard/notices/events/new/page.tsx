"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", category: "행사", content: "",
    eventDate: "", pinned: false, published: true, showOnHome: false,
  });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImagePreview(null);
    setImageName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    router.push("/dashboard/notices/events");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/notices/events" className="text-gray-400 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">행사안내 작성</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required
            placeholder="행사 제목을 입력하세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">분류</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30">
              <option>행사</option><option>청년부</option><option>기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">행사 날짜 <span className="text-gray-400 text-xs">(선택)</span></label>
            <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">이미지 첨부 <span className="text-gray-400 text-xs">(선택)</span></label>
          {imagePreview ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <Image src={imagePreview} alt="첨부 이미지" width={600} height={300} className="w-full h-48 object-cover" />
              <button type="button" onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500 px-3 py-2 bg-gray-50">{imageName}</p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#2E7D32]/40 hover:bg-green-50/30 transition-colors">
              <ImagePlus className="w-7 h-7 text-gray-300" />
              <span className="text-sm text-gray-400">클릭하여 이미지 선택</span>
              <span className="text-xs text-gray-300">JPG, PNG, GIF — 최대 5MB</span>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={10} required
            placeholder="행사 내용 및 일정을 입력하세요..."
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
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" name="showOnHome" checked={form.showOnHome} onChange={handleChange} className="w-4 h-4 text-blue-500 rounded" />
            홈 화면에 표시
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-lg font-medium text-sm hover:bg-[#1B5E20] transition-colors disabled:opacity-50">
            {saving ? "저장 중..." : "저장하기"}
          </button>
          <Link href="/dashboard/notices/events"
            className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-50 text-center">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
