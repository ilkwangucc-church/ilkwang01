import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchSermonVideos } from "@/lib/youtube";
import BlogVideoCard from "./BlogVideoCard";

export default async function BlogPreview() {
  const videos = await fetchSermonVideos(); // 라이브 스트리밍 제외
  // 첫 번째는 LatestSermon에서 사용 → 2~5번째 영상 표시
  const latest3 = videos.slice(1, 5);

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            RECENT SERMONS
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1a2744] mb-4">
            최근 설교 말씀
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            담임목사님의 최신 설교 말씀을 통해 하나님의 은혜를 경험하세요.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
          {latest3.map((v) => (
            <BlogVideoCard key={v.id} v={v} />
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
