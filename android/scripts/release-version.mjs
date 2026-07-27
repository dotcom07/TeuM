import { appendFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function releaseVersionFromTag(tag) {
  const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(tag);
  if (!match) {
    throw new Error(`Release tag must match vMAJOR.MINOR.PATCH: ${tag}`);
  }

  const [, majorText, minorText, patchText] = match;
  const major = Number(majorText);
  const minor = Number(minorText);
  const patch = Number(patchText);

  if (minor >= 1000 || patch >= 1000) {
    throw new Error("Minor and patch versions must be below 1000.");
  }

  const versionCode = major * 1_000_000 + minor * 1_000 + patch;
  if (!Number.isSafeInteger(versionCode) || versionCode < 11 || versionCode > 2_100_000_000) {
    throw new Error(`Generated Android versionCode is out of range: ${versionCode}`);
  }

  return {
    versionName: `${major}.${minor}.${patch}`,
    versionCode
  };
}

async function main() {
  const tag = process.argv[2];
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!tag || !outputPath) {
    throw new Error("Usage: GITHUB_OUTPUT=<path> node release-version.mjs <tag>");
  }

  const release = releaseVersionFromTag(tag);
  await appendFile(
    outputPath,
    `version-name=${release.versionName}\nversion-code=${release.versionCode}\n`,
    "utf8"
  );
  console.log(`Android release ${release.versionName} (${release.versionCode})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
