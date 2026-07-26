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

// ── 판타지 · 연금술 온실 서재 ────────────────────────────────

const FANTASY_VINE = ["G.....", "GG....", "G.G...", "G..G..", "G...GG", "....G."];
const RUNE = [".A...", "A.G.A", ".GIG.", "A.G.A", "...A."];

const FANTASY_WALLPAPER = stampedCanvas(
  64,
  31,
  "I",
  [
    { x: 2, y: 1, rows: FANTASY_VINE },
    { x: 55, y: 2, rows: FANTASY_VINE },
    { x: 8, y: 20, rows: FANTASY_VINE },
    { x: 36, y: 22, rows: FANTASY_VINE },
    { x: 25, y: 4, rows: RUNE },
    { x: 47, y: 14, rows: RUNE },
    { x: 0, y: 17, rows: [repeatRow("N...N.......", 64)] },
    { x: 0, y: 18, rows: [repeatRow(".NNN........", 64)] }
  ]
);

const FANTASY_FLOORING = [
  "C".repeat(64),
  repeatRow("NNNNCCII", 64),
  repeatRow("NNNNCCII", 64),
  repeatRow("CCIIIINN", 64),
  repeatRow("IIGIICCC", 64),
  repeatRow("IICCNNNN", 64),
  repeatRow("CCNNNNII", 64),
  repeatRow("NNIIGIII", 64),
  "C".repeat(64)
];

const FANTASY_WINDOW = [
  ".......CC.......",
  "......CVVC......",
  ".....CVVVVC.....",
  "....CVVWWVVC....",
  "...CVVVGGVVVC...",
  "..CVVGAAGVVVVC..",
  ".CVVGGWWGGVVVVC.",
  "CVVVVVGGVVVVVVVC",
  "CVVNNNNNNNNNVVVC",
  "CVNNNNNNNNNNNVVC",
  "CCCCCCCCCCCCCCCC",
  ".CC..........CC."
];

const FANTASY_DESK = [
  centeredRow(56, "C".repeat(46), "."),
  centeredRow(56, `C${"N".repeat(48)}C`, "."),
  centeredRow(56, `CC${repeatRow("NNAG", 44)}CC`, "."),
  centeredRow(56, `C${"N".repeat(16)}CC${"N".repeat(10)}CC${"N".repeat(16)}C`, "."),
  centeredRow(56, `CC${".".repeat(14)}CC${"N".repeat(10)}CC${".".repeat(14)}CC`, "."),
  centeredRow(56, `CC${".".repeat(14)}CC${"N".repeat(10)}CC${".".repeat(14)}CC`, "."),
  centeredRow(56, `CC${".".repeat(14)}CC${"C".repeat(10)}CC${".".repeat(14)}CC`, "."),
  centeredRow(56, `.CC${".".repeat(12)}CC${".".repeat(14)}CC${".".repeat(12)}CC.`, ".")
];

const FANTASY_MONITOR = [
  "..CC......CC..",
  ".CWWC....CWWC.",
  "CWAAWC..CWGGWC",
  "CWIAAC..CGGIWC",
  "CWWWWCCCCWWWWC",
  ".CCCCNNNNCCCC.",
  ".....CNN.C....",
  ".....CNN.C....",
  "....CCCCCC....",
  "...CCCCCCCC..."
];

const FANTASY_POTION = [
  ".C..C.",
  ".CCCC.",
  "..CC..",
  ".CGGC.",
  "CGAAGC",
  ".CCCC."
];

const FANTASY_MANDRAKE = [
  "G.G.G.G",
  ".GGGGG.",
  "..GGG..",
  ".NNNNN.",
  "NWA.AWN",
  "NNNNNNN",
  ".N.N.N.",
  "N..N..N"
];

const FANTASY_LAMP = [
  "A...A",
  ".A.A.",
  "..W..",
  "A...A",
  ".C.C.",
  "CGWGC",
  "CGAGC",
  ".CGC.",
  "..C..",
  ".C.C.",
  "C...C",
  ".CCC."
];

const FANTASY_MAT = ["CGAIAAGC", "CAIGGIAC", "CCCCCCCC"];
const FANTASY_BOOK = ["CCCCC", "CWGWC", "CAIAC", "CCCCC"];
const FANTASY_FRAME = ["CCCCCC", "CWWWNC", "CWGNNC", "CGAGNC", "CNNNWC", "CWWWWC", "CCCCCC"];
const FANTASY_CLOCK = [".CC.", "CAGC", "GWAC", ".CC."];

const FANTASY_DRAGON = [
  "G....G",
  "GG..GG",
  ".GCCG.",
  "CGAAGC",
  ".GGGG.",
  "GGGGGC",
  "G.GG.C",
  "G..GCC"
];

const FANTASY_CHEST = [
  ".CCCC.",
  "CNNNNC",
  "CNAANC",
  "CCCCCC",
  "CW..WC",
  "CWWWWC",
  "CNCCNC",
  ".C..C."
];

// ── 학교 · 과학 미술 교실 ────────────────────────────────────

const NOTICE = ["KKKKKKK", "KWWAWWK", "KWWWWWK", "KAKKKAK", "KKKKKKK"];

const SCHOOL_WALLPAPER = stampedCanvas(
  64,
  31,
  "G",
  [
    { x: 2, y: 2, rows: NOTICE },
    { x: 24, y: 8, rows: NOTICE },
    { x: 45, y: 2, rows: NOTICE },
    { x: 8, y: 20, rows: NOTICE },
    { x: 39, y: 22, rows: NOTICE },
    { x: 0, y: 17, rows: [repeatRow("N......N", 64)] },
    { x: 0, y: 18, rows: [repeatRow("NNNNNNNN", 64)] }
  ]
);

const SCHOOL_FLOORING = [
  "C".repeat(64),
  repeatRow("KKKKWWWW", 64),
  repeatRow("KKKKWWWW", 64),
  repeatRow("WWWWKKKK", 64),
  repeatRow("WWAWWWAW", 64),
  repeatRow("KKKKWWWW", 64),
  repeatRow("KKKKWWWW", 64),
  repeatRow("WWWWKKKK", 64),
  "C".repeat(64)
];

const SCHOOL_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CKKKKKKKKKKKKKKC",
  "CKKWWKKKKKKWWKKC",
  "CKWWWWKKKKWWWWKC",
  "CKKWWKAAAAKWWKKC",
  "CKKKKAYYYYAKKKKC",
  "CKKKAYYCCYYAKKKC",
  "CKNNAYYYYYYANKKC",
  "CKNNNNNNNNNNNNKC",
  "CKKKKKKKKKKKKKKC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const SCHOOL_DESK = [
  centeredRow(56, `C${"Y".repeat(20)}C....C${"Y".repeat(20)}C`, "."),
  centeredRow(56, `C${"N".repeat(20)}C....C${"N".repeat(20)}C`, "."),
  centeredRow(56, `C${repeatRow("WWKA", 20)}C....C${repeatRow("KWWA", 20)}C`, "."),
  centeredRow(56, `C${"N".repeat(20)}C....C${"N".repeat(20)}C`, "."),
  centeredRow(56, `CC${".".repeat(18)}CC....CC${".".repeat(18)}CC`, "."),
  centeredRow(56, `CC${".".repeat(18)}CC....CC${".".repeat(18)}CC`, "."),
  centeredRow(56, `CC${".".repeat(18)}CC....CC${".".repeat(18)}CC`, "."),
  centeredRow(56, `CC${".".repeat(18)}CC....CC${".".repeat(18)}CC`, ".")
];

const SCHOOL_MONITOR = [
  "..CC......CC..",
  ".CKKC....CKKC.",
  "CKWWKC..CKAAKC",
  "CKAAKC..CKWWKC",
  ".CKKCCCCCCKKC.",
  "..CCCCCCCCCC..",
  "......CC......",
  "......CC......",
  "....CCCCCC....",
  "...CC....CC..."
];

const SCHOOL_MILK = [
  "..WW..",
  ".WAAW.",
  "CWWWWC",
  "CWKKWC",
  "CWWWWC",
  ".CCCC."
];

const SCHOOL_SPROUT = [
  "..A.A..",
  ".KAAAK.",
  "..AAA..",
  "...C...",
  "..CCC..",
  ".CWWWC.",
  ".CKKKC.",
  "..CCC.."
];

const SCHOOL_LAMP = [
  "CCCCC",
  "CWWWC",
  ".CCC.",
  "...C.",
  "..CC.",
  ".CC..",
  ".C...",
  ".CC..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];

const SCHOOL_MAT = ["CWWCCWWC", "CKAWWAKC", "CCCCCCCC"];
const SCHOOL_PENCILS = [".A.W.", ".A.W.", "CAAWW", "CCCCC"];
const SCHOOL_FRAME = ["CCCCCC", "CKKKKC", "CKAAKC", "CAWWAC", "CKWWKC", "CKKKKC", "CCCCCC"];
const SCHOOL_CLOCK = [".CC.", "CWWC", "CANC", ".CC."];

const SCHOOL_CHICK = [
  "..YY..",
  ".YYYY.",
  "YYCAYA",
  "YYYYYY",
  ".YYYY.",
  "..YY..",
  ".Y..Y.",
  "Y....Y"
];

const SCHOOL_BAG = [
  "..CC..",
  ".CYYC.",
  "CYYYYC",
  "CYWWYC",
  "CYKAYC",
  "CYYYYC",
  "CCCCCC",
  ".C..C."
];

export const FANTASY_SCHOOL_ARTWORK: ThemeArtwork[] = [
  {
    key: "fantasy",
    labelKo: "판타지 · 연금술 온실 서재",
    labelEn: "Fantasy · Alchemist greenhouse study",
    items: [
      item("fantasy-wallpaper", "룬 덩굴 벽", "Rune-vine wallpaper", "wallpaper", FANTASY_WALLPAPER, true),
      item("fantasy-flooring", "이끼 판석 바닥", "Mossy flagstone flooring", "flooring", FANTASY_FLOORING),
      item("fantasy-window", "뾰족 아치 창", "Pointed arch window", "wall-window", FANTASY_WINDOW, true),
      item("fantasy-desk", "연금술 작업대", "Alchemy workbench", "furniture-desk", FANTASY_DESK),
      item("fantasy-monitor", "펼친 주문서", "Open spellbook", "desk-center", FANTASY_MONITOR),
      item("fantasy-potion", "연금술 플라스크", "Alchemy flask", "desk-left", FANTASY_POTION),
      item("fantasy-mandrake", "만드라고라", "Mandrake", "desk-right", FANTASY_MANDRAKE),
      item("fantasy-lamp", "부유 반딧불 랜턴", "Floating firefly lantern", "desk-lamp", FANTASY_LAMP),
      item("fantasy-mat", "연금술 인장", "Alchemy sigil", "desk-front", FANTASY_MAT),
      item("fantasy-book", "사슬 마법책", "Chained grimoire", ["wall-shelf-a", "wall-shelf-b"], FANTASY_BOOK),
      item("fantasy-frame", "고대 지도 액자", "Ancient map", "wall-frame", FANTASY_FRAME),
      item("fantasy-clock", "황동 아스트롤라베", "Brass astrolabe", "wall-clock", FANTASY_CLOCK),
      item("fantasy-dragon", "작은 용", "Little dragon", "floor-left", FANTASY_DRAGON),
      item("fantasy-chest", "미믹 상자", "Mimic chest", "floor-right", FANTASY_CHEST, true)
    ]
  },
  {
    key: "school",
    labelKo: "학교 · 과학 미술 교실",
    labelEn: "School · Science art classroom",
    items: [
      item("school-wallpaper", "파란 게시판 벽", "Blue noticeboard wall", "wallpaper", SCHOOL_WALLPAPER, true),
      item("school-flooring", "교실 리놀륨", "Classroom linoleum", "flooring", SCHOOL_FLOORING),
      item("school-window", "스쿨버스 창문", "School-bus window", "wall-window", SCHOOL_WINDOW, true),
      item("school-desk", "짝꿍 학생 책상", "Paired student desks", "furniture-desk", SCHOOL_DESK),
      item("school-monitor", "접이식 시간표", "Folding timetable", "desk-center", SCHOOL_MONITOR),
      item("school-milk", "우유 팩", "Milk carton", "desk-left", SCHOOL_MILK),
      item("school-sprout", "과학 비커", "Science beaker", "desk-right", SCHOOL_SPROUT),
      item("school-lamp", "관절 독서등", "Anglepoise study lamp", "desk-lamp", SCHOOL_LAMP),
      item("school-mat", "펼친 공책", "Open notebook", "desk-front", SCHOOL_MAT),
      item("school-pencils", "연필꽂이", "Pencil cup", ["wall-shelf-a", "wall-shelf-b"], SCHOOL_PENCILS),
      item("school-frame", "교정 그림", "Schoolyard art", "wall-frame", SCHOOL_FRAME),
      item("school-clock", "교실 시계", "Classroom clock", "wall-clock", SCHOOL_CLOCK),
      item("school-chick", "병아리", "Chick", "floor-left", SCHOOL_CHICK),
      item("school-bag", "책가방", "School backpack", "floor-right", SCHOOL_BAG, true)
    ]
  }
];
