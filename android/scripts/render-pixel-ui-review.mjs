import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DESK_SLOTS,
  ITEM_CATALOG,
  SLOT_RENDER_ORDER
} from "../src/pixel/catalog.ts";
import { ART_H, ART_W } from "../src/pixel/pixelDensity.ts";
import {
  composePixelRuns,
  separatedGlyphRuns
} from "../src/pixel/pixelSeparation.ts";
import { themePaletteFor } from "../src/pixel/themePalettes.ts";

const outputPath = resolve(
  fileURLToPath(new URL("../art/pixel-ui-review.svg", import.meta.url))
);

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const font = "Arial, Apple SD Gothic Neo, Noto Sans KR, sans-serif";
const canvasSoft = "#F7F7F3";
const chrome = "#21242E";
const muted = "#AFC4D8";

function itemById(id) {
  const item = ITEM_CATALOG.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`${id}: 생산 카탈로그에서 찾을 수 없습니다.`);
  return item;
}

function rectsForRuns(runs, originX = 0, originY = 0, scale = 1) {
  return runs
    .map(
      (run) =>
        `<rect x="${originX + run.x * scale}" y="${originY + run.y * scale}" width="${run.w * scale}" height="${(run.h ?? 1) * scale}" fill="${run.color}"/>`
    )
    .join("");
}

function sceneForTheme(themeKey) {
  const themedItems = ITEM_CATALOG.filter(
    (item) => item.themeKey === themeKey && item.id.startsWith(`${themeKey}-`)
  );
  const used = new Set();
  const layers = SLOT_RENDER_ORDER.flatMap((slot) => {
    const item = themedItems.find(
      (candidate) => !used.has(candidate.id) && candidate.slots.includes(slot)
    );
    if (!item) return [];
    used.add(item.id);
    const rows = item.frames.base;
    const box = DESK_SLOTS[slot];
    return [
      {
        id: `${slot}:${item.id}`,
        rows,
        x: box.x,
        y: box.y + Math.max(0, box.maxH - rows.length),
        themeKey: item.themeKey,
        boundaryMode:
          slot === "wallpaper" || slot === "flooring" ? "none" : "adaptive"
      }
    ];
  });

  if (themedItems.length !== 14 || used.size !== 14) {
    throw new Error(
      `${themeKey}: 완성 장면은 14개 아이템이어야 합니다. catalog=${themedItems.length}, rendered=${used.size}`
    );
  }
  return composePixelRuns(ART_W, ART_H, layers);
}

function sceneMarkup({
  themeKey,
  width,
  cardX,
  cardY,
  labelKo,
  labelEn,
  focusItemId,
  focusCopy
}) {
  const palette = themePaletteFor(themeKey);
  if (!palette) throw new Error(`${themeKey}: 테마 팔레트가 없습니다.`);
  const runs = sceneForTheme(themeKey);
  const height = (width * ART_H) / ART_W;
  const sceneX = cardX + 14;
  const sceneY = cardY + 78;
  const focusItem = itemById(focusItemId);
  const focusSlot = focusItem.slots[0];
  const focusBox = DESK_SLOTS[focusSlot];
  const focusRows = focusItem.frames.base;
  const focusY = focusBox.y + Math.max(0, focusBox.maxH - focusRows.length);
  const focusW = Math.max(...focusRows.map((row) => row.length));
  const chips = [
    ["BG", palette.colors.background],
    ["OUT", palette.boundary.outline],
    ["HALO", palette.boundary.halo],
    ["SEP", palette.boundary.separator]
  ]
    .map(
      ([role, color], index) => `<g transform="translate(${cardX + 14 + index * 68} ${cardY + 43})">
        <rect width="12" height="12" fill="${color}" stroke="#FFFFFF" stroke-width="0.75"/>
        <text x="17" y="10" font-family="${font}" font-size="8" fill="#D9E8F5">${role}</text>
      </g>`
    )
    .join("");

  return `<g>
    <rect x="${cardX}" y="${cardY}" width="${width + 28}" height="380" rx="8" fill="#303443" stroke="#6D82A6" stroke-width="2"/>
    <text x="${cardX + 14}" y="${cardY + 27}" font-family="${font}" font-size="18" font-weight="800" fill="#FFFFFF">${escapeXml(labelKo)} · ${escapeXml(labelEn)}</text>
    <text x="${cardX + width + 14}" y="${cardY + 27}" text-anchor="end" font-family="${font}" font-size="11" fill="#C8D8E7">${width}px</text>
    ${chips}
    <rect x="${sceneX - 2}" y="${sceneY - 2}" width="${width + 4}" height="${height + 4}" fill="${canvasSoft}" stroke="#FFFFFF" stroke-width="2"/>
    <svg x="${sceneX}" y="${sceneY}" width="${width}" height="${height}" viewBox="0 0 ${ART_W} ${ART_H}" preserveAspectRatio="none" shape-rendering="crispEdges" style="image-rendering:pixelated">
      <rect width="${ART_W}" height="${ART_H}" fill="${canvasSoft}"/>
      ${rectsForRuns(runs)}
      <rect x="${focusBox.x - 0.5}" y="${focusY - 0.5}" width="${focusW + 1}" height="${focusRows.length + 1}" fill="none" stroke="#FFFFFF" stroke-width="1.25" stroke-dasharray="2 1" vector-effect="non-scaling-stroke"/>
    </svg>
    <text x="${cardX + 14}" y="${sceneY + height + 26}" font-family="${font}" font-size="11" font-weight="700" fill="#FFFFFF">${escapeXml(focusCopy)}</text>
    <text x="${cardX + 14}" y="${sceneY + height + 45}" font-family="${font}" font-size="9" fill="#AFC4D8">320×180 · width / 320 scale · nearest-neighbor</text>
  </g>`;
}

function previewContents(item, box, background) {
  const rows = item.frames.base;
  const width = Math.max(...rows.map((row) => row.length));
  const height = rows.length;
  const rawScale = Math.min(box / width, box / height);
  const scale = rawScale >= 1 ? Math.floor(rawScale) : rawScale;
  const originX = (box - width * scale) / 2;
  const originY = (box - height * scale) / 2;
  return `<rect width="${box}" height="${box}" fill="${background}"/>
    ${rectsForRuns(
      separatedGlyphRuns(rows, item.themeKey, item.id, background),
      originX,
      originY,
      scale
    )}`;
}

function previewCell(item, box, background, x, y, backgroundLabel) {
  const zoom = box * 2;
  const actualX = x + 18;
  const actualY = y + Math.floor((112 - box) / 2);
  const zoomX = x + 92;
  const zoomY = y + Math.floor((112 - zoom) / 2);
  const contents = previewContents(item, box, background);
  return `<g>
    <rect x="${actualX - 1}" y="${actualY - 1}" width="${box + 2}" height="${box + 2}" fill="none" stroke="#7185A8" stroke-width="1"/>
    <svg x="${actualX}" y="${actualY}" width="${box}" height="${box}" viewBox="0 0 ${box} ${box}" preserveAspectRatio="none" shape-rendering="crispEdges" style="image-rendering:pixelated">
      ${contents}
    </svg>
    <svg x="${zoomX}" y="${zoomY}" width="${zoom}" height="${zoom}" viewBox="0 0 ${box} ${box}" preserveAspectRatio="none" shape-rendering="crispEdges" style="image-rendering:pixelated">
      ${contents}
    </svg>
    <text x="${x + 222}" y="${y + 54}" font-family="${font}" font-size="9" fill="#C1D2E1">${escapeXml(backgroundLabel)}</text>
    <text x="${x + 222}" y="${y + 70}" font-family="${font}" font-size="8" fill="#8298B3">${background}</text>
  </g>`;
}

const boardW = 1280;
const boardH = 2012;
const side = 40;
const sceneGap = 18;
const sceneSpecs = [
  {
    themeKey: "music",
    width: 298,
    labelKo: "음악실",
    labelEn: "MUSIC",
    focusItemId: "music-monitor",
    focusCopy: "점선: 파형 모니터 / waveform monitor · C 배경-외곽 분리"
  },
  {
    themeKey: "arcade",
    width: 328,
    labelKo: "오락실",
    labelEn: "ARCADE",
    focusItemId: "arcade-monitor",
    focusCopy: "점선: CRT 모니터 / CRT monitor · 네온 경계 분리"
  },
  {
    themeKey: "library",
    width: 360,
    labelKo: "도서관",
    labelEn: "LIBRARY",
    focusItemId: "library-owl",
    focusCopy: "점선: 부엉이 / owl · 책장 배경과 실루엣 분리"
  }
];
const sceneCardsW =
  sceneSpecs.reduce((sum, scene) => sum + scene.width + 28, 0) +
  sceneGap * (sceneSpecs.length - 1);
let sceneCursorX = (boardW - sceneCardsW) / 2;
const scenePanels = sceneSpecs
  .map((scene) => {
    const markup = sceneMarkup({
      ...scene,
      cardX: sceneCursorX,
      cardY: 140
    });
    sceneCursorX += scene.width + 28 + sceneGap;
    return markup;
  })
  .join("");

const previewItems = [
  {
    id: "music-monitor",
    note: "음악실 동색 외곽 / music same-color edge",
    crossTheme: "arcade"
  },
  {
    id: "arcade-monitor",
    note: "오락실 CRT / arcade CRT",
    crossTheme: "library"
  },
  {
    id: "library-owl",
    note: "부엉이 눈·날개 / owl eyes & wings",
    crossTheme: "music"
  },
  {
    id: "rainy-frog",
    note: "개구리 눈·뒷다리 / frog eyes & hind legs",
    crossTheme: "bakery"
  },
  {
    id: "dog-basic",
    note: "강아지 귀·주둥이 / dog ears & muzzle",
    crossTheme: "undersea"
  },
  {
    id: "cat-basic",
    note: "기본 고양이 / base cat",
    crossTheme: "sf"
  },
  {
    id: "cat-black",
    note: "스토어형 검정냥이 / store black cat",
    crossTheme: "spring"
  },
  {
    id: "cat-chubby",
    note: "뚱냥이 체형 / chubby cat silhouette",
    crossTheme: "night-city"
  },
  {
    id: "hanok-dog",
    note: "삽살개 털·눈 / Sapsali coat & eyes",
    crossTheme: "library"
  }
];

const previewTop = 770;
const rowH = 130;
const labelW = 300;
const columnW = 300;
const previewStartX = side + labelW;
const lightBackground = "#FFF9F0";
const darkBackground = "#0A0915";

const previewRows = previewItems
  .map((entry, index) => {
    const item = itemById(entry.id);
    const rowY = previewTop + index * rowH;
    const crossPalette = themePaletteFor(entry.crossTheme);
    if (!crossPalette) throw new Error(`${entry.crossTheme}: 교차 배경 팔레트가 없습니다.`);
    const cells = [
      previewCell(
        item,
        36,
        lightBackground,
        previewStartX,
        rowY,
        "LIGHT / 밝음"
      ),
      previewCell(
        item,
        44,
        darkBackground,
        previewStartX + columnW,
        rowY,
        "DARK / 어두움"
      ),
      previewCell(
        item,
        56,
        crossPalette.colors.background,
        previewStartX + columnW * 2,
        rowY,
        `${entry.crossTheme.toUpperCase()} BG`
      )
    ].join("");
    return `<g>
      <rect x="${side}" y="${rowY}" width="${boardW - side * 2}" height="${rowH - 8}" rx="5" fill="${index % 2 === 0 ? "#2B2F3C" : "#262A36"}"/>
      <text x="${side + 16}" y="${rowY + 37}" font-family="${font}" font-size="14" font-weight="800" fill="#FFFFFF">${escapeXml(item.nameKo)} · ${escapeXml(item.nameEn)}</text>
      <text x="${side + 16}" y="${rowY + 61}" font-family="${font}" font-size="10" fill="#B8CADD">${escapeXml(entry.note)}</text>
      <text x="${side + 16}" y="${rowY + 86}" font-family="${font}" font-size="9" fill="#7F95B0">${escapeXml(item.id)} · ${item.frames.base[0].length}×${item.frames.base.length}</text>
      ${cells}
    </g>`;
  })
  .join("");

const columnHeaders = [
  ["36 px", "슬롯 선택 / PICKER", "밝은 배경 스트레스"],
  ["44 px", "아이템·도감 / CATALOG", "어두운 배경 스트레스"],
  ["56 px", "선물 결과 / GIFT", "타 테마 배경 스트레스"]
]
  .map(
    ([size, context, background], index) => `<g transform="translate(${previewStartX + index * columnW} 656)">
      <rect width="${columnW - 10}" height="94" rx="7" fill="#303443" stroke="#63799D" stroke-width="1.5"/>
      <text x="16" y="28" font-family="${font}" font-size="20" font-weight="800" fill="#FFFFFF">${size}</text>
      <text x="16" y="52" font-family="${font}" font-size="11" font-weight="700" fill="#C8D8E7">${escapeXml(context)}</text>
      <text x="16" y="74" font-family="${font}" font-size="9" fill="#8FA6C0">${escapeXml(background)} · 오른쪽은 2× 확대</text>
    </g>`
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boardW}" height="${boardH}" viewBox="0 0 ${boardW} ${boardH}" shape-rendering="crispEdges" style="image-rendering:pixelated">
  <rect width="${boardW}" height="${boardH}" fill="${chrome}"/>
  <text x="${side}" y="46" font-family="${font}" font-size="28" font-weight="800" fill="#FFFFFF">TEUM PIXEL UI · 실제 크기 가독성 검수</text>
  <text x="${side}" y="78" font-family="${font}" font-size="13" fill="${muted}">ACTUAL-SIZE LEGIBILITY REVIEW · production catalog + palette + adaptive separation</text>

  <text x="${side}" y="118" font-family="${font}" font-size="15" font-weight="800" fill="#FFFFFF">01 · 완성 장면 / COMPLETE SCENES</text>
  ${scenePanels}

  <text x="${side}" y="590" font-family="${font}" font-size="15" font-weight="800" fill="#FFFFFF">02 · 실사용 미리보기 / ACTUAL PREVIEW BOXES</text>
  <text x="${side}" y="620" font-family="${font}" font-size="11" fill="${muted}">왼쪽은 정확한 UI 박스, 오른쪽은 동일 출력을 2× 확대한 루페입니다. 모든 결과는 separatedGlyphRuns를 사용합니다.</text>
  ${columnHeaders}
  ${previewRows}

  <text x="${side}" y="${boardH - 28}" font-family="${font}" font-size="10" fill="#8298B3">Scene: composePixelRuns · Preview: separatedGlyphRuns · 320×180 logical grid · no smoothing / 보간 없음</text>
</svg>`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, svg, "utf8");
console.log(outputPath);
