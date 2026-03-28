import Link from "next/link";

const beliefs = [
  {
    img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&auto=format&fit=crop&q=80",
    title: "예수 그리스도가 주님",
    desc: "우리는 예수 그리스도를 유일한 구원자요 주님으로 믿습니다.",
  },
  {
    img: "https://images.unsplash.com/photo-1544013434-93fc0d6a8f35?w=600&auto=format&fit=crop&q=80",
    title: "하나님은 사랑이시다",
    desc: "성경은 하나님이 세상을 사랑하사 독생자를 주셨다고 말씀합니다.",
  },
  {
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80",
    title: "성령의 능력으로",
    desc: "성령 하나님이 신자 안에 내주하시며 삶을 변화시키십니다.",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-24 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            ALL ABOUT JESUS
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1a2744] mb-4">
            우리가 믿는 것
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            일광교회는 성경 말씀에 기초한 개혁주의 신앙을 고백하며,
            삼위일체 하나님을 예배합니다.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {beliefs.map((b) => (
            <div key={b.title} className="text-center">
              <div className="rounded-2xl overflow-hidden mb-5 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.img}
                  alt={b.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
              <h3 className="text-lg font-black text-[#1a2744] mb-2">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/about/vision"
            className="inline-block px-8 py-3.5 bg-[#2E7D32] text-white font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors tracking-wide"
          >
            교회 비전 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
