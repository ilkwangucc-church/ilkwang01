// ISR: 1시간
export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Pin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { NEWS_NAV } from "@/components/ui/StickySubNav";

export const metadata: Metadata = {
  title: "교회소식",
  description: "일광교회 공지사항 및 교회 소식",
};

const notices = [
  { id: 1, title: "2025년 12월 성탄절 예배 및 행사 안내", date: "2025.12.01", category: "공지사항", pinned: true },
  { id: 2, title: "2025년 4분기 구역예배 일정 안내", date: "2025.11.20", category: "공지사항", pinned: true },
  { id: 3, title: "2025년 추수감사주일 헌신예배 안내", date: "2025.11.10", category: "행사안내", pinned: false },
  { id: 4, title: "교회 주차 안내 - 주일 주차 협조 요청", date: "2025.11.01", category: "공지사항", pinned: false },
  { id: 5, title: "2025년 겨울 성경학교 교사 모집", date: "2025.10.25", category: "모집", pinned: false },
  { id: 6, title: "일광교회 홈페이지 새단장 안내", date: "2025.10.15", category: "공지사항", pinned: false },
  { id: 7, title: "2025년 교회 운동회 행사 사진 모음", date: "2025.10.05", category: "행사안내", pinned: false },
  { id: 8, title: "10월 교역자 간담회 결과 공유", date: "2025.09.28", category: "공지사항", pinned: false },
];

const categoryColors: Record<string, string> = {
  "공지사항": "bg-blue-100 text-blue-700",
  "행사안내": "bg-green-100 text-green-700",
  "모집": "bg-yellow-100 text-yellow-700",
};

export default function NewsPage() {
  return (
    <div>
      <PageHero label="News" title="교회 소식" subtitle="일광교회의 소식과 공지사항을 전합니다" image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1800&auto=format&fit=crop&q=80" />

      <StickySubNav items={NEWS_NAV} />

      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {/* 헤더 — 모바일 숨김 */}
          <div className="hidden sm:grid grid-cols-12 bg-gray-50 border-b px-4 sm:px-6 py-3 text-xs font-nanum-bold text-gray-500">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-2 text-center">분류</div>
            <div className="col-span-6">제목</div>
            <div className="col-span-3 text-center">날짜</div>
          </div>

          {notices.map((n) => (
            <div key={n.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {/* 모바일 레이아웃 */}
              <div className="sm:hidden px-4 py-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-nanum-bold ${categoryColors[n.category] || "bg-gray-100 text-gray-600"}`}>
                    {n.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Calendar className="w-3 h-3" />{n.date}
                  </span>
                </div>
                <Link href={`/news/${n.id}`} className={`font-nanum-bold hover:text-[#2E7D32] transition-colors text-sm leading-snug break-keep ${n.pinned ? "text-gray-800" : "text-gray-700"}`}>
                  {n.pinned && <span className="text-[#FFC107] mr-1">[필독]</span>}
                  {n.title}
                </Link>
              </div>
              {/* 데스크탑 레이아웃 */}
              <div className="hidden sm:grid grid-cols-12 items-center px-6 py-4">
                <div className="col-span-1 text-center text-sm text-gray-400">
                  {n.pinned ? <Pin className="w-4 h-4 text-[#FFC107] mx-auto" /> : n.id}
                </div>
                <div className="col-span-2 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-nanum-bold ${categoryColors[n.category] || "bg-gray-100 text-gray-600"}`}>
                    {n.category}
                  </span>
                </div>
                <div className="col-span-6">
                  <Link href={`/news/${n.id}`} className={`font-nanum-bold hover:text-[#2E7D32] transition-colors ${n.pinned ? "text-gray-800" : "text-gray-700"}`}>
                    {n.pinned && <span className="text-[#FFC107] mr-1">[필독]</span>}
                    {n.title}
                  </Link>
                </div>
                <div className="col-span-3 flex items-center justify-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />{n.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center gap-1 mt-6 sm:mt-8">
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p} className={`w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-sm font-nanum-bold transition-colors ${p === 1 ? "bg-[#2E7D32] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
