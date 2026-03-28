import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  // 원본 로고 비율: 152x40 → aspect ratio 3.8:1
  const heights: Record<string, number> = { sm: 32, md: 40, lg: 56 };
  const h = heights[size];
  const w = Math.round(h * (152 / 40));

  return (
    <Link href="/" className="flex items-center select-none group">
      <Image
        src="/logo.png"
        alt="일광교회"
        width={w}
        height={h}
        priority
        className="transition-opacity group-hover:opacity-80"
        style={{ width: w, height: h }}
      />
    </Link>
  );
}
