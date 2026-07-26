import {
  ITEM_CATALOG
} from "./catalog";
import type { PixelItem, SlotId } from "./catalog";
import type { DeskState } from "./deskState";

export const GIFT_INTERVAL = 5;
export const POINT_INTERVAL = 10;
export const CHOICE_COST = 5;

const alwaysOwned = (item: PixelItem) =>
  item.acquire.type === "default" || item.acquire.type === "daily";

export function isItemOwned(state: DeskState, item: PixelItem): boolean {
  return alwaysOwned(item) || state.ownedItemIds.includes(item.id);
}

export function ownedItemsForSlot109(
  state: DeskState,
  slot: SlotId
): PixelItem[] {
  return ITEM_CATALOG.filter(
    (item) => item.slots.includes(slot) && isItemOwned(state, item)
  );
}

export function earnedGiftCount(cumulativeDone: number): number {
  return Math.floor(Math.max(0, cumulativeDone) / GIFT_INTERVAL);
}

export function pendingGiftCount(state: DeskState): number {
  return Math.max(0, earnedGiftCount(state.cumulativeDone) - state.openedGiftCount);
}

export function earnedChoicePoints(cumulativeDone: number): number {
  return Math.floor(Math.max(0, cumulativeDone) / POINT_INTERVAL);
}

export function availableChoicePoints(state: DeskState): number {
  return Math.max(
    0,
    earnedChoicePoints(state.cumulativeDone) - state.spentChoicePoints
  );
}

export function nextGiftProgress(cumulativeDone: number): number {
  return Math.max(0, cumulativeDone) % GIFT_INTERVAL;
}

export function completionsUntilNextPoint(cumulativeDone: number): number {
  const remainder = Math.max(0, cumulativeDone) % POINT_INTERVAL;
  return remainder === 0 ? POINT_INTERVAL : POINT_INTERVAL - remainder;
}

export function completeBreakReward109(state: DeskState): DeskState {
  return { ...state, cumulativeDone: state.cumulativeDone + 1 };
}

export interface GiftOpenResult {
  state: DeskState;
  item: PixelItem | null;
}

/** 미개봉 상자 하나를 소비하고 미소장 일반 아이템 하나를 지급한다. */
export function openGift109(
  state: DeskState,
  random: () => number = Math.random
): GiftOpenResult {
  if (pendingGiftCount(state) <= 0) return { state, item: null };
  const candidates = ITEM_CATALOG.filter(
    (item) => !alwaysOwned(item) && !isItemOwned(state, item)
  );
  const nextOpenedGiftCount = state.openedGiftCount + 1;
  if (candidates.length === 0) {
    return {
      state: { ...state, openedGiftCount: nextOpenedGiftCount },
      item: null
    };
  }
  const rawIndex = Math.floor(random() * candidates.length);
  const index = Math.min(candidates.length - 1, Math.max(0, rawIndex));
  const item = candidates[index];
  return {
    item,
    state: {
      ...state,
      openedGiftCount: nextOpenedGiftCount,
      ownedItemIds: [...new Set([...state.ownedItemIds, item.id])]
    }
  };
}

export type ChoiceResult =
  | { ok: true; state: DeskState; item: PixelItem }
  | { ok: false; reason: "missing" | "owned" | "not-for-sale" | "points" };

export function chooseItem109(state: DeskState, itemId: string): ChoiceResult {
  const item = ITEM_CATALOG.find((candidate) => candidate.id === itemId);
  if (!item) return { ok: false, reason: "missing" };
  if (isItemOwned(state, item)) return { ok: false, reason: "owned" };
  if (alwaysOwned(item)) return { ok: false, reason: "not-for-sale" };
  if (availableChoicePoints(state) < CHOICE_COST) {
    return { ok: false, reason: "points" };
  }
  return {
    ok: true,
    item,
    state: {
      ...state,
      spentChoicePoints: state.spentChoicePoints + CHOICE_COST,
      ownedItemIds: [...new Set([...state.ownedItemIds, item.id])]
    }
  };
}
