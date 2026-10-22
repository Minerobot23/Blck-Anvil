"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Monogram } from "../Logo";
import { Reveal, SplitHeading } from "../Motion";

const MarkScene = dynamic(() => import("./MarkScene"), { ssr: false, loading: () => null });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function TheMark() {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !webglAvailable()) return;
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setMount(true);
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const show3D = mount && !reduce;

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-[radial-gradient(ellipse_at_60%_40%,#1c1c1c_0%,#080808_65%)]" aria-label="The mark">
      <div className="gutter grid min-h-[90svh] items-center gap-10 py-24 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-5">
          <Reveal><p className="eyebrow mb-6 text-mute">The mark</p></Reveal>
          <SplitHeading lines={["Two blades.", "Nothing", "added."]} className="display text-[clamp(60px,7.5vw,132px)]" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-fog">
              Two angular blades that form the A in ANVL. On the garment the mark is embroidered tonal at the chest — never larger than it needs to be.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 hidden text-[10px] tracking-[0.2em] text-mute uppercase md:block">{show3D ? "Move your cursor to turn the mark" : " "}</p>
          </Reveal>
        </div>
        <div ref={ref} className="relative aspect-square w-full lg:col-span-7 lg:aspect-[7/6]">
          {show3D ? (
            <div className={`absolute inset-0 transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
              <MarkScene active={visible} />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Monogram className="h-1/2 w-auto text-fog" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
