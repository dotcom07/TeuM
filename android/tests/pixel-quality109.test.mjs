import assert from "node:assert/strict";
import test from "node:test";
import { DESK_SLOTS, ITEM_CATALOG } from "../src/pixel/catalog.ts";

const paletteTokens = new Set("CIMPK EHWASTLBYORG N".replaceAll(" ", ""));
const newItems = ITEM_CATALOG.filter((item) => item.addedIn === "1.0.9");

const opaqueMask = (rows) =>
  rows.map((row) => [...row].map((token) => (token === "." ? "." : "#")).join(""));

const sceneY = (slot, rows) => {
  const box = DESK_SLOTS[slot];
  return box.y + Math.max(0, box.maxH - rows.length);
};

const boundaryPixels = (rows) => {
  const height = rows.length;
  const width = rows[0].length;
  const pixels = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const token = rows[y][x];
      if (token === ".") continue;
      const touchesOutside = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1]
      ].some(([nextX, nextY]) =>
        nextX < 0 ||
        nextY < 0 ||
        nextX >= width ||
        nextY >= height ||
        rows[nextY][nextX] === "."
      );
      if (touchesOutside) pixels.push({ x, y, token });
    }
  }
  return pixels;
};

test("전체 카탈로그는 행 너비·슬롯 크기·팔레트 규격을 지킨다", () => {
  for (const item of ITEM_CATALOG) {
    const rows = item.frames.base;
    const widths = new Set(rows.map((row) => row.length));
    assert.equal(widths.size, 1, `${item.id}: 모든 행의 너비`);
    const width = rows[0].length;
    for (const slot of item.slots) {
      const box = DESK_SLOTS[slot];
      assert.ok(width <= box.maxW, `${item.id}: ${slot} 너비`);
      assert.ok(rows.length <= box.maxH, `${item.id}: ${slot} 높이`);
    }
    for (const token of new Set(rows.join("").replaceAll(".", ""))) {
      assert.ok(paletteTokens.has(token), `${item.id}: 팔레트 토큰 ${token}`);
    }
  }
});

test("1.0.9 신규 아이템은 1.0.6 슬롯과 팔레트 규격을 지킨다", () => {
  assert.equal(newItems.length, 23 * 14);
  for (const item of newItems) {
    const rows = item.frames.base;
    const widths = new Set(rows.map((row) => row.length));
    assert.equal(widths.size, 1, `${item.id}: 모든 행의 너비`);
    const width = rows[0].length;
    for (const slot of item.slots) {
      const box = DESK_SLOTS[slot];
      assert.ok(width <= box.maxW, `${item.id}: ${slot} 너비`);
      assert.ok(rows.length <= box.maxH, `${item.id}: ${slot} 높이`);
    }
    const used = new Set(rows.join("").replaceAll(".", ""));
    for (const token of used) {
      assert.ok(paletteTokens.has(token), `${item.id}: 팔레트 토큰 ${token}`);
    }
    if (!item.slots.includes("wallpaper") && !item.slots.includes("flooring")) {
      assert.ok(used.size >= 2, `${item.id}: 최소 2색`);
    }
  }
});

test("재설계가 끝난 테마 펫은 팔레트 교체용 실루엣을 재사용하지 않는다", () => {
  const reviewedThemes = new Set(["spring", "winter", "calico"]);
  const pets = newItems.filter(
    (candidate) => candidate.id.endsWith("-pet") && reviewedThemes.has(candidate.themeKey)
  );
  const masks = pets.map((item) => opaqueMask(item.frames.base).join("\n"));
  assert.equal(new Set(masks).size, masks.length);
});

test("고양이와 생쥐 장면은 아이템·펫 경계가 뒤 배경과 같은 색으로 합쳐지지 않는다", () => {
  const scene = Array.from({ length: 40 }, () => Array(64).fill("."));
  const items = ITEM_CATALOG.filter((item) => item.themeKey === "cat");
  const used = new Set();
  const conflicts = [];

  for (const [slot, box] of Object.entries(DESK_SLOTS)) {
    const item = items.find((candidate) => candidate.slots.includes(slot));
    if (!item || used.has(item.id)) continue;
    used.add(item.id);
    const rows = item.frames.base;
    const originY = sceneY(slot, rows);

    if (slot !== "wallpaper" && slot !== "flooring") {
      for (const pixel of boundaryPixels(rows)) {
        const sceneX = box.x + pixel.x;
        const scenePixelY = originY + pixel.y;
        const behind = scene[scenePixelY]?.[sceneX];
        if (behind === pixel.token) {
          conflicts.push(`${item.id}@${sceneX},${scenePixelY}:${pixel.token}`);
        }
      }
    }

    rows.forEach((row, y) => {
      [...row].forEach((token, x) => {
        if (token !== ".") scene[originY + y][box.x + x] = token;
      });
    });
  }

  assert.deepEqual(conflicts, []);
});
