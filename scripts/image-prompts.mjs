// Generates docs/IMAGE_PROMPTS.md from the catalog: one prompt per product × shot,
// for producing final photography or AI-generated imagery that matches the brand.
import fs from "node:fs";
import { CATALOG, COLORWAYS } from "../src/data/catalog.ts";

const PLACEMENT = {
  oversizedTee: "small tonal embroidered monogram on the left chest; BLK ANVL wordmark printed small across the upper back below the collar; woven black neck label",
  compressionTee: "small monogram printed on the left sleeve near the hem; small wordmark across the upper back",
  tankMen: "small tonal embroidered monogram on the left chest; small wordmark at the upper back",
  shorts: "small monogram printed near the hem of the left leg; tiny wordmark on the back waistband",
  hoodie: "small tonal embroidered monogram on the left chest; BLK ANVL wordmark printed across the upper back directly below the hood; woven neck label",
  hoodieOversized: "small tonal embroidered monogram on the left chest; BLK ANVL wordmark printed across the upper back directly below the hood",
  joggers: "small tonal embroidered monogram on the upper left thigh; tiny wordmark on the back waistband",
  longSleeve: "knit-in tonal monogram on the left chest; small wordmark at the upper back",
  zipJacket: "small tonal embroidered monogram on the left chest; wordmark across the upper back",
  zipJacketFitted: "small tonal embroidered monogram on the left chest; wordmark across the upper back",
  leggings: "small monogram printed on the left hip just below the waistband; small wordmark centred on the back waistband",
  flaredLeggings: "small monogram printed on the left hip just below the waistband; small wordmark centred on the back waistband",
  sportsBra: "small knit-in monogram centred on the front underband; small wordmark centred on the back band",
  contourShorts: "small monogram printed near the hem of the left leg; small wordmark on the back waistband",
  croppedTee: "small tonal embroidered monogram on the left chest; small wordmark across the upper back",
  tankWomen: "small tonal monogram at the back neck",
};

const BRAND = `Brand mark reference: /public/brand/lockup-light.svg — monogram is two sharp angular blades forming an "A" (tall blade on the right over a Λ with a hooked left foot); wordmark "BLK ANVL" in wide, widely spaced geometric capitals where A and V have no crossbars. Branding is always tonal, small and understated — never oversized.`;
const STYLE = "Premium athletic apparel e-commerce photography, consistent across the catalogue, true-to-life fabric texture and construction, accurate stitching, no distorted anatomy, no extra fingers, logos legible and physically following folds, perspective and lighting, no other brand logos.";

let md = `# BLK ANVL — Image production prompts\n\nGenerated from \`src/data/catalog.ts\` by \`scripts/image-prompts.mjs\`. Use these to brief a photographer or to generate imagery with an image model that can take the logo as a reference.\n\n${BRAND}\n\n**Global style:** ${STYLE}\n\n**Studio shots:** seamless warm light-grey background (#E6E4DF), soft overhead key light from upper left, gentle floor shadow, ghost-mannequin or flat-pressed presentation, 4:5 crop, garment filling ~80% of frame height.\n\n**Lifestyle shots:** monochrome-leaning colour grade, dark industrial training space or minimal concrete studio, hard directional light, editorial poses, 4:5 crop.\n\nDrop finished files into \`public/products/<slug>/<colour>-<shot>.webp\` (shots: front, back, detail, texture) — the site picks them up automatically. Add lifestyle images to the product's image list in \`src/lib/products.ts\`.\n\n`;

for (const p of CATALOG) {
  md += `## ${p.name} (${p.gender === "men" ? "Men" : "Women"}) — \`${p.slug}\`\n\nColourways: ${p.colors.map((c) => COLORWAYS[c].name).join(", ")}. Fit: ${p.fit} Fabric: ${p.fabric}. Branding: ${PLACEMENT[p.garment]}.\n\n`;
  const c = COLORWAYS[p.colors[0]].name.toLowerCase();
  const g = `BLK ANVL ${p.name} in ${c}`;
  md += `1. **Front (studio):** ${g}, front view, ghost mannequin, ${p.summary.toLowerCase()} Show ${PLACEMENT[p.garment].split(";")[0]}.\n`;
  md += `2. **Back (studio):** ${g}, back view, ghost mannequin, same lighting as the front shot, showing the back branding.\n`;
  md += `3. **Logo detail:** extreme close-up macro of the ${PLACEMENT[p.garment].split(";")[0].replace(/^small |^tiny /, "")} on the ${c} fabric, raking light revealing ${/embroidered/.test(PLACEMENT[p.garment]) ? "satin-stitch embroidery thread" : "the print sitting into the knit"}.\n`;
  md += `4. **Lifestyle (model):** athletic ${p.gender === "men" ? "male" : "female"} model wearing the ${g}, ${p.category === "Hoodies" || p.category === "Jackets" ? "between sets in a dark industrial gym" : "mid-training in a dark industrial gym"}, hard side light, editorial, garment fit accurate to "${p.fit.split(".")[0]}".\n`;
  md += `5. **Alternate angle:** ${g}, three-quarter side view on model or folded flat-lay on dark concrete, showing construction (${p.features.slice(0, 2).join(", ").toLowerCase()}).\n\n`;
}
fs.writeFileSync("docs/IMAGE_PROMPTS.md", md);
console.log("wrote docs/IMAGE_PROMPTS.md");
