import assert from "node:assert/strict";
import test from "node:test";
import { ITEM_CATALOG } from "../src/pixel/catalog.ts";
import { normalizeDeskState } from "../src/pixel/deskState.ts";
import { DEFAULT_SETTINGS } from "../src/types.ts";
import {
  availableChoicePoints,
  availableItemChoices,
  CHOICE_INTERVAL,
  CHOICE_COST,
  chooseItem109,
  completeBreakReward109,
  earnedGiftCount,
  GIFT_INTERVAL,
  nextGiftProgress,
  openGift109,
  pendingGiftCount
} from "../src/pixel/rewards109.ts";

const empty = () => normalizeDeskState(null);

test("7회마다 선물상자 한 개가 생기고 열면 미소장 아이템 하나를 지급한다", () => {
  let state = empty();
  for (let count = 0; count < GIFT_INTERVAL; count += 1) {
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
    cumulativeDone: GIFT_INTERVAL * 2,
    openedGiftCount: 1,
    ownedItemIds: [firstGiftCandidate.id]
  };
  const result = openGift109(state, () => 0);
  assert.ok(result.item);
  assert.notEqual(result.item.id, firstGiftCandidate.id);
  assert.notEqual(result.item.acquire.type, "default");
  assert.notEqual(result.item.acquire.type, "daily");
});

test("50회 완료로 얻은 아이템 선택권으로 원하는 아이템을 획득한다", () => {
  const target = ITEM_CATALOG.find((item) => item.acquire.type === "gift");
  assert.ok(target);
  const state = { ...empty(), cumulativeDone: CHOICE_INTERVAL };
  assert.equal(availableChoicePoints(state), CHOICE_COST);
  assert.equal(availableItemChoices(state), 1);
  const result = chooseItem109(state, target.id);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.state.ownedItemIds.includes(target.id), true);
  assert.equal(availableChoicePoints(result.state), 0);
});

test("아이템 선택권이 없거나 이미 가진 아이템은 선택할 수 없다", () => {
  const target = ITEM_CATALOG.find((item) => item.acquire.type === "gift");
  assert.ok(target);
  const insufficient = chooseItem109(empty(), target.id);
  assert.deepEqual(insufficient, { ok: false, reason: "points" });
  const owned = chooseItem109(
    { ...empty(), cumulativeDone: CHOICE_INTERVAL, ownedItemIds: [target.id] },
    target.id
  );
  assert.deepEqual(owned, { ok: false, reason: "owned" });
});

test("1.0.6 저장을 v3로 옮길 때 기존 소장품과 선택권 진행을 보존한다", () => {
  const migrated = normalizeDeskState({
    version: 1,
    cumulativeDone: 36,
    placements: { "floor-left": "autumn-cat" }
  });
  assert.equal(migrated.version, 3);
  assert.equal(migrated.ownedItemIds.includes("cat-tuxedo"), true);
  assert.equal(migrated.ownedItemIds.includes("summer-cat"), true);
  assert.equal(migrated.ownedItemIds.includes("autumn-cat"), true);
  assert.equal(migrated.openedGiftCount, 7);
  assert.equal(availableChoicePoints(migrated), 3);
});

test("v2의 미개봉 상자와 5회 주기 진행률을 v3의 7회 주기에 보존한다", () => {
  const migrated = normalizeDeskState({
    version: 2,
    cumulativeDone: 24,
    placements: {},
    ownedItemIds: [],
    openedGiftCount: 3,
    spentChoicePoints: 0
  });

  assert.equal(migrated.version, 3);
  assert.equal(pendingGiftCount(migrated), 1);
  assert.equal(nextGiftProgress(migrated), 6);
  assert.equal(
    pendingGiftCount(completeBreakReward109(migrated)),
    2,
    "기존 다음 상자까지 남은 한 번도 유지한다"
  );
});

test("기본 사용 패턴에서 전체 수집은 약 13.3개월이 걸린다", () => {
  const rewardableItemCount = ITEM_CATALOG.filter(
    (item) => item.acquire.type !== "default" && item.acquire.type !== "daily"
  ).length;
  const completionsPerWorkday = Math.floor(
    (DEFAULT_SETTINGS.endMin - DEFAULT_SETTINGS.startMin) /
      DEFAULT_SETTINGS.intervalMin
  );
  const averageDailyCompletions =
    (completionsPerWorkday * DEFAULT_SETTINGS.days.length) / 7;

  let completions = 0;
  while (
    earnedGiftCount(completions) +
      Math.floor(completions / CHOICE_INTERVAL) <
    rewardableItemCount
  ) {
    completions += 1;
  }

  const collectionDays = completions / averageDailyCompletions;
  const collectionMonths = collectionDays / (365 / 12);
  // 1.0.13 온천·코인 런드리·할로윈 42종 추가로 전체 수집은 약 13.3개월이 된다.
  assert.equal(rewardableItemCount, 423);
  assert.equal(completions, 2600);
  assert.ok(Math.abs(collectionMonths - 13.3) < 0.05);
});
