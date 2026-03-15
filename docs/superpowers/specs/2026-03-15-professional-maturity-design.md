# Professional Maturity — Design Spec

**Date:** 2026-03-15
**Project:** Flowfolio Landing Page

---

## Overview

Three additions to make the Flowfolio landing page read as a mature, actively-maintained professional product. Each targets a specific trust gap identified by the product owner:

| Trust Gap | Addition |
|-----------|----------|
| A — "Is this maintained / not abandoned?" | Activity strip on landing page (live release badge + commit activity bars) |
| C — "Will it work for me? What does it do?" | Compatibility matrix + FAQ accordion appended to existing Docs page |
| D — "Is it safe? What does 'offline' really mean?" | New Privacy & Security page (`privacy.html`) |

No team/about page is needed — credibility comes from transparency and activity, not identity.

---

## Part 1: Activity Strip (Landing Page)

### 1.1 Position

New section between `<ValueProps />` and `<DownloadSection />` in `LandingPage.tsx`. New component: `src/landing/components/ActivityStrip.tsx`.

### 1.2 Layout

Single-row strip matching the existing value-props band pattern: `border-top` + `border-bottom` using `var(--ff-border)`, `padding: 32px 40px`, centered content with `max-width: 900px; margin: 0 auto`.

A section eyebrow label sits above the strip container (inside the max-width wrapper): Inter 10px uppercase weight 600, `color: var(--ff-green)`, `letter-spacing: 0.1em`. Text: `"Active Development"`.

Two items separated by a 1px vertical divider (`height: 40px; background: var(--ff-border)`):

**Item 1 — Latest Release:**
- Label: Inter 10px uppercase weight 500, `color: var(--ff-muted)`. Text: `"Latest release"`
- Badge: pill with `background: var(--ff-green-dim); border: 1px solid var(--ff-green-border); border-radius: 6px; padding: 6px 14px`
- Inside badge: 6px green dot + version string (Inter 13px weight 500, `color: var(--ff-text)`) + " · X days ago" (Inter 12px, `color: var(--ff-muted)`)
- Version comes from `useGitHubRelease()` (same hook as `Hero.tsx` — warm cache means no extra network call)
- "X days ago" is computed client-side from `publishedAt` returned by `useGitHubRelease()` (see section 1.4)
- If `publishedAt` is null (fallback path), omit the " · X days ago" text entirely

**Item 2 — Commit Activity:**
- Label: Inter 10px uppercase weight 500, `color: var(--ff-muted)`. Text: `"Commits — last 8 weeks"`
- 8 vertical bars: `width: 6px; min-height: 4px; border-radius: 2px`, heights proportional to weekly commit count from GitHub API. Bars from the last 4 weeks use `background: var(--ff-green)`; earlier 4 bars use `background: rgba(0,229,153,0.25)`. A `min-height: 4px` ensures bars remain visible even at zero count
- Below bars: Inter 12px, `color: var(--ff-muted)`. Text: `"X commits this month"` (sum of last 4 weeks)
- Data fetched from `useCommitActivity` hook (section 1.3)

### 1.3 Data Hook: `useCommitActivity`

New file: `src/landing/hooks/useCommitActivity.ts`.

```ts
interface CommitWeek { week: number; total: number; }
interface UseCommitActivityResult {
  weeks: CommitWeek[]; // last 8 weeks
  monthTotal: number;  // sum of last 4 weeks
  loading: boolean;
}
```

- Fetches `https://api.github.com/repos/Vincrypt-Management/flowfolio/stats/commit_activity`
- GitHub returns 52 weeks of data — slice the last 8 entries
- Cache key: `STORAGE_KEYS.GH_COMMIT_ACTIVITY_CACHE` (see section 1.5)
- Cache TTL: 6 hours
- Cache shape: `{ schemaVersion: 1; weeks: CommitWeek[]; cachedAt: number }`
- Falls back to 8 weeks of `{ week: 0, total: 0 }` on any error (bars render at `min-height: 4px`, no crash)
- Uses `AbortController` with 8s timeout — same pattern as `useGitHubRelease`
- **Note:** GitHub's `stats/commit_activity` endpoint sometimes returns HTTP 202 (computing stats) on first request. If `res.status === 202`, treat as a soft failure and use the fallback silently (no console.warn needed).

### 1.4 `useGitHubRelease` Extension

`useGitHubRelease` must be extended to fetch, cache, and return `publishedAt`.

**Interface changes:**

```ts
interface ReleaseCacheEntry {
  schemaVersion: 2;         // bumped from 1 — existing v1 entries treated as misses
  version: string;
  platforms: PlatformRelease[];
  publishedAt: string | null; // ISO 8601 date string from GitHub API
  cachedAt: number;
}

export interface UseGitHubReleaseResult {
  loading: boolean;
  version: string;
  platforms: PlatformRelease[];
  detectedPlatform: string;
  publishedAt: string | null; // new field
}
```

**Fetch change:** read `data.published_at ?? null` from the GitHub releases API response and store in the cache entry.

**Schema version:** bump `SCHEMA_VERSION` from `1` to `2` so old cache entries (missing `publishedAt`) are treated as misses and re-fetched.

**Fallback:** `publishedAt` initialises to `null` when using `FALLBACK_VERSION`. `ActivityStrip` omits the date text when `publishedAt` is null.

**`daysAgo` helper** (in `ActivityStrip.tsx`, not in the hook):
```ts
function daysAgo(isoDate: string): number {
  return Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
}
```

### 1.5 `STORAGE_KEYS` Update

Add to `src/shared/constants/index.ts` `STORAGE_KEYS` object:
```ts
GH_COMMIT_ACTIVITY_CACHE: 'flowfolio_gh_commit_activity_cache',
```

### 1.6 Responsive

`≤768px`: stack items vertically, hide the vertical divider, `gap: 24px`. `≤480px`: same.

---

## Part 2: Privacy & Security Page (`privacy.html`)

### 2.1 New Files

| File | Purpose |
|------|---------|
| `privacy.html` | Entry point (mirrors `releases.html` structure) |
| `src/privacy/PrivacyPage.tsx` | Page component |
| `src/privacy/main.tsx` | React entry point |
| `src/privacy/PrivacyPage.css` | Page styles — duplicates the `--ff-*` CSS custom property declarations at `:root` level (no cross-bundle CSS import; the landing bundle is a separate chunk) |

### 2.2 Vite Config

Add `privacy` entry to `vite.landing.config.ts` (not `vite.config.ts`) `build.rollupOptions.input`:
```ts
privacy: resolve(__dirname, "privacy.html"),
```

### 2.3 Navbar Update — All Pages

Each existing page has its own navigation (no shared component). Add `"Privacy"` link in each of these locations:

| File | Location | How |
|------|----------|-----|
| `src/landing/components/Navbar.tsx` | `<ul className="landing-nav-links">` | Add `<li><a href="privacy.html">Privacy</a></li>` between Releases and Download |
| `src/features/FeaturesPage.tsx` | `<div className="features-topbar-right">` | Add `<a href="privacy.html" className="features-topbar-link">Privacy</a>` alongside the existing GitHub icon link |
| `src/releases/ReleasesPage.tsx` | `<ul className="rp-nav-links">` | Add `<li><a href="privacy.html">Privacy</a></li>` |
| `src/privacy/PrivacyPage.tsx` | New page navbar | Include Privacy as the active/current link |

Footer: add `"Privacy"` link in `src/landing/components/Footer.tsx` alongside GitHub and Documentation. Also add to footer sections inside `ReleasesPage.tsx`.

### 2.4 Page Sections (top to bottom)

**Hero**
- Section eyebrow: `"Privacy & Security"`
- Headline: Cormorant Garamond italic 300, `clamp(40px, 5vw, 60px)`. Text: *"We can't see your data. By design."*
- Subtitle: Inter 15px weight 300, `color: var(--ff-muted)`, `max-width: 520px`. Text: *"Flowfolio runs entirely on your machine. No accounts. No servers. No telemetry. This page explains exactly what that means technically."*
- Badge row (4 badges, green pill style matching eyebrow badge from Hero): `"No network on startup"` / `"No accounts required"` / `"Auditable source code"` / `"Local filesystem only"`
- `border-bottom: 1px solid var(--ff-border)`

**What we never do**
- Heading: Cormorant Garamond italic 300 28px. Text: *"What we never do."*
- 2×2 grid: `display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--ff-border); border: 1px solid var(--ff-border); border-radius: 10px; overflow: hidden` (same pattern as `.landing-features-grid` in `LandingPage.css`)
- Each cell: `background: var(--ff-bg-card); padding: 24px; display: flex; gap: 14px; align-items: flex-start`. Left icon: 20×20px box with `background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.15); border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0` containing Lucide `X` icon at 10px, `color: #ff6b6b`
- Four items: "Collect portfolio data" / "Track usage or analytics" / "Require an account" / "Phone home on startup"
- `border-bottom: 1px solid var(--ff-border)`

**How your data flows**
- Heading: Cormorant Garamond italic 300 28px. Text: *"How your data flows."*
- Horizontal diagram: **Your Machine** (green-border box, Lucide `Monitor` icon) → arrow labeled "market data only" → **Market APIs** (muted box, Lucide `Activity` icon) | gap | **No Vincrypt servers** (red-tinted box, Lucide `Server` icon) + **No cloud storage** (red-tinted box, Lucide `Cloud` icon)
- Box style: `background: var(--ff-bg-card); border: 1px solid var(--ff-border); border-radius: 8px; padding: 20px 24px; text-align: center`
- Green box: `border-color: rgba(0,229,153,0.25)`
- Red boxes: `background: rgba(255,60,60,0.04); border-color: rgba(255,60,60,0.12)`
- Icons in 32×32 icon squares: `width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; margin: 0 auto 10px` (same pattern as `.landing-feature-icon` in `LandingPage.css`)
- `border-bottom: 1px solid var(--ff-border)`

**Verify it yourself**
- Heading: Cormorant Garamond italic 300 28px. Text: *"Verify it yourself."*
- 3-row list: `border: 1px solid var(--ff-border); border-radius: 10px; overflow: hidden`
- Row 1: "Network calls" → links to `src/core/api/client.ts` on GitHub (confirmed file exists at that path)
- Row 2: "Local storage" → links to `src/services/localCache.ts` on GitHub (confirmed file exists at that path)
- Row 3: "No telemetry" → links to the repo root on GitHub ("View on GitHub →")
- Each row: `background: var(--ff-bg-card); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center`
- Link text right-aligned: Inter 11px, `color: var(--ff-green)`, with Lucide `ArrowRight` icon 12px

### 2.5 CSS

Reuse all `--ff-*` tokens declared at `:root` in `PrivacyPage.css`. Page-specific classes prefixed `ff-priv-*`. No new design tokens needed.

---

## Part 3: Docs Page Additions (FAQ + Compatibility)

### 3.1 Where

Two new sections appended to the bottom of `src/features/FeaturesPage.tsx` (not `FeatureGrid.tsx` — that is a landing page component). No new page, no new route.

### 3.2 Compatibility Matrix

Section eyebrow: `"Platform Support"`. Heading: *"What runs where."*

5-column table rendered as CSS grid rows (no `<table>` element — matches the existing card/grid pattern):

| Platform | Download | Offline | Local AI | Status |
|----------|----------|---------|----------|--------|
| macOS — Apple Silicon | .dmg | ✓ | ✓ | Recommended |
| macOS — Intel | .dmg | ✓ | ✓ | Stable |
| Windows 10 / 11 | .msi | ✓ | ✓ | Stable |
| Linux (x86_64) | .AppImage | ✓ | — | Beta |

- Platform column icons (Lucide): macOS rows → `Laptop`, Windows → `LayoutGrid`, Linux → `Terminal`
- Check marks: Lucide `Check` icon, `color: var(--ff-green)`
- Dash (—): plain text, `color: var(--ff-muted)`
- Status label: `Recommended` and `Stable` in `color: var(--ff-green); font-size: 11px; font-weight: 500`, `Beta` in `color: var(--ff-muted); font-size: 11px; font-weight: 500`
- Container: `border: 1px solid var(--ff-border); border-radius: 10px; overflow: hidden`. Each data row: `background: var(--ff-bg-card)`. Header row: `background: rgba(255,255,255,0.02)`. Row separator: `border-bottom: 1px solid var(--ff-border)`

### 3.3 FAQ Accordion

Section eyebrow: `"FAQ"`. Heading: *"Common questions."*

Container: `border: 1px solid var(--ff-border); border-radius: 10px; overflow: hidden`. Each item: `background: var(--ff-bg-card); border-bottom: 1px solid var(--ff-border)`.

Accordion implementation: React `useState` per-item toggle (not `<details>` — the docs page already uses React state extensively). Question row: `padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 13px; font-weight: 500`. Lucide `ChevronDown` icon, `color: var(--ff-muted)`, rotates 180° when open (`transform: rotate(180deg); transition: transform 0.2s`). Answer: `padding: 14px 20px 18px; font-size: 12px; color: var(--ff-muted); line-height: 1.7; border-top: 1px solid var(--ff-border)`.

6 questions and answers:

1. **Does Flowfolio work without an internet connection?** — Yes, entirely. All strategy logic, rankings, portfolio tracking, and backtesting run locally. Network is only used when you explicitly request fresh market data. Works in airplane mode with cached data.

2. **Is it really free? What's the catch?** — No catch. Free, open source (MIT), no ads, no paid tier. The project is maintained by Vincrypt Management as an open-source tool for the investing community.

3. **What data sources does it use for prices and fundamentals?** — Flowfolio fetches from public market data APIs. You configure which source in settings. All fetched data is cached locally — subsequent runs use the cache.

4. **How does the local AI work? Does it phone home?** — The Vibe Studio AI runs via your local OpenRouter-compatible endpoint or an on-device model. No data is sent to Vincrypt servers. You control which model provider is used.

5. **Can I use this on Windows or Linux?** — Yes. Windows 10/11 (.msi) and Linux x86_64 (.AppImage) are fully supported. See the compatibility table above.

6. **Where is my data stored? Can I back it up?** — All data is stored in your OS app data directory. You can back it up by copying that folder. Nothing is stored in the cloud.

---

## Files Changed

| File | Change |
|------|--------|
| `src/landing/LandingPage.tsx` | Add `<ActivityStrip />` between `<ValueProps />` and `<DownloadSection />` |
| `src/landing/components/ActivityStrip.tsx` | New component — release badge + commit bars |
| `src/landing/hooks/useCommitActivity.ts` | New hook — fetches + caches GitHub commit activity stats |
| `src/landing/hooks/useGitHubRelease.ts` | Extend: add `publishedAt` field, bump `schemaVersion` to 2 |
| `src/shared/constants/index.ts` | Add `GH_COMMIT_ACTIVITY_CACHE` to `STORAGE_KEYS` |
| `src/landing/components/Navbar.tsx` | Add "Privacy" nav link |
| `src/landing/components/Footer.tsx` | Add "Privacy" footer link |
| `src/features/FeaturesPage.tsx` | Add Privacy nav link; append compatibility matrix + FAQ sections |
| `src/releases/ReleasesPage.tsx` | Add Privacy nav link and footer link |
| `src/privacy/PrivacyPage.tsx` | New page component |
| `src/privacy/main.tsx` | New React entry point |
| `src/privacy/PrivacyPage.css` | New page styles with `--ff-*` root vars |
| `privacy.html` | New HTML entry point — copy structure from `releases.html`, update `<script type="module" src="/src/privacy/main.tsx">` and `<title>` |
| `vite.landing.config.ts` | Add `privacy` to `build.rollupOptions.input` |

---

## Success Criteria

- [ ] Activity strip visible on landing page between ValueProps and DownloadSection
- [ ] Release badge shows live version + "X days ago" computed from `publishedAt`; date text is absent when `publishedAt` is null (fallback path)
- [ ] Commit bars reflect real weekly data from GitHub API; last 4 weeks rendered in `var(--ff-green)`, earlier 4 in dimmed green
- [ ] All 8 commit bars render at minimum `4px` height even when API returns zeros or fails
- [ ] When GitHub `stats/commit_activity` returns 202 or any error, strip renders with minimum-height bars and no JS console error
- [ ] `useGitHubRelease` cache schema version is 2; old v1 cache entries are treated as misses
- [ ] `STORAGE_KEYS.GH_COMMIT_ACTIVITY_CACHE` key exists in `src/shared/constants/index.ts`
- [ ] `privacy.html` renders with all 4 sections: hero, never-do grid, data flow diagram, verify list
- [ ] "Privacy" link appears in navbar and footer of: landing page, features page, releases page, privacy page
- [ ] Privacy page registered in `vite.landing.config.ts` (not `vite.config.ts`)
- [ ] Compatibility matrix shows all 4 platforms with Lucide icons (`Laptop`, `LayoutGrid`, `Terminal`); correct statuses
- [ ] FAQ accordion opens/closes correctly; all 6 questions have full text answers
- [ ] All new pages match Obsidian Premium design system (`--ff-*` tokens, Cormorant Garamond + Inter)
- [ ] All icons use Lucide React components — no emoji anywhere
- [ ] `npm run lint` passes with zero errors
- [ ] No layout breakage at 900px, 768px, 480px viewports
