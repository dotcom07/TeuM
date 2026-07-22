import AsyncStorage from "@react-native-async-storage/async-storage";
import { BreakRecord } from "../types";

const KEY = "teum.records.v1";
// 하루 최대 수십 회차 × 수년치도 문제없는 상한. 넘으면 오래된 것부터 버린다.
const MAX_RECORDS = 4000;

export async function loadRecords(): Promise<BreakRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BreakRecord[]) : [];
  } catch {
    return [];
  }
}

export async function appendRecord(records: BreakRecord[], record: BreakRecord): Promise<BreakRecord[]> {
  const next = [...records, record].slice(-MAX_RECORDS);
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 저장 실패 시 메모리 상태만 유지한다. 다음 저장 때 재시도된다.
  }
  return next;
}

export async function clearRecords(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // 앱 데이터 삭제로도 지울 수 있으므로 치명적이지 않다.
  }
}

function sameDay(ms: number, y: number, m: number, d: number) {
  const t = new Date(ms);
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
}

/** 해당 월의 날짜별 챙긴 횟수. 0인 날은 포함하지 않는다. */
export function doneCountsByDay(records: BreakRecord[], year: number, month: number): Map<number, number> {
  const counts = new Map<number, number>();
  for (const r of records) {
    if (r.result !== "done") continue;
    const t = new Date(r.resolvedAt);
    if (t.getFullYear() !== year || t.getMonth() !== month) continue;
    counts.set(t.getDate(), (counts.get(t.getDate()) ?? 0) + 1);
  }
  return counts;
}

/** 특정 날짜의 회차 기록, 시간순 */
export function recordsForDate(records: BreakRecord[], year: number, month: number, day: number): BreakRecord[] {
  return records
    .filter((r) => sameDay(r.resolvedAt, year, month, day))
    .sort((a, b) => a.resolvedAt - b.resolvedAt);
}

/** 오늘 챙긴 횟수 */
export function doneCountToday(records: BreakRecord[], nowMs: number): number {
  const t = new Date(nowMs);
  return recordsForDate(records, t.getFullYear(), t.getMonth(), t.getDate()).filter(
    (r) => r.result === "done"
  ).length;
}
