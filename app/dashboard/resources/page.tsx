"use client";
import { useState } from "react";
import { FolderOpen, FileText, Download, Search, TrendingDown, Star, Clock } from "lucide-react";

type TabType = "교육" | "나눔" | "설교자료";

const RESOURCES: Record<TabType, { title: string; type: string; size: string; date: string; downloads: number; desc: string }[]> = {
  "교육": [
    { title: "2026년 성경통독 계획표",         type: "PDF", size: "1.2MB", date: "2026-01-02", downloads: 234, desc: "연간 성경 1독 완주를 위한 월별 통독 계획표입니다." },
    { title: "새가족 교육 교재 (1~4주)",       type: "PDF", size: "3.5MB", date: "2026-02-10", downloads: 87,  desc: "새가족을 위한 신앙 기초 및 교회 소개 교재 전 과정입니다." },
    { title: "제자훈련 교재 Vol.1",            type: "PDF", size: "5.1MB", date: "2026-01-15", downloads: 63,  desc: "제자훈련 12주 과정 첫 번째 교재입니다. 기도와 말씀을 중심으로 구성되었습니다." },
    { title: "소그룹 리더 가이드북",           type: "PDF", size: "2.8MB", date: "2025-12-20", downloads: 45,  desc: "소그룹 리더를 위한 실전 나눔 진행 가이드입니다." },
    { title: "어린이 성경공부 교재 (여름학교)", type: "PDF", size: "4.2MB", date: "2025-07-01", downloads: 112, desc: "여름 어린이 성경학교 교사 및 학생용 교재입니다." },
  ],
  "나눔": [
    { title: "2026년 새해 나눔 카드",          type: "이미지", size: "850KB", date: "2026-01-01", downloads: 321, desc: "새해를 맞아 성도들과 나눌 수 있는 말씀 카드입니다." },
    { title: "부활절 축하 카드 템플릿",         type: "이미지", size: "1.1MB", date: "2026-03-20", downloads: 198, desc: "부활절을 축하하는 디지털 카드 템플릿입니다." },
    { title: "소그룹 나눔 질문지 (3월)",        type: "PDF",   size: "320KB", date: "2026-03-01", downloads: 76,  desc: "3월 소그룹 모임에서 활용할 말씀 나눔 질문지입니다." },
    { title: "교회 로고 및 브랜드 에셋",        type: "ZIP",   size: "12MB",  date: "2025-11-01", downloads: 34,  desc: "일광교회 공식 로고, 색상, 폰트 등 브랜드 에셋 모음입니다." },
  ],
  "설교자료": [
    { title: "2026년 교회 표어 및 주제말씀",    type: "PDF",   size: "450KB", date: "2026-01-05", downloads: 156, desc: "2026년 일광교회 표어 '주와 함께, 세상을 향해'와 주제 말씀 자료입니다." },
    { title: "사순절 묵상집 2026",             type: "PDF",   size: "2.3MB", date: "2026-02-14", downloads: 203, desc: "40일 사순절 기간 동안 매일 묵상할 수 있는 말씀과 기도 자료입니다." },
    { title: "부흥성회 주제 자료",             type: "PDF",   size: "1.8MB", date: "2026-04-01", downloads: 89,  desc: "봄 부흥성회 설교 주제와 기도 제목, 말씀 자료입니다." },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  "PDF":   "bg-red-50 text-red-600",
  "이미지": "bg-blue-50 text-blue-600",
  "ZIP":   "bg-amber-50 text-amber-600",
};

const STATS = [
  { label: "전체 자료", value: "12개", icon: FolderOpen, color: "bg-green-50 text-green-600" },
  { label: "이번 달 다운로드", value: "1,204회", icon: Download, color: "bg-blue-50 text-blue-600" },
  { label: "최다 다운로드", value: "321회", icon: TrendingDown, color: "bg-purple-50 text-purple-600" },
  { label: "평균 평점", value: "4.8점", icon: Star, color: "bg-amber-50 text-amber-600" },
];

export default function ResourcesPage() {
  const [tab, setTab] = useState<TabType>("교육");
  const [query, setQuery] = useState("");

  const list = RESOURCES[tab].filter(r => r.title.includes(query));

  return (
    <div className="space-y-6">
      {/* 히어로 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80"
          alt="자료실"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-700/60" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
            <FolderOpen className="w-6 h-6" /> 자료실
          </h1>
          <p className="text-gray-300 text-sm">교육·나눔·설교 자료를 자유롭게 다운로드하세요</p>
        </div>
      </div>

      {/* 통계 4칸 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="font-bold text-gray-900 text-sm">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 검색 + 탭 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="자료 이름으로 검색..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {(["교육", "나눔", "설교자료"] as TabType[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === t ? "bg-[#2E7D32] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 자료 카드 그리드 */}
      {list.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center text-gray-400 text-sm">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {list.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#E8F5E9] transition-colors">
                  <FileText className="w-6 h-6 text-gray-500 group-hover:text-[#2E7D32] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TYPE_COLORS[r.type] || "bg-gray-100 text-gray-600"}`}>{r.type}</span>
                    <span className="text-xs text-gray-400">{r.size}</span>
                    <span className="flex items-center gap-0.5 text-xs text-gray-400">
                      <Download className="w-3 h-3" /> {r.downloads}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{r.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{r.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" /> {r.date}
                    </span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] rounded-lg text-xs font-medium hover:bg-[#C8E6C9] transition-colors">
                      <Download className="w-3 h-3" /> 다운로드
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 하단 안내 */}
      <div className="bg-[#E8F5E9] rounded-2xl border border-[#C8E6C9] p-5 flex items-start gap-4">
        <span className="text-2xl shrink-0">📋</span>
        <div>
          <p className="font-semibold text-[#2E7D32] mb-1">자료 등록 요청</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            필요한 자료가 없거나 등록을 원하시는 자료가 있으시면 교회 사무실 또는 상담신청을 통해 요청해 주세요.
            검토 후 빠르게 등록해 드리겠습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
