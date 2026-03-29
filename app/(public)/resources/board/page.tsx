import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Heart, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "나눔게시판",
  description: "일광교회 성도들의 나눔과 교재 공유 게시판",
};

const posts = [
  { id: 8, title: "소그룹 모임 후 은혜 나눔 (3월 4주)", author: "김성도", date: "2024-03-28", category: "소그룹", views: 54, likes: 12, comments: 5 },
  { id: 7, title: "새벽기도회 기도제목 모음 — 3월", author: "이집사", date: "2024-03-25", category: "기도", views: 89, likes: 23, comments: 8 },
  { id: 6, title: "추천도서: 「팀 켈러의 기도」 독후감", author: "박권사", date: "2024-03-20", category: "도서", views: 112, likes: 31, comments: 14 },
  { id: 5, title: "청년부 수련회 등록 안내 및 Q&A", author: "청년부 간사", date: "2024-03-18", category: "청년부", views: 245, likes: 18, comments: 22 },
  { id: 4, title: "가정예배 순서지 공유합니다", author: "최집사", date: "2024-03-15", category: "가정예배", views: 178, likes: 47, comments: 9 },
  { id: 3, title: "성경통독 2월 후기 — 민수기가 이렇게 깊은 책이었나요", author: "정성도", date: "2024-03-10", category: "성경통독", views: 93, likes: 28, comments: 11 },
  { id: 2, title: "로마서 8장 묵상 나눔", author: "한권사", date: "2024-03-05", category: "묵상", views: 67, likes: 19, comments: 7 },
  { id: 1, title: "2024 소그룹 교재 활용 팁 공유", author: "부서 총무", date: "2024-03-01", category: "교재", views: 201, likes: 55, comments: 16 },
];

const categories = ["전체", "소그룹", "기도", "도서", "청년부", "가정예배", "성경통독", "묵상", "교재"];

export default function BoardPage() {
  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <section className="bg-[#2E7D32] text-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-green-200 text-sm mb-3 tracking-widest uppercase">Sharing Board</p>
          <h1 className="text-4xl font-bold mb-4">나눔게시판</h1>
          <p className="text-green-100 text-lg">
            말씀 묵상, 기도 제목, 교재 후기를 함께 나눕니다
          </p>
        </div>
      </section>

      {/* 서브 메뉴 */}
      <section className="bg-white border-b py-4">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-4 justify-center">
          <Link href="/resources" className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32] text-sm font-medium transition-colors">교재자료</Link>
          <Link href="/resources/board" className="px-5 py-2 rounded-full bg-[#2E7D32] text-white text-sm font-medium">나눔게시판</Link>
        </div>
      </section>

      {/* 필터 */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="max-w-[1400px] mx-auto px-4 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                cat === "전체"
                  ? "bg-[#2E7D32] text-white"
                  : "border border-gray-300 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 게시글 목록 */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {posts.map((post, i) => (
              <div key={post.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${i !== posts.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full">{post.category}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 hover:text-[#2E7D32] transition-colors truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{post.views}</span>
                    <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{post.likes}</span>
                    <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 로그인 유도 */}
          <div className="text-center bg-white rounded-xl p-8 border border-gray-100">
            <p className="text-gray-600 mb-4">나눔을 작성하시려면 로그인이 필요합니다.</p>
            <Link href="/login" className="inline-block px-6 py-2.5 bg-[#2E7D32] text-white rounded-full font-medium hover:bg-[#1B5E20] transition-colors text-sm">
              로그인하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
