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

// ── 한옥 · 고요한 사랑방 ────────────────────────────────────

const HANJI_FLOWER = [".R...", "RGR..", ".RGR.", "..RGR", "...R."];
const HANOK_WALLPAPER = stampedCanvas(
  64,
  31,
  "Y",
  [
    { x: 3, y: 3, rows: HANJI_FLOWER },
    { x: 19, y: 11, rows: HANJI_FLOWER },
    { x: 35, y: 3, rows: HANJI_FLOWER },
    { x: 51, y: 13, rows: HANJI_FLOWER },
    { x: 9, y: 23, rows: HANJI_FLOWER },
    { x: 41, y: 23, rows: HANJI_FLOWER }
  ]
);

const HANOK_FLOORING = [
  "C".repeat(64),
  repeatRow("NNNNYYYYNNNNYYYY", 64),
  repeatRow("NNNYYYYNNNNYYYYN", 64),
  repeatRow("NNYYYYNNNNYYYYNN", 64),
  repeatRow("NYYYYNNNNYYYYNNN", 64),
  repeatRow("YYYYNNNNYYYYNNNN", 64),
  repeatRow("YYYNNNNYYYYNNNNY", 64),
  repeatRow("YYNNNNYYYYNNNNYY", 64),
  "C".repeat(64)
];

const HANOK_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CYYYYYCYYYYCYYYC",
  "CYYYYYCYYYYCYYYC",
  "CCCCCCCCCCCCCCCC",
  "CYYYYYCYYYYCYYYC",
  "CYYYYYCYYYYCYYYC",
  "CCCCCCCCCCCCCCCC",
  "CYYYYYCYYYYCYYYC",
  "CYYYYYCYYYYCYYYC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const HANOK_DESK = [
  "N".repeat(56),
  "R".repeat(56),
  "Y".repeat(56),
  centeredRow(56, "NNYYNNYY", "Y"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "N"))
];

const HANOK_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CYYYYYYYYYYYYC",
  "CYYCCCYYCCCYYC",
  "CYCYYCCYYCYYYC",
  "CYYCCCYYCCCYYC",
  "CYYYYYYYYYYYYC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const HANOK_TEA = [".Y.Y..", ".Y.YC.", "CYYYY.", "CYGYY.", "CYYYY.", ".CCCC."];
const HANOK_PLUM = [
  "R.R.R..",
  ".RRRRR.",
  "..RRR..",
  "...N...",
  "..NNN..",
  ".CYYYC.",
  ".CYYYC.",
  "..CCC.."
];
const HANOK_LAMP = [
  ".RRR.",
  "RYYYR",
  "RYGYR",
  ".RRR.",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  ".NNN.",
  "NNNNN"
];
const HANOK_MAT = ["RYGYRYGY", "YRYGYRYG", "CCCCCCCC"];
const HANOK_BRUSHES = [".C.C.", ".N.N.", ".N.N.", "NNNNN"];
const HANOK_FRAME = ["CCCCCC", "CYYYYC", "CYGGYC", "CGNNGC", "CNNNNC", "CYYYYC", "CCCCCC"];
const HANOK_CLOCK = [".YY.", "YGCC", "YNCC", ".CC."];
const HANOK_DOG = [
  "NN..NN",
  "NWWWWN",
  "WWNWNW",
  "WWWAWW",
  ".WAWW.",
  "WWWWWW",
  ".W..W.",
  "W....W"
];
const HANOK_JAR = [
  "..YY..",
  ".Y..Y.",
  "YYYYYY",
  "YWWWWY",
  "YWWWWY",
  "YWWWWY",
  ".YYYY.",
  "..YY.."
];

// ── 밤도시 · 네온 루프톱 ────────────────────────────────────

const BUILDING = ["C.C..", "CCC..", "CBC..", "CAC..", "CCC.."];
const NIGHT_WALLPAPER = stampedCanvas(
  64,
  31,
  "I",
  [
    { x: 2, y: 3, rows: BUILDING },
    { x: 10, y: 13, rows: BUILDING },
    { x: 20, y: 5, rows: BUILDING },
    { x: 31, y: 15, rows: BUILDING },
    { x: 41, y: 3, rows: BUILDING },
    { x: 51, y: 11, rows: BUILDING },
    { x: 58, y: 4, rows: BUILDING },
    { x: 5, y: 24, rows: BUILDING },
    { x: 36, y: 24, rows: BUILDING }
  ]
);

const NIGHT_FLOORING = [
  "C".repeat(64),
  repeatRow("CCCCTTTT", 64),
  repeatRow("CCCTTTTC", 64),
  repeatRow("CCTTTTCC", 64),
  repeatRow("CTTTTCCC", 64),
  repeatRow("TTTTCCCC", 64),
  repeatRow("TTTCCCCT", 64),
  repeatRow("TTCCCCTT", 64),
  "C".repeat(64)
];

const NIGHT_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIIIC",
  "CIIAIIIIQIIIAIIC",
  "CIIIIIIIIIIIIIIC",
  "CIIICCCCCCCIIIIC",
  "CIICCBCBCCCCIIIC",
  "CIIICCCCCCCCIIIC",
  "CIICACBCACBCIIIC",
  "CIICCCCCCCCCIIIC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const NIGHT_DESK = [
  "B".repeat(56),
  "T".repeat(56),
  "C".repeat(56),
  centeredRow(56, "BBQQAABB", "C"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const NIGHT_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CTTTTTTTTTTTTC",
  "CTBBTTBBTTTTTC",
  "CTTBBTTBBTTTTC",
  "CTBBTTBBTTTTTC",
  "CTTAATTQQTTTTC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const NIGHT_COFFEE = [".A.A..", ".A.AC.", "CAAAA.", "CATAA.", "CAAAA.", ".CCCC."];
const NIGHT_PLANT = [
  "..G.G..",
  ".GGGGG.",
  "..GGG..",
  "...G...",
  "..GGG..",
  ".CTTTC.",
  ".CTTTC.",
  "..CCC.."
];
const NIGHT_LAMP = [
  ".QQQ.",
  "QBBBQ",
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
const NIGHT_MAT = ["WWWWWWWW", "CWCWCWCW", "CCCCCCCC"];
const NIGHT_TAXI = ["AAAAA", "ACCCA", "AAWAA", "CCCCC"];
const NIGHT_FRAME = ["CCCCCC", "CIIIIC", "CIBQIC", "CBQAAC", "CAABQC", "CIIIIC", "CCCCCC"];
const NIGHT_CLOCK = [".BB.", "BQCC", "BACC", ".CC."];
const NIGHT_CAT = [
  "C....C",
  "CCCCCC",
  "CWCCWC",
  "CCACCC",
  ".CCCC.",
  "CCCCCC",
  ".C..C.",
  "C....C"
];
const NIGHT_BIKE = [
  "...BB.",
  "..B...",
  ".BBBB.",
  "B.B.B.",
  "BBBBB.",
  "B...B.",
  "BB.BB.",
  ".B.B.."
];

export const HANOK_NIGHT_CITY_ARTWORK: ThemeArtwork[] = [
  {
    key: "hanok",
    labelKo: "한옥 · 고요한 사랑방",
    labelEn: "Hanok · Quiet study",
    items: [
      item("hanok-wallpaper", "한지 벽지", "Hanji wallpaper", "wallpaper", HANOK_WALLPAPER, true),
      item("hanok-flooring", "우물마루", "Wood-grid flooring", "flooring", HANOK_FLOORING),
      item("hanok-window", "창호 창문", "Lattice window", "wall-window", HANOK_WINDOW, true),
      item("hanok-desk", "낮은 서안", "Low writing desk", "furniture-desk", HANOK_DESK),
      item("hanok-monitor", "먹빛 모니터", "Ink-tone monitor", "desk-center", HANOK_MONITOR),
      item("hanok-tea", "찻사발", "Tea bowl", "desk-left", HANOK_TEA),
      item("hanok-plum", "매화 분재", "Plum bonsai", "desk-right", HANOK_PLUM),
      item("hanok-lamp", "청사초롱", "Cheongsachorong lamp", "desk-lamp", HANOK_LAMP),
      item("hanok-mat", "보자기 매트", "Bojagi mat", "desk-front", HANOK_MAT),
      item("hanok-brushes", "붓걸이", "Brush rack", ["wall-shelf-a", "wall-shelf-b"], HANOK_BRUSHES),
      item("hanok-frame", "산수화", "Landscape painting", "wall-frame", HANOK_FRAME),
      item("hanok-clock", "해시계", "Sundial", "wall-clock", HANOK_CLOCK),
      item("hanok-dog", "삽살개", "Sapsal dog", "floor-left", HANOK_DOG),
      item("hanok-jar", "달항아리", "Moon jar", "floor-right", HANOK_JAR, true)
    ]
  },
  {
    key: "night-city",
    labelKo: "밤도시 · 네온 루프톱",
    labelEn: "Night city · Neon rooftop",
    items: [
      item("night-city-wallpaper", "스카이라인 벽지", "Skyline wallpaper", "wallpaper", NIGHT_WALLPAPER, true),
      item("night-city-flooring", "젖은 콘크리트 바닥", "Wet-concrete flooring", "flooring", NIGHT_FLOORING),
      item("night-city-window", "야경 창문", "Night-view window", "wall-window", NIGHT_WINDOW, true),
      item("night-city-desk", "철제 책상", "Steel desk", "furniture-desk", NIGHT_DESK),
      item("night-city-monitor", "도시 지도 모니터", "City-map monitor", "desk-center", NIGHT_MONITOR),
      item("night-city-coffee", "캔 커피", "Canned coffee", "desk-left", NIGHT_COFFEE),
      item("night-city-plant", "옥상 화분", "Rooftop plant", "desk-right", NIGHT_PLANT),
      item("night-city-lamp", "네온 조명", "Neon lamp", "desk-lamp", NIGHT_LAMP),
      item("night-city-mat", "횡단보도 매트", "Crosswalk mat", "desk-front", NIGHT_MAT),
      item("night-city-taxi", "택시 모형", "Toy taxi", ["wall-shelf-a", "wall-shelf-b"], NIGHT_TAXI),
      item("night-city-frame", "야경 사진", "Nightscape photo", "wall-frame", NIGHT_FRAME),
      item("night-city-clock", "전광 시계", "Digital clock", "wall-clock", NIGHT_CLOCK),
      item("night-city-cat", "검은 고양이", "Black cat", "floor-left", NIGHT_CAT),
      item("night-city-bike", "자전거", "Bicycle", "floor-right", NIGHT_BIKE, true)
    ]
  }
];
