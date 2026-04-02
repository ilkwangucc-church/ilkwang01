"use client";
import { useEffect, useRef, useState } from "react";

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
  const innerRef  = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* 구간 감시 타이머 */
    /* 구간 감시 타이머 — 범위 벗어나면 시작점으로 이동 후 재생 */
    const startLoop = (p: YTPlayer) => {
      timerRef.current = setInterval(() => {
        try {
          const t = p.getCurrentTime();
          if (t >= endSec || t < startSec - 3) {
            p.seekTo(startSec, true);
            p.playVideo();
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
            setReady(true);
          },
          /* 일시정지(2)·종료(0) 감지 → 즉시 구간 시작점부터 재생 재개 */
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (e.data === 0 || e.data === 2) {
              setTimeout(() => {
                try {
                  e.target.seekTo(startSec, true);
                  e.target.playVideo();
                } catch { /* ignore */ }
              }, 200);
            }
          },
        },
      });
    };

    /* 탭 비활성 후 복귀 시 강제 재생 재개 */
    const handleVisibility = () => {
      if (!document.hidden && playerRef.current) {
        try {
          playerRef.current.seekTo(startSec, true);
          playerRef.current.playVideo();
        } catch { /* ignore */ }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

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
      document.removeEventListener("visibilitychange", handleVisibility);
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

      {/* 썸네일 오버레이 — 플레이어 준비 전 검정 배경 방지 */}
      <div
        className="absolute inset-0 z-20 transition-opacity duration-700"
        style={{
          backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: ready ? 0 : 1,
          pointerEvents: "none",
        }}
      />

      {/* YouTube 호버 UI 차단 */}
      <div className="absolute inset-0 z-10" />
    </>
  );
}
