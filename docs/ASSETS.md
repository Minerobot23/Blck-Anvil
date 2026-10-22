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

## Product photography — `public/products/<slug>/<colour>/<role>.webp` (BLK ANVL, supplied collages)

Split from the supplied collages in `assets/collages/` by `scripts/split-collages.py` (panel boundaries measured per collage, divider lines trimmed, exported at native resolution — nothing is upscaled). Gallery data: `src/data/photo-manifest.json`.

| Product | Colourway with photography | Panels |
| --- | --- | --- |
| Washed Heavyweight Hoodie | Washed Black | lifestyle, front, back, logo, label, cuff |
| Essential Oversized Tee | Obsidian | lifestyle, front, back, logo, label, sleeve hem + tab |
| Compression Tee | Obsidian | lifestyle, front, back, logo, label, seam |
| Flared Leggings | Obsidian | lifestyle, front, back (split from one shared panel), logo, label, hem |
| Split Hem Training Shorts (women, new product) | Obsidian | lifestyle, front, back, logo, label, split hem |
| Contour Shorts | Obsidian | lifestyle, front, back, logo, label, seam, hem |
| Training Shorts (men) | Obsidian | lifestyle, front, back, logo, label, split hem |

Each product is offered in its photographed colourway only. If a colourway without photography is added later, the gallery falls back to renders and says "Photography for <colour> is pending".

### Needs higher-resolution replacements

All panels came from ~1310×1200 collages, so every file is below the 1000 px target for a main gallery image. Main-gallery images are displayed at no more than 1.25× native size (1.5× in the full-screen viewer); detail panels are shown as smaller contained images. Supply originals at ≥ 2000 px on the long edge for: 

| File | Native size | Use |
| --- | --- | --- |
| `/products/washed-heavyweight-hoodie/washed-black/lifestyle.webp` | 757×891 | main gallery |
| `/products/washed-heavyweight-hoodie/washed-black/front.webp` | 540×462 | main gallery |
| `/products/washed-heavyweight-hoodie/washed-black/back.webp` | 540×421 | main gallery |
| `/products/washed-heavyweight-hoodie/washed-black/logo-detail.webp` | 427×301 | detail thumbnail |
| `/products/washed-heavyweight-hoodie/washed-black/label-detail.webp` | 436×301 | detail thumbnail |
| `/products/washed-heavyweight-hoodie/washed-black/fabric-detail.webp` | 431×301 | detail thumbnail |
| `/products/essential-oversized-tee/obsidian/lifestyle.webp` | 752×890 | main gallery |
| `/products/essential-oversized-tee/obsidian/front.webp` | 545×463 | main gallery |
| `/products/essential-oversized-tee/obsidian/back.webp` | 545×419 | main gallery |
| `/products/essential-oversized-tee/obsidian/logo-detail.webp` | 427×302 | detail thumbnail |
| `/products/essential-oversized-tee/obsidian/label-detail.webp` | 439×302 | detail thumbnail |
| `/products/essential-oversized-tee/obsidian/fabric-detail.webp` | 428×302 | detail thumbnail |
| `/products/compression-tee/obsidian/lifestyle.webp` | 762×890 | main gallery |
| `/products/compression-tee/obsidian/front.webp` | 535×459 | main gallery |
| `/products/compression-tee/obsidian/back.webp` | 535×423 | main gallery |
| `/products/compression-tee/obsidian/logo-detail.webp` | 429×302 | detail thumbnail |
| `/products/compression-tee/obsidian/label-detail.webp` | 437×302 | detail thumbnail |
| `/products/compression-tee/obsidian/fabric-detail.webp` | 428×302 | detail thumbnail |
| `/products/flared-leggings/obsidian/lifestyle.webp` | 715×862 | main gallery |
| `/products/flared-leggings/obsidian/front.webp` | 291×862 | main gallery |
| `/products/flared-leggings/obsidian/back.webp` | 291×862 | main gallery |
| `/products/flared-leggings/obsidian/logo-detail.webp` | 429×330 | detail thumbnail |
| `/products/flared-leggings/obsidian/label-detail.webp` | 434×330 | detail thumbnail |
| `/products/flared-leggings/obsidian/fabric-detail.webp` | 431×330 | detail thumbnail |
| `/products/womens-training-shorts/obsidian/lifestyle.webp` | 751×861 | main gallery |
| `/products/womens-training-shorts/obsidian/front.webp` | 546×463 | main gallery |
| `/products/womens-training-shorts/obsidian/back.webp` | 546×390 | main gallery |
| `/products/womens-training-shorts/obsidian/logo-detail.webp` | 428×331 | detail thumbnail |
| `/products/womens-training-shorts/obsidian/label-detail.webp` | 434×331 | detail thumbnail |
| `/products/womens-training-shorts/obsidian/fabric-detail.webp` | 432×331 | detail thumbnail |
| `/products/contour-shorts/obsidian/lifestyle.webp` | 702×850 | main gallery |
| `/products/contour-shorts/obsidian/front.webp` | 597×426 | main gallery |
| `/products/contour-shorts/obsidian/back.webp` | 597×416 | main gallery |
| `/products/contour-shorts/obsidian/logo-detail.webp` | 350×341 | detail thumbnail |
| `/products/contour-shorts/obsidian/label-detail.webp` | 318×341 | detail thumbnail |
| `/products/contour-shorts/obsidian/fabric-detail.webp` | 284×341 | detail thumbnail |
| `/products/contour-shorts/obsidian/fabric-detail-2.webp` | 336×341 | detail thumbnail |
| `/products/training-shorts/obsidian/lifestyle.webp` | 739×870 | main gallery |
| `/products/training-shorts/obsidian/front.webp` | 560×445 | main gallery |
| `/products/training-shorts/obsidian/back.webp` | 560×417 | main gallery |
| `/products/training-shorts/obsidian/logo-detail.webp` | 433×321 | detail thumbnail |
| `/products/training-shorts/obsidian/label-detail.webp` | 429×321 | detail thumbnail |
| `/products/training-shorts/obsidian/fabric-detail.webp` | 434×321 | detail thumbnail |

Notes:
- The oversized tee photography reads as a washed black. It is mapped to **Obsidian** (the tee's existing black colourway). If it is meant to be a washed colourway, add `washed-black` to that product's colours and move the folder.
- The sports bra worn in the women's lifestyle shots (strappy scoop-neck) does not match the catalogue's Seamless Sports Bra; no product shots were supplied for it, so it is not used as product imagery.

## Product renders

The catalogue now contains only the seven supplied products, each in its photographed colourway, so no studio renders ship with the site. The render engine (`scripts/garments.mjs`, `scripts/render-products.mjs`) is kept for future colourways and products without photography.

## Campaign mood — `public/campaign/` (Unsplash License, graded monochrome)

These are not BLK ANVL product and are used only as atmosphere. The Unsplash License permits free commercial use; attribution is appreciated but not required. Replace with a BLK ANVL campaign shoot.

| File | Unsplash photo ID | Used in |
| --- | --- | --- |
| `pullup.webp` | `1526506118085-60ce8714f8c5` | Hero, Men panel |
| `rack.webp` | `1544033527-b192daee1f5b` | The Uniform, Training collection, About |
| `profile.webp` (cropped above a third-party logo) | `1550345332-09e3ac987658` | Women panel |
| `deadlift.webp` | `1605296867304-46d5465a13f1` | Everyday / Every session |

Source URL format: `https://images.unsplash.com/photo-<id>`.
