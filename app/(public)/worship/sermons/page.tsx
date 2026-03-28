import { Metadata } from "next";
import { fetchChannelVideos, ytEmbed, YT_CHANNEL_URL } from "@/lib/youtube";
import SermonCard from "./SermonCard";

export const metadata: Metadata = {
  title: "설교영상 | 일광교회",
  description: "일광교회 설교 영상 아카이브 — 유튜브 채널 @ilkwangucc",
};

// ISR: 30분마다 자동 갱신
export const revalidate = 1800;

export default async function SermonsPage() {
  const videos = await fetchChannelVideos();
  const latest = videos[0];

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* 헤더 */}
      <section className="bg-[#1a2744] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-green-300 text-sm mb-3 tracking-widest uppercase">Sermons</p>
          <h1 className="text-4xl font-black mb-4">설교영상</h1>
          <p className="text-gray-300 text-lg">
            하나님의 말씀, 언제 어디서나 다시 들을 수 있습니다
          </p>
          <a
            href={YT_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#2E7D32] text-white rounded font-bold hover:bg-[#1B5E20] transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            유튜브 채널 구독
          </a>
        </div>
      </section>

      {/* 최신 영상 하이라이트 */}
      {latest && (
        <section className="py-12 bg-white border-b">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-widest mb-4 text-center">
              최신 설교 · 소리 없이 자동 재생
            </p>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
              <iframe
                src={ytEmbed(latest.id, { autoplay: true, mute: true, loop: true, controls: true })}
                title={latest.title}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="mt-4 text-xl font-black text-[#1a2744] text-center">
              {latest.title}
            </h2>
          </div>
        </section>
      )}

      {/* 전체 영상 목록 */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-[#1a2744] mb-8">
            전체 설교 목록
            <span className="ml-2 text-sm font-normal text-gray-400">({videos.length}편)</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((v) => (
              <SermonCard key={v.id} video={v} />
            ))}
          </div>

          {/* 유튜브 더보기 */}
          <div className="text-center mt-12">
            <a
              href={YT_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#2E7D32] text-[#2E7D32] rounded font-bold hover:bg-[#2E7D32] hover:text-white transition-colors"
            >
              유튜브에서 더보기 →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
