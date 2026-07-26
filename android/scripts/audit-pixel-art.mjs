import crypto from "node:crypto";
import { DESK_SLOTS, ITEM_CATALOG } from "../src/pixel/catalog.ts";

const argValue = (name) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const selectedTheme = argValue("--theme");
const themeKey = (item) => item.themeKey ?? "base";

const boundaryPixels = (rows) => {
  const height = rows.length;
  const width = rows[0].length;
  const result = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const token = rows[y][x];
      if (token === ".") continue;
      const boundary = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1]
      ].some(
        ([nextX, nextY]) =>
          nextX < 0 ||
          nextY < 0 ||
          nextX >= width ||
          nextY >= height ||
          rows[nextY][nextX] === "."
      );
      if (boundary) result.push({ x, y, token });
    }
  }
  return result;
};

const wallpaperPeriods = (rows) => {
  const width = rows[0].length;
  const height = rows.length;
  const horizontal = Array.from({ length: Math.floor(width / 2) }, (_, index) => index + 1)
    .find((period) =>
      rows.every((row) =>
        [...row].every((token, x) => token === row[x % period])
      )
    );
  const vertical = Array.from({ length: Math.floor(height / 2) }, (_, index) => index + 1)
    .find((period) =>
      rows.every((row, y) => row === rows[y % period])
    );
  return {
    horizontal: horizontal ?? null,
    vertical: vertical ?? null
  };
};

const auditTheme = (key) => {
  const items = ITEM_CATALOG.filter((item) => themeKey(item) === key);
  const scene = Array.from({ length: 40 }, () => Array(64).fill("."));
  const used = new Set();
  const conflicts = [];

  for (const [slot, box] of Object.entries(DESK_SLOTS)) {
    const item = items.find((candidate) => candidate.slots.includes(slot));
    if (!item || used.has(item.id)) continue;
    used.add(item.id);
    const rows = item.frames.base;
    const originY = box.y + Math.max(0, box.maxH - rows.length);

    if (slot !== "wallpaper" && slot !== "flooring") {
      for (const pixel of boundaryPixels(rows)) {
        const x = box.x + pixel.x;
        const y = originY + pixel.y;
        if (scene[y]?.[x] === pixel.token) {
          conflicts.push({
            item: item.id,
            x,
            y,
            token: pixel.token
          });
        }
      }
    }

    rows.forEach((row, y) => {
      [...row].forEach((token, x) => {
        if (token !== ".") scene[originY + y][box.x + x] = token;
      });
    });
  }

  const wallpaper = items.find((item) => item.slots.includes("wallpaper"));
  return {
    theme: key,
    items: items.length,
    boundaryConflicts: conflicts,
    wallpaperPeriods: wallpaper ? wallpaperPeriods(wallpaper.frames.base) : null
  };
};

const maskHash = (rows) =>
  crypto
    .createHash("sha256")
    .update(
      rows
        .map((row) => [...row].map((token) => (token === "." ? "." : "#")).join(""))
        .join("\n")
    )
    .digest("hex");

const pets = ITEM_CATALOG.filter((item) => item.slots.includes("floor-left"));
const petMasks = new Map();
for (const pet of pets) {
  const hash = maskHash(pet.frames.base);
  const group = petMasks.get(hash) ?? [];
  group.push(pet.id);
  petMasks.set(hash, group);
}

const keys = [...new Set(ITEM_CATALOG.map(themeKey))]
  .filter((key) => !selectedTheme || key === selectedTheme);
if (selectedTheme && keys.length === 0) {
  throw new Error(`알 수 없는 테마입니다: ${selectedTheme}`);
}

const report = {
  themes: keys.map(auditTheme),
  duplicatePetMasks: [...petMasks.values()].filter((group) => group.length > 1)
};

console.log(JSON.stringify(report, null, 2));
