import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { THEME_ITEMS } from "../src/pixel/themeItems.ts";

const outputPath = process.argv[2] ?? fileURLToPath(new URL("../theme-items-preview.svg", import.meta.url));
const sceneOutputPath = outputPath.replace(/\.svg$/i, "-scenes.svg");

const palette = {
  C: "#21242e",
  I: "#3d4f97",
  M: "#60619c",
  P: "#8ba1d4",
  K: "#9fbee7",
  E: "#c0d5e6",
  H: "#d7e9ff",
  W: "#ffffff",
  A: "#ecab37",
  S: "#e2954f",
  T: "#206479",
  L: "#dedede",
  B: "#4c91a6",
  Y: "#e6c77a",
  O: "#c56d3f",
  R: "#8f4438",
  G: "#617b52",
  N: "#86624b"
};

// catalog.ts의 64×40 슬롯 좌표를 미리보기에서도 동일하게 사용한다.
const previewSlots = {
  wallpaper: { x: 0, y: 0, maxW: 64, maxH: 31 },
  flooring: { x: 0, y: 31, maxW: 64, maxH: 9 },
  "wall-window": { x: 5, y: 3, maxW: 16, maxH: 12 },
  "wall-shelf-a": { x: 26, y: 5, maxW: 5, maxH: 4 },
  "wall-shelf-b": { x: 33, y: 5, maxW: 5, maxH: 4 },
  "wall-frame": { x: 44, y: 4, maxW: 6, maxH: 7 },
  "wall-clock": { x: 56, y: 4, maxW: 4, maxH: 4 },
  "furniture-desk": { x: 4, y: 24, maxW: 56, maxH: 8 },
  "desk-left": { x: 12, y: 18, maxW: 6, maxH: 6 },
  "desk-center": { x: 25, y: 14, maxW: 14, maxH: 10 },
  "desk-right": { x: 44, y: 16, maxW: 7, maxH: 8 },
  "desk-lamp": { x: 54, y: 12, maxW: 5, maxH: 12 },
  "desk-front": { x: 19, y: 26, maxW: 8, maxH: 3 },
  "floor-left": { x: 2, y: 24, maxW: 6, maxH: 8 },
  "floor-right": { x: 57, y: 24, maxW: 6, maxH: 8 }
};

const validationErrors = [];
const itemIds = new Set();
for (const item of THEME_ITEMS) {
  if (itemIds.has(item.id)) validationErrors.push(`${item.id}: id가 중복됩니다.`);
  itemIds.add(item.id);

  const rows = item.frames.base;
  const rowWidths = new Set(rows.map((row) => row.length));
  if (rowWidths.size !== 1) validationErrors.push(`${item.id}: 행 너비가 일정하지 않습니다.`);

  for (const slot of item.slots) {
    const box = previewSlots[slot];
    if (!box) {
      validationErrors.push(`${item.id}: 알 수 없는 슬롯 ${slot}`);
      continue;
    }
    const width = Math.max(...rows.map((row) => row.length));
    if (width > box.maxW || rows.length > box.maxH) {
      validationErrors.push(`${item.id}: ${width}×${rows.length}, ${slot} 최대 ${box.maxW}×${box.maxH}`);
    }
  }

  for (const row of rows) {
    for (const token of row) {
      if (token !== "." && !palette[token]) validationErrors.push(`${item.id}: 알 수 없는 색상 ${token}`);
    }
  }
}

if (validationErrors.length > 0) {
  throw new Error(`픽셀 카탈로그 검증 실패\n${validationErrors.join("\n")}`);
}

const columns = 7;
const cellW = 180;
const cellH = 154;
const rows = Math.ceil(THEME_ITEMS.length / columns);
const width = columns * cellW;
const height = rows * cellH;

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const cells = THEME_ITEMS.map((item, index) => {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = column * cellW;
  const y = row * cellH;
  const artW = Math.max(...item.frames.base.map((line) => line.length));
  const artH = item.frames.base.length;
  const scale = Math.max(1, Math.min(12, Math.floor(Math.min(144 / artW, 96 / artH))));
  const drawW = artW * scale;
  const drawH = artH * scale;
  const originX = x + Math.floor((cellW - drawW) / 2);
  const originY = y + 8 + Math.floor((100 - drawH) / 2);

  const pixels = item.frames.base
    .flatMap((line, py) =>
      [...line].map((token, px) => {
        const color = palette[token];
        if (!color) return "";
        return `<rect x="${originX + px * scale}" y="${originY + py * scale}" width="${scale}" height="${scale}" fill="${color}"/>`;
      })
    )
    .join("");

  return `
    <g>
      <rect x="${x + 4}" y="${y + 4}" width="${cellW - 8}" height="${cellH - 8}" fill="#f7f7f3" stroke="#3d4f97" stroke-width="2"/>
      <rect x="${x + 9}" y="${y + 9}" width="${cellW - 18}" height="100" fill="#dedede"/>
      ${pixels}
      <text x="${x + 12}" y="${y + 127}" font-family="Arial" font-size="13" font-weight="700" fill="#21242e">${escapeXml(item.nameKo)}</text>
      <text x="${x + 12}" y="${y + 145}" font-family="Arial" font-size="10" fill="#60619c">${escapeXml(item.id)} · ${artW}×${artH}</text>
    </g>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
  <rect width="100%" height="100%" fill="#21242e"/>
  ${cells}
</svg>`;

await writeFile(outputPath, svg, "utf8");

const sceneScale = 5;
const sceneW = 64 * sceneScale;
const sceneH = 40 * sceneScale;
const sceneGap = 20;
const sceneLabelH = 34;
const sceneThemes = [
  { prefix: "cat-", label: "고양이 테마" },
  { prefix: "summer-", label: "여름 테마" },
  { prefix: "autumn-", label: "가을 테마" }
];

const scenes = sceneThemes.map((theme, index) => {
  const originX = sceneGap + index * (sceneW + sceneGap);
  const originY = sceneLabelH;
  const themeItems = THEME_ITEMS.filter((item) => item.id.startsWith(theme.prefix));
  const used = new Set();
  const pixels = Object.entries(previewSlots).flatMap(([slot, box]) => {
    const item = themeItems.find((candidate) => candidate.slots.includes(slot));
    if (!item || used.has(item.id)) return [];
    used.add(item.id);
    const rows = item.frames.base;
    const yOffset = Math.max(0, box.maxH - rows.length);
    return rows.flatMap((line, py) =>
      [...line].map((token, px) => {
        const color = palette[token];
        if (!color) return "";
        return `<rect x="${originX + (box.x + px) * sceneScale}" y="${originY + (box.y + yOffset + py) * sceneScale}" width="${sceneScale}" height="${sceneScale}" fill="${color}"/>`;
      })
    );
  }).join("");

  return `
    <g>
      <text x="${originX}" y="24" font-family="Arial" font-size="18" font-weight="700" fill="#ffffff">${theme.label}</text>
      <rect x="${originX - 2}" y="${originY - 2}" width="${sceneW + 4}" height="${sceneH + 4}" fill="#dedede" stroke="#d7e9ff" stroke-width="2"/>
      ${pixels}
    </g>`;
}).join("");

const scenesSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sceneGap + sceneThemes.length * (sceneW + sceneGap)}" height="${sceneLabelH + sceneH + sceneGap}" shape-rendering="crispEdges">
  <rect width="100%" height="100%" fill="#21242e"/>
  ${scenes}
</svg>`;

await writeFile(sceneOutputPath, scenesSvg, "utf8");
console.log(`${outputPath}\n${sceneOutputPath}`);
