import assert from "node:assert/strict";
import test from "node:test";
import {
  screenAfterGift,
  shouldPresentGiftBox
} from "../src/lib/presentation.ts";

test("초기 알림 진입 판정 전에는 미개봉 선물을 표시하지 않는다", () => {
  assert.equal(shouldPresentGiftBox(false, "home", 1), false);
});

test("1분 화면에서는 미개봉 선물보다 알림을 우선한다", () => {
  assert.equal(shouldPresentGiftBox(true, "break", 1), false);
});

test("1분 화면 진입과 겹친 선물 완료는 화면을 도감으로 바꾸지 않는다", () => {
  assert.equal(screenAfterGift("break"), "break");
});

test("일반 화면에서 선물을 모두 열면 도감으로 이동한다", () => {
  assert.equal(shouldPresentGiftBox(true, "home", 1), true);
  assert.equal(screenAfterGift("home"), "desk");
});
