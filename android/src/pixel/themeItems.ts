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

interface PixelStamp {
  x: number;
  y: number;
  rows: string[];
}

/** 긴 반복 타일 대신 장면별 비대칭 패턴을 정수 격자에 조립한다. */
const paintRows = (
  width: number,
  height: number,
  fill: string,
  stamps: PixelStamp[]
) => {
  const pixels = Array.from({ length: height }, () => Array(width).fill(fill));
  for (const stamp of stamps) {
    stamp.rows.forEach((row, offsetY) => {
      [...row].forEach((token, offsetX) => {
        if (token === ".") return;
        const x = stamp.x + offsetX;
        const y = stamp.y + offsetY;
        if (x >= 0 && x < width && y >= 0 && y < height) pixels[y][x] = token;
      });
    });
  }
  return pixels.map((row) => row.join(""));
};

const CAT_WALLPAPER = paintRows(64, 31, "E", [
  { x: 0, y: 0, rows: ["K".repeat(64), "H".repeat(64)] },
  { x: 15, y: 2, rows: Array.from({ length: 22 }, () => "K") },
  { x: 31, y: 2, rows: Array.from({ length: 22 }, () => "P") },
  { x: 48, y: 2, rows: Array.from({ length: 22 }, () => "K") },
  {
    x: 21,
    y: 5,
    rows: [
      "..MMMM...",
      ".MPPPPM..",
      "MPMHHPM..",
      "MPHMPPM..",
      "MPPPPM...",
      ".MMMM....",
      ".....PP..",
      ".......PP"
    ]
  },
  {
    x: 51,
    y: 6,
    rows: [
      "P......P",
      ".P....P.",
      "..P..P..",
      "PPP..PPP",
      "..P..P..",
      ".P....P."
    ]
  },
  {
    x: 4,
    y: 18,
    rows: [
      ".PP...........",
      "PPPP.....PP...",
      ".PP..PPPP..PPP",
      ".............."
    ]
  },
  { x: 0, y: 24, rows: ["P".repeat(64), "K".repeat(64)] },
  {
    x: 0,
    y: 26,
    rows: [
      repeatRow("EEEEKKKK", 64),
      repeatRow("EEEEKKKK", 64),
      repeatRow("KKKKEEEE", 64),
      repeatRow("KKKKEEEE", 64),
      "P".repeat(64)
    ]
  }
]);

const SUMMER_WALLPAPER = paintRows(64, 31, "K", [
  { x: 0, y: 13, rows: ["E".repeat(64), "B".repeat(64)] },
  { x: 0, y: 15, rows: Array.from({ length: 7 }, () => "B".repeat(64)) },
  { x: 0, y: 22, rows: Array.from({ length: 9 }, () => "Y".repeat(64)) },
  { x: 51, y: 3, rows: ["..AAA..", ".AAAAA.", "AAAAAAA", ".AAAAA.", "..AAA.."] },
  { x: 7, y: 5, rows: ["..HH.....", ".HHHH.HH.", "HHHHHHHHH", ".HHHHHH.."] },
  { x: 18, y: 14, rows: ["...EEE....", ".EEEEEEEE.", "EEEEBBBBEE", "..BBBBBB.."] },
  { x: 39, y: 17, rows: ["...EEEE...", ".EEEEEEEE.", "EEBBBBBBEE"] },
  { x: 7, y: 24, rows: [".N.", "NNN", ".N.", ".N.", "N.N"] },
  { x: 34, y: 8, rows: ["C.C", ".C."] }
]);

const AUTUMN_WALLPAPER = paintRows(64, 31, "Y", [
  { x: 0, y: 0, rows: ["E".repeat(64)] },
  { x: 0, y: 24, rows: Array.from({ length: 7 }, () => "N".repeat(64)) },
  {
    x: 3,
    y: 3,
    rows: [
      "NNN................................",
      ".NNNNNN............................",
      "....NNNNNNN........................",
      ".........NNNNNN....................",
      "..............NNNNN................",
      "..................NNNN............."
    ]
  },
  { x: 8, y: 2, rows: [".OO.", "ORRO", ".RR."] },
  { x: 19, y: 6, rows: [".RR.", "ROOR", ".OO."] },
  { x: 32, y: 5, rows: [".GG.", "GOOG", ".OO."] },
  { x: 47, y: 10, rows: [".OO.", "ORRO", ".RR."] },
  { x: 55, y: 17, rows: [".RR.", "ROOR", ".OO."] },
  { x: 27, y: 18, rows: [".O.", "ORO", ".R."] }
]);

const CAT_FLOORING = paintRows(64, 9, "M", [
  { x: 0, y: 0, rows: ["I".repeat(64)] },
  { x: 0, y: 1, rows: ["P".repeat(21)] },
  { x: 22, y: 1, rows: ["P".repeat(27)] },
  { x: 50, y: 1, rows: ["P".repeat(14)] },
  { x: 8, y: 4, rows: ["P".repeat(24)] },
  { x: 33, y: 4, rows: ["P".repeat(20)] },
  { x: 54, y: 4, rows: ["P".repeat(10)] },
  { x: 0, y: 7, rows: ["P".repeat(17)] },
  { x: 18, y: 7, rows: ["P".repeat(30)] },
  { x: 49, y: 7, rows: ["P".repeat(15)] },
  { x: 24, y: 2, rows: [".HH.", "HHHH", ".HH."] },
  { x: 39, y: 5, rows: [".HH.", "HHHH", ".HH."] },
  { x: 0, y: 8, rows: ["I".repeat(64)] }
]);

const SUMMER_FLOORING = paintRows(64, 9, "N", [
  { x: 0, y: 0, rows: ["T".repeat(64)] },
  { x: 0, y: 2, rows: ["Y".repeat(18)] },
  { x: 19, y: 2, rows: ["Y".repeat(23)] },
  { x: 43, y: 2, rows: ["Y".repeat(21)] },
  { x: 8, y: 5, rows: ["Y".repeat(25)] },
  { x: 34, y: 5, rows: ["Y".repeat(30)] },
  { x: 0, y: 8, rows: ["R".repeat(64)] }
]);

const AUTUMN_FLOORING = paintRows(64, 9, "N", [
  { x: 0, y: 0, rows: ["I".repeat(64)] },
  { x: 0, y: 1, rows: [repeatRow("NNNNRRRR", 64)] },
  { x: 0, y: 2, rows: [repeatRow("NNRRRRNN", 64)] },
  { x: 0, y: 3, rows: [repeatRow("RRRRNNNN", 64)] },
  { x: 0, y: 4, rows: [repeatRow("RRNNNNRR", 64)] },
  { x: 0, y: 5, rows: [repeatRow("NNNNRRRR", 64)] },
  { x: 0, y: 6, rows: [repeatRow("NNRRRRNN", 64)] },
  { x: 0, y: 7, rows: [repeatRow("RRRRNNNN", 64)] },
  { x: 0, y: 8, rows: ["I".repeat(64)] }
]);

const CAT_WINDOW = [
  "....CCCCCCCC....",
  "..CCIIIIIIIICC..",
  ".CIIIIICIIIIIIIC",
  "CIIHHIICIIIIIIIC",
  "CIHHHHICIIIIIIIC",
  "CIIHHIICIIIIIIIC",
  "CIIIIIICIIIIIIIC",
  "CIIIIICCIIIICCCC",
  "CIIICCCCCCCCCCCC",
  "CIICCCCCCCCCCCCC",
  ".CCCCCCCCCCCCCC.",
  "..CCCCCCCCCCCC.."
];

const SUMMER_WINDOW = [
  "....CCCCCCCC....",
  "..CCEEEEEEEECC..",
  ".CEEEEEEEEEEEEC.",
  "CEEEYYYYEEEEEEEC",
  "CEEYYYYYYEEEEEEC",
  "CEEEYYYYEEEEEEEC",
  "CEEEEEEEEEEEEEEC",
  "CEBBBBBBBBBBBBEC",
  "CBBBBEBBBEBBBBBC",
  "CBBEEEBBEEEBBBBC",
  ".CBBBBBBBBBBBCC.",
  "..CCCCCCCCCCCC.."
];

const AUTUMN_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CYYYYYYYYYYYYYYC",
  "CYYYNYYYYNYYYYYC",
  "CYYYNOOYYNRRYYYC",
  "CYYNROOYYNORRYYC",
  "CYYNYYYYYNYYYYYC",
  "CYNYYRRYYNYYOOYC",
  "CYNNNRRNNNYYROYC",
  "CNNNNNNNNNNNYYYC",
  "CNNNNNNNNNNNNNNC",
  "CIIIIIIIIIIIIIIC",
  "CCCCCCCCCCCCCCCC"
];

const CAT_DESK = paintRows(56, 8, ".", [
  { x: 2, y: 0, rows: ["H".repeat(52)] },
  { x: 1, y: 1, rows: ["C".repeat(54)] },
  { x: 1, y: 2, rows: [`C${"N".repeat(52)}C`] },
  { x: 1, y: 3, rows: [`C${"N".repeat(52)}C`] },
  { x: 9, y: 3, rows: ["CCCCCCCCCCCC", "CWWWWAWWWWWC", "CCCCCCCCCCCC"] },
  { x: 34, y: 3, rows: ["CCCCCCCCCCCC", "CWWWWAWWWWWC", "CCCCCCCCCCCC"] },
  { x: 26, y: 3, rows: [".CCC.", "CCWCC", "CCCCC"] },
  { x: 3, y: 5, rows: ["CNN", "CNN", "CNN"] },
  { x: 50, y: 5, rows: ["NNC", "NNC", "NNC"] }
]);

const SUMMER_DESK = [
  `..${"H".repeat(52)}..`,
  `.${"C".repeat(54)}.`,
  `C${"B".repeat(54)}C`,
  centeredRow(56, "CTEEEETC", "B"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "I"))
];

const AUTUMN_DESK = [
  `.C${"O".repeat(14)}${"R".repeat(12)}${"O".repeat(13)}${"R".repeat(13)}C.`,
  `C${"N".repeat(54)}C`,
  `C${"R".repeat(54)}C`,
  centeredRow(56, "CYYCCYYC", "R"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const CAT_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIIWIIIIIIIIIC",
  "CIIWWIIIIIIIIC",
  "CIIWMWIIIIIIIC",
  "CIIIIIIIIIIIIC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const SUMMER_MONITOR = [
  "..CCCCCCCCCC..",
  ".CEEEEEEEEEEC.",
  "CEEBBBBBBBBEEC",
  "CEBBEEBBBBBBEC",
  "CBBEEEEBBEEBBC",
  "CBBBBBBBBBBBBC",
  ".CCCCCCCCCCCC.",
  "......TT......",
  ".....TTTT.....",
  "...TTTTTTTT..."
];

const AUTUMN_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CYYYYYYYYYYYYC",
  "CYYYOOYYYYYYYC",
  "CYYORROYYYRYYC",
  "CYYYRRYYYRRRYC",
  "CYYYYGYYYYRYYC",
  "CCCCCCCCCCCCCC",
  ".....CCCC.....",
  "......CC......",
  "....CCCCCC...."
];

const CAT_MUG = [".M..M.", "MCCCCM", "MCWWCC", "MCPMCC", ".MCCM.", "..MM.."];
const SUMMER_LEMONADE = ["..C.Y.", ".C..Y.", "CYYYYC", "CYWYYC", "CYYYYC", ".CTTC."];
const AUTUMN_CUP = ["..GG..", ".GOOG.", ".CCCC.", "COYYOC", "CRNNRC", ".CCCC."];

const CAT_GRASS = [
  "G...G.G",
  ".G.G.G.",
  "..GGG..",
  "...G...",
  ".CCCCC.",
  ".CWNWC.",
  ".CCCCC.",
  "..CCC.."
];

const SUMMER_SUNFLOWER = [
  "G....G.",
  ".G..G..",
  "..GG...",
  "..GGG..",
  "...G...",
  ".CGGGC.",
  ".CYYYC.",
  "..CCC.."
];

const AUTUMN_MAPLE = [
  "O.R.R.O",
  ".ORRRO.",
  "RRORORR",
  ".ORRRO.",
  "..NRN..",
  "...N...",
  ".CGGGC.",
  "..CCC.."
];

const CAT_LAMP = [
  ".MMM.",
  "MCPPM",
  "MHWPM",
  ".MCM.",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".MCM.",
  "MMMMM"
];

const SUMMER_LAMP = [
  "..C..",
  ".CTTC",
  "CTWTC",
  ".CCC.",
  "..T..",
  "..T..",
  "..T..",
  "..T..",
  "..T..",
  "..T..",
  ".BTB.",
  "BBBBB"
];

const AUTUMN_LAMP = [
  ".GGG.",
  "GOOOG",
  "ORRRO",
  ".NCN.",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".ICI.",
  "IIIII"
];

const CAT_DESK_FRONT = [".AAAAAA.", "ACCCWCA.", "AAAAAAAA"];
const SUMMER_DESK_FRONT = [".EEEEEE.", "EBBBBBBE", "TTTTTTTT"];
const AUTUMN_DESK_FRONT = [".AA..AA.", "AOROOROA", "CCCCCCCC"];

const CAT_SHELF = ["..C..", "CWCWC", ".CCC.", "CCCCC"];
const SUMMER_SHELF = ["..E..", ".EWE.", "EYBYE", "TTTTT"];
const AUTUMN_SHELF = ["O.O..", "RORO.", ".NN..", "IIIII"];

const CAT_FRAME = ["CCCCCC", "CHHHHC", "CICPMC", "CIICPC", "CPCMIC", "CHHHHC", "CCCCCC"];
const SUMMER_FRAME = ["CCCCCC", "CKKKKC", "CKAYKC", "CBBBBC", "CBEEBC", "CYYYYC", "CCCCCC"];
const AUTUMN_FRAME = ["CCCCCC", "CYYYYC", "COOYRC", "CORRRC", "CRNNRC", "CIIIIC", "CCCCCC"];

const CAT_CLOCK = [".MMC", "MPPM", "MPWM", ".MM."];
const SUMMER_CLOCK = [".C.C", "CWWC", "CWBC", ".CC."];
const AUTUMN_CLOCK = [".O..", "ORRO", "ORGO", ".RR."];

const TUXEDO_CAT = ["C.C...", "CCCI..", "CWCW..", "CCAI..", "CWWC.C", "CWWCCI", ".C..C.", "C....I"];
const SUMMER_CAT = ["..NN..", ".NNNN.", "NWNWNN", "NNYNNN", ".NBBN.", "NBBBBN", ".N..N.", "N....N"];
const AUTUMN_CAT = ["C...C.", "ORRRO.", "OWRWO.", "ORWWO.", ".RRRRO", "RRRROO", ".R..O.", "R...OO"];

const CAT_CUSHION = ["......", "......", "..MM..", ".MHHM.", "MHIICM", "MCCCCM", ".MMMM.", "..CC.."];
const SUMMER_BASKET = ["......", "..CC..", ".CYYC.", "CYYYYC", "CYNYNC", "CYYYYC", "CCCCCC", ".NNNN."];
const AUTUMN_PUMPKINS = ["......", "..G...", ".OOO..", "OOOOO.", "ORORO.", ".OOO.O", "..O.OO", ".RRRR."];

function makeThemeItem(
  id: string,
  nameKo: string,
  nameEn: string,
  slot: SlotId | SlotId[],
  rows: string[],
  milestone: number
): PixelItem {
  const themeKey = id.startsWith("summer-")
    ? "summer"
    : id.startsWith("autumn-")
      ? "autumn"
      : "cat";
  return {
    id,
    nameKo,
    nameEn,
    slots: Array.isArray(slot) ? slot : [slot],
    frames: { base: rows, active: rows },
    acquire: { type: "milestone", at: milestone },
    themeKey,
    addedIn: "1.0.6"
  };
}

/** 첫 틈/12번째 틈/36번째 틈에 한 테마 전체가 열려 방을 한 번에 맞출 수 있다. */
export const THEME_ITEMS: PixelItem[] = [
  makeThemeItem("cat-wallpaper", "고양이와 생쥐 벽지", "Cat & Mouse wallpaper", "wallpaper", CAT_WALLPAPER, 1),
  makeThemeItem("cat-flooring", "고양이와 생쥐 발자국 바닥", "Cat & Mouse paw-print flooring", "flooring", CAT_FLOORING, 1),
  makeThemeItem("cat-window", "고양이와 생쥐 창문", "Cat & Mouse window", "wall-window", CAT_WINDOW, 1),
  makeThemeItem("cat-desk", "고양이와 생쥐 책상", "Cat & Mouse desk", "furniture-desk", CAT_DESK, 1),
  makeThemeItem("cat-monitor", "고양이와 생쥐 모니터", "Cat & Mouse monitor", "desk-center", CAT_MONITOR, 1),
  makeThemeItem("cat-mug", "회색 생쥐 머그", "Grey mouse mug", "desk-left", CAT_MUG, 1),
  makeThemeItem("cat-grass", "생선뼈 고양이풀", "Fishbone cat grass", "desk-right", CAT_GRASS, 1),
  makeThemeItem("cat-lamp", "실타래 스탠드", "Yarn lamp", "desk-lamp", CAT_LAMP, 1),
  makeThemeItem("cat-desk-mat", "치즈 데스크 매트", "Cheese desk mat", "desk-front", CAT_DESK_FRONT, 1),
  makeThemeItem(
    "cat-figure",
    "생선뼈 미니어처",
    "Fishbone miniature",
    ["wall-shelf-a", "wall-shelf-b"],
    CAT_SHELF,
    1
  ),
  makeThemeItem("cat-portrait", "술래잡기 액자", "Chase portrait", "wall-frame", CAT_FRAME, 1),
  makeThemeItem("cat-clock", "실타래 시계", "Yarn clock", "wall-clock", CAT_CLOCK, 1),
  makeThemeItem("cat-tuxedo", "턱시도냥이", "Tuxedo cat", "floor-left", TUXEDO_CAT, 1),
  makeThemeItem("cat-cushion", "쥐구멍 쿠션", "Mouse-hole cushion", "floor-right", CAT_CUSHION, 1),

  makeThemeItem("summer-wallpaper", "바닷바람 벽지", "Sea-breeze wallpaper", "wallpaper", SUMMER_WALLPAPER, 12),
  makeThemeItem("summer-flooring", "모래빛 바닥", "Sandy flooring", "flooring", SUMMER_FLOORING, 12),
  makeThemeItem("summer-window", "한여름 창문", "Summer window", "wall-window", SUMMER_WINDOW, 12),
  makeThemeItem("summer-desk", "해변빛 책상", "Beach desk", "furniture-desk", SUMMER_DESK, 12),
  makeThemeItem("summer-monitor", "바다 모니터", "Ocean monitor", "desk-center", SUMMER_MONITOR, 12),
  makeThemeItem("summer-lemonade", "레모네이드", "Lemonade", "desk-left", SUMMER_LEMONADE, 12),
  makeThemeItem("summer-sunflower", "야자 화분", "Palm planter", "desk-right", SUMMER_SUNFLOWER, 12),
  makeThemeItem("summer-lamp", "조개 스탠드", "Shell lamp", "desk-lamp", SUMMER_LAMP, 12),
  makeThemeItem("summer-desk-mat", "포말 데스크 매트", "Sea-foam desk mat", "desk-front", SUMMER_DESK_FRONT, 12),
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
  makeThemeItem("summer-cat", "튜브 수달", "Tube otter", "floor-left", SUMMER_CAT, 12),
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
  makeThemeItem("autumn-cat", "단풍 여우", "Maple fox", "floor-left", AUTUMN_CAT, 36),
  makeThemeItem("autumn-pumpkins", "작은 호박들", "Little pumpkins", "floor-right", AUTUMN_PUMPKINS, 36)
];
