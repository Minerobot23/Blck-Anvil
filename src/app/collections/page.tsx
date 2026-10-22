import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, PRODUCTS, type CollectionId } from "@/lib/products";
import { Reveal, SplitHeading } from "@/components/Motion";

export const metadata: Metadata = { title: "Collections", description: "BLK ANVL collections: The Uniform, Heavyweight and Training." };

export default function Page() {
  const ids = Object.keys(COLLECTIONS) as CollectionId[];
  return (
    <div className="gutter pt-10 pb-28 md:pt-16">
      <SplitHeading lines={["Collections"]} as="h1" className="display text-[clamp(72px,12vw,200px)]" animateOnMount />
      <div className="mt-14 grid gap-3 md:grid-cols-2 md:gap-4">
        {ids.map((id, i) => {
          const c = COLLECTIONS[id];
          const items = PRODUCTS.filter((p) => p.collections.includes(id));
          return (
            <Reveal key={id} delay={(i % 2) * 0.08}>
              <Link href={`/collections/${id}`} className="group relative block aspect-[4/5] overflow-hidden bg-char md:aspect-[5/6]">
                <Image src={c.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-85 transition duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-6 md:inset-x-8 md:bottom-8">
                  <p className="eyebrow mb-4 text-fog">0{i + 1} — {items.length} pieces</p>
                  <h2 className="display text-[clamp(56px,7vw,112px)]">{c.title}</h2>
                  <p className="mt-3 max-w-sm text-sm text-fog">{c.blurb}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
