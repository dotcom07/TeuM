/**
 * 1.0.9 테마 전용 주 배경색.
 *
 * 가구·윤곽에 쓰는 공용 팔레트와 분리해, 서로 다른 테마가 같은 벽색으로
 * 보이지 않게 한다. 토큰은 도트맵 내부에서만 쓰는 소문자 한 글자다.
 */
export const THEME_BACKGROUND_PALETTES = {
  cat: { token: "a", hex: "#c8c2dc", nameKo: "라일락 그레이" },
  summer: { token: "b", hex: "#89d8cf", nameKo: "청량 민트아쿠아" },
  autumn: { token: "c", hex: "#cf6f3f", nameKo: "단풍 번트오렌지" },
  spring: { token: "d", hex: "#f3c7d2", nameKo: "벚꽃 블러시" },
  winter: { token: "e", hex: "#49698f", nameKo: "설야 스틸블루" },
  calico: { token: "f", hex: "#f1dfc3", nameKo: "삼색 크림" },
  aquarium: { token: "g", hex: "#3b9fc1", nameKo: "라군 블루" },
  undersea: { token: "h", hex: "#15566a", nameKo: "심해 딥틸" },
  dream: { token: "i", hex: "#39457d", nameKo: "새벽 인디고" },
  zoo: { token: "j", hex: "#d8b72f", nameKo: "사바나 옐로" },
  sf: { token: "k", hex: "#c8cccb", nameKo: "회로 실버그레이" },
  space: { token: "l", hex: "#101640", nameKo: "궤도 딥네이비" },
  christmas: { token: "m", hex: "#24563c", nameKo: "전나무 딥그린" },
  sky: { token: "n", hex: "#c9eaf8", nameKo: "맑은 하늘" },
  fantasy: { token: "o", hex: "#16846d", nameKo: "마법 제이드" },
  school: { token: "p", hex: "#e3d98d", nameKo: "칠판 분필옐로" },
  rainy: { token: "q", hex: "#7398aa", nameKo: "장마 스톰블루" },
  library: { token: "r", hex: "#704a3f", nameKo: "서가 마호가니" },
  cafe: { token: "s", hex: "#ad7b60", nameKo: "로스팅 모카" },
  bakery: { token: "t", hex: "#f2aa97", nameKo: "구운 코랄피치" },
  camping: { token: "u", hex: "#6b6335", nameKo: "캠프 올리브" },
  greenhouse: { token: "v", hex: "#b8d49b", nameKo: "새잎 세이지" },
  music: { token: "w", hex: "#7466a5", nameKo: "리듬 바이올렛" },
  arcade: { token: "x", hex: "#3d202d", nameKo: "아케이드 블랙체리" },
  hanok: { token: "y", hex: "#c5a878", nameKo: "한지 황토" },
  "night-city": { token: "z", hex: "#552858", nameKo: "야경 플럼" },
  // 소문자 토큰이 소진되어 1.0.13부터는 미사용 대문자를 쓴다 (D F J Q U V X Z 가용).
  onsen: { token: "Q", hex: "#88a898", nameKo: "온천 세이지" },
  laundry: { token: "U", hex: "#8fc4d6", nameKo: "세탁 파우더블루" },
  halloween: { token: "X", hex: "#6a3b52", nameKo: "마녀 자두빛" },
  // 1.0.14 — 마지막 미사용 대문자 토큰 5개(D F J V Z)를 모두 사용한다.
  farm: { token: "D", hex: "#93b64e", nameKo: "목장 라임" },
  fair: { token: "F", hex: "#df8ab5", nameKo: "솜사탕 핑크" },
  desert: { token: "J", hex: "#d6a95e", nameKo: "사막 샌드" },
  jungle: { token: "V", hex: "#448a58", nameKo: "정글 그린" },
  detective: { token: "Z", hex: "#7f776a", nameKo: "탐정 웜그레이" },
  // 1.0.15 — 영문자가 모두 소진되어 숫자 토큰을 쓴다 (0~9 가용, 0~4 사용).
  post: { token: "0", hex: "#bf4646", nameKo: "우체통 레드" },
  observatory: { token: "1", hex: "#1f3d5c", nameKo: "관측소 심야남색" },
  mine: { token: "2", hex: "#524364", nameKo: "동굴 자수정빛" },
  salon: { token: "3", hex: "#a5589a", nameKo: "살롱 라일락" },
  convenience: { token: "4", hex: "#c9e8d3", nameKo: "새벽 민트" }
} as const;

export type ThemePaletteKey = keyof typeof THEME_BACKGROUND_PALETTES;

export const THEME_BACKGROUND_TOKEN_COLORS: Record<string, string> =
  Object.fromEntries(
    Object.values(THEME_BACKGROUND_PALETTES).map(({ token, hex }) => [token, hex])
  );

interface WallpaperItem {
  themeKey?: string;
  slots: string[];
  frames: Record<string, string[]>;
  states?: Record<string, string[]>;
}

const dominantOpaqueToken = (rows: string[]): string | undefined => {
  const counts = new Map<string, number>();
  for (const token of rows.join("")) {
    if (token === "." || token === " ") continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...counts].sort((left, right) => right[1] - left[1])[0]?.[0];
};

const replaceToken = (rows: string[], from: string, to: string) =>
  rows.map((row) => row.replaceAll(from, to));

/**
 * 벽지에서 가장 넓은 불투명색만 테마 전용색으로 바꾼다.
 * 실루엣·소품·상태 프레임은 유지되고 주 벽색만 분리된다.
 */
export function applyThemeBackgroundPalette<T extends WallpaperItem>(item: T): T {
  if (!item.themeKey || !item.slots.includes("wallpaper")) return item;
  const palette = THEME_BACKGROUND_PALETTES[item.themeKey as ThemePaletteKey];
  if (!palette) return item;

  const sourceToken = dominantOpaqueToken(item.frames.base);
  if (!sourceToken || sourceToken === palette.token) return item;

  return {
    ...item,
    frames: Object.fromEntries(
      Object.entries(item.frames).map(([state, rows]) => [
        state,
        replaceToken(rows, sourceToken, palette.token)
      ])
    ),
    states: item.states
      ? Object.fromEntries(
          Object.entries(item.states).map(([state, rows]) => [
            state,
            replaceToken(rows, sourceToken, palette.token)
          ])
        )
      : undefined
  };
}
