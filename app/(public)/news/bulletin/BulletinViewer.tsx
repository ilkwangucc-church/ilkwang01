"use client";
import { useState, useEffect } from "react";
import { X, Download, FileText, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

type Bulletin = {
  id: number;
  date: string;
  highlights: string[];
  front: string;
  back: string;
  file?: string;
  fileType?: string;
};

const fmt = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
};

const fileLabel = (type?: string) => (type ? type.toUpperCase() : "다운로드");

/* placeholder — 378:212 가로형 비율 */
const PLACEHOLDER = (label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 378 212" fill="%23f3f4f6">
      <rect width="378" height="212"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="%23d1d5db" font-size="14" font-family="sans-serif">${label}</text>
    </svg>`
  )}`;

export default function BulletinViewer() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [selected, setSelected]   = useState<Bulletin | null>(null);
  const [loading, setLoading]     = useState(true);
  const [zoom, setZoom]           = useState(1);

  useEffect(() => {
    fetch("/api/bulletins")
      .then((r) => r.json())
      .then((data) => { setBulletins(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function openModal(b: Bulletin) {
    setSelected(b);
    setZoom(1);
  }

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center text-gray-400">
        불러오는 중…
      </div>
    );
  }

  return (
    <>
      {/* ── 주보 목록 ── */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-[160px_1fr_120px] bg-[#1a2744] px-6 py-3 text-xs font-bold text-white/70 uppercase tracking-wider">
            <div>날짜</div>
            <div>주요 내용</div>
            <div className="text-center">문서</div>
          </div>

          {bulletins.length === 0 && (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              등록된 주보가 없습니다.
            </div>
          )}

          {bulletins.map((b, idx) => (
            <div
              key={b.id}
              onClick={() => openModal(b)}
              className={`flex flex-col sm:grid sm:grid-cols-[160px_1fr_120px] items-start px-6 py-5 cursor-pointer transition-colors hover:bg-[#F1F8E9] group ${idx < bulletins.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="mb-2 sm:mb-0 shrink-0">
                <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {fmt(b.date)}
                </span>
              </div>
              <div className="space-y-1.5">
                {b.highlights.map((h, i) => (
                  <p key={i} className="text-sm text-gray-600 flex items-start gap-2 leading-snug">
                    <span className="text-[#2E7D32] mt-0.5 shrink-0 text-xs">▸</span>
                    <span className="group-hover:text-gray-800 transition-colors">{h}</span>
                  </p>
                ))}
              </div>
              <div
                className="mt-3 sm:mt-0 self-center flex items-center justify-center shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {b.file && (
                  <a
                    href={b.file}
                    download
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#2E7D32] font-semibold transition-colors py-1.5 px-3 rounded-lg hover:bg-[#E8F5E9]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {fileLabel(b.fileType)}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          * 주보를 클릭하면 앞·뒷면을 확인할 수 있습니다.
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
                  <p className="text-[#6dbf73] text-[11px] font-bold uppercase tracking-[0.2em]">일광교회 주보</p>
                  <h2 className="text-white font-black text-lg leading-tight">{fmt(selected.date)} 주보</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.file && (
                  <a
                    href={selected.file}
                    download
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {fileLabel(selected.fileType)} 다운로드
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

            {/* 돋보기 컨트롤 */}
            <div className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100">
              <button
                onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                disabled={zoom <= 0.5}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" /> 축소
              </button>
              <span className="text-sm font-bold text-gray-700 min-w-[52px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))}
                disabled={zoom >= 4}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" /> 확대
              </button>
              <button
                onClick={() => setZoom(1)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 원래 크기
              </button>
            </div>

            {/* 주보 이미지 — 앞·뒷면 (가로 378:212 비율) */}
            <div className="bg-gray-100 p-6 overflow-auto" style={{ maxHeight: "75vh" }}>
              {/* zoom > 1 이면 minWidth 를 넓혀 스크롤 가능하게 */}
              <div style={{ minWidth: zoom > 1 ? `${zoom * 100}%` : "100%" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">

                  {/* 1면 (앞) */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-md">
                    <div className="bg-[#E8F5E9] px-4 py-2 text-center">
                      <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest">1면 · 앞</span>
                    </div>
                    {/* 378:212 가로형 비율 — padding-top trick */}
                    <div className="relative w-full" style={{ paddingTop: `${(212 / 378) * 100}%` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selected.front || PLACEHOLDER("주보 1면")}
                        alt={`${fmt(selected.date)} 주보 1면`}
                        className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER("주보 1면"); }}
                      />
                    </div>
                  </div>

                  {/* 2면 (뒤) */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-md">
                    <div className="bg-[#E8F5E9] px-4 py-2 text-center">
                      <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest">2면 · 뒤</span>
                    </div>
                    <div className="relative w-full" style={{ paddingTop: `${(212 / 378) * 100}%` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selected.back || PLACEHOLDER("주보 2면")}
                        alt={`${fmt(selected.date)} 주보 2면`}
                        className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER("주보 2면"); }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 모달 하단 */}
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
              <p className="text-xs text-gray-400">이미지를 길게 누르거나 우클릭하여 저장할 수 있습니다.</p>
              {selected.file && (
                <a
                  href={selected.file}
                  download
                  className="sm:hidden flex items-center gap-1.5 text-sm font-semibold text-[#2E7D32] hover:underline"
                >
                  <Download className="w-4 h-4" />
                  {fileLabel(selected.fileType)} 다운로드
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
