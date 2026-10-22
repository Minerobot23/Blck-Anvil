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

export type CollectionId = "the-uniform" | "heavyweight" | "training";

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
};

const MEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WOMEN_SIZES = ["XXS", "XS", "S", "M", "L", "XL"];
const CARE_KNIT = ["Machine wash cold, inside out", "Wash with similar colours", "Do not tumble dry", "Do not iron print or embroidery"];
const CARE_TECH = ["Machine wash cold", "Do not use fabric softener", "Line dry in shade", "Do not iron"];

export const CATALOG: RawProduct[] = [
  {
    slug: "washed-heavyweight-hoodie",
    name: "Washed Heavyweight Hoodie",
    gender: "men",
    category: "Hoodies",
    garment: "hoodie",
    price: 88,
    colors: ["washed-black"],
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
  },
  {
    slug: "essential-oversized-tee",
    name: "Essential Oversized Tee",
    gender: "men",
    category: "T-Shirts",
    garment: "oversizedTee",
    price: 38,
    colors: ["obsidian"],
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
    colors: ["obsidian"],
    sizes: MEN_SIZES,
    releasedAt: "2026-07-14",
    collections: ["training"],
    summary: "Second-skin fit with flatlock seams.",
    description:
      "Close to the body without restricting it. Four-way stretch knit, raglan sleeves and contoured flatlock seams that sit flat under load. Tonal monogram at the chest, wordmark across the upper back.",
    fit: "Compression fit. Designed to sit close to the body.",
    fabric: "Four-way stretch performance knit",
    composition: "Polyamide / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Flatlock seams", "Raglan sleeves", "Four-way stretch", "Chest monogram", "Back wordmark"],
    care: CARE_TECH,
  },
  {
    slug: "training-shorts",
    name: "Training Shorts",
    gender: "men",
    category: "Shorts",
    garment: "shorts",
    price: 44,
    colors: ["obsidian"],
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
    slug: "flared-leggings",
    name: "Flared Leggings",
    gender: "women",
    category: "Leggings",
    garment: "flaredLeggings",
    price: 64,
    colors: ["obsidian"],
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
    slug: "contour-shorts",
    name: "Contour Shorts",
    gender: "women",
    category: "Shorts",
    garment: "contourShorts",
    price: 42,
    colors: ["obsidian"],
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
    slug: "womens-training-shorts",
    name: "Split Hem Training Shorts",
    gender: "women",
    category: "Shorts",
    garment: "shorts",
    price: 40,
    colors: ["obsidian"],
    sizes: WOMEN_SIZES,
    isNew: true,
    releasedAt: "2026-10-18",
    collections: ["training"],
    summary: "Relaxed fit. Curved split hem.",
    description:
      "A light, relaxed training short with an elastic drawcord waistband, a curved split hem for stride and a built-in liner. Monogram placed low on the left leg.",
    fit: "Relaxed fit. Mid rise.",
    fabric: "Lightweight stretch woven",
    composition: "Polyester / elastane blend (placeholder — confirm with manufacturer)",
    features: ["Elastic drawcord waistband", "Curved split hem", "Built-in liner", "Monogram at left hem"],
    care: CARE_TECH,
  },
];
