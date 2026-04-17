/**
 * 챗봇 DB 어댑터 — c0009 기존 패턴(Upstash Redis REST) 사용
 * n0008 Stella 챗봇 D1(SQLite) 로직을 Redis 키/리스트 구조로 포팅
 *
 * 필요 환경변수:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * 키 규칙:
 *   cb:conv:{id}                → 대화 메타데이터 (JSON)
 *   cb:conv:list                → 대화 ID 리스트 (최신순, LPUSH)
 *   cb:msgs:{conv_id}           → 메시지 리스트 (JSON 엔트리, RPUSH — 시간순)
 *   cb:ticket:{id}              → 티켓 (JSON)
 *   cb:ticket:seq               → 티켓 자동증가 번호
 *   cb:ticket:list              → 티켓 ID 리스트 (최신순, LPUSH)
 *   cb:escalation:{id}          → 에스컬레이션 (JSON)
 *   cb:escalation:seq           → 자동증가 번호
 *   cb:escalation:list          → ID 리스트
 *   cb:settings                 → 설정 JSON (hash-like)
 *   cb:analytics:list           → 이벤트 이력 리스트 (RPUSH, 최근 10000개만 유지)
 *   cb:csat:{conv_id}           → CSAT 평점 (JSON)
 *   cb:email:{email}            → 이메일 수집 기록 (JSON)
 *   cb:email:list               → 이메일 목록
 */

/* ── Redis REST 저수준 호출 ─────────────────────────────────── */
function hasRedis(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redis<T = unknown>(...cmd: (string | number)[]): Promise<T | null> {
  if (!hasRedis()) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  try {
    const res = await fetch(`${url}/${cmd.map((c) => encodeURIComponent(String(c))).join("/")}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const json = (await res.json()) as { result?: T; error?: string };
    if (json.error) {
      console.error("[chatbot-db] redis error:", cmd[0], json.error);
      return null;
    }
    return (json.result ?? null) as T | null;
  } catch (e) {
    console.error("[chatbot-db] redis fetch failed:", cmd[0], e);
    return null;
  }
}

/* body가 긴 경우(POST body) */
async function redisPost<T = unknown>(cmd: (string | number)[], body: string): Promise<T | null> {
  if (!hasRedis()) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  try {
    const path = cmd.map((c) => encodeURIComponent(String(c))).join("/");
    const res = await fetch(`${url}/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "text/plain" },
      body,
      cache: "no-store",
    });
    const json = (await res.json()) as { result?: T; error?: string };
    if (json.error) {
      console.error("[chatbot-db] redis post error:", cmd[0], json.error);
      return null;
    }
    return (json.result ?? null) as T | null;
  } catch (e) {
    console.error("[chatbot-db] redis post failed:", cmd[0], e);
    return null;
  }
}

async function getJson<T>(key: string): Promise<T | null> {
  const raw = await redis<string>("get", key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function setJson<T>(key: string, value: T): Promise<void> {
  await redisPost(["set", key], JSON.stringify(value));
}

async function lpushJson<T>(key: string, value: T): Promise<void> {
  await redisPost(["lpush", key], JSON.stringify(value));
}

async function rpushJson<T>(key: string, value: T): Promise<void> {
  await redisPost(["rpush", key], JSON.stringify(value));
}

async function lrangeJson<T>(key: string, start: number, stop: number): Promise<T[]> {
  const list = (await redis<string[]>("lrange", key, start, stop)) || [];
  const out: T[] = [];
  for (const raw of list) {
    try {
      out.push(JSON.parse(raw) as T);
    } catch {}
  }
  return out;
}

async function llen(key: string): Promise<number> {
  const n = await redis<number>("llen", key);
  return n || 0;
}

async function incr(key: string): Promise<number> {
  const n = await redis<number>("incr", key);
  return n || 0;
}

async function ltrim(key: string, start: number, stop: number): Promise<void> {
  await redis("ltrim", key, start, stop);
}

/* ── 타입 정의 ──────────────────────────────────────────────── */
export interface ConversationRow {
  id: string;
  visitor_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  pages_visited: string | null;
  first_message: string | null;
  last_message: string | null;
  msg_count: number;
  status: string; // open | handled | resolved | escalated
  language: string | null;
  escalated: number; // 0/1
  is_member: number; // 0/1
  last_active_at: string | null;
  created_at: string;
}

export interface MessageRow {
  id: number; // ms timestamp
  conversation_id: string;
  role: string; // user | assistant | agent
  content: string;
  page_url: string | null;
  language: string | null;
  created_at: string;
}

export interface TicketRow {
  id: number;
  conversation_id: string | null;
  visitor_id: string | null;
  email: string | null;
  name: string | null;
  subject: string;
  message: string;
  language: string | null;
  status: string; // open | in_progress | resolved
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface EscalationRow {
  id: number;
  conversation_id: string | null;
  visitor_id: string | null;
  email: string | null;
  message: string;
  language: string | null;
  status: string; // pending | notified | handled
  notified_at: string | null;
  handled_at: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  event_type: string;
  conversation_id: string | null;
  visitor_id: string | null;
  page_url: string | null;
  language: string | null;
  created_at: string;
}

export interface CsatRow {
  conversation_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
}

export interface EmailContactRow {
  conversation_id: string | null;
  visitor_id: string | null;
  email: string;
  language: string | null;
  sequence_step: number;
  next_email_at: string | null;
  created_at: string;
}

/* ── 대화 ────────────────────────────────────────────────────── */
export async function getConversation(id: string): Promise<ConversationRow | null> {
  return getJson<ConversationRow>(`cb:conv:${id}`);
}

export async function saveConversation(c: ConversationRow): Promise<void> {
  await setJson(`cb:conv:${c.id}`, c);
}

export async function createConversation(c: ConversationRow): Promise<void> {
  await setJson(`cb:conv:${c.id}`, c);
  await redis("lpush", "cb:conv:list", c.id);
}

export async function listConversationIds(start = 0, stop = 999): Promise<string[]> {
  const list = (await redis<string[]>("lrange", "cb:conv:list", start, stop)) || [];
  return list;
}

export async function listConversations(limit = 500): Promise<ConversationRow[]> {
  const ids = await listConversationIds(0, limit - 1);
  if (!ids.length) return [];
  const out: ConversationRow[] = [];
  for (const id of ids) {
    const c = await getConversation(id);
    if (c) out.push(c);
  }
  return out;
}

export async function updateConversationStatus(id: string, status: string): Promise<void> {
  const c = await getConversation(id);
  if (!c) return;
  c.status = status;
  await saveConversation(c);
}

export async function markConversationEscalated(id: string): Promise<void> {
  const c = await getConversation(id);
  if (!c) return;
  c.escalated = 1;
  c.status = "escalated";
  await saveConversation(c);
}

/* ── 메시지 ────────────────────────────────────────────────── */
export async function appendMessage(m: Omit<MessageRow, "id" | "created_at"> & { id?: number; created_at?: string }): Promise<MessageRow> {
  const row: MessageRow = {
    id: m.id ?? Date.now(),
    conversation_id: m.conversation_id,
    role: m.role,
    content: m.content,
    page_url: m.page_url ?? null,
    language: m.language ?? null,
    created_at: m.created_at || new Date().toISOString(),
  };
  await rpushJson(`cb:msgs:${m.conversation_id}`, row);
  return row;
}

export async function getMessages(convId: string, limit = 40): Promise<MessageRow[]> {
  return lrangeJson<MessageRow>(`cb:msgs:${convId}`, -limit, -1);
}

/* ── 티켓 ──────────────────────────────────────────────────── */
export async function createTicket(
  t: Omit<TicketRow, "id" | "created_at" | "resolved_at" | "status" | "assigned_to"> & {
    status?: string;
  },
): Promise<TicketRow> {
  const id = await incr("cb:ticket:seq");
  const row: TicketRow = {
    id,
    conversation_id: t.conversation_id ?? null,
    visitor_id: t.visitor_id ?? null,
    email: t.email ?? null,
    name: t.name ?? null,
    subject: t.subject,
    message: t.message,
    language: t.language ?? null,
    status: t.status || "open",
    assigned_to: null,
    resolved_at: null,
    created_at: new Date().toISOString(),
  };
  await setJson(`cb:ticket:${id}`, row);
  await redis("lpush", "cb:ticket:list", String(id));
  return row;
}

export async function listTickets(status?: string): Promise<TicketRow[]> {
  const ids = (await redis<string[]>("lrange", "cb:ticket:list", 0, 499)) || [];
  const out: TicketRow[] = [];
  for (const id of ids) {
    const row = await getJson<TicketRow>(`cb:ticket:${id}`);
    if (!row) continue;
    if (status && status !== "all" && row.status !== status) continue;
    out.push(row);
  }
  return out;
}

export async function updateTicket(
  id: number,
  patch: { status?: string; assigned_to?: string | null },
): Promise<TicketRow | null> {
  const row = await getJson<TicketRow>(`cb:ticket:${id}`);
  if (!row) return null;
  if (patch.status) {
    row.status = patch.status;
    if (patch.status === "resolved") row.resolved_at = new Date().toISOString();
  }
  if (patch.assigned_to !== undefined) row.assigned_to = patch.assigned_to;
  await setJson(`cb:ticket:${id}`, row);
  return row;
}

/* ── 에스컬레이션 ──────────────────────────────────────────── */
export async function createEscalation(
  e: Omit<EscalationRow, "id" | "created_at" | "status" | "notified_at" | "handled_at">,
): Promise<EscalationRow> {
  const id = await incr("cb:escalation:seq");
  const row: EscalationRow = {
    id,
    conversation_id: e.conversation_id ?? null,
    visitor_id: e.visitor_id ?? null,
    email: e.email ?? null,
    message: e.message,
    language: e.language ?? null,
    status: "pending",
    notified_at: new Date().toISOString(),
    handled_at: null,
    created_at: new Date().toISOString(),
  };
  await setJson(`cb:escalation:${id}`, row);
  await redis("lpush", "cb:escalation:list", String(id));
  return row;
}

export async function listEscalations(): Promise<EscalationRow[]> {
  const ids = (await redis<string[]>("lrange", "cb:escalation:list", 0, 499)) || [];
  const out: EscalationRow[] = [];
  for (const id of ids) {
    const row = await getJson<EscalationRow>(`cb:escalation:${id}`);
    if (row) out.push(row);
  }
  return out;
}

/* ── 설정 ──────────────────────────────────────────────────── */
export async function getSettings(): Promise<Record<string, string>> {
  const raw = await getJson<Record<string, string>>("cb:settings");
  return raw || {};
}

export async function getSetting(key: string): Promise<string> {
  const all = await getSettings();
  return all[key] ?? "";
}

export async function setSetting(key: string, value: string): Promise<void> {
  const all = await getSettings();
  all[key] = value;
  await setJson("cb:settings", all);
}

export async function setManySettings(patch: Record<string, string>): Promise<void> {
  const all = await getSettings();
  for (const [k, v] of Object.entries(patch)) {
    all[k] = v;
  }
  await setJson("cb:settings", all);
}

/* ── 분석 이벤트 ──────────────────────────────────────────── */
export async function logAnalytics(ev: Omit<AnalyticsEvent, "created_at">): Promise<void> {
  const row: AnalyticsEvent = { ...ev, created_at: new Date().toISOString() };
  await rpushJson("cb:analytics:list", row);
  // 리스트 10000개 제한 — 맨 앞 오래된 것 제거
  await ltrim("cb:analytics:list", -10000, -1);
}

export async function listAnalytics(sinceMs?: number): Promise<AnalyticsEvent[]> {
  const rows = await lrangeJson<AnalyticsEvent>("cb:analytics:list", 0, -1);
  if (!sinceMs) return rows;
  return rows.filter((r) => new Date(r.created_at).getTime() >= sinceMs);
}

/* ── CSAT ──────────────────────────────────────────────────── */
export async function saveCsat(c: Omit<CsatRow, "created_at">): Promise<void> {
  const row: CsatRow = { ...c, created_at: new Date().toISOString() };
  await setJson(`cb:csat:${c.conversation_id}`, row);
}

export async function listCsat(): Promise<CsatRow[]> {
  // 편의: 전체 대화 ID 기반으로 스캔
  const ids = await listConversationIds(0, 999);
  const out: CsatRow[] = [];
  for (const id of ids) {
    const r = await getJson<CsatRow>(`cb:csat:${id}`);
    if (r) out.push(r);
  }
  return out;
}

/* ── 이메일 수집 ──────────────────────────────────────────── */
export async function upsertEmailContact(e: Omit<EmailContactRow, "created_at">): Promise<boolean> {
  const key = `cb:email:${e.email.toLowerCase()}`;
  const existing = await getJson<EmailContactRow>(key);
  if (existing) return false;
  const row: EmailContactRow = { ...e, created_at: new Date().toISOString() };
  await setJson(key, row);
  await redis("lpush", "cb:email:list", e.email.toLowerCase());
  return true;
}

export async function countEmailContacts(): Promise<number> {
  return llen("cb:email:list");
}

/* ── ID 생성기 ─────────────────────────────────────────────── */
export function generateConvId(): string {
  return "cv_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function generateVisitorId(): string {
  return "v_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ── Redis 연결 여부 ─────────────────────────────────────── */
export function chatbotDbReady(): boolean {
  return hasRedis();
}
