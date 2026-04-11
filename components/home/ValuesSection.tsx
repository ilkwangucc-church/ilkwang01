import Link from "next/link";

const beliefs = [
  {
    img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=80",
    title: "예수 그리스도가 주님",
    desc: "우리는 예수 그리스도를 유일한 구원자요 주님으로 믿습니다.",
    tag: "SALVATION",
  },
  {
    img: "https://images.unsplash.com/photo-1536126750180-3c7d59643f99?w=800&auto=format&fit=crop&q=80",
    title: "하나님은 사랑이시다",
    desc: "성경은 하나님이 세상을 사랑하사 독생자를 주셨다고 말씀합니다.",
    tag: "LOVE",
  },
  {
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80",
    title: "성령의 능력으로",
    desc: "성령 하나님이 신자 안에 내주하시며 삶을 변화시키십니다.",
    tag: "HOLY SPIRIT",
  },
  {
    img: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=80",
    title: "성경은 하나님의 말씀",
    desc: "성경 66권은 하나님의 영감으로 기록된 무오한 말씀입니다.",
    tag: "BIBLE",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#F8FAF8]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6">

        {/* 헤더 — 중앙 정렬 */}
        <div className="text-center mb-8 sm:mb-14">
          <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            ALL ABOUT JESUS
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1a2744] mb-4">
            우리가 믿는 것
          </h2>
          <p className="text-gray-500 leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
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

        {/* 4열 카드 — 풀 폭 */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {beliefs.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.img}
                  alt={b.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 sm:p-6">
                <span className="text-[10px] font-black text-[#2E7D32] tracking-widest uppercase mb-2 block">{b.tag}</span>
                <h3 className="text-lg font-black text-[#1a2744] mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
