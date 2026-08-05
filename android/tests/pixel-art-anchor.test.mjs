import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { ITEM_CATALOG } from "../src/pixel/catalog.ts";

const expectedGroups = {
  base: {
    count: 26,
    hash: "1ce842d2cd8f7c7ddac8160e1b08472dc7791685998fff219faad4275e0a92b9"
  }
};

const expectedPets = {
  "cat-basic": "9d5cad8dbe9a2f453bf55f9092af853e08360463f4acd8afdc3a1846ae2aff22",
  "dog-basic": "fe047e9b0680fe3a4f9a12f446ef3ffdbd0844ff5a7534ee065639080caa0075"
};

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

const legacyThemeKey = (item) => {
  if (item.id !== "cat-basic" && item.id.startsWith("cat-")) return "cat";
  if (item.id.startsWith("summer-")) return "summer";
  if (item.id.startsWith("autumn-")) return "autumn";
  return "base";
};

test("1.0.6의 기본 26개 도트맵을 픽셀 단위로 보존한다", () => {
  const legacyItems = ITEM_CATALOG.filter(
    (item) =>
      item.addedIn !== "1.0.9" &&
      item.addedIn !== "1.0.13" &&
      item.addedIn !== "1.0.14" &&
      item.addedIn !== "1.0.15"
  );
  for (const [group, expected] of Object.entries(expectedGroups)) {
    const items = legacyItems.filter((item) => legacyThemeKey(item) === group);
    const payload = items
      .map(
        (item) =>
          `${item.id}\n${item.frames.base.join("\n")}\n${item.frames.active.join("\n")}`
      )
      .join("\n---\n");
    assert.equal(items.length, expected.count, `${group} 아이템 수`);
    assert.equal(sha256(payload), expected.hash, `${group} 도트맵 해시`);
  }
});

test("클래식 검정냥이와 기본 강아지는 1.0.6 실루엣을 보존한다", () => {
  for (const [id, expectedHash] of Object.entries(expectedPets)) {
    const item = ITEM_CATALOG.find((candidate) => candidate.id === id);
    assert.ok(item, `${id}가 존재해야 한다`);
    assert.equal(sha256(item.frames.base.join("\n")), expectedHash, `${id} 실루엣`);
  }
});
