import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Pin, ImageIcon } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { NEWS_NAV } from "@/components/ui/StickySubNav";
import BibleSharingsSection from "./BibleSharingsSection";

export const metadata: Metadata = {
  title: "커뮤니티 | 일광교회",
  description: "일광교회 커뮤니티 — 공지, 행사, 나눔 소식을 이미지와 함께 전합니다",
};

const COMMUNITY_POSTS = [
  {
    id: 1,
    title: "2026 부활절 연합예배 안내",
    category: "공지안내",
    date: "2026-03-25",
    pinned: true,
    image: "https://images.unsplash.com/photo-1476458935659-3571c12e9cb3?w=600&auto=format&fit=crop&q=80",
    excerpt: "2026년 부활절을 맞이하여 교단 연합예배가 진행됩니다. 모든 성도님들의 적극적인 참여를 바랍니다.",
  },
  {
    id: 2,
    title: "봄 부흥성회 — 강사 초청",
    category: "행사안내",
    date: "2026-04-10",
    pinned: true,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80",
    excerpt: "4월 10일부터 3일간 특별 부흥성회가 진행됩니다. 은혜로운 시간이 되시길 바랍니다.",
  },
  {
    id: 3,
    title: "청년부 수련회 참가 신청",
    category: "행사안내",
    date: "2026-03-18",
    pinned: false,
    image: null,
    excerpt: "2026년 청년부 여름 수련회 참가 신청을 받습니다. 참가 희망자는 청년부 담당자에게 문의해 주세요.",
  },
  {
    id: 4,
    title: "교회 주차 안내 변경",
    category: "공지안내",
    date: "2026-03-10",
    pinned: false,
    image: null,
    excerpt: "주일 예배 주차 구역이 변경되었습니다. 불편하시더라도 양해 부탁드립니다.",
  },
  {
    id: 5,
    title: "성탄절 특별 행사 일정 안내",
    category: "행사안내",
    date: "2025-12-10",
    pinned: false,
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&auto=format&fit=crop&q=80",
    excerpt: "성탄절을 맞이하여 특별 행사 일정을 안내드립니다. 가족과 함께 참석해 주세요.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "공지안내": "bg-blue-100 text-blue-700",
  "행사안내": "bg-amber-100 text-amber-700",
};

export default function CommunityPage() {
  return (
    <div>
      <PageHero
        label="Community"
        title="커뮤니티"
        subtitle="일광교회의 공지와 행사 소식을 함께 나눕니다"
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&auto=format&fit=crop&q=80"
      />

      <StickySubNav items={NEWS_NAV} />

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        {/* 고정 게시물 */}
        {COMMUNITY_POSTS.filter(p => p.pinned).length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Pin className="w-4 h-4 text-orange-500" /> 주요 공지
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {COMMUNITY_POSTS.filter(p => p.pinned).map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {post.image ? (
                    <div className="relative h-44 overflow-hidden">
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-3 left-3 text-[11px] px-2 py-0.5 bg-orange-500 text-white rounded-full font-medium flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5" /> 고정
                      </span>
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-orange-200" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2 mb-1 leading-snug">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 전체 목록 */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">전체 게시물</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMMUNITY_POSTS.filter(p => !p.pinned).map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              {post.image ? (
                <div className="relative h-40 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-200" />
                </div>
              )}
              <div className="p-4">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-600"}`}>
                  {post.category}
                </span>
                <h3 className="font-bold text-gray-900 mt-2 mb-1 text-sm leading-snug line-clamp-2">{post.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                  <Calendar className="w-3 h-3" /> {post.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {COMMUNITY_POSTS.length === 0 && (
          <div className="text-center py-20 text-gray-400">등록된 게시물이 없습니다.</div>
        )}

        {/* 성도 말씀 나눔 — 성경통독 대시보드에서 실시간 공유 */}
        <BibleSharingsSection />
      </div>
    </div>
  );
}
