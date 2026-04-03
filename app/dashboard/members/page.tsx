"use client";
import { useState } from "react";
import { Search, UserCheck, UserX, ChevronDown, X } from "lucide-react";
import { ROLE_LABELS, ROLE_LABELS_SELECT, ROLE_COLORS } from "@/lib/adminAuth";

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

interface NewMember {
  name: string;
  email: string;
  phone: string;
  role: number;
  dept: string;
}

const EMPTY_NEW: NewMember = { name: "", email: "", phone: "", role: 1, dept: "" };

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [members, setMembers] = useState(MEMBERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState<NewMember>(EMPTY_NEW);
  const [addError, setAddError] = useState("");

  const filtered = members.filter((m) => {
    const matchSearch = !search || m.name.includes(search) || m.email.includes(search) || m.phone.includes(search);
    const matchRole = roleFilter === 0 || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  function handleRoleChange(id: number, newRole: number) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    setEditId(null);
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newMember.name.trim()) { setAddError("이름을 입력해 주세요."); return; }
    if (!newMember.email.trim() && !newMember.phone.trim()) {
      setAddError("이메일 또는 휴대폰 번호 중 하나는 입력해야 합니다."); return;
    }
    const newId = Math.max(...members.map(m => m.id)) + 1;
    setMembers(prev => [...prev, {
      id: newId,
      name: newMember.name.trim(),
      email: newMember.email.trim() || "-",
      phone: newMember.phone.trim() || "-",
      role: newMember.role,
      dept: newMember.dept.trim() || "-",
      matched: false,
      joined: new Date().toISOString().slice(0, 10),
    }]);
    setNewMember(EMPTY_NEW);
    setAddError("");
    setShowAddModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">총 {members.length}명 · 6단계 등급 관리</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddError(""); setNewMember(EMPTY_NEW); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
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
          {Object.entries(ROLE_LABELS_SELECT).map(([v, label]) => (
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
                        {Object.entries(ROLE_LABELS_SELECT).map(([v, label]) => (
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
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">회원 등급 안내 (6단계)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(ROLE_LABELS_SELECT).map(([v, name]) => {
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

      {/* 회원 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">회원 추가</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {addError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{addError}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                  placeholder="홍길동"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-gray-400 text-xs">(이메일 또는 휴대폰 중 하나 필수)</span></label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
                  <select
                    value={newMember.role}
                    onChange={e => setNewMember(p => ({ ...p, role: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                  >
                    {Object.entries(ROLE_LABELS_SELECT).map(([v, label]) => (
                      <option key={v} value={v}>{v}단계 · {label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">부서 <span className="text-gray-400 text-xs">(선택)</span></label>
                  <input
                    type="text"
                    value={newMember.dept}
                    onChange={e => setNewMember(p => ({ ...p, dept: e.target.value }))}
                    placeholder="예: 청년부"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
                >
                  추가 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
