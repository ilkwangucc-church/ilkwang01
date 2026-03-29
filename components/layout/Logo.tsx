"use client";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const h = { sm: 32, md: 40, lg: 56 }[size];
  // logo01.png trimmed: 176×248 → ratio 0.71:1
  const iconW = Math.round(h * 176 / 248);

  const isLight = variant === "light";

  return (
    <Link href="/" className="flex items-end select-none group" style={{ gap: 6, letterSpacing: 0 }}>
      {/* Icon */}
      <div className="shrink-0" style={{ width: iconW, height: h }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo01.png"
          alt="일광교회"
          style={{ width: iconW, height: h, objectFit: "contain", display: "block" }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className="font-nanum transition-colors duration-300"
          style={{
            fontSize: Math.round(h * 0.275),
            color: isLight ? "rgba(255,255,255,0.85)" : "#4b5563",
            letterSpacing: "0.03em",
          }}
        >
          행복과 영원으로 초대하는
        </span>
        <span
          className="font-noto-black transition-colors duration-300"
          style={{
            fontSize: Math.round(h * 0.565) + 3,
            color: isLight ? "#ffffff" : "#1a2744",
            marginTop: Math.round(h * 0.04),
          }}
        >
          일광교회
        </span>
      </div>
    </Link>
  );
}
