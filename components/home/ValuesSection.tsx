const values = [
  {
    icon: "🙏",
    title: "예배공동체",
    subtitle: "하나님을 위하여 존재하는 공동체",
    desc: "온 마음과 정성을 다해 살아계신 하나님께 예배드립니다. 주일 예배는 우리 신앙 생활의 중심입니다.",
  },
  {
    icon: "📖",
    title: "훈련공동체",
    subtitle: "성도를 말씀으로 세우는 공동체",
    desc: "성경 말씀을 통해 예수 그리스도의 제자로 훈련받고 성장하는 공동체를 추구합니다.",
  },
  {
    icon: "❤️",
    title: "치유공동체",
    subtitle: "가정과 사회를 변화시키는 공동체",
    desc: "상처받은 영혼을 품고, 가정을 회복시키며, 지역사회에 하나님의 사랑을 전합니다.",
  },
  {
    icon: "🌍",
    title: "선교공동체",
    subtitle: "땅 끝까지 복음을 전하는 공동체",
    desc: "국내외 선교를 통해 하나님 나라를 확장하고 열방을 향한 선교 사명을 감당합니다.",
  },
];

export default function ValuesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[#2E7D32] text-sm font-nanum-bold tracking-widest uppercase mb-2">Our Values</p>
          <h2 className="font-nanum-extrabold text-3xl md:text-4xl text-gray-800 mb-3">
            일광교회가 추구하는 공동체
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            일광교회의 사명과 비전입니다
          </p>
          <div className="w-12 h-1 bg-[#F9A825] mx-auto rounded-full mt-3" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-[#A5D6A7] transition-all group"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-nanum-extrabold text-xl text-gray-800 mb-1">{v.title}</h3>
              <p className="text-[#2E7D32] text-xs font-nanum-bold mb-3">{v.subtitle}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              <div className="w-8 h-0.5 bg-[#F9A825] mt-4 group-hover:w-16 transition-all rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
