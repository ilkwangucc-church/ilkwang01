"use client";
import { useState, useEffect, useRef } from "react";
import {
  BookText, ChevronDown, ChevronRight,
  Send, Trash2, Pencil, X,
  PlayCircle, RefreshCw,
} from "lucide-react";

/* ═══════════════════════════════════════
   성경 66권 구조
═══════════════════════════════════════ */
const BIBLE = [
  {
    testament: "구약",
    color: "text-[#2E7D32]",
    bg: "bg-[#E8F5E9]",
    sections: [
      { name: "율법서",   books: ["창세기","출애굽기","레위기","민수기","신명기"] },
      { name: "역사서",   books: ["여호수아","사사기","룻기","사무엘상","사무엘하","열왕기상","열왕기하","역대상","역대하","에스라","느헤미야","에스더"] },
      { name: "시가서",   books: ["욥기","시편","잠언","전도서","아가"] },
      { name: "대선지서", books: ["이사야","예레미야","예레미야애가","에스겔","다니엘"] },
      { name: "소선지서", books: ["호세아","요엘","아모스","오바댜","요나","미가","나훔","하박국","스바냐","학개","스가랴","말라기"] },
    ],
  },
  {
    testament: "신약",
    color: "text-blue-700",
    bg: "bg-blue-50",
    sections: [
      { name: "복음서",   books: ["마태복음","마가복음","누가복음","요한복음"] },
      { name: "역사서",   books: ["사도행전"] },
      { name: "바울서신", books: ["로마서","고린도전서","고린도후서","갈라디아서","에베소서","빌립보서","골로새서","데살로니가전서","데살로니가후서","디모데전서","디모데후서","디도서","빌레몬서"] },
      { name: "일반서신", books: ["히브리서","야고보서","베드로전서","베드로후서","요한일서","요한이서","요한삼서","유다서"] },
      { name: "예언서",   books: ["요한계시록"] },
    ],
  },
];

interface PRSVideo {
  id: string;
  title: string;
  books: string[];
  publishedAt: string;
}

interface Comment {
  id: number;
  memberName: string;
  text: string;
  date: string;
}

/* ═══════════════════════════════════════
   유틸
═══════════════════════════════════════ */
function thumbUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

/* ═══════════════════════════════════════
   메인 페이지
═══════════════════════════════════════ */
export default function BiblePage() {
  /* ─ 성경책 선택 ─ */
  const [selectedBook, setSelectedBook] = useState("창세기");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 율법서: true });

  /* ─ 영상 목록 ─ */
  const [allVideos, setAllVideos]     = useState<PRSVideo[]>([]);
  const [loadingVids, setLoadingVids] = useState(true);
  const [errVids, setErrVids]         = useState(false);

  /* ─ 선택된 영상 ─ */
  const [activeVideo, setActiveVideo] = useState<PRSVideo | null>(null);
  const [playing, setPlaying]         = useState(false); // 썸네일 → iframe

  /* ─ 댓글 ─ */
  const [comments, setComments]           = useState<Comment[]>([]);
  const [commentText, setCommentText]     = useState("");
  const [submitting, setSubmitting]       = useState(false);
  const [loadingCmt, setLoadingCmt]       = useState(false);
  const commentListRef                    = useRef<HTMLDivElement>(null);

  /* ─ 필사 ─ */
  const [transcription, setTranscription] = useState("");

  /* ══ 영상 목록 fetch ══ */
  useEffect(() => {
    setLoadingVids(true);
    setErrVids(false);
    fetch("/api/prs-videos")
      .then((r) => r.json())
      .then((d: PRSVideo[]) => {
        setAllVideos(Array.isArray(d) ? d : []);
      })
      .catch(() => setErrVids(true))
      .finally(() => setLoadingVids(false));
  }, []);

  /* ══ 책 선택 시 첫 번째 영상 자동 선택 ══ */
  const bookVideos = allVideos.filter((v) => v.books.includes(selectedBook));

  useEffect(() => {
    setActiveVideo(bookVideos[0] ?? null);
    setPlaying(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook, allVideos]);

  /* ══ 댓글 fetch ══ */
  useEffect(() => {
    if (!activeVideo) { setComments([]); return; }
    setLoadingCmt(true);
    fetch(`/api/bible-comments?videoId=${activeVideo.id}`)
      .then((r) => r.json())
      .then((d) => setComments(Array.isArray(d) ? d : []))
      .catch(() => setComments([]))
      .finally(() => setLoadingCmt(false));
  }, [activeVideo]);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !activeVideo) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bible-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: activeVideo.id, text: commentText.trim() }),
      });
      if (res.ok) {
        setCommentText("");
        const d = await fetch(`/api/bible-comments?videoId=${activeVideo.id}`).then((r) => r.json());
        setComments(Array.isArray(d) ? d : []);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(id: number) {
    if (!activeVideo || !confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await fetch("/api/bible-comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: activeVideo.id, id }),
    });
    if (res.ok) setComments((p) => p.filter((c) => c.id !== id));
  }

  function selectVideo(v: PRSVideo) {
    setActiveVideo(v);
    setPlaying(false);
  }

  /* ══ 렌더 ══ */
  return (
    <div className="-mx-5 -my-5 lg:-mx-6 lg:-my-6 flex h-[calc(100vh-56px)] overflow-hidden bg-gray-50">

      {/* ════════════════════════════
          LEFT SIDEBAR — 성경 66권
      ════════════════════════════ */}
      <aside className="w-44 lg:w-52 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
        <div className="px-3 py-2.5 border-b border-gray-100 shrink-0">
          <p className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-1.5 tracking-wide">
            <BookText className="w-3.5 h-3.5" /> 성경 목록 (66권)
          </p>
        </div>
        <div className="flex-1 overflow-y-auto text-xs">
          {BIBLE.map(({ testament, color, bg, sections }) => (
            <div key={testament}>
              <div className={`px-3 py-1.5 sticky top-0 z-10 ${bg} border-b border-gray-100`}>
                <span className={`text-[11px] font-bold ${color}`}>{testament}</span>
              </div>
              {sections.map((sec) => (
                <div key={sec.name}>
                  <button
                    onClick={() => setOpenSections((p) => ({ ...p, [sec.name]: !p[sec.name] }))}
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-100 hover:bg-gray-100"
                  >
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{sec.name}</span>
                    {openSections[sec.name]
                      ? <ChevronDown className="w-3 h-3 text-gray-400" />
                      : <ChevronRight className="w-3 h-3 text-gray-400" />}
                  </button>
                  {openSections[sec.name] && sec.books.map((book) => {
                    const cnt = allVideos.filter((v) => v.books.includes(book)).length;
                    return (
                      <button
                        key={book}
                        onClick={() => setSelectedBook(book)}
                        className={`w-full text-left px-4 py-[5px] flex items-center justify-between border-b border-gray-50 transition-colors ${
                          selectedBook === book
                            ? "bg-[#2E7D32] text-white font-semibold"
                            : "text-gray-700 hover:bg-green-50 hover:text-[#2E7D32]"
                        }`}
                      >
                        <span>{book}</span>
                        {cnt > 0 && (
                          <span className={`text-[9px] rounded-full px-1.5 py-0.5 shrink-0 ${
                            selectedBook === book ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                          }`}>
                            {cnt}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ════════════════════════════
          CENTER — 영상 + 댓글
      ════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* 영상 헤더 */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 text-sm truncate">
              {selectedBook}
              {bookVideos.length > 0 && (
                <span className="ml-1.5 text-xs font-normal text-gray-400">
                  {bookVideos.length}개 영상
                </span>
              )}
            </h1>
            {activeVideo && (
              <p className="text-[11px] text-gray-400 truncate">{activeVideo.title}</p>
            )}
          </div>
          {errVids && (
            <button
              onClick={() => { setErrVids(false); setLoadingVids(true); fetch("/api/prs-videos").then(r=>r.json()).then(d=>{setAllVideos(Array.isArray(d)?d:[]);setLoadingVids(false);}).catch(()=>{setErrVids(true);setLoadingVids(false);}); }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <RefreshCw className="w-3 h-3" /> 재시도
            </button>
          )}
        </div>

        {/* 메인 플레이어 */}
        <div className="shrink-0 bg-black" style={{ aspectRatio: "16/9", maxHeight: "45vh" }}>
          {loadingVids ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-xs">@PRS 채널 영상 불러오는 중...</p>
              </div>
            </div>
          ) : !activeVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <BookText className="w-10 h-10 text-white/30" />
              <p className="text-gray-400 text-sm">
                {bookVideos.length === 0 ? `${selectedBook} 영상이 없습니다` : "영상을 선택하세요"}
              </p>
            </div>
          ) : playing ? (
            <iframe
              key={activeVideo.id}
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={activeVideo.title}
            />
          ) : (
            /* 썸네일 → 클릭 시 재생 */
            <button
              onClick={() => setPlaying(true)}
              className="w-full h-full relative group overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl(activeVideo.id)}
                alt={activeVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-9 h-9 text-white fill-white" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-semibold drop-shadow-lg line-clamp-2 text-left">
                  {activeVideo.title}
                </p>
              </div>
            </button>
          )}
        </div>

        {/* 영상 목록 (수평 스크롤) */}
        {bookVideos.length > 1 && (
          <div className="shrink-0 border-b border-gray-200 bg-gray-900 px-2 py-2 overflow-x-auto">
            <div className="flex gap-2" style={{ width: "max-content" }}>
              {bookVideos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVideo(v)}
                  className={`shrink-0 w-36 rounded-lg overflow-hidden border-2 transition-all ${
                    activeVideo?.id === v.id
                      ? "border-red-500 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbUrl(v.id)} alt={v.title} className="w-full h-20 object-cover" />
                  <div className="bg-gray-800 px-2 py-1">
                    <p className="text-[10px] text-gray-300 line-clamp-1 text-left">{v.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 댓글 영역 */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-white">
          {/* 댓글 입력 */}
          <form onSubmit={submitComment} className="px-4 py-3 border-b border-gray-100 shrink-0">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              💬 말씀 나눔
              <span className="font-normal text-gray-400">
                {activeVideo && `· ${comments.length}개`}
              </span>
            </p>
            <div className="flex gap-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!activeVideo}
                placeholder={activeVideo ? "은혜받은 말씀을 나눠주세요..." : "영상을 선택하세요"}
                rows={2}
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim() || !activeVideo}
                className="px-3 py-2 bg-[#2E7D32] text-white rounded-lg text-xs font-semibold hover:bg-[#1B5E20] disabled:opacity-40 flex flex-col items-center gap-1 self-end transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "..." : "등록"}</span>
              </button>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className="flex-1 overflow-y-auto" ref={commentListRef}>
            {loadingCmt ? (
              <div className="text-center py-6 text-xs text-gray-400">불러오는 중...</div>
            ) : !activeVideo ? (
              <div className="text-center py-8 text-xs text-gray-400">영상을 선택하면 댓글을 볼 수 있습니다</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-1">🕊️</p>
                <p className="text-xs text-gray-400">첫 번째 나눔을 남겨주세요</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {comments.map((c) => (
                  <div key={c.id} className="px-4 py-3 hover:bg-gray-50 group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-[#2E7D32]">{c.memberName}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400">{c.date}</span>
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                          title="삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════
          RIGHT — 필사 노트
      ════════════════════════════ */}
      <div className="w-64 lg:w-72 border-l border-gray-200 bg-white flex flex-col overflow-hidden shrink-0">
        {/* 헤더 */}
        <div className="px-4 py-2.5 border-b border-gray-100 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-[#2E7D32]" /> 필사 노트 ✍️
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">말씀을 들으며 직접 타이핑하세요</p>
          </div>
          {transcription && (
            <button
              onClick={() => { if (confirm("필사 내용을 초기화하시겠습니까?")) setTranscription(""); }}
              className="text-[11px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              title="초기화"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 p-3 flex flex-col overflow-hidden">
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder={"성경 말씀을 직접 타이핑하며\n마음에 새겨보세요.\n\n예)\n태초에 하나님이 천지를\n창조하시니라 (창 1:1)"}
            className="flex-1 w-full text-sm text-gray-800 leading-loose border border-gray-200 rounded-xl px-3 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 font-serif placeholder:text-xs placeholder:text-gray-400"
          />
        </div>

        {/* 글자 수 */}
        <div className="px-4 py-2 border-t border-gray-100 shrink-0">
          <p className="text-[10px] text-gray-400 text-right">
            {transcription.length.toLocaleString()}자 입력됨
          </p>
        </div>
      </div>

    </div>
  );
}
