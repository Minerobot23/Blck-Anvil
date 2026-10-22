"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { motion, useInView, animate, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

export function Everyday() {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const inView = useInView(box, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(80, 50, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: setPos });
    return () => c.stop();
  }, [inView, reduce]);

  const fromEvent = useCallback((clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section className="py-24 md:py-32" aria-label="Everyday and every session">
      <div className="gutter mb-10 grid gap-6 md:mb-14 md:grid-cols-2 md:items-end">
        <h2 className="display text-[clamp(56px,8vw,140px)]">
          Everyday<span className="text-mute"> /</span>
          <br />
          Every session
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-fog md:justify-self-end">
          The same pieces, two settings. Drag to move between the training floor and the rest of the day.
        </p>
      </div>
      <div
        ref={box}
        className="relative mx-4 aspect-[4/5] cursor-ew-resize touch-pan-y overflow-hidden bg-ink select-none md:mx-8 md:aspect-[16/8] xl:mx-12"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          fromEvent(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* Session */}
        <div className="absolute inset-0">
          <Image src="/campaign/deadlift.webp" alt="Athlete setting up a deadlift in a dark gym" fill sizes="100vw" className="object-cover object-[60%_50%]" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
          <span className="display absolute right-5 bottom-5 text-4xl md:right-8 md:bottom-8 md:text-6xl">Every session</span>
        </div>
        {/* Everyday */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="absolute inset-y-0 left-0 w-full md:w-1/2">
            <Image src="/photo/hoodie-back.webp" alt="Washed Heavyweight Hoodie, back, BLK ANVL wordmark" fill sizes="(min-width:768px) 50vw, 100vw" className="object-contain" />
          </div>
          <span className="display absolute bottom-5 left-5 text-4xl md:bottom-8 md:left-8 md:text-6xl">Everyday</span>
        </div>
        {/* Handle */}
        <div className="absolute inset-y-0 w-px bg-bone/70" style={{ left: `${pos}%` }}>
          <motion.button
            role="slider"
            aria-label="Compare everyday and session imagery"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 5));
              if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 5));
            }}
            className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-ink"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <MoveHorizontal className="h-5 w-5" strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>
      <div className="gutter mt-6 flex justify-between text-xs">
        <Link href="/collections/heavyweight" className="link-underline text-mute hover:text-bone">Shop Heavyweight</Link>
        <Link href="/collections/training" className="link-underline text-mute hover:text-bone">Shop Training</Link>
      </div>
    </section>
  );
}

export function GenderSplit() {
  const panels = [
    { label: "Men", href: "/men", img: "/campaign/pullup.webp", pos: "object-[50%_30%]", alt: "Athlete training on a pull-up bar" },
    { label: "Women", href: "/women", img: "/campaign/profile.webp", pos: "object-[50%_30%]", alt: "Athlete in profile between sets" },
  ];
  return (
    <section className="grid gap-2 px-2 md:grid-cols-2" aria-label="Shop by gender">
      {panels.map((p) => (
        <Link key={p.label} href={p.href} className="group relative block aspect-[4/5] overflow-hidden bg-char md:aspect-[4/5] lg:aspect-[5/6]">
          <Image src={p.img} alt={p.alt} fill sizes="(min-width:768px) 50vw, 100vw" className={`object-cover ${p.pos} transition-transform duration-[1.8s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-6 flex items-end justify-between md:inset-x-10 md:bottom-10">
            <span className="display text-[clamp(72px,10vw,180px)]">{p.label}</span>
            <span className="relative mb-4 overflow-hidden text-xs tracking-[0.2em] uppercase">
              <span className="block transition-transform duration-500 group-hover:-translate-y-full">Shop</span>
              <span className="absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0" aria-hidden>Shop</span>
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
