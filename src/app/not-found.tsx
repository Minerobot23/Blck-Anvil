import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[70vh] flex-col items-start justify-center">
      <p className="eyebrow mb-6 text-mute">404</p>
      <h1 className="display text-[clamp(72px,12vw,200px)]">Not found.</h1>
      <p className="mt-6 text-sm text-fog">The page you were looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-10 flex gap-2">
        <Link href="/shop" className="flex h-12 items-center bg-bone px-8 text-xs tracking-[0.18em] text-ink uppercase">Shop all</Link>
        <Link href="/" className="flex h-12 items-center border border-white/20 px-8 text-xs tracking-[0.18em] uppercase">Home</Link>
      </div>
    </div>
  );
}
