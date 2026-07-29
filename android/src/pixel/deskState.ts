import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EMPTY_PLACEMENT,
  ITEM_CATALOG,
  itemById
} from "./catalog";
import type { SlotId } from "./catalog";
import {
  GIFT_INTERVAL,
  LEGACY_GIFT_INTERVAL,
  POINT_INTERVAL
} from "./rewards109";

const KEY = "teum.desk.v1";

export interface DeskState {
  version: 3;
  /** 누적 챙김 — 선물상자와 아이템 선택권 계산의 단일 근거. */
  cumulativeDone: number;
  /** 사용자가 바꾼 슬롯만 저장. 없으면 기본 배치. */
  placements: Partial<Record<SlotId, string>>;
  /** 랜덤 상자나 아이템 선택권으로 실제 획득한 아이템. */
  ownedItemIds: string[];
  /** 5회 주기에서 7회 주기로 옮긴 기존 진행률과 미개봉 상자를 보존한다. */
  giftProgressOffset: number;
  /** 지금까지 실제로 연 선물상자 수. */
  openedGiftCount: number;
  /** 아이템 선택권 사용에 소모한 누적 진행 단위. */
  spentChoicePoints: number;
}

export const EMPTY_DESK: DeskState = {
  version: 3,
  cumulativeDone: 0,
  placements: {},
  ownedItemIds: [],
  giftProgressOffset: 0,
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

function migratedGiftProgressOffset(cumulativeDone: number): number {
  const earned = Math.floor(cumulativeDone / LEGACY_GIFT_INTERVAL);
  const legacyProgress = cumulativeDone % LEGACY_GIFT_INTERVAL;
  const migratedProgress = Math.round(
    (legacyProgress / LEGACY_GIFT_INTERVAL) * GIFT_INTERVAL
  );
  return earned * GIFT_INTERVAL + migratedProgress - cumulativeDone;
}

export function normalizeDeskState(value: unknown): DeskState {
  const raw =
    typeof value === "object" && value != null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const cumulativeDone = safeInteger(raw.cumulativeDone);
  const placements = normalizedPlacements(raw.placements);
  const isV3 = raw.version === 3;
  const isV2 = raw.version === 2;
  const hasCurrentCollection = isV3 || isV2;
  const validIds = new Set(ITEM_CATALOG.map((item) => item.id));
  const ownedItemIds = hasCurrentCollection && Array.isArray(raw.ownedItemIds)
    ? raw.ownedItemIds.filter(
        (id): id is string => typeof id === "string" && validIds.has(id)
      )
    : legacyOwnedItemIds(cumulativeDone);
  const giftProgressOffset = isV3
    ? safeInteger(raw.giftProgressOffset)
    : migratedGiftProgressOffset(cumulativeDone);
  const earnedGiftCount = Math.floor(
    (cumulativeDone + giftProgressOffset) / GIFT_INTERVAL
  );

  return {
    version: 3,
    cumulativeDone,
    placements,
    ownedItemIds: [...new Set(ownedItemIds)],
    giftProgressOffset,
    // 기존 미개봉 상자는 보존하고 v1에는 과거 상자가 한꺼번에 쌓이지 않게 한다.
    openedGiftCount: hasCurrentCollection
      ? Math.min(earnedGiftCount, safeInteger(raw.openedGiftCount))
      : Math.floor(cumulativeDone / LEGACY_GIFT_INTERVAL),
    // 기존 아이템 선택권 진행과 사용 내역은 그대로 보존한다.
    spentChoicePoints: hasCurrentCollection
      ? Math.min(
          Math.floor(cumulativeDone / POINT_INTERVAL),
          safeInteger(raw.spentChoicePoints)
        )
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
