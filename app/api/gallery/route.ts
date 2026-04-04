import { NextRequest, NextResponse } from "next/server";
import { readGallery, writeGallery } from "@/lib/gallery";

/** GET — 갤러리 목록 */
export async function GET() {
  try {
    const items = await readGallery();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

/** DELETE — 갤러리 항목 삭제 */
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const items = await readGallery();
    const filtered = items.filter((item) => item.id !== id);
    await writeGallery(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
