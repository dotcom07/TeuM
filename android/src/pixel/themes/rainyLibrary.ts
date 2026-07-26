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

// ── 장마 · 빗소리 ───────────────────────────────────────────

const DROP = [".K.", "KBK", ".B."];
const RAINY_WALLPAPER = stampedCanvas(
  64,
  31,
  "T",
  [
    { x: 3, y: 3, rows: DROP },
    { x: 14, y: 10, rows: DROP },
    { x: 28, y: 4, rows: DROP },
    { x: 43, y: 13, rows: DROP },
    { x: 55, y: 5, rows: DROP },
    { x: 8, y: 23, rows: DROP },
    { x: 34, y: 24, rows: DROP },
    { x: 52, y: 25, rows: DROP }
  ]
);

const RAINY_FLOORING = [
  "C".repeat(64),
  repeatRow("BBBBTTTT", 64),
  repeatRow("BBBBTTTT", 64),
  repeatRow("TTTTBBBB", 64),
  repeatRow("TTTTBBBB", 64),
  repeatRow("BBBBTTTT", 64),
  repeatRow("BBBBTTTT", 64),
  repeatRow("TTTTBBBB", 64),
  "C".repeat(64)
];

const RAINY_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIIIC",
  "CIIKIIIIKIIKIIIC",
  "CIIIIKIIIIIIKIIC",
  "CIBIIIIIBIIIIIBC",
  "CIIIBIIIIIBIIIIC",
  "CIIIIIBIIIIIBIIC",
  "CIBIIIIIBIIIIIBC",
  "CIIIBIIIIIBIIIIC",
  "CBBBBBBBBBBBBBBC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const RAINY_DESK = [
  "N".repeat(56),
  "C".repeat(56),
  "T".repeat(56),
  centeredRow(56, "BBKKBBKK", "T"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const RAINY_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIIIKKKIIIIIIC",
  "CIIKBBBKIIIIIC",
  "CIKBBBBBKIIIIC",
  "CBBBBBBBBBBBBC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const RAINY_MUG = [".B.B..", ".B.BC.", "CBBBB.", "CBKBB.", "CBBBB.", ".CCCC."];
const RAINY_HYDRANGEA = [
  ".V.V.V.",
  "VVVVVVV",
  ".VVVVV.",
  "..GGG..",
  "...G...",
  ".CBBBC.",
  ".CBBBC.",
  "..CCC.."
];
const RAINY_LAMP = [
  ".BBB.",
  "BKKKB",
  "BBTBB",
  ".BBB.",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];
const RAINY_MAT = ["BKBKBKBK", "TBTBTBTB", "CCCCCCCC"];
const RAINY_BOOTS = [".B.B.", ".B.B.", "CB.BC", "CC.CC"];
const RAINY_FRAME = ["CCCCCC", "CIIIIC", "CIBBIC", "CBBTBC", "CBTTBC", "CIIIIC", "CCCCCC"];
const RAINY_CLOCK = [".BB.", "BKKC", "BCKC", ".CC."];
const RAINY_FROG = [
  "G....G",
  "GGGGGG",
  "GWGGWG",
  "GGAGGG",
  ".GGGG.",
  "GGGGGG",
  ".G..G.",
  "G....G"
];
const RAINY_UMBRELLA = [
  "..B...",
  ".BB...",
  "BBBBB.",
  "BBBBBB",
  "..C...",
  "..C...",
  "..CC..",
  "...CC."
];

// ── 도서관 · 조용한 오후 ────────────────────────────────────

const LIBRARY_WALLPAPER = Array.from({ length: 31 }, (_, y) => {
  if ([3, 11, 19, 27].includes(y)) return "R".repeat(64);
  if ([1, 9, 17, 25].includes(y)) return repeatRow("RRYYGGNN", 64);
  if ([2, 10, 18, 26].includes(y)) return repeatRow("NNGGRRYY", 64);
  return "N".repeat(64);
});

const LIBRARY_FLOORING = [
  "C".repeat(64),
  repeatRow("NNRRNNYY", 64),
  repeatRow("NRRNNYYN", 64),
  repeatRow("RRNNYYNN", 64),
  repeatRow("RNNYYNNR", 64),
  repeatRow("NNYYNNRR", 64),
  repeatRow("NYYNNRRN", 64),
  repeatRow("YYNNRRNN", 64),
  "C".repeat(64)
];

const LIBRARY_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CRRRRRGGGGGYYYYC",
  "CRRWRRGGWGGYYYYC",
  "CRRRRRGGGGGYYYYC",
  "CGGGGGYYYYYRRRRC",
  "CGGWGGYYWYYRRRRC",
  "CGGGGGYYYYYRRRRC",
  "CYYYYYRRRRRGGGGC",
  "CYYWYYRRWRRGGWGC",
  "CYYYYYRRRRRGGGGC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const LIBRARY_DESK = [
  "Y".repeat(56),
  "R".repeat(56),
  "N".repeat(56),
  centeredRow(56, "RRYYGGRR", "N"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const LIBRARY_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CGGGGGGGGGGGGC",
  "CGYYYYYYYYYYGC",
  "CGYRYRYRYRYRGC",
  "CGYYYYYYYYYYGC",
  "CGYGGGYYYYYYGC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const LIBRARY_TEA = [".Y.Y..", ".Y.YC.", "CYYYY.", "CYRYY.", "CYYYY.", ".CCCC."];
const LIBRARY_IVY = [
  "G.G.G..",
  ".GGGGG.",
  "GGGGG..",
  "...G...",
  "..GG...",
  ".CYYYC.",
  ".CYYYC.",
  "..CCC.."
];
const LIBRARY_LAMP = [
  ".GGG.",
  "GYYY.",
  "GGGG.",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  "..N..",
  ".NNN.",
  "NNNNN"
];
const LIBRARY_MAT = ["RYYYYYYR", "YRYRYRYR", "CCCCCCCC"];
const LIBRARY_BOOKS = ["RRYYG", "NNGGR", "YYYYY", "CCCCC"];
const LIBRARY_FRAME = ["CCCCCC", "CYYYYC", "CYGNYC", "CGNNGC", "CNNNNC", "CYYYYC", "CCCCCC"];
const LIBRARY_CLOCK = [".YY.", "YCRC", "YRRC", ".CC."];
const LIBRARY_OWL = [
  "N....N",
  "NNNNNN",
  "NWNNWN",
  "NNANNN",
  ".NNNN.",
  ".NYYN.",
  ".N..N.",
  "N....N"
];
const LIBRARY_CART = [
  "RRRRRR",
  "RYYGGR",
  "RGGRRR",
  "RRYYRR",
  "RRRRRR",
  "R....R",
  ".C..C.",
  "C....C"
];

export const RAINY_LIBRARY_ARTWORK: ThemeArtwork[] = [
  {
    key: "rainy",
    labelKo: "장마 · 빗소리",
    labelEn: "Rainy season · Rain sounds",
    items: [
      item("rainy-wallpaper", "빗방울 벽지", "Raindrop wallpaper", "wallpaper", RAINY_WALLPAPER, true),
      item("rainy-flooring", "젖은 타일", "Wet tiles", "flooring", RAINY_FLOORING),
      item("rainy-window", "빗물 창문", "Rainy window", "wall-window", RAINY_WINDOW, true),
      item("rainy-desk", "짙은 월넛 책상", "Dark-walnut desk", "furniture-desk", RAINY_DESK),
      item("rainy-monitor", "일기예보 모니터", "Weather monitor", "desk-center", RAINY_MONITOR),
      item("rainy-mug", "빗방울 머그", "Raindrop mug", "desk-left", RAINY_MUG),
      item("rainy-hydrangea", "수국 화분", "Hydrangea pot", "desk-right", RAINY_HYDRANGEA),
      item("rainy-lamp", "우산 조명", "Umbrella lamp", "desk-lamp", RAINY_LAMP),
      item("rainy-mat", "물결 매트", "Ripple mat", "desk-front", RAINY_MAT),
      item("rainy-boots", "장화 미니어처", "Mini rain boots", ["wall-shelf-a", "wall-shelf-b"], RAINY_BOOTS),
      item("rainy-frame", "비 오는 골목 그림", "Rainy alley art", "wall-frame", RAINY_FRAME),
      item("rainy-clock", "구름 시계", "Cloud clock", "wall-clock", RAINY_CLOCK),
      item("rainy-frog", "개구리", "Frog", "floor-left", RAINY_FROG),
      item("rainy-umbrella", "접힌 우산", "Folded umbrella", "floor-right", RAINY_UMBRELLA, true)
    ]
  },
  {
    key: "library",
    labelKo: "도서관 · 조용한 오후",
    labelEn: "Library · Quiet afternoon",
    items: [
      item("library-wallpaper", "책장 벽지", "Bookshelf wallpaper", "wallpaper", LIBRARY_WALLPAPER, true),
      item("library-flooring", "헤링본 바닥", "Herringbone flooring", "flooring", LIBRARY_FLOORING),
      item("library-window", "스테인드 창문", "Stained-glass window", "wall-window", LIBRARY_WINDOW, true),
      item("library-desk", "독서 책상", "Reading desk", "furniture-desk", LIBRARY_DESK),
      item("library-monitor", "목록 검색 모니터", "Catalog monitor", "desk-center", LIBRARY_MONITOR),
      item("library-tea", "홍차", "Black tea", "desk-left", LIBRARY_TEA),
      item("library-ivy", "아이비 화분", "Ivy pot", "desk-right", LIBRARY_IVY),
      item("library-lamp", "초록 독서등", "Green reading lamp", "desk-lamp", LIBRARY_LAMP),
      item("library-mat", "책갈피 매트", "Bookmark mat", "desk-front", LIBRARY_MAT),
      item("library-books", "쌓인 책", "Stacked books", ["wall-shelf-a", "wall-shelf-b"], LIBRARY_BOOKS),
      item("library-frame", "고서 지도", "Antique map", "wall-frame", LIBRARY_FRAME),
      item("library-clock", "회중시계", "Pocket watch", "wall-clock", LIBRARY_CLOCK),
      item("library-owl", "부엉이", "Owl", "floor-left", LIBRARY_OWL),
      item("library-cart", "이동식 북카트", "Book cart", "floor-right", LIBRARY_CART, true)
    ]
  }
];
