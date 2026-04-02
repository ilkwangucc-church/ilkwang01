"use client";
import { useState } from "react";
import { BookText, CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";

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
];

const TODAY_READING = { book: "사무엘상", chapter: 13, verse: "1~23", summary: "사울의 불순종과 하나님의 뜻" };

export default function BiblePage() {
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({ "4월": true });

  const totalChapters = PLAN.flatMap(m => m.books).reduce((a, b) => a + b.chapters, 0);
  const doneChapters  = PLAN.flatMap(m => m.books).reduce((a, b) => a + b.done, 0);
  const progress = Math.round((doneChapters / totalChapters) * 100);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookText className="w-6 h-6 text-[#2E7D32]" /> 성경통독
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">2026년 연간 통독 계획 · 1월 1일 ~ 12월 31일</p>
      </div>

      {/* 전체 진도 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">전체 진도</span>
          <span className="text-sm font-bold text-[#2E7D32]">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div
            className="bg-[#2E7D32] h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">{doneChapters}장 / {totalChapters}장 완료</p>
      </div>

      {/* 오늘 읽을 말씀 */}
      <div className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#C8E6C9]">
        <p className="text-xs font-semibold text-[#2E7D32] mb-2">📖 오늘 읽을 말씀</p>
        <p className="text-lg font-bold text-gray-900">{TODAY_READING.book} {TODAY_READING.chapter}장 {TODAY_READING.verse}절</p>
        <p className="text-sm text-gray-600 mt-1">{TODAY_READING.summary}</p>
        <button className="mt-3 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          읽기 완료 체크 ✓
        </button>
      </div>

      {/* 월별 진도 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">월별 통독 진도</h2>
        </div>
        {PLAN.map((m) => {
          const monthDone = m.books.reduce((a, b) => a + b.done, 0);
          const monthTotal = m.books.reduce((a, b) => a + b.chapters, 0);
          const isOpen = openMonths[m.month] ?? false;
          return (
            <div key={m.month} className="border-b border-gray-50 last:border-0">
              <button
                onClick={() => setOpenMonths(prev => ({ ...prev, [m.month]: !prev[m.month] }))}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {monthDone >= monthTotal
                    ? <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                    : <Circle className="w-5 h-5 text-gray-300" />
                  }
                  <span className="font-medium text-gray-800">{m.month}</span>
                  <span className="text-xs text-gray-400">{monthDone}/{monthTotal}장</span>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-3 space-y-2">
                  {m.books.map((b) => (
                    <div key={b.name} className="flex items-center gap-3">
                      {b.done >= b.chapters
                        ? <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                        : <Circle className="w-4 h-4 text-gray-200 shrink-0" />
                      }
                      <span className="text-sm text-gray-700 flex-1">{b.name}</span>
                      <span className="text-xs text-gray-400">{b.done}/{b.chapters}장</span>
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-[#2E7D32] h-1.5 rounded-full"
                          style={{ width: `${(b.done / b.chapters) * 100}%` }}
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
  );
}
