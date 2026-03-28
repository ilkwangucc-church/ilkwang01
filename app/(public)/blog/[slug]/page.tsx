import { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft, Heart, Share2 } from "lucide-react";

// 실제 운영 시 Supabase에서 slug로 포스트 조회
const posts: Record<string, {
  title: string; author: string; dept: string; date: string;
  content: string; tags: string[]; thumbnail: string;
}> = {
  "worship-reflection-20240324": {
    title: "부활절을 준비하며 — 십자가의 의미를 다시 생각하다",
    author: "청년부 간사",
    dept: "청년부",
    date: "2024-03-24",
    content: `
하나님께서 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라 (요한복음 3:16)

부활절이 다가올수록, 저는 한 가지 질문 앞에 멈추게 됩니다. "십자가는 나에게 무엇인가?"

오랫동안 교회를 다닌 분들에게 십자가는 어쩌면 너무 익숙한 상징이 되었을지도 모릅니다. 예배당 정면에 걸려있고, 목걸이로 걸고 다니고, 찬양의 가사에도 수없이 등장합니다. 그런데 때로는 그 익숙함이 오히려 장애물이 되기도 합니다.

**십자가의 낯섦을 회복하라**

사도 바울은 고린도 교인들에게 이렇게 말했습니다: "유대인은 표적을 구하고 헬라인은 지혜를 찾으나 우리는 십자가에 못 박힌 그리스도를 전하니 유대인에게는 거리끼는 것이요 이방인에게는 미련한 것이로되..." (고전 1:22-23)

1세기의 십자가는 죽음의 도구였습니다. 오늘날로 말하면 처형 도구를 목에 걸고 다니는 것과 같은 충격적인 일이었습니다. 예수님을 따른다는 것은 '미련하고 부끄러운 것'과 기꺼이 연대하는 일이었습니다.

**부활은 십자가 없이 오지 않는다**

부활절을 기념할 때, 우리는 종종 부활의 영광에 집중합니다. 그러나 부활은 반드시 십자가를 통과합니다. 고난 없이 영광이 없고, 죽음 없이 부활이 없습니다.

이번 부활절, 여러분을 초대합니다. 화려한 부활 찬양 앞에 서기 전에, 먼저 십자가 앞에 조용히 앉아 보십시오. 그분이 나를 위해 당하신 고통과 수치와 포기를 천천히 묵상해 보십시오.

**행동으로의 초대**

부활을 믿는 삶은 변화를 요구합니다. 죽은 자를 살리신 하나님을 신뢰한다면, 우리의 두려움도 내려놓을 수 있습니다. 관계의 십자가, 사역의 십자가, 내 고집의 십자가를 지고 걸어갈 용기를 달라고 기도합니다.

"내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라" (갈 2:20)

이번 부활절, 십자가와 부활이 단지 달력의 기념일이 아닌, 나의 실존을 뒤바꾸는 사건으로 새롭게 다가오기를 기도합니다.
    `.trim(),
    tags: ["부활절", "십자가", "묵상", "청년부"],
    thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop",
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "게시물을 찾을 수 없습니다" };
  return {
    title: post.title,
    description: post.content.slice(0, 120),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 120),
      images: [post.thumbnail],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">게시물을 찾을 수 없습니다</h1>
          <Link href="/blog" className="text-[#2E7D32] hover:underline">← 커뮤니티로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 뒤로가기 */}
      <div className="bg-white border-b py-3">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            커뮤니티
          </Link>
        </div>
      </div>

      {/* 썸네일 */}
      <div
        className="h-64 md:h-80 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${post.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-3xl mx-auto px-4 pb-8 w-full">
            <span className="inline-block text-xs px-3 py-1 bg-[#2E7D32] text-white rounded-full mb-3">{post.dept}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
          {/* 메타 */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
          </div>

          {/* 본문 텍스트 */}
          <div className="prose max-w-none text-gray-700 leading-relaxed text-[15px] space-y-4">
            {post.content.split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h3 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-2">{para.replace(/\*\*/g, "")}</h3>;
              }
              return <p key={i}>{para}</p>;
            })}
          </div>

          {/* 태그 */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* 액션 */}
          <div className="mt-6 flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              좋아요
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">
              <Share2 className="w-4 h-4" />
              공유
            </button>
          </div>
        </div>

        {/* 목록으로 */}
        <div className="text-center mt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#2E7D32] hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" />
            커뮤니티 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
