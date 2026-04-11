"use client";
import { useState, useEffect } from "react";

interface SermonVideo {
  id: string;
  title: string;
  publishedAt: string;
  year: number;
  duration: string;
  thumbnail: string;
}

export default function LatestSermonsSection() {
  const [sermons, setSermons] = useState<SermonVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ilkwang-sermons")
      .then((r) => r.json())
      .then((data: SermonVideo[]) => {
        if (!Array.isArray(data)) return;
        // 2026년 설교 우선, 없으면 최신 4편
        const y2026 = data.filter((s) => s.year >= 2026).slice(0, 4);
        setSermons(y2026.length > 0 ? y2026 : data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-4 sm:p-5 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sermons.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        최신 설교를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
      {sermons.map((s) => (
        <div
          key={s.id}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all group"
        >
          <div className="aspect-video bg-gray-900 relative">
            <img
              src={s.thumbnail}
              alt={s.title}
              className="w-full h-full object-cover"
            />
            <a
              href={`https://www.youtube.com/watch?v=${s.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
              aria-label={s.title}
            >
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </a>
            {s.duration && (
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                {s.duration}
              </span>
            )}
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="font-nanum-bold text-gray-800 leading-snug mb-2 break-keep line-clamp-2">
              {s.title}
            </h3>
            <div className="flex gap-3 text-sm text-gray-400">
              <span>{s.publishedAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
