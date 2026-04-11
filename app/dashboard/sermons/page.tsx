"use client";
import { useState, useEffect, useRef } from "react";
import { Play, Pencil, X, Send, Trash2, ChevronDown, ChevronRight, List, MessageCircle } from "lucide-react";

interface SermonVideo {
 id: string;
 title: string;
 publishedAt: string;
 year: number;
 duration: string;
 thumbnail: string;
}

interface SermonSharing {
 id: number;
 memberName: string;
 text: string;
 date: string;
 book: string;
 chapter: number | null;
}

/* ── 공유 가능한 패널 컴포넌트 ── */
interface SharingPanelProps {
 sharingText: string; setSharingText: (v: string) => void;
 submitting: boolean;
 submitSharing: (e: React.FormEvent) => void;
 sharings: SermonSharing[];
 loadingCmt: boolean;
 deleteSharing: (id: number) => void;
}
function SharingPanel({ sharingText, setSharingText, submitting, submitSharing, sharings, loadingCmt, deleteSharing }: SharingPanelProps) {
 return (
 <div className="flex flex-col h-full bg-white">
 <form onSubmit={submitSharing} className="px-[10px] py-3 border-b border-gray-100 shrink-0">
 <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
 설교 나눔
 <span className="font-normal text-gray-400">· {sharings.length}개</span>
 </p>
 <p className="text-sm text-gray-400 mb-2">커뮤니티 게시판에 자동 공유됩니다</p>
 <div className="flex gap-2">
 <textarea
 value={sharingText}
 onChange={(e) => setSharingText(e.target.value)}
 placeholder="설교 말씀에서 받은 은혜를 나눠주세요..."
 rows={2}
 className="flex-1 text-sm border border-gray-200 rounded-lg px-[10px] py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400/30"
 />
 <button
 type="submit"
 disabled={submitting || !sharingText.trim()}
 className="px-[10px] py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 flex flex-col items-center justify-center gap-0.5 self-end transition-colors"
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
 <span className="text-2xl"></span>첫 번째 나눔을 남겨주세요
 </div>
 ) : (
 <div className="divide-y divide-gray-50">
 {sharings.map((s) => (
 <div key={s.id} className="px-[10px] py-3 hover:bg-gray-50 group">
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
}

interface NotePanelProps {
 notes: string; setNotes: (v: string) => void;
 activeVideo: SermonVideo | null;
}
function NotePanel({ notes, setNotes, activeVideo }: NotePanelProps) {
 return (
 <div className="flex flex-col h-full bg-white">
 <div className="px-[10px] py-2.5 border-b border-gray-100 shrink-0 flex items-center justify-between">
 <div>
 <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
 <Pencil className="w-3.5 h-3.5 text-gray-500" /> 설교 노트
 </h2>
 <p className="text-sm text-gray-400 mt-0.5">
 {activeVideo ? activeVideo.publishedAt : "설교를 선택하세요"}
 </p>
 </div>
 {notes && (
 <button
 onClick={() => { if (confirm("초기화하시겠습니까?")) setNotes(""); }}
 className="text-gray-400 hover:text-red-500 transition-colors"
 title="초기화"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 )}
 </div>
 <div className="flex-1 p-3 overflow-hidden flex flex-col">
 <textarea
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 placeholder={"설교 말씀을 기록하세요.\n\n예)\n- 본문:\n- 핵심 메시지:\n- 적용:"}
 className="flex-1 min-h-0 w-full text-sm text-gray-800 leading-loose border border-gray-200 rounded-xl px-[10px] py-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400/30 font-serif placeholder:text-sm placeholder:text-gray-400"
 />
 </div>
 <div className="px-[10px] py-2 border-t border-gray-100 shrink-0">
 <p className="text-sm text-gray-400 text-right">{notes.length.toLocaleString()}자</p>
 </div>
 </div>
 );
}

export default function SermonsPage() {
 /* ─ 영상 데이터 ─ */
 const [sermons, setSermons] = useState<SermonVideo[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeVideo, setActiveVideo] = useState<SermonVideo | null>(null);
 const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

 /* ─ 설교 노트 ─ */
 const [notes, setNotes] = useState("");
 const [shouldAutoplay, setShouldAutoplay] = useState(false);

 /* ─ 나눔 ─ */
 const [sharings, setSharings] = useState<SermonSharing[]>([]);
 const [sharingText, setSharingText] = useState("");
 const [submitting, setSubmitting] = useState(false);
 const [loadingCmt, setLoadingCmt] = useState(false);

 /* ─ 모바일 탭 ─ */
 const [mobileTab, setMobileTab] = useState<"list" | "share" | "note">("list");

 /* ─ 레이아웃 감지 (iframe 이중 마운트 방지) ─ */
 const [isDesktop, setIsDesktop] = useState(false);
 useEffect(() => {
 const check = () => setIsDesktop(window.innerWidth >= 1024);
 check();
 window.addEventListener("resize", check);
 return () => window.removeEventListener("resize", check);
 }, []);

 /* ─ 데스크톱 영상 높이 계산 ─ */
 const videoRowRef = useRef<HTMLDivElement>(null);
 const [videoRowH, setVideoRowH] = useState(360);
 const playlistRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const el = videoRowRef.current;
 if (!el) return;
 const update = () => {
 const containerW = el.offsetWidth;
 const playlistW = 260;
 const videoW = Math.max(containerW - playlistW, 80);
 setVideoRowH(Math.round(videoW * 9 / 16));
 };
 update();
 const ro = new ResizeObserver(update);
 ro.observe(el);
 return () => ro.disconnect();
 }, []);

 /* ══ @ilkwangucc 영상 로드 ══ */
 useEffect(() => {
 fetch("/api/ilkwang-sermons")
 .then((r) => r.json())
 .then((d: SermonVideo[]) => {
 const arr = Array.isArray(d) ? d : [];
 setSermons(arr);
 if (arr.length > 0) {
 const latestYear = Math.max(...arr.map((v) => v.year));
 setExpandedYears({ [latestYear]: true });
 }
 })
 .catch(() => {})
 .finally(() => setLoading(false));
 }, []);

 /* ══ 나눔 로드 ══ */
 useEffect(() => {
 setLoadingCmt(true);
 fetch("/api/bible-sharing?book=%EC%84%A4%EA%B5%90")
 .then((r) => r.json())
 .then((d) => setSharings(Array.isArray(d) ? d : []))
 .catch(() => setSharings([]))
 .finally(() => setLoadingCmt(false));
 }, [activeVideo]);

 async function submitSharing(e: React.FormEvent) {
 e.preventDefault();
 if (!sharingText.trim()) return;
 setSubmitting(true);
 try {
 const res = await fetch("/api/bible-sharing", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ text: sharingText.trim(), book: "설교", chapter: null }),
 });
 if (res.ok) {
 setSharingText("");
 const d = await fetch("/api/bible-sharing?book=%EC%84%A4%EA%B5%90").then((r) => r.json());
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

 /* ══ 연도별 그룹 ══ */
 const yearGroups = sermons.reduce<Record<number, SermonVideo[]>>((acc, v) => {
 if (!acc[v.year]) acc[v.year] = [];
 acc[v.year].push(v);
 return acc;
 }, {});
 const years = Object.keys(yearGroups).map(Number).sort((a, b) => b - a);

 /* ══ 데스크톱 재생목록 스크롤 ══ */
 useEffect(() => {
 if (!playlistRef.current || !activeVideo) return;
 const el = playlistRef.current.querySelector<HTMLElement>(`[data-id="${activeVideo.id}"]`);
 el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
 }, [activeVideo]);

 function selectVideo(v: SermonVideo) {
 setActiveVideo(v);
 setShouldAutoplay(true);
 }

 /* ══ 공통: 영상 영역 JSX ══ */
 /* mobile=true → 모바일 레이아웃, isDesktop이 false일 때만 iframe 마운트 */
 /* mobile=false → 데스크탑 레이아웃, isDesktop이 true일 때만 iframe 마운트 */
 const VideoArea = ({ mobile }: { mobile: boolean }) => {
 const showIframe = mobile ? !isDesktop : isDesktop;
 return (
 <div
 className={mobile ? "relative shrink-0 bg-black mx-[10px]" : "shrink-0 bg-black relative"}
 style={mobile
 ? { paddingTop: "56.25%" }
 : { width: videoRowH * (16 / 9) }
 }
 >
 <img src="/ilkwang02.png" alt="일광교회" className="absolute inset-0 w-full h-full object-cover" />
 {activeVideo && (
 <>
 <img src={activeVideo.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden />
 {showIframe && (
 <iframe
 key={activeVideo.id}
 src={`https://www.youtube.com/embed/${activeVideo.id}?rel=0${shouldAutoplay ? "&autoplay=1" : ""}`}
 className="absolute inset-0 w-full h-full"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen
 title={activeVideo.title}
 />
 )}
 </>
 )}
 </div>
 );
 };

 /* ═══ 렌더 ═══ */
 return (
 <>
 {/* ══════════════════════════════════
 MOBILE (< lg)
 ══════════════════════════════════ */}
 <div className="lg:hidden -mx-[10px] -my-3 sm:-mx-5 sm:-my-5 flex flex-col h-[calc(100vh-56px)] overflow-hidden bg-gray-50">

 {/* 헤더 */}
 <div className="px-[10px] py-2 bg-white border-b border-gray-200 shrink-0">
 <h1 className="font-bold text-gray-900 text-sm truncate">
 {activeVideo ? activeVideo.title : "설교 보기"}
 </h1>
 <p className="text-sm text-gray-400 truncate">
 {loading
 ? "@ilkwangucc 로딩 중..."
 : activeVideo
 ? `${activeVideo.publishedAt}${activeVideo.duration ? " · " + activeVideo.duration : ""}`
 : "@ilkwangucc 설교 영상"}
 </p>
 </div>

 {/* 영상 (16:9 padding-top trick) */}
 <VideoArea mobile />

 {/* 탭 바 */}
 <div className="flex bg-white border-b border-gray-200 shrink-0">
 {([
 { key: "list", label: "설교목록", Icon: List },
 { key: "share", label: "나눔", Icon: MessageCircle },
 { key: "note", label: "설교노트", Icon: Pencil },
 ] as const).map(({ key, label, Icon }) => (
 <button
 key={key}
 onClick={() => setMobileTab(key)}
 className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-sm font-medium transition-colors border-b-2 ${
 mobileTab === key
 ? "text-gray-700 border-gray-700"
 : "text-gray-400 border-transparent"
 }`}
 >
 <Icon className="w-4 h-4" />
 {label}
 </button>
 ))}
 </div>

 {/* 탭 콘텐츠 */}
 <div className="flex-1 overflow-y-auto overscroll-contain">

 {/* 설교 목록 */}
 {mobileTab === "list" && (
 <div>
 {loading ? (
 <div className="text-center py-8 text-sm text-gray-400">영상 불러오는 중...</div>
 ) : years.length === 0 ? (
 <div className="text-center py-8 text-sm text-gray-400">영상이 없습니다</div>
 ) : (
 years.map((year) => (
 <div key={year}>
 <button
 onClick={() => setExpandedYears((p) => ({ ...p, [year]: !p[year] }))}
 className="w-full flex items-center justify-between px-[10px] py-3 bg-gray-100 border-b border-gray-100 sticky top-0 z-10"
 >
 <span className="text-sm font-bold text-gray-700">{year}년</span>
 <div className="flex items-center gap-2">
 <span className="text-sm text-gray-400">{yearGroups[year].length}편</span>
 {expandedYears[year]
 ? <ChevronDown className="w-4 h-4 text-gray-400" />
 : <ChevronRight className="w-4 h-4 text-gray-400" />}
 </div>
 </button>
 {expandedYears[year] && yearGroups[year].map((v) => (
 <button
 key={v.id}
 onClick={() => selectVideo(v)}
 className={`w-full flex items-center gap-3 px-[10px] py-3 text-left border-b border-gray-50 transition-colors active:bg-gray-100 ${
 activeVideo?.id === v.id ? "bg-gray-100" : "hover:bg-gray-50"
 }`}
 >
 <div className="w-20 h-[45px] shrink-0 rounded overflow-hidden bg-black relative">
 <img src={v.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
 {v.duration && (
 <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-sm px-0.5 rounded leading-tight">
 {v.duration}
 </span>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className={`text-sm leading-tight line-clamp-2 ${
 activeVideo?.id === v.id ? "text-gray-700 font-semibold" : "text-gray-800"
 }`}>
 {v.title}
 </p>
 <p className="text-sm text-gray-400 mt-1">{v.publishedAt}</p>
 </div>
 {activeVideo?.id === v.id && (
 <Play className="w-4 h-4 text-gray-600 fill-gray-600 shrink-0" />
 )}
 </button>
 ))}
 </div>
 ))
 )}
 </div>
 )}

 {/* 나눔 */}
 {mobileTab === "share" && (
 <div className="flex flex-col min-h-full">
 <SharingPanel
 sharingText={sharingText} setSharingText={setSharingText}
 submitting={submitting} submitSharing={submitSharing}
 sharings={sharings} loadingCmt={loadingCmt} deleteSharing={deleteSharing}
 />
 </div>
 )}

 {/* 설교 노트 */}
 {mobileTab === "note" && (
 <div className="flex flex-col" style={{ minHeight: "calc(100vh - 280px)" }}>
 <NotePanel notes={notes} setNotes={setNotes} activeVideo={activeVideo} />
 </div>
 )}
 </div>
 </div>

 {/* ══════════════════════════════════
 DESKTOP (lg+)
 ══════════════════════════════════ */}
 <div className="hidden lg:flex -mx-6 -my-6 h-[calc(100vh-56px)] overflow-hidden bg-gray-50">

 {/* LEFT — 연도별 설교 목록 */}
 <aside className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
 <div className="px-[10px] py-2 border-b border-gray-100 shrink-0">
 <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
 <Play className="w-3.5 h-3.5" /> 설교 영상
 </p>
 </div>
 <div className="flex-1 overflow-y-auto text-sm">
 {loading ? (
 <div className="px-[10px] py-4 text-center text-gray-400 text-sm">영상 불러오는 중...</div>
 ) : years.length === 0 ? (
 <div className="px-[10px] py-4 text-center text-gray-400 text-sm">영상이 없습니다</div>
 ) : (
 years.map((year) => (
 <div key={year}>
 <button
 onClick={() => setExpandedYears((p) => ({ ...p, [year]: !p[year] }))}
 className="w-full flex items-center justify-between px-[10px] py-1.5 bg-gray-100 border-b border-gray-100 hover:bg-gray-200 sticky top-0 z-10"
 >
 <span className="text-sm font-bold text-gray-700">{year}년</span>
 <div className="flex items-center gap-1">
 <span className="text-sm text-gray-400">{yearGroups[year].length}편</span>
 {expandedYears[year]
 ? <ChevronDown className="w-3 h-3 text-gray-400" />
 : <ChevronRight className="w-3 h-3 text-gray-400" />}
 </div>
 </button>
 {expandedYears[year] && yearGroups[year].map((v) => (
 <button
 key={v.id}
 onClick={() => selectVideo(v)}
 className={`w-full flex items-start gap-2 px-[10px] py-2 text-left transition-colors border-b border-gray-50 ${
 activeVideo?.id === v.id
 ? "bg-gray-100 text-gray-700 font-semibold"
 : "text-gray-700 hover:bg-gray-50"
 }`}
 >
 <Play className={`w-3 h-3 mt-0.5 shrink-0 ${
 activeVideo?.id === v.id ? "fill-gray-600 text-gray-600" : "text-gray-300"
 }`} />
 <div className="min-w-0">
 <p className="text-sm leading-tight line-clamp-2">{v.title}</p>
 <p className="text-sm text-gray-400 mt-0.5">{v.publishedAt}</p>
 </div>
 </button>
 ))}
 </div>
 ))
 )}
 </div>
 </aside>

 {/* CENTER — 영상 + 재생목록 + 나눔 */}
 <div className="flex-1 flex flex-col overflow-hidden min-w-0">
 {/* 헤더 */}
 <div className="px-[10px] py-2 bg-white border-b border-gray-200 flex items-center gap-2 shrink-0">
 <div className="min-w-0 flex-1">
 <h1 className="font-bold text-gray-900 text-sm truncate">
 {activeVideo ? activeVideo.title : "설교 보기"}
 </h1>
 <p className="text-sm text-gray-400 truncate">
 {loading
 ? "@ilkwangucc 영상 로딩 중..."
 : activeVideo
 ? `${activeVideo.publishedAt}${activeVideo.duration ? " · " + activeVideo.duration : ""}`
 : "왼쪽에서 설교를 선택하세요"}
 </p>
 </div>
 </div>

 {/* 영상 + 재생목록 행 */}
 <div ref={videoRowRef} className="flex shrink-0 bg-[#0f0f0f]" style={{ height: videoRowH }}>
 <VideoArea mobile={false} />

 {/* 재생목록 260px */}
 <div className="w-[260px] shrink-0 bg-[#0f0f0f] flex flex-col border-l border-white/10 overflow-hidden">
 <div className="px-[10px] py-2 bg-[#1a1a1a] border-b border-white/10 shrink-0">
 <p className="text-white text-sm font-bold">설교 재생목록</p>
 <p className="text-gray-500 text-sm mt-0.5">
 {loading ? "연결 중..." : `전체 ${sermons.length}편`}
 </p>
 </div>
 <div ref={playlistRef} className="flex-1 overflow-y-auto overscroll-contain">
 {sermons.map((v) => {
 const isActive = activeVideo?.id === v.id;
 return (
 <button
 key={v.id}
 data-id={v.id}
 onClick={() => selectVideo(v)}
 className={`w-full flex items-center gap-2 px-[10px] py-2 text-left transition-colors border-b border-white/[0.05] ${
 isActive ? "bg-gray-700" : "hover:bg-white/10"
 }`}
 >
 <div className="w-12 h-[27px] shrink-0 rounded overflow-hidden bg-black/30 relative">
 <img src={v.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
 {v.duration && (
 <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-sm px-0.5 rounded leading-tight">
 {v.duration}
 </span>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className={`text-sm leading-tight line-clamp-2 ${
 isActive ? "text-white font-medium" : "text-gray-300"
 }`}>
 {v.title}
 </p>
 <p className="text-sm text-gray-600 mt-0.5">{v.publishedAt}</p>
 </div>
 {isActive && <Play className="w-3 h-3 text-gray-400 shrink-0 fill-gray-400" />}
 </button>
 );
 })}
 </div>
 </div>
 </div>

 {/* 나눔 */}
 <div className="flex-1 overflow-hidden">
 <SharingPanel
 sharingText={sharingText} setSharingText={setSharingText}
 submitting={submitting} submitSharing={submitSharing}
 sharings={sharings} loadingCmt={loadingCmt} deleteSharing={deleteSharing}
 />
 </div>
 </div>

 {/* RIGHT — 설교 노트 */}
 <div className="w-72 border-l border-gray-200 overflow-hidden shrink-0">
 <NotePanel notes={notes} setNotes={setNotes} activeVideo={activeVideo} />
 </div>
 </div>
 </>
 );
}
