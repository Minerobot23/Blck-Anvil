import { SplitHeading } from "./Motion";

export function PageHeader({ title, intro, eyebrow }: { title: string[]; intro?: string; eyebrow?: string }) {
  return (
    <header className="gutter pt-10 pb-12 md:pt-16 md:pb-16">
      {eyebrow && <p className="eyebrow mb-6 text-mute">{eyebrow}</p>}
      <SplitHeading lines={title} as="h1" className="display text-[clamp(64px,11vw,184px)]" animateOnMount />
      {intro && <p className="mt-6 max-w-xl text-sm leading-relaxed text-fog md:text-base">{intro}</p>}
    </header>
  );
}

export function DraftNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mb-12 border border-white/15 bg-char/60 px-5 py-4 text-xs leading-relaxed text-fog">
      <span className="eyebrow mr-2 text-[10px] text-bone">Draft</span>
      {children ?? "This page is a placeholder draft and must be reviewed by qualified counsel before launch. It is not legal advice and does not yet reflect BLK ANVL's actual practices."}
    </div>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl text-sm leading-relaxed text-fog [&_h2]:display [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:text-4xl [&_h2]:text-bone [&_li]:mt-2 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-bone [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-bone [&_a]:underline [&_a]:underline-offset-4">
      {children}
    </div>
  );
}
