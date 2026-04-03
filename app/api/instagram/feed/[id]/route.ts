import { NextRequest, NextResponse } from "next/server";
import { getAccountById, fetchInstagramFeed } from "@/lib/instagram";

/** GET — 부서별 인스타그램 피드 프록시 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const account = await getAccountById(id);
    if (!account) {
      return NextResponse.json({ error: "계정 없음" }, { status: 404 });
    }

    if (!account.isActive || !account.accessToken) {
      return NextResponse.json({
        account: {
          id: account.id,
          dept: account.dept,
          handle: account.handle,
          gradient: account.gradient,
          bio: account.bio,
          url: account.url,
        },
        posts: [],
        connected: false,
      });
    }

    const posts = await fetchInstagramFeed(account);

    return NextResponse.json(
      {
        account: {
          id: account.id,
          dept: account.dept,
          handle: account.handle,
          gradient: account.gradient,
          bio: account.bio,
          url: account.url,
        },
        posts,
        connected: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
