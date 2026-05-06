# Products Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Продукты" menu item to both navigations linking to a new `products.html` page describing the ICV 2.0 software product.

**Architecture:** Static HTML page in the existing Gulp pipeline. A dedicated products sprite is built from `src/img/icons/products/` (separate from the main `sprite.svg`). PDF placeholders live in `src/public/` and are copied as-is to `build/public/`. All styles compile through the single `style.scss` entry point via a new `products.scss` block. The shared `index.js` is guarded so it does not crash on pages without a news section.

**Tech Stack:** Gulp 5, Dart Sass (`@use` syntax), gulp-svgstore, plain HTML, Node.js (PDF placeholder creation)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `gulpfile.js` | Limit main sprite to root icons, add products sprite task, copy `src/public/` |
| Create | `src/img/icons/products/video-camera.svg` | Icon: continuous video feed |
| Create | `src/img/icons/products/car-recognition.svg` | Icon: vehicle recognition |
| Create | `src/img/icons/products/monitor-online.svg` | Icon: online viewing |
| Create | `src/img/icons/products/pass-card.svg` | Icon: pass management |
| Create | `src/img/icons/products/parking-zone.svg` | Icon: parking zone settings |
| Create | `src/img/icons/products/integration.svg` | Icon: integration scenarios |
| Create | `src/public/Opisanie_PO_ICV_2.0.pdf` | Placeholder PDF (will be replaced) |
| Create | `src/public/Rukovodstvo_polzovatelya_ICV_2.0.pdf` | Placeholder PDF (will be replaced) |
| Create | `src/scss/blocks/products.scss` | All product page styles |
| Modify | `src/scss/style.scss` | Import products.scss |
| Create | `src/products.html` | Full product page HTML |
| Modify | `src/js/index.js` | Null-guard news toggler (prevents crash on products page) |
| Modify | `src/index.html` | Add "Продукты" nav item to header and footer |

---

## Task 1: Gulpfile — separate products sprite + copy `src/public/`

**Files:**
- Modify: `gulpfile.js`

The current `createSprite` uses `src/img/icons/**/*.svg` (recursive). Since we'll add icons in a subfolder `products/`, they must NOT end up in the main sprite — otherwise `sprite.svg` would gain unexpected symbols. We scope the main sprite to root icons only, add a parallel task for the products sprite, and extend `createCopy` to include `src/public/**/*`.

- [ ] **Step 1: Limit main sprite to root icons**

In `gulpfile.js`, change the `createSprite` source glob:

```js
const createSprite = () =>
  src('src/img/icons/*.svg')          // was: 'src/img/icons/**/*.svg'
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(svgstore())
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'));
```

- [ ] **Step 2: Add `createProductsSprite` task**

Immediately after the `createSprite` function, add:

```js
const createProductsSprite = () =>
  src('src/img/icons/products/*.svg')
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(svgstore())
    .pipe(rename('products-sprite.svg'))
    .pipe(dest('build/img'));
```

- [ ] **Step 3: Add `src/public/**/*` to `createCopy`**

Extend the sources array in `createCopy` (keep `encoding: false, base: 'src'` so `src/public/foo.pdf` → `build/public/foo.pdf`):

```js
const createCopy = done => {
  src(
    [
      'src/fonts/*.{woff2,woff}',
      'src/*.ico',
      'src/img/*.{webp,png,jpg,gif,svg}',
      '*.webmanifest',
      'src/sitemap.xml',
      'src/robots.txt',
      'src/public/**/*',              // ← ADD
    ],
    { encoding: false, base: 'src' }
  ).pipe(dest('build'));
  done();
};
```

- [ ] **Step 4: Add `createProductsSprite` to build series**

Both the `build` export and the `default` export call `parallel(styles, minifyHtml, compressScripts, createSprite)`. Add `createProductsSprite` to both:

```js
const build = series(
  clean,
  createCopy,
  copyFavicons,
  parallel(styles, minifyHtml, compressScripts, createSprite, createProductsSprite)
);

export default series(
  clean,
  createCopy,
  copyFavicons,
  parallel(styles, minifyHtml, compressScripts, createSprite, createProductsSprite),
  series(server, watcher)
);
```

- [ ] **Step 5: Commit**

```bash
git add gulpfile.js
git commit -m "build: add products sprite task and public folder copy"
```

---

## Task 2: Six SVG icons

**Files:**
- Create: `src/img/icons/products/video-camera.svg`
- Create: `src/img/icons/products/car-recognition.svg`
- Create: `src/img/icons/products/monitor-online.svg`
- Create: `src/img/icons/products/pass-card.svg`
- Create: `src/img/icons/products/parking-zone.svg`
- Create: `src/img/icons/products/integration.svg`

All icons use `stroke="currentColor" fill="none"` so the parent's CSS `color` property controls stroke colour. Viewbox is `0 0 32 32`.

- [ ] **Step 1: Create `src/img/icons/products/video-camera.svg`**

```xml
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="9" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
  <circle cx="11" cy="16" r="4.5" stroke="currentColor" stroke-width="1.5"/>
  <path d="M21 13L30 10V22L21 19V13Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 2: Create `src/img/icons/products/car-recognition.svg`**

```xml
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 20V18L10 11H22L25 18V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="5" y1="20" x2="27" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <circle cx="10" cy="23" r="2.5" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="22" cy="23" r="2.5" stroke="currentColor" stroke-width="1.5"/>
  <line x1="2" y1="14" x2="2" y2="27" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
  <line x1="30" y1="14" x2="30" y2="27" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
</svg>
```

- [ ] **Step 3: Create `src/img/icons/products/monitor-online.svg`**

```xml
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="3" width="28" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
  <path d="M13 29H19M16 23V29" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M13 9.5L21 13L13 16.5V9.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 4: Create `src/img/icons/products/pass-card.svg`**

```xml
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" stroke-width="2"/>
  <circle cx="11" cy="14" r="3.5" stroke="currentColor" stroke-width="1.5"/>
  <path d="M6 26C6 22.7 8.2 20 11 20C13.8 20 16 22.7 16 26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="20" y1="12" x2="27" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="16" x2="27" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="20" x2="25" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 5: Create `src/img/icons/products/parking-zone.svg`**

```xml
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
  <path d="M11 24V8H19.5C22.5 8 24.5 10 24.5 13C24.5 16 22.5 18 19.5 18H11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 6: Create `src/img/icons/products/integration.svg`**

```xml
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="11" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
  <rect x="19" y="2" width="11" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
  <rect x="10.5" y="19" width="11" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
  <path d="M7.5 13V19L16 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24.5 13V19L16 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 7: Verify sprite builds correctly**

```bash
npx gulp build 2>&1 | tail -5
```
Expected: no errors.

```bash
grep "symbol id" build/img/products-sprite.svg
```
Expected (6 lines, one per icon):
```
<symbol id="icon-video-camera"
<symbol id="icon-car-recognition"
<symbol id="icon-monitor-online"
<symbol id="icon-pass-card"
<symbol id="icon-parking-zone"
<symbol id="icon-integration"
```

Also confirm main sprite was NOT polluted:
```bash
grep "symbol id" build/img/sprite.svg
```
Expected: only `icon-location`, `icon-toggler`, `icon-arrow` — no product icons.

- [ ] **Step 8: Commit**

```bash
git add src/img/icons/products/
git commit -m "feat: add SVG icons for product functions"
```

---

## Task 3: PDF placeholder files

**Files:**
- Create: `src/public/Opisanie_PO_ICV_2.0.pdf`
- Create: `src/public/Rukovodstvo_polzovatelya_ICV_2.0.pdf`

These are minimal valid PDF 1.4 files (will be replaced by the client later). Byte offsets in the xref table are pre-calculated: obj1@9, obj2@52, obj3@101, xref@164.

- [ ] **Step 1: Create both PDFs via Node.js**

```bash
node -e "
const fs = require('fs');
fs.mkdirSync('src/public', { recursive: true });
const pdf = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n164\n%%EOF';
fs.writeFileSync('src/public/Opisanie_PO_ICV_2.0.pdf', pdf, 'utf8');
fs.writeFileSync('src/public/Rukovodstvo_polzovatelya_ICV_2.0.pdf', pdf, 'utf8');
console.log('done');
"
```

- [ ] **Step 2: Verify they land in build**

```bash
npx gulp build 2>&1 | tail -5
ls build/public/
```
Expected:
```
Opisanie_PO_ICV_2.0.pdf   Rukovodstvo_polzovatelya_ICV_2.0.pdf
```

- [ ] **Step 3: Commit**

```bash
git add src/public/
git commit -m "feat: add placeholder PDF files for product documentation"
```

---

## Task 4: `products.scss` and style import

**Files:**
- Create: `src/scss/blocks/products.scss`
- Modify: `src/scss/style.scss`

`@use` paths follow the same convention as every other block file in this project (e.g., `features.scss` uses `@use './global/mixins'` — relative to the blocks folder).

The `.product-hero` top padding (`7.375rem` mobile) mirrors `.hero` to clear the sticky header (which has `margin-bottom: -4.125rem` and overlaps the first section).

- [ ] **Step 1: Create `src/scss/blocks/products.scss`**

```scss
@use './global/mixins';
@use './global/vars';

.product-hero {
  padding: 7.375rem vars.$mobile-padding 4rem;
  background-color: vars.$color-primary;

  @include mixins.tablet {
    padding: 8rem vars.$tablet-padding 6rem;
  }

  @include mixins.desktop {
    padding: 9rem vars.$laptop-padding 7rem;
  }

  @include mixins.bigScreen {
    padding: 9rem vars.$big-screen-padding 7rem;
  }
}

.product-hero__container {
  max-width: vars.$max-content-width;
  margin: 0 auto;
}

.product-hero__title {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
  color: vars.$color-white;

  @include mixins.tablet {
    font-size: 2.5rem;
  }

  @include mixins.desktop {
    font-size: 3rem;
  }
}

.product-hero__desc {
  max-width: 50rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);

  @include mixins.tablet {
    font-size: 1.25rem;
  }
}

.product-functions {
  max-width: vars.$max-content-width;
  padding: 2.25rem vars.$mobile-padding 3rem;
  margin: 0 auto;
  text-align: center;

  @include mixins.tablet {
    padding: 7.938rem vars.$tablet-padding 7.938rem;
  }

  @include mixins.desktop {
    padding: 7rem vars.$laptop-padding 7rem;
  }

  @include mixins.bigScreen {
    padding: 7rem vars.$big-screen-padding 7rem;
  }
}

.product-functions__list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-top: 2.25rem;
  text-align: left;

  @include mixins.tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 4rem;
  }

  @include mixins.desktop {
    grid-template-columns: repeat(3, 1fr);
  }
}

.product-functions__item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem;
  background-color: vars.$color-bg;
  border-radius: 16px;

  p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: vars.$color-secondary;

    @include mixins.tablet {
      font-size: 1.125rem;
    }
  }
}

.product-functions__icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: vars.$color-primary;
}

.product-docs {
  background-color: vars.$color-bg;
  padding: 2.25rem vars.$mobile-padding 3rem;

  @include mixins.tablet {
    padding: 5rem vars.$tablet-padding;
  }

  @include mixins.desktop {
    padding: 5rem vars.$laptop-padding;
  }

  @include mixins.bigScreen {
    padding: 5rem vars.$big-screen-padding;
  }
}

.product-docs__container {
  max-width: vars.$max-content-width;
  margin: 0 auto;
  text-align: center;
}

.product-docs__info {
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  margin: 2rem auto 2.5rem;
  text-align: left;
  border: 3px solid vars.$color-primary;
  border-radius: 44px;
}

.product-docs__note {
  font-size: 1rem;
  font-weight: 600;
  color: vars.$color-secondary-dark;

  @include mixins.tablet {
    font-size: 1.25rem;
  }
}

.product-docs__downloads {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @include mixins.tablet {
    flex-direction: row;
    justify-content: center;
  }
}

.product-docs__dl-btn {
  display: inline-block;
  padding: 0 1.5rem;
  font-size: 0.875rem;

  @include mixins.tablet {
    font-size: 1rem;
  }
}
```

- [ ] **Step 2: Import in `src/scss/style.scss`**

Add the following line at the end of `src/scss/style.scss`, after `@use './blocks/footer';`:

```scss
@use './blocks/products';
```

- [ ] **Step 3: Verify SCSS compiles**

```bash
npx gulp build 2>&1 | grep -iE "error|Error"
```
Expected: no output (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/scss/blocks/products.scss src/scss/style.scss
git commit -m "feat: add products page SCSS"
```

---

## Task 5: `products.html`

**Files:**
- Create: `src/products.html`

The page is a full copy of the `index.html` shell (same `<head>`, header, footer, dialog) with:
- Header nav links pointing to `index.html` anchors (not local `#` anchors, which don't exist on this page)
- `<main>` replaced with 3 product sections
- Footer nav also updated to `index.html`-relative links

- [ ] **Step 1: Create `src/products.html`**

```html
<!doctype html>
<html lang="ru" class="page">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/style.min.css" />
    <link rel="icon" type="image/png" href="favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <link rel="shortcut icon" href="favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="icv.systems" />
    <link rel="manifest" href="site.webmanifest" />
    <title>Продукты — Спецвидеоаналитика</title>
    <meta
      name="description"
      content="Система контроля управления доступом ICV 2.0 — автоматизация пропуска автомобилей с помощью видеоаналитики"
    />
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
      (function (m, e, t, r, i, k, a) {
        m[i] =
          m[i] ||
          function () {
            (m[i].a = m[i].a || []).push(arguments);
          };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) {
            return;
          }
        }
        (k = e.createElement(t)),
          (a = e.getElementsByTagName(t)[0]),
          (k.async = 1),
          (k.src = r),
          a.parentNode.insertBefore(k, a);
      })(
        window,
        document,
        'script',
        'https://mc.yandex.ru/metrika/tag.js',
        'ym'
      );

      ym(56216185, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      });
    </script>
    <!-- /Yandex.Metrika counter -->
  </head>
  <body class="body">
    <noscript
      ><div>
        <img
          src="https://mc.yandex.ru/watch/56216185"
          style="position: absolute; left: -9999px"
          alt=""
          aria-hidden="true"
        /></div
    ></noscript>
    <header class="header">
      <div class="header__container">
        <div class="header__top">
          <picture class="header__logo">
            <source media="(min-width: 300px)" srcset="img/logo.svg" />
            <img
              src="img/logo-min.svg"
              width="235"
              height="39"
              alt="Спецвидеоаналитика логотип"
            />
          </picture>

          <button class="menu__toggler">
            <span class="visually-hidden">Открыть меню</span>
            <span class="toggler__center"></span>
          </button>
          <nav class="menu">
            <ul class="menu__list">
              <li class="menu__item">
                <a href="index.html" class="menu__link">Главная</a>
              </li>
              <li class="menu__item">
                <a href="index.html#features" class="menu__link">О системе</a>
              </li>
              <li class="menu__item">
                <a href="index.html#solutions" class="menu__link">Решения</a>
              </li>
              <li class="menu__item">
                <a href="index.html#tariffs" class="menu__link">Тарифы</a>
              </li>
              <li class="menu__item">
                <a href="index.html#about" class="menu__link">О нас</a>
              </li>
              <li class="menu__item">
                <a href="index.html#news" class="menu__link">Новости</a>
              </li>
              <li class="menu__item">
                <a href="products.html" class="menu__link">Продукты</a>
              </li>
              <li class="menu__item">
                <a href="#footer" class="menu__link">Контакты</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
    <main>
      <section class="product-hero">
        <div class="product-hero__container">
          <h1 class="product-hero__title">
            Система контроля управления доступом ICV&nbsp;2.0
          </h1>
          <p class="product-hero__desc">
            ПО предназначено для автоматизации и снижения стоимости
            эксплуатации системы пропуска автомобилей на ограниченную для
            проезда территорию с помощью анализа видеоизображения и
            распознавания инцидентов
          </p>
        </div>
      </section>

      <section class="product-functions">
        <h2 class="section__title">ФУНКЦИИ СИСТЕМЫ</h2>
        <ul class="product-functions__list">
          <li class="product-functions__item">
            <svg
              class="product-functions__icon"
              width="32"
              height="32"
              aria-hidden="true"
            >
              <use xlink:href="img/products-sprite.svg#icon-video-camera"></use>
            </svg>
            <p>
              Непрерывное получение видеоизображения от видеокамер и анализ
              видеоизображения в режиме реального времени
            </p>
          </li>
          <li class="product-functions__item">
            <svg
              class="product-functions__icon"
              width="32"
              height="32"
              aria-hidden="true"
            >
              <use
                xlink:href="img/products-sprite.svg#icon-car-recognition"
              ></use>
            </svg>
            <p>Распознавание автомобиля и его ключевых характеристик</p>
          </li>
          <li class="product-functions__item">
            <svg
              class="product-functions__icon"
              width="32"
              height="32"
              aria-hidden="true"
            >
              <use
                xlink:href="img/products-sprite.svg#icon-monitor-online"
              ></use>
            </svg>
            <p>
              Просмотр видеоизображения и управление парковкой в режиме онлайн
            </p>
          </li>
          <li class="product-functions__item">
            <svg
              class="product-functions__icon"
              width="32"
              height="32"
              aria-hidden="true"
            >
              <use xlink:href="img/products-sprite.svg#icon-pass-card"></use>
            </svg>
            <p>Управление пропусками</p>
          </li>
          <li class="product-functions__item">
            <svg
              class="product-functions__icon"
              width="32"
              height="32"
              aria-hidden="true"
            >
              <use
                xlink:href="img/products-sprite.svg#icon-parking-zone"
              ></use>
            </svg>
            <p>Настройка парковочных зон</p>
          </li>
          <li class="product-functions__item">
            <svg
              class="product-functions__icon"
              width="32"
              height="32"
              aria-hidden="true"
            >
              <use
                xlink:href="img/products-sprite.svg#icon-integration"
              ></use>
            </svg>
            <p>Настройка сценариев интеграции с внешними системами</p>
          </li>
        </ul>
      </section>

      <section class="product-docs">
        <div class="product-docs__container">
          <h2 class="section__title">ДОКУМЕНТАЦИЯ</h2>
          <div class="product-docs__info">
            <p class="product-docs__note">
              Стоимость ПО рассчитывается индивидуально
            </p>
            <p class="product-docs__note">
              Использовать ПО на условиях открытой лицензии нельзя
            </p>
          </div>
          <div class="product-docs__downloads">
            <a
              href="public/Opisanie_PO_ICV_2.0.pdf"
              download
              class="callback__btn product-docs__dl-btn"
              >Opisanie_PO_ICV_2.0.pdf</a
            >
            <a
              href="public/Rukovodstvo_polzovatelya_ICV_2.0.pdf"
              download
              class="callback__btn product-docs__dl-btn"
              >Rukovodstvo_polzovatelya_ICV_2.0.pdf</a
            >
          </div>
        </div>
      </section>
    </main>
    <footer class="footer" id="footer">
      <div class="footer__container">
        <picture class="footer__logo__container">
          <img
            class="footer__logo"
            src="img/logo.svg"
            width="251"
            height="44"
            alt="Спецвидеоаналитика логотип"
          />
        </picture>
        <address class="footer__address">
          ООО&nbsp;"Спецвидеоаналитика" <br />
          196084 город Санкт-Петербург, Кронверкский&nbsp;пр.,&nbsp;49
        </address>
        <nav class="footer__menu">
          <ul class="footer__menu__list">
            <li class="footer__menu__item">
              <a href="index.html" class="menu__link">Главная</a>
            </li>
            <li class="footer__menu__item">
              <a href="index.html#features" class="menu__link">О системе</a>
            </li>
            <li class="footer__menu__item">
              <a href="index.html#solutions" class="menu__link">Решения</a>
            </li>
            <li class="footer__menu__item">
              <a href="index.html#tariffs" class="menu__link">Тарифы</a>
            </li>
            <li class="footer__menu__item">
              <a href="index.html#about" class="menu__link">О нас</a>
            </li>
            <li class="footer__menu__item">
              <a href="index.html#news" class="menu__link">Новости</a>
            </li>
            <li class="footer__menu__item">
              <a href="products.html" class="menu__link">Продукты</a>
            </li>
            <li class="footer__menu__item">
              <a href="#footer" class="menu__link">Контакты</a>
            </li>
          </ul>
        </nav>
        <div class="footer__contacts">
          <div class="footer__phone">
            <a href="tel:+7(964)387-27-71">+7 (964) 387-27-71</a>
          </div>
          <div class="footer__email">
            <a href="mailto:info@icv.systems">info@icv.systems</a>
          </div>
        </div>
        <div class="footer__copyright">
          <p>Copyright © 2025 ICV Limited</p>
        </div>
      </div>
    </footer>
    <dialog class="modal" id="modal" aria-describedby="dialog-content">
      <div class="modal__content" id="dialog-content">
        <div class="modal__phone__container">
          <a href="tel:+7(964)387-27-71">тел: +7 (964) 387-27-71</a>
        </div>
        <button id="close-btn" aria-label="Закрыть окно" class="callback__btn">
          OK
        </button>
      </div>
    </dialog>
    <script src="js/index.min.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/products.html
git commit -m "feat: add products.html page"
```

---

## Task 6: Guard news toggler in `index.js`

**Files:**
- Modify: `src/js/index.js`

`index.js` is the shared JS bundle. On `products.html`, `#news-toggler` and `.news__list` don't exist, so `newsToggler.addEventListener(...)` would throw. The `const` declarations (lines 62–63) are safe since `querySelector` returns `null` without error; only the calls on those nulls need guarding.

- [ ] **Step 1: Wrap the news toggler IIFE and the `mobileMatch` handler**

In `src/js/index.js`, replace the block starting at `(function initNewsToggler()` through to the end of the `mobileMatch.addEventListener` call:

Replace:
```js
(function initNewsToggler() {
  if (mobileMatch.matches) {
    closeSection();
  }
  newsToggler.addEventListener('click', toggleSection);
})();

mobileMatch.addEventListener('change', () => {
  if (
    !mobileMatch.matches &&
    newsContent.classList.contains('news__list--closed')
  ) {
    openSection();
  }
});
```

With:
```js
if (newsToggler && newsContent) {
  (function initNewsToggler() {
    if (mobileMatch.matches) {
      closeSection();
    }
    newsToggler.addEventListener('click', toggleSection);
  })();

  mobileMatch.addEventListener('change', () => {
    if (
      !mobileMatch.matches &&
      newsContent.classList.contains('news__list--closed')
    ) {
      openSection();
    }
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/js/index.js
git commit -m "fix: guard news toggler init for pages without news section"
```

---

## Task 7: Add "Продукты" to `index.html` navigation

**Files:**
- Modify: `src/index.html`

- [ ] **Step 1: Add to header nav**

In `src/index.html`, find the header `ul.menu__list`. Between the "Новости" `<li>` and the "Контакты" `<li>`, insert:

```html
              <li class="menu__item">
                <a href="products.html" class="menu__link">Продукты</a>
              </li>
```

- [ ] **Step 2: Add to footer nav**

Find `ul.footer__menu__list`. Between "Новости" and "Контакты" `<li>` items, insert:

```html
            <li class="footer__menu__item">
              <a href="products.html" class="menu__link">Продукты</a>
            </li>
```

- [ ] **Step 3: Commit**

```bash
git add src/index.html
git commit -m "feat: add Продукты nav item to index.html"
```

---

## Task 8: Final build verification

- [ ] **Step 1: Full clean build**

```bash
npx gulp build
```
Expected: completes with no errors.

- [ ] **Step 2: Verify all artefacts exist**

```bash
ls build/ | grep -E "index|products"
ls build/public/
ls build/img/ | grep sprite
```
Expected:
```
# build/
index.html
products.html

# build/public/
Opisanie_PO_ICV_2.0.pdf
Rukovodstvo_polzovatelya_ICV_2.0.pdf

# build/img/ grep sprite:
products-sprite.svg
sprite.svg
```

- [ ] **Step 3: Start dev server and visually verify**

```bash
npx gulp
```

Open `http://localhost:3000`. Check all of the following:

**On `index.html`:**
- "Продукты" visible in header nav (between "Новости" and "Контакты")
- "Продукты" visible in footer nav
- Clicking "Продукты" in header navigates to `products.html`

**On `products.html`:**
- Blue hero section shows "Система контроля управления доступом ICV 2.0" and the purpose text
- "ФУНКЦИИ СИСТЕМЫ" section shows 6 cards with blue stroke icons (video camera, car, monitor, pass card, parking P, integration nodes)
- "ДОКУМЕНТАЦИЯ" section shows a blue-bordered card with 2 licensing phrases
- Two blue download buttons labelled with the PDF filenames
- Clicking a download button initiates file download
- Header nav "Главная" / "О системе" / etc. navigate to `index.html` sections correctly
- "Контакты" link scrolls to the footer on the current page
- Mobile: hamburger menu works, shows all 8 items including "Продукты"
- No JS console errors on either page
