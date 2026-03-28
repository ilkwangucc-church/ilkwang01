"use client";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  /** "dark" = white navbar (default), "light" = transparent hero navbar */
  variant?: "dark" | "light";
}

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const h = { sm: 32, md: 40, lg: 56 }[size];
  // logo01.jpg is 420×280 (3:2)
  const iconW = Math.round(h * 1.5);

  const isLight = variant === "light";

  return (
    <Link href="/" className="flex items-center gap-1 select-none group">
      {/* Icon — mix-blend-mode:multiply removes white JPEG background */}
      <div className="shrink-0" style={{ width: iconW, height: h }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo01.png"
          alt="일광교회"
          style={{
            width: iconW,
            height: h,
            objectFit: "cover",
            display: "block",
          }}
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
          className="font-nanum-extrabold transition-colors duration-300"
          style={{
            fontSize: Math.round(h * 0.565) + 2,
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
