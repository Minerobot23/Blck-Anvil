import { MONOGRAM_PATHS, MONOGRAM_VIEWBOX, WORDMARK_LETTERS, WORDMARK_STROKE, WORDMARK_VIEWBOX } from "@/lib/brand";

type Props = { className?: string; title?: string };

export function Monogram({ className, title = "BLK ANVL" }: Props) {
  return (
    <svg viewBox={MONOGRAM_VIEWBOX} className={className} role="img" aria-label={title} fill="currentColor">
      {MONOGRAM_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function Wordmark({ className, title = "BLK ANVL", stroke = WORDMARK_STROKE }: Props & { stroke?: number }) {
  return (
    <svg viewBox={WORDMARK_VIEWBOX} className={className} role="img" aria-label={title} fill="none" stroke="currentColor" strokeWidth={stroke} strokeMiterlimit={10}>
      {WORDMARK_LETTERS.map((l, i) => (
        <path key={i} d={l.d} transform={`translate(${l.x} 0)`} />
      ))}
    </svg>
  );
}

export function Lockup({ className }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`} aria-label="BLK ANVL">
      <Monogram className="h-6 w-auto" title="" />
      <Wordmark className="h-[11px] w-auto" title="" />
    </span>
  );
}
