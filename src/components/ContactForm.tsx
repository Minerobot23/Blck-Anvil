"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const field = "h-12 w-full border border-white/15 bg-transparent px-4 text-sm focus:border-bone focus:outline-none";
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Name</span><input required autoComplete="name" className={field} /></label>
        <label className="block"><span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Email</span><input type="email" required autoComplete="email" className={field} /></label>
      </div>
      <label className="block"><span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Order number (optional)</span><input className={field} /></label>
      <label className="block">
        <span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Topic</span>
        <select className={`${field} appearance-none [&>option]:bg-coal`} defaultValue="order">
          <option value="order">Order status</option><option value="sizing">Sizing &amp; fit</option><option value="returns">Returns &amp; exchanges</option><option value="product">Product question</option><option value="other">Something else</option>
        </select>
      </label>
      <label className="block"><span className="mb-2 block text-[11px] tracking-[0.12em] text-mute uppercase">Message</span><textarea required rows={6} className="w-full border border-white/15 bg-transparent p-4 text-sm focus:border-bone focus:outline-none" /></label>
      <button className="h-14 w-full bg-bone text-xs tracking-[0.2em] text-ink uppercase sm:w-auto sm:px-12">Send message</button>
      <p className="min-h-5 text-xs text-mute" aria-live="polite">{sent && "The contact form is not connected to a helpdesk yet in this preview — nothing was sent."}</p>
    </form>
  );
}
