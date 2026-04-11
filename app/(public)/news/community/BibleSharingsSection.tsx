"use client";
import { useEffect, useState } from "react";
import { BookText, MessageCircle } from "lucide-react";

interface BibleSharing {
  id:         number;
  memberName: string;
  text:       string;
  date:       string;
  book:       string;
  chapter:    number | null;
}

export default function BibleSharingsSection() {
  const [sharings, setSharings] = useState<BibleSharing[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/bible-sharing?all=1")
      .then((r) => r.json())
      .then((d) => setSharings(Array.isArray(d) ? d : []))
      .catch(() => setSharings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-12 border-t border-gray-100 pt-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookText className="w-5 h-5 text-[#2E7D32]" /> 말씀 나눔
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (sharings.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
        <BookText className="w-5 h-5 text-[#2E7D32]" /> 말씀 나눔
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        성도님들이 나눈 말씀 묵상과 은혜를 함께합니다
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sharings.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-[#E8F5E9] p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* 책/장 뱃지 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full font-semibold">
                <BookText className="w-3 h-3" />
                {s.book}{s.chapter ? ` ${s.chapter}장` : ""}
              </span>
              <span className="text-[10px] text-gray-400 ml-auto">{s.date}</span>
            </div>

            {/* 본문 */}
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 whitespace-pre-wrap">
              {s.text}
            </p>

            {/* 작성자 */}
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-50">
              <MessageCircle className="w-3 h-3 text-gray-300" />
              <span className="text-[11px] font-semibold text-[#2E7D32]">{s.memberName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
