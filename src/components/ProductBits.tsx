"use client";

import { motion } from "framer-motion";
import { COLORWAYS, stockFor, stockState, type ColorId, type Product } from "@/lib/products";
import { useCart, useUI } from "@/store/cart";

export function Swatches({
  colors,
  value,
  onChange,
  size = "sm",
  label = true,
}: {
  colors: ColorId[];
  value: ColorId;
  onChange: (c: ColorId) => void;
  size?: "sm" | "lg";
  label?: boolean;
}) {
  const dim = size === "lg" ? "h-8 w-8" : "h-3.5 w-3.5";
  return (
    <div role="radiogroup" aria-label="Colour" className={`flex flex-wrap items-center ${size === "lg" ? "gap-2.5" : "gap-1.5"}`}>
      {colors.map((c) => {
        const cw = COLORWAYS[c];
        const active = c === value;
        return (
          <button
            key={c}
            role="radio"
            aria-checked={active}
            aria-label={cw.name}
            title={cw.name}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(c);
            }}
            onMouseEnter={size === "sm" ? () => onChange(c) : undefined}
            className={`relative grid place-items-center rounded-full ${size === "lg" ? "p-[3px]" : "p-[2px]"}`}
          >
            {active && (
              <motion.span
                className="absolute inset-0 rounded-full border border-bone"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span
              className={`${dim} block rounded-full ring-1 ring-white/15 ${cw.washed ? "bg-[radial-gradient(circle_at_30%_30%,#4a4a48,#232322_70%)]" : ""}`}
              style={cw.washed ? undefined : { background: cw.hex }}
            />
          </button>
        );
      })}
      {label && size === "lg" && <span className="sr-only">Selected: {COLORWAYS[value].name}</span>}
    </div>
  );
}

export function SizePicker({
  product,
  color,
  value,
  onChange,
  dense = false,
}: {
  product: Product;
  color: ColorId;
  value: string | null;
  onChange: (s: string) => void;
  dense?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Size" className={`grid ${dense ? "grid-cols-6 gap-1" : "grid-cols-3 gap-1.5 sm:grid-cols-6"}`}>
      {product.sizes.map((s) => {
        const qty = stockFor(product.slug, color, s);
        const st = stockState(qty);
        const active = value === s;
        return (
          <button
            key={s}
            role="radio"
            aria-checked={active}
            disabled={st === "out"}
            aria-label={`${s}${st === "out" ? ", sold out" : st === "low" ? ", low stock" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(s);
            }}
            className={`relative flex items-center justify-center border text-xs tabular-nums transition-colors duration-300 ${dense ? "h-9" : "h-12"} ${
              active ? "border-bone bg-bone text-ink" : st === "out" ? "cursor-not-allowed border-white/[0.06] text-white/25" : "border-white/15 hover:border-bone"
            }`}
          >
            {s}
            {st === "out" && <span className="absolute inset-0 m-auto h-px w-[60%] rotate-[-24deg] bg-white/20" aria-hidden />}
            {st === "low" && !dense && <span className={`absolute top-1.5 right-1.5 h-1 w-1 rounded-full ${active ? "bg-ink" : "bg-fog"}`} aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}

export function useAddToBag() {
  const add = useCart((s) => s.add);
  const { setBag, pingAdded } = useUI();
  return (slug: string, color: ColorId, size: string, open = true) => {
    add({ slug, color, size });
    pingAdded();
    if (open) setBag(true);
  };
}
