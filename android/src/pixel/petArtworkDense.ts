import { catSprite, petSprite } from "./petSpriteBuilders.ts";
import { STORE_CAT_ROWS } from "./storeCatVariants.ts";

/**
 * 320×180 방으로 클러스터 변환하기 전의 9×11 펫 원본.
 * 큰 얼굴과 1px 표정은 공통으로 유지하고, 귀·주둥이·날개·다리·꼬리처럼
 * 종을 결정하는 랜드마크는 펫마다 다른 실루엣으로 직접 설계한다.
 */
export const DENSE_PET_ROWS: Record<string, string[]> = {
  "cat-basic": catSprite(
    { outline: "C", body: "M", patch: "P", eye: "W", nose: "A", accent: "Q" },
    "classic"
  ),
  "dog-basic": petSprite(
    "..CCCCC..",
    ".CNNNNNC.",
    "CCNNNNNCC",
    "CNWNNNWNC",
    "CNNWAWNNC",
    ".CNNNNNC.",
    "..CYYYC..",
    "..CNNNC..",
    ".CN.N.NC.",
    ".CC...CC.",
    "........."
  ),
  "cat-tuxedo": catSprite(
    { outline: "C", body: "C", patch: "W", eye: "K", nose: "A", accent: "Y" },
    "sit"
  ),
  "summer-cat": catSprite(
    { outline: "C", body: "B", patch: "Y", eye: "W", nose: "O", accent: "A" },
    "low"
  ),
  "autumn-cat": catSprite(
    { outline: "C", body: "O", patch: "R", eye: "W", nose: "G", accent: "Y" },
    "chubby"
  ),
  "spring-rabbit": petSprite(
    "..C...C..",
    "..CQ.QC..",
    "..CQ.QC..",
    ".CCQQQCC.",
    "CQQQQQQQC",
    "CQWQQQWQC",
    "CQQQAQQQC",
    ".CQQQQQC.",
    "..CQQQC..",
    ".CCQ.QCC.",
    "........."
  ),
  "winter-fox": petSprite(
    "C.......C",
    "CE.....EC",
    "CEEEEEEC.",
    "CEWEEEWEC",
    ".CEEAEEC.",
    "..CWWWC..",
    "..CEEECCC",
    ".CEEEECEC",
    ".CE.EECEC",
    ".CC.CCCEC",
    "......CCC"
  ),
  "calico-cat": catSprite(
    { outline: "C", body: "W", patch: "O", eye: "C", nose: "Q", accent: "N" },
    "classic"
  ),
  "aquarium-otter": petSprite(
    ".CC...CC.",
    "CNNNNNNNC",
    "CNNNNNNNC",
    "CNWNNNWNC",
    "CNNWOWNNC",
    ".CNNNNNC.",
    "..CNNNC..",
    ".CNNNNNCC",
    ".CN.N.NCC",
    "CCN...NCC",
    ".......CC"
  ),
  "undersea-octopus": petSprite(
    "...CCC...",
    "..CTTTC..",
    ".CTTTTTC.",
    "CTWTTTWTC",
    "CTTTATTTC",
    ".CTTTTTC.",
    "CCTTTTTCC",
    "CTCTCTCTC",
    "TC.TC.TCT",
    "C..TC..TC",
    "........."
  ),
  "dream-sheep": petSprite(
    "..WWWWW..",
    ".WWWWWWW.",
    "WWNNNNNWW",
    "WNWNNNWNW",
    "WNNNANNNW",
    ".WNNNNNW.",
    ".WWWWWWW.",
    "WWWWWWWWW",
    ".WW.W.WW.",
    "..N...N..",
    ".NN...NN."
  ),
  "zoo-panda-cub": petSprite(
    ".CC...CC.",
    "CCWWWWWCC",
    "CWWWWWWWC",
    "CWCCWCCWC",
    "CWCWAWCWC",
    ".CWWWWWC.",
    "..CWWWC..",
    ".CCWWWCC.",
    "C.CWWWC.C",
    "..C...C..",
    ".CC...CC."
  ),
  "sf-robot": petSprite(
    "....Q....",
    "...CRC...",
    "..RRRRR..",
    ".RTTTTTR.",
    "RTWTTTWTR",
    "RTTATTTTR",
    ".RRRRRRR.",
    "..RVRVR..",
    "..RTTTR..",
    "..R...R..",
    ".RR...RR."
  ),
  "space-cat": petSprite(
    "..CCCCC..",
    ".CEEEEEC.",
    "CEC...CEC",
    "CECCCCCEC",
    "CECWECWEC",
    "CECCACCEC",
    ".CECCCCEC",
    "..CPPPC..",
    "..CEEECC.",
    "..C.C.CC.",
    ".CC...CCC"
  ),
  "christmas-cat": petSprite(
    "...WW....",
    "..RRR....",
    ".RRRRRW..",
    "RRRRRRR..",
    "WWWWWWW..",
    "C.....C..",
    "CCWWWWWCC",
    "CWCCWCCWC",
    "CWWAWWC.C",
    ".CWWWC.CC",
    ".CC.CC..."
  ),
  "sky-bird": petSprite(
    ".........",
    "...CCC...",
    "..CBBBC..",
    ".CBBBBWCA",
    "CBBBBBBBA",
    ".CBYBBBC.",
    "..CBBBC..",
    "...CBC...",
    "..CC.CC..",
    ".........",
    "........."
  ),
  "fantasy-dragon": petSprite(
    "....A....",
    "...CGC...",
    "..CGGGC..",
    ".CGWGGGCA",
    "CGGGGGGGC",
    "A.CGGGGGC",
    "AA.CGGGCC",
    "..CGGGCCC",
    "..CG.GCCC",
    ".CC...CCC",
    ".......CC"
  ),
  "school-chick": petSprite(
    "...CCC...",
    "..CYYYC..",
    ".CYYYYYC.",
    "CYYCYCYYC",
    "CYYYAYYYC",
    ".CYYYYYC.",
    "..CYYYC..",
    "..CYYYC..",
    "...Y.Y...",
    "..CC.CC..",
    "........."
  ),
  "rainy-frog": petSprite(
    ".CG...GC.",
    "CWC...CWC",
    "CGGGGGGGC",
    "CGGGAGGGC",
    ".CGGGGGC.",
    "..CGGGC..",
    ".CG.G.GC.",
    "CG..G..GC",
    "C...G...C",
    ".CC...CC.",
    "........."
  ),
  "library-owl": petSprite(
    ".C.....C.",
    "CCNNNNNCC",
    "CNNNNNNNC",
    "CNWCNCWNC",
    "CNWNCNWNC",
    "CNNNANNNC",
    ".CNNNNNC.",
    "..CNNNC..",
    ".CCNNNCC.",
    "..CN.NC..",
    "..CC.CC.."
  ),
  "cafe-dog": petSprite(
    "...NNN...",
    "..NNNNN..",
    "NNCCCCCNN",
    "NNCWWWCNN",
    "NNCWAWCNN",
    ".NCNNNCN.",
    "..CYYYC..",
    "..CNNNC..",
    ".CCN.NCC.",
    ".C.....C.",
    "........."
  ),
  "bakery-cat": petSprite(
    "..WW.WW..",
    ".WWWWWWW.",
    "..WWWWW..",
    ".C.....C.",
    ".CNNNNNC.",
    "CNWNNNWNC",
    "CNNNANNNC",
    ".CNNNNNCC",
    "..CNNNCCC",
    ".CC.N.CC.",
    "........."
  ),
  "camping-squirrel": petSprite(
    "......CCC",
    "..C..CNNN",
    ".CNCCNNNC",
    "CNWNNNNNC",
    "CNNANNNCC",
    ".CNNNNNNC",
    "..CNNNCCC",
    "..CNNNNCC",
    "..CN.NNCC",
    ".CC...CCC",
    ".......CC"
  ),
  "greenhouse-snail": petSprite(
    "......G.G",
    ".....GWGW",
    "..CCC.GGG",
    ".CNNNCGGG",
    "CNNGNCGGG",
    "CNNNNCGGG",
    ".CNNNCGGG",
    "..CC.CGGG",
    ".CGGGGGGC",
    "CCGGGGGCC",
    "........."
  ),
  "music-cat": petSprite(
    "..C...C..",
    ".CCVVVCC.",
    "CVVVVVVVC",
    "CVWVVVWVC",
    "CVVVQVVVC",
    ".CVVVVVC.",
    "CCCVVVCCC",
    "C.CVVVC.C",
    "..CVVVC..",
    ".CC.V.CC.",
    "........."
  ),
  "arcade-slime": petSprite(
    ".........",
    "...CCC...",
    "..CBBBC..",
    ".CBBBBBC.",
    "CBBWBBWBC",
    "CBBBABBBC",
    ".CBBBBBC.",
    "..CBBBC..",
    ".CCBBBCC.",
    "C.C.C.C.C",
    "........."
  ),
  "hanok-dog": petSprite(
    ".CC...CC.",
    "CWWWWWWWC",
    "CWNCNCNWC",
    "CWWNWNWWC",
    "CWWNANWWC",
    ".CWWWWWC.",
    "CCWWWWWCC",
    "CWWWWWWWC",
    "CW.W.W.WC",
    ".CC.C.CC.",
    "........."
  ),
  "night-city-cat": catSprite(
    { outline: "C", body: "C", patch: "V", eye: "Q", nose: "A", accent: "B" },
    "prowl"
  ),
  "cat-chubby": catSprite(
    { outline: "C", body: "N", patch: "Y", eye: "W", nose: "Q", accent: "A" },
    "chubby"
  ),
  "cat-cheese": catSprite(
    { outline: "C", body: "O", patch: "Y", eye: "W", nose: "Q", accent: "W" },
    "classic"
  ),
  "cat-tabby": catSprite(
    { outline: "C", body: "I", patch: "C", eye: "W", nose: "Q", accent: "E" },
    "sit"
  ),
  /**
   * 스토어 배포본의 검정 고양이: 비대칭 흰 눈, 짧은 네모 몸,
   * 오른쪽으로 치켜든 꼬리라는 기존 인상을 9×11에서 그대로 살렸다.
   */
  "cat-black": petSprite(
    "C.C......",
    "CCCC.....",
    "CCWCCWW..",
    "CCCCCC...",
    "CCCCCC...",
    "CCCCCC..C",
    "CCCCCC.CC",
    "CCCCCCCCC",
    ".C....C..",
    "CC....CC.",
    "........."
  ),
  "cat-white": catSprite(
    { outline: "C", body: "W", patch: "E", eye: "C", nose: "Q", accent: "A" },
    "prowl"
  ),
  "cat-calico-loaf": catSprite(
    { outline: "C", body: "W", patch: "O", eye: "C", nose: "Q", accent: "N" },
    "loaf"
  ),
  "cat-siamese": catSprite(
    { outline: "C", body: "Y", patch: "N", eye: "A", nose: "Q", accent: "N" },
    "sphynx"
  ),
  "cat-sleepy": catSprite(
    { outline: "C", body: "W", patch: "E", eye: "C", nose: "Q", accent: "P" },
    "curled"
  ),
  "cat-maine-coon": catSprite(
    { outline: "C", body: "N", patch: "C", eye: "W", nose: "Q", accent: "Y" },
    "longhair"
  ),
  "cat-scottish-fold": catSprite(
    { outline: "C", body: "I", patch: "W", eye: "W", nose: "Q", accent: "A" },
    "folded"
  ),
  "cat-russian-blue": catSprite(
    { outline: "C", body: "G", patch: "E", eye: "A", nose: "Q", accent: "W" },
    "sit"
  ),
  "cat-bengal": catSprite(
    { outline: "C", body: "O", patch: "C", eye: "W", nose: "Q", accent: "N" },
    "prowl"
  ),
  "cat-persian": catSprite(
    { outline: "C", body: "W", patch: "N", eye: "C", nose: "Q", accent: "E" },
    "chubby"
  ),
  "cat-munchkin": catSprite(
    { outline: "C", body: "O", patch: "Y", eye: "W", nose: "Q", accent: "W" },
    "low"
  ),
  "cat-ragdoll": catSprite(
    { outline: "C", body: "W", patch: "N", eye: "G", nose: "Q", accent: "E" },
    "longhair"
  ),
  "cat-sphynx": catSprite(
    { outline: "C", body: "N", patch: "Q", eye: "W", nose: "A", accent: "Q" },
    "sphynx"
  ),
  "egg-snooze-snail": petSprite(
    "W......G.",
    ".W....G.G",
    "..CCC.GGG",
    ".CNNNCGGG",
    "CNNGNCGGG",
    "CNNNNCGGG",
    ".CNNNCGGG",
    "..CC.CGGG",
    ".CGGGGGGC",
    "CCGGGGGCC",
    "........."
  ),
  "egg-leap-frog": petSprite(
    ".CG...GC.",
    "CWC...CWC",
    "CGGGGGGGC",
    "..CGAGC..",
    "...CGC...",
    "..CG.GC..",
    ".CG...GC.",
    "CC.....CC",
    ".........",
    ".........",
    "........."
  ),
  ...STORE_CAT_ROWS
};
