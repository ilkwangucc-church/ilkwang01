import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";

const services = [
  { name: "주일 1부 예배", time: "오전 9:30", icon: "☀️", desc: "가족 예배" },
  { name: "주일 2부 예배", time: "오전 11:00", icon: "🌿", desc: "주 예배" },
  { name: "주일 3부 예배", time: "오후 1:30", icon: "🌞", desc: "청년 예배" },
  { name: "새벽기도회", time: "매일 오전 5:00", icon: "🌅", desc: "월~토" },
  { name: "수요오전기도회", time: "수 오전 10:30", icon: "🙏", desc: "중보기도" },
  { name: "수요성경공부", time: "수 오후 8:00", icon: "📖", desc: "말씀 훈련" },
];

export default function WorshipSchedule() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[#2E7D32] text-sm font-nanum-bold tracking-widest uppercase mb-2">Worship</p>
          <h2 className="font-nanum-extrabold text-3xl md:text-4xl text-gray-800 mb-3">예배 안내</h2>
          <p className="text-gray-500">하나님을 예배하는 시간에 함께해 주세요</p>
          <div className="w-12 h-1 bg-[#F9A825] mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {services.map((s) => (
            <div
              key={s.name}
              className="bg-gradient-to-br from-[#E8F5E9] to-white rounded-2xl p-5 border border-[#C8E6C9] hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-nanum-bold text-gray-800 mb-1">{s.name}</h3>
              <p className="text-[#2E7D32] font-nanum-extrabold text-lg">{s.time}</p>
              <p className="text-gray-400 text-xs mt-1">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/worship"
            className="inline-flex items-center gap-2 text-[#2E7D32] font-nanum-bold hover:gap-3 transition-all"
          >
            예배 안내 자세히 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
