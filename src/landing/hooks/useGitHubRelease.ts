import { useState, useEffect, useMemo } from "react";
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
  `https://github.com/Vincrypt-Management/flowfolio/releases/download/${FALLBACK_VERSION}`;

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
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      console.warn("[useGitHubRelease] Cache expired, refetching");
      return null;
    }
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
): { platforms: PlatformRelease[]; hasAnyFallback: boolean } {
  let hasAnyFallback = false;
  const platforms = PLATFORM_MATCHERS.map(({ name, keywords }) => {
    const fallback = FALLBACK_PLATFORMS.find((p) => p.name === name)!;
    const match = assets.find((asset) =>
      keywords.some((kw) => asset.name.toLowerCase().includes(kw.toLowerCase()))
    );
    if (!match) {
      console.warn(
        `[useGitHubRelease] No asset found for ${name}, using fallback`
      );
      hasAnyFallback = true;
      return fallback;
    }
    return { name, version, href: match.browser_download_url };
  });
  return { platforms, hasAnyFallback };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useGitHubRelease(): UseGitHubReleaseResult {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(FALLBACK_VERSION);
  const [platforms, setPlatforms] = useState<PlatformRelease[]>(FALLBACK_PLATFORMS);
  const detectedPlatform = useMemo(() => detectPlatform(), []);

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
          return;
        }

        const { platforms: resolved, hasAnyFallback } = matchAssetsToPlatforms(assets, tagName);
        setVersion(tagName);
        setPlatforms(resolved);

        if (!hasAnyFallback) {
          writeCache({
            schemaVersion: SCHEMA_VERSION,
            version: tagName,
            platforms: resolved,
            cachedAt: Date.now(),
          });
        } else {
          console.warn("[useGitHubRelease] Partial asset match — skipping cache");
        }
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
