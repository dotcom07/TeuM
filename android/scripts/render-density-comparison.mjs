import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CAFE_BAKERY_ARTWORK } from "../src/pixel/themes/cafeBakery.ts";
import { DREAM_ZOO_ARTWORK } from "../src/pixel/themes/dreamZoo.ts";
import { FANTASY_SCHOOL_ARTWORK } from "../src/pixel/themes/fantasySchool.ts";
import { SF_SPACE_ARTWORK } from "../src/pixel/themes/sfSpace.ts";
import { pixelColor, themePaletteFor } from "../src/pixel/themePalettes.ts";

const themes = [
  ...DREAM_ZOO_ARTWORK,
  ...SF_SPACE_ARTWORK,
  ...FANTASY_SCHOOL_ARTWORK,
  CAFE_BAKERY_ARTWORK.find((theme) => theme.key === "cafe")
].filter(Boolean);

const slots = {
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

const roleMarks = {
  i: "ink",
  h: "shadow",
  b: "background",
  u: "surface",
  p: "primary",
  s: "secondary",
  a: "accent"
};

/**
 * 제안 시안의 추가 픽셀.
 * 작은 점을 흩뿌리는 대신 테마별 재질과 기능을 읽히게 하는 디테일만 더한다.
 */
const denseDetails = {
  dream: [
    { x: 10, y: 7, rows: ["u...u", ".u.u.", "..a.."] },
    { x: 31, y: 19, rows: ["p.p.s.s", ".a...a.", "s.s.p.p"] },
    { x: 13, y: 31, rows: ["p..s..a..p..s..a..p..s"] },
    { x: 5, y: 40, rows: ["a...p.......s...a.......p"] }
  ],
  zoo: [
    { x: 3, y: 18, rows: ["h..h....h", ".hhh.....", ".....h.hh"] },
    { x: 12, y: 8, rows: ["a.a...", ".a....", "...a.a"] },
    { x: 35, y: 19, rows: ["p...p", ".s.s.", "..p.."] },
    { x: 8, y: 39, rows: [".s.s....s.s....s.s....s.s"] }
  ],
  sf: [
    { x: 3, y: 5, rows: ["p...s...a", "ppppspppa", "....s...."] },
    { x: 31, y: 18, rows: ["u.p.s.a.u", ".p.s.a.p.", "u.a.p.s.u"] },
    { x: 45, y: 25, rows: ["p..p", ".aa.", "s..s"] },
    { x: 4, y: 39, rows: ["a..p..s..a..p..s..a..p..s"] }
  ],
  space: [
    { x: 3, y: 8, rows: ["u....a", "..u...", "a....u"] },
    { x: 31, y: 18, rows: ["..uau..", ".p...p.", "u..a..u", ".p...p."] },
    { x: 50, y: 7, rows: ["a...u", "..u..", "u...a"] },
    { x: 7, y: 40, rows: ["p...a...p...a...p...a...p"] }
  ],
  fantasy: [
    { x: 3, y: 5, rows: ["p....p", "pp...p", ".p.pp."] },
    { x: 31, y: 18, rows: ["u.a.p.a.u", ".a...a...", "p..u.u..p"] },
    { x: 48, y: 20, rows: ["p.p", ".a.", "p.p"] },
    { x: 6, y: 39, rows: ["p....s..p.....a..s....p"] }
  ],
  school: [
    { x: 4, y: 5, rows: ["a..u...a", ".u.u.u..", "a...u..a"] },
    { x: 31, y: 18, rows: ["a.u...u.a", ".p...p..", "u.a.a.u."] },
    { x: 50, y: 20, rows: [".a.", "u.u", ".p."] },
    { x: 14, y: 31, rows: ["a.....a.....a.....a.....a"] }
  ],
  cafe: [
    { x: 4, y: 5, rows: ["u.u.u.u", ".s.s.s.", "u.u.u.u"] },
    { x: 31, y: 15, rows: [".u..u.", "u..u..", ".u..u.", "..a..."] },
    { x: 31, y: 21, rows: ["a..p..a", ".s..s..", "p..a..p"] },
    { x: 8, y: 39, rows: ["s...p...s...p...s...p...s"] }
  ]
};

const concepts = {
  dream: "열차창 반사 · 꿈일기 필기 · 퀼트 스티치",
  zoo: "지도 경로 · 기린 무늬 · 보드워크 발자국",
  sf: "데이터 배선 · 홀로그램 계기 · 경고등",
  space: "궤도 점선 · 성도 링 · 패널 볼트",
  fantasy: "석재 틈 · 주문서 룬 · 덩굴 끝",
  school: "게시판 핀 · 비커 기포 · 책상 라벨",
  cafe: "타일 줄눈 · 증기 곡선 · 머신 계기"
};

function composeScene(theme) {
  const background = themePaletteFor(theme.key).colors.background;
  const grid = Array.from({ length: 40 }, () => Array(64).fill(background));
  const used = new Set();

  for (const [slot, box] of Object.entries(slots)) {
    const artItem = theme.items.find((candidate) => candidate.slots.includes(slot));
    if (!artItem || used.has(artItem.id)) continue;
    used.add(artItem.id);
    const yOffset = Math.max(0, box.maxH - artItem.rows.length);
    artItem.rows.forEach((row, py) => {
      [...row].forEach((token, px) => {
        if (token === "." || token === " ") return;
        const x = box.x + px;
        const y = box.y + yOffset + py;
        if (x >= 0 && x < 64 && y >= 0 && y < 40) grid[y][x] = pixelColor(token, theme.key);
      });
    });
  }
  return grid;
}

/** 표준 Scale2x 코너 규칙으로 원본 실루엣의 계단을 한 단계 더 잘게 나눈다. */
function scale2x(source) {
  const height = source.length;
  const width = source[0].length;
  const output = Array.from({ length: height * 2 }, () => Array(width * 2));
  const at = (x, y) => source[Math.max(0, Math.min(height - 1, y))][Math.max(0, Math.min(width - 1, x))];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const b = at(x, y - 1);
      const d = at(x - 1, y);
      const e = at(x, y);
      const f = at(x + 1, y);
      const h = at(x, y + 1);
      output[y * 2][x * 2] = d === b && d !== h && b !== f ? d : e;
      output[y * 2][x * 2 + 1] = b === f && b !== d && f !== h ? f : e;
      output[y * 2 + 1][x * 2] = d === h && d !== b && h !== f ? d : e;
      output[y * 2 + 1][x * 2 + 1] = h === f && d !== h && b !== f ? f : e;
    }
  }
  return output;
}

function resizeToDense(source) {
  const doubled = scale2x(source);
  return Array.from({ length: 45 }, (_, y) =>
    Array.from({ length: 72 }, (_, x) => {
      const sourceX = Math.min(127, Math.floor(((x + 0.5) * 128) / 72));
      const sourceY = Math.min(79, Math.floor(((y + 0.5) * 80) / 45));
      return doubled[sourceY][sourceX];
    })
  );
}

function drawDetails(grid, theme) {
  const palette = themePaletteFor(theme.key);
  for (const detail of denseDetails[theme.key] ?? []) {
    detail.rows.forEach((row, py) => {
      [...row].forEach((mark, px) => {
        if (mark === ".") return;
        const x = detail.x + px;
        const y = detail.y + py;
        const role = roleMarks[mark];
        if (role && x >= 0 && x < 72 && y >= 0 && y < 45) grid[y][x] = palette.colors[role];
      });
    });
  }
  return grid;
}

function gridRects(grid, originX, originY, pixelSize) {
  return grid
    .flatMap((row, y) => {
      const runs = [];
      let start = 0;
      while (start < row.length) {
        let end = start + 1;
        while (end < row.length && row[end] === row[start]) end += 1;
        runs.push(
          `<rect x="${originX + start * pixelSize}" y="${originY + y * pixelSize}" width="${(end - start) * pixelSize}" height="${pixelSize}" fill="${row[start]}"/>`
        );
        start = end;
      }
      return runs;
    })
    .join("");
}

const boardW = 1468;
const headerH = 176;
const rowH = 410;
const boardH = headerH + themes.length * rowH + 34;
const currentX = 220;
const proposedX = 832;
const sceneW = 576;
const sceneH = 360;

const panels = themes
  .map((theme, index) => {
    const y = headerH + index * rowH;
    const sceneY = y + 38;
    const current = composeScene(theme);
    const proposed = drawDetails(resizeToDense(current), theme);
    const palette = themePaletteFor(theme.key);
    const conceptLines = concepts[theme.key].split(" · ");

    return `<g>
      <rect x="24" y="${y}" width="${boardW - 48}" height="${rowH - 10}" rx="5" fill="#303443" stroke="#59688D" stroke-width="2"/>
      <text x="44" y="${y + 42}" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#FFFFFF">${palette.labelKo}</text>
      ${conceptLines.map((line, lineIndex) => `<text x="44" y="${y + 72 + lineIndex * 19}" font-family="Arial, sans-serif" font-size="12" fill="#D7E9FF">${line}</text>`).join("")}
      <rect x="44" y="${y + 130}" width="14" height="14" fill="${palette.colors.background}"/>
      <rect x="64" y="${y + 130}" width="14" height="14" fill="${palette.colors.primary}"/>
      <rect x="84" y="${y + 130}" width="14" height="14" fill="${palette.colors.secondary}"/>
      <rect x="104" y="${y + 130}" width="14" height="14" fill="${palette.colors.accent}"/>
      <text x="44" y="${y + 178}" font-family="Arial, sans-serif" font-size="12" fill="#BFD0E3">같은 UI 크기</text>
      <text x="44" y="${y + 199}" font-family="Arial, sans-serif" font-size="12" fill="#BFD0E3">같은 배치·아이템</text>
      <text x="44" y="${y + 220}" font-family="Arial, sans-serif" font-size="12" fill="#BFD0E3">픽셀 밀도만 비교</text>
      <text x="44" y="${y + 275}" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">현재</text>
      <text x="44" y="${y + 296}" font-family="Arial, sans-serif" font-size="12" fill="#BFD0E3">굵고 또렷함</text>
      <text x="44" y="${y + 331}" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#F4C55E">제안</text>
      <text x="44" y="${y + 352}" font-family="Arial, sans-serif" font-size="12" fill="#F1DDB1">곡선·재질 증가</text>
      <rect x="${currentX - 3}" y="${sceneY - 3}" width="${sceneW + 6}" height="${sceneH + 6}" fill="#DEE6ED" stroke="#D7E9FF" stroke-width="3"/>
      ${gridRects(current, currentX, sceneY, 9)}
      <rect x="${proposedX - 3}" y="${sceneY - 3}" width="${sceneW + 6}" height="${sceneH + 6}" fill="#DEE6ED" stroke="#F4C55E" stroke-width="3"/>
      ${gridRects(proposed, proposedX, sceneY, 8)}
    </g>`;
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boardW}" height="${boardH}" viewBox="0 0 ${boardW} ${boardH}" shape-rendering="crispEdges">
  <rect width="${boardW}" height="${boardH}" fill="#21242E"/>
  <text x="28" y="48" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#FFFFFF">PIXEL DENSITY UI COMPARISON · PROTOTYPE</text>
  <text x="28" y="80" font-family="Arial, sans-serif" font-size="15" fill="#C0D5E6">실제 UI 프레임 크기는 유지하고 픽셀만 아주 조금 촘촘하게 배치한 비교 시안 · 프로덕션 데이터 미변경</text>
  <text x="${currentX}" y="128" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#FFFFFF">현재 · 64×40</text>
  <text x="${currentX}" y="153" font-family="Arial, sans-serif" font-size="13" fill="#BFD0E3">픽셀 9px · 2,560칸</text>
  <text x="${proposedX}" y="128" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#F4C55E">중간 시안 · 72×45</text>
  <text x="${proposedX}" y="153" font-family="Arial, sans-serif" font-size="13" fill="#F1DDB1">픽셀 8px · 선형 밀도 +12.5% · 전체 셀 +26.6%</text>
  ${panels}
</svg>`;

const outputPath = resolve(
  process.argv[2] ??
    fileURLToPath(new URL("../art/density-comparison-64-vs-72.svg", import.meta.url))
);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, svg, "utf8");
console.log(outputPath);
