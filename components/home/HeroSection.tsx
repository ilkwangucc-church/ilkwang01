import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[800px] flex items-center overflow-hidden">
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1800&auto=format&fit=crop&q=80"
        alt="예배"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a2d]/92 via-[#0d1a2d]/70 to-[#0d1a2d]/25" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full flex items-center min-h-[800px]">
        <div className="max-w-2xl">
          {/* Label */}
          <p className="text-[#a3c9a8] text-[22px] font-bold mb-2">
            행복과 영원으로 초대하는
          </p>

          {/* Main Heading */}
          <h1 className="text-[42px] font-black text-white leading-[1.15] mb-4">
            일광교회에 오신 것을<br />
            환영합니다
          </h1>

          {/* Body */}
          <p className="text-gray-300 text-[20px] leading-snug mb-8 max-w-xl">
            살아계신 하나님을 예배하고, 예수 그리스도의 제자로 훈련되어,<br className="hidden sm:block" />
            성령의 능력으로 사랑하고 전도하고 섬기는 교회입니다.
          </p>

          {/* CTA Buttons + Info bar */}
          <div className="relative -top-[10px]">
          <div className="flex flex-wrap gap-4 mb-5">
            <Link
              href="/about"
              className="px-6 py-[10px] bg-[#2E7D32] text-white font-bold text-base rounded-[26px] hover:bg-[#1B5E20] transition-colors tracking-wide"
            >
              교회 소개 보기
            </Link>
            <Link
              href="/worship/sermons"
              className="px-6 py-[10px] border-2 border-white text-white font-bold text-base rounded-[26px] hover:bg-white hover:text-[#1a2744] transition-colors tracking-wide"
            >
              설교 영상 보기
            </Link>
          </div>

          {/* Info bar */}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3 text-gray-300 text-base">
              <span className="w-5 h-5 rounded-full bg-[#2E7D32]/30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#6dbf73]" />
              </span>
              주일예배 오전 9:30 · 11:00
            </div>
            <div className="flex items-center gap-3 text-gray-300 text-base">
              <span className="w-5 h-5 rounded-full bg-[#2E7D32]/30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#6dbf73]" />
              </span>
              서울 성북구 길음역 인근
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
