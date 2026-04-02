"use client";
import { useState, useRef } from "react";
import { Camera, ImagePlus, X, Heart, MessageCircle } from "lucide-react";

const INIT_FEED: { id: number; name: string; avatar: string; color: string; time: string; text: string; image: string | null; likes: number; comments: number }[] = [
  { id: 1, name: "김성도", avatar: "김", color: "bg-emerald-100 text-emerald-700", time: "오늘 오전 8:24", text: "오늘도 말씀으로 하루를 시작합니다 🙏 아침 묵상 중 시편 23편이 큰 위로가 되었어요.", image: null, likes: 12, comments: 3 },
  { id: 2, name: "이은혜", avatar: "이", color: "bg-blue-100 text-blue-700",    time: "오늘 오전 7:58", text: "새벽 기도 후 아침 노을이 너무 아름다웠어요 ☀️", image: null, likes: 18, comments: 5 },
  { id: 3, name: "박믿음", avatar: "박", color: "bg-amber-100 text-amber-700",  time: "어제 오후 9:12", text: "소그룹 모임에서 큰 은혜를 받았습니다. 함께 기도해 주신 분들께 감사드려요 💛", image: null, likes: 24, comments: 7 },
  { id: 4, name: "최사랑", avatar: "최", color: "bg-rose-100 text-rose-700",   time: "어제 오후 3:44", text: "주일 예배 찬양 연습 중입니다 🎵 이번 주도 함께 드리는 예배가 기대돼요!", image: null, likes: 9, comments: 2 },
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
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Camera className="w-6 h-6 text-[#2E7D32]" /> 성도의 하루
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">사진 한 장과 한 줄로 오늘 하루를 나눠요</p>
      </div>

      {/* 작성 폼 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="오늘 하루 어떠셨나요? 사진 한 장과 한 줄로 나눠보세요 ✍️"
          rows={3}
          maxLength={120}
          className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
        />
        <p className="text-right text-xs text-gray-400 mt-1">{text.length}/120</p>

        {imagePreview && (
          <div className="relative mt-3 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="첨부 이미지" className="w-full h-48 object-cover rounded-xl" />
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

      {/* 피드 */}
      <div className="space-y-4">
        {feed.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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
            {post.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.image} alt="" className="mt-3 w-full h-52 object-cover rounded-xl" />
            )}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
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
        ))}
      </div>
    </div>
  );
}
