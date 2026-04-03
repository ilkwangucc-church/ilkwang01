"use client";
import { useState } from "react";
import { BookText, CheckCircle2, Circle, ChevronDown, ChevronRight, Flame, Target } from "lucide-react";

const PLAN = [
  {
    month: "1월", books: [
      { name: "창세기",       chapters: 50, done: 50 },
      { name: "출애굽기",     chapters: 40, done: 40 },
      { name: "레위기",       chapters: 27, done: 27 },
    ],
  },
  {
    month: "2월", books: [
      { name: "민수기",       chapters: 36, done: 36 },
      { name: "신명기",       chapters: 34, done: 34 },
    ],
  },
  {
    month: "3월", books: [
      { name: "여호수아",     chapters: 24, done: 24 },
      { name: "사사기",       chapters: 21, done: 21 },
      { name: "룻기",         chapters: 4,  done: 4 },
    ],
  },
  {
    month: "4월", books: [
      { name: "사무엘상",     chapters: 31, done: 12 },
      { name: "사무엘하",     chapters: 24, done: 0 },
    ],
  },
  {
    month: "5월", books: [
      { name: "열왕기상",     chapters: 22, done: 0 },
      { name: "열왕기하",     chapters: 25, done: 0 },
    ],
  },
  {
    month: "6월", books: [
      { name: "역대상",       chapters: 29, done: 0 },
      { name: "역대하",       chapters: 36, done: 0 },
    ],
  },
  {
    month: "7월", books: [
      { name: "에스라",       chapters: 10, done: 0 },
      { name: "느헤미야",     chapters: 13, done: 0 },
      { name: "에스더",       chapters: 10, done: 0 },
    ],
  },
];

const TODAY_READING = { book: "사무엘상", chapter: 13, verse: "1~23", summary: "사울의 불순종과 하나님의 뜻" };

const WEEKLY_VERSES = [
  { day: "월", text: "주께서 내 앞에 상을 베푸시고", ref: "시 23:5" },
  { day: "화", text: "내 평생에 선하심과 인자하심이 반드시 나를 따르리니", ref: "시 23:6" },
  { day: "수", text: "사무엘상 13장 읽기", ref: "13:1~23" },
  { day: "목", text: "사무엘상 14장 읽기", ref: "14:1~52" },
  { day: "금", text: "사무엘상 15장 읽기", ref: "15:1~35" },
  { day: "토", text: "사무엘상 16장 읽기", ref: "16:1~23" },
  { day: "일", text: "주일 예배 — 말씀 묵상", ref: "담임목사" },
];

const TIPS = [
  { emoji: "📖", title: "꾸준히 읽기", desc: "하루 3~4장씩 읽으면 1년에 성경을 완독할 수 있습니다." },
  { emoji: "✏️", title: "필사하기", desc: "마음에 와닿는 구절을 노트에 적으면 더 깊이 새겨집니다." },
  { emoji: "🙏", title: "기도로 시작", desc: "읽기 전 짧은 기도로 마음을 열고 시작해 보세요." },
  { emoji: "👥", title: "함께 나누기", desc: "소그룹에서 오늘 읽은 말씀을 나누면 더욱 풍성해집니다." },
];

export default function BiblePage() {
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({ "4월": true });
  const [checked, setChecked] = useState(false);

  const totalChapters = PLAN.flatMap(m => m.books).reduce((a, b) => a + b.chapters, 0);
  const doneChapters  = PLAN.flatMap(m => m.books).reduce((a, b) => a + b.done, 0);
  const progress = Math.round((doneChapters / totalChapters) * 100);

  return (
    <div className="space-y-6">
      {/* 헤더 + 히어로 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5dc5?auto=format&fit=crop&w=1400&q=80"
          alt="성경"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1B5E20]/80" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookText className="w-6 h-6" /> 성경통독
            </h1>
            <p className="text-green-200 text-sm mt-0.5">2026년 연간 통독 계획 · 1월 1일 ~ 12월 31일</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-green-200 text-xs mb-1">전체 진도</p>
              <p className="text-white text-3xl font-bold">{progress}%</p>
            </div>
            <div className="flex-1">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-green-200 text-xs mt-1">{doneChapters}장 / {totalChapters}장 완료</p>
            </div>
          </div>
        </div>
      </div>

      {/* 상단 3-컬럼 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* 오늘 읽을 말씀 */}
        <div className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#C8E6C9]">
          <p className="text-xs font-semibold text-[#2E7D32] mb-3 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> 오늘 읽을 말씀
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {TODAY_READING.book} {TODAY_READING.chapter}장
          </p>
          <p className="text-sm text-gray-600 mb-1">{TODAY_READING.verse}절</p>
          <p className="text-xs text-gray-500 mb-4">{TODAY_READING.summary}</p>
          <button
            onClick={() => setChecked(true)}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              checked
                ? "bg-[#2E7D32] text-white cursor-default"
                : "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
            }`}
          >
            {checked ? <><CheckCircle2 className="w-4 h-4" /> 완료!</> : "읽기 완료 체크 ✓"}
          </button>
        </div>

        {/* 이번 주 통독 계획 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> 이번 주 계획
          </p>
          <div className="space-y-2">
            {WEEKLY_VERSES.map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i < 2 ? "bg-[#2E7D32] text-white" : i === 2 ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-gray-100 text-gray-400"
                }`}>{v.day}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs truncate ${i <= 2 ? "text-gray-800 font-medium" : "text-gray-400"}`}>{v.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{v.ref}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 통독 팁 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 mb-3">💡 통독 가이드</p>
          <div className="space-y-3">
            {TIPS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg shrink-0">{t.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 월별 진도 — 전체 너비 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">월별 통독 진도</h2>
          <span className="text-xs text-gray-400">{PLAN.length}개월 계획 중 · 총 {PLAN.length * 12}주</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-100">
          {PLAN.map((m) => {
            const monthDone = m.books.reduce((a, b) => a + b.done, 0);
            const monthTotal = m.books.reduce((a, b) => a + b.chapters, 0);
            const isOpen = openMonths[m.month] ?? false;
            const pct = Math.round((monthDone / monthTotal) * 100);
            return (
              <div key={m.month} className="bg-white">
                <button
                  onClick={() => setOpenMonths(prev => ({ ...prev, [m.month]: !prev[m.month] }))}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {monthDone >= monthTotal
                      ? <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                      : <Circle className="w-5 h-5 text-gray-300" />
                    }
                    <div className="text-left">
                      <span className="font-medium text-gray-800 block">{m.month}</span>
                      <span className="text-xs text-gray-400">{monthDone}/{monthTotal}장 · {pct}%</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 space-y-2.5">
                    {m.books.map((b) => (
                      <div key={b.name} className="flex items-center gap-2">
                        {b.done >= b.chapters
                          ? <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                          : <Circle className="w-4 h-4 text-gray-200 shrink-0" />
                        }
                        <span className="text-sm text-gray-700 flex-1">{b.name}</span>
                        <span className="text-xs text-gray-400 w-14 text-right">{b.done}/{b.chapters}장</span>
                        <div className="w-16 bg-gray-100 rounded-full h-1.5 shrink-0">
                          <div
                            className="bg-[#2E7D32] h-1.5 rounded-full"
                            style={{ width: `${b.chapters > 0 ? (b.done / b.chapters) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
