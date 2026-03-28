"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import Logo from "./Logo";

const nav = [
  {
    label: "교회소개",
    href: "/about",
    sub: [
      { label: "인사말",        href: "/about" },
      { label: "교회역사",      href: "/about/history" },
      { label: "섬기는 사람들", href: "/about/pastor" },
      { label: "교회비전",      href: "/about/vision" },
      { label: "오시는길",      href: "/about/location" },
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
      { label: "갤러리",   href: "/news/gallery" },
    ],
  },
  {
    label: "나눔과 교재",
    href: "/resources",
    sub: [
      { label: "교재자료",   href: "/resources" },
      { label: "나눔게시판", href: "/resources/board" },
    ],
  },
  {
    label: "다음세대",
    href: "/youth",
    sub: [
      { label: "주일학교", href: "/youth/sunday" },
      { label: "청년부",   href: "/youth/young-adults" },
      { label: "중고등부", href: "/youth/teens" },
    ],
  },
  { label: "커뮤니티", href: "/blog" },
];

export default function Navbar() {
  const [open, setOpen]             = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 스크롤 내려가거나 모바일 메뉴 열리면 → 흰 배경
  const white = scrolled || open;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        white ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">

        {/* Logo: 투명 시 흰 배경 pill로 가시성 확보 */}
        <div className={`transition-all duration-300 rounded-lg ${
          !white ? "bg-white/25 backdrop-blur-sm px-3 py-1.5" : ""
        }`}>
          <Logo size="md" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center">
          {nav.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setActiveMenu(item.href)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-0.5 px-4 py-2 text-[15px] font-semibold transition-colors ${
                  white
                    ? "text-[#1a2744] hover:text-[#2E7D32]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
                {item.sub && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
              </Link>

              {item.sub && activeMenu === item.href && (
                <div className="absolute top-full left-0 w-44 bg-white rounded-b-xl shadow-xl border-t-2 border-[#2E7D32] py-2 z-50">
                  {item.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-5 py-2.5 text-sm text-[#1a2744] hover:bg-[#f0f4f0] hover:text-[#2E7D32] transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Phone + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:02-927-0691"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              white ? "text-[#1a2744] hover:text-[#2E7D32]" : "text-white/90 hover:text-white"
            }`}
          >
            <Phone className="w-4 h-4" />
            02-927-0691
          </a>
          <Link
            href="/offering"
            className={`px-5 py-2.5 text-sm font-bold rounded transition-colors tracking-wide ${
              white
                ? "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
                : "border border-white/80 text-white hover:bg-white hover:text-[#1a2744] backdrop-blur-sm"
            }`}
          >
            온라인 헌금
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 transition-colors ${white ? "text-[#1a2744]" : "text-white"}`}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1 shadow-lg">
          {nav.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-[15px] font-semibold text-[#1a2744] border-b border-gray-100"
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
                      className="block py-1.5 text-sm text-gray-500 hover:text-[#2E7D32]"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 flex items-center gap-3">
            <a href="tel:02-927-0691" className="text-sm text-[#1a2744] font-medium">
              📞 02-927-0691
            </a>
            <Link href="/offering" onClick={() => setOpen(false)}
              className="text-sm px-4 py-2 bg-[#2E7D32] text-white rounded font-bold">
              온라인 헌금
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
