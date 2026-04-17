// 챗봇 공용 타입 (관리자 UI에서 공유)
// n0008 lib/types/chatbot.ts 포팅

export interface Conversation {
  id: string;
  customer_email: string | null;
  customer_name?: string | null;
  visitor_id: string | null;
  pages_visited?: string | null;
  first_message: string | null;
  last_message: string | null;
  msg_count: number;
  status: string;
  language: string | null;
  escalated: number;
  is_member: number;
  created_at: string;
  last_active_at: string | null;
}

export interface Message {
  id: number;
  role: string;
  content: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  email: string | null;
  name: string | null;
  subject: string;
  message: string;
  language: string | null;
  status: string;
  assigned_to: string | null;
  created_at: string;
}

export interface Analytics {
  total_conversations: number;
  resolved_conversations: number;
  resolution_rate: number;
  total_escalations: number;
  total_tickets: number;
  avg_csat: number | null;
  email_contacts: number;
  languages: { language: string; n: number }[];
  daily_volume: { day: string; n: number }[];
  events: { event_type: string; n: number }[];
}

export interface Settings {
  enabled?: string;
  welcome_message?: string;
  bubble_label?: string;
  bot_name?: string;
  bot_greeting?: string;
  primary_color?: string;
  secondary_color?: string;
  header_bg_color?: string;
  user_bubble_color?: string;
  bot_bubble_color?: string;
  bot_profile_image_url?: string;
  bot_profile_image_urls?: string;
  bot_logo_url?: string;
  proactive_message?: string;
  proactive_delay?: string;
  default_language?: string;
  auto_detect_language?: string;
  email_collection_enabled?: string;
  email_collection_msg?: string;
  section_dwell_time?: string;
  custom_knowledge_base?: string;
  bot_names?: string;
}

export type Tab = "overview" | "inbox" | "tickets" | "analytics" | "settings";

export const STATUS_BADGE: Record<string, string> = {
  open: "badge-blue",
  escalated: "badge-red",
  handled: "badge-yellow",
  resolved: "badge-green",
};
export const STATUS_LABEL_KO: Record<string, string> = {
  open: "진행중",
  handled: "처리됨",
  resolved: "해결됨",
  escalated: "에스컬레이션",
};

export function formatTime(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
