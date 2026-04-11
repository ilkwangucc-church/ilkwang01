"use client";
import { useState, useEffect } from "react";
import {
  BookText, ChevronDown, ChevronRight,
  Send, Trash2, Pencil, X, ExternalLink, Search,
} from "lucide-react";

/* ─────────────────────────────────────────
   성경 66권 구조
───────────────────────────────────────── */
const BIBLE = [
  {
    testament: "구약",
    count: "39권",
    color: "bg-[#E8F5E9] text-[#2E7D32]",
    sections: [
      {
        name: "율법서",
        books: ["창세기", "출애굽기", "레위기", "민수기", "신명기"],
      },
      {
        name: "역사서",
        books: [
          "여호수아", "사사기", "룻기",
          "사무엘상", "사무엘하",
          "열왕기상", "열왕기하",
          "역대상", "역대하",
          "에스라", "느헤미야", "에스더",
        ],
      },
      {
        name: "시가서",
        books: ["욥기", "시편", "잠언", "전도서", "아가"],
      },
      {
        name: "대선지서",
        books: ["이사야", "예레미야", "예레미야애가", "에스겔", "다니엘"],
      },
      {
        name: "소선지서",
        books: [
          "호세아", "요엘", "아모스", "오바댜", "요나",
          "미가", "나훔", "하박국", "스바냐", "학개",
          "스가랴", "말라기",
        ],
      },
    ],
  },
  {
    testament: "신약",
    count: "27권",
    color: "bg-blue-50 text-blue-700",
    sections: [
      {
        name: "복음서",
        books: ["마태복음", "마가복음", "누가복음", "요한복음"],
      },
      {
        name: "역사서",
        books: ["사도행전"],
      },
      {
        name: "바울서신",
        books: [
          "로마서", "고린도전서", "고린도후서", "갈라디아서",
          "에베소서", "빌립보서", "골로새서",
          "데살로니가전서", "데살로니가후서",
          "디모데전서", "디모데후서", "디도서", "빌레몬서",
        ],
      },
      {
        name: "일반서신",
        books: [
          "히브리서", "야고보서",
          "베드로전서", "베드로후서",
          "요한일서", "요한이서", "요한삼서", "유다서",
        ],
      },
      {
        name: "예언서",
        books: ["요한계시록"],
      },
    ],
  },
];

interface Comment {
  id: number;
  memberName: string;
  text: string;
  date: string;
}

function extractVideoId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/* ─────────────────────────────────────────
   페이지 컴포넌트
───────────────────────────────────────── */
export default function BiblePage() {
  const [selectedBook, setSelectedBook] = useState("창세기");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    율법서: true,
  });

  // 영상
  const [embedId, setEmbedId]       = useState<string>("");
  const [urlInput, setUrlInput]      = useState<string>("");
  const [showUrlBox, setShowUrlBox]  = useState(false);

  // 댓글
  const [comments, setComments]             = useState<Comment[]>([]);
  const [commentText, setCommentText]       = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // 필사 모달
  const [showModal, setShowModal]       = useState(false);
  const [transcription, setTranscription] = useState("");

  /* 책 선택 시 저장된 영상 ID 복원 */
  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? localStorage.getItem(`bible_vid_${selectedBook}`) ?? ""
      : "";
    setEmbedId(saved);
    setUrlInput(saved ? `https://youtu.be/${saved}` : "");
    setShowUrlBox(false);
  }, [selectedBook]);

  /* 댓글 로드 */
  useEffect(() => {
    setLoadingComments(true);
    fetch(`/api/bible-comments?book=${encodeURIComponent(selectedBook)}`)
      .then((r) => r.json())
      .then((d) => setComments(Array.isArray(d) ? d : []))
      .catch(() => setComments([]))
      .finally(() => setLoadingComments(false));
  }, [selectedBook]);

  /* URL 붙여넣어 영상 설정 */
  function applyVideoUrl(e: React.FormEvent) {
    e.preventDefault();
    const id = extractVideoId(urlInput);
    if (id) {
      setEmbedId(id);
      localStorage.setItem(`bible_vid_${selectedBook}`, id);
      setShowUrlBox(false);
    }
  }

  /* 댓글 등록 */
  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bible-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book: selectedBook, text: commentText.trim() }),
      });
      if (res.ok) {
        setCommentText("");
        const d = await fetch(
          `/api/bible-comments?book=${encodeURIComponent(selectedBook)}`
        ).then((r) => r.json());
        setComments(Array.isArray(d) ? d : []);
      }
    } finally {
      setSubmitting(false);
    }
  }

  /* 댓글 삭제 */
  async function deleteComment(id: number) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await fetch("/api/bible-comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ book: selectedBook, id }),
    });
    if (res.ok) setComments((p) => p.filter((c) => c.id !== id));
  }

  const ytSearchUrl = `https://www.youtube.com/results?search_query=PRS+성경+${encodeURIComponent(selectedBook)}+통독`;

  /* ─────── 렌더 ─────── */
  return (
    /* p-5 lg:p-6 을 취소하여 전체 높이 채우기 */
    <div className="-mx-5 -my-5 lg:-mx-6 lg:-my-6 flex h-[calc(100vh-56px)] overflow-hidden bg-gray-50">

      {/* ══════════════════════════════
          사이드바: 성경 66권 목록
      ══════════════════════════════ */}
      <aside className="w-44 lg:w-52 bg-white border-r border-gray-200 flex flex-col overflow-hidden shrink-0">
        {/* 헤더 */}
        <div className="px-3 py-2.5 border-b border-gray-100 shrink-0">
          <p className="text-[11px] font-bold text-[#2E7D32] flex items-center gap-1.5 tracking-wide">
            <BookText className="w-3.5 h-3.5" /> 성경 목록 (66권)
          </p>
        </div>

        {/* 스크롤 목록 */}
        <div className="flex-1 overflow-y-auto">
          {BIBLE.map(({ testament, count, color, sections }) => (
            <div key={testament}>
              {/* 구약 / 신약 구분 */}
              <div className={`px-3 py-1.5 sticky top-0 z-10 ${color} border-b border-gray-100`}>
                <span className="text-[11px] font-bold">
                  {testament} <span className="font-normal opacity-70">({count})</span>
                </span>
              </div>

              {sections.map((sec) => (
                <div key={sec.name}>
                  {/* 섹션 헤더 */}
                  <button
                    onClick={() =>
                      setOpenSections((p) => ({ ...p, [sec.name]: !p[sec.name] }))
                    }
                    className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      {sec.name}
                    </span>
                    {openSections[sec.name] ? (
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    )}
                  </button>

                  {/* 책 목록 */}
                  {openSections[sec.name] &&
                    sec.books.map((book) => (
                      <button
                        key={book}
                        onClick={() => setSelectedBook(book)}
                        className={`w-full text-left px-4 py-[5px] text-xs transition-colors border-b border-gray-50 ${
                          selectedBook === book
                            ? "bg-[#2E7D32] text-white font-semibold"
                            : "text-gray-700 hover:bg-green-50 hover:text-[#2E7D32]"
                        }`}
                      >
                        {book}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ══════════════════════════════
          중앙: YouTube 영상
      ══════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* 영상 헤더 */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 gap-2">
          <div className="min-w-0">
            <h1 className="font-bold text-gray-900 text-sm truncate">
              {selectedBook} 통독 영상
            </h1>
            <p className="text-[11px] text-gray-400">PRS 성경통독 · YouTube</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowUrlBox((v) => !v)}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-3 h-3" /> URL 설정
            </button>
            <a
              href={ytSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
            >
              <Search className="w-3 h-3" /> YouTube 검색
            </a>
          </div>
        </div>

        {/* URL 입력 박스 */}
        {showUrlBox && (
          <form
            onSubmit={applyVideoUrl}
            className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex gap-2 items-center shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="YouTube 영상 URL을 붙여넣으세요 (예: https://youtu.be/xxxxx)"
              className="flex-1 text-xs px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors shrink-0"
            >
              적용
            </button>
            <button
              type="button"
              onClick={() => setShowUrlBox(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* YouTube 플레이어 */}
        <div className="flex-1 bg-gray-900 overflow-hidden relative">
          {embedId ? (
            <iframe
              key={embedId}
              src={`https://www.youtube.com/embed/${embedId}?autoplay=0&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${selectedBook} 성경 통독 - PRS`}
            />
          ) : (
            /* 영상 미설정 상태 */
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <BookText className="w-8 h-8 text-white/60" />
              </div>
              <div>
                <p className="text-white font-bold text-lg mb-1">{selectedBook} 통독 영상</p>
                <p className="text-gray-400 text-sm mb-4">
                  YouTube에서 PRS 성경 {selectedBook} 영상을 검색한 후<br />
                  URL을 복사해 위 <strong className="text-white">URL 설정</strong> 버튼으로 붙여넣으세요.
                </p>
                <a
                  href={ytSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  <Search className="w-4 h-4" /> YouTube에서 &apos;{selectedBook}&apos; 검색
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 필사 버튼 바 */}
        <div className="px-4 py-2 bg-white border-t border-gray-200 shrink-0 flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#E8F5E9] text-[#2E7D32] rounded-lg text-xs font-semibold hover:bg-[#C8E6C9] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> 필사하기 ✍️
          </button>
          <span className="text-[11px] text-gray-400 hidden sm:block">
            영상을 들으며 말씀을 직접 타이핑해 마음에 새기세요
          </span>
        </div>
      </div>

      {/* ══════════════════════════════
          우측: 말씀 나눔 댓글
      ══════════════════════════════ */}
      <div className="w-72 lg:w-80 border-l border-gray-200 bg-white flex flex-col overflow-hidden shrink-0">
        {/* 헤더 */}
        <div className="px-4 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-sm font-bold text-gray-900">💬 말씀 나눔</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {selectedBook} · {comments.length}개의 나눔
          </p>
        </div>

        {/* 댓글 입력 */}
        <form onSubmit={submitComment} className="px-4 py-3 border-b border-gray-100 shrink-0">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`${selectedBook}을(를) 읽고 은혜받은 말씀을 나눠주세요...`}
            rows={3}
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 leading-relaxed"
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="mt-2 w-full py-1.5 bg-[#2E7D32] text-white rounded-lg text-xs font-semibold hover:bg-[#1B5E20] disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Send className="w-3 h-3" /> {submitting ? "등록 중..." : "나눔 등록"}
          </button>
        </form>

        {/* 댓글 목록 */}
        <div className="flex-1 overflow-y-auto">
          {loadingComments ? (
            <div className="text-center py-10 text-xs text-gray-400">
              불러오는 중...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">🕊️</p>
              <p className="text-xs text-gray-400">
                첫 번째 나눔을 남겨주세요
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[#2E7D32]">
                      {c.memberName}
                    </span>
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
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          필사 모달
      ══════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl max-h-[90vh]">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-[#2E7D32]" /> 필사 노트 ✍️
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedBook} · 말씀을 들으며 직접 타이핑하세요
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 텍스트 영역 */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              <textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                autoFocus
                placeholder={
                  "성경 말씀을 직접 타이핑하며 마음에 새겨보세요.\n\n예) 태초에 하나님이 천지를 창조하시니라 (창 1:1)"
                }
                className="flex-1 min-h-[300px] text-sm text-gray-800 leading-loose border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 font-serif"
              />
            </div>

            {/* 모달 푸터 */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-gray-400">
                {transcription.length.toLocaleString()}자 입력됨
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (confirm("필사 내용을 초기화하시겠습니까?"))
                      setTranscription("");
                  }}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors border border-gray-200 rounded-lg"
                >
                  초기화
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-1.5 bg-[#2E7D32] text-white rounded-lg text-xs font-semibold hover:bg-[#1B5E20] transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
