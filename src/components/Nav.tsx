"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, User, ShoppingBag, Menu, X, Plus, Minus } from "lucide-react";
import { Lockup, Monogram } from "./Logo";
import { useCart, useUI } from "@/store/cart";
import { useHydrated } from "@/hooks/useHydrated";
import { useLockScroll } from "@/hooks/useLockScroll";
import { CATEGORIES, COLLECTIONS, PRODUCTS, newArrivals, type CollectionId } from "@/lib/products";

type MenuKey = "men" | "women" | "collections";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const hydrated = useHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const { setBag, setSearch, lastAdded } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useLockScroll(mobile);

  const solid = !isHome || scrolled || menu !== null;

  const openMenu = (k: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    setMenu(k);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 140);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={scheduleClose}>
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 0 : 30, opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="overflow-hidden border-b border-white/5 bg-ink text-center text-[10px] tracking-[0.2em] text-mute uppercase"
        >
          <p className="flex h-[30px] items-center justify-center gap-2 px-4">
            <span className="inline-block h-1 w-1 rounded-full bg-fog" aria-hidden />
            Preview storefront — prices, stock &amp; checkout are placeholders
          </p>
        </motion.div>

        <div
          className={`relative transition-colors duration-500 ${solid ? "bg-ink/92 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent border-b border-transparent"}`}
        >
          <nav className="gutter mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center" aria-label="Primary">
            <div className="flex items-center gap-1">
              <button
                className="-ml-2 p-2 lg:hidden"
                onClick={() => setMobile(true)}
                aria-label="Open menu"
                aria-expanded={mobile}
              >
                <Menu className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <ul className="hidden items-center gap-7 lg:flex">
                {(["men", "women", "collections"] as MenuKey[]).map((k) => (
                  <li key={k} onMouseEnter={() => openMenu(k)}>
                    <Link
                      href={k === "collections" ? "/collections" : `/${k}`}
                      className={`eyebrow link-underline py-2 transition-colors ${menu && menu !== k ? "text-mute" : "text-bone"}`}
                      aria-haspopup="true"
                      aria-expanded={menu === k}
                      onFocus={() => openMenu(k)}
                    >
                      {k}
                    </Link>
                  </li>
                ))}
                <li onMouseEnter={scheduleClose}>
                  <Link href="/new" className={`eyebrow link-underline py-2 transition-colors ${menu ? "text-mute" : "text-bone"}`}>
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            <Link href="/" className="flex items-center justify-center" aria-label="BLK ANVL home" onMouseEnter={scheduleClose}>
              <span className="hidden sm:block"><Lockup /></span>
              <Monogram className="h-7 w-auto sm:hidden" />
            </Link>

            <div className="flex items-center justify-end gap-0.5 sm:gap-2" onMouseEnter={scheduleClose}>
              <button className="p-2" onClick={() => setSearch(true)} aria-label="Search">
                <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </button>
              <Link href="/account" className="hidden p-2 sm:block" aria-label="Account">
                <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </Link>
              <button className="relative -mr-2 flex items-center gap-1.5 p-2" onClick={() => setBag(true)} aria-label={`Bag, ${hydrated ? count : 0} items`}>
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
                <span className="relative inline-flex h-4 min-w-4 items-center justify-center overflow-hidden text-[11px] tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={`${hydrated ? count : 0}-${lastAdded}`}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      {hydrated ? count : 0}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {menu && (
              <motion.div
                key="mega"
                initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-x-0 top-full hidden border-b border-white/[0.06] bg-ink/97 backdrop-blur-xl lg:block"
                onMouseEnter={() => openMenu(menu)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={menu}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="gutter py-10"
                  >
                    {menu === "collections" ? <CollectionsMenu /> : <GenderMenu gender={menu} />}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 hidden bg-black/50 lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={scheduleClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
      {!isHome && <div className="h-[94px]" aria-hidden />}
    </>
  );
}

function GenderMenu({ gender }: { gender: "men" | "women" }) {
  const featured = newArrivals().filter((p) => p.gender === gender).slice(0, 2);
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-2">
        <p className="eyebrow mb-5 text-mute">Shop</p>
        <ul className="space-y-2.5">
          <li><Link className="link-underline text-sm" href={`/${gender}`}>All {gender === "men" ? "Men's" : "Women's"}</Link></li>
          <li><Link className="link-underline text-sm" href={`/new?gender=${gender}`}>New Arrivals</Link></li>
          <li><Link className="link-underline text-sm" href="/collections/the-uniform">The Uniform</Link></li>
          <li><Link className="link-underline text-sm" href="/size-guide">Size Guide</Link></li>
        </ul>
      </div>
      <div className="col-span-3">
        <p className="eyebrow mb-5 text-mute">Categories</p>
        <ul className="grid grid-cols-1 gap-y-1">
          {CATEGORIES[gender].map((c) => (
            <li key={c}>
              <Link href={`/${gender}?category=${encodeURIComponent(c)}`} className="display group flex items-baseline gap-3 text-[34px] text-bone/90 transition-colors hover:text-bone">
                <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">{c}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-7 grid grid-cols-2 gap-4">
        {featured.map((p) => {
          const img = p.images[p.colors[0]][0];
          return (
            <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
              <div className="relative aspect-[4/5] max-h-[340px] w-full overflow-hidden bg-studio">
                <Image src={img.src} alt={img.alt} fill sizes="30vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <span>{p.name}</span>
                <span className="text-mute">New</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CollectionsMenu() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {(Object.keys(COLLECTIONS) as CollectionId[]).map((id) => {
        const c = COLLECTIONS[id];
        const n = PRODUCTS.filter((p) => p.collections.includes(id)).length;
        return (
          <Link key={id} href={`/collections/${id}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden bg-char">
              <Image src={c.image} alt="" fill sizes="25vw" className="object-cover opacity-80 transition duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05] group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="display absolute bottom-4 left-4 text-4xl">{c.title}</span>
            </div>
            <p className="mt-3 text-xs text-mute">{n} pieces</p>
          </Link>
        );
      })}
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<"men" | "women" | null>(null);
  const items: { label: string; href: string; sub?: "men" | "women" }[] = [
    { label: "Men", href: "/men", sub: "men" },
    { label: "Women", href: "/women", sub: "women" },
    { label: "New Arrivals", href: "/new" },
    { label: "Collections", href: "/collections" },
    { label: "Shop All", href: "/shop" },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="gutter flex h-16 items-center justify-between border-b border-white/[0.06]">
            <Monogram className="h-7 w-auto" />
            <button onClick={onClose} className="-mr-2 p-2" aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
          <nav className="gutter flex-1 overflow-y-auto pt-8 pb-10">
            <ul>
              {items.map((it, i) => (
                <motion.li
                  key={it.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}
                  className="border-b border-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <Link href={it.href} className="display block py-4 text-[52px]" onClick={onClose}>
                      {it.label}
                    </Link>
                    {it.sub && (
                      <button
                        className="p-3"
                        onClick={() => setExpanded(expanded === it.sub ? null : it.sub!)}
                        aria-label={`${expanded === it.sub ? "Collapse" : "Expand"} ${it.label} categories`}
                        aria-expanded={expanded === it.sub}
                      >
                        {expanded === it.sub ? <Minus className="h-5 w-5" strokeWidth={1.2} /> : <Plus className="h-5 w-5" strokeWidth={1.2} />}
                      </button>
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {it.sub && expanded === it.sub && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="grid grid-cols-2 gap-y-3 overflow-hidden pb-5"
                      >
                        {CATEGORIES[it.sub].map((c) => (
                          <li key={c}>
                            <Link href={`/${it.sub}?category=${encodeURIComponent(c)}`} className="text-sm text-fog" onClick={onClose}>
                              {c}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-10 grid grid-cols-2 gap-y-4 text-sm text-fog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/account" onClick={onClose}>Account</Link>
              <Link href="/size-guide" onClick={onClose}>Size Guide</Link>
              <Link href="/shipping-returns" onClick={onClose}>Shipping &amp; Returns</Link>
              <Link href="/faq" onClick={onClose}>FAQ</Link>
              <Link href="/about" onClick={onClose}>About</Link>
              <Link href="/contact" onClick={onClose}>Contact</Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
