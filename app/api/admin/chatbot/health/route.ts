// GET /api/admin/chatbot/health — CF Workers AI 연결 상태 진단
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/chatbot-auth";
import { chatbotDbReady } from "@/lib/chatbot-db";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;

  const accountId = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_AI_TOKEN;
  const model = process.env.CF_AI_MODEL || "@cf/qwen/qwen3-30b-a3b-fp8";

  const report: Record<string, unknown> = {
    redis: chatbotDbReady(),
    cf_account_id: !!accountId,
    cf_ai_token: !!token,
    cf_model: model,
    upstash_url: !!process.env.UPSTASH_REDIS_REST_URL,
  };

  // Probe CF AI
  if (accountId && token) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "Reply with only the word OK." },
              { role: "user", content: "ping" },
            ],
            max_tokens: 20,
            temperature: 0,
          }),
        },
      );
      const json = await res.json();
      report.cf_probe_status = res.status;
      report.cf_probe_ok = res.ok;
      report.cf_probe_body = json;
    } catch (e) {
      report.cf_probe_error = e instanceof Error ? e.message : String(e);
    }
  } else {
    report.cf_probe_skipped = "CF_ACCOUNT_ID 또는 CF_AI_TOKEN 없음";
  }

  return Response.json(report);
}
