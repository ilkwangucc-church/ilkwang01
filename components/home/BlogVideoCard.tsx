"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { YTVideo } from "@/lib/youtube";
import VideoModal from "@/components/ui/VideoModal";

export default function BlogVideoCard({ v }: { v: YTVideo }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group block w-full text-left rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
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
        <div className="p-4 sm:p-6">
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
      </button>

      {open && (
        <VideoModal videoId={v.id} title={v.title} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
