import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_PLACEMENTS,
  DESK_SLOTS,
  ITEM_CATALOG
} from "../src/pixel/catalog.ts";
import { EXPANSION_THEME_META } from "../src/pixel/themeExpansion109.ts";
import {
  THEME_BACKGROUND_PALETTES,
  THEME_BACKGROUND_TOKEN_COLORS
} from "../src/pixel/themePalette109.ts";

const palette = {
  C: "#21242e", I: "#3d4f97", M: "#60619c", P: "#8ba1d4",
  K: "#9fbee7", E: "#c0d5e6", H: "#d7e9ff", W: "#ffffff",
  A: "#ecab37", S: "#e2954f", T: "#206479", L: "#dedede",
  B: "#4c91a6", Y: "#e6c77a", O: "#c56d3f", R: "#8f4438",
  G: "#617b52", N: "#86624b",
  ...THEME_BACKGROUND_TOKEN_COLORS
};

const argValue = (name) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const appJson = JSON.parse(
  await readFile(new URL("../app.json", import.meta.url), "utf8")
);
const artVersion = argValue("--art-version") ?? appJson.expo.version;
const defaultOutput = fileURLToPath(new URL("../art/review", import.meta.url));
const outputDir = path.resolve(argValue("--output") ?? defaultOutput);
const filePrefix = `teum-${artVersion}`;
await mkdir(outputDir, { recursive: true });

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const artSize = (rows) => ({
  width: Math.max(...rows.map((row) => row.length)),
  height: rows.length
});

const drawPixels = (rows, originX, originY, scale) =>
  rows
    .flatMap((row, y) =>
      [...row].map((token, x) => {
        const color = palette[token];
        return color
          ? `<rect x="${originX + x * scale}" y="${originY + y * scale}" width="${scale}" height="${scale}" fill="${color}"/>`
          : "";
      })
    )
    .join("");

const themeKey = (item) => {
  return item.themeKey ?? "base";
};

const themeDefinitions = [
  { key: "base", ko: "기본", en: "ORIGINAL BASE" },
  { key: "cat", ko: "고양이와 생쥐", en: "CAT & MOUSE" },
  { key: "summer", ko: "여름", en: "SUMMER" },
  { key: "autumn", ko: "가을", en: "AUTUMN" },
  ...EXPANSION_THEME_META.map(([key, ko, en]) => ({
    key,
    ko,
    en: en.toUpperCase()
  }))
];

const allThemes = themeDefinitions.map((theme) => ({
  ...theme,
  items: ITEM_CATALOG.filter((item) => themeKey(item) === theme.key)
}));
const selectedTheme = argValue("--theme");
const themes = selectedTheme
  ? allThemes.filter((theme) => theme.key === selectedTheme)
  : allThemes;

if (selectedTheme && themes.length === 0) {
  throw new Error(`알 수 없는 테마입니다: ${selectedTheme}`);
}

async function save(name, svg) {
  const svgPath = path.join(outputDir, `${filePrefix}-${name}.svg`);
  const pngPath = path.join(outputDir, `${filePrefix}-${name}.png`);
  await writeFile(svgPath, svg.replace(/[ \t]+$/gm, ""), "utf8");
  try {
    execFileSync("rsvg-convert", [svgPath, "-o", pngPath], { stdio: "ignore" });
  } catch {
    console.warn(`rsvg-convert를 찾지 못해 SVG만 생성했습니다: ${svgPath}`);
  }
  return { svgPath, pngPath };
}

function catalogBoard() {
  const columns = 5;
  const cellW = 252;
  const cellH = 182;
  const gap = 12;
  const padding = 28;
  const top = 110;
  const sectionHeader = 56;
  const width = padding * 2 + columns * cellW + (columns - 1) * gap;
  let cursorY = top;

  const sections = themes.map((theme) => {
    const sectionY = cursorY;
    const rowCount = Math.ceil(theme.items.length / columns);
    const cells = theme.items.map((item, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = padding + column * (cellW + gap);
      const y = sectionY + sectionHeader + row * (cellH + gap);
      const rows = item.frames.base;
      const size = artSize(rows);
      const scale = Math.max(
        1,
        Math.min(16, Math.floor(Math.min(204 / size.width, 112 / size.height)))
      );
      const originX = x + Math.floor((cellW - size.width * scale) / 2);
      const originY = y + 10 + Math.floor((118 - size.height * scale) / 2);
      return `
        <g>
          <rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="4" fill="#f7f2e8" stroke="#d7e9ff" stroke-width="3"/>
          <rect x="${x + 8}" y="${y + 8}" width="${cellW - 16}" height="118" fill="#c0d5e6"/>
          ${drawPixels(rows, originX, originY, scale)}
          <text x="${x + 12}" y="${y + 148}" font-family="Arial, sans-serif" font-size="15" font-weight="800" fill="#21242e">${escapeXml(item.nameKo)}</text>
          <text x="${x + 12}" y="${y + 169}" font-family="Arial, sans-serif" font-size="11" fill="#60619c">${escapeXml(item.id)} · ${size.width}×${size.height}</text>
        </g>`;
    }).join("");
    cursorY += sectionHeader + rowCount * cellH + Math.max(0, rowCount - 1) * gap + 34;
    return `
      <g>
        <text x="${padding}" y="${sectionY + 31}" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#ffffff">${escapeXml(theme.ko)} · ${escapeXml(theme.en)} · ${theme.items.length} ITEMS</text>
        ${cells}
      </g>`;
  }).join("");

  const height = cursorY + padding;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
    <rect width="100%" height="100%" fill="#21242e"/>
    <text x="${padding}" y="42" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff">TEUM ${escapeXml(artVersion)} · COMPLETE ART CATALOG</text>
    <text x="${padding}" y="73" font-family="Arial, sans-serif" font-size="16" fill="#c0d5e6">${ITEM_CATALOG.length} ITEMS · 현재 카탈로그 코드에서 직접 생성</text>
    ${sections}
  </svg>`;
}

function themeSceneBoard() {
  const sceneThemes = themes.map((theme) =>
    theme.key === "base"
      ? {
          key: "base",
          ko: "기본 책상",
          itemForSlot: (slot) =>
            ITEM_CATALOG.find((item) => item.id === DEFAULT_PLACEMENTS[slot])
        }
      : {
      key: theme.key,
      ko: theme.ko,
      itemForSlot: (slot) =>
        theme.items.find((item) => item.slots.includes(slot))
        }
  );
  const scale = 7;
  const sceneW = 64 * scale;
  const sceneH = 40 * scale;
  const cardW = sceneW + 32;
  const cardH = sceneH + 78;
  const padding = 28;
  const gap = 24;
  const width = padding * 2 + cardW * 2 + gap;
  const sceneRows = Math.ceil(sceneThemes.length / 2);
  const height = 100 + cardH * sceneRows + gap * Math.max(0, sceneRows - 1) + padding;

  const cards = sceneThemes.map((theme, index) => {
    const x = padding + (index % 2) * (cardW + gap);
    const y = 94 + Math.floor(index / 2) * (cardH + gap);
    const originX = x + 16;
    const originY = y + 54;
    const used = new Set();
    const pixels = Object.entries(DESK_SLOTS).map(([slot, box]) => {
      const item = theme.itemForSlot(slot);
      if (!item || used.has(item.id)) return "";
      used.add(item.id);
      const rows = item.frames.base;
      return drawPixels(
        rows,
        originX + box.x * scale,
        originY + (box.y + Math.max(0, box.maxH - rows.length)) * scale,
        scale
      );
    }).join("");
    return `
      <g>
        <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="5" fill="#f7f2e8" stroke="#d7e9ff" stroke-width="3"/>
        <text x="${x + 16}" y="${y + 34}" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#21242e">${theme.ko}</text>
        <rect x="${originX - 2}" y="${originY - 2}" width="${sceneW + 4}" height="${sceneH + 4}" fill="#9fbee7" stroke="#3d4f97" stroke-width="2"/>
        ${pixels}
      </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
    <rect width="100%" height="100%" fill="#21242e"/>
    <text x="${padding}" y="42" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff">TEUM ${escapeXml(artVersion)} · COMPLETE THEME SCENES</text>
    <text x="${padding}" y="72" font-family="Arial, sans-serif" font-size="16" fill="#c0d5e6">${sceneThemes.map((theme) => theme.ko).join(" + ")}</text>
    ${cards}
  </svg>`;
}

function petBoard() {
  const pets = ITEM_CATALOG.filter(
    (item) =>
      item.slots.includes("floor-left") &&
      (!selectedTheme || themeKey(item) === selectedTheme)
  );
  const cellW = 286;
  const cellH = 300;
  const padding = 28;
  const gap = 14;
  const columns = 6;
  const rows = Math.ceil(pets.length / columns);
  const width = padding * 2 + columns * cellW + (columns - 1) * gap;
  const height = 96 + rows * cellH + Math.max(0, rows - 1) * gap + padding;
  const cells = pets.map((item, index) => {
    const x = padding + (index % columns) * (cellW + gap);
    const y = 96 + Math.floor(index / columns) * (cellH + gap);
    const rows = item.frames.base;
    const size = artSize(rows);
    const scale = Math.min(28, Math.floor(Math.min(220 / size.width, 188 / size.height)));
    const originX = x + Math.floor((cellW - size.width * scale) / 2);
    const originY = y + 12 + Math.floor((200 - size.height * scale) / 2);
    return `
      <g>
        <rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="5" fill="#f7f2e8" stroke="#d7e9ff" stroke-width="3"/>
        <rect x="${x + 10}" y="${y + 10}" width="${cellW - 20}" height="200" fill="#c0d5e6"/>
        ${drawPixels(rows, originX, originY, scale)}
        <text x="${x + 14}" y="${y + 240}" font-family="Arial, sans-serif" font-size="19" font-weight="900" fill="#21242e">${escapeXml(item.nameKo)}</text>
        <text x="${x + 14}" y="${y + 267}" font-family="Arial, sans-serif" font-size="13" fill="#60619c">${escapeXml(item.id)} · ${size.width}×${size.height}</text>
        <text x="${x + 14}" y="${y + 288}" font-family="Arial, sans-serif" font-size="12" fill="#86624b">${
          item.acquire.type === "milestone"
            ? `누적 ${item.acquire.at}회`
            : item.acquire.type === "gift"
              ? "선물상자 또는 선택권"
              : "기본 지급"
        }</text>
      </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
    <rect width="100%" height="100%" fill="#21242e"/>
    <text x="${padding}" y="42" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff">TEUM ${escapeXml(artVersion)} · ALL PETS</text>
    <text x="${padding}" y="72" font-family="Arial, sans-serif" font-size="16" fill="#c0d5e6">floor-left 슬롯 전체 · ${pets.length} PETS</text>
    ${cells}
  </svg>`;
}

function paletteBoard() {
  const entries = Object.entries(THEME_BACKGROUND_PALETTES).filter(
    ([key]) => !selectedTheme || key === selectedTheme
  );
  const columns = 4;
  const cellW = 300;
  const cellH = 136;
  const gap = 14;
  const padding = 28;
  const top = 94;
  const rows = Math.ceil(entries.length / columns);
  const width = padding * 2 + columns * cellW + (columns - 1) * gap;
  const height = top + rows * cellH + Math.max(0, rows - 1) * gap + padding;
  const cells = entries.map(([key, entry], index) => {
    const x = padding + (index % columns) * (cellW + gap);
    const y = top + Math.floor(index / columns) * (cellH + gap);
    const rgb = [
      Number.parseInt(entry.hex.slice(1, 3), 16),
      Number.parseInt(entry.hex.slice(3, 5), 16),
      Number.parseInt(entry.hex.slice(5, 7), 16)
    ];
    const luminance = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 255000;
    const textColor = luminance < 0.48 ? "#ffffff" : "#21242e";
    return `
      <g>
        <rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="5" fill="${entry.hex}" stroke="#d7e9ff" stroke-width="3"/>
        <rect x="${x + 16}" y="${y + 16}" width="34" height="34" fill="#21242e"/>
        <rect x="${x + 58}" y="${y + 16}" width="34" height="34" fill="#ffffff"/>
        <text x="${x + 16}" y="${y + 82}" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="${textColor}">${escapeXml(key)} · ${entry.token}</text>
        <text x="${x + 16}" y="${y + 108}" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="${textColor}">${escapeXml(entry.nameKo)}</text>
        <text x="${x + 190}" y="${y + 108}" font-family="monospace" font-size="15" fill="${textColor}">${entry.hex.toUpperCase()}</text>
      </g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#21242e"/>
    <text x="${padding}" y="42" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff">TEUM ${escapeXml(artVersion)} · THEME BACKGROUND PALETTES</text>
    <text x="${padding}" y="72" font-family="Arial, sans-serif" font-size="16" fill="#c0d5e6">${entries.length} UNIQUE THEME COLORS · 검정/흰색 대비칩 포함</text>
    ${cells}
  </svg>`;
}

const outputs = [
  await save("complete-catalog", catalogBoard()),
  await save("theme-scenes", themeSceneBoard()),
  await save("pets", petBoard()),
  await save("theme-palettes", paletteBoard())
];

console.log(JSON.stringify({
  artVersion,
  totalItems: ITEM_CATALOG.length,
  themes: Object.fromEntries(themes.map((theme) => [theme.key, theme.items.length])),
  pets: ITEM_CATALOG.filter((item) => item.slots.includes("floor-left")).length,
  outputs
}, null, 2));
