const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");
const sass = require("sass");

module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy({"src/assets/images": "images"});
  eleventyConfig.addPassthroughCopy({"src/assets/js": "js"});
  eleventyConfig.addPassthroughCopy("src/static");

  // Compile SCSS
  eleventyConfig.on('eleventy.before', async () => {
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    const scssFile = path.join(__dirname, 'src', 'assets', 'scss', 'main.scss');
    const cssOutputDir = path.join(__dirname, 'dist', 'css');

    if (fs.existsSync(scssFile)) {
      if (!fs.existsSync(cssOutputDir)) {
        fs.mkdirSync(cssOutputDir, { recursive: true });
      }

      try {
        const result = sass.compile(scssFile, {
          style: 'compressed',
          sourceMap: true,
          loadPaths: [path.join(__dirname, 'src', 'assets', 'scss')],
          silenceDeprecations: ['import']
        });

        fs.writeFileSync(
          path.join(cssOutputDir, 'style.css'),
          result.css
        );

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

  eleventyConfig.addFilter("truncateWords", (str, count) => {
    if (!str) return "";
    const words = str.split(/\s+/);
    if (words.length <= count) return str;
    return words.slice(0, count).join(' ') + '...';
  });

  eleventyConfig.addFilter("shuffle", (array) => {
    if (!Array.isArray(array)) return array;
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Collections
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/articles/**/*.md").filter(item => {
      return !item.data.draft && item.data.layout === "layouts/article.njk";
    }).sort((a, b) => (b.date || 0) - (a.date || 0));
  });

  // Category collections
  const categories = ["aile-hukuku", "ceza-hukuku", "icra-hukuku", "tuketici-hukuku", "dava-turleri", "ticaret-hukuku", "is-hukuku", "gayrimenkul-hukuku", "kurumsal-hukuk", "vergi-hukuku"];

  categories.forEach(category => {
    eleventyConfig.addCollection(category, function(collectionApi) {
      return collectionApi.getFilteredByGlob(`src/content/articles/${category}/*.md`).filter(item => {
        return !item.data.draft && item.data.layout === "layouts/article.njk";
      }).sort((a, b) => (b.date || 0) - (a.date || 0));
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
