"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ColorId } from "@/lib/products";

export type CartLine = { key: string; slug: string; color: ColorId; size: string; qty: number };

type CartState = {
  lines: CartLine[];
  add: (l: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (l, qty = 1) =>
        set((s) => {
          const key = `${l.slug}|${l.color}|${l.size}`;
          const existing = s.lines.find((x) => x.key === key);
          if (existing) {
            return { lines: s.lines.map((x) => (x.key === key ? { ...x, qty: Math.min(MAX_QTY, x.qty + qty) } : x)) };
          }
          return { lines: [{ ...l, key, qty }, ...s.lines] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((x) => x.key !== key) : s.lines.map((x) => (x.key === key ? { ...x, qty: Math.min(MAX_QTY, qty) } : x)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((x) => x.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "blk-anvl-bag", storage: createJSONStorage(() => localStorage), version: 1 }
  )
);

type UIState = {
  bagOpen: boolean;
  searchOpen: boolean;
  quickView: string | null;
  lastAdded: number;
  setBag: (v: boolean) => void;
  setSearch: (v: boolean) => void;
  setQuickView: (slug: string | null) => void;
  pingAdded: () => void;
};

export const useUI = create<UIState>()((set) => ({
  bagOpen: false,
  searchOpen: false,
  quickView: null,
  lastAdded: 0,
  setBag: (bagOpen) => set({ bagOpen }),
  setSearch: (searchOpen) => set({ searchOpen }),
  setQuickView: (quickView) => set({ quickView }),
  pingAdded: () => set({ lastAdded: Date.now() }),
}));
