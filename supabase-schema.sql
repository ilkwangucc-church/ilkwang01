-- 일광교회 Supabase 스키마
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- 1. 사이트 콘텐츠 (CMS)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL DEFAULT 'text', -- 'text' | 'image' | 'json'
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 교적 (church_members) — 관리자 직접 입력
CREATE TABLE IF NOT EXISTS church_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  group_name TEXT, -- 예배부, 청년부 등
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 일반 회원 (members) — 사용자 회원가입
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  birth_date DATE,
  dept TEXT, -- 소속 부서
  role SMALLINT NOT NULL DEFAULT 2, -- 1:방문자 2:일반회원 3:성도 4:부서관리자 5:관리자
  church_member_id UUID REFERENCES church_members(id), -- 교적 매칭
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 설교 (sermons)
CREATE TABLE IF NOT EXISTS sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  preacher TEXT NOT NULL DEFAULT '담임목사',
  date DATE NOT NULL,
  youtube_url TEXT,
  scripture TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT '주일예배', -- 주일예배 | 수요예배 | 새벽기도 | 특별예배
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 공지사항 (notices)
CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '공지',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 블로그/커뮤니티 포스트 (blog_posts)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '일반', -- 청년부 | 중고등부 | 주일학교 | 선교부 | 일반
  author_id UUID REFERENCES members(id),
  slug TEXT NOT NULL UNIQUE,
  thumbnail TEXT,
  tags TEXT[], -- 태그 배열
  published BOOLEAN NOT NULL DEFAULT TRUE,
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 헌금 현황 (offerings)
CREATE TABLE IF NOT EXISTS offerings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '익명',
  amount BIGINT NOT NULL,
  type TEXT NOT NULL DEFAULT '주일헌금', -- 십일조 | 주일헌금 | 감사헌금 | 선교헌금 | 건축헌금 | 기타
  date DATE NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 갤러리 (gallery)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '예배',
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 설정
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (비회원도 읽을 수 있음)
CREATE POLICY "공개 읽기" ON sermons FOR SELECT USING (published = TRUE);
CREATE POLICY "공개 읽기" ON notices FOR SELECT USING (published = TRUE);
CREATE POLICY "공개 읽기" ON blog_posts FOR SELECT USING (published = TRUE);
CREATE POLICY "공개 읽기" ON gallery FOR SELECT USING (TRUE);
CREATE POLICY "공개 읽기" ON site_content FOR SELECT USING (TRUE);

-- 관리자만 쓰기 (service_role key 사용)
-- 실제 운영 시 Supabase Auth의 role 컬럼으로 세분화 필요

-- 기본 데이터 삽입 (선택)
INSERT INTO site_content (section_key, content_type, value) VALUES
  ('hero_title', 'text', '행복과 영원으로 초대하는 교회'),
  ('hero_subtitle', 'text', '일광교회에 오신 것을 환영합니다'),
  ('about_desc', 'text', '1971년 설립된 일광교회는 대한예수교장로회(합동) 소속으로 성북구 동소문로 212-68에 위치합니다.'),
  ('phone', 'text', '02-927-0691'),
  ('address', 'text', '서울 성북구 동소문로 212-68'),
  ('email', 'text', 'ilkwang@ilkwang.or.kr')
ON CONFLICT (section_key) DO NOTHING;
