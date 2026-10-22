import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/pdp/ProductView";
import { ProductRail } from "@/components/home/Rails";
import { COLORWAYS, PRODUCTS, getProduct, isInStock, related } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const img = p.images[p.colors[0]][0];
  return {
    title: `${p.name} — ${p.gender === "men" ? "Men" : "Women"}`,
    description: `${p.summary} ${p.description}`.slice(0, 160),
    openGraph: { title: p.fullName, images: [{ url: img.src, alt: img.alt }] },
    alternates: { canonical: `/products/${p.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: p.fullName,
    description: p.description,
    brand: { "@type": "Brand", name: "BLK ANVL" },
    productGroupID: p.slug,
    variesBy: ["https://schema.org/color", "https://schema.org/size"],
    hasVariant: p.colors.map((c) => ({
      "@type": "Product",
      name: `${p.fullName} — ${COLORWAYS[c].name}`,
      color: COLORWAYS[c].name,
      image: p.images[c].map((i) => i.src),
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "USD",
        availability: isInStock(p, c) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView slug={p.slug} />
      <div className="mt-16 border-t border-white/[0.06]">
        <ProductRail eyebrow="Complete the look" title={["Pairs", "well with"]} products={related(p, 6)} href={`/${p.gender}`} hrefLabel={`Shop ${p.gender}`} />
      </div>
    </>
  );
}
