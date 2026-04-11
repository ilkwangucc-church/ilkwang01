export default function AboutSection() {
  return (
    <section
      className="relative py-28 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1564419320461-6870880221ad?w=1800&auto=format&fit=crop&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-[#1a2744]/85" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Pastor Photo */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1676286853148-ec365527c872?w=800&auto=format&fit=crop&q=80"
                alt="소외된 이웃 돕기"
                className="w-full object-cover aspect-[3/4]"
              />
            </div>
          </div>

          {/* Right: Quote */}
          <div>
            {/* Quote marks */}
            <div className="text-[#2E7D32] text-6xl font-black leading-none mb-4 opacity-80">"</div>
            <blockquote className="text-white text-2xl lg:text-3xl font-bold leading-snug mb-8 text-center">
              우리의 목표는 지역 사회에서 소외된 이웃들에게 복음의 빛을 전하고,
              모든 사람이 하나님의 사랑 안에서 새로운 삶을 시작하도록 돕는 것입니다.
            </blockquote>
            <p className="text-gray-300 leading-relaxed mb-8 text-center">
              1971년 설립된 일광교회는 대한예수교장로회(합동) 소속으로, 반세기가 넘는 역사 속에서
              하나님의 말씀을 붙잡고 성장해온 교회입니다. 말씀과 기도, 사랑으로 지역 사회와 함께합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
