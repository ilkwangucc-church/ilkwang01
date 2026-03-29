import { Metadata } from "next";
import { Calendar, MapPin, Clock } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "행사안내",
  description: "일광교회 각종 행사 및 일정 안내",
};

const events = [
  {
    id: 1,
    title: "2024 봄 부흥성회",
    date: "2024-04-15 ~ 2024-04-17",
    time: "오전 10:30 / 오후 7:30",
    location: "일광교회 본당",
    category: "부흥회",
    desc: "말씀의 불길이 다시 타오르는 3일 부흥성회입니다. 강사: 서울신학교 김영수 교수. 온 가족이 함께 참여하여 영적 충전의 시간을 가지시기 바랍니다.",
    highlight: true,
  },
  {
    id: 2,
    title: "청년부 수련회 '거룩한 동행'",
    date: "2024-04-26 ~ 2024-04-28",
    time: "금요일 저녁 출발",
    location: "강원도 양평 수련원",
    category: "청년부",
    desc: "2024년 청년부 봄 수련회를 개최합니다. 이번 주제는 '거룩한 동행'으로, 함께 성경을 묵상하고 서로의 믿음을 세워가는 시간이 될 것입니다.",
    highlight: false,
  },
  {
    id: 3,
    title: "어린이날 주일 특별예배",
    date: "2024-05-05",
    time: "오전 11:00",
    location: "일광교회 본당",
    category: "어린이",
    desc: "주일학교 어린이들을 위한 특별예배로 진행됩니다. 어린이 찬양 발표, 선물 증정, 특별 프로그램이 준비되어 있습니다.",
    highlight: false,
  },
  {
    id: 4,
    title: "선교사 초청 강연",
    date: "2024-05-12",
    time: "주일 2부 예배 후 (오후 1:00)",
    location: "교육관 대강당",
    category: "선교",
    desc: "필리핀에서 사역 중인 박선교 선교사 초청 강연. 해외 선교의 현장을 생생하게 전합니다. 선교 후원에 관심 있는 분들의 많은 참석을 바랍니다.",
    highlight: false,
  },
  {
    id: 5,
    title: "성경 통독 완주 기념 예배",
    date: "2024-05-19",
    time: "주일 3부 예배 (오후 1:30)",
    location: "일광교회 본당",
    category: "교육",
    desc: "올해 성경 통독 모임 완주자를 축하하는 특별 예배입니다. 1년간 함께 성경을 통독한 성도들이 하나님 앞에 감사를 드리는 자리입니다.",
    highlight: false,
  },
  {
    id: 6,
    title: "여름 VBS (Vacation Bible School)",
    date: "2024-07-22 ~ 2024-07-26",
    time: "오전 9:00 ~ 오후 12:00",
    location: "일광교회 교육관 전체",
    category: "어린이",
    desc: "유치부~초등부 어린이를 위한 여름 성경학교. 말씀, 찬양, 놀이, 공작 활동으로 가득한 5일간의 신앙 캠프에 초대합니다. 지역 어린이 누구나 참가 가능합니다.",
    highlight: false,
  },
];

const categoryColors: Record<string, string> = {
  부흥회: "bg-red-100 text-red-700",
  청년부: "bg-blue-100 text-blue-700",
  어린이: "bg-yellow-100 text-yellow-700",
  선교: "bg-green-100 text-green-700",
  교육: "bg-purple-100 text-purple-700",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <PageHero label="Events" title="행사안내" subtitle="일광교회의 다양한 행사와 모임에 초대합니다" image="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1800&auto=format&fit=crop&q=80" />

      {/* 행사 목록 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                event.highlight ? "border-[#2E7D32] ring-1 ring-[#2E7D32]/30" : "border-gray-100"
              }`}
            >
              {event.highlight && (
                <div className="bg-[#2E7D32] text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FFC107] rounded-full animate-pulse" />
                  주요 행사
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${categoryColors[event.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {event.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.desc}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#2E7D32]" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#2E7D32]" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#2E7D32]" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
