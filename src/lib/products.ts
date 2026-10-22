import photoManifest from "@/data/photo-manifest.json";
import { CATALOG, COLORWAYS, type ColorId, type RawProduct, type Category, type CollectionId, type Gender } from "@/data/catalog";

export { COLORWAYS };
export type { ColorId, Category, CollectionId, Gender };

export type ImageRole = "lifestyle" | "front" | "back" | "logo-detail" | "label-detail" | "fabric-detail" | "fabric-detail-2" | "detail" | "texture";

export type ProductImage = {
  src: string;
  alt: string;
  /** photo = real photography from the product shoots; render = studio render placeholder */
  kind: "render" | "photo";
  role: ImageRole;
  /** photos are shot on black; renders on light studio grey */
  tone: "dark" | "light";
  width: number;
  height: number;
  /** letterbox colour sampled from the image edge, so contained images sit seamlessly */
  bg: string;
  /** landscape product shots are shown whole (contain); portraits fill the frame (cover) */
  fit: "cover" | "contain";
  needsHiRes?: boolean;
};

export type Product = RawProduct & {
  fullName: string;
  images: Record<ColorId, ProductImage[]>;
  /** colourways that have real photography */
  photoColors: ColorId[];
};

export const SHOTS = ["front", "back", "detail", "texture"] as const;
const SHOT_LABEL: Record<(typeof SHOTS)[number], string> = {
  front: "front",
  back: "back",
  detail: "logo detail",
  texture: "fabric and construction detail",
};

type ManifestItem = { role: ImageRole; src: string; width: number; height: number; bg: string; alt: string; needsHiRes: boolean };
const MANIFEST = photoManifest as Record<string, Partial<Record<ColorId, ManifestItem[]>>>;

function buildImages(p: RawProduct): Record<ColorId, ProductImage[]> {
  const out = {} as Record<ColorId, ProductImage[]>;
  for (const c of p.colors) {
    const color = COLORWAYS[c].name;
    const photos = MANIFEST[p.slug]?.[c];
    if (photos?.length) {
      out[c] = photos.map((m) => ({
        src: m.src,
        alt: `BLK ANVL ${p.name} in ${color}, ${m.alt}`,
        kind: "photo",
        role: m.role,
        tone: "dark",
        width: m.width,
        height: m.height,
        bg: m.bg,
        fit: m.width / m.height > 0.9 ? "contain" : "cover",
        needsHiRes: m.needsHiRes,
      }));
    } else {
      out[c] = SHOTS.map((s) => ({
        src: `/products/${p.slug}/${c}-${s}.webp`,
        alt: `BLK ANVL ${p.name} in ${color}, ${SHOT_LABEL[s]} (studio render)`,
        kind: "render",
        role: s,
        tone: "light",
        width: 1200,
        height: 1500,
        bg: "#e6e4df",
        fit: "cover",
      }));
    }
  }
  return out;
}

export const PRODUCTS: Product[] = CATALOG.map((p) => ({
  ...p,
  fullName: `BLK ANVL ${p.name}`,
  images: buildImages(p),
  photoColors: p.colors.filter((c) => !!MANIFEST[p.slug]?.[c]?.length),
}));

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

// ─── placeholder inventory ──────────────────────────────────────────
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 1000;
}

/** PLACEHOLDER stock level per variant. Replace with live inventory. */
export function stockFor(slug: string, color: ColorId, size: string) {
  const v = hash(`${slug}:${color}:${size}`);
  if (v < 70) return 0;
  if (v < 190) return 1 + (v % 4);
  return 10 + (v % 30);
}

export type StockState = "in" | "low" | "out";
export function stockState(qty: number): StockState {
  return qty === 0 ? "out" : qty < 5 ? "low" : "in";
}

export function isInStock(p: Product, color?: ColorId) {
  const colors = color ? [color] : p.colors;
  return colors.some((c) => p.sizes.some((s) => stockFor(p.slug, c, s) > 0));
}

// ─── collections & navigation ───────────────────────────────────────
export const COLLECTIONS: Record<CollectionId, { title: string; blurb: string; image: string }> = {
  "the-uniform": {
    title: "The Uniform",
    blurb: "The core pieces. Tonal, considered, and built to be worn on repeat.",
    image: "/products/washed-heavyweight-hoodie/washed-black/back.webp",
  },
  heavyweight: {
    title: "Heavyweight",
    blurb: "Dense fleece and jersey with a garment-washed hand.",
    image: "/photo/detail-shoulder.webp",
  },
  training: {
    title: "Training",
    blurb: "Technical layers designed around range of movement.",
    image: "/campaign/rack.webp",
  },
};

const CATEGORY_ORDER: Category[] = ["Hoodies", "T-Shirts", "Leggings", "Shorts", "Tanks", "Long Sleeves", "Jackets", "Joggers", "Sports Bras"];
/** Categories that actually have products, per gender. */
export const CATEGORIES: Record<Gender, Category[]> = {
  men: CATEGORY_ORDER.filter((c) => CATALOG.some((p) => p.gender === "men" && p.category === c)),
  women: CATEGORY_ORDER.filter((c) => CATALOG.some((p) => p.gender === "women" && p.category === c)),
};

export const ALL_COLORS = Object.values(COLORWAYS);
export const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export function newArrivals() {
  return [...PRODUCTS].sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
}

export function related(p: Product, n = 4) {
  const same = PRODUCTS.filter((x) => x.slug !== p.slug && x.gender === p.gender);
  const scored = same.map((x) => ({ x, s: (x.category === p.category ? 0 : 2) + (x.collections.some((c) => p.collections.includes(c)) ? 0 : 1) }));
  return scored.sort((a, b) => a.s - b.s).slice(0, n).map((s) => s.x);
}

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  const terms = t.split(/\s+/);
  return PRODUCTS.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.gender} ${p.summary} ${p.colors.map((c) => COLORWAYS[c].name).join(" ")}`.toLowerCase();
    return terms.every((term) => hay.includes(term) || (term === "mens" && p.gender === "men") || (term === "womens" && p.gender === "women"));
  });
}
