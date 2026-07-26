import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { DESK_SLOTS, ITEM_CATALOG } from "../src/pixel/catalog.ts";
import { DENSE_PET_ROWS } from "../src/pixel/petArtworkDense.ts";
import { ART_H, ART_W } from "../src/pixel/pixelDensity.ts";
import { STORE_CAT_ROWS } from "../src/pixel/storeCatVariants.ts";

const TOKENS = new Set([".", "C", "I", "M", "P", "K", "E", "H", "W", "A", "S", "T", "L", "B", "Y", "O", "R", "G", "N", "Q", "V"]);

test("전체 카탈로그 id·도트 크기·팔레트가 유효하다", () => {
  const ids = new Set();
  for (const item of ITEM_CATALOG) {
    assert.equal(ids.has(item.id), false, `${item.id}: duplicate id`);
    ids.add(item.id);
    for (const [state, rows] of Object.entries(item.frames)) {
      assert.ok(rows.length > 0, `${item.id}/${state}: empty rows`);
      const widths = new Set(rows.map((row) => row.length));
      assert.equal(widths.size, 1, `${item.id}/${state}: inconsistent row width`);
      const width = rows[0].length;
      for (const slot of item.slots) {
        const box = DESK_SLOTS[slot];
        assert.ok(width <= box.maxW, `${item.id}/${state}: ${width} > ${slot} width ${box.maxW}`);
        assert.ok(rows.length <= box.maxH, `${item.id}/${state}: ${rows.length} > ${slot} height ${box.maxH}`);
      }
      for (const row of rows) {
        for (const token of row) assert.equal(TOKENS.has(token), true, `${item.id}: unknown token ${token}`);
      }
    }
  }
});

test("320×180 장면에 비클래식 54×66과 복원 클래식 42×54 도트가 연결된다", () => {
  assert.equal(ART_W, 320);
  assert.equal(ART_H, 180);
  assert.deepEqual(DESK_SLOTS.wallpaper, { x: 0, y: 0, maxW: ART_W, maxH: 140 });
  assert.equal(DESK_SLOTS.flooring.y + DESK_SLOTS.flooring.maxH, ART_H);
  assert.deepEqual(DESK_SLOTS["floor-left"], { x: 12, y: 96, maxW: 64, maxH: 72 });

  const pets = ITEM_CATALOG.filter((item) => item.slots.includes("floor-left"));
  assert.equal(pets.length, 87);
  assert.equal(pets.length, Object.keys(DENSE_PET_ROWS).length);
  for (const item of pets) {
    assert.ok(DENSE_PET_ROWS[item.id], `${item.id}: 수작업 펫 도트가 없습니다.`);
    const isClassic = item.id.startsWith("classic-");
    assert.equal(item.frames.base.length, isClassic ? 54 : 66, `${item.id}: 높이`);
    assert.ok(
      item.frames.base.every((row) => row.length === (isClassic ? 42 : 54)),
      `${item.id}: 너비`
    );
  }
});

test("개구리는 고양이 귀 대신 넓은 눈과 납작한 몸통을 쓰고 고양이 품종 8종이 추가됐다", () => {
  assert.equal(DENSE_PET_ROWS["rainy-frog"][0], ".CG...GC.");
  assert.equal(DENSE_PET_ROWS["rainy-frog"].at(-1), ".........");

  const breedIds = [
    "cat-maine-coon",
    "cat-scottish-fold",
    "cat-russian-blue",
    "cat-bengal",
    "cat-persian",
    "cat-munchkin",
    "cat-ragdoll",
    "cat-sphynx"
  ];
  for (const id of breedIds) assert.equal(ITEM_CATALOG.some((item) => item.id === id), true, id);
});

test("비고양이 펫은 종마다 고유 실루엣을 사용한다", () => {
  const pets = ITEM_CATALOG.filter((item) => item.slots.includes("floor-left"));
  const silhouette = (item) =>
    item.frames.base.map((row) => row.replace(/[^.]/g, "#")).join("\n");
  const species = pets.filter((item) => !item.id.includes("cat"));
  assert.equal(new Set(species.map(silhouette)).size, species.length);
});

test("클래식냥이 41종은 2026-07-24 배포 빌드 원본으로 고정된다", () => {
  const payload = JSON.stringify(
    Object.entries(STORE_CAT_ROWS).sort(([left], [right]) => left.localeCompare(right))
  );
  assert.equal(Object.keys(STORE_CAT_ROWS).length, 41);
  assert.equal(
    createHash("sha256").update(payload).digest("hex"),
    "a5fcfd0e211762f0a3c0523493068e2b86b617b1508ea58eedef6ed458d3aae3"
  );
});

test("이전 라이벌·여름·가을 아이템도 각자의 테마 팔레트로 도감에 남는다", () => {
  assert.equal(ITEM_CATALOG.find((item) => item.id === "cat-wallpaper")?.themeKey, "rival");
  assert.equal(ITEM_CATALOG.find((item) => item.id === "summer-wallpaper")?.themeKey, "summer");
  assert.equal(ITEM_CATALOG.find((item) => item.id === "autumn-wallpaper")?.themeKey, "autumn");
});

test("까만냥이의 스토어 배포본 원본 행은 고밀도 변환 뒤에도 별도로 고정된다", () => {
  assert.deepEqual(DENSE_PET_ROWS["cat-black"], [
    "C.C......",
    "CCCC.....",
    "CCWCCWW..",
    "CCCCCC...",
    "CCCCCC...",
    "CCCCCC..C",
    "CCCCCC.CC",
    "CCCCCCCCC",
    ".C....C..",
    "CC....CC.",
    "........."
  ]);
  const production = ITEM_CATALOG.find((item) => item.id === "cat-black")?.frames.base;
  assert.equal(production.length, 66);
  assert.ok(production.every((row) => row.length === 54));
});
