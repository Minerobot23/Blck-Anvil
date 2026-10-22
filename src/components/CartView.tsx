"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { BagLine, ShippingProgress, useBagTotals } from "./BagDrawer";
import { formatPrice, newArrivals } from "@/lib/products";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductRail } from "./home/Rails";
import { SplitHeading } from "./Motion";

export function CartView() {
  const hydrated = useHydrated();
  const { lines, subtotal, shipping, total, count } = useBagTotals();

  return (
    <div className="pb-10">
      <div className="gutter pt-10 md:pt-16">
        <SplitHeading lines={["Bag"]} as="h1" className="display text-[clamp(72px,12vw,200px)]" animateOnMount />
      </div>
      {!hydrated ? (
        <div className="gutter mt-12 grid gap-4"><div className="skeleton h-36" /><div className="skeleton h-36" /></div>
      ) : lines.length === 0 ? (
        <div className="gutter mt-10">
          <p className="text-sm text-mute">Your bag is empty.</p>
          <div className="mt-8 flex gap-2">
            <Link href="/men" className="flex h-12 items-center bg-bone px-8 text-xs tracking-[0.18em] text-ink uppercase">Shop Men</Link>
            <Link href="/women" className="flex h-12 items-center border border-white/20 px-8 text-xs tracking-[0.18em] uppercase">Shop Women</Link>
          </div>
        </div>
      ) : (
        <div className="gutter mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-6 text-xs text-mute">{count} {count === 1 ? "item" : "items"}</p>
            <ul className="space-y-6 border-t border-white/10 pt-6">
              <AnimatePresence initial={false}>
                {lines.map((l) => <BagLine key={l.key} line={l} />)}
              </AnimatePresence>
            </ul>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-28 bg-char p-6 md:p-8">
              <h2 className="eyebrow mb-6">Summary</h2>
              <ShippingProgress subtotal={subtotal} />
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-fog">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-fog">Standard shipping*</dt><dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
                <div className="flex justify-between"><dt className="text-fog">Tax</dt><dd className="text-mute">At checkout</dd></div>
                <div className="flex justify-between border-t border-white/10 pt-4 text-base"><dt>Total</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
              </dl>
              <Link href="/checkout" className="mt-6 flex h-14 items-center justify-center bg-bone text-xs tracking-[0.2em] text-ink uppercase transition-opacity hover:opacity-90">Checkout</Link>
              <p className="mt-4 text-[11px] leading-relaxed text-mute">*Placeholder shipping rates. Checkout is in demo mode — no payment provider is connected.</p>
            </div>
          </aside>
        </div>
      )}
      <div className="mt-16 border-t border-white/[0.06]">
        <ProductRail eyebrow="Before you go" title={["New", "Arrivals"]} products={newArrivals().slice(0, 6)} href="/new" />
      </div>
    </div>
  );
}
