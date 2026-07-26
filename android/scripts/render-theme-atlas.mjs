import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const files = [
  "01-spring-winter.svg",
  "02-rival-calico.svg",
  "03-aquarium-undersea.svg",
  "04-dream-zoo.svg",
  "05-sf-space.svg",
  "06-christmas-sky.svg",
  "07-fantasy-school.svg",
  "08-rainy-library.svg",
  "09-cafe-bakery.svg",
  "10-camping-greenhouse.svg",
  "11-music-arcade.svg",
  "12-hanok-night-city.svg",
  "13-summer-autumn.svg"
];

const sourceDir = resolve("art/theme-pairs");
const target = resolve("art/theme-atlas.svg");
const scale = 0.5;
const gutter = 20;
const top = 72;
const cells = [];
let y = top;

for (let index = 0; index < files.length; index += 2) {
  const row = [];
  let rowHeight = 0;
  for (let column = 0; column < 2; column += 1) {
    const file = files[index + column];
    if (!file) break;
    const svg = await readFile(resolve(sourceDir, file), "utf8");
    const match = svg.match(/viewBox="0 0 1800 ([0-9.]+)"/);
    if (!match) throw new Error(`${file}: viewBox를 찾지 못했습니다.`);
    const height = Number(match[1]) * scale;
    rowHeight = Math.max(rowHeight, height);
    row.push(
      `<image x="${column * (900 + gutter)}" y="${y}" width="900" height="${height}" href="theme-pairs/${file}" preserveAspectRatio="xMinYMin meet" style="image-rendering:pixelated"/>`
    );
  }
  cells.push(...row);
  y += rowHeight + gutter;
}

const boardW = 1820;
const boardH = y;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boardW}" height="${boardH}" viewBox="0 0 ${boardW} ${boardH}" shape-rendering="crispEdges" style="image-rendering:pixelated">
  <rect width="${boardW}" height="${boardH}" fill="#21242e"/>
  <text x="28" y="44" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="800">TEUM PIXEL DESK · COMPLETE THEME ATLAS · 13 PAIRS / 26 THEMES</text>
  ${cells.join("\n  ")}
</svg>`;

await writeFile(target, svg, "utf8");
console.log(target);
