import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#388E3C]">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#F9A825] blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#66BB6A] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white blur-3xl opacity-5" />
      </div>

      {/* 십자가 패턴 */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white text-6xl select-none"
            style={{
              left: `${(i % 5) * 25}%`,
              top: `${Math.floor(i / 5) * 25}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            ✝
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* 배지 */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-8 text-sm text-green-100">
          <span className="w-2 h-2 rounded-full bg-[#F9A825] animate-pulse" />
          대한예수교장로회(합동) · 서울 성북구 · 1971년 설립
        </div>

        <h1 className="font-nanum-extrabold text-5xl md:text-7xl leading-tight mb-4">
          행복과 영원으로<br />
          <span className="text-[#F9A825]">초대하는</span> 일광교회
        </h1>

        <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-4 leading-relaxed">
          "내가 곧 길이요, 진리요, 생명이니 ···" <span className="text-[#F9A825] text-sm">(요 14:6)</span>
        </p>
        <p className="text-base text-green-200 max-w-xl mx-auto mb-10 leading-relaxed">
          살아계신 하나님을 예배하고, 예수 그리스도의 제자로 훈련되어,
          성령의 능력으로 사랑하고 전도하고 섬기는 교회입니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F9A825] text-gray-900 font-nanum-bold rounded-full hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-lg"
          >
            교회 소개 보기
          </Link>
          <Link
            href="/worship"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur border border-white/30 text-white font-nanum-bold rounded-full hover:bg-white/20 transition-all"
          >
            예배 안내
          </Link>
        </div>

        {/* 스크롤 유도 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-green-200 text-xs animate-bounce">
          <span>아래로 스크롤</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
