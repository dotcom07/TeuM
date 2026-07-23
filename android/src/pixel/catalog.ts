/**
 * 픽셀 데스크 아이템 카탈로그 (기획서 §3.4).
 * 도트맵은 64×40 아트 그리드(아트 px = 논리 4px) 기준이며,
 * 문자 팔레트는 PixelGlyph.PIXEL_COLORS를 따른다.
 *
 * 확장 규칙: 새 아이템은 이 파일에 정의를 추가하는 것으로 끝나야 한다.
 * 장면(PixelScene)과 렌더러(PixelGlyph)는 손대지 않는다.
 */

export type SlotId =
  | "wallpaper"
  | "flooring"
  | "wall-window"
  | "wall-shelf-a"
  | "wall-shelf-b"
  | "wall-frame"
  | "wall-clock"
  | "furniture-desk"
  | "desk-left"
  | "desk-center"
  | "desk-right"
  | "desk-lamp"
  | "desk-front"
  | "floor-left"
  | "floor-right";

/**
 * 슬롯 지도 (기획서 §3.3) — 아트 px 좌표. 아이템은 자기 위치를 모른다.
 * 키 순서가 곧 그리기 순서다: 벽지 → 바닥지 → 창문·벽 → 책상 → 소품.
 */
export const DESK_SLOTS: Record<SlotId, { x: number; y: number; maxW: number; maxH: number }> = {
  wallpaper: { x: 0, y: 0, maxW: 64, maxH: 31 },
  flooring: { x: 0, y: 31, maxW: 64, maxH: 9 },
  "wall-window": { x: 5, y: 3, maxW: 16, maxH: 12 },
  "wall-shelf-a": { x: 26, y: 5, maxW: 5, maxH: 4 },
  "wall-shelf-b": { x: 33, y: 5, maxW: 5, maxH: 4 },
  "wall-frame": { x: 44, y: 4, maxW: 6, maxH: 7 },
  "wall-clock": { x: 56, y: 4, maxW: 4, maxH: 4 },
  "furniture-desk": { x: 4, y: 24, maxW: 56, maxH: 8 },
  "desk-left": { x: 12, y: 18, maxW: 6, maxH: 6 },
  "desk-center": { x: 25, y: 14, maxW: 14, maxH: 10 },
  "desk-right": { x: 44, y: 16, maxW: 7, maxH: 8 },
  "desk-lamp": { x: 54, y: 12, maxW: 5, maxH: 12 },
  "desk-front": { x: 19, y: 26, maxW: 8, maxH: 3 },
  "floor-left": { x: 2, y: 24, maxW: 6, maxH: 8 },
  "floor-right": { x: 57, y: 24, maxW: 6, maxH: 8 }
};

/**
 * 구조 슬롯 — 방의 뼈대라 비울 수 없다. 교체만 가능하다.
 * 장면 탭 대상에서도 제외한다(작은 슬롯을 가리므로 창문·모니터만 예외).
 */
export const STRUCTURAL_SLOTS: ReadonlySet<SlotId> = new Set([
  "wallpaper",
  "flooring",
  "wall-window",
  "furniture-desk",
  "desk-center"
]);

/** 꾸미기 그룹 — 아이템란을 "같은 자리끼리" 묶는 기준 (기획서 §4.7) */
export interface SlotGroup {
  key: string;
  ko: string;
  en: string;
  slots: SlotId[];
}

export const SLOT_GROUPS: SlotGroup[] = [
  { key: "wallpaper", ko: "벽지", en: "Wallpaper", slots: ["wallpaper"] },
  { key: "flooring", ko: "바닥지", en: "Flooring", slots: ["flooring"] },
  { key: "window", ko: "창문", en: "Window", slots: ["wall-window"] },
  { key: "desk", ko: "책상", en: "Desk", slots: ["furniture-desk"] },
  { key: "monitor", ko: "모니터", en: "Monitor", slots: ["desk-center"] },
  { key: "cup", ko: "컵 자리", en: "Cup spot", slots: ["desk-left"] },
  { key: "plant", ko: "식물 자리", en: "Plant spot", slots: ["desk-right"] },
  { key: "lamp", ko: "조명 자리", en: "Lamp spot", slots: ["desk-lamp"] },
  { key: "front", ko: "책상 앞", en: "Desk front", slots: ["desk-front"] },
  { key: "shelf", ko: "선반", en: "Shelf", slots: ["wall-shelf-a", "wall-shelf-b"] },
  { key: "frame", ko: "액자 자리", en: "Frame spot", slots: ["wall-frame"] },
  { key: "clock", ko: "시계 자리", en: "Clock spot", slots: ["wall-clock"] },
  { key: "pet", ko: "펫 자리", en: "Pet spot", slots: ["floor-left"] },
  { key: "floor", ko: "바닥", en: "Floor", slots: ["floor-right"] }
];

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
  /** 추가 상태 변형 (예: 창문의 lit1/lit2) */
  states?: Record<string, string[]>;
  acquire: Acquire;
  addedIn: string;
}

/** 슬롯을 명시적으로 비워 두는 배치 값 */
export const EMPTY_PLACEMENT = "__empty__";

// ── 방 구조 아이템 (벽지·바닥지·창문·책상) ──────────────────

const WALLPAPER_SKY = Array.from({ length: 31 }, () => "K".repeat(64));

const FLOORING_PERIWINKLE = [
  "M".repeat(64),
  ...Array.from({ length: 8 }, () => "P".repeat(64))
];

const DESK_LEG_ROW = (() => {
  const row = Array(56).fill(".");
  row[2] = row[3] = "I";
  row[52] = row[53] = "I";
  return row.join("");
})();

const DESK_INDIGO = [
  "H".repeat(56),
  "I".repeat(56),
  "I".repeat(56),
  ...Array.from({ length: 5 }, () => DESK_LEG_ROW)
];

/** 창문 도트맵 — lit: 켜진 유리칸 수 (왼쪽 위 → 오른쪽 위 순서) */
function windowRows(lit: 0 | 1 | 2): string[] {
  const paneTopLeft = lit >= 1 ? "A" : "I";
  const paneTopRight = lit >= 2 ? "A" : "I";
  const top = `C${paneTopLeft.repeat(6)}C${paneTopRight.repeat(7)}C`;
  const bottom = `C${"I".repeat(6)}C${"I".repeat(7)}C`;
  return [
    "C".repeat(16),
    top,
    top,
    top,
    top,
    "C".repeat(16),
    bottom,
    bottom,
    bottom,
    bottom,
    "C".repeat(16),
    "C".repeat(16)
  ];
}

// ── 기본 아이템 ────────────────────────────────────────────

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

const GLASS = ["H....H", "H....H", "HEKKEH", "HKKKKH", "HKKKKH", ".HHHH."];

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

// ── 컵 자리 ────────────────────────────────────────────────

const MUG = ["AAAA..", "AKKA.A", "AKKAAA", "AKKAA.", "AAAA.."];

const TEA_CUP = [".H..H.", "WWWWW.", "WAAAW.", "WAAAWW", ".WWW.."];

// ── 식물 자리 ──────────────────────────────────────────────

const CACTUS = ["..T..", "T.T.T", "T.T.T", "TTTTT", "..T..", ".CCC.", ".CPC."];

const FLOWER = ["..S..", ".SAS.", "..S..", "..T..", ".CCC.", ".CPC.", ".CCC."];

// ── 조명 자리 ──────────────────────────────────────────────

const LAMP_ICE = [
  "EEE..",
  "EHE..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];

// ── 책상 앞 ────────────────────────────────────────────────

const MEMO = ["AAAA", "AWWA", "AAAA"];

const KEYBOARD = ["CCCCCCC", "HCHCHCH"];

// ── 선반 ───────────────────────────────────────────────────

const BOOKS = [".IPT.", ".IPT.", ".IPT.", "CCCCC"];

const RADIO = ["..H..", "CCCCC", "CAWKC", "CCCCC"];

const GLOBE = [".KT.", ".TK.", "..C.", ".CCC"];

const TROPHY = ["EHE.", "EEE.", ".E..", "EEE."];

// ── 액자 자리 ──────────────────────────────────────────────

const FRAME_TEAL = ["CCCCCC", "CKKKTC", "CKTTTC", "CTTTTC", "CCCCCC"];

const FRAME_MOON = ["CCCCCC", "CIIIIC", "CIIWIC", "CWIIIC", "CIIIIC", "CCCCCC"];

// ── 시계 자리 ──────────────────────────────────────────────

const CLOCK = [".CC.", "CWCC", "CWWC", ".CC."];

// ── 펫 자리 ────────────────────────────────────────────────

const CAT = [
  "C.C...",
  "CCCC..",
  "CWCW..",
  "CCCC..",
  "CCCC.C",
  "CCCCCC",
  ".C..C."
];

const DOG = [
  ".M.M..",
  "MMMM..",
  "MWMW..",
  "MMMM..",
  "MMMM.M",
  "MMMMMM",
  ".M..M."
];

// ── 바닥 ───────────────────────────────────────────────────

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

const BOX_STACK = [
  ".PPPP.",
  ".PKKP.",
  ".PPPP.",
  "PPPPPP",
  "PKKKKP",
  "PPPPPP",
  "MMMMMM"
];

export const ITEM_CATALOG: PixelItem[] = [
  // 방 구조 — 기본 지급, 교체형
  {
    id: "wallpaper-sky",
    nameKo: "하늘 벽지",
    nameEn: "Sky wallpaper",
    slots: ["wallpaper"],
    frames: { base: WALLPAPER_SKY, active: WALLPAPER_SKY },
    acquire: { type: "default" },
    addedIn: "1.0.4"
  },
  {
    id: "flooring-periwinkle",
    nameKo: "차분한 바닥",
    nameEn: "Calm flooring",
    slots: ["flooring"],
    frames: { base: FLOORING_PERIWINKLE, active: FLOORING_PERIWINKLE },
    acquire: { type: "default" },
    addedIn: "1.0.4"
  },
  {
    id: "window-basic",
    nameKo: "창문",
    nameEn: "Window",
    slots: ["wall-window"],
    frames: { base: windowRows(0), active: windowRows(0) },
    states: { lit1: windowRows(1), lit2: windowRows(2) },
    acquire: { type: "default" },
    addedIn: "1.0.4"
  },
  {
    id: "desk-indigo",
    nameKo: "인디고 책상",
    nameEn: "Indigo desk",
    slots: ["furniture-desk"],
    frames: { base: DESK_INDIGO, active: DESK_INDIGO },
    acquire: { type: "default" },
    addedIn: "1.0.4"
  },
  // 기본·데일리
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
    frames: { base: GLASS, active: GLASS },
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
    id: "cat-basic",
    nameKo: "고양이",
    nameEn: "Cat",
    slots: ["floor-left"],
    frames: { base: CAT, active: CAT },
    acquire: { type: "default" },
    addedIn: "1.0.4"
  },
  // 마일스톤 — 촘촘하게 도착해 모으는 재미를 만든다
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
    id: "memo-note",
    nameKo: "메모지",
    nameEn: "Sticky note",
    slots: ["desk-front"],
    frames: { base: MEMO, active: MEMO },
    acquire: { type: "milestone", at: 5 },
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
    id: "cactus",
    nameKo: "선인장",
    nameEn: "Cactus",
    slots: ["desk-right"],
    frames: { base: CACTUS, active: CACTUS },
    acquire: { type: "milestone", at: 10 },
    addedIn: "1.0.4"
  },
  {
    id: "frame-teal",
    nameKo: "벽 액자",
    nameEn: "Wall art",
    slots: ["wall-frame"],
    frames: { base: FRAME_TEAL, active: FRAME_TEAL },
    acquire: { type: "milestone", at: 12 },
    addedIn: "1.0.4"
  },
  {
    id: "tea-cup",
    nameKo: "찻잔",
    nameEn: "Tea cup",
    slots: ["desk-left"],
    frames: { base: TEA_CUP, active: TEA_CUP },
    acquire: { type: "milestone", at: 15 },
    addedIn: "1.0.4"
  },
  {
    id: "radio-retro",
    nameKo: "라디오",
    nameEn: "Radio",
    slots: ["wall-shelf-a", "wall-shelf-b"],
    frames: { base: RADIO, active: RADIO },
    acquire: { type: "milestone", at: 18 },
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
    id: "dog-basic",
    nameKo: "강아지",
    nameEn: "Dog",
    slots: ["floor-left"],
    frames: { base: DOG, active: DOG },
    acquire: { type: "milestone", at: 22 },
    addedIn: "1.0.4"
  },
  {
    id: "flower-pot",
    nameKo: "꽃 화분",
    nameEn: "Flower pot",
    slots: ["desk-right"],
    frames: { base: FLOWER, active: FLOWER },
    acquire: { type: "milestone", at: 25 },
    addedIn: "1.0.4"
  },
  {
    id: "keyboard",
    nameKo: "키보드",
    nameEn: "Keyboard",
    slots: ["desk-front"],
    frames: { base: KEYBOARD, active: KEYBOARD },
    acquire: { type: "milestone", at: 28 },
    addedIn: "1.0.4"
  },
  {
    id: "plant-tall",
    nameKo: "큰 화분",
    nameEn: "Floor plant",
    slots: ["floor-right"],
    frames: { base: TALL_PLANT, active: TALL_PLANT },
    acquire: { type: "milestone", at: 30 },
    addedIn: "1.0.4"
  },
  {
    id: "box-stack",
    nameKo: "상자 더미",
    nameEn: "Box stack",
    slots: ["floor-right"],
    frames: { base: BOX_STACK, active: BOX_STACK },
    acquire: { type: "milestone", at: 35 },
    addedIn: "1.0.4"
  },
  {
    id: "lamp-ice",
    nameKo: "무드등",
    nameEn: "Mood lamp",
    slots: ["desk-lamp"],
    frames: { base: LAMP_ICE, active: LAMP_ICE },
    acquire: { type: "milestone", at: 40 },
    addedIn: "1.0.4"
  },
  {
    id: "globe-shelf",
    nameKo: "지구본",
    nameEn: "Globe",
    slots: ["wall-shelf-a", "wall-shelf-b"],
    frames: { base: GLOBE, active: GLOBE },
    acquire: { type: "milestone", at: 45 },
    addedIn: "1.0.4"
  },
  {
    id: "trophy",
    nameKo: "트로피",
    nameEn: "Trophy",
    slots: ["wall-shelf-a", "wall-shelf-b"],
    frames: { base: TROPHY, active: TROPHY },
    acquire: { type: "milestone", at: 50 },
    addedIn: "1.0.4"
  },
  {
    id: "frame-moon",
    nameKo: "달 그림",
    nameEn: "Moon art",
    slots: ["wall-frame"],
    frames: { base: FRAME_MOON, active: FRAME_MOON },
    acquire: { type: "milestone", at: 60 },
    addedIn: "1.0.4"
  }
];

export function itemById(id: string): PixelItem | undefined {
  return ITEM_CATALOG.find((item) => item.id === id);
}

/** 아이템이 속한 꾸미기 그룹 */
export function groupOfItem(item: PixelItem): SlotGroup | undefined {
  return SLOT_GROUPS.find((group) => group.slots.some((slot) => item.slots.includes(slot)));
}

/** 슬롯별 기본 배치 (없으면 비어 있는 슬롯) */
export const DEFAULT_PLACEMENTS: Partial<Record<SlotId, string>> = {
  wallpaper: "wallpaper-sky",
  flooring: "flooring-periwinkle",
  "wall-window": "window-basic",
  "furniture-desk": "desk-indigo",
  "desk-left": "glass-basic",
  "desk-center": "monitor-basic",
  "desk-right": "plant-basic",
  "desk-lamp": "lamp-basic",
  "floor-left": "cat-basic"
};

export function isOwned(item: PixelItem, cumulativeDone: number): boolean {
  return item.acquire.type === "milestone" ? cumulativeDone >= item.acquire.at : true;
}

/** 누적 챙김 기준으로 소장한 아이템 목록 (도착 순서 유지) */
export function ownedItems(cumulativeDone: number): PixelItem[] {
  return ITEM_CATALOG.filter((item) => isOwned(item, cumulativeDone));
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
