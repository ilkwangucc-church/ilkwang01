import { Metadata } from "next";
import { Search, Filter, UserCheck, UserX } from "lucide-react";

export const metadata: Metadata = { title: "성도 관리 | 관리자" };

const members = [
  { id: 1, name: "김성도", email: "kim@email.com", phone: "010-1234-5678", role: 3, roleName: "성도", dept: "2부 예배", matched: true, joined: "2024-01-15" },
  { id: 2, name: "이집사", email: "lee@email.com", phone: "010-2345-6789", role: 2, roleName: "일반회원", dept: "-", matched: false, joined: "2024-02-10" },
  { id: 3, name: "박권사", email: "park@email.com", phone: "010-3456-7890", role: 4, roleName: "부서관리자", dept: "청년부", matched: true, joined: "2023-11-20" },
  { id: 4, name: "최장로", email: "choi@email.com", phone: "010-4567-8901", role: 3, roleName: "성도", dept: "1부 예배", matched: true, joined: "2023-08-05" },
  { id: 5, name: "정전도사", email: "jeong@email.com", phone: "010-5678-9012", role: 5, roleName: "관리자", dept: "교역자", matched: true, joined: "2022-03-01" },
  { id: 6, name: "강성도", email: "kang@email.com", phone: "010-6789-0123", role: 2, roleName: "일반회원", dept: "-", matched: false, joined: "2024-03-20" },
];

const roleColors: Record<number, string> = {
  1: "bg-gray-100 text-gray-600",
  2: "bg-blue-100 text-blue-700",
  3: "bg-green-100 text-green-700",
  4: "bg-purple-100 text-purple-700",
  5: "bg-red-100 text-red-700",
};

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">성도 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">총 {members.length}명의 회원이 등록되어 있습니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          + 성도 추가
        </button>
      </div>

      {/* 검색/필터 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 이메일, 전화번호 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none">
          <option>전체 등급</option>
          <option>방문자</option>
          <option>일반회원</option>
          <option>성도</option>
          <option>부서관리자</option>
          <option>관리자</option>
        </select>
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none">
          <option>교적 매칭 전체</option>
          <option>매칭 완료</option>
          <option>미매칭</option>
        </select>
      </div>

      {/* 회원 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">이름</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">연락처</th>
                <th className="text-left px-6 py-3">등급</th>
                <th className="text-left px-6 py-3 hidden sm:table-cell">교적매칭</th>
                <th className="text-left px-6 py-3 hidden lg:table-cell">부서</th>
                <th className="text-left px-6 py-3 hidden lg:table-cell">가입일</th>
                <th className="text-left px-6 py-3">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] font-bold text-xs shrink-0">
                        {m.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell text-gray-600">{m.phone}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role]}`}>
                      {m.roleName}
                    </span>
                  </td>
                  <td className="px-6 py-3 hidden sm:table-cell">
                    {m.matched ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs"><UserCheck className="w-3 h-3" />완료</span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs"><UserX className="w-3 h-3" />미매칭</span>
                    )}
                  </td>
                  <td className="px-6 py-3 hidden lg:table-cell text-gray-600">{m.dept}</td>
                  <td className="px-6 py-3 hidden lg:table-cell text-gray-400">{m.joined}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-[#2E7D32] hover:underline">편집</button>
                      {!m.matched && (
                        <button className="text-xs text-blue-600 hover:underline">교적매칭</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 등급 안내 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">회원 등급 안내</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { level: 1, name: "방문자", desc: "비회원" },
            { level: 2, name: "일반회원", desc: "회원가입 완료" },
            { level: 3, name: "성도", desc: "교적 매칭 완료" },
            { level: 4, name: "부서관리자", desc: "부서 블로그 관리 권한" },
            { level: 5, name: "관리자", desc: "전체 관리자 권한" },
          ].map((g) => (
            <div key={g.level} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-xs">
              <span className={`px-1.5 py-0.5 rounded-full font-bold ${roleColors[g.level]}`}>{g.level}</span>
              <span className="font-medium text-gray-700">{g.name}</span>
              <span className="text-gray-400">{g.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
