"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { YTVideo } from "@/lib/youtube";
import { ytEmbed } from "@/lib/youtube";

export default function SermonCard({ video }: { video: YTVideo }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      {/* 썸네일 / 플레이어 */}
      <div className="relative aspect-video bg-black">
        {playing ? (
          <>
            <iframe
              src={ytEmbed(video.id, { autoplay: true, controls: true })}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="닫기"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full"
            aria-label={`${video.title} 재생`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#2E7D32]/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 정보 */}
      <div className="p-4">
        <span className="inline-block text-xs px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full mb-2">
          주일예배
        </span>
        <h3 className="font-bold text-[#1a2744] mb-2 line-clamp-2 group-hover:text-[#2E7D32] transition-colors text-sm">
          {video.title}
        </h3>
        <div className="flex items-center text-xs text-gray-400">
          <span>{video.publishedAt.slice(0, 10).replace(/-/g, ".")}</span>
        </div>
      </div>
    </div>
  );
}
