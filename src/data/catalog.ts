/**
 * BLK ANVL product catalog.
 *
 * PLACEHOLDER DATA: prices, inventory, fabric weights and compositions are
 * illustrative and must be replaced with confirmed commercial and
 * manufacturer information before launch.
 *
 * This file must stay dependency-free (no imports, no enums) because
 * scripts/render-products.mjs loads it directly with Node's type stripping.
 */

export type Gender = "men" | "women";

export type ColorId =
  | "obsidian"
  | "washed-black"
  | "graphite"
  | "stone"
  | "bone"
  | "slate"
  | "deep-olive";

export type Colorway = {
  id: ColorId;
  name: string;
  hex: string;
  /** Tonal colour used for the logo on this colourway */
  logo: string;
  washed?: boolean;
};

export const COLORWAYS: Record<ColorId, Colorway> = {
  obsidian: { id: "obsidian", name: "Obsidian", hex: "#161616", logo: "#bdbcb7" },
  "washed-black": { id: "washed-black", name: "Washed Black", hex: "#2b2b2a", logo: "#c4c3be", washed: true },
  graphite: { id: "graphite", name: "Graphite", hex: "#3d3e40", logo: "#cfcfcb" },
  stone: { id: "stone", name: "Stone", hex: "#b4ada1", logo: "#57534b" },
  bone: { id: "bone", name: "Bone", hex: "#e2ddd1", logo: "#4a4843" },
  slate: { id: "slate", name: "Slate", hex: "#58616b", logo: "#d3d6d9" },
  "deep-olive": { id: "deep-olive", name: "Deep Olive", hex: "#3e4332", logo: "#c6c8b9" },
};

export type Category =
  | "T-Shirts"
  | "Tanks"
  | "Shorts"
  | "Hoodies"
  | "Joggers"
  | "Long Sleeves"
  | "Jackets"
  | "Leggings"
  | "Sports Bras";

export type Garment =
  | "oversizedTee"
  | "compressionTee"
  | "tankMen"
  | "shorts"
  | "hoodie"
  | "joggers"
  | "longSleeve"
  | "zipJacket"
  | "leggings"
  | "sportsBra"
  | "contourShorts"
  | "croppedTee"
  | "hoodieOversized"
  | "zipJacketFitted"
  | "flaredLeggings"
  | "tankWomen";

export type CollectionId = "the-uniform" | "heavyweight" | "seamless" | "training";

export type RawProduct = {
  slug: string;
  name: string;
  gender: Gender;
  category: Category;
  garment: Garment;
  price: number;
  colors: ColorId[];
  sizes: string[];
  isNew?: boolean;
  releasedAt: string;
  collections: CollectionId[];
  summary: string;
  description: string;
  fit: string;
  fabric: string;
  composition: string;
  features: string[];
  care: string[];
  /** Colourways that also have real photography (see /public/photo) */
  photoColor?: ColorId;
};

const MEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WOMEN_SIZES = ["XXS", "XS", "S", "M", "L", "XL"];
const CARE_KNIT = ["Machine wash cold, inside out", "Wash with similar colours", "Do not tumble dry", "Do not iron print or embroidery"];
const CARE_TECH = ["Machine wash cold", "Do not use fabric softener", "Line dry in shade", "Do not iron"];

export const CATALOG: RawProduct[] = [
  // ─── MEN ────────────────────────────────────────────────────────────
  {
    slug: "essential-oversized-tee",
    name: "Essential Oversized Tee",
    gender: "men",
    category: "T-Shirts",
    garment: "oversizedTee",
    price: 38,
    colors: ["obsidian", "bone", "graphite", "deep-olive"],
    sizes: MEN_SIZES,
    isNew: true,
    releasedAt: "2026-10-01",
    collections: ["the-uniform", "heavyweight"],
    summary: "Dropped shoulder. Boxy body. Dense cotton jersey.",
    description:
      "The tee everything else is built around. A wide, dropped-shoulder silhouette cut from dense, brushed cotton jersey with a tight ribbed collar that keeps its shape. Tonal monogram embroidered at the chest.",
    fit: "Oversized, boxy fit. Dropped shoulder. Size down for a closer fit.",
    fabric: "Heavyweight cotton jersey",
    composition: "100% cotton (placeholder — confirm with manufacturer)",
    features: ["Dropped shoulder seam", "1x1 ribbed crew collar", "Twin-needle hems", "Embroidered tonal monogram", "Woven neck label"],
    care: CARE_KNIT,
  },
  {
    slug: "compression-tee",
    name: "Compression Tee",
    gender: "men",
    category: "T-Shirts",
    garment: "compressionTee",
    price: 42,
    colors: ["obsidian", "slate", "stone"],
    sizes: MEN_SIZES,
    releasedAt: "2026-07-14",
    collections: ["training"],
    summary: "Second-skin fit with flatlock seams.",
    description:
      "Close to the body without restricting it. Four-way stretch knit, contoured flatlock seams that sit flat under load, and a monogram placed on the sleeve rather than the chest.",
    fit: "Compression fit. Designed to sit close to the body.",
    fabric: "Four-way stretch performance knit",
    composition: "Polyamide / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Flatlock seams", "Four-way stretch", "Sleeve monogram", "Back-neck wordmark"],
    care: CARE_TECH,
  },
  {
    slug: "mens-performance-tank",
    name: "Performance Tank",
    gender: "men",
    category: "Tanks",
    garment: "tankMen",
    price: 32,
    colors: ["obsidian", "graphite", "bone"],
    sizes: MEN_SIZES,
    releasedAt: "2026-06-02",
    collections: ["training"],
    summary: "Deep armhole. Lightweight jersey.",
    description:
      "A clean, deep-cut tank for heavy upper-body days. Lightweight jersey with bound armholes and neckline, finished with a small tonal monogram.",
    fit: "Regular fit with dropped armholes.",
    fabric: "Lightweight performance jersey",
    composition: "Cotton / polyester blend (placeholder — confirm with manufacturer)",
    features: ["Bound neckline and armholes", "Dropped armhole", "Tonal chest monogram"],
    care: CARE_KNIT,
  },
  {
    slug: "training-shorts",
    name: "Training Shorts",
    gender: "men",
    category: "Shorts",
    garment: "shorts",
    price: 44,
    colors: ["obsidian", "graphite", "slate", "deep-olive"],
    sizes: MEN_SIZES,
    isNew: true,
    releasedAt: "2026-09-18",
    collections: ["the-uniform", "training"],
    summary: '7" inseam. Quick-dry woven shell.',
    description:
      "A 7\" training short in a light, quick-drying woven shell. Elastic waistband with internal drawcord, deep side pockets and a zipped back pocket. Monogram placed low on the left leg.",
    fit: 'Regular fit. 7" inseam (size M).',
    fabric: "Lightweight stretch woven",
    composition: "Polyester / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Elastic waistband with drawcord", "Side seam pockets", "Zipped back pocket", "Monogram at left hem"],
    care: CARE_TECH,
  },
  {
    slug: "washed-heavyweight-hoodie",
    name: "Washed Heavyweight Hoodie",
    gender: "men",
    category: "Hoodies",
    garment: "hoodie",
    price: 88,
    colors: ["washed-black", "stone", "bone", "graphite"],
    sizes: MEN_SIZES,
    isNew: true,
    releasedAt: "2026-10-08",
    collections: ["the-uniform", "heavyweight"],
    summary: "Garment-washed fleece. Dropped shoulder.",
    description:
      "Our heaviest piece. Brushed-back fleece, garment washed for a broken-in hand and a slightly uneven, lived-in tone. Double-layer hood, kangaroo pocket, and the BLK ANVL wordmark across the upper back.",
    fit: "Relaxed fit. Dropped shoulder. Take your usual size.",
    fabric: "Heavyweight brushed-back fleece",
    composition: "Cotton-rich fleece (placeholder — confirm with manufacturer)",
    features: ["Garment washed", "Double-layer hood", "Kangaroo pocket", "Ribbed cuffs and hem", "Embroidered chest monogram", "Printed back wordmark"],
    care: CARE_KNIT,
    photoColor: "washed-black",
  },
  {
    slug: "performance-joggers",
    name: "Performance Joggers",
    gender: "men",
    category: "Joggers",
    garment: "joggers",
    price: 78,
    colors: ["obsidian", "graphite", "deep-olive"],
    sizes: MEN_SIZES,
    releasedAt: "2026-08-04",
    collections: ["the-uniform", "training"],
    summary: "Tapered leg. Articulated knee.",
    description:
      "A tapered jogger with an articulated knee panel for full range of movement, ribbed cuffs and a soft brushed interior. Slanted side pockets and a patch pocket at the back.",
    fit: "Slim tapered fit. Mid rise.",
    fabric: "Stretch double-knit",
    composition: "Cotton / polyester / elastane (placeholder — confirm with manufacturer)",
    features: ["Articulated knee", "Ribbed cuffs", "Elastic waistband with drawcord", "Thigh monogram"],
    care: CARE_KNIT,
  },
  {
    slug: "seamless-long-sleeve",
    name: "Seamless Long Sleeve",
    gender: "men",
    category: "Long Sleeves",
    garment: "longSleeve",
    price: 52,
    colors: ["obsidian", "slate", "bone"],
    sizes: MEN_SIZES,
    releasedAt: "2026-05-20",
    collections: ["seamless", "training"],
    summary: "Body-mapped seamless knit.",
    description:
      "Knitted in one piece with zoned rib structures through the sides and back. Minimal seams, close fit, and a knit-in monogram at the chest.",
    fit: "Athletic fit. Close to the body.",
    fabric: "Seamless body-mapped knit",
    composition: "Nylon / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Seamless construction", "Zoned rib knit", "Knit-in monogram"],
    care: CARE_TECH,
  },
  {
    slug: "training-zip-jacket",
    name: "Training Zip Jacket",
    gender: "men",
    category: "Jackets",
    garment: "zipJacket",
    price: 96,
    colors: ["obsidian", "graphite", "stone"],
    sizes: MEN_SIZES,
    releasedAt: "2026-09-02",
    collections: ["the-uniform"],
    summary: "Funnel collar. Zipped hand pockets.",
    description:
      "A structured full-zip with a funnel collar, zipped hand pockets and a clean, close-to-the-body cut that works as a warm-up layer or on its own.",
    fit: "Regular fit.",
    fabric: "Stretch interlock",
    composition: "Polyester / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Two-way front zip", "Funnel collar", "Zipped hand pockets", "Chest monogram"],
    care: CARE_TECH,
  },

  // ─── WOMEN ──────────────────────────────────────────────────────────
  {
    slug: "sculpt-leggings",
    name: "Sculpt Leggings",
    gender: "women",
    category: "Leggings",
    garment: "leggings",
    price: 68,
    colors: ["obsidian", "slate", "deep-olive", "stone"],
    sizes: WOMEN_SIZES,
    isNew: true,
    releasedAt: "2026-10-12",
    collections: ["the-uniform", "training"],
    summary: "High rise. Contour seams.",
    description:
      "A high-rise legging with a wide, no-roll waistband and contour seams that follow the leg. Squat-tested opaque knit with a small monogram at the hip.",
    fit: "High rise. Full length. Second-skin fit.",
    fabric: "Brushed stretch knit",
    composition: "Nylon / elastane blend (placeholder — confirm with manufacturer)",
    features: ["High-rise waistband", "Contour seams", "Gusset", "Hip monogram"],
    care: CARE_TECH,
  },
  {
    slug: "seamless-sports-bra",
    name: "Seamless Sports Bra",
    gender: "women",
    category: "Sports Bras",
    garment: "sportsBra",
    price: 46,
    colors: ["obsidian", "bone", "slate", "deep-olive"],
    sizes: WOMEN_SIZES,
    releasedAt: "2026-08-21",
    collections: ["seamless", "training"],
    summary: "Medium support. Racer back.",
    description:
      "A seamless medium-support bra with a scoop neck, racer back and a wide underband. Removable pads. Monogram knitted into the band.",
    fit: "Medium support. Close fit.",
    fabric: "Seamless stretch knit",
    composition: "Nylon / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Racer back", "Removable pads", "Wide underband", "Band monogram"],
    care: CARE_TECH,
  },
  {
    slug: "contour-shorts",
    name: "Contour Shorts",
    gender: "women",
    category: "Shorts",
    garment: "contourShorts",
    price: 42,
    colors: ["obsidian", "stone", "slate"],
    sizes: WOMEN_SIZES,
    releasedAt: "2026-07-01",
    collections: ["training"],
    summary: '5" inseam. High rise.',
    description:
      'A 5" high-rise short in the same opaque knit as our Sculpt Leggings, with a contoured waistband seam and a small monogram at the left hem.',
    fit: 'High rise. 5" inseam (size S).',
    fabric: "Brushed stretch knit",
    composition: "Nylon / elastane blend (placeholder — confirm with manufacturer)",
    features: ["High-rise waistband", "Contour waist seam", "Hem monogram"],
    care: CARE_TECH,
  },
  {
    slug: "cropped-performance-tee",
    name: "Cropped Performance Tee",
    gender: "women",
    category: "T-Shirts",
    garment: "croppedTee",
    price: 36,
    colors: ["bone", "obsidian", "stone"],
    sizes: WOMEN_SIZES,
    releasedAt: "2026-06-16",
    collections: ["the-uniform"],
    summary: "Boxy crop. Soft jersey.",
    description:
      "A boxy, slightly cropped tee in soft performance jersey that sits at the high hip. Tonal embroidered monogram at the chest.",
    fit: "Relaxed, cropped fit. Hits at the high hip.",
    fabric: "Soft performance jersey",
    composition: "Cotton / modal blend (placeholder — confirm with manufacturer)",
    features: ["Cropped length", "Ribbed collar", "Embroidered monogram"],
    care: CARE_KNIT,
  },
  {
    slug: "oversized-training-hoodie",
    name: "Oversized Training Hoodie",
    gender: "women",
    category: "Hoodies",
    garment: "hoodieOversized",
    price: 84,
    colors: ["washed-black", "bone", "stone"],
    sizes: WOMEN_SIZES,
    isNew: true,
    releasedAt: "2026-10-15",
    collections: ["the-uniform", "heavyweight"],
    summary: "Oversized. Garment washed.",
    description:
      "An oversized, garment-washed hoodie with extended dropped shoulders and a longer body. Double-layer hood and the BLK ANVL wordmark across the upper back.",
    fit: "Oversized fit. Size down for a closer fit.",
    fabric: "Heavyweight brushed-back fleece",
    composition: "Cotton-rich fleece (placeholder — confirm with manufacturer)",
    features: ["Garment washed", "Extended dropped shoulder", "Kangaroo pocket", "Printed back wordmark"],
    care: CARE_KNIT,
  },
  {
    slug: "fitted-training-jacket",
    name: "Fitted Training Jacket",
    gender: "women",
    category: "Jackets",
    garment: "zipJacketFitted",
    price: 92,
    colors: ["obsidian", "slate"],
    sizes: WOMEN_SIZES,
    releasedAt: "2026-09-10",
    collections: ["training"],
    summary: "Shaped waist. Funnel collar.",
    description:
      "A fitted full-zip with a shaped waist, funnel collar and zipped hand pockets. Light enough for warm-ups, structured enough for the commute.",
    fit: "Fitted. Shaped through the waist.",
    fabric: "Stretch interlock",
    composition: "Polyester / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Two-way front zip", "Funnel collar", "Zipped hand pockets", "Chest monogram"],
    care: CARE_TECH,
  },
  {
    slug: "flared-leggings",
    name: "Flared Leggings",
    gender: "women",
    category: "Leggings",
    garment: "flaredLeggings",
    price: 64,
    colors: ["obsidian", "graphite", "stone"],
    sizes: WOMEN_SIZES,
    releasedAt: "2026-08-12",
    collections: ["the-uniform"],
    summary: "High rise. Kick flare.",
    description:
      "Fitted through the hip and thigh, opening into a soft flare below the knee. The same high-rise waistband as our Sculpt Leggings.",
    fit: "High rise. Fitted to the knee, flared hem.",
    fabric: "Brushed stretch knit",
    composition: "Nylon / elastane blend (placeholder — confirm with manufacturer)",
    features: ["High-rise waistband", "Kick flare", "Hip monogram"],
    care: CARE_TECH,
  },
  {
    slug: "womens-performance-tank",
    name: "Performance Tank",
    gender: "women",
    category: "Tanks",
    garment: "tankWomen",
    price: 30,
    colors: ["obsidian", "bone", "deep-olive"],
    sizes: WOMEN_SIZES,
    releasedAt: "2026-06-30",
    collections: ["training"],
    summary: "Racer cut. Lightweight jersey.",
    description: "A racer-cut tank in lightweight jersey with bound edges and a small tonal monogram at the back neck.",
    fit: "Regular fit. Racer cut.",
    fabric: "Lightweight performance jersey",
    composition: "Cotton / modal blend (placeholder — confirm with manufacturer)",
    features: ["Racer back", "Bound edges", "Tonal monogram"],
    care: CARE_KNIT,
  },
];
