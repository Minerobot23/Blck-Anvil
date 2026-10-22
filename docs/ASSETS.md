# Asset manifest

## Brand

| File | Source | Status |
| --- | --- | --- |
| `public/brand/monogram-*.svg`, `wordmark-*.svg`, `lockup-light.svg` | Vector trace of the supplied logo reference (`src/lib/brand.ts`) | Final candidate — have the designer confirm curves and letter spacing against the master artwork |
| `src/app/icon.svg` | Monogram | Final candidate |
| `public/og.jpg` | Composite of lockup + hoodie back photo | Replace with a designed social card if desired |

## Brand photography — `public/photo/` (BLK ANVL, supplied)

Cropped and upscaled 2× from the supplied reference board (1536×1024). Fine for web at current sizes; **replace with full-resolution originals** for sharper zoom.

`hoodie-front`, `hoodie-back`, `detail-monogram`, `detail-wordmark`, `detail-label`, `detail-shoulder`, `lockup`.

## Product renders — `public/products/<slug>/<colour>-<shot>.webp`

208 images (16 products × their colourways × 4 shots: front, back, logo detail, fabric/construction detail). Produced by `scripts/garments.mjs`. They are illustrations of the intended product, consistent across the catalogue, with branding placed per `docs/IMAGE_PROMPTS.md`. **Replace with product photography**; same filenames are picked up automatically.

Missing per product (needs photography or generation): **lifestyle/model view** and **alternate on-body angle**. Prompts are in `docs/IMAGE_PROMPTS.md`.

## Campaign mood — `public/campaign/` (Unsplash License, graded monochrome)

These are not BLK ANVL product and are used only as atmosphere. The Unsplash License permits free commercial use; attribution is appreciated but not required. Replace with a BLK ANVL campaign shoot.

| File | Unsplash photo ID | Used in |
| --- | --- | --- |
| `pullup.webp` | `1526506118085-60ce8714f8c5` | Hero, Men panel |
| `rack.webp` | `1544033527-b192daee1f5b` | The Uniform, Training collection, About |
| `profile.webp` (cropped above a third-party logo) | `1550345332-09e3ac987658` | Women panel |
| `deadlift.webp` | `1605296867304-46d5465a13f1` | Everyday / Every session |

Source URL format: `https://images.unsplash.com/photo-<id>`.
