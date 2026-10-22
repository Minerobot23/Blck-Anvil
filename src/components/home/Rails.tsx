"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductCard } from "../ProductCard";
import { Reveal, SplitHeading } from "../Motion";
import type { Product } from "@/lib/products";

export function ProductRail({ title, eyebrow, products, href, hrefLabel = "View all" }: { title: string[]; eyebrow: string; products: Product[]; href: string; hrefLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(update, []);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="py-24 md:py-32" aria-label={title.join(" ")}>
      <div className="gutter mb-10 flex items-end justify-between gap-6 md:mb-14">
        <div>
          <Reveal><p className="eyebrow mb-5 text-mute">{eyebrow}</p></Reveal>
          <SplitHeading lines={title} className="display text-[clamp(56px,8vw,128px)]" />
        </div>
        <div className="flex items-center gap-6">
          <Link href={href} className="link-underline hidden text-xs tracking-[0.18em] uppercase sm:inline-block">{hrefLabel}</Link>
          <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll(-1)} disabled={edge.start} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-bone disabled:opacity-25" aria-label="Previous products">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <button onClick={() => scroll(1)} disabled={edge.end} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-bone disabled:opacity-25" aria-label="Next products">
              <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>
      <div ref={ref} onScroll={update} className="no-scrollbar gutter flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto md:scroll-px-8 md:gap-4 xl:scroll-px-12">
        {products.map((p, i) => (
          <div key={p.slug} className="w-[72vw] shrink-0 snap-start xs:w-[60vw] sm:w-[42vw] md:w-[31vw] xl:w-[23vw]">
            <Reveal delay={Math.min(i, 4) * 0.06}>
              <ProductCard product={p} sizes="(min-width:1280px) 23vw, (min-width:768px) 31vw, 72vw" />
            </Reveal>
          </div>
        ))}
      </div>
      <div className="gutter mt-8 sm:hidden">
        <Link href={href} className="flex h-12 items-center justify-center border border-white/20 text-xs tracking-[0.18em] uppercase">{hrefLabel}</Link>
      </div>
    </section>
  );
}

const CATS = [
  { label: "Hoodies", href: "/shop?category=Hoodies", img: "/products/washed-heavyweight-hoodie/washed-black/lifestyle.webp", n: "01" },
  { label: "Leggings", href: "/women?category=Leggings", img: "/products/flared-leggings/obsidian/lifestyle.webp", n: "02" },
  { label: "Tees", href: "/shop?category=T-Shirts", img: "/products/essential-oversized-tee/obsidian/lifestyle.webp", n: "03" },
  { label: "Shorts", href: "/shop?category=Shorts", img: "/products/training-shorts/obsidian/lifestyle.webp", n: "04" },
];

export function CategoryRail() {
  return (
    <section className="gutter pt-24 md:pt-32" aria-label="Shop by category">
      <div className="mb-10 flex items-end justify-between">
        <Reveal><p className="eyebrow text-mute">Shop by category</p></Reveal>
        <Reveal><Link href="/shop" className="link-underline text-xs tracking-[0.18em] uppercase">Shop all</Link></Reveal>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {CATS.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.07}>
            <Link href={c.href} className="group relative block aspect-[4/5] overflow-hidden bg-char">
              <Image src={c.img} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
              <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] text-bone/70">{c.n}</span>
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between md:inset-x-5 md:bottom-5">
                <span className="display text-[clamp(36px,5vw,72px)] text-bone">{c.label}</span>
                <ArrowUpRight className="mb-2 h-5 w-5 -translate-x-1 translate-y-1 text-bone opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" strokeWidth={1.3} />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
