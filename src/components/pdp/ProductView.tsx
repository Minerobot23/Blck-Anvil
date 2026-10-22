"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Ruler, Truck, RotateCcw, X } from "lucide-react";
import { COLORWAYS, formatPrice, getProduct, stockFor, stockState, type ColorId } from "@/lib/products";
import { SizePicker, Swatches, useAddToBag } from "../ProductBits";
import { SizeTable } from "../SizeTable";
import { Gallery } from "./Gallery";
import { useLockScroll } from "@/hooks/useLockScroll";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce";
import { useSmartSticky } from "@/hooks/useSmartSticky";
import { useKeydown } from "@/hooks/useKeydown";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductView({ slug }: { slug: string }) {
  const product = getProduct(slug)!;
  const [color, setColor] = useState<ColorId>(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [guide, setGuide] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const addBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const stickyTop = useSmartSticky(panel);
  const addToBag = useAddToBag();

  // honour ?color= after hydration (keeps the page statically rendered)
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("color") as ColorId | null;
    if (c && product.colors.includes(c)) setColor(c);
  }, [product.colors]);

  useEffect(() => {
    const el = addBtn.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const changeColor = (c: ColorId) => {
    setColor(c);
    if (size && stockFor(product.slug, c, size) === 0) setSize(null);
    const url = new URL(window.location.href);
    url.searchParams.set("color", c);
    window.history.replaceState(null, "", url);
  };

  const images = product.images[color];
  const qty = size ? stockFor(product.slug, color, size) : null;
  const allOut = product.sizes.every((s) => stockFor(product.slug, color, s) === 0);

  const add = () => {
    if (!size) {
      setError(true);
      return;
    }
    addToBag(product.slug, color, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="lg:gutter lg:grid lg:grid-cols-12 lg:gap-10 lg:pt-6">
        {/* ── Gallery ── */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Gallery images={images} colorName={COLORWAYS[color].name} />
        </div>

        {/* ── Purchase panel ── */}
        <div className="gutter pt-8 lg:col-span-5 lg:px-0 lg:pt-0 xl:col-span-4">
          <div ref={panel} className="lg:sticky" style={{ top: stickyTop }}>
            <nav aria-label="Breadcrumb" className="text-[11px] text-mute">
              <ol className="flex flex-wrap gap-1.5">
                <li><Link href={`/${product.gender}`} className="link-underline hover:text-bone">{product.gender === "men" ? "Men" : "Women"}</Link> /</li>
                <li><Link href={`/${product.gender}?category=${encodeURIComponent(product.category)}`} className="link-underline hover:text-bone">{product.category}</Link></li>
              </ol>
            </nav>
            <div className="mt-5 flex items-start justify-between gap-4">
              <h1 className="display text-[clamp(48px,5vw,76px)]">{product.name}</h1>
              {product.isNew && <span className="eyebrow mt-2 shrink-0 border border-white/20 px-2 py-1.5 text-[9px]">New</span>}
            </div>
            <p className="mt-4 text-base tabular-nums">{formatPrice(product.price)} <span className="ml-2 text-[11px] text-mute">Placeholder price</span></p>
            <p className="mt-4 text-sm leading-relaxed text-fog">{product.summary}</p>

            <div className="mt-8">
              <p className="mb-3 text-xs text-mute">
                Colour — <span className="text-bone">{COLORWAYS[color].name}</span>
              </p>
              <Swatches colors={product.colors} value={color} onChange={changeColor} size="lg" />
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="text-mute">
                  Size {size && <>— <span className="text-bone">{size}</span></>}
                </span>
                <button onClick={() => setGuide(true)} className="link-underline flex items-center gap-1.5 text-mute hover:text-bone">
                  <Ruler className="h-3.5 w-3.5" strokeWidth={1.4} /> Size guide
                </button>
              </div>
              <SizePicker product={product} color={color} value={size} onChange={(s) => { setSize(s); setError(false); }} />
              <div className="mt-3 min-h-5 text-xs" aria-live="polite">
                {error && !size ? (
                  <span className="text-red-300">Select a size to continue.</span>
                ) : qty !== null && stockState(qty) === "low" ? (
                  <span className="text-fog">Low stock — {qty} left in {size}.</span>
                ) : qty !== null ? (
                  <span className="text-mute">In stock. {product.fit.split(".")[0]}.</span>
                ) : (
                  <span className="text-mute">{product.fit.split(".")[0]}.</span>
                )}
              </div>
            </div>

            <button
              ref={addBtn}
              onClick={add}
              disabled={allOut}
              className="relative mt-4 flex h-14 w-full items-center justify-center overflow-hidden bg-bone text-xs tracking-[0.2em] text-ink uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span key="ok" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                    <Check className="h-4 w-4" /> Added to bag
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                    {allOut ? "Sold out in this colour" : `Add to bag — ${formatPrice(product.price)}`}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <ul className="mt-6 space-y-2.5 text-xs text-fog">
              <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-mute" strokeWidth={1.3} /> Free standard shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}*</li>
              <li className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-mute" strokeWidth={1.3} /> 30-day returns on unworn items*</li>
            </ul>

            <div className="mt-10 border-t border-white/10">
              <Accordion title="Details" defaultOpen>
                <p>{product.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex gap-3"><span className="mt-2 h-px w-3 shrink-0 bg-mute" />{f}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Fit">
                <p>{product.fit}</p>
                <button onClick={() => setGuide(true)} className="link-underline mt-3 text-bone">View size guide</button>
              </Accordion>
              <Accordion title="Fabric & care">
                <p><span className="text-bone">{product.fabric}.</span> {product.composition}.</p>
                <ul className="mt-4 space-y-1.5">
                  {product.care.map((c) => <li key={c}>{c}</li>)}
                </ul>
              </Accordion>
              <Accordion title="Shipping & returns">
                <p>Standard shipping 3–5 business days. Express 1–2 business days. Free returns within 30 days of delivery on unworn items with tags attached.</p>
                <p className="mt-3 text-mute">*Placeholder policy — to be confirmed before launch. <Link href="/shipping-returns" className="link-underline text-bone">Full details</Link></p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky add bar (mobile + desktop when panel scrolled away) */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-ink/92 backdrop-blur-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="gutter flex items-center gap-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className={`relative hidden h-14 w-11 shrink-0 overflow-hidden sm:block ${images[0].tone === "dark" ? "bg-ink" : "bg-studio"}`}>
                <Image src={images[0].src} alt="" fill sizes="44px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{product.name}</p>
                <p className="text-xs text-mute">{COLORWAYS[color].name} · {size ?? "Select size"} · {formatPrice(product.price)}</p>
              </div>
              <button
                onClick={() => {
                  if (!size) {
                    addBtn.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    setError(true);
                    return;
                  }
                  add();
                }}
                disabled={allOut}
                className="h-12 shrink-0 bg-bone px-6 text-[11px] tracking-[0.18em] text-ink uppercase disabled:opacity-40"
              >
                {added ? "Added" : size ? "Add to bag" : "Select size"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuideModal open={guide} onClose={() => setGuide(false)} gender={product.gender} />
    </>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button className="flex w-full items-center justify-between py-5 text-left text-xs tracking-[0.16em] uppercase" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: EASE }}><ChevronDown className="h-4 w-4" strokeWidth={1.4} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
            <div className="pb-6 text-sm leading-relaxed text-fog">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SizeGuideModal({ open, onClose, gender }: { open: boolean; onClose: () => void; gender: "men" | "women" }) {
  useLockScroll(open);
  useKeydown((e) => e.key === "Escape" && onClose(), open);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[85] bg-black/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            className="fixed inset-y-0 right-0 z-[86] w-full max-w-[560px] overflow-y-auto bg-coal p-6 md:p-10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASE }}
            data-lenis-prevent
          >
            <div className="flex items-start justify-between">
              <h2 className="display text-6xl">Size guide</h2>
              <button onClick={onClose} className="-mr-2 p-2" aria-label="Close size guide" autoFocus><X className="h-5 w-5" strokeWidth={1.4} /></button>
            </div>
            <p className="mt-4 text-sm text-fog">Body measurements. If you are between sizes, size up for a relaxed fit or down for a closer fit.</p>
            <div className="mt-8"><SizeTable gender={gender} /></div>
            <div className="mt-8 space-y-3 text-sm text-fog">
              <p><span className="text-bone">Chest / bust</span> — measure around the fullest part, keeping the tape level.</p>
              <p><span className="text-bone">Waist</span> — measure around your natural waistline.</p>
              <p><span className="text-bone">Hip</span> — measure around the fullest part of your hips.</p>
            </div>
            <p className="mt-8 text-[11px] text-mute">Placeholder measurements — to be confirmed against final graded specifications.</p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
