import { readFile, writeFile } from "fs/promises";
import path from "path";

export interface GalleryItem {
  id: number;
  title: string;
  date: string;
  category: string;
  url: string;
}

const DEPLOY_PATH = path.join(process.cwd(), "data", "gallery.json");
const TMP_PATH = "/tmp/ilkwang-gallery.json";

export async function readGallery(): Promise<GalleryItem[]> {
  try {
    return JSON.parse(await readFile(TMP_PATH, "utf-8"));
  } catch {
    try {
      return JSON.parse(await readFile(DEPLOY_PATH, "utf-8"));
    } catch {
      return [];
    }
  }
}

export async function writeGallery(items: GalleryItem[]): Promise<void> {
  const data = JSON.stringify(items, null, 2);
  try {
    await writeFile(DEPLOY_PATH, data, "utf-8");
  } catch {
    await writeFile(TMP_PATH, data, "utf-8");
  }
}

export function generateGalleryId(items: GalleryItem[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}
