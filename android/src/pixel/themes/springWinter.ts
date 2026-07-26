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

// ── 봄 · 벚꽃 ──────────────────────────────────────────────

const SPRING_BLOSSOM_STAMP = [".QWQ.", "QQQQQ", ".QQQ.", "..N.."];

const SPRING_WALLPAPER = stampedCanvas(
  64,
  31,
  "K",
  [
    { x: 2, y: 2, rows: SPRING_BLOSSOM_STAMP },
    { x: 31, y: 5, rows: SPRING_BLOSSOM_STAMP },
    { x: 52, y: 1, rows: SPRING_BLOSSOM_STAMP },
    { x: 22, y: 18, rows: SPRING_BLOSSOM_STAMP },
    { x: 46, y: 22, rows: SPRING_BLOSSOM_STAMP },
    { x: 11, y: 25, rows: ["Q", "...W", "......Q"] },
    { x: 40, y: 13, rows: ["W", "....Q"] },
    { x: 59, y: 17, rows: ["Q", "..W"] }
  ]
);

const SPRING_FLOORING = [
  "C".repeat(64),
  repeatRow("NNNNWWNN", 64),
  repeatRow("NNNNWWNN", 64),
  repeatRow("WWNNNNNN", 64),
  repeatRow("NNNNNNWW", 64),
  repeatRow("NNWWNNNN", 64),
  repeatRow("NNWWNNNN", 64),
  repeatRow("WWNNNNNN", 64),
  "C".repeat(64)
];

const SPRING_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CKKKKKKKKKKKKKKC",
  "CKKQWQKKKKKQWQKC",
  "CKQQQQQKKKQQQQQC",
  "CKKQQQKKKKKQQQKC",
  "CKKNKKKKKKKKNKKC",
  "CKNNNKKKKKKNNNKC",
  "CKKKQWQKKKKKKKKC",
  "CKKQQQQKKKQWQKKC",
  "CKKKQQKKKQQQQQKC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const SPRING_DESK = [
  "W".repeat(56),
  "Q".repeat(56),
  "N".repeat(56),
  centeredRow(56, "QQWQQWQQ", "N"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "N"))
];

const SPRING_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CKKKKKKKKKKKKC",
  "CKKKQWQKKKKKKC",
  "CKKQQQQQKKKKKC",
  "CKKKQQQKKKKKKC",
  "CKKKKGKKKKKKKC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const SPRING_TEA = [
  ".Q.Q..",
  ".QGQ..",
  "CWWWWC",
  "CWQQWC",
  "CQQQCC",
  ".CCCC."
];

const SPRING_SPROUT = [
  "..G.G..",
  ".GGGGG.",
  "..GGG..",
  "...G...",
  "..GGG..",
  ".CQQQC.",
  ".CWWWC.",
  "..CCC.."
];

const SPRING_LAMP = [
  ".QWQ.",
  "QQWQQ",
  ".QQQ.",
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

const SPRING_MAT = ["QQQQQQQQ", "QWQWQWQQ", "CCCCCCCC"];
const SPRING_VASE = [".QWQ.", "QQQQQ", ".CWC.", "CCCCC"];
const SPRING_FRAME = ["CCCCCC", "CKKKKC", "CKQWQC", "CQQQQC", "CKGGKC", "CKKKKC", "CCCCCC"];
const SPRING_CLOCK = [".QQ.", "QWCQ", "QGCQ", ".QQ."];

const SPRING_RABBIT = [
  "C.C...",
  "C.C...",
  "CCC...",
  "CWC...",
  "CCC..C",
  "CCCCCC",
  ".C..C.",
  "C....C"
];

const SPRING_BASKET = [
  "..NN..",
  ".N..N.",
  "NQWQWN",
  "NQQQQN",
  ".NNNN.",
  ".NWNW.",
  ".NNNN.",
  "..NN.."
];

// ── 겨울 · 눈 오는 방 ──────────────────────────────────────

const WINTER_SNOW_STAMP = [".E.", "EWE", ".E."];

const WINTER_WALLPAPER = stampedCanvas(
  64,
  31,
  "I",
  [
    { x: 3, y: 2, rows: WINTER_SNOW_STAMP },
    { x: 18, y: 6, rows: WINTER_SNOW_STAMP },
    { x: 34, y: 2, rows: WINTER_SNOW_STAMP },
    { x: 51, y: 8, rows: WINTER_SNOW_STAMP },
    { x: 8, y: 19, rows: WINTER_SNOW_STAMP },
    { x: 28, y: 22, rows: WINTER_SNOW_STAMP },
    { x: 45, y: 18, rows: WINTER_SNOW_STAMP },
    { x: 59, y: 25, rows: ["E", "..W"] }
  ]
);

const WINTER_FLOORING = [
  "C".repeat(64),
  "E".repeat(64),
  repeatRow("EEEPEEEE", 64),
  "E".repeat(64),
  repeatRow("PEEEEEEP", 64),
  "E".repeat(64),
  repeatRow("EEEEPEEE", 64),
  "P".repeat(64),
  "C".repeat(64)
];

const WINTER_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIIIC",
  "CIEIIIIEIIIIEIIC",
  "CEWEIIEWEIIEWEIC",
  "CIEIIIIEIIIIEIIC",
  "CIIIIIIIIIIIIIIC",
  "CIIEIIIIIIEIIIIC",
  "CIEWEIIIIEWEIIIC",
  "CIIEIIIIIIEIIIIC",
  "CEEEEEEEEEEEEEEC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const WINTER_DESK = [
  "E".repeat(56),
  "C".repeat(56),
  "N".repeat(56),
  centeredRow(56, "PPEEPP", "N"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const WINTER_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIIEIIIIEIIIIC",
  "CIEWEIIEWEIIIC",
  "CIIEIIIIEIIIIC",
  "CIIIIIIIIIIIIC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const WINTER_COCOA = [
  ".E.E..",
  ".EEE..",
  "CWWWWC",
  "CWANWC",
  "CNNNCC",
  ".CCCC."
];

const WINTER_FIR = [
  "...G...",
  "..GGG..",
  ".GGGGG.",
  "..GGG..",
  ".GGGGG.",
  "GGGGGGG",
  "...N...",
  "..NNN.."
];

const WINTER_LAMP = [
  ".EWE.",
  "EWWWE",
  ".EAE.",
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

const WINTER_MAT = ["PPEEPPEE", "EPEPEPEP", "CCCCCCCC"];
const WINTER_SNOWMAN = [".E.E.", "EEWEE", ".CCC.", "CEAEC"];
const WINTER_FRAME = ["CCCCCC", "CIIIIC", "CIEEIC", "CEWWEC", "CINNIC", "CNNNNC", "CCCCCC"];
const WINTER_CLOCK = [".EE.", "EWCE", "ECAE", ".EE."];

const WINTER_FOX = [
  "C.C...",
  "CEEC..",
  "CWAW..",
  "CEEC..",
  "CEEC.C",
  "CCCCCC",
  ".C..C.",
  "C....C"
];

const WINTER_YARN = [
  ".PE.P.",
  "PEEPEP",
  ".PE.P.",
  "NNNNNN",
  "NPEEPN",
  "NEPPEN",
  "NNNNNN",
  ".NNNN."
];

export const SPRING_WINTER_ARTWORK: ThemeArtwork[] = [
  {
    key: "spring",
    labelKo: "봄 · 벚꽃",
    labelEn: "Spring · Cherry blossom",
    items: [
      item("spring-wallpaper", "벚꽃 벽지", "Cherry blossom wallpaper", "wallpaper", SPRING_WALLPAPER, true),
      item("spring-flooring", "연분홍 마루", "Blush wood flooring", "flooring", SPRING_FLOORING),
      item("spring-window", "꽃비 창문", "Petal-rain window", "wall-window", SPRING_WINDOW, true),
      item("spring-desk", "밝은 자작 책상", "Light birch desk", "furniture-desk", SPRING_DESK),
      item("spring-monitor", "꽃잎 모니터", "Petal monitor", "desk-center", SPRING_MONITOR),
      item("spring-tea", "벚꽃차", "Cherry blossom tea", "desk-left", SPRING_TEA),
      item("spring-sprout", "새싹 화분", "Sprout pot", "desk-right", SPRING_SPROUT),
      item("spring-lamp", "꽃봉오리 조명", "Flower-bud lamp", "desk-lamp", SPRING_LAMP),
      item("spring-mat", "꽃길 매트", "Petal path mat", "desk-front", SPRING_MAT),
      item("spring-vase", "작은 화병", "Little vase", ["wall-shelf-a", "wall-shelf-b"], SPRING_VASE),
      item("spring-frame", "봄 소풍 그림", "Spring picnic art", "wall-frame", SPRING_FRAME),
      item("spring-clock", "꽃잎 시계", "Petal clock", "wall-clock", SPRING_CLOCK),
      item("spring-rabbit", "흰 토끼", "White rabbit", "floor-left", SPRING_RABBIT),
      item("spring-basket", "벚꽃 바구니", "Blossom basket", "floor-right", SPRING_BASKET, true)
    ]
  },
  {
    key: "winter",
    labelKo: "겨울 · 눈 오는 방",
    labelEn: "Winter · Snowy room",
    items: [
      item("winter-wallpaper", "눈송이 벽지", "Snowflake wallpaper", "wallpaper", WINTER_WALLPAPER, true),
      item("winter-flooring", "서리빛 바닥", "Frost flooring", "flooring", WINTER_FLOORING),
      item("winter-window", "눈 내리는 창문", "Snowy window", "wall-window", WINTER_WINDOW, true),
      item("winter-desk", "짙은 소나무 책상", "Dark pine desk", "furniture-desk", WINTER_DESK),
      item("winter-monitor", "설원 모니터", "Snowfield monitor", "desk-center", WINTER_MONITOR),
      item("winter-cocoa", "핫초코", "Hot chocolate", "desk-left", WINTER_COCOA),
      item("winter-fir", "작은 전나무", "Little fir tree", "desk-right", WINTER_FIR),
      item("winter-lamp", "눈등 조명", "Snow lantern", "desk-lamp", WINTER_LAMP),
      item("winter-mat", "니트 매트", "Knitted mat", "desk-front", WINTER_MAT),
      item("winter-snowman", "눈사람 피규어", "Snowman figure", ["wall-shelf-a", "wall-shelf-b"], WINTER_SNOWMAN),
      item("winter-frame", "겨울 산 그림", "Winter mountain art", "wall-frame", WINTER_FRAME),
      item("winter-clock", "눈꽃 시계", "Snowflake clock", "wall-clock", WINTER_CLOCK),
      item("winter-fox", "북극여우", "Arctic fox", "floor-left", WINTER_FOX),
      item("winter-yarn", "털실 바구니", "Yarn basket", "floor-right", WINTER_YARN, true)
    ]
  }
];
