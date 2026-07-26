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

// ── 카페 · 벽돌 로스터리 ────────────────────────────────────

const CAFE_TILE = ["WWWWWWW", "WGGGGGW", "WGIGIGW", "WGGGGGW", "WWWWWWW"];
const CAFE_WALLPAPER = stampedCanvas(
  64,
  31,
  "G",
  [
    { x: 3, y: 2, rows: CAFE_TILE },
    { x: 24, y: 8, rows: CAFE_TILE },
    { x: 46, y: 2, rows: CAFE_TILE },
    { x: 9, y: 20, rows: CAFE_TILE },
    { x: 40, y: 22, rows: CAFE_TILE },
    { x: 0, y: 14, rows: [repeatRow("IINNNNII", 64)] },
    { x: 0, y: 15, rows: [repeatRow("NNIIIINN", 64)] },
    { x: 0, y: 16, rows: [repeatRow("IINNNNII", 64)] }
  ]
);

const CAFE_FLOORING = [
  "C".repeat(64),
  repeatRow("GYYGNIGY", 64),
  repeatRow("YGGYYNGG", 64),
  repeatRow("IGGNNYGI", 64),
  repeatRow("NNGYIYNN", 64),
  repeatRow("YNYGYYNI", 64),
  repeatRow("GINNYNNY", 64),
  repeatRow("NNYYGNYG", 64),
  "C".repeat(64)
];

const CAFE_WINDOW = [
  "....CCCCCCCC....",
  "..CCIIIIIIIICC..",
  ".CIIIIRRIIIIIIC.",
  "CIIIIIIIIIIIIIIC",
  "CINNNNNNNNNNNNIC",
  "CIYYYYNYYYYYYNIC",
  "CINNNNNNNNNNNNIC",
  "CINNYNNNNYNNNNIC",
  "CINNNNNNNNNNNNIC",
  ".CNNNNNNNNNNNNC.",
  "..CCCCCCCCCCCC..",
  "....CC....CC...."
];

const CAFE_DESK = [
  centeredRow(56, `C${"Y".repeat(44)}C`, "."),
  centeredRow(56, `C${"N".repeat(44)}C`, "."),
  centeredRow(56, `C${repeatRow("TTII", 28)}C${".".repeat(10)}C${"T".repeat(6)}C`, "."),
  centeredRow(56, `C${"N".repeat(28)}C${".".repeat(10)}C${"N".repeat(6)}C`, "."),
  centeredRow(56, `CC${"N".repeat(26)}CC${".".repeat(10)}CC${".".repeat(4)}CC`, "."),
  centeredRow(56, `CC${"N".repeat(26)}CC${".".repeat(10)}CC${".".repeat(4)}CC`, "."),
  centeredRow(56, `CC${"N".repeat(26)}CC${".".repeat(10)}CC${".".repeat(4)}CC`, "."),
  centeredRow(56, `CC${"C".repeat(26)}CC${".".repeat(10)}CC${"C".repeat(4)}CC`, ".")
];

const CAFE_MONITOR = [
  "..CCCCCCCCCC..",
  ".CYYYYYYYYYYC.",
  "CYNNNNNNNNNNYC",
  "CYCTTCCCCCTTYC",
  "CYCTTCAACCTTYC",
  "CYCCCCCCCCCCYC",
  ".CNNNNNNNNNNC.",
  "..CC..CC..CC..",
  "...C..CC..C...",
  "...CCCCCCCC..."
];

const CAFE_LATTE = [".Y.Y..", ".Y.YC.", "CYYYY.", "CYWWY.", "CYYWY.", ".CCCC."];
const CAFE_PLANT = [
  "I..I...",
  ".TNIT..",
  "TIIIT..",
  "..NIA..",
  "...N...",
  ".CNNNC.",
  ".CTTTC.",
  "..CCC.."
];
const CAFE_LAMP = [
  "C.C.C",
  ".C.C.",
  ".C.C.",
  "C.C.C",
  "NNNNN",
  "NYYYN",
  ".NYN.",
  "..C..",
  ".CTC.",
  "CTTTC",
  ".CCC.",
  "..C.."
];
const CAFE_MAT = ["CNNWWNNC", "CNWWNWNC", "CCCCCCCC"];
const CAFE_BEANS = [".CCC.", "CNNNC", "CNTNC", "CCCCC"];
const CAFE_FRAME = ["CCCCCC", "CYYYYC", "CYIIYC", "CINNIC", "CNIINC", "CYYYYC", "CCCCCC"];
const CAFE_CLOCK = [".CC.", "CYYC", "CNAC", ".CC."];
const CAFE_DOG = [
  "N...N.",
  "NNNNN.",
  "NWNNWA",
  "NNNNN.",
  ".NNNNC",
  "NNNNNC",
  ".N..NC",
  "N...CC"
];
const CAFE_SHOWCASE = [
  "..CC..",
  ".CYYC.",
  "CYIIYC",
  "CYTTYC",
  "CNNNNC",
  "CYYYYC",
  "CCCCCC",
  ".C..C."
];

// ── 베이커리 · 갓 구운 아침 ─────────────────────────────────

const BREAD = [".NNN.", "NYYYN", "NNNNN"];
const BAKERY_WALLPAPER = stampedCanvas(
  64,
  31,
  "Y",
  [
    { x: 3, y: 3, rows: BREAD },
    { x: 16, y: 10, rows: BREAD },
    { x: 29, y: 3, rows: BREAD },
    { x: 44, y: 12, rows: BREAD },
    { x: 55, y: 4, rows: BREAD },
    { x: 8, y: 22, rows: BREAD },
    { x: 35, y: 24, rows: BREAD }
  ]
);

const BAKERY_FLOORING = [
  "C".repeat(64),
  repeatRow("WWWWRRRR", 64),
  repeatRow("WWWWRRRR", 64),
  repeatRow("RRRRWWWW", 64),
  repeatRow("RRRRWWWW", 64),
  repeatRow("WWWWRRRR", 64),
  repeatRow("WWWWRRRR", 64),
  repeatRow("RRRRWWWW", 64),
  "C".repeat(64)
];

const BAKERY_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CYYYYYYYYYYYYYYC",
  "CYYAAYYYYYAAYYYC",
  "CYYYYYYYYYYYYYYC",
  "CYYYWYYYYYYWYYYC",
  "CYYYWWYYYYWWYYYC",
  "CYYWWWWYYWWWWYYC",
  "CYYYYYYYYYYYYYYC",
  "CYYNNNNNNNNNYYYC",
  "CNNNNNNNNNNNNNNC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const BAKERY_DESK = [
  "W".repeat(56),
  "Y".repeat(56),
  "N".repeat(56),
  centeredRow(56, "NNYYWWNN", "N"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const BAKERY_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CNNNNNNNNNNNNC",
  "CNYYYYYYYYYYNC",
  "CNYNNNNNNNYYNC",
  "CNYYYYYYYYYYNC",
  "CNNNNYYNNNNNNC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const BAKERY_MILK = [".W.W..", ".W.WC.", "CWWWW.", "CWYWW.", "CWWWW.", ".CCCC."];
const BAKERY_WHEAT = [
  "Y.Y.Y..",
  ".YYY.Y.",
  "Y.YYY..",
  "...Y...",
  "...Y...",
  ".CNNNC.",
  ".CNNNC.",
  "..CCC.."
];
const BAKERY_LAMP = [
  ".NNN.",
  "NYYYN",
  "NYYYN",
  ".NNN.",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];
const BAKERY_MAT = ["CWCWCWCW", "WRWRWRWR", "CCCCCCCC"];
const BAKERY_JAM = [".RRR.", "RWWWR", "RRRRR", "CCCCC"];
const BAKERY_FRAME = ["CCCCCC", "CYYYYC", "CYNNYC", "CNNNNC", "CNYNYC", "CYYYYC", "CCCCCC"];
const BAKERY_CLOCK = [".WW.", "WACC", "WYCC", ".CC."];
const BAKERY_CAT = [
  "N....N",
  "NNNNNN",
  "NWNNWN",
  "NNYNNN",
  ".NNNN.",
  "NYYYYN",
  ".N..N.",
  "N....N"
];
const BAKERY_BASKET = [
  ".NNNN.",
  "N....N",
  "NNNNNN",
  "NYYYYN",
  "NYNNYN",
  "NYYYYN",
  "NNNNNN",
  ".NNNN."
];

export const CAFE_BAKERY_ARTWORK: ThemeArtwork[] = [
  {
    key: "cafe",
    labelKo: "카페 · 벽돌 로스터리",
    labelEn: "Café · Brick roastery",
    items: [
      item("cafe-wallpaper", "크림 타일 벽", "Cream-tile wallpaper", "wallpaper", CAFE_WALLPAPER, true),
      item("cafe-flooring", "원두 테라초", "Coffee terrazzo flooring", "flooring", CAFE_FLOORING),
      item("cafe-window", "붉은 어닝 창", "Red-awning window", "wall-window", CAFE_WINDOW, true),
      item("cafe-desk", "L자 에스프레소 바", "L-shaped espresso bar", "furniture-desk", CAFE_DESK),
      item("cafe-monitor", "에스프레소 머신", "Espresso machine", "desk-center", CAFE_MONITOR),
      item("cafe-latte", "백조 라테", "Swan latte", "desk-left", CAFE_LATTE),
      item("cafe-plant", "커피 열매 가지", "Coffee-cherry branch", "desk-right", CAFE_PLANT),
      item("cafe-lamp", "펜던트 드리퍼", "Pendant dripper", "desk-lamp", CAFE_LAMP),
      item("cafe-mat", "백조 라테아트", "Swan latte art", "desk-front", CAFE_MAT),
      item("cafe-beans", "원두 자루", "Bean sack", ["wall-shelf-a", "wall-shelf-b"], CAFE_BEANS),
      item("cafe-frame", "커피백 포스터", "Coffee-bag poster", "wall-frame", CAFE_FRAME),
      item("cafe-clock", "추출 타이머", "Extraction timer", "wall-clock", CAFE_CLOCK),
      item("cafe-dog", "로스터리 강아지", "Roastery dog", "floor-left", CAFE_DOG),
      item("cafe-showcase", "곡면 디저트 쇼케이스", "Curved dessert case", "floor-right", CAFE_SHOWCASE, true)
    ]
  },
  {
    key: "bakery",
    labelKo: "베이커리 · 갓 구운 아침",
    labelEn: "Bakery · Fresh-baked morning",
    items: [
      item("bakery-wallpaper", "빵 무늬 벽지", "Bread-pattern wallpaper", "wallpaper", BAKERY_WALLPAPER, true),
      item("bakery-flooring", "체크 타일", "Checkered tiles", "flooring", BAKERY_FLOORING),
      item("bakery-window", "빵집 창문", "Bakery window", "wall-window", BAKERY_WINDOW, true),
      item("bakery-desk", "반죽대 책상", "Dough-table desk", "furniture-desk", BAKERY_DESK),
      item("bakery-monitor", "오븐 모니터", "Oven monitor", "desk-center", BAKERY_MONITOR),
      item("bakery-milk", "우유 머그", "Milk mug", "desk-left", BAKERY_MILK),
      item("bakery-wheat", "밀 화분", "Wheat pot", "desk-right", BAKERY_WHEAT),
      item("bakery-lamp", "바게트 조명", "Baguette lamp", "desk-lamp", BAKERY_LAMP),
      item("bakery-mat", "식힘망 매트", "Cooling-rack mat", "desk-front", BAKERY_MAT),
      item("bakery-jam", "잼병", "Jam jar", ["wall-shelf-a", "wall-shelf-b"], BAKERY_JAM),
      item("bakery-frame", "빵 메뉴 액자", "Bread-menu frame", "wall-frame", BAKERY_FRAME),
      item("bakery-clock", "주방 타이머", "Kitchen timer", "wall-clock", BAKERY_CLOCK),
      item("bakery-cat", "식빵 고양이", "Toast cat", "floor-left", BAKERY_CAT),
      item("bakery-basket", "빵 바구니", "Bread basket", "floor-right", BAKERY_BASKET, true)
    ]
  }
];
