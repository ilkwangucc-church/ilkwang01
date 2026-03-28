import Link from "next/link";
import { Play, Video } from "lucide-react";

// 최신 설교 - 추후 YouTube API 또는 DB에서 동적으로 가져옴
const YOUTUBE_CHANNEL = "ilwangucc";
const LATEST_VIDEO_ID = "dQw4w9WgXcQ"; // 실제 최신 영상 ID로 교체 필요

export default function LatestSermon() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <p className="text-[#2E7D32] text-sm font-nanum-bold tracking-widest uppercase mb-2">Latest Sermon</p>
          <h2 className="font-nanum-extrabold text-3xl md:text-4xl text-gray-800 mb-3">최신 설교 영상</h2>
          <div className="w-12 h-1 bg-[#F9A825] mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* 유튜브 임베드 */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900 group cursor-pointer">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${LATEST_VIDEO_ID}?rel=0&modestbranding=1`}
              title="일광교회 최신 설교"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* 설교 정보 */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-nanum-bold rounded-full mb-3">
                주일예배 설교
              </span>
              <h3 className="font-nanum-extrabold text-2xl text-gray-800 leading-tight mb-2">
                바닥에서도 시작되는 하나님의 스토리
              </h3>
              <p className="text-[#2E7D32] font-nanum-bold mb-1">창세기 39:1-6</p>
              <p className="text-gray-500 text-sm">2025년 12월 7일 · 신점일 목사</p>
            </div>

            <p className="text-gray-600 leading-relaxed">
              요셉이 형들에게 팔려 애굽으로 내려갔을 때, 그는 인간적으로 가장 낮은 바닥에 있었습니다.
              그러나 하나님께서는 그 바닥에서도 역사하셨습니다. 우리의 삶 가운데 가장 어려운 순간에도
              하나님의 이야기는 계속됩니다.
            </p>

            <div className="flex gap-3">
              <a
                href={`https://www.youtube.com/@${YOUTUBE_CHANNEL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-nanum-bold rounded-full hover:bg-red-700 transition-colors text-sm"
              >
                <Video className="w-4 h-4" />
                유튜브 채널
              </a>
              <Link
                href="/worship/sermons"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2E7D32] text-[#2E7D32] font-nanum-bold rounded-full hover:bg-[#E8F5E9] transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                더 많은 영상
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
