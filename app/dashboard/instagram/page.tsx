"use client";
import { Camera, ExternalLink, Heart, MessageCircle, Users } from "lucide-react";

const DEPT_INSTAGRAMS = [
  {
    dept: "일광교회 공식",
    handle: "@ilkwang_church",
    gradient: "from-purple-500 to-pink-500",
    followers: "1.2k",
    bio: "일광교회 공식 인스타그램입니다. 교회 소식과 은혜로운 이야기를 나눕니다 🙏",
    url: "https://www.instagram.com/ilkwang_church/",
    posts: 248,
    recentImages: [
      "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=300&q=80",
    ],
  },
  {
    dept: "찬양팀",
    handle: "@ilkwang_worship",
    gradient: "from-amber-400 to-orange-500",
    followers: "256",
    bio: "예배를 섬기는 찬양팀의 이야기를 나눕니다. 하나님께 드리는 찬양 🎵",
    url: "https://www.instagram.com/ilkwang_worship/",
    posts: 89,
    recentImages: [
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=300&q=80",
    ],
  },
  {
    dept: "선교부",
    handle: "@ilkwang_mission",
    gradient: "from-red-400 to-rose-500",
    followers: "312",
    bio: "세계 선교의 현장을 함께 나눕니다. 땅 끝까지 복음을 🌍",
    url: "https://www.instagram.com/ilkwang_mission/",
    posts: 167,
    recentImages: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=300&q=80",
    ],
  },
  {
    dept: "유초등부",
    handle: "@ilkwang_kids",
    gradient: "from-green-400 to-teal-500",
    followers: "198",
    bio: "유초등부 아이들의 순수한 믿음 이야기를 전합니다. 다음 세대를 세워갑니다 👧",
    url: "https://www.instagram.com/ilkwang_kids/",
    posts: 76,
    recentImages: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1569173112611-52a7cd38bea9?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80",
    ],
  },
  {
    dept: "중고등부",
    handle: "@ilkwang_teen",
    gradient: "from-indigo-500 to-blue-500",
    followers: "143",
    bio: "중·고등부 청소년 커뮤니티입니다. 함께 성장하는 믿음의 공동체 🔥",
    url: "https://www.instagram.com/ilkwang_teen/",
    posts: 58,
    recentImages: [
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=300&q=80",
    ],
  },
  {
    dept: "청년부",
    handle: "@ilkwang_youth",
    gradient: "from-blue-500 to-purple-500",
    followers: "387",
    bio: "일광교회 청년부 소식을 전합니다. 함께 믿음으로 성장해요 ✨",
    url: "https://www.instagram.com/ilkwang_youth/",
    posts: 134,
    recentImages: [
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=300&q=80",
    ],
  },
];

const TOTAL_FOLLOWERS = "2.5k";
const TOTAL_POSTS = 772;

export default function InstagramPage() {
  return (
    <div className="space-y-6">
      {/* 히어로 배너 */}
      <div className="relative rounded-2xl overflow-hidden h-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1400&q=80"
          alt="부서별 인스타그램"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-pink-800/70 to-orange-600/60" />
        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">부서별 인스타그램</h1>
              <p className="text-pink-200 text-sm">각 부서의 생생한 소식을 인스타그램에서 만나세요</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> 총 팔로워 {TOTAL_FOLLOWERS}</span>
            <span className="flex items-center gap-2"><Camera className="w-4 h-4" /> 총 게시물 {TOTAL_POSTS}개</span>
            <span className="flex items-center gap-2">📱 부서 계정 6개</span>
          </div>
        </div>
      </div>

      {/* 통계 3칸 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "부서 계정", value: "6", sub: "개 운영 중" },
          { label: "총 팔로워", value: "2.5k", sub: "명" },
          { label: "총 게시물", value: "772", sub: "개" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label} {s.sub}</p>
          </div>
        ))}
      </div>

      {/* 부서 카드 그리드 */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {DEPT_INSTAGRAMS.map((account) => (
          <a
            key={account.dept}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
          >
            {/* 미니 인스타 사진 그리드 */}
            <div className="grid grid-cols-3 h-28">
              {account.recentImages.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-full h-full object-cover group-hover:brightness-90 transition-all"
                />
              ))}
            </div>

            {/* 계정 정보 */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${account.gradient} flex items-center justify-center text-white shrink-0 ring-2 ring-white shadow`}>
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{account.dept}</p>
                  <p className="text-xs text-gray-400">{account.handle}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors shrink-0" />
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{account.bio}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400" />
                  <strong className="text-gray-800">{account.followers}</strong> 팔로워
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-blue-400" />
                  <strong className="text-gray-800">{account.posts}</strong> 게시물
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 하단 계정 추가 요청 배너 */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">부서 계정 추가 요청</p>
              <p className="text-white/80 text-sm">담당 관리자에게 인스타그램 계정 등록을 요청하세요</p>
            </div>
          </div>
          <a
            href="/dashboard/counseling"
            className="shrink-0 px-5 py-2.5 bg-white text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors"
          >
            관리자에게 문의하기 →
          </a>
        </div>
      </div>
    </div>
  );
}
