"use client";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  /** "dark" = white navbar (default), "light" = transparent hero navbar */
  variant?: "dark" | "light";
}

export default function Logo({ size = "md", variant = "dark" }: LogoProps) {
  const h = { sm: 32, md: 40, lg: 56 }[size];
  // logo01.jpg is 420×280 (3:2) → render at h × 1.5 width
  const iconW = Math.round(h * 1.5);

  const isLight = variant === "light";

  return (
    <Link href="/" className="flex items-center gap-2 select-none group">
      {/* Icon */}
      <div
        className="shrink-0 rounded-md overflow-hidden"
        style={{ width: iconW, height: h }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo01.jpg"
          alt="일광교회"
          style={{ width: iconW, height: h, objectFit: "cover" }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className="font-nanum transition-colors duration-300"
          style={{
            fontSize: Math.round(h * 0.21),
            color: isLight ? "rgba(255,255,255,0.75)" : "#6b7280",
            letterSpacing: "0.04em",
          }}
        >
          행복과 영원으로 초대하는
        </span>
        <span
          className="font-nanum-extrabold transition-colors duration-300"
          style={{
            fontSize: Math.round(h * 0.565),
            color: isLight ? "#ffffff" : "#1a2744",
            marginTop: Math.round(h * 0.05),
          }}
        >
          일광교회
        </span>
      </div>
    </Link>
  );
}
