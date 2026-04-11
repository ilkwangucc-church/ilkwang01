import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { WORSHIP_NAV } from "@/components/ui/StickySubNav";
import LatestSermonsSection from "@/components/worship/LatestSermonsSection";
import { Sun, Leaf, Sunrise, BookOpen, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "예배/말씀",
  description: "일광교회 예배 안내 및 설교 영상 - 주일예배, 새벽기도회, 수요예배",
};

const services = [
  { name: "주일 1부 예배",   time: "주일 오전 9:30",    place: "본당", Icon: Sun,      desc: "온 가족이 함께 드리는 아침 예배입니다." },
  { name: "주일 2부 예배",   time: "주일 오전 11:00",   place: "본당", Icon: Leaf,     desc: "일광교회의 주 예배입니다. 모든 성도가 함께 합니다." },
  { name: "주일 3부 예배",   time: "주일 오후 1:30",    place: "본당", Icon: Sun,      desc: "청년 및 오후 성도를 위한 예배입니다." },
  { name: "새벽기도회",      time: "매일 오전 5:00",    place: "본당", Icon: Sunrise,  desc: "이른 아침 하나님 앞에 나아가는 기도회입니다." },
  { name: "수요오전기도회",  time: "수요일 오전 10:30", place: "본당", Icon: Users,    desc: "중보기도와 함께하는 오전 기도회입니다." },
  { name: "수요성경공부",    time: "수요일 오후 8:00",  place: "본당", Icon: BookOpen, desc: "말씀을 깊이 공부하는 성경공부입니다." },
];


export default function WorshipPage() {
  return (
    <div>
      <PageHero label="Worship & Message" title="예배 / 말씀" subtitle="살아계신 하나님을 예배하고 그 말씀을 듣습니다" image="https://images.unsplash.com/photo-1579975096649-e773152b04cb?w=1800&auto=format&fit=crop&q=80" />

      <StickySubNav items={WORSHIP_NAV} />

      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* 예배 안내 */}
        <section className="mb-12 sm:mb-20">
          <h2 className="font-nanum-extrabold text-2xl sm:text-3xl text-gray-800 mb-6 sm:mb-8">예배 안내</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-[#A5D6A7] hover:shadow-md transition-all text-center">
                <div className="flex justify-center mb-3">
                  <s.Icon className="w-9 h-9 sm:w-10 sm:h-10 text-[#2E7D32]" strokeWidth={1.5} />
                </div>
                <h3 className="font-nanum-extrabold text-gray-800 text-base sm:text-lg mb-1 break-keep">{s.name}</h3>
                <p className="text-[#2E7D32] font-nanum-extrabold text-lg sm:text-xl mb-1">{s.time}</p>
                <p className="text-gray-400 text-xs mb-3">{s.place}</p>
                <p className="text-gray-600 text-sm leading-relaxed break-keep">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 최신 설교 */}
        <section>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-nanum-extrabold text-2xl sm:text-3xl text-gray-800">최신 설교</h2>
            <Link href="/worship/sermons" className="text-[#2E7D32] font-nanum-bold text-sm hover:underline py-2.5 px-1">
              전체 보기 →
            </Link>
          </div>
          <LatestSermonsSection />
        </section>
      </div>
    </div>
  );
}
