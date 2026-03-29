import { Metadata } from "next";

export const metadata: Metadata = {
  title: "주일학교",
  description: "일광교회 주일학교 — 유치부 및 아동부 소개",
};

export default function SundaySchoolPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-yellow-100 text-sm mb-3 tracking-widest uppercase">Sunday School</p>
          <h1 className="text-4xl font-bold mb-4">주일학교</h1>
          <p className="text-yellow-100 text-lg">하나님을 경험하며 자라는 유치부 · 아동부</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-yellow-50 rounded-2xl p-8">
              <div className="text-4xl mb-3">🌸</div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">유치부 (5~7세)</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                하나님의 사랑을 놀이와 찬양으로 처음 배우는 시간입니다.
                매 주일 흥미로운 성경 이야기와 찬양, 공작 활동을 통해
                어린이들이 하나님과의 관계를 자연스럽게 시작합니다.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>📅 주일 오전 11:00</li>
                <li>📍 유치부실 (본관 2층)</li>
                <li>👩‍🏫 담당 교역자 별도 운영</li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-2xl p-8">
              <div className="text-4xl mb-3">📚</div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">아동부 (초등학교 1~6학년)</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                성경의 이야기를 체계적으로 배우며 신앙의 기초를 다집니다.
                저학년(1~3학년)과 고학년(4~6학년)으로 나뉘어 연령에 맞는
                교육이 이루어집니다.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>📅 주일 오전 11:00</li>
                <li>📍 교육관 101·102호</li>
                <li>👩‍🏫 담당 전도사 2인 운영</li>
              </ul>
            </div>
          </div>

          {/* 프로그램 */}
          <h2 className="text-2xl font-bold text-center mb-8">주요 프로그램</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "✏️", title: "주일 공과 교육", desc: "성경 중심 주일 공과 학습" },
              { icon: "🎵", title: "어린이 찬양대", desc: "매 주일 찬양 훈련 및 특송" },
              { icon: "🏕️", title: "여름 VBS", desc: "매년 7월 성경학교 개최" },
              { icon: "🎄", title: "절기 예배", desc: "부활절·추수감사절·성탄절 특별 예배" },
            ].map((p) => (
              <div key={p.title} className="text-center bg-gray-50 rounded-xl p-5">
                <div className="text-3xl mb-2">{p.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{p.title}</h3>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
