import { FaWindows } from "react-icons/fa6";
import { SiApple, SiLinux, SiAndroid } from "react-icons/si";
import { Download, ExternalLink } from "lucide-react";
import { useGitHubReleases, formatBytes } from "./hooks/useGitHubReleases";
import type { ReleaseAsset } from "./hooks/useGitHubReleases";
import "./ReleasesPage.css";

// ── Asset classification ──────────────────────────────────────────────────────

interface ClassifiedAsset {
  platform: string;
  label: string;
  icon: React.ReactNode;
  asset: ReleaseAsset;
}

function classifyAssets(assets: ReleaseAsset[]): ClassifiedAsset[] {
  const matchers: Array<{ platform: string; label: string; icon: React.ReactNode; keywords: string[] }> = [
    { platform: "android", label: "Android", icon: <SiAndroid size={16} />, keywords: ["android", ".apk"] },
    { platform: "windows", label: "Windows", icon: <FaWindows size={16} />, keywords: ["windows", ".exe", ".msi"] },
    { platform: "macos", label: "macOS", icon: <SiApple size={16} />, keywords: ["macos", "darwin", ".dmg"] },
    { platform: "linux", label: "Linux", icon: <SiLinux size={16} />, keywords: ["linux", ".appimage", ".deb"] },
  ];

  const results: ClassifiedAsset[] = [];
  for (const { platform, label, icon, keywords } of matchers) {
    const match = assets.find((a) =>
      keywords.some((kw) => a.name.toLowerCase().includes(kw.toLowerCase()))
    );
    if (match) {
      results.push({ platform, label, icon, asset: match });
    }
  }
  // Unrecognized assets
  const matched = results.map((r) => r.asset.name);
  for (const asset of assets) {
    if (!matched.includes(asset.name)) {
      results.push({
        platform: "other",
        label: asset.name,
        icon: <Download size={16} />,
        asset,
      });
    }
  }
  return results;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function parseBody(body: string): string[] {
  return body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function renderBodyLine(line: string, i: number) {
  if (line.startsWith("## ")) {
    return <h3 key={i} className="rp-release-note-heading">{line.slice(3)}</h3>;
  }
  if (line.startsWith("### ")) {
    return <h4 key={i} className="rp-release-note-subheading">{line.slice(4)}</h4>;
  }
  if (line.startsWith("- ") || line.startsWith("* ")) {
    return <li key={i} className="rp-release-note-item">{line.slice(2)}</li>;
  }
  return <p key={i} className="rp-release-note-para">{line}</p>;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ReleaseSkeleton() {
  return (
    <div className="rp-release-skeleton">
      <div className="rp-skeleton-tag" />
      <div className="rp-skeleton-title" />
      <div className="rp-skeleton-body" />
      <div className="rp-skeleton-assets" />
    </div>
  );
}

function ReleaseCard({ release, latest }: { release: import("./hooks/useGitHubReleases").Release; latest: boolean }) {
  const classified = classifyAssets(release.assets);
  const lines = parseBody(release.body || "");
  // Wrap consecutive li elements
  const rendered: React.ReactNode[] = [];
  let listBuf: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuf.push(renderBodyLine(line, i));
    } else {
      if (listBuf.length) {
        rendered.push(<ul key={`ul-${i}`} className="rp-release-note-list">{listBuf}</ul>);
        listBuf = [];
      }
      rendered.push(renderBodyLine(line, i));
    }
  });
  if (listBuf.length) {
    rendered.push(<ul key="ul-end" className="rp-release-note-list">{listBuf}</ul>);
  }

  return (
    <article className="rp-release-card">
      <div className="rp-release-header">
        <div className="rp-release-meta">
          <span className="rp-release-tag">
            {latest && <span className="rp-latest-badge">Latest</span>}
            {release.prerelease && <span className="rp-pre-badge">Pre-release</span>}
            {release.tag_name}
          </span>
          <span className="rp-release-date">{formatDate(release.published_at)}</span>
          {release.html_url && (
            <a
              href={release.html_url}
              className="rp-view-github"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={12} />
              View on GitHub
            </a>
          )}
        </div>
        {release.name && release.name !== release.tag_name && (
          <h2 className="rp-release-name">{release.name}</h2>
        )}
      </div>

      {rendered.length > 0 && (
        <div className="rp-release-notes">{rendered}</div>
      )}

      {classified.length > 0 && (
        <div className="rp-assets">
          <p className="rp-assets-label">Downloads</p>
          <div className="rp-assets-grid">
            {classified.map(({ platform, label, icon, asset }) => (
              <a
                key={platform}
                href={asset.browser_download_url}
                className="rp-asset-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="rp-asset-icon">{icon}</span>
                <span className="rp-asset-name">{label}</span>
                {asset.size > 0 && (
                  <span className="rp-asset-size">{formatBytes(asset.size)}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function ReleasesPage() {
  const { loading, releases, error } = useGitHubReleases();

  return (
    <div className="rp-layout">
      {/* Navbar */}
      <nav className="rp-navbar">
        <div className="rp-navbar-content">
          <a href="index.html" className="rp-logo">
            <span className="ff-logo-dot" />
            Flowfolio
          </a>
          <ul className="rp-nav-links">
            <li><a href="index.html#features">Features</a></li>
            <li><a href="features.html">Docs</a></li>
            <li><a href="privacy.html">Privacy</a></li>
            <li><a href="index.html#download">Download</a></li>
            <li>
              <a
                href="https://github.com/Vincrypt-Management/flowfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="rp-nav-btn"
              >
                <span className="ff-nav-dot" />
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <header className="rp-hero">
        <div className="rp-hero-inner">
          <div className="rp-eyebrow">Changelog</div>
          <div className="rp-hero-rule" />
          <h1 className="rp-hero-title">Releases</h1>
          <p className="rp-hero-sub">
            Every version of Flowfolio, with full changelogs and direct downloads.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="rp-main">
        <div className="rp-main-inner">
          {error && (
            <div className="rp-notice">
              Showing cached release data — GitHub API unavailable.
            </div>
          )}

          {loading ? (
            <>
              <ReleaseSkeleton />
              <ReleaseSkeleton />
            </>
          ) : (
            releases.map((release, i) => (
              <ReleaseCard key={release.tag_name} release={release} latest={i === 0} />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="rp-footer">
        <div className="rp-footer-content">
          <div className="rp-footer-brand">
            <span className="rp-footer-logo">
              <span className="ff-logo-dot" />
              Flowfolio
            </span>
            <span className="rp-footer-tagline">Made for privacy-conscious investors.</span>
          </div>
          <div className="rp-footer-links">
            <a href="https://github.com/Vincrypt-Management/flowfolio" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="features.html">Documentation</a>
            <a href="index.html">Home</a>
            <a href="privacy.html">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ReleasesPage;
