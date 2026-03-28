import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "담임목사",
  description: "일광교회 담임목사 소개 및 목회 철학",
};

export default function PastorPage() {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <section className="bg-[#2E7D32] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-green-200 text-sm mb-3 tracking-widest uppercase">Senior Pastor</p>
          <h1 className="text-4xl font-bold mb-4">담임목사</h1>
          <p className="text-green-100 text-lg">하나님 말씀으로 양떼를 인도하는 목자</p>
        </div>
      </section>

      {/* 목사 소개 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 사진 */}
            <div className="flex justify-center">
              <div className="relative w-72 h-96 rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                <Image
                  src="/pastor.jpg"
                  alt="담임목사"
                  fill
                  className="object-cover"
                  onError={undefined}
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent">
                  <div className="p-6 text-white">
                    <p className="text-xl font-bold">이 목 사</p>
                    <p className="text-sm text-gray-200">일광교회 담임목사</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 소개 텍스트 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">담임목사 인사말</h2>
              <div className="w-10 h-1 bg-[#2E7D32] mb-6" />
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  사랑하는 성도 여러분, 그리고 이 페이지를 방문해 주신 모든 분들께
                  주님의 이름으로 인사드립니다.
                </p>
                <p>
                  일광교회는 <strong>대한예수교장로회(합동)</strong> 소속으로,
                  1971년 창립 이래 <strong>하나님 중심 · 성경 중심 · 교회 중심</strong>의
                  신앙 위에 세워진 교회입니다.
                  우리는 종교개혁의 정신을 이어받아 오직 성경, 오직 믿음, 오직 은혜,
                  오직 그리스도, 오직 하나님께 영광이라는 다섯 가지 '솔라'를 고백하며
                  예배드립니다.
                </p>
                <p>
                  저는 이 교회의 강단에 서면서 한 가지 소망을 품습니다.
                  바로 <em>"성도 한 사람 한 사람이 하나님의 말씀 앞에 바르게 서는 것"</em>입니다.
                  말씀이 선포될 때 성령께서 역사하시고, 그 역사가 가정과 일터와 이 지역 사회를
                  변화시키리라 믿습니다.
                </p>
                <p>
                  일광교회 문은 언제나 열려 있습니다.
                  믿음이 있든 없든, 삶의 무게로 지쳐 있든,
                  기쁨을 나누고 싶든 — 누구든지 오십시오.
                  이곳에서 참된 쉼과 소망을 발견하시길 기도합니다.
                </p>
                <p className="text-right font-bold text-[#2E7D32] text-lg mt-4">
                  일광교회 담임목사 올림
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 학력 및 경력 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">학력 및 경력</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#2E7D32] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs">학</span>
                학력
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>총신대학교 신학과 졸업 (B.A.)</li>
                <li>총신대학교 신학대학원 졸업 (M.Div.)</li>
                <li>합동신학대학원대학교 목회학 박사 수료 (D.Min.)</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#2E7D32] mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs">경</span>
                경력
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>전) 서울동노회 청년부 연합 수련회 강사</li>
                <li>전) 합동 총회 국내선교부 협력 목사</li>
                <li>현) 일광교회 담임목사</li>
                <li>현) 성북노회 임원</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 목회 철학 */}
      <section className="py-16 bg-[#1B5E20] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-10">목회 철학</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "말씀 중심", desc: "성경 66권이 우리 신앙과 삶의 유일한 규범임을 믿으며, 강해 설교를 통해 하나님의 뜻을 선포합니다." },
              { title: "기도의 교회", desc: "새벽마다 무릎 꿇어 기도하며, 기도의 향연이 끊이지 않는 교회를 세워가겠습니다." },
              { title: "선교하는 공동체", desc: "이웃을 사랑하고 열방을 품는 교회로서, 지역 사회와 세계 선교를 함께 감당합니다." },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6">
                <h3 className="font-bold text-[#F9A825] text-lg mb-3">{item.title}</h3>
                <p className="text-green-100 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
