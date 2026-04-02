"use client";
import { useState } from "react";
import { Plus, Printer, Search } from "lucide-react";

const CERT_TYPES = ["등록 증명서", "세례 증명서", "혼인 증명서", "봉사 확인서", "출석 확인서"];

const ISSUED = [
  { id: 1, name: "김성도", type: "등록 증명서", purpose: "이사 신고용", issuedAt: "2025-03-28", issuer: "일광교회" },
  { id: 2, name: "이집사", type: "세례 증명서", purpose: "타교회 제출", issuedAt: "2025-03-20", issuer: "일광교회" },
  { id: 3, name: "박권사", type: "봉사 확인서", purpose: "사회복지 기관 제출", issuedAt: "2025-03-15", issuer: "일광교회" },
  { id: 4, name: "최성도", type: "출석 확인서", purpose: "학교 제출",   issuedAt: "2025-03-10", issuer: "일광교회" },
];

export default function CertificatesPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [certType, setCertType] = useState(CERT_TYPES[0]);
  const [memberName, setMemberName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [issued, setIssued] = useState(ISSUED);

  const filtered = issued.filter((c) =>
    !search || c.name.includes(search) || c.type.includes(search)
  );

  function handleIssue() {
    if (!memberName.trim()) { alert("성명을 입력해주세요."); return; }
    setIssued(prev => [{
      id: Date.now(),
      name: memberName,
      type: certType,
      purpose,
      issuedAt: issueDate,
      issuer: "일광교회",
    }, ...prev]);
    setShowModal(false);
    setMemberName("");
    setPurpose("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">증명서 발급</h1>
          <p className="text-gray-500 text-sm mt-0.5">등록·세례·봉사·출석 증명서 발급 및 이력 관리</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" /> 증명서 발급
        </button>
      </div>

      {/* 증명서 종류 안내 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CERT_TYPES.map((type) => (
          <div key={type} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl mb-2">📜</div>
            <p className="text-sm font-medium text-gray-700">{type}</p>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름·증명서 종류 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
      </div>

      {/* 발급 이력 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">발급 이력</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">성명</th>
                <th className="text-left px-5 py-3">증명서 종류</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">사용 목적</th>
                <th className="text-left px-5 py-3">발급일</th>
                <th className="text-left px-5 py-3">출력</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] font-bold text-xs shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="font-medium text-gray-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{c.type}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-600 text-xs">{c.purpose}</td>
                  <td className="px-5 py-3 text-gray-500">{c.issuedAt}</td>
                  <td className="px-5 py-3">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2E7D32] transition-colors">
                      <Printer className="w-3.5 h-3.5" /> 출력
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">발급 이력이 없습니다.</div>
        )}
      </div>

      {/* 발급 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">증명서 발급</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">증명서 종류 *</label>
                <select value={certType} onChange={(e) => setCertType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30">
                  {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">성명 *</label>
                <input value={memberName} onChange={(e) => setMemberName(e.target.value)}
                  placeholder="교인 성명 입력"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">발급일</label>
                <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">사용 목적</label>
                <input value={purpose} onChange={(e) => setPurpose(e.target.value)}
                  placeholder="예: 타교회 제출, 이사 신고용"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">취소</button>
              <button onClick={handleIssue} className="px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors">
                발급 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
