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

### Data Flow

1. On mount, read `localStorage` key `gh_release_cache`
2. If cache exists and is less than 1 hour old → use cached data
3. Otherwise → `GET https://api.github.com/repos/Vincrypt-Management/flowfolio/releases/latest`
4. Parse response: extract `tag_name` (version) and `assets[].browser_download_url`
5. Map assets to platforms via filename keyword matching
6. Detect user OS via `navigator.userAgent`
7. Store result in `localStorage` with a timestamp
8. Fall back to hardcoded `v0.2.0` data if fetch fails or assets cannot be parsed

### Cache Schema

```ts
interface ReleaseCacheEntry {
  version: string;
  platforms: PlatformDownload[];
  cachedAt: number; // Date.now()
}
```

Key: `gh_release_cache`
TTL: 3600000ms (1 hour)

### Asset Matching

| Platform | Filename keywords (case-insensitive) |
|----------|--------------------------------------|
| Windows  | `windows`, `.exe`, `.msi`            |
| macOS    | `macos`, `darwin`, `.dmg`            |
| Linux    | `linux`, `.appimage`, `.deb`         |
| Android  | `android`, `.apk`                    |

Each platform picks the **first** matching asset. If no asset matches a platform, that platform's button falls back to the hardcoded URL.

### Platform Detection

Detected via `navigator.userAgent` string matching:

| OS      | Detection heuristic              |
|---------|----------------------------------|
| Windows | `Win`                            |
| macOS   | `Mac`                            |
| Linux   | `Linux` (excluding `Android`)    |
| Android | `Android`                        |

---

## Files

### New: `src/landing/hooks/useGitHubRelease.ts`

Custom hook. Responsibilities:
- Manage `loading`, `error`, `version`, `platforms`, `detectedPlatform` state
- Read/write localStorage cache
- Fetch GitHub API
- Map assets to platforms
- Detect user OS

Returns:
```ts
{
  loading: boolean;
  version: string;
  platforms: PlatformDownload[];  // each has name, icon, href, version
  detectedPlatform: string;       // e.g. "Windows"
}
```

### Modified: `src/landing/components/DownloadSection.tsx`

- Calls `useGitHubRelease()`
- Shows loading skeleton while `loading === true`
- Renders all 4 platform buttons
- Highlights the `detectedPlatform` button with a "Recommended for you" badge
- Other platforms shown below or de-emphasized visually

---

## Error Handling

- Network failure → use hardcoded fallback silently (no error shown to user)
- Asset not found for a platform → use hardcoded fallback URL for that platform only
- GitHub API rate limit (HTTP 403/429) → use hardcoded fallback silently

---

## Out of Scope

- No changelog or release notes display
- No GitHub token / authenticated requests
- No server-side proxy
- No build-time injection

---

## Success Criteria

- [ ] Visiting the landing page shows the latest GitHub release version in all download buttons
- [ ] The user's platform button is visually highlighted with a "Recommended for you" badge
- [ ] All 4 platform buttons remain visible
- [ ] If GitHub API is unreachable, buttons still work (fallback to v0.2.0)
- [ ] A second page load within 1 hour does not trigger another API call
