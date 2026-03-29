"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const ALL_IMAGES = [
  "/c01/18eb4d0674a7a41ee8f3b88000206e8b.jpeg",
  "/c01/1d0ee6b912b889440ed7c6b47b2c3217.png",
  "/c01/36bd481c4ebf74413e7d1b05f0a4b2a9.jpeg",
  "/c01/409e80712fc1d2af710622a970dafbeb.jpg",
  "/c01/4bb367d30ef79aef931f5dfdf8caa08f.jpeg",
  "/c01/4c894ed14beac804a0a64e6061d12306.jpg",
  "/c01/62d0bf80c7376c6fe2d488648dc5dbdd.png",
  "/c01/7243028432b03fefc7ef1b01c182da51.jpeg",
  "/c01/7539ee6362e853c648b56304b7d44488.jpeg",
  "/c01/8b82fb9c58482a88f49a660087d84a7d.jpg",
  "/c01/90095b226e9580784476105d57b822f2.jpeg",
  "/c01/fc3b6e792e02781b375bca118a8f6fcf.jpeg",
];

const SIZE = 300;
const HALF = SIZE / 2;

const FACE_TRANSFORMS = [
  `translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
  `rotateY(90deg) translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
  `rotateX(90deg) translateZ(${HALF}px)`,
];

export default function HeroCube() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const [faces, setFaces] = useState<string[]>(() =>
    [...ALL_IMAGES].sort(() => Math.random() - 0.5).slice(0, 6)
  );
  const [lightbox, setLightbox] = useState<string | null>(null);

  const rot = useRef({ x: -15, y: 25, z: 0 });
  const isHovering = useRef(false);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const usageCount = useRef<Record<string, number>>({});
  const rotActive = useRef(false);

  const applyRot = () => {
    if (!cubeRef.current) return;
    const { x, y, z } = rot.current;
    cubeRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
  };

  // 입장 애니메이션 + 자동 회전 ticker
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // 시작: 상단 전화번호 위치에서 아주 작게
    gsap.set(el, { scale: 0.07, x: 80, y: -680, opacity: 1 });

    // 빠르게 곡선으로 떨어지며 커짐
    gsap.to(el, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.82,
      ease: "power3.out",
      delay: 0.15,
      onComplete: () => { rotActive.current = true; },
    });

    const tick = () => {
      if (!isDragging.current && rotActive.current) {
        const spd = isHovering.current ? 3.5 : 0.6;
        rot.current.x += 0.25 * spd;
        rot.current.y += 0.62 * spd;
        rot.current.z += 0.09 * spd;
        applyRot();
      }
    };

    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 마우스 드래그
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved.current = true;
      rot.current.y += dx * 0.45;
      rot.current.x -= dy * 0.45;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      applyRot();
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 이미지 순환 — 같은 이미지 2회 이상 노출 방지
  useEffect(() => {
    const id = setInterval(() => {
      setFaces(prev => {
        const current = new Set(prev);
        let pool = ALL_IMAGES.filter(
          img => !current.has(img) && (usageCount.current[img] ?? 0) < 2
        );
        if (!pool.length) {
          usageCount.current = {};
          pool = ALL_IMAGES.filter(img => !current.has(img));
        }
        if (!pool.length) return prev;
        const newImg = pool[Math.floor(Math.random() * pool.length)];
        usageCount.current[newImg] = (usageCount.current[newImg] ?? 0) + 1;
        const next = [...prev];
        next[Math.floor(Math.random() * 6)] = newImg;
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div
        ref={wrapperRef}
        className="cursor-grab active:cursor-grabbing select-none"
        style={{ width: SIZE, height: SIZE, perspective: `${SIZE * 2.8}px`, opacity: 0 }}
        onMouseEnter={() => { isHovering.current = true; }}
        onMouseLeave={() => { isHovering.current = false; }}
        onMouseDown={(e) => {
          isDragging.current = true;
          hasMoved.current = false;
          lastMouse.current = { x: e.clientX, y: e.clientY };
          e.preventDefault();
        }}
      >
        <div
          ref={cubeRef}
          style={{
            width: SIZE,
            height: SIZE,
            position: "relative",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {FACE_TRANSFORMS.map((tr, i) => (
            <div
              key={i}
              onClick={() => { if (!hasMoved.current) setLightbox(faces[i]); }}
              style={{
                position: "absolute",
                inset: 0,
                transform: tr,
                backfaceVisibility: "hidden",
                overflow: "hidden",
                borderRadius: 6,
                border: "2.5px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={faces[i]}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 확대 보기 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="확대 이미지"
            className="max-w-[88vw] max-h-[88vh] rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-5 right-8 text-white text-5xl leading-none hover:opacity-60 transition-opacity"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
