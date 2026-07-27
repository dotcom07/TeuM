import assert from "node:assert/strict";
import test from "node:test";

import { deployToGooglePlay } from "../scripts/deploy-google-play.mjs";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

test("uploads a bundle, completes the Alpha release, validates, and commits", async () => {
  const requests = [];
  const responses = [
    jsonResponse({ id: "edit-1" }),
    jsonResponse({ versionCode: 11 }),
    jsonResponse({ track: "alpha" }),
    jsonResponse({ id: "edit-1" }),
    jsonResponse({ id: "edit-1" })
  ];

  const result = await deployToGooglePlay({
    accessToken: "access-token",
    packageName: "com.teum.app",
    track: "alpha",
    aabPath: "/tmp/app.aab",
    releaseName: "1.0.10 자동 배포",
    releaseNotes: "자동 배포 테스트",
    readFileImpl: async () => Buffer.from("aab"),
    fetchImpl: async (url, options = {}) => {
      requests.push({ url, options });
      return responses.shift();
    }
  });

  assert.deepEqual(result, { editId: "edit-1", versionCode: "11" });
  assert.deepEqual(
    requests.map(({ options }) => options.method),
    ["POST", "POST", "PUT", "POST", "POST"]
  );
  assert.match(requests[1].url, /bundles\?uploadType=media$/);
  assert.match(requests[2].url, /tracks\/alpha$/);

  const trackBody = JSON.parse(requests[2].options.body);
  assert.deepEqual(trackBody.releases[0], {
    name: "1.0.10 자동 배포",
    versionCodes: ["11"],
    status: "completed",
    releaseNotes: [{ language: "ko-KR", text: "자동 배포 테스트" }]
  });
});

test("deletes the edit when deployment fails", async () => {
  const methods = [];

  await assert.rejects(
    deployToGooglePlay({
      accessToken: "access-token",
      packageName: "com.teum.app",
      track: "alpha",
      aabPath: "/tmp/app.aab",
      releaseName: "failed release",
      releaseNotes: "failed",
      readFileImpl: async () => Buffer.from("aab"),
      fetchImpl: async (_url, options = {}) => {
        methods.push(options.method);
        if (methods.length === 1) return jsonResponse({ id: "edit-2" });
        if (options.method === "DELETE") return new Response(null, { status: 204 });
        return jsonResponse({ error: { message: "upload rejected" } }, 400);
      }
    }),
    /Upload App Bundle failed/
  );

  assert.deepEqual(methods, ["POST", "POST", "DELETE"]);
});
