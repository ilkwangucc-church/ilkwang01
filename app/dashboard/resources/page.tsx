"use client";
import { useState } from "react";
import { FolderOpen, FileText, Download, Search } from "lucide-react";

type TabType = "교육" | "나눔" | "설교자료";

const RESOURCES: Record<TabType, { title: string; type: string; size: string; date: string; downloads: number }[]> = {
  "교육": [
    { title: "2026년 성경통독 계획표",         type: "PDF", size: "1.2MB", date: "2026-01-02", downloads: 234 },
    { title: "새가족 교육 교재 (1~4주)",       type: "PDF", size: "3.5MB", date: "2026-02-10", downloads: 87 },
    { title: "제자훈련 교재 Vol.1",            type: "PDF", size: "5.1MB", date: "2026-01-15", downloads: 63 },
    { title: "소그룹 리더 가이드북",           type: "PDF", size: "2.8MB", date: "2025-12-20", downloads: 45 },
    { title: "어린이 성경공부 교재 (여름학교)", type: "PDF", size: "4.2MB", date: "2025-07-01", downloads: 112 },
  ],
  "나눔": [
    { title: "2026년 새해 나눔 카드",          type: "이미지", size: "850KB", date: "2026-01-01", downloads: 321 },
    { title: "부활절 축하 카드 템플릿",         type: "이미지", size: "1.1MB", date: "2026-03-20", downloads: 198 },
    { title: "소그룹 나눔 질문지 (3월)",        type: "PDF",   size: "320KB", date: "2026-03-01", downloads: 76 },
    { title: "교회 로고 및 브랜드 에셋",        type: "ZIP",   size: "12MB", date: "2025-11-01", downloads: 34 },
  ],
  "설교자료": [
    { title: "2026년 교회 표어 및 주제말씀",    type: "PDF",   size: "450KB", date: "2026-01-05", downloads: 156 },
    { title: "사순절 묵상집 2026",             type: "PDF",   size: "2.3MB", date: "2026-02-14", downloads: 203 },
    { title: "부흥성회 주제 자료",             type: "PDF",   size: "1.8MB", date: "2026-04-01", downloads: 89 },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  "PDF":   "bg-red-50 text-red-600",
  "이미지": "bg-blue-50 text-blue-600",
  "ZIP":   "bg-amber-50 text-amber-600",
};

export default function ResourcesPage() {
  const [tab, setTab] = useState<TabType>("교육");
  const [query, setQuery] = useState("");

  const list = RESOURCES[tab].filter(r => r.title.includes(query));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-[#2E7D32]" /> 자료실
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">교육·나눔·설교 자료를 다운로드하세요</p>
      </div>

      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="자료 이름 검색..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
        />
      </div>

      {/* 탭 */}
      <div className="flex gap-2">
        {(["교육", "나눔", "설교자료"] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-[#2E7D32] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {list.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">자료가 없습니다.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {list.map((r, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TYPE_COLORS[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type}</span>
                    <span className="text-xs text-gray-400">{r.size}</span>
                    <span className="text-xs text-gray-400">{r.date}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-0.5">
                      <Download className="w-3 h-3" /> {r.downloads}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] rounded-lg text-xs font-medium hover:bg-[#C8E6C9] transition-colors opacity-0 group-hover:opacity-100">
                  <Download className="w-3 h-3" /> 다운로드
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
