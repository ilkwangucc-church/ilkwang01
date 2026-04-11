import { readFile, writeFile } from "fs/promises";
import path from "path";

export interface Bulletin {
  id: number;
  date: string;
  highlights: string[];
  front: string;
  back: string;
  file?: string;
  fileType?: string;
}

const DEPLOY_PATH   = path.join(process.cwd(), "data", "bulletins.json");
const TMP_PATH      = "/tmp/ilkwang-bulletins.json";
const TMP_TS_PATH   = "/tmp/ilkwang-bulletins-ts.txt";
const GH_FILE_PATH  = "data/bulletins.json";
const CACHE_TTL     = 30; // seconds

function hasGithub(): boolean {
  return !!(process.env.GITHUB_DB_TOKEN && process.env.GITHUB_DB_REPO);
}

/** GitHub에서 텍스트 파일 읽기 */
async function ghReadText(ghPath: string): Promise<{ content: string; sha: string } | null> {
  const token = process.env.GITHUB_DB_TOKEN!;
  const repo  = process.env.GITHUB_DB_REPO!;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${ghPath}`,
      { headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { content: string; sha: string };
    return { content: Buffer.from(json.content, "base64").toString("utf-8"), sha: json.sha };
  } catch { return null; }
}

/** GitHub에 텍스트 파일 쓰기 */
async function ghWriteText(ghPath: string, text: string, sha: string, msg: string): Promise<boolean> {
  const token = process.env.GITHUB_DB_TOKEN!;
  const repo  = process.env.GITHUB_DB_REPO!;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${ghPath}`,
      {
        method: "PUT",
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, content: Buffer.from(text).toString("base64"), sha }),
        cache: "no-store",
      }
    );
    return res.ok;
  } catch { return false; }
}

/**
 * 바이너리 파일을 GitHub repo 에 업로드하고 raw URL 반환
 * ghPath 예: "public/bulletins/2026-04-11-1.jpg"
 */
export async function uploadBulletinFile(filename: string, buf: Buffer): Promise<string | null> {
  if (!hasGithub()) return null;
  const token = process.env.GITHUB_DB_TOKEN!;
  const repo  = process.env.GITHUB_DB_REPO!;
  const ghPath = `public/bulletins/${filename}`;

  // 기존 파일 SHA 확인 (덮어쓰기 시 필요)
  let sha: string | undefined;
  try {
    const chk = await fetch(
      `https://api.github.com/repos/${repo}/contents/${ghPath}`,
      { headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" }, cache: "no-store" }
    );
    if (chk.ok) sha = ((await chk.json()) as { sha: string }).sha;
  } catch { /* 없으면 신규 생성 */ }

  const body: Record<string, string> = {
    message: `Upload: 주보 파일 ${filename}`,
    content: buf.toString("base64"),
  };
  if (sha) body.sha = sha;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/${ghPath}`,
      {
        method: "PUT",
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return `https://raw.githubusercontent.com/${repo}/main/${ghPath}`;
  } catch { return null; }
}

/** 주보 목록 읽기 */
export async function readBulletins(): Promise<Bulletin[]> {
  if (hasGithub()) {
    // /tmp 캐시 확인
    try {
      const ts  = await readFile(TMP_TS_PATH, "utf-8").catch(() => "0");
      const age = (Date.now() - parseInt(ts)) / 1000;
      if (age < CACHE_TTL) {
        return JSON.parse(await readFile(TMP_PATH, "utf-8"));
      }
    } catch { /* ignore */ }

    const gh = await ghReadText(GH_FILE_PATH);
    if (gh) {
      try {
        await writeFile(TMP_PATH, gh.content, "utf-8");
        await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
      } catch { /* ignore */ }
      return JSON.parse(gh.content);
    }
  }

  try { return JSON.parse(await readFile(DEPLOY_PATH, "utf-8")); }
  catch { return []; }
}

/** 주보 목록 쓰기 */
export async function writeBulletins(bulletins: Bulletin[]): Promise<void> {
  const json = JSON.stringify(bulletins, null, 2);

  if (hasGithub()) {
    const gh = await ghReadText(GH_FILE_PATH);
    if (gh) {
      const ok = await ghWriteText(GH_FILE_PATH, json, gh.sha, "DB: 주보 데이터 업데이트");
      if (ok) {
        try {
          await writeFile(TMP_PATH, json, "utf-8");
          await writeFile(TMP_TS_PATH, String(Date.now()), "utf-8");
        } catch { /* ignore */ }
        return;
      }
    }
  }

  await writeFile(DEPLOY_PATH, json, "utf-8");
}
