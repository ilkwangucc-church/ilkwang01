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
}

const DATA_PATH = path.join(process.cwd(), "data", "members.json");

export async function readMembers(): Promise<Member[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeMembers(members: Member[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(members, null, 2), "utf-8");
}

export function generateMemberId(members: Member[]): number {
  if (members.length === 0) return 1;
  return Math.max(...members.map((m) => m.id)) + 1;
}
