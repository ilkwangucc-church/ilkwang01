import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sermons = [
  {
    tag: "주일 설교",
    title: "하나님의 은혜로 살아가다",
    slug: "grace-of-god",
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80",
    date: "2026.03.23",
  },
  {
    tag: "수요 설교",
    title: "믿음으로 나아가는 삶",
    slug: "life-by-faith",
    img: "https://images.unsplash.com/photo-1544013434-93fc0d6a8f35?w=600&auto=format&fit=crop&q=80",
    date: "2026.03.19",
  },
  {
    tag: "주일 설교",
    title: "성령 안에서 하나 되는 교회",
    slug: "one-in-the-spirit",
    img: "https://images.unsplash.com/photo-1574091948895-4a4bc19c3b69?w=600&auto=format&fit=crop&q=80",
    date: "2026.03.16",
  },
];

export default function BlogPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
            CURRENT SERIES
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#1a2744] mb-4">
            최근 설교 말씀
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            담임목사님의 최신 설교 말씀을 통해 하나님의 은혜를 경험하세요.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.map((s) => (
            <Link key={s.slug} href={`/worship/sermons`} className="group block">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[#2E7D32] text-[11px] font-bold uppercase tracking-widest mb-2">
                    {s.tag} · {s.date}
                  </p>
                  <h3 className="text-lg font-black text-[#1a2744] mb-4 group-hover:text-[#2E7D32] transition-colors">
                    {s.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2E7D32]">
                    말씀 듣기 <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
