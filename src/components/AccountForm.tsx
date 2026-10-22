"use client";

import { useState } from "react";

export function AccountForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [note, setNote] = useState(false);
  return (
    <div className="max-w-md">
      <div className="mb-8 flex gap-6 border-b border-white/10" role="tablist">
        {(["in", "up"] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`-mb-px border-b pb-3 text-xs tracking-[0.16em] uppercase transition-colors ${mode === m ? "border-bone text-bone" : "border-transparent text-mute"}`}>
            {m === "in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setNote(true); }}>
        {mode === "up" && (
          <label className="block"><span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Name</span><input required autoComplete="name" className="h-12 w-full border border-white/15 bg-transparent px-4 text-sm focus:border-bone focus:outline-none" /></label>
        )}
        <label className="block"><span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Email</span><input type="email" required autoComplete="email" className="h-12 w-full border border-white/15 bg-transparent px-4 text-sm focus:border-bone focus:outline-none" /></label>
        <label className="block"><span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Password</span><input type="password" required autoComplete={mode === "in" ? "current-password" : "new-password"} className="h-12 w-full border border-white/15 bg-transparent px-4 text-sm focus:border-bone focus:outline-none" /></label>
        <button className="h-14 w-full bg-bone text-xs tracking-[0.2em] text-ink uppercase">{mode === "in" ? "Sign in" : "Create account"}</button>
      </form>
      <p className="mt-5 min-h-10 text-xs leading-relaxed text-mute" aria-live="polite">
        {note && "Customer accounts are not connected in this preview. Accounts will be provided by the commerce platform (e.g. Shopify Customer Accounts) at launch. Nothing was submitted."}
      </p>
    </div>
  );
}
