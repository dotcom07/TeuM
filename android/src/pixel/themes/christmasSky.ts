import type { SlotId } from "../catalog";
import type { ThemeArtItem, ThemeArtwork } from "../themeArtwork";

const repeatRow = (pattern: string, width: number) =>
  pattern.repeat(Math.ceil(width / pattern.length)).slice(0, width);

const stampedCanvas = (
  width: number,
  height: number,
  fill: string,
  stamps: Array<{ x: number; y: number; rows: string[] }>
) => {
  const canvas = Array.from({ length: height }, () => Array(width).fill(fill));
  for (const stamp of stamps) {
    stamp.rows.forEach((row, py) => {
      [...row].forEach((token, px) => {
        const x = stamp.x + px;
        const y = stamp.y + py;
        if (token !== "." && x >= 0 && x < width && y >= 0 && y < height) canvas[y][x] = token;
      });
    });
  }
  return canvas.map((row) => row.join(""));
};

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

function item(
  id: string,
  nameKo: string,
  nameEn: string,
  slot: SlotId | SlotId[],
  rows: string[],
  limited = false
): ThemeArtItem {
  return {
    id,
    nameKo,
    nameEn,
    slots: Array.isArray(slot) ? slot : [slot],
    rows,
    limited
  };
}

// ── 크리스마스 ──────────────────────────────────────────────

const LIGHT_STRING = ["N....N", ".A.R..", "..W.A.", "...R.."];

const CHRISTMAS_WALLPAPER = stampedCanvas(
  64,
  31,
  "G",
  [
    { x: 2, y: 2, rows: LIGHT_STRING },
    { x: 17, y: 6, rows: LIGHT_STRING },
    { x: 33, y: 2, rows: LIGHT_STRING },
    { x: 49, y: 7, rows: LIGHT_STRING },
    { x: 8, y: 20, rows: LIGHT_STRING },
    { x: 28, y: 23, rows: LIGHT_STRING },
    { x: 53, y: 22, rows: [".A.", "ARA", ".A."] }
  ]
);

const CHRISTMAS_FLOORING = [
  "C".repeat(64),
  repeatRow("RRRRGGGG", 64),
  repeatRow("RRRRGGGG", 64),
  repeatRow("GGGGRRRR", 64),
  repeatRow("GGGGRRRR", 64),
  repeatRow("RRRRGGGG", 64),
  repeatRow("RRRRGGGG", 64),
  repeatRow("GGGGRRRR", 64),
  "C".repeat(64)
];

const CHRISTMAS_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CGGGGGGGGGGGGGGC",
  "CGGGGAAAGGGGGGGC",
  "CGGGAGGGGAGGGGGC",
  "CGGAGGGGGAGGGGGC",
  "CGGAGWRWGAGGGGGC",
  "CGGAGGGGGAGGGGGC",
  "CGGGAGGGAGGGGGGC",
  "CGGGGAAAGGGGGGGC",
  "CGGGGGGGGGGGGGGC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const CHRISTMAS_DESK = [
  "A".repeat(56),
  "R".repeat(56),
  "N".repeat(56),
  centeredRow(56, "RRAWRARR", "N"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const CHRISTMAS_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CGGGGGGGGGGGGC",
  "CGGRRAGGGGGGGC",
  "CGRWWRAGGGGGGC",
  "CGGRRAGGGGGGGC",
  "CGGAAGGGGGGGGC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const CHRISTMAS_CUP = [
  ".W.W..",
  ".RWR..",
  "CWRWRC",
  "CRWRRC",
  "CWRWCC",
  ".CCCC."
];

const CHRISTMAS_TREE = [
  "...A...",
  "..GGG..",
  ".GAGGG.",
  "..GGG..",
  ".GGRGG.",
  "GGGGGGG",
  "...N...",
  "..NNN.."
];

const CHRISTMAS_LAMP = [
  ".AAA.",
  "ARWRA",
  ".AAA.",
  "..G..",
  "..G..",
  "..G..",
  "..G..",
  "..G..",
  "..G..",
  "..G..",
  ".GGG.",
  "GGGGG"
];

const CHRISTMAS_MAT = ["RGRGRGRG", "GAWAGAWA", "CCCCCCCC"];
const CHRISTMAS_BELL = [".A.A.", "AAAAA", ".RRR.", "CCCCC"];
const CHRISTMAS_FRAME = ["CCCCCC", "CRRRRC", "CRAARC", "CAWWAC", "CANNAC", "CNNNNC", "CCCCCC"];
const CHRISTMAS_CLOCK = [".NN.", "NWWN", "NARN", ".NN."];

const CHRISTMAS_CAT = [
  "..R...",
  ".RRR..",
  "C.C...",
  "CWC...",
  "CWAW..",
  "CCCC.C",
  ".C..C.",
  "C....C"
];

const CHRISTMAS_GIFTS = [
  ".RR.A.",
  "RRRRAA",
  "RWWRAA",
  "RRRRCC",
  ".GGGG.",
  "GGWAGG",
  "GGGGGG",
  ".NNNN."
];

// ── 하늘 · 구름 위 ──────────────────────────────────────────

const SKY_CLOUD = ["..WW...", ".WWWW..", "WWWWWW.", ".WWWW.."];

const SKY_WALLPAPER = stampedCanvas(
  64,
  31,
  "K",
  [
    { x: 2, y: 3, rows: SKY_CLOUD },
    { x: 23, y: 8, rows: SKY_CLOUD },
    { x: 45, y: 2, rows: SKY_CLOUD },
    { x: 53, y: 20, rows: SKY_CLOUD },
    { x: 11, y: 23, rows: SKY_CLOUD },
    { x: 35, y: 24, rows: [".A.", "AAA", ".A."] }
  ]
);

const SKY_FLOORING = [
  "C".repeat(64),
  "E".repeat(64),
  repeatRow("EEBBEEBB", 64),
  repeatRow("BBEEBBEE", 64),
  repeatRow("EEBBEEBB", 64),
  repeatRow("BBEEBBEE", 64),
  repeatRow("EEBBEEBB", 64),
  "B".repeat(64),
  "C".repeat(64)
];

const SKY_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CKKKKKKKKKKKKKKC",
  "CKKKWKKKKKKKWKKC",
  "CKKWWWKKKKKWWWKC",
  "CKWWWWWKKWWWWWKC",
  "CKKWWWKKKKKWWWKC",
  "CKKKWKKKKKKKWKKC",
  "CKKKKKKKKKKKKKKC",
  "CKKKKAAAAKKKKKKC",
  "CKKKAAAAAAKKKKKC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const SKY_DESK = [
  "W".repeat(56),
  "E".repeat(56),
  "B".repeat(56),
  centeredRow(56, "EEWEEWEE", "B"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const SKY_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CKKKKKKKKKKKKC",
  "CKKWWWKKKKKKKC",
  "CKWWWWWKKKKKKC",
  "CKKWWWKKKKKKKC",
  "CKKKKAAKKKKKKC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const SKY_CUP = [
  ".R.R..",
  ".OYO..",
  "CGGGBC",
  "CBIIBC",
  "CPIICC",
  ".CCCC."
];

const SKY_FLOWER = [
  "..W.W..",
  ".WWWWW.",
  "..WAW..",
  "...T...",
  "..TTT..",
  ".CEEEC.",
  ".CBBBC.",
  "..CCC.."
];

const SKY_LAMP = [
  ".WWW.",
  "WWWWW",
  ".WWW.",
  "..B..",
  "..B..",
  "..B..",
  "..B..",
  "..B..",
  "..B..",
  "..B..",
  ".BBB.",
  "BBBBB"
];

const SKY_MAT = ["KWBKWBBK", "BKKWBKKW", "CCCCCCCC"];
const SKY_PLANE = ["....W", "..WWW", "WWWWW", "..WW."];
const SKY_FRAME = ["CCCCCC", "CKKKKC", "CKWAKC", "CWWAWC", "CKBBKC", "CKKKKC", "CCCCCC"];
const SKY_CLOCK = [".AA.", "AWCC", "ABCC", ".CC."];

const SKY_BIRD = [
  "......",
  "......",
  ".BB...",
  "BBBB.A",
  "BWWBBA",
  ".BBBB.",
  "..B...",
  "..B..."
];

const SKY_BALLOON = [
  "..A...",
  ".AAAA.",
  "AWWAWA",
  ".AAAA.",
  "..NN..",
  "..NN..",
  ".NNNN.",
  "......"
];

export const CHRISTMAS_SKY_ARTWORK: ThemeArtwork[] = [
  {
    key: "christmas",
    labelKo: "크리스마스 · 전구와 선물",
    labelEn: "Christmas · Lights and gifts",
    items: [
      item("christmas-wallpaper", "전구 벽지", "String-light wallpaper", "wallpaper", CHRISTMAS_WALLPAPER, true),
      item("christmas-flooring", "체크 바닥", "Plaid flooring", "flooring", CHRISTMAS_FLOORING),
      item("christmas-window", "리스 창문", "Wreath window", "wall-window", CHRISTMAS_WINDOW, true),
      item("christmas-desk", "붉은 나무 책상", "Red wood desk", "furniture-desk", CHRISTMAS_DESK),
      item("christmas-monitor", "캐럴 모니터", "Carol monitor", "desk-center", CHRISTMAS_MONITOR),
      item("christmas-cup", "캔디케인 컵", "Candy-cane cup", "desk-left", CHRISTMAS_CUP),
      item("christmas-tree", "미니 트리", "Mini tree", "desk-right", CHRISTMAS_TREE),
      item("christmas-lamp", "별 전구 조명", "Star-light lamp", "desk-lamp", CHRISTMAS_LAMP),
      item("christmas-mat", "선물 포장 매트", "Gift-wrap mat", "desk-front", CHRISTMAS_MAT),
      item("christmas-bell", "종 장식", "Bell ornament", ["wall-shelf-a", "wall-shelf-b"], CHRISTMAS_BELL),
      item("christmas-frame", "벽난로 그림", "Fireplace art", "wall-frame", CHRISTMAS_FRAME),
      item("christmas-clock", "루돌프 시계", "Reindeer clock", "wall-clock", CHRISTMAS_CLOCK),
      item("christmas-cat", "빨간 모자 고양이", "Red-hat cat", "floor-left", CHRISTMAS_CAT),
      item("christmas-gifts", "선물 꾸러미", "Gift bundle", "floor-right", CHRISTMAS_GIFTS, true)
    ]
  },
  {
    key: "sky",
    labelKo: "하늘 · 구름 위",
    labelEn: "Sky · Above the clouds",
    items: [
      item("sky-wallpaper", "구름 벽지", "Cloud wallpaper", "wallpaper", SKY_WALLPAPER, true),
      item("sky-flooring", "하늘 유리 바닥", "Sky-glass flooring", "flooring", SKY_FLOORING),
      item("sky-window", "비행 창문", "Flight window", "wall-window", SKY_WINDOW, true),
      item("sky-desk", "흰 책상", "White desk", "furniture-desk", SKY_DESK),
      item("sky-monitor", "구름 모니터", "Cloud monitor", "desk-center", SKY_MONITOR),
      item("sky-cup", "무지개 컵", "Rainbow cup", "desk-left", SKY_CUP),
      item("sky-flower", "바람꽃", "Wind flower", "desk-right", SKY_FLOWER),
      item("sky-lamp", "구름 조명", "Cloud lamp", "desk-lamp", SKY_LAMP),
      item("sky-mat", "하늘길 매트", "Skyway mat", "desk-front", SKY_MAT),
      item("sky-plane", "종이비행기", "Paper plane", ["wall-shelf-a", "wall-shelf-b"], SKY_PLANE),
      item("sky-frame", "열기구 그림", "Hot-air-balloon art", "wall-frame", SKY_FRAME),
      item("sky-clock", "해와 달 시계", "Sun-and-moon clock", "wall-clock", SKY_CLOCK),
      item("sky-bird", "파랑새", "Bluebird", "floor-left", SKY_BIRD),
      item("sky-balloon", "작은 열기구", "Little hot-air balloon", "floor-right", SKY_BALLOON, true)
    ]
  }
];
