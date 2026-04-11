"use client";
import { useState, useEffect, useRef } from "react";
import { BookText, ChevronDown, ChevronRight, Send, Trash2, Pencil, X, Play } from "lucide-react";

/* ═══════════════════════════════════════
   성경 66권 구조 + 장 수
═══════════════════════════════════════ */
const CHAPTER_COUNTS: Record<string, number> = {
  창세기:50, 출애굽기:40, 레위기:27, 민수기:36, 신명기:34,
  여호수아:24, 사사기:21, 룻기:4, 사무엘상:31, 사무엘하:24,
  열왕기상:22, 열왕기하:25, 역대상:29, 역대하:36, 에스라:10,
  느헤미야:13, 에스더:10, 욥기:42, 시편:150, 잠언:31,
  전도서:12, 아가:8, 이사야:66, 예레미야:52, 예레미야애가:5,
  에스겔:48, 다니엘:12, 호세아:14, 요엘:3, 아모스:9,
  오바댜:1, 요나:4, 미가:7, 나훔:3, 하박국:3, 스바냐:3,
  학개:2, 스가랴:14, 말라기:4,
  마태복음:28, 마가복음:16, 누가복음:24, 요한복음:21,
  사도행전:28, 로마서:16, 고린도전서:16, 고린도후서:13,
  갈라디아서:6, 에베소서:6, 빌립보서:4, 골로새서:4,
  데살로니가전서:5, 데살로니가후서:3, 디모데전서:6, 디모데후서:4,
  디도서:3, 빌레몬서:1, 히브리서:13, 야고보서:5,
  베드로전서:5, 베드로후서:3, 요한일서:5, 요한이서:1,
  요한삼서:1, 유다서:1, 요한계시록:22,
};

const BIBLE = [
  {
    testament: "구약", color: "text-[#2E7D32]", bg: "bg-[#E8F5E9]",
    sections: [
      { name: "율법서",   books: ["창세기","출애굽기","레위기","민수기","신명기"] },
      { name: "역사서",   books: ["여호수아","사사기","룻기","사무엘상","사무엘하","열왕기상","열왕기하","역대상","역대하","에스라","느헤미야","에스더"] },
      { name: "시가서",   books: ["욥기","시편","잠언","전도서","아가"] },
      { name: "대선지서", books: ["이사야","예레미야","예레미야애가","에스겔","다니엘"] },
      { name: "소선지서", books: ["호세아","요엘","아모스","오바댜","요나","미가","나훔","하박국","스바냐","학개","스가랴","말라기"] },
    ],
  },
  {
    testament: "신약", color: "text-blue-700", bg: "bg-blue-50",
    sections: [
      { name: "복음서",   books: ["마태복음","마가복음","누가복음","요한복음"] },
      { name: "역사서",   books: ["사도행전"] },
      { name: "바울서신", books: ["로마서","고린도전서","고린도후서","갈라디아서","에베소서","빌립보서","골로새서","데살로니가전서","데살로니가후서","디모데전서","디모데후서","디도서","빌레몬서"] },
      { name: "일반서신", books: ["히브리서","야고보서","베드로전서","베드로후서","요한일서","요한이서","요한삼서","유다서"] },
      { name: "예언서",   books: ["요한계시록"] },
    ],
  },
];

interface PRSVideo { id: string; title: string; books: string[]; chapter: number | null; publishedAt: string; }
interface Comment  { id: number; memberName: string; text: string; date: string; }

/* ═══════════════════════════════════════
   메인 페이지
═══════════════════════════════════════ */
export default function BiblePage() {
  /* ─ 성경책 + 장 선택 ─ */
  const [selectedBook,    setSelectedBook]    = useState("창세기");
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [expandedBook,    setExpandedBook]    = useState<string>("창세기");
  const [openSections,    setOpenSections]    = useState<Record<string, boolean>>({ 율법서: true });

  /* ─ 영상 목록 ─ */
  const [allVideos,   setAllVideos]   = useState<PRSVideo[]>([]);
  const [loadingVids, setLoadingVids] = useState(true);

  /* ─ 현재 영상 ─ */
  const [activeVideo, setActiveVideo] = useState<PRSVideo | null>(null);

  /* ─ 댓글 ─ */
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [loadingCmt,  setLoadingCmt]  = useState(false);

  /* ─ 필사 ─ */
  const [transcription, setTranscription] = useState("");

  /* ─ 재생목록 자동 스크롤 ─ */
  const playlistRef = useRef<HTMLDivElement>(null);

  /* ─ 영상 영역 높이: JS로 정확한 16:9 계산 ─ */
  const videoRowRef  = useRef<HTMLDivElement>(null);
  const [videoRowH, setVideoRowH] = useState(360);

  useEffect(() => {
    const el = videoRowRef.current;
    if (!el) return;
    const update = () => {
      const containerW = el.offsetWidth;
      const playlistW  = 208;                        // w-52 고정
      const videoW     = Math.max(containerW - playlistW, 200);
      setVideoRowH(Math.round(videoW * 9 / 16));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ══ @PRS 전체 영상 로드 ══ */
  useEffect(() => {
    fetch("/api/prs-videos")
      .then((r) => r.json())
      .then((d: PRSVideo[]) => setAllVideos(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingVids(false));
  }, []);

  /* ══ 로딩 완료 → 대기 중인 선택 장으로 자동 재생 ══ */
  useEffect(() => {
    if (!loadingVids && allVideos.length > 0 && selectedChapter !== null && !activeVideo) {
      const exact    = allVideos.find((v) => v.books.includes(selectedBook) && v.chapter === selectedChapter);
      const fallback = allVideos.find((v) => v.books.includes(selectedBook));
      setActiveVideo(exact ?? fallback ?? null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingVids]);

  /* ══ 장 클릭 → 영상 즉시 로드 (로딩 중이면 선택만 저장) ══ */
  function handleChapterClick(book: string, chapter: number) {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    if (loadingVids) return; // 로딩 완료 후 위 effect가 처리
    const exact    = allVideos.find((v) => v.books.includes(book) && v.chapter === chapter);
    const fallback = allVideos.find((v) => v.books.includes(book));
    setActiveVideo(exact ?? fallback ?? null);
  }

  /* ══ 책 클릭 → 장 그리드 열기 ══ */
  function handleBookClick(book: string) {
    setExpandedBook(expandedBook === book ? "" : book);
    setSelectedBook(book);
  }

  /* ══ 재생목록에서 장 클릭 ══ */
  function handlePlaylistClick(ch: number) {
    handleChapterClick(selectedBook, ch);
  }

  /* ══ 재생목록 스크롤 — 현재 장으로 ══ */
  useEffect(() => {
    if (!playlistRef.current || selectedChapter === null) return;
    const el = playlistRef.current.querySelector<HTMLElement>(
      `[data-ch="${selectedChapter}"]`
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedChapter, selectedBook]);

  /* ══ 댓글 로드 ══ */
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
    } finally { setSubmitting(false); }
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

  /* 이전 / 다음 장 */
  const totalChapters = CHAPTER_COUNTS[selectedBook] ?? 1;
  function goPrev() { if (selectedChapter && selectedChapter > 1)            handleChapterClick(selectedBook, selectedChapter - 1); }
  function goNext() { if (selectedChapter && selectedChapter < totalChapters) handleChapterClick(selectedBook, selectedChapter + 1); }

  /* 책별 영상 맵 */
  const videoMap = allVideos.reduce<Record<string, Record<number, PRSVideo>>>((acc, v) => {
    for (const bk of v.books) {
      if (!acc[bk]) acc[bk] = {};
      if (v.chapter !== null && !acc[bk][v.chapter]) acc[bk][v.chapter] = v;
    }
    return acc;
  }, {});

  const bookVideoMap = videoMap[selectedBook] ?? {};
  const bookVideoCount = Object.keys(bookVideoMap).length;

  /* ═══ 렌더 ═══ */
  return (
    <div className="-mx-5 -my-5 lg:-mx-6 lg:-my-6 flex h-[calc(100vh-56px)] overflow-hidden bg-gray-50">

      {/* ════════════════════════════════
          LEFT — 성경 목록 + 장절 그리드
      ════════════════════════════════ */}
      <aside className="w-52 lg:w-56 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
        <div className="px-3 py-2 border-b border-gray-100 shrink-0">
          <p className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-1.5">
            <BookText className="w-3.5 h-3.5" /> 성경 통독 (66권)
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
                    const bvm      = videoMap[book] ?? {};
                    const totalCh  = CHAPTER_COUNTS[book] ?? 1;
                    const isExpanded = expandedBook === book;

                    return (
                      <div key={book} className="border-b border-gray-50">
                        <button
                          onClick={() => handleBookClick(book)}
                          className={`w-full flex items-center justify-between px-4 py-1.5 transition-colors ${
                            selectedBook === book
                              ? "bg-[#E8F5E9] text-[#2E7D32] font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{book}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-gray-400">{totalCh}장</span>
                            {isExpanded
                              ? <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                              : <ChevronRight className="w-2.5 h-2.5 text-gray-400" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-2 py-2 bg-gray-50 grid grid-cols-6 gap-0.5">
                            {Array.from({ length: totalCh }, (_, i) => i + 1).map((ch) => {
                              const hasVideo = !!bvm[ch];
                              const isActive = selectedBook === book && selectedChapter === ch;
                              return (
                                <button
                                  key={ch}
                                  onClick={() => handleChapterClick(book, ch)}
                                  title={`${book} ${ch}장${hasVideo ? " (영상 있음)" : ""}`}
                                  className={`h-7 rounded text-[10px] font-medium transition-colors ${
                                    isActive
                                      ? "bg-[#2E7D32] text-white"
                                      : hasVideo
                                        ? "bg-[#C8E6C9] text-[#2E7D32] hover:bg-[#A5D6A7]"
                                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                  }`}
                                >
                                  {ch}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ════════════════════════════════
          CENTER — 영상 + 재생목록 + 댓글
      ════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* 헤더 */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 gap-2">
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 truncate">
              {selectedBook}
              {selectedChapter && (
                <span className="text-[#2E7D32]">{selectedChapter}장</span>
              )}
            </h1>
            <p className="text-[11px] text-gray-400 truncate">
              {activeVideo
                ? activeVideo.title
                : loadingVids
                  ? "@PRS 영상 로딩 중..."
                  : "장 번호를 클릭하면 영상이 바로 재생됩니다"}
            </p>
          </div>

          {selectedChapter && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={goPrev}
                disabled={selectedChapter <= 1}
                className="px-2.5 py-1 text-[11px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                ◀ 이전
              </button>
              <span className="text-[11px] text-gray-400 w-14 text-center">
                {selectedChapter} / {totalChapters}
              </span>
              <button
                onClick={goNext}
                disabled={selectedChapter >= totalChapters}
                className="px-2.5 py-1 text-[11px] border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                다음 ▶
              </button>
            </div>
          )}
        </div>

        {/* ── 영상 + 재생목록 ──
             videoRowH = JS로 계산한 정확한 16:9 높이
             → 영상 width = videoRowH * 16/9
             → iframe 이 딱 맞아서 검은 여백 없음 ── */}
        <div
          ref={videoRowRef}
          className="flex shrink-0 bg-[#0f0f0f]"
          style={{ height: videoRowH }}
        >
          {/* 영상: 폭 = 높이 × 16/9 → 정확한 비율 */}
          <div
            className="shrink-0 bg-black relative"
            style={{ width: videoRowH * (16 / 9) }}
          >
            {activeVideo ? (
              <>
                {/* 썸네일 — iframe 로딩 전 커버 (포스터 역할) */}
                <img
                  src={`https://i.ytimg.com/vi/${activeVideo.id}/hqdefault.jpg`}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  aria-hidden
                />
                <iframe
                  key={activeVideo.id}
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeVideo.title}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
                <BookText className="w-16 h-16 text-white/10" />
                <div className="text-center px-6">
                  <p className="text-white/50 text-xl font-bold">{selectedBook}</p>
                  <p className="text-white/25 text-xs mt-1.5">
                    {selectedChapter
                      ? `${selectedChapter}장 영상 없음`
                      : "오른쪽 목록에서 장을 선택하세요"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 재생목록: 208px 고정 */}
          <div className="w-52 shrink-0 bg-[#0f0f0f] flex flex-col border-l border-white/10 overflow-hidden">
            {/* 헤더 */}
            <div className="px-3 py-2 bg-[#1a1a1a] border-b border-white/10 shrink-0">
              <p className="text-white text-xs font-bold truncate">
                {selectedBook} 재생목록
              </p>
              <p className="text-gray-500 text-[10px] mt-0.5">
                {loadingVids
                  ? "연결 중..."
                  : `${bookVideoCount}개 영상 · 전체 ${CHAPTER_COUNTS[selectedBook] ?? 1}장`}
              </p>
            </div>

            {/* 장 목록 — 로딩 여부 관계없이 즉시 표시 */}
            <div ref={playlistRef} className="flex-1 overflow-y-auto overscroll-contain">
              {Array.from(
                { length: CHAPTER_COUNTS[selectedBook] ?? 1 },
                (_, i) => i + 1
              ).map((ch) => {
                const video    = bookVideoMap[ch];       // 로딩 전엔 undefined
                const isActive = selectedChapter === ch;

                return (
                  <button
                    key={ch}
                    data-ch={ch}
                    onClick={() => handlePlaylistClick(ch)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors border-b border-white/[0.05] ${
                      isActive
                        ? "bg-[#2E7D32]"
                        : video
                          ? "hover:bg-white/10 cursor-pointer"
                          : loadingVids
                            ? "hover:bg-white/5 cursor-pointer"   // 로딩 중엔 클릭 허용 (대기)
                            : "cursor-default opacity-35"
                    }`}
                  >
                    {/* 장 번호 */}
                    <span
                      className={`w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isActive
                          ? "bg-white/25 text-white"
                          : video
                            ? "bg-white/10 text-gray-300"
                            : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {ch}
                    </span>

                    {/* 제목 */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] leading-tight truncate ${
                        isActive ? "text-white font-medium" : video ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {video ? video.title : `${selectedBook} ${ch}장`}
                      </p>
                      {video && !isActive && (
                        <p className="text-[9px] text-gray-600 mt-0.5">{video.publishedAt}</p>
                      )}
                    </div>

                    {isActive && <Play className="w-3 h-3 text-green-400 shrink-0 fill-green-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 댓글 (말씀 나눔) ── */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-white">
          {/* 입력 */}
          <form onSubmit={submitComment} className="px-4 py-3 border-b border-gray-100 shrink-0">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              💬 말씀 나눔
              {activeVideo && <span className="font-normal text-gray-400 ml-1">· {comments.length}개</span>}
            </p>
            <div className="flex gap-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!activeVideo}
                placeholder={activeVideo ? "이 말씀에서 받은 은혜를 나눠주세요..." : "영상을 먼저 선택하세요"}
                rows={2}
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim() || !activeVideo}
                className="px-3 py-2 bg-[#2E7D32] text-white rounded-lg text-xs font-semibold hover:bg-[#1B5E20] disabled:opacity-40 flex flex-col items-center justify-center gap-0.5 self-end transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="text-[9px]">{submitting ? "..." : "등록"}</span>
              </button>
            </div>
          </form>

          {/* 목록 */}
          <div className="flex-1 overflow-y-auto">
            {loadingCmt ? (
              <div className="text-center py-6 text-xs text-gray-400">불러오는 중...</div>
            ) : !activeVideo ? (
              <div className="text-center py-8 text-xs text-gray-400 flex flex-col items-center gap-2">
                <span className="text-2xl">📖</span>장 번호를 클릭하면 댓글을 볼 수 있습니다
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400 flex flex-col items-center gap-2">
                <span className="text-2xl">🕊️</span>첫 번째 나눔을 남겨주세요
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

      {/* ════════════════════════════════
          RIGHT — 필사 노트
      ════════════════════════════════ */}
      <div className="w-60 lg:w-72 border-l border-gray-200 bg-white flex flex-col overflow-hidden shrink-0">
        <div className="px-4 py-2.5 border-b border-gray-100 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-[#2E7D32]" /> 필사 노트
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {selectedBook}{selectedChapter ? ` ${selectedChapter}장` : ""} · 말씀을 타이핑하세요
            </p>
          </div>
          {transcription && (
            <button
              onClick={() => { if (confirm("초기화하시겠습니까?")) setTranscription(""); }}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="초기화"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 p-3 overflow-hidden flex flex-col">
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder={"말씀을 들으며 직접 타이핑해 보세요.\n\n예)\n태초에 하나님이\n천지를 창조하시니라\n(창 1:1)"}
            className="flex-1 min-h-0 w-full text-sm text-gray-800 leading-loose border border-gray-200 rounded-xl px-3 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 font-serif placeholder:text-xs placeholder:text-gray-400"
          />
        </div>

        <div className="px-4 py-2 border-t border-gray-100 shrink-0">
          <p className="text-[10px] text-gray-400 text-right">{transcription.length.toLocaleString()}자</p>
        </div>
      </div>

    </div>
  );
}
