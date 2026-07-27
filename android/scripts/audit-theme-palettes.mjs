import { THEME_BACKGROUND_PALETTES } from "../src/pixel/themePalette109.ts";

const hexToRgb = (hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const rgbToLab = ([red, green, blue]) => {
  const linear = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  const x = (linear[0] * 0.4124 + linear[1] * 0.3576 + linear[2] * 0.1805) / 0.95047;
  const y = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  const z = (linear[0] * 0.0193 + linear[1] * 0.1192 + linear[2] * 0.9505) / 1.08883;
  const pivot = (value) =>
    value > 0.008856 ? value ** (1 / 3) : 7.787 * value + 16 / 116;
  const fx = pivot(x);
  const fy = pivot(y);
  const fz = pivot(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
};

const deltaE = (left, right) =>
  Math.sqrt(left.reduce((sum, value, index) => sum + (value - right[index]) ** 2, 0));

const entries = Object.entries(THEME_BACKGROUND_PALETTES).map(([theme, palette]) => ({
  theme,
  ...palette,
  lab: rgbToLab(hexToRgb(palette.hex))
}));

const pairs = entries
  .flatMap((left, index) =>
    entries.slice(index + 1).map((right) => ({
      left: left.theme,
      right: right.theme,
      deltaE: deltaE(left.lab, right.lab)
    }))
  )
  .sort((left, right) => left.deltaE - right.deltaE);

const nearest = Object.fromEntries(
  entries.map((entry) => {
    const pair = pairs.find(
      (candidate) => candidate.left === entry.theme || candidate.right === entry.theme
    );
    return [
      entry.theme,
      {
        token: entry.token,
        hex: entry.hex,
        nameKo: entry.nameKo,
        nearestTheme: pair.left === entry.theme ? pair.right : pair.left,
        deltaE: Number(pair.deltaE.toFixed(2))
      }
    ];
  })
);

const uniqueHexCount = new Set(entries.map((entry) => entry.hex.toLowerCase())).size;
const minimumDeltaE = pairs[0].deltaE;

console.log(
  JSON.stringify(
    {
      themeCount: entries.length,
      uniqueHexCount,
      minimumDeltaE: Number(minimumDeltaE.toFixed(2)),
      closestPairs: pairs.slice(0, 10).map((pair) => ({
        ...pair,
        deltaE: Number(pair.deltaE.toFixed(2))
      })),
      themes: nearest
    },
    null,
    2
  )
);

if (uniqueHexCount !== entries.length || minimumDeltaE < 15) {
  process.exitCode = 1;
}
