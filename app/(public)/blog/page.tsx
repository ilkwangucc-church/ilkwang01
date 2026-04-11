import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, Tag } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "일광교회 커뮤니티 - 각 부서별 소식과 나눔",
};

const departments = ["전체", "장년부", "청년부", "중고등부", "주일학교", "여전도회", "선교부"];

const posts = [
  { id: 1, dept: "청년부", title: "2025 청년부 겨울 수련회 - 주님 안에서 하나되어", excerpt: "이번 수련회를 통해 우리는 서로를 더 깊이 이해하고 하나님 안에서 하나되는 귀한 시간을 가졌습니다. 3박 4일간의 여정 속에서 말씀과 기도, 찬양으로 충전된 귀한 시간이었습니다.", date: "2025.12.10", author: "청년부장", slug: "youth-winter-retreat-2025", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70", deptColor: "bg-blue-100 text-blue-700" },
  { id: 2, dept: "주일학교", title: "어린이 성탄 발표회 - 천사들의 노래", excerpt: "사랑스러운 우리 어린이들이 예수님의 탄생을 노래와 연기로 표현한 감동적인 성탄 발표회였습니다. 아이들의 순수한 믿음이 온 성도의 마음을 따뜻하게 했습니다.", date: "2025.12.14", author: "교육부장", slug: "childrens-christmas-2025", image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=600&q=70", deptColor: "bg-yellow-100 text-yellow-700" },
  { id: 3, dept: "장년부", title: "2025 추수감사절 헌신 예배 및 교제 모임", excerpt: "올 한해 하나님께서 베풀어주신 은혜에 감사드리며 함께 예배하고 교제하는 복된 시간이었습니다. 풍성한 음식과 나눔으로 하나됨을 경험했습니다.", date: "2025.11.16", author: "장년부장", slug: "thanksgiving-service-2025", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=70", deptColor: "bg-green-100 text-green-700" },
  { id: 4, dept: "선교부", title: "2025년 해외 단기선교 파송 예배", excerpt: "7명의 선교팀이 동남아시아로 단기 선교를 떠납니다. 파송 예배를 통해 성령의 능력으로 충만해지는 시간이었습니다. 선교팀을 위해 함께 기도해 주세요.", date: "2025.07.05", author: "선교부장", slug: "short-term-mission-2025", image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=70", deptColor: "bg-purple-100 text-purple-700" },
  { id: 5, dept: "여전도회", title: "봄 바자회 - 이웃 사랑 실천", excerpt: "여전도회가 주관하는 봄 바자회를 통해 지역 사회 이웃들에게 사랑을 전했습니다. 수익금 전액은 지역 복지관에 기부되었습니다.", date: "2025.05.10", author: "여전도회장", slug: "bazaar-spring-2025", image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&q=70", deptColor: "bg-pink-100 text-pink-700" },
  { id: 6, dept: "중고등부", title: "중고등부 진로 캠프 - 하나님의 부르심", excerpt: "중고등부 학생들이 하나님의 뜻 안에서 자신의 진로를 찾아가는 2박 3일 캠프. 진로 특강과 멘토링을 통해 하나님 안에서 꿈을 발견하는 시간이었습니다.", date: "2025.08.20", author: "중고등부장", slug: "career-camp-2025", image: "https://images.unsplash.com/photo-1542397284385-6010376c5337?w=600&q=70", deptColor: "bg-orange-100 text-orange-700" },
];

export default function BlogPage() {
  return (
    <div>
      <PageHero label="Community" title="교회 커뮤니티" subtitle="각 부서의 소식과 나눔을 함께해 주세요" image="https://images.unsplash.com/photo-1536126750180-3c7d59643f99?w=1800&auto=format&fit=crop&q=80" />

      <div className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12">
        {/* 부서 필터 */}
        <div className="flex gap-2 flex-wrap mb-6 sm:mb-8">
          {departments.map((d, i) => (
            <button key={d} className={`px-4 py-2 sm:py-1.5 rounded-full text-sm font-nanum-bold transition-colors min-h-[44px] sm:min-h-0 ${i === 0 ? "bg-[#2E7D32] text-white" : "bg-gray-100 text-gray-600 hover:bg-[#E8F5E9] hover:text-[#2E7D32]"}`}>
              {d}
            </button>
          ))}
        </div>

        {/* 포스트 그리드 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 sm:p-5">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-nanum-bold mb-3 ${post.deptColor}`}>
                  {post.dept}
                </span>
                <h3 className="font-nanum-bold text-gray-800 leading-snug mb-2 group-hover:text-[#2E7D32] transition-colors line-clamp-2 break-keep">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 break-keep">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
