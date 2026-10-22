"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SplitHeading } from "../Motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const POINTS = [
  {
    id: "hood",
    x: 43,
    y: 14,
    title: "Double-layer hood",
    copy: "Two layers of fleece so the hood holds its shape instead of collapsing flat. A woven label sits at the back neck in place of a printed tag.",
    img: "/photo/detail-label.webp",
    alt: "Woven BLK ANVL label at the back neck",
  },
  {
    id: "mark",
    x: 69,
    y: 46,
    title: "Embroidered monogram",
    copy: "The mark is embroidered tonal at the chest and kept small — around the width of a thumb. It is the only branding on the front of the garment.",
    img: "/photo/detail-monogram.webp",
    alt: "Close-up of the embroidered BLK ANVL monogram",
  },
  {
    id: "shoulder",
    x: 15,
    y: 29,
    title: "Dropped shoulder",
    copy: "The shoulder seam sits low on the arm for a relaxed line and unrestricted overhead movement. Seams are twin-needle stitched.",
    img: "/photo/detail-shoulder.webp",
    alt: "Dropped shoulder seam with twin-needle stitching",
  },
  {
    id: "wash",
    x: 43,
    y: 74,
    title: "Garment washed",
    copy: "Each piece is washed after it is sewn, softening the fleece and giving every hoodie a slightly different, broken-in tone.",
    img: "/photo/detail-wordmark.webp",
    alt: "Washed fleece surface with the printed wordmark",
  },
];

export function Engineered() {
  const [active, setActive] = useState(POINTS[1].id);
  const point = POINTS.find((p) => p.id === active)!;

  return (
    <section className="gutter py-24 md:py-36" aria-label="Engineered for movement">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-24">
            <Reveal className="relative aspect-[4/5] overflow-hidden bg-ink">
              <Image src="/photo/hoodie-front.webp" alt="Washed Heavyweight Hoodie, front" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              {POINTS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  onMouseEnter={() => setActive(p.id)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-3"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  aria-label={`${p.title} — show detail`}
                  aria-pressed={active === p.id}
                >
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className={`absolute inset-0 rounded-full border transition-all duration-500 ${active === p.id ? "scale-100 border-bone" : "scale-75 border-white/40"}`} />
                    {active === p.id && <span className="absolute inset-0 animate-ping rounded-full border border-bone/40 [animation-duration:2.2s]" />}
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${active === p.id ? "bg-bone" : "bg-white/60"}`} />
                    <span className="sr-only">{i + 1}</span>
                  </span>
                </button>
              ))}
              <div className="absolute bottom-4 left-4 text-[10px] tracking-[0.2em] text-mute uppercase">Washed Heavyweight Hoodie — Washed Black</div>
            </Reveal>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5 lg:col-start-8">
          <Reveal><p className="eyebrow mb-6 text-mute">Construction</p></Reveal>
          <SplitHeading lines={["Engineered", "for movement"]} className="display text-[clamp(60px,7.5vw,128px)]" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-fog">
              Every decision on the garment has a reason. Explore the details on our heaviest piece.
            </p>
          </Reveal>

          <ul className="mt-12 border-t border-white/10">
            {POINTS.map((p, i) => {
              const open = p.id === active;
              return (
                <li key={p.id} className="border-b border-white/10">
                  <button className="flex w-full items-center gap-6 py-5 text-left" onClick={() => setActive(p.id)} aria-expanded={open}>
                    <span className="w-6 text-[11px] text-mute tabular-nums">0{i + 1}</span>
                    <span className={`display text-3xl transition-colors md:text-4xl ${open ? "text-bone" : "text-white/35 hover:text-white/70"}`}>{p.title}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease: EASE }} className="overflow-hidden">
                        <div className="grid gap-5 pb-7 pl-12 sm:grid-cols-[1fr_180px]">
                          <p className="text-sm leading-relaxed text-fog">{p.copy}</p>
                          <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                            <Image src={p.img} alt={p.alt} fill sizes="180px" className="object-cover" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
          <span className="sr-only" aria-live="polite">{point.title}</span>
          <Reveal className="mt-10">
            <Link href="/products/washed-heavyweight-hoodie" className="link-underline text-xs tracking-[0.18em] uppercase">Shop the hoodie</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
