import { Metadata } from "next";
import Link from "next/link";
import { Play, Edit, Trash2, Plus } from "lucide-react";

export const metadata: Metadata = { title: "설교 관리 | 관리자" };

const sermons = [
  { id: 1, title: "부활의 증인으로 살라", preacher: "담임목사", date: "2024-03-31", category: "주일예배", scripture: "고전 15:1-11", youtube: "abc123", published: true },
  { id: 2, title: "십자가 앞에 서라", preacher: "담임목사", date: "2024-03-24", category: "주일예배", scripture: "갈 2:20", youtube: "def456", published: true },
  { id: 3, title: "기도의 능력", preacher: "담임목사", date: "2024-03-20", category: "수요예배", scripture: "약 5:13-18", youtube: "ghi789", published: true },
  { id: 4, title: "주님을 닮아가는 삶", preacher: "담임목사", date: "2024-03-17", category: "주일예배", scripture: "빌 2:1-11", youtube: "jkl012", published: false },
];

export default function SermonsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">설교/미디어 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">설교 영상을 등록하고 관리합니다</p>
        </div>
        <Link
          href="/dashboard/sermons/new"
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
                      <a href={`https://youtube.com/watch?v=${s.youtube}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500">
                        <Play className="w-4 h-4" />
                      </a>
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
