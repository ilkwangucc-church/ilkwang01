"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Play, Edit, Trash2, Plus, X } from "lucide-react";

interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
  category: string;
  scripture: string;
  youtubeUrl: string;
  youtubeId: string;
  description: string;
  published: boolean;
}

const EMPTY_EDIT = { title: "", preacher: "담임목사", date: "", scripture: "", category: "주일예배", youtubeUrl: "", description: "", published: true };

export default function SermonsAdminPage() {
  const [sermons, setSermons]     = useState<Sermon[]>([]);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<Sermon | null>(null);
  const [editForm, setEditForm]   = useState(EMPTY_EDIT);
  const [saving, setSaving]       = useState(false);
  const [editError, setEditError] = useState("");

  const load = useCallback(() => {
    fetch("/api/sermons")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setSermons(data))
      .catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  function openEdit(s: Sermon) {
    setEditTarget(s);
    setEditForm({
      title: s.title, preacher: s.preacher, date: s.date, scripture: s.scripture,
      category: s.category, youtubeUrl: s.youtubeUrl, description: s.description, published: s.published,
    });
    setEditError("");
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setEditForm((f) => ({ ...f, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  }

  async function handleEditSave() {
    if (!editTarget) return;
    setEditError("");
    setSaving(true);
    const res = await fetch("/api/sermons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editTarget.id, ...editForm }),
    });
    setSaving(false);
    if (res.ok) {
      setEditTarget(null);
      load();
    } else {
      const j = await res.json();
      setEditError(j.error || "저장 중 오류가 발생했습니다.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(id);
    const res = await fetch("/api/sermons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    if (res.ok) load();
    else alert("삭제 중 오류가 발생했습니다.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">설교/미디어 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">유튜브 설교 영상을 등록하고 관리합니다</p>
        </div>
        <Link
          href="/admin/sermons/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" />
          설교 등록
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">제목</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">분류</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">설교자</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">날짜</th>
                <th className="text-left px-6 py-3">공개</th>
                <th className="text-left px-6 py-3">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sermons.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{s.title}</p>
                      <p className="text-xs text-gray-400">{s.scripture}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full">{s.category}</span>
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell text-gray-600">{s.preacher}</td>
                  <td className="px-6 py-3 hidden md:table-cell text-gray-600">{s.date}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {s.published ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={s.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEdit(s)}
                        className="text-gray-400 hover:text-[#2E7D32] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleting === s.id}
                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sermons.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">등록된 설교가 없습니다.</div>
        )}
      </div>

      {/* 수정 모달 */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">설교 수정</h3>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">{editError}</div>
              )}
              {[
                { label: "설교 제목 *", name: "title", type: "text", placeholder: "예: 부활의 증인으로 살라" },
                { label: "설교자", name: "preacher", type: "text", placeholder: "담임목사" },
                { label: "설교 날짜", name: "date", type: "date" },
                { label: "본문 말씀", name: "scripture", type: "text", placeholder: "예: 고전 15:1-11" },
                { label: "YouTube URL *", name: "youtubeUrl", type: "url", placeholder: "https://youtube.com/watch?v=..." },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                  <input type={f.type} name={f.name}
                    value={editForm[f.name as keyof typeof editForm] as string}
                    onChange={handleEditChange}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">예배 분류</label>
                <select name="category" value={editForm.category} onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30">
                  <option>주일예배</option><option>수요예배</option><option>새벽기도</option><option>특별예배</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">설교 요약</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" name="published" checked={editForm.published} onChange={handleEditChange} className="w-4 h-4 text-[#2E7D32] rounded" />
                즉시 공개
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100">취소</button>
              <button onClick={handleEditSave} disabled={saving}
                className="px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] disabled:opacity-50 transition-colors">
                {saving ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
