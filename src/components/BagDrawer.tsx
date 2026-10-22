"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart, useUI, type CartLine } from "@/store/cart";
import { COLORWAYS, formatPrice, getProduct, newArrivals } from "@/lib/products";
import { FLAT_SHIPPING, FREE_SHIPPING_THRESHOLD } from "@/lib/commerce";
import { useLockScroll } from "@/hooks/useLockScroll";
import { useHydrated } from "@/hooks/useHydrated";
import { useEffect } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function useBagTotals() {
  const lines = useCart((s) => s.lines);
  const subtotal = lines.reduce((sum, l) => sum + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  return { lines, subtotal, shipping, total: subtotal + shipping, count: lines.reduce((n, l) => n + l.qty, 0) };
}

export function BagLine({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const { setQty, remove } = useCart();
  const setBag = useUI((s) => s.setBag);
  const p = getProduct(line.slug);
  if (!p) return null;
  const img = p.images[line.color]?.[0];
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginTop: 0, paddingTop: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex gap-4 border-t border-white/[0.07] pt-5 first:border-t-0 first:pt-0"
    >
      <Link href={`/products/${p.slug}?color=${line.color}`} onClick={() => setBag(false)} className={`relative shrink-0 overflow-hidden ${img?.tone === "dark" ? "bg-ink" : "bg-studio"} ${compact ? "h-28 w-[90px]" : "h-36 w-[115px]"}`}>
        {img && <Image src={img.src} alt={img.alt} fill sizes="120px" className="object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm">{p.name}</p>
            <p className="mt-1 text-xs text-mute">
              {COLORWAYS[line.color].name} / {line.size}
            </p>
          </div>
          <p className="text-sm tabular-nums">{formatPrice(p.price * line.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-white/15">
            <button className="p-2 disabled:opacity-30" onClick={() => setQty(line.key, line.qty - 1)} aria-label={`Decrease quantity of ${p.name}`}>
              <Minus className="h-3 w-3" />
            </button>
            <span className="relative w-6 overflow-hidden text-center text-xs tabular-nums" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={line.qty} className="block" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {line.qty}
                </motion.span>
              </AnimatePresence>
            </span>
            <button className="p-2 disabled:opacity-30" disabled={line.qty >= 10} onClick={() => setQty(line.key, line.qty + 1)} aria-label={`Increase quantity of ${p.name}`}>
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <button className="link-underline text-xs text-mute hover:text-bone" onClick={() => remove(line.key)}>
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div>
      <p className="text-xs text-fog">
        {remaining > 0 ? (
          <>
            {formatPrice(remaining)} away from free standard shipping<span className="text-mute">*</span>
          </>
        ) : (
          <>Free standard shipping unlocked<span className="text-mute">*</span></>
        )}
      </p>
      <div className="mt-2.5 h-px w-full bg-white/10">
        <motion.div className="h-px bg-bone" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: EASE }} />
      </div>
    </div>
  );
}

export function BagDrawer() {
  const { bagOpen, setBag } = useUI();
  const hydrated = useHydrated();
  const { lines, subtotal, count } = useBagTotals();
  useLockScroll(bagOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBag(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setBag]);

  const suggestions = newArrivals().slice(0, 4);

  return (
    <AnimatePresence>
      {bagOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setBag(false)}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-[460px] flex-col bg-coal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            data-lenis-prevent
          >
            <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-6">
              <p className="eyebrow">
                Bag <span className="text-mute">({hydrated ? count : 0})</span>
              </p>
              <button onClick={() => setBag(false)} className="-mr-2 p-2" aria-label="Close bag" autoFocus>
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            {hydrated && lines.length > 0 ? (
              <>
                <div className="border-b border-white/[0.07] px-6 py-4">
                  <ShippingProgress subtotal={subtotal} />
                </div>
                <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <BagLine key={l.key} line={l} compact />
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-white/[0.07] px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-mute">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link href="/cart" onClick={() => setBag(false)} className="flex h-12 items-center justify-center border border-white/20 text-xs tracking-[0.18em] uppercase transition-colors hover:border-bone">
                      View Bag
                    </Link>
                    <Link href="/checkout" onClick={() => setBag(false)} className="flex h-12 items-center justify-center bg-bone text-xs tracking-[0.18em] text-ink uppercase transition-opacity hover:opacity-85">
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col overflow-y-auto px-6 py-10">
                <p className="display text-6xl">Your bag<br />is empty.</p>
                <p className="mt-4 max-w-xs text-sm text-mute">Start with the pieces everything else is built around.</p>
                <div className="mt-8 grid grid-cols-2 gap-2">
                  <Link href="/men" onClick={() => setBag(false)} className="flex h-12 items-center justify-center bg-bone text-xs tracking-[0.18em] text-ink uppercase">Shop Men</Link>
                  <Link href="/women" onClick={() => setBag(false)} className="flex h-12 items-center justify-center border border-white/20 text-xs tracking-[0.18em] uppercase">Shop Women</Link>
                </div>
                <p className="eyebrow mt-12 mb-4 text-mute">New in</p>
                <div className="grid grid-cols-2 gap-3">
                  {suggestions.map((p) => {
                    const img = p.images[p.colors[0]][0];
                    return (
                      <Link key={p.slug} href={`/products/${p.slug}`} onClick={() => setBag(false)} className="group">
                        <div className={`relative aspect-[4/5] overflow-hidden ${img.tone === "dark" ? "bg-ink" : "bg-studio"}`}>
                          <Image src={img.src} alt={img.alt} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <p className="mt-2 text-xs">{p.name}</p>
                        <p className="text-xs text-mute">{formatPrice(p.price)}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
