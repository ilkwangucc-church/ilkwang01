import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { ABOUT_NAV } from "@/components/ui/StickySubNav";
import { Church, BookOpen, Heart, Star, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "소개&비전",
  description: "일광교회의 소개와 비전 - 예배·훈련·치유·비전·선교 공동체",
};

const communities = [
  { Icon: Church,   name: "예배공동체", desc: "하나님을 위하여 존재하는 공동체", detail: "온 마음과 정성을 다해 살아계신 하나님께 예배드리며, 주일 예배를 신앙 생활의 중심으로 삼습니다. 참된 예배를 통해 하나님과의 관계를 회복하고 성도들이 함께 세워져 갑니다." },
  { Icon: BookOpen, name: "훈련공동체", desc: "성도를 말씀으로 세우는 공동체", detail: "성경 말씀을 통해 예수 그리스도의 제자로 훈련받고 성장합니다. 체계적인 말씀 교육과 소그룹 훈련을 통해 성숙한 신앙인을 세워갑니다." },
  { Icon: Heart,    name: "치유공동체", desc: "가정과 사회를 변화시키는 공동체", detail: "상처받은 영혼을 품고 가정을 회복시키며, 지역사회에 하나님의 사랑을 전합니다. 성령의 능력으로 삶의 모든 영역에서 치유와 회복이 일어납니다." },
  { Icon: Star,     name: "비전공동체", desc: "미래의 지도자를 세우는 공동체", detail: "다음 세대를 향한 투자와 양육을 통해 미래의 교회 지도자들을 세워갑니다. 청소년과 청년들이 하나님의 비전을 품고 자라나는 공동체입니다." },
  { Icon: Globe,    name: "선교공동체", desc: "지구촌 땅 끝까지 복음을 전하는 공동체", detail: "국내외 선교를 통해 하나님 나라를 확장하고 열방을 향한 선교 사명을 감당합니다. 땅 끝까지 복음을 전하는 선교적 교회를 지향합니다." },
];

export default function VisionPage() {
  return (
    <div>
      <PageHero label="Vision" title="소개 & 비전" subtitle="하나님 중심·성경 중심·교회 중심의 개혁주의 신앙 위에 세워진 교회" image="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1800&auto=format&fit=crop&q=80" />
      <StickySubNav items={ABOUT_NAV} />

      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* 교회 소개 */}
        <section className="mb-10 sm:mb-16">
          <h2 className="font-nanum-extrabold text-2xl sm:text-3xl text-[#2E7D32] mb-4 sm:mb-6">일광교회 소개</h2>
          <div className="bg-[#E8F5E9] rounded-2xl p-5 sm:p-8 leading-relaxed text-gray-700 space-y-4 text-sm sm:text-base break-keep">
            <p>
              일광교회는 <strong className="text-[#2E7D32]">대한예수교장로회(합동측, 총신대학교)</strong>에 소속된 건강한 교회로
              <strong className="text-[#2E7D32]"> 1971년</strong>에 설립되어 50여 년 동안 돈암동 지역 복음화의 사명을 감당해 왔으며,
              하나님 중심 · 성경 중심 · 교회 중심의 신앙을 추구하는 교회입니다.
            </p>
            <p>
              개혁주의 신앙(Reformed Faith)의 토대 위에 세워진 일광교회는 칼뱅의 신학적 전통을 따라
              오직 성경(Sola Scriptura), 오직 믿음(Sola Fide), 오직 은혜(Sola Gratia),
              오직 그리스도(Solus Christus), 오직 하나님께 영광(Soli Deo Gloria)을 고백하며
              나아가는 교회입니다.
            </p>
          </div>
        </section>

        {/* 교회 사명 */}
        <section className="mb-10 sm:mb-16">
          <h2 className="font-nanum-extrabold text-2xl sm:text-3xl text-[#2E7D32] mb-4 sm:mb-6">일광교회 사명</h2>
          <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 sm:p-8 text-white">
            <div className="text-center space-y-3 text-base sm:text-lg break-keep">
              <p>살아계신 하나님을 <strong className="text-[#FFC107]">예배하고</strong></p>
              <p>예수 그리스도의 제자로 <strong className="text-[#FFC107]">훈련되어</strong></p>
              <p>성령의 능력으로 사랑하고 전도하고 <strong className="text-[#FFC107]">섬김으로</strong></p>
              <p className="font-nanum-extrabold text-xl sm:text-2xl text-[#FFC107] pt-2">하나님의 나라를 확장한다.</p>
            </div>
          </div>
        </section>

        {/* 추구하는 공동체 */}
        <section>
          <h2 className="font-nanum-extrabold text-2xl sm:text-3xl text-[#2E7D32] mb-6 sm:mb-8">일광교회가 추구하는 공동체</h2>
          <div className="grid xl:grid-cols-2 gap-4">
            {communities.map((c) => (
              <div key={c.name} className="flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#A5D6A7] hover:shadow-md transition-all">
                <div className="shrink-0 flex items-start pt-1">
                  <c.Icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#2E7D32]" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="font-nanum-extrabold text-lg sm:text-xl text-gray-800">{c.name}</h3>
                    <span className="text-sm text-[#2E7D32] font-nanum-bold break-keep">/ {c.desc}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm break-keep">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
