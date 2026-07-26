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

// ── 아쿠아리움 · 유리 수조 ──────────────────────────────────

const BUBBLE = [".E.", "E.E", ".E."];
const LITTLE_FISH = ["..Y..", ".YYYC", "YYYYY", ".YYYC"];

const AQUARIUM_WALLPAPER = stampedCanvas(
  64,
  31,
  "K",
  [
    { x: 3, y: 2, rows: BUBBLE },
    { x: 17, y: 8, rows: BUBBLE },
    { x: 34, y: 3, rows: BUBBLE },
    { x: 51, y: 11, rows: BUBBLE },
    { x: 7, y: 22, rows: LITTLE_FISH },
    { x: 28, y: 19, rows: ["..O..", ".OOOC", "OOOOO", ".OOOC"] },
    { x: 47, y: 25, rows: LITTLE_FISH },
    { x: 59, y: 4, rows: ["E", "..W"] }
  ]
);

const AQUARIUM_FLOORING = [
  "C".repeat(64),
  repeatRow("BBBBEEEE", 64),
  repeatRow("BBBBEEEE", 64),
  repeatRow("EEEEBBBB", 64),
  repeatRow("EEEEBBBB", 64),
  repeatRow("BBBBEEEE", 64),
  repeatRow("BBBBEEEE", 64),
  repeatRow("EEEEBBBB", 64),
  "C".repeat(64)
];

const AQUARIUM_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CBBBBBBBBBBBBBBC",
  "CBEWBBBBBEWBBBBC",
  "CBBBBYBBBBBBBBBC",
  "CBBYYYYCBBOOOOBC",
  "CBBBBYBBBBBBOOBC",
  "CBBBBBBBBBBBBBBC",
  "CBGGBBBBBBBGGBBC",
  "CGGGBBBBBBGGGBBC",
  "CGGGGBBBBBGGGGBC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const AQUARIUM_DESK = [
  "E".repeat(56),
  "B".repeat(56),
  "T".repeat(56),
  centeredRow(56, "BBEWBBOO", "T"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const AQUARIUM_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CBBBBBBBBBBBBC",
  "CBBEWWEBBBBBBC",
  "CBBEBBEBBBBBBC",
  "CBBEWWEBBBBBBC",
  "CBBBBBYYBBBBBC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const AQUARIUM_CUP = [
  "..Y...",
  ".YYYC.",
  "CBBBBC",
  "CBYBBC",
  "CBBBCC",
  ".CCCC."
];

const AQUARIUM_PLANT = [
  "G..G.G.",
  "GG.GGG.",
  ".GGGG..",
  "..GGG..",
  "...G...",
  ".CBBBC.",
  ".CEBEC.",
  "..CCC.."
];

const AQUARIUM_LAMP = [
  ".EEE.",
  "EBBBE",
  "EWEWE",
  ".BBB.",
  "..B..",
  "..B..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];

const AQUARIUM_MAT = ["BEBEBEBE", "EBWEBWEB", "CCCCCCCC"];
const AQUARIUM_FISH = ["..O..", ".OOOC", "OWOWO", ".OOOC"];
const AQUARIUM_FRAME = ["CCCCCC", "CBBEBC", "CYYBYC", "CYYYYC", "CGGBGC", "CBBBBC", "CCCCCC"];
const AQUARIUM_CLOCK = [".EE.", "EBEC", "EBEC", ".CC."];

const AQUARIUM_OTTER = [
  ".NN...",
  "NNNN..",
  "NWAW..",
  "NNNN..",
  ".NNNN.",
  "NNNNNN",
  ".N..N.",
  "N....N"
];

const AQUARIUM_BOWL = [
  ".CCCC.",
  "CBBBBC",
  "CBYBBC",
  "CBBGBC",
  "CBBGBC",
  ".CCCC.",
  "..CC..",
  ".CCCC."
];

// ── 해저 · 심해 탐사 ───────────────────────────────────────

const GLOW = [".E.", "EWE", ".E."];

const UNDERSEA_WALLPAPER = stampedCanvas(
  64,
  31,
  "I",
  [
    { x: 4, y: 3, rows: GLOW },
    { x: 24, y: 8, rows: [".A.", "ATA", ".A."] },
    { x: 43, y: 2, rows: GLOW },
    { x: 55, y: 15, rows: [".T.", "TET", ".T."] },
    { x: 12, y: 21, rows: GLOW },
    { x: 34, y: 24, rows: [".A.", "ATA", ".A."] },
    { x: 48, y: 26, rows: ["E", "....T"] }
  ]
);

const UNDERSEA_FLOORING = [
  "C".repeat(64),
  "I".repeat(64),
  repeatRow("IICCIITT", 64),
  repeatRow("ICCCITTT", 64),
  repeatRow("CCCCTTTT", 64),
  repeatRow("CCNNTTCC", 64),
  repeatRow("CNNNNCCC", 64),
  "C".repeat(64),
  "C".repeat(64)
];

const UNDERSEA_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIIIC",
  "CIIEIIIIIIIIEIIC",
  "CIEWEIIIIIIEWEIC",
  "CIIEIIIIIIIIEIIC",
  "CIIIITTTIIIIIIIC",
  "CIIIITETTIIIIIIC",
  "CIIICCCTTIIIIIIC",
  "CIICCCCCIIIIIIIC",
  "CICCCCCCCIIIIIIC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const UNDERSEA_DESK = [
  "T".repeat(56),
  "C".repeat(56),
  "I".repeat(56),
  centeredRow(56, "TTEETTCC", "I"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const UNDERSEA_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIIITTTIIIIIIC",
  "CIITEEETIIIIIC",
  "CIIITTTIIIIIIC",
  "CIIIIAITIIIIIC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const UNDERSEA_CAN = [
  ".E.E..",
  "CCCC..",
  "CTTTC.",
  "CTATCC",
  "CTTTC.",
  ".CCCC."
];

const UNDERSEA_CORAL = [
  "A..A.A.",
  "AA.AAA.",
  ".AAAA..",
  "..AAA..",
  "...A...",
  ".CTTTC.",
  ".CIIIC.",
  "..CCC.."
];

const UNDERSEA_LAMP = [
  "....E",
  "...C.",
  ".CCCC",
  "CAWAC",
  ".CCC.",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];

const UNDERSEA_MAT = ["ITTITTTI", "TTIITTII", "CCCCCCCC"];
const UNDERSEA_SUB = ["..C..", ".CCC.", "CTATC", "CCCCC"];
const UNDERSEA_FRAME = ["CCCCCC", "CIIIIC", "CIIITC", "CTTTTC", "CITITC", "CIIIIC", "CCCCCC"];
const UNDERSEA_CLOCK = [".TT.", "TECC", "TACC", ".CC."];

const UNDERSEA_OCTOPUS = [
  "..AA..",
  ".AAAA.",
  "AAWWAA",
  "AAAAAA",
  ".AAAA.",
  "A.A.A.",
  ".A.A..",
  "A...A."
];

const UNDERSEA_CORE = [
  "..E...",
  ".EWE..",
  "EWTWE.",
  ".EWE..",
  "CITCIC",
  "CIIITC",
  "CCCCCC",
  ".CCCC."
];

export const AQUARIUM_UNDERSEA_ARTWORK: ThemeArtwork[] = [
  {
    key: "aquarium",
    labelKo: "아쿠아리움 · 유리 수조",
    labelEn: "Aquarium · Glass tank",
    items: [
      item("aquarium-wallpaper", "기포 벽지", "Bubble wallpaper", "wallpaper", AQUARIUM_WALLPAPER, true),
      item("aquarium-flooring", "푸른 타일", "Blue tile flooring", "flooring", AQUARIUM_FLOORING),
      item("aquarium-window", "대형 수조 창문", "Tank window", "wall-window", AQUARIUM_WINDOW, true),
      item("aquarium-desk", "아쿠아 바 책상", "Aqua bar desk", "furniture-desk", AQUARIUM_DESK),
      item("aquarium-monitor", "수온 모니터", "Water-temperature monitor", "desk-center", AQUARIUM_MONITOR),
      item("aquarium-cup", "물고기 컵", "Fish cup", "desk-left", AQUARIUM_CUP),
      item("aquarium-plant", "수초 화분", "Aquatic plant", "desk-right", AQUARIUM_PLANT),
      item("aquarium-lamp", "해파리 조명", "Jellyfish lamp", "desk-lamp", AQUARIUM_LAMP),
      item("aquarium-mat", "기포 매트", "Bubble mat", "desk-front", AQUARIUM_MAT),
      item("aquarium-clownfish", "흰동가리 피규어", "Clownfish figure", ["wall-shelf-a", "wall-shelf-b"], AQUARIUM_FISH),
      item("aquarium-frame", "열대어 액자", "Tropical fish art", "wall-frame", AQUARIUM_FRAME),
      item("aquarium-clock", "기포 시계", "Bubble clock", "wall-clock", AQUARIUM_CLOCK),
      item("aquarium-otter", "수달", "Otter", "floor-left", AQUARIUM_OTTER),
      item("aquarium-bowl", "작은 어항", "Little fish bowl", "floor-right", AQUARIUM_BOWL, true)
    ]
  },
  {
    key: "undersea",
    labelKo: "해저 · 심해 탐사",
    labelEn: "Undersea · Deep-sea expedition",
    items: [
      item("undersea-wallpaper", "해구 벽지", "Ocean-trench wallpaper", "wallpaper", UNDERSEA_WALLPAPER, true),
      item("undersea-flooring", "암반 바닥", "Rocky seabed", "flooring", UNDERSEA_FLOORING),
      item("undersea-window", "심해 창문", "Deep-sea window", "wall-window", UNDERSEA_WINDOW, true),
      item("undersea-desk", "잠수정 책상", "Submersible desk", "furniture-desk", UNDERSEA_DESK),
      item("undersea-monitor", "소나 모니터", "Sonar monitor", "desk-center", UNDERSEA_MONITOR),
      item("undersea-can", "탐사 캔", "Expedition can", "desk-left", UNDERSEA_CAN),
      item("undersea-coral", "발광 산호", "Glowing coral", "desk-right", UNDERSEA_CORAL),
      item("undersea-lamp", "아귀 조명", "Anglerfish lamp", "desk-lamp", UNDERSEA_LAMP),
      item("undersea-mat", "해류 매트", "Current mat", "desk-front", UNDERSEA_MAT),
      item("undersea-sub", "작은 잠수함", "Little submarine", ["wall-shelf-a", "wall-shelf-b"], UNDERSEA_SUB),
      item("undersea-frame", "대왕고래 그림", "Blue whale art", "wall-frame", UNDERSEA_FRAME),
      item("undersea-clock", "수압 시계", "Pressure clock", "wall-clock", UNDERSEA_CLOCK),
      item("undersea-octopus", "아기 문어", "Baby octopus", "floor-left", UNDERSEA_OCTOPUS),
      item("undersea-core", "심해 코어", "Abyssal core", "floor-right", UNDERSEA_CORE, true)
    ]
  }
];
