import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface Release {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
  assets: ReleaseAsset[];
}

export interface UseGitHubReleasesResult {
  loading: boolean;
  releases: Release[];
  error: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const REPO = "Vincrypt-Management/flowfolio";
const API_URL = `https://api.github.com/repos/${REPO}/releases?per_page=10`;
const CACHE_KEY = "ff_releases_cache";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const BASE_RELEASE_URL = `https://github.com/Vincrypt-Management/flowfolio/releases/tag`;
const BASE_DOWNLOAD_URL = `https://github.com/Vincrypt-Management/flowfolio/releases/download`;

const LATEST_VERSION = __LATEST_RELEASE_VERSION__;
const LATEST_VERSION_NO_V = LATEST_VERSION.startsWith("v")
  ? LATEST_VERSION.slice(1)
  : LATEST_VERSION;

const FALLBACK_RELEASES: Release[] = [
  {
    tag_name: LATEST_VERSION,
    name: LATEST_VERSION,
    body: `## What's new\n\n- Bug fixes and stability improvements`,
    published_at: "2025-03-15T00:00:00Z",
    prerelease: false,
    html_url: `${BASE_RELEASE_URL}/${LATEST_VERSION}`,
    assets: [
      {
        name: `FlowFolio-${LATEST_VERSION_NO_V}-windows-x64-setup.exe`,
        browser_download_url: `${BASE_DOWNLOAD_URL}/${LATEST_VERSION}/FlowFolio-${LATEST_VERSION_NO_V}-windows-x64-setup.exe`,
        size: 0,
      },
      {
        name: `FlowFolio-${LATEST_VERSION_NO_V}-macos-aarch64.dmg`,
        browser_download_url: `${BASE_DOWNLOAD_URL}/${LATEST_VERSION}/FlowFolio-${LATEST_VERSION_NO_V}-macos-aarch64.dmg`,
        size: 0,
      },
      {
        name: `FlowFolio-${LATEST_VERSION_NO_V}-linux-amd64.AppImage`,
        browser_download_url: `${BASE_DOWNLOAD_URL}/${LATEST_VERSION}/FlowFolio-${LATEST_VERSION_NO_V}-linux-amd64.AppImage`,
        size: 0,
      },
      {
        name: `FlowFolio-${LATEST_VERSION_NO_V}-android.apk`,
        browser_download_url: `${BASE_DOWNLOAD_URL}/${LATEST_VERSION}/FlowFolio-${LATEST_VERSION_NO_V}-android.apk`,
        size: 0,
      },
    ],
  },
  {
    tag_name: "v0.2.1",
    name: "v0.2.1",
    body: `## What's new\n\n- Bug fixes and stability improvements`,
    published_at: "2025-02-15T00:00:00Z",
    prerelease: false,
    html_url: `${BASE_RELEASE_URL}/v0.2.1`,
    assets: [
      {
        name: "FlowFolio-0.2.1-windows-x64-setup.exe",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.1/FlowFolio-0.2.1-windows-x64-setup.exe",
        size: 0,
      },
      {
        name: "FlowFolio-0.2.1-macos-aarch64.dmg",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.1/FlowFolio-0.2.1-macos-aarch64.dmg",
        size: 0,
      },
      {
        name: "FlowFolio-0.2.1-linux-amd64.AppImage",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.1/FlowFolio-0.2.1-linux-amd64.AppImage",
        size: 0,
      },
      {
        name: "FlowFolio-0.2.1-android.apk",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.1/FlowFolio-0.2.1-android.apk",
        size: 0,
      },
    ],
  },
  {
    tag_name: "v0.2.0",
    name: "v0.2.0 — Initial Release",
    body: `## What's new\n\n- Vibe Studio: design strategies with natural language\n- Explainable Rankings with factor breakdowns\n- Portfolio Management with drift tracking\n- Backtest Lab for offline historical simulation\n- Investment Journal with version history\n- Quantitative Analysis (RSI, MACD, Bollinger Bands)\n- 100% offline — no cloud, no telemetry`,
    published_at: "2025-01-01T00:00:00Z",
    prerelease: false,
    html_url: `${BASE_RELEASE_URL}/v0.2.0`,
    assets: [
      {
        name: "FlowFolio-0.2.0-windows-x64-setup.exe",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.0/FlowFolio-0.2.0-windows-x64-setup.exe",
        size: 0,
      },
      {
        name: "FlowFolio-0.2.0-macos-aarch64.dmg",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.0/FlowFolio-0.2.0-macos-aarch64.dmg",
        size: 0,
      },
      {
        name: "FlowFolio-0.2.0-linux-amd64.AppImage",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.0/FlowFolio-0.2.0-linux-amd64.AppImage",
        size: 0,
      },
      {
        name: "FlowFolio-0.2.0-android.apk",
        browser_download_url:
          "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.0/FlowFolio-0.2.0-android.apk",
        size: 0,
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

interface CacheEntry {
  releases: Release[];
  cachedAt: number;
}

function readCache(): Release[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
    return entry.releases;
  } catch {
    return null;
  }
}

function writeCache(releases: Release[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ releases, cachedAt: Date.now() }));
  } catch {
    // ignore
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export { formatBytes };

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useGitHubReleases(): UseGitHubReleasesResult {
  const cached = readCache();

  const [loading, setLoading] = useState(!cached);
  const [releases, setReleases] = useState<Release[]>(cached ?? FALLBACK_RELEASES);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cached) return;

    const controller = new AbortController();
    let isTimedOut = false;
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      controller.abort();
    }, 8000);

    async function fetchReleases() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) {
          console.warn(`[useGitHubReleases] GitHub API returned ${res.status}, using fallback`);
          setError(true);
          return;
        }
        const data: Release[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("[useGitHubReleases] No releases found, using fallback");
          setError(true);
          return;
        }
        setReleases(data);
        writeCache(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          if (isTimedOut) {
            console.warn("[useGitHubReleases] Fetch timed out after 8s, using fallback");
          }
          return;
        }
        console.warn("[useGitHubReleases] Fetch failed, using fallback:", err);
        setError(true);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    fetchReleases();
    return () => controller.abort();
  }, []);

  return { loading, releases, error };
}
