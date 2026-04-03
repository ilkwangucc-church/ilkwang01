import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import {
  readMembers, writeMembers, createEmptyMember,
  MEMBER_EXCEL_HEADERS, FAMILY_EXCEL_HEADERS, VISIT_EXCEL_HEADERS,
  type FamilyMember, type PastoralVisit,
} from "@/lib/church-members";
import * as XLSX from "xlsx";

function mapRow(row: Record<string, unknown>, headerMap: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [korKey, engKey] of Object.entries(headerMap)) {
    result[engKey] = String(row[korKey] ?? "");
  }
  return result;
}

/** POST — 엑셀 파일 가져오기 */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "파일 없음" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: "array" });

    // 시트 1: 교인정보 파싱
    const memberSheet = wb.Sheets["교인정보"] || wb.Sheets[wb.SheetNames[0]];
    if (!memberSheet) return NextResponse.json({ error: "교인정보 시트를 찾을 수 없습니다" }, { status: 400 });

    const memberRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(memberSheet);
    const errors: string[] = [];
    let imported = 0;
    let updated = 0;

    const existing = await readMembers();
    const existingMap = new Map(existing.map((m) => [m.id, m]));

    // 가족사항 시트 파싱
    const familySheet = wb.Sheets["가족사항"];
    const familyRows = familySheet ? XLSX.utils.sheet_to_json<Record<string, unknown>>(familySheet) : [];
    const familyByMember = new Map<string, FamilyMember[]>();
    familyRows.forEach((row) => {
      const mapped = mapRow(row, FAMILY_EXCEL_HEADERS);
      const memberId = mapped.memberId;
      if (!memberId) return;
      if (!familyByMember.has(memberId)) familyByMember.set(memberId, []);
      familyByMember.get(memberId)!.push({
        relation: mapped.relation || "",
        name: mapped.name || "",
        birthDate: mapped.birthDate || "",
        memberCategory: mapped.memberCategory || "",
        position: mapped.position || "",
        department: mapped.department || "",
        faithLevel: mapped.faithLevel || "",
        phone: mapped.phone || "",
        notes: mapped.notes || "",
      });
    });

    // 심방내역 시트 파싱
    const visitSheet = wb.Sheets["심방내역"];
    const visitRows = visitSheet ? XLSX.utils.sheet_to_json<Record<string, unknown>>(visitSheet) : [];
    const visitByMember = new Map<string, PastoralVisit[]>();
    visitRows.forEach((row) => {
      const mapped = mapRow(row, VISIT_EXCEL_HEADERS);
      const memberId = mapped.memberId;
      if (!memberId) return;
      if (!visitByMember.has(memberId)) visitByMember.set(memberId, []);
      visitByMember.get(memberId)!.push({
        visitDate: mapped.visitDate || "",
        bibleHymn: mapped.bibleHymn || "",
        visitContent: mapped.visitContent || "",
      });
    });

    // 교인 데이터 처리
    for (let i = 0; i < memberRows.length; i++) {
      const mapped = mapRow(memberRows[i], MEMBER_EXCEL_HEADERS);
      if (!mapped.name) {
        errors.push(`행 ${i + 2}: 이름 누락`);
        continue;
      }

      const memberId = mapped.id || "";

      if (memberId && existingMap.has(memberId)) {
        // 기존 교인 업데이트
        const ex = existingMap.get(memberId)!;
        Object.assign(ex, {
          ...mapped,
          id: memberId,
          familyMembers: familyByMember.get(memberId) || ex.familyMembers || [],
          pastoralVisits: visitByMember.get(memberId) || ex.pastoralVisits || [],
          updatedAt: new Date().toISOString(),
        });
        updated++;
      } else {
        // 새 교인 생성
        const newMember = createEmptyMember({
          ...mapped,
          familyMembers: familyByMember.get(memberId) || [],
          pastoralVisits: visitByMember.get(memberId) || [],
        });
        existing.push(newMember);
        imported++;
      }
    }

    await writeMembers(existing);

    return NextResponse.json({ success: true, imported, updated, errors });
  } catch (e) {
    console.error("[Church Members Import]", e);
    return NextResponse.json({ error: "파일 처리 오류" }, { status: 500 });
  }
}
