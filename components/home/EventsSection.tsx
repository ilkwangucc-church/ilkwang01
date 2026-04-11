import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    day: "06",
    month: "Apr",
    year: "2026",
    title: "부활절 연합 예배",
    time: "오전 10:00 — 12:00",
    location: "일광교회 본당",
  },
  {
    day: "13",
    month: "Apr",
    year: "2026",
    title: "청년부 수련회",
    time: "토 09:00 — 일 18:00",
    location: "덕유산 기도원",
  },
  {
    day: "20",
    month: "Apr",
    year: "2026",
    title: "봄 부흥성회",
    time: "오후 7:30 — 9:00",
    location: "일광교회 본당",
  },
  {
    day: "04",
    month: "May",
    year: "2026",
    title: "어버이주일 감사예배",
    time: "오전 11:00 — 12:30",
    location: "일광교회 본당",
  },
];

export default function EventsSection() {
  return (
    <section className="py-24 bg-[#F8FAF8]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 xl:grid-cols-[380px_1fr] gap-10 xl:gap-24 items-start">

          {/* Left — 모바일: 중앙정렬 / lg 이상: 좌측정렬 */}
          <div className="xl:sticky xl:top-28 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              THIS YEAR
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1a2744] leading-tight mb-6">
              특별한 예배와<br />행사에 함께하세요
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-md">
              일광교회는 다양한 절기 예배와 특별 행사를 통해 성도들이 하나님의 은혜를
              더욱 풍성하게 경험할 수 있도록 준비하고 있습니다.
            </p>
            <Link
              href="/news/events"
              className="inline-block px-7 py-3.5 bg-[#2E7D32] text-white font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors tracking-wide"
            >
              모든 행사 보기
            </Link>
          </div>

          {/* Right: 2×2 그리드 (xl에서) */}
          <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
            {events.map((e) => (
              <div key={e.title} className="flex gap-5 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Date Box */}
                <div className="shrink-0 w-16 h-16 bg-[#1a2744] rounded-xl flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-black leading-none">{e.day}</span>
                  <span className="text-[10px] font-semibold opacity-70 mt-0.5">{e.month} {e.year}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#1a2744] mb-1.5">{e.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#2E7D32]" /> {e.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" /> {e.location}
                    </span>
                  </div>
                </div>

                <Link href="/news/events" className="shrink-0 self-center">
                  <div className="w-8 h-8 rounded-full bg-[#2E7D32]/10 flex items-center justify-center hover:bg-[#2E7D32] group transition-colors">
                    <ArrowRight className="w-4 h-4 text-[#2E7D32] group-hover:text-white" />
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
