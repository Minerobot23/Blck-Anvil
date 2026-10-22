"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, Plus } from "lucide-react";
import { COLORWAYS, formatPrice, isInStock, type ColorId, type Product } from "@/lib/products";
import { SizePicker, Swatches, useAddToBag } from "./ProductBits";
import { useUI } from "@/store/cart";


export function ProductCard({ product, priority = false, sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" }: { product: Product; priority?: boolean; sizes?: string }) {
  const [color, setColor] = useState<ColorId>(product.colors[0]);
  const [added, setAdded] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const addToBag = useAddToBag();
  const setQuickView = useUI((s) => s.setQuickView);
  const imgs = product.images[color];
  const [a, b] = imgs;
  const dark = a.tone === "dark";
  const soldOut = !isInStock(product, color);
  const href = `/products/${product.slug}${color !== product.colors[0] ? `?color=${color}` : ""}`;

  const quickAdd = (size: string) => {
    addToBag(product.slug, color, size, false);
    setAdded(size);
    window.setTimeout(() => setAdded(null), 1600);
  };

  return (
    <article className="group/card relative">
      <div className={`relative aspect-[4/5] overflow-hidden ${dark ? "bg-ink" : "bg-studio"}`}>
        <Link href={href} aria-label={`${product.name}, ${COLORWAYS[color].name}`} className="absolute inset-0 block">
          {/* hover devices: crossfade between front and back */}
          <div className="absolute inset-0 hidden [@media(hover:hover)]:block">
            <AnimatePresence initial={false}>
              <motion.div key={a.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <Image src={a.src} alt={a.alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.035]" />
                {b && (
                  <Image src={b.src} alt="" fill sizes={sizes} className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-out-expo)] group-hover/card:opacity-100" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* touch devices: swipeable mini gallery */}
          <div
            ref={scroller}
            className="no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto [@media(hover:hover)]:hidden"
            onScroll={(e) => {
              const el = e.currentTarget;
              setSlide(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {[a, b].filter(Boolean).map((img, i) => (
              <div key={img!.src} className="relative h-full w-full shrink-0 snap-start">
                <Image src={img!.src} alt={i === 0 ? img!.alt : ""} fill sizes={sizes} priority={priority && i === 0} className="object-cover" />
              </div>
            ))}
          </div>
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex gap-1.5">
          {product.isNew && <span className={`eyebrow px-2 py-1.5 text-[9px] ${dark ? "bg-bone text-ink" : "bg-ink text-bone"}`}>New</span>}
          {soldOut && <span className="eyebrow bg-white/80 px-2 py-1.5 text-[9px] text-ink">Sold out</span>}
        </div>

        {/* slide dots (touch) */}
        {b && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 [@media(hover:hover)]:hidden" aria-hidden>
            {[0, 1].map((i) => (
              <span key={i} className={`h-[3px] rounded-full transition-all duration-300 ${slide === i ? "w-4" : "w-[3px]"} ${dark ? "bg-bone" : "bg-ink"} ${slide === i ? "opacity-90" : "opacity-40"}`} />
            ))}
          </div>
        )}

        <button
          onClick={() => setQuickView(product.slug)}
          className={`absolute top-2.5 right-2.5 hidden h-9 w-9 translate-y-1 items-center justify-center rounded-full opacity-0 backdrop-blur transition duration-500 ease-[var(--ease-out-expo)] group-hover/card:translate-y-0 group-hover/card:opacity-100 focus-visible:opacity-100 [@media(hover:hover)]:flex ${dark ? "bg-white/10 text-bone" : "bg-white/70 text-ink"}`}
          aria-label={`Quick view ${product.name}`}
        >
          <Eye className="h-4 w-4" strokeWidth={1.5} />
        </button>

        {/* quick add — hover devices */}
        {!soldOut && (
          <div className="absolute inset-x-2 bottom-2 hidden translate-y-[calc(100%+12px)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within/card:translate-y-0 group-hover/card:translate-y-0 [@media(hover:hover)]:block">
            <div className="bg-ink/90 p-2.5 backdrop-blur-md">
              <div className="mb-2 flex h-4 items-center justify-between text-[10px] tracking-[0.18em] uppercase">
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-1.5 text-bone">
                      <Check className="h-3 w-3" /> Added — {added}
                    </motion.span>
                  ) : (
                    <motion.span key="qa" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-fog">
                      Quick add
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <SizePicker product={product} color={color} value={null} onChange={quickAdd} dense />
            </div>
          </div>
        )}

        {/* quick add — touch devices */}
        <button
          onClick={() => setQuickView(product.slug)}
          className={`absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full [@media(hover:hover)]:hidden ${dark ? "bg-white/15 text-bone" : "bg-white/80 text-ink"} backdrop-blur`}
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[13px] leading-snug">
            <Link href={href} className="link-underline">{product.name}</Link>
          </h3>
          <p className="mt-0.5 text-xs text-mute">
            {COLORWAYS[color].name}
            <span className="hidden sm:inline"> · {product.colors.length} colours</span>
          </p>
        </div>
        <p className="shrink-0 text-[13px] tabular-nums">{formatPrice(product.price)}</p>
      </div>
      <div className="mt-2.5">
        <Swatches colors={product.colors} value={color} onChange={setColor} />
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5]" />
      <div className="skeleton mt-3.5 h-3 w-2/3" />
      <div className="skeleton mt-2 h-3 w-1/3" />
    </div>
  );
}
