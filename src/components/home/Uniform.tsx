"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Panel =
  | { kind: "image"; src: string; alt: string; caption: string; href?: string; tone: "dark" | "light"; w: string; offset?: string }
  | { kind: "text" };

const PANELS: Panel[] = [
  { kind: "text" },
  { kind: "image", src: "/photo/hoodie-back.webp", alt: "Washed Heavyweight Hoodie, back, with BLK ANVL wordmark", caption: "01 — Washed Heavyweight Hoodie", href: "/products/washed-heavyweight-hoodie", tone: "dark", w: "md:w-[34vw]" },
  { kind: "image", src: "/campaign/rack.webp", alt: "Rows of dumbbells in a monochrome training space", caption: "Training floor", tone: "dark", w: "md:w-[52vw]", offset: "md:mt-[12vh]" },
  { kind: "image", src: "/products/essential-oversized-tee/obsidian-front.webp", alt: "Essential Oversized Tee in Obsidian", caption: "02 — Essential Oversized Tee", href: "/products/essential-oversized-tee", tone: "light", w: "md:w-[30vw]" },
  { kind: "image", src: "/products/sculpt-leggings/obsidian-front.webp", alt: "Sculpt Leggings in Obsidian", caption: "03 — Sculpt Leggings", href: "/products/sculpt-leggings", tone: "light", w: "md:w-[26vw]", offset: "md:mt-[18vh]" },
  { kind: "image", src: "/photo/detail-label.webp", alt: "Woven BLK ANVL neck label inside a washed black hoodie", caption: "Woven label, every piece", tone: "dark", w: "md:w-[40vw]" },
  { kind: "image", src: "/products/training-zip-jacket/obsidian-front.webp", alt: "Training Zip Jacket in Obsidian", caption: "04 — Training Zip Jacket", href: "/products/training-zip-jacket", tone: "light", w: "md:w-[30vw]", offset: "md:mt-[8vh]" },
];

export function Uniform() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      // inner image parallax
      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-ink md:h-[100svh]" aria-label="The Uniform">
      <div ref={track} className="no-scrollbar flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 py-20 will-change-transform md:snap-none md:gap-[3vw] md:overflow-visible md:px-[3vw] md:py-0">
        {PANELS.map((p, i) =>
          p.kind === "text" ? (
            <div key={i} className="flex w-[84vw] shrink-0 snap-start flex-col justify-center md:w-[38vw]">
              <p className="eyebrow mb-6 text-mute">Editorial — 01</p>
              <h2 className="display text-[clamp(80px,12vw,220px)]">The<br />Uniform</h2>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-fog">
                Eight pieces that cover the week — the session, the commute, the rest day. Tonal colour, quiet branding, nothing that needs explaining.
              </p>
              <Link href="/collections/the-uniform" className="link-underline mt-8 self-start text-xs tracking-[0.18em] uppercase">Shop the collection</Link>
            </div>
          ) : (
            <figure key={i} className={`w-[72vw] shrink-0 snap-start ${p.w} ${p.offset ?? ""}`}>
              <div className={`relative aspect-[4/5] overflow-hidden ${p.tone === "dark" ? "bg-char" : "bg-studio"} ${p.w.includes("52") || p.w.includes("40") ? "md:aspect-[5/4]" : ""}`}>
                <div data-parallax className="absolute -inset-x-[10%] inset-y-0">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width:768px) 52vw, 72vw" className="object-cover" />
                </div>
                {p.href && <Link href={p.href} className="absolute inset-0" aria-label={p.caption.replace(/^\d+ — /, "Shop ")} />}
              </div>
              <figcaption className="mt-3 flex justify-between text-xs text-mute">
                <span>{p.caption}</span>
                {p.href && <span className="text-bone">Shop</span>}
              </figcaption>
            </figure>
          )
        )}
        <div className="w-4 shrink-0 md:w-[6vw]" aria-hidden />
      </div>
    </section>
  );
}
