/**
 * BLK ANVL garment render engine.
 *
 * Builds studio "ghost mannequin" product renders as SVG: silhouette,
 * fabric grain, wash, folds, volume shading, ribbing, stitching and
 * physically-placed branding (embroidered monogram, printed wordmark,
 * woven neck label). Canvas is 1000 x 1250 user units.
 *
 * Shapes are drawn as right-half outlines and mirrored around x = 500.
 * Points are [x, y] (smooth) or [x, y, 1] (sharp corner).
 */
import { monoPathList, monoViewBox, wordmarkInner, wordViewBox } from "./logo-svg.mjs";

const W = 1000;
const H = 1250;
const CX = 500;

// ─── geometry helpers ───────────────────────────────────────────────
const mx = (x) => 2 * CX - x;

function smoothPath(pts, closed = true) {
  const n = pts.length;
  const P = (i) => pts[(i + n) % n];
  let d = `M${P(0)[0].toFixed(1)},${P(0)[1].toFixed(1)}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const s1 = p1[2] || (!closed && i === 0);
    const s2 = p2[2] || (!closed && i === n - 2);
    const c1 = s1 ? [p1[0] + (p2[0] - p1[0]) / 3, p1[1] + (p2[1] - p1[1]) / 3] : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = s2 ? [p2[0] - (p2[0] - p1[0]) / 3, p2[1] - (p2[1] - p1[1]) / 3] : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
}

/** Mirror a right-half outline (top centre → bottom centre) into a closed path. */
function mirrored(half) {
  const left = half.slice(1, -1).reverse().map(([x, y, s]) => [mx(x), y, s]);
  return smoothPath([...half, ...left]);
}

/** Open polyline on right side + its mirror, as two subpaths. */
function pair(pts) {
  return smoothPath(pts, false) + " " + smoothPath(pts.map(([x, y, s]) => [mx(x), y, s]), false);
}
const open = (pts) => smoothPath(pts, false);

/** Quadratic curve across the centre: endpoints (mx(ex),ey)/(ex,ey) with midpoint at y=c. */
const across = (ex, ey, c) => `M${mx(ex)},${ey} Q${CX},${2 * c - ey} ${ex},${ey}`;
const acrossRev = (ex, ey, c) => ` L${ex},${ey} Q${CX},${2 * c - ey} ${mx(ex)},${ey}`;

// ─── colour helpers ─────────────────────────────────────────────────
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = (r) => "#" + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const shade = (hex, f) => rgbToHex(hexToRgb(hex).map((v) => (f < 0 ? v * (1 + f) : v + (255 - v) * f)));
const lum = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// ─── neckline builder for crew/scoop tops ───────────────────────────
function crewNeck({ ex, ey, backTop, band, frontDip }) {
  const ix = ex - band * 0.9, iy = ey + band * 0.35;
  const backInnerC = backTop + band;
  const frontInnerC = frontDip - band;
  return {
    // visible interior of the garment through the neck opening
    interior: across(ix, iy, backInnerC) + acrossRev(ix, iy, frontInnerC) + " Z",
    backBand: across(ex, ey, backTop) + ` L${ix},${iy}` + ` Q${CX},${2 * backInnerC - iy} ${mx(ix)},${iy} Z`,
    frontBand: across(ex, ey, frontDip) + ` L${ix},${iy}` + ` Q${CX},${2 * frontInnerC - iy} ${mx(ix)},${iy} Z`,
    frontBandStitch: across(ex - 2, ey + 4, frontDip - 4),
    backBandOnly: across(ex, ey, backTop) + ` L${ix},${iy}` + ` Q${CX},${2 * backInnerC - iy} ${mx(ix)},${iy} Z`,
    labelY: backInnerC + 6,
    backInnerC,
  };
}

// ─── garment definitions ────────────────────────────────────────────
// Each returns { body, parts, folds, seams, ribs, logos, detail, texture }
// given view "front" | "back".

function tee(cfg) {
  return (view) => {
    const { half, neck, sleeveHem, hem, logoFront, logoBack, folds = [], seams = [] } = cfg;
    const nk = crewNeck(neck);
    const body = mirrored(half);
    const under = [];
    const over = [];
    if (view === "front") {
      under.push({ d: nk.interior, kind: "interior" });
      under.push({ d: nk.backBand, kind: "rib", tone: -0.12 });
      over.push({ d: nk.frontBand, kind: "rib" });
    } else {
      over.push({ d: nk.backBandOnly, kind: "rib" });
    }
    const ribs = [];
    const stitches = [
      ...(sleeveHem ? [pair(sleeveHem)] : []),
      ...(hem ? [across(hem[0], hem[1], hem[2])] : []),
      ...(view === "front" ? [nk.frontBandStitch] : [across(neck.ex - 2, neck.ey + 4, neck.backTop + neck.band + 2)]),
    ];
    return {
      body,
      under,
      over,
      folds,
      seams: [...seams, ...(cfg.shoulderSeam ? [pair(cfg.shoulderSeam)] : []), ...(cfg.armSeam ? [pair(cfg.armSeam)] : [])],
      stitches,
      ribs,
      label: view === "front" && cfg.label !== false ? { x: CX, y: nk.labelY, w: 64, h: 22 } : null,
      logos: view === "front" ? logoFront : logoBack,
      detail: view === "front" ? cfg.detailFront : cfg.detailBack,
      texture: cfg.texture,
    };
  };
}

const G = {};

// Oversized tee ------------------------------------------------------
G.oversizedTee = tee({
  half: [[500, 132], [596, 150, 1], [700, 176], [802, 222, 1], [866, 360], [912, 510, 1], [800, 552, 1], [756, 500, 1], [758, 800], [764, 1100, 1], [640, 1108], [500, 1110]],
  neck: { ex: 596, ey: 150, backTop: 132, band: 24, frontDip: 214 },
  sleeveHem: [[900, 478, 1], [792, 520, 1]],
  hem: [762, 1072, 1080],
  shoulderSeam: [[802, 222, 1], [758, 340], [756, 500, 1]],
  logoFront: [{ type: "mono", x: 638, y: 330, s: 50, emb: true }],
  logoBack: [{ type: "word", x: 500, y: 300, w: 300 }],
  folds: [
    { d: open([[760, 520], [690, 600], [640, 700]]), w: 26, a: 0.5 },
    { d: open([[750, 740], [700, 800], [670, 880]]), w: 22, a: 0.22 },
    { d: open([[860, 400], [820, 430], [790, 460]]), w: 18, a: 0.4 },

    { d: open([[700, 260], [640, 300], [600, 380]]), w: 30, a: 0.25, hi: true },
  ],
  detailFront: [632, 340, 300],
  detailBack: [500, 300, 420],
  texture: [500, 150, 280],
});

// Compression tee ----------------------------------------------------
G.compressionTee = tee({
  half: [[500, 140], [584, 148, 1], [680, 168], [738, 204, 1], [792, 328], [828, 436, 1], [748, 466, 1], [700, 386, 1], [684, 520], [664, 700], [668, 900], [678, 1040, 1], [500, 1046]],
  neck: { ex: 584, ey: 148, backTop: 140, band: 16, frontDip: 206 },
  sleeveHem: [[822, 420, 1], [746, 450, 1]],
  hem: [676, 1018, 1024],
  logoFront: [{ type: "mono", x: 782, y: 392, s: 34, rot: -22, emb: false }],
  logoBack: [{ type: "word", x: 500, y: 230, w: 170 }],
  seams: [pair([[700, 390], [632, 560], [612, 760], [628, 1040]]), pair([[738, 204, 1], [700, 300], [700, 386, 1]])],
  folds: [
    { d: open([[690, 420], [640, 470], [580, 500]]), w: 18, a: 0.35 },
    { d: open([[660, 760], [600, 800], [560, 860]]), w: 18, a: 0.25 },
    { d: open([[560, 300], [530, 420], [530, 560]]), w: 40, a: 0.22, hi: true },
    { d: open([[620, 620], [580, 700]]), w: 30, a: 0.18, hi: true },
  ],
  detailFront: [770, 400, 260],
  detailBack: [500, 230, 360],
  texture: [640, 640, 300],
});

// Men's tank ---------------------------------------------------------
G.tankMen = (view) => {
  const half = [[500, 148], [578, 124, 1], [650, 126, 1], [662, 260], [690, 420], [722, 520, 1], [728, 800], [736, 1060, 1], [500, 1066]];
  const nk = crewNeck({ ex: 578, ey: 124, backTop: 148, band: 14, frontDip: 300 });
  const armBind = open([[650, 126, 1], [662, 260], [690, 420], [722, 520, 1]]);
  return {
    body: mirrored(half),
    under: view === "front" ? [{ d: nk.interior, kind: "interior" }] : [],
    over: view === "front" ? [{ d: nk.frontBand, kind: "rib" }] : [{ d: nk.backBandOnly, kind: "rib" }],
    binding: [armBind, armBind.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${mx(+x)},${y}`)],
    folds: [
      { d: open([[720, 560], [660, 640], [620, 760]]), w: 24, a: 0.35 },
      { d: open([[560, 420], [540, 600]]), w: 50, a: 0.2, hi: true },
      { d: open([[700, 860], [640, 940]]), w: 20, a: 0.25 },
    ],
    seams: [],
    stitches: [across(734, 1032, 1038)],
    label: view === "front" ? { x: CX, y: 176, w: 58, h: 20 } : null,
    logos: view === "front" ? [{ type: "mono", x: 600, y: 410, s: 40, emb: true }] : [{ type: "word", x: 500, y: 250, w: 200 }],
    detail: view === "front" ? [600, 420, 280] : [500, 250, 380],
    texture: [690, 360, 260],
  };
};

// Training shorts ----------------------------------------------------
G.shorts = (view) => {
  const half = [[500, 326], [722, 326, 1], [728, 404], [754, 620], [782, 822, 1], [690, 840], [536, 848, 1], [514, 764], [500, 738, 1]];
  const wb = `M${mx(722)},326 L722,326 L728,404 Q${CX},412 ${mx(728)},404 Z`;
  const parts = {
    body: mirrored(half),
    under: [],
    over: [{ d: wb, kind: "rib", tone: -0.05 }],
    folds: [
      { d: open([[515, 740], [580, 690], [640, 640]]), w: 22, a: 0.45 },
      { d: open([[540, 820], [600, 760]]), w: 18, a: 0.3 },
      { d: open([[700, 460], [690, 600], [700, 760]]), w: 40, a: 0.18, hi: true },
      { d: open([[620, 430], [600, 520]]), w: 18, a: 0.25 },
    ],
    seams: [pair([[728, 404], [752, 610], [780, 820]]), across(782, 800, 818)],
    stitches: [across(780, 806, 826)],
    logos: view === "front" ? [{ type: "mono", x: 702, y: 770, s: 40, emb: false, rot: 6 }] : [{ type: "word", x: 500, y: 366, w: 140 }],
    detail: view === "front" ? [690, 760, 260] : [560, 470, 320],
    texture: [500, 380, 300],
  };
  if (view === "front") {
    parts.cords = [open([[488, 372], [480, 440], [470, 520]]), open([[512, 372], [522, 450], [534, 540]])];
    parts.seams.push(pair([[690, 420], [712, 520], [744, 560]]));
  } else {
    parts.zip = { x1: 556, x2: 666, y: 476 };
    parts.seams.push(open([[500, 412], [500, 738]]));
  }
  return parts;
};

// Hoodie -------------------------------------------------------------
function hoodieFactory(k = 1, len = 0) {
  const X = (x) => CX + (x - CX) * k;
  return (view) => {
    const half = [[500, 255], [X(600), 232, 1], [X(700), 248], [X(790), 282, 1], [X(862), 450], [X(906), 820 + len * 0.6], [X(918), 958 + len, 1], [X(915), 1040 + len, 1], [X(836), 1052 + len, 1], [X(834), 974 + len, 1], [X(800), 700], [X(760), 480, 1], [X(762), 800], [X(758), 1010 + len, 1], [X(752), 1110 + len, 1], [500, 1116 + len]];
    const hood = view === "front"
      ? smoothPath([[CX, 40], [X(612), 66], [X(650), 170], [X(612), 262, 1], [CX, 300, 1], [mx(X(612)), 262, 1], [mx(X(650)), 170], [mx(X(612)), 66]])
      : null;
    const hoodInner = view === "front" ? smoothPath([[CX, 96], [570, 120], [588, 210], [560, 284, 1], [CX, 312, 1], [440, 284, 1], [412, 210], [430, 120]]) : null;
    const hoodBack = view === "back" ? smoothPath([[CX, 220], [X(604), 236, 1], [X(626), 330], [X(590), 440], [CX, 490, 1], [mx(X(590)), 440], [mx(X(626)), 330], [mx(X(604)), 236, 1]]) : null;
    const wbTop = 1010 + len, hemY = 1110 + len;
    const wb = `M${mx(X(758))},${wbTop} L${X(758)},${wbTop} L${X(752)},${hemY} Q${CX},${hemY + 8} ${mx(X(752))},${hemY} Z`;
    const cuffR = `M${X(918)},${958 + len} L${X(915)},${1040 + len} L${X(836)},${1052 + len} L${X(834)},${974 + len} Z`;
    const cuffL = cuffR.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${mx(+x)},${y}`);
    const parts = {
      body: mirrored(half),
      behind: hood ? [{ d: hood, kind: "panel" }] : [{ d: hoodBack, kind: "panel", tone: 0.03 }],
      under: hoodInner ? [{ d: hoodInner, kind: "interior", strength: 0.55 }] : [],
      over: [{ d: wb, kind: "rib" }, { d: cuffR, kind: "rib" }, { d: cuffL, kind: "rib" }],
      folds: [
        { d: open([[X(760), 500], [X(700), 560], [X(640), 640]]), w: 30, a: 0.45 },
        { d: open([[X(850), 560], [X(830), 660], [X(840), 760]]), w: 26, a: 0.35 },
        { d: open([[X(880), 860], [X(860), 900], [X(840), 940]]), w: 20, a: 0.4 },
        { d: open([[X(740), 900], [X(690), 960], [X(660), 1000]]), w: 24, a: 0.35 },
        { d: open([[X(700), 320], [X(660), 400], [X(640), 520]]), w: 50, a: 0.18, hi: true },
        { d: open([[X(884), 620], [X(892), 760]]), w: 24, a: 0.16, hi: true },
      ],
      seams: [pair([[X(790), 282, 1], [X(764), 380], [X(760), 480, 1]])],
      stitches: [across(X(756), wbTop + 4, wbTop + 8)],
      logos: view === "front" ? [{ type: "mono", x: X(626), y: 440, s: 56, emb: true }] : [{ type: "word", x: 500, y: 590, w: 420 * k }],
      detail: view === "front" ? [X(622), 450, 300] : [500, 590, 520],
      texture: [X(620), 960 + len, 300],
    };
    if (view === "front") {
      const flapR = `M${X(612)},262 C${X(590)},282 548,300 486,322 L476,306 C530,288 568,268 ${X(588)},240 Z`;
      const flapL = `M${mx(X(612))},262 C${mx(X(590))},282 452,300 514,322 L524,306 C470,288 432,268 ${mx(X(588))},240 Z`;
      parts.over.push({ d: flapL, kind: "panel", tone: 0.04 }, { d: flapR, kind: "panel", tone: 0.06 });
      parts.cords = [open([[470, 312], [462, 420], [458, 540]]), open([[530, 312], [540, 430], [546, 556]])];
      parts.eyelets = [[470, 310], [530, 310]];
      const pk = `M420,700 L580,700 L${640},${900 + len * 0.3} L${360},${900 + len * 0.3} Z`;
      parts.over.push({ d: pk, kind: "panel", tone: 0.03, outline: true });
      parts.pocketEdge = [open([[580, 700, 1], [640, 900 + len * 0.3, 1]]), open([[420, 700, 1], [360, 900 + len * 0.3, 1]])];
    } else {
      parts.over.push({ d: hoodBack, kind: "panel", tone: 0.03, outline: true, noFill: false });
      parts.seams.push(open([[CX, 222], [CX, 488]]));
    }
    return parts;
  };
}
G.hoodie = hoodieFactory(1, 0);
G.hoodieOversized = hoodieFactory(1.07, 30);

// Joggers ------------------------------------------------------------
G.joggers = (view) => {
  const half = [[500, 170], [690, 170, 1], [694, 252, 1], [722, 380], [720, 600], [690, 900], [662, 1080, 1], [656, 1180, 1], [560, 1184, 1], [558, 1082, 1], [546, 800], [522, 590], [500, 540, 1]];
  const wb = `M${mx(690)},170 L690,170 L694,252 Q${CX},260 ${mx(694)},252 Z`;
  const cuffR = `M662,1080 L656,1180 L560,1184 L558,1082 Z`;
  const cuffL = cuffR.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${mx(+x)},${y}`);
  const parts = {
    body: mirrored(half),
    under: [],
    over: [{ d: wb, kind: "rib", tone: -0.04 }, { d: cuffR, kind: "rib" }, { d: cuffL, kind: "rib" }],
    folds: [
      { d: open([[505, 560], [570, 500], [640, 470]]), w: 22, a: 0.45 },
      { d: open([[560, 1060], [610, 1020], [660, 1000]]), w: 18, a: 0.45 },
      { d: open([[560, 990], [610, 960], [670, 950]]), w: 16, a: 0.35 },
      { d: open([[680, 420], [670, 600], [640, 780]]), w: 40, a: 0.18, hi: true },
      { d: open([[640, 760], [600, 790], [560, 800]]), w: 16, a: 0.3 },
    ],
    seams: [pair([[700, 720], [640, 760], [556, 770]]), pair([[694, 830], [640, 860], [552, 862]])],
    stitches: [],
    logos: view === "front" ? [{ type: "mono", x: 636, y: 340, s: 38, emb: true }] : [{ type: "word", x: 500, y: 214, w: 120 }],
    detail: view === "front" ? [634, 350, 260] : [600, 350, 320],
    texture: [610, 1120, 260],
  };
  if (view === "front") {
    parts.cords = [open([[490, 220], [482, 300], [474, 380]]), open([[510, 220], [520, 310], [530, 400]])];
    parts.seams.push(pair([[650, 254], [690, 330], [716, 430]]));
  } else {
    parts.seams.push(open([[500, 256], [500, 540]]));
    parts.over.push({ d: "M600,320 L680,318 L684,420 Q642,428 604,420 Z", kind: "panel", tone: 0.03, outline: true });
  }
  return parts;
};

// Seamless long sleeve ----------------------------------------------
G.longSleeve = tee({
  half: [[500, 140], [580, 148, 1], [670, 168], [728, 204, 1], [776, 340], [810, 620], [846, 900], [862, 990, 1], [806, 1004, 1], [776, 800], [748, 560], [700, 390, 1], [682, 560], [670, 760], [678, 1040, 1], [500, 1046]],
  neck: { ex: 580, ey: 148, backTop: 140, band: 16, frontDip: 204 },
  sleeveHem: [[858, 960, 1], [800, 974, 1]],
  hem: [676, 1018, 1024],
  logoFront: [{ type: "mono", x: 612, y: 326, s: 42, emb: false, knit: true }],
  logoBack: [{ type: "word", x: 500, y: 226, w: 170 }],
  seamless: true,
  folds: [
    { d: open([[790, 560], [760, 620], [770, 700]]), w: 18, a: 0.3 },
    { d: open([[830, 840], [800, 880], [810, 940]]), w: 16, a: 0.35 },
    { d: open([[560, 300], [530, 460], [540, 640]]), w: 44, a: 0.2, hi: true },
    { d: open([[680, 420], [640, 460], [590, 480]]), w: 18, a: 0.3 },
  ],
  detailFront: [612, 340, 260],
  detailBack: [500, 230, 360],
  texture: [660, 640, 300],
});

// Zip jackets --------------------------------------------------------
function zipJacketFactory(fitted = false) {
  return (view) => {
    const side = fitted
      ? [[722, 460, 1], [688, 640], [672, 760], [700, 960], [712, 1030, 1], [500, 1036]]
      : [[740, 460, 1], [736, 800], [740, 1060, 1], [500, 1066]];
    const hemY = side[side.length - 1][1];
    const half = [[500, 118], [584, 112, 1], [592, 196, 1], [690, 208], [756, 240, 1], [812, 420], [846, 800], [862, 960, 1], [860, 1012, 1], [798, 1020, 1], [796, 972, 1], [778, 700], ...side];
    const collar = `M${mx(584)},112 L584,112 L592,196 Q${CX},214 ${mx(592)},196 Z`;
    const parts = {
      body: mirrored(half),
      under: [],
      over: [{ d: collar, kind: "panel", tone: 0.03, outline: true }],
      folds: [
        { d: open([[740, 480], [690, 540], [640, 600]]), w: 26, a: 0.4 },
        { d: open([[830, 620], [810, 700], [820, 780]]), w: 22, a: 0.3 },
        { d: open([[850, 880], [830, 920], [820, 960]]), w: 18, a: 0.35 },
        { d: open([[660, 260], [620, 360], [610, 520]]), w: 50, a: 0.18, hi: true },
      ],
      seams: [pair([[756, 240, 1], [736, 340], [side[0][0], 460, 1]]), pair([[592, 196, 1], [690, 208], [756, 240, 1]]), pair([[862, 960, 1], [796, 972, 1]])],
      stitches: [across(side[side.length - 2][0] - 2, hemY - 30, hemY - 26)],
      logos: view === "front" ? [{ type: "mono", x: 622, y: 330, s: 46, emb: true }] : [{ type: "word", x: 500, y: 300, w: 260 }],
      detail: view === "front" ? [600, 300, 300] : [500, 300, 380],
      texture: [520, 170, 260],
    };
    if (view === "front") {
      parts.zipper = { x: CX, y1: 112, y2: hemY, pull: 152 };
      parts.zipPockets = fitted ? [[[618, 780], [640, 930]]] : [[[612, 790], [640, 950]]];
    } else {
      parts.seams.push(open([[500, 206], [500, hemY]]));
    }
    return parts;
  };
}
G.zipJacket = zipJacketFactory(false);
G.zipJacketFitted = zipJacketFactory(true);

// Leggings -----------------------------------------------------------
function leggingsFactory(flare = false) {
  return (view) => {
    const legs = flare
      ? [[690, 420], [682, 620], [628, 830], [652, 1000], [700, 1176, 1], [520, 1190, 1], [530, 1000], [532, 820], [520, 680], [508, 600], [500, 560, 1]]
      : [[690, 420], [680, 620], [640, 850], [602, 1080], [588, 1180, 1], [528, 1184, 1], [530, 1000], [524, 760], [512, 640], [500, 560, 1]];
    const half = [[500, 158], [656, 140, 1], [662, 278, 1], ...legs];
    const wb = `M${mx(656)},140 Q${CX},176 656,140 L662,278 Q${CX},330 ${mx(662)},278 Z`;
    const parts = {
      body: mirrored(half),
      under: [],
      over: [{ d: wb, kind: "panel", tone: 0.03, outline: true }],
      folds: [
        { d: open([[505, 580], [560, 540], [620, 520]]), w: 18, a: 0.35 },
        { d: open([[640, 830], [600, 850], [560, 860]]), w: 14, a: 0.3 },
        { d: open([[640, 400], [620, 560], [600, 760]]), w: 50, a: 0.22, hi: true },
        { d: open([[600, 900], [580, 1000], [570, 1100]]), w: 26, a: 0.15, hi: true },
        ...(flare ? [{ d: open([[640, 1040], [660, 1120], [670, 1170]]), w: 20, a: 0.35 }, { d: open([[560, 1040], [550, 1120], [548, 1180]]), w: 20, a: 0.3 }] : [{ d: open([[600, 1110], [570, 1130], [540, 1140]]), w: 14, a: 0.35 }]),
      ],
      seams: [pair([[688, 440], [660, 600], [580, 820], [548, 1000], flare ? [560, 1188] : [552, 1182]])],
      stitches: [pair(flare ? [[700, 1150, 1], [522, 1164, 1]] : [[590, 1160, 1], [528, 1164, 1]])],
      logos: view === "front" ? [{ type: "mono", x: 640, y: 330, s: 34, emb: false, rot: -4 }] : [{ type: "word", x: 500, y: 214, w: 150 }],
      detail: view === "front" ? [630, 330, 240] : [500, 220, 320],
      texture: [560, 220, 260],
    };
    if (view === "back") parts.seams.push(open([[500, 300], [500, 560]]), pair([[660, 300], [600, 380], [512, 410]]));
    return parts;
  };
}
G.leggings = leggingsFactory(false);
G.flaredLeggings = leggingsFactory(true);

// Sports bra ---------------------------------------------------------
G.sportsBra = (view) => {
  const front = [[500, 352], [562, 316], [600, 214], [610, 152, 1], [662, 152, 1], [690, 252], [734, 378], [748, 470, 1], [744, 560, 1], [742, 648, 1], [500, 656]];
  const back = [[500, 470, 1], [548, 380], [586, 240], [610, 152, 1], [662, 152, 1], [700, 262], [740, 400], [748, 470, 1], [744, 560, 1], [742, 648, 1], [500, 656]];
  const half = view === "front" ? front : back;
  const band = `M${mx(744)},560 L744,560 L742,648 Q${CX},660 ${mx(742)},648 Q${CX},572 ${mx(744)},560 Z`;
  const neckBind = view === "front" ? pair([[500, 352], [562, 316], [600, 214], [610, 152, 1]]) : pair([[500, 470, 1], [548, 380], [586, 240], [610, 152, 1]]);
  return {
    body: mirrored(half),
    under: [],
    over: [{ d: band, kind: "rib", tone: -0.03 }],
    binding: [neckBind, pair([[662, 152, 1], [690, 252], [734, 378], [748, 470, 1]])],
    folds: [
      { d: open([[640, 380], [600, 440], [580, 500]]), w: 40, a: 0.22, hi: true },
      { d: open([[520, 420], [560, 470], [600, 500]]), w: 20, a: 0.3 },
      { d: open([[730, 470], [690, 500], [650, 520]]), w: 16, a: 0.3 },
    ],
    seams: view === "front" ? [open([[500, 360], [500, 556]])] : [],
    stitches: [],
    logos: view === "front" ? [{ type: "mono", x: 500, y: 604, s: 32, emb: false, knit: true }] : [{ type: "word", x: 500, y: 606, w: 150 }],
    detail: view === "front" ? [500, 560, 260] : [500, 600, 300],
    texture: [640, 430, 260],
  };
};

// Contour shorts -----------------------------------------------------
G.contourShorts = (view) => {
  const half = [[500, 330], [652, 310, 1], [658, 424, 1], [690, 520], [702, 700], [694, 852, 1], [528, 864, 1], [516, 744], [500, 700, 1]];
  const wb = `M${mx(652)},310 Q${CX},346 652,310 L658,424 Q${CX},476 ${mx(658)},424 Z`;
  return {
    body: mirrored(half),
    under: [],
    over: [{ d: wb, kind: "panel", tone: 0.03, outline: true }],
    folds: [
      { d: open([[505, 712], [560, 680], [620, 660]]), w: 18, a: 0.35 },
      { d: open([[650, 520], [630, 640], [620, 780]]), w: 44, a: 0.22, hi: true },
      { d: open([[620, 840], [580, 846], [540, 850]]), w: 12, a: 0.3 },
    ],
    seams: [pair([[690, 520], [660, 640], [600, 760], [590, 858]])],
    stitches: [pair([[694, 830, 1], [528, 842, 1]])],
    logos: view === "front" ? [{ type: "mono", x: 652, y: 790, s: 30, emb: false, rot: -4 }] : [{ type: "word", x: 500, y: 382, w: 140 }],
    detail: view === "front" ? [640, 780, 240] : [500, 400, 300],
    texture: [580, 380, 260],
  };
};

// Cropped tee --------------------------------------------------------
G.croppedTee = tee({
  half: [[500, 140], [586, 148, 1], [690, 170], [772, 214, 1], [838, 350], [870, 452, 1], [776, 492, 1], [736, 432, 1], [740, 600], [746, 768, 1], [500, 776]],
  neck: { ex: 586, ey: 148, backTop: 140, band: 18, frontDip: 204 },
  sleeveHem: [[862, 424, 1], [770, 462, 1]],
  hem: [744, 740, 748],
  shoulderSeam: [[772, 214, 1], [742, 320], [736, 432, 1]],
  logoFront: [{ type: "mono", x: 618, y: 300, s: 40, emb: true }],
  logoBack: [{ type: "word", x: 500, y: 250, w: 220 }],
  folds: [
    { d: open([[736, 460], [680, 520], [640, 600]]), w: 22, a: 0.4 },
    { d: open([[700, 260], [650, 320], [620, 420]]), w: 40, a: 0.2, hi: true },
    { d: open([[600, 640], [620, 720], [630, 760]]), w: 18, a: 0.3 },
  ],
  detailFront: [612, 310, 260],
  detailBack: [500, 250, 360],
  texture: [500, 150, 260],
});

// Women's racer tank -------------------------------------------------
G.tankWomen = (view) => {
  const half = [[500, 160], [566, 136, 1], [612, 136, 1], [632, 300], [662, 420], [702, 476, 1], [690, 700], [702, 960, 1], [500, 966]];
  const nk = crewNeck({ ex: 566, ey: 136, backTop: 160, band: 12, frontDip: 284 });
  const armBind = open([[612, 136, 1], [632, 300], [662, 420], [702, 476, 1]]);
  return {
    body: mirrored(half),
    under: view === "front" ? [{ d: nk.interior, kind: "interior" }] : [],
    over: view === "front" ? [{ d: nk.frontBand, kind: "rib" }] : [{ d: nk.backBandOnly, kind: "rib" }],
    binding: [armBind, armBind.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${mx(+x)},${y}`)],
    folds: [
      { d: open([[700, 500], [650, 560], [610, 640]]), w: 22, a: 0.35 },
      { d: open([[560, 400], [540, 560]]), w: 44, a: 0.2, hi: true },
      { d: open([[680, 820], [630, 880]]), w: 18, a: 0.25 },
    ],
    seams: [],
    stitches: [across(700, 934, 940)],
    label: view === "front" ? { x: CX, y: 186, w: 54, h: 18 } : null,
    logos: view === "front" ? [{ type: "mono", x: 600, y: 400, s: 34, emb: true }] : [{ type: "mono", x: 500, y: 236, s: 34, emb: true }],
    detail: view === "front" ? [600, 410, 240] : [500, 250, 260],
    texture: [660, 380, 240],
  };
};

export const GARMENTS = G;

// ─── SVG composition ────────────────────────────────────────────────
let uid = 0;

/**
 * @param {string} garment key of GARMENTS
 * @param {{hex:string, logo:string, washed?:boolean}} color
 * @param {"front"|"back"|"detail"|"texture"|"detail-back"} shot
 * @param {{seed?:number}} [opts]
 */
export function renderSVG(garment, color, shot, opts = {}) {
  const view = shot === "back" || shot === "detail-back" ? "back" : "front";
  const g = GARMENTS[garment](view);
  const id = `g${uid++}`;
  const seed = opts.seed ?? 7;
  const base = color.hex;
  const L = lum(base);
  const light = L > 0.45;

  // camera
  const nums = [g.body, ...(g.behind || []).map((p) => p.d)].join(" ").match(/-?\d+\.?\d*,-?\d+\.?\d*/g).map((t) => t.split(",").map(Number));
  const bx0 = Math.min(...nums.map((n) => n[0])), bx1 = Math.max(...nums.map((n) => n[0]));
  const by0 = Math.min(...nums.map((n) => n[1])), by1 = Math.max(...nums.map((n) => n[1]));
  const fh = Math.max((by1 - by0) / 0.8, (bx1 - bx0) / 0.78 * 1.25);
  const fw = fh / 1.25;
  let vb = [CX - fw / 2, (by0 + by1) / 2 - fh / 2 + fh * 0.015, fw, fh];
  const floorY = by1 + 26, floorRx = (bx1 - bx0) * 0.42;
  if (shot === "detail" || shot === "detail-back" || shot === "texture") {
    const [cx, cy, w] = shot === "texture" ? g.texture : g.detail;
    vb = [cx - w / 2, cy - (w * 1.25) / 2, w, w * 1.25];
  }
  const zoom = W / vb[2];
  const detailShot = shot !== "front" && shot !== "back";

  // tone values
  const shadowA = light ? 0.32 : 0.62;
  const hiA = light ? 0.35 : 0.1;
  const edgeA = light ? 0.28 : 0.55;
  const interior = shade(base, light ? -0.38 : -0.55);
  const stitch = light ? shade(base, -0.22) : shade(base, 0.16);
  const rib = (t = 0) => shade(base, t);

  const bodyParts = [g.body, ...(g.behind || []).map((p) => p.d)];
  const clip = `<clipPath id="${id}c">${bodyParts.map((d) => `<path d="${d}"/>`).join("")}</clipPath>`;

  // fabric grain frequencies are defined in screen space then mapped to user units
  const grainF = 0.75 * zoom;
  const washF = 0.009;

  const defs = `
  <defs>
    ${clip}
    <radialGradient id="${id}bg" cx="50%" cy="42%" r="75%">
      <stop offset="0" stop-color="#f1f0ec"/><stop offset="0.65" stop-color="#e6e4df"/><stop offset="1" stop-color="#d6d3cc"/>
    </radialGradient>
    <linearGradient id="${id}lt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="${light ? 0.22 : 0.09}"/>
      <stop offset="0.45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${light ? 0.18 : 0.35}"/>
    </linearGradient>
    <linearGradient id="${id}vt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${light ? 0.1 : 0.22}"/>
    </linearGradient>
    <filter id="${id}grain" x="-500" y="-500" width="2000" height="2250" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="${grainF}" numOctaves="2" seed="${seed}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0.9 0.9 0 -1.05"/>
    </filter>
    <filter id="${id}grainHi" x="-500" y="-500" width="2000" height="2250" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="${grainF * 1.3}" numOctaves="1" seed="${seed + 3}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.9 0.9 0.9 0 -1.2"/>
    </filter>
    <filter id="${id}wash" x="-500" y="-500" width="2000" height="2250" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="${washF} ${washF * 1.6}" numOctaves="4" seed="${seed + 11}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.6 0 0 0 -0.7"/>
    </filter>
    <filter id="${id}blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${12}"/></filter>
    <filter id="${id}blurL" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
    <filter id="${id}blurS" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${5}"/></filter>
    <filter id="${id}edge" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="26"/></filter>
    <filter id="${id}drop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#2a2620" flood-opacity="0.28"/>
    </filter>
    <filter id="${id}emb" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${Math.max(0.6, 1.4)}" result="b"/>
      <feDiffuseLighting in="b" surfaceScale="2.4" diffuseConstant="1.15" lighting-color="#ffffff" result="l"><feDistantLight azimuth="235" elevation="38"/></feDiffuseLighting>
      <feComposite in="l" in2="SourceAlpha" operator="in" result="lc"/>
      <feBlend in="SourceGraphic" in2="lc" mode="multiply" result="m"/>
      <feDropShadow in="m" dx="0.4" dy="0.9" stdDeviation="0.7" flood-color="#000" flood-opacity="0.55"/>
    </filter>
    <filter id="${id}print" x="-5%" y="-20%" width="110%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="${0.9 * zoom}" numOctaves="1" seed="${seed + 5}" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="${1.1}" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.25" result="na"/>
      <feComposite in="d" in2="na" operator="in"/>
    </filter>
    <pattern id="${id}rib" width="7" height="40" patternUnits="userSpaceOnUse">
      <rect width="7" height="40" fill="#000" fill-opacity="0"/><rect x="0" width="2.4" height="40" fill="#000" fill-opacity="${light ? 0.12 : 0.32}"/><rect x="3.6" width="1.2" height="40" fill="#fff" fill-opacity="${light ? 0.12 : 0.05}"/>
    </pattern>
    <pattern id="${id}hrib" width="40" height="6" patternUnits="userSpaceOnUse">
      <rect y="0" width="40" height="2" fill="#000" fill-opacity="${light ? 0.08 : 0.25}"/>
    </pattern>
    <pattern id="${id}knit" width="5" height="6.4" patternUnits="userSpaceOnUse">
      <path d="M0.2,0.4 L1.25,5.8 L2.5,1.2 M2.5,1.2 L3.75,5.8 L4.8,0.4" fill="none" stroke="#000" stroke-opacity="${light ? 0.16 : 0.42}" stroke-width="0.55"/>
      <path d="M1.1,0.8 L1.7,4.4 M3.4,0.8 L3.9,4.4" stroke="#fff" stroke-opacity="${light ? 0.12 : 0.05}" stroke-width="0.45"/>
    </pattern>
    <pattern id="${id}satin" width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(52)">
      <rect width="2.2" height="2.2" fill="${color.logo}"/><rect width="2.2" height="0.55" fill="#000" fill-opacity="0.18"/><rect y="1.1" width="2.2" height="0.35" fill="#fff" fill-opacity="0.18"/>
    </pattern>
    <pattern id="${id}teeth" width="6" height="7" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="5" height="3" rx="0.8" fill="${light ? "#2a2a2a" : "#0b0b0b"}"/><rect x="1" y="3.5" width="5" height="3" rx="0.8" fill="${light ? "#2a2a2a" : "#0b0b0b"}"/>
    </pattern>
  </defs>`;

  // ── layers
  const out = [];
  out.push(`<rect x="${vb[0] - 10}" y="${vb[1] - 10}" width="${vb[2] + 20}" height="${vb[3] + 20}" fill="url(#${id}bg)"/>`);
  // floor shadow
  out.push(`<ellipse cx="500" cy="${floorY}" rx="${floorRx}" ry="${fh * 0.016}" fill="#3a352c" opacity="0.16" filter="url(#${id}blur)"/>`);

  // garment base with drop shadow
  const fillPart = (p) => {
    const tone = p.kind === "interior" ? interior : p.kind === "rib" ? rib(p.tone ?? -0.03) : rib(p.tone ?? 0);
    return `<path d="${p.d}" fill="${tone}"/>`;
  };
  out.push(`<g filter="url(#${id}drop)">${(g.behind || []).map(fillPart).join("")}<path d="${g.body}" fill="${base}"/></g>`);

  // everything below is clipped to the garment
  const C = [];
  (g.under || []).forEach((p) => {
    if (p.kind === "interior") {
      C.push(`<path d="${p.d}" fill="${shade(base, light ? -0.3 : -0.5 * (p.strength ? p.strength / 0.55 : 1))}"/>`);
      C.push(`<path d="${p.d}" fill="none" stroke="#000" stroke-opacity="${light ? 0.25 : 0.6}" stroke-width="26" filter="url(#${id}blurS)"/>`);
    } else C.push(fillPart(p));
  });

  if (g.label) {
    const { x, y, w, h } = g.label;
    const lc = light ? "#151515" : "#121212";
    C.push(`<g><rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" fill="${lc}"/><rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" fill="url(#${id}knit)" opacity="0.6"/>
      <svg x="${x - w * 0.36}" y="${y + h * 0.36}" width="${w * 0.72}" height="${h * 0.24}" viewBox="${wordViewBox}" preserveAspectRatio="xMidYMid meet">${wordmarkInner("#d8d6cf", 16)}</svg></g>`);
  }

  // panels / ribs over the body
  const overPanels = (g.over || []).map((p) => {
    let s = fillPart(p);
    if (p.kind === "rib") s += `<path d="${p.d}" fill="url(#${id}rib)"/>`;
    if (p.outline) s += `<path d="${p.d}" fill="none" stroke="#000" stroke-opacity="${light ? 0.18 : 0.45}" stroke-width="${2.2}"/>`;
    s += `<path d="${p.d}" fill="none" stroke="${stitch}" stroke-opacity="0.65" stroke-width="1.1" stroke-dasharray="4 3.2" transform="translate(0 0)"/>`;
    return s;
  });

  // washed texture
  if (color.washed) {
    C.push(`<rect x="-200" y="-200" width="1400" height="1650" filter="url(#${id}wash)" opacity="0.15" style="mix-blend-mode:screen"/>`);
  }
  // seamless zoned rib
  if (GARMENTS[garment] && garment === "longSleeve") {
    C.push(`<g opacity="0.9"><path d="${pair([[700, 400, 1], [690, 700], [676, 1040, 1]])}" fill="none" stroke="url(#${id}hrib)" stroke-width="90"/></g>`);
    C.push(`<path d="M430,540 Q500,560 570,540 L580,820 Q500,840 420,820 Z" fill="url(#${id}hrib)" opacity="0.6"/>`);
  }

  // logos (sit under the shading so they follow the light)
  for (const lg of g.logos || []) {
    if (lg.type === "mono") {
      const [, , vw, vh] = monoViewBox.split(" ").map(Number);
      const s = lg.s;
      const h = s * (vh / vw);
      const fill = lg.emb ? `url(#${id}satin)` : color.logo;
      const filt = lg.emb ? `filter="url(#${id}emb)"` : lg.knit ? "" : `filter="url(#${id}print)"`;
      C.push(`<g transform="translate(${lg.x} ${lg.y}) rotate(${lg.rot || 0})" opacity="${lg.knit ? 0.55 : 0.95}"><svg x="${-s / 2}" y="${-h / 2}" width="${s}" height="${h}" viewBox="${monoViewBox}" overflow="visible"><g ${filt}>${monoPathList.map((d) => `<path d="${d}" fill="${fill}"/>`).join("")}</g></svg></g>`);
    } else {
      const [, , ww, wh] = wordViewBox.split(" ").map(Number);
      const w = lg.w, h = w * (wh / ww);
      C.push(`<svg x="${lg.x - w / 2}" y="${lg.y - h / 2}" width="${w}" height="${h}" viewBox="${wordViewBox}" overflow="visible"><g filter="url(#${id}print)" opacity="0.92">${wordmarkInner(color.logo)}</g></svg>`);
    }
  }

  C.push(...overPanels);

  // seams (sunken line + highlight) and topstitching
  for (const d of g.seams || []) {
    C.push(`<path d="${d}" fill="none" stroke="#000" stroke-opacity="${light ? 0.22 : 0.55}" stroke-width="2.4"/>`);
    C.push(`<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${light ? 0.25 : 0.07}" stroke-width="1.2" transform="translate(1.6 1.2)"/>`);
    C.push(`<path d="${d}" fill="none" stroke="${stitch}" stroke-opacity="0.7" stroke-width="1" stroke-dasharray="3.6 2.8" transform="translate(-3 0)"/>`);
  }
  for (const d of g.stitches || []) {
    C.push(`<path d="${d}" fill="none" stroke="${stitch}" stroke-opacity="0.75" stroke-width="1.1" stroke-dasharray="4 3"/>`);
    C.push(`<path d="${d}" fill="none" stroke="${stitch}" stroke-opacity="0.6" stroke-width="1.1" stroke-dasharray="4 3" transform="translate(0 7)"/>`);
  }
  for (const d of g.binding || []) {
    C.push(`<path d="${d}" fill="none" stroke="${shade(base, light ? -0.08 : 0.04)}" stroke-width="22"/>`);
    C.push(`<path d="${d}" fill="none" stroke="${stitch}" stroke-opacity="0.7" stroke-width="1" stroke-dasharray="3.6 2.8"/>`);
  }
  for (const d of g.pocketEdge || []) {
    C.push(`<path d="${d}" fill="none" stroke="#000" stroke-opacity="${light ? 0.3 : 0.6}" stroke-width="14" filter="url(#${id}blurS)" transform="translate(-6 0)"/>`);
  }

  // zips
  if (g.zipper) {
    const z = g.zipper;
    C.push(`<rect x="${z.x - 7}" y="${z.y1}" width="14" height="${z.y2 - z.y1}" fill="${shade(base, -0.4)}"/><rect x="${z.x - 3}" y="${z.y1}" width="6" height="${z.y2 - z.y1}" fill="url(#${id}teeth)"/>`);
    C.push(`<g><rect x="${z.x - 9}" y="${z.pull - 12}" width="18" height="24" rx="4" fill="#1a1a1a"/><rect x="${z.x - 5}" y="${z.pull + 8}" width="10" height="44" rx="3" fill="#202020"/><rect x="${z.x - 3}" y="${z.pull + 14}" width="6" height="30" rx="2" fill="#3a3a3a"/></g>`);
  }
  for (const zp of g.zipPockets || []) {
    const [a, b] = zp;
    for (const sx of [1, -1]) {
      const x1 = sx > 0 ? a[0] : mx(a[0]), x2 = sx > 0 ? b[0] : mx(b[0]);
      C.push(`<line x1="${x1}" y1="${a[1]}" x2="${x2}" y2="${b[1]}" stroke="${shade(base, -0.45)}" stroke-width="8"/><line x1="${x1}" y1="${a[1]}" x2="${x2}" y2="${b[1]}" stroke="url(#${id}teeth)" stroke-width="3"/><rect x="${x1 - 4}" y="${a[1]}" width="8" height="22" rx="2" fill="#1d1d1d"/>`);
    }
  }
  if (g.zip) {
    C.push(`<line x1="${g.zip.x1}" y1="${g.zip.y}" x2="${g.zip.x2}" y2="${g.zip.y}" stroke="${shade(base, -0.45)}" stroke-width="7"/><rect x="${g.zip.x2 - 6}" y="${g.zip.y - 3}" width="22" height="7" rx="2" fill="#1d1d1d"/>`);
  }

  // folds: shadow + offset highlight
  for (const f of g.folds || []) {
    const mirrorD = f.d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (m, x, y) => `${mx(+x)},${y}`);
    for (const d of [f.d, mirrorD]) {
      if (f.hi) {
        C.push(`<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${hiA * f.a * 2.2}" stroke-width="${f.w * 1.6}" stroke-linecap="round" filter="url(#${id}blurL)"/>`);
      } else {
        C.push(`<path d="${d}" fill="none" stroke="#000" stroke-opacity="${shadowA * f.a * 1.6}" stroke-width="${f.w}" stroke-linecap="round" filter="url(#${id}blur)"/>`);
        C.push(`<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${hiA * f.a * 1.6}" stroke-width="${f.w * 0.5}" stroke-linecap="round" filter="url(#${id}blur)" transform="translate(${f.w * 0.7} ${-f.w * 0.3})"/>`);
      }
    }
  }

  // drawcords + eyelets (above folds)
  const cordC = light ? shade(base, -0.06) : shade(base, 0.07);
  for (const d of g.cords || []) {
    C.push(`<path d="${d}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="13" stroke-linecap="round" filter="url(#${id}blurS)" transform="translate(4 6)"/>`);
    C.push(`<path d="${d}" fill="none" stroke="${cordC}" stroke-width="10" stroke-linecap="round"/>`);
    C.push(`<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${light ? 0.35 : 0.1}" stroke-width="3" stroke-linecap="round" transform="translate(-2 0)"/>`);
    const end = d.trim().split(" ").pop().split(",").map(Number);
    C.push(`<rect x="${end[0] - 6}" y="${end[1] - 4}" width="12" height="30" rx="3" fill="${light ? "#2b2b2b" : "#0c0c0c"}"/>`);
  }
  for (const [ex, ey] of g.eyelets || []) {
    C.push(`<circle cx="${ex}" cy="${ey}" r="9" fill="#1b1b1b"/><circle cx="${ex}" cy="${ey}" r="9" fill="none" stroke="#777" stroke-opacity="0.5" stroke-width="2"/>`);
  }

  // global light, vertical falloff, fabric grain
  C.push(`<rect x="-200" y="-200" width="1400" height="1650" fill="url(#${id}lt)"/>`);
  C.push(`<rect x="-200" y="-200" width="1400" height="1650" fill="url(#${id}vt)"/>`);
  C.push(`<rect x="-200" y="-200" width="1400" height="1650" filter="url(#${id}grain)" opacity="${light ? 0.35 : 0.55}"/>`);
  C.push(`<rect x="-200" y="-200" width="1400" height="1650" filter="url(#${id}grainHi)" opacity="${light ? 0.25 : 0.12}"/>`);
  if (detailShot) C.push(`<rect x="-200" y="-200" width="1400" height="1650" fill="url(#${id}knit)" opacity="${Math.min(0.32, (zoom - 1.4) / 6)}"/>`);

  // inner edge darkening for volume
  for (const d of bodyParts) {
    C.push(`<path d="${d}" fill="none" stroke="#000" stroke-opacity="${edgeA}" stroke-width="56" filter="url(#${id}edge)"/>`);
  }
  // crisp silhouette edge
  C.push(`<path d="${g.body}" fill="none" stroke="#000" stroke-opacity="${light ? 0.12 : 0.4}" stroke-width="2"/>`);

  out.push(`<g clip-path="url(#${id}c)">${C.join("\n")}</g>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${defs}${out.join("\n")}</svg>`;
}

export const SHOTS = ["front", "back", "detail", "texture"];
