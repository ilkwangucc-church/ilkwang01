"use client";
import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/adminAuth";

const CHURCH_MEMBERS = [
  { id: 1, name: "김성도", phone: "010-1234-5678", address: "서울 성북구", birthDate: "1975-05-10", baptismDate: "2000-04-15", group: "2부 예배", role: 2, notes: "" },
  { id: 2, name: "이집사", phone: "010-2345-6789", address: "서울 종로구", birthDate: "1968-09-22", baptismDate: "1998-06-01", group: "1부 예배", role: 3, notes: "찬양대 봉사" },
  { id: 3, name: "박장로", phone: "010-3456-7890", address: "서울 성북구", birthDate: "1955-02-14", baptismDate: "1985-01-01", group: "당회", role: 4, notes: "재정부서" },
  { id: 4, name: "최권사", phone: "010-4567-8901", address: "서울 도봉구", birthDate: "1963-11-30", baptismDate: "1992-09-15", group: "2부 예배", role: 3, notes: "" },
  { id: 5, name: "정성도", phone: "010-5678-9012", address: "서울 성북구", birthDate: "1990-07-08", baptismDate: "2018-04-01", group: "청년부", role: 2, notes: "" },
];

type Member = typeof CHURCH_MEMBERS[0];

export default function ChurchMembersPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState(CHURCH_MEMBERS);

  const filtered = members.filter((m) =>
    !search || m.name.includes(search) || m.phone.includes(search) || m.group.includes(search)
  );

  function openEdit(m: Member) {
    setSelectedMember(m);
    setShowModal(true);
  }

  function openNew() {
    setSelectedMember(null);
    setShowModal(true);
  }

  function handleDelete(id: number) {
    if (!confirm("이 교인을 삭제하시겠습니까?")) return;
    setMembers(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">교인 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">교적 명부 · 총 {members.length}명 등록</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" /> 교인 등록
        </button>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름·전화번호·부서 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
      </div>

      {/* 교인 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">이름</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">연락처</th>
                <th className="text-left px-5 py-3">등급</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">소속 부서</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">세례일</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">비고</th>
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
                        <p className="text-xs text-gray-400">{m.birthDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-600">{m.phone}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[m.role] || "bg-gray-100 text-gray-600"}`}>
                      {ROLE_LABELS[m.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-gray-600">{m.group}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-400">{m.baptismDate || "-"}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-400 text-xs">{m.notes || "-"}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#2E7D32] transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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

      {/* 등록/편집 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">{selectedMember ? "교인 정보 수정" : "새 교인 등록"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">이름 *</label>
                  <input defaultValue={selectedMember?.name} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">연락처</label>
                  <input defaultValue={selectedMember?.phone} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">생년월일</label>
                  <input type="date" defaultValue={selectedMember?.birthDate} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">세례일</label>
                  <input type="date" defaultValue={selectedMember?.baptismDate} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">등급</label>
                  <select defaultValue={selectedMember?.role} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30">
                    {Object.entries(ROLE_LABELS).map(([v, label]) => (
                      <option key={v} value={v}>{v}. {label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">소속 부서</label>
                  <input defaultValue={selectedMember?.group} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">주소</label>
                <input defaultValue={selectedMember?.address} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">비고</label>
                <textarea defaultValue={selectedMember?.notes} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                취소
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors">
                {selectedMember ? "수정 완료" : "등록 완료"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
