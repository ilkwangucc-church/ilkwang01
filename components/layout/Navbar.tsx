"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import Logo from "./Logo";

const nav = [
  {
    label: "교회소개",
    href: "/about",
    sub: [
      { label: "인사말", href: "/about" },
      { label: "교회역사", href: "/about/history" },
      { label: "담임목사", href: "/about/pastor" },
      { label: "교회비전", href: "/about/vision" },
      { label: "오시는길", href: "/about/location" },
    ],
  },
  {
    label: "예배/말씀",
    href: "/worship",
    sub: [
      { label: "예배안내", href: "/worship" },
      { label: "설교영상", href: "/worship/sermons" },
    ],
  },
  {
    label: "교회소식",
    href: "/news",
    sub: [
      { label: "공지사항", href: "/news" },
      { label: "행사안내", href: "/news/events" },
      { label: "갤러리", href: "/news/gallery" },
    ],
  },
  {
    label: "나눔과 교재",
    href: "/resources",
    sub: [
      { label: "교재자료", href: "/resources" },
      { label: "나눔게시판", href: "/resources/board" },
    ],
  },
  {
    label: "다음세대",
    href: "/youth",
    sub: [
      { label: "주일학교", href: "/youth/sunday" },
      { label: "청년부", href: "/youth/young-adults" },
      { label: "중고등부", href: "/youth/teens" },
    ],
  },
  { label: "커뮤니티", href: "/blog" },
  { label: "온라인헌금", href: "/offering" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Logo size="md" />

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <div
              key={item.href}
              className="relative group"
              onMouseEnter={() => setActiveMenu(item.href)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-0.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#2E7D32] transition-colors"
              >
                {item.label}
                {item.sub && <ChevronDown className="w-3 h-3" />}
              </Link>
              {item.sub && activeMenu === item.href && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  {item.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:02-927-0691" className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#2E7D32]">
            <Phone className="w-4 h-4" /> 02-927-0691
          </a>
          <Link
            href="/login"
            className="text-sm px-3 py-1.5 rounded-full border border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors"
          >
            로그인
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-1">
          {nav.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-medium text-gray-700 border-b border-gray-100"
              >
                {item.label}
              </Link>
              {item.sub && (
                <div className="pl-4 pt-1 pb-2 space-y-1">
                  {item.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setOpen(false)}
                      className="block py-1 text-sm text-gray-500 hover:text-[#2E7D32]"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-2 flex gap-3">
            <a href="tel:02-927-0691" className="text-sm text-gray-600">📞 02-927-0691</a>
            <Link href="/login" className="text-sm text-[#2E7D32] font-medium">로그인</Link>
          </div>
        </div>
      )}
    </header>
  );
}
