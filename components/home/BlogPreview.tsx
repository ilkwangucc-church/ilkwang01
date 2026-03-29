import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchChannelVideos, ytWatch } from "@/lib/youtube";

export default async function BlogPreview() {
  const videos = await fetchChannelVideos();
  // 첫 번째는 LatestSermon에서 사용 → 2~4번째 영상 표시
  const latest3 = videos.slice(1, 4);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            RECENT SERMONS
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1a2744] mb-4">
            최근 설교 말씀
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            담임목사님의 최신 설교 말씀을 통해 하나님의 은혜를 경험하세요.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest3.map((v) => (
            <a
              key={v.id}
              href={ytWatch(v.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video overflow-hidden relative bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-[#2E7D32]/90 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#2E7D32] text-[11px] font-bold uppercase tracking-widest mb-2">
                  주일 설교 · {v.publishedAt.slice(0, 10).replace(/-/g, ".")}
                </p>
                <h3 className="text-base font-black text-[#1a2744] mb-4 line-clamp-2 group-hover:text-[#2E7D32] transition-colors">
                  {v.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2E7D32]">
                  말씀 듣기 <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/worship/sermons"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2E7D32] text-white font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors tracking-wide"
          >
            전체 설교 목록 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
