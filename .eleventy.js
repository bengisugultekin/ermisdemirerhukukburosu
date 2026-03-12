const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");
const sass = require("sass");

module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/static");
  
  // Compile SCSS and copy assets
  // Using a custom copy function to preserve directory structure
  eleventyConfig.on('eleventy.before', async () => {
    const copyDir = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    
    // Ensure dist directory exists
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Compile SCSS to CSS
    const scssFile = path.join(__dirname, 'src', 'assets', 'scss', 'main.scss');
    const cssOutputDir = path.join(__dirname, 'dist', 'css');
    
    if (fs.existsSync(scssFile)) {
      if (!fs.existsSync(cssOutputDir)) {
        fs.mkdirSync(cssOutputDir, { recursive: true });
      }
      
      try {
        const result = sass.compile(scssFile, {
          style: 'expanded',
          sourceMap: true,
          loadPaths: [path.join(__dirname, 'src', 'assets', 'scss')]
        });
        
        // Write compiled CSS
        fs.writeFileSync(
          path.join(cssOutputDir, 'style.css'),
          result.css
        );
        
        // Write source map if available
        if (result.sourceMap) {
          fs.writeFileSync(
            path.join(cssOutputDir, 'style.css.map'),
            JSON.stringify(result.sourceMap)
          );
        }
      } catch (error) {
        console.error('SCSS compilation error:', error);
        throw error;
      }
    }
    
    const distPlugins = path.join(__dirname, 'dist', 'plugins');
    const distJs = path.join(__dirname, 'dist', 'js');
    const distImages = path.join(__dirname, 'dist', 'images');
    const themePlugins = path.join(__dirname, 'theme', 'plugins');
    const themeJs = path.join(__dirname, 'theme', 'js');
    const themeImages = path.join(__dirname, 'theme', 'images');
    const srcAssetsJs = path.join(__dirname, 'src', 'assets', 'js');
    
    if (fs.existsSync(themePlugins)) {
      copyDir(themePlugins, distPlugins);
    }
    // Copy JS files - prefer theme/js if it exists, otherwise use src/assets/js
    if (fs.existsSync(themeJs)) {
      copyDir(themeJs, distJs);
    } else if (fs.existsSync(srcAssetsJs)) {
      copyDir(srcAssetsJs, distJs);
    }
    // Copy images from theme to dist/images
    if (fs.existsSync(themeImages)) {
      copyDir(themeImages, distImages);
    }
    // Override with logos from src/assets/images (new logos take precedence)
    const srcAssetsImages = path.join(__dirname, 'src', 'assets', 'images');
    const logoFiles = ['logo.png', 'mini-logo.svg', 'footer-logo.png'];
    if (fs.existsSync(srcAssetsImages)) {
      logoFiles.forEach(file => {
        const srcFile = path.join(srcAssetsImages, file);
        if (fs.existsSync(srcFile)) {
          fs.copyFileSync(srcFile, path.join(distImages, file));
        }
      });
    }
  });
  
  // Images are copied in the eleventy.before hook to dist/images
  
  // Copy favicon and other root files
  eleventyConfig.addPassthroughCopy({
    "theme/images/mini-logo.svg": "images/mini-logo.svg"
  });

  // Custom filters
  eleventyConfig.addFilter("formatDate", (dateObj) => {
    if (!dateObj) return "";
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj);
    }
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLLL yyyy");
  });

  eleventyConfig.addFilter("formatDateShort", (dateObj) => {
    if (!dateObj) return "";
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj);
    }
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd.MM.yyyy");
  });

  // Collections
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/articles/**/*.md").filter(item => {
      return !item.data.draft;
    });
  });

  // Category collections
  eleventyConfig.addCollection("aile-hukuku", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/articles/aile-hukuku/*.md").filter(item => {
      return !item.data.draft && item.fileSlug !== "index";
    });
  });

  eleventyConfig.addCollection("ceza-hukuku", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/articles/ceza-hukuku/*.md").filter(item => {
      return !item.data.draft && item.fileSlug !== "index";
    });
  });

  eleventyConfig.addCollection("icra-hukuku", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/articles/icra-hukuku/*.md").filter(item => {
      return !item.data.draft && item.fileSlug !== "index";
    });
  });

  eleventyConfig.addCollection("tuketici-hukuku", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/articles/tuketici-hukuku/*.md").filter(item => {
      return !item.data.draft && item.fileSlug !== "index";
    });
  });

  eleventyConfig.addCollection("dava-turleri", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/articles/dava-turleri/*.md").filter(item => {
      return !item.data.draft && item.fileSlug !== "index";
    });
  });

  // Markdown configuration
  eleventyConfig.setLibrary("md", require("markdown-it")({
    html: true,
    breaks: true,
    linkify: true
  }));

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
