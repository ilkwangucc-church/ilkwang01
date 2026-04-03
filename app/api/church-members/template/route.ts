import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

/** GET — 빈 교적부 엑셀 양식 다운로드 */
export async function GET() {
  const wb = XLSX.utils.book_new();

  // 시트 1: 교인정보
  const memberHeaders = [
    "교적번호", "이름", "생년월일", "성별", "가족관계", "신앙세대주", "사진URL",
    "교구", "배우자", "HP", "TEL", "주소", "교인구분", "현재상태", "등록일",
    "인도자", "결혼관계", "출석률", "봉사부서", "직장명", "상세직분", "임직일",
    "선교회", "세례유형", "집례일", "집례교회", "비고",
  ];
  const ws1 = XLSX.utils.aoa_to_sheet([memberHeaders]);
  ws1["!cols"] = memberHeaders.map(() => ({ wch: 14 }));
  XLSX.utils.book_append_sheet(wb, ws1, "교인정보");

  // 시트 2: 가족사항
  const familyHeaders = ["교적번호", "교인이름", "관계", "이름", "생년월일", "교인구분", "직분", "소속부서", "신급", "휴대폰", "비고"];
  const ws2 = XLSX.utils.aoa_to_sheet([familyHeaders]);
  ws2["!cols"] = familyHeaders.map(() => ({ wch: 14 }));
  XLSX.utils.book_append_sheet(wb, ws2, "가족사항");

  // 시트 3: 심방내역
  const visitHeaders = ["교적번호", "교인이름", "심방일", "성경/찬송", "심방내용"];
  const ws3 = XLSX.utils.aoa_to_sheet([visitHeaders]);
  ws3["!cols"] = visitHeaders.map((_, i) => ({ wch: i === 4 ? 40 : 14 }));
  XLSX.utils.book_append_sheet(wb, ws3, "심방내역");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="교적부_양식.xlsx"',
    },
  });
}
