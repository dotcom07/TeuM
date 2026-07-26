import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_PLACEMENTS,
  DESK_SLOTS,
  ITEM_CATALOG,
  SLOT_RENDER_ORDER
} from "../src/pixel/catalog.ts";
import { ART_H, ART_W } from "../src/pixel/pixelDensity.ts";
import {
  colorDistance,
  composePixelGrid,
  contrastRatio,
  isBoundaryPixel,
  separatedGlyphRuns
} from "../src/pixel/pixelSeparation.ts";
import { THEME_PALETTES } from "../src/pixel/themePalettes.ts";

const STRUCTURAL = new Set(["wallpaper", "flooring"]);
const DEFAULT_PREVIEW_BACKGROUND = "#9FBEE7";

function runsToColorMap(runs) {
  const colors = new Map();
  for (const run of runs) {
    for (let x = run.x; x < run.x + run.w; x += 1) {
      colors.set(`${x},${run.y}`, run.color);
    }
  }
  return colors;
}

function allRowSets(item) {
  const sets = [
    ...Object.entries(item.frames),
    ...Object.entries(item.states ?? {}).map(([name, rows]) => [`state:${name}`, rows])
  ];
  const seen = new Set();
  return sets.filter(([, rows]) => {
    const key = rows.join("\n");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function layersForSelection(selection) {
  return SLOT_RENDER_ORDER.flatMap((slot) => {
    const item = selection(slot);
    if (!item) return [];
    const rows = item.frames.base;
    const box = DESK_SLOTS[slot];
    return [
      {
        id: `${slot}:${item.id}`,
        rows,
        x: box.x,
        y: box.y + Math.max(0, box.maxH - rows.length),
        themeKey: item.themeKey,
        boundaryMode: STRUCTURAL.has(slot) ? "none" : "adaptive"
      }
    ];
  });
}

function isOnlyStructuralBoundary(left, right) {
  const leftSlot = left.owner.split(":")[0];
  const rightSlot = right.owner.split(":")[0];
  return STRUCTURAL.has(leftSlot) && STRUCTURAL.has(rightSlot);
}

function assertOwnerBoundariesAreSeparated(grid, label) {
  const directions = [
    [1, 0],
    [0, 1]
  ];
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const pixel = grid[y][x];
      if (!pixel) continue;
      for (const [dx, dy] of directions) {
        const other = grid[y + dy]?.[x + dx];
        if (!other || other.owner === pixel.owner || isOnlyStructuralBoundary(pixel, other)) continue;
        assert.notEqual(
          pixel.color.toUpperCase(),
          other.color.toUpperCase(),
          `${label} ${x},${y}: ${pixel.owner}/${other.owner} exact color collision`
        );
        const ratio = contrastRatio(pixel.color, other.color);
        const distance = colorDistance(pixel.color, other.color);
        assert.ok(
          ratio >= 3 || distance >= 72,
          `${label} ${x},${y}: ${pixel.owner}/${other.owner} ratio=${ratio.toFixed(2)} distance=${distance.toFixed(1)}`
        );
      }
    }
  }
}

test("모든 전경 아이템 프레임은 실제 미리보기 배경과 3:1 이상 분리된다", () => {
  let checked = 0;
  for (const item of ITEM_CATALOG) {
    if (item.slots.some((slot) => STRUCTURAL.has(slot))) continue;
    const background =
      THEME_PALETTES[item.themeKey]?.colors.background ?? DEFAULT_PREVIEW_BACKGROUND;
    for (const [state, rows] of allRowSets(item)) {
      const colors = runsToColorMap(
        separatedGlyphRuns(rows, item.themeKey, `${item.id}:${state}`, background)
      );
      for (let y = 0; y < rows.length; y += 1) {
        for (let x = 0; x < rows[y].length; x += 1) {
          if (!isBoundaryPixel(rows, x, y)) continue;
          const color = colors.get(`${x},${y}`);
          assert.ok(color, `${item.id}/${state} ${x},${y}: missing rendered edge`);
          assert.ok(
            contrastRatio(color, background) >= 3,
            `${item.id}/${state} ${x},${y}: ${color}/${background}`
          );
          checked += 1;
        }
      }
    }
  }
  assert.ok(checked > 10_000, `checked edge count ${checked}`);
});

test("모든 아이템은 26개 다른 테마 배경에 놓여도 외곽이 사라지지 않는다", () => {
  let combinations = 0;
  const backgrounds = Object.values(THEME_PALETTES).map((theme) => theme.colors.background);
  for (const item of ITEM_CATALOG) {
    if (item.slots.some((slot) => STRUCTURAL.has(slot))) continue;
    for (const background of backgrounds) {
      const colors = runsToColorMap(
        separatedGlyphRuns(item.frames.base, item.themeKey, `${item.id}:${background}`, background)
      );
      for (let y = 0; y < item.frames.base.length; y += 1) {
        for (let x = 0; x < item.frames.base[y].length; x += 1) {
          if (!isBoundaryPixel(item.frames.base, x, y)) continue;
          assert.ok(
            contrastRatio(colors.get(`${x},${y}`), background) >= 3,
            `${item.id} on ${background} at ${x},${y}`
          );
        }
      }
      combinations += 1;
    }
  }
  assert.ok(combinations > 9_000, `background combinations ${combinations}`);
});

test("26개 완성 방에서 서로 다른 아이템 경계가 같은 색으로 이어지지 않는다", () => {
  for (const themeKey of Object.keys(THEME_PALETTES)) {
    const themed = ITEM_CATALOG.filter((item) => item.themeKey === themeKey);
    const defaults = new Map(
      Object.entries(DEFAULT_PLACEMENTS).map(([slot, id]) => [
        slot,
        ITEM_CATALOG.find((item) => item.id === id)
      ])
    );
    const layers = layersForSelection(
      (slot) => themed.find((item) => item.slots.includes(slot)) ?? defaults.get(slot)
    );
    const grid = composePixelGrid(ART_W, ART_H, layers);
    assertOwnerBoundariesAreSeparated(grid, themeKey);

    const masks = new Map(
      layers.map((layer) => [
        layer.id,
        new Set(
          layer.rows.flatMap((row, y) =>
            [...row].flatMap((token, x) =>
              token === "." || token === " " ? [] : [`${layer.x + x},${layer.y + y}`]
            )
          )
        )
      ])
    );
    for (let y = 0; y < grid.length; y += 1) {
      for (let x = 0; x < grid[y].length; x += 1) {
        const pixel = grid[y][x];
        if (pixel?.kind !== "separator") continue;
        assert.equal(
          masks.get(pixel.owner)?.has(`${x},${y}`),
          true,
          `${themeKey} ${pixel.owner}: separator escaped its source silhouette`
        );
      }
    }
  }
});

test("혼합 테마 배치에서도 인접 아이템 외곽선은 하나로 합쳐지지 않는다", () => {
  for (let seed = 0; seed < 12; seed += 1) {
    const layers = layersForSelection((slot) => {
      const candidates = ITEM_CATALOG.filter((item) => item.slots.includes(slot));
      return candidates[(seed * 37 + SLOT_RENDER_ORDER.indexOf(slot) * 19) % candidates.length];
    });
    assertOwnerBoundariesAreSeparated(
      composePixelGrid(ART_W, ART_H, layers),
      `mixed-seed-${seed}`
    );
  }
});

test("기존 최악 충돌 아이템도 자기 배경에서 외곽 전체가 보인다", () => {
  for (const id of [
    "library-owl",
    "music-window",
    "music-monitor",
    "arcade-window",
    "arcade-monitor",
    "zoo-panda",
    "hanok-jar"
  ]) {
    const item = ITEM_CATALOG.find((candidate) => candidate.id === id);
    assert.ok(item, `${id}: missing`);
    const background = THEME_PALETTES[item.themeKey].colors.background;
    const colors = runsToColorMap(
      separatedGlyphRuns(item.frames.base, item.themeKey, item.id, background)
    );
    for (let y = 0; y < item.frames.base.length; y += 1) {
      for (let x = 0; x < item.frames.base[y].length; x += 1) {
        if (!isBoundaryPixel(item.frames.base, x, y)) continue;
        assert.ok(
          contrastRatio(colors.get(`${x},${y}`), background) >= 3,
          `${id} ${x},${y}`
        );
      }
    }
  }
});
