import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DESK_SLOTS,
  ITEM_CATALOG,
  SLOT_RENDER_ORDER
} from "../src/pixel/catalog.ts";
import { composePixelRuns, separatedGlyphRuns } from "../src/pixel/pixelSeparation.ts";
import { THEME_ITEMS } from "../src/pixel/themeItems.ts";
import { AQUARIUM_UNDERSEA_ARTWORK } from "../src/pixel/themes/aquariumUndersea.ts";
import { CALICO_ARTWORK, EXTRA_CAT_ARTWORK } from "../src/pixel/themes/rivalCalico.ts";
import { CAFE_BAKERY_ARTWORK } from "../src/pixel/themes/cafeBakery.ts";
import { CAMPING_GREENHOUSE_ARTWORK } from "../src/pixel/themes/campingGreenhouse.ts";
import { CHRISTMAS_SKY_ARTWORK } from "../src/pixel/themes/christmasSky.ts";
import { DREAM_ZOO_ARTWORK } from "../src/pixel/themes/dreamZoo.ts";
import { FANTASY_SCHOOL_ARTWORK } from "../src/pixel/themes/fantasySchool.ts";
import { HANOK_NIGHT_CITY_ARTWORK } from "../src/pixel/themes/hanokNightCity.ts";
import { MUSIC_ARCADE_ARTWORK } from "../src/pixel/themes/musicArcade.ts";
import { RAINY_LIBRARY_ARTWORK } from "../src/pixel/themes/rainyLibrary.ts";
import { SF_SPACE_ARTWORK } from "../src/pixel/themes/sfSpace.ts";
import { SPRING_WINTER_ARTWORK } from "../src/pixel/themes/springWinter.ts";
import {
  BASE_PIXEL_COLORS,
  themePaletteFor
} from "../src/pixel/themePalettes.ts";
import { ART_H, ART_W } from "../src/pixel/pixelDensity.ts";

/** 2테마 검수가 끝난 묶음만 순서대로 추가한다. */
const legacyArtwork = (key, prefix, labelKo, labelEn) => ({
  key,
  labelKo,
  labelEn,
  items: THEME_ITEMS.filter((entry) => entry.id.startsWith(prefix)).map((entry) => ({
    id: entry.id,
    nameKo: entry.nameKo,
    nameEn: entry.nameEn,
    slots: entry.slots,
    rows: entry.frames.base,
    limited: false
  })),
  expectedLimited: 0
});
const rivalArtwork = legacyArtwork(
  "rival",
  "cat-",
  "라이벌 · 수상한 보라방",
  "Rival · Mysterious purple room"
);
const summerArtwork = legacyArtwork(
  "summer",
  "summer-",
  "여름 · 바닷바람 피크닉",
  "Summer · Sea-breeze picnic"
);
const autumnArtwork = legacyArtwork(
  "autumn",
  "autumn-",
  "가을 · 단풍 든 오후",
  "Autumn · Maple afternoon"
);
const rawThemeArtwork = [
  ...SPRING_WINTER_ARTWORK,
  rivalArtwork,
  ...CALICO_ARTWORK,
  ...AQUARIUM_UNDERSEA_ARTWORK,
  ...DREAM_ZOO_ARTWORK,
  ...SF_SPACE_ARTWORK,
  ...CHRISTMAS_SKY_ARTWORK,
  ...FANTASY_SCHOOL_ARTWORK,
  ...RAINY_LIBRARY_ARTWORK,
  ...CAFE_BAKERY_ARTWORK,
  ...CAMPING_GREENHOUSE_ARTWORK,
  ...MUSIC_ARCADE_ARTWORK,
  ...HANOK_NIGHT_CITY_ARTWORK,
  summerArtwork,
  autumnArtwork
];
const productionById = new Map(ITEM_CATALOG.map((item) => [item.id, item]));

/** 검수판도 앱과 동일한 생산 카탈로그의 정확한 id·슬롯·도트맵을 사용한다. */
const productionItem = (artItem) => {
  const item = productionById.get(artItem.id);
  if (!item) throw new Error(`${artItem.id}: 생산 카탈로그에서 찾을 수 없습니다.`);
  return {
    ...artItem,
    nameKo: item.nameKo,
    nameEn: item.nameEn,
    slots: item.slots,
    rows: item.frames.base,
    themeKey: item.themeKey
  };
};

const themeArtwork = rawThemeArtwork.map((theme) => ({
  ...theme,
  items: theme.items.map(productionItem)
}));

const palette = BASE_PIXEL_COLORS;

const requestedKeys = (process.argv[2] ?? "spring,winter").split(",");
const themes = requestedKeys.map((key) => themeArtwork.find((theme) => theme.key === key));
if (themes.some((theme) => !theme)) {
  throw new Error(`알 수 없는 테마: ${requestedKeys.filter((_, index) => !themes[index]).join(", ")}`);
}
if (themes.length !== 2) throw new Error("비교 이미지는 정확히 두 테마를 지정해야 합니다.");

const defaultOutput = fileURLToPath(
  new URL(`../art/theme-pairs/01-${requestedKeys.join("-")}.svg`, import.meta.url)
);
const outputPath = resolve(process.argv[3] ?? defaultOutput);

const errors = [];
const ids = new Set();
for (const theme of themes) {
  if (theme.items.length !== 14) errors.push(`${theme.key}: 아이템이 ${theme.items.length}개입니다.`);
  const limitedCount = theme.items.filter((item) => item.limited).length;
  const expectedLimited = theme.expectedLimited ?? 3;
  if (limitedCount !== expectedLimited) {
    errors.push(`${theme.key}: 기간 한정 아이템이 ${limitedCount}개입니다. 예상 ${expectedLimited}개`);
  }
  for (const item of theme.items) {
    if (ids.has(item.id)) errors.push(`${item.id}: id가 중복됩니다.`);
    ids.add(item.id);
    const widths = new Set(item.rows.map((row) => row.length));
    if (widths.size !== 1) errors.push(`${item.id}: 행 너비가 일정하지 않습니다.`);
    const width = Math.max(...item.rows.map((row) => row.length));
    for (const slot of item.slots) {
      const box = DESK_SLOTS[slot];
      if (!box) {
        errors.push(`${item.id}: 알 수 없는 슬롯 ${slot}`);
        continue;
      }
      if (width > box.maxW || item.rows.length > box.maxH) {
        errors.push(`${item.id}: ${width}×${item.rows.length}, ${slot} 최대 ${box.maxW}×${box.maxH}`);
      }
    }
    for (const row of item.rows) {
      for (const token of row) {
        if (token !== "." && !palette[token]) errors.push(`${item.id}: 알 수 없는 색상 ${token}`);
      }
    }
  }
}
if (errors.length > 0) throw new Error(`테마 도트 검증 실패\n${errors.join("\n")}`);

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const rectsForRuns = (runs, originX, originY, scale) =>
  runs
    .map(
      (run) =>
        `<rect x="${originX + run.x * scale}" y="${originY + run.y * scale}" width="${run.w * scale}" height="${(run.h ?? 1) * scale}" fill="${run.color}"/>`
    )
    .join("");

const pixelsForItem = (item, originX, originY, scale, backgroundColor) => {
  const structural = item.slots.some((slot) => slot === "wallpaper" || slot === "flooring");
  const runs = structural
    ? composePixelRuns(item.rows[0].length, item.rows.length, [
        {
          id: item.id,
          rows: item.rows,
          x: 0,
          y: 0,
          themeKey: item.themeKey,
          boundaryMode: "none"
        }
      ])
    : separatedGlyphRuns(item.rows, item.themeKey, item.id, backgroundColor);
  return rectsForRuns(
    runs,
    originX,
    originY,
    scale
  );
};

const boardW = 1800;
const sidePad = 44;
const gutter = 32;
const panelW = (boardW - sidePad * 2 - gutter) / 2;
const titleH = 90;
// 320×180 장면을 패널 안에서 정확한 정수 배율로 보여 준다.
const sceneScale = 2;
const sceneW = ART_W * sceneScale;
const sceneH = ART_H * sceneScale;
const sceneTop = titleH + 82;
const itemTop = sceneTop + sceneH + 58;
const itemColumns = 7;
const cardGap = 10;
const cardW = (panelW - 28 * 2 - cardGap * (itemColumns - 1)) / itemColumns;
const cardH = 154;
const extraItems = requestedKeys.includes("calico")
  ? EXTRA_CAT_ARTWORK.map(productionItem)
  : [];
const extraColumns = 8;
const extraRows = Math.ceil(extraItems.length / extraColumns);
const extraH = extraItems.length > 0 ? 56 + extraRows * 152 : 0;
const boardH = itemTop + cardH * 2 + cardGap + 42 + extraH;

const themePanels = themes.map((theme, themeIndex) => {
  const panelX = sidePad + themeIndex * (panelW + gutter);
  const sceneX = panelX + Math.floor((panelW - sceneW) / 2);
  const themePalette = themePaletteFor(theme.key);
  const swatchEntries = themePalette
    ? [
        ["BG", themePalette.colors.background],
        ["PR", themePalette.colors.primary],
        ["SC", themePalette.colors.secondary],
        ["AC", themePalette.colors.accent],
        ["OL", themePalette.boundary.outline],
        ["HL", themePalette.boundary.halo],
        ["SP", themePalette.boundary.separator]
      ]
    : [];
  const swatches = themePalette
    ? swatchEntries
        .map(([label, color], index) => {
          const x = panelX + 28 + index * 112;
          const y = titleH + 52;
          return `<rect x="${x}" y="${y}" width="14" height="14" fill="${color}" stroke="#ffffff" stroke-width="1"/>
            <text x="${x + 20}" y="${y + 12}" font-family="Arial, sans-serif" font-size="9" fill="#d7e9ff">${label} ${color}</text>`;
        })
        .join("")
    : "";
  const used = new Set();
  const sceneLayers = SLOT_RENDER_ORDER.flatMap((slot) => {
    const box = DESK_SLOTS[slot];
    const artItem = theme.items.find((candidate) => candidate.slots.includes(slot));
    if (!artItem || used.has(artItem.id)) return [];
    used.add(artItem.id);
    const yOffset = Math.max(0, box.maxH - artItem.rows.length);
    return [
      {
        id: `${slot}:${artItem.id}`,
        rows: artItem.rows,
        x: box.x,
        y: box.y + yOffset,
        themeKey: artItem.themeKey,
        boundaryMode: slot === "wallpaper" || slot === "flooring" ? "none" : "adaptive"
      }
    ];
  });
  const scenePixels = rectsForRuns(
    composePixelRuns(ART_W, ART_H, sceneLayers),
    sceneX,
    sceneTop,
    sceneScale
  );

  const cards = theme.items
    .map((artItem, index) => {
      const column = index % itemColumns;
      const row = Math.floor(index / itemColumns);
      const x = panelX + 28 + column * (cardW + cardGap);
      const y = itemTop + row * (cardH + cardGap);
      const artW = Math.max(...artItem.rows.map((line) => line.length));
      const artH = artItem.rows.length;
      const rawScale = Math.min((cardW - 18) / artW, 84 / artH);
      const scale = rawScale >= 1 ? Math.min(8, Math.floor(rawScale)) : rawScale;
      const drawW = artW * scale;
      const drawH = artH * scale;
      const artX = x + Math.floor((cardW - drawW) / 2);
      const artY = y + 10 + Math.floor((86 - drawH) / 2);
      const previewBackground = themePalette?.colors.background ?? "#9fbee7";
      return `
        <g>
          <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="2" fill="#f7f7f3" stroke="#60619c" stroke-width="2"/>
          <rect x="${x + 6}" y="${y + 6}" width="${cardW - 12}" height="90" fill="${previewBackground}"/>
          ${pixelsForItem(artItem, artX, artY, scale, previewBackground)}
          ${artItem.limited ? `<rect x="${x + cardW - 27}" y="${y + 9}" width="18" height="18" fill="#ecab37"/><text x="${x + cardW - 18}" y="${y + 23}" text-anchor="middle" font-size="14" font-weight="800" fill="#21242e">★</text>` : ""}
          <text x="${x + 7}" y="${y + 116}" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#21242e">${escapeXml(artItem.nameKo)}</text>
          <text x="${x + 7}" y="${y + 137}" font-family="Arial, sans-serif" font-size="9" fill="#60619c">${escapeXml(artItem.id)}</text>
        </g>`;
    })
    .join("");

  return `
    <g>
      <rect x="${panelX}" y="${titleH}" width="${panelW}" height="${boardH - titleH - 22}" fill="#303443" stroke="#8ba1d4" stroke-width="3"/>
      <text x="${panelX + 28}" y="${titleH + 38}" font-family="Arial, sans-serif" font-size="25" font-weight="800" fill="#ffffff">${escapeXml(theme.labelKo)}</text>
      <text x="${panelX + panelW - 28}" y="${titleH + 38}" text-anchor="end" font-family="Arial, sans-serif" font-size="13" fill="#d7e9ff">14 ITEMS · ★ ${theme.expectedLimited ?? 3} LIMITED</text>
      ${swatches}
      <rect x="${sceneX - 3}" y="${sceneTop - 3}" width="${sceneW + 6}" height="${sceneH + 6}" fill="#dedede" stroke="#d7e9ff" stroke-width="3"/>
      ${scenePixels}
      ${cards}
    </g>`;
}).join("");

const extraTop = itemTop + cardH * 2 + cardGap + 24;
const extraCardW = 150;
const extraCardGap = 14;
const extraStartX =
  (boardW - (extraCardW * extraColumns + extraCardGap * (extraColumns - 1))) / 2;
const extraPanel = extraItems.length === 0
  ? ""
  : `<g>
      <text x="${sidePad}" y="${extraTop + 24}" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">추가 고양이 펫 ${extraItems.length}종 · EXTRA CAT FRIENDS</text>
      ${extraItems.map((artItem, index) => {
        const x = extraStartX + (index % extraColumns) * (extraCardW + extraCardGap);
        const y = extraTop + 42 + Math.floor(index / extraColumns) * 152;
        const artW = Math.max(...artItem.rows.map((line) => line.length));
        const artH = artItem.rows.length;
        const rawScale = Math.min((extraCardW - 20) / artW, 82 / artH);
        const scale = rawScale >= 1 ? Math.min(10, Math.floor(rawScale)) : rawScale;
        const artX = x + Math.floor((extraCardW - artW * scale) / 2);
        const artY = y + 8 + Math.floor((86 - artH * scale) / 2);
        const previewBackground =
          themePaletteFor(artItem.themeKey)?.colors.background ?? "#9fbee7";
        return `<g>
          <rect x="${x}" y="${y}" width="${extraCardW}" height="138" fill="#f7f7f3" stroke="#8ba1d4" stroke-width="2"/>
          <rect x="${x + 6}" y="${y + 6}" width="${extraCardW - 12}" height="90" fill="${previewBackground}"/>
          ${pixelsForItem(artItem, artX, artY, scale, previewBackground)}
          <text x="${x + 8}" y="${y + 116}" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#21242e">${escapeXml(artItem.nameKo)}</text>
          <text x="${x + 8}" y="${y + 132}" font-family="Arial, sans-serif" font-size="9" fill="#60619c">${escapeXml(artItem.id)}</text>
        </g>`;
      }).join("")}
    </g>`;

const pairNumber = basename(outputPath).match(/^(\d+)/)?.[1] ?? "01";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boardW}" height="${boardH}" viewBox="0 0 ${boardW} ${boardH}" shape-rendering="crispEdges">
  <rect width="100%" height="100%" fill="#21242e"/>
  <text x="${sidePad}" y="48" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="#ffffff">TEUM PIXEL DESK · THEME PAIR ${pairNumber}</text>
  <text x="${boardW - sidePad}" y="48" text-anchor="end" font-family="Arial, sans-serif" font-size="15" fill="#c0d5e6">actual 320×180 scene render · no interpolation</text>
  ${themePanels}
  ${extraPanel}
</svg>`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, svg, "utf8");
console.log(outputPath);
