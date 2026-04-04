import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifySessionToken } from "@/lib/adminAuth";
import { readGallery, writeGallery, generateGalleryId } from "@/lib/gallery";

const ALLOWED_IMG = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const formData = await req.formData();
    const title    = (formData.get("title")    as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const date     = (formData.get("date")     as string)?.trim();
    const file     = formData.get("file") as File | null;

    if (!title || !category || !date) {
      return NextResponse.json({ error: "제목, 카테고리, 날짜는 필수입니다." }, { status: 400 });
    }
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "이미지 파일을 선택해주세요." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_IMG.includes(ext)) {
      return NextResponse.json({ error: "JPG, PNG, WEBP, GIF 이미지만 가능합니다." }, { status: 400 });
    }

    // public/gallery/ 저장 (자체 서버) — Vercel은 EROFS로 실패
    const galleryDir = path.join(process.cwd(), "public", "gallery");
    await mkdir(galleryDir, { recursive: true });
    const filename = `${Date.now()}${ext}`;
    await writeFile(path.join(galleryDir, filename), Buffer.from(await file.arrayBuffer()));
    const url = `/gallery/${filename}`;

    const items = await readGallery();
    const newItem = {
      id: generateGalleryId(items),
      title,
      category,
      date,
      url,
    };
    items.unshift(newItem);
    await writeGallery(items);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    console.error("gallery upload error:", err);
    return NextResponse.json({ error: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
