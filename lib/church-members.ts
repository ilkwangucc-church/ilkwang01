/**
 * 일광교회 교적부 (Church Member Registry) 유틸리티
 * - 교적카드 데이터 모델
 * - JSON 파일 기반 읽기/쓰기
 */

import { readFile, writeFile } from "fs/promises";
import path from "path";

/* ── 가족사항 ─────────────────────────────────────────────────── */
export interface FamilyMember {
  relation: string;
  name: string;
  birthDate: string;
  memberCategory: string;
  position: string;
  department: string;
  faithLevel: string;
  phone: string;
  photo: string;
  notes: string;
}

/* ── 심방내역 ─────────────────────────────────────────────────── */
export interface PastoralVisit {
  visitDate: string;
  bibleHymn: string;
  visitContent: string;
  category: string;
}

/* ── 교적카드 ─────────────────────────────────────────────────── */
export interface ChurchMember {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  familyRelation: string;
  faithHead: string;
  photo: string;
  familyPhotos: string[];
  parish: string;
  spouse: string;
  phone: string;
  tel: string;
  address: string;
  memberType: string;
  currentStatus: string;
  registrationDate: string;
  introducer: string;
  marriageStatus: string;
  attendanceRate: string;
  serviceDept: string;
  workplace: string;
  detailPosition: string;
  ordinationDate: string;
  missionGroup: string;
  baptismType: string;
  baptismDate: string;
  baptismChurch: string;
  notes: string;
  familyMembers: FamilyMember[];
  pastoralVisits: PastoralVisit[];
  createdAt: string;
  updatedAt: string;
}

/* ── JSON 읽기/쓰기 ───────────────────────────────────────────── */

const DATA_PATH = path.join(process.cwd(), "data", "church-members.json");

export async function readMembers(): Promise<ChurchMember[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeMembers(members: ChurchMember[]): Promise<void> {
  await writeFile(DATA_PATH, JSON.stringify(members, null, 2), "utf-8");
}

export async function getMemberById(id: string): Promise<ChurchMember | undefined> {
  const members = await readMembers();
  return members.find((m) => m.id === id);
}

export function generateMemberId(): string {
  return `m_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/* ── 빈 교적카드 생성 헬퍼 ────────────────────────────────────── */

export function createEmptyMember(partial: Partial<ChurchMember> = {}): ChurchMember {
  const now = new Date().toISOString();
  return {
    id: generateMemberId(),
    name: "",
    birthDate: "",
    gender: "남",
    familyRelation: "",
    faithHead: "",
    photo: "",
    familyPhotos: [],
    parish: "",
    spouse: "",
    phone: "",
    tel: "",
    address: "",
    memberType: "장년",
    currentStatus: "출석",
    registrationDate: "",
    introducer: "",
    marriageStatus: "미혼",
    attendanceRate: "A",
    serviceDept: "",
    workplace: "",
    detailPosition: "",
    ordinationDate: "",
    missionGroup: "",
    baptismType: "",
    baptismDate: "",
    baptismChurch: "",
    notes: "",
    familyMembers: [],
    pastoralVisits: [],
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

/* ── 엑셀 헤더 매핑 ──────────────────────────────────────────── */

export const MEMBER_EXCEL_HEADERS: Record<string, string> = {
  교적번호: "id",
  이름: "name",
  생년월일: "birthDate",
  성별: "gender",
  가족관계: "familyRelation",
  신앙세대주: "faithHead",
  사진URL: "photo",
  가족사진1: "familyPhoto1",
  가족사진2: "familyPhoto2",
  교구: "parish",
  배우자: "spouse",
  HP: "phone",
  TEL: "tel",
  주소: "address",
  교인구분: "memberType",
  현재상태: "currentStatus",
  등록일: "registrationDate",
  인도자: "introducer",
  결혼관계: "marriageStatus",
  출석률: "attendanceRate",
  봉사부서: "serviceDept",
  직장명: "workplace",
  상세직분: "detailPosition",
  임직일: "ordinationDate",
  선교회: "missionGroup",
  세례유형: "baptismType",
  집례일: "baptismDate",
  집례교회: "baptismChurch",
  비고: "notes",
};

export const FAMILY_EXCEL_HEADERS: Record<string, string> = {
  교적번호: "memberId",
  교인이름: "memberName",
  관계: "relation",
  이름: "name",
  생년월일: "birthDate",
  교인구분: "memberCategory",
  직분: "position",
  소속부서: "department",
  신급: "faithLevel",
  휴대폰: "phone",
  사진URL: "photo",
  비고: "notes",
};

export const VISIT_EXCEL_HEADERS: Record<string, string> = {
  교적번호: "memberId",
  교인이름: "memberName",
  카테고리: "category",
  심방일: "visitDate",
  "성경/찬송": "bibleHymn",
  심방내용: "visitContent",
};
