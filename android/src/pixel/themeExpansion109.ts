import type { PixelItem, SlotId } from "./catalog";
import { LATE_THEME_ART_109 } from "./lateThemeArt109";

type PetKind = "cat" | "dog" | "rabbit" | "bear" | "ghost" | "bluebird";

interface Theme109 {
  key: string;
  labelKo: string;
  labelEn: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  motif: string[];
  petKind: PetKind;
  petNameKo: string;
  petNameEn: string;
}

export const EXPANSION_THEME_META = [
  ["spring", "봄", "Spring"],
  ["winter", "겨울", "Winter"],
  ["calico", "삼색고양이", "Calico"],
  ["aquarium", "아쿠아리움", "Aquarium"],
  ["undersea", "해저", "Undersea"],
  ["dream", "꿈", "Dream"],
  ["zoo", "동물원", "Zoo"],
  ["sf", "SF", "SF"],
  ["space", "우주", "Space"],
  ["christmas", "크리스마스", "Christmas"],
  ["sky", "하늘", "Sky"],
  ["fantasy", "판타지", "Fantasy"],
  ["school", "학교", "School"],
  ["rainy", "장마", "Rainy"],
  ["library", "도서관", "Library"],
  ["cafe", "카페", "Cafe"],
  ["bakery", "베이커리", "Bakery"],
  ["camping", "캠핑", "Camping"],
  ["greenhouse", "온실", "Greenhouse"],
  ["music", "음악실", "Music room"],
  ["arcade", "오락실", "Arcade"],
  ["hanok", "한옥", "Hanok"],
  ["night-city", "밤도시", "Night city"]
] as const;

const THEMES: Theme109[] = [
  {
    key: "spring",
    labelKo: "봄",
    labelEn: "Spring",
    background: "K",
    primary: "P",
    secondary: "W",
    accent: "S",
    surface: "H",
    motif: [".3.3.", "33133", ".333.", "..2..", ".2.2."],
    petKind: "rabbit",
    petNameKo: "벚꽃 토끼",
    petNameEn: "Cherry-blossom rabbit"
  },
  {
    key: "winter",
    labelKo: "겨울",
    labelEn: "Winter",
    background: "I",
    primary: "E",
    secondary: "K",
    accent: "W",
    surface: "H",
    motif: ["1...1", ".1.1.", "..3..", ".1.1.", "1...1"],
    petKind: "dog",
    petNameKo: "목도리 강아지",
    petNameEn: "Scarf dog"
  },
  {
    key: "calico",
    labelKo: "삼색고양이",
    labelEn: "Calico",
    background: "W",
    primary: "O",
    secondary: "C",
    accent: "A",
    surface: "L",
    motif: ["1...2", "11122", "14.42", "11322", ".1.2."],
    petKind: "cat",
    petNameKo: "삼색고양이",
    petNameEn: "Calico cat"
  },
  {
    key: "aquarium",
    labelKo: "아쿠아리움",
    labelEn: "Aquarium",
    background: "E",
    primary: "B",
    secondary: "T",
    accent: "Y",
    surface: "W",
    motif: [".....", ".1113", "11411", ".1113", "....."],
    petKind: "cat",
    petNameKo: "물고기 모자냥이",
    petNameEn: "Fish-hat cat"
  },
  {
    key: "undersea",
    labelKo: "해저",
    labelEn: "Undersea",
    background: "T",
    primary: "B",
    secondary: "I",
    accent: "E",
    surface: "K",
    motif: [".333.", "31113", "31113", ".111.", "1.1.1"],
    petKind: "ghost",
    petNameKo: "해파리 유령",
    petNameEn: "Jellyfish ghost"
  },
  {
    key: "dream",
    labelKo: "꿈",
    labelEn: "Dream",
    background: "M",
    primary: "P",
    secondary: "I",
    accent: "W",
    surface: "K",
    motif: ["..3..", ".313.", "33133", ".313.", "..3.."],
    petKind: "ghost",
    petNameKo: "꿈구름 유령",
    petNameEn: "Dream-cloud ghost"
  },
  {
    key: "zoo",
    labelKo: "동물원",
    labelEn: "Zoo",
    background: "Y",
    primary: "N",
    secondary: "O",
    accent: "G",
    surface: "W",
    motif: [".1.1.", "..1..", "11311", "11111", ".111."],
    petKind: "bear",
    petNameKo: "아기 곰",
    petNameEn: "Baby bear"
  },
  {
    key: "sf",
    labelKo: "SF",
    labelEn: "SF",
    background: "C",
    primary: "T",
    secondary: "G",
    accent: "A",
    surface: "W",
    motif: ["1...1", ".1.1.", "11311", ".1.1.", "1...1"],
    petKind: "cat",
    petNameKo: "회로냥이",
    petNameEn: "Circuit cat"
  },
  {
    key: "space",
    labelKo: "우주",
    labelEn: "Space",
    background: "I",
    primary: "B",
    secondary: "P",
    accent: "A",
    surface: "W",
    motif: ["..3..", ".111.", "11111", ".121.", "..2.."],
    petKind: "rabbit",
    petNameKo: "달토끼",
    petNameEn: "Moon rabbit"
  },
  {
    key: "christmas",
    labelKo: "크리스마스",
    labelEn: "Christmas",
    background: "G",
    primary: "R",
    secondary: "W",
    accent: "A",
    surface: "H",
    motif: ["..1..", ".111.", "11111", "..2..", ".333."],
    petKind: "dog",
    petNameKo: "산타 강아지",
    petNameEn: "Santa dog"
  },
  {
    key: "sky",
    labelKo: "하늘",
    labelEn: "Sky",
    background: "K",
    primary: "E",
    secondary: "W",
    accent: "A",
    surface: "H",
    motif: [".....", ".22..", "2222.", ".2222", "....."],
    petKind: "bluebird",
    petNameKo: "파랑새",
    petNameEn: "Bluebird"
  },
  {
    key: "fantasy",
    labelKo: "판타지",
    labelEn: "Fantasy",
    background: "T",
    primary: "G",
    secondary: "Y",
    accent: "A",
    surface: "W",
    motif: ["..3..", ".313.", "31113", ".111.", "..1.."],
    petKind: "rabbit",
    petNameKo: "별빛 토끼",
    petNameEn: "Starlight rabbit"
  },
  {
    key: "school",
    labelKo: "학교",
    labelEn: "School",
    background: "K",
    primary: "I",
    secondary: "W",
    accent: "A",
    surface: "E",
    motif: ["11111", "14441", "14441", "14441", "11111"],
    petKind: "dog",
    petNameKo: "책가방 강아지",
    petNameEn: "Backpack dog"
  },
  {
    key: "rainy",
    labelKo: "장마",
    labelEn: "Rainy",
    background: "B",
    primary: "T",
    secondary: "E",
    accent: "S",
    surface: "K",
    motif: [".111.", "11111", "..2..", "..2..", ".2.2."],
    petKind: "dog",
    petNameKo: "우비 강아지",
    petNameEn: "Raincoat dog"
  },
  {
    key: "library",
    labelKo: "도서관",
    labelEn: "Library",
    background: "T",
    primary: "N",
    secondary: "Y",
    accent: "R",
    surface: "W",
    motif: ["11.22", "11.22", "11.22", "11.22", "33333"],
    petKind: "cat",
    petNameKo: "책벌레냥이",
    petNameEn: "Bookworm cat"
  },
  {
    key: "cafe",
    labelKo: "카페",
    labelEn: "Cafe",
    background: "Y",
    primary: "N",
    secondary: "W",
    accent: "R",
    surface: "H",
    motif: [".111.", "12221", "12221", ".111.", "33333"],
    petKind: "cat",
    petNameKo: "바리스타냥이",
    petNameEn: "Barista cat"
  },
  {
    key: "bakery",
    labelKo: "베이커리",
    labelEn: "Bakery",
    background: "Y",
    primary: "O",
    secondary: "A",
    accent: "W",
    surface: "H",
    motif: [".333.", "31113", "11111", "12221", ".111."],
    petKind: "bear",
    petNameKo: "빵집 곰",
    petNameEn: "Bakery bear"
  },
  {
    key: "camping",
    labelKo: "캠핑",
    labelEn: "Camping",
    background: "I",
    primary: "G",
    secondary: "Y",
    accent: "O",
    surface: "W",
    motif: ["..1..", ".111.", "11211", "12221", "33333"],
    petKind: "dog",
    petNameKo: "캠핑 강아지",
    petNameEn: "Camping dog"
  },
  {
    key: "greenhouse",
    labelKo: "온실",
    labelEn: "Greenhouse",
    background: "E",
    primary: "G",
    secondary: "T",
    accent: "S",
    surface: "W",
    motif: ["1...1", ".1.1.", "..1..", "..2..", ".222."],
    petKind: "rabbit",
    petNameKo: "새싹 토끼",
    petNameEn: "Sprout rabbit"
  },
  {
    key: "music",
    labelKo: "음악실",
    labelEn: "Music room",
    background: "M",
    primary: "I",
    secondary: "P",
    accent: "S",
    surface: "W",
    motif: [".111.", "...1.", "...1.", ".221.", ".22.."],
    petKind: "cat",
    petNameKo: "멜로디냥이",
    petNameEn: "Melody cat"
  },
  {
    key: "arcade",
    labelKo: "오락실",
    labelEn: "Arcade",
    background: "C",
    primary: "B",
    secondary: "P",
    accent: "A",
    surface: "W",
    motif: [".1.1.", "11111", "13131", "11111", "1.1.1"],
    petKind: "ghost",
    petNameKo: "픽셀 유령",
    petNameEn: "Pixel ghost"
  },
  {
    key: "hanok",
    labelKo: "한옥",
    labelEn: "Hanok",
    background: "Y",
    primary: "N",
    secondary: "R",
    accent: "G",
    surface: "W",
    motif: ["22222", ".111.", "11111", "1.3.1", "11111"],
    petKind: "cat",
    petNameKo: "한옥 마당냥이",
    petNameEn: "Hanok courtyard cat"
  },
  {
    key: "night-city",
    labelKo: "밤도시",
    labelEn: "Night city",
    background: "C",
    primary: "I",
    secondary: "B",
    accent: "S",
    surface: "W",
    motif: ["1.2.1", "13131", "1.2.1", "13131", "11111"],
    petKind: "cat",
    petNameKo: "네온 검정냥이",
    petNameEn: "Neon black cat"
  }
];

const repeatRow = (pattern: string, width: number) =>
  pattern.repeat(Math.ceil(width / pattern.length)).slice(0, width);

const centeredRow = (width: number, content: string, fill: string) => {
  const left = Math.floor((width - content.length) / 2);
  return fill.repeat(left) + content + fill.repeat(width - left - content.length);
};

function mappedMotif(theme: Theme109): string[] {
  const tokens: Record<string, string> = {
    "1": theme.primary,
    "2": theme.secondary,
    "3": theme.accent,
    "4": theme.surface,
    C: "C",
    ".": "."
  };
  return theme.motif.map((row) => [...row].map((token) => tokens[token] ?? token).join(""));
}

function stamp(
  width: number,
  height: number,
  fill: string,
  motif: string[],
  offsetX = Math.floor((width - motif[0].length) / 2),
  offsetY = Math.floor((height - motif.length) / 2)
): string[] {
  const rows = Array.from({ length: height }, () => Array(width).fill(fill));
  motif.forEach((row, y) =>
    [...row].forEach((token, x) => {
      if (token !== "." && rows[offsetY + y]?.[offsetX + x] != null) {
        rows[offsetY + y][offsetX + x] = token;
      }
    })
  );
  return rows.map((row) => row.join(""));
}

function compose(
  width: number,
  height: number,
  fill: string,
  layers: Array<{ x: number; y: number; rows: string[] }>
): string[] {
  const pixels = Array.from({ length: height }, () => Array(width).fill(fill));
  for (const layer of layers) {
    layer.rows.forEach((row, offsetY) => {
      [...row].forEach((token, offsetX) => {
        if (token === ".") return;
        const x = layer.x + offsetX;
        const y = layer.y + offsetY;
        if (pixels[y]?.[x] != null) pixels[y][x] = token;
      });
    });
  }
  return pixels.map((row) => row.join(""));
}

function wallpaper(theme: Theme109): string[] {
  const motif = mappedMotif(theme);
  const tile = stamp(16, 10, theme.background, motif, 2, 2);
  return Array.from(
    { length: 31 },
    (_, y) => repeatRow(tile[y % tile.length], 64)
  );
}

function flooring(theme: Theme109): string[] {
  return [
    "C".repeat(64),
    repeatRow(theme.primary.repeat(5) + theme.secondary.repeat(3), 64),
    repeatRow(theme.primary.repeat(3) + theme.accent + theme.primary.repeat(4), 64),
    ...Array.from({ length: 5 }, (_, index) =>
      repeatRow(
        index % 2 === 0
          ? theme.secondary.repeat(6) + theme.primary.repeat(2)
          : theme.primary.repeat(2) + theme.secondary.repeat(6),
        64
      )
    ),
    "C".repeat(64)
  ];
}

function windowArt(theme: Theme109): string[] {
  const inner = stamp(14, 9, theme.surface, mappedMotif(theme), 4, 2);
  return [
    "C".repeat(16),
    ...inner.map((row) => `C${row}C`),
    "C".repeat(16),
    "C".repeat(16)
  ];
}

function deskArt(theme: Theme109): string[] {
  const leg = (() => {
    const row = Array(56).fill(".");
    row[2] = row[3] = row[52] = row[53] = "C";
    return row.join("");
  })();
  return [
    theme.accent.repeat(56),
    "C".repeat(56),
    theme.primary.repeat(56),
    centeredRow(
      56,
      `${theme.secondary}${theme.secondary}${theme.accent}${theme.accent}${theme.secondary}${theme.secondary}`,
      theme.primary
    ),
    leg,
    leg,
    leg,
    leg
  ];
}

function monitorArt(theme: Theme109): string[] {
  const screen = stamp(12, 6, theme.background, mappedMotif(theme), 3, 1);
  return [
    "C".repeat(14),
    ...screen.map((row) => `C${row}C`),
    "C".repeat(14),
    "......CC......",
    "....CCCCCC...."
  ];
}

function mugArt(theme: Theme109): string[] {
  return [
    `.C.${theme.accent}..`,
    `.C.${theme.accent}C.`,
    `C${theme.primary}${theme.surface}${theme.primary}CC`,
    `C${theme.primary}${theme.accent}${theme.primary}CC`,
    `C${theme.primary.repeat(3)}C.`,
    ".CCCC."
  ];
}

function ornamentArt(theme: Theme109): string[] {
  return [
    `..${theme.accent}....`,
    `.${theme.primary.repeat(3)}...`,
    `${theme.primary}${theme.surface}${theme.primary}${theme.surface}${theme.primary}..`,
    `.${theme.primary.repeat(3)}...`,
    `..${theme.secondary}....`,
    `..${theme.secondary}....`,
    ".CCCCC.",
    ".CIIIC."
  ];
}

function lampArt(theme: Theme109): string[] {
  return [
    `.${theme.accent.repeat(3)}.`,
    `${theme.primary}${theme.surface}${theme.surface}${theme.primary}.`,
    `.${theme.primary.repeat(3)}.`,
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
}

function matArt(theme: Theme109): string[] {
  return [
    "CCCCCCCC",
    `C${theme.primary}${theme.secondary}${theme.accent}${theme.primary}${theme.secondary}${theme.accent}C`,
    "CCCCCCCC"
  ];
}

function shelfArt(theme: Theme109): string[] {
  return [
    `.${theme.accent}...`,
    `${theme.primary.repeat(3)}..`,
    `${theme.primary}${theme.surface}${theme.primary}${theme.secondary}.`,
    "CCCCC"
  ];
}

function frameArt(theme: Theme109): string[] {
  const motif = stamp(4, 5, theme.background, mappedMotif(theme), 0, 0);
  return ["CCCCCC", ...motif.map((row) => `C${row}C`), "CCCCCC"];
}

function clockArt(theme: Theme109): string[] {
  return [
    ".CC.",
    `C${theme.surface}${theme.accent}C`,
    `C${theme.surface}${theme.primary}C`,
    ".CC."
  ];
}

function petArt(theme: Theme109): string[] {
  const p = theme.primary;
  const s = theme.secondary;
  const a = theme.accent;
  switch (theme.petKind) {
    case "dog":
      return [
        ".C.C..",
        `C${p}${p}C..`,
        `C${theme.surface}C${theme.surface}..`,
        `C${p}${a}C..`,
        `C${p}${p}C.C`,
        `C${p}${s}CCC`,
        ".C..C."
      ];
    case "rabbit":
      return [
        ".C.C..",
        `.${p}.${p}..`,
        `C${p}${p}${p}C.`,
        `C${theme.surface}C${theme.surface}C.`,
        `C${p}${a}${p}C.`,
        `C${p}${p}${p}.C`,
        `C${p}${s}${p}CC`,
        ".C..C."
      ];
    case "bear":
      return [
        ".C.C..",
        `C${p}C${p}C.`,
        `C${p}${p}${p}C.`,
        `C${theme.surface}C${theme.surface}C.`,
        `C${p}${a}${p}C.`,
        `C${p}${p}${p}C.`,
        `C${p}${s}${p}C.`,
        ".C..C."
      ];
    case "ghost":
      return [
        ".CCC..",
        `C${p}${p}${p}C.`,
        `C${theme.surface}C${theme.surface}C.`,
        `C${p}${a}${p}C.`,
        `C${p}${p}${p}C.`,
        `C${p}C${p}C.`,
        ".C.C.."
      ];
    case "bluebird":
      return [
        "......",
        ".CC...",
        `C${p}${p}CC.`,
        `C${theme.surface}C${p}${a}C`,
        `C${p}${p}${p}${p}C`,
        ".CC.C.",
        "..C..."
      ];
    default:
      return [
        "C.C...",
        `C${p}${p}C..`,
        `C${theme.surface}C${theme.surface}..`,
        `C${p}${a}C..`,
        `C${p}${p}C.C`,
        `C${p}${s}CCC`,
        ".C..C."
      ];
  }
}

function floorObjectArt(theme: Theme109): string[] {
  return [
    "......",
    `..${theme.accent.repeat(2)}..`,
    `.C${theme.secondary.repeat(2)}C.`,
    `C${theme.primary.repeat(4)}C`,
    `C${theme.surface.repeat(4)}C`,
    `C${theme.secondary.repeat(4)}C`,
    "CCCCCC",
    ".CCCC."
  ];
}

interface ThemeArtAsset {
  nameKo: string;
  nameEn: string;
  rows: string[];
}

interface ThemeArtPack {
  wallpaper: ThemeArtAsset;
  flooring: ThemeArtAsset;
  window: ThemeArtAsset;
  desk: ThemeArtAsset;
  monitor: ThemeArtAsset;
  mug: ThemeArtAsset;
  ornament: ThemeArtAsset;
  lamp: ThemeArtAsset;
  mat: ThemeArtAsset;
  shelf: ThemeArtAsset;
  frame: ThemeArtAsset;
  clock: ThemeArtAsset;
  pet: ThemeArtAsset;
  floorObject: ThemeArtAsset;
}

const SPRING_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "벚꽃 산책길 벽지",
    nameEn: "Cherry walk wallpaper",
    rows: compose(64, 31, "K", [
      { x: 0, y: 0, rows: ["E".repeat(64)] },
      { x: 0, y: 24, rows: Array.from({ length: 7 }, () => "H".repeat(64)) },
      {
        x: 31,
        y: 2,
        rows: [
          "............................NNNN",
          ".......................NNNNN...",
          "...................NNNN........",
          "..............NNNNN.............",
          ".........NNNNN..................",
          "....NNNNN......................."
        ]
      },
      { x: 36, y: 1, rows: [".PPP.", "PWPWP", ".PSP."] },
      { x: 47, y: 5, rows: [".PP.", "PWWP", ".SP."] },
      { x: 57, y: 3, rows: [".WP.", "PSWP", ".PP."] },
      { x: 23, y: 12, rows: [".P.", "PWP", ".S."] },
      { x: 11, y: 18, rows: [".WP.", "PSWP", ".PP."] },
      { x: 4, y: 25, rows: ["GGG....GG", ".GGGGGGG.", "..GGGG..."] }
    ])
  },
  flooring: {
    nameKo: "봄빛 잔디길",
    nameEn: "Spring grass path",
    rows: compose(64, 9, "G", [
      { x: 0, y: 0, rows: ["I".repeat(64)] },
      { x: 20, y: 1, rows: Array.from({ length: 8 }, () => "Y".repeat(25)) },
      { x: 16, y: 2, rows: ["PP.", ".WP"] },
      { x: 47, y: 5, rows: [".PP", "PWP"] },
      { x: 0, y: 8, rows: ["N".repeat(64)] }
    ])
  },
  window: {
    nameKo: "활짝 열린 봄 창문",
    nameEn: "Open spring window",
    rows: [
      "CCCCCCCCCCCCCCCC",
      "CEEEEEEEEEEEEEEC",
      "CEEEEEEEEEENNNNC",
      "CEEEEEEEENNNPPPC",
      "CEEEEEENNPPWPPPC",
      "CEEEEENPPPSPPEEC",
      "CEEEEEEEEEEEEEEC",
      "CEEEEKKKKKEEEEEC",
      "CEKKKKKKKKKKKEEC",
      "CEGGGGGGGGGGGGEC",
      "CCCCCCCCCCCCCCCC",
      "CIIICC....CCIIIC"
    ]
  },
  desk: {
    nameKo: "벚나무 곡선 책상",
    nameEn: "Cherrywood curved desk",
    rows: compose(56, 8, ".", [
      { x: 2, y: 0, rows: ["S".repeat(52)] },
      { x: 1, y: 1, rows: ["C".repeat(54)] },
      { x: 1, y: 2, rows: [`C${"W".repeat(52)}C`] },
      { x: 13, y: 3, rows: ["PPWSPP", ".PPP.."] },
      { x: 36, y: 3, rows: ["PWPWPP", "..PP.."] },
      { x: 3, y: 4, rows: ["CNC", "CNC", "CNC", "CNC"] },
      { x: 50, y: 4, rows: ["CNC", "CNC", "CNC", "CNC"] }
    ])
  },
  monitor: {
    nameKo: "꽃잎 노트북",
    nameEn: "Petal laptop",
    rows: [
      "..CCCCCCCCCC..",
      ".CPPPPPPPPPC..",
      ".CPPHPPHPPPC..",
      ".CPPPSPPPPPC..",
      ".CPPPPPPPPPC..",
      "..CCCCCCCCCC..",
      "...CIIIIIC....",
      "..CIIIIIIIIC..",
      ".CCCCCCCCCCCC.",
      ".............."
    ]
  },
  mug: {
    nameKo: "벚꽃 찻잔",
    nameEn: "Cherry tea cup",
    rows: [".C.C..", ".CCSC.", "CWWPCC", "CWSWCC", "CPPPC.", ".CCCC."]
  },
  ornament: {
    nameKo: "꽃가지 화병",
    nameEn: "Blossom vase",
    rows: [".P...P.", "PWP.PWP", ".S...S.", "..NNN..", "...N...", ".CWWWC.", ".CPIPC.", "..CCC.."]
  },
  lamp: {
    nameKo: "봄 종이등",
    nameEn: "Spring paper lantern",
    rows: ["..C..", ".CP C.".replace(" ", ""), "CPWPC", "CPSPC", ".CCC.", "..N..", "..N..", "..N..", "..N..", "..N..", ".CNC.", "CCCCC"]
  },
  mat: {
    nameKo: "꽃잎 체크 매트",
    nameEn: "Petal check mat",
    rows: ["SPSPSPSP", "PSWSPWSP", "CCCCCCCC"]
  },
  shelf: {
    nameKo: "벚꽃 분재",
    nameEn: "Cherry bonsai",
    rows: [".P.P.", "PWNWP", "..N..", "CCCCC"]
  },
  frame: {
    nameKo: "봄 언덕 그림",
    nameEn: "Spring hill art",
    rows: ["CCCCCC", "CKKNNC", "CKNPSC", "CGPPGC", "CGGGGC", "CYYGYC", "CCCCCC"]
  },
  clock: {
    nameKo: "꽃잎 시계",
    nameEn: "Petal clock",
    rows: [".I..", "ICI.", "CYYC", ".CC."]
  },
  pet: {
    nameKo: "벚꽃 롭이어 토끼",
    nameEn: "Cherry lop rabbit",
    rows: ["IP..PI", "IP..PI", ".IPPI.", "IPPPPI", "IPWPWI", "IPSPPI", ".IPPI.", ".C..C."]
  },
  floorObject: {
    nameKo: "봄 소풍 바구니",
    nameEn: "Spring picnic basket",
    rows: [".IIII.", "I....I", "IYYYYI", "IYIYII", "IIYYYI", "IYPIYI", "IIIIII", ".NNNN."]
  }
};

const WINTER_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "설원 오로라 벽지",
    nameEn: "Snowfield aurora wallpaper",
    rows: compose(64, 31, "I", [
      { x: 0, y: 0, rows: ["E".repeat(64)] },
      {
        x: 4,
        y: 3,
        rows: [
          "EEEEEEEEEE................................",
          "....EEEEEEEEEEEEEEE.......................",
          "..........SSSSSSSEEEEEEEEE................",
          "................SSSSSSSEEEEEEEEEEEEE......"
        ]
      },
      { x: 9, y: 10, rows: [".W.", "WWW", ".W."] },
      { x: 31, y: 8, rows: ["W...W", ".W.W.", "..W..", ".W.W.", "W...W"] },
      { x: 53, y: 13, rows: [".W.", "WWW", ".W."] },
      {
        x: 0,
        y: 21,
        rows: [
          "..........................EEEEE.................................",
          ".............EEEE.......EEEEEEEEE...............EEEEEEE........",
          "....EEEEEEEEEEEEEEEE...EEEEEEEEEEE.......EEEEEEEEEEEEEEEE......",
          "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
          "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
          "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
          "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
        ]
      },
      { x: 7, y: 16, rows: ["..G..", ".GGG.", "GGGGG", "..N..", "..N.."] },
      { x: 46, y: 17, rows: [".GGG.", "GGGGG", "GGGGG", "..N.."] }
    ])
  },
  flooring: {
    nameKo: "난롯가 통나무 바닥",
    nameEn: "Hearth log flooring",
    rows: compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["E".repeat(64)] },
      { x: 0, y: 2, rows: ["R".repeat(22) + "N".repeat(42)] },
      { x: 0, y: 4, rows: ["N".repeat(39) + "R".repeat(25)] },
      { x: 0, y: 6, rows: ["R".repeat(14) + "N".repeat(50)] },
      { x: 21, y: 1, rows: ["C", "C", "C"] },
      { x: 38, y: 4, rows: ["C", "C", "C"] },
      { x: 13, y: 6, rows: ["C", "C"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  },
  window: {
    nameKo: "성에 낀 산장 창문",
    nameEn: "Frosted cabin window",
    rows: [
      "NNNNNNNNNNNNNNNN",
      "NIIIIIIIIIIIIIIN",
      "NIWIIIIIIIIIIWIN",
      "NIIIWIIIIIIWIIIN",
      "NIIIIIINIIIIIIIN",
      "NIIWWWNWWWIIIIIN",
      "NNNNNNNNNNNNNNNN",
      "NIEEEEINIEEEEEIN",
      "NIEKKKINIEKKKEIN",
      "NIEEEEINIEEEEEIN",
      "NNNNNNNNNNNNNNNN",
      "CCNNNNNNNNNNNNCC"
    ]
  },
  desk: {
    nameKo: "썰매 곡선 책상",
    nameEn: "Sled runner desk",
    rows: compose(56, 8, ".", [
      { x: 3, y: 0, rows: ["N".repeat(49)] },
      { x: 1, y: 1, rows: ["C".repeat(53)] },
      { x: 2, y: 2, rows: [`C${"R".repeat(50)}C`] },
      { x: 5, y: 3, rows: ["CN", "CN", "CN"] },
      { x: 47, y: 3, rows: ["NC", "NC", "NC"] },
      { x: 3, y: 6, rows: ["CNNNNNNN", "CCCCCCCC"] },
      { x: 43, y: 6, rows: ["NNNNNNNC", "CCCCCCCC"] }
    ])
  },
  monitor: {
    nameKo: "눈보라 기상 모니터",
    nameEn: "Blizzard weather monitor",
    rows: [
      ".CCCCCCCCCCCC.",
      "CIIIIIIIIIIIIC",
      "CIIWIIIIWIIIIC",
      "CIIIWIIWIIIIIC",
      "CIIWWWWWWIIIIC",
      "CIIIWIIWIIIIIC",
      "CIIWIIIIWIIIIC",
      ".CCCCCCCCCCCC.",
      ".....CNN......",
      "...CCCCCCCC..."
    ]
  },
  mug: {
    nameKo: "김 나는 코코아",
    nameEn: "Steaming cocoa",
    rows: ["..W.W.", ".W.W..", ".CCCC.", "CNRRCC", "CNRRNC", ".CCCC."]
  },
  ornament: {
    nameKo: "작은 스노우볼",
    nameEn: "Tiny snow globe",
    rows: ["..WWW..", ".WIIIW.", "WIIWIIW", "WIEEIIW", ".WIIIW.", "..CCC..", ".CAAAC.", "CCCCCCC"]
  },
  lamp: {
    nameKo: "산장 오일 랜턴",
    nameEn: "Cabin oil lantern",
    rows: ["..C..", ".CNC.", "C...C", "CWAAC", "CWAAC", "CWWWC", ".CCC.", "..N..", "..N..", ".CNC.", "CNRNC", "CCCCC"]
  },
  mat: {
    nameKo: "뜨개 목도리 매트",
    nameEn: "Knitted scarf mat",
    rows: ["IEIIEIIE", "EIIEIIEI", "C.CC.CC."]
  },
  shelf: {
    nameKo: "방울 뜨개모자",
    nameEn: "Pom-pom knit hat",
    rows: ["..R..", ".RRR.", "RWRWR", "CCCCC"]
  },
  frame: {
    nameKo: "설산 판화",
    nameEn: "Snow mountain print",
    rows: ["CCCCCC", "CIIIIC", "CIIWIC", "CIWEWC", "CWEEEW", "CEKKKC", "CCCCCC"]
  },
  clock: {
    nameKo: "눈꽃 벽시계",
    nameEn: "Snowflake wall clock",
    rows: [".W..", "WCW.", "CAAC", ".CC."]
  },
  pet: {
    nameKo: "빨간 목도리 시바",
    nameEn: "Red-scarf shiba",
    rows: [".N.N..", "NNNN..", "NWNW..", "NNAN..", "NNNN.N", "NRRRNN", ".N..N.", "N....N"]
  },
  floorObject: {
    nameKo: "눈 묻은 털장화",
    nameEn: "Snowy winter boots",
    rows: ["N..N..", "IN.CN.", "IN.CN.", "CN.CN.", "CNCN..", "CN.CN.", "CNN.CN", "CCCCCC"]
  }
};

const CALICO_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "햇살 고양이방 벽지",
    nameEn: "Sunny cat room wallpaper",
    rows: compose(64, 31, "W", [
      { x: 0, y: 0, rows: ["L".repeat(64)] },
      { x: 0, y: 26, rows: Array.from({ length: 5 }, () => "K".repeat(64)) },
      {
        x: 5,
        y: 4,
        rows: [
          "....NNNNNNNNNN.................................................",
          "............NNNNNNNNNNN........................................",
          "......................NNNNNNNN................................."
        ]
      },
      { x: 6, y: 3, rows: [".OO.", "OWWO", ".OO."] },
      { x: 18, y: 7, rows: [".CC.", "CWWC", ".CC."] },
      { x: 31, y: 11, rows: [".AA.", "AWWA", ".AA."] },
      {
        x: 43,
        y: 4,
        rows: [
          "..C.....O.",
          ".CCC...OOO",
          "CCCCC.OOOOO",
          ".CCC...OOO.",
          "..C.....O.."
        ]
      },
      { x: 49, y: 18, rows: ["..N...", ".N.N..", "N...NN", "....N.", "..NN.."] },
      { x: 11, y: 21, rows: ["OO....", ".OOO..", "...OOO", ".....O"] }
    ])
  },
  flooring: {
    nameKo: "발바닥 러그 바닥",
    nameEn: "Paw rug flooring",
    rows: compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["L".repeat(64)] },
      { x: 16, y: 1, rows: Array.from({ length: 7 }, () => "Y".repeat(34)) },
      { x: 21, y: 3, rows: [".O...O.", "OOO.OOO", ".OOOOO.", "..OOO.."] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  },
  window: {
    nameKo: "햇살 낮잠 창문",
    nameEn: "Sun-nap window",
    rows: [
      "IIIIIIIIIIIIIIII",
      "IKKKKKKKKKKKKKKI",
      "IKKAAKKKKKKKKKKI",
      "IKAAAAKKKKKKKKKI",
      "IKKAAKKKKKKNNNNI",
      "IKKKKKKKKNNNPPPI",
      "IKKKKKKNNPPPOOOI",
      "IKKKKKKKKKKKKKKI",
      "IKYYYYYYYYYYYYKI",
      "IKYYYYYYYYYYYYKI",
      "IIIIIIIIIIIIIIII",
      "NNNNIIIIIIIINNNN"
    ]
  },
  desk: {
    nameKo: "스크래처 원목 책상",
    nameEn: "Scratch-post wood desk",
    rows: compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["C".repeat(54)] },
      { x: 2, y: 1, rows: ["N".repeat(52)] },
      { x: 3, y: 2, rows: ["Y".repeat(50)] },
      { x: 7, y: 3, rows: ["CNC", "COC", "CNC", "COC", "CNC"] },
      { x: 46, y: 3, rows: ["CNC", "COC", "CNC", "COC", "CNC"] },
      { x: 4, y: 7, rows: ["C".repeat(48)] }
    ])
  },
  monitor: {
    nameKo: "새 관찰 태블릿",
    nameEn: "Birdwatch tablet",
    rows: [
      "..CCCCCCCCCC..",
      ".CKKKKKKKKKC..",
      ".CKKKKAAKKKC..",
      ".CKKAAAKKKKC..",
      ".CKAAACAKKKC..",
      ".CKKACCCKKKC..",
      ".CKKKCKKKKKC..",
      "..CCCCCCCCCC..",
      "....CIIIIC....",
      "..CCCCCCCCCC.."
    ]
  },
  mug: {
    nameKo: "고양이 귀 우유컵",
    nameEn: "Cat-ear milk cup",
    rows: ["C....C", "CLCCLC", "CWWWWC", "CWOWWC", "CWWWWC", ".CCCC."]
  },
  ornament: {
    nameKo: "보리 새싹 화분",
    nameEn: "Cat grass planter",
    rows: ["G.G.G.G", ".GGGGG.", "..GGG..", "CYYYYYC", "COONNOC", ".CCCCC."]
  },
  lamp: {
    nameKo: "고양이 타워 조명",
    nameEn: "Cat tower lamp",
    rows: ["..A..", ".AAAC", "AAAAA", ".CCC.", "..N..", "CNNNC", "..N..", "..N..", "CCNCC", "..N..", ".CNC.", "CCCCC"]
  },
  mat: {
    nameKo: "삼색 발바닥 매트",
    nameEn: "Calico paw mat",
    rows: ["OOCACCOO", "COOOOACC", "CCCCCCCC"]
  },
  shelf: {
    nameKo: "굴러가는 털실",
    nameEn: "Rolling yarn ball",
    rows: [".OOO.", "ONONO", "OONOO", ".OOO."]
  },
  frame: {
    nameKo: "삼색냥이 초상화",
    nameEn: "Calico portrait",
    rows: ["IIIIII", "IOKKCI", "IOOWOI", "IOWWCI", "IOAOWI", "INOONI", "IIIIII"]
  },
  clock: {
    nameKo: "고양이 얼굴 시계",
    nameEn: "Cat-face wall clock",
    rows: ["C..C", "CCCC", "CAAC", ".CC."]
  },
  pet: {
    nameKo: "둥근얼굴 삼색고양이",
    nameEn: "Round-face calico cat",
    rows: ["I.C...", "CCCC..", "CWCW..", "COAO..", "COOC.C", "COCCCC", ".C..C.", "..C..."]
  },
  floorObject: {
    nameKo: "숨숨 골판지 상자",
    nameEn: "Hideaway cardboard box",
    rows: ["NN..NN", ".N..N.", "NNNNNN", "NYYYYN", "NYYYYN", "NYYYYN", "NNNNNN", ".CCCC."]
  }
};

const AQUARIUM_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "가오리 수조 벽지",
    nameEn: "Manta tank wallpaper",
    rows: compose(64, 31, "E", [
      { x: 0, y: 0, rows: ["T".repeat(64)] },
      { x: 0, y: 27, rows: ["B".repeat(64), "B".repeat(64), "Y".repeat(64), "C".repeat(64)] },
      { x: 7, y: 5, rows: ["....BBBB....", ".BBBBBBBBBB.", "BBBWBBBBWBBB", "...B....B..."] },
      { x: 35, y: 8, rows: ["BB....Y", "BBBBYYY", "BB....Y"] },
      { x: 50, y: 15, rows: ["Y...BB", "YYYBBBB", "Y...BB"] },
      { x: 23, y: 3, rows: [".W.", "...", ".W.", "...", ".W."] },
      { x: 58, y: 4, rows: [".W.", "...", ".W.", "...", ".W.", "...", ".W."] },
      { x: 3, y: 22, rows: ["G...G", "GG.GG", ".GGG.", "..G..", "..G.."] },
      { x: 43, y: 23, rows: ["R.R.R", ".RRR.", "RRRRR", ".R.R."] }
    ])
  },
  flooring: {
    nameKo: "수족관 청록 타일",
    nameEn: "Aquarium teal tiles",
    rows: compose(64, 9, "T", [
      { x: 0, y: 0, rows: ["L".repeat(64)] },
      { x: 0, y: 3, rows: ["B".repeat(64)] },
      { x: 0, y: 6, rows: ["B".repeat(64)] },
      { x: 12, y: 1, rows: ["B", "B"] },
      { x: 31, y: 4, rows: ["B", "B"] },
      { x: 49, y: 7, rows: ["B"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  },
  window: {
    nameKo: "해저터널 전망창",
    nameEn: "Ocean tunnel window",
    rows: [
      "....CCCCCCCC....",
      "..CCBBBBBBBBCC..",
      ".CBBBTBBBBTBBBC.",
      "CBBBBBBBBBBBBBBC",
      "CBBYBBBBBBBBYBBC",
      "CYYYYBBBBYYYYBBC",
      "CBBYBBBBBBBBYBBC",
      "CBBBBBBBBBBBBBBC",
      ".CBBBBBBBBBBBBC.",
      "..CCBBBBBBBBCC..",
      "....CCCCCCCC....",
      "......CCCC......"
    ]
  },
  desk: {
    nameKo: "파도 곡선 안내데스크",
    nameEn: "Wave reception desk",
    rows: compose(56, 8, ".", [
      { x: 0, y: 0, rows: ["T".repeat(56)] },
      { x: 2, y: 1, rows: ["I".repeat(51) + "C"] },
      { x: 5, y: 2, rows: ["T".repeat(46) + "CC"] },
      { x: 9, y: 3, rows: ["I".repeat(37) + "CCC"] },
      { x: 12, y: 4, rows: ["C".repeat(32)] },
      { x: 7, y: 5, rows: ["INI", "INI", "INI"] },
      { x: 45, y: 5, rows: ["INI", "INI", "INI"] }
    ])
  },
  monitor: {
    nameKo: "해파리 관찰 스크린",
    nameEn: "Jellyfish observation screen",
    rows: [
      ".CCCCCCCCCCCC.",
      "CBBBBBBBBBBBBC",
      "CBBBBTTBBBBBBC",
      "CBBBTTTTBBBBBC",
      "CBBTWWWTBBBBBC",
      "CBBBTTTBBBBBBC",
      "CBBBTBTBBBBBBC",
      ".CCCCCCCCCCCC.",
      ".....CNC......",
      "...CCCCCCCC..."
    ]
  },
  mug: {
    nameKo: "복어 손잡이 컵",
    nameEn: "Pufferfish handle cup",
    rows: [".YYYY.", "YBWBYY", "YBYBYC", "YBBBBY", ".YYYYC", "..CCC."]
  },
  ornament: {
    nameKo: "해마 유리병",
    nameEn: "Seahorse jar",
    rows: ["..CCC..", ".CBBBC.", ".CBYBC.", ".CBBYC.", ".CBYBC.", ".CBBBC.", "..CCC..", ".CCCCC."]
  },
  lamp: {
    nameKo: "기포 기둥 조명",
    nameEn: "Bubble column lamp",
    rows: [".CCC.", "CBBBC", "CBWBC", "CBBBC", "CBBBC", "CBWBC", "CBBBC", "CBBBC", "CBWBC", "CBBBC", ".CCC.", "CCCCC"]
  },
  mat: {
    nameKo: "출렁 파도 매트",
    nameEn: "Rolling wave mat",
    rows: ["EIEEIEEI", "AEEIEEIE", "NNNNNNNN"]
  },
  shelf: {
    nameKo: "흰동가리 장식",
    nameEn: "Clownfish ornament",
    rows: ["....Y", ".OOOY", "OOAOO", ".OOOY"]
  },
  frame: {
    nameKo: "가오리 포스터",
    nameEn: "Manta ray poster",
    rows: ["CCCCCC", "CBBBB C".replace(" ", ""), "CBBTBC", "CTTTTC", "CBT TBC".replace(" ", ""), "CBBBB C".replace(" ", ""), "CCCCCC"]
  },
  clock: {
    nameKo: "잠수정 원형 시계",
    nameEn: "Submarine round clock",
    rows: [".CC.", "CTTC", "CTAC", ".CC."]
  },
  pet: {
    nameKo: "아기 펭귄",
    nameEn: "Baby penguin",
    rows: ["..MM..", ".MCCM.", "MCWCWM", "MCAACM", "MCCCCM", "MMWWMM", ".MWWM.", ".M..M."]
  },
  floorObject: {
    nameKo: "투명 잠수 헬멧",
    nameEn: "Clear diving helmet",
    rows: ["..CC..", ".CWWC.", "CBBBBC", "CBWWBC", "CBBBBC", ".CCCC.", "IYYYYI", "CCCCCC"]
  }
};

const UNDERSEA_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "심해 난파선 벽지",
    nameEn: "Deep wreck wallpaper",
    rows: compose(64, 31, "T", [
      { x: 0, y: 0, rows: ["I".repeat(64)] },
      { x: 0, y: 25, rows: ["B".repeat(64), "B".repeat(64), "I".repeat(64), "I".repeat(64), "C".repeat(64), "C".repeat(64)] },
      { x: 5, y: 14, rows: ["CCCCCCCCCCCCCC", ".CIIIIIIIIIIIC.", "..CCCCCCCCCC..", ".....C..C.....", ".....C..C....."] },
      { x: 39, y: 6, rows: ["...A...", "..AAA..", "AAAACCC", "..AAA..", "...A..."] },
      { x: 46, y: 8, rows: ["....W", "...W.", "..W..", ".W...", "W...."] },
      { x: 24, y: 20, rows: ["G...G", "GG.GG", ".GGG.", "..G..", "..G..", "..G.."] },
      { x: 55, y: 21, rows: ["R.R.R", ".RRR.", "RRRRR", ".R.R."] }
    ])
  },
  flooring: {
    nameKo: "심해 모래와 산호 바닥",
    nameEn: "Abyss sand and coral floor",
    rows: compose(64, 9, "Y", [
      { x: 0, y: 0, rows: ["W".repeat(64)] },
      { x: 7, y: 2, rows: ["III", ".I.", "III"] },
      { x: 28, y: 4, rows: ["RRR", "R.R"] },
      { x: 52, y: 1, rows: ["GGG", ".G.", ".G."] },
      { x: 0, y: 8, rows: ["I".repeat(64)] }
    ])
  },
  window: {
    nameKo: "잠수함 문어 창",
    nameEn: "Submarine octopus port",
    rows: [
      "....CCCCCCCC....",
      "..CCIIIIIIIICC..",
      ".CIITTTTTTTTIIC.",
      "CITTTTRRTTTTTTIC",
      "CITTTRRRRTTTTTIC",
      "CITTRWRWRTTTTTIC",
      "CITTTRRRTTTTTTIC",
      "CITTRTRTRTTTTTIC",
      ".CIITITITTTTIIC.",
      "..CCIIIIIIIICC..",
      "....CCCCCCCC....",
      "......IIII......"
    ]
  },
  desk: {
    nameKo: "가라앉은 신전 책상",
    nameEn: "Sunken temple desk",
    rows: compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["I".repeat(54)] },
      { x: 3, y: 1, rows: ["T".repeat(50)] },
      { x: 5, y: 2, rows: ["C".repeat(46)] },
      { x: 8, y: 3, rows: ["EIE", "EIE", "EIE", "EIE", "EEE"] },
      { x: 44, y: 3, rows: ["EIE", "EIE", "EIE", "EIE", "EEE"] },
      { x: 19, y: 4, rows: ["G..G..G", "GGGGGGG", ".G.G.G."] }
    ])
  },
  monitor: {
    nameKo: "원형 소나 탐지기",
    nameEn: "Circular sonar display",
    rows: [
      "...CCCCCCCC...",
      ".CCIITTTTIICC.",
      "CITTTTTTTTTTIC",
      "CITTTTGTTTTTIC",
      "CITGGGGGTTTTIC",
      "CITTTTGTTTTTIC",
      "CITTTTTTTTTTIC",
      ".CCIITTTTIICC.",
      "...CCCCCCCC...",
      ".....CNN......"
    ]
  },
  mug: {
    nameKo: "소라껍데기 잔",
    nameEn: "Conch shell cup",
    rows: ["..RRR.", ".RYYRR", "RYYRYC", "RYYYYC", ".RYYRC", "..CCC."]
  },
  ornament: {
    nameKo: "심해 산호 정원",
    nameEn: "Deep coral garden",
    rows: ["R..G..R", "RR.G.GG", ".RRGG..", "..RG...", "CYYYYYC", "CIIITIC", ".CCCCC."]
  },
  lamp: {
    nameKo: "초롱아귀 조명",
    nameEn: "Anglerfish lamp",
    rows: ["..A..", "...AC", "..CCC", ".CTTC", "CTWTC", ".CTTC", "..CCC", "...N.", "...N.", "...N.", "..CNC", "CCCCC"]
  },
  mat: {
    nameKo: "흔들리는 다시마 매트",
    nameEn: "Swaying kelp mat",
    rows: ["GTGGTGTG", "TGTTGTTG", "EEEEEEEE"]
  },
  shelf: {
    nameKo: "진주 조개",
    nameEn: "Pearl shell",
    rows: ["R...R", "RRWRR", ".RRR.", "..C.."]
  },
  frame: {
    nameKo: "잃어버린 도시 지도",
    nameEn: "Lost city map",
    rows: ["EEEEEE", "ETTTTE", "ETIIIE", "EICIEE", "EIIITE", "ETTTTE", "EEEEEE"]
  },
  clock: {
    nameKo: "소용돌이 조개 시계",
    nameEn: "Spiral shell clock",
    rows: [".RR.", "RYYR", "RYAR", ".RR."]
  },
  pet: {
    nameKo: "꼬마 해파리",
    nameEn: "Baby jellyfish",
    rows: ["..BB..", ".TTTT.", "TTWTWT", "TTATTT", ".TTTT.", "T.T.T.", ".T.T.T", "T...T."]
  },
  floorObject: {
    nameKo: "침몰한 보물상자",
    nameEn: "Sunken treasure chest",
    rows: ["......", "CCCCCC", "CYYYYC", "CYYYYC", "CCCCCC", "EIIAIE", "EIIAIE", "CCCCCC"]
  }
};

const DREAM_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "새벽 꿈섬 벽지",
    nameEn: "Dawn dream-island wallpaper",
    rows: compose(64, 31, "I", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 48, y: 3, rows: ["..AAA..", ".AAAAA.", "AAAAAAA", ".AAAAA.", "..AAA.."] },
      { x: 6, y: 8, rows: ["..WWWW....", "WWWWWWWW..", ".WWWWWWWWW", "....WWWW.."] },
      { x: 23, y: 16, rows: ["....NNNNNN....", ".NNNNNNNNNNNN.", "NNNNNNNNNNNNNN", "....GGGGGG....", ".....GGGG.....", "......GG......"] },
      { x: 4, y: 23, rows: [".....BBBB...", "..BBBBBBBBB.", "BBBBBBBBBBBB", "....BBBBB..."] },
      { x: 45, y: 21, rows: ["...YYYY...", ".YYYYYYYY.", "YYYYYYYYYY", "....YYY..."] },
      { x: 17, y: 4, rows: ["W", "...", "..W"] },
      { x: 39, y: 10, rows: ["A", "....", "...A"] }
    ])
  },
  flooring: {
    nameKo: "물결 거울 바닥",
    nameEn: "Ripple mirror floor",
    rows: compose(64, 9, "B", [
      { x: 0, y: 0, rows: ["E".repeat(64)] },
      { x: 5, y: 2, rows: ["IIIIIIIIIIII", ".EEEEEEEEEE."] },
      { x: 29, y: 5, rows: ["IIIIIIIIIIIIIIIIII", "..EEEEEEEEEEEEEE.."] },
      { x: 52, y: 2, rows: ["IIIIIIIII", ".EEEEE..."] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  },
  window: {
    nameKo: "초승달 구름 창",
    nameEn: "Crescent cloud window",
    rows: ["....CCCCCCCC....", "..CCIIIIIIIICC..", ".CIIIIAAAAIIIIC.", "CIIIIAAAAAIIIIIC", "CIIIAAAWWWWIIIIC", "CIIIIAWWWWWWIIIC", "CIIIIIIWWWWIIIIC", "CIIIIIIIIIIIIIIC", ".CIIIIIIIIIIIIC.", "..CCIIIIIIIICC..", "....CCCCCCCC....", "......NNNN......"]
  },
  desk: {
    nameKo: "떠다니는 구름 책상",
    nameEn: "Floating cloud desk",
    rows: compose(56, 8, ".", [
      { x: 2, y: 0, rows: [".WWWWWWW......WWWWWWWW........WWWWWWWWWW."] },
      { x: 0, y: 1, rows: ["WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"] },
      { x: 3, y: 2, rows: ["EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"] },
      { x: 8, y: 3, rows: ["CIC", "CIC", "CIC", "CIC", "CIC"] },
      { x: 45, y: 3, rows: ["CIC", "CIC", "CIC", "CIC", "CIC"] }
    ])
  },
  monitor: { nameKo: "꿈 일기 열린책", nameEn: "Open dream journal", rows: ["......CC......", "....CCCCCC....", "CCCCCCCCCCCCCC", "CWWWWCCWWWWWWC", "CWAWWCCWWAWWWC", "CWWBWCCWBWWWWC", "CWWWWCCWWWWWWC", ".CCCC..CCCCCC.", ".....CNN......", "...CCCCCCCC..."] },
  mug: { nameKo: "별잠 우유잔", nameEn: "Star-sleep milk cup", rows: ["..A...", ".AAA..", "CWWWWC", "CWAAWC", "CWWWWC", ".CCCC."] },
  ornament: { nameKo: "병 속 작은 꿈섬", nameEn: "Dream island in a jar", rows: ["..CCC..", ".CIIIC.", ".CIWIC.", ".CWWWC.", ".CNNNC.", ".CGGGC.", "..CCC..", ".CCCCC."] },
  lamp: { nameKo: "반달 스탠드", nameEn: "Half-moon lamp", rows: ["..AA.", ".AA..", "AAA..", ".AA..", "..A..", "..N..", "..N..", "..N..", "..N..", ".CNC.", "CNNNC", "CCCCC"] },
  mat: { nameKo: "잠든 구름 매트", nameEn: "Sleeping cloud mat", rows: [".WWWWWW.", "WWAWWWWW", "CCCCCCCC"] },
  shelf: { nameKo: "열쇠 달린 꿈병", nameEn: "Keyed dream vial", rows: [".CCC.", "CBAAC", ".CCC.", "..N.N"] },
  frame: { nameKo: "거꾸로 비 내리는 그림", nameEn: "Upside-down rain art", rows: ["CCCCCC", "CIIIIC", "CIWIIC", "CWWWWC", "CIBIIC", "CBIBIC", "CCCCCC"] },
  clock: { nameKo: "졸린 달 시계", nameEn: "Sleepy moon clock", rows: [".AA.", "AICA", "AIIA", ".AA."] },
  pet: { nameKo: "베개구름 유령", nameEn: "Pillow-cloud ghost", rows: [".WWWW.", "WWWWWE", "WWIWIW", "WWAWWW", ".WWWW.", "W.W.W.", ".W.W..", "W...W."] },
  floorObject: { nameKo: "별무늬 수면 베개", nameEn: "Star sleep pillow", rows: ["......", ".CCCC.", "CIIAIC", "CIAAIC", "CIIAIC", ".CCCC.", "..NN..", "......"] }
};

const ZOO_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "노을 사바나 벽지",
    nameEn: "Sunset savanna wallpaper",
    rows: compose(64, 31, "Y", [
      { x: 0, y: 0, rows: ["O".repeat(64)] },
      { x: 46, y: 3, rows: ["..AAA..", ".AAAAA.", "AAAAAAA", ".AAAAA.", "..AAA.."] },
      { x: 0, y: 22, rows: ["N".repeat(64), "N".repeat(64), "G".repeat(64), "G".repeat(64), "G".repeat(64), "N".repeat(64), "N".repeat(64), "C".repeat(64), "C".repeat(64)] },
      { x: 7, y: 11, rows: [".....G.....", "....GGG....", "GGGGGGGGGGG", "....NNN....", "....NNN....", "...NNNNN...", "..NN...NN..", ".NN.....NN."] },
      { x: 30, y: 15, rows: ["OOO....", "ONNO...", "OOOOOO.", "OOWWOO.", "OOOO.OO", ".N...N."] },
      { x: 53, y: 16, rows: ["C.C...", "CCCC..", "CWCW..", "CCCCCC", ".N..N."] }
    ])
  },
  flooring: { nameKo: "동물 발자국 흙길", nameEn: "Animal-track dirt floor", rows: compose(64, 9, "N", [{ x: 0, y: 0, rows: ["Y".repeat(64)] }, { x: 9, y: 2, rows: [".C.C.", "..C.."] }, { x: 31, y: 5, rows: [".O.O.", "..O.."] }, { x: 52, y: 2, rows: [".C.C.", "..C.."] }, { x: 0, y: 8, rows: ["C".repeat(64)] }]) },
  window: { nameKo: "사파리 지프 창", nameEn: "Safari jeep window", rows: ["CCCCCCCCCCCCCCCC", "CYYYYYYYYYYYYYYC", "CYYYAAAYYYYYYYYC", "CYYAAAAAYYYYYYYC", "CYYYYYYYYGGGGGYC", "CYYYYYGGGGGGGGYC", "CYYGGGGNNNGGGGYC", "CYYYYYYNNNYYYYYC", "CYYYYYYNNNYYYYYC", "CNNNNNNNNNNNNNNC", "CCCCCCCCCCCCCCCC", "CC..C......C..CC"] },
  desk: { nameKo: "얼룩 사파리 책상", nameEn: "Spotted safari desk", rows: compose(56, 8, ".", [{ x: 1, y: 0, rows: ["C".repeat(54)] }, { x: 2, y: 1, rows: ["Y".repeat(52)] }, { x: 8, y: 2, rows: ["OOO.....CC....OOOO....CC.....OOO"] }, { x: 5, y: 3, rows: ["IOI", "IOI", "IOI", "IOI", "IOI"] }, { x: 48, y: 3, rows: ["IOI", "IOI", "IOI", "IOI", "IOI"] }]) },
  monitor: { nameKo: "동물 발자국 도감", nameEn: "Animal track field guide", rows: ["..CCCCCCCCCC..", ".CYYYYYYYYYC..", ".CYYCYYCYYYC..", ".CYYYCCYYYYC..", ".CYYOOOYYYYC..", ".CYOOWOOYYYC..", ".CYYYOOYYYYC..", "..CCCCCCCCCC..", "....CNNNC.....", "..CCCCCCCCCC.."] },
  mug: { nameKo: "기린 목 컵", nameEn: "Giraffe-neck cup", rows: ["...O..", "..O...", "..O.C.", "COYOOC", "COYOYC", ".CCCC."] },
  ornament: { nameKo: "코끼리 물뿌리개", nameEn: "Elephant watering can", rows: [".......", ".CCCCC.", "CWWWWCC", "CWWAWWC", "CWWWWWC", ".CCCCCC", "..C.C.."] },
  lamp: { nameKo: "홍학 스탠드", nameEn: "Flamingo lamp", rows: ["..RR.", ".RWR.", "..RR.", "...R.", "..RR.", ".RR..", ".R...", ".R...", ".R...", ".R...", "C.R.C", "CCCCC"] },
  mat: { nameKo: "얼룩말 줄무늬 매트", nameEn: "Zebra stripe mat", rows: ["IWIWWIWI", "WIWIIWIW", "OOOOOOOO"] },
  shelf: { nameKo: "쌍안경", nameEn: "Safari binoculars", rows: ["C.C.C", "CCCCC", "CWCWC", ".C.C."] },
  frame: { nameKo: "사자 안내 포스터", nameEn: "Lion guide poster", rows: ["CCCCCC", "COOOOC", "CONNOC", "CONWOC", "CONNOC", "COOOOC", "CCCCCC"] },
  clock: { nameKo: "얼룩 기린 시계", nameEn: "Giraffe spot clock", rows: [".II.", "IOIC", "IAIC", ".CC."] },
  pet: { nameKo: "아기 레서판다", nameEn: "Baby red panda", rows: ["R....R", "RCRRCR", "RCWCWR", "RCAARR", ".RRRR.", "RNNNNR", ".R..R.", "R....R"] },
  floorObject: { nameKo: "사파리 탐험가방", nameEn: "Safari explorer bag", rows: ["..CC..", ".C..C.", "CYYYYC", "CYCCYC", "CYAAYC", "INNNNI", "INNNNI", "CCCCCC"] }
};

const SF_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "비대칭 회로도 벽지",
    nameEn: "Asymmetric circuit wall",
    rows: compose(64, 31, "K", [
      { x: 0, y: 0, rows: ["I".repeat(64)] },
      { x: 4, y: 5, rows: ["TTTTTTTTTTTT........", "...........T........", "...........TTTTTTTTT"] },
      { x: 27, y: 3, rows: ["G", "G", "GGGGGGGGGGGGG", "............G", "............G"] },
      { x: 42, y: 14, rows: ["AAAAAAAAAAA", "..........A", ".....AAAAAA", ".....A.....", "AAAAAA....."] },
      { x: 12, y: 19, rows: ["TTTTTTT", "......T", "..GGGGT", "..G....", "..GGGGG"] },
      { x: 8, y: 4, rows: ["W"] },
      { x: 39, y: 3, rows: ["W"] },
      { x: 57, y: 18, rows: ["W"] },
      { x: 0, y: 29, rows: ["E".repeat(64), "E".repeat(64)] }
    ])
  },
  flooring: { nameKo: "광자 격자 바닥", nameEn: "Photon grid floor", rows: compose(64, 9, "I", [{ x: 0, y: 0, rows: ["L".repeat(64)] }, { x: 0, y: 3, rows: ["T".repeat(64)] }, { x: 0, y: 6, rows: ["T".repeat(64)] }, { x: 15, y: 1, rows: ["T", "T"] }, { x: 37, y: 4, rows: ["T", "T"] }, { x: 55, y: 7, rows: ["T"] }, { x: 0, y: 8, rows: ["C".repeat(64)] }]) },
  window: { nameKo: "육각 홀로게이트", nameEn: "Hex holo gate", rows: ["....CCCCCCCC....", "...CCCTTTTCCC...", "..CCTTTTTTTTCC..", ".CCTTTGGGGTTTCC.", "CCTTGGGGGGTTTTCC", "CTTGGAWWAGGTTTTC", "CCTTGGGGGGTTTTCC", ".CCTTTGGGGTTTCC.", "..CCTTTTTTTTCC..", "...CCCTTTTCCC...", "....CCCCCCCC....", "......IIII......"] },
  desk: { nameKo: "쐐기형 제어 콘솔", nameEn: "Wedge control console", rows: compose(56, 8, ".", [{ x: 3, y: 0, rows: ["T".repeat(48)] }, { x: 1, y: 1, rows: ["C".repeat(52)] }, { x: 5, y: 2, rows: ["I".repeat(44)] }, { x: 10, y: 3, rows: ["G...A...G...A...G...A...G"] }, { x: 6, y: 4, rows: ["CIC", "CIC", "CIC", "CIC"] }, { x: 47, y: 4, rows: ["CIC", "CIC", "CIC", "CIC"] }]) },
  monitor: { nameKo: "삼중 파형 스크린", nameEn: "Triple waveform screen", rows: [".CCCCCCCCCCCC.", "CIIIIIIIIIIIIC", "CITTTTTTTTTTIC", "CITGTTTGTTTTIC", "CIGTGGTGTTGTIC", "CITGTTTGTTTTIC", "CITTTTTTTTTTIC", ".CCCCCCCCCCCC.", ".....CIC......", "...CCCCCCCC..."] },
  mug: { nameKo: "냉각액 캔", nameEn: "Coolant can", rows: [".CCCC.", "CTTTTC", "CTGATC", "CTTTTC", "CIIIIC", ".CCCC."] },
  ornament: { nameKo: "정찰 드론", nameEn: "Scout drone", rows: ["C.....C", "CC...CC", ".CTTTC.", "CTWAWTC", ".CTTTC.", "..C.C..", ".I...I."] },
  lamp: { nameKo: "로봇 관절 조명", nameEn: "Robot arm lamp", rows: ["..CCC", ".CTTC", "..CCC", "...C.", "..CC.", ".CC..", ".C...", ".C...", ".C...", ".C...", ".CIC.", "CCCCC"] },
  mat: { nameKo: "회로 기판 매트", nameEn: "Circuit board mat", rows: ["TGTTGTTG", "TTAGTTAT", "IIIIIIII"] },
  shelf: { nameKo: "양자 칩", nameEn: "Quantum chip", rows: ["C.C.C", "CTGTC", "CGAGC", "C.C.C"] },
  frame: { nameKo: "안드로이드 설계도", nameEn: "Android blueprint", rows: ["CCCCCC", "CTTTTC", "CTCCTC", "CTWWTC", "CTCCTC", "CTTTTC", "CCCCCC"] },
  clock: { nameKo: "디지털 펄스 시계", nameEn: "Digital pulse clock", rows: ["CCCC", "CTTC", "CGAC", "CCCC"] },
  pet: { nameKo: "회로 여우로봇", nameEn: "Circuit fox robot", rows: ["C.C.C.", ".CTTI.", "CTWTWC", "CTAGTC", ".TTTT.", "CTGGTC", ".T..T.", "I....I"] },
  floorObject: { nameKo: "고밀도 에너지셀", nameEn: "High-density energy cell", rows: ["..CC..", ".CTTC.", "CTGGTC", "CTGGTC", "CTAGTC", "CIIIIC", "CIIIIC", "CCCCCC"] }
};

const SPACE_ART: ThemeArtPack = {
  wallpaper: {
    nameKo: "토성 궤도 벽지",
    nameEn: "Saturn orbit wallpaper",
    rows: compose(64, 31, "I", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 38, y: 5, rows: [".....YYYY.....", "..YYYYYYYYYY..", "YYYYYAAAAYYYYY", "..YYYYYYYYYY..", ".....YYYY....."] },
      { x: 34, y: 7, rows: ["BBBBBBBBBBBBBBBBBBBBBB"] },
      { x: 5, y: 17, rows: ["....BBBB....", ".BBBBBBBBBB.", "BBBBWWWWBBBB", ".BBBBBBBBBB.", "....BBBB...."] },
      { x: 13, y: 4, rows: ["W"] },
      { x: 29, y: 12, rows: ["A"] },
      { x: 57, y: 17, rows: ["W"] },
      { x: 46, y: 21, rows: ["A"] },
      { x: 0, y: 27, rows: ["B".repeat(64), "B".repeat(64), "C".repeat(64), "C".repeat(64)] }
    ])
  },
  flooring: { nameKo: "달 표면 바닥", nameEn: "Lunar surface floor", rows: compose(64, 9, "L", [{ x: 0, y: 0, rows: ["W".repeat(64)] }, { x: 8, y: 2, rows: [".III.", "IIIII", ".III."] }, { x: 34, y: 5, rows: [".CCC.", "CCCCC"] }, { x: 53, y: 2, rows: [".III.", "IIIII"] }, { x: 0, y: 8, rows: ["I".repeat(64)] }]) },
  window: { nameKo: "우주선 원형 관측창", nameEn: "Spacecraft round viewport", rows: ["....CCCCCCCC....", "..CCBBBBBBBBCC..", ".CBBIIIIIIIIBBC.", "CBBIIIIWIIIIIBBC", "CBIIIIWWWIIIIIBC", "CBIIIWWWWWIIIIBC", "CBIIIIWWWIIIIIBC", "CBBIIIIWIIIIIBBC", ".CBBIIIIIIIIBBC.", "..CCBBBBBBBBCC..", "....CCCCCCCC....", "......BBBB......"] },
  desk: { nameKo: "미션 컨트롤 책상", nameEn: "Mission control desk", rows: compose(56, 8, ".", [{ x: 1, y: 0, rows: ["C".repeat(54)] }, { x: 3, y: 1, rows: ["B".repeat(50)] }, { x: 7, y: 2, rows: ["A..W..A..W..A..W..A..W..A"] }, { x: 5, y: 3, rows: ["EIE", "EIE", "EIE", "EIE", "EIE"] }, { x: 48, y: 3, rows: ["EIE", "EIE", "EIE", "EIE", "EIE"] }]) },
  monitor: { nameKo: "행성 궤도 레이더", nameEn: "Planet orbit radar", rows: ["...CCCCCCCC...", ".CCBBBBBBBBCC.", "CBIIIIIIIIIIBC", "CBIIBBBBIIIIBC", "CBIBWAAWBIIIBC", "CBIIBBBBIIIIBC", "CBIIIIIIIIIIBC", ".CCBBBBBBBBCC.", "...CCCCCCCC...", ".....CAC......"] },
  mug: { nameKo: "로켓 손잡이 컵", nameEn: "Rocket-handle cup", rows: ["..A...", ".AAA.C", "CWWWWC", "CWBAWC", "CWWWWC", ".CCCC."] },
  ornament: { nameKo: "소형 달 탐사차", nameEn: "Mini moon rover", rows: [".......", "..WWW..", ".WAAAW.", "CBBBBBC", "CBBBBBC", ".C.C.C.", "C...C.."] },
  lamp: { nameKo: "발사대 로켓 조명", nameEn: "Launchpad rocket lamp", rows: ["..A..", ".AWA.", "AWWWA", "ABWBA", "ABWBA", ".BBB.", "..C..", ".CIC.", "..C..", "..C..", ".CIC.", "CCCCC"] },
  mat: { nameKo: "태양전지판 매트", nameEn: "Solar panel mat", rows: ["WAWAWAWA", "AWAWAWAW", "CCCCCCCC"] },
  shelf: { nameKo: "접이식 인공위성", nameEn: "Folded satellite", rows: ["B.C.B", "BBCBB", "..A..", "..C.."] },
  frame: { nameKo: "붉은 행성 포스터", nameEn: "Red planet poster", rows: ["CCCCCC", "CIIIIC", "CIRRIC", "CRARRC", "CIRRIC", "CIIIIC", "CCCCCC"] },
  clock: { nameKo: "공전 궤도 시계", nameEn: "Orbit clock", rows: ["B..B", ".AAC", "BAAB", ".CC."] },
  pet: { nameKo: "달토끼 탐사대원", nameEn: "Moon rabbit explorer", rows: ["W....W", "WB..BW", ".WBBW.", "WBBBBW", "WBWBBW", "WBAABW", ".WBBW.", ".B..B."] },
  floorObject: { nameKo: "착륙선 모듈", nameEn: "Lander module", rows: ["..AA..", ".AWWA.", "AWWWWA", "ABBBBA", ".CCCC.", "..EE..", ".E..E.", "I....I"] }
};

const CUSTOM_THEME_ART: Partial<Record<string, ThemeArtPack>> = {
  spring: SPRING_ART,
  winter: WINTER_ART,
  calico: CALICO_ART,
  aquarium: AQUARIUM_ART,
  undersea: UNDERSEA_ART,
  dream: DREAM_ART,
  zoo: ZOO_ART,
  sf: SF_ART,
  space: SPACE_ART,
  ...LATE_THEME_ART_109
};

function item(
  theme: Theme109,
  suffix: string,
  nameKo: string,
  nameEn: string,
  slot: SlotId | SlotId[],
  rows: string[]
): PixelItem {
  return {
    id: `${theme.key}-${suffix}`,
    nameKo: `${theme.labelKo} ${nameKo}`,
    nameEn: `${theme.labelEn} ${nameEn}`,
    slots: Array.isArray(slot) ? slot : [slot],
    frames: { base: rows, active: rows },
    acquire: { type: "gift" },
    themeKey: theme.key,
    addedIn: "1.0.9"
  };
}

function themeItems(theme: Theme109): PixelItem[] {
  const custom = CUSTOM_THEME_ART[theme.key];
  if (custom) {
    return [
      item(theme, "wallpaper", custom.wallpaper.nameKo, custom.wallpaper.nameEn, "wallpaper", custom.wallpaper.rows),
      item(theme, "flooring", custom.flooring.nameKo, custom.flooring.nameEn, "flooring", custom.flooring.rows),
      item(theme, "window", custom.window.nameKo, custom.window.nameEn, "wall-window", custom.window.rows),
      item(theme, "desk", custom.desk.nameKo, custom.desk.nameEn, "furniture-desk", custom.desk.rows),
      item(theme, "monitor", custom.monitor.nameKo, custom.monitor.nameEn, "desk-center", custom.monitor.rows),
      item(theme, "mug", custom.mug.nameKo, custom.mug.nameEn, "desk-left", custom.mug.rows),
      item(theme, "ornament", custom.ornament.nameKo, custom.ornament.nameEn, "desk-right", custom.ornament.rows),
      item(theme, "lamp", custom.lamp.nameKo, custom.lamp.nameEn, "desk-lamp", custom.lamp.rows),
      item(theme, "desk-mat", custom.mat.nameKo, custom.mat.nameEn, "desk-front", custom.mat.rows),
      item(theme, "shelf", custom.shelf.nameKo, custom.shelf.nameEn, ["wall-shelf-a", "wall-shelf-b"], custom.shelf.rows),
      item(theme, "frame", custom.frame.nameKo, custom.frame.nameEn, "wall-frame", custom.frame.rows),
      item(theme, "clock", custom.clock.nameKo, custom.clock.nameEn, "wall-clock", custom.clock.rows),
      {
        ...item(theme, "pet", custom.pet.nameKo, custom.pet.nameEn, "floor-left", custom.pet.rows),
        nameKo: custom.pet.nameKo,
        nameEn: custom.pet.nameEn
      },
      item(theme, "floor-object", custom.floorObject.nameKo, custom.floorObject.nameEn, "floor-right", custom.floorObject.rows)
    ];
  }
  return [
    item(theme, "wallpaper", "벽지", "wallpaper", "wallpaper", wallpaper(theme)),
    item(theme, "flooring", "바닥", "flooring", "flooring", flooring(theme)),
    item(theme, "window", "창문", "window", "wall-window", windowArt(theme)),
    item(theme, "desk", "책상", "desk", "furniture-desk", deskArt(theme)),
    item(theme, "monitor", "모니터", "monitor", "desk-center", monitorArt(theme)),
    item(theme, "mug", "머그", "mug", "desk-left", mugArt(theme)),
    item(theme, "ornament", "장식", "ornament", "desk-right", ornamentArt(theme)),
    item(theme, "lamp", "조명", "lamp", "desk-lamp", lampArt(theme)),
    item(theme, "desk-mat", "데스크 매트", "desk mat", "desk-front", matArt(theme)),
    item(theme, "shelf", "선반 장식", "shelf ornament", ["wall-shelf-a", "wall-shelf-b"], shelfArt(theme)),
    item(theme, "frame", "그림", "wall art", "wall-frame", frameArt(theme)),
    item(theme, "clock", "시계", "clock", "wall-clock", clockArt(theme)),
    {
      ...item(theme, "pet", theme.petNameKo, theme.petNameEn, "floor-left", petArt(theme)),
      nameKo: theme.petNameKo,
      nameEn: theme.petNameEn
    },
    item(theme, "floor-object", "바닥 장식", "floor ornament", "floor-right", floorObjectArt(theme))
  ];
}

export const EXPANSION_THEME_ITEMS_109: PixelItem[] = THEMES.flatMap(themeItems);
