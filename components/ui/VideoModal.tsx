"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { ytEmbed } from "@/lib/youtube";

interface Props {
  videoId: string;
  title?: string;
  onClose: () => void;
}

export default function VideoModal({ videoId, title, onClose }: Props) {
  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* 영상 제목 */}
        {title && (
          <p className="text-white/80 text-sm mb-3 line-clamp-1 pr-12">{title}</p>
        )}

        {/* iframe */}
        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
          <iframe
            src={ytEmbed(videoId, { autoplay: true, controls: true })}
            title={title ?? "영상"}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
