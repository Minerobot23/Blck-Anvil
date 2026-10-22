"use client";
import { useEffect, useRef } from "react";

/**
 * Window keydown listener that is registered once while `active` and always
 * calls the latest handler. Re-registering on every render is unsafe: for real
 * key presses the browser runs microtasks between listeners, so a React
 * re-render triggered by an earlier listener would remove ours mid-dispatch.
 */
export function useKeydown(handler: (e: KeyboardEvent) => void, active = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => ref.current(e);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [active]);
}
