"use client";
import { useState } from "react";
import { CalendarDays, MapPin, Clock, Users, ChevronRight, Plus } from "lucide-react";

const CATEGORIES = ["전체", "예배", "특별집회", "청년부", "교육", "기도"];

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
    desc: "교단 연합으로 드리는 부활절 특별 예배입니다. 부활의 기쁨을 온 성도가 함께 나눠요. 가족과 함께 오세요.",
    participants: 0,
    capacity: 300,
    image: "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=800&q=80",
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
    desc: "4일간 진행되는 봄 부흥성회입니다. 강사: 김부흥 목사님. 말씀의 은혜 속에 영적 부흥을 경험하세요.",
    participants: 87,
    capacity: 300,
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80",
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
    desc: "1박 2일 청년부 수련회 등록 마감일입니다. 함께 말씀과 기도로 하나님을 더 깊이 만나는 시간입니다. 서두르세요!",
    participants: 38,
    capacity: 50,
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
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
    desc: "소그룹을 건강하게 이끌 리더를 위한 집중 훈련 과정입니다. 그룹 역동성과 목양 원리를 배웁니다.",
    participants: 15,
    capacity: 30,
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80",
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
    desc: "어버이날을 앞두고 자녀를 위해 함께 기도하는 어머니 기도회입니다. 엄마들의 뜨거운 기도를 함께 드려요.",
    participants: 42,
    capacity: 80,
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 6,
    title: "어린이 성경학교",
    category: "교육",
    categoryColor: "bg-green-100 text-green-700",
    date: "2026-08-01",
    dateDisplay: "8월 예정",
    time: "오전 10:00 ~ 오후 4:00",
    location: "교육관 전체",
    desc: "여름방학 어린이 신앙 교육 프로그램입니다. 말씀, 찬양, 만들기, 야외 활동 등 다양한 프로그램으로 구성됩니다.",
    participants: 0,
    capacity: 60,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
];

const STATS = [
  { label: "이번 달 행사", value: "5", unit: "개" },
  { label: "총 참가 신청", value: "182", unit: "명" },
  { label: "이번 주 예정", value: "2", unit: "개" },
  { label: "등록 가능", value: "4", unit: "개" },
];

export default function EventsPage() {
  const [category, setCategory] = useState("전체");

  const filtered = category === "전체" ? EVENTS : EVENTS.filter(e => e.category === category);
  const featured = EVENTS.filter(e => e.featured);

  return (
    <div className="space-y-6">
      {/* 히어로 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=1400&q=80"
          alt="행사안내"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/90 to-[#2E7D32]/60" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-6 h-6" /> 행사안내
              </h1>
              <p className="text-green-200 text-sm mt-0.5">일광교회 2026년 상반기 행사 일정</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors border border-white/30">
              <Plus className="w-4 h-4" /> 행사 등록
            </button>
          </div>
          <p className="text-white/80 text-xs max-w-lg">
            다가오는 교회 행사와 일정을 확인하고 미리 준비하세요 — 부활절 연합예배, 봄 부흥성회, 각 부서 행사
          </p>
        </div>
      </div>

      {/* 통계 4칸 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#2E7D32]">
              {s.value}<span className="text-sm font-normal text-gray-500 ml-0.5">{s.unit}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 주요 행사 — 2열 큰 카드 */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">주요 행사</h2>
        <div className="grid lg:grid-cols-2 gap-5">
          {featured.map(event => (
            <div key={event.id} className="relative rounded-2xl overflow-hidden h-60 cursor-pointer group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mb-2 inline-block ${event.categoryColor}`}>
                  {event.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                <p className="text-white/75 text-xs mb-3 line-clamp-2">{event.desc}</p>
                <div className="flex flex-wrap gap-3 text-xs text-white/80">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{event.dateDisplay}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                </div>
                {event.capacity > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-white/70 mb-1">
                      <span>참가 신청 현황</span>
                      <span>{event.participants}/{event.capacity}명</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div
                        className="bg-white h-1 rounded-full"
                        style={{ width: `${(event.participants / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 + 전체 일정 카드 그리드 */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-gray-900">전체 일정</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  category === c
                    ? "bg-[#2E7D32] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${event.categoryColor}`}>
                    {event.category}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">{event.dateDisplay}</span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#2E7D32] transition-colors mb-1.5 leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{event.desc}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-50 pt-2">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                  {event.participants > 0 && (
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.participants}명</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#2E7D32] ml-auto transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="relative rounded-2xl overflow-hidden h-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80"
          alt="행사 문의"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1B5E20]/80" />
        <div className="relative z-10 p-6 flex items-center justify-between h-full">
          <div>
            <p className="text-green-200 text-sm font-semibold mb-1">📣 행사 문의</p>
            <h3 className="text-white text-lg font-bold">행사 참가 신청이나 문의가 있으신가요?</h3>
            <p className="text-green-100 text-sm">담당 부서 또는 교회 사무실로 연락해 주세요</p>
          </div>
          <button className="shrink-0 px-5 py-2.5 bg-white text-[#2E7D32] rounded-xl font-bold text-sm hover:bg-green-50 transition-colors">
            상담 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}
