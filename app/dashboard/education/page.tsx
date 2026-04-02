"use client";
import { GraduationCap, Clock, Users, ChevronRight } from "lucide-react";

const PROGRAMS = [
  {
    category: "새가족",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    items: [
      { title: "새가족 교육", desc: "교회 소개 및 신앙 기초 과정", duration: "4주", participants: 12, schedule: "매주 일요일 오후 2시" },
      { title: "세례 교육",   desc: "세례를 준비하는 기초 교육",  duration: "6주", participants: 8,  schedule: "격주 토요일 오전 10시" },
    ],
  },
  {
    category: "장년",
    color: "bg-green-50 text-green-700 border-green-100",
    items: [
      { title: "제자훈련",    desc: "성숙한 그리스도인을 위한 훈련", duration: "12주", participants: 24, schedule: "매주 수요일 오후 7시" },
      { title: "소그룹 리더 훈련", desc: "소그룹을 이끌기 위한 리더십 교육", duration: "8주", participants: 15, schedule: "매주 금요일 오후 7시" },
    ],
  },
  {
    category: "청년",
    color: "bg-purple-50 text-purple-700 border-purple-100",
    items: [
      { title: "청년 성경공부", desc: "청년을 위한 심화 성경 연구", duration: "진행중", participants: 31, schedule: "매주 토요일 오후 4시" },
    ],
  },
  {
    category: "어린이·청소년",
    color: "bg-amber-50 text-amber-700 border-amber-100",
    items: [
      { title: "어린이 성경학교", desc: "여름방학 어린이 신앙 교육", duration: "1주(집중)", participants: 45, schedule: "8월 예정" },
      { title: "청소년 수련회",   desc: "중·고등부 신앙 캠프",      duration: "2박 3일",    participants: 38, schedule: "7월 예정" },
    ],
  },
];

export default function EducationPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#2E7D32]" /> 교회교육
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">일광교회 신앙 교육 프로그램 안내</p>
      </div>

      {PROGRAMS.map((prog) => (
        <div key={prog.category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${prog.color}`}>{prog.category}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {prog.items.map((item) => (
              <div key={item.title} className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  <p className="text-xs text-gray-400 mt-2">{item.schedule}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" /> {item.participants}명 참여 중
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2E7D32] transition-colors shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
