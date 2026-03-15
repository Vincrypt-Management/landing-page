# Obsidian Premium Redesign + Hook Hardening — Design Spec

**Date:** 2026-03-15
**Project:** Flowfolio Landing Page

---

## Overview

Two concerns are addressed together:

1. **Hook hardening** — three minor issues identified in the previous code review of `useGitHubRelease`
2. **Design overhaul** — full visual redesign of the landing page using the "Obsidian Premium" brand direction

---

## Part 1: Hook Hardening

### 1.1 Fetch Timeout

**Problem:** The `fetch` in `useGitHubRelease` has no timeout. On a stalled network the user sees the loading skeleton indefinitely.

**Fix:** Add a `setTimeout` that calls `controller.abort()` after **8 seconds**. The existing `AbortController` is reused — no new infrastructure needed. The `AbortError` catch guard already silently handles this case.

```ts
const timeoutId = setTimeout(() => controller.abort(), 8000);
// in finally: clearTimeout(timeoutId)
```

### 1.2 Skeleton Flash on Warm Cache

**Problem:** `useEffect` runs after the first paint. Even with a valid cache entry, the component renders `loading: true` (skeleton) for one frame before the effect fires and calls `setLoading(false)`.

**Fix:** Initialise `loading` by checking the cache synchronously during hook construction — before the first render:

```ts
const initialCache = readCache(); // called at module-eval time, not in effect
const [loading, setLoading] = useState(!initialCache);
const [version, setVersion] = useState(initialCache?.version ?? FALLBACK_VERSION);
const [platforms, setPlatforms] = useState(initialCache?.platforms ?? FALLBACK_PLATFORMS);
```

The `useEffect` still runs (to fetch if no cache), but if cache is warm the first render already has `loading: false` — no skeleton flash.

Note: `readCache()` is safe to call synchronously because `localStorage` is synchronous. The `flushCacheIfRequested()` call must also move to run before `readCache()` at initialisation time (not inside the effect) so the flush takes effect on the synchronous read too.

### 1.3 Badge Overflow Protection

**Problem:** The "Recommended for you" badge on `.landing-platform-btn--recommended` uses `position: absolute; top: -10px`. If the section's top padding is ever reduced below 10px, the badge clips.

**Fix:** Add `overflow: visible` to `.landing-platform-buttons` and `padding-top: 16px` to give the badge room without relying on surrounding padding.

```css
.landing-platform-buttons {
  overflow: visible;
  padding-top: 16px; /* badge headroom */
}
```

---

## Part 2: Obsidian Premium Design Overhaul

### 2.1 Design Direction

**Obsidian Premium** — minimal, dark, editorial. Positions Flowfolio as a serious professional tool for privacy-conscious investors. Think Bloomberg Terminal meets Linear: authoritative, restrained, high-end.

### 2.2 Typography

| Role | Font | Style | Weight |
|------|------|-------|--------|
| Wordmark, headlines, section titles, stats | Cormorant Garamond | Italic | 300 |
| Feature titles | Cormorant Garamond | Normal | 400 |
| Body, labels, badges, nav, buttons | Inter | Normal | 300–600 |

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Added to `index.html` (landing entry point).

### 2.3 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--ff-bg` | `#080808` | Page background |
| `--ff-bg-card` | `#0d0d0d` | Card/surface background |
| `--ff-border` | `rgba(255,255,255,0.07)` | All borders and dividers |
| `--ff-text` | `#ffffff` | Primary text |
| `--ff-muted` | `#555555` | Secondary/label text |
| `--ff-green` | `#00e599` | Accent — badges, stats, icons, CTAs |
| `--ff-green-dim` | `rgba(0,229,153,0.08)` | Icon backgrounds, badge fills |
| `--ff-green-border` | `rgba(0,229,153,0.18)` | Icon borders, badge borders |

All existing CSS custom properties (`--landing-*`) are replaced by `--ff-*` tokens in `LandingPage.css`.

### 2.4 Navbar

**Changes from current:**
- Wordmark: replace `Space Grotesk` bold with `Cormorant Garamond` italic 20px. Prefix with a small green dot (8px circle, `background: var(--ff-green)`)
- Nav links: `color: var(--ff-muted)` at rest, `var(--ff-text)` on hover. Font: Inter 13px weight 400
- GitHub button: border `var(--ff-border)`, no fill, label `color: var(--ff-muted)`. Prefix with a 6px green dot instead of the GitHub icon
- Background: `rgba(8,8,8,0.85)` with `backdrop-filter: blur(20px)`
- Height: 56px (down from current taller nav)

### 2.5 Hero Section

**Layout:** Left-aligned, single column. No side-by-side video column.

**Structure (top to bottom):**

1. **Eyebrow badge** — pill, green border + fill, Inter 11px uppercase `letter-spacing: 0.1em`. Text: `Open Source · Zero Telemetry · {version}` (version from `useGitHubRelease`)
2. **Rule** — 48px wide, 1px, `rgba(255,255,255,0.12)`, `margin-bottom: 28px`
3. **Headline** — Cormorant Garamond italic 300, `clamp(52px, 7vw, 80px)`, `line-height: 1.05`. Text: *"Portfolio intelligence, without the cloud."*
4. **Subtext** — Inter 15px weight 300, `color: var(--ff-muted)`, max-width 480px. Text: *"Build explainable investment strategies that run entirely on your machine. No cloud. No tracking. Your data, your rules."*
5. **Actions row** — two elements inline:
   - Primary CTA: white background button (`background: var(--ff-text); color: var(--ff-bg)`), padding `11px 24px`, border-radius 8px, Inter 13px weight 600. Text: `Download free →`. Links to `#download`
   - Secondary link: Inter 13px `color: var(--ff-muted)`, `border-bottom: 1px solid #333`, no background. Text: `View on GitHub`. Opens GitHub repo in new tab
6. **Trust stats row** — `border-top: 1px solid var(--ff-border)`, `padding-top: 32px`, `display: flex; gap: 40px`. Four stats:
   - `100%` / Offline
   - `0 bytes` / Data shared
   - `4` / Platforms
   - `Free` / Forever
   - Stat numbers: Cormorant Garamond italic 300 32px, `color: var(--ff-green)`
   - Stat labels: Inter 10px uppercase `letter-spacing: 0.1em`, `color: var(--ff-muted)`
7. **Product video** — full-width below the stats, `margin-top: 60px`. Same `<video>` element as today, wrapped in a container with `border: 1px solid var(--ff-border)`, `border-radius: 12px`, a 1px green gradient line at the top edge (`linear-gradient(90deg, transparent, rgba(0,229,153,0.3), transparent)`)

**Max-width:** `900px`, `margin: 0 auto`, `padding: 100px 40px 80px`

**Removed:** The floating glow orbs (`::before` / `::after` pseudo-elements), the `shiny-text` animation, the platform icon row in the CTA button.

### 2.6 Features Section

**Changes from current:**
- Section eyebrow: Inter 11px uppercase muted label — `"Features"`
- Section heading: Cormorant Garamond italic 300 40px — `"Built for serious investors."`
- Grid: 3×2 uniform grid. **Remove bento spanning** (`nth-child(1)` and `nth-child(4)` no longer span 2 columns). All 6 cards equal width
- Card style: `border: 1px solid var(--ff-border)` drawn by the grid container background trick (1px gap, `background: var(--ff-border)`). No individual card borders. `border-radius: 12px` on the container with `overflow: hidden`
- Feature icon: 28×28px square with `background: var(--ff-green-dim)`, `border: 1px solid var(--ff-green-border)`, `border-radius: 6px`. Contains an 8px green circle placeholder (actual icon rendered inside at 14px, `color: var(--ff-green)`)
- Feature title: Cormorant Garamond 17px weight 400 (non-italic), `color: var(--ff-text)`
- Feature description: Inter 12px, `color: var(--ff-muted)`, `line-height: 1.65`
- Hover: `background: rgba(255,255,255,0.02)` on card — no gradient overlay

### 2.7 Value Props Section

**Changes from current:**
- Layout: 4-column horizontal strip, `border-top` and `border-bottom: 1px solid var(--ff-border)`. No background fill
- Items separated by `border-right: 1px solid var(--ff-border)` (last item has none)
- Each item: centered text
- Values (new content):
  - `∞` / No subscription
  - `0` / Data collected
  - `OSS` / Open source
  - `Local` / AI on-device
- Value number: Cormorant Garamond italic 300 36px, `color: var(--ff-text)`
- Value label: Inter 11px uppercase `letter-spacing: 0.1em`, `color: var(--ff-muted)`, `margin-top: 8px`
- Padding: `48px 40px`
- Icons: removed entirely

### 2.8 Download Section

**Changes from current:**
- Section heading: Cormorant Garamond italic 300 40px — `"Download Flowfolio."` (with period)
- Subtitle: Inter 13px muted — `"Free and open source. No account required."`
- Platform buttons: **grid layout** instead of flex row. `display: grid; grid-template-columns: repeat(4, 1fr)`. Separated by 1px grid gap on `background: var(--ff-border)`. Container has `border: 1px solid var(--ff-border)`, `border-radius: 10px`, `overflow: hidden`
- Each button: `background: var(--ff-bg-card)`, `padding: 24px 16px`, centered column flex
- Recommended button: subtle `background: rgba(0,229,153,0.04)`. Badge rendered as a tab at top: `position: absolute; top: -1px`, dark background `var(--ff-green)`, rounded bottom corners only (`border-radius: 0 0 6px 6px`), Inter 9px uppercase weight 600. Text: `"Recommended"`
- Platform icons: keep existing react-icons, `color: var(--ff-green)`, size 22px
- Platform name: Inter 12px weight 500
- Version: Inter 10px `color: var(--ff-muted)`
- `overflow: visible` + `padding-top: 16px` on `.landing-platform-buttons` (from hardening fix 1.3) applies here

### 2.9 Footer

**Changes from current:**
- Wordmark: Cormorant Garamond italic 17px with green dot prefix (same as navbar)
- Tagline: Inter 11px `color: var(--ff-muted)` — *"Made for privacy-conscious investors."*
- Links: Inter 12px `color: var(--ff-muted)`, hover `color: var(--ff-text)`. Keep GitHub + Documentation
- Border top: `1px solid var(--ff-border)`
- Padding: `32px 40px`

### 2.10 CSS Architecture

**`LandingPage.css`** — full rewrite. All `--landing-*` CSS custom properties replaced by `--ff-*`. All Space Grotesk references replaced by Cormorant Garamond or Inter. All bento, glow orb, shiny-text, and gradient CTA styles removed. New styles for stats row, eyebrow labels, section rules, grid download layout, and value-props strip added.

**Responsive breakpoints (preserve existing breakpoints, update rules):**
- `≤900px`: features grid 2 columns (all equal, no spanning), value props 2 columns
- `≤768px`: nav links hidden, hero single column (already is), value props 2 columns, platform buttons stacked column
- `≤480px`: value props single column

### 2.11 Google Fonts

Add to `index.html` (the landing page HTML entry point, not the app entry point):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Remove `Space Grotesk` from any existing font imports.

---

## Files Changed

| File | Change |
|------|--------|
| `src/landing/hooks/useGitHubRelease.ts` | Add 8s fetch timeout, move cache init to synchronous state, move flush before sync read |
| `src/landing/LandingPage.css` | Full rewrite with `--ff-*` tokens and all new section styles |
| `src/landing/components/Hero.tsx` | New layout: eyebrow → rule → headline → sub → actions → stats → video |
| `src/landing/components/Navbar.tsx` | Green dot wordmark, muted links, updated GitHub button style |
| `src/landing/components/FeatureGrid.tsx` | Eyebrow label, updated heading, equal 3×2 grid (no bento spanning) |
| `src/landing/components/ValueProps.tsx` | New content (∞/0/OSS/Local), horizontal strip, serif numbers, no icons |
| `src/landing/components/DownloadSection.tsx` | Grid layout, updated badge style |
| `src/landing/components/Footer.tsx` | Serif wordmark with green dot |
| `index.html` (landing) | Add Cormorant Garamond + Inter Google Fonts, remove Space Grotesk |

---

## Success Criteria

- [ ] No skeleton flash on warm cache (second visit shows buttons immediately)
- [ ] Fetch times out after 8 seconds with fallback — `console.warn` emitted
- [ ] "Recommended" badge is not clipped when section padding is minimal
- [ ] Cormorant Garamond italic renders for all headlines and the wordmark
- [ ] Inter renders for all body text, labels, and buttons
- [ ] Hero shows eyebrow badge → rule → headline → sub → actions → 4 stats → full-width video (top to bottom, left-aligned)
- [ ] Trust stats: numbers in green Cormorant, labels in muted Inter uppercase
- [ ] Features: 3×2 uniform grid, no bento spanning, green icon squares
- [ ] Value props: 4-column horizontal strip with serif numbers, no icons
- [ ] Download: 4-column grid layout with Recommended tab badge
- [ ] All `--landing-*` CSS variables replaced by `--ff-*`
- [ ] Space Grotesk removed from all stylesheets and font imports
- [ ] Responsive: no layout breakage at 900px, 768px, 480px
- [ ] `npm run lint` passes with zero errors
