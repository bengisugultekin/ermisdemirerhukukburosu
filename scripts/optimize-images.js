#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '..', 'theme', 'images');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const MAX_WIDTH = 1920; // Max width for large images
const QUALITY = {
  jpeg: 85,
  png: 90,
  webp: 85
};

// Get total size of directory
function getDirectorySize(dir) {
  let totalSize = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        totalSize += fs.statSync(filePath).size;
      }
    }
  }
  return totalSize;
}

// Optimize a single image
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const stats = fs.statSync(filePath);
  const originalSize = stats.size;
  
  if (!SUPPORTED_FORMATS.includes(ext)) {
    return { optimized: false, saved: 0 };
  }
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    let optimizedImage = image;
    
    // Resize if too large
    if (metadata.width > MAX_WIDTH) {
      optimizedImage = optimizedImage.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Optimize based on format
    if (ext === '.jpg' || ext === '.jpeg') {
      optimizedImage = optimizedImage.jpeg({
        quality: QUALITY.jpeg,
        progressive: true,
        mozjpeg: true
      });
    } else if (ext === '.png') {
      optimizedImage = optimizedImage.png({
        quality: QUALITY.png,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
    }
    
    // Write to temporary file first, then replace original
    const tempPath = filePath + '.tmp';
    await optimizedImage.toFile(tempPath);
    
    const tempStats = fs.statSync(tempPath);
    const newSize = tempStats.size;
    
    // Only replace if we actually saved space
    if (newSize < originalSize) {
      // Replace original with optimized version
      fs.renameSync(tempPath, filePath);
      const saved = originalSize - newSize;
      
      return {
        optimized: true,
        saved,
        originalSize,
        newSize,
        percentSaved: ((saved / originalSize) * 100).toFixed(1)
      };
    } else {
      // Remove temp file if no improvement
      fs.unlinkSync(tempPath);
      return {
        optimized: false,
        saved: 0,
        originalSize,
        newSize: originalSize,
        percentSaved: '0.0'
      };
    }
  } catch (error) {
    // Clean up temp file if it exists
    const tempPath = filePath + '.tmp';
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    console.error(`Error optimizing ${filePath}:`, error.message);
    return { optimized: false, saved: 0, error: error.message };
  }
}

// Process all images recursively
async function processDirectory(dir, baseDir = dir) {
  const results = {
    processed: 0,
    optimized: 0,
    totalSaved: 0,
    errors: []
  };
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      const subResults = await processDirectory(filePath, baseDir);
      results.processed += subResults.processed;
      results.optimized += subResults.optimized;
      results.totalSaved += subResults.totalSaved;
      results.errors.push(...subResults.errors);
    } else if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        results.processed++;
        const relativePath = path.relative(baseDir, filePath);
        console.log(`Optimizing: ${relativePath}`);
        
        const result = await optimizeImage(filePath);
        
        if (result.optimized) {
          results.optimized++;
          results.totalSaved += result.saved;
          console.log(`  ✓ Saved ${result.percentSaved}% (${(result.saved / 1024).toFixed(1)}KB)`);
        } else if (result.error) {
          results.errors.push({ file: relativePath, error: result.error });
        }
      }
    }
  }
  
  return results;
}

// Main function
async function main() {
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`Image directory not found: ${IMAGE_DIR}`);
    process.exit(1);
  }
  
  console.log('🖼️  Image Optimization Tool\n');
  console.log(`Directory: ${IMAGE_DIR}\n`);
  
  // Get original size
  console.log('Calculating original size...');
  const originalSize = getDirectorySize(IMAGE_DIR);
  console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB\n`);
  
  // Process images
  console.log('Starting optimization...\n');
  const startTime = Date.now();
  
  const results = await processDirectory(IMAGE_DIR);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Optimization Complete!\n');
  console.log(`Processed: ${results.processed} images`);
  console.log(`Optimized: ${results.optimized} images`);
  console.log(`Total saved: ${(results.totalSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Percent saved: ${((results.totalSaved / originalSize) * 100).toFixed(1)}%`);
  console.log(`Time taken: ${duration}s`);
  
  if (results.errors.length > 0) {
    console.log(`\nErrors: ${results.errors.length}`);
    results.errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }
  
  // Get new size
  const newSize = getDirectorySize(IMAGE_DIR);
  console.log(`\nFinal size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
