"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { ProductImage } from "@/lib/products";
import { useLockScroll } from "@/hooks/useLockScroll";
import { useKeydown } from "@/hooks/useKeydown";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROLE_LABEL: Record<string, string> = {
  lifestyle: "On model",
  front: "Front",
  back: "Back",
  "logo-detail": "Logo",
  "label-detail": "Label",
  "fabric-detail": "Fabric",
  "fabric-detail-2": "Construction",
  detail: "Logo",
  texture: "Fabric",
};

const FEATHER = "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent)";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One gallery image. Portrait shots fill the frame; landscape product and
 * detail panels are shown whole on their own background colour and are never
 * enlarged beyond 1.25× their native size.
 */
function Frame({ img, sizes, priority = false, className = "", zoom }: { img: ProductImage; sizes: string; priority?: boolean; className?: string; zoom?: { scale: number; origin: string } }) {
  const [loaded, setLoaded] = useState(false);
  const contain = img.fit === "contain";
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: img.bg }}>
      {!loaded && <div className="skeleton absolute inset-0" style={{ background: img.bg }} aria-hidden />}
      <div
        className={contain ? "absolute inset-0 m-auto" : "absolute inset-0"}
        style={
          contain
            ? {
                maxWidth: `min(100%, ${Math.round(img.width * 1.25)}px)`,
                maxHeight: `min(100%, ${Math.round(img.height * 1.25)}px)`,
                aspectRatio: `${img.width} / ${img.height}`,
                // feather the edges so the photo's own backdrop melts into the letterbox colour
                maskImage: FEATHER,
                WebkitMaskImage: FEATHER,
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }
            : undefined
        }
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`${contain ? "object-contain" : "object-cover"} transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] ${loaded ? "opacity-100" : "opacity-0"}`}
          style={zoom ? { transform: `scale(${zoom.scale})`, transformOrigin: zoom.origin } : undefined}
        />
      </div>
    </div>
  );
}

export function Gallery({ images, colorName }: { images: ProductImage[]; colorName: string }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [viewer, setViewer] = useState<number | null>(null);
  const [hover, setHover] = useState<{ scale: number; origin: string }>({ scale: 1, origin: "50% 50%" });
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [embla, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", duration: reduce ? 0 : 24 });
  const thumbsRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (i: number) => {
      const n = images.length;
      const next = ((i % n) + n) % n;
      setDir(next > index || (index === n - 1 && next === 0) ? 1 : -1);
      setIndex(next);
      emblaApi?.scrollTo(next);
    },
    [images.length, index, emblaApi]
  );

  // colour change → back to the first image
  useEffect(() => {
    setIndex(0);
    emblaApi?.reInit();
    emblaApi?.scrollTo(0, true);
  }, [images, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // keep the active mobile thumbnail in view
  useEffect(() => {
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
  }, [index, reduce]);

  // keyboard arrows while the gallery is on screen and the viewer is closed
  const onScreen = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (onScreen.current = e.isIntersecting), { threshold: 0.3 });
    if (stageRef.current) io.observe(stageRef.current);
    return () => io.disconnect();
  }, []);
  useKeydown((e) => {
    const t = e.target as HTMLElement;
    if (!onScreen.current || t.closest("input, textarea, select, [role=dialog]")) return;
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  }, viewer === null);

  const current = images[Math.min(index, images.length - 1)];
  const isRender = images[0]?.kind === "render";

  return (
    <div>
      {/* ── Desktop: thumbnail rail + stage ── */}
      <div className="hidden gap-4 lg:flex">
        <div className="no-scrollbar flex max-h-[calc(100svh-8rem)] w-[72px] shrink-0 flex-col gap-2 overflow-y-auto" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${ROLE_LABEL[img.role] ?? "image"} (${i + 1} of ${images.length})`}
              onClick={() => go(i)}
              className="relative aspect-[4/5] w-full shrink-0 overflow-hidden"
            >
              <Frame img={{ ...img, fit: "cover" }} sizes="72px" className={`transition-opacity duration-300 ${i === index ? "opacity-100" : "opacity-45 hover:opacity-80"}`} />
              {i === index && <motion.span layoutId="thumb-active" className="absolute inset-0 border border-bone" transition={{ duration: reduce ? 0 : 0.4, ease: EASE }} />}
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            ref={stageRef}
            className="group relative mx-auto aspect-[4/5] cursor-zoom-in overflow-hidden"
            style={{ width: "min(100%, calc((100svh - 8rem) * 0.8))", background: current.bg }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setHover({ scale: 1.18, origin: `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%` });
            }}
            onMouseLeave={() => setHover({ scale: 1, origin: "50% 50%" })}
            onClick={() => setViewer(index)}
            role="button"
            tabIndex={0}
            aria-label={`Open full-screen viewer: ${current.alt}`}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setViewer(index))}
          >
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={current.src}
                className="absolute inset-0"
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: `${dir * 4}%` }}
                animate={{ opacity: 1, x: "0%" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: `${dir * -4}%` }}
                transition={{ duration: reduce ? 0.15 : 0.5, ease: EASE }}
              >
                <Frame img={current} sizes="(min-width:1280px) 50vw, 55vw" priority={index === 0} zoom={reduce ? undefined : hover} />
              </motion.div>
            </AnimatePresence>

            <div className={`pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[11px] tracking-[0.16em] uppercase transition-colors ${current.tone === "light" ? "text-ink/55" : "text-bone/80"}`}>
              <span>{ROLE_LABEL[current.role] ?? ""}</span>
              <span className="tabular-nums" aria-live="polite">{pad(index + 1)} / {pad(images.length)}</span>
            </div>
            <span className="pointer-events-none absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-bone opacity-0 backdrop-blur transition-opacity group-hover:opacity-100" aria-hidden>
              <Expand className="h-4 w-4" strokeWidth={1.4} />
            </span>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); go(index - 1); }} className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-bone opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100" aria-label="Previous image">
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.3} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); go(index + 1); }} className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-bone opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100" aria-label="Next image">
                  <ChevronRight className="h-5 w-5" strokeWidth={1.3} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile: swipeable carousel ── */}
      <div className="lg:hidden">
        <div className="relative">
          <div className="overflow-hidden touch-pan-y" ref={embla} aria-roledescription="carousel" aria-label="Product images">
            <div className="flex">
              {images.map((img, i) => (
                <div key={img.src} className="relative aspect-[4/5] min-w-0 shrink-0 grow-0 basis-full" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
                  <button className="absolute inset-0" onClick={() => setViewer(i)} aria-label={`Open full-screen viewer: ${img.alt}`}>
                    <Frame img={img} sizes="100vw" priority={i === 0} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <span className={`pointer-events-none absolute top-4 right-4 text-[11px] tabular-nums ${current.tone === "light" ? "text-ink/60" : "text-bone/90"}`} aria-live="polite">
            {pad(index + 1)} / {pad(images.length)}
          </span>
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5" aria-hidden>
            {images.map((img, i) => (
              <span key={img.src} className={`h-[3px] rounded-full transition-all duration-300 ${current.tone === "light" ? "bg-ink" : "bg-bone"} ${i === index ? "w-6 opacity-90" : "w-[3px] opacity-40"}`} />
            ))}
          </div>
        </div>
        <div ref={thumbsRef} className="no-scrollbar gutter mt-2 flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Image thumbnails">
          {images.map((img, i) => (
            <button key={img.src} role="tab" aria-selected={i === index} onClick={() => go(i)} className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden" aria-label={`Show ${ROLE_LABEL[img.role] ?? "image"}`}>
              <Frame img={{ ...img, fit: "cover" }} sizes="56px" className={i === index ? "" : "opacity-50"} />
              {i === index && <span className="absolute inset-0 border border-bone" />}
            </button>
          ))}
        </div>
      </div>

      <p className="gutter mt-3 text-[11px] text-mute lg:px-0 lg:pl-[88px]">
        {isRender ? `Photography for ${colorName} is pending — studio renders shown.` : `Shown in ${colorName}.`}
      </p>

      <Viewer images={images} index={viewer} onClose={() => setViewer(null)} onIndex={(i) => { setViewer(i); go(i); }} />
    </div>
  );
}

/* ───────────────────────── Full-screen viewer ───────────────────────── */

type T = { s: number; x: number; y: number };

function Viewer({ images, index, onClose, onIndex }: { images: ProductImage[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const reduce = useReducedMotion();
  const [t, setT] = useState<T>({ s: 1, x: 0, y: 0 });
  const [drag, setDrag] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startDist: number; startS: number; startT: T; start: { x: number; y: number }; moved: boolean; lastTap: number }>({ startDist: 0, startS: 1, startT: { s: 1, x: 0, y: 0 }, start: { x: 0, y: 0 }, moved: false, lastTap: 0 });
  useLockScroll(index !== null);

  useEffect(() => {
    setT({ s: 1, x: 0, y: 0 });
    setDrag(0);
  }, [index]);

  const n = images.length;
  const next = useCallback(() => index !== null && onIndex((index + 1) % n), [index, n, onIndex]);
  const prev = useCallback(() => index !== null && onIndex((index - 1 + n) % n), [index, n, onIndex]);

  useKeydown((e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }, index !== null);

  const clamp = (v: T): T => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return v;
    const s = Math.min(4, Math.max(1, v.s));
    const mxX = ((s - 1) * r.width) / 2, mxY = ((s - 1) * r.height) / 2;
    return { s, x: Math.max(-mxX, Math.min(mxX, v.x)), y: Math.max(-mxY, Math.min(mxY, v.y)) };
  };
  /** zoom to scale s keeping screen point (px,py) fixed */
  const zoomAt = (s: number, px: number, py: number) => {
    const r = stage.current!.getBoundingClientRect();
    const cx = px - (r.left + r.width / 2), cy = py - (r.top + r.height / 2);
    setT(clamp({ s, x: cx * (1 - s), y: cy * (1 - s) }));
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    g.start = { x: e.clientX, y: e.clientY };
    g.startT = t;
    g.moved = false;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      g.startS = t.s;
    }
  };
  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) {
      // desktop: when zoomed, the image follows the cursor
      if (e.pointerType === "mouse" && t.s > 1) {
        const r = stage.current!.getBoundingClientRect();
        setT(clamp({ s: t.s, x: (r.left + r.width / 2 - e.clientX) * (t.s - 1), y: (r.top + r.height / 2 - e.clientY) * (t.s - 1) }));
      }
      return;
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    const dx = e.clientX - g.start.x, dy = e.clientY - g.start.y;
    if (Math.hypot(dx, dy) > 6) g.moved = true;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const s = (g.startS * d) / (g.startDist || d);
      const r = stage.current!.getBoundingClientRect();
      const mid = { x: (a.x + b.x) / 2 - (r.left + r.width / 2), y: (a.y + b.y) / 2 - (r.top + r.height / 2) };
      const k = s / g.startT.s;
      setT(clamp({ s, x: mid.x - (mid.x - g.startT.x) * k, y: mid.y - (mid.y - g.startT.y) * k }));
    } else if (t.s > 1) {
      setT(clamp({ s: t.s, x: g.startT.x + dx, y: g.startT.y + dy }));
    } else if (Math.abs(dx) > Math.abs(dy)) {
      setDrag(dx);
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    const wasPinch = pointers.current.size === 2;
    pointers.current.delete(e.pointerId);
    if (wasPinch) {
      g.start = pointers.current.size ? { ...[...pointers.current.values()][0] } : g.start;
      g.startT = t;
      return;
    }
    if (pointers.current.size) return;
    if (t.s === 1 && Math.abs(drag) > 60) {
      if (drag < 0) next();
      else prev();
      setDrag(0);
      return;
    }
    setDrag(0);
    if (g.moved) return;
    // tap / click: mouse click toggles zoom; touch needs a double tap
    const now = Date.now();
    if (e.pointerType === "mouse" || now - g.lastTap < 300) {
      if (t.s > 1) setT({ s: 1, x: 0, y: 0 });
      else zoomAt(e.pointerType === "mouse" ? 2.2 : 2.5, e.clientX, e.clientY);
      g.lastTap = 0;
    } else g.lastTap = now;
  };

  const img = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {img && index !== null && (
        <motion.div
          className="fixed inset-0 z-[95] flex flex-col"
          style={{ background: img.bg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.1 : 0.35, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onKeyDown={(e) => {
            if (e.key === "Escape") { e.stopPropagation(); onClose(); }
          }}
        >
          <div className="flex shrink-0 items-center justify-between p-4 text-bone">
            <span className="text-xs tabular-nums" aria-live="polite">{pad(index + 1)} / {pad(n)} · {ROLE_LABEL[img.role] ?? ""}</span>
            <button onClick={onClose} className="-mr-2 p-2" aria-label="Close viewer" autoFocus><X className="h-6 w-6" strokeWidth={1.3} /></button>
          </div>

          <div
            ref={stage}
            className={`relative min-h-0 flex-1 touch-none select-none overflow-hidden ${t.s > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={img.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.1 : 0.35, ease: EASE }}
              >
                <div
                  className="absolute inset-0 m-auto"
                  style={{
                    aspectRatio: `${img.width} / ${img.height}`,
                    maxWidth: `min(100%, ${img.width * 1.5}px)`,
                    maxHeight: `min(100%, ${img.height * 1.5}px)`,
                    transform: `translate3d(${t.x + drag}px, ${t.y}px, 0) scale(${t.s})`,
                    transition: pointers.current.size ? "none" : "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <Image src={img.src} alt={img.alt} fill sizes="100vw" quality={90} className="pointer-events-none object-contain" draggable={false} />
                </div>
              </motion.div>
            </AnimatePresence>
            {n > 1 && (
              <>
                <button onPointerDown={(e) => e.stopPropagation()} onClick={prev} className="absolute top-1/2 left-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-bone backdrop-blur md:flex" aria-label="Previous image"><ChevronLeft className="h-5 w-5" strokeWidth={1.3} /></button>
                <button onPointerDown={(e) => e.stopPropagation()} onClick={next} className="absolute top-1/2 right-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-bone backdrop-blur md:flex" aria-label="Next image"><ChevronRight className="h-5 w-5" strokeWidth={1.3} /></button>
              </>
            )}
          </div>

          <div className="no-scrollbar flex shrink-0 justify-center gap-1.5 overflow-x-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {images.map((im, i) => (
              <button key={im.src} onClick={() => onIndex(i)} className={`relative aspect-[4/5] w-11 shrink-0 overflow-hidden transition-opacity ${i === index ? "opacity-100" : "opacity-40 hover:opacity-80"}`} aria-label={`Show image ${i + 1}`} aria-current={i === index}>
                <Image src={im.src} alt="" fill sizes="44px" className="object-cover" />
                {i === index && <span className="absolute inset-0 border border-bone" />}
              </button>
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-[72px] left-1/2 -translate-x-1/2 text-[10px] tracking-[0.18em] whitespace-nowrap text-bone/50 uppercase">
            {t.s > 1 ? "Drag to pan · tap twice to reset" : "Pinch, double-tap or click to zoom"}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
