# SCSS Structure

This directory contains the SCSS source files for the website styles.

## Structure

```
src/assets/scss/
├── main.scss          # Main SCSS file (compiled to dist/css/style.css)
├── _variables.scss    # SCSS variables (for future refactoring)
└── README.md          # This file
```

## Compilation

SCSS files are automatically compiled during the Eleventy build process:

- **Input**: `src/assets/scss/main.scss`
- **Output**: `dist/css/style.css`
- **Source Map**: `dist/css/style.css.map`

## Build Process

The SCSS compilation happens in `.eleventy.js` during the `eleventy.before` hook:

1. SCSS files are compiled using the `sass` package
2. Compiled CSS is written to `dist/css/style.css`
3. Source maps are generated for debugging

## Future Refactoring

The current `main.scss` file contains all styles in a single file (converted from the original CSS). For better maintainability, consider refactoring into partials:

```
src/assets/scss/
├── main.scss
├── _variables.scss
├── _typography.scss
├── _layout.scss
├── _components.scss
├── _utilities.scss
└── ...
```

Then import them in `main.scss`:

```scss
@import 'variables';
@import 'typography';
@import 'layout';
@import 'components';
// etc.
```

## Usage

The compiled CSS is automatically included in all pages via `src/_includes/components/head.njk`:

```html
<link rel="stylesheet" href="/css/style.css">
```
