# Products Page Design Spec
**Date:** 2026-05-06

## Overview

Add a "Продукты" item to the navigation menu that links to a new `products.html` page describing the software product "Система контроля управления доступом ICV 2.0". The page must match the existing site design.

---

## Navigation Changes

Add `<li class="menu__item"><a href="products.html" class="menu__link">Продукты</a></li>` to:
- Header nav `ul.menu__list` (after "Новости", before "Контакты")
- Footer nav `ul.footer__menu__list` (same position)

---

## New Page: `src/products.html`

Same `<head>`, `<header>`, `<footer>`, and `<dialog>` as `index.html`. The `<main>` contains three sections:

### Section 1 — Product Hero
- `<section class="product-hero">` with a blue background (reuse `.hero` styles or a simplified variant)
- `<h1>` — "Система контроля управления доступом ICV 2.0"
- `<p>` — назначение системы (the full purpose text from the spec)

### Section 2 — Functions (`product-functions`)
- `<h2 class="section__title">` — "ФУНКЦИИ СИСТЕМЫ"
- `<ul class="product-functions__list">` — 6 items, each with:
  - An SVG icon from the products sprite (`<use xlink:href="img/products-sprite.svg#icon-...">`)
  - `<p>` — function text
- Layout: single column on mobile, 2 columns on tablet, 3 columns on desktop

### Section 3 — Licensing & Documents (`product-docs`)
- `<h2 class="section__title">` — "ДОКУМЕНТАЦИЯ"
- Two styled info phrases (in a card, `border: 3px solid $color-primary`, `border-radius: 44px`):
  - "Стоимость ПО рассчитывается индивидуально"
  - "Использовать ПО на условиях открытой лицензии нельзя"
- Two PDF download links styled as `.callback__btn`:
  - `Opisanie_PO_ICV_2.0.pdf`
  - `Rukovodstvo_polzovatelya_ICV_2.0.pdf`
  - `href="public/..."`, `download` attribute

---

## SVG Icons (Products Sprite)

Create **6 simple path-based SVG files** in `src/img/icons/products/` — one per function. All at `32x32` viewBox, paths use `currentColor` (no hardcoded fill) so colour is controlled via CSS.

| File | Function |
|------|----------|
| `video-camera.svg` | Непрерывное получение видеоизображения |
| `car-recognition.svg` | Распознавание автомобиля и его характеристик |
| `monitor-online.svg` | Просмотр видеоизображения онлайн |
| `pass-card.svg` | Управление пропусками |
| `parking-zone.svg` | Настройка парковочных зон |
| `integration.svg` | Настройка сценариев интеграции |

The icons are **rendered inline** in the page for easier colour control (`fill: currentColor`). The products sprite is a separate file from the main `sprite.svg`.

**New Gulp task** `createProductsSprite`:
- Source: `src/img/icons/products/*.svg`
- Output: `build/img/products-sprite.svg`
- Add to `build` series and default series alongside existing `createSprite`

---

## New SCSS: `src/scss/blocks/products.scss`

Follows existing SCSS conventions (`@use './global/mixins'`, `@use './global/vars'`).

Key rules:
- `.product-hero` — dark blue background (`$color-primary`), white text, padding matching `.hero`
- `.product-hero__title` — large h1, white
- `.product-hero__desc` — subtitle text, white, max-width for readability
- `.product-functions` — padding matching `.features`
- `.product-functions__list` — CSS grid, 1 col → 2 col (tablet) → 3 col (desktop)
- `.product-functions__item` — flex row, gap, icon + text; icon `32px`, `color: $color-primary`
- `.product-docs` — padding matching `.tariffs`
- `.product-docs__card` — `border: 3px solid $color-primary`, `border-radius: 44px`, padding, two phrases as `<p>` with icon or bullet style
- `.product-docs__downloads` — flex row, gap, two buttons

Import in `src/scss/style.scss` after `footer`.

---

## PDF Placeholders

Create `src/public/Opisanie_PO_ICV_2.0.pdf` and `src/public/Rukovodstvo_polzovatelya_ICV_2.0.pdf` as minimal valid PDF files (will be replaced by client later).

**Gulpfile update** — add `src/public/**/*` to the `createCopy` source array with `encoding: false, base: 'src'` so files land in `build/public/`.

---

## Files Changed / Created

| Action | Path |
|--------|------|
| Modified | `src/index.html` — add "Продукты" nav item |
| Created | `src/products.html` |
| Created | `src/scss/blocks/products.scss` |
| Modified | `src/scss/style.scss` — import products.scss |
| Created | `src/img/icons/products/video-camera.svg` |
| Created | `src/img/icons/products/car-recognition.svg` |
| Created | `src/img/icons/products/monitor-online.svg` |
| Created | `src/img/icons/products/pass-card.svg` |
| Created | `src/img/icons/products/parking-zone.svg` |
| Created | `src/img/icons/products/integration.svg` |
| Created | `src/public/Opisanie_PO_ICV_2.0.pdf` |
| Created | `src/public/Rukovodstvo_polzovatelya_ICV_2.0.pdf` |
| Modified | `gulpfile.js` — add `createProductsSprite` task + copy `src/public/**/*` |
