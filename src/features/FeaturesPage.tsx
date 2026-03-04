import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  PieChart,
  FlaskConical,
  BookOpen,
  BarChart3,
  Database,
  Shield,
  Monitor,
  ChevronRight,
  Github,
  FileText,
  Menu,
  X,
  ArrowLeft,
  Layers,
  Zap,
  Target,
  RefreshCw,
  Lock,
  Cpu,
  Globe,
  Smartphone,
} from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: <Layers size={16} /> },
  { id: "vibe-studio", label: "Vibe Studio", icon: <Sparkles size={16} /> },
  { id: "rankings", label: "Explainable Rankings", icon: <TrendingUp size={16} /> },
  { id: "portfolio", label: "Portfolio Management", icon: <PieChart size={16} /> },
  { id: "backtest", label: "Backtest Lab", icon: <FlaskConical size={16} /> },
  { id: "journal", label: "Investment Journal", icon: <BookOpen size={16} /> },
  { id: "quant", label: "Quantitative Analysis", icon: <BarChart3 size={16} /> },
  { id: "data", label: "Data Integration", icon: <Database size={16} /> },
  { id: "privacy", label: "Privacy & Security", icon: <Shield size={16} /> },
  { id: "platforms", label: "Platform Support", icon: <Monitor size={16} /> },
];

function FeaturesPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  return (
    <div className="features-layout">
      {/* Top Bar */}
      <header className="features-topbar">
        <div className="features-topbar-left">
          <button
            className="features-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <a href="landing.html" className="features-back">
            <ArrowLeft size={16} />
            <span>Flowfolio</span>
          </a>
        </div>
        <span className="features-topbar-title">Features</span>
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
      </header>

      {/* Sidebar */}
      <aside className={`features-sidebar ${sidebarOpen ? "open" : ""}`}>
        <nav className="features-sidebar-nav">
          <div className="features-sidebar-heading">Documentation</div>
          {sections.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`features-sidebar-item ${activeSection === id ? "active" : ""}`}
              onClick={() => scrollTo(id)}
            >
              {icon}
              <span>{label}</span>
              {activeSection === id && <ChevronRight size={14} className="features-sidebar-indicator" />}
            </button>
          ))}
        </nav>

        <div className="features-sidebar-footer">
          <a href="#download" className="features-sidebar-cta">
            Download Flowfolio
          </a>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="features-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="features-content">
        {/* Overview */}
        <section id="overview" className="features-section">
          <div className="features-section-badge">
            <Layers size={14} />
            Overview
          </div>
          <h1 className="features-section-title">
            Privacy-First Portfolio Intelligence
          </h1>
          <p className="features-section-lead">
            Flowfolio is a professional-grade investment platform that runs
            entirely on your machine. Build explainable strategies, track
            portfolios, and backtest ideas — all without sending a single byte
            of data to the cloud.
          </p>

          <div className="features-highlights">
            <div className="features-highlight-card">
              <Zap size={20} />
              <h3>Local-First</h3>
              <p>100% offline operation. Your data never leaves your device.</p>
            </div>
            <div className="features-highlight-card">
              <Target size={20} />
              <h3>Factor-Based</h3>
              <p>Multi-factor scoring with quality, value, growth, and momentum.</p>
            </div>
            <div className="features-highlight-card">
              <RefreshCw size={20} />
              <h3>Rule-Based</h3>
              <p>Systematic strategies with automated buy lists and rebalancing.</p>
            </div>
          </div>
        </section>

        {/* Vibe Studio */}
        <section id="vibe-studio" className="features-section">
          <div className="features-section-badge">
            <Sparkles size={14} />
            Strategy Creation
          </div>
          <h2 className="features-section-title">Vibe Studio</h2>
          <p className="features-section-lead">
            Design investment strategies using natural language prompts or
            pre-built templates. Vibe Studio compiles your intent into a
            validated, rule-based plan.
          </p>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Natural Language Strategies</h4>
              <p>
                Describe your investment thesis in plain English. Vibe Studio
                converts it into a structured VibeScript plan with factor
                weights, sector caps, and allocation rules.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Pre-Built Templates</h4>
              <p>
                Start with templates like Growth, Value, Balanced, Dividend
                Calm, Quality Compounders, or AI Picks & Shovels. Customize
                them to match your style.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Real-Time Validation</h4>
              <p>
                Every plan is validated in real-time — weights must sum
                correctly, position limits are enforced, and sector caps are
                checked before compilation.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Advanced Mode</h4>
              <p>
                Switch to manual rule editing with code-like diffs and
                versioning. See exactly what changed between plan iterations.
              </p>
            </div>
          </div>
        </section>

        {/* Rankings */}
        <section id="rankings" className="features-section">
          <div className="features-section-badge">
            <TrendingUp size={14} />
            Factor Analysis
          </div>
          <h2 className="features-section-title">Explainable Rankings</h2>
          <p className="features-section-lead">
            Understand exactly why each stock made the cut. Every ranking comes
            with a detailed factor breakdown showing contribution from each
            scoring dimension.
          </p>

          <div className="features-factor-grid">
            {[
              { name: "Quality", desc: "ROE/ROIC proxies, margin stability, leverage constraints" },
              { name: "Growth", desc: "Revenue and earnings trends, growth consistency" },
              { name: "Value", desc: "Normalized multiples — P/E, P/B, and earnings yield" },
              { name: "Momentum", desc: "Long-horizon price momentum, not intraday noise" },
              { name: "Size", desc: "Market capitalization factors and small-cap premium" },
              { name: "Volatility", desc: "Price stability metrics and drawdown history" },
            ].map((factor) => (
              <div key={factor.name} className="features-factor-card">
                <h4>{factor.name}</h4>
                <p>{factor.desc}</p>
              </div>
            ))}
          </div>

          <div className="features-callout">
            <strong>Why included / excluded?</strong> Every symbol comes with a
            detailed explanation of why it passed or failed each filter in your
            strategy pipeline.
          </div>
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="features-section">
          <div className="features-section-badge">
            <PieChart size={14} />
            Portfolio Tools
          </div>
          <h2 className="features-section-title">Portfolio Management</h2>
          <p className="features-section-lead">
            Track your holdings, monitor allocation drift, and generate
            conviction-ranked buy lists automatically every month.
          </p>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Holdings Tracker</h4>
              <p>
                Manage current positions with manual cost basis, share counts,
                and real-time price updates from 8 data providers.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Drift Analysis</h4>
              <p>
                Compare target vs actual allocation in real-time. Automatically
                detect when drift exceeds your rebalance threshold.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Buy List Generator</h4>
              <p>
                Generate monthly buy lists ranked by conviction. See which
                positions are most underweight and need contributions.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Allocation Methods</h4>
              <p>
                Choose between equal-weight, factor-weighted, or risk-parity
                allocation. Set max position sizes and sector caps.
              </p>
            </div>
          </div>
        </section>

        {/* Backtest */}
        <section id="backtest" className="features-section">
          <div className="features-section-badge">
            <FlaskConical size={14} />
            Historical Simulation
          </div>
          <h2 className="features-section-title">Backtest Lab</h2>
          <p className="features-section-lead">
            Simulate your strategies across years of historical data. All
            computation runs locally — no data leaves your machine.
          </p>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Cadence-Based Simulation</h4>
              <p>
                Run monthly, quarterly, or yearly strategy backtests with
                configurable rebalance rules and contribution schedules.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>DCA Simulation</h4>
              <p>
                Simulate Dollar-Cost Averaging with monthly contributions.
                See how systematic investing compounds over time.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Comprehensive Metrics</h4>
              <p>
                CAGR, total return, max drawdown, volatility, Sharpe ratio,
                and turnover estimates — all computed automatically.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Strategy Comparison</h4>
              <p>
                Run multiple backtests side-by-side. Compare how different
                factor weights and rules affect long-term outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Journal */}
        <section id="journal" className="features-section">
          <div className="features-section-badge">
            <BookOpen size={14} />
            Decision Tracking
          </div>
          <h2 className="features-section-title">Investment Journal</h2>
          <p className="features-section-lead">
            Document every investment decision with context. Track thesis
            updates, market notes, and plan changes over time.
          </p>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Multiple Entry Types</h4>
              <p>
                Log reflections, buy/sell decisions, reviews, rebalances, and
                strategy changes. Each type is tagged and searchable.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Plan Version Snapshots</h4>
              <p>
                Every journal entry captures a snapshot of your plan. See
                code-like diffs between versions and roll back if needed.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Timeline & Statistics</h4>
              <p>
                View decisions on a timeline. Analyze entry frequency by type,
                common tags, and decision patterns over months and years.
              </p>
            </div>
          </div>
        </section>

        {/* Quant */}
        <section id="quant" className="features-section">
          <div className="features-section-badge">
            <BarChart3 size={14} />
            Deep Analytics
          </div>
          <h2 className="features-section-title">Quantitative Analysis</h2>
          <p className="features-section-lead">
            Professional-grade technical and statistical analysis tools for
            every symbol in your universe.
          </p>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Technical Indicators</h4>
              <p>
                RSI, MACD, Bollinger Bands, and moving averages — all
                computed locally with interactive charting.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Correlation Analysis</h4>
              <p>
                Heatmap visualization of portfolio correlation. Identify
                concentration risk and diversification opportunities.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Factor Drill-Down</h4>
              <p>
                Inspect raw values and normalized scores for every factor.
                Understand exactly how each score was computed.
              </p>
            </div>
          </div>
        </section>

        {/* Data */}
        <section id="data" className="features-section">
          <div className="features-section-badge">
            <Database size={14} />
            Market Data
          </div>
          <h2 className="features-section-title">Data Integration</h2>
          <p className="features-section-lead">
            Connect to 8 market data providers with intelligent failover,
            rate limiting, and 3-tier caching — all managed automatically.
          </p>

          <div className="features-providers">
            <div className="features-provider-tier">
              <h4>
                <span className="features-tier-badge tier-1">Tier 1</span>
                Priority Providers
              </h4>
              <div className="features-provider-list">
                <div className="features-provider">
                  <strong>Alpaca Markets</strong>
                  <span>Free, unlimited basic data</span>
                </div>
                <div className="features-provider">
                  <strong>Yahoo Finance</strong>
                  <span>Fallback, no API key required</span>
                </div>
              </div>
            </div>

            <div className="features-provider-tier">
              <h4>
                <span className="features-tier-badge tier-2">Tier 2</span>
                Generous Free Tier
              </h4>
              <div className="features-provider-list">
                <div className="features-provider">
                  <strong>Finnhub</strong>
                  <span>60 calls/min</span>
                </div>
                <div className="features-provider">
                  <strong>Tiingo</strong>
                  <span>500 calls/hour</span>
                </div>
                <div className="features-provider">
                  <strong>Twelve Data</strong>
                  <span>800 calls/day</span>
                </div>
                <div className="features-provider">
                  <strong>FMP</strong>
                  <span>250 calls/day</span>
                </div>
              </div>
            </div>

            <div className="features-provider-tier">
              <h4>
                <span className="features-tier-badge tier-3">Tier 3</span>
                Limited Free Tier
              </h4>
              <div className="features-provider-list">
                <div className="features-provider">
                  <strong>Alpha Vantage</strong>
                  <span>5 calls/min</span>
                </div>
                <div className="features-provider">
                  <strong>Polygon.io</strong>
                  <span>5 calls/min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="features-callout">
            <strong>Intelligent Failover:</strong> Health-based routing, circuit
            breakers, exponential backoff, and request deduplication ensure you
            always get data — even when individual providers go down.
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="features-section">
          <div className="features-section-badge">
            <Shield size={14} />
            Security
          </div>
          <h2 className="features-section-title">Privacy & Security</h2>
          <p className="features-section-lead">
            Flowfolio is built with a zero-trust architecture. Your financial
            data stays on your machine, encrypted at rest.
          </p>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <Lock size={20} className="features-detail-icon" />
              <h4>Encrypted Storage</h4>
              <p>
                API keys stored in Tauri Stronghold (encrypted local vault).
                Portfolio data in local SQLite — never transmitted.
              </p>
            </div>
            <div className="features-detail-card">
              <Cpu size={20} className="features-detail-icon" />
              <h4>Local Computation</h4>
              <p>
                All factor scoring, backtesting, and analysis runs on your
                CPU. No cloud compute, no server calls.
              </p>
            </div>
            <div className="features-detail-card">
              <Shield size={20} className="features-detail-icon" />
              <h4>Security Hardening</h4>
              <p>
                Strict CSP headers, minimal Tauri capabilities, command
                allowlisting, and no remote script loading.
              </p>
            </div>
            <div className="features-detail-card">
              <Globe size={20} className="features-detail-icon" />
              <h4>Offline Mode</h4>
              <p>
                Fully functional without internet. Work with cached data
                anytime, anywhere — no connectivity required.
              </p>
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section id="platforms" className="features-section">
          <div className="features-section-badge">
            <Monitor size={14} />
            Availability
          </div>
          <h2 className="features-section-title">Platform Support</h2>
          <p className="features-section-lead">
            Available on desktop and mobile. Same privacy guarantees on every
            platform.
          </p>

          <div className="features-platforms-grid">
            <div className="features-platform-card">
              <Monitor size={28} />
              <h4>Windows</h4>
              <p>Native installer</p>
            </div>
            <div className="features-platform-card">
              <Monitor size={28} />
              <h4>macOS</h4>
              <p>Universal binary</p>
            </div>
            <div className="features-platform-card">
              <Monitor size={28} />
              <h4>Linux</h4>
              <p>AppImage</p>
            </div>
            <div className="features-platform-card">
              <Smartphone size={28} />
              <h4>Android</h4>
              <p>APK available</p>
            </div>
          </div>

          <div className="features-cta-section" id="download">
            <h3>Ready to take control of your portfolio?</h3>
            <p>Download Flowfolio and start building strategies today.</p>
            <a href="landing.html#download" className="features-cta-btn">
              Download Now
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="features-footer">
          <div className="features-footer-content">
            <span className="features-footer-brand">Flowfolio</span>
            <span className="features-footer-tagline">
              Made for privacy-conscious investors
            </span>
          </div>
          <div className="features-footer-links">
            <a
              href="https://github.com/Vincrypt-Management/flowfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} />
              GitHub
            </a>
            <a href="landing.html">
              <FileText size={16} />
              Home
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default FeaturesPage;
