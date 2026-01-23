const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function run() {
  const root = path.resolve(__dirname, '..');
  const srcSvg = path.join(root, 'public', 'favicon.svg');
  const outIconPng = path.join(root, 'src', 'app', 'icon.png');
  const outApplePng = path.join(root, 'src', 'app', 'apple-icon.png');

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
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
