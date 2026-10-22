"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useUI } from "@/store/cart";
import { formatPrice, searchProducts, COLORWAYS } from "@/lib/products";
import { useLockScroll } from "@/hooks/useLockScroll";

const EASE = [0.16, 1, 0.3, 1] as const;
const POPULAR = ["Hoodie", "Leggings", "Shorts", "Oversized tee", "Washed black", "Sports bra"];

export function SearchOverlay() {
  const { searchOpen, setSearch } = useUI();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useLockScroll(searchOpen);

  const results = useMemo(() => searchProducts(q).slice(0, 6), [q]);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      window.setTimeout(() => input.current?.focus(), 80);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearch(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearch]);

  useEffect(() => setActive(0), [q]);

  const go = (href: string) => {
    setSearch(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSearch(false)} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed inset-x-0 top-0 z-[91] max-h-[100svh] overflow-y-auto bg-coal"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            data-lenis-prevent
          >
            <div className="gutter mx-auto max-w-[1400px] pt-6 pb-10 md:pt-10">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (results[active] && q) go(`/products/${results[active].slug}`);
                  else if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`);
                }}
                className="flex items-center gap-4 border-b border-white/15 pb-4"
              >
                <Search className="h-5 w-5 shrink-0 text-mute" strokeWidth={1.4} />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  }}
                  placeholder="Search"
                  aria-label="Search products"
                  aria-controls="search-results"
                  aria-activedescendant={results[active] ? `sr-${results[active].slug}` : undefined}
                  className="display w-full bg-transparent text-5xl placeholder:text-white/20 focus:outline-none md:text-7xl"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="button" onClick={() => setSearch(false)} className="p-2" aria-label="Close search">
                  <X className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </form>

              {!q ? (
                <div className="mt-8">
                  <p className="eyebrow mb-4 text-mute">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((t) => (
                      <button key={t} onClick={() => setQ(t)} className="border border-white/15 px-4 py-2 text-xs transition-colors hover:border-bone">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length ? (
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="eyebrow text-mute">Products</p>
                    <button onClick={() => go(`/shop?q=${encodeURIComponent(q.trim())}`)} className="link-underline flex items-center gap-2 text-xs">
                      View all results <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <ul id="search-results" role="listbox" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {results.map((p, i) => {
                      const img = p.images[p.colors[0]][0];
                      return (
                        <motion.li
                          key={p.slug}
                          id={`sr-${p.slug}`}
                          role="option"
                          aria-selected={i === active}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.4, ease: EASE }}
                        >
                          <Link href={`/products/${p.slug}`} onClick={() => setSearch(false)} onMouseEnter={() => setActive(i)} className="group block">
                            <div className={`relative aspect-[4/5] overflow-hidden ${img.tone === "dark" ? "bg-ink" : "bg-studio"} ${i === active ? "ring-1 ring-bone" : ""}`}>
                              <Image src={img.src} alt={img.alt} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            <p className="mt-2 text-xs">{p.name}</p>
                            <p className="text-xs text-mute">
                              {p.gender === "men" ? "Men" : "Women"} · {formatPrice(p.price)} · {p.colors.map((c) => COLORWAYS[c].name).length} colours
                            </p>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="mt-8 text-sm text-mute">No results for “{q}”. Try “hoodie”, “leggings” or a colour like “bone”.</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
