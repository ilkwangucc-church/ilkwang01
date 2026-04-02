import { Metadata } from "next";
import { Plus, Trash2, Edit } from "lucide-react";

export const metadata: Metadata = { title: "갤러리 관리 | 관리자" };

const images = [
  { id: 1, title: "2024 부활절 예배", date: "2024-03-31", category: "예배", url: "https://images.unsplash.com/photo-1565343182548-6df3c4bffe11?w=400&auto=format&fit=crop" },
  { id: 2, title: "청년부 수련회", date: "2024-03-28", category: "청년부", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop" },
  { id: 3, title: "봄 부흥성회", date: "2024-03-25", category: "행사", url: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&auto=format&fit=crop" },
  { id: 4, title: "소그룹 모임", date: "2024-03-20", category: "소그룹", url: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&auto=format&fit=crop" },
  { id: 5, title: "어린이날 예배", date: "2024-03-15", category: "어린이", url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&auto=format&fit=crop" },
  { id: 6, title: "선교사 초청 강연", date: "2024-03-10", category: "선교", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&auto=format&fit=crop" },
];

export default function GalleryAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">갤러리 관리</h1>
          <p className="text-gray-500 text-sm mt-0.5">사진 및 이미지를 업로드하고 관리합니다</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-medium hover:bg-[#1B5E20] transition-colors">
          <Plus className="w-4 h-4" />
          이미지 업로드
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        Supabase Storage 연동 후 실제 이미지 업로드가 가능합니다.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-500/60">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium text-sm text-gray-900 truncate">{img.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">{img.category}</span>
                <span className="text-xs text-gray-400">{img.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
