import { asset, compose } from "../themeArtKit";
import type { LateThemeArtPack } from "../themeArtKit";

// 1.0.15 광산 테마 — 원석이 반짝이는 아늑한 보석 갱도.
// 팔레트: 2(동굴 퍼플그레이 벽) · N/R(지지목) · M(암반 밴드) · T/P/B(원석) · W/H(반짝임) · L/E(강철·양철) · A(랜턴 불빛, 창·램프만).
export const MINE_ART: LateThemeArtPack = {
  wallpaper: asset(
    "갱도 지지목 벽지",
    "Timbered gallery wallpaper",
    compose(64, 31, "2", [
      // 하단 암반 밴드 — 박힌 광맥 알갱이
      {
        x: 0,
        y: 19,
        rows: ["C".repeat(64), "M".repeat(64), "M".repeat(64), "M".repeat(64), "C".repeat(64)]
      },
      { x: 4, y: 20, rows: ["O"] },
      { x: 9, y: 22, rows: ["R"] },
      { x: 19, y: 21, rows: ["T"] },
      { x: 41, y: 21, rows: ["O"] },
      { x: 60, y: 20, rows: ["T"] },
      { x: 62, y: 22, rows: ["O"] },
      // 천장 대들보와 지지 기둥 셋 (밴드 위까지 내려온다)
      { x: 0, y: 0, rows: ["N".repeat(64)] },
      { x: 2, y: 1, rows: Array(23).fill("NR") },
      { x: 22, y: 1, rows: Array(23).fill("NR") },
      { x: 52, y: 1, rows: Array(23).fill("NR") },
      // 자수정 원석 — 선반과 액자 사이 상단 벽
      { x: 39, y: 2, rows: ["..P..", ".PPP.", "PWPPP", ".PPP.", "..P.."] },
      { x: 38, y: 6, rows: ["T"] },
      // 미니 청록 원석 — 오른쪽 벽
      { x: 50, y: 14, rows: ["TH", "TT"] },
      // 흩어진 반짝임
      { x: 9, y: 2, rows: ["H"] },
      { x: 45, y: 2, rows: ["H"] },
      { x: 62, y: 2, rows: ["K"] },
      { x: 32, y: 3, rows: ["W"] },
      { x: 60, y: 10, rows: ["T"] },
      { x: 1, y: 13, rows: ["K"] },
      { x: 18, y: 16, rows: ["K"] }
    ])
  ),
  flooring: asset(
    "레일 자갈 바닥",
    "Rail gravel floor",
    compose(64, 9, "R", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      // 자갈
      { x: 8, y: 2, rows: ["O"] },
      { x: 33, y: 2, rows: ["O"] },
      { x: 54, y: 2, rows: ["O"] },
      { x: 26, y: 7, rows: ["O"] },
      // 강철 레일과 침목
      { x: 0, y: 3, rows: ["L".repeat(64)] },
      { x: 4, y: 4, rows: ["NN"] },
      { x: 14, y: 4, rows: ["NN"] },
      { x: 24, y: 4, rows: ["NN"] },
      { x: 34, y: 4, rows: ["NN"] },
      { x: 44, y: 4, rows: ["NN"] },
      { x: 56, y: 4, rows: ["NN"] },
      // 흙에 묻힌 원석 반짝
      { x: 18, y: 6, rows: ["T"] },
      { x: 47, y: 6, rows: ["TW"] },
      { x: 0, y: 8, rows: ["C".repeat(64)] }
    ])
  ),
  // 갱도 안쪽으로 레일이 이어지고 먼 지지 프레임에 랜턴이 걸려 있다.
  window: asset("갱도 입구 창", "Tunnel mouth window", [
    "NNNNNNNNNNNNNNNN",
    "NMMMMMMMMMMMMMMN",
    "NMMIIIIIIIIIIMMN",
    "NMIIINNNNNNIIIMN",
    "NMIIINIAIINIIIMN",
    "NMTIINIIIINIIIMN",
    "NMIIIIILLIIIIPMN",
    "NMIIIILIILIIIIMN",
    "NMIIILIIIILIIIMN",
    "NMRRLRRRRRRLRRMN",
    "NNNNNNNNNNNNNNNN",
    "..NN........NN.."
  ]),
  desk: asset(
    "버팀목 작업대",
    "Pit prop workbench",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["O".repeat(54)] },
      { x: 0, y: 1, rows: ["N".repeat(56), "N".repeat(56)] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  // 왼쪽은 원석 도면, 오른쪽은 시추 깊이 막대 그래프.
  monitor: asset("시추 현황 화면", "Drill status screen", [
    ".LLLLLLLLLLLL.",
    "LCCCCCCCCCCCCL",
    "LCCCPCCCTTCCCL",
    "LCCPWPCCKKKCCL",
    "LCCCPCCCTTTTCL",
    "LCCCCCCCCCCCCL",
    "LCKKKKKKCCWCCL",
    ".LLLLLLLLLLLL.",
    "......LL......",
    "....LLLLLL...."
  ]),
  mug: asset("양철 컵", "Tin cup", [
    "EEEEE.",
    "EHEEE.",
    "EHEEEE",
    "EHEEE.",
    "EEEEE.",
    "LLLLL."
  ]),
  ornament: asset("수정 클러스터", "Crystal cluster", [
    "...P...",
    "..PPP..",
    "..PWP..",
    ".TPPPB.",
    "TTPPPBB",
    "RRRRRRR"
  ]),
  lamp: asset("카바이드 랜턴", "Carbide lantern", [
    "..L..",
    ".LLL.",
    ".LAL.",
    ".LAL.",
    ".LLL.",
    "..R..",
    "..R..",
    "..R..",
    "..R..",
    "..R..",
    ".RRR.",
    "RRRRR"
  ]),
  mat: asset("침목 매트", "Sleeper rail mat", ["RRCRRCRR", "LLLLLLLL", "RRCRRCRR"]),
  shelf: asset("원석 트리오", "Rough gem trio", [".B.W.", "BBTPP", "NNNNN", ".N.N."]),
  frame: asset("채굴 지도 액자", "Dig map frame", [
    "NNNNNN",
    "NYYYYN",
    "NYRYYN",
    "NYYRYN",
    "NYYTYN",
    "NYYYYN",
    "NNNNNN"
  ]),
  clock: asset("교대 종 시계", "Shift bell clock", [".YY.", ".YY.", "YYYY", "..S."]),
  // 눈 행은 y26(작업대 상판 N 위), 분홍 코 행은 y27이지만 C 없이 M/P만 쓴다.
  pet: asset("두더지 광부", "Miner mole", [
    ".YYY..",
    "YYWYY.",
    "MCMCM.",
    "MPPPM.",
    "MMMMM.",
    "YMMMY.",
    "MMMMM.",
    ".Y.Y.."
  ]),
  floorObject: asset("보석 광차", "Gem cart", [
    "..P.T.",
    ".TPBT.",
    "RRRRRR",
    "RLLLLR",
    "RRRRRR",
    "RRRRRR",
    "LL..LL",
    "LL..LL"
  ])
};
