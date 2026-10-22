"use client";
import { useEffect, useState, type RefObject } from "react";

/**
 * Sticky offset that keeps tall panels fully reachable: if the element is
 * taller than the viewport, it sticks by its bottom edge instead of its top.
 */
export function useSmartSticky(ref: RefObject<HTMLElement | null>, top = 112, bottomGap = 24) {
  const [offset, setOffset] = useState(top);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setOffset(Math.min(top, window.innerHeight - el.offsetHeight - bottomGap));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ref, top, bottomGap]);
  return offset;
}
