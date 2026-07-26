import type { PixelItem, SlotId } from "./catalog";

/**
 * 1.0.6 테마 아이템.
 *
 * 공통 도트 규칙
 * - 슬롯 원본 해상도에서 직접 설계한다. 확대/축소 보간을 하지 않는다.
 * - 외곽선은 carbon(C), 깊은 면은 indigo(I)로 통일한다.
 * - 좌상단 광원, 2~3단계 명암, 연결된 픽셀 덩어리를 우선한다.
 * - 단독 1픽셀은 눈·반짝임·작은 무늬처럼 의미가 있을 때만 쓴다.
 */

const repeatRow = (pattern: string, width: number) =>
  pattern.repeat(Math.ceil(width / pattern.length)).slice(0, width);

const tileRows = (tile: string[], width: number, height: number) =>
  Array.from({ length: height }, (_, y) => repeatRow(tile[y % tile.length], width));

const centeredRow = (width: number, content: string, fill: string) => {
  const left = Math.floor((width - content.length) / 2);
  return fill.repeat(left) + content + fill.repeat(width - left - content.length);
};

const deskLegRow = (width: number, color: string) => {
  const row = Array(width).fill(".");
  row[2] = row[3] = color;
  row[width - 4] = row[width - 3] = color;
  return row.join("");
};

const CAT_WALLPAPER = tileRows(
  [
    "KKKKKKKKKKKKKKKK",
    "KKKPPKPPKKKKKKKK",
    "KKKPPPPPKKKKKKKK",
    "KKKPMWMPKKKKKKKK",
    "KKKPPAPPKKKKKKKK",
    "KKKKPPPKKKKKKKKK",
    "KKKKKKKKKKKKKKKK",
    "KKKKKKKKKKKKKKKK"
  ],
  64,
  31
);

const SUMMER_WALLPAPER = tileRows(
  [
    "KKKKKKKKKKKKKKKK",
    "KKEEEEKKKKKKKKKK",
    "KEEEEEEKKKKKKKKK",
    "KKEEEEKKKKKKKKKK",
    "KKKKKKKKKKKKKKKK",
    "KKKKKKKKKKEEEEKK",
    "KKKKKKKKKEEEEEEKK",
    "KKKKKKKKKKEEEEKK"
  ],
  64,
  31
);

const AUTUMN_WALLPAPER = tileRows(
  [
    "YYYYYYYYYYYYYYYY",
    "YYYYOOYYYYYYYYYY",
    "YYYORROYYYYYYYYY",
    "YYYYRRYYYYYYYYYY",
    "YYYYGYYYYYYYYYYY",
    "YYYYYYYYYYYYYYYY",
    "YYYYYYYYYYYYYYYY",
    "YYYYYYYYYYYYYYYY"
  ],
  64,
  31
);

const CAT_FLOORING = [
  "C".repeat(64),
  repeatRow("PPPPMMMM", 64),
  repeatRow("PPPPMMMM", 64),
  repeatRow("MMPPMPPM", 64),
  repeatRow("MMPPPPMM", 64),
  repeatRow("PPMPPMMP", 64),
  repeatRow("PPPPMMMM", 64),
  repeatRow("MMMMPPPP", 64),
  "I".repeat(64)
];

const SUMMER_FLOORING = [
  "B".repeat(64),
  repeatRow("YYYYYYEY", 64),
  repeatRow("YYYYEEEE", 64),
  "Y".repeat(64),
  repeatRow("YYYYYYNY", 64),
  "Y".repeat(64),
  repeatRow("YYNYYYYY", 64),
  "Y".repeat(64),
  "N".repeat(64)
];

const AUTUMN_FLOORING = [
  "R".repeat(64),
  "N".repeat(64),
  repeatRow("NNNNNNRN", 64),
  "N".repeat(64),
  repeatRow("NRNNNNNN", 64),
  "N".repeat(64),
  repeatRow("NNNNRNNN", 64),
  "N".repeat(64),
  "C".repeat(64)
];

const CAT_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CEEEEEEEEEEEEEEC",
  "CEEEEEEEEEEEEEEC",
  "CEEEECCEECCEEEEC",
  "CEEEECCCCCCEEEEC",
  "CEEEECCWWCCEEEEC",
  "CEEEECCCCCCEEEEC",
  "CEEEECCCCCCEEEEC",
  "CEEEEECCCCEEEEEC",
  "CEEEEECCCCEEEEEC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const SUMMER_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CEEEEEEEEEEEEEEC",
  "CEYYYYEEEEEEEEEC",
  "CYYYYYYEEEEEEEEC",
  "CEYYYYEEEEEEEEEC",
  "CEEEEEEEEEEEEEEC",
  "CBBBBBBBBBBBBBBC",
  "CBBWWBBBBWWBBBBC",
  "CBBBBWWBBBBWWBBC",
  "CBBBBBBBBBBBBBBC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const AUTUMN_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CYYYYYYYYYYYYYYC",
  "CYYYOOYYYYRYYYYC",
  "CYYORROYYRRRYYYC",
  "CYYYRRYYYYRYYYYC",
  "CYYYYYOOYYYYYYYC",
  "CYYYYORROYYYYYYC",
  "COOYYYRRYYYYROOC",
  "CRROYYYYYYYORROC",
  "CYYYYYYYYYYYYYYC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const CAT_DESK = [
  "H".repeat(56),
  "C".repeat(56),
  "P".repeat(56),
  centeredRow(56, "CCKCCKCC", "P"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "I"))
];

const SUMMER_DESK = [
  "E".repeat(56),
  "B".repeat(56),
  "Y".repeat(56),
  centeredRow(56, "BBWWWWBB", "Y"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "B"))
];

const AUTUMN_DESK = [
  "O".repeat(56),
  "R".repeat(56),
  "N".repeat(56),
  centeredRow(56, "ORRGGRRO", "N"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "R"))
];

const CAT_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIIIPPIIPPIIIC",
  "CIIIPPPPPPIIIC",
  "CIIIPWPWPIIIIC",
  "CIIIIPAPPIIIIC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const SUMMER_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CEEEEEEEEEEEEC",
  "CEYYEEEEEEEEEC",
  "CYYYYEEEEEEEEC",
  "CEEEEEEEEEEEEC",
  "CBBBBWWBBBBBBC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const AUTUMN_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CYYYYYYYYYYYYC",
  "CYYYYOOYYYYYYC",
  "CYYYORROYYYYYC",
  "CYYYYRRYYYYYYC",
  "CYYYYGYYYYYYYC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const CAT_MUG = [".C.C..", ".CCCC.", "CWPWCC", "CPPCCC", "CCCC..", ".CCC.."];
const SUMMER_LEMONADE = [".B.Y..", ".B.Y..", "CYYYYC", "CYWYYC", "CYYYYC", ".CCCC."];
const AUTUMN_CUP = ["..OO..", ".ORRO.", "CCCCCC", "CYYYNC", "CNNNCC", ".CCCC."];

const CAT_GRASS = [
  "..GGG..",
  ".GGGGG.",
  "GGTGGGG",
  ".GGGGG.",
  "..GGG..",
  ".C.C.C.",
  ".CWPWC.",
  "..CCC.."
];

const SUMMER_SUNFLOWER = [
  "..YYY..",
  ".YOOOY.",
  ".YOOOY.",
  "..YYY..",
  "...G...",
  "..GGG..",
  ".CYYYC.",
  "..CCC.."
];

const AUTUMN_MAPLE = [
  "R.O.O.R",
  ".ROOOR.",
  "OORRROO",
  ".ORRRO.",
  "..NRN..",
  "...N...",
  ".CRRRC.",
  "..CCC.."
];

const CAT_LAMP = [
  "C.C..",
  "CCCC.",
  "CWWC.",
  ".CC..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];

const SUMMER_LAMP = [
  ".Y.Y.",
  "YYYYY",
  "YWWYY",
  ".BBB.",
  "..B..",
  "..B..",
  "..B..",
  "..B..",
  "..B..",
  "..B..",
  ".BBB.",
  "BBBBB"
];

const AUTUMN_LAMP = [
  ".OO..",
  "ORRO.",
  "RRRR.",
  ".NN..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  ".RRR.",
  "RRRRR"
];

const CAT_DESK_FRONT = ["CPCCPCCP", "CWWAWWAC", "CCCCCCCC"];
const SUMMER_DESK_FRONT = ["BBBBBBBB", "BWEWEWEB", "CCCCCCCC"];
const AUTUMN_DESK_FRONT = ["RRRRRRRR", "RYOYORYR", "CCCCCCCC"];

const CAT_SHELF = ["C.C..", "CCCC.", "CWCW.", "CCCCC"];
const SUMMER_SHELF = ["..E..", ".EWE.", "EYBYE", ".CCC."];
const AUTUMN_SHELF = [".OO..", "ORRO.", ".NN..", "CCCCC"];

const CAT_FRAME = ["CCCCCC", "CPPPPC", "CPIPIC", "CPWPWC", "CPAPPC", "CPPPPC", "CCCCCC"];
const SUMMER_FRAME = ["CCCCCC", "CEEEEC", "CEYYEC", "CYYYEC", "CBBBBC", "CBWWBC", "CCCCCC"];
const AUTUMN_FRAME = ["CCCCCC", "CYYYYC", "COOYRC", "CORRRC", "CRNNRC", "CNNNNC", "CCCCCC"];

const CAT_CLOCK = ["C..C", "CCCC", "CWAC", ".CC."];
const SUMMER_CLOCK = [".YY.", "YWWY", "YWBY", ".YY."];
const AUTUMN_CLOCK = [".OO.", "ORRO", "ORGO", ".OO."];

const TUXEDO_CAT = ["C.C...", "CCCC..", "CWKW..", "CCAC..", "CCWW.C", "CCCCCC", ".C..C.", "C....C"];
const SUMMER_CAT = [".YYYY.", "B.B...", "BBBB..", "BWBW..", "BBBB.Y", "BBBBBB", ".B..B.", "B....B"];
const AUTUMN_CAT = ["O.O...", "OOOO..", "OWRW..", "OORO..", "OOOO.O", "OOOOOO", ".R..R.", "R....R"];

const CAT_CUSHION = ["......", "......", ".P..P.", "PPPPPP", "PWWWWP", "PPPPPP", ".MMMM.", "..MM.."];
const SUMMER_BASKET = ["......", "..YY..", ".YBBY.", "YYYYYY", "YWWWWY", "YBBBBY", "YYYYYY", ".NNNN."];
const AUTUMN_PUMPKINS = ["......", "..G...", ".OOO..", "OOOOO.", "ORORO.", ".OOO.O", "..O.OO", ".RRRR."];

function makeThemeItem(
  id: string,
  nameKo: string,
  nameEn: string,
  slot: SlotId | SlotId[],
  rows: string[],
  milestone: number
): PixelItem {
  return {
    id,
    nameKo,
    nameEn,
    slots: Array.isArray(slot) ? slot : [slot],
    frames: { base: rows, active: rows },
    acquire: { type: "milestone", at: milestone },
    addedIn: "1.0.6"
  };
}

/** 첫 틈/12번째 틈/36번째 틈에 한 테마 전체가 열려 방을 한 번에 맞출 수 있다. */
export const THEME_ITEMS: PixelItem[] = [
  // 저장 호환성을 위해 기존 cat-* id는 유지하고 사용자 표시만 라이벌 테마로 바꾼다.
  makeThemeItem("cat-wallpaper", "라이벌 벽지", "Rival wallpaper", "wallpaper", CAT_WALLPAPER, 1),
  makeThemeItem("cat-flooring", "라이벌 발자국 바닥", "Rival paw-print flooring", "flooring", CAT_FLOORING, 1),
  makeThemeItem("cat-window", "창가의 라이벌", "Window rival", "wall-window", CAT_WINDOW, 1),
  makeThemeItem("cat-desk", "라이벌 책상", "Rival desk", "furniture-desk", CAT_DESK, 1),
  makeThemeItem("cat-monitor", "라이벌 모니터", "Rival monitor", "desk-center", CAT_MONITOR, 1),
  makeThemeItem("cat-mug", "라이벌 머그", "Rival mug", "desk-left", CAT_MUG, 1),
  makeThemeItem("cat-grass", "수상한 화분", "Suspicious plant", "desk-right", CAT_GRASS, 1),
  makeThemeItem("cat-lamp", "라이벌 조명", "Rival lamp", "desk-lamp", CAT_LAMP, 1),
  makeThemeItem("cat-desk-mat", "라이벌 데스크 매트", "Rival desk mat", "desk-front", CAT_DESK_FRONT, 1),
  makeThemeItem(
    "cat-figure",
    "라이벌 피규어",
    "Rival figure",
    ["wall-shelf-a", "wall-shelf-b"],
    CAT_SHELF,
    1
  ),
  makeThemeItem("cat-portrait", "라이벌 초상화", "Rival portrait", "wall-frame", CAT_FRAME, 1),
  makeThemeItem("cat-clock", "라이벌 시계", "Rival clock", "wall-clock", CAT_CLOCK, 1),
  makeThemeItem("cat-tuxedo", "꼬마 라이벌", "Little rival", "floor-left", TUXEDO_CAT, 1),
  makeThemeItem("cat-cushion", "라이벌 방석", "Rival cushion", "floor-right", CAT_CUSHION, 1),

  makeThemeItem("summer-wallpaper", "바닷바람 벽지", "Sea-breeze wallpaper", "wallpaper", SUMMER_WALLPAPER, 12),
  makeThemeItem("summer-flooring", "모래빛 바닥", "Sandy flooring", "flooring", SUMMER_FLOORING, 12),
  makeThemeItem("summer-window", "한여름 창문", "Summer window", "wall-window", SUMMER_WINDOW, 12),
  makeThemeItem("summer-desk", "해변빛 책상", "Beach desk", "furniture-desk", SUMMER_DESK, 12),
  makeThemeItem("summer-monitor", "바다 모니터", "Ocean monitor", "desk-center", SUMMER_MONITOR, 12),
  makeThemeItem("summer-lemonade", "레모네이드", "Lemonade", "desk-left", SUMMER_LEMONADE, 12),
  makeThemeItem("summer-sunflower", "해바라기", "Sunflower", "desk-right", SUMMER_SUNFLOWER, 12),
  makeThemeItem("summer-lamp", "조개 조명", "Shell lamp", "desk-lamp", SUMMER_LAMP, 12),
  makeThemeItem("summer-desk-mat", "파도 데스크 매트", "Wave desk mat", "desk-front", SUMMER_DESK_FRONT, 12),
  makeThemeItem(
    "summer-shell",
    "작은 조개",
    "Little shell",
    ["wall-shelf-a", "wall-shelf-b"],
    SUMMER_SHELF,
    12
  ),
  makeThemeItem("summer-frame", "여름 바다 그림", "Summer sea art", "wall-frame", SUMMER_FRAME, 12),
  makeThemeItem("summer-clock", "햇살 시계", "Sun clock", "wall-clock", SUMMER_CLOCK, 12),
  makeThemeItem("summer-cat", "여름 고양이", "Summer cat", "floor-left", SUMMER_CAT, 12),
  makeThemeItem("summer-basket", "피크닉 바구니", "Picnic basket", "floor-right", SUMMER_BASKET, 12),

  makeThemeItem("autumn-wallpaper", "단풍 벽지", "Autumn-leaf wallpaper", "wallpaper", AUTUMN_WALLPAPER, 36),
  makeThemeItem("autumn-flooring", "따뜻한 나무 바닥", "Warm wood flooring", "flooring", AUTUMN_FLOORING, 36),
  makeThemeItem("autumn-window", "가을빛 창문", "Autumn window", "wall-window", AUTUMN_WINDOW, 36),
  makeThemeItem("autumn-desk", "오크 책상", "Oak desk", "furniture-desk", AUTUMN_DESK, 36),
  makeThemeItem("autumn-monitor", "단풍 모니터", "Autumn monitor", "desk-center", AUTUMN_MONITOR, 36),
  makeThemeItem("autumn-cup", "도토리 찻잔", "Acorn cup", "desk-left", AUTUMN_CUP, 36),
  makeThemeItem("autumn-maple", "작은 단풍나무", "Little maple", "desk-right", AUTUMN_MAPLE, 36),
  makeThemeItem("autumn-lamp", "도토리 조명", "Acorn lamp", "desk-lamp", AUTUMN_LAMP, 36),
  makeThemeItem("autumn-desk-mat", "낙엽 데스크 매트", "Autumn desk mat", "desk-front", AUTUMN_DESK_FRONT, 36),
  makeThemeItem(
    "autumn-acorns",
    "도토리 장식",
    "Acorn ornament",
    ["wall-shelf-a", "wall-shelf-b"],
    AUTUMN_SHELF,
    36
  ),
  makeThemeItem("autumn-frame", "가을 숲 그림", "Autumn forest art", "wall-frame", AUTUMN_FRAME, 36),
  makeThemeItem("autumn-clock", "낙엽 시계", "Leaf clock", "wall-clock", AUTUMN_CLOCK, 36),
  makeThemeItem("autumn-cat", "가을 고양이", "Autumn cat", "floor-left", AUTUMN_CAT, 36),
  makeThemeItem("autumn-pumpkins", "작은 호박들", "Little pumpkins", "floor-right", AUTUMN_PUMPKINS, 36)
];
