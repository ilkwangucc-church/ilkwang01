import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { revalidateTag } from "next/cache";
import { delCached } from "@/lib/object-cache";
import { CACHE_TAGS } from "@/lib/cache";

const ALLOWED_DOC = [".hwp", ".doc", ".docx", ".pdf", ".ppt", ".pptx"];
const ALLOWED_IMG = [".jpg", ".jpeg", ".png", ".webp"];

function ext(filename: string) {
  return path.extname(filename).toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const date       = (formData.get("date")       as string)?.trim();
    const highlights = (formData.get("highlights") as string)
      ?.split("\n")
      .map((h) => h.trim())
      .filter(Boolean) ?? [];
    const frontFile  = formData.get("front")  as File | null;
    const backFile   = formData.get("back")   as File | null;
    const docFile    = formData.get("file")   as File | null;

    if (!date || highlights.length === 0) {
      return NextResponse.json({ error: "날짜와 주요 내용은 필수입니다." }, { status: 400 });
    }

    // /public/bulletins/ 폴더 확인
    const bullDir = path.join(process.cwd(), "public", "bulletins");
    await mkdir(bullDir, { recursive: true });

    let frontPath = "";
    let backPath  = "";
    let filePath  = "";
    let fileType  = "";

    // 앞면 이미지
    if (frontFile && frontFile.size > 0) {
      const e = ext(frontFile.name);
      if (!ALLOWED_IMG.includes(e)) {
        return NextResponse.json({ error: "앞면은 JPG/PNG/WEBP 이미지만 가능합니다." }, { status: 400 });
      }
      const buf = Buffer.from(await frontFile.arrayBuffer());
      const name = `${date}-1${e}`;
      await writeFile(path.join(bullDir, name), buf);
      frontPath = `/bulletins/${name}`;
    }

    // 뒷면 이미지
    if (backFile && backFile.size > 0) {
      const e = ext(backFile.name);
      if (!ALLOWED_IMG.includes(e)) {
        return NextResponse.json({ error: "뒷면은 JPG/PNG/WEBP 이미지만 가능합니다." }, { status: 400 });
      }
      const buf = Buffer.from(await backFile.arrayBuffer());
      const name = `${date}-2${e}`;
      await writeFile(path.join(bullDir, name), buf);
      backPath = `/bulletins/${name}`;
    }

    // 문서 파일 (HWP / DOC / PDF / PPT)
    if (docFile && docFile.size > 0) {
      const e = ext(docFile.name);
      if (!ALLOWED_DOC.includes(e)) {
        return NextResponse.json({ error: "문서는 HWP, DOC, PDF, PPT 형식만 가능합니다." }, { status: 400 });
      }
      const buf = Buffer.from(await docFile.arrayBuffer());
      const name = `${date}${e}`;
      await writeFile(path.join(bullDir, name), buf);
      filePath = `/bulletins/${name}`;
      fileType = e.slice(1); // ".hwp" → "hwp"
    }

    // bulletins.json 업데이트
    const dataPath = path.join(process.cwd(), "data", "bulletins.json");
    let bulletins: {
      id: number; date: string; highlights: string[];
      front: string; back: string; file?: string; fileType?: string;
    }[] = [];
    try {
      bulletins = JSON.parse(await readFile(dataPath, "utf-8"));
    } catch { /* 파일 없으면 빈 배열 */ }

    // 같은 날짜 덮어쓰기
    const existing = bulletins.findIndex((b) => b.date === date);
    const entry = {
      id: existing >= 0 ? bulletins[existing].id : Date.now(),
      date,
      highlights,
      front: frontPath || (existing >= 0 ? bulletins[existing].front : ""),
      back:  backPath  || (existing >= 0 ? bulletins[existing].back  : ""),
      ...(filePath ? { file: filePath, fileType } : {}),
    };

    if (existing >= 0) {
      bulletins[existing] = entry;
    } else {
      bulletins.unshift(entry);
    }

    await writeFile(dataPath, JSON.stringify(bulletins, null, 2), "utf-8");

    // 캐시 무효화 (Next.js Data Cache + Object Cache)
    revalidateTag(CACHE_TAGS.bulletins, {});
    await delCached("bulletins:list");

    return NextResponse.json({ success: true, bulletin: entry });
  } catch (err) {
    console.error("bulletin upload error:", err);
    return NextResponse.json({ error: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const dataPath = path.join(process.cwd(), "data", "bulletins.json");
    const bulletins: { id: number }[] = JSON.parse(await readFile(dataPath, "utf-8"));
    const filtered = bulletins.filter((b) => b.id !== id);
    await writeFile(dataPath, JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
