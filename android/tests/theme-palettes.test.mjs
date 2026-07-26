import assert from "node:assert/strict";
import test from "node:test";
import { THEME_ITEMS } from "../src/pixel/themeItems.ts";
import { ALL_THEME_ARTWORK, THEME_REWARD_RULES } from "../src/pixel/themeCatalog.ts";
import { THEME_PALETTES } from "../src/pixel/themePalettes.ts";

const ROLES = ["ink", "shadow", "background", "surface", "primary", "secondary", "accent"];
const BOUNDARY_ROLES = ["outline", "halo", "separator"];
const SIGNATURE_ROLES = ["background", "primary", "secondary", "accent"];

const rgb = (hex) => [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
const distance = (left, right) =>
  Math.sqrt(left.reduce((sum, value, index) => sum + (value - right[index]) ** 2, 0));
const linear = (value) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};
const contrast = (left, right) => {
  const luminance = (hex) => {
    const [red, green, blue] = rgb(hex).map(linear);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const a = luminance(left);
  const b = luminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

test("26개 방마다 완전한 전용 팔레트가 있다", () => {
  const expected = new Set(["rival", "summer", "autumn", ...THEME_REWARD_RULES.map((rule) => rule.key)]);
  assert.deepEqual(new Set(Object.keys(THEME_PALETTES)), expected);

  for (const theme of Object.values(THEME_PALETTES)) {
    assert.equal(theme.tokenRoles[theme.backgroundToken], "background", `${theme.key}: background token`);
    for (const role of ROLES) {
      assert.match(theme.colors[role], /^#[0-9A-F]{6}$/i, `${theme.key}.${role}`);
      assert.equal(
        Object.values(theme.tokenRoles).includes(role),
        true,
        `${theme.key}: ${role} 역할 토큰 없음`
      );
    }
    for (const role of BOUNDARY_ROLES) {
      assert.match(theme.boundary[role], /^#[0-9A-F]{6}$/i, `${theme.key}.boundary.${role}`);
      assert.notEqual(
        theme.boundary[role].toUpperCase(),
        theme.colors.background.toUpperCase(),
        `${theme.key}.${role}: 배경과 동일`
      );
    }
    assert.ok(
      contrast(theme.boundary.outline, theme.boundary.halo) >= 3,
      `${theme.key}: outline/halo 대비`
    );
  }
});

test("테마 소유 색상 코드는 정확히 재사용하지 않는다", () => {
  const owners = new Map();
  for (const theme of Object.values(THEME_PALETTES)) {
    for (const [role, color] of [
      ...Object.entries(theme.colors),
      ...Object.entries(theme.boundary).map(([role, color]) => [`boundary.${role}`, color])
    ]) {
      const normalized = color.toUpperCase();
      const previous = owners.get(normalized);
      assert.equal(previous, undefined, `${normalized}: ${previous} / ${theme.key}.${role}`);
      owners.set(normalized, `${theme.key}.${role}`);
    }
  }
});

test("테마 시그니처 색 조합은 서로 충분히 떨어져 있다", () => {
  const themes = Object.values(THEME_PALETTES);
  for (let leftIndex = 0; leftIndex < themes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < themes.length; rightIndex += 1) {
      const left = themes[leftIndex];
      const right = themes[rightIndex];
      const average =
        SIGNATURE_ROLES.reduce(
          (sum, role) => sum + distance(rgb(left.colors[role]), rgb(right.colors[role])),
          0
        ) / SIGNATURE_ROLES.length;
      assert.ok(average >= 45, `${left.key}/${right.key}: signature distance ${average.toFixed(1)}`);
    }
  }
});

test("각 방의 배경·주조·보조색이 실제 도트에 반복 사용된다", () => {
  const artwork = [
    ...ALL_THEME_ARTWORK,
    {
      key: "rival",
      items: THEME_ITEMS.filter((item) => item.id.startsWith("cat-")).map((item) => ({
        rows: item.frames.base
      }))
    },
    {
      key: "summer",
      items: THEME_ITEMS.filter((item) => item.id.startsWith("summer-")).map((item) => ({
        rows: item.frames.base
      }))
    },
    {
      key: "autumn",
      items: THEME_ITEMS.filter((item) => item.id.startsWith("autumn-")).map((item) => ({
        rows: item.frames.base
      }))
    }
  ];

  for (const theme of artwork) {
    const palette = THEME_PALETTES[theme.key];
    const counts = { background: 0, primary: 0, secondary: 0 };
    for (const item of theme.items) {
      for (const row of item.rows) {
        for (const token of row) {
          const role = palette.tokenRoles[token];
          if (role in counts) counts[role] += 1;
        }
      }
    }
    assert.ok(counts.background >= 500, `${theme.key}: background ${counts.background}px`);
    assert.ok(counts.primary >= 10, `${theme.key}: primary ${counts.primary}px`);
    assert.ok(counts.secondary >= 10, `${theme.key}: secondary ${counts.secondary}px`);
  }
});
