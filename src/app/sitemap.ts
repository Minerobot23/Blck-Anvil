import type { MetadataRoute } from "next";
import { COLLECTIONS, PRODUCTS } from "@/lib/products";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blkanvl.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/men", "/women", "/new", "/collections", "/about", "/size-guide", "/faq", "/shipping-returns", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}` })),
    ...Object.keys(COLLECTIONS).map((c) => ({ url: `${SITE}/collections/${c}` })),
    ...PRODUCTS.map((p) => ({ url: `${SITE}/products/${p.slug}` })),
  ];
}
