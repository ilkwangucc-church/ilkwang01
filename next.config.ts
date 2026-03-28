import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },       // YouTube 썸네일
      { protocol: "https", hostname: "img.youtube.com" },   // YouTube 썸네일 (대체)
      { protocol: "https", hostname: "images.unsplash.com"},// Unsplash 이미지
    ],
  },
};

export default nextConfig;
