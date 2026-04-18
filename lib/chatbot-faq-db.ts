export type FaqScope = "church" | "bible";

export interface FaqEntry {
  id: string;
  scope: FaqScope;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

interface FaqSeed {
  category: string;
  question: string;
  answer: string;
  keywords?: string[];
}

function lines(...values: string[]): string {
  return values.join("\n");
}

function withIds(scope: FaqScope, seeds: FaqSeed[]): FaqEntry[] {
  return seeds.map((seed, index) => ({
    id: `${scope}-${String(index + 1).padStart(3, "0")}`,
    scope,
    category: seed.category,
    question: seed.question,
    answer: seed.answer,
    keywords: seed.keywords ?? [],
  }));
}

const CHURCH_FAQ_SEEDS: FaqSeed[] = [
  { category: "church_intro", question: "일광교회는 어떤 교회인가요?", answer: "일광교회는 1971년에 설립된 대한예수교장로회(합동) 교회이며, 슬로건은 \"행복과 영원으로 초대하는 교회\"입니다.", keywords: ["일광교회", "교회 소개", "어떤 교회"] },
  { category: "church_intro", question: "일광교회는 어느 교단 소속인가요?", answer: "일광교회는 대한예수교장로회 합동 측에 속해 있습니다.", keywords: ["교단", "합동", "대한예수교장로회"] },
  { category: "church_intro", question: "일광교회는 언제 설립되었나요?", answer: "일광교회는 1971년에 서울 성북구 돈암동 지역에서 시작되었습니다.", keywords: ["설립", "창립", "1971"] },
  { category: "church_intro", question: "일광교회 슬로건은 무엇인가요?", answer: "일광교회의 슬로건은 \"행복과 영원으로 초대하는 교회\"입니다.", keywords: ["슬로건", "행복과 영원"] },
  { category: "church_intro", question: "담임목사님 성함이 어떻게 되나요?", answer: "일광교회 담임목사님은 신점일 목사님입니다.", keywords: ["담임목사", "신점일"] },
  { category: "church_intro", question: "신점일 목사님 학력은 어떻게 되나요?", answer: "신점일 목사님은 총신대학교 신학과와 총신대학교 신학대학원을 졸업하셨고, 합동신학대학원대학교 목회학 박사 과정을 수료하셨습니다.", keywords: ["신점일", "학력", "총신대학교"] },
  { category: "church_intro", question: "신점일 목사님은 지금 어떤 역할을 맡고 계신가요?", answer: "신점일 목사님은 일광교회 담임목사로 섬기고 계시며, 성북노회 임원으로도 섬기고 계십니다.", keywords: ["신점일", "담임목사", "성북노회"] },
  { category: "church_intro", question: "일광교회 사명은 무엇인가요?", answer: "일광교회는 살아계신 하나님을 예배하고, 예수 그리스도의 제자로 훈련되어, 성령의 능력으로 사랑과 전도와 섬김으로 하나님의 나라를 확장하는 것을 사명으로 삼고 있습니다.", keywords: ["사명", "비전", "목표"] },
  { category: "church_intro", question: "일광교회가 강조하는 공동체는 무엇인가요?", answer: "일광교회는 예배공동체, 훈련공동체, 치유공동체, 비전공동체, 선교공동체의 다섯 공동체를 강조합니다.", keywords: ["5대 공동체", "공동체", "예배공동체"] },
  { category: "church_intro", question: "일광교회는 어떤 신앙 고백을 중요하게 여기나요?", answer: "일광교회는 오직 성경, 오직 믿음, 오직 은혜, 오직 그리스도, 오직 하나님께 영광이라는 개혁주의 5대 강령을 소중히 여깁니다.", keywords: ["개혁주의", "5대 강령", "오직 성경"] },
  { category: "contact", question: "일광교회 주소는 어디인가요?", answer: "일광교회 주소는 서울특별시 성북구 동소문로 212-68입니다.", keywords: ["주소", "위치", "동소문로"] },
  { category: "contact", question: "일광교회 전화번호는 무엇인가요?", answer: "일광교회 대표 전화번호는 02-927-0691입니다.", keywords: ["전화", "연락처", "02-927-0691"] },
  { category: "contact", question: "일광교회 이메일은 무엇인가요?", answer: "일광교회 대표 이메일은 ilkwang@ilkwang.or.kr 입니다.", keywords: ["이메일", "메일", "ilkwang@ilkwang.or.kr"] },
  { category: "contact", question: "지하철로 가려면 어떻게 가면 되나요?", answer: "지하철로 오실 경우 4호선 길음역에서 하차하신 뒤 도보 약 10분 정도 걸어오시면 됩니다.", keywords: ["지하철", "길음역", "도보"] },
  { category: "contact", question: "버스로 가려면 어떤 노선을 이용하면 되나요?", answer: "버스로 오실 경우 간선 152, 162, 171번과 지선 1111, 2112, 7212번을 이용하실 수 있습니다.", keywords: ["버스", "152", "162", "171", "1111", "2112", "7212"] },
  { category: "contact", question: "주차는 가능한가요?", answer: "네, 교회 앞 주차가 가능합니다. 다만 주일 예배 시간에는 차량이 몰릴 수 있어 조금 여유 있게 오시면 좋습니다.", keywords: ["주차", "차량", "주차장"] },
  { category: "visit", question: "처음 방문하면 어떻게 하면 되나요?", answer: "처음 방문이시면 주일 2부 오전 11:00 예배를 가장 기본으로 많이 안내해 드립니다. 예배 후 새가족 안내를 받으시거나 교회 사무실로 문의하시면 됩니다.", keywords: ["처음 방문", "새가족", "처음 가요"] },
  { category: "worship", question: "주일예배 시간은 어떻게 되나요?", answer: lines("주일예배는 세 번 있습니다.", "1부 오전 9:30", "2부 오전 11:00", "3부 오후 1:30"), keywords: ["주일예배", "예배 시간", "장년부"] },
  { category: "worship", question: "주일 1부 예배 시간은 언제인가요?", answer: "주일 1부 예배는 오전 9:30에 본당에서 드립니다.", keywords: ["1부 예배", "오전 9:30"] },
  { category: "worship", question: "주일 2부 예배 시간은 언제인가요?", answer: "주일 2부 예배는 오전 11:00에 본당에서 드립니다. 일광교회의 주 예배로 안내되는 시간입니다.", keywords: ["2부 예배", "오전 11:00"] },
  { category: "worship", question: "주일 3부 예배 시간은 언제인가요?", answer: "주일 3부 예배는 오후 1:30에 본당에서 드립니다.", keywords: ["3부 예배", "오후 1:30"] },
  { category: "worship", question: "새벽기도회 시간은 언제인가요?", answer: "새벽기도회는 매일 오전 5:00에 본당에서 드립니다.", keywords: ["새벽기도", "오전 5:00"] },
  { category: "worship", question: "수요오전기도회 시간은 언제인가요?", answer: "수요오전기도회는 수요일 오전 10:30에 드립니다.", keywords: ["수요오전기도회", "수요일 오전 10:30"] },
  { category: "worship", question: "수요성경공부 시간은 언제인가요?", answer: "수요성경공부는 수요일 오후 8:00에 진행됩니다.", keywords: ["수요성경공부", "수요일 오후 8:00"] },
  { category: "worship", question: "온라인으로 예배를 드릴 수 있나요?", answer: "네, 유튜브 생중계를 통해 온라인 예배에 참여하실 수 있습니다. 설교와 예배 영상은 예배/말씀 메뉴에서도 확인하실 수 있습니다.", keywords: ["온라인 예배", "유튜브", "생중계"] },
  { category: "menu", question: "교회소개 메뉴에는 무엇이 있나요?", answer: "교회소개 메뉴에는 담임목사 인사말, 교회비전, 교회역사, 섬기는 사람들, 오시는 길, 예배안내가 포함되어 있습니다.", keywords: ["교회소개", "/about", "메뉴"] },
  { category: "menu", question: "교회역사 페이지는 어디에서 보나요?", answer: "교회역사 페이지는 /about/history 에서 보실 수 있습니다.", keywords: ["교회역사", "/about/history"] },
  { category: "menu", question: "교회비전 페이지는 어디에서 보나요?", answer: "교회비전 페이지는 /about/vision 에서 보실 수 있습니다.", keywords: ["교회비전", "/about/vision"] },
  { category: "menu", question: "오시는 길 페이지는 어디에서 보나요?", answer: "오시는 길 페이지는 /about/location 에서 보실 수 있습니다.", keywords: ["오시는 길", "/about/location"] },
  { category: "menu", question: "예배안내 페이지는 어디에서 보나요?", answer: "예배안내 페이지는 /about/worship-info 에서 보실 수 있습니다.", keywords: ["예배안내", "/about/worship-info"] },
  { category: "menu", question: "예배/말씀 메뉴는 어디인가요?", answer: "예배/말씀 메뉴는 /worship 이며, 기본 예배 안내와 설교 연결을 함께 보실 수 있습니다.", keywords: ["예배/말씀", "/worship"] },
  { category: "menu", question: "설교 목록은 어디에서 보나요?", answer: "설교 목록은 /worship/sermons 에서 보실 수 있습니다.", keywords: ["설교", "/worship/sermons"] },
  { category: "menu", question: "다음세대 메뉴는 어디인가요?", answer: "다음세대 메뉴는 /youth 이며, 유초등부, 중고등부, 청년부 페이지로 나뉘어 있습니다.", keywords: ["다음세대", "/youth"] },
  { category: "next_generation", question: "유초등부 예배 시간은 언제인가요?", answer: "유초등부는 주일 오전 11:00에 4층 유초등부실에서 모입니다.", keywords: ["유초등부", "주일학교", "주일 오전 11:00", "4층 유초등부실", "유초등부 장소", "유초등부 어디", "유초등부 예배 장소", "어디서 예배", "예배드려요"] },
  { category: "next_generation", question: "유치부는 어디에서 모이나요?", answer: "유치부는 주일 오전 11:00에 4층 유초등부실에서 모입니다.", keywords: ["유치부", "4층", "유초등부실", "유치부 장소", "유치부 어디"] },
  { category: "next_generation", question: "아동부는 어디에서 모이나요?", answer: "아동부는 주일 오전 11:00에 4층 유초등부실에서 모입니다.", keywords: ["아동부", "초등부", "4층", "유초등부실", "아동부 장소", "초등부 어디"] },
  { category: "next_generation", question: "중고등부 예배 시간은 언제인가요?", answer: "중고등부는 매 주일 오전 9:00에 3층 소예배실에서 예배드립니다.", keywords: ["중고등부", "청소년부", "오전 9:00", "3층 소예배실", "중고등부 장소", "중고등부 어디", "중고등부 예배 장소", "어디서 예배", "예배드려요"] },
  { category: "next_generation", question: "중고등부는 주중에 어떤 모임이 있나요?", answer: "중고등부는 금요 기도 모임이 매주 금요일 오후 7:30에 있고, 소그룹 성경공부가 격주 토요일 오후 2:00에 있습니다.", keywords: ["중고등부", "금요 기도", "소그룹"] },
  { category: "next_generation", question: "청년부 예배 시간은 언제인가요?", answer: "청년부는 주일 오후 1:30에 3층 소예배실에서 예배드리고, 예배 후 청년 모임으로 이어집니다.", keywords: ["청년부", "오후 1:30", "3층 소예배실", "청년부 장소", "청년부 어디", "청년부 예배 장소", "어디서 예배", "예배드려요"] },
  { category: "next_generation", question: "청년부는 어떤 사람들이 참여하나요?", answer: "청년부는 대학생과 20~30대 미혼 청년들이 함께 모이는 공동체입니다.", keywords: ["청년부", "대학생", "20대", "30대"] },
  { category: "next_generation", question: "유초등부, 중고등부, 청년부 예배 시간은 각각 언제인가요?", answer: lines("유초등부 주일 오전 11:00 / 4층 유초등부실", "중고등부 주일 오전 9:00 / 3층 소예배실", "청년부 주일 오후 1:30 / 3층 소예배실"), keywords: ["유초등부", "중고등부", "청년부", "부서별예배시간", "부서별예배장소", "전체 부서 안내"] },
  { category: "menu", question: "나눔과 소식 메뉴에는 무엇이 있나요?", answer: "나눔과 소식 메뉴는 /news 기준으로 교회소식, 주보, 행사안내, 갤러리, 커뮤니티로 이어집니다.", keywords: ["나눔과 소식", "/news"] },
  { category: "menu", question: "주보는 어디에서 보나요?", answer: "주보는 /news/bulletin 에서 확인하실 수 있습니다.", keywords: ["주보", "/news/bulletin"] },
  { category: "menu", question: "행사안내는 어디에서 보나요?", answer: "행사안내는 /news/events 에서 확인하실 수 있습니다.", keywords: ["행사안내", "/news/events"] },
  { category: "menu", question: "갤러리는 어디에서 보나요?", answer: "갤러리는 /news/gallery 에서 확인하실 수 있습니다.", keywords: ["갤러리", "/news/gallery"] },
  { category: "menu", question: "자료실과 게시판은 어디에서 보나요?", answer: "자료실은 /resources, 게시판은 /resources/board 에서 보실 수 있습니다.", keywords: ["자료실", "/resources", "게시판", "/resources/board"] },
  { category: "offering", question: "온라인 헌금은 어떻게 하나요?", answer: "온라인 헌금은 안내된 계좌로 이체하시면 됩니다. 이체 메모에는 성함과 헌금 종류를 함께 적어 주시면 됩니다.", keywords: ["온라인 헌금", "헌금 계좌", "이체"] },
  { category: "offering", question: "헌금 종류에는 무엇이 있나요?", answer: "일광교회는 십일조, 감사헌금, 건축헌금, 선교헌금, 구제헌금, 교육헌금 등을 안내하고 있습니다.", keywords: ["헌금 종류", "십일조", "감사헌금", "건축헌금", "선교헌금", "구제헌금", "교육헌금"] },
  { category: "visit", question: "새가족 등록은 어떻게 하나요?", answer: "새가족 등록은 주일 예배 후 새가족실에서 안내받으시거나, 홈페이지 회원가입 후 교회 사무실로 연락하시면 됩니다.", keywords: ["새가족 등록", "회원가입"] },
  { category: "contact", question: "문의하기 페이지는 어디인가요?", answer: "문의하기 페이지는 /contact 입니다. 바로 연락이 필요하시면 02-927-0691로 전화 주시는 것이 가장 빠릅니다.", keywords: ["문의하기", "/contact"] },
];

const BIBLE_OVERVIEW_FAQ_SEEDS: FaqSeed[] = [
  { category: "bible_overview", question: "성경은 몇 권인가요?", answer: "성경은 모두 66권으로 이루어져 있습니다. 구약 39권과 신약 27권입니다.", keywords: ["성경", "66권", "성경 권수"] },
  { category: "bible_overview", question: "구약은 몇 권인가요?", answer: "구약은 39권입니다.", keywords: ["구약", "39권"] },
  { category: "bible_overview", question: "신약은 몇 권인가요?", answer: "신약은 27권입니다.", keywords: ["신약", "27권"] },
  { category: "bible_overview", question: "성경은 크게 어떻게 나뉘나요?", answer: "성경은 크게 구약과 신약으로 나뉩니다.", keywords: ["구약", "신약"] },
  { category: "bible_overview", question: "모세오경은 어떤 책들인가요?", answer: "모세오경은 창세기, 출애굽기, 레위기, 민수기, 신명기입니다.", keywords: ["모세오경", "오경"] },
  { category: "bible_overview", question: "구약의 역사서는 어떤 범위인가요?", answer: "구약의 역사서는 여호수아부터 에스더까지의 책들을 가리킵니다.", keywords: ["역사서", "여호수아", "에스더"] },
  { category: "bible_overview", question: "구약의 시가서는 어떤 책들인가요?", answer: "구약의 시가서는 욥기, 시편, 잠언, 전도서, 아가입니다.", keywords: ["시가서", "욥기", "시편", "잠언"] },
  { category: "bible_overview", question: "대선지서는 어떤 책들인가요?", answer: "대선지서는 이사야, 예레미야, 예레미야애가, 에스겔, 다니엘입니다.", keywords: ["대선지서", "이사야", "예레미야", "에스겔", "다니엘"] },
  { category: "bible_overview", question: "소선지서는 몇 권인가요?", answer: "소선지서는 호세아부터 말라기까지 12권입니다.", keywords: ["소선지서", "12권", "말라기"] },
  { category: "bible_overview", question: "복음서는 어떤 책들인가요?", answer: "복음서는 마태복음, 마가복음, 누가복음, 요한복음입니다.", keywords: ["복음서", "마태복음", "마가복음", "누가복음", "요한복음"] },
  { category: "bible_overview", question: "바울서신은 몇 권인가요?", answer: "바울서신은 일반적으로 13권으로 봅니다.", keywords: ["바울서신", "13권"] },
  { category: "bible_overview", question: "일반서신은 어떤 책들인가요?", answer: "일반서신은 히브리서, 야고보서, 베드로전후서, 요한일이삼서, 유다서입니다.", keywords: ["일반서신", "공동서신", "히브리서"] },
  { category: "bible_overview", question: "성경의 마지막 책은 무엇인가요?", answer: "성경의 마지막 책은 요한계시록입니다.", keywords: ["마지막 책", "요한계시록"] },
  { category: "bible_overview", question: "구약의 첫 책은 무엇인가요?", answer: "구약의 첫 책은 창세기입니다.", keywords: ["구약 첫 책", "창세기"] },
  { category: "bible_overview", question: "신약의 첫 책은 무엇인가요?", answer: "신약의 첫 책은 마태복음입니다.", keywords: ["신약 첫 책", "마태복음"] },
  { category: "bible_overview", question: "구약의 마지막 책은 무엇인가요?", answer: "구약의 마지막 책은 말라기입니다.", keywords: ["구약 마지막 책", "말라기"] },
  { category: "bible_overview", question: "성경에서 가장 긴 책은 무엇인가요?", answer: "성경에서 가장 긴 책은 시편입니다.", keywords: ["가장 긴 책", "시편"] },
  { category: "bible_overview", question: "구약에서 가장 짧은 책은 무엇인가요?", answer: "구약에서 가장 짧은 책은 오바댜입니다.", keywords: ["가장 짧은 구약", "오바댜"] },
  { category: "bible_overview", question: "신약에서 가장 짧은 책은 무엇인가요?", answer: "신약에서 가장 짧은 책은 요한삼서입니다.", keywords: ["가장 짧은 신약", "요한삼서"] },
  { category: "bible_overview", question: "성경의 중심 주제는 무엇인가요?", answer: "성경의 중심 주제는 하나님께서 예수 그리스도를 통해 이루시는 구원입니다.", keywords: ["중심 주제", "구원", "예수 그리스도"] },
];

const BIBLE_OLD_TESTAMENT_FOUNDATIONS_FAQ_SEEDS: FaqSeed[] = [
  { category: "ot_foundations", question: "아담과 하와는 누구인가요?", answer: "아담과 하와는 하나님께서 처음 창조하신 인간입니다.", keywords: ["아담", "하와"] },
  { category: "ot_foundations", question: "가인은 누구를 죽였나요?", answer: "가인은 자신의 동생 아벨을 죽였습니다.", keywords: ["가인", "아벨"] },
  { category: "ot_foundations", question: "방주를 만든 사람은 누구인가요?", answer: "방주를 만든 사람은 노아입니다.", keywords: ["방주", "노아"] },
  { category: "ot_foundations", question: "홍수 후 하나님이 주신 언약의 표는 무엇인가요?", answer: "홍수 후 하나님이 주신 언약의 표는 무지개입니다.", keywords: ["홍수", "무지개"] },
  { category: "ot_foundations", question: "바벨탑 사건의 결과는 무엇이었나요?", answer: "바벨탑 사건으로 사람들의 언어가 혼잡해지고 온 땅으로 흩어졌습니다.", keywords: ["바벨탑", "언어"] },
  { category: "ot_foundations", question: "믿음의 조상으로 불리는 사람은 누구인가요?", answer: "믿음의 조상으로 불리는 사람은 아브라함입니다.", keywords: ["믿음의 조상", "아브라함"] },
  { category: "ot_foundations", question: "아브라함의 아내는 누구인가요?", answer: "아브라함의 아내는 사라입니다.", keywords: ["아브라함", "사라"] },
  { category: "ot_foundations", question: "이삭의 아내는 누구인가요?", answer: "이삭의 아내는 리브가입니다.", keywords: ["이삭", "리브가"] },
  { category: "ot_foundations", question: "야곱의 다른 이름은 무엇인가요?", answer: "야곱의 다른 이름은 이스라엘입니다.", keywords: ["야곱", "이스라엘"] },
  { category: "ot_foundations", question: "야곱의 아들들은 무엇으로 이어지나요?", answer: "야곱의 열두 아들은 이스라엘 열두 지파의 조상이 됩니다.", keywords: ["야곱", "열두 지파"] },
  { category: "ot_foundations", question: "요셉은 어디로 팔려 갔나요?", answer: "요셉은 형들에 의해 애굽으로 팔려 갔습니다.", keywords: ["요셉", "애굽"] },
  { category: "ot_foundations", question: "출애굽을 이끈 지도자는 누구인가요?", answer: "출애굽을 이끈 지도자는 모세입니다.", keywords: ["출애굽", "모세"] },
  { category: "ot_foundations", question: "십계명은 어디에서 받았나요?", answer: "모세는 시내산에서 십계명을 받았습니다.", keywords: ["십계명", "시내산"] },
  { category: "ot_foundations", question: "출애굽을 기념하는 절기는 무엇인가요?", answer: "출애굽을 기념하는 절기는 유월절입니다.", keywords: ["유월절", "출애굽"] },
  { category: "ot_foundations", question: "광야에서 하나님이 내려주신 음식은 무엇인가요?", answer: "광야에서 하나님이 내려주신 음식은 만나입니다.", keywords: ["광야", "만나"] },
  { category: "ot_foundations", question: "모세 뒤를 이어 가나안으로 들어간 지도자는 누구인가요?", answer: "모세 뒤를 이어 가나안으로 들어간 지도자는 여호수아입니다.", keywords: ["모세 후계자", "여호수아"] },
  { category: "ot_foundations", question: "여리고 성은 어떻게 무너졌나요?", answer: "여리고 성은 하나님의 말씀에 따라 백성이 순종하며 돌고 나팔을 불 때 무너졌습니다.", keywords: ["여리고", "나팔"] },
  { category: "ot_foundations", question: "가나안 정탐 때 믿음으로 보고한 두 사람은 누구인가요?", answer: "가나안 정탐 때 믿음으로 보고한 두 사람은 여호수아와 갈렙입니다.", keywords: ["정탐", "여호수아", "갈렙"] },
  { category: "ot_foundations", question: "사사 시대의 대표적인 여성 사사는 누구인가요?", answer: "사사 시대의 대표적인 여성 사사는 드보라입니다.", keywords: ["사사", "드보라"] },
  { category: "ot_foundations", question: "기드온의 군사는 몇 명으로 줄어들었나요?", answer: "기드온의 군사는 하나님의 뜻에 따라 300명으로 줄어들었습니다.", keywords: ["기드온", "300명"] },
];

const BIBLE_OLD_TESTAMENT_HISTORY_AND_PROPHETS_FAQ_SEEDS: FaqSeed[] = [
  { category: "ot_history", question: "삼손은 왜 힘을 잃었나요?", answer: "삼손은 서원과 관련된 머리카락이 잘리고, 들릴라에게 마음을 빼앗기면서 힘을 잃었습니다.", keywords: ["삼손", "들릴라"] },
  { category: "ot_history", question: "사무엘은 어떤 역할을 한 인물인가요?", answer: "사무엘은 선지자이자 사사였고, 사울과 다윗에게 기름을 부은 인물입니다.", keywords: ["사무엘", "선지자", "사사"] },
  { category: "ot_history", question: "이스라엘의 첫 왕은 누구인가요?", answer: "이스라엘의 첫 왕은 사울입니다.", keywords: ["첫 왕", "사울"] },
  { category: "ot_history", question: "골리앗을 쓰러뜨린 사람은 누구인가요?", answer: "골리앗을 쓰러뜨린 사람은 다윗입니다.", keywords: ["골리앗", "다윗"] },
  { category: "ot_history", question: "성전을 처음 건축한 왕은 누구인가요?", answer: "성전을 처음 건축한 왕은 솔로몬입니다.", keywords: ["성전", "솔로몬"] },
  { category: "ot_history", question: "분열왕국은 누구 이후에 시작되었나요?", answer: "분열왕국은 솔로몬 이후 르호보암과 여로보암 때 본격적으로 나뉘었습니다.", keywords: ["분열왕국", "르호보암", "여로보암"] },
  { category: "ot_history", question: "북이스라엘의 대표적인 수도는 어디인가요?", answer: "북이스라엘의 대표적인 수도는 사마리아입니다.", keywords: ["북이스라엘", "사마리아"] },
  { category: "ot_history", question: "남유다의 중심 도시는 어디인가요?", answer: "남유다의 중심 도시는 예루살렘입니다.", keywords: ["남유다", "예루살렘"] },
  { category: "ot_history", question: "엘리야가 바알 선지자들과 대결한 산은 어디인가요?", answer: "엘리야가 바알 선지자들과 대결한 산은 갈멜산입니다.", keywords: ["엘리야", "갈멜산"] },
  { category: "ot_history", question: "엘리야의 뒤를 이은 선지자는 누구인가요?", answer: "엘리야의 뒤를 이은 선지자는 엘리사입니다.", keywords: ["엘리야", "엘리사"] },
  { category: "ot_history", question: "요나는 어느 성으로 가라는 부르심을 받았나요?", answer: "요나는 니느웨로 가라는 부르심을 받았습니다.", keywords: ["요나", "니느웨"] },
  { category: "ot_history", question: "욥은 무엇으로 잘 알려져 있나요?", answer: "욥은 큰 고난 가운데서도 하나님을 신뢰한 인물로 잘 알려져 있습니다.", keywords: ["욥", "고난"] },
  { category: "ot_history", question: "시편 23편과 자주 연결되는 인물은 누구인가요?", answer: "시편 23편과 자주 연결되는 인물은 다윗입니다.", keywords: ["시편 23편", "다윗"] },
  { category: "ot_history", question: "잠언은 주로 누가 기록한 것으로 알려져 있나요?", answer: "잠언은 주로 솔로몬이 기록한 것으로 알려져 있습니다.", keywords: ["잠언", "솔로몬"] },
  { category: "ot_history", question: "전도서는 어떤 주제를 많이 다루나요?", answer: "전도서는 하나님 없이 살아가는 인생의 허무와, 하나님을 경외하는 삶의 중요성을 다룹니다.", keywords: ["전도서", "허무"] },
  { category: "ot_history", question: "이사야 53장은 누구를 떠올리게 하나요?", answer: "이사야 53장은 고난받는 종의 모습을 통해 메시아이신 예수 그리스도를 떠올리게 합니다.", keywords: ["이사야 53장", "메시아"] },
  { category: "ot_history", question: "예레미야는 어떤 별명으로 불리나요?", answer: "예레미야는 눈물의 선지자로 불리곤 합니다.", keywords: ["예레미야", "눈물의 선지자"] },
  { category: "ot_history", question: "에스겔의 마른 뼈 환상은 무엇을 상징하나요?", answer: "에스겔의 마른 뼈 환상은 하나님께서 죽은 것 같은 백성을 다시 살리시고 회복하신다는 소망을 상징합니다.", keywords: ["에스겔", "마른 뼈"] },
  { category: "ot_history", question: "다니엘은 어떤 시험을 겪었나요?", answer: "다니엘은 사자굴에 던져지는 시험을 겪었지만 하나님께서 지켜 주셨습니다.", keywords: ["다니엘", "사자굴"] },
  { category: "ot_history", question: "다니엘의 세 친구는 어떤 사건으로 유명한가요?", answer: "다니엘의 세 친구는 풀무불 속에서도 하나님을 신뢰한 사건으로 유명합니다.", keywords: ["풀무불", "다니엘의 세 친구"] },
];

const BIBLE_JESUS_LIFE_FAQ_SEEDS: FaqSeed[] = [
  { category: "jesus_life", question: "예수님은 어디에서 태어나셨나요?", answer: "예수님은 베들레헴에서 태어나셨습니다.", keywords: ["예수님", "베들레헴"] },
  { category: "jesus_life", question: "예수님의 어머니는 누구인가요?", answer: "예수님의 어머니는 마리아입니다.", keywords: ["예수님", "마리아"] },
  { category: "jesus_life", question: "예수님의 육신의 아버지로 알려진 사람은 누구인가요?", answer: "예수님의 육신의 아버지로 알려진 사람은 요셉입니다.", keywords: ["예수님", "요셉"] },
  { category: "jesus_life", question: "예수님의 길을 준비한 사람은 누구인가요?", answer: "예수님의 길을 준비한 사람은 세례 요한입니다.", keywords: ["세례 요한", "예수님의 길"] },
  { category: "jesus_life", question: "예수님은 누구에게 세례를 받으셨나요?", answer: "예수님은 세례 요한에게 세례를 받으셨습니다.", keywords: ["세례", "세례 요한"] },
  { category: "jesus_life", question: "예수님의 첫 기적은 무엇인가요?", answer: "예수님의 첫 기적은 가나 혼인잔치에서 물을 포도주로 바꾸신 일입니다.", keywords: ["첫 기적", "가나"] },
  { category: "jesus_life", question: "예수님은 몇 명의 제자를 택하셨나요?", answer: "예수님은 열두 제자를 택하셨습니다.", keywords: ["열두 제자", "12제자"] },
  { category: "jesus_life", question: "산상수훈은 어느 복음서에서 길게 기록되어 있나요?", answer: "산상수훈은 마태복음 5장부터 7장에 길게 기록되어 있습니다.", keywords: ["산상수훈", "마태복음"] },
  { category: "jesus_life", question: "예수님이 말씀하신 가장 큰 계명은 무엇인가요?", answer: "가장 큰 계명은 하나님을 사랑하고, 그와 같이 이웃을 사랑하는 것입니다.", keywords: ["가장 큰 계명", "하나님 사랑", "이웃 사랑"] },
  { category: "jesus_life", question: "주기도문은 어디에 기록되어 있나요?", answer: "주기도문은 마태복음 6장과 누가복음 11장에 기록되어 있습니다.", keywords: ["주기도문", "마태복음 6장", "누가복음 11장"] },
  { category: "jesus_life", question: "예수님은 누구를 위해 눈물을 흘리셨나요?", answer: "예수님은 죽은 나사로를 생각하며 눈물을 흘리셨습니다.", keywords: ["예수님 눈물", "나사로"] },
  { category: "jesus_life", question: "오병이어 사건은 무엇인가요?", answer: "오병이어 사건은 예수님께서 보리떡 다섯 개와 물고기 두 마리로 오천 명 이상을 먹이신 사건입니다.", keywords: ["오병이어", "오천 명"] },
  { category: "jesus_life", question: "예수님은 어디를 걸으셨나요?", answer: "예수님은 바다 위를 걸으셨습니다.", keywords: ["바다 위", "예수님"] },
  { category: "jesus_life", question: "변화산 사건을 함께 본 제자는 누구인가요?", answer: "변화산 사건을 함께 본 제자는 베드로, 야고보, 요한입니다.", keywords: ["변화산", "베드로", "야고보", "요한"] },
  { category: "jesus_life", question: "예수님은 예루살렘에 입성하실 때 무엇을 타셨나요?", answer: "예수님은 나귀를 타고 예루살렘에 입성하셨습니다.", keywords: ["예루살렘 입성", "나귀"] },
  { category: "jesus_life", question: "예수님은 어디에서 십자가에 못 박히셨나요?", answer: "예수님은 골고다에서 십자가에 못 박히셨습니다.", keywords: ["골고다", "십자가"] },
  { category: "jesus_life", question: "예수님은 언제 부활하셨나요?", answer: "예수님은 십자가에 달려 죽으신 뒤 삼 일 만에 부활하셨습니다.", keywords: ["부활", "삼 일"] },
  { category: "jesus_life", question: "빈 무덤을 먼저 본 대표적인 인물은 누구인가요?", answer: "빈 무덤을 먼저 확인한 대표적인 인물로는 막달라 마리아가 있습니다.", keywords: ["빈 무덤", "막달라 마리아"] },
  { category: "jesus_life", question: "예수님은 부활 후 어떻게 되셨나요?", answer: "예수님은 부활 후 제자들에게 나타나신 뒤 하늘로 승천하셨습니다.", keywords: ["승천", "부활 후"] },
  { category: "jesus_life", question: "지상명령은 무엇인가요?", answer: "지상명령은 모든 민족을 제자로 삼아 세례를 베풀고 가르치라는 예수님의 명령입니다.", keywords: ["지상명령", "제자 삼아"] },
];

const BIBLE_JESUS_TEACHINGS_FAQ_SEEDS: FaqSeed[] = [
  { category: "jesus_teaching", question: "선한 사마리아인의 비유는 무엇을 가르치나요?", answer: "선한 사마리아인의 비유는 도움이 필요한 이웃을 사랑으로 돌보아야 한다는 것을 가르칩니다.", keywords: ["선한 사마리아인", "이웃 사랑"] },
  { category: "jesus_teaching", question: "탕자의 비유는 무엇을 보여 주나요?", answer: "탕자의 비유는 회개하는 죄인을 기쁘게 맞아 주시는 아버지 하나님의 사랑을 보여 줍니다.", keywords: ["탕자", "회개", "아버지 사랑"] },
  { category: "jesus_teaching", question: "잃은 양의 비유에서 양은 몇 마리인가요?", answer: "잃은 양의 비유는 양 백 마리 가운데 한 마리를 찾는 이야기입니다.", keywords: ["잃은 양", "99", "100"] },
  { category: "jesus_teaching", question: "잃은 드라크마 비유는 무엇을 말하나요?", answer: "잃은 드라크마 비유는 잃어버린 한 사람을 찾으시는 하나님의 기쁨을 보여 줍니다.", keywords: ["잃은 드라크마", "잃은 동전"] },
  { category: "jesus_teaching", question: "씨 뿌리는 비유는 무엇을 뜻하나요?", answer: "씨 뿌리는 비유는 같은 말씀이라도 듣는 사람의 마음 상태에 따라 열매가 다르다는 것을 뜻합니다.", keywords: ["씨 뿌리는 비유", "말씀", "마음"] },
  { category: "jesus_teaching", question: "겨자씨 비유는 무엇을 가르치나요?", answer: "겨자씨 비유는 하나님 나라가 작게 시작해도 크게 자라난다는 것을 가르칩니다.", keywords: ["겨자씨", "하나님 나라"] },
  { category: "jesus_teaching", question: "지혜로운 사람과 어리석은 사람의 비유는 무엇을 가르치나요?", answer: "지혜로운 사람과 어리석은 사람의 비유는 말씀을 듣고 행하는 삶이 중요하다는 것을 가르칩니다.", keywords: ["지혜로운 사람", "반석", "모래"] },
  { category: "jesus_teaching", question: "달란트 비유는 무엇을 강조하나요?", answer: "달란트 비유는 하나님이 맡기신 것을 충성되게 사용하는 책임을 강조합니다.", keywords: ["달란트", "충성", "책임"] },
  { category: "jesus_teaching", question: "열 처녀 비유는 무엇을 가르치나요?", answer: "열 처녀 비유는 주님의 오심을 늘 준비하며 깨어 있어야 한다는 것을 가르칩니다.", keywords: ["열 처녀", "준비", "깨어 있음"] },
  { category: "jesus_teaching", question: "포도원 품꾼 비유는 무엇을 보여 주나요?", answer: "포도원 품꾼 비유는 하나님의 은혜가 사람의 계산보다 크고 자유롭다는 것을 보여 줍니다.", keywords: ["포도원 품꾼", "은혜"] },
  { category: "jesus_teaching", question: "어리석은 부자의 비유는 무엇을 경고하나요?", answer: "어리석은 부자의 비유는 재물을 쌓는 데만 몰두하고 하나님 앞에 부요하지 못한 삶을 경고합니다.", keywords: ["어리석은 부자", "탐심", "재물"] },
  { category: "jesus_teaching", question: "바리새인과 세리의 비유는 무엇을 가르치나요?", answer: "바리새인과 세리의 비유는 자기 의가 아니라 겸손한 회개가 중요하다는 것을 가르칩니다.", keywords: ["바리새인", "세리", "겸손"] },
  { category: "jesus_teaching", question: "예수님이 자신을 선한 목자라고 하신 뜻은 무엇인가요?", answer: "예수님이 자신을 선한 목자라고 하신 것은 양들을 알고 사랑하며 목숨까지 내어 주시는 분이라는 뜻입니다.", keywords: ["선한 목자", "예수님"] },
  { category: "jesus_teaching", question: "포도나무와 가지의 비유는 무엇을 뜻하나요?", answer: "포도나무와 가지의 비유는 예수님 안에 거할 때에만 참된 열매를 맺을 수 있다는 뜻입니다.", keywords: ["포도나무", "가지", "열매"] },
  { category: "jesus_teaching", question: "팔복의 첫 번째 복은 무엇인가요?", answer: "팔복의 첫 번째 복은 심령이 가난한 자가 복이 있다는 말씀입니다.", keywords: ["팔복", "심령이 가난한 자"] },
  { category: "jesus_teaching", question: "황금률은 무엇인가요?", answer: "황금률은 남에게 대접받고자 하는 대로 남을 대접하라는 말씀입니다.", keywords: ["황금률", "대접"] },
  { category: "jesus_teaching", question: "새 계명은 무엇인가요?", answer: "새 계명은 예수님께서 우리를 사랑하신 것처럼 서로 사랑하라는 말씀입니다.", keywords: ["새 계명", "서로 사랑"] },
  { category: "jesus_teaching", question: "예수님이 제자들의 발을 씻기신 이유는 무엇인가요?", answer: "예수님이 제자들의 발을 씻기신 것은 겸손한 섬김의 본을 보여 주시기 위함입니다.", keywords: ["발 씻김", "섬김"] },
  { category: "jesus_teaching", question: "삭개오는 어떤 사람이었나요?", answer: "삭개오는 예수님을 만나 삶이 바뀐 세리장이었습니다.", keywords: ["삭개오", "세리장"] },
  { category: "jesus_teaching", question: "엠마오로 가던 두 제자의 이야기는 언제 있었나요?", answer: "엠마오로 가던 두 제자의 이야기는 예수님 부활 후에 있었습니다.", keywords: ["엠마오", "부활 후"] },
];

const BIBLE_ACTS_AND_CHURCH_FAQ_SEEDS: FaqSeed[] = [
  { category: "acts_church", question: "성령강림은 언제 일어났나요?", answer: "성령강림은 오순절에 일어났습니다.", keywords: ["성령강림", "오순절"] },
  { category: "acts_church", question: "오순절 설교를 대표적으로 전한 사도는 누구인가요?", answer: "오순절에 대표적으로 설교한 사도는 베드로입니다.", keywords: ["오순절", "베드로"] },
  { category: "acts_church", question: "초대교회의 첫 순교자는 누구인가요?", answer: "초대교회의 첫 순교자는 스데반입니다.", keywords: ["첫 순교자", "스데반"] },
  { category: "acts_church", question: "사울은 어떤 이름으로 더 잘 알려지나요?", answer: "사울은 회심 후 바울로 더 잘 알려집니다.", keywords: ["사울", "바울"] },
  { category: "acts_church", question: "그리스도인이라는 이름이 처음 사용된 곳은 어디인가요?", answer: "그리스도인이라는 이름은 안디옥에서 처음 사용되었습니다.", keywords: ["그리스도인", "안디옥"] },
  { category: "acts_church", question: "고넬료는 어떤 인물인가요?", answer: "고넬료는 복음을 받은 대표적인 이방인 백부장입니다.", keywords: ["고넬료", "백부장", "이방인"] },
  { category: "acts_church", question: "베드로가 본 보자기 환상은 무엇과 관련이 있나요?", answer: "베드로의 보자기 환상은 하나님께서 이방인에게도 복음을 여신다는 사실과 관련이 있습니다.", keywords: ["보자기 환상", "이방인"] },
  { category: "acts_church", question: "예루살렘 공의회는 무엇을 결정했나요?", answer: "예루살렘 공의회는 이방인 신자들에게 모세 율법 전체를 그대로 지우지 않는 방향을 확인했습니다.", keywords: ["예루살렘 공의회", "이방인"] },
  { category: "acts_church", question: "바울의 첫 번째 선교 여행 동역자는 누구인가요?", answer: "바울의 첫 번째 선교 여행 동역자는 바나바입니다.", keywords: ["첫 번째 선교 여행", "바나바"] },
  { category: "acts_church", question: "바울의 두 번째 선교 여행 동역자로 유명한 사람은 누구인가요?", answer: "바울의 두 번째 선교 여행 동역자로는 실라가 유명합니다.", keywords: ["두 번째 선교 여행", "실라"] },
  { category: "acts_church", question: "루디아는 어떤 사람인가요?", answer: "루디아는 빌립보에서 복음을 받아들인 자주 옷감 장사였습니다.", keywords: ["루디아", "빌립보"] },
  { category: "acts_church", question: "빌립보 간수는 어떻게 반응했나요?", answer: "빌립보 간수는 복음을 듣고 예수를 믿으며 가족과 함께 세례를 받았습니다.", keywords: ["빌립보 간수", "세례"] },
  { category: "acts_church", question: "베뢰아 사람들은 왜 칭찬을 받았나요?", answer: "베뢰아 사람들은 말씀을 듣고 날마다 성경을 상고했기 때문에 칭찬을 받았습니다.", keywords: ["베뢰아", "성경 상고"] },
  { category: "acts_church", question: "브리스길라와 아굴라는 어떤 사람들인가요?", answer: "브리스길라와 아굴라는 바울의 동역자였고, 아볼로를 더 정확히 가르친 부부입니다.", keywords: ["브리스길라", "아굴라", "아볼로"] },
  { category: "acts_church", question: "아나니아와 삽비라는 어떤 죄를 지었나요?", answer: "아나니아와 삽비라는 하나님 앞에서 헌금에 대해 거짓말한 죄를 지었습니다.", keywords: ["아나니아", "삽비라", "거짓말"] },
  { category: "acts_church", question: "바나바라는 이름의 뜻은 무엇인가요?", answer: "바나바는 위로의 아들, 곧 격려의 사람이라는 뜻으로 이해됩니다.", keywords: ["바나바", "위로의 아들"] },
  { category: "acts_church", question: "유두고는 어떤 사건으로 알려져 있나요?", answer: "유두고는 바울의 긴 설교 중 창에서 떨어졌지만 다시 살아난 사건으로 알려져 있습니다.", keywords: ["유두고", "창", "바울"] },
  { category: "acts_church", question: "바울은 난파 후 어느 섬에 머물렀나요?", answer: "바울은 난파 후 멜리데, 곧 몰타 섬에 머물렀습니다.", keywords: ["난파", "몰타"] },
  { category: "acts_church", question: "세베대의 아들 야고보는 어떻게 죽었나요?", answer: "세베대의 아들 야고보는 헤롯에게 죽임을 당했습니다.", keywords: ["야고보", "헤롯"] },
  { category: "acts_church", question: "누가는 어떤 두 권의 책을 기록했나요?", answer: "누가는 누가복음과 사도행전을 기록했습니다.", keywords: ["누가", "누가복음", "사도행전"] },
];

const BIBLE_LETTERS_AND_BOOKS_FAQ_SEEDS: FaqSeed[] = [
  { category: "letters_books", question: "로마서의 핵심 주제는 무엇인가요?", answer: "로마서는 복음과 믿음으로 얻는 하나님의 의를 핵심적으로 다룹니다.", keywords: ["로마서", "하나님의 의"] },
  { category: "letters_books", question: "고린도전서 13장은 무엇으로 유명한가요?", answer: "고린도전서 13장은 사랑장으로 잘 알려져 있습니다.", keywords: ["고린도전서 13장", "사랑장"] },
  { category: "letters_books", question: "고린도전서 15장은 무엇을 다루나요?", answer: "고린도전서 15장은 예수님의 부활과 성도의 부활을 집중적으로 다룹니다.", keywords: ["고린도전서 15장", "부활"] },
  { category: "letters_books", question: "고린도후서는 어떤 내용을 많이 담고 있나요?", answer: "고린도후서는 위로와 화해, 그리고 약함 가운데 나타나는 하나님의 능력을 많이 다룹니다.", keywords: ["고린도후서", "약함", "위로"] },
  { category: "letters_books", question: "갈라디아서의 핵심 메시지는 무엇인가요?", answer: "갈라디아서는 사람이 율법의 행위가 아니라 믿음으로 의롭다 하심을 얻는다는 메시지를 강조합니다.", keywords: ["갈라디아서", "믿음", "의롭다 하심"] },
  { category: "letters_books", question: "에베소서 6장에서 유명한 그림은 무엇인가요?", answer: "에베소서 6장에서는 하나님의 전신갑주가 유명합니다.", keywords: ["에베소서 6장", "전신갑주"] },
  { category: "letters_books", question: "빌립보서의 분위기는 어떠한가요?", answer: "빌립보서는 기쁨과 감사의 분위기가 두드러지는 편지입니다.", keywords: ["빌립보서", "기쁨"] },
  { category: "letters_books", question: "골로새서는 무엇을 강조하나요?", answer: "골로새서는 예수 그리스도의 탁월하심과 충만하심을 강조합니다.", keywords: ["골로새서", "그리스도의 탁월하심"] },
  { category: "letters_books", question: "데살로니가전서는 무엇을 자주 다루나요?", answer: "데살로니가전서는 거룩한 삶과 주님의 다시 오심에 대한 소망을 자주 다룹니다.", keywords: ["데살로니가전서", "재림"] },
  { category: "letters_books", question: "데살로니가후서는 어떤 점을 바로잡아 주나요?", answer: "데살로니가후서는 종말에 대한 오해를 바로잡고 끝까지 굳게 서도록 권면합니다.", keywords: ["데살로니가후서", "종말"] },
  { category: "letters_books", question: "디모데전서는 어떤 내용을 다루나요?", answer: "디모데전서는 교회 지도자 자격과 경건한 삶, 교회 질서를 다룹니다.", keywords: ["디모데전서", "교회 지도자"] },
  { category: "letters_books", question: "디모데후서 3장 16절은 무엇을 말하나요?", answer: "디모데후서 3장 16절은 모든 성경이 하나님의 감동으로 된 것이라고 말합니다.", keywords: ["디모데후서 3:16", "하나님의 감동"] },
  { category: "letters_books", question: "디도서는 무엇을 강조하나요?", answer: "디도서는 바른 교훈과 선한 행실을 강조합니다.", keywords: ["디도서", "선한 행실"] },
  { category: "letters_books", question: "빌레몬서는 어떤 이야기와 관련이 있나요?", answer: "빌레몬서는 오네시모를 용서와 사랑으로 받아들이도록 권면하는 이야기와 관련이 있습니다.", keywords: ["빌레몬서", "오네시모"] },
  { category: "letters_books", question: "히브리서는 예수님을 어떤 분으로 소개하나요?", answer: "히브리서는 예수님을 더 좋은 언약의 중보자이시며 위대한 대제사장으로 소개합니다.", keywords: ["히브리서", "대제사장"] },
  { category: "letters_books", question: "야고보서의 유명한 구절은 무엇인가요?", answer: "야고보서는 믿음이 행함이 없으면 죽은 것이라는 말씀으로 잘 알려져 있습니다.", keywords: ["야고보서", "믿음과 행함"] },
  { category: "letters_books", question: "베드로전서는 어떤 사람들에게 큰 위로가 되나요?", answer: "베드로전서는 고난 가운데 있는 성도들에게 산 소망과 위로를 줍니다.", keywords: ["베드로전서", "고난", "소망"] },
  { category: "letters_books", question: "베드로후서는 무엇을 권면하나요?", answer: "베드로후서는 거짓 가르침을 경계하고 은혜와 지식에서 자라가라고 권면합니다.", keywords: ["베드로후서", "성장", "거짓 가르침"] },
  { category: "letters_books", question: "요한일서는 무엇을 강조하나요?", answer: "요한일서는 하나님은 사랑이시라는 사실과 진리 안에 거하는 삶을 강조합니다.", keywords: ["요한일서", "사랑", "진리"] },
  { category: "letters_books", question: "유다서는 성도들에게 무엇을 촉구하나요?", answer: "유다서는 성도들에게 믿음의 도를 위하여 힘써 싸우라고 촉구합니다.", keywords: ["유다서", "믿음의 도"] },
];

const BIBLE_TERMS_AND_DOCTRINE_FAQ_SEEDS: FaqSeed[] = [
  { category: "terms_doctrine", question: "복음이라는 말은 무슨 뜻인가요?", answer: "복음은 예수 그리스도를 통해 주어진 구원의 좋은 소식이라는 뜻입니다.", keywords: ["복음", "좋은 소식"] },
  { category: "terms_doctrine", question: "메시아라는 말은 무슨 뜻인가요?", answer: "메시아는 기름부음을 받은 자라는 뜻입니다.", keywords: ["메시아", "기름부음"] },
  { category: "terms_doctrine", question: "임마누엘이라는 이름의 뜻은 무엇인가요?", answer: "임마누엘은 하나님이 우리와 함께 계시다는 뜻입니다.", keywords: ["임마누엘", "하나님이 우리와 함께"] },
  { category: "terms_doctrine", question: "할렐루야는 무슨 뜻인가요?", answer: "할렐루야는 여호와를 찬양하라는 뜻입니다.", keywords: ["할렐루야", "찬양"] },
  { category: "terms_doctrine", question: "아멘은 무슨 뜻인가요?", answer: "아멘은 진실로 그렇습니다, 그대로 이루어지기를 바랍니다라는 뜻으로 사용됩니다.", keywords: ["아멘", "진실로"] },
  { category: "terms_doctrine", question: "호산나는 무슨 뜻인가요?", answer: "호산나는 우리를 구원하소서라는 뜻입니다.", keywords: ["호산나", "구원하소서"] },
  { category: "terms_doctrine", question: "언약은 무엇인가요?", answer: "언약은 하나님께서 자기 백성과 맺으시는 거룩한 약속입니다.", keywords: ["언약", "약속"] },
  { category: "terms_doctrine", question: "안식일은 무엇을 뜻하나요?", answer: "안식일은 하나님 안에서 쉬며 예배하는 거룩한 날을 뜻합니다.", keywords: ["안식일", "쉼"] },
  { category: "terms_doctrine", question: "유월절은 무엇을 기억하는 절기인가요?", answer: "유월절은 하나님께서 이스라엘을 애굽에서 구원하신 일을 기억하는 절기입니다.", keywords: ["유월절", "출애굽"] },
  { category: "terms_doctrine", question: "세례는 무엇을 의미하나요?", answer: "세례는 예수 그리스도를 믿는 믿음을 고백하며, 새 생명과 정결을 상징하는 예식입니다.", keywords: ["세례", "믿음 고백"] },
  { category: "terms_doctrine", question: "성찬은 무엇을 기념하나요?", answer: "성찬은 예수님의 몸과 피로 세워진 새 언약과 십자가의 은혜를 기념합니다.", keywords: ["성찬", "십자가", "새 언약"] },
  { category: "terms_doctrine", question: "제자라는 말은 무엇을 뜻하나요?", answer: "제자는 스승을 따르며 배우는 사람을 뜻합니다. 성경에서는 예수님을 따르는 사람을 가리킵니다.", keywords: ["제자", "따르는 사람"] },
  { category: "terms_doctrine", question: "사도라는 말은 무엇을 뜻하나요?", answer: "사도는 보냄을 받은 사람이라는 뜻입니다.", keywords: ["사도", "보냄"] },
  { category: "terms_doctrine", question: "회당은 무엇인가요?", answer: "회당은 유대인들이 모여 예배하고 성경을 배우던 장소입니다.", keywords: ["회당", "유대인"] },
  { category: "terms_doctrine", question: "성막은 무엇인가요?", answer: "성막은 광야 시절 하나님께 예배하기 위해 세워진 이동식 성소입니다.", keywords: ["성막", "광야"] },
  { category: "terms_doctrine", question: "성전은 무엇인가요?", answer: "성전은 예루살렘에 세워진 하나님 예배의 중심 장소입니다.", keywords: ["성전", "예루살렘"] },
  { category: "terms_doctrine", question: "바리새인은 어떤 사람들이었나요?", answer: "바리새인은 율법과 전통을 엄격히 지키려 했던 유대 종교 지도자 그룹입니다.", keywords: ["바리새인", "율법"] },
  { category: "terms_doctrine", question: "사두개인은 무엇으로 유명한가요?", answer: "사두개인은 부활을 믿지 않았던 유대 지도자 그룹으로 알려져 있습니다.", keywords: ["사두개인", "부활"] },
  { category: "terms_doctrine", question: "십일조는 무엇인가요?", answer: "십일조는 소득의 십 분의 일을 하나님께 드리는 헌신을 가리킵니다.", keywords: ["십일조", "십 분의 일"] },
  { category: "terms_doctrine", question: "은혜는 무엇인가요?", answer: "은혜는 받을 자격이 없는 사람에게 베푸시는 하나님의 값없는 호의입니다.", keywords: ["은혜", "값없는 호의"] },
];

const BIBLE_PEOPLE_AND_RELATIONSHIPS_FAQ_SEEDS: FaqSeed[] = [
  { category: "people_relationships", question: "아론은 모세와 어떤 관계인가요?", answer: "아론은 모세의 형입니다.", keywords: ["아론", "모세"] },
  { category: "people_relationships", question: "미리암은 모세와 어떤 관계인가요?", answer: "미리암은 모세의 누나입니다.", keywords: ["미리암", "모세"] },
  { category: "people_relationships", question: "여호수아와 갈렙은 무엇으로 유명한가요?", answer: "여호수아와 갈렙은 가나안 정탐 때 믿음의 보고를 한 인물로 유명합니다.", keywords: ["여호수아", "갈렙", "정탐"] },
  { category: "people_relationships", question: "룻은 누구와 결혼했나요?", answer: "룻은 보아스와 결혼했습니다.", keywords: ["룻", "보아스"] },
  { category: "people_relationships", question: "한나는 누구의 어머니인가요?", answer: "한나는 사무엘의 어머니입니다.", keywords: ["한나", "사무엘"] },
  { category: "people_relationships", question: "에스더는 무엇으로 기억되나요?", answer: "에스더는 자기 민족을 위해 용기 있게 왕 앞에 나아간 인물로 기억됩니다.", keywords: ["에스더", "용기"] },
  { category: "people_relationships", question: "에스라는 어떤 일로 알려져 있나요?", answer: "에스라는 하나님의 율법을 가르치고 백성을 영적으로 새롭게 세운 인물로 알려져 있습니다.", keywords: ["에스라", "율법"] },
  { category: "people_relationships", question: "느헤미야는 무엇을 재건했나요?", answer: "느헤미야는 예루살렘 성벽 재건으로 잘 알려져 있습니다.", keywords: ["느헤미야", "예루살렘 성벽"] },
  { category: "people_relationships", question: "마리아와 마르다는 어떤 관계인가요?", answer: "마리아와 마르다는 나사로의 자매입니다.", keywords: ["마리아", "마르다", "나사로"] },
  { category: "people_relationships", question: "나사로는 어떤 사건으로 잘 알려져 있나요?", answer: "나사로는 예수님께서 죽은 지 나흘 된 뒤 다시 살리신 사건으로 잘 알려져 있습니다.", keywords: ["나사로", "부활"] },
  { category: "people_relationships", question: "디모데는 누구의 제자 같은 동역자였나요?", answer: "디모데는 바울의 사랑받는 동역자였습니다.", keywords: ["디모데", "바울"] },
  { category: "people_relationships", question: "디도는 어떤 인물인가요?", answer: "디도는 바울과 함께 교회를 돌보던 동역자입니다.", keywords: ["디도", "바울"] },
  { category: "people_relationships", question: "마가는 바나바와 어떤 관계인가요?", answer: "마가는 바나바의 친척으로 알려져 있습니다.", keywords: ["마가", "바나바"] },
  { category: "people_relationships", question: "마태는 예수님을 따르기 전에 어떤 일을 했나요?", answer: "마태는 예수님을 따르기 전에 세리로 일했습니다.", keywords: ["마태", "세리"] },
  { category: "people_relationships", question: "안드레는 베드로와 어떤 관계인가요?", answer: "안드레는 베드로의 형제입니다.", keywords: ["안드레", "베드로"] },
  { category: "people_relationships", question: "요한은 어떤 별칭으로 자주 불리나요?", answer: "요한은 사랑받는 제자라는 표현과 함께 자주 언급됩니다.", keywords: ["요한", "사랑받는 제자"] },
  { category: "people_relationships", question: "도마는 무엇으로 자주 기억되나요?", answer: "도마는 부활하신 예수님을 직접 보기 전까지 의심했던 모습으로 자주 기억됩니다.", keywords: ["도마", "의심"] },
  { category: "people_relationships", question: "브리스길라와 아굴라는 어떤 관계인가요?", answer: "브리스길라와 아굴라는 부부이며 함께 사역한 동역자들입니다.", keywords: ["브리스길라", "아굴라", "부부"] },
  { category: "people_relationships", question: "오네시모는 어느 편지에 등장하나요?", answer: "오네시모는 빌레몬서에 등장합니다.", keywords: ["오네시모", "빌레몬서"] },
  { category: "people_relationships", question: "세례 요한의 사명은 무엇이었나요?", answer: "세례 요한의 사명은 예수님의 길을 준비하고 회개를 선포하는 것이었습니다.", keywords: ["세례 요한", "회개"] },
];

const BIBLE_CHRISTIAN_LIFE_FAQ_SEEDS: FaqSeed[] = [
  { category: "christian_life", question: "성령의 열매는 어디에 기록되어 있나요?", answer: "성령의 열매는 갈라디아서 5장 22절과 23절에 기록되어 있습니다.", keywords: ["성령의 열매", "갈라디아서 5장"] },
  { category: "christian_life", question: "성령의 열매에는 어떤 것들이 있나요?", answer: "성령의 열매는 사랑, 희락, 화평, 오래 참음, 자비, 양선, 충성, 온유, 절제입니다.", keywords: ["성령의 열매", "사랑", "절제"] },
  { category: "christian_life", question: "하나님의 전신갑주는 무엇인가요?", answer: "하나님의 전신갑주는 진리의 허리띠, 의의 흉배, 평안의 복음의 신, 믿음의 방패, 구원의 투구, 성령의 검을 가리킵니다.", keywords: ["전신갑주", "에베소서 6장"] },
  { category: "christian_life", question: "큰 계명은 무엇인가요?", answer: "큰 계명은 하나님을 사랑하고 이웃을 사랑하라는 것입니다.", keywords: ["큰 계명", "하나님 사랑", "이웃 사랑"] },
  { category: "christian_life", question: "지상명령은 무엇인가요?", answer: "지상명령은 모든 민족을 제자로 삼고 세례를 베풀며 말씀으로 가르치라는 예수님의 명령입니다.", keywords: ["지상명령", "제자"] },
  { category: "christian_life", question: "팔복의 첫 번째 복은 무엇인가요?", answer: "팔복의 첫 번째 복은 심령이 가난한 자가 복이 있다는 말씀입니다.", keywords: ["팔복", "심령이 가난한 자"] },
  { category: "christian_life", question: "예수님이 가르쳐 주신 기도는 어떻게 시작하나요?", answer: "예수님이 가르쳐 주신 기도는 \"하늘에 계신 우리 아버지\"로 시작합니다.", keywords: ["주기도문", "하늘에 계신 우리 아버지"] },
  { category: "christian_life", question: "에베소서 2장 8절과 9절은 무엇을 말하나요?", answer: "에베소서 2장 8절과 9절은 우리가 은혜로 말미암아 믿음으로 구원을 받는다고 말합니다.", keywords: ["에베소서 2:8-9", "구원"] },
  { category: "christian_life", question: "로마서 10장 9절은 어떤 고백을 말하나요?", answer: "로마서 10장 9절은 예수를 주로 시인하고 하나님이 그를 죽은 자 가운데서 살리신 것을 믿는 고백을 말합니다.", keywords: ["로마서 10:9", "예수는 주"] },
  { category: "christian_life", question: "성경에서 교회는 무엇에 비유되나요?", answer: "성경에서 교회는 그리스도의 몸에 비유됩니다.", keywords: ["교회", "그리스도의 몸"] },
  { category: "christian_life", question: "교회의 머리는 누구인가요?", answer: "교회의 머리는 예수 그리스도이십니다.", keywords: ["교회의 머리", "예수 그리스도"] },
  { category: "christian_life", question: "성령님은 어떤 일을 하시나요?", answer: "성령님은 믿는 사람을 위로하시고 가르치시며, 진리 가운데로 인도하시고 능력을 주십니다.", keywords: ["성령님", "위로", "인도"] },
  { category: "christian_life", question: "삼위일체는 무엇을 뜻하나요?", answer: "삼위일체는 한 분 하나님이 성부, 성자, 성령 세 위격으로 존재하신다는 기독교 신앙 고백입니다.", keywords: ["삼위일체", "성부", "성자", "성령"] },
  { category: "christian_life", question: "사랑장이라고 불리는 성경 장은 어디인가요?", answer: "사랑장이라고 불리는 성경 장은 고린도전서 13장입니다.", keywords: ["사랑장", "고린도전서 13장"] },
  { category: "christian_life", question: "부활장이라고 자주 불리는 장은 어디인가요?", answer: "부활장이라고 자주 불리는 장은 고린도전서 15장입니다.", keywords: ["부활장", "고린도전서 15장"] },
  { category: "christian_life", question: "새 하늘과 새 땅은 어디에 기록되어 있나요?", answer: "새 하늘과 새 땅은 요한계시록 21장에 기록되어 있습니다.", keywords: ["새 하늘과 새 땅", "요한계시록 21장"] },
  { category: "christian_life", question: "고린도전서 15장에 따르면 마지막 원수는 무엇인가요?", answer: "고린도전서 15장에 따르면 마지막 원수는 죽음입니다.", keywords: ["마지막 원수", "죽음"] },
  { category: "christian_life", question: "하나님이 이사야를 부르실 때 이사야는 어떻게 대답했나요?", answer: "이사야는 \"내가 여기 있나이다. 나를 보내소서\"라고 대답했습니다.", keywords: ["이사야", "나를 보내소서"] },
  { category: "christian_life", question: "하박국 2장 4절의 핵심 메시지는 무엇인가요?", answer: "하박국 2장 4절의 핵심 메시지는 의인은 믿음으로 말미암아 살리라는 것입니다.", keywords: ["하박국 2:4", "믿음으로"] },
  { category: "christian_life", question: "요한계시록 마지막 부분의 초청은 무엇인가요?", answer: "요한계시록 마지막 부분은 생명수를 값없이 받으라는 초청으로 마무리됩니다.", keywords: ["요한계시록", "생명수"] },
];

const BIBLE_FAQ_SEEDS: FaqSeed[] = [
  ...BIBLE_OVERVIEW_FAQ_SEEDS,
  ...BIBLE_OLD_TESTAMENT_FOUNDATIONS_FAQ_SEEDS,
  ...BIBLE_OLD_TESTAMENT_HISTORY_AND_PROPHETS_FAQ_SEEDS,
  ...BIBLE_JESUS_LIFE_FAQ_SEEDS,
  ...BIBLE_JESUS_TEACHINGS_FAQ_SEEDS,
  ...BIBLE_ACTS_AND_CHURCH_FAQ_SEEDS,
  ...BIBLE_LETTERS_AND_BOOKS_FAQ_SEEDS,
  ...BIBLE_TERMS_AND_DOCTRINE_FAQ_SEEDS,
  ...BIBLE_PEOPLE_AND_RELATIONSHIPS_FAQ_SEEDS,
  ...BIBLE_CHRISTIAN_LIFE_FAQ_SEEDS,
];

export const CHURCH_FAQ_DB = withIds("church", CHURCH_FAQ_SEEDS);
export const BIBLE_FAQ_DB = withIds("bible", BIBLE_FAQ_SEEDS);
export const CHATBOT_FAQ_DB = [...CHURCH_FAQ_DB, ...BIBLE_FAQ_DB];

if (CHURCH_FAQ_DB.length !== 50) {
  throw new Error(`CHURCH_FAQ_DB must contain 50 entries, received ${CHURCH_FAQ_DB.length}`);
}

if (BIBLE_FAQ_DB.length !== 200) {
  throw new Error(`BIBLE_FAQ_DB must contain 200 entries, received ${BIBLE_FAQ_DB.length}`);
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

function scoreFaqEntry(query: string, entry: FaqEntry): number {
  const normalizedQuery = normalize(query);
  const compactQuery = compact(query);
  const tokens = tokenize(query);
  const normalizedQuestion = normalize(entry.question);
  const compactQuestion = compact(entry.question);
  const normalizedAnswer = normalize(entry.answer);
  const keywordText = normalize(entry.keywords.join(" "));

  let score = 0;

  if (!normalizedQuery) return score;
  if (normalizedQuery === normalizedQuestion) score += 180;
  if (compactQuery && compactQuery === compactQuestion) score += 180;
  if (normalizedQuestion.includes(normalizedQuery)) score += 70;
  if (normalizedQuery.includes(normalizedQuestion)) score += 55;
  if (compactQuestion.includes(compactQuery) && compactQuery.length >= 4) score += 45;

  for (const token of tokens) {
    if (normalizedQuestion.includes(token)) score += token.length >= 4 ? 18 : 10;
    if (keywordText.includes(token)) score += token.length >= 4 ? 15 : 8;
    if (normalizedAnswer.includes(token)) score += token.length >= 4 ? 6 : 3;
  }

  return score;
}

export function searchFaqEntries(
  query: string,
  limit = 5,
  scope?: FaqScope,
): FaqEntry[] {
  const pool = scope ? CHATBOT_FAQ_DB.filter((entry) => entry.scope === scope) : CHATBOT_FAQ_DB;

  return pool
    .map((entry) => ({ entry, score: scoreFaqEntry(query, entry) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

function isNextGenerationWorshipIntent(query: string): boolean {
  return /예배|시간|장소|어디|어디서|예배실|모이|몇\s*시|안내/i.test(query);
}

function findFaqAnswerByQuestion(question: string): string | null {
  return CHATBOT_FAQ_DB.find((entry) => entry.scope === "church" && entry.question === question)?.answer ?? null;
}

function findDirectNextGenerationReply(query: string): string | null {
  if (!isNextGenerationWorshipIntent(query)) return null;

  const normalizedQuery = normalize(query);
  const departmentFlags = [
    /유초등부|유치부|아동부|초등부/.test(normalizedQuery),
    /중고등부|청소년|고등부/.test(normalizedQuery),
    /청년부|청년|대학생/.test(normalizedQuery),
  ];
  const departmentCount = departmentFlags.filter(Boolean).length;

  if (departmentCount !== 1) return null;

  if (/유초등부/.test(normalizedQuery)) {
    return findFaqAnswerByQuestion("유초등부 예배 시간은 언제인가요?");
  }

  if (/유치부/.test(normalizedQuery)) {
    return findFaqAnswerByQuestion("유치부는 어디에서 모이나요?");
  }

  if (/아동부|초등부/.test(normalizedQuery)) {
    return findFaqAnswerByQuestion("아동부는 어디에서 모이나요?");
  }

  if (/중고등부|청소년|고등부/.test(normalizedQuery)) {
    return findFaqAnswerByQuestion("중고등부 예배 시간은 언제인가요?");
  }

  if (/청년부|청년|대학생/.test(normalizedQuery)) {
    return findFaqAnswerByQuestion("청년부 예배 시간은 언제인가요?");
  }

  return null;
}

export function findFaqReply(query: string, scope?: FaqScope): string | null {
  if (!scope || scope === "church") {
    const directReply = findDirectNextGenerationReply(query);
    if (directReply) {
      return directReply;
    }
  }

  const best = searchFaqEntries(query, 1, scope)[0];
  if (!best) return null;

  const normalizedQuery = normalize(query);
  const compactQuery = compact(query);
  const haystack = normalize(`${best.question} ${best.keywords.join(" ")}`);
  const overlap = tokenize(query).filter((token) => haystack.includes(token));

  if (normalizedQuery === normalize(best.question) || compactQuery === compact(best.question)) {
    return best.answer;
  }

  if (overlap.length >= 1) {
    return best.answer;
  }

  return null;
}

export function serializeFaqEntries(entries: FaqEntry[]): string {
  return entries
    .map((entry) => `[${entry.scope === "church" ? "교회 FAQ" : "성경 FAQ"}]\n질문: ${entry.question}\n답변: ${entry.answer}`)
    .join("\n\n");
}
