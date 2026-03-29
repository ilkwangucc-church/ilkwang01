import Link from "next/link";

const beliefs = [
  {
    img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&auto=format&fit=crop&q=80",
    title: "예수 그리스도가 주님",
    desc: "우리는 예수 그리스도를 유일한 구원자요 주님으로 믿습니다.",
  },
  {
    img: "https://images.unsplash.com/photo-1536126750180-3c7d59643f99?w=600&auto=format&fit=crop&q=80",
    title: "하나님은 사랑이시다",
    desc: "성경은 하나님이 세상을 사랑하사 독생자를 주셨다고 말씀합니다.",
  },
  {
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80",
    title: "성령의 능력으로",
    desc: "성령 하나님이 신자 안에 내주하시며 삶을 변화시키십니다.",
  },
  {
    img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&auto=format&fit=crop&q=80",
    title: "성경은 하나님의 말씀",
    desc: "성경 66권은 하나님의 영감으로 기록된 무오한 말씀입니다.",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-24 bg-[#F8FAF8]">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* 1400px: 좌측 텍스트 + 우측 카드 4열 */}
        <div className="xl:grid xl:grid-cols-[340px_1fr] xl:gap-20 xl:items-start">

          {/* Header — xl에서 좌측 고정 */}
          <div className="mb-14 xl:mb-0 xl:sticky xl:top-28">
            <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              ALL ABOUT JESUS
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1a2744] mb-4">
              우리가<br />믿는 것
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              일광교회는 성경 말씀에 기초한 개혁주의 신앙을 고백하며,
              삼위일체 하나님을 예배합니다.
            </p>
            <Link
              href="/about/vision"
              className="inline-block px-8 py-3.5 bg-[#2E7D32] text-white font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors tracking-wide"
            >
              교회 비전 보기
            </Link>
          </div>

          {/* Cards — xl에서 2×2 → 4열 */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6 xl:gap-8">
            {beliefs.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.img}
                    alt={b.title}
                    className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black text-[#1a2744] mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
