import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { YOUTH_NAV } from "@/components/ui/StickySubNav";

export const metadata: Metadata = {
  title: "중고등부",
  description: "일광교회 중고등부 청소년 사역 소개",
};

export default function TeensPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        label="Youth Ministry"
        title="중고등부"
        subtitle="정체성과 신앙을 함께 세워가는 청소년 공동체"
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&auto=format&fit=crop&q=80"
      />
      <StickySubNav items={YOUTH_NAV} />

      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* 소개 */}
          <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">청소년과 함께하는 교회</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base break-keep">
              중고등부는 중학교 1학년부터 고등학교 3학년까지의 청소년들이 모이는 공동체입니다.
              세상의 가치관 속에서 흔들리지 않도록, 말씀과 기도와 공동체를 통해
              <strong>그리스도인으로서의 정체성</strong>을 굳건히 세워갑니다.
            </p>
          </div>

          {/* 예배 정보 */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-3xl mx-auto">
            <div className="bg-indigo-50 rounded-2xl p-5 sm:p-7">
              <h3 className="font-bold text-indigo-800 mb-3 sm:mb-4 text-base sm:text-lg">주일 예배</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>매 주일 오전 11:00</li>
                <li>교육관 대강당</li>
                <li>말씀 중심 강해 설교</li>
                <li>청소년 찬양팀 인도</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl p-5 sm:p-7">
              <h3 className="font-bold text-blue-800 mb-3 sm:mb-4 text-base sm:text-lg">주중 모임</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="break-keep">금요 기도 모임 — 매주 금요일 오후 7:30</li>
                <li className="break-keep">소그룹 성경공부 — 격주 토요일 오후 2:00</li>
                <li>임원 모임 — 월 1회</li>
              </ul>
            </div>
          </div>

          {/* 프로그램 */}
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">연간 주요 프로그램</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {[
              { period: "3월",   event: "신학기 환영 예배 및 신입생 OT" },
              { period: "5월",   event: "청소년 축제 (지역 청소년 초청 전도 행사)" },
              { period: "7~8월", event: "여름 수련회 (3박 4일)" },
              { period: "10월",  event: "가을 신앙 에세이 공모 & 시상" },
              { period: "12월",  event: "성탄절 특별 공연 및 후배 환영 예배" },
            ].map((p) => (
              <div key={p.period} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 sm:px-5 py-3 min-h-[44px]">
                <span className="shrink-0 text-indigo-600 font-bold text-sm w-12">{p.period}</span>
                <span className="text-gray-700 text-sm break-keep">{p.event}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
