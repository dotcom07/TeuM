import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  DEFAULT_PLACEMENTS,
  DESK_SLOTS,
  ITEM_CATALOG,
  itemById,
  SLOT_RENDER_ORDER
} from "../src/pixel/catalog.ts";
import { ART_H, ART_W } from "../src/pixel/pixelDensity.ts";
import { SCENE_OUTPUT_SCALES } from "../src/pixel/pixelCanvas.ts";
import { composePixelRuns } from "../src/pixel/pixelSeparation.ts";

const themeKey = process.argv[2] ?? "sf";
const scale = Number(process.argv[3] ?? 4);
if (!SCENE_OUTPUT_SCALES.includes(scale)) {
  throw new Error(`scene scale must be ${SCENE_OUTPUT_SCALES.join(" or ")}`);
}

const themed = ITEM_CATALOG.filter((item) => item.themeKey === themeKey);
if (themed.length === 0) throw new Error(`${themeKey}: theme not found`);
const layers = SLOT_RENDER_ORDER.flatMap((slot) => {
  const item =
    themed.find((candidate) => candidate.slots.includes(slot)) ??
    itemById(DEFAULT_PLACEMENTS[slot] ?? "");
  if (!item) return [];
  const rows = item.frames.base;
  const box = DESK_SLOTS[slot];
  return [{
    id: `${slot}:${item.id}`,
    rows,
    x: box.x,
    y: box.y + Math.max(0, box.maxH - rows.length),
    themeKey: item.themeKey,
    boundaryMode: slot === "wallpaper" || slot === "flooring" ? "none" : "adaptive"
  }];
});
const rects = composePixelRuns(ART_W, ART_H, layers)
  .map(
    (run) =>
      `<rect x="${run.x * scale}" y="${run.y * scale}" width="${run.w * scale}" height="${(run.h ?? 1) * scale}" fill="${run.color}"/>`
  )
  .join("");
const width = ART_W * scale;
const height = ART_H * scale;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges" style="image-rendering:pixelated">
  <rect width="${width}" height="${height}" fill="#F7F7F3"/>
  ${rects}
</svg>`;
const target = resolve(
  process.argv[4] ?? `art/scene-output/${themeKey}-${width}x${height}.svg`
);
await mkdir(dirname(target), { recursive: true });
await writeFile(target, svg, "utf8");
console.log(target);
