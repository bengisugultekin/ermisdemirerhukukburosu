# Ermiş Hukuk Bürosu Website

Modern, maintainable static website built with Eleventy (11ty), Nunjucks templates, and Markdown content.

## Project Structure

```
ermishukukburosuburosu/
├── src/                          # Source files
│   ├── _data/                    # Global data files (JSON)
│   │   ├── site.json            # Site metadata, contact info
│   │   ├── navigation.json      # Menu structure
│   │   └── services.json        # Service categories
│   ├── _includes/               # Reusable template partials
│   │   ├── layouts/            # Page layouts
│   │   ├── components/         # Reusable components
│   │   └── macros/            # Template macros
│   ├── content/                 # Markdown content files
│   │   ├── pages/              # Regular pages
│   │   └── articles/           # Legal articles by category
│   ├── assets/                  # Static assets
│   │   ├── scss/               # Stylesheets
│   │   ├── js/                 # JavaScript files
│   │   └── images/             # Images
│   └── static/                  # Files copied as-is
├── dist/                        # Build output (deployed)
├── .eleventy.js                 # Eleventy configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server with live reload:

```bash
npm run dev
```

The site will be available at `http://localhost:8080`

### Build

Build the site for production:

```bash
npm run build
```

Output will be in the `dist/` directory.

## Adding Content

### Adding a New Article

1. Create a new Markdown file in the appropriate category folder:
   ```
   src/content/articles/aile-hukuku/yeni-makale.md
   ```

2. Add frontmatter with required metadata:
   ```markdown
   ---
   title: "Makale Başlığı"
   description: "SEO açıklaması"
   category: "aile-hukuku"
   categoryTitle: "Aile Hukuku"
   date: 2024-03-31
   layout: "layouts/article.njk"
   permalink: "/yeni-makale/"
   breadcrumbs:
     - { title: "Anasayfa", url: "/" }
     - { title: "Aile Hukuku", url: "/aile-hukuku/" }
     - { title: "Makale Başlığı", url: "/yeni-makale/" }
   ---
   
   # Makale İçeriği
   
   Markdown içeriğiniz buraya...
   ```

3. The article will automatically appear in the category listing page.

### Adding a New Page

1. Create a Markdown file in `src/content/pages/`:
   ```
   src/content/pages/yeni-sayfa.md
   ```

2. Add frontmatter:
   ```markdown
   ---
   title: "Sayfa Başlığı"
   description: "Sayfa açıklaması"
   layout: "layouts/page.njk"
   permalink: "/yeni-sayfa/"
   breadcrumbs:
     - { title: "Anasayfa", url: "/" }
     - { title: "Sayfa Başlığı", url: "/yeni-sayfa/" }
   ---
   
   Sayfa içeriği...
   ```

### Updating Navigation

Edit `src/_data/navigation.json` to add or modify menu items.

### Updating Site Information

Edit `src/_data/site.json` to update contact information, social media links, etc.

## Deployment

The site is configured to deploy to Netlify. The build command runs automatically on push to the main branch.

### Manual Deployment

1. Build the site:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your static hosting service.

## Technology Stack

- **Eleventy (11ty)** - Static site generator
- **Nunjucks** - Template engine
- **Markdown** - Content format
- **Bootstrap 4.5** - CSS framework
- **jQuery** - JavaScript library

## File Naming Conventions

- **Files**: kebab-case (e.g., `aile-hukuku.md`)
- **Directories**: lowercase, hyphenated (e.g., `legal-articles/`)
- **CSS Classes**: BEM methodology for custom components
- **Variables**: Descriptive, prefixed (e.g., `$color-primary`)

## Best Practices

1. **Content**: Write content in Markdown, keep HTML out of content files
2. **Templates**: Use Nunjucks includes for reusable components
3. **Data**: Store configuration in JSON files in `_data/`
4. **Images**: Place images in `src/assets/images/` organized by purpose
5. **SEO**: Always include title, description, and breadcrumbs in frontmatter

## Troubleshooting

### Build Errors

- Check that all template syntax is correct (Nunjucks)
- Verify that all referenced data files exist
- Ensure image paths are correct (use `/images/...` not `images/...`)

### Content Not Appearing

- Verify the frontmatter is correct (YAML syntax)
- Check that the layout file exists
- Ensure the permalink is unique

## License

Copyright © Ermiş Hukuk Bürosu
