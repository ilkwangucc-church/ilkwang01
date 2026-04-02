"use client";
import { useState } from "react";
import { Users2, MessageCircle, Heart, Plus, ChevronRight } from "lucide-react";

const DEPARTMENTS = ["전체", "예배부", "청년부", "교육부", "찬양팀", "봉사부", "새가족부"];

const POSTS = [
  { id: 1, dept: "청년부",  author: "이은혜", avatar: "이", color: "bg-purple-100 text-purple-700", title: "청년부 4월 정기모임 후기", preview: "지난 주 정기모임에서 나눈 말씀과 기도가 너무 은혜로웠어요. 함께해 주신 모든 분들 감사해요 🙏", date: "2026-04-02", likes: 18, comments: 6 },
  { id: 2, dept: "찬양팀",  author: "박찬양", avatar: "박", color: "bg-blue-100 text-blue-700",   title: "주일 찬양 곡 목록 공유",   preview: "이번 주일 예배 찬양 곡 목록 공유드려요. 미리 연습해 오시면 더욱 풍성한 예배가 될 것 같아요!", date: "2026-04-01", likes: 24, comments: 9 },
  { id: 3, dept: "봉사부",  author: "최봉사", avatar: "최", color: "bg-amber-100 text-amber-700", title: "4월 봉사 일정 공유",        preview: "4월 봉사 일정을 공유드립니다. 참여 가능하신 분들은 댓글 남겨주세요!", date: "2026-03-30", likes: 12, comments: 14 },
  { id: 4, dept: "새가족부", author: "김환영", avatar: "김", color: "bg-rose-100 text-rose-700",  title: "3월 새가족 환영 모임",     preview: "이번 달 새로 등록하신 5분을 환영합니다! 다 함께 잘 돌봐주세요 ❤️", date: "2026-03-28", likes: 31, comments: 8 },
  { id: 5, dept: "예배부",  author: "정예배", avatar: "정", color: "bg-green-100 text-green-700", title: "부활절 예배 준비 안내",     preview: "부활절 예배 준비를 위한 각 부서 역할 분담 안내입니다. 확인 후 담당자에게 연락 주세요.", date: "2026-03-26", likes: 15, comments: 4 },
];

export default function DeptSharePage() {
  const [dept, setDept] = useState("전체");
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filtered = dept === "전체" ? POSTS : POSTS.filter(p => p.dept === dept);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-[#2E7D32]" /> 부서나눔
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">부서별 소식과 이야기를 나눕니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          <Plus className="w-4 h-4" /> 글쓰기
        </button>
      </div>

      {/* 부서 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DEPARTMENTS.map(d => (
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

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${post.color}`}>
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">{post.author}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${post.color}`}>{post.dept}</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-[#2E7D32] transition-colors">{post.title}</h3>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2E7D32] transition-colors shrink-0 mt-1" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{post.preview}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
              <button
                onClick={e => { e.stopPropagation(); setLiked(prev => { const n = new Set(prev); n.has(post.id) ? n.delete(post.id) : n.add(post.id); return n; }); }}
                className={`flex items-center gap-1.5 text-sm transition-colors ${liked.has(post.id) ? "text-rose-500" : "text-gray-400 hover:text-rose-400"}`}
              >
                <Heart className={`w-4 h-4 ${liked.has(post.id) ? "fill-rose-500" : ""}`} />
                {post.likes + (liked.has(post.id) ? 1 : 0)}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
