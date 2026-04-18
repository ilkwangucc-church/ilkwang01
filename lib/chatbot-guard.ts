export const CHURCH_OFFICE_PHONE = "02-927-0691";
export const CHURCH_OFFICE_EMAIL = "ilkwang@ilkwang.or.kr";

const SUPPORTED_GUIDE_QUERY_REGEX =
  /예배|시간|주소|위치|오시는 길|전화|연락|문의|이메일|담임목사|목사|교회소개|비전|역사|유초등부|유치부|아동부|중고등부|청년부|다음세대|주보|공지|행사|설교|헌금|계좌|등록|처음방문|처음 방문|새가족|홈페이지|사이트|메뉴|페이지|길음역|주차|유튜브|온라인 예배|블로그|자료실|게시판|갤러리|성경|창세기|출애굽기|복음서|예수님|구약|신약|worship|sermon|contact|location|history|vision|offering|bible/i;

const DETAILED_INQUIRY_REGEX =
  /몇\s*명|정원|마감|언제까지|신청|접수|대기|가능한가|가능해요|가능한지|확인|개별|개인|상담|심방|세례|학습|입교|결혼|장례|내역|영수증|증명서|환불|예약|대관|대여|식당|식사|준비물|회비|비용|금액|등록비|출석|참석|담당자|부서장|연결|민원|불만|항의|차량등록|주차등록|자리|좌석|몇 번 출구|갈아타|최단|빠른 길|today|current|specific|detail/i;

export function isSupportedGuideQuery(query: string): boolean {
  return SUPPORTED_GUIDE_QUERY_REGEX.test(query);
}

export function isDetailedInquiry(query: string): boolean {
  return DETAILED_INQUIRY_REGEX.test(query);
}

export function buildOfficeInquiryReply(): string {
  return `세부 확인이 필요한 내용이라 챗봇이 임의로 안내드리지 않겠습니다. 교회 사무실 ${CHURCH_OFFICE_PHONE}로 문의해 주세요. 원하시면 문의하실 내용을 짧게 정리해 드릴게요.`;
}

export function buildScopeGuidanceReply(): string {
  return `제가 바로 정확히 안내드릴 수 있는 공개 정보는 예배 시간, 오시는 길, 담임목사 소개, 다음세대, 주보, 설교, 온라인 헌금, 연락처, 성경 일반 질문입니다. 궁금한 항목을 그 기준으로 말씀해 주세요. 세부 확인이 필요한 내용은 교회 사무실 ${CHURCH_OFFICE_PHONE}로 문의해 주세요.`;
}
