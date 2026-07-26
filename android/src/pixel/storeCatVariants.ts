import type { ThemeArtItem } from "./themeArtwork.ts";
import { themePaletteFor, type ThemePaletteRole } from "./themePalettes.ts";

export interface StoreThemeCatArt extends ThemeArtItem {
  themeKey: string;
}

export interface StoreBreedCatArt extends ThemeArtItem {
  baseBreedId: string;
}

const THEME_META = [
  ["spring", "봄", "Spring"],
  ["winter", "겨울", "Winter"],
  ["rival", "라이벌", "Rival"],
  ["summer", "여름", "Summer"],
  ["autumn", "가을", "Autumn"],
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

function tokenFor(themeKey: string, role: ThemePaletteRole, preferred: readonly string[]): string {
  const palette = themePaletteFor(themeKey);
  if (!palette) throw new Error(`Missing palette for classic cat: ${themeKey}`);
  return (
    preferred.find((token) => palette.tokenRoles[token] === role) ??
    Object.entries(palette.tokenRoles).find(([, tokenRole]) => tokenRole === role)?.[0] ??
    "C"
  );
}

/**
 * 2026-07-24 release 빌드의 소스맵에서 복구한 클래식냥이 원본.
 * 배포본의 짧은 몸·올라간 꼬리 골격을 그대로 유지한다.
 */
function themedClassicRows(themeKey: string): string[] {
  const ink = tokenFor(themeKey, "ink", ["C", "R", "N", "I"]);
  const primary = tokenFor(themeKey, "primary", ["M", "B", "T", "G", "O", "P"]);
  const secondary = tokenFor(themeKey, "secondary", ["P", "V", "Y", "G", "O", "S"]);
  const accent = tokenFor(themeKey, "accent", ["A", "Q", "O", "Y", "S", "R", "G"]);
  const surface = tokenFor(themeKey, "surface", ["W", "E", "H", "L", "K", "Y"]);
  return [
    `${ink}.${ink}....`,
    `${ink}${primary}${primary}${primary}${ink}..`,
    `${ink}${surface}${primary}${surface}${ink}..`,
    `${ink}${primary}${accent}${primary}${ink}..`,
    `${ink}${secondary}${primary}${primary}${ink}..`,
    `${ink}${primary}${primary}${primary}${primary}.${ink}`,
    `${ink}${primary}${secondary}${primary}${primary}${ink}${ink}`,
    `.${ink}...${ink}.`,
    "......."
  ];
}

export const STORE_THEME_CAT_ARTWORK: StoreThemeCatArt[] = THEME_META.map(
  ([themeKey, labelKo, labelEn]) => ({
    id: `classic-theme-${themeKey}-cat`,
    nameKo: `${labelKo} 클래식냥이`,
    nameEn: `Classic ${labelEn} cat`,
    slots: ["floor-left"],
    rows: themedClassicRows(themeKey),
    limited: false,
    themeKey
  })
);

function classicBreedRows({
  body,
  patch,
  eye = "W",
  nose = "A",
  outline = "C"
}: {
  body: string;
  patch: string;
  eye?: string;
  nose?: string;
  outline?: string;
}): string[] {
  return [
    `${outline}.${outline}....`,
    `${outline}${body}${body}${body}${outline}..`,
    `${outline}${eye}${patch}${eye}${outline}..`,
    `${outline}${body}${nose}${body}${outline}..`,
    `${outline}${patch}${body}${body}${outline}..`,
    `${outline}${body}${body}${body}${body}.${outline}`,
    `${outline}${body}${patch}${body}${body}${outline}${outline}`,
    `.${outline}...${outline}.`,
    "......."
  ];
}

function chubbyClassicRows(): string[] {
  const rows = classicBreedRows({ body: "N", patch: "N" });
  rows[4] = "CNNNNC.";
  rows[5] = "CNNNNNC";
  rows[6] = "CNNNNNC";
  rows[7] = ".C.C.C.";
  return rows;
}

function maineCoonClassicRows(): string[] {
  const rows = classicBreedRows({ body: "N", patch: "C" });
  rows[5] = "CNNNNCC";
  rows[6] = "CNNCNCC";
  rows[7] = ".C...CC";
  rows[8] = ".....C.";
  return rows;
}

function foldedClassicRows(): string[] {
  const rows = classicBreedRows({ body: "I", patch: "W" });
  rows[0] = ".C.C...";
  rows[1] = "CCICC..";
  return rows;
}

function persianClassicRows(): string[] {
  const rows = classicBreedRows({ body: "W", patch: "N", eye: "C", nose: "Q" });
  rows[4] = "CWWWWC.";
  rows[5] = "CWWWWWC";
  rows[6] = "CWWWWWC";
  rows[7] = ".C.C.C.";
  return rows;
}

function munchkinClassicRows(): string[] {
  const rows = classicBreedRows({ body: "O", patch: "O" });
  rows[5] = "COOOOOC";
  rows[6] = "COOOOOC";
  rows[7] = ".C...C.";
  return rows;
}

function sphynxClassicRows(): string[] {
  return [
    "C...C..",
    "CC.CC..",
    "CQWQC..",
    ".CANC..",
    ".CNNNC.",
    "CNNNNNC",
    ".C...C.",
    "C.....C",
    "......."
  ];
}

const breed = (
  id: string,
  baseBreedId: string,
  nameKo: string,
  nameEn: string,
  rows: string[]
): StoreBreedCatArt => ({
  id,
  baseBreedId,
  nameKo,
  nameEn,
  slots: ["floor-left"],
  rows,
  limited: false
});

/** 검정 품종은 기존 cat-black이 이미 스토어형이므로 나머지 15개 품종만 추가한다. */
export const STORE_BREED_CAT_ARTWORK: StoreBreedCatArt[] = [
  breed(
    "classic-cat-chubby",
    "cat-chubby",
    "클래식 뚱냥이",
    "Classic chubby cat",
    chubbyClassicRows()
  ),
  breed(
    "classic-cat-cheese",
    "cat-cheese",
    "클래식 치즈냥이",
    "Classic ginger cat",
    classicBreedRows({ body: "O", patch: "W" })
  ),
  breed(
    "classic-cat-tabby",
    "cat-tabby",
    "클래식 고등어냥이",
    "Classic tabby cat",
    classicBreedRows({ body: "I", patch: "C" })
  ),
  breed(
    "classic-cat-white",
    "cat-white",
    "클래식 하얀냥이",
    "Classic white cat",
    classicBreedRows({ body: "W", patch: "W", eye: "C", nose: "Q" })
  ),
  breed(
    "classic-cat-calico",
    "cat-calico-loaf",
    "클래식 삼색냥이",
    "Classic calico cat",
    classicBreedRows({ body: "W", patch: "O", eye: "C" })
  ),
  breed(
    "classic-cat-siamese",
    "cat-siamese",
    "클래식 샴냥이",
    "Classic Siamese cat",
    classicBreedRows({ body: "Y", patch: "N", eye: "A" })
  ),
  breed(
    "classic-cat-sleepy",
    "cat-sleepy",
    "클래식 졸린냥이",
    "Classic sleepy cat",
    classicBreedRows({ body: "W", patch: "W", eye: "C" })
  ),
  breed(
    "classic-cat-maine-coon",
    "cat-maine-coon",
    "클래식 메인쿤",
    "Classic Maine Coon",
    maineCoonClassicRows()
  ),
  breed(
    "classic-cat-scottish-fold",
    "cat-scottish-fold",
    "클래식 스코티시 폴드",
    "Classic Scottish Fold",
    foldedClassicRows()
  ),
  breed(
    "classic-cat-russian-blue",
    "cat-russian-blue",
    "클래식 러시안 블루",
    "Classic Russian Blue",
    classicBreedRows({ body: "G", patch: "W", eye: "A" })
  ),
  breed(
    "classic-cat-bengal",
    "cat-bengal",
    "클래식 벵갈",
    "Classic Bengal",
    classicBreedRows({ body: "O", patch: "C" })
  ),
  breed(
    "classic-cat-persian",
    "cat-persian",
    "클래식 페르시안",
    "Classic Persian",
    persianClassicRows()
  ),
  breed(
    "classic-cat-munchkin",
    "cat-munchkin",
    "클래식 먼치킨",
    "Classic Munchkin",
    munchkinClassicRows()
  ),
  breed(
    "classic-cat-ragdoll",
    "cat-ragdoll",
    "클래식 랙돌",
    "Classic Ragdoll",
    classicBreedRows({ body: "W", patch: "N", eye: "G" })
  ),
  breed(
    "classic-cat-sphynx",
    "cat-sphynx",
    "클래식 스핑크스",
    "Classic Sphynx",
    sphynxClassicRows()
  )
];

export const STORE_CAT_ROWS: Record<string, string[]> = Object.fromEntries(
  [...STORE_THEME_CAT_ARTWORK, ...STORE_BREED_CAT_ARTWORK].map((art) => [art.id, art.rows])
);
