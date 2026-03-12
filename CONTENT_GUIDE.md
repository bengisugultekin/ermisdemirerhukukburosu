# Content Authoring Guide

This guide explains how to add and edit content on the Ermiş Hukuk Bürosu website.

## Table of Contents

1. [Adding Articles](#adding-articles)
2. [Adding Pages](#adding-pages)
3. [Frontmatter Reference](#frontmatter-reference)
4. [Markdown Syntax](#markdown-syntax)
5. [Images](#images)
6. [Categories](#categories)

## Adding Articles

Articles are legal content organized by category. Each article is a Markdown file in the appropriate category folder.

### Step-by-Step

1. **Choose the category folder**:
   - `src/content/articles/aile-hukuku/` - Family Law
   - `src/content/articles/ceza-hukuku/` - Criminal Law
   - `src/content/articles/icra-hukuku/` - Execution and Bankruptcy Law
   - etc.

2. **Create a new file** with a descriptive filename:
   ```
   src/content/articles/aile-hukuku/velayet-davasi.md
   ```

3. **Add frontmatter** at the top of the file:
   ```markdown
   ---
   title: "Velayet Davası"
   description: "Velayet davası süreçleri ve şartları hakkında bilgi"
   category: "aile-hukuku"
   categoryTitle: "Aile Hukuku"
   date: 2024-03-31
   layout: "layouts/article.njk"
   permalink: "/velayet-davasi/"
   breadcrumbs:
     - { title: "Anasayfa", url: "/" }
     - { title: "Aile Hukuku", url: "/aile-hukuku/" }
     - { title: "Velayet Davası", url: "/velayet-davasi/" }
   ---
   ```

4. **Write your content** in Markdown below the frontmatter:
   ```markdown
   # Velayet Davası
   
   Velayet davası, çocukların velayetinin belirlenmesi için açılan davadır...
   
   ## Velayet Davası Şartları
   
   1. Çocuğun menfaatleri
   2. Ebeveynlerin durumu
   ...
   ```

5. **Save the file**. The article will automatically appear in the category listing page.

## Adding Pages

Pages are standalone content pages (About, Contact, etc.).

### Step-by-Step

1. **Create a file** in `src/content/pages/`:
   ```
   src/content/pages/yeni-sayfa.md
   ```

2. **Add frontmatter**:
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
   ```

3. **Write content** in Markdown.

## Frontmatter Reference

Frontmatter is YAML metadata at the top of each content file.

### Required Fields

- `title` - Page/article title (displayed in browser tab and page)
- `layout` - Template to use (`layouts/article.njk`, `layouts/page.njk`, etc.)
- `permalink` - URL path (e.g., `/bosanma/`)

### Optional Fields

- `description` - SEO meta description
- `category` - Article category ID (for articles only)
- `categoryTitle` - Category display name (for articles only)
- `date` - Publication date (YYYY-MM-DD format)
- `breadcrumbs` - Navigation breadcrumbs array
- `draft` - Set to `true` to exclude from build

### Example Frontmatter

```markdown
---
title: "Boşanma Davası"
description: "Boşanma davası süreçleri ve avukat gerekliliği"
category: "aile-hukuku"
categoryTitle: "Aile Hukuku"
date: 2024-03-31
layout: "layouts/article.njk"
permalink: "/bosanma/"
breadcrumbs:
  - { title: "Anasayfa", url: "/" }
  - { title: "Aile Hukuku", url: "/aile-hukuku/" }
  - { title: "Boşanma", url: "/bosanma/" }
---
```

## Markdown Syntax

### Headings

```markdown
# H1 - Main Title
## H2 - Section Title
### H3 - Subsection
#### H4 - Sub-subsection
```

### Text Formatting

```markdown
**bold text**
*italic text*
[link text](https://example.com)
```

### Lists

```markdown
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

### Code

```markdown
Inline `code` with backticks

```
Code block with triple backticks
```
```

## Images

### Adding Images

1. Place image files in `src/assets/images/` organized by purpose:
   - `src/assets/images/services/` - Service images
   - `src/assets/images/team/` - Team photos
   - `src/assets/images/hero/` - Hero/banner images

2. Reference images in Markdown:
   ```markdown
   ![Alt text](/images/services/aile.jpg)
   ```

   **Important**: Always use `/images/...` (with leading slash) for image paths.

### Image Best Practices

- Use descriptive filenames: `bosanma-davasi.jpg` not `img1.jpg`
- Optimize images before uploading (compress, resize if needed)
- Use appropriate formats (JPG for photos, PNG for graphics)
- Include alt text for accessibility

## Categories

### Available Categories

- `aile-hukuku` - Aile Hukuku
- `ceza-hukuku` - Ceza Hukuku
- `icra-hukuku` - İcra ve İflas Hukuku
- `is-hukuku` - İş Hukuku
- `ticaret-hukuku` - Ticaret Hukuku
- `gayrimenkul-hukuku` - Gayrimenkul Hukuku
- `tuketici-hukuku` - Tüketici Hukuku
- `dava-turleri` - Dava Türleri

### Category Index Pages

Each category has an index page that lists all articles in that category. The index file is located at:

```
src/content/articles/[category-name]/index.md
```

Articles in a category automatically appear on the category index page.

## Tips

1. **Keep content focused**: One topic per article
2. **Use headings**: Structure content with proper heading hierarchy
3. **Write descriptively**: Clear titles and descriptions help SEO
4. **Check links**: Verify all internal links work
5. **Preview before publishing**: Use `npm run dev` to preview changes

## Common Issues

### Article Not Appearing

- Check that `category` matches the folder name
- Verify `draft` is not set to `true`
- Ensure the file is saved in the correct folder

### Images Not Showing

- Verify image path starts with `/images/`
- Check that image file exists in `src/assets/images/`
- Ensure image filename matches exactly (case-sensitive)

### Build Errors

- Check YAML syntax in frontmatter (proper indentation, quotes)
- Verify all required fields are present
- Ensure permalink is unique

## Getting Help

For technical issues or questions about content structure, contact the development team.
