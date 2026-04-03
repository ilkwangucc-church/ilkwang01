"use client";
import { GraduationCap, Clock, Users, ChevronRight, BookOpen, Star } from "lucide-react";

const PROGRAMS = [
  {
    category: "새가족",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    badgeBg: "bg-blue-600",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    items: [
      { title: "새가족 교육", desc: "교회 소개 및 신앙 기초 과정으로, 일광교회의 역사와 비전, 신앙의 기초를 함께 배웁니다.", duration: "4주", participants: 12, schedule: "매주 일요일 오후 2시", status: "등록중" },
      { title: "세례 교육",   desc: "세례를 준비하는 기초 교육 과정입니다. 세례의 의미와 신앙 고백을 깊이 있게 다룹니다.", duration: "6주", participants: 8,  schedule: "격주 토요일 오전 10시", status: "등록중" },
    ],
  },
  {
    category: "장년",
    color: "bg-green-50 text-green-700 border-green-100",
    badgeBg: "bg-green-600",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80",
    items: [
      { title: "제자훈련",    desc: "성숙한 그리스도인으로 성장하기 위한 체계적인 훈련 과정입니다. 말씀과 기도, 전도와 사역을 균형 있게 배웁니다.", duration: "12주", participants: 24, schedule: "매주 수요일 오후 7시", status: "진행중" },
      { title: "소그룹 리더 훈련", desc: "소그룹을 건강하게 이끌기 위한 리더십 교육입니다. 그룹 역동성, 나눔 진행법, 목양 원리를 다룹니다.", duration: "8주", participants: 15, schedule: "매주 금요일 오후 7시", status: "등록중" },
    ],
  },
  {
    category: "청년",
    color: "bg-purple-50 text-purple-700 border-purple-100",
    badgeBg: "bg-purple-600",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80",
    items: [
      { title: "청년 성경공부", desc: "청년을 위한 심화 성경 연구 과정입니다. 구약과 신약을 주제별로 깊이 탐구하며 신앙의 깊이를 더합니다.", duration: "진행중", participants: 31, schedule: "매주 토요일 오후 4시", status: "진행중" },
    ],
  },
  {
    category: "어린이·청소년",
    color: "bg-amber-50 text-amber-700 border-amber-100",
    badgeBg: "bg-amber-500",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
    items: [
      { title: "어린이 성경학교", desc: "여름방학 어린이 신앙 교육 프로그램입니다. 말씀, 찬양, 만들기, 야외 활동 등 다양한 프로그램으로 구성됩니다.", duration: "1주(집중)", participants: 45, schedule: "8월 예정", status: "예정" },
      { title: "청소년 수련회",   desc: "중·고등부 신앙 캠프입니다. 또래와 함께 말씀과 예배, 친교를 통해 하나님을 더 깊이 만나는 시간입니다.", duration: "2박 3일", participants: 38, schedule: "7월 예정", status: "예정" },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  "등록중": "bg-green-100 text-green-700",
  "진행중": "bg-blue-100 text-blue-700",
  "예정":   "bg-gray-100 text-gray-600",
};

const HIGHLIGHTS = [
  { emoji: "🎓", title: "6개 교육 과정", desc: "체계적인 신앙 훈련" },
  { emoji: "👥", title: "163명 참여 중", desc: "함께 성장하는 성도들" },
  { emoji: "📅", title: "주 3회 운영", desc: "유연한 일정 선택" },
  { emoji: "🏆", title: "수료증 발급", desc: "완료 후 수료증 수여" },
];

export default function EducationPage() {
  return (
    <div className="space-y-6">
      {/* 히어로 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80"
          alt="교육"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a237e]/85 to-[#283593]/65" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
            <GraduationCap className="w-6 h-6" /> 교회교육
          </h1>
          <p className="text-blue-200 text-sm">일광교회 신앙 교육 프로그램 · 2026년 상반기</p>
          <p className="text-white/80 text-xs mt-2 max-w-lg">
            말씀 위에 세워지는 신앙 — 새가족부터 장년, 청년, 어린이·청소년까지 단계별 교육 과정을 운영합니다
          </p>
        </div>
      </div>

      {/* 하이라이트 4칸 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {HIGHLIGHTS.map((h, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <span className="text-3xl block mb-2">{h.emoji}</span>
            <p className="font-bold text-gray-900 text-sm">{h.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{h.desc}</p>
          </div>
        ))}
      </div>

      {/* 카테고리별 프로그램 — 2컬럼 그리드 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {PROGRAMS.map((prog) => (
          <div key={prog.category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* 카드 상단 이미지 */}
            <div className="relative h-28 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={prog.image} alt={prog.category} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${prog.badgeBg}`}>
                  {prog.category}
                </span>
                <span className="text-white text-xs">{prog.items.length}개 과정</span>
              </div>
            </div>
            {/* 프로그램 목록 */}
            <div className="divide-y divide-gray-50">
              {prog.items.map((item) => (
                <div key={item.title} className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors">{item.title}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2E7D32] transition-colors shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">{item.desc}</p>
                  <p className="text-xs text-[#2E7D32] font-medium mb-2">{item.schedule}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" /> {item.participants}명 참여 중
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-amber-400" /> 4.9
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 CTA 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1400&q=80"
          alt="교육 신청"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2E7D32]/80" />
        <div className="relative z-10 p-6 flex items-center justify-between h-full">
          <div>
            <p className="text-green-200 text-sm font-semibold mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> 교육 문의
            </p>
            <h3 className="text-white text-lg font-bold">교육에 대해 더 궁금하신가요?</h3>
            <p className="text-green-100 text-sm">교육부 담당자에게 직접 문의해 보세요</p>
          </div>
          <button className="shrink-0 px-5 py-2.5 bg-white text-[#2E7D32] rounded-xl font-bold text-sm hover:bg-green-50 transition-colors">
            교육 신청하기
          </button>
        </div>
      </div>
    </div>
  );
}
