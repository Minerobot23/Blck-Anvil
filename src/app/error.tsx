"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="gutter flex min-h-[70vh] flex-col items-start justify-center">
      <h1 className="display text-[clamp(64px,10vw,160px)]">Something broke.</h1>
      <p className="mt-6 text-sm text-fog">An unexpected error occurred. Please try again.</p>
      <button onClick={reset} className="mt-10 h-12 bg-bone px-8 text-xs tracking-[0.18em] text-ink uppercase">Try again</button>
    </div>
  );
}
