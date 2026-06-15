# Product Hero Redesign

**Date:** 2026-05-07
**Scope:** `src/scss/blocks/products.scss` + `src/icv_2.html` (`.product-hero` block only)

## Goal

Modernise the `.product-hero` section while keeping the existing colour palette. The current block is a flat solid-blue rectangle with no visual interest.

## Approved Design

Split-layout hero combining two brainstormed ideas:

- **Left:** title + description, no badge, no CTA button
- **Right:** concentric rings + central icon (video camera SVG), purely decorative
- **Title:** "ICV 2.0" rendered in accent colour `#a8caff` (light blue) using `<em>` or `<span>` — no change to tag semantics of `<h1>`
- **Background:** linear gradient `#003bbf → #005efe → #4f90ff` (left to right, 120 deg)
- **Decorative dots:** four small circles (`#a8caff` at 45% opacity) scattered around the right panel

## Colour Values (all within existing palette)

| Token | Value | Usage |
| --- | --- | --- |
| `$color-primary` | `#005efe` | gradient mid |
| `#003bbf` | literal, not a var (darker than `$color-primary-dark: #004bcb`) | gradient start |
| `$color-primary-light` | `#4f90ff` | gradient end |
| `#a8caff` | new accent, not a var | "ICV 2.0" text colour |
| `rgba(255,255,255,…)` | existing | rings, icon, dots |

## Layout & Structure

```
.product-hero                        ← flex row, min-height responsive
  .product-hero__container (removed — replaced by flex children directly)
    .product-hero__left              ← flex: 1, padding, text content
      h1.product-hero__title
        (text) … доступом
        em.product-hero__title-accent   ← "ICV 2.0" in #a8caff
    .product-hero__right             ← fixed width ~280px desktop, hidden mobile
      .product-hero__ring (×2)       ← pure CSS circles via border-radius
      .product-hero__circle          ← filled semi-transparent circle
      .product-hero__icon            ← centred SVG video-camera
      .product-hero__dot (×4)        ← decorative dots
```

On mobile (`< 769px`) `.product-hero__right` is hidden (`display: none`) — the section reverts to a full-width text block, same padding as today.

## SCSS Changes

- Replace `background-color: vars.$color-primary` with the gradient
- Add `display: flex` + `align-items: stretch` to `.product-hero`
- New classes: `__left`, `__right`, `__ring`, `__ring2`, `__circle`, `__icon`, `__dot`
- Existing `__container`, `__title`, `__desc` classes are removed from the stylesheet; their styles migrate into `__left`, `__title`, `__desc` as before (same font sizes, responsive breakpoints)

## HTML Changes

- `src/icv_2.html`: restructure the interior of `<section class="product-hero">` — two child divs (`.product-hero__left`, `.product-hero__right`)
- Wrap "ICV&nbsp;2.0" in `<em class="product-hero__title-accent">` inside `<h1>`
- Inline SVG for the camera icon (already used elsewhere in the page via sprite — can reuse `#icon-video-camera` from `products-sprite.svg`)

## Out of Scope

- No changes to other sections (`product-functions`, `product-docs`)
- No new images or additional assets
- No JS changes
