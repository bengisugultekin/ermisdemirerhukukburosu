#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SRC_CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');

// Expected pages and articles
const EXPECTED_PAGES = [
  '/',
  '/about/',
  '/services/',
  '/contact/'
];

const EXPECTED_CATEGORIES = [
  'aile-hukuku',
  'ceza-hukuku',
  'icra-hukuku',
  'dava-turleri',
  'tuketici-hukuku',
  'is-hukuku',
  'ticaret-hukuku',
  'gayrimenkul-hukuku'
];

// Get all article files
function getArticleFiles() {
  const articlesDir = path.join(SRC_CONTENT_DIR, 'articles');
  const articles = [];
  
  function scanDir(dir, category) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath, entry.name);
      } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const permalinkMatch = frontmatter.match(/permalink:\s*["']([^"']+)["']/);
          if (permalinkMatch) {
            articles.push({
              file: fullPath,
              permalink: permalinkMatch[1],
              category: category || path.basename(path.dirname(fullPath))
            });
          }
        }
      }
    }
  }
  
  scanDir(articlesDir);
  return articles;
}

// Check if HTML file exists
function htmlFileExists(permalink) {
  let htmlPath;
  if (permalink === '/') {
    htmlPath = path.join(DIST_DIR, 'index.html');
  } else {
    // Remove leading/trailing slashes
    const cleanPath = permalink.replace(/^\/|\/$/g, '');
    htmlPath = path.join(DIST_DIR, cleanPath, 'index.html');
  }
  return fs.existsSync(htmlPath);
}

// Extract HTML metadata
function extractMetadata(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  const ogDescriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    description: descriptionMatch ? descriptionMatch[1].trim() : null,
    ogTitle: ogTitleMatch ? ogTitleMatch[1].trim() : null,
    ogDescription: ogDescriptionMatch ? ogDescriptionMatch[1].trim() : null,
    hasContent: html.length > 1000 // Basic check for content
  };
}

// Extract internal links from HTML
function extractLinks(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const links = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    // Only internal links (starting with / or relative)
    if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/http')) {
      links.push(href);
    }
  }
  
  return [...new Set(links)]; // Remove duplicates
}

// Check if link target exists
function linkExists(link) {
  if (link === '/') {
    return fs.existsSync(path.join(DIST_DIR, 'index.html'));
  }
  
  // Remove hash and query params
  const cleanLink = link.split('#')[0].split('?')[0];
  const cleanPath = cleanLink.replace(/^\/|\/$/g, '');
  
  if (!cleanPath) {
    return fs.existsSync(path.join(DIST_DIR, 'index.html'));
  }
  
  return fs.existsSync(path.join(DIST_DIR, cleanPath, 'index.html')) ||
         fs.existsSync(path.join(DIST_DIR, cleanPath + '.html'));
}

// Main test function
async function runTests() {
  console.log('🧪 Page Testing Tool\n');
  console.log('='.repeat(60));
  
  // Step 1: Build the site
  console.log('\n📦 Step 1: Building site...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Build completed successfully\n');
  } catch (error) {
    console.error('❌ Build failed!');
    process.exit(1);
  }
  
  // Step 2: Check if dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found!');
    process.exit(1);
  }
  
  const results = {
    pages: { passed: 0, failed: 0, issues: [] },
    articles: { passed: 0, failed: 0, issues: [] },
    categories: { passed: 0, failed: 0, issues: [] },
    seo: { passed: 0, failed: 0, issues: [] },
    links: { checked: 0, broken: 0, issues: [] }
  };
  
  // Step 3: Test pages
  console.log('📄 Step 2: Testing pages...');
  for (const page of EXPECTED_PAGES) {
    if (htmlFileExists(page)) {
      results.pages.passed++;
      const htmlPath = page === '/' 
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, page.replace(/^\/|\/$/g, ''), 'index.html');
      const metadata = extractMetadata(htmlPath);
      
      if (!metadata.title) {
        results.seo.failed++;
        results.seo.issues.push(`${page}: Missing title tag`);
      } else {
        results.seo.passed++;
      }
      
      if (!metadata.description) {
        results.seo.failed++;
        results.seo.issues.push(`${page}: Missing meta description`);
      } else {
        results.seo.passed++;
      }
      
      if (!metadata.hasContent) {
        results.pages.failed++;
        results.pages.issues.push(`${page}: Appears to have no content`);
      }
    } else {
      results.pages.failed++;
      results.pages.issues.push(`${page}: HTML file not found`);
    }
  }
  
  // Step 4: Test category pages
  console.log('📁 Step 3: Testing category pages...');
  for (const category of EXPECTED_CATEGORIES) {
    const categoryPath = `/${category}/`;
    if (htmlFileExists(categoryPath)) {
      results.categories.passed++;
    } else {
      results.categories.failed++;
      results.categories.issues.push(`${categoryPath}: HTML file not found`);
    }
  }
  
  // Step 5: Test articles
  console.log('📝 Step 4: Testing articles...');
  const articles = getArticleFiles();
  console.log(`   Found ${articles.length} articles to test\n`);
  
  for (const article of articles) {
    if (htmlFileExists(article.permalink)) {
      results.articles.passed++;
      
      const htmlPath = path.join(DIST_DIR, article.permalink.replace(/^\/|\/$/g, ''), 'index.html');
      const metadata = extractMetadata(htmlPath);
      
      if (!metadata.title) {
        results.seo.failed++;
        results.seo.issues.push(`${article.permalink}: Missing title tag`);
      } else {
        results.seo.passed++;
      }
      
      if (!metadata.description) {
        results.seo.failed++;
        results.seo.issues.push(`${article.permalink}: Missing meta description`);
      } else {
        results.seo.passed++;
      }
      
      // Check links in article
      const links = extractLinks(htmlPath);
      for (const link of links) {
        results.links.checked++;
        if (!linkExists(link)) {
          results.links.broken++;
          results.links.issues.push(`${article.permalink} → ${link}: Broken link`);
        }
      }
    } else {
      results.articles.failed++;
      results.articles.issues.push(`${article.permalink}: HTML file not found`);
    }
  }
  
  // Step 6: Test links on main pages
  console.log('🔗 Step 5: Testing links...');
  for (const page of EXPECTED_PAGES) {
    const htmlPath = page === '/' 
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, page.replace(/^\/|\/$/g, ''), 'index.html');
    
    if (fs.existsSync(htmlPath)) {
      const links = extractLinks(htmlPath);
      for (const link of links) {
        results.links.checked++;
        if (!linkExists(link)) {
          results.links.broken++;
          results.links.issues.push(`${page} → ${link}: Broken link`);
        }
      }
    }
  }
  
  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary\n');
  
  console.log('Pages:');
  console.log(`  ✅ Passed: ${results.pages.passed}/${EXPECTED_PAGES.length}`);
  console.log(`  ❌ Failed: ${results.pages.failed}`);
  if (results.pages.issues.length > 0) {
    console.log('  Issues:');
    results.pages.issues.forEach(issue => console.log(`    - ${issue}`));
  }
  
  console.log('\nCategory Pages:');
  console.log(`  ✅ Passed: ${results.categories.passed}/${EXPECTED_CATEGORIES.length}`);
  console.log(`  ❌ Failed: ${results.categories.failed}`);
  if (results.categories.issues.length > 0) {
    console.log('  Issues:');
    results.categories.issues.forEach(issue => console.log(`    - ${issue}`));
  }
  
  console.log('\nArticles:');
  console.log(`  ✅ Passed: ${results.articles.passed}/${articles.length}`);
  console.log(`  ❌ Failed: ${results.articles.failed}`);
  if (results.articles.issues.length > 0) {
    console.log('  Issues:');
    results.articles.issues.slice(0, 10).forEach(issue => console.log(`    - ${issue}`));
    if (results.articles.issues.length > 10) {
      console.log(`    ... and ${results.articles.issues.length - 10} more`);
    }
  }
  
  console.log('\nSEO Metadata:');
  const totalSeoChecks = results.seo.passed + results.seo.failed;
  console.log(`  ✅ Passed: ${results.seo.passed}/${totalSeoChecks}`);
  console.log(`  ❌ Failed: ${results.seo.failed}`);
  if (results.seo.issues.length > 0) {
    console.log('  Issues:');
    results.seo.issues.slice(0, 10).forEach(issue => console.log(`    - ${issue}`));
    if (results.seo.issues.length > 10) {
      console.log(`    ... and ${results.seo.issues.length - 10} more`);
    }
  }
  
  console.log('\nLinks:');
  console.log(`  ✅ Checked: ${results.links.checked}`);
  console.log(`  ❌ Broken: ${results.links.broken}`);
  if (results.links.issues.length > 0) {
    console.log('  Broken Links:');
    results.links.issues.slice(0, 10).forEach(issue => console.log(`    - ${issue}`));
    if (results.links.issues.length > 10) {
      console.log(`    ... and ${results.links.issues.length - 10} more`);
    }
  }
  
  // Overall status
  const totalFailed = results.pages.failed + results.categories.failed + 
                      results.articles.failed + results.links.broken;
  
  console.log('\n' + '='.repeat(60));
  if (totalFailed === 0) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.log(`❌ ${totalFailed} test(s) failed`);
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
