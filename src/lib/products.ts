import { CATALOG, COLORWAYS, type ColorId, type RawProduct, type Category, type CollectionId, type Gender } from "@/data/catalog";

export { COLORWAYS };
export type { ColorId, Category, CollectionId, Gender };

export type ProductImage = {
  src: string;
  alt: string;
  kind: "render" | "photo";
  /** photos are shot on black; renders on light studio grey */
  tone: "dark" | "light";
};

export type Product = RawProduct & {
  fullName: string;
  images: Record<ColorId, ProductImage[]>;
};

export const SHOTS = ["front", "back", "detail", "texture"] as const;
const SHOT_LABEL: Record<(typeof SHOTS)[number], string> = {
  front: "front",
  back: "back",
  detail: "logo detail",
  texture: "fabric and construction detail",
};

function buildImages(p: RawProduct): Record<ColorId, ProductImage[]> {
  const out = {} as Record<ColorId, ProductImage[]>;
  for (const c of p.colors) {
    const color = COLORWAYS[c].name;
    const renders: ProductImage[] = SHOTS.map((s) => ({
      src: `/products/${p.slug}/${c}-${s}.webp`,
      alt: `BLK ANVL ${p.name} in ${color}, ${SHOT_LABEL[s]}`,
      kind: "render",
      tone: "light",
    }));
    if (p.photoColor === c) {
      const ph = (src: string, what: string): ProductImage => ({ src, alt: `BLK ANVL ${p.name} in ${color}, ${what}`, kind: "photo", tone: "dark" });
      out[c] = [
        ph("/photo/hoodie-front.webp", "front"),
        ph("/photo/hoodie-back.webp", "back with wordmark"),
        ph("/photo/detail-monogram.webp", "embroidered chest monogram"),
        ph("/photo/detail-wordmark.webp", "printed back wordmark"),
        ph("/photo/detail-label.webp", "woven neck label"),
        ph("/photo/detail-shoulder.webp", "dropped shoulder seam"),
      ];
    } else {
      out[c] = renders;
    }
  }
  return out;
}

export const PRODUCTS: Product[] = CATALOG.map((p) => ({
  ...p,
  fullName: `BLK ANVL ${p.name}`,
  images: buildImages(p),
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
    image: "/photo/hoodie-back.webp",
  },
  heavyweight: {
    title: "Heavyweight",
    blurb: "Dense fleece and jersey with a garment-washed hand.",
    image: "/photo/detail-shoulder.webp",
  },
  seamless: {
    title: "Seamless",
    blurb: "Knitted in one piece. Zoned structure, minimal seams.",
    image: "/products/seamless-long-sleeve/obsidian-texture.webp",
  },
  training: {
    title: "Training",
    blurb: "Technical layers designed around range of movement.",
    image: "/campaign/rack.webp",
  },
};

export const CATEGORIES: Record<Gender, Category[]> = {
  men: ["T-Shirts", "Tanks", "Hoodies", "Long Sleeves", "Jackets", "Shorts", "Joggers"],
  women: ["Leggings", "Sports Bras", "T-Shirts", "Tanks", "Hoodies", "Jackets", "Shorts"],
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
