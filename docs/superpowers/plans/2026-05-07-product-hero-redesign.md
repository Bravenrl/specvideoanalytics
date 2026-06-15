# Product Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat solid-blue `.product-hero` with a modern split-layout — gradient background, decorative concentric rings + camera icon on the right, "ICV 2.0" highlighted in accent blue in the `<h1>`.

**Architecture:** Two source files change — `src/scss/blocks/products.scss` and `src/icv_2.html`. The build command `npm run build` (= `gulp build`) recompiles them into `build/css/style.min.css` and `build/icv_2.html`. No JS changes, no new assets.

**Tech Stack:** SCSS, HTML5, Gulp

---

### Task 1: Update `products.scss` — hero block

**Files:**
- Modify: `src/scss/blocks/products.scss`

- [ ] **Step 1: Replace `.product-hero` and remove `.product-hero__container`**

In `src/scss/blocks/products.scss`, find and replace the two blocks `.product-hero { … }` (lines ~4–19) and `.product-hero__container { … }` (lines ~21–24) — identify them by their class names, not the line numbers. Replace both with:

```scss
.product-hero {
  display: flex;
  align-items: stretch;
  background: linear-gradient(120deg, #003bbf 0%, vars.$color-primary 55%, vars.$color-primary-light 100%);
  overflow: hidden;
  position: relative;
}

.product-hero__left {
  flex: 1;
  padding: 7.375rem vars.$mobile-padding 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;

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
```

- [ ] **Step 2: Add accent and right-panel classes**

After the existing `.product-hero__desc` block (after line 52 in the original file), append:

```scss
.product-hero__title-accent {
  font-style: normal;
  color: #a8caff;
}

.product-hero__right {
  display: none;
  width: 280px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  @include mixins.tablet {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @include mixins.desktop {
    width: 360px;
  }
}

.product-hero__ring {
  position: absolute;
  border-radius: 50%;

  &--outer {
    width: 360px;
    height: 360px;
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    right: -110px;
    top: 50%;
    transform: translateY(-50%);
  }

  &--inner {
    width: 230px;
    height: 230px;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    right: -45px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.product-hero__circle {
  position: absolute;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.product-hero__icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.product-hero__dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(168, 202, 255, 0.45);
}
```

---

### Task 2: Update `src/icv_2.html` — hero markup

**Files:**
- Modify: `src/icv_2.html` lines 117–129

- [ ] **Step 1: Replace the hero section interior**

Replace the entire `<section class="product-hero" …>` block (lines 117–129) with:

```html
      <section class="product-hero" id="product-hero">
        <div class="product-hero__left">
          <h1 class="product-hero__title">
            Система контроля управления доступом <em class="product-hero__title-accent">ICV&nbsp;2.0</em>
          </h1>
          <p class="product-hero__desc">
            ПО предназначено для автоматизации и снижения стоимости
            эксплуатации системы пропуска автомобилей на ограниченную для
            проезда территорию с помощью анализа видеоизображения и
            распознавания инцидентов
          </p>
        </div>
        <div class="product-hero__right" aria-hidden="true">
          <div class="product-hero__ring product-hero__ring--outer"></div>
          <div class="product-hero__ring product-hero__ring--inner"></div>
          <div class="product-hero__circle"></div>
          <div class="product-hero__icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect x="4" y="12" width="32" height="24" rx="4" stroke="rgba(255,255,255,0.85)" stroke-width="2.2"/>
              <circle cx="20" cy="24" r="7" stroke="rgba(255,255,255,0.85)" stroke-width="2.2"/>
              <circle cx="20" cy="24" r="3" fill="rgba(168,202,255,0.7)"/>
              <path d="M36 19l8-5v20l-8-5V19z" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="product-hero__dot" style="width:8px;height:8px;right:175px;top:30%"></span>
          <span class="product-hero__dot" style="width:5px;height:5px;right:65px;top:22%"></span>
          <span class="product-hero__dot" style="width:6px;height:6px;right:35px;bottom:28%"></span>
          <span class="product-hero__dot" style="width:4px;height:4px;right:160px;bottom:32%"></span>
        </div>
      </section>
```

---

### Task 3: Build and visual verification

**Files:**
- Build output: `build/css/style.min.css`, `build/icv_2.html`

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: exits 0. `build/css/style.min.css` and `build/icv_2.html` are updated.  
If it fails: check for SCSS syntax errors in `src/scss/blocks/products.scss` (missing semicolons, unclosed braces).

- [ ] **Step 2: Open in browser and verify**

Open `build/icv_2.html` in a browser. Check all three viewport widths:

| Width | Expected |
| --- | --- |
| < 769 px (mobile) | Gradient blue background, title + desc full-width, "ICV 2.0" in light blue, no right panel |
| ≥ 769 px (tablet) | Right panel visible — two rings + filled circle + camera icon |
| ≥ 1600 px (desktop) | Right panel widens to 360 px, rings scale correctly |

- [ ] **Step 3: Commit**

```bash
git add src/scss/blocks/products.scss src/icv_2.html build/icv_2.html build/css/style.min.css build/css/style.min.css.map
git commit -m "feat: modernise product-hero with gradient split-layout and ICV 2.0 accent"
```
