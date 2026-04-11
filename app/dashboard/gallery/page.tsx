"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, X, Upload, Loader2 } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  date: string;
  category: string;
  url: string;
}

const CATEGORIES = ["예배", "청년부", "행사", "소그룹", "어린이", "선교", "교육", "교제", "봉사", "기타"];

const DEFAULT_FORM = {
  title: "",
  category: "예배",
  date: new Date().toISOString().slice(0, 10),
};

export default function GalleryAdminPage() {
  const [items, setItems]       = useState<GalleryItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(DEFAULT_FORM);
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");
  const fileInputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file)            { setError("이미지 파일을 선택해주세요."); return; }
    if (!form.title.trim()) { setError("제목을 입력해주세요."); return; }

    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title",    form.title.trim());
      fd.append("category", form.category);
      fd.append("date",     form.date);
      fd.append("file",     file);

      const res  = await fetch("/api/gallery/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "오류가 발생했습니다."); return; }

      await fetchItems();
      closeModal();
    } catch {
      setError("업로드 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return;
    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function closeModal() {
    setShowModal(false);
    setFile(null);
    setPreview("");
    setError("");
    setForm(DEFAULT_FORM);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">갤러리 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">사진 및 이미지를 업로드하고 관리합니다</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" />
          이미지 업로드
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>등록된 이미지가 없습니다.</p>
          <p className="text-sm mt-1">이미지 업로드 버튼을 눌러 추가하세요.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-500/70 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-gray-900 truncate">{img.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {img.category}
                  </span>
                  <span className="text-xs text-gray-400">{img.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">이미지 업로드</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* 파일 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 파일 <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#2E7D32] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="미리보기"
                      className="mx-auto max-h-44 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="py-5">
                      <Upload className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">클릭하여 이미지 선택</p>
                      <p className="text-xs text-gray-300 mt-1">JPG · PNG · WEBP · GIF</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="이미지 제목을 입력하세요"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              {/* 카테고리 + 날짜 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> 업로드 중...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> 업로드</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
