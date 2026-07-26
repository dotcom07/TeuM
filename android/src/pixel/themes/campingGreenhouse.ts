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

// ── 캠핑 · 숲속 야영 ────────────────────────────────────────

const TREE = ["..G..", ".GGG.", "GGGGG", "..N.."];
const CAMPING_WALLPAPER = stampedCanvas(
  64,
  31,
  "I",
  [
    { x: 2, y: 3, rows: TREE },
    { x: 11, y: 12, rows: TREE },
    { x: 22, y: 4, rows: TREE },
    { x: 34, y: 14, rows: TREE },
    { x: 45, y: 3, rows: TREE },
    { x: 56, y: 13, rows: TREE },
    { x: 6, y: 24, rows: TREE },
    { x: 48, y: 24, rows: TREE }
  ]
);

const CAMPING_FLOORING = [
  "C".repeat(64),
  repeatRow("NNNNGGNN", 64),
  repeatRow("NNGGNNNN", 64),
  repeatRow("GGNNNNGG", 64),
  repeatRow("NNNNGGNN", 64),
  repeatRow("NGGNNNNG", 64),
  repeatRow("GNNNGGNN", 64),
  repeatRow("NNGGNNNN", 64),
  "C".repeat(64)
];

const CAMPING_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CIIIIAIIIIAIIIIC",
  "CIIIIIIIIIIIIIIC",
  "CIIIIIGGIIIIIIIC",
  "CIIIIGGGGIIIIIIC",
  "CIIIGGGGGGIIIIIC",
  "CIIGGGGGGGGIIIIC",
  "CIIINNNNNNIIIIIC",
  "CIIINYYYYNIIIIIC",
  "CNNNNNNNNNNNNNNC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const CAMPING_DESK = [
  "Y".repeat(56),
  "N".repeat(56),
  "G".repeat(56),
  centeredRow(56, "NNYYNNYY", "G"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "N"))
];

const CAMPING_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CGGGGGGGGGGGGC",
  "CGYGGYGGYYGGGC",
  "CGGGNNGGGGGGGC",
  "CGGNNNNGGGGGGC",
  "CGNNNNNNGGGGGC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const CAMPING_CUP = [".W.W..", ".W.WC.", "CWWWW.", "CWGWW.", "CWWWW.", ".CCCC."];
const CAMPING_PINE = [
  "...G...",
  "..GGG..",
  ".GGGGG.",
  "..GGG..",
  ".GGGGG.",
  "...N...",
  ".CNNNC.",
  "..CCC.."
];
const CAMPING_LAMP = [
  ".AAA.",
  "AYYYA",
  "ANANA",
  ".AAA.",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  ".NNN.",
  "NNNNN"
];
const CAMPING_MAT = ["GGYYGGYY", "YNNYYNNY", "CCCCCCCC"];
const CAMPING_COMPASS = [".AYA.", "AYCYA", "ANYYA", ".AAA."];
const CAMPING_FRAME = ["CCCCCC", "CIIIIC", "CIGGIC", "CGGGGC", "CGNNGC", "CIIIIC", "CCCCCC"];
const CAMPING_CLOCK = [".AA.", "ANCC", "AYCC", ".CC."];
const CAMPING_SQUIRREL = [
  "....NN",
  "N..NNN",
  "NNNNN.",
  "NWNNWA",
  ".NNNN.",
  "NNNNNN",
  ".N..N.",
  "N....N"
];
const CAMPING_FIRE = [
  "..A...",
  ".AYY..",
  "AAYYA.",
  ".AAAA.",
  "NNNNNN",
  ".NNNN.",
  "N....N",
  ".N..N."
];

// ── 온실 · 식물 연구실 ─────────────────────────────────────

const VINE = ["G....", "GG...", ".GG..", "..GG.", "...G."];
const GREENHOUSE_WALLPAPER = stampedCanvas(
  64,
  31,
  "K",
  [
    { x: 2, y: 2, rows: VINE },
    { x: 15, y: 10, rows: VINE },
    { x: 28, y: 3, rows: VINE },
    { x: 41, y: 12, rows: VINE },
    { x: 54, y: 3, rows: VINE },
    { x: 7, y: 23, rows: VINE },
    { x: 35, y: 23, rows: VINE },
    { x: 51, y: 24, rows: VINE }
  ]
);

const GREENHOUSE_FLOORING = [
  "C".repeat(64),
  repeatRow("NNNNGGGG", 64),
  repeatRow("NNNNGGGG", 64),
  repeatRow("GGGGNNNN", 64),
  repeatRow("GGGGNNNN", 64),
  repeatRow("NNNNGGGG", 64),
  repeatRow("NNNNGGGG", 64),
  repeatRow("GGGGNNNN", 64),
  "C".repeat(64)
];

const GREENHOUSE_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CKKKKKKCKKKKKKKC",
  "CKGGKKKCKKKGGKKC",
  "CKGGGKKCKKGGGKKC",
  "CKKGGKKCKKKGGKKC",
  "CKKKKKKCKKKKKKKC",
  "CCCCCCCCCCCCCCCC",
  "CKKKKKKCKKKKKKKC",
  "CKGGGKKCKKGGGKKC",
  "CKGGGGKCKGGGGKKC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const GREENHOUSE_DESK = [
  "W".repeat(56),
  "G".repeat(56),
  "T".repeat(56),
  centeredRow(56, "GGKKGGKK", "T"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const GREENHOUSE_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CTTTTTTTTTTTTC",
  "CTGGGTTGGGTTTC",
  "CTTGGGGGGTTTTC",
  "CTTTGGGGTTTTTC",
  "CTTGGTTGGTTTTC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const GREENHOUSE_TEA = [".G.G..", ".G.GC.", "CGGGG.", "CGYGG.", "CGGGG.", ".CCCC."];
const GREENHOUSE_MONSTERA = [
  "G.G.G..",
  ".GGGGG.",
  "GGGGGGG",
  ".GGGGG.",
  "...G...",
  ".CNNNC.",
  ".CNNNC.",
  "..CCC.."
];
const GREENHOUSE_LAMP = [
  "WWWWW",
  "WKKKW",
  ".WWW.",
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
const GREENHOUSE_MAT = ["GGKGGKGG", "KGKGKGKG", "CCCCCCCC"];
const GREENHOUSE_SEEDS = [".GGG.", "GWWWG", "GNNNG", "CCCCC"];
const GREENHOUSE_FRAME = ["CCCCCC", "CKKKKC", "CKGGKC", "CGGGGC", "CGNGGC", "CKKKKC", "CCCCCC"];
const GREENHOUSE_CLOCK = [".YY.", "YGCC", "YNCC", ".CC."];
const GREENHOUSE_SNAIL = [
  "....G.",
  ".NN.GG",
  "NGGGG.",
  "NGWGG.",
  ".NNNNG",
  "GGGGGG",
  ".GGGG.",
  "......"
];
const GREENHOUSE_CAN = [
  ".BBBB.",
  "B....B",
  "B.BBBB",
  "BKKKKB",
  "BKKKKB",
  "BBBBBB",
  "....BB",
  ".....B"
];

export const CAMPING_GREENHOUSE_ARTWORK: ThemeArtwork[] = [
  {
    key: "camping",
    labelKo: "캠핑 · 숲속 야영",
    labelEn: "Camping · Forest camp",
    items: [
      item("camping-wallpaper", "숲 벽지", "Forest wallpaper", "wallpaper", CAMPING_WALLPAPER, true),
      item("camping-flooring", "흙길 바닥", "Dirt-path flooring", "flooring", CAMPING_FLOORING),
      item("camping-window", "텐트 창문", "Tent window", "wall-window", CAMPING_WINDOW, true),
      item("camping-desk", "캠프 테이블", "Camp table", "furniture-desk", CAMPING_DESK),
      item("camping-monitor", "지도 모니터", "Map monitor", "desk-center", CAMPING_MONITOR),
      item("camping-cup", "법랑 컵", "Enamel cup", "desk-left", CAMPING_CUP),
      item("camping-pine", "작은 소나무", "Small pine", "desk-right", CAMPING_PINE),
      item("camping-lamp", "랜턴", "Lantern", "desk-lamp", CAMPING_LAMP),
      item("camping-mat", "캠핑 매트", "Camping mat", "desk-front", CAMPING_MAT),
      item("camping-compass", "나침반", "Compass", ["wall-shelf-a", "wall-shelf-b"], CAMPING_COMPASS),
      item("camping-frame", "산 그림", "Mountain art", "wall-frame", CAMPING_FRAME),
      item("camping-clock", "캠프 시계", "Camp clock", "wall-clock", CAMPING_CLOCK),
      item("camping-squirrel", "다람쥐", "Squirrel", "floor-left", CAMPING_SQUIRREL),
      item("camping-fire", "모닥불 장비", "Campfire kit", "floor-right", CAMPING_FIRE, true)
    ]
  },
  {
    key: "greenhouse",
    labelKo: "온실 · 식물 연구실",
    labelEn: "Greenhouse · Plant lab",
    items: [
      item("greenhouse-wallpaper", "덩굴 벽지", "Vine wallpaper", "wallpaper", GREENHOUSE_WALLPAPER, true),
      item("greenhouse-flooring", "흙 타일", "Soil tiles", "flooring", GREENHOUSE_FLOORING),
      item("greenhouse-window", "온실 창문", "Greenhouse window", "wall-window", GREENHOUSE_WINDOW, true),
      item("greenhouse-desk", "원예 책상", "Gardening desk", "furniture-desk", GREENHOUSE_DESK),
      item("greenhouse-monitor", "식물도감 모니터", "Botany monitor", "desk-center", GREENHOUSE_MONITOR),
      item("greenhouse-tea", "허브차", "Herbal tea", "desk-left", GREENHOUSE_TEA),
      item("greenhouse-monstera", "몬스테라", "Monstera", "desk-right", GREENHOUSE_MONSTERA),
      item("greenhouse-lamp", "생장등", "Grow light", "desk-lamp", GREENHOUSE_LAMP),
      item("greenhouse-mat", "잎맥 매트", "Leaf-vein mat", "desk-front", GREENHOUSE_MAT),
      item("greenhouse-seeds", "씨앗병", "Seed jar", ["wall-shelf-a", "wall-shelf-b"], GREENHOUSE_SEEDS),
      item("greenhouse-frame", "식물 세밀화", "Botanical art", "wall-frame", GREENHOUSE_FRAME),
      item("greenhouse-clock", "해시계", "Sundial", "wall-clock", GREENHOUSE_CLOCK),
      item("greenhouse-snail", "달팽이", "Snail", "floor-left", GREENHOUSE_SNAIL),
      item("greenhouse-can", "물뿌리개", "Watering can", "floor-right", GREENHOUSE_CAN, true)
    ]
  }
];
