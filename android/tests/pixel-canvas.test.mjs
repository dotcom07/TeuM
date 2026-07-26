import assert from "node:assert/strict";
import test from "node:test";
import { ITEM_CATALOG } from "../src/pixel/catalog.ts";
import {
  ITEM_CANVAS_SIZE,
  ITEM_OUTPUT_SCALES,
  itemCanvasRows,
  placeOnItemCanvas,
  SCENE_OUTPUT_SCALES
} from "../src/pixel/pixelCanvas.ts";
import { ART_H, ART_W } from "../src/pixel/pixelDensity.ts";

const isStandalone = (item) =>
  !item.slots.some((slot) =>
    slot === "wallpaper" || slot === "flooring" || slot === "furniture-desk"
  );

test("374개 캐릭터·사물의 모든 프레임은 128×128 논리 캔버스에 중앙 정렬된다", () => {
  const items = ITEM_CATALOG.filter(isStandalone);
  assert.equal(items.length, 374);
  let frames = 0;
  for (const item of items) {
    const rowSets = [...Object.values(item.frames), ...Object.values(item.states ?? {})];
    for (const rows of rowSets) {
      const placement = placeOnItemCanvas(rows);
      const canvas = itemCanvasRows(rows);
      assert.equal(canvas.length, ITEM_CANVAS_SIZE, item.id);
      assert.ok(canvas.every((row) => row.length === ITEM_CANVAS_SIZE), item.id);
      assert.ok(Math.abs(placement.x - (ITEM_CANVAS_SIZE - placement.width) / 2) <= 0.5);
      assert.ok(Math.abs(placement.y - (ITEM_CANVAS_SIZE - placement.height) / 2) <= 0.5);
      frames += 1;
    }
  }
  assert.equal(frames, 750);
});

test("방은 320×180에서 4배 1280×720, 6배 1920×1080으로 정확히 확대된다", () => {
  assert.deepEqual(
    ITEM_OUTPUT_SCALES.map((scale) => ITEM_CANVAS_SIZE * scale),
    [768, 1024]
  );
  assert.deepEqual([...SCENE_OUTPUT_SCALES], [4, 6]);
  assert.deepEqual(
    SCENE_OUTPUT_SCALES.map((scale) => [ART_W * scale, ART_H * scale]),
    [[1280, 720], [1920, 1080]]
  );
});
