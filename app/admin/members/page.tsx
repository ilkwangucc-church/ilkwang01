"use client";
import { useState } from "react";
import { Search, UserCheck, UserX, ChevronDown } from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/adminAuth";

const MEMBERS = [
  { id: 1, name: "홍길동", email: "hong@email.com", phone: "010-1234-5678", role: 1, dept: "-",    matched: false, joined: "2025-03-28" },
  { id: 2, name: "김성도", email: "kim@email.com",  phone: "010-2345-6789", role: 2, dept: "2부",  matched: true,  joined: "2025-01-15" },
  { id: 3, name: "이집사", email: "lee@email.com",  phone: "010-3456-7890", role: 3, dept: "1부",  matched: true,  joined: "2024-11-20" },
  { id: 4, name: "박장로", email: "park@email.com", phone: "010-4567-8901", role: 4, dept: "당회",  matched: true,  joined: "2023-08-05" },
  { id: 5, name: "정전도사", email: "jeong@email.com", phone: "010-5678-9012", role: 5, dept: "교역자", matched: true, joined: "2022-03-01" },
  { id: 6, name: "강목사", email: "kang@email.com", phone: "010-6789-0123", role: 6, dept: "교역자", matched: true, joined: "2010-01-01" },
  { id: 7, name: "웹마스터", email: "web@ilkwang.or.kr", phone: "-", role: 7, dept: "관리", matched: true, joined: "2026-01-01" },
  { id: 8, name: "최성도", email: "choi@email.com", phone: "010-7890-1234", role: 2, dept: "-",    matched: false, joined: "2025-02-10" },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [members, setMembers] = useState(MEMBERS);

  const filtered = members.filter((m) => {
    const matchSearch = !search || m.name.includes(search) || m.email.includes(search) || m.phone.includes(search);
    const matchRole = roleFilter === 0 || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  function handleRoleChange(id: number, newRole: number) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    setEditId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">총 {members.length}명 · 7단계 등급 관리</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          + 회원 추가
        </button>
      </div>

      {/* 검색 · 필터 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름·이메일·전화번호 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(Number(e.target.value))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
        >
          <option value={0}>전체 등급</option>
          {Object.entries(ROLE_LABELS).map(([v, label]) => (
            <option key={v} value={v}>{v}단계 · {label}</option>
          ))}
        </select>
      </div>

      {/* 회원 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">이름</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">연락처</th>
                <th className="text-left px-5 py-3">등급</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">교적</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">부서</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">가입일</th>
                <th className="text-left px-5 py-3">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
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
                  <td className="px-5 py-3 hidden md:table-cell text-gray-600">{m.phone}</td>
                  <td className="px-5 py-3">
                    {editId === m.id ? (
                      <select
                        defaultValue={m.role}
                        onChange={(e) => handleRoleChange(m.id, Number(e.target.value))}
                        onBlur={() => setEditId(null)}
                        autoFocus
                        className="text-xs border border-gray-300 rounded px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                      >
                        {Object.entries(ROLE_LABELS).map(([v, label]) => (
                          <option key={v} value={v}>{v}. {label}</option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditId(m.id)}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[m.role] || "bg-gray-100 text-gray-600"} hover:opacity-80`}
                        title="클릭하여 등급 변경"
                      >
                        {ROLE_LABELS[m.role]} <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {m.matched ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs"><UserCheck className="w-3 h-3" />완료</span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-xs"><UserX className="w-3 h-3" />미연결</span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-600">{m.dept}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-400">{m.joined}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-[#2E7D32] hover:underline">편집</button>
                      <button className="text-xs text-red-500 hover:underline">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">검색 결과가 없습니다.</div>
        )}
      </div>

      {/* 등급 안내 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">회원 등급 안내 (7단계)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(ROLE_LABELS).map(([v, name]) => {
            const level = Number(v);
            const count = members.filter(m => m.role === level).length;
            return (
              <div key={v} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${ROLE_COLORS[level]}`}>{v}</span>
                <span className="text-xs font-medium text-gray-700">{name}</span>
                <span className="text-[11px] text-gray-400">{count}명</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
