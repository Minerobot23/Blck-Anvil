# BLK ANVL — Storefront

Premium training and lifestyle apparel storefront. Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, GSAP ScrollTrigger, Lenis, React Three Fiber, Zustand.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploys to Vercel with no extra configuration. Optional env: `NEXT_PUBLIC_SITE_URL` (canonical URLs, sitemap, Open Graph).

## What's in here

| Area | Where |
| --- | --- |
| Logo geometry (single source of truth) | `src/lib/brand.ts` → `<Monogram/>`, `<Wordmark/>` in `src/components/Logo.tsx`, standalone SVGs in `public/brand/` (`node scripts/logo-svg.mjs`) |
| Product catalog (7 products) | `src/data/catalog.ts` |
| Derived data, inventory, search | `src/lib/products.ts` |
| Bag state (persisted) | `src/store/cart.ts` |
| Checkout boundary | `src/lib/commerce.ts`, `src/app/api/checkout/route.ts` |
| Homepage sections | `src/components/home/*` |
| Shop listing / filters / sort | `src/components/shop/ShopView.tsx` |
| Product page | `src/components/pdp/ProductView.tsx`, gallery + full-screen viewer in `src/components/pdp/Gallery.tsx` |

Routes: `/`, `/shop`, `/men`, `/women`, `/new`, `/collections`, `/collections/[slug]`, `/products/[slug]`, `/about`, `/size-guide`, `/contact`, `/faq`, `/shipping-returns`, `/privacy`, `/terms`, `/cart`, `/checkout`, `/account`, plus `sitemap.xml` and `robots.txt`.

## Imagery — what is real, rendered, or stock

See **`docs/ASSETS.md`** for the full manifest. In short:

- **Product photography** (`public/products/<slug>/<colour>/`) is split from the supplied BLK ANVL collages (`assets/collages/`) with `python3 scripts/split-collages.py`, which also writes `src/data/photo-manifest.json`. The catalogue contains exactly these seven products.
- **Brand photography** (`public/photo/`) is cropped from the original hoodie reference board and used in editorial sections.
- **Other colourways** use **studio renders** produced by the in-repo garment render engine (`scripts/garments.mjs`, `scripts/render-products.mjs`). Product pages say photography for that colour is pending.
- **Campaign mood images** (`public/campaign/`) are licensed Unsplash photographs, graded to monochrome. They show training environments and athletes, **not BLK ANVL product**, and are never used as product imagery. Replace with a BLK ANVL campaign shoot.

Re-render the catalog after changing products or colours:

```bash
node --experimental-strip-types scripts/render-products.mjs           # all (≈4 min)
node --experimental-strip-types scripts/render-products.mjs --only=hoodie
node --experimental-strip-types scripts/image-prompts.mjs             # refresh docs/IMAGE_PROMPTS.md
```

## Placeholders that must be replaced before launch

- **Prices and inventory** — illustrative (`src/data/catalog.ts`, `stockFor()` in `src/lib/products.ts`).
- **Fabric compositions / weights** — marked "placeholder — confirm with manufacturer".
- **Size chart** — `src/data/sizeGuide.ts`.
- **Shipping rates and returns policy** — `src/lib/commerce.ts`, `/shipping-returns`.
- **Privacy policy and terms** — drafts, clearly labelled; need legal review.
- **Contact details** — `/contact`.
- **Payments** — checkout runs in an explicitly labelled demo mode. Implement Shopify Storefront (`cartCreate` → `checkoutUrl`) or Stripe Checkout in `src/app/api/checkout/route.ts`; variants will need provider IDs.
- **Accounts, newsletter, contact form** — UI is complete; each states clearly that it is not yet connected.
- **Photography** — product, lifestyle and campaign shoots. Prompts and shot lists per product: `docs/IMAGE_PROMPTS.md`.

## Accessibility & performance notes

- Reduced motion: Lenis, parallax, pinned scroll, split-text and 3D are disabled; content renders statically.
- Touch devices use native scrolling; product cards become swipeable mini-galleries.
- The 3D mark loads lazily (dynamic import, IntersectionObserver), pauses off-screen and falls back to SVG without WebGL.
- Product pages are statically generated with `ProductGroup` structured data; FAQ has `FAQPage` data.
- All dialogs (bag, search, quick view, size guide, zoom, menus) close on Escape and lock background scroll.
