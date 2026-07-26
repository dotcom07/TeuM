export const LEGACY_ART_W = 64;
export const LEGACY_ART_H = 40;

/** 1.0.6까지 사용한 중간 제작 그리드. 기존 원화 좌표를 보존하는 입력 규격이다. */
export const SOURCE_ART_W = 72;
export const SOURCE_ART_H = 45;
export const SOURCE_DENSITY_RATIO = 9 / 8;

/** 16:9 고밀도 장면의 실제 논리 해상도. */
export const ART_W = 320;
export const ART_H = 180;

/** 72×45 원화를 4배 확대하면 288×180이며, 좌우 16px을 방 여백으로 둔다. */
export const SCENE_CONTENT_SCALE = 4;
export const SCENE_CONTENT_X = (ART_W - SOURCE_ART_W * SCENE_CONTENT_SCALE) / 2;

/** 펫은 Scale2x 결과의 각 픽셀을 3×3 클러스터로 만들어 약 54×66으로 표시한다. */
export const PET_CLUSTER_SCALE = 3;
export const PROP_CLUSTER_SCALE = 2;

/** 표준 Scale2x 코너 규칙으로 한 픽셀 계단을 더 자연스럽게 세분화한다. */
export function scale2x(rows: string[]): string[][] {
  const source = rows.map((row) => [...row]);
  const height = source.length;
  const width = source[0].length;
  const output = Array.from({ length: height * 2 }, () => Array(width * 2).fill("."));
  const at = (x: number, y: number) =>
    source[Math.max(0, Math.min(height - 1, y))][Math.max(0, Math.min(width - 1, x))];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const north = at(x, y - 1);
      const west = at(x - 1, y);
      const center = at(x, y);
      const east = at(x + 1, y);
      const south = at(x, y + 1);
      output[y * 2][x * 2] =
        west === north && west !== south && north !== east ? west : center;
      output[y * 2][x * 2 + 1] =
        north === east && north !== west && east !== south ? east : center;
      output[y * 2 + 1][x * 2] =
        west === south && west !== north && south !== east ? west : center;
      output[y * 2 + 1][x * 2 + 1] =
        south === east && west !== south && north !== east ? east : center;
    }
  }
  return output;
}

/** 64×40 제작 원화를 기존 72×45 중간 좌표계로 변환한다. */
export function densifySourceRows(rows: string[]): string[] {
  if (rows.length === 0 || rows[0].length === 0) return rows;
  const doubled = scale2x(rows);
  const targetW = Math.round(rows[0].length * SOURCE_DENSITY_RATIO);
  const targetH = Math.round(rows.length * SOURCE_DENSITY_RATIO);
  const doubledW = doubled[0].length;
  const doubledH = doubled.length;

  return Array.from({ length: targetH }, (_, y) =>
    Array.from({ length: targetW }, (_, x) => {
      const sourceX = Math.min(doubledW - 1, Math.floor(((x + 0.5) * doubledW) / targetW));
      const sourceY = Math.min(doubledH - 1, Math.floor(((y + 0.5) * doubledH) / targetH));
      return doubled[sourceY][sourceX];
    }).join("")
  );
}

/**
 * 윤곽은 Scale2x로 한 번 정리하고, 결과 픽셀을 정사각 클러스터로 확대한다.
 * 단순 nearest-neighbor 확대와 달리 모서리 계단은 한 단계 더 세밀해진다.
 */
export function clusterScaleRows(rows: string[], clusterScale: number): string[] {
  if (rows.length === 0 || rows[0].length === 0) return rows;
  const refined = scale2x(rows);
  const scaled: string[] = [];
  for (const row of refined) {
    const expanded = row.map((token) => token.repeat(clusterScale)).join("");
    for (let repeat = 0; repeat < clusterScale; repeat += 1) scaled.push(expanded);
  }
  return scaled;
}

/**
 * 같은 색의 큰 덩어리에만 좌상단 하이라이트와 우하단 그림자를 한 번씩 둔다.
 * 작은 컴포넌트에는 손대지 않아 눈·무늬가 노이즈로 변하는 것을 막는다.
 */
export function applyClusterLighting(
  rows: string[],
  highlightToken: string,
  shadowToken: string,
  clusterSize: number
): string[] {
  if (rows.length === 0 || rows[0].length === 0) return rows;
  const pixels = rows.map((row) => [...row]);
  const height = pixels.length;
  const width = pixels[0].length;
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ] as const;

  const canPaintSquare = (x: number, y: number, size: number, token: string) => {
    if (x < 0 || y < 0 || x + size > width || y + size > height) return false;
    for (let py = y; py < y + size; py += 1) {
      for (let px = x; px < x + size; px += 1) {
        if (pixels[py][px] !== token) return false;
      }
    }
    return true;
  };

  const paintSquare = (x: number, y: number, size: number, token: string) => {
    for (let py = y; py < y + size; py += 1) {
      for (let px = x; px < x + size; px += 1) pixels[py][px] = token;
    }
  };

  for (let startY = 0; startY < height; startY += 1) {
    for (let startX = 0; startX < width; startX += 1) {
      const token = pixels[startY][startX];
      if (
        visited[startY][startX] ||
        token === "." ||
        token === " " ||
        token === highlightToken ||
        token === shadowToken
      ) {
        visited[startY][startX] = true;
        continue;
      }

      const component: Array<[number, number]> = [];
      const queue: Array<[number, number]> = [[startX, startY]];
      visited[startY][startX] = true;
      for (let index = 0; index < queue.length; index += 1) {
        const [x, y] = queue[index];
        component.push([x, y]);
        for (const [dx, dy] of directions) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < width &&
            ny < height &&
            !visited[ny][nx] &&
            pixels[ny][nx] === token
          ) {
            visited[ny][nx] = true;
            queue.push([nx, ny]);
          }
        }
      }

      if (component.length < clusterSize * clusterSize * 6) continue;
      const byLight = [...component].sort(([ax, ay], [bx, by]) => ay + ax - (by + bx));
      const byShadow = [...component].sort(([ax, ay], [bx, by]) => by + bx - (ay + ax));
      const light = byLight.find(([x, y]) => canPaintSquare(x, y, clusterSize, token));
      const shadow = byShadow.find(([x, y]) => canPaintSquare(x - clusterSize + 1, y - clusterSize + 1, clusterSize, token));
      if (light) paintSquare(light[0], light[1], clusterSize, highlightToken);
      if (shadow) {
        paintSquare(
          shadow[0] - clusterSize + 1,
          shadow[1] - clusterSize + 1,
          clusterSize,
          shadowToken
        );
      }
    }
  }
  return pixels.map((row) => row.join(""));
}

/** 구조 배경을 288px 콘텐츠 폭에서 320px 장면 폭으로 가장자리 연장한다. */
export function padStructuralRows(rows: string[]): string[] {
  if (rows.length === 0 || rows[0].length >= ART_W) return rows;
  const total = ART_W - rows[0].length;
  const left = Math.floor(total / 2);
  const right = total - left;
  return rows.map((row) => row[0].repeat(left) + row + row[row.length - 1].repeat(right));
}

/** 이전 이름을 쓰는 외부 스크립트와의 호환. */
export const densifyRows = densifySourceRows;
