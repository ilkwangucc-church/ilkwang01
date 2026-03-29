import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { WORSHIP_NAV } from "@/components/ui/StickySubNav";

export const metadata: Metadata = {
  title: "예배/말씀",
  description: "일광교회 예배 안내 및 설교 영상 - 주일예배, 새벽기도회, 수요예배",
};

const services = [
  { name: "주일 1부 예배", time: "주일 오전 9:30", place: "본당", icon: "☀️", desc: "온 가족이 함께 드리는 아침 예배입니다." },
  { name: "주일 2부 예배", time: "주일 오전 11:00", place: "본당", icon: "🌿", desc: "일광교회의 주 예배입니다. 모든 성도가 함께 합니다." },
  { name: "주일 3부 예배", time: "주일 오후 1:30", place: "본당", icon: "🌞", desc: "청년 및 오후 성도를 위한 예배입니다." },
  { name: "새벽기도회", time: "매일 오전 5:00", place: "본당", icon: "🌅", desc: "이른 아침 하나님 앞에 나아가는 기도회입니다." },
  { name: "수요오전기도회", time: "수요일 오전 10:30", place: "본당", icon: "🙏", desc: "중보기도와 함께하는 오전 기도회입니다." },
  { name: "수요성경공부", time: "수요일 오후 8:00", place: "본당", icon: "📖", desc: "말씀을 깊이 공부하는 성경공부입니다." },
];

const sermons = [
  { date: "2025.12.7",  title: "바닥에서도 시작되는 하나님의 스토리", scripture: "창세기 39:1-6",    preacher: "신점일 목사", videoId: "HDT6y_97ZZY" },
  { date: "2025.11.30", title: "광야에서 만난 연합의 능력",           scripture: "출애굽기 17:8-13", preacher: "신점일 목사", videoId: "GNSONodOirY" },
  { date: "2025.11.16", title: "감사는 선택이 아닌 체질이다",         scripture: "골로새서 3:15-17", preacher: "신점일 목사", videoId: "-GpyxONySN0" },
  { date: "2025.11.9",  title: "내게로 오라",                         scripture: "마태복음 11:28",   preacher: "신점일 목사", videoId: "vettJ40x1xE" },
];

export default function WorshipPage() {
  return (
    <div>
      <PageHero label="Worship & Message" title="예배 / 말씀" subtitle="살아계신 하나님을 예배하고 그 말씀을 듣습니다" image="https://images.unsplash.com/photo-1579975096649-e773152b04cb?w=1800&auto=format&fit=crop&q=80" />

      <StickySubNav items={WORSHIP_NAV} />

      <div className="max-w-[1400px] mx-auto px-4 py-16">
        {/* 예배 안내 */}
        <section className="mb-20">
          <h2 className="font-nanum-extrabold text-3xl text-gray-800 mb-8">예배 안내</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#A5D6A7] hover:shadow-md transition-all text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-nanum-extrabold text-gray-800 text-lg mb-1">{s.name}</h3>
                <p className="text-[#2E7D32] font-nanum-extrabold text-xl mb-1">{s.time}</p>
                <p className="text-gray-400 text-xs mb-3">📍 {s.place}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 최신 설교 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-nanum-extrabold text-3xl text-gray-800">최신 설교</h2>
            <Link href="/worship/sermons" className="text-[#2E7D32] font-nanum-bold text-sm hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {sermons.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all group">
                <div className="aspect-video bg-gray-900 relative">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${s.videoId}?rel=0&modestbranding=1`}
                    title={s.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <p className="text-[#2E7D32] text-xs font-nanum-bold mb-1">{s.scripture}</p>
                  <h3 className="font-nanum-bold text-gray-800 leading-snug mb-2">{s.title}</h3>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>{s.date}</span>
                    <span>{s.preacher}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
