import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readAccounts, writeAccounts, invalidateFeedCache } from "@/lib/instagram";

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return null;
  return session;
}

/** PUT — 계정 수정 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "권한 부족" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const accounts = await readAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx < 0) return NextResponse.json({ error: "계정 없음" }, { status: 404 });

  accounts[idx] = { ...accounts[idx], ...body };

  if (body.accessToken !== undefined) {
    accounts[idx].isActive = !!body.accessToken;
    accounts[idx].tokenExpiresAt = body.accessToken
      ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      : "";
  }

  await writeAccounts(accounts);
  await invalidateFeedCache(id);
  return NextResponse.json({ success: true });
}

/** DELETE — 계정 삭제 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "권한 부족" }, { status: 403 });
  }

  const { id } = await params;
  const accounts = await readAccounts();
  const filtered = accounts.filter((a) => a.id !== id);

  if (filtered.length === accounts.length) {
    return NextResponse.json({ error: "계정 없음" }, { status: 404 });
  }

  await writeAccounts(filtered);
  await invalidateFeedCache(id);
  return NextResponse.json({ success: true });
}
