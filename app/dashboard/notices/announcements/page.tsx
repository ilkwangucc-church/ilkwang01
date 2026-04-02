"use client";
import { useState } from "react";
import Link from "next/link";
import { Pin, Edit, Trash2, Plus, Eye } from "lucide-react";

const INIT_NOTICES = [
  { id: 1, title: "2026 부활절 연합예배 안내", category: "예배", pinned: true,  date: "2026-03-25", views: 312, hasImage: false },
  { id: 2, title: "소그룹 리더 모집 안내",      category: "훈련", pinned: false, date: "2026-03-18", views: 189, hasImage: false },
  { id: 3, title: "교회 주차 안내 변경",          category: "안내", pinned: true,  date: "2026-03-10", views: 423, hasImage: true  },
];

const CATEGORY_COLORS: Record<string, string> = {
  예배: "bg-blue-100 text-blue-700",
  행사: "bg-amber-100 text-amber-700",
  청년부: "bg-purple-100 text-purple-700",
  훈련: "bg-indigo-100 text-indigo-700",
  안내: "bg-gray-100 text-gray-600",
  기타: "bg-pink-100 text-pink-700",
};

export default function AnnouncementsPage() {
  const [notices, setNotices] = useState(INIT_NOTICES);

  function handleDelete(id: number) {
    if (confirm("이 공지를 삭제하시겠습니까?")) {
      setNotices(prev => prev.filter(n => n.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지안내</h1>
          <p className="text-gray-500 text-sm mt-0.5">교회 공지사항을 관리합니다 · 총 {notices.length}건</p>
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
        {notices.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">등록된 공지가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs">
                  <th className="text-left px-6 py-3 w-6" />
                  <th className="text-left px-6 py-3">제목</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">분류</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">날짜</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">조회</th>
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{n.title}</span>
                        {n.hasImage && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">이미지</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[n.category] || "bg-gray-100 text-gray-600"}`}>
                        {n.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-gray-500">{n.date}</td>
                    <td className="px-6 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-gray-500"><Eye className="w-3 h-3" />{n.views}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-[#2E7D32] transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(n.id)} className="text-gray-400 hover:text-red-500 transition-colors">
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
