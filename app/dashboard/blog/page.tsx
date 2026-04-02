"use client";
import { useState } from "react";
import { PenLine, Plus, Eye, ChevronRight } from "lucide-react";

const DEPTS = ["전체", "담임목사", "청년부", "교육부", "찬양팀", "선교부"];

const POSTS = [
  { id: 1, dept: "담임목사", author: "강목사",  color: "bg-amber-100 text-amber-700",  title: "4월의 묵상 — 부활의 소망",   preview: "부활절을 앞두고 우리는 다시 한 번 그리스도의 부활이 우리 삶에 어떤 의미인지를 묵상합니다...", date: "2026-04-03", views: 342, readTime: "5분" },
  { id: 2, dept: "청년부",   author: "이은혜",  color: "bg-purple-100 text-purple-700", title: "청년부 수련회 간증 — 변화의 시간", preview: "지난 1월 수련회에서 하나님께서 저희 청년들 마음 가운데 행하신 놀라운 일들을 나누고 싶습니다...", date: "2026-03-28", views: 187, readTime: "7분" },
  { id: 3, dept: "찬양팀",   author: "박찬양",  color: "bg-blue-100 text-blue-700",    title: "예배 찬양의 의미를 다시 생각하며", preview: "찬양은 단순한 음악이 아닙니다. 우리가 하나님께 드리는 마음의 고백이자 영적 전쟁의 무기입니다...", date: "2026-03-20", views: 256, readTime: "4분" },
  { id: 4, dept: "선교부",   author: "김선교",  color: "bg-green-100 text-green-700",  title: "네팔 단기선교 보고서",          preview: "2주간의 네팔 단기선교를 마치고 돌아왔습니다. 현지 아이들과 함께한 시간들을 나눕니다...", date: "2026-03-15", views: 298, readTime: "8분" },
  { id: 5, dept: "교육부",   author: "최교육",  color: "bg-rose-100 text-rose-700",    title: "어린이 신앙 교육의 중요성",      preview: "우리 아이들에게 어떻게 신앙을 전달할 수 있을까요? 교육부가 고민하는 방향과 방법을 나눕니다...", date: "2026-03-10", views: 134, readTime: "6분" },
];

export default function BlogPage() {
  const [dept, setDept] = useState("전체");

  const filtered = dept === "전체" ? POSTS : POSTS.filter(p => p.dept === dept);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PenLine className="w-6 h-6 text-[#2E7D32]" /> 부서별 블로그
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">각 부서의 이야기와 묵상을 나눕니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          <Plus className="w-4 h-4" /> 글쓰기
        </button>
      </div>

      {/* 부서 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DEPTS.map(d => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
              dept === d ? "bg-[#2E7D32] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* 블로그 목록 */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.color}`}>{post.dept}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
                <span className="text-xs text-gray-400">읽는 시간 {post.readTime}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2E7D32] transition-colors shrink-0" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2E7D32] transition-colors">{post.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{post.preview}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
              <span className="text-sm font-medium text-gray-700">{post.author}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Eye className="w-3.5 h-3.5" /> {post.views}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
