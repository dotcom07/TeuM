import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const API_ROOT = "https://androidpublisher.googleapis.com/androidpublisher/v3";
const UPLOAD_ROOT = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3";

function required(value, name) {
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

async function responseJson(response, label) {
  const text = await response.text();
  let body = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    const message = body?.error?.message || body?.message || response.statusText;
    throw new Error(`${label} failed (${response.status}): ${message}`);
  }
  return body;
}

export async function deployToGooglePlay({
  accessToken,
  packageName,
  track,
  aabPath,
  releaseName,
  releaseNotes,
  fetchImpl = fetch,
  readFileImpl = readFile
}) {
  required(accessToken, "accessToken");
  required(packageName, "packageName");
  required(track, "track");
  required(aabPath, "aabPath");
  required(releaseName, "releaseName");
  required(releaseNotes, "releaseNotes");

  const encodedPackage = encodeURIComponent(packageName);
  const headers = { Authorization: `Bearer ${accessToken}` };
  let editId;

  try {
    const edit = await responseJson(
      await fetchImpl(`${API_ROOT}/applications/${encodedPackage}/edits`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: "{}"
      }),
      "Create edit"
    );
    editId = required(edit.id, "edit.id");

    const bundleBytes = await readFileImpl(aabPath);
    const bundle = await responseJson(
      await fetchImpl(
        `${UPLOAD_ROOT}/applications/${encodedPackage}/edits/${encodeURIComponent(editId)}/bundles?uploadType=media`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/octet-stream" },
          body: bundleBytes
        }
      ),
      "Upload App Bundle"
    );
    const versionCode = String(required(bundle.versionCode, "bundle.versionCode"));

    await responseJson(
      await fetchImpl(
        `${API_ROOT}/applications/${encodedPackage}/edits/${encodeURIComponent(editId)}/tracks/${encodeURIComponent(track)}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            track,
            releases: [
              {
                name: releaseName,
                versionCodes: [versionCode],
                status: "completed",
                releaseNotes: [{ language: "ko-KR", text: releaseNotes.trim() }]
              }
            ]
          })
        }
      ),
      "Update track"
    );

    await responseJson(
      await fetchImpl(
        `${API_ROOT}/applications/${encodedPackage}/edits/${encodeURIComponent(editId)}:validate`,
        { method: "POST", headers }
      ),
      "Validate edit"
    );

    await responseJson(
      await fetchImpl(
        `${API_ROOT}/applications/${encodedPackage}/edits/${encodeURIComponent(editId)}:commit`,
        { method: "POST", headers }
      ),
      "Commit edit"
    );

    console.log(`Google Play ${track}: ${releaseName} (${versionCode}) deployed.`);
    return { editId, versionCode };
  } catch (error) {
    if (editId) {
      try {
        await fetchImpl(
          `${API_ROOT}/applications/${encodedPackage}/edits/${encodeURIComponent(editId)}`,
          { method: "DELETE", headers }
        );
      } catch {
        // The original deployment error is more useful than cleanup failure.
      }
    }
    throw error;
  }
}

async function main() {
  const releaseNotes = await readFile(
    required(process.env.PLAY_RELEASE_NOTES_FILE, "PLAY_RELEASE_NOTES_FILE"),
    "utf8"
  );

  await deployToGooglePlay({
    accessToken: process.env.PLAY_ACCESS_TOKEN,
    packageName: process.env.PLAY_PACKAGE_NAME,
    track: process.env.PLAY_TRACK,
    aabPath: process.env.PLAY_AAB_PATH,
    releaseName: process.env.PLAY_RELEASE_NAME,
    releaseNotes
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
