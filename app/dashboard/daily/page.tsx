"use client";
import { useState, useRef } from "react";
import { Camera, ImagePlus, X, Heart, MessageCircle, TrendingUp } from "lucide-react";

const INIT_FEED: {
  id: number; name: string; avatar: string; color: string;
  time: string; text: string; image: string | null; likes: number; comments: number
}[] = [
  { id: 1, name: "김성도", avatar: "김", color: "bg-emerald-100 text-emerald-700", time: "오늘 오전 8:24",
    text: "오늘도 말씀으로 하루를 시작합니다 🙏 아침 묵상 중 시편 23편이 큰 위로가 되었어요. 여호와는 나의 목자시니 내게 부족함이 없으리로다.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=600&q=80",
    likes: 12, comments: 3 },
  { id: 2, name: "이은혜", avatar: "이", color: "bg-blue-100 text-blue-700", time: "오늘 오전 7:58",
    text: "새벽 기도 후 아침 노을이 너무 아름다웠어요 ☀️ 하나님의 창조가 이렇게 아름다울 수가 없네요. 오늘 하루도 감사합니다!",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80",
    likes: 18, comments: 5 },
  { id: 3, name: "박믿음", avatar: "박", color: "bg-amber-100 text-amber-700", time: "어제 오후 9:12",
    text: "소그룹 모임에서 큰 은혜를 받았습니다. 함께 기도해 주신 분들께 감사드려요 💛 말씀을 나누는 시간이 정말 귀하게 느껴집니다.",
    image: null, likes: 24, comments: 7 },
  { id: 4, name: "최사랑", avatar: "최", color: "bg-rose-100 text-rose-700", time: "어제 오후 3:44",
    text: "주일 예배 찬양 연습 중입니다 🎵 이번 주도 함께 드리는 예배가 기대돼요! 하나님께 드리는 찬양은 언제나 힘이 납니다.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80",
    likes: 9, comments: 2 },
  { id: 5, name: "정소망", avatar: "정", color: "bg-green-100 text-green-700", time: "어제 오전 11:20",
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
      name: "나", avatar: "나", color: "bg-purple-100 text-purple-700",
      time: "방금 전",
      text: text.trim(),
      image: imagePreview,
      likes: 0, comments: 0,
    };
    setFeed(prev => [newPost, ...prev]);
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

  return (
    <div className="space-y-6">
      {/* 상단 헤더 + 통계 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#2E7D32]" /> 성도의 하루
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">사진 한 장과 한 줄로 오늘 하루를 나눠요</p>
        </div>
        <div className="flex gap-3">
          {TODAY_STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5 text-center">
                <Icon className="w-4 h-4 text-[#2E7D32] mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-컬럼 레이아웃 */}
      <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
        {/* 왼쪽 — 작성 폼 (고정) */}
        <div className="space-y-4">
          {/* 작성 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#2E7D32]" /> 오늘 하루 나누기
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
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-[#2E7D32] transition-colors">
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
          <div className="bg-[#E8F5E9] rounded-2xl p-5 border border-[#C8E6C9]">
            <p className="text-xs font-semibold text-[#2E7D32] mb-2">📖 오늘의 말씀</p>
            <p className="text-base font-bold text-gray-900 leading-snug mb-1">
              "여호와는 나의 목자시니<br />내게 부족함이 없으리로다"
            </p>
            <p className="text-xs text-[#2E7D32]">시편 23:1</p>
          </div>
        </div>

        {/* 오른쪽 — 피드 */}
        <div className="space-y-4">
          {feed.map((post) => (
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
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${liked.has(post.id) ? "text-rose-500" : "text-gray-400 hover:text-rose-400"}`}
                  >
                    <Heart className={`w-4 h-4 ${liked.has(post.id) ? "fill-rose-500" : ""}`} />
                    {post.likes + (liked.has(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#2E7D32] transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
