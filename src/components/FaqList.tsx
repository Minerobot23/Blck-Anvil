"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t border-white/10">
      {items.map((f, i) => (
        <li key={f.q} className="border-b border-white/10">
          <button className="flex w-full items-center justify-between gap-6 py-6 text-left" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span className="text-base md:text-lg">{f.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}><Plus className="h-5 w-5" strokeWidth={1.2} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-fog">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}
