"use client";
import { useState } from "react";
import Link from "next/link";
import { Pin, Edit, Trash2, Plus, Eye, CalendarDays } from "lucide-react";

const INIT_EVENTS = [
  { id: 1, title: "봄 부흥성회 — 강사 초청",         category: "행사",  pinned: true,  date: "2026-04-10", views: 245, hasImage: true  },
  { id: 2, title: "청년부 수련회 참가 신청",            category: "청년부", pinned: false, date: "2026-03-18", views: 189, hasImage: false },
  { id: 3, title: "성탄절 특별 행사 일정 안내",        category: "행사",  pinned: false, date: "2025-12-10", views: 501, hasImage: true  },
];

const CATEGORY_COLORS: Record<string, string> = {
  행사:   "bg-amber-100 text-amber-700",
  청년부: "bg-purple-100 text-purple-700",
  기타:   "bg-pink-100 text-pink-700",
};

export default function EventsPage() {
  const [events, setEvents] = useState(INIT_EVENTS);

  function handleDelete(id: number) {
    if (confirm("이 행사를 삭제하시겠습니까?")) {
      setEvents(prev => prev.filter(n => n.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">행사안내</h1>
          <p className="text-gray-500 text-sm mt-0.5">교회 행사 일정을 관리합니다 · 총 {events.length}건</p>
        </div>
        <Link
          href="/dashboard/notices/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" />
          행사 작성
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">등록된 행사가 없습니다.</div>
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
                {events.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      {n.pinned && <Pin className="w-3.5 h-3.5 text-orange-500" />}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-amber-500 shrink-0" />
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
