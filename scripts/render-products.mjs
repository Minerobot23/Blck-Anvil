/**
 * Renders every product × colourway × shot to /public/products/<slug>/<color>-<shot>.webp
 * and copies the real brand photography crops into /public/photo.
 *
 * Usage:
 *   node --experimental-strip-types scripts/render-products.mjs            # all
 *   node --experimental-strip-types scripts/render-products.mjs --preview  # contact sheet only
 *   node --experimental-strip-types scripts/render-products.mjs --only=hoodie,shorts
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { CATALOG, COLORWAYS } from "../src/data/catalog.ts";
import { renderSVG, SHOTS, GARMENTS } from "./garments.mjs";

const args = process.argv.slice(2);
const preview = args.includes("--preview");
const only = (args.find((a) => a.startsWith("--only=")) || "").replace("--only=", "").split(",").filter(Boolean);
const OUT = path.resolve("public/products");
const EXEC = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const browser = await chromium.launch({ executablePath: fs.existsSync(EXEC) ? EXEC : undefined });
const page = await browser.newPage({ viewport: { width: 1000, height: 1250 }, deviceScaleFactor: 1.2 });

async function shoot(svg) {
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#e6e4df">${svg}</body></html>`);
  return page.screenshot({ clip: { x: 0, y: 0, width: 1000, height: 1250 }, type: "png" });
}

if (preview) {
  const garments = only.length ? only : Object.keys(GARMENTS);
  const files = [];
  const dir = process.env.PREVIEW_DIR || "/tmp";
  for (const gk of garments) {
    const prod = CATALOG.find((p) => p.garment === gk);
    const colors = prod ? prod.colors.slice(0, 2) : ["obsidian"];
    for (const c of colors) {
      for (const shot of SHOTS) {
        const buf = await shoot(renderSVG(gk, COLORWAYS[c], shot));
        const f = path.join(dir, `pv-${gk}-${c}-${shot}.png`);
        await sharp(buf).resize(300).toFile(f);
        files.push(f);
      }
    }
  }
  console.log(files.join("\n"));
  await browser.close();
  process.exit(0);
}

let count = 0;
for (const p of CATALOG) {
  if (only.length && !only.includes(p.garment) && !only.includes(p.slug)) continue;
  const dir = path.join(OUT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  let seed = 3;
  for (const c of p.colors) {
    for (const shot of SHOTS) {
      const buf = await shoot(renderSVG(p.garment, COLORWAYS[c], shot, { seed: seed++ }));
      await sharp(buf).webp({ quality: 84 }).toFile(path.join(dir, `${c}-${shot}.webp`));
      count++;
    }
  }
  process.stdout.write(`${p.slug} `);
}
console.log(`\nrendered ${count} images`);
await browser.close();
