import type { SlotId } from "../catalog";
import type { ThemeArtItem, ThemeArtwork } from "../themeArtwork";

const repeatRow = (pattern: string, width: number) =>
  pattern.repeat(Math.ceil(width / pattern.length)).slice(0, width);

const stampedCanvas = (
  width: number,
  height: number,
  fill: string,
  stamps: Array<{ x: number; y: number; rows: string[] }>
) => {
  const canvas = Array.from({ length: height }, () => Array(width).fill(fill));
  for (const stamp of stamps) {
    stamp.rows.forEach((row, py) => {
      [...row].forEach((token, px) => {
        const x = stamp.x + px;
        const y = stamp.y + py;
        if (token !== "." && x >= 0 && x < width && y >= 0 && y < height) canvas[y][x] = token;
      });
    });
  }
  return canvas.map((row) => row.join(""));
};

const centeredRow = (width: number, content: string, fill: string) => {
  const left = Math.floor((width - content.length) / 2);
  return fill.repeat(left) + content + fill.repeat(width - left - content.length);
};

function item(
  id: string,
  nameKo: string,
  nameEn: string,
  slot: SlotId | SlotId[],
  rows: string[],
  limited = false
): ThemeArtItem {
  return {
    id,
    nameKo,
    nameEn,
    slots: Array.isArray(slot) ? slot : [slot],
    rows,
    limited
  };
}

// ── SF · 격리 연구실 ────────────────────────────────────────

const DATA_BUS = ["T....V", "TTTTTV", ".....V", "QQQ..V", "..TTTV", "..T..."];

const SF_WALLPAPER = stampedCanvas(
  64,
  31,
  "C",
  [
    { x: 3, y: 2, rows: DATA_BUS },
    { x: 25, y: 9, rows: DATA_BUS },
    { x: 48, y: 1, rows: DATA_BUS },
    { x: 11, y: 21, rows: DATA_BUS },
    { x: 39, y: 22, rows: DATA_BUS },
    { x: 0, y: 17, rows: [repeatRow("IIIT...C", 64)] },
    { x: 0, y: 18, rows: [repeatRow("...TIIIC", 64)] },
    { x: 58, y: 13, rows: ["Q", "Q", "QQQ"] }
  ]
);

const SF_FLOORING = [
  "R".repeat(64),
  repeatRow("IICCIICC", 64),
  repeatRow("ICCTICCT", 64),
  repeatRow("CCTTCCTT", 64),
  repeatRow("TTCCVVCC", 64),
  repeatRow("CCTTCCTT", 64),
  repeatRow("ICCTICCT", 64),
  repeatRow("IICCIICC", 64),
  "R".repeat(64)
];

const SF_WINDOW = [
  "....RRRRRRRR....",
  "..RRCCCCCCCCRR..",
  ".RCCTTTTTTTTCCR.",
  "RCCTCCCCCCCCTCCR",
  "RCTCCVVVVCCCCTCR",
  "RCTCVVQQVVCCCTCR",
  "RCTCVVWWVVCCCTCR",
  "RCTCCVVVVCCCCTCR",
  "RCCTTTTTTTTTTCCR",
  ".RCCCCCQCCCCCCR.",
  "..RRCCCCCCCCRR..",
  "....RRRRRRRR...."
];

const SF_DESK = [
  centeredRow(56, "R".repeat(48), "."),
  centeredRow(56, `R${"I".repeat(16)}R....R${"I".repeat(24)}R`, "."),
  centeredRow(56, `R${repeatRow("TTVV", 16)}R....R${repeatRow("TTQQ", 24)}R`, "."),
  centeredRow(56, "R".repeat(48), "."),
  centeredRow(56, `RR${".".repeat(12)}RR${".".repeat(12)}RR${".".repeat(16)}RR`, "."),
  centeredRow(56, `RR${".".repeat(12)}RR${".".repeat(12)}RR${".".repeat(16)}RR`, "."),
  centeredRow(56, `RR${".".repeat(12)}RR${".".repeat(12)}RR${".".repeat(16)}RR`, "."),
  centeredRow(56, `RR${".".repeat(12)}RR${".".repeat(12)}RR${".".repeat(16)}RR`, ".")
];

const SF_MONITOR = [
  ".RRR..RRR..RRR",
  "RTTR.RVVR.RQQR",
  "RTTR.RVVR.RQWR",
  "RTVR.RVTR.RQQR",
  ".RRR..RRR..RRR",
  "...TTVVQQTT...",
  "....R....R....",
  "....RR..RR....",
  "...RRRRRRRR...",
  "....IIIIII...."
];

const SF_CAN = [
  "..RR..",
  ".RTTR.",
  "RTVVTR",
  "RTQQTR",
  ".RTTR.",
  "..RR.."
];

const SF_BIO_POD = [
  "..RRR..",
  ".RTTTR.",
  "RTVVVTR",
  "RTVWVTR",
  "RTVQVTR",
  "RTVVVTR",
  ".RTTTR.",
  "..RRR.."
];

const SF_LAMP = [
  "RRR..",
  "RTTR.",
  "..RR.",
  ".RR..",
  ".R...",
  ".RR..",
  "..RR.",
  "...R.",
  "..R..",
  ".RQR.",
  "RVVVR",
  ".RRR."
];

const SF_MAT = ["RVVIVVIR", "RIVVIVVR", "RRRRRRRR"];
const SF_DRONE = ["T...V", "RTQTR", ".RWR.", "R...R"];
const SF_FRAME = ["RRRRRR", "RCCCIR", "RCTTIR", "RTQVTR", "RCVTIR", "RCCCIR", "RRRRRR"];
const SF_CLOCK = ["RRRR", "RVVR", "RTQR", "RRRR"];

const SF_ROBOT = [
  "..RR..",
  ".RTTR.",
  "RTWQTR",
  ".RRRR.",
  "RIVVIR",
  "RIIIIR",
  ".R..R.",
  "RR..RR"
];

const SF_CORE = [
  "..TT..",
  ".TRRT.",
  "TRQQRT",
  "TRWWRT",
  "TRQQRT",
  ".TRRT.",
  "..RR..",
  ".RRRR."
];

// ── 우주 · 돔 천문대 ────────────────────────────────────────

const STAR = [".W.", "WAW", ".W."];
const PLANET_ARC = [
  ".......EEEEE.......",
  "....EEPPPPPPPEE....",
  "..EPPPPPPPPPPPPE...",
  ".EPPPPAAAPPPPPPPE..",
  "EPPPPAAAAAPPPPPPPE.",
  "EPPPPPPPPPPPPPPPPE."
];

const SPACE_WALLPAPER = stampedCanvas(
  64,
  31,
  "I",
  [
    { x: -1, y: 20, rows: PLANET_ARC },
    { x: 43, y: 1, rows: PLANET_ARC },
    { x: 4, y: 3, rows: STAR },
    { x: 29, y: 8, rows: STAR },
    { x: 53, y: 17, rows: STAR },
    { x: 23, y: 24, rows: ["W", "..A"] },
    { x: 0, y: 15, rows: [repeatRow("M.......", 64)] }
  ]
);

const SPACE_FLOORING = [
  "C".repeat(64),
  "I".repeat(64),
  repeatRow("IIPPPEEI", 64),
  repeatRow("IPCCCCPI", 64),
  repeatRow("IPIAAIPE", 64),
  repeatRow("IPCCCCPI", 64),
  repeatRow("IIPPPEEI", 64),
  "I".repeat(64),
  "C".repeat(64)
];

const SPACE_WINDOW = [
  ".....CCCCCC.....",
  "...CCPPPPPPCC...",
  "..CPPPPPPPPPPC..",
  ".CPPPPWPPPPPPPC.",
  "CPPPPPPPAAAAAPPC",
  "CPPPEEEEEEEEPPPC",
  "CPPEEEVVVEEEPPPC",
  "CPPPEEEEEEEEPPPC",
  ".CPPPPPPPPPPPPC.",
  "..CCCCCCCCCCCC..",
  "...CC......CC...",
  "....C......C...."
];

const SPACE_DESK = [
  centeredRow(56, "C".repeat(44), "."),
  centeredRow(56, `C${"E".repeat(46)}C`, "."),
  centeredRow(56, `C${repeatRow("PPIA", 46)}C`, "."),
  centeredRow(56, `CC${"I".repeat(46)}CC`, "."),
  centeredRow(56, `CC${".".repeat(12)}CC${".".repeat(16)}CC${".".repeat(12)}CC`, "."),
  centeredRow(56, `CC${".".repeat(12)}CC${".".repeat(16)}CC${".".repeat(12)}CC`, "."),
  centeredRow(56, `CC${".".repeat(12)}CC${".".repeat(16)}CC${".".repeat(12)}CC`, "."),
  centeredRow(56, `CC${".".repeat(12)}CC${".".repeat(16)}CC${".".repeat(12)}CC`, ".")
];

const SPACE_MONITOR = [
  "....CCCCCC....",
  "..CCPPPPPPCC..",
  ".CPPIIIIIPPPC.",
  "CPPIIWIIIIPPPC",
  "CPIIPPPAIIIIPC",
  "CPPIIIIIIIIIPC",
  ".CPPPPPPPPPPC.",
  "..CCCCCCCCCC..",
  "......CC......",
  "....CCCCCC...."
];

const SPACE_CUP = [
  "..CC..",
  ".CEEC.",
  "CEWWEC",
  "CEAAEC",
  ".CEEC.",
  "..CC.."
];

const SPACE_SPROUT = [
  "..W.W..",
  ".WAAAW.",
  "..PPP..",
  ".PCCCP.",
  "PCEEECP",
  ".CPIPC.",
  ".CIIIC.",
  "..CCC.."
];

const SPACE_LAMP = [
  ".CEC.",
  "CEWEC",
  ".CEC.",
  "..C..",
  ".CPC.",
  "C.P.C",
  "..C..",
  ".C.C.",
  "C...C",
  "C.A.C",
  "C...C",
  "CCCCC"
];

const SPACE_MAT = ["CPIAAIPC", "CIPPPPIC", "CCCCCCCC"];
const SPACE_ROCKET = ["..W..", ".WEW.", "CPAPC", "C.C.C"];
const SPACE_FRAME = ["CCCCCC", "CWWEEC", "CPEEPC", "CAPAIC", "CPEEPC", "CWWEEC", "CCCCCC"];
const SPACE_CLOCK = [".CC.", "CEEC", "AWPC", ".CC."];

const SPACE_CAT = [
  ".CCC..",
  "CE.EC.",
  "CEWEC.",
  "CEAEC.",
  "CPPC.C",
  "CCCCCC",
  ".C..C.",
  "C....C"
];

const SPACE_LANDER = [
  "..W...",
  ".EAE..",
  "CEPEC.",
  "CPIPC.",
  ".CCC..",
  "C.C.C.",
  "C...C.",
  "CC..CC"
];

export const SF_SPACE_ARTWORK: ThemeArtwork[] = [
  {
    key: "sf",
    labelKo: "SF · 격리 연구실",
    labelEn: "SF · Containment laboratory",
    items: [
      item("sf-wallpaper", "데이터 버스 벽", "Data-bus wall", "wallpaper", SF_WALLPAPER, true),
      item("sf-flooring", "경고 격자 바닥", "Hazard-grid flooring", "flooring", SF_FLOORING),
      item("sf-window", "육각 격리 포드", "Hex containment pod", "wall-window", SF_WINDOW, true),
      item("sf-desk", "비대칭 로봇 작업대", "Asymmetric robot bench", "furniture-desk", SF_DESK),
      item("sf-monitor", "삼중 홀로그램", "Triple hologram", "desk-center", SF_MONITOR),
      item("sf-can", "육각 에너지 셀", "Hex energy cell", "desk-left", SF_CAN),
      item("sf-bio-pod", "바이오 포드", "Bio pod", "desk-right", SF_BIO_POD),
      item("sf-lamp", "로봇 암 조명", "Robot-arm light", "desk-lamp", SF_LAMP),
      item("sf-mat", "위험선 패널", "Hazard-line panel", "desk-front", SF_MAT),
      item("sf-drone", "비대칭 드론", "Asymmetric drone", ["wall-shelf-a", "wall-shelf-b"], SF_DRONE),
      item("sf-frame", "표본 스캔 액자", "Specimen scan", "wall-frame", SF_FRAME),
      item("sf-clock", "디지털 시계", "Digital clock", "wall-clock", SF_CLOCK),
      item("sf-robot", "정비 로봇", "Maintenance robot", "floor-left", SF_ROBOT),
      item("sf-core", "반응로 링", "Reactor ring", "floor-right", SF_CORE, true)
    ]
  },
  {
    key: "space",
    labelKo: "우주 · 돔 천문대",
    labelEn: "Space · Dome observatory",
    items: [
      item("space-wallpaper", "행성 가장자리 벽", "Planet-limb wallpaper", "wallpaper", SPACE_WALLPAPER, true),
      item("space-flooring", "궤도 레일 바닥", "Orbital-rail flooring", "flooring", SPACE_FLOORING),
      item("space-window", "천문대 돔 셔터", "Observatory dome shutter", "wall-window", SPACE_WINDOW, true),
      item("space-desk", "곡면 관측 콘솔", "Curved observation console", "furniture-desk", SPACE_DESK),
      item("space-monitor", "원형 성도 레이더", "Circular star-map radar", "desk-center", SPACE_MONITOR),
      item("space-cup", "우주 헬멧 플라스크", "Space-helmet flask", "desk-left", SPACE_CUP),
      item("space-sprout", "월석 표본", "Moon-rock sample", "desk-right", SPACE_SPROUT),
      item("space-lamp", "별자리 투영기", "Constellation projector", "desk-lamp", SPACE_LAMP),
      item("space-mat", "궤도 링 패널", "Orbital-ring panel", "desk-front", SPACE_MAT),
      item("space-rocket", "미니 로켓", "Mini rocket", ["wall-shelf-a", "wall-shelf-b"], SPACE_ROCKET),
      item("space-frame", "행성 위상도", "Planet phases", "wall-frame", SPACE_FRAME),
      item("space-clock", "공전 시계", "Orbital clock", "wall-clock", SPACE_CLOCK),
      item("space-cat", "우주복 고양이", "Spacesuit cat", "floor-left", SPACE_CAT),
      item("space-lander", "착륙선", "Lander", "floor-right", SPACE_LANDER, true)
    ]
  }
];
