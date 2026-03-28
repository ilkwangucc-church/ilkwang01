import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* 텍스트 */}
        <div>
          <p className="text-[#F9A825] text-sm font-nanum-bold tracking-widest uppercase mb-2">
            Since 1971 · About Us
          </p>
          <h2 className="font-nanum-extrabold text-3xl md:text-4xl leading-tight mb-6">
            행복과 영원으로 초대하는<br />
            <span className="text-[#A5D6A7]">일광교회</span>입니다
          </h2>

          <div className="space-y-4 text-green-100 leading-relaxed">
            <p>
              일광교회는 <strong className="text-white">대한예수교장로회(합동, 총신대학교)</strong>에 소속된
              건강한 교회로 <strong className="text-[#F9A825]">1971년</strong>에 설립되어 50여 년 동안
              도암동 지역 복음화의 사명을 감당해 왔습니다.
            </p>
            <p>
              <strong className="text-white">하나님 중심 · 성경 중심 · 교회 중심</strong>의 신앙을 추구하며,
              칼뱅의 개혁주의 신학에 기초한 건전한 신앙공동체를 이루고 있습니다.
            </p>
            <p>
              살아계신 하나님을 예배하고, 예수 그리스도의 제자로 훈련되어,
              성령의 능력으로 사랑하고 전도하고 섬김으로 하나님의 나라를 확장합니다.
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              href="/about"
              className="px-6 py-3 bg-[#F9A825] text-gray-900 font-nanum-bold rounded-full hover:bg-[#FFD54F] transition-colors"
            >
              인사말 보기
            </Link>
            <Link
              href="/about/location"
              className="px-6 py-3 border border-white/40 text-white font-nanum-bold rounded-full hover:bg-white/10 transition-colors"
            >
              새가족 안내
            </Link>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-white/20">
            {[
              { num: "1971", label: "설립 연도" },
              { num: "50+", label: "년 역사" },
              { num: "합동", label: "대한예수교장로회" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-nanum-extrabold text-2xl text-[#F9A825]">{s.num}</p>
                <p className="text-green-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 이미지 */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
            {/* Unsplash 교회 이미지 */}
            <img
              src="https://images.unsplash.com/photo-1542396601-dca920ea2807?w=700&q=80"
              alt="일광교회 예배"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/60 to-transparent" />
          </div>

          {/* 인용구 카드 */}
          <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 rounded-xl p-4 shadow-xl max-w-xs">
            <p className="text-xs text-[#2E7D32] font-nanum-bold mb-1">✝ 오늘의 말씀</p>
            <p className="font-nanum-bold text-sm leading-relaxed">
              "내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라"
            </p>
            <p className="text-[#F9A825] text-xs mt-1 font-nanum-bold">요한복음 14:6</p>
          </div>
        </div>
      </div>
    </section>
  );
}
