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

const SIZE = 210;
const HALF = SIZE / 2;
const DOT  = 4;

const FACES: string[] = [
  `translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
  `rotateY(90deg)  translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
  `rotateX(90deg)  translateZ(${HALF}px)`,
];

// 램프가 큐브 테두리를 따라 이동하는 8개 지점 (2D, 3D 컨텍스트 완전 분리)
const LAMP_PTS: [number, number][] = [
  [24,        24       ],
  [HALF,      12       ],
  [SIZE - 24, 24       ],
  [SIZE - 12, HALF     ],
  [SIZE - 24, SIZE - 24],
  [HALF,      SIZE - 12],
  [24,        SIZE - 24],
  [12,        HALF     ],
];
const LAMP_ADJ = [[1,7],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,0]];

export default function HeroCube() {
  const cubeRef  = useRef<HTMLDivElement>(null);
  const lampRef  = useRef<HTMLDivElement>(null);
  const lampIdx  = useRef(0);
  const rot       = useRef({ x: -15, y: 25, z: 0 });
  const isHover   = useRef(false);
  const isDrag    = useRef(false);
  const hasMoved  = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const usageCnt  = useRef<Record<string, number>>({});

  const [imgs, setImgs] = useState<string[]>(() =>
    [...ALL_IMAGES].sort(() => Math.random() - 0.5).slice(0, 6)
  );
  const [lightbox, setLightbox] = useState<string | null>(null);

  const applyRot = () => {
    if (!cubeRef.current) return;
    const { x, y, z } = rot.current;
    cubeRef.current.style.transform =
      `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
  };

  // 자동 회전
  useEffect(() => {
    const tick = () => {
      if (isDrag.current) return;
      const s = isHover.current ? 2.2 : 0.28;
      rot.current.x += 0.22 * s;
      rot.current.y += 0.55 * s;
      rot.current.z += 0.07 * s;
      applyRot();
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 드래그
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDrag.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved.current = true;
      rot.current.y += dx * 0.45;
      rot.current.x -= dy * 0.45;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      applyRot();
    };
    const onUp = () => { isDrag.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 형광 노란 램프 — preserve-3d 바깥에 배치해 히어로 번쩍임 완전 차단
  useEffect(() => {
    const lamp = lampRef.current;
    if (!lamp) return;
    const [ix, iy] = LAMP_PTS[0];
    gsap.set(lamp, { x: ix - DOT / 2, y: iy - DOT / 2 });
    const move = () => {
      const curr = lampIdx.current;
      const next = LAMP_ADJ[curr][Math.floor(Math.random() * 2)];
      lampIdx.current = next;
      const [tx, ty] = LAMP_PTS[next];
      gsap.to(lamp, {
        x: tx - DOT / 2,
        y: ty - DOT / 2,
        duration: 4 + Math.random() * 3,
        ease: "power2.inOut",
        onComplete: move,
      });
    };
    move();
    return () => { gsap.killTweensOf(lamp); };
  }, []);

  // 이미지 순환
  useEffect(() => {
    const id = setInterval(() => {
      setImgs(prev => {
        const cur = new Set(prev);
        let pool = ALL_IMAGES.filter(
          img => !cur.has(img) && (usageCnt.current[img] ?? 0) < 2
        );
        if (!pool.length) {
          usageCnt.current = {};
          pool = ALL_IMAGES.filter(img => !cur.has(img));
        }
        if (!pool.length) return prev;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        usageCnt.current[pick] = (usageCnt.current[pick] ?? 0) + 1;
        const next = [...prev];
        next[Math.floor(Math.random() * 6)] = pick;
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    /* isolation: isolate — 히어로 배경과 GPU 레이어 완전 분리 */
    <div style={{ position: "relative", width: SIZE, height: SIZE, isolation: "isolate" }}>

      {/* 큐브 */}
      <div
        className="cursor-grab active:cursor-grabbing select-none"
        style={{ width: SIZE, height: SIZE, perspective: `${SIZE * 2.8}px` }}
        onMouseEnter={() => { isHover.current = true; }}
        onMouseLeave={() => { isHover.current = false; }}
        onMouseDown={e => {
          isDrag.current    = true;
          hasMoved.current  = false;
          lastMouse.current = { x: e.clientX, y: e.clientY };
          e.preventDefault();
        }}
      >
        <div
          ref={cubeRef}
          style={{
            width: SIZE, height: SIZE,
            position: "relative",
            transformStyle: "preserve-3d",
            /* willChange 제거 — GPU 레이어 강제 생성 없앰 (번쩍임 원인) */
          }}
        >
          {FACES.map((tr, i) => (
            <div
              key={i}
              onClick={() => { if (!hasMoved.current) setLightbox(imgs[i]); }}
              style={{
                position: "absolute", inset: 0,
                transform: tr,
                backfaceVisibility: "hidden",
                overflow: "hidden",
                borderRadius: 6,
                border: "2px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                background: "#000", /* 번쩍임 방지: 흰 배경 없앰 */
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgs[i]}
                alt=""
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "center",
                  display: "block",
                  pointerEvents: "none", userSelect: "none",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.6)",
                pointerEvents: "none",
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* 형광 노란 램프 — 3D 컨텍스트 완전 분리 */}
      <div
        ref={lampRef}
        style={{
          position: "absolute", top: 0, left: 0,
          width: DOT, height: DOT,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffff00 30%, rgba(255,255,0,0.45) 65%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* 모달 */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            style={{
              width:  350,
              height: 350,
              objectFit: "cover", objectPosition: "center",
              border: "5px solid rgba(255,255,255,0.18)",
              borderRadius: 4,
              display: "block",
            }}
          />
        </div>
      )}
    </div>
  );
}
