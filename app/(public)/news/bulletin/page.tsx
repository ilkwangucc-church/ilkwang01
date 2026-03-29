import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import StickySubNav, { NEWS_NAV } from "@/components/ui/StickySubNav";
import BulletinViewer from "./BulletinViewer";

export const metadata: Metadata = {
  title: "주보자료 | 일광교회",
  description: "일광교회 주간 주보 — 앞·뒷면 확인 및 HWP 다운로드",
};

export default function BulletinPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <PageHero
        label="Weekly Bulletin"
        title="주보자료"
        subtitle="매주 주보를 통해 예배 말씀과 교회 소식을 확인하세요"
        image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&auto=format&fit=crop&q=80"
      />
      <StickySubNav items={NEWS_NAV} />
      <BulletinViewer />
    </div>
  );
}
