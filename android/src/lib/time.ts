import { Settings } from "../types";

export const SNOOZE_MS = 5 * 60 * 1000;

/** 알림 간격 (ms) */
export function intervalMs(s: Settings) {
  return s.intervalMin * 60 * 1000;
}

export function minutesOfDay(ms: number) {
  const d = new Date(ms);
  return d.getHours() * 60 + d.getMinutes();
}

/** 해당 시각이 업무 시간(요일 + 시간대) 안인지 */
export function isWithinWork(ms: number, s: Settings) {
  const d = new Date(ms);
  if (!s.days.includes(d.getDay())) return false;
  const m = minutesOfDay(ms);
  return m >= s.startMin && m <= s.endMin;
}

/** afterMs 이후 처음 오는 업무 시작 시각. 근무 요일이 없으면 null. */
export function nextWindowStart(afterMs: number, s: Settings): number | null {
  if (s.days.length === 0) return null;
  const base = new Date(afterMs);
  for (let i = 0; i <= 14; i += 1) {
    const day = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate() + i,
      Math.floor(s.startMin / 60),
      s.startMin % 60,
      0,
      0
    );
    if (day.getTime() > afterMs && s.days.includes(day.getDay())) {
      return day.getTime();
    }
  }
  return null;
}

/**
 * fromMs 기준 다음 정규 알림 시각.
 * 규칙: 기준 시점 + 알림 간격. 업무 시간을 벗어나면 다음 업무 시작 + 간격.
 */
export function nextTickFrom(fromMs: number, s: Settings): number | null {
  if (s.days.length === 0) return null;
  let from = fromMs;
  for (let i = 0; i < 30; i += 1) {
    const candidate = from + intervalMs(s);
    if (isWithinWork(candidate, s)) return candidate;
    const start = nextWindowStart(candidate, s);
    if (start == null) return null;
    from = start;
  }
  return null;
}

/** 오늘 업무 종료 시각(epoch ms) */
export function endOfWorkToday(nowMs: number, s: Settings): number {
  const d = new Date(nowMs);
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    Math.floor(s.endMin / 60),
    s.endMin % 60,
    0,
    0
  ).getTime();
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** 540 → "09:00" */
export function fmtHM(min: number) {
  return `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`;
}

/** epoch ms → "오후 2:30" */
export function fmtKoreanTime(ms: number) {
  const d = new Date(ms);
  const h = d.getHours();
  const meridiem = h < 12 ? "오전" : "오후";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${meridiem} ${hour12}:${pad2(d.getMinutes())}`;
}

/** epoch ms → "오후 2:30" / "내일 오전 10:00" / "월요일 오전 10:00" */
export function fmtKoreanDayTime(ms: number, nowMs: number) {
  const d = new Date(ms);
  const n = new Date(nowMs);
  const time = fmtKoreanTime(ms);
  if (d.toDateString() === n.toDateString()) return time;
  const tomorrow = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return `내일 ${time}`;
  return `${DAY_LABELS[d.getDay()]}요일 ${time}`;
}

/** 남은 시간을 "24분" / "1시간 2분" 형태로 */
export function fmtRemaining(ms: number) {
  const totalMin = Math.max(0, Math.ceil(ms / 60000));
  if (totalMin >= 60) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
  }
  return `${totalMin}분`;
}

/** 간격(분) → "약 1시간" / "약 1시간 30분" / "약 45분" */
export function fmtIntervalKorean(min: number) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m === 0 ? `약 ${h}시간` : `약 ${h}시간 ${m}분`;
  }
  return `약 ${min}분`;
}

export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;
