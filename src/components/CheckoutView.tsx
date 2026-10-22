"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Info } from "lucide-react";
import { useBagTotals } from "./BagDrawer";
import { COLORWAYS, formatPrice, getProduct } from "@/lib/products";
import { startCheckout, type CheckoutResult } from "@/lib/commerce";
import { useHydrated } from "@/hooks/useHydrated";
import { Monogram } from "./Logo";

const EASE = [0.16, 1, 0.3, 1] as const;

const FIELDS: { name: string; label: string; type?: string; auto: string; half?: boolean }[] = [
  { name: "email", label: "Email", type: "email", auto: "email" },
  { name: "firstName", label: "First name", auto: "given-name", half: true },
  { name: "lastName", label: "Last name", auto: "family-name", half: true },
  { name: "address", label: "Address", auto: "address-line1" },
  { name: "city", label: "City", auto: "address-level2", half: true },
  { name: "postcode", label: "Postal code", auto: "postal-code", half: true },
  { name: "country", label: "Country", auto: "country-name" },
];

export function CheckoutView() {
  const hydrated = useHydrated();
  const { lines, subtotal, shipping, total } = useBagTotals();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  if (hydrated && lines.length === 0 && !result) {
    return (
      <div className="gutter flex min-h-[60vh] flex-col items-start justify-center">
        <p className="display text-7xl">Nothing to check out.</p>
        <Link href="/shop" className="mt-8 flex h-12 items-center bg-bone px-8 text-xs tracking-[0.18em] text-ink uppercase">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="gutter pt-10 pb-28 md:pt-14">
      <div className="mb-10 flex items-center gap-4">
        <Monogram className="h-8 w-auto" />
        <h1 className="display text-6xl md:text-7xl">Checkout</h1>
      </div>

      <div className="mb-10 flex gap-3 border border-white/15 bg-char/60 px-5 py-4 text-xs leading-relaxed text-fog">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-bone" strokeWidth={1.4} />
        <p>
          <span className="text-bone">Demo checkout.</span> No payment provider is connected yet, so no order will be placed and no payment will be taken. The storefront is architected to hand off to Shopify Checkout or Stripe once credentials are configured.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        <form
          className="lg:col-span-7"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
            const r = await startCheckout(lines, data);
            setBusy(false);
            if (r.status === "redirect") window.location.href = r.url;
            else setResult(r);
          }}
        >
          <fieldset>
            <legend className="eyebrow mb-6">Contact &amp; delivery</legend>
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              {FIELDS.map((f) => (
                <label key={f.name} className={`group relative block ${f.half ? "col-span-1" : "col-span-2"}`}>
                  <span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">{f.label}</span>
                  <input
                    name={f.name}
                    type={f.type ?? "text"}
                    autoComplete={f.auto}
                    required
                    className="h-12 w-full border border-white/15 bg-transparent px-4 text-sm transition-colors focus:border-bone focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-10">
            <legend className="eyebrow mb-6">Payment</legend>
            <div className="flex items-center gap-3 border border-dashed border-white/20 px-5 py-6 text-sm text-mute">
              <Lock className="h-4 w-4" strokeWidth={1.4} /> Payment fields appear here once a provider (Shopify / Stripe) is connected.
            </div>
          </fieldset>

          <button type="submit" disabled={busy || !hydrated} className="mt-10 flex h-14 w-full items-center justify-center bg-bone text-xs tracking-[0.2em] text-ink uppercase transition-opacity disabled:opacity-50">
            {busy ? "Checking bag…" : `Continue — ${formatPrice(total)}`}
          </button>

          <AnimatePresence>
            {result && result.status !== "redirect" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mt-6 border border-white/15 p-5 text-sm" role="status">
                {result.status === "demo" ? (
                  <>
                    <p className="eyebrow mb-3 text-bone">Demo — order not placed</p>
                    <p className="text-fog">Your bag was validated successfully. {result.reason}</p>
                  </>
                ) : (
                  <p className="text-red-300">{result.message}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="sticky top-28 bg-char p-6">
            <h2 className="eyebrow mb-6">Order summary</h2>
            <ul className="space-y-4">
              {hydrated &&
                lines.map((l) => {
                  const p = getProduct(l.slug);
                  if (!p) return null;
                  const img = p.images[l.color][0];
                  return (
                    <li key={l.key} className="flex gap-4">
                      <div className={`relative h-20 w-16 shrink-0 overflow-hidden ${img.tone === "dark" ? "bg-ink" : "bg-studio"}`}>
                        <Image src={img.src} alt={img.alt} fill sizes="64px" className="object-cover" />
                        <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px]">{l.qty}</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="text-sm">{p.name}</p>
                        <p className="mt-1 text-mute">{COLORWAYS[l.color].name} / {l.size}</p>
                      </div>
                      <p className="text-sm tabular-nums">{formatPrice(p.price * l.qty)}</p>
                    </li>
                  );
                })}
            </ul>
            <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-fog">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-fog">Shipping*</dt><dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between border-t border-white/10 pt-4 text-base"><dt>Total</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
            </dl>
            <p className="mt-4 text-[11px] text-mute">*Placeholder rates. Taxes calculated by the payment provider.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
