import { asset, compose } from "../themeArtKit";
import type { LateThemeArtPack } from "../themeArtKit";

// 1.0.15 편의점 테마 — 새벽의 아늑한 심야 매장, 스낵 선반과 냉장고 불빛.
// 팔레트: 4(민트 화이트 벽) · T(브랜드 티얼) · N(선반 우드) · I(밤 유리) · S/G/B/R/P(스낵·캔) · H(냉장 불빛) · A(24시 사인·포스 합계 — 2곳만).

// 진열 선반 스낵 줄 — 2px 봉지 + 1px 틈(벽색) 반복.
const SNACK_ROW = "SS.GG.BB.RR.TT.PP.".repeat(4).slice(0, 64);

export const CONVENIENCE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "심야 스낵 진열 벽지",
    "Night snack shelf wallpaper",
    compose(64, 31, "4", [
      // 천장 몰딩 — 브랜드 티얼 스트라이프
      { x: 0, y: 0, rows: ["T".repeat(64)] },
      // 간판 삼색 밴드 — 왼쪽 위
      { x: 1, y: 2, rows: ["TTTT", "WWWW", "SSSS"] },
      // 세일 % 배지 — 창과 모니터 사이 좁은 벽
      { x: 21, y: 4, rows: ["CCCC", "CSWC", "CWSC", "CCCC"] },
      // 행사 스티커 — 좁은 벽 아래
      { x: 22, y: 12, rows: ["SS", "SS"] },
      // 행잉 프로모 보드 — 선반과 액자 사이 상단 벽
      { x: 39, y: 1, rows: [".C.C.", "TTTTT", "TWWTT", "TTWWT", "TTTTT"] },
      // CCTV — 오른쪽 벽, 렌즈는 매장 안쪽(왼쪽)을 본다
      { x: 50, y: 12, rows: ["..C", "CCC", "BCC"] },
      // 진열 선반 밴드 — 우드 레일 사이 스낵 봉지 줄
      { x: 0, y: 19, rows: ["N".repeat(64), SNACK_ROW, SNACK_ROW, SNACK_ROW, "N".repeat(64)] },
      // 가격표 도트
      { x: 3, y: 23, rows: ["W"] },
      { x: 20, y: 23, rows: ["W"] },
      { x: 41, y: 23, rows: ["W"] }
    ])
  ),
  flooring: asset(
    "광택 타일 바닥",
    "Glossy tile floor",
    compose(64, 9, "L", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["E".repeat(64)] },
      { x: 0, y: 6, rows: ["E".repeat(64)] },
      { x: 18, y: 1, rows: ["E", "E"] },
      { x: 42, y: 4, rows: ["E", "E"] },
      { x: 30, y: 2, rows: ["H"] },
      { x: 52, y: 7, rows: ["H"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  window: asset("새벽 통유리 문", "Dawn glass door", [
    "TTTTTTTTTTTTTTTT",
    "TIIIIIITTIIIIIIT",
    "TIIWIIITTIIAAIIT",
    "TIIIIIITTIIAAIIT",
    "TIIIIILTTLIIIIIT",
    "TIIIIIITTIIIIIIT",
    "TIWIIIITTIIIIIIT",
    "TIIIIIITTIIIIIIT",
    "TCCCCCCTTCCCCCCT",
    "TCCCCCCTTCCCCCCT",
    "TTTTTTTTTTTTTTTT",
    "..TT........TT.."
  ]),
  desk: asset(
    "계산 카운터",
    "Checkout counter",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["L".repeat(56), "T".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["TTT", "TCT", "TCT", "TTT"] },
      { x: 49, y: 4, rows: ["TTT", "TCT", "TCT", "TTT"] }
    ])
  ),
  monitor: asset("포스 단말 화면", "POS terminal screen", [
    ".CCCCCCCCCCCC.",
    "CIIIIIIIIIIIIC",
    "CIWWWWIIIIIIIC",
    "CIIIIIIIIIAAIC",
    "CIWWWIIIIIIIIC",
    "CIIIIIITTTTIIC",
    "CIIIIIIIIIIIIC",
    ".CCCCCCCCCCCC.",
    "......CC......",
    "....CCCCCC...."
  ]),
  mug: asset("컵라면", "Cup ramen", [
    "..W..",
    ".W...",
    "RRRRR",
    "WSSSW",
    "WSSSW",
    ".WWW."
  ]),
  ornament: asset("삼각김밥", "Rice triangle", [
    "...W...",
    "..WWW..",
    ".WWWWW.",
    "WWCCCWW",
    "WWCCCWW"
  ]),
  lamp: asset("네온 간판등", "Neon sign lamp", [
    "TTTTT",
    "TYYYT",
    "TYSST",
    "TSYYT",
    "TYYST",
    "TYYYT",
    "TTTTT",
    "..T..",
    "..T..",
    "..T..",
    ".TTT.",
    "TTTTT"
  ]),
  mat: asset("바코드 매트", "Barcode mat", [
    "WCWCCWCW",
    "WCWCCWCW",
    "WWWWWWWW"
  ]),
  shelf: asset("캔 피라미드", "Can pyramid", [
    ".SS..",
    ".SS..",
    "BBGG.",
    "BBGG."
  ]),
  frame: asset("신상 음료 포스터", "New drink poster", [
    "CCCCCC",
    "CWWWWC",
    "CWSSWC",
    "CWSSWC",
    "CWWWWC",
    "CTTTTC",
    "CCCCCC"
  ]),
  clock: asset("24시 벽시계", "24-hour wall clock", [".TT.", "TWWT", "TWCT", ".TT."]),
  // 눈 행은 y26(카운터 상판 T 위), 볼·입 행은 y27(그림자 C 위)라 C 없이 배경과 분리된다.
  pet: asset("야간 알바 햄스터", "Night-shift hamster", [
    ".O.O..",
    "OOOOO.",
    "OCOCO.",
    "SWWWS.",
    "OBWBO.",
    "OBWBO.",
    "OOOOO.",
    "YY.YY."
  ]),
  floorObject: asset("음료 냉장고", "Drink fridge", [
    "CCCCCC",
    "CHHHHC",
    "CSSBBC",
    "CLLLLC",
    "CGGSSC",
    "CLLLLC",
    "CTTTTC",
    ".LLLL."
  ])
};
