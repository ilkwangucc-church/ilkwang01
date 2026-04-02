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

-- ═══════════════════════════════════════════════════════════════
-- 추가 테이블 (v2 — 관리자 대시보드 고도화)
-- ═══════════════════════════════════════════════════════════════

-- 9. 관리자 계정 (admin_accounts)
-- 웹마스터 등 사이트 관리 전용 계정 (일반 회원과 분리)
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,             -- 이메일 방식 로그인
  password_hash TEXT NOT NULL,
  role SMALLINT NOT NULL DEFAULT 7,
  -- 역할: 1=일반회원 2=성도 3=제직 4=당회원 5=교역자 6=담임목사 7=최고관리자
  display_name TEXT NOT NULL DEFAULT '관리자',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- webmaster 계정 삽입
-- email: webmaster@ilkwang.or.kr  /  password: @Herosws413105l5
-- SHA256(@Herosws413105l5 + ilkwang_salt_2026)
INSERT INTO admin_accounts (username, email, password_hash, role, display_name) VALUES
  ('webmaster', 'webmaster@ilkwang.or.kr', '6beb97e2db6dedd29b9e8cade609c8ee105380600a46d70198b4eb7a827dc3fd', 7, '최고관리자')
ON CONFLICT (username) DO NOTHING;

-- 10. 문의 접수 (contact_submissions)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. 섬기는 사람들 (ministers)
CREATE TABLE IF NOT EXISTS ministers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,         -- 담임목사, 교육목사, 전도사, 장로 등
  department TEXT,             -- 소속 부서
  image_url TEXT,
  bio TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 데이터
INSERT INTO ministers (name, title, department, sort_order) VALUES
  ('강성원', '담임목사', '교역자', 1),
  ('김○○', '교육목사', '교역자', 2),
  ('이○○', '전도사', '교역자', 3)
ON CONFLICT DO NOTHING;

-- 12. 부서 소개 (departments)
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_name TEXT,
  meeting_time TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 데이터
INSERT INTO departments (name, description, sort_order) VALUES
  ('1부 예배', '주일 1부 예배 (오전 9시)', 1),
  ('2부 예배', '주일 2부 예배 (오전 11시)', 2),
  ('청년부', '20-30대 청년 공동체', 3),
  ('중고등부', '중학생·고등학생 공동체', 4),
  ('주일학교', '어린이 주일학교', 5),
  ('선교부', '국내외 선교 사역', 6)
ON CONFLICT DO NOTHING;

-- 13. 증명서 발급 이력 (certificates)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_name TEXT NOT NULL,
  cert_type TEXT NOT NULL,     -- 등록, 세례, 혼인, 봉사, 출석
  issued_by TEXT NOT NULL DEFAULT '일광교회',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  purpose TEXT,                -- 사용 목적
  notes TEXT,
  church_member_id UUID REFERENCES church_members(id),
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- church_members 테이블에 추가 필드 (없으면 추가)
ALTER TABLE church_members ADD COLUMN IF NOT EXISTS baptism_date DATE;
ALTER TABLE church_members ADD COLUMN IF NOT EXISTS membership_date DATE;
ALTER TABLE church_members ADD COLUMN IF NOT EXISTS role SMALLINT NOT NULL DEFAULT 2;
-- 역할: 1=일반회원 2=성도 3=제직 4=당회원 5=교역자 6=담임목사 7=최고관리자

-- members 테이블 role 범위 확장 (1~7)
-- (기존 컬럼 주석만 업데이트, 구조는 동일)
COMMENT ON COLUMN members.role IS '1=일반회원 2=성도 3=제직 4=당회원 5=교역자 6=담임목사 7=최고관리자';

-- RLS 설정
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministers ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "공개 읽기" ON ministers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "공개 읽기" ON departments FOR SELECT USING (is_active = TRUE);
