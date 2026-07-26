import type { SlotId } from "./catalog";

/** 실제 카탈로그에 연결하기 전, 2테마 단위로 검수하는 도트 원본. */
export interface ThemeArtItem {
  id: string;
  nameKo: string;
  nameEn: string;
  slots: SlotId[];
  rows: string[];
  /** 실제 날짜에만 랜덤 후보가 되는 테마 내 기간 한정 아이템. */
  limited: boolean;
}

export interface ThemeArtwork {
  key: string;
  labelKo: string;
  labelEn: string;
  items: ThemeArtItem[];
  /** 신규 테마는 3, 기존 라이벌처럼 기간 한정이 없는 테마는 0. */
  expectedLimited?: number;
}
