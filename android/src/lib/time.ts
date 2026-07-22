import { Settings } from "../types";
import type { AppLanguage } from "../i18n";

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

export function fmtTime(ms: number, language: AppLanguage) {
  const d = new Date(ms);
  const h = d.getHours();
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const meridiem = language === "ko" ? (h < 12 ? "오전" : "오후") : h < 12 ? "AM" : "PM";
  return language === "ko"
    ? `${meridiem} ${hour12}:${pad2(d.getMinutes())}`
    : `${hour12}:${pad2(d.getMinutes())} ${meridiem}`;
}

export function fmtDayTime(ms: number, nowMs: number, language: AppLanguage) {
  const d = new Date(ms);
  const n = new Date(nowMs);
  const time = fmtTime(ms, language);
  if (d.toDateString() === n.toDateString()) return time;
  const tomorrow = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) {
    return language === "ko" ? `내일 ${time}` : `Tomorrow ${time}`;
  }
  return language === "ko"
    ? `${DAY_LABELS_KO[d.getDay()]}요일 ${time}`
    : `${DAY_NAMES_EN[d.getDay()]} ${time}`;
}

export function fmtRemaining(ms: number, language: AppLanguage) {
  const totalMin = Math.max(0, Math.ceil(ms / 60000));
  if (totalMin >= 60) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (language === "ko") return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
  }
  return language === "ko" ? `${totalMin}분` : `${totalMin} min`;
}

export function fmtInterval(min: number, language: AppLanguage) {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (language === "ko") return m === 0 ? `약 ${h}시간` : `약 ${h}시간 ${m}분`;
    return m === 0 ? `about ${h} hr` : `about ${h} hr ${m} min`;
  }
  return language === "ko" ? `약 ${min}분` : `about ${min} min`;
}

export const DAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;
export const DAY_LABELS_EN = ["S", "M", "T", "W", "T", "F", "S"] as const;
export const DAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export function dayLabels(language: AppLanguage) {
  return language === "ko" ? DAY_LABELS_KO : DAY_LABELS_EN;
}
