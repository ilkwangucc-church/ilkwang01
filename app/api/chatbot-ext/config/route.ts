// GET /api/chatbot-ext/config — returns chatbot widget config (public, no auth)
// n0008 app/api/chatbot-ext/config/route.ts 포팅
import { NextRequest } from "next/server";
import { getSettings } from "@/lib/chatbot-db";

function normalizePublicUrl(url: string, origin: string, version: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  try {
    const target = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? new URL(trimmed)
      : new URL(trimmed, origin);
    if (version) target.searchParams.set("_cfg", version);
    return target.toString();
  } catch {
    const normalizedOrigin = origin.replace(/\/$/, "");
    const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    if (!version) return `${normalizedOrigin}${normalizedPath}`;
    const joiner = normalizedPath.includes("?") ? "&" : "?";
    return `${normalizedOrigin}${normalizedPath}${joiner}_cfg=${encodeURIComponent(version)}`;
  }
}

export async function GET(req: NextRequest) {
  try {
    const requestOrigin = req.nextUrl.origin;
    const settings = await getSettings();

    let botProfileImages: string[] = [];
    try {
      if (settings["bot_profile_image_urls"]) {
        botProfileImages = (JSON.parse(settings["bot_profile_image_urls"]) as string[])
          .filter(Boolean)
          .slice(0, 6);
      }
    } catch {}
    if (botProfileImages.length === 0 && settings["bot_profile_image_url"]) {
      botProfileImages = [settings["bot_profile_image_url"]];
    }

    const DEFAULT_BOT_NAMES = ["일광안내", "은혜", "소망", "사랑", "믿음", "평강"];
    let botNames: string[] = [];
    try {
      if (settings["bot_names"]) {
        botNames = (JSON.parse(settings["bot_names"]) as string[]).filter(Boolean).slice(0, 6);
      }
    } catch {}
    if (botNames.length === 0 && botProfileImages.length > 0) {
      botNames = DEFAULT_BOT_NAMES.slice(0, botProfileImages.length);
    }

    const version = String(Date.now());
    const profiledImages = botProfileImages.map((url) =>
      normalizePublicUrl(url, requestOrigin, version),
    );
    const profiledLogoUrl = normalizePublicUrl(settings["bot_logo_url"] || "", requestOrigin, version);
    const profileImageIntervalMs = profiledImages.length > 1 ? 4 * 60 * 60 * 1000 : 0;

    return Response.json(
      {
        enabled: settings["enabled"] !== "false",
        welcome_message: settings["welcome_message"] || "반갑습니다. 일광교회입니다.",
        bubble_label: settings["bubble_label"] || "채팅 상담",
        bot_name: settings["bot_name"] || "일광안내",
        bot_names: botNames,
        bot_greeting: settings["bot_greeting"] || "",
        bot_profile_image_url: profiledImages[0] || "",
        bot_profile_images: profiledImages,
        profile_image_interval_ms: profileImageIntervalMs,
        bot_logo_url: profiledLogoUrl,
        // 일광교회 기본 색상 (다크 네이비 #1A2744)
        primary_color: settings["primary_color"] || "#1A2744",
        secondary_color: settings["secondary_color"] || "#2E3F6B",
        header_bg_color: settings["header_bg_color"] || "#1A2744",
        user_bubble_color: settings["user_bubble_color"] || "#1A2744",
        bot_bubble_color: settings["bot_bubble_color"] || "#F1F4F9",
        widget_position: settings["widget_position"] || "bottom-right",
        widget_width: parseInt(settings["widget_width"] || "360", 10),
        widget_height: parseInt(settings["widget_height"] || "520", 10),
        toggle_size: parseInt(settings["toggle_size"] || "62", 10),
        font_size: parseInt(settings["font_size"] || "14", 10),
        border_radius: parseInt(settings["border_radius"] || "16", 10),
        default_language: settings["default_language"] || "ko",
        auto_detect_language: settings["auto_detect_language"] === "0" ? 0 : 1,
        email_collection_enabled: settings["email_collection_enabled"] !== "0" ? 1 : 0,
        email_collection_msg: settings["email_collection_msg"] || "",
        proactive_message: settings["proactive_message"] || "",
        proactive_delay: parseInt(settings["proactive_delay"] || "8", 10),
        section_dwell_time: parseInt(settings["section_dwell_time"] || "2000", 10),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    console.error("[chatbot-ext/config]", e);
    return Response.json(
      {
        enabled: true,
        welcome_message: "반갑습니다. 일광교회입니다.",
        bubble_label: "채팅 상담",
        bot_name: "일광안내",
        bot_greeting: "",
        bot_profile_image_url: "",
        bot_logo_url: "",
        primary_color: "#1A2744",
        secondary_color: "#2E3F6B",
        header_bg_color: "#1A2744",
        user_bubble_color: "#1A2744",
        bot_bubble_color: "#F1F4F9",
        widget_position: "bottom-right",
        widget_width: 360,
        widget_height: 520,
        toggle_size: 62,
        font_size: 14,
        border_radius: 16,
        default_language: "ko",
        auto_detect_language: 1,
        email_collection_enabled: 1,
        email_collection_msg: "",
        proactive_message: "",
        proactive_delay: 8,
        section_dwell_time: 2000,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
