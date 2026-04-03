import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/adminAuth";
import { readMembers } from "@/lib/church-members";
import * as XLSX from "xlsx";

/** GET — 교적부 전체 데이터 엑셀 내보내기 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  const session = verifySessionToken(token);
  if (!session || session.role < 5) return NextResponse.json({ error: "권한 부족" }, { status: 403 });

  const members = await readMembers();
  const wb = XLSX.utils.book_new();

  // 시트 1: 교인정보
  const memberRows = members.map((m) => ({
    교적번호: m.id, 이름: m.name, 생년월일: m.birthDate, 성별: m.gender,
    가족관계: m.familyRelation, 신앙세대주: m.faithHead, 사진URL: m.photo,
    가족사진1: (m.familyPhotos || [])[0] || "", 가족사진2: (m.familyPhotos || [])[1] || "",
    교구: m.parish, 배우자: m.spouse, HP: m.phone, TEL: m.tel, 주소: m.address,
    교인구분: m.memberType, 현재상태: m.currentStatus, 등록일: m.registrationDate,
    인도자: m.introducer, 결혼관계: m.marriageStatus, 출석률: m.attendanceRate,
    봉사부서: m.serviceDept, 직장명: m.workplace, 상세직분: m.detailPosition,
    임직일: m.ordinationDate, 선교회: m.missionGroup, 세례유형: m.baptismType,
    집례일: m.baptismDate, 집례교회: m.baptismChurch, 비고: m.notes,
  }));
  const ws1 = XLSX.utils.json_to_sheet(memberRows);
  ws1["!cols"] = Object.keys(memberRows[0] || {}).map(() => ({ wch: 14 }));
  XLSX.utils.book_append_sheet(wb, ws1, "교인정보");

  // 시트 2: 가족사항
  const familyRows: Record<string, string>[] = [];
  members.forEach((m) => {
    (m.familyMembers || []).forEach((f) => {
      familyRows.push({
        교적번호: m.id, 교인이름: m.name, 관계: f.relation, 이름: f.name,
        생년월일: f.birthDate, 교인구분: f.memberCategory, 직분: f.position,
        소속부서: f.department, 신급: f.faithLevel, 휴대폰: f.phone, 사진URL: f.photo || "", 비고: f.notes,
      });
    });
  });
  const ws2 = XLSX.utils.json_to_sheet(familyRows.length > 0 ? familyRows : [{}], {
    header: ["교적번호", "교인이름", "관계", "이름", "생년월일", "교인구분", "직분", "소속부서", "신급", "휴대폰", "사진URL", "비고"],
  });
  XLSX.utils.book_append_sheet(wb, ws2, "가족사항");

  // 시트 3: 심방내역
  const visitRows: Record<string, string>[] = [];
  members.forEach((m) => {
    (m.pastoralVisits || []).forEach((v) => {
      visitRows.push({
        교적번호: m.id, 교인이름: m.name, 카테고리: v.category || "기타",
        심방일: v.visitDate, "성경/찬송": v.bibleHymn, 심방내용: v.visitContent,
      });
    });
  });
  const ws3 = XLSX.utils.json_to_sheet(visitRows.length > 0 ? visitRows : [{}], {
    header: ["교적번호", "교인이름", "카테고리", "심방일", "성경/찬송", "심방내용"],
  });
  XLSX.utils.book_append_sheet(wb, ws3, "심방내역");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const today = new Date().toISOString().split("T")[0];

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="교적부_${today}.xlsx"`,
    },
  });
}
