import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import Logo from "./Logo";

const aboutLinks = [
  { label: "인사말", href: "/about" },
  { label: "교회역사", href: "/about/history" },
  { label: "섬기는 사람들", href: "/about/pastor" },
  { label: "교회비전", href: "/about/vision" },
  { label: "오시는길", href: "/about/location" },
];


const sharingLinks = [
  { label: "공지사항",   href: "/news" },
  { label: "행사안내",   href: "/news/events" },
  { label: "갤러리",     href: "/news/gallery" },
  { label: "교재자료",   href: "/resources" },
  { label: "나눔게시판", href: "/resources/board" },
  { label: "커뮤니티",   href: "/blog" },
];

const youthLinks = [
  { label: "유초등부", href: "/youth/sunday" },
  { label: "중고등부", href: "/youth/teens" },
  { label: "청년부",   href: "/youth/young-adults" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a2744] text-gray-300">
      <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">

        {/* Col 1: Logo + About + Contact */}
        <div className="md:w-64 shrink-0 flex flex-col items-center md:items-start">
          <div className="mb-2">
            <Logo size="md" variant="light" />
          </div>
          <p className="text-sm text-gray-400 leading-tight mb-5 text-center md:text-left">
            대한예수교장로회(합동) 소속<br />
            1971년 설립된 서울 성북구 일광교회
          </p>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#6dbf73] shrink-0 mt-0.5" />
              <span>서울 성북구 동소문로 212-68</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#6dbf73] shrink-0" />
              <a href="tel:02-927-0691" className="hover:text-white">02-927-0691</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#6dbf73] shrink-0" />
              <a href="mailto:ilkwang@ilkwang.or.kr" className="hover:text-white">ilkwang@ilkwang.or.kr</a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-4 h-4 text-[#6dbf73] shrink-0 flex items-center justify-center text-xs">▶</span>
              <a
                href="https://www.youtube.com/@ilkwangucc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                유튜브 채널
              </a>
            </li>
            <li className="flex items-center gap-2.5 md:hidden">
              <span className="w-4 h-4 text-[#6dbf73] shrink-0 flex items-center justify-center text-xs">→</span>
              <Link href="/contact" className="hover:text-white">문의하기</Link>
            </li>
          </ul>
        </div>

        {/* Nav cols: 교회소개 / 예배말씀 / 다음세대+커뮤니티 / 교회소식 — 모바일 숨김 */}
        <div className="hidden md:grid md:grid-cols-4 gap-[120px] ml-auto pr-[30px]">

          {/* 교회소개 */}
          <div>
            <h4 className="font-black text-white text-[19px] uppercase tracking-widest mb-5">
              교회소개
            </h4>
            <ul className="space-y-2.5 text-sm">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 예배/말씀 */}
          <div>
            <h4 className="font-black text-white text-[19px] uppercase tracking-widest mb-5">
              예배/말씀
            </h4>
            <ul className="space-y-1 text-sm mb-7">
              <li className="flex gap-1 text-gray-400">
                <span className="w-16 shrink-0">1부예배</span><span>09:30</span>
              </li>
              <li className="flex gap-1 text-gray-400">
                <span className="w-16 shrink-0">2부예배</span><span>11:00</span>
              </li>
              <li className="flex gap-1 text-gray-400">
                <span className="w-16 shrink-0">오후예배</span><span>13:30</span>
              </li>
              <li className="flex gap-1 text-gray-400">
                <span className="w-16 shrink-0">수요예배</span><span>10:30</span>
              </li>
            </ul>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/worship/sermons" className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                  설교영상
                </Link>
              </li>
            </ul>
          </div>

          {/* 다음세대 */}
          <div>
            <h4 className="font-black text-white text-[19px] uppercase tracking-widest mb-5">
              다음세대
            </h4>
            <ul className="space-y-2.5 text-sm">
              {youthLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 나눔과 소식 */}
          <div>
            <h4 className="font-black text-white text-[19px] uppercase tracking-widest mb-5">
              나눔과 소식
            </h4>
            <ul className="space-y-2.5 text-sm">
              {sharingLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#6dbf73] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} 일광교회. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
