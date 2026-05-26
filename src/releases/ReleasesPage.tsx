import { FaWindows } from "react-icons/fa6";
import { SiApple, SiLinux, SiAndroid } from "react-icons/si";
import { useState } from "react";
import { ExternalLink, ShieldCheck, Github, Menu, X } from "lucide-react";
import { useGitHubReleases, formatBytes } from "./hooks/useGitHubReleases";
import type { ReleaseAsset } from "./hooks/useGitHubReleases";
import "./ReleasesPage.css";

// ── Asset classification ──────────────────────────────────────────────────────

interface ClassifiedAsset {
  platform: string;
  platformLabel: string;
  variantLabel: string; // e.g., ".msi", "Apple Silicon", "Intel"
  icon: React.ReactNode;
  asset: ReleaseAsset;
}

// Detect file format / arch variant from filename so users can pick the right build.
function describeVariant(name: string): string {
  const lower = name.toLowerCase();
  // Architecture hints first
  if (/aarch64|arm64|apple[-_ ]?silicon/.test(lower)) {
    if (lower.endsWith(".dmg")) return "Apple Silicon · .dmg";
    return "ARM64";
  }
  if (/x64|x86_64|amd64|intel/.test(lower)) {
    if (lower.endsWith(".dmg")) return "Intel · .dmg";
    if (lower.endsWith(".exe")) return ".exe installer";
    if (lower.endsWith(".msi")) return ".msi installer";
    if (lower.endsWith(".appimage")) return ".AppImage";
    if (lower.endsWith(".deb")) return ".deb";
  }
  // Fallback: use the file extension
  const ext = lower.match(/\.[a-z0-9]+$/);
  return ext ? ext[0] : "";
}

function classifyAssets(assets: ReleaseAsset[]): ClassifiedAsset[] {
  const matchers: Array<{
    platform: string;
    platformLabel: string;
    icon: React.ReactNode;
    keywords: string[];
  }> = [
    { platform: "windows", platformLabel: "Windows", icon: <FaWindows size={16} />, keywords: ["windows", ".exe", ".msi"] },
    { platform: "macos",   platformLabel: "macOS",   icon: <SiApple size={16} />,   keywords: ["macos", "darwin", ".dmg"] },
    { platform: "linux",   platformLabel: "Linux",   icon: <SiLinux size={16} />,   keywords: [".appimage", ".deb", "linux"] },
    { platform: "android", platformLabel: "Android", icon: <SiAndroid size={16} />, keywords: ["android", ".apk"] },
  ];

  const results: ClassifiedAsset[] = [];
  const claimed = new Set<string>();

  for (const { platform, platformLabel, icon, keywords } of matchers) {
    const matches = assets.filter((a) => {
      if (claimed.has(a.name)) return false;
      const lower = a.name.toLowerCase();
      return keywords.some((kw) => lower.includes(kw));
    });
    for (const asset of matches) {
      claimed.add(asset.name);
      results.push({
        platform,
        platformLabel,
        variantLabel: describeVariant(asset.name),
        icon,
        asset,
      });
    }
  }
  return results;
}

// Hide noisy auxiliary files from the downloads grid.
function isAuxiliaryAsset(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes("checksum") ||
    lower.endsWith(".txt") ||
    lower.endsWith(".sha256") ||
    lower.endsWith(".sig") ||
    lower.endsWith(".asc")
  );
}

function pickChecksumAsset(assets: ReleaseAsset[]): ReleaseAsset | null {
  return assets.find((a) => /checksum|sha256/i.test(a.name)) ?? null;
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

// Inline markdown: **bold**, *italic*, `code`, [text](url), and bare URLs.
const INLINE_TOKEN_RE =
  /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\)|https?:\/\/[^\s)]+)/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  text.replace(INLINE_TOKEN_RE, (match, _g, offset: number) => {
    if (offset > lastIndex) out.push(text.slice(lastIndex, offset));

    if (match.startsWith("**") && match.endsWith("**")) {
      out.push(<strong key={key++}>{match.slice(2, -2)}</strong>);
    } else if (match.startsWith("*") && match.endsWith("*")) {
      out.push(<em key={key++}>{match.slice(1, -1)}</em>);
    } else if (match.startsWith("`") && match.endsWith("`")) {
      out.push(<code key={key++} className="rp-release-note-code">{match.slice(1, -1)}</code>);
    } else if (match.startsWith("[")) {
      const m = match.match(LINK_RE);
      if (m) {
        out.push(
          <a key={key++} href={m[2]} target="_blank" rel="noopener noreferrer" className="rp-release-note-link">
            {m[1]}
          </a>
        );
      } else {
        out.push(match);
      }
    } else if (/^https?:\/\//.test(match)) {
      out.push(
        <a key={key++} href={match} target="_blank" rel="noopener noreferrer" className="rp-release-note-link">
          {match}
        </a>
      );
    } else {
      out.push(match);
    }

    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out;
}

function renderBodyLine(line: string, i: number) {
  if (line.startsWith("## ")) {
    return <h3 key={i} className="rp-release-note-heading">{renderInline(line.slice(3))}</h3>;
  }
  if (line.startsWith("### ")) {
    return <h4 key={i} className="rp-release-note-subheading">{renderInline(line.slice(4))}</h4>;
  }
  if (line.startsWith("- ") || line.startsWith("* ")) {
    return <li key={i} className="rp-release-note-item">{renderInline(line.slice(2))}</li>;
  }
  return <p key={i} className="rp-release-note-para">{renderInline(line)}</p>;
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
  const installerAssets = release.assets.filter((a) => !isAuxiliaryAsset(a.name));
  const classified = classifyAssets(installerAssets);
  const checksumAsset = pickChecksumAsset(release.assets);
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
            {classified.map(({ platform, platformLabel, variantLabel, icon, asset }) => (
              <a
                key={asset.name}
                href={asset.browser_download_url}
                className="rp-asset-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${platformLabel} ${variantLabel || ""} (${formatBytes(asset.size) || "size unknown"}) for ${platform}`}
              >
                <span className="rp-asset-icon" aria-hidden="true">{icon}</span>
                <span className="rp-asset-name">{platformLabel}</span>
                {variantLabel && (
                  <span className="rp-asset-variant">{variantLabel}</span>
                )}
                {asset.size > 0 && (
                  <span className="rp-asset-size">{formatBytes(asset.size)}</span>
                )}
              </a>
            ))}
          </div>
          {checksumAsset && (
            <a
              href={checksumAsset.browser_download_url}
              className="rp-checksums-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ShieldCheck size={12} aria-hidden="true" />
              Verify with SHA-256 checksums
            </a>
          )}
        </div>
      )}
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function ReleasesPage() {
  const { loading, releases, error } = useGitHubReleases();
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="rp-layout">
      {/* Navbar */}
      <nav className="rp-navbar" aria-label="Primary">
        <div className="rp-navbar-content">
          <a href="index.html" className="rp-logo" aria-label="Flowfolio home">
            <img src={logoSrc} alt="" className="ff-brand-icon" width={22} height={22} />
            Flowfolio
          </a>
          <button
            type="button"
            className="rp-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="rp-nav-links"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
          <ul
            id="rp-nav-links"
            className={`rp-nav-links${menuOpen ? " rp-nav-links--open" : ""}`}
          >
            <li><a href="index.html#features" onClick={closeMenu}>Features</a></li>
            <li><a href="features.html" onClick={closeMenu}>Docs</a></li>
            <li><a href="privacy.html" onClick={closeMenu}>Privacy</a></li>
            <li><a href="releases.html" aria-current="page" onClick={closeMenu}>Releases</a></li>
            <li><a href="index.html#download" onClick={closeMenu}>Download</a></li>
            <li>
              <a
                href="https://github.com/Vincrypt-Management/flowfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="rp-nav-btn"
                aria-label="Flowfolio on GitHub (opens in new tab)"
                onClick={closeMenu}
              >
                <Github size={14} aria-hidden="true" />
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
            <div className="rp-notice" role="status">
              GitHub API unavailable — showing last-known release data.
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
              <img src={logoSrc} alt="" className="ff-brand-icon" width={20} height={20} />
              Flowfolio
            </span>
            <span className="rp-footer-tagline">Made for privacy-conscious investors.</span>
          </div>
          <nav className="rp-footer-links" aria-label="Footer">
            <a href="https://github.com/Vincrypt-Management/flowfolio" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="features.html">Documentation</a>
            <a href="index.html">Home</a>
            <a href="privacy.html">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default ReleasesPage;
