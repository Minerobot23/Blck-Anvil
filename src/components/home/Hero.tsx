"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const LINES = ["Form", "Follows", "Function."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink" aria-label="BLK ANVL — Form follows function">
      {/* Photograph */}
      <motion.div
        className="absolute inset-0 lg:left-[40%]"
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
          <motion.div className="absolute inset-0" initial={reduce ? false : { scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE, delay: 0.1 }}>
            <Image
              src="/campaign/pullup.webp"
              alt="Athlete mid pull-up in a dark training space, photographed from behind"
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover object-[50%_22%]"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40 lg:bg-gradient-to-r lg:from-ink lg:via-ink/10 lg:to-transparent" />
        <div className="grain absolute inset-0" />
      </motion.div>

      {/* Editorial meta */}
      <motion.div
        className="gutter absolute inset-x-0 top-[118px] hidden justify-between text-[10px] tracking-[0.24em] text-mute uppercase lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span>AW26 — Collection 01</span>
        <span className="mr-[2%]">Training / Everyday</span>
      </motion.div>

      {/* Headline */}
      <motion.div className="gutter relative z-10 flex h-full flex-col justify-end pb-24 lg:justify-center lg:pb-0" style={{ y: textY, opacity: fade }}>
        <h1 className="display text-[clamp(84px,17vw,270px)] text-bone lg:text-[clamp(120px,13.5vw,270px)]" aria-label="Form follows function.">
          {LINES.map((l, i) => (
            <span key={l} className="block overflow-hidden" aria-hidden>
              <motion.span
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.3, delay: 0.55 + i * 0.1, ease: EASE }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-8 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between lg:mt-10 lg:max-w-[40%] lg:flex-col lg:items-start"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: EASE }}
        >
          <p className="max-w-xs text-[15px] leading-relaxed text-fog">Performance essentials. Refined.</p>
          <div className="flex gap-2">
            <HeroButton href="/men" label="Shop Men" primary />
            <HeroButton href="/women" label="Shop Women" />
          </div>
        </motion.div>
      </motion.div>

      {/* Featured product */}
      <motion.div
        className="absolute right-[3%] bottom-10 z-10 hidden lg:block"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4, ease: EASE }}
      >
        <Link href="/products/washed-heavyweight-hoodie" className="group flex items-center gap-4 bg-ink/70 p-2 pr-5 backdrop-blur-md transition-colors hover:bg-ink/90">
          <span className="relative block h-[84px] w-[68px] overflow-hidden bg-ink">
            <Image src="/photo/hoodie-front.webp" alt="" fill sizes="68px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          </span>
          <span className="block">
            <span className="eyebrow block text-[9px] text-mute">New — Heavyweight</span>
            <span className="mt-1.5 block text-sm">Washed Heavyweight Hoodie</span>
          </span>
          <ArrowUpRight className="ml-2 h-4 w-4 text-mute transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone" strokeWidth={1.4} />
        </Link>
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex lg:left-[40%]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} style={{ opacity: fade }}>
        <span className="eyebrow text-[9px] text-mute">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-bone" animate={reduce ? undefined : { y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: [0.76, 0, 0.24, 1] }} />
        </span>
      </motion.div>
    </section>
  );
}

function HeroButton({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex h-12 items-center overflow-hidden px-7 text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 ${
        primary ? "bg-bone text-ink" : "border border-white/30 text-bone hover:border-bone"
      }`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{label}</span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0" aria-hidden>
          {label}
        </span>
      </span>
    </Link>
  );
}

export { HeroButton };
