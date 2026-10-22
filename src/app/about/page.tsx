import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/Page";
import { Reveal, ImageReveal } from "@/components/Motion";
import { Monogram } from "@/components/Logo";

export const metadata: Metadata = { title: "About", description: "BLK ANVL makes training apparel and everyday essentials with restraint." };

export default function Page() {
  return (
    <div className="pb-28">
      <PageHeader eyebrow="About BLK ANVL" title={["Less,", "but heavier."]} />
      <ImageReveal className="relative mx-2 aspect-[16/10] overflow-hidden md:aspect-[21/9]">
        <Image src="/campaign/rack.webp" alt="Rows of dumbbells in a monochrome training space" fill sizes="100vw" className="object-cover" priority />
      </ImageReveal>
      <div className="gutter mt-20 grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4"><Monogram className="h-16 w-auto text-fog" /></Reveal>
        <div className="space-y-6 text-base leading-relaxed text-fog md:col-span-7 md:col-start-6 md:text-lg">
          <Reveal><p className="text-bone">BLK ANVL makes training apparel and everyday essentials in a narrow, deliberate palette.</p></Reveal>
          <Reveal delay={0.05}><p>We start with the garment — weight, cut, construction — and add as little as possible after that. Branding is tonal and small. Colour stays close to black. The pieces are designed to be worn to train and then simply kept on.</p></Reveal>
          <Reveal delay={0.1}><p>Every collection is built around a short list of essentials that work together, so getting dressed takes no thought and the clothes last more than a season.</p></Reveal>
          <Reveal delay={0.15}><p className="text-sm text-mute">Placeholder brand copy — to be refined with the founding team.</p></Reveal>
        </div>
      </div>
      <div className="gutter mt-24 grid gap-2 md:grid-cols-3">
        {[
          { src: "/photo/detail-monogram.webp", t: "Tonal embroidery" },
          { src: "/photo/detail-shoulder.webp", t: "Dropped shoulder" },
          { src: "/photo/detail-label.webp", t: "Woven label" },
        ].map((x, i) => (
          <Reveal key={x.t} delay={i * 0.08}>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden bg-ink"><Image src={x.src} alt={x.t} fill sizes="33vw" className="object-cover" /></div>
              <figcaption className="mt-3 text-xs text-mute">{x.t}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <div className="gutter mt-20"><Link href="/collections/the-uniform" className="link-underline text-xs tracking-[0.18em] uppercase">Shop The Uniform</Link></div>
    </div>
  );
}
