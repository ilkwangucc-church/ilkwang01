"use client";
import { useState, useEffect, useRef } from "react";
import { BookText, ChevronDown, ChevronRight, Send, Trash2, Pencil, X, Play, List, MessageCircle } from "lucide-react";

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
    testament: "구약", color: "text-gray-700", bg: "bg-gray-100",
    books: [
      "창세기","출애굽기","레위기","민수기","신명기",
      "여호수아","사사기","룻기","사무엘상","사무엘하","열왕기상","열왕기하","역대상","역대하","에스라","느헤미야","에스더",
      "욥기","시편","잠언","전도서","아가",
      "이사야","예레미야","예레미야애가","에스겔","다니엘",
      "호세아","요엘","아모스","오바댜","요나","미가","나훔","하박국","스바냐","학개","스가랴","말라기",
    ],
  },
  {
    testament: "신약", color: "text-gray-700", bg: "bg-gray-100",
    books: [
      "마태복음","마가복음","누가복음","요한복음",
      "사도행전",
      "로마서","고린도전서","고린도후서","갈라디아서","에베소서","빌립보서","골로새서","데살로니가전서","데살로니가후서","디모데전서","디모데후서","디도서","빌레몬서",
      "히브리서","야고보서","베드로전서","베드로후서","요한일서","요한이서","요한삼서","유다서",
      "요한계시록",
    ],
  },
];

interface PRSVideo    { id: string; title: string; books: string[]; chapter: number | null; publishedAt: string; }
interface BibleSharing { id: number; memberName: string; text: string; date: string; book: string; chapter: number | null; }

/* ═══════════════════════════════════════
   메인 페이지
═══════════════════════════════════════ */
export default function BiblePage() {
  /* ─ 성경책 + 장 선택 ─ */
  const [selectedBook,    setSelectedBook]    = useState("창세기");
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [expandedBook,    setExpandedBook]    = useState<string>("창세기");

  /* ─ 영상 목록 ─ */
  const [allVideos,   setAllVideos]   = useState<PRSVideo[]>([]);
  const [loadingVids, setLoadingVids] = useState(true);

  /* ─ 현재 영상 ─ */
  const [activeVideo, setActiveVideo] = useState<PRSVideo | null>(null);

  /* ─ 말씀 나눔 ─ */
  const [sharings,    setSharings]    = useState<BibleSharing[]>([]);
  const [sharingText, setSharingText] = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [loadingCmt,  setLoadingCmt]  = useState(false);

  /* ─ 필사 ─ */
  const [transcription, setTranscription] = useState("");

  /* ─ 모바일 탭 ─ */
  const [mobileTab, setMobileTab] = useState<"bible" | "playlist" | "share" | "note">("bible");

  /* ─ 레이아웃 감지 (iframe 이중 마운트 방지) ─ */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ─ 재생목록 자동 스크롤 ─ */
  const playlistRef = useRef<HTMLDivElement>(null);

  /* ─ 데스크톱 영상 높이 ─ */
  const videoRowRef  = useRef<HTMLDivElement>(null);
  const [videoRowH, setVideoRowH] = useState(360);

  useEffect(() => {
    const el = videoRowRef.current;
    if (!el) return;
    const update = () => {
      const containerW = el.offsetWidth;
      const playlistW  = 260;
      const videoW     = Math.max(containerW - playlistW, 80);
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

  useEffect(() => {
    if (!loadingVids && allVideos.length > 0 && selectedChapter !== null && !activeVideo) {
      const exact    = allVideos.find((v) => v.books.includes(selectedBook) && v.chapter === selectedChapter);
      const fallback = allVideos.find((v) => v.books.includes(selectedBook));
      setActiveVideo(exact ?? fallback ?? null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingVids]);

  function handleChapterClick(book: string, chapter: number) {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    if (loadingVids) return;
    const exact    = allVideos.find((v) => v.books.includes(book) && v.chapter === chapter);
    const fallback = allVideos.find((v) => v.books.includes(book));
    setActiveVideo(exact ?? fallback ?? null);
  }

  function handleBookClick(book: string) {
    setExpandedBook(expandedBook === book ? "" : book);
    setSelectedBook(book);
  }

  function handlePlaylistClick(ch: number) {
    handleChapterClick(selectedBook, ch);
  }

  useEffect(() => {
    if (!playlistRef.current || selectedChapter === null) return;
    const el = playlistRef.current.querySelector<HTMLElement>(`[data-ch="${selectedChapter}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedChapter, selectedBook]);

  useEffect(() => {
    setLoadingCmt(true);
    const params = new URLSearchParams({ book: selectedBook });
    if (selectedChapter !== null) params.set("chapter", String(selectedChapter));
    fetch(`/api/bible-sharing?${params}`)
      .then((r) => r.json())
      .then((d) => setSharings(Array.isArray(d) ? d : []))
      .catch(() => setSharings([]))
      .finally(() => setLoadingCmt(false));
  }, [selectedBook, selectedChapter]);

  async function submitSharing(e: React.FormEvent) {
    e.preventDefault();
    if (!sharingText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bible-sharing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sharingText.trim(), book: selectedBook, chapter: selectedChapter }),
      });
      if (res.ok) {
        setSharingText("");
        const params = new URLSearchParams({ book: selectedBook });
        if (selectedChapter !== null) params.set("chapter", String(selectedChapter));
        const d = await fetch(`/api/bible-sharing?${params}`).then((r) => r.json());
        setSharings(Array.isArray(d) ? d : []);
      }
    } finally { setSubmitting(false); }
  }

  async function deleteSharing(id: number) {
    if (!confirm("나눔을 삭제하시겠습니까?")) return;
    const res = await fetch("/api/bible-sharing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setSharings((p) => p.filter((s) => s.id !== id));
  }

  const totalChapters = CHAPTER_COUNTS[selectedBook] ?? 1;
  function goPrev() { if (selectedChapter && selectedChapter > 1)            handleChapterClick(selectedBook, selectedChapter - 1); }
  function goNext() { if (selectedChapter && selectedChapter < totalChapters) handleChapterClick(selectedBook, selectedChapter + 1); }

  const videoMap = allVideos.reduce<Record<string, Record<number, PRSVideo>>>((acc, v) => {
    for (const bk of v.books) {
      if (!acc[bk]) acc[bk] = {};
      if (v.chapter !== null && !acc[bk][v.chapter]) acc[bk][v.chapter] = v;
    }
    return acc;
  }, {});

  const bookVideoMap = videoMap[selectedBook] ?? {};
  const bookVideoCount = Object.keys(bookVideoMap).length;

  /* ══ 공통 JSX 블록 ══ */

  /* 성경 선택 패널 (left sidebar on desktop / 성경 탭 on mobile) */
  const BibleNav = () => (
    <div className="flex-1 overflow-y-auto text-sm">
      {BIBLE.map(({ testament, color, bg, books }) => (
        <div key={testament}>
          <div className={`px-3 py-1.5 sticky top-0 z-10 ${bg} border-b border-gray-100`}>
            <span className={`text-sm font-bold ${color}`}>{testament}</span>
          </div>
          {books.map((book) => {
            const bvm        = videoMap[book] ?? {};
            const totalCh    = CHAPTER_COUNTS[book] ?? 1;
            const isExpanded = expandedBook === book;
            return (
              <div key={book} className="border-b border-gray-50">
                <button
                  onClick={() => handleBookClick(book)}
                  className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${
                    selectedBook === book
                      ? "bg-gray-100 text-gray-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm">{book}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">{totalCh}장</span>
                    {isExpanded
                      ? <ChevronDown className="w-3 h-3 text-gray-400" />
                      : <ChevronRight className="w-3 h-3 text-gray-400" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-2 py-2 bg-gray-50 grid grid-cols-7 gap-1">
                    {Array.from({ length: totalCh }, (_, i) => i + 1).map((ch) => {
                      const hasVideo = !!bvm[ch];
                      const isActive = selectedBook === book && selectedChapter === ch;
                      return (
                        <button
                          key={ch}
                          onClick={() => { handleChapterClick(book, ch); setMobileTab("playlist"); }}
                          title={`${book} ${ch}장${hasVideo ? " (영상 있음)" : ""}`}
                          className={`h-8 rounded text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-gray-700 text-white"
                              : hasVideo
                                ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
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
  );

  /* 재생목록 패널 */
  const PlaylistPanel = ({ dark }: { dark?: boolean }) => (
    <div ref={playlistRef} className="flex-1 overflow-y-auto overscroll-contain">
      {Array.from({ length: CHAPTER_COUNTS[selectedBook] ?? 1 }, (_, i) => i + 1).map((ch) => {
        const video    = bookVideoMap[ch];
        const isActive = selectedChapter === ch;
        return (
          <button
            key={ch}
            data-ch={ch}
            onClick={() => handlePlaylistClick(ch)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors border-b ${
              dark
                ? `border-white/[0.05] ${isActive ? "bg-gray-700" : video ? "hover:bg-white/10 cursor-pointer" : loadingVids ? "hover:bg-white/5 cursor-pointer" : "cursor-default opacity-35"}`
                : `border-gray-100 ${isActive ? "bg-blue-50" : video ? "hover:bg-gray-50 cursor-pointer" : loadingVids ? "cursor-pointer" : "cursor-default opacity-40"}`
            }`}
          >
            <span className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold shrink-0 ${
              dark
                ? isActive ? "bg-white/25 text-white" : video ? "bg-white/10 text-gray-300" : "bg-white/5 text-gray-500"
                : isActive ? "bg-gray-700 text-white" : video ? "bg-gray-200 text-gray-600" : "bg-gray-100 text-gray-400"
            }`}>
              {ch}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-tight truncate ${
                dark
                  ? isActive ? "text-white font-medium" : video ? "text-gray-300" : "text-gray-600"
                  : isActive ? "text-blue-700 font-semibold" : video ? "text-gray-700" : "text-gray-400"
              }`}>
                {video ? video.title : `${selectedBook} ${ch}장`}
              </p>
              {video && !isActive && (
                <p className={`text-sm mt-0.5 ${dark ? "text-gray-600" : "text-gray-400"}`}>{video.publishedAt}</p>
              )}
            </div>
            {isActive && <Play className={`w-3 h-3 shrink-0 ${dark ? "text-gray-400 fill-gray-400" : "text-blue-500 fill-blue-500"}`} />}
          </button>
        );
      })}
    </div>
  );

  /* 나눔 패널 */
  const SharingPanel = () => (
    <div className="flex flex-col h-full bg-white">
      <form onSubmit={submitSharing} className="px-4 py-3 border-b border-gray-100 shrink-0">
        <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
          💬 말씀 나눔
          <span className="font-normal text-gray-400">
            · {selectedBook}{selectedChapter ? ` ${selectedChapter}장` : ""} · {sharings.length}개
          </span>
        </p>
        <p className="text-sm text-gray-400 mb-2">커뮤니티 게시판에 자동 공유됩니다</p>
        <div className="flex gap-2">
          <textarea
            value={sharingText}
            onChange={(e) => setSharingText(e.target.value)}
            placeholder="오늘 말씀에서 받은 은혜를 나눠주세요..."
            rows={2}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/30"
          />
          <button
            type="submit"
            disabled={submitting || !sharingText.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 flex flex-col items-center justify-center gap-0.5 self-end transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="text-sm">{submitting ? "..." : "등록"}</span>
          </button>
        </div>
      </form>
      <div className="flex-1 overflow-y-auto">
        {loadingCmt ? (
          <div className="text-center py-6 text-sm text-gray-400">불러오는 중...</div>
        ) : sharings.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 flex flex-col items-center gap-2">
            <span className="text-2xl">🕊️</span>첫 번째 나눔을 남겨주세요
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {sharings.map((s) => (
              <div key={s.id} className="px-4 py-3 hover:bg-gray-50 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-blue-600">{s.memberName}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-400">{s.date}</span>
                    <button
                      onClick={() => deleteSharing(s.id)}
                      className="opacity-0 group-hover:opacity-100 active:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{s.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* 필사 노트 패널 */
  const NotePanel = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-2.5 border-b border-gray-100 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Pencil className="w-3.5 h-3.5 text-gray-500" /> 필사 노트
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
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
          className="flex-1 min-h-0 w-full text-sm text-gray-800 leading-loose border border-gray-200 rounded-xl px-3 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400/30 font-serif placeholder:text-sm placeholder:text-gray-400"
        />
      </div>
      <div className="px-4 py-2 border-t border-gray-100 shrink-0">
        <p className="text-sm text-gray-400 text-right">{transcription.length.toLocaleString()}자</p>
      </div>
    </div>
  );

  /* ═══ 렌더 ═══ */
  return (
    <>
      {/* ══════════════════════════════════
          MOBILE  (< lg)
      ══════════════════════════════════ */}
      <div className="lg:hidden -mx-3 -my-3 sm:-mx-5 sm:-my-5 flex flex-col h-[calc(100vh-56px)] overflow-hidden bg-gray-50">

        {/* 헤더 */}
        <div className="px-3 py-2 bg-white border-b border-gray-200 shrink-0 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 truncate">
              {selectedBook}
              {selectedChapter && <span className="text-gray-700">{selectedChapter}장</span>}
            </h1>
            <p className="text-sm text-gray-400 truncate">
              {activeVideo ? activeVideo.title : loadingVids ? "로딩 중..." : "장 번호를 선택하면 영상이 재생됩니다"}
            </p>
          </div>
          {selectedChapter && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={goPrev}
                disabled={selectedChapter <= 1}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 text-sm"
              >
                ◀
              </button>
              <span className="text-sm text-gray-400 w-12 text-center">{selectedChapter}/{totalChapters}</span>
              <button
                onClick={goNext}
                disabled={selectedChapter >= totalChapters}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 text-sm"
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {/* 영상 (16:9) */}
        <div className="relative w-full shrink-0 bg-black" style={{ paddingTop: "56.25%" }}>
          <img src="/ilkwang01.png" alt="일광교회" className="absolute inset-0 w-full h-full object-cover" />
          {activeVideo && (
            <>
              <img
                src={`https://i.ytimg.com/vi/${activeVideo.id}/hqdefault.jpg`}
                alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden
              />
              {!isDesktop && (
                <iframe
                  key={activeVideo.id}
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen title={activeVideo.title}
                />
              )}
            </>
          )}
        </div>

        {/* 탭 바 */}
        <div className="flex bg-white border-b border-gray-200 shrink-0">
          {([
            { key: "bible",    label: "성경",   Icon: BookText },
            { key: "playlist", label: "재생목록", Icon: List },
            { key: "share",    label: "나눔",    Icon: MessageCircle },
            { key: "note",     label: "필사",    Icon: Pencil },
          ] as const).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setMobileTab(key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-sm font-medium transition-colors border-b-2 ${
                mobileTab === key
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-white">

          {/* 성경 선택 */}
          {mobileTab === "bible" && (
            <div className="flex flex-col h-full">
              <BibleNav />
            </div>
          )}

          {/* 재생목록 */}
          {mobileTab === "playlist" && (
            <div className="flex flex-col h-full">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
                <p className="text-sm font-bold text-gray-700">{selectedBook} 재생목록</p>
                <p className="text-sm text-gray-400">
                  {loadingVids ? "연결 중..." : `${bookVideoCount}개 영상 · 전체 ${CHAPTER_COUNTS[selectedBook] ?? 1}장`}
                </p>
              </div>
              <PlaylistPanel dark={false} />
            </div>
          )}

          {/* 나눔 */}
          {mobileTab === "share" && <SharingPanel />}

          {/* 필사 */}
          {mobileTab === "note" && (
            <div className="flex flex-col" style={{ minHeight: "calc(100vh - 300px)" }}>
              <NotePanel />
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          DESKTOP  (lg+)
      ══════════════════════════════════ */}
      <div className="hidden lg:flex -mx-6 -my-6 h-[calc(100vh-56px)] overflow-hidden bg-gray-50">

        {/* LEFT — 성경 목록 + 장절 그리드 */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
          <div className="px-3 py-2 border-b border-gray-100 shrink-0">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <BookText className="w-3.5 h-3.5" /> 성경 통독 (66권)
            </p>
          </div>
          <BibleNav />
        </aside>

        {/* CENTER — 영상 + 재생목록 + 댓글 */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* 헤더 */}
          <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 gap-2">
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 truncate">
                {selectedBook}
                {selectedChapter && <span className="text-gray-700">{selectedChapter}장</span>}
              </h1>
              <p className="text-sm text-gray-400 truncate">
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
                  className="px-2.5 py-1 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  ◀ 이전
                </button>
                <span className="text-sm text-gray-400 w-14 text-center">
                  {selectedChapter} / {totalChapters}
                </span>
                <button
                  onClick={goNext}
                  disabled={selectedChapter >= totalChapters}
                  className="px-2.5 py-1 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                  다음 ▶
                </button>
              </div>
            )}
          </div>

          {/* 영상 + 재생목록 */}
          <div ref={videoRowRef} className="flex shrink-0 bg-[#0f0f0f]" style={{ height: videoRowH }}>
            {/* 영상 */}
            <div className="shrink-0 bg-black relative" style={{ width: videoRowH * (16 / 9) }}>
              <img src="/ilkwang01.png" alt="일광교회" className="absolute inset-0 w-full h-full object-cover" />
              {activeVideo ? (
                <>
                  <img
                    src={`https://i.ytimg.com/vi/${activeVideo.id}/hqdefault.jpg`}
                    alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden
                  />
                  {isDesktop && (
                    <iframe
                      key={activeVideo.id}
                      src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title={activeVideo.title}
                    />
                  )}
                </>
              ) : null}
            </div>

            {/* 재생목록 260px */}
            <div className="w-[260px] shrink-0 bg-[#0f0f0f] flex flex-col border-l border-white/10 overflow-hidden">
              <div className="px-3 py-2 bg-[#1a1a1a] border-b border-white/10 shrink-0">
                <p className="text-white text-sm font-bold truncate">{selectedBook} 재생목록</p>
                <p className="text-gray-500 text-sm mt-0.5">
                  {loadingVids ? "연결 중..." : `${bookVideoCount}개 영상 · 전체 ${CHAPTER_COUNTS[selectedBook] ?? 1}장`}
                </p>
              </div>
              <PlaylistPanel dark />
            </div>
          </div>

          {/* 말씀 나눔 */}
          <div className="flex-1 overflow-hidden">
            <SharingPanel />
          </div>
        </div>

        {/* RIGHT — 필사 노트 */}
        <div className="w-72 border-l border-gray-200 overflow-hidden shrink-0">
          <NotePanel />
        </div>
      </div>
    </>
  );
}
