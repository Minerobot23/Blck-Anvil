"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "loading" | "msg" | "err"; text?: string }>({ kind: "idle" });
  return (
    <form
      className="mt-6 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        setState({ kind: "loading" });
        const res = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
        const data = await res.json().catch(() => ({}));
        if (res.status === 400) setState({ kind: "err", text: data.error });
        else setState({ kind: "msg", text: data.message ?? "Thanks." });
      }}
    >
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="flex items-center border-b border-white/20 focus-within:border-bone">
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="h-12 w-full bg-transparent text-sm placeholder:text-mute focus:outline-none"
          autoComplete="email"
        />
        <button type="submit" className="group flex h-12 items-center gap-2 pl-4 text-xs tracking-[0.18em] uppercase" disabled={state.kind === "loading"}>
          Join <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
      <p className={`mt-3 min-h-4 text-xs ${state.kind === "err" ? "text-red-300" : "text-mute"}`} aria-live="polite">
        {state.text}
      </p>
    </form>
  );
}
