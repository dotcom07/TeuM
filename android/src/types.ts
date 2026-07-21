export type AlertMode = "silent" | "vibrate";

export interface Settings {
  /** 업무 시작, 자정 기준 분 (예: 540 = 09:00) */
  startMin: number;
  /** 업무 종료, 자정 기준 분 */
  endMin: number;
  /** 반복 요일, 0=일 … 6=토 */
  days: number[];
  /** 알림 간격 (분) */
  intervalMin: number;
  mode: AlertMode;
  /** 화면 상단 헤드업 노출 여부 */
  headsUp: boolean;
  notificationsOn: boolean;
}

export interface Rhythm {
  status: "running" | "paused";
  /** 다음 알림 예정 시각 (epoch ms). null이면 예정 없음. */
  nextTickAt: number | null;
  /** 일시정지 해제 시각 (epoch ms) */
  pausedUntil: number | null;
}

export interface Persisted {
  onboarded: boolean;
  settings: Settings;
  rhythm: Rhythm;
}

export const DEFAULT_SETTINGS: Settings = {
  startMin: 9 * 60,
  endMin: 18 * 60,
  days: [1, 2, 3, 4, 5],
  intervalMin: 60,
  mode: "silent",
  headsUp: true,
  notificationsOn: true
};

export const DEFAULT_RHYTHM: Rhythm = {
  status: "running",
  nextTickAt: null,
  pausedUntil: null
};
