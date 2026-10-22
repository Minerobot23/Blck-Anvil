// Emits standalone logo SVGs into public/brand from src/lib/brand.ts geometry.
import fs from "node:fs";
import path from "node:path";

const src = fs.readFileSync(new URL("../src/lib/brand.ts", import.meta.url), "utf8");
const grab = (re) => src.match(re)[1];
export const monoViewBox = grab(/MONOGRAM_VIEWBOX = "([^"]+)"/);
export const monoPathList = [...src.matchAll(/^\s+"(M[^"]+Z)",/gm)].map((m) => m[1]);
const wordVB = grab(/WORDMARK_VIEWBOX = "([^"]+)"/);
const stroke = grab(/WORDMARK_STROKE = ([\d.]+)/);
const defs = Object.fromEntries([...src.matchAll(/^const (\w) = "([^"]+)";/gm)].map((m) => [m[1], m[2]]));
const letters = [...src.matchAll(/t\((\d+), (\w)\)/g)].map((m) => ({ x: +m[1], d: defs[m[2]] }));

export function monogramPaths(fill) {
  return monoPathList.map((d) => `<path d="${d}" fill="${fill}"/>`).join("");
}
export function monogram(fill = "#F5F5F2") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${monoViewBox}">${monogramPaths(fill)}</svg>`;
}
export function wordmarkInner(color = "#F5F5F2", sw = stroke) {
  return `<g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="miter" stroke-miterlimit="10">${letters
    .map((l) => `<path transform="translate(${l.x} 0)" d="${l.d}"/>`)
    .join("")}</g>`;
}
export const wordViewBox = wordVB;
export function wordmark(color = "#F5F5F2") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wordVB}">${wordmarkInner(color)}</svg>`;
}

if (process.argv[1] && process.argv[1].endsWith("logo-svg.mjs")) {
  const out = path.resolve("public/brand");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "monogram-light.svg"), monogram("#F5F5F2"));
  fs.writeFileSync(path.join(out, "monogram-dark.svg"), monogram("#080808"));
  fs.writeFileSync(path.join(out, "wordmark-light.svg"), wordmark("#F5F5F2"));
  fs.writeFileSync(path.join(out, "wordmark-dark.svg"), wordmark("#080808"));
  fs.writeFileSync(
    path.join(out, "lockup-light.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900"><svg x="510" y="40" width="380" height="410" viewBox="${monoViewBox}">${monogramPaths("#F5F5F2")}</svg><svg x="70" y="600" width="1260" height="66" viewBox="${wordVB}">${wordmarkInner("#F5F5F2")}</svg></svg>`
  );
  console.log("logo svgs written");
}
