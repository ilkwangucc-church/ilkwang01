"use client";
import { useState } from "react";
import { Users2, MessageCircle, Heart, Plus, ChevronRight } from "lucide-react";

const DEPARTMENTS = ["전체", "예배부", "청년부", "교육부", "찬양팀", "봉사부", "새가족부"];

const POSTS = [
  { id: 1, dept: "청년부",  author: "이은혜", avatar: "이", color: "bg-purple-100 text-purple-700",
    title: "청년부 4월 정기모임 후기",
    preview: "지난 주 정기모임에서 나눈 말씀과 기도가 너무 은혜로웠어요. 함께해 주신 모든 분들 감사해요 🙏 다음 달에도 이런 시간이 기대됩니다.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    date: "2026-04-02", likes: 18, comments: 6 },
  { id: 2, dept: "찬양팀",  author: "박찬양", avatar: "박", color: "bg-blue-100 text-blue-700",
    title: "주일 찬양 곡 목록 공유",
    preview: "이번 주일 예배 찬양 곡 목록 공유드려요. 미리 연습해 오시면 더욱 풍성한 예배가 될 것 같아요! 가사와 코드는 댓글로 첨부할게요.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80",
    date: "2026-04-01", likes: 24, comments: 9 },
  { id: 3, dept: "봉사부",  author: "최봉사", avatar: "최", color: "bg-amber-100 text-amber-700",
    title: "4월 봉사 일정 공유",
    preview: "4월 봉사 일정을 공유드립니다. 참여 가능하신 분들은 댓글 남겨주세요! 지역사회를 섬기는 소중한 기회입니다.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    date: "2026-03-30", likes: 12, comments: 14 },
  { id: 4, dept: "새가족부", author: "김환영", avatar: "김", color: "bg-rose-100 text-rose-700",
    title: "3월 새가족 환영 모임",
    preview: "이번 달 새로 등록하신 5분을 환영합니다! 다 함께 잘 돌봐주세요 ❤️ 새가족분들이 교회에 잘 정착하실 수 있도록 함께 기도해요.",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80",
    date: "2026-03-28", likes: 31, comments: 8 },
  { id: 5, dept: "예배부",  author: "정예배", avatar: "정", color: "bg-green-100 text-green-700",
    title: "부활절 예배 준비 안내",
    preview: "부활절 예배 준비를 위한 각 부서 역할 분담 안내입니다. 확인 후 담당자에게 연락 주세요. 모두 함께 아름다운 부활절 예배를 드려요.",
    image: "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=600&q=80",
    date: "2026-03-26", likes: 15, comments: 4 },
  { id: 6, dept: "교육부",  author: "박교육", avatar: "박", color: "bg-teal-100 text-teal-700",
    title: "어린이 주일학교 교사 모집",
    preview: "다음 달 어린이 주일학교 교사를 모집합니다. 아이들을 사랑하시는 분들의 많은 지원 바랍니다! 훈련과 교재 모두 제공됩니다.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
    date: "2026-03-24", likes: 22, comments: 11 },
];

export default function DeptSharePage() {
  const [dept, setDept] = useState("전체");
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filtered = dept === "전체" ? POSTS : POSTS.filter(p => p.dept === dept);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
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

      {/* 게시글 카드 그리드 */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
            {/* 이미지 */}
            {post.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.image} alt={post.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <Users2 className="w-10 h-10 text-gray-300" />
              </div>
            )}

            {/* 내용 */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${post.color}`}>
                  {post.avatar}
                </div>
                <span className="text-xs font-semibold text-gray-700">{post.author}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${post.color}`}>{post.dept}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#2E7D32] transition-colors ml-auto" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[#2E7D32] transition-colors text-sm leading-snug line-clamp-1">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{post.preview}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{post.date}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setLiked(prev => {
                        const n = new Set(prev);
                        n.has(post.id) ? n.delete(post.id) : n.add(post.id);
                        return n;
                      });
                    }}
                    className={`flex items-center gap-1 text-xs transition-colors ${liked.has(post.id) ? "text-rose-500" : "text-gray-400 hover:text-rose-400"}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked.has(post.id) ? "fill-rose-500" : ""}`} />
                    {post.likes + (liked.has(post.id) ? 1 : 0)}
                  </button>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
