const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
let pngToIco;

async function run() {
  const root = path.resolve(__dirname, '..');
  const srcSvg = path.join(root, 'public', 'favicon.svg');
  const outIconPng = path.join(root, 'src', 'app', 'icon.png');
  const outApplePng = path.join(root, 'src', 'app', 'apple-icon.png');
  const outFavicon16 = path.join(root, 'public', 'favicon-16.png');
  const outFavicon32 = path.join(root, 'public', 'favicon-32.png');
  const outIco = path.join(root, 'public', 'favicon.ico');
  const outFavicon48 = path.join(root, 'public', 'favicon-48.png');

  if (!fs.existsSync(srcSvg)) {
    console.error('SVG source not found:', srcSvg);
    process.exit(1);
  }

  const svgData = fs.readFileSync(srcSvg);

  // 32x32 favicon PNG
  await sharp(svgData)
    .resize(32, 32)
    .png()
    .toFile(outIconPng);
  console.log('Wrote', outIconPng);

  // 180x180 Apple Touch Icon
  await sharp(svgData)
    .resize(180, 180)
    .png()
    .toFile(outApplePng);
  console.log('Wrote', outApplePng);

  // Public PNGs for ICO generation
  await sharp(svgData).resize(16, 16).png().toFile(outFavicon16);
  await sharp(svgData).resize(32, 32).png().toFile(outFavicon32);
  await sharp(svgData).resize(48, 48).png().toFile(outFavicon48);
  console.log('Wrote', outFavicon16, ',', outFavicon32, 'and', outFavicon48);

  // Load ESM-only png-to-ico and generate ICO for Safari fallback
  if (!pngToIco) {
    const mod = await import('png-to-ico');
    pngToIco = mod.default || mod;
  }
  const icoBuffer = await pngToIco([outFavicon16, outFavicon32, outFavicon48]);
  fs.writeFileSync(outIco, icoBuffer);
  console.log('Wrote', outIco);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
