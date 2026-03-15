# GitHub Releases Auto-Integration — Design Spec

**Date:** 2026-03-15
**Project:** Flowfolio Landing Page
**Repo:** `Vincrypt-Management/flowfolio`

---

## Problem

`DownloadSection.tsx` hardcodes the release version (`v0.2.0`) and all download URLs. Every new GitHub release requires a manual code change and redeploy of the landing page.

---

## Goal

Automatically fetch the latest GitHub release and display up-to-date download links for all four platforms (Windows, macOS, Linux, Android), with the user's platform auto-detected and visually highlighted as "Recommended."

---

## Solution: Runtime fetch with localStorage cache (Option C)

### Core Types

```ts
interface PlatformDownload {
  name: "Windows" | "macOS" | "Linux" | "Android";
  icon: ReactNode;
  href: string;
  version: string;
}

interface ReleaseCacheEntry {
  schemaVersion: 1;           // increment if PlatformDownload shape changes
  version: string;            // e.g. "v0.3.0"
  platforms: PlatformDownload[];
  cachedAt: number;           // Date.now()
}
```

### Hook Return Type

```ts
interface UseGitHubReleaseResult {
  loading: boolean;
  version: string;
  platforms: PlatformDownload[];
  detectedPlatform: string;   // "" if undetected (iOS, unknown, etc.)
  // error is intentionally omitted: failures fall back silently;
  // a console.warn is emitted for observability
}
```

### Data Flow

1. On mount, read `localStorage` key `flowfolio_gh_release_cache`
2. Validate cache:
   - `JSON.parse` succeeds
   - `schemaVersion === 1`
   - `cachedAt` is a number
   - `platforms` is a non-empty array
   - `cachedAt` is within the last 3600000ms (1 hour)
   - If any check fails → treat as cache miss, proceed to step 3
3. Fetch `https://api.github.com/repos/Vincrypt-Management/flowfolio/releases/latest` with an `AbortController` tied to the component lifecycle
4. On any failure (network error, non-200 response, non-JSON body, empty `assets` array) → emit `console.warn`, use hardcoded fallback, **do not write to cache**
5. On HTTP 200 with a parseable body and non-empty `assets`:
   - Extract `tag_name` as version
   - Map `assets[].browser_download_url` to platforms via keyword matching (see below)
   - For platforms with no matching asset → use that platform's hardcoded fallback URL; emit `console.warn`
   - Write result to `localStorage` (wrapped in try/catch; storage failure is silently ignored)
6. Set state: `{ loading: false, version, platforms, detectedPlatform }`
7. On unmount, abort the in-flight fetch via `AbortController.abort()`

### Hardcoded Fallback Data

The fallback constants live in `useGitHubRelease.ts` (not in `DownloadSection.tsx`). The existing `platforms` array in `DownloadSection.tsx` is removed and replaced by the hook's return value.

```ts
const FALLBACK_VERSION = "v0.2.0";
const FALLBACK_BASE = "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.0";
const FALLBACK_PLATFORMS: Omit<PlatformDownload, "icon">[] = [
  { name: "Windows", version: FALLBACK_VERSION, href: `${FALLBACK_BASE}/FlowFolio-0.2.0-windows-x64-setup.exe` },
  { name: "macOS",   version: FALLBACK_VERSION, href: `${FALLBACK_BASE}/FlowFolio-0.2.0-macos-aarch64.dmg` },
  { name: "Linux",   version: FALLBACK_VERSION, href: `${FALLBACK_BASE}/FlowFolio-0.2.0-linux-amd64.AppImage` },
  { name: "Android", version: FALLBACK_VERSION, href: `${FALLBACK_BASE}/FlowFolio-0.2.0-android.apk` },
];
```

### Cache Key

Use `flowfolio_gh_release_cache` (following the project's `flowfolio_*` namespace). Add it to `src/shared/constants/index.ts` under `STORAGE_KEYS`.

### Cache Invalidation Escape Hatch

Appending `?flush_release_cache=1` to the page URL clears the cache entry on load (useful for QA and debugging). No UI is exposed for this.

### Asset Matching

Each GitHub release asset is evaluated **in API array order**. Each platform independently scans the full asset list and picks the **first** asset whose filename (case-insensitive) matches one of its keywords. Platforms are evaluated independently — a filename can match multiple platforms (the first asset wins per-platform, not globally).

| Platform | Match keywords (checked in order, case-insensitive, substring match) |
|----------|-----------------------------------------------------------------------|
| Android  | `android`, `.apk`                                                     |
| Windows  | `windows`, `.exe`, `.msi`                                             |
| macOS    | `macos`, `darwin`, `.dmg`                                             |
| Linux    | `linux`, `.appimage`, `.deb`                                          |

Android is checked before Linux to avoid the Linux `userAgent` heuristic ambiguity. macOS keywords (`macos`, `darwin`) do not overlap with Windows filenames in practice; this limitation is accepted for v1.

**Known limitation:** If a release publishes multiple Linux assets (e.g., `amd64.AppImage` and `arm64.AppImage`), the first in the array is used regardless of the user's CPU architecture. Deferred to a future version.

### Platform Detection

Detected via `navigator.userAgent` string:

| Detected Platform | Heuristic                                    |
|-------------------|----------------------------------------------|
| `"Android"`       | Contains `Android`                           |
| `"Windows"`       | Contains `Win`                               |
| `"macOS"`         | Contains `Mac` (excluding `Android`)         |
| `"Linux"`         | Contains `Linux` (excluding `Android`)       |
| `""`              | Anything else (iOS, iPadOS, unknown, empty)  |

**iOS / iPadOS:** `detectedPlatform` is `""`. No "Recommended" badge is shown. All 4 platform buttons are displayed equally. This is intentional — no iOS release exists.

**`navigator.userAgent` unavailable:** Treat as `""` (no highlight).

---

## Files

### New: `src/landing/hooks/useGitHubRelease.ts`

Custom hook. Responsibilities:
- Manage `loading`, `version`, `platforms`, `detectedPlatform` state
- Read/validate localStorage cache
- Fetch GitHub API with AbortController
- Map assets to platforms
- Write valid results to cache
- Detect user OS
- Emit `console.warn` on any degraded path

### Modified: `src/landing/components/DownloadSection.tsx`

- Calls `useGitHubRelease()`
- Shows loading skeleton while `loading === true` (buttons non-interactive)
- Renders all 4 platform buttons
- Highlights the `detectedPlatform` button with a "Recommended for you" badge
- Other platforms shown de-emphasized below or alongside

### Modified: `src/shared/constants/index.ts`

- Add `STORAGE_KEYS.GH_RELEASE_CACHE = "flowfolio_gh_release_cache"`

---

## Error Handling Summary

| Scenario | Behavior |
|----------|----------|
| Network failure | `console.warn`, use full fallback, no cache write |
| HTTP 4xx / 5xx | `console.warn`, use full fallback, no cache write |
| HTTP 200, empty `assets[]` | `console.warn`, use full fallback, no cache write |
| HTTP 200, asset missing for one platform | `console.warn`, that platform uses its fallback URL; other platforms use live URLs; result cached |
| Non-JSON response body | `console.warn`, use full fallback, no cache write |
| Corrupt/invalid cache | `console.warn`, treat as cache miss, proceed to fetch |
| `localStorage` write failure | Silently ignore (wrapped in try/catch) |
| Component unmounts during fetch | AbortController cancels fetch; no state update |

---

## Success Criteria

- [ ] Visiting the landing page shows the `tag_name` from the GitHub API in each download button's version label
- [ ] Each download button's `href` points to the `browser_download_url` from the matched release asset (not the hardcoded URL)
- [ ] The button for the user's detected platform shows a "Recommended for you" badge
- [ ] All 4 platform buttons are always visible
- [ ] On iOS/iPadOS or unknown OS, no badge is shown and all buttons appear equally
- [ ] If the GitHub API is unreachable, all 4 buttons still render with `v0.2.0` fallback URLs
- [ ] If only some platform assets are found in the release, matched platforms show the live URL and unmatched platforms show their individual hardcoded fallback URL
- [ ] A second page load within 1 hour does not call `fetch` (verified by mocking `fetch` and asserting it is not called when a valid cache entry exists in localStorage)
- [ ] Adding `?flush_release_cache=1` to the URL causes a fresh fetch on the next load
- [ ] During the fetch, a loading skeleton is visible and download links are not clickable
- [ ] A `console.warn` is emitted for every degraded/fallback path
