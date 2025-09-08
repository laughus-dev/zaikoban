import sharp from 'sharp';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '../public/zaikoban.svg');
const publicDir = join(__dirname, '../public');

const svgContent = readFileSync(svgPath, 'utf-8');

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'icon-180x180.png' },
  { size: 192, name: 'icon-maskable-192x192.png', maskable: true },
  { size: 512, name: 'icon-maskable-512x512.png', maskable: true },
];

async function generateIcon(size, outputName, maskable = false) {
  const outputPath = join(publicDir, outputName);
  
  let modifiedSvg = svgContent;
  
  if (maskable) {
    modifiedSvg = svgContent.replace(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 -30 316 316"'
    );
  }
  
  await sharp(Buffer.from(modifiedSvg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  
  console.log(`✅ Generated ${outputName} (${size}x${size})`);
}

async function generateIcons() {
  console.log('🎨 Generating PWA icons from SVG...\n');
  
  for (const { size, name, maskable } of sizes) {
    await generateIcon(size, name, maskable);
  }
  
  console.log('\n✨ All icons generated successfully!');
}

generateIcons().catch(console.error);