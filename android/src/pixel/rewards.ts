import {
  groupOfItem,
  ITEM_CATALOG,
  STRUCTURAL_SLOTS
} from "./catalog.ts";
import type { PixelItem } from "./catalog.ts";
import type { DeskState, RewardBox } from "./deskState";
import { THEME_REWARD_RULES } from "./themeCatalog.ts";

const BOX_SIZE = 3;
const themeRuleByKey = new Map(THEME_REWARD_RULES.map((rule) => [rule.key, rule]));

function monthDayValue(month: number, day: number): number {
  return month * 100 + day;
}

/** 기기 현지 날짜가 시작일~종료일 안인지 판정한다. 연말을 넘기는 기간도 지원한다. */
export function isInDateWindow(
  date: Date,
  window: { startMonth: number; startDay: number; endMonth: number; endDay: number }
): boolean {
  const current = monthDayValue(date.getMonth() + 1, date.getDate());
  const start = monthDayValue(window.startMonth, window.startDay);
  const end = monthDayValue(window.endMonth, window.endDay);
  return start <= end ? current >= start && current <= end : current >= start || current <= end;
}

/** 누적 횟수 구간별로 이 완료가 상자 도착 지점인지 계산한다. */
export function isBoxMilestone(cumulativeDone: number): boolean {
  if (cumulativeDone <= 0) return false;
  if (cumulativeDone <= 12) return cumulativeDone % 2 === 0;
  if (cumulativeDone <= 60) return cumulativeDone % 3 === 0;
  if (cumulativeDone <= 180) return cumulativeDone % 4 === 0;
  return cumulativeDone % 5 === 0;
}

/** 현재 누적 횟수·현지 날짜에서 실제 상자 후보가 되는 미소장 아이템. */
export function rewardCandidates(
  cumulativeDone: number,
  ownedItemIds: readonly string[],
  date: Date
): PixelItem[] {
  const owned = new Set(ownedItemIds);
  return ITEM_CATALOG.filter((item) => {
    if (item.acquire.type !== "reward" || owned.has(item.id)) return false;
    if (cumulativeDone < item.acquire.unlockAt) return false;
    if (!item.acquire.limited) return true;
    const rule = item.themeKey ? themeRuleByKey.get(item.themeKey) : undefined;
    return rule != null && isInDateWindow(date, rule.limitedWindow);
  });
}

/** JS 런타임과 관계없이 같은 문자열에 같은 정렬값을 주는 FNV-1a 변형. */
function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function chooseItems(
  candidates: PixelItem[],
  rewardSeed: string,
  boxIndex: number
): PixelItem[] {
  const ordered = [...candidates].sort((left, right) => {
    const leftScore = stableHash(`${rewardSeed}|${boxIndex}|${left.id}`);
    const rightScore = stableHash(`${rewardSeed}|${boxIndex}|${right.id}`);
    return leftScore - rightScore || left.id.localeCompare(right.id);
  });

  const chosen: PixelItem[] = [];
  const usedGroups = new Set<string>();
  let structuralCount = 0;
  for (const item of ordered) {
    const group = groupOfItem(item)?.key ?? item.slots[0];
    if (usedGroups.has(group)) continue;
    const structural = item.slots.some((slot) => STRUCTURAL_SLOTS.has(slot));
    if (structural && structuralCount >= 1) continue;
    chosen.push(item);
    usedGroups.add(group);
    if (structural) structuralCount += 1;
    if (chosen.length === BOX_SIZE) break;
  }
  return chosen;
}

export function createRewardBox(
  state: DeskState,
  createdAt: number,
  preview = false,
  forcedItemIds?: readonly string[]
): RewardBox | null {
  const forced = forcedItemIds
    ?.map((id) => ITEM_CATALOG.find((item) => item.id === id))
    .filter((item): item is PixelItem => item != null)
    .slice(0, BOX_SIZE);
  const chosen =
    forced && forced.length > 0
      ? forced
      : chooseItems(
          rewardCandidates(state.cumulativeDone, state.ownedItemIds, new Date(createdAt)),
          state.rewardSeed,
          state.nextBoxIndex
        );
  if (chosen.length === 0) return null;
  return {
    id: `${preview ? "preview" : "reward"}-${state.nextBoxIndex}-${createdAt}`,
    itemIds: chosen.map((item) => item.id),
    createdAt,
    preview
  };
}

/**
 * 완료 1회를 반영하고, 도착 지점이면 내용이 고정된 상자를 큐에 저장한다.
 * 아이템 소유권은 연출 전 즉시 부여되어 앱 종료에도 유실되지 않는다.
 */
export function completeBreakReward(
  state: DeskState,
  completedAt: number
): { state: DeskState; box: RewardBox | null } {
  const withCount = { ...state, cumulativeDone: state.cumulativeDone + 1 };
  if (!isBoxMilestone(withCount.cumulativeDone)) return { state: withCount, box: null };
  const box = createRewardBox(withCount, completedAt);
  if (!box) return { state: withCount, box: null };
  return {
    box,
    state: {
      ...withCount,
      ownedItemIds: [...new Set([...withCount.ownedItemIds, ...box.itemIds])],
      nextBoxIndex: withCount.nextBoxIndex + 1,
      pendingBoxes: [...withCount.pendingBoxes, box]
    }
  };
}

function grantEggs(state: DeskState, eggIds: readonly string[]): { state: DeskState; found: string[] } {
  const known = new Set(state.discoveredEggIds);
  const found = eggIds.filter((id) => !known.has(id) && ITEM_CATALOG.some((item) => item.id === id));
  if (found.length === 0) return { state, found: [] };
  return {
    found,
    state: {
      ...state,
      discoveredEggIds: [...state.discoveredEggIds, ...found],
      ownedItemIds: [...new Set([...state.ownedItemIds, ...found])]
    }
  };
}

/** 시작·종료 시각을 저장할 때 즉시 판정하는 이스터에그. */
export function discoverSettingsEggs(
  state: DeskState,
  startMin: number,
  endMin: number
): { state: DeskState; found: string[] } {
  const matches: string[] = [];
  if (startMin === 7 * 60 + 7) matches.push("egg-0707-alarm");
  if (endMin === 18 * 60 + 18) matches.push("egg-1818-exit");
  if (startMin === 9 * 60 + 9 && endMin === 18 * 60 + 18) {
    matches.push("egg-0909-1818-train");
  }
  return grantEggs(state, matches);
}

/** 틈 완료 시각·당일 횟수·미루기 여부로 판정하는 이스터에그. */
export function discoverCompletionEggs(
  state: DeskState,
  completedAt: number,
  doneToday: number,
  snoozed: boolean
): { state: DeskState; found: string[] } {
  const date = new Date(completedAt);
  const matches: string[] = [];
  if (date.getHours() === 11 && date.getMinutes() === 11) matches.push("egg-1111-ticket");
  if (date.getHours() === 22 && date.getMinutes() === 22) matches.push("egg-2222-moon");
  if (doneToday === 7) matches.push("egg-seven-rainbow");
  if (snoozed) matches.push("egg-snooze-snail");
  if (date.getMonth() === 1 && date.getDate() === 29) matches.push("egg-leap-frog");
  return grantEggs(state, matches);
}

export function dismissRewardBox(state: DeskState, boxId: string): DeskState {
  return {
    ...state,
    pendingBoxes: state.pendingBoxes.filter((box) => box.id !== boxId)
  };
}
