import Link from "next/link";
import { BookOpen, Users, Baby, Calendar, Heart, Globe } from "lucide-react";

const services = [
  { icon: BookOpen, title: "주일 예배", desc: "말씀 중심의 주일 예배로 하나님께 나아갑니다." },
  { icon: Users, title: "청년부", desc: "청년들이 함께 성장하고 교제하는 공동체입니다." },
  { icon: Baby, title: "주일학교", desc: "다음 세대를 믿음 안에서 양육하는 교육부입니다." },
  { icon: Calendar, title: "특별 행사", desc: "부흥성회, 수련회 등 특별한 신앙 행사를 진행합니다." },
  { icon: Heart, title: "상담 사역", desc: "삶의 어려움을 함께 나누고 회복을 돕습니다." },
  { icon: Globe, title: "선교 사역", desc: "국내외 선교를 통해 복음을 전하는 교회입니다." },
];

export default function WorshipSchedule() {
  return (
    <section className="py-24 bg-[#F8FAF8]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 xl:grid-cols-[420px_1fr] gap-16 xl:gap-24 items-start">

          {/* Left */}
          <div className="xl:sticky xl:top-28">
            <p className="text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              OUR MINISTRY
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1a2744] leading-tight mb-6">
              지역 사회와 함께<br />성장하는 교회
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              일광교회는 예배와 교육, 교제와 봉사를 통해 성도들이 하나님의 사람으로
              세워지도록 돕고 있습니다. 다양한 부서와 사역을 통해 모든 세대가 함께 합니다.
            </p>
            <Link
              href="/worship"
              className="inline-block px-7 py-3.5 bg-[#2E7D32] text-white font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors tracking-wide"
            >
              예배 안내 보기
            </Link>
          </div>

          {/* Right: Service Grid — 2열 → xl에서 3열 */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-3 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl border-2 border-[#1a2744]/10 bg-[#F8FAF8] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#1a2744]" />
                </div>
                <h3 className="text-sm font-bold text-[#1a2744]">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
