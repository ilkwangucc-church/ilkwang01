// POST /api/chatbot-ext/ticket — public ticket creation disabled
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  return Response.json(
    {
      error: "Ticket creation is disabled",
      code: "ticket_creation_disabled",
    },
    { status: 410 },
  );
}
