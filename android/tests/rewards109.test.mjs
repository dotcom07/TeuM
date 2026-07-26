import assert from "node:assert/strict";
import test from "node:test";
import { ITEM_CATALOG } from "../src/pixel/catalog.ts";
import { normalizeDeskState } from "../src/pixel/deskState.ts";
import {
  availableChoicePoints,
  CHOICE_COST,
  chooseItem109,
  completeBreakReward109,
  openGift109,
  pendingGiftCount
} from "../src/pixel/rewards109.ts";

const empty = () => normalizeDeskState(null);

test("5회마다 선물상자 한 개가 생기고 열면 미소장 아이템 하나를 지급한다", () => {
  let state = empty();
  for (let count = 0; count < 5; count += 1) {
    state = completeBreakReward109(state);
  }
  assert.equal(pendingGiftCount(state), 1);
  const result = openGift109(state, () => 0);
  assert.ok(result.item);
  assert.equal(result.state.ownedItemIds.includes(result.item.id), true);
  assert.equal(result.state.openedGiftCount, 1);
  assert.equal(pendingGiftCount(result.state), 0);
});

test("선물상자는 이미 소장한 아이템과 기본 지급 아이템을 제외한다", () => {
  const firstGiftCandidate = ITEM_CATALOG.find(
    (item) => item.acquire.type !== "default" && item.acquire.type !== "daily"
  );
  assert.ok(firstGiftCandidate);
  const state = {
    ...empty(),
    cumulativeDone: 10,
    openedGiftCount: 1,
    ownedItemIds: [firstGiftCandidate.id]
  };
  const result = openGift109(state, () => 0);
  assert.ok(result.item);
  assert.notEqual(result.item.id, firstGiftCandidate.id);
  assert.notEqual(result.item.acquire.type, "default");
  assert.notEqual(result.item.acquire.type, "daily");
});

test("50회 완료로 모은 5P를 사용해 원하는 아이템을 확정 획득한다", () => {
  const target = ITEM_CATALOG.find((item) => item.acquire.type === "gift");
  assert.ok(target);
  const state = { ...empty(), cumulativeDone: 50 };
  assert.equal(availableChoicePoints(state), CHOICE_COST);
  const result = chooseItem109(state, target.id);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.state.ownedItemIds.includes(target.id), true);
  assert.equal(availableChoicePoints(result.state), 0);
});

test("포인트가 부족하거나 이미 가진 아이템은 확정 획득할 수 없다", () => {
  const target = ITEM_CATALOG.find((item) => item.acquire.type === "gift");
  assert.ok(target);
  const insufficient = chooseItem109(empty(), target.id);
  assert.deepEqual(insufficient, { ok: false, reason: "points" });
  const owned = chooseItem109(
    { ...empty(), cumulativeDone: 50, ownedItemIds: [target.id] },
    target.id
  );
  assert.deepEqual(owned, { ok: false, reason: "owned" });
});

test("1.0.6 저장을 v2로 옮길 때 기존 소장품과 과거 누적 포인트를 보존한다", () => {
  const migrated = normalizeDeskState({
    version: 1,
    cumulativeDone: 36,
    placements: { "floor-left": "autumn-cat" }
  });
  assert.equal(migrated.version, 2);
  assert.equal(migrated.ownedItemIds.includes("cat-tuxedo"), true);
  assert.equal(migrated.ownedItemIds.includes("summer-cat"), true);
  assert.equal(migrated.ownedItemIds.includes("autumn-cat"), true);
  assert.equal(migrated.openedGiftCount, 7);
  assert.equal(availableChoicePoints(migrated), 3);
});
