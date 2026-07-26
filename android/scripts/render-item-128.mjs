import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { itemById } from "../src/pixel/catalog.ts";
import {
  ITEM_CANVAS_SIZE,
  ITEM_OUTPUT_SCALES,
  placeOnItemCanvas
} from "../src/pixel/pixelCanvas.ts";
import { separatedGlyphRuns } from "../src/pixel/pixelSeparation.ts";
import { themePaletteFor } from "../src/pixel/themePalettes.ts";

const itemId = process.argv[2] ?? "cat-basic";
const scale = Number(process.argv[3] ?? 8);
if (!ITEM_OUTPUT_SCALES.includes(scale)) {
  throw new Error(`item scale must be ${ITEM_OUTPUT_SCALES.join(" or ")}`);
}
const item = itemById(itemId);
if (!item) throw new Error(`${itemId}: item not found`);
const placement = placeOnItemCanvas(item.frames.base);
const background = themePaletteFor(item.themeKey)?.colors.background ?? "#F7F7F3";
const runs = separatedGlyphRuns(item.frames.base, item.themeKey, item.id, background);
const outputSize = ITEM_CANVAS_SIZE * scale;
const rects = runs
  .map(
    (run) =>
      `<rect x="${(placement.x + run.x) * scale}" y="${(placement.y + run.y) * scale}" width="${run.w * scale}" height="${scale}" fill="${run.color}"/>`
  )
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${outputSize}" height="${outputSize}" viewBox="0 0 ${outputSize} ${outputSize}" shape-rendering="crispEdges" style="image-rendering:pixelated">
  <rect width="${outputSize}" height="${outputSize}" fill="${background}"/>
  ${rects}
</svg>`;
const target = resolve(
  process.argv[4] ?? `art/item-128/${item.id}-${outputSize}.svg`
);
await mkdir(dirname(target), { recursive: true });
await writeFile(target, svg, "utf8");
console.log(target);
