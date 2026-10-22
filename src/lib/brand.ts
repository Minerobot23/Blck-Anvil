/**
 * BLK ANVL logo geometry — traced from the brand reference.
 * Monogram: a tall blade over an angular Λ with a hooked foot.
 * Wordmark: wide geometric capitals; A and V drawn without crossbars.
 * scripts/logo-svg.mjs reads this file to emit /public/brand/*.svg.
 */
export const MONOGRAM_VIEWBOX = "130 40 495 535";

export const MONOGRAM_PATHS = [
  // Tall blade
  "M288,64 Q330,56 377,53 L583,428 Q595,446 614,456 L510,454 L318,100 Q306,79 288,64 Z",
  // Λ with hooked foot
  "M298,204 L482,562 L402,562 L285,327 L205,447 Q172,452 143,480 L298,204 Z",
];

export const WORDMARK_VIEWBOX = "-8 -10 2296 120";
export const WORDMARK_STROKE = 13;

// Stroke paths on a 100-unit cap height.
const B = "M6,94 V6 H128 Q154,6 154,28 Q154,50 128,50 H6 M128,50 H134 Q162,50 162,72 Q162,94 134,94 H6";
const L = "M6,0 V94 H150";
const K = "M6,0 V100 M160,2 L10,60 M60,40 L165,100";
const A = "M0,100 L100,6 L200,100";
const N = "M6,100 V8 L164,92 V0";
const V = "M0,0 L100,94 L200,0";

const t = (x: number, d: string) => ({ x, d });
export const WORDMARK_LETTERS = [
  t(0, B),
  t(315, L),
  t(615, K),
  t(1110, A),
  t(1460, N),
  t(1780, V),
  t(2130, L),
];
