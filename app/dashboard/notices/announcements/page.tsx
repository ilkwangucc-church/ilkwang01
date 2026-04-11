"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Pin, Trash2, Plus, Eye, EyeOff } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  category: string;
  content: string;
  pinned: boolean;
  published: boolean;
  date: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  예배: "bg-blue-100 text-blue-700",
  행사: "bg-amber-100 text-amber-700",
  청년부: "bg-purple-100 text-purple-700",
  훈련: "bg-indigo-100 text-indigo-700",
  안내: "bg-gray-100 text-gray-600",
  기타: "bg-pink-100 text-pink-700",
};

export default function AnnouncementsPage() {
  const [notices, setNotices]   = useState<Notice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  const loadNotices = useCallback(() => {
    setLoading(true);
    fetch("/api/notices")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setNotices(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadNotices(); }, [loadNotices]);

  async function handleDelete(id: number) {
    if (!confirm("이 공지를 삭제하시겠습니까?")) return;
    setDeleting(id);
    const res = await fetch("/api/notices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    if (res.ok) loadNotices();
    else alert("삭제 중 오류가 발생했습니다.");
  }

  async function handleTogglePublished(notice: Notice) {
    setToggling(notice.id);
    const res = await fetch("/api/notices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: notice.id, published: !notice.published }),
    });
    setToggling(null);
    if (res.ok) loadNotices();
    else alert("상태 변경 중 오류가 발생했습니다.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지안내</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            교회 공지사항을 관리합니다
            {!loading && <span className="ml-1 text-gray-400">· 총 {notices.length}건</span>}
          </p>
        </div>
        <Link
          href="/dashboard/notices/announcements/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" />
          공지 작성
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">불러오는 중...</div>
        ) : notices.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <p className="text-3xl mb-2">📋</p>
            등록된 공지가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="text-left px-6 py-3 w-6" />
                  <th className="text-left px-6 py-3">제목</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">분류</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">날짜</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">공개</th>
                  <th className="text-left px-6 py-3">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notices.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      {n.pinned && <Pin className="w-3.5 h-3.5 text-orange-500" />}
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-medium text-gray-900">{n.title}</span>
                    </td>
                    <td className="px-6 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[n.category] || "bg-gray-100 text-gray-600"}`}>
                        {n.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-gray-500">{n.date}</td>
                    <td className="px-6 py-3 hidden md:table-cell">
                      <button
                        onClick={() => handleTogglePublished(n)}
                        disabled={toggling === n.id}
                        title={n.published ? "공개 중 (클릭: 비공개)" : "비공개 (클릭: 공개)"}
                        className="disabled:opacity-40"
                      >
                        {n.published
                          ? <Eye className="w-4 h-4 text-[#2E7D32]" />
                          : <EyeOff className="w-4 h-4 text-gray-300" />}
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDelete(n.id)}
                          disabled={deleting === n.id}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-40 transition-colors"
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
        )}
      </div>
    </div>
  );
}
