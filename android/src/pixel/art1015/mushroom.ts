import { asset, compose } from "../themeArtKit";
import type { LateThemeArtPack } from "../themeArtKit";

// 1.0.15 버섯숲 테마 — 안개 낀 동화 숲의 버섯 아지트. 빨간 갓과 반딧불, 이끼가 아늑하게 감싼다.
// 팔레트: 5(안개 숲 그린 벽) · T(버섯 실루엣·이끼 그늘 밴드) · G(이끼) · E(안개 띠) ·
//         S/W(빨간 갓+물방울) · N/O/R(통나무·도토리·흙) · Y/H(빛나는 갓 램프) · A(3곳: 반딧불 2 + 달팽이 껍질 심).
export const MUSHROOM_ART: LateThemeArtPack = {
  wallpaper: asset(
    "반딧불 안개 숲 벽지",
    "Firefly mist forest wallpaper",
    compose(64, 31, "5", [
      // 천장 몰딩 — 깊은 숲 그늘
      { x: 0, y: 0, rows: ["T".repeat(64)] },
      // 왼쪽 키 큰 버섯 실루엣 (창 왼편 좁은 벽) — 갓이 줄기보다 넓은 우산꼴
      { x: 1, y: 2, rows: ["TTTT", ".TT.", ".TT.", ".TT."] },
      // 메인 키 큰 버섯 실루엣 — 선반과 액자 사이 상단 벽
      { x: 39, y: 2, rows: [".TTT.", "TTTTT", "..TT.", "..TT.", "..TT.", "..TT."] },
      // 반딧불 1 — 메인 실루엣 갓 옆에서 빛난다
      { x: 38, y: 3, rows: ["A"] },
      // 창과 모니터 사이 좁은 벽 — 늘어진 이끼 덩굴
      { x: 21, y: 3, rows: ["G..G", "G..G", "G..G", ".G.G", ".G..", ".G.."] },
      // 벽에 돋은 선반버섯 두 송이 (대각 비대칭)
      { x: 22, y: 14, rows: ["SS"] },
      { x: 23, y: 16, rows: ["SS"] },
      // 오른쪽 아래 작은 버섯 실루엣 + 반딧불 2
      { x: 50, y: 15, rows: ["TTTT", ".TT.", ".TT."] },
      { x: 53, y: 12, rows: ["A"] },
      // 안개 띠 — 짧은 가로 결
      { x: 0, y: 10, rows: ["EEE"] },
      { x: 21, y: 12, rows: ["EE"] },
      { x: 40, y: 10, rows: ["EEE"] },
      { x: 60, y: 13, rows: ["EEE"] },
      { x: 2, y: 16, rows: ["EEE"] },
      // 이끼 그늘 밴드 (y19..23) — 위 이끼 fringe + 짙은 그늘
      { x: 0, y: 19, rows: ["G".repeat(64), "T".repeat(64), "T".repeat(64), "T".repeat(64), "T".repeat(64)] },
      // 밴드 텍스처 — 아이템이 덮지 않는 열에만 (이끼 줄기·꼬마 흰 버섯)
      { x: 3, y: 20, rows: ["W"] },
      { x: 9, y: 21, rows: ["G", "G"] },
      { x: 21, y: 22, rows: ["W"] },
      { x: 41, y: 20, rows: ["G", "G"] },
      { x: 52, y: 21, rows: ["W"] },
      { x: 60, y: 20, rows: ["GG"] },
      { x: 62, y: 22, rows: ["W"] }
    ])
  ),
  flooring: asset(
    "이끼 낀 흙바닥",
    "Mossy earth floor",
    compose(64, 9, "N", [
      { x: 0, y: 0, rows: ["C".repeat(64)] },
      { x: 0, y: 3, rows: ["C".repeat(64)] },
      { x: 0, y: 6, rows: ["C".repeat(64)] },
      { x: 0, y: 8, rows: ["C".repeat(64)] },
      // 이끼 패치
      { x: 5, y: 1, rows: ["GGGGG", ".GGG."] },
      { x: 24, y: 4, rows: ["GGGG", "GG.."] },
      { x: 46, y: 1, rows: [".GGG", "GGGG"] },
      { x: 52, y: 7, rows: ["GGG"] },
      { x: 14, y: 7, rows: ["GG"] },
      // 낙엽 조각
      { x: 18, y: 2, rows: ["Y"] },
      { x: 38, y: 1, rows: ["O"] },
      { x: 10, y: 4, rows: ["Y"] },
      { x: 59, y: 4, rows: ["O"] },
      { x: 33, y: 7, rows: ["O"] },
      // 흙에 돋은 꼬마 버섯
      { x: 41, y: 4, rows: ["SS", "WW"] }
    ])
  ),
  window: asset("숲 오솔길 창", "Forest trail window", [
    "NNNNNNNNNNNNNNNN",
    "NEEEEEEEEEEEEEEN",
    "NTEEEEEEEEEEEETN",
    "NTESSSSSEEEEEETN",
    "NTSSWSSSSEEEEETN",
    "NTEEWWEEEESSEETN",
    "NTEEWWEEESSWSETN",
    "NTEEWWEEEEWWEETN",
    "NGGGGGGGGGGGGGGN",
    "NGYYYGGGYYGGGGGN",
    "NNNNNNNNNNNNNNNN",
    "..NN........NN.."
  ]),
  desk: asset(
    "통나무 책상",
    "Log timber desk",
    compose(56, 8, ".", [
      { x: 1, y: 0, rows: ["H".repeat(54)] },
      { x: 0, y: 1, rows: ["O".repeat(56), "O".repeat(56)] },
      // 나뭇결 옹이
      { x: 8, y: 2, rows: ["RR"] },
      { x: 26, y: 2, rows: ["RR"] },
      { x: 43, y: 2, rows: ["R"] },
      { x: 3, y: 3, rows: ["C".repeat(50)] },
      { x: 4, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] },
      { x: 49, y: 4, rows: ["NNN", "NCN", "NCN", "NNN"] }
    ])
  ),
  monitor: asset("버섯 도감 화면", "Mushroom field-guide screen", [
    ".NNNNNNNNNNNN.",
    "NYYYYYYYYYYYYN",
    "NYYSSSYYCCCYYN",
    "NYSSSSSYYYYYYN",
    "NYWNWNWYYCCYYN",
    "NYYYNNYYYYYYYN",
    "NYYYNNYYYCCCYN",
    ".NNNNNNNNNNNN.",
    "......NN......",
    "....NNNNNN...."
  ]),
  mug: asset("도토리 깍정이 컵", "Acorn-cupule cup", [
    "..W...",
    ".RRRR.",
    "NONONN",
    "ONONON",
    ".NNNN.",
    ".OOOO."
  ]),
  // 큰형(갓 5폭·줄기 y23까지) · 둘째(오른쪽 4단) · 막내(왼쪽 단추 갓) — 셋 다 키가 다르다.
  ornament: asset("빨간 갓 버섯 삼형제", "Red-cap mushroom trio", [
    "..SSS..",
    ".SSWSS.",
    "..WW.SS",
    "..WWSWS",
    "SSWW.W.",
    "SSWWGWG"
  ]),
  lamp: asset("빛나는 갓 램프", "Glowing cap lamp", [
    "..Y..",
    ".YYY.",
    "YYYYY",
    "YHHHY",
    ".HNH.",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    "..N..",
    ".NNN.",
    "NNRNN"
  ]),
  mat: asset("포슬 이끼 매트", "Soft moss mat", ["GGGGGGGG", "GTTGGGWG", "TTGGTGGT"]),
  shelf: asset("도토리와 솔방울", "Acorn and pinecone", ["NN..R", "OO.RR", "OO.YR", "NNNNN"]),
  frame: asset("숲 채집 지도 액자", "Foraging map frame", [
    "NNNNNN",
    "NTYYYN",
    "NYTYGN",
    "NYTYYN",
    "NYYTYN",
    "NGYSYN",
    "NNNNNN"
  ]),
  clock: asset("달팽이 시계", "Snail clock", [".OOC", "OAOY", "OOOY", "YYYY"]),
  // 눈 행은 y26(통나무 상판 O 위 — 양끝 W 볼), y27 뺨 행에는 C가 없어 책상 그림자와 분리된다.
  pet: asset("버섯 모자 고슴도치", "Mushroom-cap hedgehog", [
    ".SSS..",
    "SWSSWS",
    "WCWWCW",
    "NWWWWN",
    "NWCCWN",
    "NNWWNN",
    "NNNNNN",
    ".R.R.."
  ]),
  floorObject: asset("버섯 수확 바구니", "Mushroom harvest basket", [
    ".NNNN.",
    ".NSSN.",
    "SSWSSS",
    "YNYNYN",
    "NYNYNY",
    "YNYNYN",
    ".NNNN."
  ])
};
