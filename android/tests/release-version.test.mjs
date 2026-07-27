import assert from "node:assert/strict";
import test from "node:test";

import { releaseVersionFromTag } from "../scripts/release-version.mjs";

test("semantic release tag generates an increasing Android version", () => {
  assert.deepEqual(releaseVersionFromTag("v1.0.10"), {
    versionName: "1.0.10",
    versionCode: 1_000_010
  });
  assert.deepEqual(releaseVersionFromTag("v2.3.4"), {
    versionName: "2.3.4",
    versionCode: 2_003_004
  });
});

test("invalid or unsafe release tags are rejected", () => {
  assert.throws(() => releaseVersionFromTag("1.0.10"), /vMAJOR/);
  assert.throws(() => releaseVersionFromTag("v1.1000.0"), /below 1000/);
  assert.throws(() => releaseVersionFromTag("v0.0.10"), /out of range/);
});
