import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "청년부",
  description: "일광교회 청년부 — 대학생 및 청년 사역",
};

export default function YoungAdultsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-500 to-[#1B5E20] text-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-green-200 text-sm mb-3 tracking-widest uppercase">Young Adults</p>
          <h1 className="text-4xl font-bold mb-4">청년부</h1>
          <p className="text-green-100 text-lg">세상 속에서 그리스도인으로 — 일광 청년공동체</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* 비전 */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">청년부 비전</h2>
            <p className="text-gray-600 leading-relaxed">
              일광 청년부는 대학생과 20~30대 미혼 청년들이 함께 모이는 공동체입니다.
              신앙과 삶을 통합하고, 복음으로 세상을 변화시킬
              <strong>하나님 나라의 청년 일꾼</strong>을 세우는 것이 우리의 비전입니다.
            </p>
          </div>

          {/* 모임 정보 */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              { icon: "🙏", title: "주일 예배", detail: "매 주일 오후 1:30\n3부 예배 함께 참여\n예배 후 청년 모임" },
              { icon: "📖", title: "금요 성경공부", detail: "매주 금요일 오후 7:30\n소그룹 말씀 나눔\n찬양 & 기도 포함" },
              { icon: "☕", title: "소그룹 & 교제", detail: "격주 토요일 오후\n소그룹(5~8명) 운영\n삶 나눔과 기도" },
            ].map((m) => (
              <div key={m.title} className="bg-[#E8F5E9] rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{m.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{m.title}</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{m.detail}</p>
              </div>
            ))}
          </div>

          {/* 연간 행사 */}
          <h2 className="text-xl font-bold mb-6">연간 주요 행사</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {[
              { title: "봄 수련회", desc: "3박 4일 강원도 수련회 — 말씀, 찬양, 교제", badge: "4월" },
              { title: "전도 훈련 & 노방전도", desc: "길음 지역 노방전도 및 전도 훈련", badge: "5월" },
              { title: "여름 단기선교", desc: "해외/국내 단기선교 파견 (자원자 모집)", badge: "7~8월" },
              { title: "청년의 밤 (연말 콘서트)", desc: "찬양과 간증, 한 해를 돌아보는 감사 예배", badge: "12월" },
            ].map((e) => (
              <div key={e.title} className="flex gap-4 bg-gray-50 rounded-xl p-5">
                <span className="shrink-0 w-12 h-12 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs font-bold text-center leading-tight">{e.badge}</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{e.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-[#1B5E20] text-white rounded-2xl p-10">
            <h3 className="text-xl font-bold mb-3">청년부에 오세요!</h3>
            <p className="text-green-200 text-sm mb-6">
              믿음이 있든 없든, 교회가 처음이든 — 누구나 환영합니다.<br />
              매 주일 오후 1:30 본당에서 먼저 예배를 드리고 오세요.
            </p>
            <Link href="/contact" className="inline-block px-7 py-3 bg-[#FFC107] text-gray-900 rounded-full font-bold hover:bg-yellow-400 transition-colors">
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
