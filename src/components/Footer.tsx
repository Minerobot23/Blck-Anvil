import Link from "next/link";
import { Monogram, Wordmark } from "./Logo";
import { Newsletter } from "./Newsletter";

const COLS = [
  { title: "Shop", links: [["Men", "/men"], ["Women", "/women"], ["New Arrivals", "/new"], ["Collections", "/collections"], ["Shop All", "/shop"]] },
  { title: "Help", links: [["Size Guide", "/size-guide"], ["Shipping & Returns", "/shipping-returns"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Account", "/account"]] },
  { title: "Brand", links: [["About BLK ANVL", "/about"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"]] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink">
      <div className="gutter grid gap-14 pt-20 pb-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Monogram className="h-10 w-auto" />
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-mute">
            New releases, restocks and the occasional note from the studio. No noise.
          </p>
          <Newsletter />
        </div>
        <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7" aria-label="Footer">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="eyebrow mb-5 text-mute">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="link-underline text-sm text-fog transition-colors hover:text-bone">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="gutter pb-6">
        <Wordmark className="w-full text-white/[0.06]" stroke={9} />
      </div>
      <div className="gutter flex flex-col gap-3 border-t border-white/[0.06] py-6 text-[11px] text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} BLK ANVL. All rights reserved.</p>
        <p>Preview build — product data, prices and policies are placeholders pending review.</p>
      </div>
    </footer>
  );
}
