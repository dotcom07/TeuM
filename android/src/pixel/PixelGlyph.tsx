import { useMemo } from "react";
import { View } from "react-native";
import { separatedGlyphRuns } from "./pixelSeparation.ts";
import { BASE_PIXEL_COLORS, pixelColor } from "./themePalettes.ts";

/** 테마가 없는 기본 아이템의 도트맵 문자 → 색상 토큰. */
export const PIXEL_COLORS: Record<string, string> = BASE_PIXEL_COLORS;

export interface PixelRun {
  x: number;
  y: number;
  w: number;
  color: string;
}

/**
 * 도트맵(문자열 행 배열)을 가로 run-length 사각형 목록으로 변환한다.
 * 픽셀마다 View를 만들지 않기 위한 핵심 단계 (기획서 §8).
 * `.` 과 공백은 투명.
 */
export function rowsToRuns(
  rows: string[],
  themeKey?: string,
  separation?: { enabled: boolean; itemId: string; backgroundColor?: string }
): PixelRun[] {
  if (separation?.enabled) {
    return separatedGlyphRuns(rows, themeKey, separation.itemId, separation.backgroundColor);
  }
  const runs: PixelRun[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === "." || ch === " ") {
        x += 1;
        continue;
      }
      let end = x + 1;
      while (end < row.length && row[end] === ch) end += 1;
      const color = pixelColor(ch, themeKey);
      if (color) runs.push({ x, y, w: end - x, color });
      x = end;
    }
  });
  return runs;
}

/**
 * 아트 픽셀 좌표계 위에 도트맵 하나를 그린다.
 * 부모는 position:relative 컨테이너, scale은 아트 픽셀 1칸의 dp 크기.
 * 사각형에 작은 여유를 줘 비정수 배율에서 헤어라인 틈을 막는다 (기획서 §3.1).
 */
export function PixelGlyph({
  rows,
  x,
  y,
  scale,
  themeKey,
  itemId,
  separateEdges = false,
  separationBackground
}: {
  rows: string[];
  x: number;
  y: number;
  scale: number;
  themeKey?: string;
  /** 경계색 해시와 장면 레이어 소유권에 쓰는 안정 id. */
  itemId?: string;
  /** 배경과 겹치는 실루엣 안쪽 경계를 적응형 1px 분리색으로 바꾼다. */
  separateEdges?: boolean;
  /** 단독 미리보기에서 실제로 맞닿는 배경색. */
  separationBackground?: string;
}) {
  const runs = useMemo(
    () =>
      rowsToRuns(rows, themeKey, {
        enabled: separateEdges,
        itemId: itemId ?? themeKey ?? "pixel-glyph",
        backgroundColor: separationBackground
      }),
    [itemId, rows, separateEdges, separationBackground, themeKey]
  );
  return (
    <>
      {runs.map((run, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            left: (x + run.x) * scale,
            top: (y + run.y) * scale,
            width: run.w * scale + Math.min(0.35, scale * 0.08),
            height: scale + Math.min(0.35, scale * 0.08),
            backgroundColor: run.color
          }}
        />
      ))}
    </>
  );
}

/** 단색 사각형 (배경·가구용) */
export function PixelRect({
  x,
  y,
  w,
  h,
  color,
  scale
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  scale: number;
}) {
  return (
    <View
      style={{
        position: "absolute",
        left: x * scale,
        top: y * scale,
        width: w * scale + 0.5,
        height: h * scale + 0.5,
        backgroundColor: color
      }}
    />
  );
}
