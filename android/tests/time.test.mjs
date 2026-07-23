import assert from "node:assert/strict";
import test from "node:test";
import {
  isWithinWork,
  nextTickFrom,
  nextTickFromWorkStart
} from "../src/lib/time.ts";

const base = {
  startMin: 9 * 60,
  endMin: 18 * 60,
  days: [1, 2, 3, 4, 5],
  intervalMin: 60,
  mode: "silent",
  headsUp: true,
  notificationsOn: true,
  recordMode: true
};

const at = (year, month, day, hour, minute = 0) =>
  new Date(year, month - 1, day, hour, minute, 0, 0).getTime();

test("업무 시작 전 설정하면 업무 시작 + 간격이 첫 알림이다", () => {
  assert.equal(
    nextTickFromWorkStart(at(2024, 1, 1, 8, 30), base),
    at(2024, 1, 1, 10)
  );
});

test("업무 중 설정해도 시작 시각에 정렬된 다음 슬롯을 고른다", () => {
  assert.equal(
    nextTickFromWorkStart(at(2024, 1, 1, 11, 15), base),
    at(2024, 1, 1, 12)
  );
});

test("슬롯과 정확히 같은 시각에는 그 다음 슬롯을 고른다", () => {
  assert.equal(
    nextTickFromWorkStart(at(2024, 1, 1, 10), base),
    at(2024, 1, 1, 11)
  );
});

test("업무 종료 뒤에는 다음 업무일 시작 + 간격으로 이동한다", () => {
  assert.equal(
    nextTickFromWorkStart(at(2024, 1, 5, 18, 30), base),
    at(2024, 1, 8, 10)
  );
});

test("완료 시점 기준 다음 간격이 업무 종료를 넘으면 다음 업무일 시작 + 간격이다", () => {
  assert.equal(
    nextTickFrom(at(2024, 1, 1, 17, 30), base),
    at(2024, 1, 2, 10)
  );
});

test("24시간 간격도 업무 시작 기준으로 다음 업무일에 예약된다", () => {
  const daily = { ...base, intervalMin: 24 * 60 };
  assert.equal(
    nextTickFromWorkStart(at(2024, 1, 1, 8, 30), daily),
    at(2024, 1, 2, 9)
  );
});

test("업무 구간보다 긴 간격이 업무 밖에 떨어지면 다음 업무 시작으로 이동한다", () => {
  const halfDay = { ...base, intervalMin: 12 * 60 };
  assert.equal(
    nextTickFromWorkStart(at(2024, 1, 1, 8, 30), halfDay),
    at(2024, 1, 2, 9)
  );
});

test("선택하지 않은 요일은 업무 시간으로 보지 않는다", () => {
  assert.equal(isWithinWork(at(2024, 1, 6, 10), base), false);
});
