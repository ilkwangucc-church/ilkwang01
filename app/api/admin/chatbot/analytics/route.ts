// GET /api/admin/chatbot/analytics — 분석 데이터
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import {
  listConversations,
  listAnalytics,
  listTickets,
  listEscalations,
  listCsat,
  countEmailContacts,
} from "@/lib/chatbot-db";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdmin(req);
    if ("error" in auth) return auth.error;

    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") ?? "30", 10);
    const sinceMs = Date.now() - days * 24 * 60 * 60 * 1000;

    const convs = await listConversations(1000);
    const convsInRange = convs.filter(
      (c) => new Date(c.created_at).getTime() >= sinceMs,
    );
    const resolved = convsInRange.filter((c) => c.status === "resolved");

    const escalations = (await listEscalations()).filter(
      (e) => new Date(e.created_at).getTime() >= sinceMs,
    );
    const tickets = (await listTickets("all")).filter(
      (t) => new Date(t.created_at).getTime() >= sinceMs,
    );

    const csatAll = await listCsat();
    const csatInRange = csatAll.filter(
      (c) => new Date(c.created_at).getTime() >= sinceMs,
    );
    const avgCsat =
      csatInRange.length > 0
        ? Math.round(
            (csatInRange.reduce((a, b) => a + b.rating, 0) / csatInRange.length) * 10,
          ) / 10
        : null;

    const languages: Record<string, number> = {};
    for (const c of convsInRange) {
      if (c.language) languages[c.language] = (languages[c.language] || 0) + 1;
    }
    const languageList = Object.entries(languages)
      .map(([language, n]) => ({ language, n }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 10);

    // 일별 볼륨 (14일)
    const daily: Record<string, number> = {};
    const daily14Since = Date.now() - 14 * 24 * 60 * 60 * 1000;
    for (const c of convs) {
      const t = new Date(c.created_at).getTime();
      if (t < daily14Since) continue;
      const day = c.created_at.slice(0, 10);
      daily[day] = (daily[day] || 0) + 1;
    }
    const dailyVolume = Object.entries(daily)
      .map(([day, n]) => ({ day, n }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const analyticsEvents = await listAnalytics(sinceMs);
    const eventCounts: Record<string, number> = {};
    for (const e of analyticsEvents) {
      eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
    }
    const events = Object.entries(eventCounts)
      .map(([event_type, n]) => ({ event_type, n }))
      .sort((a, b) => b.n - a.n);

    const emailContacts = await countEmailContacts();

    return Response.json({
      period_days: days,
      total_conversations: convsInRange.length,
      resolved_conversations: resolved.length,
      resolution_rate: convsInRange.length
        ? Math.round((resolved.length / convsInRange.length) * 100)
        : 0,
      total_escalations: escalations.length,
      total_tickets: tickets.length,
      avg_csat: avgCsat,
      email_contacts: emailContacts,
      languages: languageList,
      daily_volume: dailyVolume,
      events,
    });
  } catch (e) {
    console.error("[admin-chatbot-analytics]", e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
