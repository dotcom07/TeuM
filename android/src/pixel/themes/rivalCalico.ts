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

const CALICO_PAW = [".O.C.", "OWWCC", ".WWW."];

const CALICO_WALLPAPER = stampedCanvas(
  64,
  31,
  "W",
  [
    { x: 3, y: 3, rows: CALICO_PAW },
    { x: 22, y: 7, rows: CALICO_PAW },
    { x: 44, y: 2, rows: CALICO_PAW },
    { x: 53, y: 16, rows: CALICO_PAW },
    { x: 12, y: 21, rows: CALICO_PAW },
    { x: 35, y: 24, rows: CALICO_PAW },
    { x: 29, y: 16, rows: ["Q", "....O"] }
  ]
);

const CALICO_FLOORING = [
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

const CALICO_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CYYYYYYYYYYYYYYC",
  "CYYYWYYYYWYYYYYC",
  "CYYWWWWWWWWYYYYC",
  "CYYYYYYYYYYYYYYC",
  "CYYYYYYYYYYYYYYC",
  "CWWWWWWWWWWWWWWC",
  "CWOCWWWWCOWWWWWC",
  "CWWWWOCCWWWWWWWC",
  "CWWWWCCCCWWWWWWC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const CALICO_DESK = [
  "W".repeat(56),
  "O".repeat(56),
  "N".repeat(56),
  centeredRow(56, "COWWOC", "N"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "N"))
];

const CALICO_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CWWWWWWWWWWWWC",
  "CWOCCWWWWWWWWC",
  "CWWOCCWWWWWWWC",
  "CWWWWCCOWWWWWC",
  "CWWWWWWOCWWWWC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const CALICO_MUG = [
  "C.C...",
  "COC...",
  "CWWCCC",
  "CWCWOC",
  "COWWCC",
  ".CCCC."
];

const CALICO_GRASS = [
  "..G.G..",
  ".GGGGG.",
  "..GGG..",
  "...G...",
  "..GGG..",
  ".COOWC.",
  ".CWWCC.",
  "..CCC.."
];

const CALICO_LAMP = [
  ".OCO.",
  "OQQQO",
  ".OCO.",
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

const CALICO_MAT = ["OWWCCOWW", "WOCWWOCW", "CCCCCCCC"];
const CALICO_FISH = [".C.C.", "CCOCC", ".CWC.", "CCCCC"];
const CALICO_FRAME = ["CCCCCC", "CWWWWC", "CWOCWC", "COCWOC", "CWWOWC", "CWWWWC", "CCCCCC"];
const CALICO_CLOCK = [".OC.", "OWCC", "CWOC", ".CC."];

const CALICO_CAT = [
  "C.C...",
  "COCC..",
  "CWAW..",
  "COWC..",
  "CWWC.C",
  "CCCCCC",
  ".C..C.",
  "C....C"
];

const CALICO_TOWER = [
  "..CC..",
  ".COOC.",
  ".CCCC.",
  "...C..",
  "CCCCCC",
  "C....C",
  "C.CCCC",
  "C.CCCC"
];

export const CALICO_ARTWORK: ThemeArtwork[] = [
  {
    key: "calico",
    labelKo: "삼색고양이 · 햇볕 드는 방",
    labelEn: "Calico cat · Sunny room",
    items: [
      item("calico-wallpaper", "삼색 발바닥 벽지", "Calico paw wallpaper", "wallpaper", CALICO_WALLPAPER, true),
      item("calico-flooring", "따뜻한 마루", "Warm wood flooring", "flooring", CALICO_FLOORING),
      item("calico-window", "햇볕 창문", "Sunny cat window", "wall-window", CALICO_WINDOW, true),
      item("calico-desk", "캣워크 책상", "Catwalk desk", "furniture-desk", CALICO_DESK),
      item("calico-monitor", "꼬리 모니터", "Tail monitor", "desk-center", CALICO_MONITOR),
      item("calico-mug", "고양이 얼굴 머그", "Cat-face mug", "desk-left", CALICO_MUG),
      item("calico-grass", "캣그라스", "Cat grass", "desk-right", CALICO_GRASS),
      item("calico-lamp", "털실 조명", "Yarn lamp", "desk-lamp", CALICO_LAMP),
      item("calico-mat", "발바닥 매트", "Paw mat", "desk-front", CALICO_MAT),
      item("calico-fish", "생선 피규어", "Fish figure", ["wall-shelf-a", "wall-shelf-b"], CALICO_FISH),
      item("calico-frame", "삼색고양이 초상화", "Calico portrait", "wall-frame", CALICO_FRAME),
      item("calico-clock", "꼬리 시계", "Tail clock", "wall-clock", CALICO_CLOCK),
      item("calico-cat", "삼색고양이", "Calico cat", "floor-left", CALICO_CAT),
      item("calico-tower", "캣타워", "Cat tower", "floor-right", CALICO_TOWER, true)
    ]
  }
];

export const EXTRA_CAT_ARTWORK: ThemeArtItem[] = [
  item(
    "cat-chubby",
    "뚱냥이",
    "Chubby cat",
    "floor-left",
    ["C.C...", "CCCC..", "CWAW..", "CCCCCC", "CCCCCC", "CCCCCC", ".C..C.", ".C..C."]
  ),
  item(
    "cat-cheese",
    "치즈냥이",
    "Ginger cat",
    "floor-left",
    ["O.O...", "OOOO..", "OWAW..", "OCOO..", "OOOO.O", "OOOOOO", ".O..O.", "O....O"]
  ),
  item(
    "cat-tabby",
    "고등어냥이",
    "Tabby cat",
    "floor-left",
    ["I.I...", "IIII..", "IWAW..", "ICIC..", "IIIICC", "IIIIII", ".I..I.", "I....I"]
  ),
  item(
    "cat-black",
    "까만냥이",
    "Black cat",
    "floor-left",
    ["C.C...", "CCCC..", "CWCW..", "CCCC..", "CCCC.C", "CCCCCC", ".C..C."]
  ),
  item(
    "cat-white",
    "하얀냥이",
    "White cat",
    "floor-left",
    ["Q.Q...", "CWC...", "WAWC..", "WWWC..", "WWWW.C", "CWWCCC", ".C..C.", "C....C"]
  ),
  item(
    "cat-calico-loaf",
    "식빵 삼색냥이",
    "Calico loaf",
    "floor-left",
    ["......", ".O.C..", "COWCC.", "CWWWC.", "COWWWC", ".CCCC.", ".C..C.", "......"]
  ),
  item(
    "cat-siamese",
    "샴냥이",
    "Siamese cat",
    "floor-left",
    ["C.C...", "CNNC..", "CAAC..", "CNNC..", "CYYYYC", "CYYYYC", ".C..C.", "C....C"]
  ),
  item(
    "cat-sleepy",
    "졸린냥이",
    "Sleepy cat",
    "floor-left",
    ["......", "......", ".CC...", "CWWC..", "CWACC.", "CWWWWC", ".CCCC.", "......"]
  ),
  item(
    "cat-maine-coon",
    "메인쿤",
    "Maine Coon",
    "floor-left",
    ["C.C..C", "CCCCCC", "CWACCC", "CNCNCC", "CCCCCC", "CCCCCC", ".C.CCC", "C...CC"]
  ),
  item(
    "cat-scottish-fold",
    "스코티시 폴드",
    "Scottish Fold",
    "floor-left",
    [".C.C..", "CCCCC.", "CWAWC.", "C...C.", "CCCCC.", "CCCCCC", ".C..C.", "C....C"]
  ),
  item(
    "cat-russian-blue",
    "러시안 블루",
    "Russian Blue",
    "floor-left",
    ["G.G...", "GGGG..", "GWAW..", ".GGG..", ".GGG.G", ".GGGG.", ".G..G.", "G....G"]
  ),
  item(
    "cat-bengal",
    "벵갈",
    "Bengal",
    "floor-left",
    ["O.O...", "OOOO..", "OWAW..", "OC.CO.", "OOCO.O", "OCOCOO", ".O..O.", "O....O"]
  ),
  item(
    "cat-persian",
    "페르시안",
    "Persian",
    "floor-left",
    [".C.C..", "CCCCCC", "CWAWCC", "CCNCCC", "CCCCCC", "CCCCCC", ".CCCC.", ".C.C.C"]
  ),
  item(
    "cat-munchkin",
    "먼치킨",
    "Munchkin",
    "floor-left",
    ["C.C...", "CCCC..", "CWAW..", "C..C..", "CCCCCC", "CCCCCC", ".C..C.", "......"]
  ),
  item(
    "cat-ragdoll",
    "랙돌",
    "Ragdoll",
    "floor-left",
    ["C.C...", "CWWC..", "CNANC.", "CWWC..", "CWWWWC", "CWWWCC", ".C..C.", "C....C"]
  ),
  item(
    "cat-sphynx",
    "스핑크스",
    "Sphynx",
    "floor-left",
    ["C....C", "CC..CC", "CWAAWC", ".CNNNC", ".CNNNC", "CNNNNC", ".C..C.", "C....C"]
  )
];
