import { readFile, writeFile } from "fs/promises";
import path from "path";

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: number;
  dept: string;
  matched: boolean;
  joined: string;
  passwordHash?: string; // 자체 회원가입 시 저장
}

/** 배포 번들 경로 (읽기 가능, Vercel에서 쓰기 불가) */
const DEPLOY_PATH = path.join(process.cwd(), "data", "members.json");
/** Vercel /tmp 경로 (쓰기 가능, 인스턴스 내 유지) */
const TMP_PATH = "/tmp/ilkwang-members.json";

/**
 * 회원 목록 읽기
 * 우선순위: /tmp (최신 쓰기) → data/ (배포 초기 데이터)
 */
export async function readMembers(): Promise<Member[]> {
  try {
    const raw = await readFile(TMP_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    try {
      const raw = await readFile(DEPLOY_PATH, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}

/**
 * 회원 목록 쓰기
 * 우선순위: data/ (자체 서버, 영구 저장) → /tmp (Vercel 폴백)
 */
export async function writeMembers(members: Member[]): Promise<void> {
  const data = JSON.stringify(members, null, 2);
  try {
    await writeFile(DEPLOY_PATH, data, "utf-8");
  } catch {
    // Vercel: 배포 디렉터리가 읽기 전용이면 /tmp 에 저장
    await writeFile(TMP_PATH, data, "utf-8");
  }
}

export function generateMemberId(members: Member[]): number {
  if (members.length === 0) return 1;
  return Math.max(...members.map((m) => m.id)) + 1;
}
