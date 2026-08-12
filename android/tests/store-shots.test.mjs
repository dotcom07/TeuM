import assert from "node:assert/strict";
import test from "node:test";
import {
  storeShotFixture,
  STORE_SHOT_NOW
} from "../src/storeShots.ts";

test("홈 스토어 촬영 fixture는 25분 뒤 알람과 오늘 6회 기록을 고정한다", () => {
  const fixture = storeShotFixture("home");
  assert.equal(fixture.now, STORE_SHOT_NOW);
  assert.equal(fixture.persisted.rhythm.nextTickAt - fixture.now, 25 * 60_000);
  const today = fixture.records.filter((record) => new Date(record.resolvedAt).getDate() === 12);
  assert.equal(today.length, 6);
  assert.ok(today.every((record) => record.result === "done"));
});

test("홈 스토어 촬영 fixture에는 미개봉 선물상자가 없다", () => {
  const { desk } = storeShotFixture("home");
  assert.equal(Math.floor(desk.cumulativeDone / 7), desk.openedGiftCount);
});

test("장면별 촬영 fixture는 실제 앱 화면과 고정 결과를 선택한다", () => {
  assert.equal(storeShotFixture("settings").screen, "settings");
  assert.equal(storeShotFixture("break").breakSecondsLeft, 42);
  assert.equal(storeShotFixture("gift").giftItemId, "sky-pet");
  assert.equal(storeShotFixture("collection").deskMode, "collection");
  assert.ok(Object.keys(storeShotFixture("desk").desk.placements).length >= 10);
});
