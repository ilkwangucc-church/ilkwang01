"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Send, Trash2 } from "lucide-react";

const CATEGORIES = ["전체", "주일예배", "수요예배", "새벽기도", "특별예배"];

interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  category: string;
  youtubeUrl: string;
  youtubeId: string;
  description: string;
  published: boolean;
}

interface Comment {
  id: number;
  sermonId: number;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export default function DashboardSermonsPage() {
  const [sermons, setSermons]       = useState<Sermon[]>([]);
  const [selected, setSelected]     = useState<Sermon | null>(null);
  const [category, setCategory]     = useState("전체");
  const [comments, setComments]     = useState<Comment[]>([]);
  const [text, setText]             = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting]     = useState<number | null>(null);
  const commentBottomRef            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/sermons")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSermons(data);
          setSelected(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const loadComments = useCallback((sermonId: number) => {
    fetch(`/api/sermons/comments?sermonId=${sermonId}`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setComments(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selected) loadComments(selected.id);
  }, [selected, loadComments]);

  function selectSermon(s: Sermon) {
    setSelected(s);
    setComments([]);
    setText("");
  }

  async function handleSubmit() {
    if (!selected || !text.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/sermons/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sermonId: selected.id, content: text }),
    });
    setSubmitting(false);
    if (res.ok) {
      setText("");
      loadComments(selected.id);
      setTimeout(() => commentBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      const j = await res.json();
      alert(j.error || "오류가 발생했습니다.");
    }
  }

  async function handleDelete(commentId: number) {
    if (!selected) return;
    setDeleting(commentId);
    const res = await fetch("/api/sermons/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId }),
    });
    setDeleting(null);
    if (res.ok) loadComments(selected.id);
  }

  const filtered = sermons.filter((s) => category === "전체" || s.category === category);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설교보기</h1>
        <p className="text-gray-500 text-sm mt-0.5">말씀 영상을 시청하고 은혜를 나눠주세요</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              category === cat
                ? "bg-[#2E7D32] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 메인: 좌측 영상+목록 / 우측 은혜나눔 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">

        {/* ── 좌측: 영상 플레이어 + 목록 ── */}
        <div className="lg:col-span-3 space-y-4">

          {/* YouTube 임베드 */}
          {selected ? (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative" style={{ paddingTop: "56.25%" }}>
                <iframe
                  key={selected.youtubeId}
                  src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-gray-900 text-base leading-tight">{selected.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {selected.scripture && <span>{selected.scripture} · </span>}
                      {selected.preacher} · {selected.date}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full">{selected.category}</span>
                </div>
                {selected.description && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{selected.description}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center" style={{ paddingTop: "30%" }}>
              <p className="text-gray-400 text-sm">등록된 설교가 없습니다.</p>
            </div>
          )}

          {/* 설교 목록 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">설교 목록 ({filtered.length}편)</h2>
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectSermon(s)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    selected?.id === s.id ? "bg-[#E8F5E9]" : ""
                  }`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${s.youtubeId}/mqdefault.jpg`}
                    alt={s.title}
                    className="w-20 h-12 object-cover rounded-md shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0">
                    <p className={`font-medium text-sm truncate ${selected?.id === s.id ? "text-[#2E7D32]" : "text-gray-900"}`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {s.scripture && <span>{s.scripture} · </span>}{s.date}
                    </p>
                    <span className="text-xs px-1.5 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full">{s.category}</span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">해당 분류의 설교가 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* ── 우측: 은혜나눔 ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: "520px" }}>
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">은혜나눔</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {selected ? `"${selected.title}" 말씀의 은혜를 나눠주세요` : "설교를 선택해주세요"}
              </p>
            </div>

            {/* 댓글 목록 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "360px" }}>
              {comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  <p className="text-2xl mb-2">🙏</p>
                  첫 번째 은혜를 나눠주세요
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 rounded-xl p-3 group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32] text-xs font-bold shrink-0">
                          {c.authorName[0]}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{c.authorName}</span>
                        <span className="text-xs text-gray-400">{c.createdAt}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed pl-9">{c.content}</p>
                  </div>
                ))
              )}
              <div ref={commentBottomRef} />
            </div>

            {/* 입력 영역 */}
            <div className="p-4 border-t border-gray-50">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
                placeholder={selected ? "말씀을 듣고 받은 은혜를 나눠주세요..." : "먼저 설교를 선택해주세요"}
                disabled={!selected}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 resize-none disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                onClick={handleSubmit}
                disabled={submitting || !text.trim() || !selected}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "나누는 중..." : "은혜 나누기"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-1.5">Cmd+Enter로 빠르게 등록</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
