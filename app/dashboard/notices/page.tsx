import { Metadata } from "next";
import Link from "next/link";
import { Pin, Edit, Trash2, Plus, Eye } from "lucide-react";

export const metadata: Metadata = { title: "공지 관리 | 관리자" };

const notices = [
  { id: 1, title: "2024 부활절 연합예배 안내", category: "예배", pinned: true, date: "2024-03-25", views: 312 },
  { id: 2, title: "봄 부흥성회 강사 프로필", category: "행사", pinned: false, date: "2024-03-20", views: 245 },
  { id: 3, title: "청년부 수련회 참가 신청", category: "청년부", pinned: false, date: "2024-03-18", views: 189 },
  { id: 4, title: "소그룹 리더 모집 안내", category: "훈련", pinned: false, date: "2024-03-15", views: 167 },
  { id: 5, title: "교회 주차 안내 변경", category: "안내", pinned: true, date: "2024-03-10", views: 423 },
];

export default function NoticesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지/게시판 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">공지사항 및 게시물을 관리합니다</p>
        </div>
        <Link
          href="/dashboard/notices/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" />
          공지 작성
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
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
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    {n.pinned && <Pin className="w-3.5 h-3.5 text-orange-500" />}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">{n.title}</td>
                  <td className="px-6 py-3 hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{n.category}</span>
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell text-gray-500">{n.date}</td>
                  <td className="px-6 py-3 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-gray-500"><Eye className="w-3 h-3" />{n.views}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-[#2E7D32]"><Edit className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
