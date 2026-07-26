import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DESK_SLOTS,
  EMPTY_PLACEMENT,
  ITEM_CATALOG,
  itemById,
  SlotId
} from "./catalog";

const KEY = "teum.desk.v1";

export interface RewardBox {
  id: string;
  itemIds: string[];
  createdAt: number;
  /** 개발자 미리보기 상자는 소장 상태에 반영하지 않는다. */
  preview: boolean;
}

/** 픽셀 데스크 상태 v2 — 기존 저장 키는 유지하고 내부 버전만 올린다. */
export interface DeskState {
  version: 2;
  /** 기록 삭제와 독립적인 누적 챙김 수. */
  cumulativeDone: number;
  /** 사용자가 바꾼 슬롯만 저장. 없으면 기본 배치. */
  placements: Partial<Record<SlotId, string>>;
  /** 랜덤 상자와 이스터에그로 실제 지급된 아이템. */
  ownedItemIds: string[];
  /** 기기별 보상 순서를 고정하는 로컬 시드. */
  rewardSeed: string;
  /** 다음에 만들 상자의 0-based 번호. */
  nextBoxIndex: number;
  /** 아직 연출을 확인하지 않은 상자. 내용은 생성 즉시 고정된다. */
  pendingBoxes: RewardBox[];
  /** 한 번만 발견되도록 저장하는 이스터에그 id. */
  discoveredEggIds: string[];
}

export const EMPTY_DESK: DeskState = {
  version: 2,
  cumulativeDone: 0,
  placements: {},
  ownedItemIds: [],
  rewardSeed: "pending",
  nextBoxIndex: 0,
  pendingBoxes: [],
  discoveredEggIds: []
};

function newRewardSeed(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function createEmptyDeskState(): DeskState {
  return { ...EMPTY_DESK, rewardSeed: newRewardSeed() };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function validPlacements(value: unknown): DeskState["placements"] {
  const placements: DeskState["placements"] = {};
  if (!isObject(value)) return placements;
  for (const [slot, id] of Object.entries(value)) {
    if (
      slot in DESK_SLOTS &&
      typeof id === "string" &&
      (id === EMPTY_PLACEMENT || itemById(id))
    ) {
      placements[slot as SlotId] = id;
    }
  }
  return placements;
}

function validItemIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && itemById(id) != null))];
}

function validBoxes(value: unknown): RewardBox[] {
  if (!Array.isArray(value)) return [];
  const boxes: RewardBox[] = [];
  for (const candidate of value) {
    if (
      !isObject(candidate) ||
      typeof candidate.id !== "string" ||
      candidate.preview === true
    ) {
      continue;
    }
    const itemIds = validItemIds(candidate.itemIds).slice(0, 3);
    if (itemIds.length === 0) continue;
    boxes.push({
      id: candidate.id,
      itemIds,
      createdAt:
        typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt)
          ? candidate.createdAt
          : 0,
      preview: false
    });
  }
  return boxes.slice(-50);
}

function legacyOwnedIds(cumulativeDone: number): string[] {
  return ITEM_CATALOG.filter((item) => {
    if (item.acquire.type === "default" || item.acquire.type === "daily") return true;
    return item.acquire.type === "milestone" && cumulativeDone >= item.acquire.at;
  }).map((item) => item.id);
}

/**
 * 저장/백업에서 읽은 v1·v2 값을 한 형태로 정규화한다.
 * v1은 기존 기본·마일스톤 소장품과 현재 배치를 보존하되 신규 랜덤 보상은 소급하지 않는다.
 */
export function normalizeDeskState(value: unknown): DeskState {
  if (!isObject(value)) return createEmptyDeskState();

  const cumulativeDone = Math.max(0, Math.floor(Number(value.cumulativeDone) || 0));
  const placements = validPlacements(value.placements);
  const migratedFromV1 = value.version !== 2;
  const pendingBoxes = migratedFromV1 ? [] : validBoxes(value.pendingBoxes);
  const discoveredEggIds = migratedFromV1
    ? []
    : validItemIds(value.discoveredEggIds).filter((id) => id.startsWith("egg-"));

  const owned = new Set(
    migratedFromV1 ? legacyOwnedIds(cumulativeDone) : validItemIds(value.ownedItemIds)
  );
  for (const id of Object.values(placements)) {
    if (id !== EMPTY_PLACEMENT && itemById(id)) owned.add(id);
  }
  for (const box of pendingBoxes) {
    if (!box.preview) box.itemIds.forEach((id) => owned.add(id));
  }
  discoveredEggIds.forEach((id) => owned.add(id));

  return {
    version: 2,
    cumulativeDone,
    placements,
    ownedItemIds: [...owned],
    rewardSeed:
      !migratedFromV1 && typeof value.rewardSeed === "string" && value.rewardSeed.length >= 4
        ? value.rewardSeed
        : newRewardSeed(),
    nextBoxIndex:
      !migratedFromV1 && Number.isInteger(value.nextBoxIndex) && Number(value.nextBoxIndex) >= 0
        ? Number(value.nextBoxIndex)
        : 0,
    pendingBoxes,
    discoveredEggIds
  };
}

export async function loadDeskState(): Promise<DeskState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const state = raw ? normalizeDeskState(JSON.parse(raw)) : createEmptyDeskState();
    // v1 마이그레이션과 손상 필드 정규화를 즉시 고정한다.
    void AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => undefined);
    return state;
  } catch {
    return createEmptyDeskState();
  }
}

export async function saveDeskState(state: DeskState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 다음 저장 때 재시도된다.
  }
}
