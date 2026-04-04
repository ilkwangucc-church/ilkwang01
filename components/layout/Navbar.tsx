"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ArrowRight, LogOut } from "lucide-react";
import Logo from "./Logo";

type SubItem = { label: string; href: string; desc: string };
type NavItem = {
  label: string;
  href: string;
  sub?: SubItem[];
  featured?: { title: string; desc: string; viewAll?: string };
};

const nav: NavItem[] = [
  {
    label: "교회소개",
    href: "/about",
    featured: {
      title: "일광교회 소개",
      desc: "1971년 설립된 서울 성북구 대한예수교장로회(합동) 소속 교회입니다.",
    },
    sub: [
      { label: "인사말",        href: "/about",          desc: "담임목사 인사 및 교회 소개" },
      { label: "교회역사",      href: "/about/history",  desc: "1971년 설립부터 오늘까지의 역사" },
      { label: "섬기는 사람들", href: "/about/pastor",   desc: "교회를 섬겨주시는 분들입니다." },
      { label: "교회비전",      href: "/about/vision",   desc: "말씀과 기도, 선교의 비전" },
      { label: "오시는길",      href: "/about/location", desc: "서울 성북구 동소문로 212-68" },
    ],
  },
  {
    label: "예배/말씀",
    href: "/worship",
    featured: {
      title: "예배 시간 안내",
      desc: "1부 09:30 · 2부 11:00\n오후 13:30 · 수요 10:30",
    },
    sub: [
      { label: "예배안내", href: "/worship",         desc: "1부 09:30 · 2부 11:00 · 오후 13:30 · 수요 10:30\n새벽기도 월~토 05:30 — 모든 예배 시간 및 장소 안내" },
      { label: "설교영상", href: "/worship/sermons", desc: "담임목사 주일 설교 전체 영상\n유튜브 채널 @ilkwangucc 아카이브" },
    ],
  },
  {
    label: "다음세대",
    href: "/youth",
    featured: {
      title: "다음세대 사역",
      desc: "미래 세대를 말씀으로 세우는 일광교회 다음세대 사역입니다.",
    },
    sub: [
      { label: "유초등부", href: "/youth/sunday",       desc: "유치부부터 초등학생까지 — 매 주일 말씀 안에서 자라가는 어린이 주일학교" },
      { label: "중고등부", href: "/youth/teens",        desc: "중·고등학생이 함께 모이는 청소년 신앙 공동체 — 예배·소그룹·수련회" },
      { label: "청년부",   href: "/youth/young-adults", desc: "대학생·20~30대 미혼 청년들의 주일 모임 — 금요 성경공부·소그룹 운영" },
    ],
  },
  {
    label: "나눔과 소식",
    href: "/news",
    featured: {
      title: "나눔과 소식",
      desc: "교회 소식과 성도들의 이야기를 함께 나눕니다.",
      viewAll: "교회소식",
    },
    sub: [
      { label: "주보자료",   href: "/news/bulletin",     desc: "매주 주보 앞·뒷면 확인 및 다운로드" },
      { label: "행사안내",   href: "/news/events",       desc: "각종 행사 및 프로그램 일정" },
      { label: "갤러리",     href: "/news/gallery",      desc: "교회 행사 사진 모음" },
      { label: "교재자료",   href: "/resources",         desc: "소그룹 및 교육 교재 자료" },
      { label: "나눔게시판", href: "/resources/board",   desc: "성도 간 나눔 및 교재 공유" },
      { label: "커뮤니티",   href: "/blog",              desc: "묵상·기도·신앙 나눔 공간" },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen]             = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled]     = useState(false);
  const closeTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loggedIn, setLoggedIn]     = useState(false);

  // 로그인 상태 확인 (대시보드에서 프론트로 나와도 유지)
  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.username) setLoggedIn(true); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    sessionStorage.removeItem("admin_user");
    setLoggedIn(false);
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** 메가메뉴 닫힘 지연 — 마우스가 nav → 메가메뉴로 이동하는 시간 확보 */
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 200);
  };
  const cancelClose = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };

  const white = scrolled || open;
  const activeItem = nav.find((n) => n.href === activeMenu);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* Top Bar — 모바일 숨김, 스크롤 시 위로 사라짐 */}
      <div className={`hidden md:block bg-[#1a2744] transition-transform duration-500 ${scrolled ? "-translate-y-full absolute w-full" : "translate-y-0"}`}>
        <div className="max-w-[1400px] mx-auto px-6 h-9 relative flex items-center">
          <p className="absolute left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest whitespace-nowrap pointer-events-none">
            A Church Full of Grace and Truth
          </p>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/contact" className="text-white/70 hover:text-white text-xs transition-colors">문의하기</Link>
            {loggedIn && (
              <button onClick={handleLogout} className="text-white/70 hover:text-white text-xs transition-colors">
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`relative transition-all duration-500 ${white ? "bg-white shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center h-[72px] relative">

          {/* 모바일: 중앙 고정 / 데스크탑: 왼쪽 */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:flex-1 -mt-[6px]">
            <Logo size="md" variant={white ? "dark" : "light"} />
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex flex-none items-center"
            onMouseLeave={scheduleClose}
          >
            {nav.map((item) => (
              <div
                key={item.href}
                onMouseEnter={() => { cancelClose(); setActiveMenu(item.href); }}
              >
                <Link
                  href={item.href}
                  onClick={() => setActiveMenu(null)}
                  className={`flex items-center gap-0.5 px-4 py-2 text-[15px] font-semibold transition-colors ${
                    white ? "text-[#1a2744] hover:text-[#2E7D32]" : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.sub && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right: Login/Logout + CTA */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
            {loggedIn ? (
              <Link href="/dashboard" className="px-4 py-2 bg-[#2E7D32] text-white text-sm font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors">
                My Account
              </Link>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-[#2E7D32] text-white text-sm font-bold rounded-[26px] hover:bg-[#1B5E20] transition-colors">
                로그인
              </Link>
            )}
            <Link href="/offering" className={`px-4 py-2 text-sm font-bold rounded-[26px] transition-colors tracking-wide ${
              white
                ? "border border-black text-black"
                : "border border-white/80 text-white hover:border-black hover:bg-white hover:text-[#1a2744] backdrop-blur-sm"
            }`}>
              온라인 헌금
            </Link>
          </div>

          {/* Mobile Hamburger — 오른쪽 끝 */}
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden ml-auto p-2 transition-colors ${white ? "text-[#1a2744]" : "text-white"}`}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── 메가 메뉴 (데스크탑) ── */}
        {activeItem?.sub && (
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] z-50 shadow-2xl hidden lg:flex rounded-xl overflow-hidden"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {/* 왼쪽: 다크 그레이 — 피처드 */}
            <div className="w-52 shrink-0 bg-gray-700 px-6 py-7 flex flex-col justify-center">
              <span className="text-[#6dbf73] text-xs font-bold uppercase tracking-[0.2em] mb-3">
                {activeItem.label}
              </span>
              <h3 className="text-white font-black text-xl leading-snug mb-3">
                {activeItem.featured?.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {activeItem.featured?.desc}
              </p>
              <Link
                href={activeItem.href}
                onClick={() => setActiveMenu(null)}
                className="mt-5 inline-flex items-center gap-1.5 text-[#6dbf73] text-sm font-semibold hover:text-white transition-colors"
              >
                {activeItem.featured?.viewAll ?? "전체보기"} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 오른쪽: 미디엄 그레이 — 하위 메뉴 링크 */}
            <div className="flex-1 bg-gray-200 px-8 py-7">
              <p className="text-xs text-[#2E7D32] font-bold uppercase tracking-[0.2em] mb-4">
                {activeItem.label}
              </p>
              <div className={`grid gap-0.5 ${activeItem.sub.length > 3 ? "grid-cols-2" : "grid-cols-1"}`}>
                {activeItem.sub.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    onClick={() => setActiveMenu(null)}
                    className="group flex flex-col px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-bold text-gray-800 text-[14px] group-hover:text-[#2E7D32] transition-colors">
                      {s.label}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 leading-relaxed whitespace-pre-line">{s.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

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
                className="text-sm px-4 py-2 bg-[#2E7D32] text-white rounded-[26px] font-bold">
                온라인 헌금
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
