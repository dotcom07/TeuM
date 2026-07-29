import assert from "node:assert/strict";
import test from "node:test";
import { DESK_SLOTS, ITEM_CATALOG } from "../src/pixel/catalog.ts";
import {
  THEME_BACKGROUND_PALETTES,
  THEME_BACKGROUND_TOKEN_COLORS
} from "../src/pixel/themePalette109.ts";

const paletteTokens = new Set([
  ..."CIMPK EHWASTLBYORG N".replaceAll(" ", ""),
  ...Object.keys(THEME_BACKGROUND_TOKEN_COLORS)
]);
const newItems = ITEM_CATALOG.filter((item) => item.addedIn === "1.0.9");
const PET_MOUTH_ROW_EXPECTATIONS = {
  "cat-tuxedo": [3, "CCRI.."],
  "summer-cat": [3, "NNCNNN"],
  "autumn-cat": [3, "ORCRO."],
  "spring-pet": [5, "IPPPPI"],
  "winter-pet": [3, "NNCN.."],
  "calico-pet": [3, "CORO.."],
  "aquarium-pet": [3, "MCAACM"],
  "undersea-pet": [3, "TTTTTT"],
  "dream-pet": [3, "WWWWWW"],
  "zoo-pet": [3, "RCWWRR"],
  "sf-pet": [3, "CTIGTC"],
  "space-pet": [5, "WBBBBW"],
  "christmas-pet": [4, "INRNNI"],
  "sky-pet": [3, "MBAABM"],
  "fantasy-pet": [5, "MYYYYM"],
  "school-pet": [3, "TYNT.."],
  "rainy-pet": [3, "MBWCBM"],
  "library-pet": [4, "IYAYYI"],
  "cafe-pet": [3, "TNRNT."],
  "bakery-pet": [5, "IYNYYI"],
  "camping-pet": [4, "MOOOM."],
  "greenhouse-pet": [5, "IGGGGI"],
  "music-pet": [3, "TBAABT"],
  "arcade-pet": [3, "GPPPPG"],
  "hanok-pet": [5, "INRN.I"],
  "night-city-pet": [3, "TPRP.."],
  "onsen-pet": [2, "OCOSO."]
};
const YELLOW_BEAK_PETS = new Set([
  "aquarium-pet",
  "sky-pet",
  "library-pet",
  "music-pet"
]);

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

const dominantOpaqueToken = (rows) => {
  const counts = new Map();
  for (const token of rows.join("")) {
    if (token === "." || token === " ") continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...counts].sort((left, right) => right[1] - left[1])[0]?.[0];
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

test("모든 테마 벽지는 서로 다른 전용 주 배경색을 사용한다", () => {
  const palettes = Object.entries(THEME_BACKGROUND_PALETTES);
  assert.equal(new Set(palettes.map(([, palette]) => palette.token)).size, palettes.length);
  assert.equal(
    new Set(palettes.map(([, palette]) => palette.hex.toLowerCase())).size,
    palettes.length
  );

  for (const [themeKey, palette] of palettes) {
    const wallpaper = ITEM_CATALOG.find(
      (item) => item.themeKey === themeKey && item.slots.includes("wallpaper")
    );
    assert.ok(wallpaper, `${themeKey}: 벽지 존재`);
    assert.equal(
      dominantOpaqueToken(wallpaper.frames.base),
      palette.token,
      `${themeKey}: 전용 주 배경 토큰`
    );
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

test("재설계한 26개 테마 펫은 같은 실루엣을 재사용하지 않는다", () => {
  const reviewedThemes = new Set(Object.keys(THEME_BACKGROUND_PALETTES));
  const pets = ITEM_CATALOG.filter(
    (candidate) =>
      candidate.slots.includes("floor-left") && reviewedThemes.has(candidate.themeKey)
  );
  const masks = pets.map((item) => opaqueMask(item.frames.base).join("\n"));
  assert.equal(pets.length, reviewedThemes.size);
  assert.equal(new Set(masks).size, masks.length);
});

test("파랑새 2종과 픽셀 유령은 두 눈이 분명하게 보인다", () => {
  for (const id of ["sky-pet", "music-pet", "arcade-pet"]) {
    const pet = ITEM_CATALOG.find((item) => item.id === id);
    assert.ok(pet, `${id}: 펫 존재`);
    assert.equal(
      [...pet.frames.base.join("")].filter((token) => token === "W").length,
      2,
      `${id}: 흰색 눈 두 개`
    );
  }
});

test("검정냥이와 기본 강아지 외 모든 펫은 종에 맞는 입·코·부리를 사용한다", () => {
  const reviewedPets = ITEM_CATALOG.filter(
    (item) =>
      item.slots.includes("floor-left") &&
      item.id !== "cat-basic" &&
      item.id !== "dog-basic"
  );
  assert.deepEqual(
    reviewedPets.map((item) => item.id).sort(),
    Object.keys(PET_MOUTH_ROW_EXPECTATIONS).sort(),
    "검수 대상 펫 전체가 입·코 규칙에 포함되어야 한다"
  );

  for (const pet of reviewedPets) {
    const [rowIndex, expectedRow] = PET_MOUTH_ROW_EXPECTATIONS[pet.id];
    const mouthRow = pet.frames.base[rowIndex];
    assert.equal(mouthRow, expectedRow, `${pet.id}: 검수된 얼굴 행`);
    assert.equal(
      mouthRow.includes("A"),
      YELLOW_BEAK_PETS.has(pet.id),
      `${pet.id}: 노란색은 새의 부리에만 사용`
    );
  }
});

test("재설계한 26개 테마 장면은 아이템 경계가 뒤 배경과 합쳐지지 않는다", () => {
  for (const themeKey of Object.keys(THEME_BACKGROUND_PALETTES)) {
    const scene = Array.from({ length: 40 }, () => Array(64).fill("."));
    const items = ITEM_CATALOG.filter((item) => item.themeKey === themeKey);
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

    assert.deepEqual(conflicts, [], themeKey);
  }
});
