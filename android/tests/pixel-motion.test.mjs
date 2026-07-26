import assert from "node:assert/strict";
import test from "node:test";
import { createGiftParticles, giftParticleTrack } from "../src/pixel/pixelMotion.ts";

test("선물 파티클은 상자 id별로 재현 가능하고 모두 위쪽으로 출발한다", () => {
  const first = createGiftParticles("box-42");
  const replay = createGiftParticles("box-42");
  assert.deepEqual(first, replay);
  assert.equal(first.length, 18);
  assert.ok(first.every((particle) => particle.velocity.y < 0));
  assert.ok(first.some((particle) => particle.velocity.x < 0));
  assert.ok(first.some((particle) => particle.velocity.x > 0));
});

test("파티클 궤적은 2px 클러스터와 lifespan 페이드아웃을 지킨다", () => {
  for (const particle of createGiftParticles("preview")) {
    const track = giftParticleTrack(particle);
    assert.equal(track.inputRange.length, track.x.length);
    assert.equal(track.inputRange.length, track.y.length);
    assert.equal(track.inputRange.length, track.opacity.length);
    assert.ok(track.inputRange.every((value, index) => index === 0 || value > track.inputRange[index - 1]));
    assert.equal(track.opacity.at(-1), 0);
    assert.ok(track.x.every((value) => value % 2 === 0));
    assert.ok(track.y.every((value) => value % 2 === 0));
  }
});
