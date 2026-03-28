import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  white?: boolean;
}

export default function Logo({ size = "md", white = false }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 64 };
  const px = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2 group select-none">
      {/* SVG 로고 아이콘 */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform group-hover:scale-105"
      >
        {/* 원형 배경 */}
        <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" />

        {/* 나무 줄기 */}
        <rect x="46" y="60" width="8" height="22" rx="4" fill="#fff" opacity="0.9" />

        {/* 나무 잎 - 큰 원 */}
        <circle cx="50" cy="44" r="22" fill="#fff" opacity="0.15" />

        {/* 나무 잎 - 레이어 1 (바닥) */}
        <ellipse cx="50" cy="52" rx="26" ry="14" fill="#A5D6A7" opacity="0.8" />

        {/* 나무 잎 - 레이어 2 (중간) */}
        <ellipse cx="50" cy="44" rx="22" ry="13" fill="#66BB6A" />

        {/* 나무 잎 - 레이어 3 (상단) */}
        <ellipse cx="50" cy="34" rx="16" ry="12" fill="#2E7D32" />

        {/* 빛 하이라이트 */}
        <ellipse cx="44" cy="30" rx="6" ry="4" fill="#fff" opacity="0.3" transform="rotate(-15 44 30)" />

        {/* 노란 별/빛 포인트 */}
        <circle cx="68" cy="22" r="5" fill="#F9A825" opacity="0.9" />
        <circle cx="72" cy="28" r="3" fill="#FFD54F" opacity="0.7" />
        <circle cx="65" cy="16" r="2.5" fill="#F9A825" opacity="0.6" />

        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#388E3C" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>
        </defs>
      </svg>

      {/* 텍스트 */}
      <div className="leading-tight">
        <p className={`text-[10px] tracking-wide ${white ? "text-green-100" : "text-gray-400"}`}>
          행복과 영원으로 초대하는
        </p>
        <p className={`font-bold ${size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl"} ${white ? "text-white" : "text-gray-800"} tracking-tight`}>
          일광교회
        </p>
      </div>
    </Link>
  );
}
