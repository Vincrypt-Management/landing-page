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

**Fix:** Add a `setTimeout` that calls `controller.abort()` after **8 seconds**. Use a boolean `isTimedOut` flag to distinguish a timeout abort from a navigation/unmount abort, so a `console.warn` can be emitted only for the timeout case:

```ts
let isTimedOut = false;
const timeoutId = setTimeout(() => {
  isTimedOut = true;
  controller.abort();
}, 8000);

// in catch:
if ((err as Error).name === "AbortError") {
  if (isTimedOut) {
    console.warn("[useGitHubRelease] Fetch timed out after 8s, using fallback");
  }
  return; // no warn for navigation/unmount aborts
}

// in finally:
clearTimeout(timeoutId);
```

### 1.2 Skeleton Flash on Warm Cache

**Problem:** `useEffect` runs after the first paint. Even with a valid cache entry, the component renders `loading: true` (skeleton) for one frame before the effect fires.

**Fix:** Call `flushCacheIfRequested()` and `readCache()` synchronously at the **top of the hook function body**, before the `useState` calls. Use the result to seed initial state:

```ts
export function useGitHubRelease(): UseGitHubReleaseResult {
  // Run synchronously before first render — order matters
  flushCacheIfRequested();          // must come before readCache
  const initialCache = readCache(); // null if miss/expired/invalid

  const [loading, setLoading] = useState(!initialCache);
  const [version, setVersion] = useState(initialCache?.version ?? FALLBACK_VERSION);
  const [platforms, setPlatforms] = useState(initialCache?.platforms ?? FALLBACK_PLATFORMS);

  useEffect(() => {
    if (initialCache) return; // already hydrated — no fetch needed
    // ... fetch logic ...
  }, []);
  // ...
}
```

This means:
- Warm cache → `loading` starts `false`, no skeleton ever shown
- Cold cache → `loading` starts `true`, skeleton shows until fetch resolves
- `flushCacheIfRequested()` and `readCache()` are **removed from inside `useEffect`** — they only run in the hook body above

`readCache()` is safe to call synchronously because `localStorage` is synchronous and already wraps access in a try/catch.

### 1.3 Badge Overflow Protection

**Problem:** The redesigned "Recommended" badge (section 2.8) uses `position: absolute; top: -1px`, sitting flush at the top of the grid cell. The container (`.ff-platform-grid`) has `overflow: hidden` from `border-radius: 10px`. This would clip the badge.

**Fix:** The `.ff-platform-btn--recommended` must set `overflow: visible` on itself and the badge must be contained within the button's padding area. Since `top: -1px` keeps the badge inside the button border, no `padding-top` headroom is needed — but the grid container must **not** apply `overflow: hidden` to individual cells. The grid container's `border-radius` + `overflow: hidden` applies only to the container element, not to the button cells themselves. Confirm this renders correctly in the browser during manual verification.

---

## Part 2: Obsidian Premium Design Overhaul

### 2.1 Design Direction

**Obsidian Premium** — minimal, dark, editorial. Positions Flowfolio as a serious professional tool for privacy-conscious investors. Think Bloomberg Terminal meets Linear: authoritative, restrained, high-end.

### 2.2 Typography

| Role | Font | Style | Weight |
|------|------|-------|--------|
| Wordmark, headlines, section titles, stat numbers | Cormorant Garamond | Italic | 300 |
| Feature titles | Cormorant Garamond | Normal | 400 |
| Body, labels, badges, nav, CTA buttons | Inter | Normal | 300–600 |

Load via Google Fonts in `landing.html` (see section 2.11).

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

All existing `--landing-*` CSS custom properties are replaced by `--ff-*` tokens in `LandingPage.css`.

### 2.4 Navbar

**Changes from current:**
- Wordmark: replace Space Grotesk bold with Cormorant Garamond italic 20px. Prefix with an 8px green circle (`background: var(--ff-green)`)
- Nav links: Inter 13px weight 400, `color: var(--ff-muted)` at rest, `var(--ff-text)` on hover
- GitHub button: `border: 1px solid var(--ff-border)`, no fill, `color: var(--ff-muted)`. Replace GitHub SVG icon with a 6px green dot
- Background: `rgba(8,8,8,0.85)` with `backdrop-filter: blur(20px)`
- Height: 56px

### 2.5 Hero Section

**Layout:** Left-aligned, single column. No side-by-side video column. Max-width `900px`, `margin: 0 auto`, `padding: 100px 40px 80px`.

**Removed:** floating glow orbs (`::before`/`::after`), `shiny-text` animation, platform icon row inside the CTA button, `landing-hero-inner` grid.

**Structure (top to bottom):**

1. **Eyebrow badge** — pill shape, Inter 11px uppercase `letter-spacing: 0.1em`, `color: var(--ff-green)`, `border: 1px solid var(--ff-green-border)`, `background: var(--ff-green-dim)`. Text: `Open Source · Zero Telemetry · {version}` where `{version}` comes from calling `useGitHubRelease()` inside `Hero.tsx`. Hero calls the hook independently — the warm-cache path means both Hero and DownloadSection hit localStorage with no extra network request.

2. **Rule** — `<hr>` or `<div>`, width 48px, height 1px, `background: rgba(255,255,255,0.12)`, `margin-bottom: 28px`

3. **Headline** — Cormorant Garamond italic 300, `font-size: clamp(52px, 7vw, 80px)`, `line-height: 1.05`, `letter-spacing: -0.01em`. Text: *"Portfolio intelligence, without the cloud."*

4. **Subtext** — Inter 15px weight 300, `color: var(--ff-muted)`, `max-width: 480px`, `line-height: 1.7`. Text: *"Build explainable investment strategies that run entirely on your machine. No cloud. No tracking. Your data, your rules."*

5. **Actions row** — `display: flex; align-items: center; gap: 20px`:
   - Primary CTA: `<a href="#download">`, `background: var(--ff-text); color: var(--ff-bg)`, `padding: 11px 24px`, `border-radius: 8px`, Inter 13px weight 600. Text: `Download free →`
   - Secondary link: `<a href="https://github.com/Vincrypt-Management/flowfolio" target="_blank">`, Inter 13px, `color: var(--ff-muted)`, `border-bottom: 1px solid #333`, no background. Text: `View on GitHub`

6. **Trust stats row** — `display: flex; gap: 40px`, `border-top: 1px solid var(--ff-border)`, `padding-top: 32px`, `margin-top: 36px`. Four stats:

   | Number | Label |
   |--------|-------|
   | `100%` | Offline |
   | `0 bytes` | Data shared |
   | `4` | Platforms |
   | `Free` | Forever |

   - Number: Cormorant Garamond italic 300 32px, `color: var(--ff-green)`
   - Label: Inter 10px weight 500 uppercase `letter-spacing: 0.1em`, `color: var(--ff-muted)`, `margin-top: 6px`

   **Responsive:** at `≤768px` → `gap: 20px`. At `≤480px` → `display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px`

7. **Product video** — full-width, `margin-top: 60px`, outside the max-width constraint (uses its own `padding: 0 40px; max-width: 900px; margin: 0 auto`). Container: `border: 1px solid var(--ff-border)`, `border-radius: 12px`, `overflow: hidden`, `position: relative`. Gradient top line implemented as a `::before` pseudo-element on the container: `position: absolute; top: 0; left: 0; right: 0; height: 1px; content: ''; background: linear-gradient(90deg, transparent, rgba(0,229,153,0.3), transparent)`. Same `<video>` element with same props (autoPlay, loop, muted, playsInline).

### 2.6 Features Section

**Changes from current:**
- Add section eyebrow above heading: Inter 11px uppercase weight 500, `letter-spacing: 0.12em`, `color: var(--ff-muted)`. Text: `"Features"`
- Heading: Cormorant Garamond italic 300 40px. Text: `"Built for serious investors."`
- Subtitle: Inter 14px weight 300, `color: var(--ff-muted)`. Keep existing copy
- Grid: 3×2 uniform grid — **remove** `.landing-feature-card:nth-child(1)` and `:nth-child(4)` `grid-column: span 2` rules. All 6 cards equal width
- Grid container: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--ff-border); border: 1px solid var(--ff-border); border-radius: 12px; overflow: hidden`
- Card: `background: var(--ff-bg-card)`, `padding: 28px`. No individual borders
- Hover: `background: rgba(255,255,255,0.02)` — no `::before` gradient overlay
- Feature icon: 28×28px, `background: var(--ff-green-dim)`, `border: 1px solid var(--ff-green-border)`, `border-radius: 6px`, `display: flex; align-items: center; justify-content: center`. Icon rendered inside at 14px, `color: var(--ff-green)`
- Feature title: Cormorant Garamond non-italic weight 400, 17px, `color: var(--ff-text)`, `margin-bottom: 8px`
- Feature description: Inter 12px, `color: var(--ff-muted)`, `line-height: 1.65`

**Responsive:** `≤900px` → 2 columns. `≤480px` → 1 column. No spanning at any breakpoint.

### 2.7 Value Props Section

**Changes from current:**
- Remove all icons from the component
- New content (4 items):

  | Number | Label |
  |--------|-------|
  | `∞` | No subscription |
  | `0` | Data collected |
  | `OSS` | Open source |
  | `Local` | AI on-device |

- Layout: `display: grid; grid-template-columns: repeat(4, 1fr)` inside a `border-top: 1px solid var(--ff-border); border-bottom: 1px solid var(--ff-border)` container. `padding: 48px 40px`
- Items: centered text, `border-right: 1px solid var(--ff-border)` on all but last
- Number: Cormorant Garamond italic 300 36px, `color: var(--ff-text)`
- Label: Inter 11px uppercase weight 500 `letter-spacing: 0.1em`, `color: var(--ff-muted)`, `margin-top: 8px`

**Responsive:** `≤900px` and `≤768px` → 2 columns. `≤480px` → 1 column.

### 2.8 Download Section

**Changes from current:**
- Section heading: Cormorant Garamond italic 300 40px. Text: `"Download Flowfolio."` (with period)
- Subtitle: Inter 13px, `color: var(--ff-muted)`. Text: `"Free and open source. No account required."`
- Platform container: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--ff-border); border: 1px solid var(--ff-border); border-radius: 10px; overflow: hidden`. Named class: `ff-platform-grid`
- Each platform button: `<a>` tag, `background: var(--ff-bg-card)`, `padding: 24px 16px`, `display: flex; flex-direction: column; align-items: center; gap: 8px`, `position: relative`
- Recommended button: `background: rgba(0,229,153,0.04)`. Badge: `<span>` inside the `<a>`, `position: absolute; top: 0; left: 50%; transform: translateX(-50%); background: var(--ff-green); color: var(--ff-bg); font-size: 9px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 10px; border-radius: 0 0 6px 6px; white-space: nowrap`. Text: `"Recommended"` (not "Recommended for you")
- Platform icons: keep existing react-icons, `color: var(--ff-green)`, size 22px
- Platform name: Inter 12px weight 500
- Version: Inter 10px, `color: var(--ff-muted)`

**Responsive:** `≤768px` → `grid-template-columns: repeat(2, 1fr)`. `≤480px` → `grid-template-columns: 1fr 1fr` (keep 2-col since buttons are compact).

### 2.9 Footer

**Changes from current:**
- Wordmark: Cormorant Garamond italic 17px. Prefix with 8px green dot (same as navbar). Text: `"Flowfolio"`
- Tagline: Inter 11px, `color: var(--ff-muted)`. Text: `"Made for privacy-conscious investors."`
- Links: Inter 12px, `color: var(--ff-muted)`, hover `color: var(--ff-text)`. Keep GitHub + Documentation links
- `border-top: 1px solid var(--ff-border)`, `padding: 32px 40px`

### 2.10 CSS Architecture

**`LandingPage.css`** — full rewrite:
- All `--landing-*` CSS custom properties replaced by `--ff-*`
- All Space Grotesk references removed
- Removed styles: bento grid spanning, glow orbs, `shiny-text` keyframe, gradient CTA button, `landing-install-*` classes, `landing-badge::after` shine animation, `::before`/`::after` hero orbs
- Added styles: stats row, eyebrow labels, section rules, grid download layout, value-props strip, `::before` gradient line on video container

**`FeaturesPage.css` and any docs-page CSS: out of scope.** The success criterion "Space Grotesk removed" is scoped to the landing page only (`LandingPage.css` and `landing.html`).

**Responsive breakpoints:**

| Breakpoint | Rule |
|------------|------|
| `≤900px` | Features grid → 2 columns; value props → 2 columns |
| `≤768px` | Nav links hidden; hero stats `gap: 20px`; value props 2 columns; platform grid → 2 columns |
| `≤480px` | Features → 1 column; value props → 1 column; hero stats → 2×2 grid |

### 2.11 Google Fonts

**File: `landing.html`** — replace the existing Space Grotesk + Inter font link with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Remove the existing `Space Grotesk` + `Inter` link tag (line 14 of `landing.html`). The Inter weights change from `400;500;600;700` to `300;400;500;600` (weight 700 no longer used; weight 300 added).

---

## Files Changed

| File | Change |
|------|--------|
| `src/landing/hooks/useGitHubRelease.ts` | Add 8s timeout with `isTimedOut` flag + warn; move `flushCacheIfRequested` + `readCache` to top of hook body for sync state init |
| `src/landing/LandingPage.css` | Full rewrite: `--ff-*` tokens, all new section styles, remove Space Grotesk and defunct animations |
| `src/landing/components/Hero.tsx` | New layout: calls `useGitHubRelease()` for version; eyebrow → rule → headline → sub → actions → stats → video |
| `src/landing/components/Navbar.tsx` | Cormorant Garamond italic wordmark with green dot; muted links; updated GitHub button |
| `src/landing/components/FeatureGrid.tsx` | Eyebrow label added; equal 3×2 grid (remove bento spanning) |
| `src/landing/components/ValueProps.tsx` | New content (∞/0/OSS/Local); horizontal strip layout; serif numbers; icons removed |
| `src/landing/components/DownloadSection.tsx` | Grid layout; badge text changed to "Recommended"; badge position `top: 0` / `border-radius: 0 0 6px 6px` |
| `src/landing/components/Footer.tsx` | Cormorant Garamond italic wordmark with green dot |
| `landing.html` | Replace Space Grotesk font link with Cormorant Garamond + Inter (updated weights) |

---

## Success Criteria

- [ ] No skeleton flash on warm cache — second visit renders download buttons immediately with no skeleton frame
- [ ] Fetch times out after 8 seconds; `console.warn("[useGitHubRelease] Fetch timed out after 8s, using fallback")` is emitted; normal unmount aborts do not log a warning
- [ ] "Recommended" badge is not clipped at the top of the download grid
- [ ] Cormorant Garamond italic renders for: navbar wordmark, hero headline, trust stat numbers, section headings, value prop numbers, footer wordmark
- [ ] Inter renders for all body text, labels, badges, nav links, and buttons
- [ ] Hero structure (top to bottom, left-aligned): eyebrow badge with live version → rule → headline → subtext → actions row → trust stats → full-width video
- [ ] Trust stat numbers are green; labels are muted uppercase Inter
- [ ] Features: 3×2 uniform grid, no bento spanning at any viewport, green icon squares with lucide icons inside
- [ ] Value props: 4-column horizontal strip, Cormorant Garamond numbers, no icons, `border-top` + `border-bottom` dividers
- [ ] Download: 4-column grid, "Recommended" tab badge on detected platform, version from GitHub API
- [ ] All `--landing-*` CSS variables replaced by `--ff-*` in `LandingPage.css`
- [ ] Space Grotesk removed from `landing.html` and `LandingPage.css`
- [ ] Responsive: no overflow or layout breakage verified at 900px, 768px, 480px
- [ ] `npm run lint` passes with zero errors
