import assert from "node:assert/strict";
import test from "node:test";
import { groupOfItem, itemById, STRUCTURAL_SLOTS } from "../src/pixel/catalog.ts";
import {
  EASTER_EGG_ITEMS,
  EXTRA_CAT_ITEMS,
  NEW_THEME_ITEMS,
  STORE_BREED_CAT_ITEMS,
  STORE_THEME_CAT_ITEMS,
  THEME_REWARD_RULES
} from "../src/pixel/themeCatalog.ts";
import {
  completeBreakReward,
  createRewardBox,
  discoverCompletionEggs,
  discoverSettingsEggs,
  isBoxMilestone,
  isInDateWindow,
  rewardCandidates
} from "../src/pixel/rewards.ts";

const state = (partial = {}) => ({
  version: 2,
  cumulativeDone: 1,
  placements: {},
  ownedItemIds: [],
  rewardSeed: "test-user-seed",
  nextBoxIndex: 0,
  pendingBoxes: [],
  discoveredEggIds: [],
  ...partial
});

const localDate = (year, month, day, hour = 12, minute = 0) =>
  new Date(year, month - 1, day, hour, minute, 0, 0);

test("23개 테마 322개, 기존 고양이 16개, 클래식 고양이 41개, 이스터에그 8개가 카탈로그에 있다", () => {
  assert.equal(THEME_REWARD_RULES.length, 23);
  assert.equal(NEW_THEME_ITEMS.length, 322);
  assert.equal(EXTRA_CAT_ITEMS.length, 16);
  assert.equal(STORE_THEME_CAT_ITEMS.length, 26);
  assert.equal(STORE_BREED_CAT_ITEMS.length, 15);
  assert.equal(EASTER_EGG_ITEMS.length, 8);
  assert.equal(NEW_THEME_ITEMS.filter((item) => item.acquire.limited).length, 69);
  for (const item of [
    ...NEW_THEME_ITEMS,
    ...EXTRA_CAT_ITEMS,
    ...STORE_THEME_CAT_ITEMS,
    ...STORE_BREED_CAT_ITEMS,
    ...EASTER_EGG_ITEMS
  ]) {
    assert.equal(itemById(item.id)?.id, item.id);
  }
});

test("연말을 넘기는 겨울·꿈 기간을 현지 날짜로 판정한다", () => {
  const winter = THEME_REWARD_RULES.find((rule) => rule.key === "winter").limitedWindow;
  const dream = THEME_REWARD_RULES.find((rule) => rule.key === "dream").limitedWindow;
  assert.equal(isInDateWindow(localDate(2026, 12, 2), winter), true);
  assert.equal(isInDateWindow(localDate(2027, 2, 28), winter), true);
  assert.equal(isInDateWindow(localDate(2027, 3, 1), winter), false);
  assert.equal(isInDateWindow(localDate(2026, 12, 26), dream), true);
  assert.equal(isInDateWindow(localDate(2027, 1, 15), dream), true);
  assert.equal(isInDateWindow(localDate(2027, 1, 16), dream), false);
});

test("일반 아이템은 테마 개방 뒤 연중, 별표 아이템은 기간 안에서만 후보가 된다", () => {
  const april = rewardCandidates(1, [], localDate(2026, 4, 15));
  const january = rewardCandidates(1, [], localDate(2026, 1, 15));
  assert.equal(april.some((item) => item.id === "spring-wallpaper"), true);
  assert.equal(january.some((item) => item.id === "spring-wallpaper"), false);
  assert.equal(january.some((item) => item.id === "spring-flooring"), true);
  assert.equal(january.some((item) => item.id === "winter-flooring"), false);
});

test("추가 고양이 품종은 누적 구간에 따라 랜덤 풀에 순차 진입한다", () => {
  const early = rewardCandidates(8, [], localDate(2026, 4, 15));
  const late = rewardCandidates(400, [], localDate(2026, 4, 15));
  assert.equal(early.some((item) => item.id === "cat-chubby"), true);
  assert.equal(early.some((item) => item.id === "cat-maine-coon"), false);
  assert.equal(late.some((item) => item.id === "cat-sphynx"), true);
  assert.equal(late.some((item) => item.id === "classic-cat-sphynx"), true);
});

test("26개 테마 클래식냥이는 해당 테마 개방 구간에 랜덤 풀로 들어간다", () => {
  const early = rewardCandidates(1, [], localDate(2026, 4, 15));
  const late = rewardCandidates(90, [], localDate(2026, 4, 15));
  assert.equal(early.some((item) => item.id === "classic-theme-spring-cat"), true);
  assert.equal(early.some((item) => item.id === "classic-theme-dream-cat"), false);
  assert.equal(late.some((item) => item.id === "classic-theme-dream-cat"), true);
});

test("상자 간격은 2·3·4·5회 구간 규칙을 따른다", () => {
  for (const count of [2, 4, 6, 8, 10, 12, 15, 18, 60, 64, 180, 185]) {
    assert.equal(isBoxMilestone(count), true, String(count));
  }
  for (const count of [1, 3, 13, 14, 61, 62, 181, 182]) {
    assert.equal(isBoxMilestone(count), false, String(count));
  }
});

test("같은 시드와 상자 번호는 같은 3개를 뽑고 슬롯 그룹·구조 아이템을 중복하지 않는다", () => {
  const source = state({ cumulativeDone: 90 });
  const first = createRewardBox(source, localDate(2026, 12, 10).getTime());
  const second = createRewardBox(source, localDate(2026, 12, 10).getTime());
  assert.deepEqual(first?.itemIds, second?.itemIds);
  assert.equal(first?.itemIds.length, 3);
  const items = first.itemIds.map((id) => itemById(id));
  const groups = items.map((item) => groupOfItem(item)?.key);
  assert.equal(new Set(groups).size, groups.length);
  assert.ok(items.filter((item) => item.slots.some((slot) => STRUCTURAL_SLOTS.has(slot))).length <= 1);
});

test("완료 시 상자 내용을 큐와 소장 목록에 즉시 고정한다", () => {
  const result = completeBreakReward(state(), localDate(2026, 4, 15).getTime());
  assert.equal(result.state.cumulativeDone, 2);
  assert.equal(result.state.pendingBoxes.length, 1);
  assert.equal(result.state.nextBoxIndex, 1);
  assert.deepEqual(result.state.pendingBoxes[0].itemIds, result.box.itemIds);
  result.box.itemIds.forEach((id) => assert.equal(result.state.ownedItemIds.includes(id), true));
});

test("설정·완료 이스터에그는 한 번만 발견되고 소장 목록에 들어간다", () => {
  const settings = discoverSettingsEggs(state(), 9 * 60 + 9, 18 * 60 + 18);
  assert.deepEqual(settings.found.sort(), ["egg-0909-1818-train", "egg-1818-exit"]);
  const completion = discoverCompletionEggs(
    settings.state,
    localDate(2028, 2, 29, 11, 11).getTime(),
    7,
    true
  );
  assert.deepEqual(
    completion.found.sort(),
    ["egg-1111-ticket", "egg-leap-frog", "egg-seven-rainbow", "egg-snooze-snail"].sort()
  );
  const again = discoverCompletionEggs(completion.state, localDate(2028, 2, 29, 11, 11).getTime(), 7, true);
  assert.deepEqual(again.found, []);
});
