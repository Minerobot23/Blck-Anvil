"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUI } from "@/store/cart";
import { COLORWAYS, formatPrice, getProduct, stockFor, type ColorId } from "@/lib/products";
import { SizePicker, Swatches, useAddToBag } from "./ProductBits";
import { useLockScroll } from "@/hooks/useLockScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

export function QuickView() {
  const { quickView, setQuickView } = useUI();
  const product = quickView ? getProduct(quickView) : undefined;
  const [color, setColor] = useState<ColorId | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const addToBag = useAddToBag();
  useLockScroll(!!product);

  useEffect(() => {
    setColor(product?.colors[0] ?? null);
    setSize(null);
    setIdx(0);
  }, [product]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setQuickView(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setQuickView]);

  const c = color ?? product?.colors[0];
  const imgs = product && c ? product.images[c] : [];
  const img = imgs[Math.min(idx, imgs.length - 1)];

  return (
    <AnimatePresence>
      {product && c && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-black/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickView(null)} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
            className="fixed inset-x-0 bottom-0 z-[81] max-h-[92svh] overflow-y-auto bg-coal md:inset-auto md:top-1/2 md:left-1/2 md:grid md:max-h-[86vh] md:w-[min(1040px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-2"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            data-lenis-prevent
          >
            <div className={`relative aspect-[4/5] w-full ${img?.tone === "dark" ? "bg-ink" : "bg-studio"} max-md:max-h-[52svh] max-md:aspect-auto max-md:h-[52svh]`}>
              <AnimatePresence initial={false}>
                {img && (
                  <motion.div key={img.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 520px, 100vw" className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                {imgs.slice(0, 4).map((im, i) => (
                  <button key={im.src} onClick={() => setIdx(i)} className={`h-1 w-7 transition-colors ${i === idx ? (img?.tone === "dark" ? "bg-bone" : "bg-ink") : "bg-black/20"}`} aria-label={`Show image ${i + 1}`} />
                ))}
              </div>
            </div>
            <div className="flex flex-col p-6 md:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-mute">{product.gender === "men" ? "Men" : "Women"} / {product.category}</p>
                  <h2 className="display mt-3 text-5xl">{product.name}</h2>
                </div>
                <button onClick={() => setQuickView(null)} className="-mt-2 -mr-2 p-2" aria-label="Close quick view">
                  <X className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </div>
              <p className="mt-3 text-sm tabular-nums">{formatPrice(product.price)}</p>
              <p className="mt-5 text-sm leading-relaxed text-fog">{product.summary}</p>

              <div className="mt-7">
                <p className="mb-3 text-xs text-mute">
                  Colour — <span className="text-bone">{COLORWAYS[c].name}</span>
                </p>
                <Swatches colors={product.colors} value={c} size="lg" onChange={(v) => { setColor(v); setIdx(0); setSize(null); }} />
              </div>
              <div className="mt-6">
                <div className="mb-3 flex justify-between text-xs">
                  <span className="text-mute">Size</span>
                  <Link href="/size-guide" className="link-underline text-mute hover:text-bone" onClick={() => setQuickView(null)}>Size guide</Link>
                </div>
                <SizePicker product={product} color={c} value={size} onChange={setSize} />
                {size && stockFor(product.slug, c, size) < 5 && <p className="mt-2 text-xs text-fog">Only a few left in {size}.</p>}
              </div>
              <div className="mt-8 grid gap-2 md:mt-auto md:pt-8">
                <button
                  disabled={!size}
                  onClick={() => {
                    if (!size) return;
                    addToBag(product.slug, c, size);
                    setQuickView(null);
                  }}
                  className="h-13 bg-bone py-4 text-xs tracking-[0.18em] text-ink uppercase transition-opacity disabled:opacity-40"
                >
                  {size ? `Add to bag — ${formatPrice(product.price)}` : "Select a size"}
                </button>
                <Link href={`/products/${product.slug}?color=${c}`} onClick={() => setQuickView(null)} className="link-underline mx-auto mt-2 text-xs text-mute hover:text-bone">
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
