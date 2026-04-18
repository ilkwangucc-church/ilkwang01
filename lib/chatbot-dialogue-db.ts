export interface DialogueExample {
  id: string;
  category: string;
  user: string;
  answer: string;
  keywords: string[];
}

interface DialogueSeed {
  category: string;
  keywords: string[];
  items: Array<{
    user: string;
    answer: string;
  }>;
}

function section(title: string, lines: string[]): string {
  return [title, ...lines].filter(Boolean).join("\n");
}

function blocks(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join("\n\n");
}

function sharedSeed(
  category: string,
  keywords: string[],
  users: string[],
  answer: string,
): DialogueSeed {
  return {
    category,
    keywords,
    items: users.map((user) => ({ user, answer })),
  };
}

export function formatLightGreetingReply(): string {
  return "안녕하세요. 편하게 말씀 주세요. 필요한 안내만 바로 도와드리겠습니다.";
}

export function formatWorshipReply(): string {
  return blocks(
    section("예배 안내", [
      "주일예배",
      "1부 오전 9:30",
      "2부 오전 11:00",
      "3부 오후 1:30",
    ]),
    section("기도회와 성경공부", [
      "새벽기도회 매일 오전 5:00",
      "수요오전기도회 수요일 오전 10:30",
      "수요성경공부 수요일 오후 8:00",
    ]),
    "처음 방문이시면 어떤 예배가 편하실지도 이어서 안내해 드릴게요.",
  );
}

export function formatChurchIntroReply(): string {
  return blocks(
    section("교회소개", [
      "일광교회는 1971년에 설립된 대한예수교장로회(합동) 교회입니다.",
      "슬로건은 \"행복과 영원으로 초대하는 교회\"입니다.",
    ]),
    section("기본 안내", [
      "담임목사 신점일 목사",
      "주소 서울특별시 성북구 동소문로 212-68",
      "전화 02-927-0691",
    ]),
    "원하시면 예배, 오시는 길, 다음세대 안내까지 이어서 정리해 드릴게요.",
  );
}

export function formatPastorReply(): string {
  return blocks(
    section("담임목사 안내", [
      "신점일 목사님이 일광교회를 섬기고 계십니다.",
      "총신대학교 신학과와 총신대학교 신학대학원을 졸업하셨습니다.",
      "현재 성북노회 임원으로도 섬기고 계십니다.",
    ]),
    "담임목사 인사말이나 교회 비전도 함께 안내해 드릴 수 있습니다.",
  );
}

export function formatLocationReply(): string {
  return blocks(
    section("오시는 길", [
      "주소 서울특별시 성북구 동소문로 212-68",
      "지하철 4호선 길음역 하차 후 도보 약 10분",
      "버스 간선 152, 162, 171 / 지선 1111, 2112, 7212",
      "주차 교회 앞 주차 가능",
    ]),
    "예배 시작 전에 몇 분쯤 도착하시면 좋은지도 같이 안내해 드릴게요.",
  );
}

export function formatNextGenerationReply(): string {
  return blocks(
    section("다음세대 안내", [
      "유초등부 주일 오전 11:00 / 4층 유초등부실",
      "중고등부 주일 오전 9:00 / 3층 소예배실",
      "청년부 주일 오후 1:30 / 3층 소예배실",
    ]),
    section("바로 찾는 안내", [
      "유초등부 /youth/sunday",
      "중고등부 /youth/teens",
      "청년부 /youth/young-adults",
    ]),
    "자녀 연령대나 찾으시는 부서를 말씀해 주시면 더 정확히 안내해 드릴게요.",
  );
}

export function formatNewsReply(): string {
  return blocks(
    section("나눔과 소식 안내", [
      "교회소식 /news",
      "주보 /news/bulletin",
      "행사안내 /news/events",
      "갤러리 /news/gallery",
    ]),
    "공지, 광고사항, 주보, 행사처럼 최근 소식이 필요하시면 그 기준으로 바로 정리해 드리겠습니다.",
  );
}

export function formatOfferingReply(): string {
  return blocks(
    section("온라인 헌금 안내", [
      "국민은행 000-00-0000-000 일광교회",
      "신한은행 000-000-000000 일광교회",
      "우리은행 000-000000-00-000 일광교회",
    ]),
    "이체 메모에는 성함과 헌금 종류를 함께 적어 주시면 됩니다. 필요하시면 헌금 종류도 같이 안내해 드릴게요.",
  );
}

export function formatSermonReply(): string {
  return blocks(
    section("설교 안내", [
      "예배와 말씀 메뉴에서 설교를 보실 수 있습니다.",
      "설교 목록 경로는 /worship/sermons 입니다.",
      "최근 설교와 유튜브 영상도 함께 연결됩니다.",
    ]),
    "원하시면 최근 설교 제목이나 본문 기준으로도 이어서 안내해 드릴게요.",
  );
}

const DIALOGUE_SEEDS: DialogueSeed[] = [
  {
    category: "greeting_general",
    keywords: ["안녕", "인사", "hello", "hi"],
    items: [
      { user: "안녕하세요", answer: "안녕하세요. 편하게 물어보세요. 교회 방문 안내가 필요하시면 바로 도와드릴게요." },
      { user: "안녕", answer: "안녕하세요. 무엇을 도와드릴까요?" },
      { user: "반가워요", answer: "반갑습니다. 궁금한 것만 말씀해 주시면 바로 안내해 드릴게요." },
      { user: "hello", answer: "Hello. I can help with worship, directions, and first-visit information." },
      { user: "hi", answer: "Hi. Feel free to ask anything about visiting Ilkwang Church." },
    ],
  },
  sharedSeed(
    "greeting_morning",
    ["아침", "굿모닝", "morning"],
    ["좋은 아침이에요", "굿모닝", "아침 인사드려요", "오늘도 평안한 아침이에요", "good morning"],
    "좋은 아침입니다. 오늘 방문이나 예배를 준비 중이시면 필요한 안내만 바로 정리해 드릴게요.",
  ),
  sharedSeed(
    "greeting_evening",
    ["저녁", "밤", "evening", "tonight"],
    ["좋은 저녁이에요", "늦은 밤 인사드려요", "오늘 저녁도 평안하세요", "밤 인사드려요", "good evening"],
    "좋은 저녁입니다. 늦은 시간에도 편하게 물어보세요. 예배 시간이나 위치 안내는 바로 도와드릴 수 있습니다.",
  ),
  sharedSeed(
    "who_are_you",
    ["누구", "정체", "챗봇", "ai"],
    ["너 누구야", "당신은 누구예요", "정체가 뭐야", "챗봇이야?", "AI 맞아요?"],
    "저는 일광교회 안내를 돕는 챗봇입니다. 방문 안내, 예배 시간, 위치, 다음세대, 소식 같은 내용을 정리해 드리고 있습니다.",
  ),
  sharedSeed(
    "what_can_you_do",
    ["뭐", "무엇", "도움", "할수있어"],
    ["뭘 할 수 있어", "무엇을 도와줘", "어떤 안내가 가능해", "어디까지 알려줄 수 있어", "무슨 질문을 하면 돼"],
    "예배 시간, 오시는 길, 담임목사 소개, 다음세대, 주보와 공지, 설교, 온라인 헌금, 처음 방문 안내까지 도와드릴 수 있습니다.",
  ),
  sharedSeed(
    "thanks",
    ["고마워", "감사", "thanks"],
    ["고마워", "감사합니다", "덕분에 이해됐어요", "thanks", "thank you"],
    "천만에요. 더 필요한 것이 있으면 바로 이어서 도와드릴게요.",
  ),
  sharedSeed(
    "how_are_you",
    ["잘지내", "괜찮아", "how are you"],
    ["잘 지내?", "괜찮아?", "오늘 어때", "how are you", "기분 어때"],
    "잘 지내고 있습니다. 저는 안내를 도와드리는 역할이라, 지금 궁금하신 내용을 바로 듣고 싶습니다.",
  ),
  sharedSeed(
    "hard_day",
    ["힘들어", "지쳐", "우울", "속상"],
    ["오늘 너무 힘들어요", "지쳤어요", "마음이 무거워요", "속상해요", "위로가 필요해요"],
    "많이 지치셨겠네요. 혼자 버티지 마시고, 원하시면 예배 안내나 교회 사무실 연락처를 먼저 드리겠습니다. 필요한 방향부터 같이 정리해 볼게요.",
  ),
  sharedSeed(
    "prayer_request",
    ["기도", "기도해주세요", "pray"],
    ["기도 부탁드려요", "기도해 주세요", "기도 제목이 있어요", "pray for me", "중보기도 받고 싶어요"],
    "기도 제목이 있으시면 편한 범위에서 말씀해 주세요. 자세한 상담이나 직접 연결이 필요하시면 교회 사무실 02-927-0691로 안내해 드릴 수 있습니다.",
  ),
  sharedSeed(
    "not_sure_what_to_ask",
    ["무엇", "뭐부터", "모르겠", "처음"],
    ["뭐부터 물어봐야 할지 모르겠어요", "처음이라 뭘 봐야 할지 모르겠어요", "어디서 시작하면 될까요", "처음 방문이면 뭐가 중요해요", "무슨 안내를 먼저 받으면 좋을까요"],
    "처음 방문 기준이면 보통 예배 시간, 오시는 길, 주차, 다음세대, 새가족 등록 순서로 가장 많이 물어보십니다. 필요한 항목 하나만 말씀해 주시면 바로 이어서 설명드릴게요.",
  ),
  sharedSeed(
    "first_visit",
    ["처음방문", "새가족", "방문"],
    ["처음 방문하려고 해요", "새가족인데 어떻게 가면 돼요", "처음 가보려는데 안내해 주세요", "교회 처음 가요", "방문 준비 중이에요"],
    "처음 방문이시면 주일 2부 오전 11:00 예배를 가장 기본으로 많이 안내해 드립니다. 원하시면 예배 시간, 주차, 오시는 길 순서로 한 번에 정리해 드릴게요.",
  ),
  sharedSeed(
    "worship_times",
    ["예배", "예배시간", "주일예배", "시간"],
    ["예배 시간 알려줘", "예배 몇 시예요", "주일예배 시간 알려주세요", "예배안내해 주세요", "worship time"],
    formatWorshipReply(),
  ),
  sharedSeed(
    "which_service",
    ["몇부", "어느예배", "처음방문", "추천"],
    ["처음 가면 몇 부 예배가 좋아요", "어느 예배에 가면 될까요", "첫 방문이면 몇 시가 좋을까요", "주일예배 중 추천 시간 있나요", "가장 기본 예배가 언제예요"],
    "처음 방문이시면 주일 2부 오전 11:00 예배를 가장 기본 예배로 안내해 드리기 좋습니다. 조금 이른 시간을 원하시면 1부 오전 9:30, 오후 시간이 편하시면 3부 오후 1:30도 가능합니다.",
  ),
  sharedSeed(
    "weekday_worship",
    ["주중", "평일", "수요", "새벽"],
    ["주중 예배도 있나요", "평일 모임 알려주세요", "주일 말고도 예배가 있나요", "평일예배 시간 궁금해요", "weekday worship"],
    "주중에는 새벽기도회가 매일 오전 5:00, 수요오전기도회가 수요일 오전 10:30, 수요성경공부가 수요일 오후 8:00에 있습니다.",
  ),
  sharedSeed(
    "dawn_prayer",
    ["새벽기도", "새벽예배", "새벽"],
    ["새벽기도 몇 시예요", "새벽기도회 있나요", "새벽예배 시간 알려줘", "매일 새벽기도 하나요", "새벽기도 안내해 주세요"],
    "새벽기도회는 매일 오전 5:00에 본당에서 드립니다. 원하시면 오시는 길과 주차도 함께 안내해 드릴게요.",
  ),
  sharedSeed(
    "wednesday_study",
    ["수요", "성경공부", "수요일"],
    ["수요성경공부 몇 시예요", "수요일 모임 있나요", "수요오전기도회 시간 알려주세요", "수요예배 정보 주세요", "수요일에 갈 수 있는 예배가 있나요"],
    "수요일에는 수요오전기도회가 오전 10:30, 수요성경공부가 오후 8:00에 있습니다. 어느 시간이 편하신지도 같이 봐드릴 수 있습니다.",
  ),
  sharedSeed(
    "pastor_intro",
    ["목사", "담임목사", "신점일", "pastor"],
    ["담임목사님 소개해 주세요", "목사님 성함이 뭐예요", "신점일 목사님이 누구예요", "담임목사 안내해 주세요", "pastor introduction"],
    formatPastorReply(),
  ),
  sharedSeed(
    "church_intro",
    ["교회소개", "소개", "일광교회", "어떤교회"],
    ["일광교회 소개해 주세요", "어떤 교회예요", "교회 기본 정보 알려줘", "일광교회가 어떤 곳인지 궁금해요", "church introduction"],
    formatChurchIntroReply(),
  ),
  sharedSeed(
    "history_vision",
    ["역사", "비전", "사명"],
    ["교회 역사가 궁금해요", "교회 비전이 뭐예요", "교회 사명이 궁금합니다", "언제 세워졌나요", "일광교회 역사 알려줘"],
    "일광교회는 1971년에 설립되었고, 하나님 중심·성경 중심·교회 중심의 개혁주의 신앙을 추구합니다. 더 자세한 내용은 교회 역사와 비전 기준으로 이어서 정리해 드릴 수 있습니다.",
  ),
  sharedSeed(
    "directions_subway",
    ["오시는길", "위치", "길음역", "주소"],
    ["오시는 길 알려주세요", "교회 주소가 어디예요", "길음역에서 어떻게 가요", "위치 안내해 주세요", "location please"],
    formatLocationReply(),
  ),
  sharedSeed(
    "parking",
    ["주차", "차", "parking"],
    ["주차 되나요", "차 가지고 가도 될까요", "주차장 있나요", "parking available", "예배 때 주차 가능한가요"],
    "네, 교회 앞 주차가 가능합니다. 다만 주일 예배 시간에는 차량이 몰릴 수 있어서 조금 여유 있게 오시면 좋습니다.",
  ),
  sharedSeed(
    "clothing",
    ["복장", "옷", "드레스코드"],
    ["어떻게 입고 가면 되나요", "복장 제한 있나요", "교회 갈 때 옷차림이 고민돼요", "편하게 입어도 되나요", "드레스코드가 있나요"],
    "편안하고 단정한 복장이면 충분합니다. 처음 방문이시면 부담 갖지 않으셔도 됩니다. 더 궁금하시면 예배 분위기도 함께 안내해 드릴게요.",
  ),
  sharedSeed(
    "bring_children",
    ["아이", "자녀", "가족", "어린이"],
    ["아이와 함께 가도 되나요", "가족이 같이 가도 괜찮나요", "어린 자녀와 방문하려고 해요", "아기 데리고 가도 되나요", "아이 예배도 있나요"],
    "네, 가족과 함께 방문하셔도 됩니다. 자녀 연령에 맞춰 유초등부, 중고등부, 청년부 안내까지 바로 이어서 도와드릴 수 있습니다.",
  ),
  sharedSeed(
    "next_generation_overview",
    ["다음세대", "교육", "부서", "youth"],
    ["다음세대 안내해 주세요", "교육부서가 어떻게 되나요", "청소년 사역이 있나요", "youth ministry", "연령별 예배가 궁금해요"],
    formatNextGenerationReply(),
  ),
  sharedSeed(
    "kids_ministry",
    ["유초등부", "유치부", "아동부", "초등부"],
    ["유초등부 예배 시간 알려주세요", "유치부는 몇 시예요", "아동부 안내해 주세요", "초등학생 예배가 있나요", "주일학교 정보 주세요"],
    "유초등부는 주일 오전 11:00에 4층 유초등부실에서 운영됩니다.",
  ),
  sharedSeed(
    "teens_ministry",
    ["중고등부", "청소년", "teen"],
    ["중고등부 예배 시간 알려주세요", "청소년 예배가 있나요", "teen ministry", "중학생도 갈 수 있나요", "고등부 안내해 주세요"],
    "중고등부는 주일 오전 9:00에 3층 소예배실에서 예배드립니다. 금요 기도 모임과 소그룹 성경공부도 함께 운영됩니다.",
  ),
  sharedSeed(
    "young_adults",
    ["청년부", "청년", "young adults"],
    ["청년부 안내해 주세요", "청년 예배 몇 시예요", "young adults ministry", "청년 모임이 있나요", "대학생도 갈 수 있나요"],
    "청년부는 주일 오후 1:30에 3층 소예배실에서 예배드리고, 예배 후 청년 모임으로 이어집니다. 금요 성경공부와 소그룹 모임도 함께 진행됩니다.",
  ),
  sharedSeed(
    "online_worship",
    ["온라인", "유튜브", "생중계", "online"],
    ["온라인으로 예배 볼 수 있나요", "유튜브 예배 있나요", "생중계 되나요", "online worship", "집에서 예배 참여 가능한가요"],
    "네, 유튜브를 통해 온라인 예배 참여가 가능합니다. 원하시면 최근 설교나 예배 영상 경로도 이어서 안내해 드릴게요.",
  ),
  sharedSeed(
    "sermons",
    ["설교", "말씀", "유튜브", "sermon"],
    ["설교는 어디서 봐요", "최근 설교 알려주세요", "말씀 영상 보고 싶어요", "sermon list", "설교 메뉴가 어디예요"],
    formatSermonReply(),
  ),
  sharedSeed(
    "bulletins_notices",
    ["주보", "공지", "광고", "소식"],
    ["주보 어디서 봐요", "공지사항 알려주세요", "광고사항은 어디서 확인해요", "최근 소식 알려주세요", "bulletin please"],
    formatNewsReply(),
  ),
  sharedSeed(
    "events",
    ["행사", "이벤트", "event"],
    ["행사안내 어디서 봐요", "교회 이벤트 알려주세요", "최근 행사가 있나요", "event info", "행사 소식 궁금해요"],
    "행사안내는 나눔과 소식 메뉴의 /news/events 에서 확인하실 수 있습니다. 최근 행사 기준으로도 정리해 드릴 수 있습니다.",
  ),
  sharedSeed(
    "offering",
    ["헌금", "계좌", "온라인헌금", "offering"],
    ["온라인 헌금 안내해 주세요", "헌금 계좌 알려주세요", "offering info", "계좌이체로 헌금할 수 있나요", "헌금 종류도 알려주세요"],
    formatOfferingReply(),
  ),
  sharedSeed(
    "office_contact",
    ["연락처", "전화", "문의", "사무실"],
    ["교회 전화번호 알려주세요", "문의는 어디로 하면 되나요", "사무실 연락처 주세요", "이메일 주소가 뭐예요", "contact info"],
    "교회 연락처는 02-927-0691, 이메일은 ilkwang@ilkwang.or.kr 입니다. 더 자세한 문의가 필요하시면 이 번호로 연결하시는 것이 가장 정확합니다.",
  ),
  sharedSeed(
    "new_family_registration",
    ["새가족", "등록", "회원가입"],
    ["새가족 등록은 어떻게 해요", "처음 가면 등록해야 하나요", "교회 등록 절차가 궁금해요", "회원가입은 어디서 하나요", "방문 후 등록하려면 어떻게 하나요"],
    "새가족 등록은 주일 예배 후 새가족실에서 안내받으시거나, 홈페이지 회원가입 후 교회 사무실로 연락 주시면 도와드릴 수 있습니다.",
  ),
  sharedSeed(
    "volunteer_serve",
    ["봉사", "섬김", "serve", "사역참여"],
    ["봉사하고 싶어요", "섬길 수 있는 방법이 있나요", "사역 참여는 어떻게 해요", "serve at church", "처음 와도 봉사할 수 있나요"],
    "사역 참여를 원하시면 먼저 예배와 새가족 등록 과정을 거치신 뒤 교회 사무실이나 담당 부서를 통해 안내받으시는 것이 가장 좋습니다.",
  ),
  sharedSeed(
    "website_help",
    ["홈페이지", "메뉴", "사이트도움"],
    ["홈페이지 메뉴를 한 번에 알려줘", "사이트 구성이 궁금해요", "어디에 뭐가 있는지 모르겠어요", "홈페이지 둘러보는 법 알려줘", "사이트 안내해 주세요"],
    "공개 메뉴는 교회소개, 예배와 말씀, 다음세대, 나눔과 소식, 온라인 헌금, 문의하기 순서입니다. 찾으시는 목적을 말씀해 주시면 필요한 메뉴만 바로 짚어 드릴게요.",
  ),
  sharedSeed(
    "family_visit",
    ["가족", "부모님", "함께방문"],
    ["가족이랑 같이 가려고 해요", "부모님 모시고 가도 될까요", "온 가족이 함께 예배드릴 수 있나요", "가족 방문 안내해 주세요", "아이 포함해서 같이 가요"],
    "네, 가족과 함께 방문하셔도 좋습니다. 온 가족이 함께 드리는 주일 1부 예배도 있고, 자녀 연령대에 맞는 다음세대 예배도 따로 안내해 드릴 수 있습니다.",
  ),
  sharedSeed(
    "human_help",
    ["사람연결", "직접문의", "담당자", "목사님연결"],
    ["사람이랑 직접 이야기하고 싶어요", "담당자 연결해 주세요", "목사님이나 사무실에 바로 문의하고 싶어요", "직접 상담 가능한가요", "사람 안내가 필요해요"],
    "직접 문의가 필요하시면 교회 사무실 02-927-0691로 연락하시는 것이 가장 정확합니다. 원하시면 어떤 내용으로 문의하실지 정리도 도와드릴게요.",
  ),
  sharedSeed(
    "schedule_for_sunday",
    ["이번주일", "주일일정", "언제오면"],
    ["이번 주일 몇 시에 가면 돼요", "주일 일정만 간단히 알려줘", "이번 주 예배 시간 다시 알려줘", "일요일에 가려고 해요", "주일 방문 시간 추천해 주세요"],
    "주일에는 1부 오전 9:30, 2부 오전 11:00, 3부 오후 1:30 예배가 있습니다. 처음 방문이시면 2부 오전 11:00 예배를 가장 기본으로 안내해 드리기 좋습니다.",
  ),
  sharedSeed(
    "simple_smalltalk",
    ["대화", "수다", "편하게"],
    ["그냥 편하게 물어봐도 돼요?", "좀 편하게 얘기해도 돼?", "딱딱하지 않게 말해 줘", "너무 길지 않게 알려줘", "짧게 안내해 줘"],
    "네, 편하게 말씀하셔도 됩니다. 필요한 내용만 짧고 정확하게 안내해 드리겠습니다.",
  ),
];

export const CHATBOT_DIALOGUE_DB: DialogueExample[] = DIALOGUE_SEEDS.flatMap((seed) =>
  seed.items.map((item, index) => ({
    id: `${seed.category}-${index + 1}`,
    category: seed.category,
    user: item.user,
    answer: item.answer,
    keywords: seed.keywords,
  })),
);

if (CHATBOT_DIALOGUE_DB.length !== 200) {
  throw new Error(`CHATBOT_DIALOGUE_DB must contain 200 examples, received ${CHATBOT_DIALOGUE_DB.length}`);
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compact(text: string): string {
  return normalize(text).replace(/\s+/g, "");
}

function tokenize(text: string): string[] {
  return Array.from(
    new Set(
      normalize(text)
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token.length >= 2),
    ),
  );
}

function isFactualChurchQuery(query: string): boolean {
  return /예배|시간|주소|위치|오시는 길|전화|문의|연락|담임목사|목사|교회소개|비전|역사|유초등부|유치부|아동부|중고등부|청년부|다음세대|주보|공지|행사|설교|헌금|계좌|등록|성경|창세기|출애굽기|복음서|예수님|구약|신약|기도회|수요|새벽/i.test(query);
}

export function searchDialogueExamples(query: string, limit = 5): DialogueExample[] {
  if (isFactualChurchQuery(query)) return [];

  const normalizedQuery = normalize(query);
  const compactQuery = compact(query);
  const tokens = tokenize(query);

  const scored = CHATBOT_DIALOGUE_DB
    .map((example) => {
      const normalizedUser = normalize(example.user);
      const compactUser = compact(example.user);
      const keywordText = normalize(example.keywords.join(" "));
      let score = 0;

      if (normalizedQuery === normalizedUser) score += 140;
      if (compactQuery && compactQuery === compactUser) score += 140;
      if (normalizedQuery && normalizedUser.includes(normalizedQuery)) score += 55;
      if (normalizedQuery && normalizedQuery.includes(normalizedUser)) score += 45;

      for (const token of tokens) {
        if (normalizedUser.includes(token)) score += token.length >= 4 ? 16 : 10;
        if (keywordText.includes(token)) score += token.length >= 4 ? 14 : 8;
      }

      return { example, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.example);
}

export function findDialogueReply(query: string): string | null {
  if (isFactualChurchQuery(query)) return null;

  const matches = searchDialogueExamples(query, 1);
  const best = matches[0];
  if (!best) return null;

  const normalizedQuery = normalize(query);
  const normalizedUser = normalize(best.user);
  if (normalizedQuery === normalizedUser || compact(query) === compact(best.user)) {
    return best.answer;
  }

  const fuzzyMatches = searchDialogueExamples(query, 3);
  if (fuzzyMatches.length === 0) return null;

  const overlap = tokenize(query).filter((token) => normalize(best.user).includes(token) || best.keywords.some((keyword) => normalize(keyword).includes(token)));
  return overlap.length >= 2 ? best.answer : null;
}

export function serializeDialogueExamples(examples: DialogueExample[]): string {
  return examples
    .map((example) => `사용자: ${example.user}\n응답 예시: ${example.answer}`)
    .join("\n\n");
}
