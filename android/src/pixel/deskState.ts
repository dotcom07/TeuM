import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EMPTY_PLACEMENT,
  ITEM_CATALOG,
  itemById
} from "./catalog";
import type { SlotId } from "./catalog";

const KEY = "teum.desk.v1";

export interface DeskState {
  version: 2;
  /** 누적 챙김 — 선물상자와 선택 포인트 계산의 단일 근거. */
  cumulativeDone: number;
  /** 사용자가 바꾼 슬롯만 저장. 없으면 기본 배치. */
  placements: Partial<Record<SlotId, string>>;
  /** 랜덤 상자나 포인트로 실제 획득한 아이템. 기본·데일리는 포함하지 않아도 된다. */
  ownedItemIds: string[];
  /** 지금까지 실제로 연 선물상자 수. */
  openedGiftCount: number;
  /** 확정 획득에 사용한 누적 포인트. */
  spentChoicePoints: number;
}

export const EMPTY_DESK: DeskState = {
  version: 2,
  cumulativeDone: 0,
  placements: {},
  ownedItemIds: [],
  openedGiftCount: 0,
  spentChoicePoints: 0
};

const safeInteger = (value: unknown) =>
  Math.max(0, Math.floor(Number(value) || 0));

function normalizedPlacements(value: unknown): DeskState["placements"] {
  const placements: DeskState["placements"] = {};
  if (typeof value !== "object" || value == null || Array.isArray(value)) return placements;
  for (const [slot, id] of Object.entries(value)) {
    if (
      typeof id === "string" &&
      (id === EMPTY_PLACEMENT || itemById(id))
    ) {
      placements[slot as SlotId] = id;
    }
  }
  return placements;
}

/** 1.0.6에서 누적 횟수로 이미 열렸던 아이템은 업데이트 뒤에도 잃지 않는다. */
function legacyOwnedItemIds(cumulativeDone: number): string[] {
  return ITEM_CATALOG.filter((item) => {
    if (item.addedIn === "1.0.9") return false;
    if (item.acquire.type === "milestone") return cumulativeDone >= item.acquire.at;
    return item.acquire.type === "default" || item.acquire.type === "daily";
  }).map((item) => item.id);
}

export function normalizeDeskState(value: unknown): DeskState {
  const raw =
    typeof value === "object" && value != null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const cumulativeDone = safeInteger(raw.cumulativeDone);
  const placements = normalizedPlacements(raw.placements);
  const isV2 = raw.version === 2;
  const validIds = new Set(ITEM_CATALOG.map((item) => item.id));
  const ownedItemIds = isV2 && Array.isArray(raw.ownedItemIds)
    ? raw.ownedItemIds.filter(
        (id): id is string => typeof id === "string" && validIds.has(id)
      )
    : legacyOwnedItemIds(cumulativeDone);

  return {
    version: 2,
    cumulativeDone,
    placements,
    ownedItemIds: [...new Set(ownedItemIds)],
    // v1 사용자는 과거 구간의 상자가 한꺼번에 쌓이지 않게 열린 것으로 처리한다.
    openedGiftCount: isV2
      ? Math.min(Math.floor(cumulativeDone / 5), safeInteger(raw.openedGiftCount))
      : Math.floor(cumulativeDone / 5),
    // 과거 누적으로 번 포인트는 업데이트 직후 그대로 사용할 수 있다.
    spentChoicePoints: isV2
      ? Math.min(Math.floor(cumulativeDone / 10), safeInteger(raw.spentChoicePoints))
      : 0
  };
}

export async function loadDeskState(): Promise<DeskState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? normalizeDeskState(JSON.parse(raw)) : EMPTY_DESK;
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
