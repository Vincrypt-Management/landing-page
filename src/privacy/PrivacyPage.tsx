import { Monitor, Activity, Server, Cloud, X, ArrowRight, Github } from "lucide-react";
import "./PrivacyPage.css";

// ── Never-do items ─────────────────────────────────────────────────────────────

const neverItems = [
  {
    title: "Collect portfolio data",
    desc: "Your holdings, strategies, and journal entries never leave your machine.",
  },
  {
    title: "Track usage or analytics",
    desc: "No crash reports, usage events, or feature tracking. Zero telemetry.",
  },
  {
    title: "Require an account",
    desc: "Download and use. No sign-up, no email, no license key.",
  },
  {
    title: "Phone home on startup",
    desc: "The only network call the app makes is to fetch market data you explicitly request.",
  },
];

// ── Verify items ──────────────────────────────────────────────────────────────

const verifyItems = [
  {
    title: "Network calls",
    desc: "See exactly what URLs the app fetches",
    right: <span className="pp-verify-item-right"><span>src/core/api/client.ts</span><ArrowRight size={12} /></span>,
  },
  {
    title: "Local storage",
    desc: "All data written to the local filesystem",
    right: <span className="pp-verify-item-right"><span>src/services/localCache.ts</span><ArrowRight size={12} /></span>,
  },
  {
    title: "No telemetry",
    desc: "Search the entire repo — no analytics SDK",
    right: <span className="pp-verify-item-right"><Github size={12} /><span>View on GitHub</span><ArrowRight size={12} /></span>,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

function PrivacyPage() {
  return (
    <div>
      {/* Navbar */}
      <nav className="pp-navbar">
        <a href="index.html" className="pp-nav-logo">
          <span className="pp-nav-dot" />
          Flowfolio
        </a>
        <ul className="pp-nav-links">
          <li><a href="index.html#features">Features</a></li>
          <li><a href="features.html">Docs</a></li>
          <li><a href="releases.html">Releases</a></li>
          <li><a href="privacy.html" className="active">Privacy</a></li>
          <li><a href="index.html#download">Download</a></li>
        </ul>
      </nav>

      <div className="pp-page">
        {/* Hero */}
        <header className="pp-hero">
          <div className="pp-hero-eyebrow">Privacy &amp; Security</div>
          <h1 className="pp-hero-title">
            We can't see<br />your data.
          </h1>
          <p className="pp-hero-subtitle">
            Flowfolio runs entirely on your machine. No accounts. No servers. No telemetry.
            This page explains exactly what that means technically.
          </p>
          <div className="pp-hero-badges">
            {["No network on startup", "No accounts required", "Auditable source code", "Local filesystem only"].map((label) => (
              <span key={label} className="pp-hero-badge">
                <span className="pp-badge-dot" />
                {label}
              </span>
            ))}
          </div>
        </header>

        {/* Section 2: What we never do */}
        <section className="pp-section">
          <h2 className="pp-section-title">What we never do</h2>
          <div className="pp-never-grid">
            {neverItems.map((item) => (
              <div key={item.title} className="pp-never-item">
                <div className="pp-never-x">
                  <X />
                </div>
                <div className="pp-never-text">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Architecture diagram */}
        <section className="pp-section">
          <h2 className="pp-section-title">How your data flows</h2>
          <div className="pp-arch-diagram">
            {/* Your Machine */}
            <div className="pp-arch-box green-border">
              <div className="pp-arch-box-icon"><Monitor size={18} /></div>
              <div className="pp-arch-box-label">Your Machine</div>
              <div className="pp-arch-box-sub">App + local DB</div>
            </div>

            {/* Arrow */}
            <div className="pp-arch-arrow">
              <div className="pp-arch-arrow-line" />
              <div className="pp-arch-arrow-label">market data only</div>
            </div>

            {/* Market APIs */}
            <div className="pp-arch-box">
              <div className="pp-arch-box-icon"><Activity size={18} /></div>
              <div className="pp-arch-box-label">Market APIs</div>
              <div className="pp-arch-box-sub">Prices, fundamentals</div>
            </div>

            {/* Spacer */}
            <div style={{ width: 24 }} />

            {/* No Vincrypt servers */}
            <div className="pp-arch-blocked">
              <div className="pp-arch-blocked-icon"><Server size={16} /></div>
              <div className="pp-arch-blocked-label">No Vincrypt servers</div>
            </div>

            {/* Spacer */}
            <div style={{ width: 8 }} />

            {/* No cloud storage */}
            <div className="pp-arch-blocked">
              <div className="pp-arch-blocked-icon"><Cloud size={16} /></div>
              <div className="pp-arch-blocked-label">No cloud storage</div>
            </div>
          </div>
        </section>

        {/* Section 4: Verify it yourself */}
        <section className="pp-section">
          <h2 className="pp-section-title">Verify it yourself</h2>
          <div className="pp-verify-list">
            {verifyItems.map((item) => (
              <a key={item.title} href="#" className="pp-verify-item">
                <div className="pp-verify-item-left">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
                {item.right}
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="pp-footer">
        <span>&copy; {new Date().getFullYear()} Vincrypt</span>
        <ul className="pp-footer-links">
          <li><a href="index.html#features">Features</a></li>
          <li><a href="features.html">Docs</a></li>
          <li><a href="releases.html">Releases</a></li>
          <li><a href="privacy.html">Privacy</a></li>
          <li><a href="index.html#download">Download</a></li>
        </ul>
      </footer>
    </div>
  );
}

export default PrivacyPage;
