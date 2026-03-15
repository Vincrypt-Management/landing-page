# Professional Maturity Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three professional maturity features to the Flowfolio landing site: an activity strip proving active development, a Privacy & Security page, and a compatibility matrix + FAQ on the Docs page.

**Architecture:** The activity strip extends the existing `useGitHubRelease` hook with `publishedAt` and adds a new `useCommitActivity` hook + `ActivityStrip` component. The Privacy page is a new Vite MPA entry mirroring the Releases page structure. The Docs additions are appended to the existing `FeaturesPage.tsx`.

**Tech Stack:** React 18, TypeScript, Vite (MPA config), Lucide React, CSS custom properties (`--ff-*` tokens), GitHub REST API

---

## Chunk 1: Foundation

**Files:**
- Modify: `src/shared/constants/index.ts`
- Modify: `vite.landing.config.ts`
- Modify: `src/landing/hooks/useGitHubRelease.ts`

---

### Task 1: Add `GH_COMMIT_ACTIVITY_CACHE` to STORAGE_KEYS

**Files:**
- Modify: `src/shared/constants/index.ts`

- [ ] **Step 1: Open `src/shared/constants/index.ts` and add the key**

  Locate the `STORAGE_KEYS` object (around line 119) and add one entry:

  ```ts
  // Before (existing):
  export const STORAGE_KEYS = {
    CACHE_PREFIX: 'flowfolio_cache_v2',
    SETTINGS: 'flowfolio_settings',
    THEME: 'flowfolio_theme',
    RECENT_SYMBOLS: 'flowfolio_recent_symbols',
    GH_RELEASE_CACHE: 'flowfolio_gh_release_cache',
  } as const;

  // After:
  export const STORAGE_KEYS = {
    CACHE_PREFIX: 'flowfolio_cache_v2',
    SETTINGS: 'flowfolio_settings',
    THEME: 'flowfolio_theme',
    RECENT_SYMBOLS: 'flowfolio_recent_symbols',
    GH_RELEASE_CACHE: 'flowfolio_gh_release_cache',
    GH_COMMIT_ACTIVITY_CACHE: 'flowfolio_gh_commit_activity_cache',
  } as const;
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 3: Commit**

  ```bash
  git add src/shared/constants/index.ts
  git commit -m "feat: add GH_COMMIT_ACTIVITY_CACHE storage key"
  ```

---

### Task 2: Register `privacy` entry in Vite landing config

**Files:**
- Modify: `vite.landing.config.ts`

- [ ] **Step 1: Add privacy entry to `build.rollupOptions.input`**

  ```ts
  // Before:
  input: {
    landing: resolve(__dirname, "landing.html"),
    features: resolve(__dirname, "features.html"),
    releases: resolve(__dirname, "releases.html"),
  },

  // After:
  input: {
    landing: resolve(__dirname, "landing.html"),
    features: resolve(__dirname, "features.html"),
    releases: resolve(__dirname, "releases.html"),
    privacy: resolve(__dirname, "privacy.html"),
  },
  ```

  Note: `privacy.html` does not exist yet — the build will fail until Task 12 creates it. That is expected at this stage.

- [ ] **Step 2: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 3: Commit**

  ```bash
  git add vite.landing.config.ts
  git commit -m "feat: register privacy page in landing vite config"
  ```

---

### Task 3: Extend `useGitHubRelease` with `publishedAt` and schema v2

**Files:**
- Modify: `src/landing/hooks/useGitHubRelease.ts`

The hook currently caches with `schemaVersion: 1`. We add `publishedAt: string | null`, bump the schema to `2` so old cached entries are invalidated, and expose `publishedAt` in the return value.

- [ ] **Step 1: Update `ReleaseCacheEntry` and `UseGitHubReleaseResult` interfaces**

  Find and replace the two interfaces at the top of the file:

  ```ts
  // ReleaseCacheEntry — bump schemaVersion literal, add publishedAt
  interface ReleaseCacheEntry {
    schemaVersion: 2;
    version: string;
    platforms: PlatformRelease[];
    publishedAt: string | null;
    cachedAt: number;
  }

  // UseGitHubReleaseResult — add publishedAt
  export interface UseGitHubReleaseResult {
    loading: boolean;
    version: string;
    platforms: PlatformRelease[];
    detectedPlatform: string;
    publishedAt: string | null;
  }
  ```

- [ ] **Step 2: Bump `SCHEMA_VERSION` constant**

  ```ts
  // Before:
  const SCHEMA_VERSION = 1 as const;

  // After:
  const SCHEMA_VERSION = 2 as const;
  ```

- [ ] **Step 3: Update `readCache` — fix type annotation and add `publishedAt` validation**

  Two changes in `readCache`:

  **a)** On the `JSON.parse` line, update the type cast to reference the new interface (schemaVersion 2 includes `publishedAt`). The cast is currently `JSON.parse(raw) as Partial<ReleaseCacheEntry>` — after updating the interface in Step 1, this cast will now expect `publishedAt` to optionally exist. No code change needed here; TypeScript will infer correctly from the updated interface. Confirm the line reads:

  ```ts
  const entry = JSON.parse(raw) as Partial<ReleaseCacheEntry>;
  ```

  **b)** Add a `publishedAt` presence check to the validation block:

  ```ts
  if (
    entry.schemaVersion !== SCHEMA_VERSION ||
    typeof entry.cachedAt !== "number" ||
    !Array.isArray(entry.platforms) ||
    entry.platforms.length === 0 ||
    typeof entry.version !== "string" ||
    !("publishedAt" in entry)   // <-- new: ensures field exists (may be null)
  ) {
  ```

- [ ] **Step 4: Add `publishedAt` state and initialise from cache**

  > Add this BEFORE modifying `fetchRelease` (Step 5), so the setter exists when you reference it.

  In the hook body, after the existing `useState` calls for `version` and `platforms`, add:

  ```ts
  const [publishedAt, setPublishedAt] = useState<string | null>(
    initialCache?.publishedAt ?? null
  );
  ```

- [ ] **Step 5: Extract `publishedAt` from the API response and update the `writeCache` call**

  In the `fetchRelease` async function, after `const tagName: string = data.tag_name ?? FALLBACK_VERSION;`, add:

  ```ts
  const publishedAt: string | null = typeof data.published_at === "string"
    ? data.published_at
    : null;
  ```

  Then update the three state setters (find where `setVersion` and `setPlatforms` are called) to also call `setPublishedAt`:

  ```ts
  setVersion(tagName);
  setPlatforms(resolved);
  setPublishedAt(publishedAt);
  ```

  The `writeCache` call is inside an `if (!hasAnyFallback)` block — update **only that call** to include `publishedAt`:

  ```ts
  if (!hasAnyFallback) {
    writeCache({
      schemaVersion: SCHEMA_VERSION,
      version: tagName,
      platforms: resolved,
      publishedAt,           // <-- add this
      cachedAt: Date.now(),
    });
  }
  // leave the else branch (console.warn) unchanged
  ```

  **Note on early-return paths:** The function has several early `return` statements (e.g. `!res.ok`, `assets.length === 0`). These paths do NOT need to call `setPublishedAt` — the initial state is already `null` (the correct fallback), and `setLoading(false)` in the `finally` block will still fire.

- [ ] **Step 6: Return `publishedAt` from the hook**

  ```ts
  return { loading, version, platforms, detectedPlatform, publishedAt };
  ```

- [ ] **Step 7: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 8: Verify dev server shows no regressions**

  Run: `npm run dev:landing`
  Open `http://localhost:3000/landing.html`. Confirm:
  - Hero eyebrow badge still shows version (e.g. "v0.2.2")
  - Download section still renders platform buttons
  - No console errors

  Stop the dev server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/landing/hooks/useGitHubRelease.ts
  git commit -m "feat: extend useGitHubRelease with publishedAt (schema v2)"
  ```

---

## Chunk 2: Activity Strip

**Files:**
- Create: `src/landing/hooks/useCommitActivity.ts`
- Create: `src/landing/components/ActivityStrip.tsx`
- Modify: `src/landing/LandingPage.tsx`
- Modify: `src/landing/LandingPage.css`

---

### Task 4: Create `useCommitActivity` hook

**Files:**
- Create: `src/landing/hooks/useCommitActivity.ts`

- [ ] **Step 1: Create the file with full implementation**

  Create `src/landing/hooks/useCommitActivity.ts`:

  ```ts
  import { useState, useEffect } from "react";
  import { STORAGE_KEYS } from "../../shared/constants";

  // ── Types ────────────────────────────────────────────────────────────────────

  export interface CommitWeek {
    week: number;  // Unix timestamp of week start
    total: number; // commits that week
  }

  export interface UseCommitActivityResult {
    weeks: CommitWeek[]; // last 8 weeks, oldest first
    monthTotal: number;  // sum of last 4 weeks
    loading: boolean;
  }

  // ── Constants ─────────────────────────────────────────────────────────────────

  const REPO = "Vincrypt-Management/flowfolio";
  const API_URL = `https://api.github.com/repos/${REPO}/stats/commit_activity`;
  const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
  const SCHEMA_VERSION = 1 as const;
  const WEEKS_TO_SHOW = 8;

  interface CommitActivityCacheEntry {
    schemaVersion: 1;
    weeks: CommitWeek[];
    cachedAt: number;
  }

  const FALLBACK_WEEKS: CommitWeek[] = Array.from({ length: WEEKS_TO_SHOW }, (_, i) => ({
    week: 0,
    total: 0,
  }));

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function readCache(): CommitActivityCacheEntry | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GH_COMMIT_ACTIVITY_CACHE);
      if (!raw) return null;
      const entry = JSON.parse(raw) as Partial<CommitActivityCacheEntry>;
      if (
        entry.schemaVersion !== SCHEMA_VERSION ||
        typeof entry.cachedAt !== "number" ||
        !Array.isArray(entry.weeks)
      ) {
        return null;
      }
      if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
      return entry as CommitActivityCacheEntry;
    } catch {
      return null;
    }
  }

  function writeCache(weeks: CommitWeek[]): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.GH_COMMIT_ACTIVITY_CACHE,
        JSON.stringify({ schemaVersion: SCHEMA_VERSION, weeks, cachedAt: Date.now() })
      );
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }

  // ── Hook ─────────────────────────────────────────────────────────────────────

  export function useCommitActivity(): UseCommitActivityResult {
    const initialCache = readCache();

    const [weeks, setWeeks] = useState<CommitWeek[]>(
      initialCache?.weeks ?? FALLBACK_WEEKS
    );
    const [loading, setLoading] = useState(!initialCache);

    useEffect(() => {
      if (initialCache) return;

      const controller = new AbortController();
      let isTimedOut = false;
      const timeoutId = setTimeout(() => {
        isTimedOut = true;
        controller.abort();
      }, 8000);

      async function fetchActivity() {
        try {
          const res = await fetch(API_URL, { signal: controller.signal });
          // 202 = GitHub is still computing stats — soft failure, use fallback silently (no warn)
          if (res.status === 202) return;
          if (!res.ok) return;
          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) return;

          const last8: CommitWeek[] = data
            .slice(-WEEKS_TO_SHOW)
            .map((w: { week: number; total: number }) => ({
              week: w.week,
              total: w.total,
            }));

          setWeeks(last8);
          writeCache(last8);
        } catch (err) {
          if ((err as Error).name === "AbortError") {
            if (isTimedOut) {
              console.warn("[useCommitActivity] Fetch timed out after 8s, using fallback");
            }
            return;
          }
          // Any other error — fallback weeks already set, no action needed
        } finally {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }

      fetchActivity();
      return () => controller.abort();
    }, []);

    const monthTotal = weeks
      .slice(-4)
      .reduce((sum, w) => sum + w.total, 0);

    return { weeks, monthTotal, loading };
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 3: Commit**

  ```bash
  git add src/landing/hooks/useCommitActivity.ts
  git commit -m "feat: add useCommitActivity hook with 6h cache and fallback"
  ```

---

### Task 5: Create `ActivityStrip` component

**Files:**
- Create: `src/landing/components/ActivityStrip.tsx`

- [ ] **Step 1: Create the component**

  Create `src/landing/components/ActivityStrip.tsx`:

  ```tsx
  import { useGitHubRelease } from "../hooks/useGitHubRelease";
  import { useCommitActivity } from "../hooks/useCommitActivity";

  function daysAgo(isoDate: string): number {
    // Math.max(0, ...) guards against clock skew or pre-release future dates
    return Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000));
  }

  function ActivityStrip() {
    const { version, publishedAt } = useGitHubRelease();
    const { weeks, monthTotal } = useCommitActivity();

    const maxTotal = Math.max(...weeks.map((w) => w.total), 1);

    return (
      <section className="ff-activity-strip-section">
        <div className="ff-activity-strip-inner">
          <p className="ff-activity-eyebrow">Active Development</p>
          <div className="ff-activity-strip">

            {/* Item 1 — Latest release */}
            <div className="ff-activity-item">
              <span className="ff-activity-label">Latest release</span>
              <div className="ff-activity-badge">
                <span className="ff-activity-dot" />
                <span className="ff-activity-version">{version}</span>
                {publishedAt && (
                  <span className="ff-activity-ago">
                    · {daysAgo(publishedAt)} days ago
                  </span>
                )}
              </div>
            </div>

            <div className="ff-activity-divider" />

            {/* Item 2 — Commit activity */}
            <div className="ff-activity-item">
              <span className="ff-activity-label">Commits — last 8 weeks</span>
              <div className="ff-activity-bars">
                {weeks.map((w, i) => {
                  const heightPct = Math.max((w.total / maxTotal) * 100, 0);
                  const isRecent = i >= weeks.length - 4;
                  return (
                    <div
                      key={i}
                      className={`ff-activity-bar${isRecent ? " ff-activity-bar--recent" : ""}`}
                      style={{ height: `max(4px, ${heightPct}%)` }}
                      title={`${w.total} commits`}
                    />
                  );
                })}
              </div>
              <span className="ff-activity-month-total">
                <strong>{monthTotal} commits</strong> this month
              </span>
            </div>

          </div>
        </div>
      </section>
    );
  }

  export default ActivityStrip;
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 3: Commit**

  ```bash
  git add src/landing/components/ActivityStrip.tsx
  git commit -m "feat: add ActivityStrip component"
  ```

---

### Task 6: Wire `ActivityStrip` into `LandingPage` and add CSS

**Files:**
- Modify: `src/landing/LandingPage.tsx`
- Modify: `src/landing/LandingPage.css`

- [ ] **Step 1: Import and place `ActivityStrip` in `LandingPage.tsx`**

  Add the import at the top:

  ```tsx
  import ActivityStrip from "./components/ActivityStrip";
  ```

  Insert `<ActivityStrip />` between `<ValueProps />` and `<DownloadSection />`:

  ```tsx
  function LandingPage() {
    return (
      <div className="landing-page">
        <Navbar />
        <main>
          <Hero />
          <FeatureGrid />
          <ValueProps />
          <ActivityStrip />
          <DownloadSection />
        </main>
        <Footer />
      </div>
    );
  }
  ```

- [ ] **Step 2: Add CSS for the activity strip**

  Append the following to the bottom of `src/landing/LandingPage.css`:

  ```css
  /* ============================================
     ACTIVITY STRIP
     ============================================ */
  .ff-activity-strip-section {
    border-top: 1px solid var(--ff-border);
    border-bottom: 1px solid var(--ff-border);
  }

  .ff-activity-strip-inner {
    max-width: 900px;
    margin: 0 auto;
    /* top padding is 8px (not 32px) — the eyebrow label sits inside this wrapper
       and provides visual spacing; 32px top would create too much gap above the label */
    padding: 8px 40px 32px;
  }

  .ff-activity-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ff-green);
    margin-bottom: 20px;
  }

  .ff-activity-strip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 60px;
  }

  .ff-activity-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .ff-activity-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ff-muted);
  }

  /* Release badge */
  .ff-activity-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--ff-green-dim);
    border: 1px solid var(--ff-green-border);
    border-radius: 6px;
    padding: 6px 14px;
  }

  .ff-activity-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ff-green);
    flex-shrink: 0;
  }

  .ff-activity-version {
    font-size: 13px;
    font-weight: 500;
    color: var(--ff-text);
  }

  .ff-activity-ago {
    font-size: 12px;
    color: var(--ff-muted);
  }

  /* Divider */
  .ff-activity-divider {
    width: 1px;
    height: 40px;
    background: var(--ff-border);
    flex-shrink: 0;
  }

  /* Commit bars */
  .ff-activity-bars {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 28px;
  }

  .ff-activity-bar {
    width: 6px;
    /* min-height NOT set here — the floor is enforced by the inline max(4px, X%)
       on each bar element. Both approaches work, but inline wins over CSS min-height
       when an explicit height is set, so we rely on the inline max() exclusively. */
    border-radius: 2px;
    background: rgba(0, 229, 153, 0.25);
  }

  .ff-activity-bar--recent {
    background: var(--ff-green);
  }

  .ff-activity-month-total {
    font-size: 12px;
    color: var(--ff-muted);
  }

  .ff-activity-month-total strong {
    color: var(--ff-text);
    font-weight: 500;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .ff-activity-strip {
      flex-direction: column;
      gap: 24px;
    }
    .ff-activity-divider {
      display: none;
    }
  }
  ```

- [ ] **Step 3: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 4: Verify visually in dev server**

  Run: `npm run dev:landing`
  Open `http://localhost:3000/landing.html` and confirm:
  - "Active Development" eyebrow label visible
  - Release badge shows version (e.g. "v0.2.2") with green dot
  - 8 commit bars visible, last 4 brighter green, all bars at least 4px tall
  - "X commits this month" text visible below bars
  - Strip sits between ValueProps and DownloadSection
  - At mobile width (resize to 400px): items stack vertically, divider hidden

  Stop the dev server.

- [ ] **Step 5: Commit**

  ```bash
  git add src/landing/LandingPage.tsx src/landing/LandingPage.css
  git commit -m "feat: add ActivityStrip to landing page"
  ```

---

## Chunk 3: Privacy & Security Page

**Files:**
- Create: `privacy.html`
- Create: `src/privacy/main.tsx`
- Create: `src/privacy/PrivacyPage.css`
- Create: `src/privacy/PrivacyPage.tsx`

---

### Task 7: Create `privacy.html` entry point

**Files:**
- Create: `privacy.html`

- [ ] **Step 1: Copy `releases.html` structure**

  Read `releases.html` first to get the exact structure, then create `privacy.html` with these changes:
  - `<title>` → `Privacy & Security — Flowfolio`
  - `<script type="module" src="...">` → `src="/src/privacy/main.tsx"`

  The file should look like this (match the exact head structure of `releases.html`):

  ```html
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/png" href="/logo.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <title>Privacy & Security — Flowfolio</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/privacy/main.tsx"></script>
    </body>
  </html>
  ```

  > Note: First read `releases.html` with the Read tool to confirm its exact head structure (font links, icon path, etc.) and match it exactly — do not guess.

- [ ] **Step 2: Commit**

  ```bash
  git add privacy.html
  git commit -m "feat: add privacy.html entry point"
  ```

---

### Task 8: Create Privacy page React entry point and CSS

**Files:**
- Create: `src/privacy/main.tsx`
- Create: `src/privacy/PrivacyPage.css`

- [ ] **Step 1: Create `src/privacy/main.tsx`**

  ```tsx
  import { StrictMode } from "react";
  import { createRoot } from "react-dom/client";
  import PrivacyPage from "./PrivacyPage";

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PrivacyPage />
    </StrictMode>
  );
  ```

- [ ] **Step 2: Create `src/privacy/PrivacyPage.css`**

  This file declares its own `--ff-*` root variables (no cross-bundle CSS import) and all page-specific styles:

  ```css
  /* ============================================
     FLOWFOLIO PRIVACY PAGE STYLES
     Obsidian Premium — Minimal, Dark, Editorial
     ============================================ */

  :root {
    --ff-bg: #080808;
    --ff-bg-card: #0d0d0d;
    --ff-border: rgba(255, 255, 255, 0.07);
    --ff-text: #ffffff;
    --ff-muted: #555555;
    --ff-green: #00e599;
    --ff-green-dim: rgba(0, 229, 153, 0.08);
    --ff-green-border: rgba(0, 229, 153, 0.18);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: var(--ff-bg);
    color: var(--ff-text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a { color: inherit; text-decoration: none; }
  a:hover { opacity: 0.8; }

  /* ── Navbar ─────────────────────────────────── */
  .pp-navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 56px;
    display: flex;
    align-items: center;
    background: rgba(8, 8, 8, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--ff-border);
  }

  .pp-navbar-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pp-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: 17px;
    color: var(--ff-text);
  }

  .pp-logo-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ff-green);
    flex-shrink: 0;
  }

  .pp-nav-links {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .pp-nav-links a {
    font-size: 13px;
    font-weight: 400;
    color: var(--ff-muted);
    transition: color 0.15s;
  }

  .pp-nav-links a:hover,
  .pp-nav-links a.active {
    color: var(--ff-text);
    opacity: 1;
  }

  /* ── Page layout ────────────────────────────── */
  .pp-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 40px;
  }

  /* ── Shared section styles ──────────────────── */
  .pp-section {
    padding: 60px 0;
    border-bottom: 1px solid var(--ff-border);
  }

  .pp-section-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ff-muted);
    margin-bottom: 16px;
  }

  .pp-section-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: 28px;
    line-height: 1.1;
    margin-bottom: 28px;
  }

  /* ── Hero ───────────────────────────────────── */
  .pp-hero {
    padding: 80px 0 60px;
    border-bottom: 1px solid var(--ff-border);
  }

  .pp-hero-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(40px, 5vw, 60px);
    line-height: 1.05;
    letter-spacing: -0.01em;
    margin-bottom: 20px;
  }

  .pp-hero-subtitle {
    font-size: 15px;
    font-weight: 300;
    color: var(--ff-muted);
    max-width: 520px;
    line-height: 1.7;
  }

  .pp-badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 28px;
  }

  .pp-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--ff-green-dim);
    border: 1px solid var(--ff-green-border);
    border-radius: 6px;
    padding: 7px 12px;
    font-size: 11px;
    font-weight: 500;
    color: var(--ff-green);
  }

  .pp-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--ff-green);
    flex-shrink: 0;
  }

  /* ── Never-do grid ──────────────────────────── */
  .pp-never-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--ff-border);
    border: 1px solid var(--ff-border);
    border-radius: 10px;
    overflow: hidden;
  }

  .pp-never-item {
    background: var(--ff-bg-card);
    padding: 24px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .pp-never-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: rgba(255, 60, 60, 0.08);
    border: 1px solid rgba(255, 60, 60, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .pp-never-text h4 {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .pp-never-text p {
    font-size: 12px;
    color: var(--ff-muted);
    line-height: 1.6;
  }

  /* ── Architecture diagram ───────────────────── */
  .pp-arch-diagram {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
    row-gap: 16px;
  }

  .pp-arch-box {
    background: var(--ff-bg-card);
    border: 1px solid var(--ff-border);
    border-radius: 8px;
    padding: 20px 24px;
    text-align: center;
    min-width: 130px;
  }

  .pp-arch-box--green {
    border-color: rgba(0, 229, 153, 0.25);
  }

  .pp-arch-blocked {
    background: rgba(255, 60, 60, 0.04);
    border: 1px solid rgba(255, 60, 60, 0.12);
    border-radius: 8px;
    padding: 20px 24px;
    text-align: center;
    min-width: 110px;
  }

  .pp-arch-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    background: var(--ff-green-dim);
    border: 1px solid var(--ff-green-border);
  }

  .pp-arch-icon--muted {
    background: rgba(255, 255, 255, 0.04);
    border-color: var(--ff-border);
  }

  .pp-arch-icon--red {
    background: rgba(255, 60, 60, 0.08);
    border-color: rgba(255, 60, 60, 0.15);
  }

  .pp-arch-box-label {
    font-size: 12px;
    font-weight: 500;
  }

  .pp-arch-box-sub {
    font-size: 10px;
    color: var(--ff-muted);
    margin-top: 4px;
  }

  .pp-arch-blocked-label {
    font-size: 11px;
    color: #ff6b6b;
    line-height: 1.4;
  }

  .pp-arch-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 0 12px;
  }

  .pp-arch-arrow-line {
    width: 32px;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  .pp-arch-arrow-label {
    font-size: 9px;
    color: var(--ff-muted);
    white-space: nowrap;
  }

  .pp-arch-gap { width: 24px; }

  .pp-arch-blocked-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  /* ── Verify list ────────────────────────────── */
  .pp-verify-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    border: 1px solid var(--ff-border);
    border-radius: 10px;
    overflow: hidden;
  }

  .pp-verify-row {
    background: var(--ff-bg-card);
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--ff-border);
    text-decoration: none;
    transition: background 0.15s;
  }

  .pp-verify-row:last-child {
    border-bottom: none;
  }

  .pp-verify-row:hover {
    background: rgba(255, 255, 255, 0.02);
    opacity: 1;
  }

  .pp-verify-row-left h4 {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 2px;
    color: var(--ff-text);
  }

  .pp-verify-row-left p {
    font-size: 11px;
    color: var(--ff-muted);
  }

  .pp-verify-row-right {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--ff-green);
    white-space: nowrap;
  }

  /* ── Footer ─────────────────────────────────── */
  .pp-footer {
    border-top: 1px solid var(--ff-border);
    padding: 32px 40px;
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pp-footer-brand {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .pp-footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: 17px;
  }

  .pp-footer-tagline {
    font-size: 11px;
    color: var(--ff-muted);
  }

  .pp-footer-links {
    display: flex;
    gap: 20px;
  }

  .pp-footer-links a {
    font-size: 12px;
    color: var(--ff-muted);
    transition: color 0.15s;
  }

  .pp-footer-links a:hover {
    color: var(--ff-text);
    opacity: 1;
  }

  /* ── Responsive ─────────────────────────────── */
  @media (max-width: 768px) {
    .pp-navbar-content { padding: 0 20px; }
    .pp-nav-links { gap: 16px; }
    .pp-nav-links li:nth-child(n+3) { display: none; }
    .pp-page { padding: 0 20px; }
    .pp-hero { padding: 56px 0 40px; }
    .pp-never-grid { grid-template-columns: 1fr; }
    .pp-arch-diagram { flex-direction: column; gap: 16px; }
    .pp-arch-arrow { display: none; }
    .pp-arch-gap { display: none; }
    .pp-arch-blocked-group { flex-direction: column; }
    .pp-footer { flex-direction: column; gap: 24px; padding: 32px 20px; }
  }
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/privacy/main.tsx src/privacy/PrivacyPage.css
  git commit -m "feat: add privacy page entry point and CSS"
  ```

---

### Task 9: Create `PrivacyPage` component

**Files:**
- Create: `src/privacy/PrivacyPage.tsx`

- [ ] **Step 1: Create the component**

  Create `src/privacy/PrivacyPage.tsx`:

  ```tsx
  import "./PrivacyPage.css";
  import {
    Monitor,
    Activity,
    Server,
    Cloud,
    X,
    ArrowRight,
    Github,
  } from "lucide-react";

  function PrivacyPage() {
    return (
      <div>
        {/* Navbar */}
        <nav className="pp-navbar">
          <div className="pp-navbar-content">
            <a href="landing.html" className="pp-logo">
              <span className="pp-logo-dot" />
              Flowfolio
            </a>
            <ul className="pp-nav-links">
              <li><a href="landing.html#features">Features</a></li>
              <li><a href="features.html">Docs</a></li>
              <li><a href="releases.html">Releases</a></li>
              <li><a href="privacy.html" className="active">Privacy</a></li>
              <li><a href="landing.html#download">Download</a></li>
            </ul>
          </div>
        </nav>

        <div className="pp-page">

          {/* Hero */}
          <section className="pp-hero">
            <p className="pp-section-eyebrow">Privacy & Security</p>
            <h1 className="pp-hero-title">
              We can't see your data.<br />By design.
            </h1>
            <p className="pp-hero-subtitle">
              Flowfolio runs entirely on your machine. No accounts. No servers.
              No telemetry. This page explains exactly what that means technically.
            </p>
            <div className="pp-badges">
              <span className="pp-badge"><span className="pp-badge-dot" />No network on startup</span>
              <span className="pp-badge"><span className="pp-badge-dot" />No accounts required</span>
              <span className="pp-badge"><span className="pp-badge-dot" />Auditable source code</span>
              <span className="pp-badge"><span className="pp-badge-dot" />Local filesystem only</span>
            </div>
          </section>

          {/* What we never do */}
          <section className="pp-section">
            <h2 className="pp-section-title">What we never do.</h2>
            <div className="pp-never-grid">
              <div className="pp-never-item">
                <div className="pp-never-icon">
                  <X size={10} color="#ff6b6b" />
                </div>
                <div className="pp-never-text">
                  <h4>Collect portfolio data</h4>
                  <p>Your holdings, strategies, and journal entries never leave your machine.</p>
                </div>
              </div>
              <div className="pp-never-item">
                <div className="pp-never-icon">
                  <X size={10} color="#ff6b6b" />
                </div>
                <div className="pp-never-text">
                  <h4>Track usage or analytics</h4>
                  <p>No crash reports, usage events, or feature tracking. Zero telemetry.</p>
                </div>
              </div>
              <div className="pp-never-item">
                <div className="pp-never-icon">
                  <X size={10} color="#ff6b6b" />
                </div>
                <div className="pp-never-text">
                  <h4>Require an account</h4>
                  <p>Download and use. No sign-up, no email, no license key.</p>
                </div>
              </div>
              <div className="pp-never-item">
                <div className="pp-never-icon">
                  <X size={10} color="#ff6b6b" />
                </div>
                <div className="pp-never-text">
                  <h4>Phone home on startup</h4>
                  <p>The only network call the app makes is to fetch market data you explicitly request.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data flow diagram */}
          <section className="pp-section">
            <h2 className="pp-section-title">How your data flows.</h2>
            <div className="pp-arch-diagram">
              <div className="pp-arch-box pp-arch-box--green">
                <div className="pp-arch-icon">
                  <Monitor size={16} color="#00e599" />
                </div>
                <div className="pp-arch-box-label">Your Machine</div>
                <div className="pp-arch-box-sub">App + local DB</div>
              </div>

              <div className="pp-arch-arrow">
                <div className="pp-arch-arrow-line" />
                <div className="pp-arch-arrow-label">market data only</div>
              </div>

              <div className="pp-arch-box">
                <div className="pp-arch-icon pp-arch-icon--muted">
                  <Activity size={16} color="#555" />
                </div>
                <div className="pp-arch-box-label">Market APIs</div>
                <div className="pp-arch-box-sub">Prices, fundamentals</div>
              </div>

              <div className="pp-arch-gap" />

              <div className="pp-arch-blocked-group">
                <div className="pp-arch-blocked">
                  <div className="pp-arch-icon pp-arch-icon--red">
                    <Server size={16} color="#ff6b6b" />
                  </div>
                  <div className="pp-arch-blocked-label">No Vincrypt<br />servers</div>
                </div>
                <div className="pp-arch-blocked">
                  <div className="pp-arch-icon pp-arch-icon--red">
                    <Cloud size={16} color="#ff6b6b" />
                  </div>
                  <div className="pp-arch-blocked-label">No cloud<br />storage</div>
                </div>
              </div>
            </div>
          </section>

          {/* Verify it yourself */}
          <section className="pp-section" style={{ borderBottom: "none" }}>
            <h2 className="pp-section-title">Verify it yourself.</h2>
            <div className="pp-verify-list">
              <a
                href="https://github.com/Vincrypt-Management/flowfolio/blob/main/src/core/api/client.ts"
                target="_blank"
                rel="noopener noreferrer"
                className="pp-verify-row"
              >
                <div className="pp-verify-row-left">
                  <h4>Network calls</h4>
                  <p>See exactly what URLs the app fetches</p>
                </div>
                <div className="pp-verify-row-right">
                  src/core/api/client.ts
                  <ArrowRight size={12} />
                </div>
              </a>
              <a
                href="https://github.com/Vincrypt-Management/flowfolio/blob/main/src/services/localCache.ts"
                target="_blank"
                rel="noopener noreferrer"
                className="pp-verify-row"
              >
                <div className="pp-verify-row-left">
                  <h4>Local storage</h4>
                  <p>All data written to the local filesystem</p>
                </div>
                <div className="pp-verify-row-right">
                  src/services/localCache.ts
                  <ArrowRight size={12} />
                </div>
              </a>
              <a
                href="https://github.com/Vincrypt-Management/flowfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="pp-verify-row"
              >
                <div className="pp-verify-row-left">
                  <h4>No telemetry</h4>
                  <p>Search the entire repo — no analytics SDK</p>
                </div>
                <div className="pp-verify-row-right">
                  View on GitHub
                  <Github size={12} />
                </div>
              </a>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid var(--ff-border)" }}>
          <div className="pp-footer">
            <div className="pp-footer-brand">
              <span className="pp-footer-logo">
                <span className="pp-logo-dot" />
                Flowfolio
              </span>
              <span className="pp-footer-tagline">Made for privacy-conscious investors.</span>
            </div>
            <div className="pp-footer-links">
              <a href="https://github.com/Vincrypt-Management/flowfolio" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="features.html">Documentation</a>
              <a href="privacy.html">Privacy</a>
              <a href="landing.html">Home</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  export default PrivacyPage;
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 3: Build the landing bundle**

  Run: `npm run build:landing`
  Expected: build succeeds, `dist-landing/` contains a `privacy` entry

- [ ] **Step 4: Verify visually in dev server**

  Run: `npm run dev:landing`
  Open `http://localhost:3000/privacy.html` and confirm:
  - Navbar renders with Privacy link active
  - All 4 sections render: hero with badges, never-do 2×2 grid, architecture diagram, verify list
  - Footer renders with links
  - No console errors

  Stop the dev server.

- [ ] **Step 5: Commit**

  ```bash
  git add privacy.html src/privacy/
  git commit -m "feat: add Privacy & Security page"
  ```

---

## Chunk 4: Docs Additions + Nav/Footer Updates

**Files:**
- Modify: `src/features/FeaturesPage.tsx`
- Modify: `src/landing/components/Navbar.tsx`
- Modify: `src/landing/components/Footer.tsx`
- Modify: `src/releases/ReleasesPage.tsx`

---

### Task 10: Add compatibility matrix and FAQ to `FeaturesPage`

**Files:**
- Modify: `src/features/FeaturesPage.tsx`
- Modify: `src/features/FeaturesPage.css`

- [ ] **Step 1: Add Lucide imports to `FeaturesPage.tsx`**

  The file already imports many Lucide icons. Add the following to the existing import from `"lucide-react"`:
  `Laptop`, `LayoutGrid`, `Terminal`, `Check`, `ChevronDown`

  ```tsx
  // Find the existing import block and add the 5 new icons
  import {
    // ... existing icons ...
    Laptop,
    LayoutGrid,
    Terminal,
    Check,
    ChevronDown,
  } from "lucide-react";
  ```

- [ ] **Step 2: Add React `useState` for FAQ accordion**

  The file already imports `useState` from React — confirm it's in the import. If not, add it.

- [ ] **Step 3: Add `faqOpen` state to the component**

  Inside `FeaturesPage` function body (near the other `useState` calls), add:

  ```tsx
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  ```

- [ ] **Step 4: Define FAQ data above the component**

  Add this constant above the `FeaturesPage` function (after the imports):

  ```tsx
  const FAQ_ITEMS = [
    {
      q: "Does Flowfolio work without an internet connection?",
      a: "Yes — entirely. All strategy logic, rankings, portfolio tracking, and backtesting run locally. Network is only used when you explicitly request fresh market data. Works in airplane mode with cached data.",
    },
    {
      q: "Is it really free? What's the catch?",
      a: "No catch. Free, open source (MIT), no ads, no paid tier. The project is maintained by Vincrypt Management as an open-source tool for the investing community.",
    },
    {
      q: "What data sources does it use for prices and fundamentals?",
      a: "Flowfolio fetches from public market data APIs. You configure which source in settings. All fetched data is cached locally — subsequent runs use the cache.",
    },
    {
      q: "How does the local AI work? Does it phone home?",
      a: "The Vibe Studio AI runs via your local OpenRouter-compatible endpoint or an on-device model. No data is sent to Vincrypt servers. You control which model provider is used.",
    },
    {
      q: "Can I use this on Windows or Linux?",
      a: "Yes. Windows 10/11 (.msi) and Linux x86_64 (.AppImage) are fully supported. See the compatibility table above.",
    },
    {
      q: "Where is my data stored? Can I back it up?",
      a: "All data is stored in your OS app data directory. You can back it up by copying that folder. Nothing is stored in the cloud.",
    },
  ] as const;
  ```

- [ ] **Step 5: Add compatibility matrix and FAQ JSX**

  Locate the closing `</main>` tag in `FeaturesPage` (around line 1210). Just before it (after the last existing section's closing tag), add the two new sections:

  ```tsx
  {/* ── Compatibility Matrix ─────────────────── */}
  <section className="fp-compat-section" id="compatibility">
    <p className="fp-section-eyebrow">Platform Support</p>
    <h2 className="fp-section-title">What runs where.</h2>
    <div className="fp-compat-table">
      {/* Header */}
      <div className="fp-compat-row fp-compat-row--header">
        <div className="fp-compat-cell fp-compat-cell--header">Platform</div>
        <div className="fp-compat-cell fp-compat-cell--header">Download</div>
        <div className="fp-compat-cell fp-compat-cell--header">Offline</div>
        <div className="fp-compat-cell fp-compat-cell--header">Local AI</div>
        <div className="fp-compat-cell fp-compat-cell--header">Status</div>
      </div>
      {/* macOS Apple Silicon */}
      <div className="fp-compat-row">
        <div className="fp-compat-cell fp-compat-cell--platform">
          <Laptop size={14} className="fp-compat-platform-icon" />
          macOS — Apple Silicon
        </div>
        <div className="fp-compat-cell">.dmg</div>
        <div className="fp-compat-cell fp-compat-cell--check"><Check size={13} /></div>
        <div className="fp-compat-cell fp-compat-cell--check"><Check size={13} /></div>
        <div className="fp-compat-cell fp-compat-cell--recommended">Recommended</div>
      </div>
      {/* macOS Intel */}
      <div className="fp-compat-row">
        <div className="fp-compat-cell fp-compat-cell--platform">
          <Laptop size={14} className="fp-compat-platform-icon" />
          macOS — Intel
        </div>
        <div className="fp-compat-cell">.dmg</div>
        <div className="fp-compat-cell fp-compat-cell--check"><Check size={13} /></div>
        <div className="fp-compat-cell fp-compat-cell--check"><Check size={13} /></div>
        <div className="fp-compat-cell fp-compat-cell--stable">Stable</div>
      </div>
      {/* Windows */}
      <div className="fp-compat-row">
        <div className="fp-compat-cell fp-compat-cell--platform">
          <LayoutGrid size={14} className="fp-compat-platform-icon" />
          Windows 10 / 11
        </div>
        <div className="fp-compat-cell">.msi</div>
        <div className="fp-compat-cell fp-compat-cell--check"><Check size={13} /></div>
        <div className="fp-compat-cell fp-compat-cell--check"><Check size={13} /></div>
        <div className="fp-compat-cell fp-compat-cell--stable">Stable</div>
      </div>
      {/* Linux */}
      <div className="fp-compat-row">
        <div className="fp-compat-cell fp-compat-cell--platform">
          <Terminal size={14} className="fp-compat-platform-icon" />
          Linux (x86_64)
        </div>
        <div className="fp-compat-cell">.AppImage</div>
        <div className="fp-compat-cell fp-compat-cell--check"><Check size={13} /></div>
        <div className="fp-compat-cell fp-compat-cell--dash">—</div>
        <div className="fp-compat-cell fp-compat-cell--beta">Beta</div>
      </div>
    </div>
  </section>

  {/* ── FAQ ──────────────────────────────────── */}
  <section className="fp-faq-section" id="faq">
    <p className="fp-section-eyebrow">FAQ</p>
    <h2 className="fp-section-title">Common questions.</h2>
    <div className="fp-faq-list">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className={`fp-faq-item${faqOpen === i ? " fp-faq-item--open" : ""}`}>
          <button
            className="fp-faq-question"
            onClick={() => setFaqOpen(faqOpen === i ? null : i)}
            aria-expanded={faqOpen === i}
          >
            {item.q}
            <ChevronDown
              size={14}
              className="fp-faq-chevron"
              style={{ transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          {faqOpen === i && (
            <div className="fp-faq-answer">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  </section>
  ```

- [ ] **Step 6: Add CSS for compat + FAQ to `FeaturesPage.css`**

  Append to the bottom of `src/features/FeaturesPage.css`:

  ```css
  /* ── Compatibility Matrix ─────────────────── */
  .fp-compat-section {
    padding: 60px 32px;
    border-top: 1px solid var(--ff-border, rgba(255,255,255,0.07));
  }

  .fp-section-eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ff-muted, #555);
    margin-bottom: 12px;
  }

  .fp-section-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-style: italic;
    font-weight: 300;
    font-size: 28px;
    color: #fff;
    margin-bottom: 28px;
    line-height: 1.1;
  }

  .fp-compat-table {
    border: 1px solid var(--ff-border, rgba(255,255,255,0.07));
    border-radius: 10px;
    overflow: hidden;
  }

  .fp-compat-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    border-bottom: 1px solid var(--ff-border, rgba(255,255,255,0.07));
  }

  .fp-compat-row:last-child {
    border-bottom: none;
  }

  .fp-compat-row--header {
    background: rgba(255, 255, 255, 0.02);
  }

  .fp-compat-cell {
    padding: 13px 16px;
    font-size: 12px;
    color: #fff;
    border-right: 1px solid var(--ff-border, rgba(255,255,255,0.07));
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0d0d0d;
  }

  .fp-compat-cell:last-child {
    border-right: none;
  }

  .fp-compat-cell--header {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #555;
    background: transparent;
  }

  .fp-compat-platform-icon {
    color: #555;
    flex-shrink: 0;
  }

  .fp-compat-cell--check { color: #00e599; }
  .fp-compat-cell--dash { color: #555; }
  .fp-compat-cell--recommended { color: #00e599; font-size: 11px; font-weight: 500; }
  .fp-compat-cell--stable { color: #00e599; font-size: 11px; font-weight: 500; }
  .fp-compat-cell--beta { color: #555; font-size: 11px; font-weight: 500; }

  /* ── FAQ ──────────────────────────────────── */
  .fp-faq-section {
    padding: 60px 32px;
    border-top: 1px solid var(--ff-border, rgba(255,255,255,0.07));
  }

  .fp-faq-list {
    border: 1px solid var(--ff-border, rgba(255,255,255,0.07));
    border-radius: 10px;
    overflow: hidden;
  }

  .fp-faq-item {
    background: #0d0d0d;
    border-bottom: 1px solid var(--ff-border, rgba(255,255,255,0.07));
  }

  .fp-faq-item:last-child {
    border-bottom: none;
  }

  .fp-faq-question {
    width: 100%;
    padding: 18px 20px;
    background: none;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    text-align: left;
    gap: 16px;
  }

  .fp-faq-chevron {
    color: #555;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .fp-faq-item--open .fp-faq-chevron {
    color: #00e599;
  }

  .fp-faq-answer {
    padding: 0 20px 18px;
    font-size: 12px;
    color: #555;
    line-height: 1.7;
    border-top: 1px solid var(--ff-border, rgba(255,255,255,0.07));
    padding-top: 14px;
  }
  ```

- [ ] **Step 7: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 8: Verify visually**

  Run: `npm run dev:landing`
  Open `http://localhost:3000/features.html` and scroll to the bottom. Confirm:
  - Compatibility matrix shows 4 rows with correct platform icons (`Laptop`, `LayoutGrid`, `Terminal`)
  - Green check marks in Offline and Local AI columns
  - Linux Local AI shows "—" in muted color
  - Status labels colored correctly (green for Recommended/Stable, muted for Beta)
  - FAQ accordion: click a question — answer expands, chevron rotates 180°, click again — collapses

  Stop the dev server.

- [ ] **Step 9: Commit**

  ```bash
  git add src/features/FeaturesPage.tsx src/features/FeaturesPage.css
  git commit -m "feat: add compatibility matrix and FAQ to docs page"
  ```

---

### Task 11: Add Privacy nav/footer links across all pages

**Files:**
- Modify: `src/landing/components/Navbar.tsx`
- Modify: `src/landing/components/Footer.tsx`
- Modify: `src/releases/ReleasesPage.tsx`

- [ ] **Step 1: Add Privacy link to `src/landing/components/Navbar.tsx`**

  In the `<ul className="landing-nav-links">`, add `<li><a href="privacy.html">Privacy</a></li>` between Releases and Download:

  ```tsx
  // Before:
  <li><a href="releases.html">Releases</a></li>
  <li><a href="#download">Download</a></li>

  // After:
  <li><a href="releases.html">Releases</a></li>
  <li><a href="privacy.html">Privacy</a></li>
  <li><a href="#download">Download</a></li>
  ```

- [ ] **Step 2: Add Privacy link to `src/landing/components/Footer.tsx`**

  In the `<div className="landing-footer-links">`, add a Privacy link:

  ```tsx
  // Before:
  <a href="https://github.com/Vincrypt-Management/flowfolio" ...>GitHub</a>
  <a href="https://github.com/Vincrypt-Management/flowfolio#readme" ...>Documentation</a>

  // After:
  <a href="https://github.com/Vincrypt-Management/flowfolio" ...>GitHub</a>
  <a href="https://github.com/Vincrypt-Management/flowfolio#readme" ...>Documentation</a>
  <a href="privacy.html">Privacy</a>
  ```

- [ ] **Step 3: Add Privacy link to `src/releases/ReleasesPage.tsx` navbar**

  In `<ul className="rp-nav-links">`, add between Docs and Download:

  ```tsx
  // Before:
  <li><a href="features.html">Docs</a></li>
  <li><a href="landing.html#download">Download</a></li>

  // After:
  <li><a href="features.html">Docs</a></li>
  <li><a href="privacy.html">Privacy</a></li>
  <li><a href="landing.html#download">Download</a></li>
  ```

- [ ] **Step 4: Add Privacy link to `src/releases/ReleasesPage.tsx` footer**

  In `<div className="rp-footer-links">`, add:

  ```tsx
  // Before:
  <a href="https://github.com/Vincrypt-Management/flowfolio" ...>GitHub</a>
  <a href="features.html">Documentation</a>
  <a href="landing.html">Home</a>

  // After:
  <a href="https://github.com/Vincrypt-Management/flowfolio" ...>GitHub</a>
  <a href="features.html">Documentation</a>
  <a href="privacy.html">Privacy</a>
  <a href="landing.html">Home</a>
  ```

- [ ] **Step 5: Add Privacy link to `src/features/FeaturesPage.tsx` topbar**

  In `<div className="features-topbar-right">`, add a Privacy link alongside the GitHub icon:

  ```tsx
  // Before:
  <div className="features-topbar-right">
    <a
      href="https://github.com/Vincrypt-Management/flowfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="features-topbar-link"
    >
      <Github size={16} />
    </a>
  </div>

  // After:
  <div className="features-topbar-right">
    <a href="privacy.html" className="features-topbar-link">
      Privacy
    </a>
    <a
      href="https://github.com/Vincrypt-Management/flowfolio"
      target="_blank"
      rel="noopener noreferrer"
      className="features-topbar-link"
    >
      <Github size={16} />
    </a>
  </div>
  ```

- [ ] **Step 6: Add Privacy link to `src/features/FeaturesPage.tsx` footer**

  In `<div className="features-footer-links">` (near line 1195), add a Privacy link:

  ```tsx
  // Before:
  <div className="features-footer-links">
    <a href="https://github.com/Vincrypt-Management/flowfolio" ...>
      <Github size={16} />
      GitHub
    </a>
    <a href="landing.html">
      <FileText size={16} />
      Home
    </a>
  </div>

  // After:
  <div className="features-footer-links">
    <a href="https://github.com/Vincrypt-Management/flowfolio" ...>
      <Github size={16} />
      GitHub
    </a>
    <a href="privacy.html">Privacy</a>
    <a href="landing.html">
      <FileText size={16} />
      Home
    </a>
  </div>
  ```

- [ ] **Step 7: Verify TypeScript compiles**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 8: Full build verification**

  Run: `npm run build:landing`
  Expected: build succeeds with no errors, `dist-landing/` contains `landing`, `features`, `releases`, and `privacy` entry points.

- [ ] **Step 9: Verify all nav links in dev server**

  Run: `npm run dev:landing`
  Check each page:
  - `landing.html` — navbar has Privacy link, footer has Privacy link
  - `features.html` — topbar-right has Privacy text link, footer has Privacy link
  - `releases.html` — navbar has Privacy link, footer has Privacy link
  - `privacy.html` — Privacy link is styled as active

  Stop the dev server.

- [ ] **Step 10: Commit**

  ```bash
  git add src/landing/components/Navbar.tsx \
          src/landing/components/Footer.tsx \
          src/releases/ReleasesPage.tsx \
          src/features/FeaturesPage.tsx
  git commit -m "feat: add Privacy nav and footer links across all pages"
  ```

---

### Task 12: Final lint + full success criteria check

- [ ] **Step 1: Run lint**

  Run: `npm run lint`
  Expected: zero errors

- [ ] **Step 2: Run full landing build**

  Run: `npm run build:landing`
  Expected: clean build, no warnings about missing entries

- [ ] **Step 3: Spot-check all success criteria**

  Run `npm run dev:landing` and verify each item from the spec:

  **Activity strip:**
  - [ ] Release badge shows version + "X days ago" (or no date if fallback)
  - [ ] 8 commit bars visible, last 4 brighter green
  - [ ] All bars at least 4px tall
  - [ ] "X commits this month" text present

  **Privacy page:**
  - [ ] All 4 sections render correctly on `privacy.html`
  - [ ] All icons are Lucide SVG components, no emoji

  **Docs additions:**
  - [ ] Compat matrix shows 4 platforms on `features.html`
  - [ ] Linux row shows "—" for Local AI
  - [ ] FAQ accordion opens/closes for all 6 questions

  **Nav:**
  - [ ] Privacy link in navbar on landing, releases, and features pages
  - [ ] Privacy link in footer on landing and releases pages

- [ ] **Step 4: Final commit**

  ```bash
  git add -A
  git commit -m "chore: verified professional maturity features complete"
  ```
