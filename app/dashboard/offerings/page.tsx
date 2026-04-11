import { Metadata } from "next";
import Link from "next/link";
import { Plus, TrendingUp, DollarSign } from "lucide-react";

export const metadata: Metadata = { title: "헌금 현황 | 관리자" };

const monthly = [
  { month: "2024-03", total: 24500000, count: 87 },
  { month: "2024-02", total: 21800000, count: 79 },
  { month: "2024-01", total: 22300000, count: 83 },
];

const offerings = [
  { id: 1, name: "김성도", type: "십일조", amount: 500000, date: "2024-03-31", memo: "" },
  { id: 2, name: "익명", type: "감사헌금", amount: 100000, date: "2024-03-31", memo: "부활절 감사" },
  { id: 3, name: "이집사", type: "주일헌금", amount: 50000, date: "2024-03-31", memo: "" },
  { id: 4, name: "박권사", type: "십일조", amount: 300000, date: "2024-03-30", memo: "" },
  { id: 5, name: "최장로", type: "선교헌금", amount: 200000, date: "2024-03-29", memo: "필리핀 선교" },
];

const typeColors: Record<string, string> = {
  십일조: "bg-green-100 text-green-700",
  감사헌금: "bg-blue-100 text-blue-700",
  주일헌금: "bg-yellow-100 text-yellow-700",
  선교헌금: "bg-purple-100 text-purple-700",
};

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function OfferingsPage() {
  const thisMonth = monthly[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">헌금 현황</h1>
          <p className="text-gray-500 text-sm mt-0.5">온라인 헌금 입금 내역을 관리합니다</p>
        </div>
        <Link
          href="/dashboard/offerings/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors"
        >
          <Plus className="w-4 h-4" />
          입금 등록
        </Link>
      </div>

      {/* 월별 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {monthly.map((m) => (
          <div key={m.month} className={`bg-white rounded-xl p-5 shadow-sm border ${m.month === "2024-03" ? "border-[#2E7D32]" : "border-gray-100"}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{m.month}</p>
              {m.month === "2024-03" && <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full">이번달</span>}
            </div>
            <p className="text-xl font-bold text-gray-900">{formatKRW(m.total)}</p>
            <p className="text-xs text-gray-400 mt-1">{m.count}건 입금</p>
          </div>
        ))}
      </div>

      {/* 은행 계좌 안내 */}
      <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl p-5">
        <h3 className="font-semibold text-[#2E7D32] mb-3 text-sm">헌금 계좌 안내</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { bank: "국민은행", account: "000-000-000000", holder: "일광교회" },
            { bank: "우리은행", account: "111-111-111111", holder: "일광교회" },
          ].map((b) => (
            <div key={b.bank} className="bg-white rounded-lg px-4 py-3">
              <span className="font-bold text-gray-900">{b.bank}</span>
              <span className="text-gray-600 ml-2">{b.account}</span>
              <span className="text-gray-400 ml-2 text-xs">({b.holder})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 입금 내역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-semibold text-gray-900">최근 입금 내역</h2>
          <span className="text-sm text-gray-400">이번달 합계: <strong className="text-gray-900">{formatKRW(thisMonth.total)}</strong></span>
        </div>

        {/* 모바일 카드 뷰 */}
        <div className="sm:hidden divide-y divide-gray-50">
          {offerings.map((o) => (
            <div key={o.id} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 text-sm">{o.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[o.type] ?? "bg-gray-100 text-gray-600"}`}>{o.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{o.date}{o.memo ? ` · ${o.memo}` : ""}</span>
                <span className="font-semibold text-gray-900 text-sm">{formatKRW(o.amount)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 데스크탑 테이블 뷰 */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">이름</th>
                <th className="text-left px-6 py-3">종류</th>
                <th className="text-right px-6 py-3">금액</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">날짜</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">메모</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {offerings.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{o.name}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[o.type] ?? "bg-gray-100 text-gray-600"}`}>{o.type}</span>
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-gray-900">{formatKRW(o.amount)}</td>
                  <td className="px-6 py-3 hidden md:table-cell text-gray-500">{o.date}</td>
                  <td className="px-6 py-3 hidden md:table-cell text-gray-400">{o.memo || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
