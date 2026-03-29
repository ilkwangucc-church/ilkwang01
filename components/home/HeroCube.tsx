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

const FACE_TRANSFORMS: string[] = [
  `translateZ(${HALF}px)`,
  `rotateY(180deg) translateZ(${HALF}px)`,
  `rotateY(90deg)  translateZ(${HALF}px)`,
  `rotateY(-90deg) translateZ(${HALF}px)`,
  `rotateX(-90deg) translateZ(${HALF}px)`,
  `rotateX(90deg)  translateZ(${HALF}px)`,
];

// 큐브 8개 꼭지점 (중심 기준 3D 좌표)
const VERTS_3D: [number, number, number][] = [
  [-HALF, -HALF, -HALF],
  [+HALF, -HALF, -HALF],
  [+HALF, +HALF, -HALF],
  [-HALF, +HALF, -HALF],
  [-HALF, -HALF, +HALF],
  [+HALF, -HALF, +HALF],
  [+HALF, +HALF, +HALF],
  [-HALF, +HALF, +HALF],
];

// 각 꼭지점에 연결된 인접 꼭지점 (모서리 기준)
const VERT_ADJ = [
  [1, 3, 4],
  [0, 2, 5],
  [1, 3, 6],
  [0, 2, 7],
  [0, 5, 7],
  [1, 4, 6],
  [2, 5, 7],
  [3, 4, 6],
];

// 현재 회전값을 반영해 3D 꼭지점을 2D 화면 좌표로 변환
function projectVertex(
  v: [number, number, number],
  rx: number, ry: number, rz: number
): [number, number] {
  const r = (d: number) => (d * Math.PI) / 180;
  let [x, y, z] = v;

  // X축 회전
  const cx = Math.cos(r(rx)), sx = Math.sin(r(rx));
  [y, z] = [y * cx - z * sx, y * sx + z * cx];

  // Y축 회전
  const cy = Math.cos(r(ry)), sy = Math.sin(r(ry));
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];

  // Z축 회전
  const cz = Math.cos(r(rz)), sz = Math.sin(r(rz));
  [x, y] = [x * cz - y * sz, x * sz + y * cz];

  // 원근 투영
  const d = SIZE * 2.8;
  const scale = d / (d - z);
  return [HALF + x * scale, HALF + y * scale];
}

export default function HeroCube() {
  const cubeRef    = useRef<HTMLDivElement>(null);
  const lampRef    = useRef<HTMLDivElement>(null);
  const rot        = useRef({ x: -15, y: 25, z: 0 });
  const isHover    = useRef(false);
  const isDrag     = useRef(false);
  const hasMoved   = useRef(false);
  const lastMouse  = useRef({ x: 0, y: 0 });
  const usageCnt   = useRef<Record<string, number>>({});

  // 램프 이동 상태
  const lampFrom   = useRef(0);
  const lampTo     = useRef(1);
  const lampT      = useRef(0);
  const lampSpeed  = useRef(0.0035);

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

  // 형광 노란 램프 — 매 프레임 회전 반영해 실제 꼭지점 위에 정확히 배치
  useEffect(() => {
    const lamp = lampRef.current;
    if (!lamp) return;

    const tick = () => {
      lampT.current += lampSpeed.current;

      if (lampT.current >= 1) {
        lampT.current = 0;
        lampFrom.current = lampTo.current;
        const adj = VERT_ADJ[lampFrom.current];
        lampTo.current = adj[Math.floor(Math.random() * adj.length)];
        lampSpeed.current = 0.003 + Math.random() * 0.003;
      }

      const t = lampT.current;
      // ease in-out
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const { x: rx, y: ry, z: rz } = rot.current;
      const [x0, y0] = projectVertex(VERTS_3D[lampFrom.current], rx, ry, rz);
      const [x1, y1] = projectVertex(VERTS_3D[lampTo.current],   rx, ry, rz);

      gsap.set(lamp, {
        x: x0 + (x1 - x0) * e - DOT / 2,
        y: y0 + (y1 - y0) * e - DOT / 2,
      });
    };

    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          }}
        >
          {FACE_TRANSFORMS.map((tr, i) => (
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
                background: "#000",
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

      {/* 형광 노란 램프 — 매 프레임 실제 꼭지점 좌표 추적 */}
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
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            style={{
              width: 350, height: 350,
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
