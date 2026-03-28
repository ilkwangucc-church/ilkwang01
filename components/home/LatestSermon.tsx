import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchChannelVideos, ytWatch, ytEmbed, YT_CHANNEL_URL } from "@/lib/youtube";

export default async function LatestSermon() {
  const videos = await fetchChannelVideos();
  const latest = videos[0];
  const videoId = latest?.id ?? "BVamVjzwBIo";
  const title = latest?.title ?? '2026.03.15. "지혜로운 마음" (시편 90편 1-17)';

  const embedSrc = ytEmbed(videoId, {
    autoplay: true,
    mute: true,
    loop: true,
    controls: true,
  });

  return (
    <section className="relative z-10 -mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row">
          {/* ── 영상: 카드 전체 높이 cover (여백 없음) ── */}
          <div className="sm:w-[420px] shrink-0 relative overflow-hidden self-stretch min-h-[236px]">
            <iframe
              src={embedSrc}
              title={title}
              className="absolute"
              style={{
                width: "177.78%",
                height: "100%",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* ── 정보 (오른쪽) ── */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.18em] mb-2">
              지난 주일 예배 · 소리 없이 재생 중
            </p>
            <h2 className="text-xl font-black text-[#1a2744] mb-2 line-clamp-2">
              {title}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              매주 일요일 오전 9:30 · 11:00<br />
              일광교회 유튜브 채널에서 생중계됩니다
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={ytWatch(videoId)}
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
