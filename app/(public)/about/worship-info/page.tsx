import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { Sun, Leaf, Sunrise, Users, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "예배안내 | 일광교회",
  description: "일광교회 예배 시간 및 장소 안내",
};

const submenu = [
  { label: "인사말",        href: "/about" },
  { label: "소개&비전",     href: "/about/vision" },
  { label: "섬기는 사람들", href: "/about/pastor" },
  { label: "예배안내",      href: "/about/worship-info" },
  { label: "오시는길",      href: "/about/location" },
];

const services = [
  { name: "주일 1부 예배",   time: "주일 오전 9:30",       place: "본당", Icon: Sun,      desc: "온 가족이 함께 드리는 아침 예배입니다." },
  { name: "주일 2부 예배",   time: "주일 오전 11:00",      place: "본당", Icon: Leaf,     desc: "일광교회의 주 예배입니다. 모든 성도가 함께 합니다." },
  { name: "주일 3부 예배",   time: "주일 오후 1:30",       place: "본당", Icon: Sun,      desc: "청년 및 오후 성도를 위한 예배입니다." },
  { name: "새벽기도회",      time: "매일 오전 5:00",       place: "본당", Icon: Sunrise,  desc: "이른 아침 하나님 앞에 나아가는 기도회입니다." },
  { name: "수요오전기도회",  time: "수요일 오전 10:30",    place: "본당", Icon: Users,    desc: "중보기도와 함께하는 오전 기도회입니다." },
  { name: "수요성경공부",    time: "수요일 오후 8:00",     place: "본당", Icon: BookOpen, desc: "말씀을 깊이 공부하는 성경공부입니다." },
];

export default function WorshipInfoPage() {
  return (
    <div>
      <PageHero
        label="Worship Guide"
        title="예배안내"
        subtitle="살아계신 하나님을 함께 예배합니다"
        image="https://images.unsplash.com/photo-1579975096649-e773152b04cb?w=1800&auto=format&fit=crop&q=80"
      />

      {/* 서브메뉴 */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-1 overflow-x-auto">
          {submenu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`py-4 px-5 text-sm font-nanum-bold whitespace-nowrap border-b-2 ${
                m.href === "/about/worship-info"
                  ? "border-[#2E7D32] text-[#2E7D32]"
                  : "border-transparent text-gray-500 hover:text-[#2E7D32]"
              }`}
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <h2 className="font-nanum-extrabold text-2xl sm:text-3xl text-gray-800 mb-6 sm:mb-8">예배 시간 안내</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-16">
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

        <div className="bg-[#E8F5E9] rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-gray-700 text-sm sm:text-base mb-4 break-keep">
            예배 장소: 서울특별시 성북구 동소문로 212-68
          </p>
          <Link
            href="/about/location"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E7D32] text-white font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors min-h-[44px]"
          >
            오시는 길 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
