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

// ── 음악실 · 홈 스튜디오 ────────────────────────────────────

const MUSIC_WALLPAPER = Array.from({ length: 31 }, (_, y) => {
  if (y % 6 === 0) return "C".repeat(64);
  return repeatRow(y % 12 < 6 ? "CVVVVCIIIII" : "CIIIIICVVVV", 64);
});

const MUSIC_FLOORING = [
  "C".repeat(64),
  repeatRow("CCCCIIIICCCCVVVV", 64),
  repeatRow("CCCIIIICCCCVVVVC", 64),
  repeatRow("CCIIIICCCCVVVVCC", 64),
  repeatRow("CIIIICCCCVVVVCCC", 64),
  repeatRow("IIIICCCCVVVVCCCC", 64),
  repeatRow("IIICCCCVVVVCCCCI", 64),
  repeatRow("IICCCCVVVVCCCCII", 64),
  "C".repeat(64)
];

const MUSIC_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIIIC",
  "CIIIVVVVVVIIIIIC",
  "CIIVVVVVVVVIIIIC",
  "CIIIVVVVVVIIIIIC",
  "CIIIIIIIIIIIIIIC",
  "CIIIIIQQIIIIIIIC",
  "CIIIIQQQQIIIIIIC",
  "CIIIIIQQIIIIIIIC",
  "CIIIIIIIIIIIIIIC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const MUSIC_DESK = [
  "V".repeat(56),
  "I".repeat(56),
  "C".repeat(56),
  centeredRow(56, "VVQQVVQQ", "C"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const MUSIC_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CIIIIIIIIIIIIC",
  "CIVIIVVVIIIIVC",
  "CIVVIVIVIIIVVC",
  "CIVIVIIVIVIIVC",
  "CIVIIIVVIIIIVC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const MUSIC_CUP = [".V.V..", ".V.VC.", "CVVVV.", "CVQVV.", "CVVVV.", ".CCCC."];
const MUSIC_PLANT = [
  "..V.V..",
  ".VVVVV.",
  "..VVV..",
  "...I...",
  "..III..",
  ".CQQQC.",
  ".CQQQC.",
  "..CCC.."
];
const MUSIC_LAMP = [
  ".VVV.",
  "VQQQV",
  ".VVV.",
  "..C..",
  ".CCC.",
  "CCCCC",
  ".CCC.",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];
const MUSIC_MAT = ["CWCWCWCW", "WVWVWVWV", "CCCCCCCC"];
const MUSIC_SYNTH = ["VVVVV", "VWWWV", "VWVWV", "CCCCC"];
const MUSIC_FRAME = ["CCCCCC", "CIIIIC", "CIVVIC", "CVQQVC", "CIVVIC", "CIIIIC", "CCCCCC"];
const MUSIC_CLOCK = [".VV.", "VQCC", "VWCC", ".CC."];
const MUSIC_CAT = [
  "V....V",
  "VVVVVV",
  "VWVVWV",
  "VVQVVV",
  "CVVVVC",
  "CVVVVC",
  ".V..V.",
  "V....V"
];
const MUSIC_RECORDS = [
  "CCCCCC",
  "CVVVVC",
  "CIVVIC",
  "CVQQVC",
  "CIVVIC",
  "CVVVVC",
  "CCCCCC",
  ".C..C."
];

// ── 오락실 · 레트로 아케이드 ────────────────────────────────

const STAR = [".A.", "AQA", ".A."];
const ARCADE_WALLPAPER = stampedCanvas(
  64,
  31,
  "C",
  [
    { x: 3, y: 3, rows: STAR },
    { x: 14, y: 12, rows: STAR },
    { x: 26, y: 4, rows: STAR },
    { x: 39, y: 13, rows: STAR },
    { x: 52, y: 3, rows: STAR },
    { x: 8, y: 24, rows: STAR },
    { x: 33, y: 24, rows: STAR },
    { x: 55, y: 23, rows: STAR }
  ]
);

const ARCADE_FLOORING = [
  "C".repeat(64),
  repeatRow("QQQQBBBB", 64),
  repeatRow("QQQQBBBB", 64),
  repeatRow("BBBBQQQQ", 64),
  repeatRow("BBBBQQQQ", 64),
  repeatRow("QQQQBBBB", 64),
  repeatRow("QQQQBBBB", 64),
  repeatRow("BBBBQQQQ", 64),
  "C".repeat(64)
];

const ARCADE_WINDOW = [
  "CCCCCCCCCCCCCCCC",
  "CQQQQQQQQQQQQQQC",
  "CQQAQQQQQQAQQQQC",
  "CQQQQBBBBQQQQQQC",
  "CQQQBBBBBBQQQQQC",
  "CQQBBBBBBBBQQQQC",
  "CQQQBBQAQBBQQQQC",
  "CQQQQBBBBQQQQQQC",
  "CQQAQQQQQQAQQQQC",
  "CQQQQQQQQQQQQQQC",
  "CCCCCCCCCCCCCCCC",
  "CCCCCCCCCCCCCCCC"
];

const ARCADE_DESK = [
  "Q".repeat(56),
  "B".repeat(56),
  "C".repeat(56),
  centeredRow(56, "QQAABBQQ", "C"),
  ...Array.from({ length: 4 }, () => deskLegRow(56, "C"))
];

const ARCADE_MONITOR = [
  "CCCCCCCCCCCCCC",
  "CBBBBBBBBBBBBC",
  "CBBQQBBBBQQBBC",
  "CBQQQQBBQQQQBC",
  "CBQWQQQQQQWQBC",
  "CBBQQQQQQQQBBC",
  "CCCCCCCCCCCCCC",
  "......CC......",
  "......CC......",
  "....CCCCCC...."
];

const ARCADE_CUP = [".A.A..", ".A.AC.", "CAAAA.", "CAQAA.", "CAAAA.", ".CCCC."];
const ARCADE_PLANT = [
  "..A.A..",
  ".AQAQA.",
  "..AAA..",
  "...B...",
  "..BBB..",
  ".CQQQC.",
  ".CQQQC.",
  "..CCC.."
];
const ARCADE_LAMP = [
  "..A..",
  ".AQA.",
  "AQQQA",
  ".AQA.",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  "..C..",
  ".CCC.",
  "CCCCC"
];
const ARCADE_MAT = ["QAQAQAQA", "ABABABAB", "CCCCCCCC"];
const ARCADE_CABINET = ["CCCCC", "CBBBC", "CQWQC", "CCACC"];
const ARCADE_FRAME = ["CCCCCC", "CQQQQC", "CQAAQC", "CABABC", "CQAAQC", "CQQQQC", "CCCCCC"];
const ARCADE_CLOCK = [".AA.", "AQCC", "AWCC", ".CC."];
const ARCADE_SLIME = [
  "..BB..",
  ".BBBB.",
  "BBBBBB",
  "BWBBWB",
  "BBABBB",
  "BBBBBB",
  ".BBBB.",
  "BBBBBB"
];
const ARCADE_COINS = [
  ".AAAA.",
  "A....A",
  "AAAAAA",
  "AQAQAQ",
  "AAAAAA",
  "AQAQAQ",
  "AAAAAA",
  ".AAAA."
];

export const MUSIC_ARCADE_ARTWORK: ThemeArtwork[] = [
  {
    key: "music",
    labelKo: "음악실 · 홈 스튜디오",
    labelEn: "Music room · Home studio",
    items: [
      item("music-wallpaper", "흡음재 벽지", "Acoustic-panel wallpaper", "wallpaper", MUSIC_WALLPAPER, true),
      item("music-flooring", "스튜디오 바닥", "Studio flooring", "flooring", MUSIC_FLOORING),
      item("music-window", "방음 창문", "Soundproof window", "wall-window", MUSIC_WINDOW, true),
      item("music-desk", "믹싱 책상", "Mixing desk", "furniture-desk", MUSIC_DESK),
      item("music-monitor", "파형 모니터", "Waveform monitor", "desk-center", MUSIC_MONITOR),
      item("music-cup", "음표 컵", "Music-note cup", "desk-left", MUSIC_CUP),
      item("music-plant", "리듬 화분", "Rhythm plant", "desk-right", MUSIC_PLANT),
      item("music-lamp", "스피커 조명", "Speaker lamp", "desk-lamp", MUSIC_LAMP),
      item("music-mat", "건반 매트", "Keyboard mat", "desk-front", MUSIC_MAT),
      item("music-synth", "미니 신시사이저", "Mini synthesizer", ["wall-shelf-a", "wall-shelf-b"], MUSIC_SYNTH),
      item("music-frame", "앨범 액자", "Album frame", "wall-frame", MUSIC_FRAME),
      item("music-clock", "메트로놈 시계", "Metronome clock", "wall-clock", MUSIC_CLOCK),
      item("music-cat", "헤드폰 고양이", "Headphone cat", "floor-left", MUSIC_CAT),
      item("music-records", "레코드 상자", "Record crate", "floor-right", MUSIC_RECORDS, true)
    ]
  },
  {
    key: "arcade",
    labelKo: "오락실 · 레트로 아케이드",
    labelEn: "Arcade · Retro games",
    items: [
      item("arcade-wallpaper", "픽셀 벽지", "Pixel wallpaper", "wallpaper", ARCADE_WALLPAPER, true),
      item("arcade-flooring", "체크 바닥", "Checkered floor", "flooring", ARCADE_FLOORING),
      item("arcade-window", "네온 창문", "Neon window", "wall-window", ARCADE_WINDOW, true),
      item("arcade-desk", "아케이드 책상", "Arcade desk", "furniture-desk", ARCADE_DESK),
      item("arcade-monitor", "CRT 모니터", "CRT monitor", "desk-center", ARCADE_MONITOR),
      item("arcade-cup", "코인 컵", "Coin cup", "desk-left", ARCADE_CUP),
      item("arcade-plant", "보너스 화분", "Bonus plant", "desk-right", ARCADE_PLANT),
      item("arcade-lamp", "픽셀 별 조명", "Pixel-star lamp", "desk-lamp", ARCADE_LAMP),
      item("arcade-mat", "스코어 매트", "Score mat", "desk-front", ARCADE_MAT),
      item("arcade-cabinet", "미니 캐비닛", "Mini cabinet", ["wall-shelf-a", "wall-shelf-b"], ARCADE_CABINET),
      item("arcade-frame", "게임 포스터", "Game poster", "wall-frame", ARCADE_FRAME),
      item("arcade-clock", "스테이지 시계", "Stage clock", "wall-clock", ARCADE_CLOCK),
      item("arcade-slime", "슬라임 펫", "Slime pet", "floor-left", ARCADE_SLIME),
      item("arcade-coins", "코인 바구니", "Coin basket", "floor-right", ARCADE_COINS, true)
    ]
  }
];
