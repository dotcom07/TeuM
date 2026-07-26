import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ITEM_CATALOG } from "../src/pixel/catalog.ts";
import { separatedGlyphRuns } from "../src/pixel/pixelSeparation.ts";
import { themePaletteFor } from "../src/pixel/themePalettes.ts";

const DEFAULT_PREVIEW_BACKGROUND = "#9fbee7";

const EXTRA_BREED_IDS = new Set([
  "cat-chubby",
  "cat-cheese",
  "cat-tabby",
  "cat-black",
  "cat-white",
  "cat-calico-loaf",
  "cat-siamese",
  "cat-sleepy",
  "cat-maine-coon",
  "cat-scottish-fold",
  "cat-russian-blue",
  "cat-bengal",
  "cat-persian",
  "cat-munchkin",
  "cat-ragdoll",
  "cat-sphynx"
]);

const pets = ITEM_CATALOG.filter((item) => item.slots.includes("floor-left"));
const isClassicTheme = (item) => item.id.startsWith("classic-theme-");
const isClassicBreed = (item) => item.id === "cat-black" || item.id.startsWith("classic-cat-");
const allGroups = [
  {
    title: "동물·크리처 · SPECIES SILHOUETTES",
    subtitle: "귀·날개·촉수·등껍질·뒷다리를 종마다 다르게 설계",
    items: pets.filter((item) => !item.id.includes("cat") && !EXTRA_BREED_IDS.has(item.id))
  },
  {
    title: "테마 고양이 · THEMED CATS",
    subtitle: "같은 고양이 골격 안에서도 의상·체형·자세를 구분",
    items: pets.filter(
      (item) =>
        item.id.includes("cat") &&
        !EXTRA_BREED_IDS.has(item.id) &&
        !isClassicTheme(item) &&
        !isClassicBreed(item)
    )
  },
  {
    title: "26테마 클래식냥이 · CLASSIC THEME CATS",
    subtitle: "스토어 배포본 골격에 각 방의 주조·보조·강조색과 털무늬 적용",
    items: pets.filter(isClassicTheme)
  },
  {
    title: "기존 품종 바리에이션 · ORIGINAL BREED VARIANTS",
    subtitle: "스토어형 검정냥이를 제외한 기존 체형·자세 원화",
    items: pets.filter((item) => EXTRA_BREED_IDS.has(item.id) && !isClassicBreed(item))
  },
  {
    title: "16품종 클래식냥이 · CLASSIC BREED CATS",
    subtitle: "복원한 검정냥이 + 나머지 15개 품종의 스토어형 털무늬",
    items: pets.filter(isClassicBreed)
  }
];
const classicOnly = process.argv.includes("--classic-only");
const groups = classicOnly ? allGroups.filter((group) => group.title.includes("클래식")) : allGroups;

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const columns = 8;
const cardW = 194;
const cardH = 196;
const gap = 10;
const side = 30;
const headerH = 104;
const sectionHeaderH = 66;
const boardW = side * 2 + columns * cardW + (columns - 1) * gap;

let cursorY = headerH;
const sections = groups.map((group) => {
  const rowCount = Math.ceil(group.items.length / columns);
  const sectionY = cursorY;
  const cardsY = sectionY + sectionHeaderH;
  const cards = group.items
    .map((item, index) => {
      const x = side + (index % columns) * (cardW + gap);
      const y = cardsY + Math.floor(index / columns) * (cardH + gap);
      const rows = item.frames.base;
      const artW = rows[0].length;
      const artH = rows.length;
      const previewW = cardW - 12;
      const previewH = 132;
      const scale = Math.max(
        1,
        Math.min(
          13,
          Math.floor((previewW - 16) / artW),
          Math.floor((previewH - 14) / artH)
        )
      );
      const drawW = artW * scale;
      const drawH = artH * scale;
      const artX = x + Math.floor((cardW - drawW) / 2);
      const artY = y + 6 + Math.floor((previewH - drawH) / 2);
      const previewBg =
        themePaletteFor(item.themeKey)?.colors.background ?? DEFAULT_PREVIEW_BACKGROUND;
      const pixels = separatedGlyphRuns(rows, item.themeKey, item.id, previewBg)
        .map(
          (run) =>
            `<rect x="${artX + run.x * scale}" y="${artY + run.y * scale}" width="${run.w * scale}" height="${scale}" fill="${run.color}"/>`
        )
        .join("");

      return `<g>
        <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="4" fill="#F7F7F3" stroke="#59688D" stroke-width="2"/>
        <rect x="${x + 6}" y="${y + 6}" width="${cardW - 12}" height="132" fill="${previewBg}"/>
        ${pixels}
        <text x="${x + 10}" y="${y + 159}" font-family="Arial, sans-serif" font-size="14" font-weight="800" fill="#21242E">${escapeXml(item.nameKo)}</text>
        <text x="${x + 10}" y="${y + 181}" font-family="Arial, sans-serif" font-size="10" fill="#60619C">${escapeXml(item.id)} · ${artW}×${artH}</text>
      </g>`;
    })
    .join("");

  cursorY = cardsY + rowCount * (cardH + gap) + 24;
  return `<g>
    <text x="${side}" y="${sectionY + 25}" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#FFFFFF">${escapeXml(group.title)}</text>
    <text x="${side}" y="${sectionY + 49}" font-family="Arial, sans-serif" font-size="12" fill="#C0D5E6">${escapeXml(group.subtitle)} · ${group.items.length} PETS</text>
    ${cards}
  </g>`;
}).join("");

const boardH = cursorY + 12;
const petDimensions = [...new Set(pets.map((item) => `${item.frames.base[0].length}×${item.frames.base.length}`))].join(" / ");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boardW}" height="${boardH}" viewBox="0 0 ${boardW} ${boardH}" shape-rendering="crispEdges" style="image-rendering:pixelated">
  <rect width="${boardW}" height="${boardH}" fill="#21242E"/>
  <text x="${side}" y="44" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#FFFFFF">${classicOnly ? "TEUM CLASSIC CAT CATALOG · STORE SILHOUETTE" : "TEUM PIXEL PET CATALOG · PRODUCTION 320×180"}</text>
  <text x="${side}" y="75" font-family="Arial, sans-serif" font-size="14" fill="#C0D5E6">${classicOnly ? `26테마 + 16품종 · ${groups.reduce((sum, group) => sum + group.items.length, 0)} CLASSIC CATS` : `전 펫 고밀도 ${petDimensions} · 실제 테마 배경·적응형 경계 검수 · ${pets.length} TOTAL PETS`}</text>
  ${sections}
</svg>`;

const outputArg = process.argv.slice(2).find((argument) => argument !== "--classic-only");
const outputPath = resolve(
  outputArg ??
    fileURLToPath(
      new URL(
        classicOnly
          ? "../art/classic-cat-catalog-320x180.svg"
          : "../art/pet-catalog-320x180.svg",
        import.meta.url
      )
    )
);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, svg, "utf8");
console.log(outputPath);
