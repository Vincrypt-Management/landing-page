import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../../shared/constants";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CommitWeek {
  week: number;   // unix timestamp
  total: number;  // commit count for that week
}

export interface UseCommitActivityResult {
  weeks: CommitWeek[];
  monthTotal: number;
  loading: boolean;
}

interface CommitActivityCacheEntry {
  schemaVersion: 1;
  cachedAt: number;
  weeks: CommitWeek[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const API_URL =
  "https://api.github.com/repos/vincrypt/flowfolio/stats/commit_activity";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const FALLBACK_WEEKS: CommitWeek[] = Array.from({ length: 8 }, (_, i) => ({
  week: i,
  total: 0,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function readCache(): CommitActivityCacheEntry | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GH_COMMIT_ACTIVITY_CACHE);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Partial<CommitActivityCacheEntry>;
    if (
      entry.schemaVersion !== 1 ||
      !("weeks" in entry) ||
      !Array.isArray(entry.weeks) ||
      typeof entry.cachedAt !== "number"
    ) {
      console.warn("[useCommitActivity] Cache schema invalid, treating as miss");
      return null;
    }
    if (Date.now() - entry.cachedAt >= CACHE_TTL_MS) {
      console.warn("[useCommitActivity] Cache expired, refetching");
      return null;
    }
    return entry as CommitActivityCacheEntry;
  } catch {
    console.warn("[useCommitActivity] Cache read failed, treating as miss");
    return null;
  }
}

function writeCache(weeks: CommitWeek[]): void {
  try {
    const entry: CommitActivityCacheEntry = {
      schemaVersion: 1,
      cachedAt: Date.now(),
      weeks,
    };
    localStorage.setItem(
      STORAGE_KEYS.GH_COMMIT_ACTIVITY_CACHE,
      JSON.stringify(entry)
    );
  } catch {
    // Storage quota exceeded or access denied — silently ignore
  }
}

function computeResult(allWeeks: CommitWeek[]): {
  weeks: CommitWeek[];
  monthTotal: number;
} {
  // Take last 8 entries; pad with zeros at front if fewer than 8
  const last8: CommitWeek[] =
    allWeeks.length >= 8
      ? allWeeks.slice(-8)
      : [
          ...Array.from({ length: 8 - allWeeks.length }, (_, i) => ({
            week: i,
            total: 0,
          })),
          ...allWeeks,
        ];

  // monthTotal = sum of last 4 weeks (indices 4-7)
  const monthTotal = last8
    .slice(4)
    .reduce((acc, w) => acc + w.total, 0);

  return { weeks: last8, monthTotal };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCommitActivity(): UseCommitActivityResult {
  const initialCache = readCache();
  const initialResult = initialCache
    ? computeResult(initialCache.weeks)
    : computeResult(FALLBACK_WEEKS);

  const [weeks, setWeeks] = useState<CommitWeek[]>(initialResult.weeks);
  const [monthTotal, setMonthTotal] = useState<number>(initialResult.monthTotal);
  const [loading, setLoading] = useState(!initialCache);

  useEffect(() => {
    if (initialCache) return; // already hydrated — no fetch needed

    const controller = new AbortController();
    let isTimedOut = false;
    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      controller.abort();
    }, 8000);

    async function fetchCommitActivity() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (res.status === 202) return; // GitHub is computing stats, will be ready on next poll
        if (!res.ok) {
          console.warn(
            `[useCommitActivity] GitHub API returned ${res.status}, using fallback`
          );
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          console.warn(
            "[useCommitActivity] Unexpected API response shape, using fallback"
          );
          return;
        }
        const rawWeeks: CommitWeek[] = data.map(
          (entry: { week: number; total: number }) => ({
            week: entry.week,
            total: entry.total,
          })
        );
        writeCache(rawWeeks);
        const result = computeResult(rawWeeks);
        setWeeks(result.weeks);
        setMonthTotal(result.monthTotal);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          if (isTimedOut) {
            console.warn(
              "[useCommitActivity] Fetch timed out after 8s, using fallback"
            );
          }
          return;
        }
        console.warn("[useCommitActivity] Fetch failed, using fallback:", err);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    fetchCommitActivity();

    return () => controller.abort();
  }, []);

  return { weeks, monthTotal, loading };
}
