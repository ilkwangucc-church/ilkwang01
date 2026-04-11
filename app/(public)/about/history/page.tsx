import { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { ABOUT_NAV } from "@/components/ui/StickySubNav";

export const metadata: Metadata = {
  title: "교회역사",
  description: "1971년 설립된 일광교회의 역사와 발자취를 소개합니다.",
};

const timeline = [
  { year: "1971", event: "일광교회 창립 (초대 담임: 故 이광수 목사)", detail: "서울 성북구 돈암동 지역에서 10여 명의 성도와 함께 첫 예배를 드림" },
  { year: "1975", event: "현 예배당 부지 매입", detail: "성도들의 헌신과 봉사로 현재 위치에 예배당 터를 마련함" },
  { year: "1980", event: "제1 교육관 건립", detail: "주일학교 및 소그룹 모임 공간 확보, 교육 사역 강화" },
  { year: "1985", event: "대한예수교장로회(합동) 노회 가입", detail: "정통 개혁주의 신앙을 바탕으로 합동 노회 공식 가입" },
  { year: "1990", event: "성도 500명 돌파 및 본당 증축", detail: "급속한 부흥으로 예배당 공간 부족, 본당 대대적 확장 공사 진행" },
  { year: "1995", event: "해외선교사 최초 파송", detail: "동남아시아 지역에 첫 선교사 파송, 세계 선교의 문을 열다" },
  { year: "2000", event: "창립 30주년 기념 감사예배", detail: "30년의 역사를 감사하며 새천년 비전 선포 예배 드림" },
  { year: "2005", event: "제2 교육관 및 다목적홀 건립", detail: "각 부서 전용 공간과 지역 사회를 위한 다목적 공간 완공" },
  { year: "2010", event: "창립 40주년 — '섬기는 교회' 비전 선포", detail: "지역 사회와 함께하는 섬김의 교회로 새 비전을 선포" },
  { year: "2015", event: "온라인 예배 시스템 도입 (유튜브 생중계)", detail: "전국 및 해외 성도들과 함께하는 온라인 예배 환경 구축" },
  { year: "2019", event: "해외 선교지 7개국 파송 사역 확대", detail: "아시아·아프리카·중남미 등 7개국 20여 명의 선교사 지원" },
  { year: "2021", event: "창립 50주년 — '하나님 나라의 전진' 기념예배", detail: "반세기를 넘어 다음세대에게 신앙의 유산을 전수하는 교회로 헌신" },
  { year: "2024", event: "홈페이지 리뉴얼 및 디지털 사역 강화", detail: "시대의 변화에 발맞춰 디지털 교회 사역 인프라를 새롭게 구축" },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <PageHero label="History" title="교회역사" subtitle="1971년부터 지금까지 — 하나님의 신실하심으로 걸어온 발자취" image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&auto=format&fit=crop&q=80" />
      <StickySubNav items={ABOUT_NAV} />

      {/* 타임라인 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="relative">
            {/* 중앙선 */}
            <div className="absolute left-[80px] top-0 bottom-0 w-0.5 bg-[#2E7D32]/20 hidden md:block" />

            <div className="grid xl:grid-cols-2 xl:gap-x-16 gap-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  {/* 연도 */}
                  <div className="shrink-0 w-20 text-right">
                    <span className="text-[#2E7D32] font-bold text-lg">{item.year}</span>
                  </div>
                  {/* 점 */}
                  <div className="shrink-0 hidden md:flex w-4 h-4 rounded-full bg-[#2E7D32] mt-1.5 relative z-10" />
                  {/* 내용 */}
                  <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-1">{item.event}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 마무리 */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="w-12 h-0.5 bg-[#2E7D32] mx-auto mb-6" />
          <p className="text-gray-700 leading-relaxed text-lg">
            일광교회는 반세기가 넘는 역사 속에서 <strong>오직 하나님의 은혜</strong>로
            성장해 왔습니다.<br />
            앞으로도 말씀과 기도, 전도와 선교의 사명을 붙잡고<br />
            다음세대에게 귀한 신앙의 유산을 전수하겠습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
