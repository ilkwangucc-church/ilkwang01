"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

/* ── 섹션별 메뉴 — Navbar.tsx 와 완전 일치 ── */
export const ABOUT_NAV: NavItem[] = [
  { label: "인사말",        href: "/about" },
  { label: "교회역사",      href: "/about/history" },
  { label: "섬기는 사람들", href: "/about/pastor" },
  { label: "교회비전",      href: "/about/vision" },
  { label: "오시는길",      href: "/about/location" },
];

export const WORSHIP_NAV: NavItem[] = [
  { label: "예배안내", href: "/worship" },
  { label: "설교영상", href: "/worship/sermons" },
];

export const YOUTH_NAV: NavItem[] = [
  { label: "유초등부", href: "/youth/sunday" },
  { label: "중고등부", href: "/youth/teens" },
  { label: "청년부",   href: "/youth/young-adults" },
];

export const NEWS_NAV: NavItem[] = [
  { label: "교회소식",   href: "/news" },
  { label: "주보자료",   href: "/news/bulletin" },
  { label: "행사안내",   href: "/news/events" },
  { label: "갤러리",     href: "/news/gallery" },
  { label: "교재자료",   href: "/resources" },
  { label: "나눔게시판", href: "/resources/board" },
  { label: "커뮤니티",   href: "/blog" },
];

export default function StickySubNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b sticky top-[72px] z-40">
      <div className="max-w-[1400px] mx-auto px-4 flex gap-1 overflow-x-auto">
        {items.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`py-4 px-5 text-sm font-nanum-bold whitespace-nowrap border-b-2 transition-colors ${
              pathname === m.href
                ? "border-[#2E7D32] text-[#2E7D32]"
                : "border-transparent text-gray-500 hover:text-[#2E7D32]"
            }`}
          >
            {m.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
