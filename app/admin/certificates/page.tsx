"use client";
import { useState, useEffect, useCallback } from "react";
import { Printer, Search, CheckCircle2, Clock } from "lucide-react";

const CERT_TYPES = ["등록 증명서", "세례 증명서", "봉사 확인서", "출석 확인서"];

interface CertRequest {
  id: number;
  memberName: string;
  memberEmail: string;
  type: string;
  purpose: string;
  requestedAt: string;
  status: "pending" | "approved";
  issuedAt: string | null;
  approvedBy: string | null;
}

export default function CertificatesPage() {
  const [tab, setTab]             = useState<"issued" | "pending">("pending");
  const [requests, setRequests]   = useState<CertRequest[]>([]);
  const [search, setSearch]       = useState("");
  const [approving, setApproving] = useState<number | null>(null);
  const [printTarget, setPrintTarget] = useState<CertRequest | null>(null);

  const loadRequests = useCallback(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setRequests(data))
      .catch(() => {});
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const pending  = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const current  = tab === "pending" ? pending : approved;

  const filtered = current.filter(
    (r) => !search || r.memberName.includes(search) || r.type.includes(search)
  );

  async function handleApprove(id: number) {
    setApproving(id);
    const res = await fetch("/api/certificates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setApproving(null);
    if (res.ok) {
      loadRequests();
    } else {
      const j = await res.json();
      alert(j.error || "승인 중 오류가 발생했습니다.");
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">증명서 관리</h1>
        <p className="text-gray-500 text-sm mt-0.5">등록·세례·봉사·출석 증명서 확인 및 발급 이력</p>
      </div>

      {/* 증명서 종류 안내 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CERT_TYPES.map((type) => (
          <div key={type} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl mb-2">📜</div>
            <p className="text-sm font-medium text-gray-700">{type}</p>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "pending" ? "bg-white text-[#1a2744] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Clock className="w-4 h-4" />
          증명서 확인
          {pending.length > 0 && (
            <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{pending.length}</span>
          )}
        </button>
        <button
          onClick={() => setTab("issued")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "issued" ? "bg-white text-[#1a2744] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          발급 이력
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
            placeholder="이름·증명서 종류 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
      </div>

      {/* 목록 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">
            {tab === "pending" ? `승인 대기 중 (${pending.length}건)` : `발급 이력 (${approved.length}건)`}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">성명</th>
                <th className="text-left px-5 py-3">증명서 종류</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">사용 목적</th>
                <th className="text-left px-5 py-3">{tab === "pending" ? "신청일" : "발급일"}</th>
                <th className="text-left px-5 py-3">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] font-bold text-xs shrink-0">
                        {r.memberName[0]}
                      </div>
                      <span className="font-medium text-gray-900">{r.memberName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{r.type}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-600 text-xs">{r.purpose || "-"}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {tab === "pending" ? r.requestedAt : (r.issuedAt || "-")}
                  </td>
                  <td className="px-5 py-3">
                    {tab === "pending" ? (
                      <button
                        onClick={() => handleApprove(r.id)}
                        disabled={approving === r.id}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {approving === r.id ? "처리 중..." : "승인 발급"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setPrintTarget(r)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2E7D32] transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" /> 출력
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            {tab === "pending" ? "승인 대기 중인 신청이 없습니다." : "발급 이력이 없습니다."}
          </div>
        )}
      </div>

      {/* 증명서 출력 모달 */}
      {printTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-900">증명서 미리보기</h3>
              <button onClick={() => setPrintTarget(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-8">
              <div className="border-4 border-[#1a2744] rounded-2xl p-8 space-y-6">
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-400 tracking-widest">일광교회</p>
                  <h1 className="text-3xl font-black text-[#1a2744] tracking-wider">{printTarget.type}</h1>
                  <div className="w-16 h-1 bg-[#2E7D32] mx-auto mt-2" />
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-4 border-b border-gray-100 pb-3">
                    <span className="w-24 text-gray-500 shrink-0">성명</span>
                    <span className="font-bold text-gray-900">{printTarget.memberName}</span>
                  </div>
                  <div className="flex gap-4 border-b border-gray-100 pb-3">
                    <span className="w-24 text-gray-500 shrink-0">증명서 종류</span>
                    <span className="font-medium text-gray-900">{printTarget.type}</span>
                  </div>
                  {printTarget.purpose && (
                    <div className="flex gap-4 border-b border-gray-100 pb-3">
                      <span className="w-24 text-gray-500 shrink-0">사용 목적</span>
                      <span className="text-gray-900">{printTarget.purpose}</span>
                    </div>
                  )}
                  <div className="flex gap-4 border-b border-gray-100 pb-3">
                    <span className="w-24 text-gray-500 shrink-0">발급일</span>
                    <span className="font-medium text-gray-900">{printTarget.issuedAt || today}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-24 text-gray-500 shrink-0">발급기관</span>
                    <span className="font-medium text-gray-900">일광교회</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center pt-2 leading-relaxed">
                  위 사항은 교회 등록 정보에 의하여 틀림없음을 증명합니다.
                </p>
                <div className="text-center space-y-1 pt-2">
                  <p className="text-sm text-gray-700">{printTarget.issuedAt || today}</p>
                  <p className="text-base font-bold text-[#1a2744]">일광교회 담임목사</p>
                  <div className="inline-flex mt-2 w-16 h-16 border-2 border-red-400 rounded-full items-center justify-center">
                    <span className="text-red-400 text-xs font-bold">직인</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button onClick={() => setPrintTarget(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">닫기</button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors"
              >
                <Printer className="w-4 h-4" /> 인쇄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
