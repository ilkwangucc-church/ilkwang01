"use client";
import { useEffect, useRef } from "react";

type YTPlayer = {
  getCurrentTime: () => number;
  seekTo: (s: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    YT: { Player: new (el: HTMLElement | string, o: object) => YTPlayer; loaded?: number };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function SermonStreamPlayer({
  videoId,
  startSec = 2100,   // 35:00
  endSec   = 3900,   // 1:05:00
}: {
  videoId: string;
  startSec?: number;
  endSec?: number;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    /* 구간 감시 타이머 */
    const startLoop = (p: YTPlayer) => {
      timerRef.current = setInterval(() => {
        try {
          const t = p.getCurrentTime();
          if (t >= endSec || t < startSec - 3) {
            p.seekTo(startSec, true);
          }
        } catch { /* ignore */ }
      }, 500);
    };

    const initPlayer = () => {
      if (!innerRef.current) return;
      playerRef.current = new window.YT.Player(innerRef.current, {
        videoId,
        playerVars: {
          autoplay:       1,
          mute:           1,
          controls:       1,
          modestbranding: 1,
          rel:            0,
          playsinline:    1,
          start:          startSec,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.seekTo(startSec, true);
            e.target.playVideo();
            startLoop(e.target);
          },
        },
      });
    };

    if (window.YT?.loaded) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); initPlayer(); };
      if (!document.getElementById("yt-iframe-api")) {
        const s = Object.assign(document.createElement("script"), {
          id:  "yt-iframe-api",
          src: "https://www.youtube.com/iframe_api",
        });
        document.head.appendChild(s);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
    };
  }, [videoId, startSec, endSec]);

  return (
    <>
      {/* 16:9 크롭 유지 — iframe 외부로 나가지 않게 overflow:hidden 부모가 처리 */}
      <div
        className="absolute"
        style={{
          width: "177.78%",
          height: "100%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div ref={innerRef} style={{ width: "100%", height: "100%" }} />
      </div>
      {/* YouTube 호버 UI 차단 */}
      <div className="absolute inset-0 z-10" />
    </>
  );
}
