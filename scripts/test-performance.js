#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Performance thresholds
const THRESHOLDS = {
  htmlMaxSize: 200 * 1024, // 200KB
  cssMaxSize: 100 * 1024, // 100KB
  jsMaxSize: 500 * 1024, // 500KB per file
  imageMaxSize: 500 * 1024, // 500KB per image
  totalPageSize: 2000 * 1024, // 2MB
  maxScripts: 10,
  maxStylesheets: 5
};

// Get file size
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch (e) {
    return 0;
  }
}

// Format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Analyze HTML file
function analyzeHTML(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const size = fs.statSync(htmlPath).size;
  
  // Count scripts
  const scriptMatches = html.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  const scripts = scriptMatches.map(match => {
    const srcMatch = match.match(/src=["']([^"']+)["']/i);
    return srcMatch ? srcMatch[1] : null;
  }).filter(Boolean);
  
  // Count stylesheets
  const linkMatches = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
  const stylesheets = linkMatches.length;
  
  // Count images
  const imgMatches = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  const images = imgMatches.map(match => {
    const srcMatch = match.match(/src=["']([^"']+)["']/i);
    return srcMatch ? srcMatch[1] : null;
  }).filter(Boolean);
  
  // Check for inline styles
  const hasInlineStyles = html.includes('<style>') || html.match(/style=["'][^"']+["']/gi);
  
  // Check for async/defer on scripts
  const scriptsWithAsync = scriptMatches.filter(s => s.includes('async') || s.includes('defer')).length;
  
  // Check for lazy loading images
  const lazyImages = imgMatches.filter(img => img.includes('loading="lazy"')).length;
  
  return {
    size,
    scripts: scripts.length,
    scriptsList: scripts,
    stylesheets,
    images: images.length,
    imagesList: images,
    hasInlineStyles: !!hasInlineStyles,
    scriptsWithAsync,
    lazyImages,
    totalImages: images.length
  };
}

// Analyze CSS file
function analyzeCSS(cssPath) {
  if (!fs.existsSync(cssPath)) {
    return null;
  }
  
  const css = fs.readFileSync(cssPath, 'utf-8');
  const size = fs.statSync(cssPath).size;
  
  // Check for unused CSS patterns (basic check)
  const hasMediaQueries = css.includes('@media');
  const hasKeyframes = css.includes('@keyframes');
  const hasImportant = (css.match(/!important/gi) || []).length;
  
  return {
    size,
    hasMediaQueries,
    hasKeyframes,
    importantCount: hasImportant,
    lineCount: css.split('\n').length
  };
}

// Analyze JavaScript file
function analyzeJS(jsPath) {
  if (!fs.existsSync(jsPath)) {
    return null;
  }
  
  const js = fs.readFileSync(jsPath, 'utf-8');
  const size = fs.statSync(jsPath).size;
  
  // Basic checks
  const hasConsoleLog = (js.match(/console\.(log|warn|error|debug)/gi) || []).length;
  const hasJQuery = js.includes('jQuery') || js.includes('$(');
  const hasDocumentReady = js.includes('document.ready') || js.includes('$(document)');
  
  return {
    size,
    hasConsoleLog,
    hasJQuery,
    hasDocumentReady,
    lineCount: js.split('\n').length
  };
}

// Check image file
function checkImage(imagePath) {
  if (!fs.existsSync(imagePath)) {
    return null;
  }
  
  const size = fs.statSync(imagePath).size;
  const ext = path.extname(imagePath).toLowerCase();
  const isOptimized = ext === '.webp' || ext === '.avif';
  const isLarge = size > THRESHOLDS.imageMaxSize;
  
  return {
    size,
    ext,
    isOptimized,
    isLarge,
    path: imagePath
  };
}

// Calculate total page weight
function calculatePageWeight(htmlPath, distDir) {
  const htmlData = analyzeHTML(htmlPath);
  let totalSize = htmlData.size;
  
  // Add CSS size
  const cssPath = path.join(distDir, 'css', 'style.css');
  if (fs.existsSync(cssPath)) {
    totalSize += getFileSize(cssPath);
  }
  
  // Add JavaScript sizes
  for (const script of htmlData.scriptsList) {
    const scriptPath = path.join(distDir, script.replace(/^\//, ''));
    if (fs.existsSync(scriptPath)) {
      totalSize += getFileSize(scriptPath);
    }
  }
  
  // Add image sizes (approximate - first 10 images)
  for (let i = 0; i < Math.min(htmlData.imagesList.length, 10); i++) {
    const imgPath = path.join(distDir, htmlData.imagesList[i].replace(/^\//, ''));
    if (fs.existsSync(imgPath)) {
      totalSize += getFileSize(imgPath);
    }
  }
  
  return totalSize;
}

// Main performance test
function runPerformanceTests() {
  console.log('⚡ Performance Testing Tool\n');
  console.log('='.repeat(60));
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found! Please run "npm run build" first.');
    process.exit(1);
  }
  
  const results = {
    pages: [],
    css: null,
    js: [],
    images: [],
    issues: [],
    warnings: []
  };
  
  // Test homepage
  console.log('\n📄 Analyzing pages...\n');
  const homepagePath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(homepagePath)) {
    const htmlData = analyzeHTML(homepagePath);
    const pageWeight = calculatePageWeight(homepagePath, DIST_DIR);
    
    results.pages.push({
      path: '/',
      ...htmlData,
      pageWeight
    });
    
    // Check thresholds
    if (htmlData.size > THRESHOLDS.htmlMaxSize) {
      results.issues.push(`Homepage HTML is ${formatBytes(htmlData.size)} (max: ${formatBytes(THRESHOLDS.htmlMaxSize)})`);
    }
    
    if (htmlData.scripts > THRESHOLDS.maxScripts) {
      results.warnings.push(`Homepage has ${htmlData.scripts} scripts (recommended: <${THRESHOLDS.maxScripts})`);
    }
    
    if (pageWeight > THRESHOLDS.totalPageSize) {
      results.warnings.push(`Homepage total weight is ${formatBytes(pageWeight)} (recommended: <${formatBytes(THRESHOLDS.totalPageSize)})`);
    }
    
    if (htmlData.scriptsWithAsync < htmlData.scripts) {
      results.warnings.push(`Only ${htmlData.scriptsWithAsync}/${htmlData.scripts} scripts use async/defer`);
    }
    
    if (htmlData.lazyImages === 0 && htmlData.images > 0) {
      results.warnings.push(`No images use lazy loading (${htmlData.images} images found)`);
    }
  }
  
  // Analyze CSS
  console.log('🎨 Analyzing CSS...\n');
  const cssPath = path.join(DIST_DIR, 'css', 'style.css');
  if (fs.existsSync(cssPath)) {
    results.css = analyzeCSS(cssPath);
    
    if (results.css.size > THRESHOLDS.cssMaxSize) {
      results.issues.push(`CSS file is ${formatBytes(results.css.size)} (max: ${formatBytes(THRESHOLDS.cssMaxSize)})`);
    }
    
    if (results.css.importantCount > 50) {
      results.warnings.push(`CSS has ${results.css.importantCount} !important declarations (consider refactoring)`);
    }
  } else {
    results.warnings.push('CSS file not found');
  }
  
  // Analyze JavaScript files
  console.log('📜 Analyzing JavaScript...\n');
  const jsDir = path.join(DIST_DIR, 'js');
  const pluginsDir = path.join(DIST_DIR, 'plugins');
  
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir, { recursive: true })
      .filter(f => f.endsWith('.js'))
      .map(f => path.join(jsDir, f));
    
    for (const jsFile of jsFiles) {
      const jsData = analyzeJS(jsFile);
      if (jsData) {
        results.js.push({
          file: path.relative(DIST_DIR, jsFile),
          ...jsData
        });
        
        if (jsData.size > THRESHOLDS.jsMaxSize) {
          results.warnings.push(`JS file ${path.relative(DIST_DIR, jsFile)} is ${formatBytes(jsData.size)} (large file)`);
        }
        
        if (jsData.hasConsoleLog > 0) {
          results.warnings.push(`JS file ${path.relative(DIST_DIR, jsFile)} has ${jsData.hasConsoleLog} console.log statements (remove for production)`);
        }
      }
    }
  }
  
  // Check plugins directory
  if (fs.existsSync(pluginsDir)) {
    const pluginFiles = [];
    function findJSFiles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          findJSFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          pluginFiles.push(fullPath);
        }
      }
    }
    findJSFiles(pluginsDir);
    
    for (const jsFile of pluginFiles) {
      const size = getFileSize(jsFile);
      results.js.push({
        file: path.relative(DIST_DIR, jsFile),
        size,
        isPlugin: true
      });
    }
  }
  
  // Analyze images
  console.log('🖼️  Analyzing images...\n');
  const imagesDir = path.join(DIST_DIR, 'images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = [];
    function findImageFiles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          findImageFiles(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)) {
            imageFiles.push(fullPath);
          }
        }
      }
    }
    findImageFiles(imagesDir);
    
    let totalImageSize = 0;
    let largeImages = 0;
    let unoptimizedImages = 0;
    
    for (const imgFile of imageFiles) {
      const imgData = checkImage(imgFile);
      if (imgData) {
        results.images.push(imgData);
        totalImageSize += imgData.size;
        
        if (imgData.isLarge) {
          largeImages++;
        }
        
        if (!imgData.isOptimized && !['.jpg', '.jpeg', '.png'].includes(imgData.ext)) {
          unoptimizedImages++;
        }
      }
    }
    
    if (largeImages > 0) {
      results.warnings.push(`${largeImages} images exceed ${formatBytes(THRESHOLDS.imageMaxSize)}`);
    }
  }
  
  // Print results
  console.log('='.repeat(60));
  console.log('📊 Performance Analysis Results\n');
  
  // Page analysis
  if (results.pages.length > 0) {
    const page = results.pages[0];
    console.log('📄 Homepage Analysis:');
    console.log(`  HTML Size: ${formatBytes(page.size)}`);
    console.log(`  Total Page Weight: ${formatBytes(page.pageWeight)}`);
    console.log(`  Scripts: ${page.scripts} (${page.scriptsWithAsync} with async/defer)`);
    console.log(`  Stylesheets: ${page.stylesheets}`);
    console.log(`  Images: ${page.images} (${page.lazyImages} lazy-loaded)`);
    if (page.hasInlineStyles) {
      console.log(`  ⚠️  Has inline styles`);
    }
  }
  
  // CSS analysis
  if (results.css) {
    console.log('\n🎨 CSS Analysis:');
    console.log(`  Size: ${formatBytes(results.css.size)}`);
    console.log(`  Lines: ${results.css.lineCount}`);
    console.log(`  Media Queries: ${results.css.hasMediaQueries ? 'Yes' : 'No'}`);
    console.log(`  Animations: ${results.css.hasKeyframes ? 'Yes' : 'No'}`);
    console.log(`  !important declarations: ${results.css.importantCount}`);
  }
  
  // JavaScript analysis
  if (results.js.length > 0) {
    console.log('\n📜 JavaScript Analysis:');
    const totalJSSize = results.js.reduce((sum, js) => sum + js.size, 0);
    console.log(`  Total JS Files: ${results.js.length}`);
    console.log(`  Total JS Size: ${formatBytes(totalJSSize)}`);
    
    const customJS = results.js.filter(js => !js.isPlugin);
    const pluginJS = results.js.filter(js => js.isPlugin);
    
    if (customJS.length > 0) {
      console.log(`  Custom JS Files: ${customJS.length}`);
      customJS.forEach(js => {
        console.log(`    - ${js.file}: ${formatBytes(js.size)}`);
      });
    }
    
    if (pluginJS.length > 0) {
      console.log(`  Plugin JS Files: ${pluginJS.length}`);
      const pluginSize = pluginJS.reduce((sum, js) => sum + js.size, 0);
      console.log(`    Total Plugin Size: ${formatBytes(pluginSize)}`);
    }
  }
  
  // Image analysis
  if (results.images.length > 0) {
    console.log('\n🖼️  Image Analysis:');
    const totalImageSize = results.images.reduce((sum, img) => sum + img.size, 0);
    const avgImageSize = totalImageSize / results.images.length;
    const largeImages = results.images.filter(img => img.isLarge).length;
    
    console.log(`  Total Images: ${results.images.length}`);
    console.log(`  Total Image Size: ${formatBytes(totalImageSize)}`);
    console.log(`  Average Image Size: ${formatBytes(avgImageSize)}`);
    console.log(`  Large Images (>${formatBytes(THRESHOLDS.imageMaxSize)}): ${largeImages}`);
    
    // Image format breakdown
    const formatCounts = {};
    results.images.forEach(img => {
      formatCounts[img.ext] = (formatCounts[img.ext] || 0) + 1;
    });
    console.log(`  Format Breakdown:`);
    Object.entries(formatCounts).forEach(([ext, count]) => {
      console.log(`    ${ext}: ${count}`);
    });
  }
  
  // Issues and warnings
  if (results.issues.length > 0) {
    console.log('\n❌ Issues:');
    results.issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  const recommendations = [];
  
  if (results.pages.length > 0 && results.pages[0].scriptsWithAsync < results.pages[0].scripts) {
    recommendations.push('Add async/defer attributes to non-critical scripts');
  }
  
  if (results.pages.length > 0 && results.pages[0].lazyImages === 0 && results.pages[0].images > 0) {
    recommendations.push('Add loading="lazy" to images below the fold');
  }
  
  if (results.images.length > 0) {
    const webpCount = results.images.filter(img => img.ext === '.webp').length;
    if (webpCount === 0) {
      recommendations.push('Consider converting images to WebP format for better compression');
    }
  }
  
  if (results.css && results.css.size > 50 * 1024) {
    recommendations.push('Consider CSS minification for production');
  }
  
  if (recommendations.length > 0) {
    recommendations.forEach(rec => console.log(`  - ${rec}`));
  } else {
    console.log('  ✅ No critical recommendations');
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Overall status
  if (results.issues.length === 0 && results.warnings.length < 5) {
    console.log('✅ Performance looks good!');
    process.exit(0);
  } else {
    console.log(`⚠️  Found ${results.issues.length} issue(s) and ${results.warnings.length} warning(s)`);
    process.exit(results.issues.length > 0 ? 1 : 0);
  }
}

runPerformanceTests();
