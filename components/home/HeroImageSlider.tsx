"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const IMAGES = [
  "/c01/18eb4d0674a7a41ee8f3b88000206e8b.jpeg",
  "/c01/36bd481c4ebf74413e7d1b05f0a4b2a9.jpeg",
  "/c01/409e80712fc1d2af710622a970dafbeb.jpg",
  "/c01/4bb367d30ef79aef931f5dfdf8caa08f.jpeg",
  "/c01/7539ee6362e853c648b56304b7d44488.jpeg",
];

export default function HeroImageSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 페이지 로드 입장 애니메이션
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  // 이미지 자동 전환
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 이미지 전환 GSAP 애니메이션
  useEffect(() => {
    imgRefs.current.forEach((img, i) => {
      if (!img) return;
      if (i === current) {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }
        );
      } else {
        gsap.to(img, { opacity: 0, duration: 0.6, ease: "power2.in" });
      }
    });
  }, [current]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-2xl"
      style={{ opacity: 0 }}
    >
      {IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          ref={(el) => { imgRefs.current[i] = el; }}
          src={src}
          alt={`교회 이미지 ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}

      {/* 하단 점 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {IMAGES.map((_, i) => (
          <span
            key={i}
            className={`block rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
