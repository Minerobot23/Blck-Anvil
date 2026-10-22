"use client";
import { useEffect } from "react";

/** Locks page scroll (native + Lenis) while `locked` is true. */
export function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      html.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [locked]);
}
