// GET/POST /api/admin/chatbot/settings — 챗봇 설정
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { getSettings, setManySettings } from "@/lib/chatbot-db";

const UI_KEYS = [
  "enabled",
  "welcome_message",
  "bubble_label",
  "bot_name",
  "bot_greeting",
  "primary_color",
  "secondary_color",
  "header_bg_color",
  "user_bubble_color",
  "bot_bubble_color",
  "bot_profile_image_url",
  "bot_profile_image_urls",
  "bot_logo_url",
  "proactive_message",
  "proactive_delay",
  "default_language",
  "auto_detect_language",
  "email_collection_enabled",
  "email_collection_msg",
  "section_dwell_time",
  "custom_knowledge_base",
  "bot_names",
];

const ALLOWED_KEYS = [
  ...UI_KEYS,
  "escalation_keywords",
  "bot_color",
];

function stringifySettingValue(value: unknown) {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return JSON.stringify(value);
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const all = await getSettings();
    const settings: Record<string, string> = {};
    for (const k of UI_KEYS) {
      if (all[k] !== undefined) settings[k] = all[k];
    }
    return Response.json({ settings });
  } catch (e) {
    console.error("[admin-chatbot-settings-get]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const body = (await req.json()) as Record<string, unknown>;
    const patch: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_KEYS.includes(key)) continue;
      patch[key] = stringifySettingValue(value);
    }
    await setManySettings(patch);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[admin-chatbot-settings-post]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
