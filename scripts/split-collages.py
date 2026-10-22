"""
Split BLK ANVL product collages into individual gallery images.

Source collages live in assets/collages/<slug>.png. Panel boundaries were
measured per collage (divider lines / background tone steps detected with
NumPy brightness profiles, then checked visually) and are configured below —
collages are not split into equal tiles.

Outputs:
  public/products/<slug>/<color>/<role>.webp   (native resolution, never upscaled)
  src/data/photo-manifest.json                 (gallery data consumed by src/lib/products.ts)

Run:  python3 scripts/split-collages.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "collages"
OUT = ROOT / "public" / "products"
MANIFEST = ROOT / "src" / "data" / "photo-manifest.json"

TRIM = 4  # px removed either side of a divider so no grid line survives
# Below this width a panel is kept as a detail thumbnail and flagged for a hi-res replacement.
MIN_MAIN_WIDTH = 1000

# role order = gallery order
ROLES = ["lifestyle", "front", "back", "logo-detail", "label-detail", "fabric-detail", "fabric-detail-2"]

ALT = {
    "lifestyle": "worn by a model in a dark training space",
    "front": "front view",
    "back": "back view",
    "logo-detail": "close-up of the BLK ANVL monogram",
    "label-detail": "close-up of the woven BLK ANVL label",
    "fabric-detail": "close-up of the fabric and stitching",
    "fabric-detail-2": "close-up of the hem and seam construction",
}


def std(W, H, top, split_x, right_split, bottom_x):
    """Standard layout: lifestyle left, front/back stacked right, detail strip below."""
    t = TRIM
    panels = {
        "lifestyle": (0, 0, split_x - 9, top - t),  # wider trim: divider glow bleeds ~4px here
        "front": (split_x + t, 0, W, right_split - t),
        "back": (split_x + t, right_split + t, W, top - t),
    }
    xs = [0, *bottom_x, W]
    names = ["logo-detail", "label-detail", "fabric-detail", "fabric-detail-2"]
    for i in range(len(xs) - 1):
        x0 = xs[i] + (t if i else 0)
        x1 = xs[i + 1] - (t if i + 1 < len(xs) - 1 else 0)
        panels[names[i]] = (x0, top + t, x1, H)
    return panels


COLLAGES = {
    # slug: (colour, panels)
    "washed-heavyweight-hoodie": ("washed-black", lambda W, H: std(W, H, 895, 766, 466, [431, 875])),
    "essential-oversized-tee": ("obsidian", lambda W, H: std(W, H, 894, 761, 467, [431, 878])),
    "compression-tee": ("obsidian", lambda W, H: std(W, H, 894, 771, 463, [433, 878])),
    "flared-leggings": (
        "obsidian",
        # right panel shows front and back side by side on one background: split at its centre
        lambda W, H: {
            **{k: v for k, v in std(W, H, 866, 724, 433, [433, 875]).items() if k not in ("front", "back")},
            "front": (724 + TRIM, 0, 1019, 866 - TRIM),
            "back": (1019, 0, W, 866 - TRIM),
        },
    ),
    "womens-training-shorts": ("obsidian", lambda W, H: std(W, H, 865, 760, 467, [432, 874])),
    "contour-shorts": ("obsidian", lambda W, H: std(W, H, 854, 711, 430, [354, 680, 972])),
    "training-shorts": ("obsidian", lambda W, H: std(W, H, 874, 748, 449, [437, 874])),
}


def edge_bg(im: Image.Image) -> str:
    """Median colour of the panel's outer 6px — used to letterbox contained images seamlessly."""
    a = np.asarray(im.convert("RGB"))
    e = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    r, g, b = np.median(e, axis=0).astype(int)
    return f"#{r:02x}{g:02x}{b:02x}"


def main():
    manifest = {}
    report = []
    for slug, (color, layout) in COLLAGES.items():
        src = Image.open(SRC / f"{slug}.png").convert("RGB")
        W, H = src.size
        panels = layout(W, H)
        dest = OUT / slug / color
        dest.mkdir(parents=True, exist_ok=True)
        items = []
        for role in ROLES:
            if role not in panels:
                continue
            box = panels[role]
            crop = src.crop(box)
            w, h = crop.size
            path = dest / f"{role}.webp"
            crop.save(path, "WEBP", quality=92, method=6)
            hires = w >= MIN_MAIN_WIDTH
            items.append(
                {
                    "role": role,
                    "src": f"/products/{slug}/{color}/{role}.webp",
                    "width": w,
                    "height": h,
                    "bg": edge_bg(crop),
                    "alt": ALT[role],
                    "needsHiRes": not hires,
                }
            )
            report.append(f"{slug}/{color}/{role}: {w}x{h}{'' if hires else '  ← replace with higher resolution'}")
        manifest.setdefault(slug, {})[color] = items
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")
    print("\n".join(report))
    print(f"\nwrote {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
