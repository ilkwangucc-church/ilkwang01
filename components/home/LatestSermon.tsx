import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchSermonVideos, ytWatch, YT_CHANNEL_URL } from "@/lib/youtube";
import SermonStreamPlayer from "./SermonStreamPlayer";

// ISR: 30분마다 자동 갱신 (매주 새 영상 자동 반영)
export const revalidate = 1800;

export default async function LatestSermon() {
  const videos = await fetchSermonVideos(); // 라이브 제외 일반 설교 영상만
  const latest = videos[0];

  // 등록된 영상이 없으면 렌더링 안 함
  if (!latest) return null;

  return (
    <section className="relative z-10 -mt-16">
      <div className="max-w-6xl mx-auto px-[10px] sm:px-0">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row">
          {/* ── 영상: 처음부터 자동재생(음소거) ── */}
          <div className="sm:w-[580px] shrink-0 relative overflow-hidden self-stretch min-h-[200px] sm:min-h-[326px]">
            <SermonStreamPlayer videoId={latest.id} startSec={0} endSec={5400} />
          </div>

          {/* ── 정보 (오른쪽) ── */}
          <div className="flex-1 px-5 sm:pl-6 sm:pr-8 py-6 sm:py-8 flex flex-col justify-center">
            <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.18em] mb-2">
              최신 설교 · 소리 없이 재생 중
            </p>
            <h2 className="text-xl font-black text-[#1a2744] mb-2 line-clamp-2">
              {latest.title}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              매주 일요일 오전 9:30 · 11:00<br />
              일광교회 유튜브 채널에서 생중계됩니다
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={ytWatch(latest.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E7D32] text-white font-bold text-sm rounded-[26px] hover:bg-[#1B5E20] transition-colors"
              >
                유튜브에서 시청 <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/worship/sermons"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a2744] hover:text-[#2E7D32] transition-colors"
              >
                설교 목록 전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-gray-400">
              <a
                href={YT_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2E7D32] transition-colors"
              >
                ▶ 유튜브 채널 구독하기 @ilkwangucc
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
