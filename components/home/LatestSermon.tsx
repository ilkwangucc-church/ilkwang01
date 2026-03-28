import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

export default function LatestSermon() {
  return (
    <section className="relative z-10 -mt-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="md:w-72 shrink-0 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&auto=format&fit=crop&q=80"
              alt="주일 예배"
              className="w-full h-52 md:h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1a2744]/40 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#2E7D32] flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.18em] mb-2">
              주일 예배 생중계
            </p>
            <h2 className="text-2xl font-black text-[#1a2744] mb-2">
              주일 예배에 함께하세요
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              매주 일요일 오전 9:30 · 11:00 — 일광교회 유튜브 채널에서 생중계됩니다
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://www.youtube.com/@ilkwangucc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E7D32] text-white font-bold text-sm rounded hover:bg-[#1B5E20] transition-colors"
              >
                유튜브 참여하기 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/worship/sermons"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a2744] hover:text-[#2E7D32] transition-colors"
              >
                설교 목록 보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
