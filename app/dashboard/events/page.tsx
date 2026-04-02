"use client";
import { CalendarDays, MapPin, Clock, Users, ChevronRight } from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "부활절 연합예배",
    category: "예배",
    categoryColor: "bg-blue-100 text-blue-700",
    date: "2026-04-10",
    dateDisplay: "4월 10일 (목)",
    time: "오전 11:00",
    location: "본당",
    desc: "교단 연합으로 드리는 부활절 특별 예배입니다. 가족과 함께 오세요.",
    participants: 0,
    capacity: 300,
    featured: true,
  },
  {
    id: 2,
    title: "봄 부흥성회",
    category: "특별집회",
    categoryColor: "bg-amber-100 text-amber-700",
    date: "2026-04-20",
    dateDisplay: "4월 20일 ~ 23일",
    time: "저녁 7:30",
    location: "본당",
    desc: "4일간 진행되는 봄 부흥성회. 강사: 김부흥 목사님",
    participants: 87,
    capacity: 300,
    featured: true,
  },
  {
    id: 3,
    title: "청년부 수련회",
    category: "청년부",
    categoryColor: "bg-purple-100 text-purple-700",
    date: "2026-04-15",
    dateDisplay: "4월 15일 (화) 마감",
    time: "등록 마감",
    location: "강원도 속초",
    desc: "1박 2일 청년부 수련회 등록 마감일입니다. 서두르세요!",
    participants: 38,
    capacity: 50,
    featured: false,
  },
  {
    id: 4,
    title: "소그룹 리더 훈련",
    category: "교육",
    categoryColor: "bg-green-100 text-green-700",
    date: "2026-04-25",
    dateDisplay: "4월 25일 (토)",
    time: "오전 10:00",
    location: "교육관 2층",
    desc: "소그룹을 이끌 리더를 위한 집중 훈련 과정입니다.",
    participants: 15,
    capacity: 30,
    featured: false,
  },
  {
    id: 5,
    title: "어머니 기도회",
    category: "기도",
    categoryColor: "bg-rose-100 text-rose-700",
    date: "2026-05-02",
    dateDisplay: "5월 2일 (토)",
    time: "오전 10:00",
    location: "소강당",
    desc: "어버이날을 앞두고 자녀를 위해 함께 기도하는 어머니 기도회",
    participants: 42,
    capacity: 80,
    featured: false,
  },
];

export default function EventsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-[#2E7D32]" /> 행사안내
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">다가오는 교회 행사와 일정을 확인하세요</p>
      </div>

      {/* 주요 행사 */}
      <div className="space-y-4">
        {EVENTS.filter(e => e.featured).map(event => (
          <div key={event.id} className="bg-gradient-to-r from-[#2E7D32] to-[#43A047] rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">{event.category}</span>
              <ChevronRight className="w-4 h-4 text-white/60" />
            </div>
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-green-100 text-sm mb-4">{event.desc}</p>
            <div className="flex flex-wrap gap-4 text-sm text-green-100">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{event.dateDisplay}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{event.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
            </div>
            {event.capacity > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-green-200 mb-1">
                  <span>참가 신청</span>
                  <span>{event.participants}/{event.capacity}명</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${(event.participants / event.capacity) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 일반 행사 목록 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">전체 일정</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {EVENTS.map(event => (
            <div key={event.id} className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-14 text-center shrink-0 bg-gray-50 rounded-xl p-2">
                <p className="text-lg font-bold text-gray-900 leading-none">{event.dateDisplay.split(" ")[0]}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{event.dateDisplay.split(" ")[1] || ""}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors">{event.title}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${event.categoryColor}`}>{event.category}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                  {event.participants > 0 && (
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.participants}명</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2E7D32] transition-colors shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
