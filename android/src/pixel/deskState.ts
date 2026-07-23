import AsyncStorage from "@react-native-async-storage/async-storage";
import { EMPTY_PLACEMENT, itemById, SlotId } from "./catalog";

const KEY = "teum.desk.v1";

/**
 * 픽셀 데스크 상태 (기획서 §6.5) — 기기에만 저장.
 * 소장 여부는 저장하지 않고 cumulativeDone과 카탈로그에서 계산한다.
 */
export interface DeskState {
  version: 1;
  /** 누적 챙김 — 마일스톤 도착 판정의 단일 근거. 기록 삭제와 독립. */
  cumulativeDone: number;
  /** 사용자가 바꾼 슬롯만 저장. 없으면 기본 배치. */
  placements: Partial<Record<SlotId, string>>;
}

export const EMPTY_DESK: DeskState = { version: 1, cumulativeDone: 0, placements: {} };

export async function loadDeskState(): Promise<DeskState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return EMPTY_DESK;
    const parsed = JSON.parse(raw) as Partial<DeskState>;
    const placements: DeskState["placements"] = {};
    // 알 수 없는 아이템 id는 무시하고 기본 배치로 대체한다 (검증 기준 10).
    for (const [slot, id] of Object.entries(parsed.placements ?? {})) {
      if (typeof id === "string" && (id === EMPTY_PLACEMENT || itemById(id))) {
        placements[slot as SlotId] = id;
      }
    }
    return {
      version: 1,
      cumulativeDone: Math.max(0, Number(parsed.cumulativeDone) || 0),
      placements
    };
  } catch {
    return EMPTY_DESK;
  }
}

export async function saveDeskState(state: DeskState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 다음 저장 때 재시도된다.
  }
}
