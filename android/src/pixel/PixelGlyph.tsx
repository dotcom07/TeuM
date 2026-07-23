import { useMemo } from "react";
import { View } from "react-native";
import { colors } from "../theme";

/**
 * 도트맵 문자 → 브랜드 팔레트 토큰.
 * 픽셀 데스크는 이 팔레트 밖의 색을 쓰지 않는다 (기획서 §3.4).
 */
export const PIXEL_COLORS: Record<string, string> = {
  C: colors.carbon,
  I: colors.chromeIndigo,
  M: colors.mutedIndigo,
  P: colors.periwinkle,
  K: colors.canvasSoft,
  E: colors.ice,
  H: colors.highlight,
  W: colors.surface,
  A: colors.amber,
  S: colors.signal,
  T: colors.systemsTeal,
  L: colors.platinum
};

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
export function rowsToRuns(rows: string[]): PixelRun[] {
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
      const color = PIXEL_COLORS[ch];
      if (color) runs.push({ x, y, w: end - x, color });
      x = end;
    }
  });
  return runs;
}

/**
 * 아트 픽셀 좌표계 위에 도트맵 하나를 그린다.
 * 부모는 position:relative 컨테이너, scale은 아트 픽셀 1칸의 dp 크기.
 * 사각형에 0.5dp 여유를 줘 비정수 배율에서 헤어라인 틈을 막는다 (기획서 §3.1).
 */
export function PixelGlyph({
  rows,
  x,
  y,
  scale
}: {
  rows: string[];
  x: number;
  y: number;
  scale: number;
}) {
  const runs = useMemo(() => rowsToRuns(rows), [rows]);
  return (
    <>
      {runs.map((run, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            left: (x + run.x) * scale,
            top: (y + run.y) * scale,
            width: run.w * scale + 0.5,
            height: scale + 0.5,
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
