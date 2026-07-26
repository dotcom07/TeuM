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

// ── 꿈 · 새벽 열차 침대 ─────────────────────────────────────

const DREAM_WISP = ["..VVVVVV....", "VVVVVVVVVV..", "..PPP.VVVV..", "....PPPP...."];

const DREAM_WALLPAPER = stampedCanvas(
  64,
  31,
  "I",
  [
    { x: 2, y: 3, rows: DREAM_WISP },
    { x: 29, y: 9, rows: DREAM_WISP },
    { x: 49, y: 1, rows: DREAM_WISP },
    { x: 12, y: 20, rows: DREAM_WISP },
    { x: 43, y: 24, rows: ["VVVVVVVVVVVVVVVVVVVV"] },
    { x: 0, y: 15, rows: [repeatRow("N.......", 64)] },
    { x: 0, y: 16, rows: [repeatRow(".N......", 64)] },
    { x: 22, y: 2, rows: ["A", "..W", "....A"] }
  ]
);

const DREAM_FLOORING = [
  "C".repeat(64),
  repeatRow("VVVVWWPP", 64),
  repeatRow("VVVVWWPP", 64),
  repeatRow("PPNNPPNN", 64),
  repeatRow("WWVVWWVV", 64),
  repeatRow("PPNNPPNN", 64),
  repeatRow("VVWWVVWW", 64),
  repeatRow("NNPPNNPP", 64),
  "C".repeat(64)
];

const DREAM_WINDOW = [
  "....CCCCCCCC....",
  "..CCVVVVVVVVCC..",
  ".CVVVVVVVVVVVVC.",
  "CVVVVVAAVVVVVVVC",
  "CVVPPPPPPPPVVVVC",
  "CVPPPPWWPPPPVVVC",
  "CVVVVVWWVVVVVVVC",
  "CVNNNNNNNNNNNNVC",
  "CVVVVVVVVVVVVVVC",
  ".CPPPPPPPPPPPPC.",
  "..CCCCCCCCCCCC..",
  "....CC....CC...."
];

const DREAM_DESK = [
  centeredRow(56, "C".repeat(52), "."),
  centeredRow(56, `C${"V".repeat(50)}C`, "."),
  centeredRow(56, `C${repeatRow("VVVVP", 50)}C`, "."),
  centeredRow(56, `C${"N".repeat(50)}C`, "."),
  centeredRow(56, `C${"I".repeat(18)}C${".".repeat(12)}C${"I".repeat(18)}C`, "."),
  centeredRow(56, `C${"I".repeat(18)}C${".".repeat(12)}C${"I".repeat(18)}C`, "."),
  centeredRow(56, `C${"I".repeat(18)}C${".".repeat(12)}C${"I".repeat(18)}C`, "."),
  centeredRow(56, `C${"C".repeat(18)}C${".".repeat(12)}C${"C".repeat(18)}C`, ".")
];

const DREAM_MONITOR = [
  "..CC......CC..",
  ".CWWC....CWWC.",
  "CWPPWC..CWVVWC",
  "CPAPPC..CVWVVC",
  "CPPPPC..CVVVVC",
  ".CWWCCCCCCWWC.",
  "..CC......CC..",
  "....CC..CC....",
  "...CCCCCCCC...",
  "....NNNNNN...."
];

const DREAM_MILK = [
  "..AA..",
  ".AWWC.",
  "AWWC..",
  "AWWC.C",
  ".AWWCC",
  "..CCC."
];

const DREAM_FLOWER = [
  "..V.V..",
  ".VVAVV.",
  "..VVV..",
  "...P...",
  "..PPP..",
  ".CPNPC.",
  ".CVVVC.",
  "..CCC.."
];

const DREAM_LAMP = [
  "..C..",
  "C.C.C",
  ".C.C.",
  "V.P.A",
  ".C.C.",
  "P.C.V",
  "..C..",
  ".WWW.",
  "WVVVW",
  ".WAW.",
  "..C..",
  ".CCC."
];

const DREAM_MAT = ["CVVPPVVC", "CPWVVWPC", "CCCCCCCC"];
const DREAM_MASK = [".C.C.", "CVVVC", "CVWVC", ".CCC."];
const DREAM_FRAME = ["CCCCCC", "CIIIPC", "CIPWWC", "CIWPPC", "CPPIIC", "CIIIIC", "CCCCCC"];
const DREAM_CLOCK = ["CCC.", "CAAC", ".VVC", "..CC"];

const DREAM_SHEEP = [
  "..VVV.",
  ".VVVVV",
  "VVWAVC",
  "VVVVVC",
  ".VCCVC",
  ".CCCC.",
  ".C..C.",
  "C....C"
];

const DREAM_PILLOW = [
  "..CC..",
  ".CVVC.",
  "CVPPVC",
  "CVWAVC",
  "CVPPVC",
  "CVVVVC",
  ".C..C.",
  "C....C"
];

// ── 동물원 · 사파리 방문자 센터 ─────────────────────────────

const ZOO_PAW = [".N.N.", "NNNNN", ".NNN."];
const ZOO_ELEPHANT = [".NNNN..", "NNNNNN.", "NNNCNNN", ".N..N.."];

const ZOO_WALLPAPER = stampedCanvas(
  64,
  31,
  "Y",
  [
    { x: 3, y: 3, rows: ZOO_PAW },
    { x: 17, y: 11, rows: ZOO_PAW },
    { x: 52, y: 22, rows: ZOO_PAW },
    { x: 35, y: 3, rows: ZOO_ELEPHANT },
    { x: 0, y: 18, rows: [repeatRow("N...N.......", 64)] },
    { x: 0, y: 19, rows: [repeatRow(".NNN........", 64)] },
    { x: 46, y: 10, rows: ["O", "O", "OO", "O", "O", "ONN", "O.N"] }
  ]
);

const ZOO_FLOORING = [
  "C".repeat(64),
  repeatRow("NNNNYYYY", 64),
  repeatRow("NNNNYYYY", 64),
  repeatRow("YYYYNNNN", 64),
  repeatRow("YYOYYYYY", 64),
  repeatRow("YO.OYYYY", 64),
  repeatRow("YYYYO.YY", 64),
  "N".repeat(64),
  "C".repeat(64)
];

const ZOO_WINDOW = [
  "....CCCCCCCC....",
  "..CCYYYYYYYYCC..",
  ".CYYYYYYYYYYYYC.",
  "CYYYYAAYYYYYYYYC",
  "CYYAAAAOYYYYYYYC",
  "CYYYAAOOYYYYYYYC",
  "CYYYYYOYYYYYYYYC",
  "CYYNNNOYYYNNYYYC",
  "CYNNNNONNNNNNYYC",
  "CNNNNNNNNNNNNNNC",
  ".CCCCCCCCCCCCCC.",
  "...CC......CC..."
];

const ZOO_DESK = [
  repeatRow("OOYY", 56),
  "C".repeat(56),
  centeredRow(56, `C${"Y".repeat(46)}C`, "."),
  centeredRow(56, `C${repeatRow("NNYY", 46)}C`, "."),
  centeredRow(56, `C${"N".repeat(18)}C${".".repeat(8)}C${"N".repeat(18)}C`, "."),
  centeredRow(56, `C${"N".repeat(18)}C${".".repeat(8)}C${"N".repeat(18)}C`, "."),
  centeredRow(56, `C${"N".repeat(18)}C${".".repeat(8)}C${"N".repeat(18)}C`, "."),
  centeredRow(56, `C${"C".repeat(18)}C${".".repeat(8)}C${"C".repeat(18)}C`, ".")
];

const ZOO_MONITOR = [
  "..CCCCCCCCCC..",
  ".CYYYYYYYYYYC.",
  "CYYNNYYYOOYYYC",
  "CYNNNYYOOOYYYC",
  "CYYNNYYYOYYYYC",
  "CYYYYYYYYYYYYC",
  ".CCCCCCCCCCCC.",
  "....CC..CC....",
  "....CC..CC....",
  "...CCCCCCCC..."
];

const ZOO_CUP = [
  "C.C...",
  "CYC...",
  "CYCNCC",
  "CNCYCC",
  "CYCNCC",
  ".CCCC."
];

const ZOO_ACACIA = [
  ".NNNNN.",
  "NNONONN",
  ".NNNNN.",
  "...N...",
  "...N...",
  "..NNN..",
  ".CYYYC.",
  "..CCC.."
];

const ZOO_LAMP = [
  ".OOO.",
  ".OCO.",
  "..O..",
  ".OO..",
  ".O...",
  ".ONO.",
  ".O...",
  ".ONO.",
  ".O...",
  ".OO..",
  ".C.C.",
  "CCCCC"
];

const ZOO_MAT = ["CNNYNNYC", "CYONOYOC", "CCCCCCCC"];
const ZOO_PANDA = ["YYYYY", "YCOCY", "YNNNY", "YYYYY"];
const ZOO_FRAME = ["CCCCCC", "CYYYYC", "CYOOYC", "CONNOC", "CONNOC", "CYYYYC", "CCCCCC"];
const ZOO_CLOCK = ["N..N", "NCCN", "CYYC", ".CC."];

const ZOO_PANDA_CUB = [
  "C.C...",
  "CWWC..",
  "CWYW..",
  "CWWC..",
  "CWWCCC",
  "CWCWCC",
  ".C..C.",
  "C....C"
];

const ZOO_BOX = [
  "..CC..",
  ".CNNNC",
  "CNNNNC",
  "CNYONC",
  "CNNNNC",
  "CNOYNC",
  "CCCCCC",
  ".C..C."
];

export const DREAM_ZOO_ARTWORK: ThemeArtwork[] = [
  {
    key: "dream",
    labelKo: "꿈 · 새벽 열차 침대",
    labelEn: "Dream · Dawn sleeper train",
    items: [
      item("dream-wallpaper", "스쳐가는 꿈 벽지", "Passing-dream wallpaper", "wallpaper", DREAM_WALLPAPER, true),
      item("dream-flooring", "패치워크 러그", "Patchwork rug flooring", "flooring", DREAM_FLOORING),
      item("dream-window", "둥근 열차창", "Rounded train window", "wall-window", DREAM_WINDOW, true),
      item("dream-desk", "침대 트렁크", "Sleeper trunk desk", "furniture-desk", DREAM_DESK),
      item("dream-monitor", "펼친 꿈일기", "Open dream journal", "desk-center", DREAM_MONITOR),
      item("dream-milk", "초승달 우유", "Crescent moon milk", "desk-left", DREAM_MILK),
      item("dream-flower", "잠든 양귀비", "Sleeping poppy", "desk-right", DREAM_FLOWER),
      item("dream-lamp", "꿈 모빌", "Dream mobile", "desk-lamp", DREAM_LAMP),
      item("dream-mat", "퀼트 이불", "Quilt blanket", "desk-front", DREAM_MAT),
      item("dream-mask", "수면 안대", "Sleep mask", ["wall-shelf-a", "wall-shelf-b"], DREAM_MASK),
      item("dream-frame", "꿈 풍경 액자", "Dreamscape art", "wall-frame", DREAM_FRAME),
      item("dream-clock", "녹는 시계", "Melting clock", "wall-clock", DREAM_CLOCK),
      item("dream-sheep", "구름 양", "Cloud sheep", "floor-left", DREAM_SHEEP),
      item("dream-pillow", "꿈문 쿠션", "Dream-door cushion", "floor-right", DREAM_PILLOW, true)
    ]
  },
  {
    key: "zoo",
    labelKo: "동물원 · 사파리 안내소",
    labelEn: "Zoo · Safari visitor center",
    items: [
      item("zoo-wallpaper", "사파리 지도 벽지", "Safari-map wallpaper", "wallpaper", ZOO_WALLPAPER, true),
      item("zoo-flooring", "발자국 보드워크", "Paw-print boardwalk", "flooring", ZOO_FLOORING),
      item("zoo-window", "기린 지평선 창", "Giraffe horizon window", "wall-window", ZOO_WINDOW, true),
      item("zoo-desk", "차양 안내소", "Awning ranger booth", "furniture-desk", ZOO_DESK),
      item("zoo-monitor", "서식지 지도 표지판", "Habitat map sign", "desk-center", ZOO_MONITOR),
      item("zoo-cup", "얼룩 컵", "Zebra cup", "desk-left", ZOO_CUP),
      item("zoo-acacia", "실루엣 아카시아", "Silhouette acacia", "desk-right", ZOO_ACACIA),
      item("zoo-lamp", "기린 목 랜턴", "Giraffe-neck lantern", "desk-lamp", ZOO_LAMP),
      item("zoo-mat", "탐방 발자국", "Safari trail prints", "desk-front", ZOO_MAT),
      item("zoo-panda", "사파리 티켓", "Safari tickets", ["wall-shelf-a", "wall-shelf-b"], ZOO_PANDA),
      item("zoo-frame", "사자 액자", "Lion art", "wall-frame", ZOO_FRAME),
      item("zoo-clock", "코끼리 시계", "Elephant clock", "wall-clock", ZOO_CLOCK),
      item("zoo-panda-cub", "아기 판다", "Panda cub", "floor-left", ZOO_PANDA_CUB),
      item("zoo-box", "사파리 상자", "Safari box", "floor-right", ZOO_BOX, true)
    ]
  }
];
