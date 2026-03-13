#!/usr/bin/env node
// Optimizes JPG/PNG in place and generates .webp siblings

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');
const SUPPORTED = ['.jpg', '.jpeg', '.png'];
const QUALITY = { jpeg: 82, png: 85, webp: 80 };
const MAX_WIDTH = 1920;

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED.includes(ext)) return;

  const originalSize = fs.statSync(filePath).size;
  const image = sharp(filePath);
  const meta = await image.metadata();

  let pipeline = image;
  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' });
  }

  // Optimise original in place
  const tmpPath = filePath + '.tmp';
  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline.clone().jpeg({ quality: QUALITY.jpeg, progressive: true, mozjpeg: true }).toFile(tmpPath);
  } else {
    await pipeline.clone().png({ quality: QUALITY.png, compressionLevel: 9 }).toFile(tmpPath);
  }
  const newSize = fs.statSync(tmpPath).size;
  if (newSize < originalSize) {
    fs.renameSync(tmpPath, filePath);
    console.log(`  optimised  ${path.relative(IMAGE_DIR, filePath)}  ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB`);
  } else {
    fs.unlinkSync(tmpPath);
  }

  // Generate WebP sibling
  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
  if (!fs.existsSync(webpPath)) {
    await pipeline.clone().webp({ quality: QUALITY.webp }).toFile(webpPath);
    const webpSize = fs.statSync(webpPath).size;
    console.log(`  webp       ${path.relative(IMAGE_DIR, webpPath)}  ${(webpSize/1024).toFixed(0)}KB`);
  }
}

async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else await processFile(full);
  }
}

(async () => {
  console.log('Image optimisation starting...\n');
  await walk(IMAGE_DIR);
  console.log('\nDone.');
})();
