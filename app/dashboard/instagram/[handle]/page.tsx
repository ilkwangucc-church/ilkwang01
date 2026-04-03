"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Camera, ExternalLink, Heart, Image as ImageIcon,
  Video, Grid3X3, Settings,
} from "lucide-react";

interface AccountInfo {
  id: string;
  dept: string;
  handle: string;
  gradient: string;
  bio: string;
  url: string;
}

interface Post {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function MediaIcon({ type }: { type: string }) {
  if (type === "VIDEO") return <Video className="w-4 h-4" />;
  if (type === "CAROUSEL_ALBUM") return <Grid3X3 className="w-4 h-4" />;
  return null;
}

export default function InstagramDetailPage() {
  const params = useParams();
  const handle = params.handle as string;

  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch(`/api/instagram/feed/${handle}`);
        if (!res.ok) {
          setError("계정을 찾을 수 없습니다");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setAccount(data.account);
        setPosts(data.posts || []);
        setConnected(data.connected || false);
      } catch {
        setError("데이터를 불러올 수 없습니다");
      }
      setLoading(false);
    }
    loadFeed();
  }, [handle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/instagram" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> 부서별 인스타그램
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{error || "계정을 찾을 수 없습니다"}</p>
          <Link href="/dashboard/instagram" className="inline-block mt-4 text-sm text-purple-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/instagram" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> 부서별 인스타그램
        </Link>
        <a
          href={account.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          인스타그램에서 보기 <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${account.gradient} flex items-center justify-center text-white shrink-0 ring-4 ring-white shadow-lg`}>
            <Camera className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{account.dept}</h1>
            <p className="text-sm text-gray-400">{account.handle}</p>
            <p className="text-sm text-gray-600 mt-1">{account.bio}</p>
          </div>
          {connected && (
            <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium">
              <Heart className="w-3 h-3" /> API 연동됨
            </span>
          )}
        </div>
      </div>

      {/* 피드 콘텐츠 */}
      {connected && posts.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-purple-500" /> 최근 게시물
            </h2>
            <span className="text-xs text-gray-400">{posts.length}개 게시물</span>
          </div>

          {/* 포스트 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group text-left"
              >
                <div className="aspect-square overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url}
                    alt={post.caption?.slice(0, 50) || "Instagram post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 미디어 타입 뱃지 */}
                  {post.media_type !== "IMAGE" && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5">
                      <MediaIcon type={post.media_type} />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  {post.caption && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{post.caption}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">{formatDate(post.timestamp)}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* API 미연동 안내 */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">
            {connected ? "게시물이 없습니다" : "인스타그램 API가 아직 연동되지 않았습니다"}
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            {connected
              ? "이 계정에 게시물이 없거나 불러올 수 없습니다."
              : "관리자가 Instagram Graph API 토큰을 등록하면 이곳에서 인스타그램 피드를 확인할 수 있습니다."
            }
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" /> 인스타그램에서 보기
            </a>
            <Link
              href="/dashboard/settings/instagram"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" /> API 설정
            </Link>
          </div>
        </div>
      )}

      {/* 포스트 상세 모달 */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 이미지 */}
            <div className="relative bg-black flex items-center justify-center max-h-[60vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPost.media_type === "VIDEO" ? (selectedPost.thumbnail_url || selectedPost.media_url) : selectedPost.media_url}
                alt=""
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
            {/* 정보 */}
            <div className="p-5 overflow-y-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${account.gradient} flex items-center justify-center text-white shrink-0`}>
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{account.dept}</p>
                  <p className="text-[11px] text-gray-400">{formatDate(selectedPost.timestamp)}</p>
                </div>
              </div>
              {selectedPost.caption && (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectedPost.caption}</p>
              )}
              <div className="mt-4 flex gap-3">
                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> 인스타그램에서 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
