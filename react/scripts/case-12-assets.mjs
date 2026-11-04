import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const dir = 'public/case-12';
await mkdir(dir, { recursive: true });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
<rect width="1600" height="1000" fill="#e6edda"/><circle cx="1420" cy="80" r="360" fill="#d3e3b9"/>
<rect x="130" y="120" width="1340" height="760" rx="24" fill="#fcfdf8"/><rect x="130" y="120" width="300" height="760" rx="24" fill="#243f33"/>
<text x="175" y="200" font-family="sans-serif" font-size="30" fill="#e3f2bb">NORTHWIND</text>
<g fill="#a7bc9c"><rect x="175" y="275" width="185" height="12" rx="6"/><rect x="175" y="330" width="140" height="12" rx="6"/><rect x="175" y="385" width="160" height="12" rx="6"/></g>
<text x="500" y="220" font-family="sans-serif" font-size="48" fill="#253b32">A quiet place for good ideas.</text>
<rect x="500" y="270" width="450" height="14" rx="7" fill="#b7c4a9"/>
<g fill="#edf1e4"><rect x="500" y="340" width="410" height="190" rx="15"/><rect x="950" y="340" width="410" height="190" rx="15"/><rect x="500" y="570" width="410" height="190" rx="15"/><rect x="950" y="570" width="410" height="190" rx="15"/></g>
<g fill="#6f8963"><rect x="535" y="380" width="220" height="18" rx="7"/><rect x="985" y="380" width="250" height="18" rx="7"/><rect x="535" y="610" width="250" height="18" rx="7"/><rect x="985" y="610" width="190" height="18" rx="7"/></g>
<g fill="#bac8ae"><rect x="535" y="430" width="330" height="10" rx="5"/><rect x="535" y="460" width="280" height="10" rx="5"/><rect x="985" y="430" width="300" height="10" rx="5"/><rect x="985" y="460" width="320" height="10" rx="5"/><rect x="535" y="660" width="290" height="10" rx="5"/><rect x="985" y="660" width="310" height="10" rx="5"/></g></svg>`;
await writeFile(dir + '/notebook.svg', svg);
const { data, info } = await sharp(Buffer.from(svg))
  .resize(2400, 1500)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
// Fine paper texture makes the oversized lossless source expensive to transfer.
let png;
for (const stride of [3, 4, 8, 12, 16, 24, 32, 48]) {
  const textured = Buffer.from(data);
  let seed = 11;
  for (let pixel = 0; pixel < info.width * info.height; pixel += stride) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    for (let c = 0; c < 3; c++)
      textured[pixel * 3 + c] = Math.max(
        0,
        Math.min(255, textured[pixel * 3 + c] + (seed % 9) - 4),
      );
  }
  png = await sharp(textured, { raw: info }).png({ compressionLevel: 9 }).toBuffer();
  if (png.length < 980000) break;
}
if (png.length >= 1000000) throw Error('Image exceeds the asset limit');
await writeFile(dir + '/notebook-large.png', png);
await sharp(png)
  .resize(1200, 750)
  .webp({ quality: 72 })
  .toFile(dir + '/notebook.webp');
console.log('Created original notebook artwork; lossless source bytes:', png.length);
await sharp(png)
  .resize(640, 400)
  .webp({ quality: 72 })
  .toFile(dir + '/notebook-640.webp');

await sharp(png)
  .resize(64, 40)
  .png()
  .toFile(dir + '/notebook-thumb.png');
