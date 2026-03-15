# GitHub Releases Auto-Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded v0.2.0 download links in DownloadSection with live data auto-fetched from the GitHub releases API, with localStorage caching and per-platform fallback.

**Architecture:** A new `useGitHubRelease` hook handles fetching, caching, fallback, and OS detection. `DownloadSection` becomes a pure display component that merges hook data with platform icons. A "Recommended for you" badge highlights the detected platform.

**Tech Stack:** React 19, TypeScript, Vite, CSS custom properties (no additional dependencies needed)

---

## Chunk 1: Storage key constant + hook scaffold

### Task 1: Add GH_RELEASE_CACHE to STORAGE_KEYS

**Files:**
- Modify: `src/shared/constants/index.ts:119-124`

- [ ] **Step 1: Open the file and add the new key**

In `src/shared/constants/index.ts`, find the `STORAGE_KEYS` object (line 119) and add `GH_RELEASE_CACHE`:

```ts
export const STORAGE_KEYS = {
  CACHE_PREFIX: 'flowfolio_cache_v2',
  SETTINGS: 'flowfolio_settings',
  THEME: 'flowfolio_theme',
  RECENT_SYMBOLS: 'flowfolio_recent_symbols',
  GH_RELEASE_CACHE: 'flowfolio_gh_release_cache',
} as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/evintleovonzko/Documents/Works/vincrypt/landing-page
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/shared/constants/index.ts
git commit -m "feat: add GH_RELEASE_CACHE to STORAGE_KEYS"
```

---

### Task 2: Create useGitHubRelease hook

**Files:**
- Create: `src/landing/hooks/useGitHubRelease.ts`

This hook owns all the data fetching, caching, asset matching, and OS detection logic. It does NOT own icons — those stay in the component.

- [ ] **Step 1: Create the hooks directory and file**

Create `src/landing/hooks/useGitHubRelease.ts` with the following content:

```ts
import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../../shared/constants";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PlatformRelease {
  name: "Windows" | "macOS" | "Linux" | "Android";
  href: string;
  version: string;
}

interface ReleaseCacheEntry {
  schemaVersion: 1;
  version: string;
  platforms: PlatformRelease[];
  cachedAt: number;
}

export interface UseGitHubReleaseResult {
  loading: boolean;
  version: string;
  platforms: PlatformRelease[];
  detectedPlatform: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const REPO = "Vincrypt-Management/flowfolio";
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const SCHEMA_VERSION = 1 as const;

const FALLBACK_VERSION = "v0.2.0";
const FALLBACK_BASE =
  "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.0";

const FALLBACK_PLATFORMS: PlatformRelease[] = [
  {
    name: "Windows",
    version: FALLBACK_VERSION,
    href: `${FALLBACK_BASE}/FlowFolio-0.2.0-windows-x64-setup.exe`,
  },
  {
    name: "macOS",
    version: FALLBACK_VERSION,
    href: `${FALLBACK_BASE}/FlowFolio-0.2.0-macos-aarch64.dmg`,
  },
  {
    name: "Linux",
    version: FALLBACK_VERSION,
    href: `${FALLBACK_BASE}/FlowFolio-0.2.0-linux-amd64.AppImage`,
  },
  {
    name: "Android",
    version: FALLBACK_VERSION,
    href: `${FALLBACK_BASE}/FlowFolio-0.2.0-android.apk`,
  },
];

// Asset keyword matching — Android checked before Linux to avoid overlap.
// Each platform independently scans the full assets array and picks the first match.
const PLATFORM_MATCHERS: Array<{
  name: PlatformRelease["name"];
  keywords: string[];
}> = [
  { name: "Android", keywords: ["android", ".apk"] },
  { name: "Windows", keywords: ["windows", ".exe", ".msi"] },
  { name: "macOS",   keywords: ["macos", "darwin", ".dmg"] },
  { name: "Linux",   keywords: ["linux", ".appimage", ".deb"] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectPlatform(): string {
  if (typeof navigator === "undefined" || !navigator.userAgent) return "";
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "Android";
  if (/Win/i.test(ua)) return "Windows";
  if (/Mac/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return ""; // iOS, iPadOS, unknown — no badge shown
}

function readCache(): ReleaseCacheEntry | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GH_RELEASE_CACHE);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Partial<ReleaseCacheEntry>;
    if (
      entry.schemaVersion !== SCHEMA_VERSION ||
      typeof entry.cachedAt !== "number" ||
      !Array.isArray(entry.platforms) ||
      entry.platforms.length === 0 ||
      typeof entry.version !== "string"
    ) {
      console.warn("[useGitHubRelease] Cache schema invalid, treating as miss");
      return null;
    }
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
    return entry as ReleaseCacheEntry;
  } catch {
    console.warn("[useGitHubRelease] Cache read failed, treating as miss");
    return null;
  }
}

function writeCache(entry: ReleaseCacheEntry): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GH_RELEASE_CACHE, JSON.stringify(entry));
  } catch {
    // Storage quota exceeded or access denied — silently ignore
  }
}

function flushCacheIfRequested(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("flush_release_cache") === "1") {
      localStorage.removeItem(STORAGE_KEYS.GH_RELEASE_CACHE);
    }
  } catch {
    // window not available (SSR) — ignore
  }
}

function matchAssetsToPlatforms(
  assets: Array<{ browser_download_url: string; name: string }>,
  version: string
): PlatformRelease[] {
  return PLATFORM_MATCHERS.map(({ name, keywords }) => {
    const fallback = FALLBACK_PLATFORMS.find((p) => p.name === name)!;
    const match = assets.find((asset) =>
      keywords.some((kw) => asset.name.toLowerCase().includes(kw.toLowerCase()))
    );
    if (!match) {
      console.warn(
        `[useGitHubRelease] No asset found for ${name}, using fallback`
      );
      return fallback;
    }
    return { name, version, href: match.browser_download_url };
  });
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useGitHubRelease(): UseGitHubReleaseResult {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(FALLBACK_VERSION);
  const [platforms, setPlatforms] = useState<PlatformRelease[]>(FALLBACK_PLATFORMS);
  const detectedPlatform = detectPlatform();

  useEffect(() => {
    // Must flush before reading cache so the escape hatch works
    flushCacheIfRequested();

    const cached = readCache();
    if (cached) {
      setVersion(cached.version);
      setPlatforms(cached.platforms);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchRelease() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) {
          console.warn(
            `[useGitHubRelease] GitHub API returned ${res.status}, using fallback`
          );
          setLoading(false);
          return;
        }
        const data = await res.json();
        const tagName: string = data.tag_name ?? FALLBACK_VERSION;
        const assets: Array<{ browser_download_url: string; name: string }> =
          data.assets ?? [];

        if (assets.length === 0) {
          console.warn(
            "[useGitHubRelease] Release has no assets, using fallback"
          );
          setLoading(false);
          return;
        }

        const resolved = matchAssetsToPlatforms(assets, tagName);
        setVersion(tagName);
        setPlatforms(resolved);

        writeCache({
          schemaVersion: SCHEMA_VERSION,
          version: tagName,
          platforms: resolved,
          cachedAt: Date.now(),
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.warn("[useGitHubRelease] Fetch failed, using fallback:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRelease();

    return () => controller.abort();
  }, []);

  return { loading, version, platforms, detectedPlatform };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/landing/hooks/useGitHubRelease.ts
git commit -m "feat: add useGitHubRelease hook with cache and fallback"
```

---

## Chunk 2: Update DownloadSection + CSS

### Task 3: Rewrite DownloadSection to use the hook

**Files:**
- Modify: `src/landing/components/DownloadSection.tsx`

The component merges hook data (name, href, version) with a local icon map. The "Recommended for you" badge is rendered conditionally on the detected platform button.

- [ ] **Step 1: Replace the file contents**

Replace `src/landing/components/DownloadSection.tsx` entirely:

```tsx
import { FaWindows } from "react-icons/fa6";
import { SiApple, SiLinux, SiAndroid } from "react-icons/si";
import type { ReactNode } from "react";
import { useGitHubRelease } from "../hooks/useGitHubRelease";
import type { PlatformRelease } from "../hooks/useGitHubRelease";

// Icons live in the component — the hook owns no React UI concerns
const PLATFORM_ICONS: Record<PlatformRelease["name"], ReactNode> = {
  Windows: <FaWindows size={24} />,
  macOS:   <SiApple size={24} />,
  Linux:   <SiLinux size={24} />,
  Android: <SiAndroid size={24} />,
};

function DownloadSkeleton() {
  return (
    <div className="landing-platform-buttons">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="landing-platform-btn landing-platform-btn--skeleton" aria-hidden="true">
          <div className="landing-skeleton-icon" />
          <div className="landing-skeleton-text landing-skeleton-text--name" />
          <div className="landing-skeleton-text landing-skeleton-text--version" />
        </div>
      ))}
    </div>
  );
}

function DownloadSection() {
  const { loading, platforms, detectedPlatform } = useGitHubRelease();

  return (
    <section className="landing-download-section" id="download">
      <div className="landing-download-section-content">
        <h2 className="landing-download-title">Download Flowfolio</h2>
        <p className="landing-download-subtitle">
          Free and open source. No account required.
        </p>

        {loading ? (
          <DownloadSkeleton />
        ) : (
          <div className="landing-platform-buttons">
            {platforms.map((platform) => {
              const isRecommended = platform.name === detectedPlatform;
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  className={`landing-platform-btn${isRecommended ? " landing-platform-btn--recommended" : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isRecommended && (
                    <span className="landing-platform-recommended-badge">
                      Recommended for you
                    </span>
                  )}
                  {PLATFORM_ICONS[platform.name]}
                  <span className="landing-platform-name">{platform.name}</span>
                  <span className="landing-platform-version">{platform.version}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default DownloadSection;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run lint
```

Expected: no errors.

---

### Task 4: Add CSS for recommended badge and loading skeleton

**Files:**
- Modify: `src/landing/LandingPage.css` (append to the DOWNLOAD SECTION block, around line 634)

- [ ] **Step 1: Append styles to the DOWNLOAD SECTION block**

Find the footer comment block in `LandingPage.css` (around line 635). The exact anchor string is:

```
/* ============================================
   FOOTER
```

Insert the following CSS block immediately before that comment:

```css
/* flex-wrap so 4 buttons don't overflow on narrow viewports */
.landing-platform-buttons {
  flex-wrap: wrap;
}

/* Recommended badge */
.landing-platform-btn--recommended {
  border-color: rgba(0, 229, 153, 0.4);
  background: rgba(0, 229, 153, 0.06);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(0, 229, 153, 0.12);
  position: relative;
}

.landing-platform-recommended-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--landing-accent-primary);
  color: var(--landing-bg-darkest);
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  white-space: nowrap;
}

/* Loading skeleton */
.landing-platform-btn--skeleton {
  pointer-events: none;
  cursor: default;
  animation: skeletonPulse 1.5s ease-in-out infinite;
}

.landing-skeleton-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
}

.landing-skeleton-text {
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

.landing-skeleton-text--name {
  width: 64px;
  height: 14px;
}

.landing-skeleton-text--version {
  width: 40px;
  height: 11px;
}

@keyframes skeletonPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
```

- [ ] **Step 2: Verify TypeScript compiles and dev server starts**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Start the dev server and visually verify**

```bash
npm run dev:landing
```

Open the landing page in a browser. Verify:
- Download section loads (may show skeleton briefly, then buttons)
- Your platform's button has a green "Recommended for you" pill badge
- All 4 platform buttons are visible
- Hovering any button shows the green glow effect
- Version shown in each button (either live from API or `v0.2.0` fallback)

- [ ] **Step 4: Test cache behavior**

Open DevTools → Application → Local Storage. After the page loads, verify a `flowfolio_gh_release_cache` key exists with a JSON value containing `schemaVersion: 1`, `version`, `platforms`, and `cachedAt`.

Reload the page — the Network tab should show NO request to `api.github.com` (served from cache).

- [ ] **Step 5: Test cache flush escape hatch**

Navigate to `http://localhost:PORT/?flush_release_cache=1`. The `flowfolio_gh_release_cache` key should be gone from localStorage after load, and a fresh API request should appear in the Network tab.

- [ ] **Step 6: Test fallback**

In DevTools → Network, enable offline mode. Clear localStorage. Reload. The download buttons should still render (with `v0.2.0` links). A `console.warn` should appear in the console.

- [ ] **Step 7: Commit**

```bash
git add src/landing/components/DownloadSection.tsx src/landing/LandingPage.css
git commit -m "feat: integrate GitHub releases API into DownloadSection with recommended badge"
```

---

## Final checklist

- [ ] `flowfolio_gh_release_cache` key present in localStorage after first load
- [ ] Version label in all buttons reflects the GitHub API `tag_name`
- [ ] Each button's `href` is a live `browser_download_url` (verify in DevTools)
- [ ] Detected platform button has "Recommended for you" badge
- [ ] All 4 buttons always visible
- [ ] iOS/unknown OS: no badge, all buttons equal weight
- [ ] Offline / API failure: buttons still render with v0.2.0 fallback, `console.warn` emitted
- [ ] Second load within 1 hour: no network request to GitHub API
- [ ] `?flush_release_cache=1`: forces fresh fetch on next load
- [ ] Loading skeleton visible briefly on first load (no cached entry)
- [ ] `npm run lint` passes with zero errors
