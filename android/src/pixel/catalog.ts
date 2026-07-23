/**
 * 픽셀 데스크 아이템 카탈로그 (기획서 §3.4).
 * 도트맵은 64×40 아트 그리드(아트 px = 논리 4px) 기준이며,
 * 문자 팔레트는 PixelGlyph.PIXEL_COLORS를 따른다.
 *
 * 확장 규칙: 새 아이템은 이 파일에 정의를 추가하는 것으로 끝나야 한다.
 * 장면(PixelScene)과 렌더러(PixelGlyph)는 손대지 않는다.
 */

export type SlotId =
  | "wall-window"
  | "wall-shelf-a"
  | "wall-shelf-b"
  | "wall-frame"
  | "wall-clock"
  | "desk-left"
  | "desk-center"
  | "desk-right"
  | "desk-lamp"
  | "desk-front"
  | "floor-left"
  | "floor-right";

/** 슬롯 지도 (기획서 §3.3) — 아트 px 좌표. 아이템은 자기 위치를 모른다. */
export const DESK_SLOTS: Record<SlotId, { x: number; y: number; maxW: number; maxH: number }> = {
  "wall-window": { x: 5, y: 3, maxW: 16, maxH: 12 },
  "wall-shelf-a": { x: 26, y: 5, maxW: 5, maxH: 4 },
  "wall-shelf-b": { x: 33, y: 5, maxW: 5, maxH: 4 },
  "wall-frame": { x: 44, y: 4, maxW: 6, maxH: 7 },
  "wall-clock": { x: 56, y: 4, maxW: 4, maxH: 4 },
  "desk-left": { x: 12, y: 18, maxW: 6, maxH: 6 },
  "desk-center": { x: 25, y: 14, maxW: 14, maxH: 10 },
  "desk-right": { x: 44, y: 16, maxW: 7, maxH: 8 },
  "desk-lamp": { x: 54, y: 12, maxW: 5, maxH: 12 },
  "desk-front": { x: 20, y: 26, maxW: 8, maxH: 3 },
  "floor-left": { x: 2, y: 24, maxW: 6, maxH: 8 },
  "floor-right": { x: 57, y: 24, maxW: 6, maxH: 8 }
};

export type ItemStateKey = "base" | "active";

export type Acquire =
  | { type: "default" }
  | { type: "daily" }
  | { type: "milestone"; at: number };

export interface PixelItem {
  /** 배포 후 바꾸지 않는 안정 id */
  id: string;
  nameKo: string;
  nameEn: string;
  slots: SlotId[];
  /** 상태별 도트맵. base는 필수. */
  frames: Record<ItemStateKey, string[]>;
  acquire: Acquire;
  addedIn: string;
}

// ── 기본 아이템 도트맵 ─────────────────────────────────────

const MONITOR_BASE = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIHIIIIIIIIIIC",
  "CIIIIIIIIIIIIC",
  "CIIIIIIIIIIIIC",
  "CIIIIIIIIIIIIC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const MONITOR_ACTIVE = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIHIIIIIIIIIIC",
  "CIIHHIIIIIIIIC",
  "CIIIIIIIIIIIIC",
  "CIIIIIIIIIIIIC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const GLASS_FILLED = [
  "H....H",
  "H....H",
  "HEKKEH",
  "HKKKKH",
  "HKKKKH",
  ".HHHH."
];

const PLANT = [
  "..TTT..",
  ".TTTTT.",
  "TTETTTT",
  ".TTTTT.",
  "..TTT..",
  ".CCCCC.",
  ".CIIIC.",
  "..CCC.."
];

const LAMP_OFF = [
  "CCCC.",
  "CCCC.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "..CCC",
  ".CCCC"
];

const LAMP_ON = [
  "CCCC.",
  "CAAC.",
  "AA.C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "...C.",
  "..CCC",
  ".CCCC"
];

// ── 마일스톤 아이템 도트맵 (기획서 §4.7) ────────────────────

const MUG = [
  "AAAA..",
  "AKKA.A",
  "AKKAAA",
  "AKKAA.",
  "AAAA.."
];

const BOOKS = [
  ".IPT.",
  ".IPT.",
  ".IPT.",
  "CCCCC"
];

const FRAME = [
  "CCCCCC",
  "CKKKTC",
  "CKTTTC",
  "CTTTTC",
  "CCCCCC"
];

const CLOCK = [
  ".CC.",
  "CWCC",
  "CWWC",
  ".CC."
];

const TALL_PLANT = [
  "..TT..",
  ".TTTT.",
  "TTTTTT",
  ".TETT.",
  "..TT..",
  ".CCCC.",
  ".CIIC.",
  ".CCCC."
];

export const ITEM_CATALOG: PixelItem[] = [
  {
    id: "monitor-basic",
    nameKo: "모니터",
    nameEn: "Monitor",
    slots: ["desk-center"],
    frames: { base: MONITOR_BASE, active: MONITOR_ACTIVE },
    acquire: { type: "default" },
    addedIn: "1.0.4"
  },
  {
    id: "glass-basic",
    nameKo: "물컵",
    nameEn: "Water glass",
    slots: ["desk-left"],
    frames: { base: GLASS_FILLED, active: GLASS_FILLED },
    acquire: { type: "daily" },
    addedIn: "1.0.4"
  },
  {
    id: "plant-basic",
    nameKo: "작은 식물",
    nameEn: "Small plant",
    slots: ["desk-right"],
    frames: { base: PLANT, active: PLANT },
    acquire: { type: "daily" },
    addedIn: "1.0.4"
  },
  {
    id: "lamp-basic",
    nameKo: "스탠드",
    nameEn: "Desk lamp",
    slots: ["desk-lamp"],
    frames: { base: LAMP_OFF, active: LAMP_ON },
    acquire: { type: "default" },
    addedIn: "1.0.4"
  },
  {
    id: "mug-amber",
    nameKo: "머그컵",
    nameEn: "Mug",
    slots: ["desk-left"],
    frames: { base: MUG, active: MUG },
    acquire: { type: "milestone", at: 3 },
    addedIn: "1.0.4"
  },
  {
    id: "books-shelf",
    nameKo: "선반 책",
    nameEn: "Shelf books",
    slots: ["wall-shelf-a", "wall-shelf-b"],
    frames: { base: BOOKS, active: BOOKS },
    acquire: { type: "milestone", at: 7 },
    addedIn: "1.0.4"
  },
  {
    id: "frame-teal",
    nameKo: "벽 액자",
    nameEn: "Wall art",
    slots: ["wall-frame"],
    frames: { base: FRAME, active: FRAME },
    acquire: { type: "milestone", at: 12 },
    addedIn: "1.0.4"
  },
  {
    id: "clock-wall",
    nameKo: "벽시계",
    nameEn: "Wall clock",
    slots: ["wall-clock"],
    frames: { base: CLOCK, active: CLOCK },
    acquire: { type: "milestone", at: 20 },
    addedIn: "1.0.4"
  },
  {
    id: "plant-tall",
    nameKo: "큰 화분",
    nameEn: "Floor plant",
    slots: ["floor-left", "floor-right"],
    frames: { base: TALL_PLANT, active: TALL_PLANT },
    acquire: { type: "milestone", at: 30 },
    addedIn: "1.0.4"
  }
];

export function itemById(id: string): PixelItem | undefined {
  return ITEM_CATALOG.find((item) => item.id === id);
}

/** 슬롯별 기본 배치 (없으면 비어 있는 슬롯) */
export const DEFAULT_PLACEMENTS: Partial<Record<SlotId, string>> = {
  "desk-left": "glass-basic",
  "desk-center": "monitor-basic",
  "desk-right": "plant-basic",
  "desk-lamp": "lamp-basic"
};

/** 누적 챙김 기준으로 소장한 아이템 목록 (도착 순서 유지) */
export function ownedItems(cumulativeDone: number): PixelItem[] {
  return ITEM_CATALOG.filter((item) =>
    item.acquire.type === "milestone" ? cumulativeDone >= item.acquire.at : true
  );
}

/** 해당 슬롯에 넣을 수 있는 소장 아이템 */
export function ownedItemsForSlot(slot: SlotId, cumulativeDone: number): PixelItem[] {
  return ownedItems(cumulativeDone).filter((item) => item.slots.includes(slot));
}

// ── 오늘의 상태 변화 (기획서 §6.3) ─────────────────────────

export interface DeskSceneState {
  /** 물컵 표시 (1회~) */
  glass: boolean;
  /** 창문 빛 켜진 칸 수 0~2 (3회~ 1칸, 5회~ 2칸) */
  windowLit: 0 | 1 | 2;
  /** 식물 표시 (5회~) */
  plant: boolean;
  /** 스탠드 켜짐 (8회~) */
  lampOn: boolean;
  /** 모니터 활동 표시 (1회~) */
  monitorActive: boolean;
  /** 일시정지 — 상태 점만 멈춤 표시, 장면은 유지 */
  paused: boolean;
}

/** doneCount(기록 모드 꺼짐이면 null)와 일시정지를 장면 상태로 변환한다. */
export function sceneStateFor(doneCount: number | null, paused: boolean): DeskSceneState {
  const count = doneCount ?? 0;
  return {
    glass: count >= 1,
    windowLit: count >= 5 ? 2 : count >= 3 ? 1 : 0,
    plant: count >= 5,
    lampOn: count >= 8,
    monitorActive: count >= 1,
    paused
  };
}
