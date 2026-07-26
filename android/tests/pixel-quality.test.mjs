import assert from "node:assert/strict";
import test from "node:test";
import { ITEM_CATALOG } from "../src/pixel/catalog.ts";

function tokenComponentAreas(rows) {
  const height = rows.length;
  const width = rows[0].length;
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const areas = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const token = rows[y][x];
      if (visited[y][x] || token === "." || token === " ") continue;
      const queue = [[x, y]];
      visited[y][x] = true;
      let area = 0;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      for (let index = 0; index < queue.length; index += 1) {
        const [cx, cy] = queue[index];
        area += 1;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (
            nx >= 0 && ny >= 0 && nx < width && ny < height &&
            !visited[ny][nx] && rows[ny][nx] === token
          ) {
            visited[ny][nx] = true;
            queue.push([nx, ny]);
          }
        }
      }
      areas.push({ area, width: maxX - minX + 1, height: maxY - minY + 1 });
    }
  }
  return areas;
}

test("전 아이템의 같은 색 디테일은 최소 2×2 클러스터라 단독 노이즈 픽셀이 없다", () => {
  let components = 0;
  for (const item of ITEM_CATALOG) {
    const rowSets = [
      ...Object.entries(item.frames),
      ...Object.entries(item.states ?? {}).map(([state, rows]) => [`state:${state}`, rows])
    ];
    for (const [state, rows] of rowSets) {
      for (const component of tokenComponentAreas(rows)) {
        assert.ok(
          component.area >= 4 && component.width >= 2 && component.height >= 2,
          `${item.id}/${state}: ${JSON.stringify(component)} color fragment`
        );
        components += 1;
      }
    }
  }
  assert.ok(components > 14_000, `only ${components} components checked`);
});

test("독립 캐릭터·사물의 97% 이상은 외곽·본체·명암 3단계 이상을 쓴다", () => {
  const items = ITEM_CATALOG.filter(
    (item) =>
      !item.slots.some((slot) =>
        slot === "wallpaper" || slot === "flooring" || slot === "furniture-desk"
      )
  );
  const shaded = items.filter((item) => {
    const tokens = new Set(item.frames.base.join("").replace(/[. ]/g, ""));
    return tokens.size >= 3;
  });
  assert.ok(shaded.length / items.length >= 0.97, `${shaded.length}/${items.length}`);
});
