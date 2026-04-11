"use client";
import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, FileText, Image, AlertCircle, CheckCircle2, Plus, X } from "lucide-react";

type Bulletin = {
  id: number;
  date: string;
  highlights: string[];
  front: string;
  back: string;
  file?: string;
  fileType?: string;
};

const fmt = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
};

export default function AdminBulletinsPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]             = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* 업로드 폼 */
  const [date, setDate]         = useState("");
  const [highlights, setHighlights] = useState(["", "", ""]);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef  = useRef<HTMLInputElement>(null);
  const docRef   = useRef<HTMLInputElement>(null);

  /* 파일 미리보기 이름 */
  const [frontName, setFrontName] = useState("");
  const [backName,  setBackName]  = useState("");
  const [docName,   setDocName]   = useState("");

  const loadBulletins = () => {
    setLoading(true);
    fetch("/api/bulletins")
      .then((r) => r.json())
      .then((data) => { setBulletins(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadBulletins(); }, []);

  const addHighlight = () => setHighlights((h) => [...h, ""]);
  const removeHighlight = (i: number) => setHighlights((h) => h.filter((_, idx) => idx !== i));
  const setHL = (i: number, v: string) => setHighlights((h) => h.map((x, idx) => idx === i ? v : x));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const filledHL = highlights.filter((h) => h.trim());
    if (!date || filledHL.length === 0) {
      setMsg({ type: "error", text: "날짜와 주요 내용을 최소 1개 입력해주세요." });
      return;
    }

    const fd = new FormData();
    fd.append("date", date);
    fd.append("highlights", filledHL.join("\n"));
    if (frontRef.current?.files?.[0]) fd.append("front", frontRef.current.files[0]);
    if (backRef.current?.files?.[0])  fd.append("back",  backRef.current.files[0]);
    if (docRef.current?.files?.[0])   fd.append("file",  docRef.current.files[0]);

    setSubmitting(true);
    try {
      const res  = await fetch("/api/bulletins/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: `${fmt(date)} 주보가 저장되었습니다.` });
        setDate(""); setHighlights(["", "", ""]);
        setFrontName(""); setBackName(""); setDocName("");
        if (frontRef.current) frontRef.current.value = "";
        if (backRef.current)  backRef.current.value  = "";
        if (docRef.current)   docRef.current.value   = "";
        loadBulletins();
      } else {
        setMsg({ type: "error", text: json.error ?? "오류가 발생했습니다." });
      }
    } catch {
      setMsg({ type: "error", text: "서버 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (b: Bulletin) => {
    if (!confirm(`${fmt(b.date)} 주보를 삭제하시겠습니까?`)) return;
    const res  = await fetch("/api/bulletins/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id }),
    });
    if (res.ok) loadBulletins();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl font-bold text-gray-900">주보 관리</h1>

      {/* ── 업로드 폼 ── */}
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#2E7D32]" />
          새 주보 등록
        </h2>

        {msg && (
          <div className={`mb-4 flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
            msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            {msg.type === "success"
              ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 날짜 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              주보 날짜 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              required
            />
          </div>

          {/* 주요 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              주요 내용 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => setHL(i, e.target.value)}
                    placeholder={`항목 ${i + 1} (예: 설교: 「제목」 — 신점일 목사)`}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                  {highlights.length > 1 && (
                    <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addHighlight} className="flex items-center gap-1 text-xs text-[#2E7D32] font-semibold hover:underline">
                <Plus className="w-3.5 h-3.5" /> 항목 추가
              </button>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* 앞면 이미지 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> 앞면 이미지
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#2E7D32] transition-colors group">
                <Upload className="w-5 h-5 text-gray-300 group-hover:text-[#2E7D32] mb-1" />
                <span className="text-xs text-gray-400 group-hover:text-[#2E7D32] text-center">
                  {frontName || "JPG / PNG 업로드"}
                </span>
                <input
                  ref={frontRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => setFrontName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            </div>

            {/* 뒷면 이미지 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> 뒷면 이미지
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#2E7D32] transition-colors group">
                <Upload className="w-5 h-5 text-gray-300 group-hover:text-[#2E7D32] mb-1" />
                <span className="text-xs text-gray-400 group-hover:text-[#2E7D32] text-center">
                  {backName || "JPG / PNG 업로드"}
                </span>
                <input
                  ref={backRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => setBackName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            </div>

            {/* 문서 파일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> 문서 파일
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#2E7D32] transition-colors group">
                <Upload className="w-5 h-5 text-gray-300 group-hover:text-[#2E7D32] mb-1" />
                <span className="text-xs text-gray-400 group-hover:text-[#2E7D32] text-center">
                  {docName || "HWP · DOC · PDF · PPT"}
                </span>
                <input
                  ref={docRef}
                  type="file"
                  accept=".hwp,.doc,.docx,.pdf,.ppt,.pptx"
                  className="hidden"
                  onChange={(e) => setDocName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            {submitting ? "저장 중…" : "주보 저장"}
          </button>
        </form>
      </div>

      {/* ── 주보 목록 ── */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">등록된 주보 목록</h2>
          <span className="text-xs text-gray-400">{bulletins.length}건</span>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-400 text-sm">불러오는 중…</div>
        ) : bulletins.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">등록된 주보가 없습니다.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {bulletins.map((b) => (
              <div key={b.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{fmt(b.date)}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {b.highlights[0]}
                  </p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0 text-xs text-gray-400 flex-wrap">
                  {b.front && <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded font-medium">앞면</span>}
                  {b.back  && <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded font-medium">뒷면</span>}
                  {b.file  && <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded font-medium uppercase">{b.fileType}</span>}
                </div>
                <button
                  onClick={() => handleDelete(b)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
