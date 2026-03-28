import Link from "next/link";
import { ChevronRight, Calendar, User } from "lucide-react";

const posts = [
  {
    dept: "청년부",
    deptColor: "bg-blue-100 text-blue-700",
    title: "2025 청년부 겨울 수련회 - 주님 안에서 하나되어",
    excerpt: "이번 수련회를 통해 우리는 서로를 더 깊이 이해하고 하나님 안에서 하나되는 귀한 시간을 가졌습니다.",
    date: "2025.12.10",
    author: "청년부",
    slug: "youth-winter-retreat-2025",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=70",
  },
  {
    dept: "주일학교",
    deptColor: "bg-yellow-100 text-yellow-700",
    title: "어린이 성탄 발표회 - 천사들의 노래",
    excerpt: "사랑스러운 우리 어린이들이 예수님의 탄생을 노래와 연기로 표현한 감동적인 성탄 발표회였습니다.",
    date: "2025.12.14",
    author: "교육부",
    slug: "childrens-christmas-2025",
    image: "https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=400&q=70",
  },
  {
    dept: "장년부",
    deptColor: "bg-green-100 text-green-700",
    title: "2025 추수감사절 헌신 예배 및 교제 모임",
    excerpt: "올 한해 하나님께서 베풀어주신 은혜에 감사드리며 함께 예배하고 교제하는 복된 시간이었습니다.",
    date: "2025.11.16",
    author: "장년부",
    slug: "thanksgiving-service-2025",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=70",
  },
];

export default function BlogPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#2E7D32] text-sm font-nanum-bold tracking-widest uppercase mb-2">Community</p>
            <h2 className="font-nanum-extrabold text-3xl md:text-4xl text-gray-800">교회 커뮤니티</h2>
            <div className="w-12 h-1 bg-[#F9A825] rounded-full mt-3" />
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-1 text-[#2E7D32] font-nanum-bold text-sm hover:gap-2 transition-all">
            전체 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-nanum-bold mb-3 ${post.deptColor}`}>
                  {post.dept}
                </span>
                <h3 className="font-nanum-bold text-gray-800 leading-snug mb-2 group-hover:text-[#2E7D32] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/blog" className="inline-flex items-center gap-1 text-[#2E7D32] font-nanum-bold text-sm">
            전체 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
