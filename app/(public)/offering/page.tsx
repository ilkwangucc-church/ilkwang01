import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "온라인헌금",
  description: "일광교회 온라인 헌금 안내 - 계좌이체 정보",
};

const accounts = [
  { bank: "국민은행", number: "000-00-0000-000", name: "일광교회", purpose: "십일조/감사헌금" },
  { bank: "신한은행", number: "000-000-000000", name: "일광교회", purpose: "건축헌금" },
  { bank: "우리은행", number: "000-000000-00-000", name: "일광교회", purpose: "선교헌금" },
];

const offeringTypes = [
  { name: "십일조", desc: "수입의 십분의 일을 하나님께 드리는 헌금입니다.", icon: "🔟" },
  { name: "감사헌금", desc: "하나님의 은혜에 감사하여 드리는 헌금입니다.", icon: "🙏" },
  { name: "건축헌금", desc: "성전 건축을 위해 드리는 헌금입니다.", icon: "⛪" },
  { name: "선교헌금", desc: "국내외 선교 사역을 위한 헌금입니다.", icon: "🌍" },
  { name: "구제헌금", desc: "어려운 이웃을 돕기 위한 헌금입니다.", icon: "❤️" },
  { name: "교육헌금", desc: "다음세대 교육을 위한 헌금입니다.", icon: "📚" },
];

export default function OfferingPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#F9A825] text-sm font-nanum-bold tracking-widest uppercase mb-2">Online Offering</p>
          <h1 className="font-nanum-extrabold text-4xl md:text-5xl">온라인 헌금</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 안내 말씀 */}
        <div className="bg-[#E8F5E9] rounded-2xl p-8 mb-12 text-center">
          <p className="text-4xl mb-4">🙏</p>
          <blockquote className="font-nanum-extrabold text-xl text-gray-800 mb-2">
            "각각 그 마음에 정한 대로 할 것이요 인색함으로나 억지로 하지 말지니 하나님은 즐겨 내는 자를 사랑하시느니라"
          </blockquote>
          <p className="text-[#2E7D32] font-nanum-bold">고린도후서 9:7</p>
        </div>

        {/* 계좌 안내 */}
        <section className="mb-12">
          <h2 className="font-nanum-extrabold text-2xl text-gray-800 mb-6">계좌 안내</h2>
          <div className="space-y-4">
            {accounts.map((a) => (
              <div key={a.bank} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-nanum-extrabold text-lg text-gray-800">{a.bank}</p>
                  <p className="text-[#2E7D32] font-nanum-bold text-xl">{a.number}</p>
                  <p className="text-gray-500 text-sm mt-1">예금주: {a.name}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-sm font-nanum-bold rounded-full">
                    {a.purpose}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 헌금 종류 */}
        <section className="mb-12">
          <h2 className="font-nanum-extrabold text-2xl text-gray-800 mb-6">헌금 종류</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {offeringTypes.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-[#A5D6A7] transition-colors text-center">
                <div className="text-3xl mb-2">{t.icon}</div>
                <h3 className="font-nanum-extrabold text-gray-800 mb-1">{t.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 안내사항 */}
        <section className="bg-[#FFFDE7] rounded-2xl p-6">
          <h3 className="font-nanum-extrabold text-lg text-gray-800 mb-4">📌 헌금 이체 안내</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• 이체 시 <strong>성함과 헌금 종류</strong>를 메모란에 입력해 주세요. (예: 홍길동 십일조)</li>
            <li>• 헌금 영수증이 필요하신 분은 교회 사무실에 문의해 주세요.</li>
            <li>• 문의: <a href="tel:02-927-0691" className="text-[#2E7D32] font-nanum-bold">02-927-0691</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
