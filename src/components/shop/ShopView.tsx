"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { ProductCard } from "../ProductCard";
import { ALL_COLORS, PRODUCTS, SIZE_ORDER, isInStock, searchProducts, stockFor, type Category, type CollectionId, type ColorId, type Gender, type Product } from "@/lib/products";
import { useLockScroll } from "@/hooks/useLockScroll";
import { SplitHeading } from "../Motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export type Preset = { gender?: Gender; collection?: CollectionId; newOnly?: boolean };

const PRICE_BUCKETS = [
  { id: "u40", label: "Under $40", test: (p: number) => p < 40 },
  { id: "40-70", label: "$40 – $70", test: (p: number) => p >= 40 && p <= 70 },
  { id: "70+", label: "Over $70", test: (p: number) => p > 70 },
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function ShopView({ title, intro, preset = {} }: { title: string[]; intro?: string; preset?: Preset }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  useLockScroll(drawer);

  const base = useMemo(() => {
    let b = PRODUCTS;
    if (preset.gender) b = b.filter((p) => p.gender === preset.gender);
    if (preset.collection) b = b.filter((p) => p.collections.includes(preset.collection!));
    if (preset.newOnly) b = b.filter((p) => p.isNew || p.releasedAt >= "2026-09-01");
    return b;
  }, [preset.gender, preset.collection, preset.newOnly]);

  const f = {
    q: params.get("q") ?? "",
    gender: list(params.get("gender")) as Gender[],
    category: list(params.get("category")) as Category[],
    size: list(params.get("size")),
    color: list(params.get("color")) as ColorId[],
    price: list(params.get("price")),
    avail: params.get("avail") === "in",
    sort: params.get("sort") ?? (preset.newOnly ? "newest" : "featured"),
  };

  const setParam = (key: string, value: string[] | string | null) => {
    const next = new URLSearchParams(params.toString());
    const v = Array.isArray(value) ? value.join(",") : value;
    if (v) next.set(key, v);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const toggle = (key: string, current: string[], v: string) => setParam(key, current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
  const clearAll = () => router.replace(pathname, { scroll: false });

  const results = useMemo(() => {
    let r: Product[] = f.q ? searchProducts(f.q).filter((p) => base.includes(p)) : base;
    if (f.gender.length) r = r.filter((p) => f.gender.includes(p.gender));
    if (f.category.length) r = r.filter((p) => f.category.includes(p.category));
    if (f.color.length) r = r.filter((p) => p.colors.some((c) => f.color.includes(c)));
    if (f.size.length) r = r.filter((p) => p.colors.some((c) => (f.color.length ? f.color.includes(c) : true) && f.size.some((s) => p.sizes.includes(s) && (!f.avail || stockFor(p.slug, c, s) > 0))));
    if (f.price.length) r = r.filter((p) => PRICE_BUCKETS.some((b) => f.price.includes(b.id) && b.test(p.price)));
    if (f.avail) r = r.filter((p) => isInStock(p));
    const sorted = [...r];
    if (f.sort === "newest") sorted.sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
    if (f.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (f.sort === "featured") sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, params]);

  const facets = useMemo(() => {
    const cats = Array.from(new Set(base.map((p) => p.category)));
    const sizes = SIZE_ORDER.filter((s) => base.some((p) => p.sizes.includes(s)));
    const colors = ALL_COLORS.filter((c) => base.some((p) => p.colors.includes(c.id)));
    return { cats, sizes, colors };
  }, [base]);

  const chips: { label: string; remove: () => void }[] = [
    ...(f.q ? [{ label: `“${f.q}”`, remove: () => setParam("q", null) }] : []),
    ...f.gender.map((g) => ({ label: g === "men" ? "Men" : "Women", remove: () => toggle("gender", f.gender, g) })),
    ...f.category.map((c) => ({ label: c, remove: () => toggle("category", f.category, c) })),
    ...f.size.map((s) => ({ label: `Size ${s}`, remove: () => toggle("size", f.size, s) })),
    ...f.color.map((c) => ({ label: ALL_COLORS.find((x) => x.id === c)?.name ?? c, remove: () => toggle("color", f.color, c) })),
    ...f.price.map((p) => ({ label: PRICE_BUCKETS.find((b) => b.id === p)?.label ?? p, remove: () => toggle("price", f.price, p) })),
    ...(f.avail ? [{ label: "In stock", remove: () => setParam("avail", null) }] : []),
  ];

  const filters = (
    <div className="space-y-1">
      {!preset.gender && (
        <FilterGroup title="Gender" count={f.gender.length}>
          {(["men", "women"] as Gender[]).map((g) => (
            <CheckRow key={g} label={g === "men" ? "Men" : "Women"} checked={f.gender.includes(g)} onChange={() => toggle("gender", f.gender, g)} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Category" count={f.category.length} defaultOpen>
        {facets.cats.map((c) => (
          <CheckRow key={c} label={c} checked={f.category.includes(c)} onChange={() => toggle("category", f.category, c)} count={base.filter((p) => p.category === c).length} />
        ))}
      </FilterGroup>
      <FilterGroup title="Size" count={f.size.length} defaultOpen>
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {facets.sizes.map((s) => (
            <button key={s} onClick={() => toggle("size", f.size, s)} aria-pressed={f.size.includes(s)} className={`h-10 border text-xs transition-colors ${f.size.includes(s) ? "border-bone bg-bone text-ink" : "border-white/15 hover:border-bone"}`}>
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Colour" count={f.color.length} defaultOpen>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 pt-1">
          {facets.colors.map((c) => (
            <button key={c.id} onClick={() => toggle("color", f.color, c.id)} aria-pressed={f.color.includes(c.id)} className="flex items-center gap-2.5 text-left text-sm">
              <span className={`relative h-5 w-5 rounded-full ring-1 transition ${f.color.includes(c.id) ? "ring-bone ring-offset-2 ring-offset-ink" : "ring-white/20"}`} style={{ background: c.washed ? "radial-gradient(circle at 30% 30%,#4a4a48,#232322 70%)" : c.hex }} />
              <span className={f.color.includes(c.id) ? "text-bone" : "text-fog"}>{c.name}</span>
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price" count={f.price.length}>
        {PRICE_BUCKETS.map((b) => (
          <CheckRow key={b.id} label={b.label} checked={f.price.includes(b.id)} onChange={() => toggle("price", f.price, b.id)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Availability" count={f.avail ? 1 : 0}>
        <CheckRow label="In stock only" checked={f.avail} onChange={() => setParam("avail", f.avail ? null : "in")} />
      </FilterGroup>
    </div>
  );

  return (
    <div className="pb-24">
      <header className="gutter pt-10 pb-10 md:pt-16 md:pb-14">
        <SplitHeading lines={title} as="h1" className="display text-[clamp(72px,12vw,200px)]" animateOnMount />
        {intro && <p className="mt-6 max-w-md text-sm leading-relaxed text-fog">{intro}</p>}
      </header>

      <div className="sticky top-16 z-30 border-y border-white/[0.06] bg-ink/90 backdrop-blur-xl">
        <div className="gutter flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <button onClick={() => setDrawer(true)} className="flex items-center gap-2 text-xs tracking-[0.16em] uppercase lg:hidden">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} /> Filter {chips.length > 0 && <span className="text-mute">({chips.length})</span>}
            </button>
            <button onClick={() => setSidebar((s) => !s)} className="hidden items-center gap-2 text-xs tracking-[0.16em] uppercase lg:flex" aria-expanded={sidebar}>
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} /> {sidebar ? "Hide filters" : "Show filters"}
            </button>
            <span className="text-xs text-mute tabular-nums" aria-live="polite">{results.length} {results.length === 1 ? "product" : "products"}</span>
          </div>
          <label className="relative flex items-center gap-2 text-xs">
            <span className="hidden text-mute sm:inline">Sort</span>
            <select value={f.sort} onChange={(e) => setParam("sort", e.target.value === "featured" ? null : e.target.value)} className="cursor-pointer appearance-none bg-transparent py-2 pr-6 text-xs tracking-[0.08em] uppercase focus:outline-none [&>option]:bg-coal" aria-label="Sort products">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5" />
          </label>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {chips.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
            <div className="gutter flex flex-wrap items-center gap-2 pt-5">
              {chips.map((c) => (
                <button key={c.label} onClick={c.remove} className="group flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs transition-colors hover:border-bone">
                  {c.label} <X className="h-3 w-3 text-mute group-hover:text-bone" />
                </button>
              ))}
              <button onClick={clearAll} className="link-underline ml-2 text-xs text-mute hover:text-bone">Clear all</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="gutter flex gap-10 pt-8">
        <AnimatePresence initial={false}>
          {sidebar && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="hidden shrink-0 overflow-clip lg:block"
              aria-label="Filters"
            >
              <div className="sticky top-36 w-[260px] pr-2">{filters}</div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          {results.length ? (
            <motion.ul layout className={`grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-4 md:gap-y-14 ${sidebar ? "xl:grid-cols-3 2xl:grid-cols-4" : "xl:grid-cols-4"}`}>
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((p, i) => (
                  <motion.li key={p.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.03, ease: EASE }}>
                    <ProductCard product={p} priority={i < 4} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <div className="flex min-h-[40vh] flex-col items-start justify-center">
              <p className="display text-6xl">No matches.</p>
              <p className="mt-4 max-w-sm text-sm text-mute">Nothing fits that combination right now. Try removing a filter.</p>
              <button onClick={clearAll} className="mt-8 h-12 bg-bone px-8 text-xs tracking-[0.18em] text-ink uppercase">Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} aria-hidden />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[88svh] flex-col bg-coal lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.55, ease: EASE }}
              data-lenis-prevent
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
                <p className="eyebrow">Filter</p>
                <button onClick={() => setDrawer(false)} className="-mr-2 p-2" aria-label="Close filters"><X className="h-5 w-5" strokeWidth={1.4} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">{filters}</div>
              <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/[0.07] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button onClick={clearAll} className="h-12 border border-white/20 text-xs tracking-[0.16em] uppercase">Clear</button>
                <button onClick={() => setDrawer(false)} className="h-12 bg-bone text-xs tracking-[0.16em] text-ink uppercase">Show {results.length}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, count, children, defaultOpen = false }: { title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen || count > 0);
  useEffect(() => {
    if (count > 0) setOpen(true);
  }, [count]);
  return (
    <div className="border-b border-white/[0.07]">
      <button className="flex w-full items-center justify-between py-4 text-left text-xs tracking-[0.16em] uppercase" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>
          {title} {count > 0 && <span className="text-mute">({count})</span>}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: EASE }}>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
            <div className="space-y-2.5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <button role="checkbox" aria-checked={checked} onClick={onChange} className="flex w-full items-center gap-3 text-left text-sm">
      <span className={`flex h-4 w-4 items-center justify-center border transition-colors ${checked ? "border-bone bg-bone" : "border-white/25"}`}>
        {checked && <Check className="h-3 w-3 text-ink" strokeWidth={2.5} />}
      </span>
      <span className={checked ? "text-bone" : "text-fog"}>{label}</span>
      {count !== undefined && <span className="ml-auto text-xs text-mute tabular-nums">{count}</span>}
    </button>
  );
}
