import { asset, compose } from "../themeArtKit";
import type { LateThemeArtPack } from "../themeArtKit";

// 1.0.15 등대 테마 — 쨍한 바다 파랑 위 등대지기의 방. 흰-주홍 스트라이프와 갈매기, 로프와 파도.
// 팔레트: 6(쨍한 바다 파랑 벽) · W/S(흰-주홍 스트라이프) · N/O/Y(로프·나무) · T(파도 밴드) · A(포인트 2곳: 창밖 불빛·램프 불빛).
export const LIGHTHOUSE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "갈매기 파도 벽지",
    "Seagull wave wallpaper",
    compose(64, 31, "6", [
      // 천장 몰딩
      { x: 0, y: 0, rows: ["W".repeat(64)] },
      // 뭉게구름 — 왼쪽 위
      { x: 1, y: 2, rows: [".WW", "WWW"] },
      // 갈매기 — 선반과 액자 사이 상단 벽 (주홍 부리)
      { x: 39, y: 2, rows: ["W...W", ".WWW.", "..WS."] },
      // 멀리 나는 작은 갈매기 실루엣 두 마리
      { x: 33, y: 2, rows: ["C.C", ".C."] },
      { x: 59, y: 9, rows: ["C.C", ".C."] },
      // 창과 모니터 사이 좁은 벽 — 고리에 걸린 로프 매듭
      {
        x: 22,
        y: 3,
        rows: [".C.", ".N.", ".N.", "NN.", "NYN", ".NN", ".N.", ".N.", "NN.", "NYN", ".NN", ".N."]
      },
      // 오른쪽 벽 — 로프 사리 걸이
      { x: 50, y: 12, rows: [".NN.", "NOON", "NOON", ".NN.", "..N.", "..N."] },
      // 하단 파도 밴드 — 깊은 청록 물결
      { x: 0, y: 20, rows: ["T".repeat(64), "T".repeat(64), "T".repeat(64), "T".repeat(64)] },
      // 파도 마루 — 아이템이 덮지 않는 열에만
      { x: 2, y: 19, rows: ["KK"] },
      { x: 8, y: 19, rows: ["KK"] },
      { x: 19, y: 19, rows: ["KK"] },
      { x: 40, y: 19, rows: ["KK"] },
      { x: 52, y: 19, rows: ["KK"] },
      { x: 60, y: 19, rows: ["KK"] },
      { x: 4, y: 20, rows: ["KK"] },
      { x: 21, y: 20, rows: ["KK"] },
      { x: 42, y: 20, rows: ["KK"] },
      { x: 62, y: 20, rows: ["KK"] },
      { x: 3, y: 21, rows: ["W"] },
      { x: 20, y: 21, rows: ["W"] },
      { x: 41, y: 21, rows: ["W"] },
      { x: 61, y: 21, rows: ["W"] }
    ])
  ),
  flooring: asset(
    "선착장 널판 바닥",
    "Dock plank floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["Y".repeat(64)] },
      { x: 0, y: 3, rows: ["C".repeat(64)] },
      { x: 0, y: 6, rows: ["C".repeat(64)] },
      { x: 14, y: 1, rows: ["C", "C"] },
      { x: 44, y: 1, rows: ["C", "C"] },
      { x: 28, y: 4, rows: ["C", "C"] },
      { x: 56, y: 4, rows: ["C", "C"] },
      { x: 8, y: 7, rows: ["C"] },
      { x: 36, y: 7, rows: ["C"] },
      { x: 20, y: 2, rows: ["OO"] },
      { x: 50, y: 5, rows: ["OO"] },
      { x: 5, y: 4, rows: ["O"] },
      { x: 60, y: 7, rows: ["OO"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  // 수평선 위 먼 흰-주홍 탑과 왼쪽으로 뻗는 불빛 — 비대칭.
  window: asset("수평선 창", "Horizon window", [
    "WWWWWWWWWWWWWWWW",
    "WKKKKKKKKKKKKKKW",
    "WKKKKKHHHHAKKKKW",
    "WKWWKKKHHCCCKKKW",
    "WKKKKKKKKWWWKKKW",
    "WKKKKKKKKSSSKKKW",
    "WBBBBBBBBWWWBBBW",
    "WBBBWBBBBBBBKBBW",
    "WBBBBBBWBBBBBBBW",
    "WBBBBBBBBBBWBBBW",
    "WWWWWWWWWWWWWWWW",
    "..WW........WW.."
  ]),
  desk: asset(
    "부둣가 나무 책상",
    "Wharf wood desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["Y".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56), "N".repeat(56)] },
      { x: 26, y: 1, rows: ["O.O..O"] },
      { x: 8, y: 2, rows: ["OO"] },
      { x: 40, y: 2, rows: ["O.OO"] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  // 화면 왼쪽 줄무늬 탑 단면 + 오른쪽으로만 뻗는 불빛 — 비대칭.
  monitor: asset("뱃길 불빛 화면", "Sea-lane beacon screen", [
    ".WWWWWWWWWWWW.",
    "WCCCCCCCCCCCCW",
    "WCCCCWHHHHHCCW",
    "WCCCWWWCCCCCCW",
    "WCCCSSSCCCCCCW",
    "WCCCWWWCCCCCCW",
    "WCCCSSSCTTCCCW",
    ".WWWWWWWWWWWW.",
    "......WW......",
    "....WWWWWW...."
  ]),
  mug: asset("뱃고동 법랑컵", "Foghorn enamel mug", [
    "CCCCC.",
    "WWWWWE",
    "WSSWWE",
    "WSWWWE",
    "WWWWW.",
    "SSSSS."
  ]),
  ornament: asset("주홍 구명튜브", "Scarlet life ring", [
    "..SSS..",
    ".W...W.",
    "W.....W",
    "S.....S",
    "W.....W",
    ".W...W.",
    "..SSS.."
  ]),
  // 시그니처 — 흰-주홍 줄무늬 기둥과 꼭대기 금빛 불.
  lamp: asset("줄무늬 탑 스탠드", "Striped tower lamp", [
    "..C..",
    ".CCC.",
    ".CAC.",
    "CCCCC",
    ".WWW.",
    ".SSS.",
    ".WWW.",
    ".SSS.",
    ".WWW.",
    ".SSS.",
    "WWWWW",
    "CCCCC"
  ]),
  mat: asset("로프 똬리 매트", "Coiled rope mat", [".OOOOOO.", "ONYYYYNO", ".OOOOOON"]),
  shelf: asset("조개 소라 선반", "Shell and conch shelf", [".SS.W", "SSYWW", "NNNNN", ".N.N."]),
  frame: asset("범선 그림 액자", "Sailboat painting frame", [
    "NNNNNN",
    "NKKKKN",
    "NKWKKN",
    "NWWWKN",
    "NSSBBN",
    "NBBWBN",
    "NNNNNN"
  ]),
  clock: asset("조타륜 시계", "Helm wheel clock", [".OO.", "OWCO", "OWWO", ".OO."]),
  // 눈(C)은 y26 행, y27(그림자 행)에는 C 없음 — 코는 R, 수염 볼은 W. 흰-주홍 선원 모자.
  pet: asset("바다 물개", "Lighthouse-keeper seal", [
    ".WWWW.",
    ".SSSS.",
    "LCLLCL",
    "LWRRWL",
    "LLWWLL",
    "LWWWWL",
    "ELWWLE",
    "EE..EE"
  ]),
  floorObject: asset("닻과 로프 뭉치", "Anchor and rope coil", [
    "..CC..",
    ".C..C.",
    "..CC..",
    "CCCCCC",
    "..CC..",
    "C.CC.C",
    ".CCCC.",
    "NONNON"
  ])
};
