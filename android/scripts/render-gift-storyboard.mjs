import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { itemById } from "../src/pixel/catalog.ts";
import { createGiftParticles } from "../src/pixel/pixelMotion.ts";

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
  N: "#86624b",
  Q: "#e6a7bb",
  V: "#acace7"
};
const boxRows = [
  "CCCCCCCCCC",
  "CAAAACAAAC",
  "CAAAACAAAC",
  "CCCCCCCCCC",
  "CAAAACAAAC",
  "CAAAACAAAC",
  "CAAAACAAAC",
  "CCCCCCCCCC"
];
const lidRows = ["..AA..AA..", ".AACCCCAA.", "CCCCCCCCCC"];

const pixels = (rows, x, y, scale) =>
  rows
    .flatMap((row, py) =>
      [...row].map((token, px) => {
        const fill = palette[token];
        return fill
          ? `<rect x="${x + px * scale}" y="${y + py * scale}" width="${scale}" height="${scale}" fill="${fill}"/>`
          : "";
      })
    )
    .join("");

const itemPixels = (id, x, y, box) => {
  const item = itemById(id);
  if (!item) throw new Error(id);
  const rows = item.frames.base;
  const width = Math.max(...rows.map((row) => row.length));
  const scale = Math.min(box / width, box / rows.length);
  return pixels(rows, x + (box - width * scale) / 2, y + (box - rows.length * scale) / 2, scale);
};

const panelW = 390;
const panelH = 430;
const pad = 26;
const titles = ["01 · 도착", "02 · 슈류류륭", "03 · 개봉", "04 · 아이템 등장"];
const descriptions = [
  "4px 바운스",
  "18개 속도·가속도·수명 입자",
  "뚜껑 + 십자 빛",
  "3개 순차 상승"
];
const burstParticles = createGiftParticles("storyboard");
const panels = titles.map((title, index) => {
  const x = pad + index * (panelW + 18);
  const boxX = x + panelW / 2 - 50;
  const boxY = 160;
  const particles =
    index === 1
      ? burstParticles.map((particle) => {
          const time = particle.lifespan * 0.6;
          const px = Math.round(
            (particle.velocity.x * time + 0.5 * particle.acceleration.x * time * time) / 2
          ) * 2;
          const py = Math.round(
            (particle.velocity.y * time + 0.5 * particle.acceleration.y * time * time) / 2
          ) * 2;
          const color =
            particle.colorIndex === 0 ? "#ffffff" : particle.colorIndex === 1 ? "#ecab37" : "#acace7";
          return `<rect x="${boxX + 50 + px}" y="${boxY + 18 + py}" width="${particle.size}" height="${particle.size}" fill="${color}"/>`;
        }).join("")
      : "";
  const cross =
    index === 2
      ? `<rect x="${boxX + 45}" y="${boxY - 38}" width="10" height="70" fill="#ffffff"/><rect x="${boxX + 15}" y="${boxY - 8}" width="70" height="10" fill="#ffffff"/>`
      : "";
  const lidY = index >= 2 ? boxY - 42 : boxY;
  const results =
    index === 3
      ? [
          ["spring-tea", "벚꽃차"],
          ["calico-cat", "삼색고양이"],
          ["sky-lamp", "구름 조명"]
        ]
          .map(([id, label], itemIndex) => {
            const itemX = x + 28 + itemIndex * 112;
            return `<rect x="${itemX}" y="278" width="100" height="112" fill="#ffffff" stroke="#8ba1d4" stroke-width="3"/>
              ${itemPixels(id, itemX + 13, 288, 74)}
              <text x="${itemX + 50}" y="378" text-anchor="middle" fill="#21242e" font-family="sans-serif" font-size="12" font-weight="700">${label}</text>`;
          })
          .join("")
      : "";
  return `<g>
    <rect x="${x}" y="${pad}" width="${panelW}" height="${panelH}" fill="#303544" stroke="#8ba1d4" stroke-width="3"/>
    <text x="${x + 22}" y="72" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="800">${title}</text>
    <text x="${x + 22}" y="100" fill="#c0d5e6" font-family="sans-serif" font-size="14">${descriptions[index]}</text>
    ${particles}${cross}
    ${pixels(lidRows, boxX, lidY, 10)}
    ${pixels(boxRows, boxX, boxY + 28, 10)}
    ${results}
  </g>`;
});

const boardW = pad * 2 + panelW * 4 + 18 * 3;
const boardH = panelH + pad * 2;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boardW}" height="${boardH}" viewBox="0 0 ${boardW} ${boardH}">
  <rect width="${boardW}" height="${boardH}" fill="#21242e"/>
  ${panels.join("\n")}
</svg>`;
const target = resolve("art/gift-box-storyboard.svg");
await mkdir(dirname(target), { recursive: true });
await writeFile(target, svg, "utf8");
console.log(target);
