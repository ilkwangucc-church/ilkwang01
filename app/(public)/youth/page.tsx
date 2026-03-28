import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "다음세대",
  description: "일광교회 다음세대 사역 — 주일학교, 청년부, 중고등부",
};

const departments = [
  {
    name: "주일학교",
    sub: "유치부 · 아동부",
    href: "/youth/sunday",
    color: "from-yellow-400 to-orange-400",
    desc: "하나님을 경험하며 자라는 우리 아이들. 유치부(5~7세)와 초등부(8~13세)가 매 주일 말씀과 찬양으로 신앙을 키웁니다.",
    icon: "🌱",
  },
  {
    name: "중고등부",
    sub: "청소년부",
    href: "/youth/teens",
    color: "from-blue-400 to-indigo-500",
    desc: "정체성과 신앙을 함께 세워가는 청소년들. 중학교 1학년부터 고등학교 3학년까지 함께 성장하는 공동체입니다.",
    icon: "🔥",
  },
  {
    name: "청년부",
    sub: "대학·청년부",
    href: "/youth/young-adults",
    color: "from-green-400 to-[#2E7D32]",
    desc: "세상 속에서 그리스도인으로 살아가는 청년들. 대학생부터 30대까지 함께 예배드리고 삶을 나눕니다.",
    icon: "✨",
  },
];

export default function YouthPage() {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <section className="bg-[#2E7D32] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-green-200 text-sm mb-3 tracking-widest uppercase">Next Generation</p>
          <h1 className="text-4xl font-bold mb-4">다음세대</h1>
          <p className="text-green-100 text-lg">
            오늘의 아이들이 내일의 교회입니다 — 다음세대를 세우는 일광교회
          </p>
        </div>
      </section>

      {/* 비전 메시지 */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">다음세대를 위한 사명</h2>
          <p className="text-gray-600 leading-relaxed">
            일광교회는 어린이와 청소년, 청년들이 <strong>하나님을 인격적으로 만나고</strong>,
            말씀 위에 굳건히 세워지기를 소망합니다.<br />
            각 세대에 맞는 예배와 교육, 공동체 활동을 통해
            신앙의 다음세대를 든든히 키워가겠습니다.
          </p>
        </div>
      </section>

      {/* 부서 카드 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Link key={dept.href} href={dept.href} className="group block">
              <div className={`rounded-2xl bg-gradient-to-br ${dept.color} p-8 text-white mb-4 text-center group-hover:scale-105 transition-transform`}>
                <div className="text-5xl mb-3">{dept.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{dept.name}</h3>
                <p className="text-white/80 text-sm">{dept.sub}</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed px-1">{dept.desc}</p>
              <span className="inline-block mt-3 text-[#2E7D32] font-medium text-sm group-hover:underline">
                자세히 보기 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 예배 시간 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">부서별 예배 시간</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#E8F5E9] text-[#2E7D32]">
                  <th className="text-left px-4 py-3 rounded-tl-lg">부서</th>
                  <th className="text-left px-4 py-3">대상</th>
                  <th className="text-left px-4 py-3">예배 시간</th>
                  <th className="text-left px-4 py-3 rounded-tr-lg">장소</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dept: "유치부", target: "5~7세", time: "주일 오전 11:00", place: "유치부실" },
                  { dept: "아동부 (초등부)", target: "초등학교 1~6학년", time: "주일 오전 11:00", place: "교육관 101호" },
                  { dept: "중고등부", target: "중학교 1학년 ~ 고등학교 3학년", time: "주일 오전 11:00", place: "교육관 대강당" },
                  { dept: "청년부", target: "대학생 ~ 30대 미혼", time: "주일 오후 1:30 (3부)", place: "본당" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.dept}</td>
                    <td className="px-4 py-3 text-gray-600">{row.target}</td>
                    <td className="px-4 py-3 text-gray-600">{row.time}</td>
                    <td className="px-4 py-3 text-gray-600">{row.place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
