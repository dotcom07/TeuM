export const ITEM_CANVAS_SIZE = 128;
export const ITEM_OUTPUT_SCALES = [6, 8] as const;
export const SCENE_OUTPUT_SCALES = [4, 6] as const;

export interface CanvasPlacement {
  rows: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 캐릭터·사물 하나를 128×128 논리 캔버스 중앙에 놓는다.
 * 장면 배치용 원본 rows는 바꾸지 않고, 독립 출력·에셋 검수에서만 이 좌표를 쓴다.
 */
export function placeOnItemCanvas(rows: string[]): CanvasPlacement {
  if (rows.length === 0 || rows[0].length === 0) {
    return { rows, x: 0, y: 0, width: 0, height: 0 };
  }
  const width = rows[0].length;
  const height = rows.length;
  if (width > ITEM_CANVAS_SIZE || height > ITEM_CANVAS_SIZE) {
    throw new Error(`${width}×${height} item exceeds ${ITEM_CANVAS_SIZE}×${ITEM_CANVAS_SIZE}`);
  }
  return {
    rows,
    x: Math.floor((ITEM_CANVAS_SIZE - width) / 2),
    y: Math.floor((ITEM_CANVAS_SIZE - height) / 2),
    width,
    height
  };
}

/** 128×128 전체 행이 필요한 파일 출력·스냅샷용. */
export function itemCanvasRows(rows: string[]): string[] {
  const placement = placeOnItemCanvas(rows);
  const canvas = Array.from({ length: ITEM_CANVAS_SIZE }, () =>
    Array(ITEM_CANVAS_SIZE).fill(".")
  );
  placement.rows.forEach((row, y) => {
    [...row].forEach((token, x) => {
      canvas[placement.y + y][placement.x + x] = token;
    });
  });
  return canvas.map((row) => row.join(""));
}
