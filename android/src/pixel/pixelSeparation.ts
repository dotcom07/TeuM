import { pixelColor, themePaletteFor } from "./themePalettes.ts";

export interface ColoredPixelRun {
  x: number;
  y: number;
  w: number;
  /** 합성 장면에서는 같은 가로 run을 세로로도 합친다. 단독 glyph는 1이다. */
  h?: number;
  color: string;
}

export type BoundaryMode = "none" | "adaptive";

export interface PixelLayer {
  id: string;
  rows: string[];
  x: number;
  y: number;
  themeKey?: string;
  /** 벽지·바닥은 none, 나머지 아이템은 adaptive를 쓴다. */
  boundaryMode?: BoundaryMode;
}

export interface ComposedPixel {
  color: string;
  owner: string;
  kind: "art" | "separator";
}

const CARDINALS = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1]
] as const;

const DIAGONALS = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1]
] as const;

function rgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)) as [
    number,
    number,
    number
  ];
}

export function colorDistance(left: string, right: string): number {
  const a = rgb(left);
  const b = rgb(right);
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

function linearChannel(value: number): number {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(left: string, right: string): number {
  const luminance = (hex: string) => {
    const [red, green, blue] = rgb(hex).map(linearChannel);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const a = luminance(left);
  const b = luminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function uniqueColors(colors: readonly (string | undefined)[]): string[] {
  return [
    ...new Set(
      colors
        .filter((color): color is string => Boolean(color))
        .map((color) => color.toUpperCase())
    )
  ];
}

function separatorCandidateGroups(themeKey?: string): {
  primary: string[];
  emergency: string[];
  fallback: string[];
} {
  const palette = themePaletteFor(themeKey);
  if (!palette) {
    return {
      primary: ["#111722", "#FFFDF7"],
      emergency: ["#F3C44E", "#64D4E4"],
      fallback: ["#000000", "#FFFFFF"]
    };
  }

  // boundary는 팔레트에서 명시한다. 검정·흰색은 테마색만으로 3:1을 만들 수 없을 때의 안전망이다.
  const boundary = palette.boundary;
  return {
    primary: uniqueColors([boundary.outline, boundary.halo]),
    emergency: [boundary.separator],
    fallback: ["#000000", "#FFFFFF"]
  };
}

function minimumContrast(candidate: string, references: readonly string[]): number {
  return Math.min(...references.map((reference) => contrastRatio(candidate, reference)));
}

function minimumDistance(candidate: string, references: readonly string[]): number {
  return Math.min(...references.map((reference) => colorDistance(candidate, reference)));
}

/**
 * 테마 outline/halo 중 외부색 모두와 3:1 이상인 후보를 먼저 고른다.
 * 동시에 밝고 어두운 색이 맞닿아 불가능할 때 separator, 마지막에 검정·흰색으로
 * 단계적으로 물러난다. 어느 경우에도 외부와 같은 HEX는 고르지 않는다.
 */
export function separationColorFor(
  themeKey: string | undefined,
  itemId: string,
  against: readonly string[],
  interior: readonly string[] = []
): string {
  const references = uniqueColors(against.length > 0 ? against : ["#808080"]);
  const interiorColors = uniqueColors(interior);
  const groups = separatorCandidateGroups(themeKey);
  const rotate = (candidates: readonly string[]) => {
    const usable = candidates.filter((candidate) => !references.includes(candidate));
    if (usable.length === 0) return [];
    const offset = hash(itemId) % usable.length;
    return [...usable.slice(offset), ...usable.slice(0, offset)];
  };
  const primary = rotate(groups.primary);
  const emergency = rotate(groups.emergency);
  const fallback = rotate(groups.fallback);
  const hasHardContrast = (candidate: string) => minimumContrast(candidate, references) >= 3;
  const isPerceptuallySeparated = (candidate: string) =>
    references.every(
      (reference) =>
        contrastRatio(candidate, reference) >= 3 || colorDistance(candidate, reference) >= 72
    );
  const pool =
    primary.filter(hasHardContrast).length > 0
      ? primary.filter(hasHardContrast)
      : primary.filter(isPerceptuallySeparated).length > 0
        ? primary.filter(isPerceptuallySeparated)
        : emergency.filter(hasHardContrast).length > 0
          ? emergency.filter(hasHardContrast)
          : emergency.filter(isPerceptuallySeparated).length > 0
            ? emergency.filter(isPerceptuallySeparated)
            : fallback.filter(hasHardContrast).length > 0
              ? fallback.filter(hasHardContrast)
              : fallback.filter(isPerceptuallySeparated).length > 0
                ? fallback.filter(isPerceptuallySeparated)
                : [...primary, ...emergency, ...fallback];

  let best = pool[0];
  let bestScore = -Infinity;
  for (const candidate of pool) {
    const exteriorContrast = minimumContrast(candidate, references);
    const exteriorDistance = minimumDistance(candidate, references);
    const interiorDistance =
      interiorColors.length > 0 ? minimumDistance(candidate, interiorColors) : exteriorDistance;
    const score = exteriorContrast * 100 + exteriorDistance + interiorDistance * 0.35;
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

function isOpaque(rows: string[], x: number, y: number): boolean {
  return (
    y >= 0 &&
    y < rows.length &&
    x >= 0 &&
    x < rows[y].length &&
    rows[y][x] !== "." &&
    rows[y][x] !== " "
  );
}

/**
 * C를 벽 배경으로 쓰는 음악실·오락실에서도 전경 아이템의 전통적인 C 외곽선은
 * 실제 ink로 복원한다. 배경 레이어는 compose 단계에서 이 함수를 쓰지 않는다.
 */
function foregroundPixelColor(token: string, themeKey?: string): string | undefined {
  const palette = themePaletteFor(themeKey);
  if (palette && token === "C" && palette.backgroundToken === "C") {
    return palette.colors.ink;
  }
  return pixelColor(token, themeKey);
}

export function isBoundaryPixel(rows: string[], x: number, y: number): boolean {
  return (
    isOpaque(rows, x, y) &&
    CARDINALS.some(([dx, dy]) => !isOpaque(rows, x + dx, y + dy))
  );
}

function cellsToRuns(
  cells: Array<{ x: number; y: number; color: string }>
): ColoredPixelRun[] {
  const rows = new Map<number, Array<{ x: number; color: string }>>();
  for (const cell of cells) {
    const row = rows.get(cell.y) ?? [];
    row.push({ x: cell.x, color: cell.color });
    rows.set(cell.y, row);
  }

  const runs: ColoredPixelRun[] = [];
  for (const [y, row] of [...rows.entries()].sort(([left], [right]) => left - right)) {
    row.sort((left, right) => left.x - right.x);
    let start = 0;
    while (start < row.length) {
      const first = row[start];
      let end = start + 1;
      while (
        end < row.length &&
        row[end].x === row[end - 1].x + 1 &&
        row[end].color === first.color
      ) {
        end += 1;
      }
      runs.push({ x: first.x, y, w: row[end - 1].x - first.x + 1, color: first.color });
      start = end;
    }
  }
  return runs;
}

function sourceInteriorColors(
  rows: string[],
  x: number,
  y: number,
  themeKey?: string
): string[] {
  return uniqueColors(
    CARDINALS.flatMap(([dx, dy]) => {
      const nextX = x + dx;
      const nextY = y + dy;
      if (!isOpaque(rows, nextX, nextY)) return [];
      const color = foregroundPixelColor(rows[nextY][nextX], themeKey);
      return color ? [color] : [];
    })
  );
}

function needsSeparation(color: string, outside: readonly string[]): boolean {
  return outside.some(
    (other) => color.toUpperCase() === other.toUpperCase() || contrastRatio(color, other) < 3
  );
}

/**
 * 도감·선물상자처럼 아이템 하나만 그릴 때 사용한다. 실루엣 밖으로 부풀리지 않고
 * 배경과 충돌하는 내부 외곽 픽셀만 테마 경계색으로 바꾼다.
 */
export function separatedGlyphRuns(
  rows: string[],
  themeKey: string | undefined,
  itemId: string,
  backgroundColor?: string
): ColoredPixelRun[] {
  const background =
    backgroundColor ?? themePaletteFor(themeKey)?.colors.background ?? "#F4F4F4";
  const cells: Array<{ x: number; y: number; color: string }> = [];

  rows.forEach((row, y) => {
    [...row].forEach((token, x) => {
      if (!isOpaque(rows, x, y)) return;
      const original = foregroundPixelColor(token, themeKey);
      if (!original) return;
      const color =
        isBoundaryPixel(rows, x, y) && needsSeparation(original, [background])
          ? separationColorFor(
              themeKey,
              `${itemId}:${x},${y}`,
              [background],
              sourceInteriorColors(rows, x, y, themeKey)
            )
          : original;
      cells.push({ x, y, color });
    });
  });
  return cellsToRuns(cells);
}

function gridColor(
  grid: Array<Array<ComposedPixel | null>>,
  x: number,
  y: number
): string | undefined {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length
    ? grid[y][x]?.color
    : undefined;
}

function outsideColorsFor(
  grid: Array<Array<ComposedPixel | null>>,
  layer: PixelLayer,
  sourceX: number,
  sourceY: number
): string[] {
  const sceneX = layer.x + sourceX;
  const sceneY = layer.y + sourceY;
  const colors: Array<string | undefined> = [];

  for (const [dx, dy] of CARDINALS) {
    if (isOpaque(layer.rows, sourceX + dx, sourceY + dy)) continue;
    colors.push(gridColor(grid, sceneX + dx, sceneY + dy));
  }

  // 대각선은 같은 HEX 연결만 끊는 보조 검사다. 4방향 대비 선택을 흐리지 않도록
  // 정확히 같은 원색일 때만 후보의 against에 포함한다.
  const original = foregroundPixelColor(layer.rows[sourceY][sourceX], layer.themeKey);
  for (const [dx, dy] of DIAGONALS) {
    if (isOpaque(layer.rows, sourceX + dx, sourceY + dy)) continue;
    const diagonal = gridColor(grid, sceneX + dx, sceneY + dy);
    if (diagonal && diagonal.toUpperCase() === original?.toUpperCase()) colors.push(diagonal);
  }

  if (colors.every((color) => !color)) {
    // 같은 좌표의 밑 레이어는 현재 아이템에 완전히 가려지므로, 바깥 이웃이 없을 때만
    // 안전한 기준색으로 쓴다.
    colors.push(
      gridColor(grid, sceneX, sceneY),
      themePaletteFor(layer.themeKey)?.colors.background
    );
  }
  return uniqueColors(colors);
}

/**
 * 320×180 장면을 owner 정보와 함께 먼저 합성한다.
 * adaptive 레이어는 기존 픽셀을 덮는 외부 halo 대신 자기 실루엣의 내부 경계만 바꾼다.
 */
export function composePixelGrid(
  width: number,
  height: number,
  layers: readonly PixelLayer[]
): Array<Array<ComposedPixel | null>> {
  const grid: Array<Array<ComposedPixel | null>> = Array.from({ length: height }, () =>
    Array(width).fill(null)
  );

  for (const layer of layers) {
    const pending: Array<{ x: number; y: number; pixel: ComposedPixel }> = [];
    layer.rows.forEach((row, sourceY) => {
      [...row].forEach((token, sourceX) => {
        if (!isOpaque(layer.rows, sourceX, sourceY)) return;
        const x = layer.x + sourceX;
        const y = layer.y + sourceY;
        if (x < 0 || x >= width || y < 0 || y >= height) return;
        const original =
          (layer.boundaryMode ?? "adaptive") === "adaptive"
            ? foregroundPixelColor(token, layer.themeKey)
            : pixelColor(token, layer.themeKey);
        if (!original) return;

        const adaptive = (layer.boundaryMode ?? "adaptive") === "adaptive";
        const outside =
          adaptive && isBoundaryPixel(layer.rows, sourceX, sourceY)
            ? outsideColorsFor(grid, layer, sourceX, sourceY)
            : [];
        const separated = outside.length > 0 && needsSeparation(original, outside);
        const color = separated
          ? separationColorFor(
              layer.themeKey,
              `${layer.id}:${sourceX},${sourceY}`,
              outside,
              sourceInteriorColors(layer.rows, sourceX, sourceY, layer.themeKey)
            )
          : original;
        pending.push({
          x,
          y,
          pixel: {
            color,
            owner: layer.id,
            kind: separated ? "separator" : "art"
          }
        });
      });
    });

    for (const { x, y, pixel } of pending) grid[y][x] = pixel;
  }
  return grid;
}

export function composedGridToRuns(
  grid: Array<Array<ComposedPixel | null>>
): ColoredPixelRun[] {
  const horizontal = cellsToRuns(
    grid.flatMap((row, y) =>
      row.flatMap((pixel, x) => (pixel ? [{ x, y, color: pixel.color }] : []))
    )
  );
  const merged: ColoredPixelRun[] = [];
  const open = new Map<string, ColoredPixelRun>();

  for (const run of horizontal) {
    const key = `${run.x}:${run.w}:${run.color}`;
    const previous = open.get(key);
    if (previous && previous.y + (previous.h ?? 1) === run.y) {
      previous.h = (previous.h ?? 1) + 1;
      continue;
    }
    const next = { ...run, h: 1 };
    merged.push(next);
    open.set(key, next);
  }
  return merged;
}

export function composePixelRuns(
  width: number,
  height: number,
  layers: readonly PixelLayer[]
): ColoredPixelRun[] {
  return composedGridToRuns(composePixelGrid(width, height, layers));
}
