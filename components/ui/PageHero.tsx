/**
 * 서브페이지 공통 히어로 컴포넌트
 * - min-height 600px
 * - 배경 이미지 + 다크 그라디언트 오버레이
 * - 투명 fixed 네비게이션과 함께 사용 (상단에서 시작, 콘텐츠는 하단 정렬)
 */

interface PageHeroProps {
  /** 영문 레이블 (소문자 추천) */
  label: string;
  /** 한글 제목 */
  title: string;
  /** 선택적 부제목 */
  subtitle?: string;
  /** Unsplash 또는 로컬 이미지 URL */
  image: string;
}

export default function PageHero({ label, title, subtitle, image }: PageHeroProps) {
  return (
    <div className="relative flex items-end overflow-hidden min-h-[280px] sm:min-h-[400px] lg:min-h-[500px]">
      {/* 배경 이미지 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 그라디언트 오버레이: 상단 가볍게 → 하단 짙게 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1320]/85 via-[#0b1320]/45 to-[#0b1320]/25" />

      {/* 콘텐츠 — 모바일: 중앙정렬 / sm 이상: 좌측정렬 */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 pb-8 sm:pb-12 lg:pb-14 text-center sm:text-left">
        <p className="text-[#6dbf73] text-[11px] font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4">
          {label}
        </p>
        <h1 className="font-nanum-extrabold text-white leading-tight mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl break-keep">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto sm:mx-0 break-keep">
            {subtitle}
          </p>
        )}
        {/* 하단 구분선 */}
        <div className="mt-6 sm:mt-8 w-16 h-1 bg-[#2E7D32] rounded-full mx-auto sm:mx-0" />
      </div>
    </div>
  );
}
