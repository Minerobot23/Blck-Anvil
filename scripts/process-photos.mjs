// Crops brand photography from the reference board and grades campaign imagery.
import sharp from "sharp";
const [ref, campDir] = process.argv.slice(2);
const crops = {
  "hoodie-front": { left: 6, top: 4, width: 540, height: 675 },
  "hoodie-back": { left: 524, top: 4, width: 540, height: 675 },
  "detail-monogram": { left: 2, top: 697, width: 378, height: 325 },
  "detail-wordmark": { left: 386, top: 697, width: 378, height: 325 },
  "detail-label": { left: 770, top: 697, width: 380, height: 325 },
  "detail-shoulder": { left: 1156, top: 697, width: 378, height: 325 },
  "lockup": { left: 1060, top: 220, width: 460, height: 240 },
};
for (const [name, c] of Object.entries(crops)) {
  await sharp(ref).extract(c).resize({ width: c.width * 2, kernel: "lanczos3" }).sharpen({ sigma: 0.6 }).webp({ quality: 88 }).toFile(`public/photo/${name}.webp`);
}
const camp = {
  "pullup": { id: "1526506118085-60ce8714f8c5" },
  "rack": { id: "1544033527-b192daee1f5b" },
  "profile": { id: "1550345332-09e3ac987658", crop: { left: 0, top: 0, width: 2400, height: 3000 } },
  "deadlift": { id: "1605296867304-46d5465a13f1" },
};
for (const [name, c] of Object.entries(camp)) {
  let img = sharp(`${campDir}/${c.id}.jpg`);
  if (c.crop) img = img.extract(c.crop);
  await img.grayscale().linear(1.08, -6).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`public/campaign/${name}.webp`);
}
console.log("done");
