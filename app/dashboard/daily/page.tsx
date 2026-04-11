"use client";
import { useState, useRef } from "react";
import { Camera, ImagePlus, X, Heart, MessageCircle, TrendingUp, Send } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
}

const INIT_COMMENTS: Record<number, Comment[]> = {
  1: [
    { id: 101, author: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", text: "저도 시편 23편이 정말 좋아요. 오늘도 말씀으로 시작하셨군요 🙏", time: "오늘 오전 8:45" },
    { id: 102, author: "박믿음", avatar: "박", color: "bg-gray-100 text-gray-600", text: "아멘! 함께 말씀으로 하루를 시작해요!", time: "오늘 오전 9:10" },
    { id: 103, author: "최사랑", avatar: "최", color: "bg-gray-100 text-gray-600", text: "감사합니다. 저도 큰 위로가 됩니다 ❤️", time: "오늘 오전 9:32" },
  ],
  2: [
    { id: 201, author: "김성도", avatar: "김", color: "bg-gray-100 text-gray-600", text: "노을 사진 나눠줘서 감사해요! 정말 아름답네요 ☀️", time: "오늘 오전 8:15" },
    { id: 202, author: "정소망", avatar: "정", color: "bg-gray-100 text-gray-600", text: "새벽 기도 후 이런 노을을... 정말 하나님의 선물이네요!", time: "오늘 오전 8:30" },
    { id: 203, author: "박믿음", avatar: "박", color: "bg-gray-100 text-gray-600", text: "다음에 저도 새벽기도 나가봐야겠어요 💛", time: "오늘 오전 9:05" },
    { id: 204, author: "최사랑", avatar: "최", color: "bg-gray-100 text-gray-600", text: "함께해요! 매주 수요일 새벽 5시입니다 🌅", time: "오늘 오전 9:20" },
    { id: 205, author: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", text: "저도 함께하고 싶어요 🙏", time: "오늘 오전 10:00" },
  ],
  3: [
    { id: 301, author: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", text: "소그룹 모임 정말 은혜롭죠! 저도 늘 힘을 얻어요", time: "어제 오후 9:30" },
    { id: 302, author: "김성도", avatar: "김", color: "bg-gray-100 text-gray-600", text: "함께 기도해 주셔서 감사합니다 🙏", time: "어제 오후 10:00" },
    { id: 303, author: "최사랑", avatar: "최", color: "bg-gray-100 text-gray-600", text: "다음 소그룹 모임도 기대돼요!", time: "어제 오후 10:15" },
    { id: 304, author: "정소망", avatar: "정", color: "bg-gray-100 text-gray-600", text: "말씀 나누는 시간이 참 귀하지요 💛", time: "어제 오후 11:00" },
    { id: 305, author: "박믿음", avatar: "박", color: "bg-gray-100 text-gray-600", text: "아멘! 함께여서 감사해요", time: "어제 오후 11:30" },
    { id: 306, author: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", text: "다음 주도 함께해요!", time: "어제 오후 11:45" },
    { id: 307, author: "김성도", avatar: "김", color: "bg-gray-100 text-gray-600", text: "기대됩니다 🙏", time: "오늘 오전 7:00" },
  ],
  4: [
    { id: 401, author: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", text: "찬양 연습 화이팅! 이번 주 예배도 기대돼요 🎵", time: "어제 오후 4:00" },
    { id: 402, author: "박믿음", avatar: "박", color: "bg-gray-100 text-gray-600", text: "하나님께 드리는 찬양 항상 은혜로워요!", time: "어제 오후 4:30" },
  ],
  5: [
    { id: 501, author: "김성도", avatar: "김", color: "bg-gray-100 text-gray-600", text: "아이들이 참 예쁘네요! 순수한 믿음이 보기 좋아요 👶", time: "어제 오전 11:45" },
    { id: 502, author: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", text: "아이들에게서 배우는 게 참 많죠 🙏", time: "어제 오전 12:00" },
    { id: 503, author: "박믿음", avatar: "박", color: "bg-gray-100 text-gray-600", text: "어린이부 선생님들 수고 많으세요!", time: "어제 오전 12:30" },
    { id: 504, author: "최사랑", avatar: "최", color: "bg-gray-100 text-gray-600", text: "아이들 눈빛이 정말 맑네요 ❤️", time: "어제 오후 1:00" },
    { id: 505, author: "정소망", avatar: "정", color: "bg-gray-100 text-gray-600", text: "다음 세대가 이렇게 자라니 감사해요!", time: "어제 오후 1:30" },
    { id: 506, author: "김성도", avatar: "김", color: "bg-gray-100 text-gray-600", text: "선생님 정말 수고 많으십니다 💛", time: "어제 오후 2:00" },
    { id: 507, author: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", text: "우리 교회 미래가 밝네요 🌱", time: "어제 오후 2:30" },
    { id: 508, author: "박믿음", avatar: "박", color: "bg-gray-100 text-gray-600", text: "아멘! 함께 기도해요", time: "어제 오후 3:00" },
    { id: 509, author: "최사랑", avatar: "최", color: "bg-gray-100 text-gray-600", text: "축복합니다 🙏", time: "어제 오후 3:30" },
    { id: 510, author: "정소망", avatar: "정", color: "bg-gray-100 text-gray-600", text: "감사합니다!", time: "어제 오후 4:00" },
  ],
};

const INIT_FEED: {
  id: number; name: string; avatar: string; color: string;
  time: string; text: string; image: string | null; likes: number; comments: number
}[] = [
  { id: 1, name: "김성도", avatar: "김", color: "bg-gray-100 text-gray-600", time: "오늘 오전 8:24",
    text: "오늘도 말씀으로 하루를 시작합니다 🙏 아침 묵상 중 시편 23편이 큰 위로가 되었어요. 여호와는 나의 목자시니 내게 부족함이 없으리로다.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=600&q=80",
    likes: 12, comments: 3 },
  { id: 2, name: "이은혜", avatar: "이", color: "bg-gray-100 text-gray-600", time: "오늘 오전 7:58",
    text: "새벽 기도 후 아침 노을이 너무 아름다웠어요 ☀️ 하나님의 창조가 이렇게 아름다울 수가 없네요. 오늘 하루도 감사합니다!",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80",
    likes: 18, comments: 5 },
  { id: 3, name: "박믿음", avatar: "박", color: "bg-gray-100 text-gray-600", time: "어제 오후 9:12",
    text: "소그룹 모임에서 큰 은혜를 받았습니다. 함께 기도해 주신 분들께 감사드려요 💛 말씀을 나누는 시간이 정말 귀하게 느껴집니다.",
    image: null, likes: 24, comments: 7 },
  { id: 4, name: "최사랑", avatar: "최", color: "bg-gray-100 text-gray-600", time: "어제 오후 3:44",
    text: "주일 예배 찬양 연습 중입니다 🎵 이번 주도 함께 드리는 예배가 기대돼요! 하나님께 드리는 찬양은 언제나 힘이 납니다.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80",
    likes: 9, comments: 2 },
  { id: 5, name: "정소망", avatar: "정", color: "bg-gray-100 text-gray-600", time: "어제 오전 11:20",
    text: "어린이부 아이들과 함께한 성경 이야기 시간이었어요 👶 아이들의 순수한 믿음을 보며 오히려 제가 더 많이 배웁니다.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
    likes: 31, comments: 10 },
];

const TODAY_STATS = [
  { label: "오늘 나눈 글", value: "12", icon: Camera },
  { label: "이번 주 총 좋아요", value: "147", icon: Heart },
  { label: "함께하는 성도", value: "89명", icon: TrendingUp },
];

export default function DailyPage() {
  const [feed, setFeed] = useState(INIT_FEED);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const [postComments, setPostComments] = useState<Record<number, Comment[]>>(INIT_COMMENTS);
  const [commentModalId, setCommentModalId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handlePost() {
    if (!text.trim()) return;
    const newPost = {
      id: Date.now(),
      name: "나", avatar: "나", color: "bg-gray-100 text-gray-600",
      time: "방금 전",
      text: text.trim(),
      image: imagePreview,
      likes: 0, comments: 0,
    };
    setFeed(prev => [newPost, ...prev]);
    setPostComments(prev => ({ ...prev, [newPost.id]: [] }));
    setText("");
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function toggleLike(id: number) {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function openCommentModal(postId: number) {
    setCommentModalId(postId);
    setCommentInput("");
  }

  function handleAddComment() {
    if (!commentInput.trim() || commentModalId === null) return;
    const newComment: Comment = {
      id: Date.now(),
      author: "나",
      avatar: "나",
      color: "bg-gray-100 text-gray-600",
      text: commentInput.trim(),
      time: "방금 전",
    };
    setPostComments(prev => ({
      ...prev,
      [commentModalId]: [...(prev[commentModalId] || []), newComment],
    }));
    setCommentInput("");
  }

  const activePost = commentModalId !== null ? feed.find(p => p.id === commentModalId) : null;
  const activeComments = commentModalId !== null ? (postComments[commentModalId] || []) : [];

  return (
    <div className="space-y-6">
      {/* 상단 헤더 + 통계 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" /> 성도의 하루
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">사진 한 장과 한 줄로 오늘 하루를 나눠요</p>
        </div>
        <div className="flex gap-3">
          {TODAY_STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5 text-center">
                <Icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-컬럼 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 sm:gap-6 items-start">
        {/* 왼쪽 — 작성 폼 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-3 sm:top-6">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-gray-500" /> 오늘 하루 나누기
            </p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="오늘 하루 어떠셨나요? 말씀 묵상, 기도, 감사한 일들을 나눠보세요 ✍️"
              rows={4}
              maxLength={200}
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{text.length}/200</p>

            {imagePreview && (
              <div className="relative mt-3 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="첨부 이미지" className="w-full h-40 object-cover rounded-xl" />
                <button
                  onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                <ImagePlus className="w-4 h-4" />
                사진 추가
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              <button
                onClick={handlePost}
                disabled={!text.trim()}
                className="px-5 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors disabled:opacity-40"
              >
                나누기
              </button>
            </div>
          </div>

          {/* 오늘의 말씀 */}
          <div className="bg-gray-100 rounded-2xl p-5 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">📖 오늘의 말씀</p>
            <p className="text-base font-bold text-gray-900 leading-snug mb-1">
              "여호와는 나의 목자시니<br />내게 부족함이 없으리로다"
            </p>
            <p className="text-xs text-gray-500">시편 23:1</p>
          </div>
        </div>

        {/* 오른쪽 — 피드 */}
        <div className="space-y-4">
          {feed.map((post) => {
            const commentCount = postComments[post.id]?.length ?? post.comments;
            const lastComment = postComments[post.id]?.[postComments[post.id].length - 1];
            return (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt="" className="w-full h-56 object-cover" />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${post.color}`}>
                      {post.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{post.name}</p>
                      <p className="text-xs text-gray-400">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>

                  {/* 최신 댓글 미리보기 */}
                  {lastComment && (
                    <div className="mt-3 bg-gray-50 rounded-xl px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 ${lastComment.color}`}>
                          {lastComment.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-gray-700 mr-1">{lastComment.author}</span>
                          <span className="text-xs text-gray-600 line-clamp-1">{lastComment.text}</span>
                        </div>
                      </div>
                      {commentCount > 1 && (
                        <button
                          onClick={() => openCommentModal(post.id)}
                          className="text-[10px] text-gray-400 mt-1.5 hover:text-gray-600 transition-colors"
                        >
                          댓글 {commentCount}개 모두 보기
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${liked.has(post.id) ? "text-gray-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Heart className={`w-4 h-4 ${liked.has(post.id) ? "fill-gray-600" : ""}`} />
                      {post.likes + (liked.has(post.id) ? 1 : 0)}
                    </button>
                    <button
                      onClick={() => openCommentModal(post.id)}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {commentCount}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 댓글 모달 */}
      {commentModalId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCommentModalId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <h3 className="font-bold text-gray-900">댓글</h3>
                <span className="text-xs text-gray-400">({activeComments.length}개)</span>
              </div>
              <button
                onClick={() => setCommentModalId(null)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 원본 글 미리보기 */}
            {activePost && (
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${activePost.color}`}>
                    {activePost.avatar}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{activePost.name}</span>
                  <span className="text-[10px] text-gray-400">{activePost.time}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{activePost.text}</p>
              </div>
            )}

            {/* 댓글 목록 */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {activeComments.length === 0 ? (
                <div className="text-center py-10">
                  <MessageCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">아직 댓글이 없습니다</p>
                  <p className="text-xs text-gray-300 mt-0.5">첫 댓글을 남겨보세요!</p>
                </div>
              ) : (
                activeComments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${c.color}`}>
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-800">{c.author}</span>
                        <span className="text-[10px] text-gray-400">{c.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 댓글 입력 */}
            <div className="px-5 py-4 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
                  나
                </div>
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-gray-400/30 transition-all">
                  <input
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                    maxLength={150}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentInput.trim()}
                    className="text-gray-600 disabled:text-gray-300 transition-colors hover:text-gray-800"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
