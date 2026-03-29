"use client";
import { useState } from "react";
import { X, Download, FileText } from "lucide-react";

/* ── 주보 데이터 타입 ─────────────────────────────────────
   실제 운영 시 /public/bulletins/ 폴더에
   YYYY-MM-DD-1.jpg (앞면), YYYY-MM-DD-2.jpg (뒷면), YYYY-MM-DD.hwp 저장
──────────────────────────────────────────────────────── */
type Bulletin = {
  id: number;
  date: string;        // "2026-03-29"
  highlights: string[]; // 주요 사항
  front: string;       // 앞면 이미지 경로
  back: string;        // 뒷면 이미지 경로
  hwp?: string;        // HWP 다운로드 경로
};

const bulletins: Bulletin[] = [
  {
    id: 1,
    date: "2026-03-29",
    highlights: [
      "설교: 「하나님의 은혜」 (에베소서 2:8-9) — 신점일 목사",
      "부활주일 예배 안내 (4월 5일 오전 9:30 · 11:00)",
      "청년부 봄 수련회 신청 마감 (4월 7일까지)",
    ],
    front: "/bulletins/2026-03-29-1.jpg",
    back:  "/bulletins/2026-03-29-2.jpg",
    hwp:   "/bulletins/2026-03-29.hwp",
  },
  {
    id: 2,
    date: "2026-03-22",
    highlights: [
      "설교: 「생명의 말씀」 (요한복음 6:63) — 신점일 목사",
      "고난주간 특별새벽기도회 (3월 30일 ~ 4월 4일, 오전 5:30)",
      "어린이 주일학교 부활절 달걀 봉사 모집 (접수 중)",
    ],
    front: "/bulletins/2026-03-22-1.jpg",
    back:  "/bulletins/2026-03-22-2.jpg",
    hwp:   "/bulletins/2026-03-22.hwp",
  },
  {
    id: 3,
    date: "2026-03-15",
    highlights: [
      "설교: 「지혜로운 마음」 (시편 90:1-17) — 신점일 목사",
      "2026년 정기 공동의회 결과 보고",
      "소그룹 성경공부 신청 접수 (3월 22일까지)",
    ],
    front: "/bulletins/2026-03-15-1.jpg",
    back:  "/bulletins/2026-03-15-2.jpg",
    hwp:   "/bulletins/2026-03-15.hwp",
  },
  {
    id: 4,
    date: "2026-03-08",
    highlights: [
      "설교: 「믿음의 기도」 (야고보서 5:13-16) — 신점일 목사",
      "3·1절 기념 특별예배 감사 인사",
      "구역 성경공부 교재 배부 안내",
    ],
    front: "/bulletins/2026-03-08-1.jpg",
    back:  "/bulletins/2026-03-08-2.jpg",
    hwp:   "/bulletins/2026-03-08.hwp",
  },
  {
    id: 5,
    date: "2026-03-01",
    highlights: [
      "설교: 「자유를 향한 부르심」 (갈라디아서 5:1) — 신점일 목사",
      "3·1절 기념 특별예배 (3월 1일 오전 11:00)",
      "2025년 연간 결산 보고서 배부",
    ],
    front: "/bulletins/2026-03-01-1.jpg",
    back:  "/bulletins/2026-03-01-2.jpg",
    hwp:   "/bulletins/2026-03-01.hwp",
  },
];

/* 날짜 포맷 */
const fmt = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
};

/* 이미지 로드 실패 시 회색 placeholder SVG */
const PLACEHOLDER = (label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" fill="%23f3f4f6">
      <rect width="595" height="842"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="%23d1d5db" font-size="20" font-family="sans-serif">${label}</text>
    </svg>`
  )}`;

export default function BulletinViewer() {
  const [selected, setSelected] = useState<Bulletin | null>(null);

  return (
    <>
      {/* ── 주보 목록 ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* 목록 헤더 */}
          <div className="hidden sm:grid sm:grid-cols-[160px_1fr_100px] bg-[#1a2744] px-6 py-3 text-xs font-bold text-white/70 uppercase tracking-wider">
            <div>날짜</div>
            <div>주요 내용</div>
            <div className="text-center">HWP</div>
          </div>

          {bulletins.map((b, idx) => (
            <div
              key={b.id}
              onClick={() => setSelected(b)}
              className={`flex flex-col sm:grid sm:grid-cols-[160px_1fr_100px] items-start px-6 py-5 cursor-pointer transition-colors hover:bg-[#F1F8E9] group ${idx < bulletins.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              {/* 날짜 */}
              <div className="mb-2 sm:mb-0 shrink-0">
                <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {fmt(b.date)}
                </span>
              </div>

              {/* 주요 사항 */}
              <div className="space-y-1.5">
                {b.highlights.map((h, i) => (
                  <p key={i} className="text-sm text-gray-600 flex items-start gap-2 leading-snug">
                    <span className="text-[#2E7D32] mt-0.5 shrink-0 text-xs">▸</span>
                    <span className="group-hover:text-gray-800 transition-colors">{h}</span>
                  </p>
                ))}
              </div>

              {/* HWP 다운로드 */}
              <div
                className="mt-3 sm:mt-0 self-center flex items-center justify-center shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {b.hwp && (
                  <a
                    href={b.hwp}
                    download
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#2E7D32] font-semibold transition-colors py-1.5 px-3 rounded-lg hover:bg-[#E8F5E9]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    다운로드
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          * 주보를 클릭하면 앞·뒷면을 확인할 수 있습니다. HWP 파일은 한글 뷰어로 열어주세요.
        </p>
      </div>

      {/* ── 주보 모달 ── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-[1400px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a2744]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#6dbf73]" />
                <div>
                  <p className="text-[#6dbf73] text-[11px] font-bold uppercase tracking-[0.2em]">
                    일광교회 주보
                  </p>
                  <h2 className="text-white font-black text-lg leading-tight">
                    {fmt(selected.date)} 주보
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.hwp && (
                  <a
                    href={selected.hwp}
                    download
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    HWP 다운로드
                  </a>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 주보 이미지 — 앞·뒷면 */}
            <div className="bg-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">

                {/* 1면 (앞) */}
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="bg-[#E8F5E9] px-4 py-2 text-center">
                    <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest">
                      1면 · 앞
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.front}
                    alt={`${fmt(selected.date)} 주보 1면`}
                    className="w-full h-auto block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER("주보 1면");
                    }}
                  />
                </div>

                {/* 2면 (뒤) */}
                <div className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="bg-[#E8F5E9] px-4 py-2 text-center">
                    <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest">
                      2면 · 뒤
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.back}
                    alt={`${fmt(selected.date)} 주보 2면`}
                    className="w-full h-auto block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER("주보 2면");
                    }}
                  />
                </div>

              </div>
            </div>

            {/* 모달 하단 */}
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
              <p className="text-xs text-gray-400">
                이미지를 길게 누르거나 우클릭하여 저장할 수 있습니다.
              </p>
              {selected.hwp && (
                <a
                  href={selected.hwp}
                  download
                  className="sm:hidden flex items-center gap-1.5 text-sm font-semibold text-[#2E7D32] hover:underline"
                >
                  <Download className="w-4 h-4" />
                  HWP 다운로드
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
