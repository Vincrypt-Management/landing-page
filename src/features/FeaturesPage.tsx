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
  ArrowRight,
  Rocket,
  User,
  Brain,
  GitBranch,
  Code,
  MessageSquare,
} from "lucide-react";

const sections = [
  { id: "prologue", label: "The Problem", icon: <Layers size={16} /> },
  { id: "vision", label: "The Vision", icon: <Sparkles size={16} /> },
  { id: "chapter-1", label: "1. Compose Your Plan", icon: <Code size={16} /> },
  { id: "chapter-2", label: "2. See Why It Works", icon: <TrendingUp size={16} /> },
  { id: "chapter-3", label: "3. Execute Monthly", icon: <PieChart size={16} /> },
  { id: "chapter-4", label: "4. Test Your Thesis", icon: <FlaskConical size={16} /> },
  { id: "chapter-5", label: "5. Journal the Journey", icon: <BookOpen size={16} /> },
  { id: "chapter-6", label: "6. Go Deep", icon: <BarChart3 size={16} /> },
  { id: "foundation", label: "The Foundation", icon: <Shield size={16} /> },
  { id: "roadmap", label: "What's Next", icon: <Rocket size={16} /> },
];

function FeaturesPage() {
  const [activeSection, setActiveSection] = useState("prologue");
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
        <span className="features-topbar-title">The Story</span>
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
          <div className="features-sidebar-heading">The Flowfolio Story</div>
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
          <a href="landing.html#download" className="features-sidebar-cta">
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

        {/* ===== PROLOGUE: THE PROBLEM ===== */}
        <section id="prologue" className="features-section features-section-hero">
          <p className="features-chapter-label">Prologue</p>
          <h1 className="features-section-title features-title-large">
            Investing shouldn't require<br />
            <span className="features-gradient-text">blind trust.</span>
          </h1>
          <p className="features-section-lead features-lead-large">
            You hand your portfolio data to cloud apps. You follow opaque
            recommendations from algorithms you can't inspect. You make
            decisions based on gut feel, then forget why you made them three
            months later.
          </p>
          <div className="features-problem-grid">
            <div className="features-problem-card">
              <span className="features-problem-emoji">☁️</span>
              <h4>Cloud-dependent</h4>
              <p>Your financial data lives on someone else's servers. You hope they're trustworthy.</p>
            </div>
            <div className="features-problem-card">
              <span className="features-problem-emoji">🔮</span>
              <h4>Opaque decisions</h4>
              <p>"Buy this stock." Why? The algorithm doesn't explain. You just click.</p>
            </div>
            <div className="features-problem-card">
              <span className="features-problem-emoji">📉</span>
              <h4>No system</h4>
              <p>Every month is a fresh panic. No rules, no process, no memory of what worked.</p>
            </div>
          </div>
          <div className="features-transition">
            <p>We built Flowfolio because we were tired of this.</p>
            <button onClick={() => scrollTo("vision")} className="features-scroll-hint">
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ===== THE VISION ===== */}
        <section id="vision" className="features-section">
          <p className="features-chapter-label">The Vision</p>
          <h2 className="features-section-title features-title-large">
            Vibe-investing, like<br />
            <span className="features-gradient-text">vibe-coding.</span>
          </h2>
          <p className="features-section-lead features-lead-large">
            What if you could "program" your investing strategy — describe your
            thesis in plain language, compile it into rules, and let the system
            tell you exactly what to do each month? All running on your machine.
            No cloud. No tracking. No black boxes.
          </p>

          <div className="features-vision-flow">
            <div className="features-flow-step">
              <div className="features-flow-number">1</div>
              <h4>Compose</h4>
              <p>Describe your strategy. The compiler turns it into rules.</p>
            </div>
            <div className="features-flow-arrow"><ArrowRight size={16} /></div>
            <div className="features-flow-step">
              <div className="features-flow-number">2</div>
              <h4>Rank</h4>
              <p>Factors score every stock. You see exactly why.</p>
            </div>
            <div className="features-flow-arrow"><ArrowRight size={16} /></div>
            <div className="features-flow-step">
              <div className="features-flow-number">3</div>
              <h4>Execute</h4>
              <p>Monthly buy lists. Quarterly rebalance. Yearly review.</p>
            </div>
            <div className="features-flow-arrow"><ArrowRight size={16} /></div>
            <div className="features-flow-step">
              <div className="features-flow-number">4</div>
              <h4>Learn</h4>
              <p>Journal every decision. Backtest every thesis. Evolve.</p>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 1: VIBE STUDIO ===== */}
        <section id="chapter-1" className="features-section">
          <div className="features-section-badge">
            <Sparkles size={14} />
            Chapter 1
          </div>
          <h2 className="features-section-title">
            Compose your investing program.
          </h2>
          <p className="features-section-lead">
            Vibe Studio is where your strategy comes to life. Describe what you
            want in natural language — or pick a template — and the plan
            compiler transforms it into a validated, executable ruleset.
          </p>

          <div className="features-code-block">
            <div className="features-code-header">
              <span className="features-code-dot" style={{ background: "#ef4444" }}></span>
              <span className="features-code-dot" style={{ background: "#f59e0b" }}></span>
              <span className="features-code-dot" style={{ background: "#00e599" }}></span>
              <span className="features-code-title">VibeScript — compiled from your prompt</span>
            </div>
            <pre className="features-code-content">
{`{
  "strategy": "Quality Compounders",
  "universe": ["US Large Cap", "US Mid Cap"],
  "factors": {
    "quality": 0.35,   // ROE, margins, low leverage
    "growth": 0.25,    // Revenue + earnings trends
    "value": 0.20,     // Normalized P/E, P/B
    "momentum": 0.20   // 12-month price momentum
  },
  "constraints": {
    "max_position": "5%",
    "sector_cap": "25%",
    "rebalance": "quarterly"
  },
  "cadence": {
    "monthly": "buy underweight + highest conviction",
    "quarterly": "rebalance if drift > 5%",
    "yearly": "thesis review + factor refactor"
  }
}`}
            </pre>
          </div>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>6 Pre-Built Templates</h4>
              <p>
                Growth, Value, Balanced, Dividend Calm, Quality Compounders,
                AI Picks & Shovels. Each one is a starting point, not a cage.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Real-Time Validation</h4>
              <p>
                Weights must sum correctly. Position limits enforced. Sector
                caps checked. Invalid plans don't compile.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Version Control</h4>
              <p>
                Every edit creates a version. See diffs between iterations.
                Roll back to any previous plan like reverting a commit.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Advanced Mode</h4>
              <p>
                Power users can edit rules directly. See the raw VibeScript,
                modify constraints, and test compilation manually.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 2: RANKINGS ===== */}
        <section id="chapter-2" className="features-section">
          <div className="features-section-badge">
            <TrendingUp size={14} />
            Chapter 2
          </div>
          <h2 className="features-section-title">
            See why every stock made the cut.
          </h2>
          <p className="features-section-lead">
            No black boxes. Every ranking shows the exact factor breakdown —
            what scored high, what scored low, and how each dimension
            contributed to the final result.
          </p>

          <div className="features-factor-grid">
            {[
              { name: "Quality", value: "35%", desc: "ROE/ROIC, margin stability, low leverage" },
              { name: "Growth", value: "25%", desc: "Revenue & earnings trends, consistency" },
              { name: "Value", value: "20%", desc: "Normalized P/E, P/B, earnings yield" },
              { name: "Momentum", value: "20%", desc: "12-month price momentum, not day-trading" },
              { name: "Size", value: "adj.", desc: "Market cap factors, small-cap premium" },
              { name: "Volatility", value: "adj.", desc: "Price stability, drawdown history" },
            ].map((factor) => (
              <div key={factor.name} className="features-factor-card">
                <div className="features-factor-header">
                  <h4>{factor.name}</h4>
                  <span className="features-factor-weight">{factor.value}</span>
                </div>
                <p>{factor.desc}</p>
              </div>
            ))}
          </div>

          <div className="features-callout">
            <strong>"Why included?"</strong> — Every symbol comes with a trace:
            which filters it passed, which factors scored highest, and its
            normalized contribution to your portfolio thesis.
          </div>
        </section>

        {/* ===== CHAPTER 3: PORTFOLIO ===== */}
        <section id="chapter-3" className="features-section">
          <div className="features-section-badge">
            <PieChart size={14} />
            Chapter 3
          </div>
          <h2 className="features-section-title">
            Every month, you know exactly what to buy.
          </h2>
          <p className="features-section-lead">
            Flowfolio watches your portfolio drift and generates a
            conviction-ranked buy list every month. No guessing. No FOMO.
            Just your rules, applied systematically.
          </p>

          <div className="features-cadence-timeline">
            <div className="features-cadence-item">
              <div className="features-cadence-marker monthly"></div>
              <div className="features-cadence-content">
                <h4>Monthly</h4>
                <p>
                  New contributions allocated to the most underweight
                  positions with the highest conviction scores.
                </p>
              </div>
            </div>
            <div className="features-cadence-item">
              <div className="features-cadence-marker quarterly"></div>
              <div className="features-cadence-content">
                <h4>Quarterly</h4>
                <p>
                  If drift exceeds your threshold, a rebalance is triggered.
                  You see exactly which positions to trim and which to add.
                </p>
              </div>
            </div>
            <div className="features-cadence-item">
              <div className="features-cadence-marker yearly"></div>
              <div className="features-cadence-content">
                <h4>Yearly</h4>
                <p>
                  Full thesis review. Factor drift detection. The system
                  suggests plan refactoring points — like code refactoring,
                  but for your investment strategy.
                </p>
              </div>
            </div>
          </div>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Allocation Methods</h4>
              <p>Equal-weight, factor-weighted, or risk-parity. Max position sizing and sector caps enforced automatically.</p>
            </div>
            <div className="features-detail-card">
              <h4>Real-Time Drift</h4>
              <p>Target vs actual allocation updated with live prices from 8 data providers. See concentration risk at a glance.</p>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 4: BACKTEST ===== */}
        <section id="chapter-4" className="features-section">
          <div className="features-section-badge">
            <FlaskConical size={14} />
            Chapter 4
          </div>
          <h2 className="features-section-title">
            Test your thesis before you commit real money.
          </h2>
          <p className="features-section-lead">
            The Backtest Lab simulates your strategy across years of historical
            data — with monthly contributions, rebalance rules, and realistic
            cadence. All computed locally on your machine.
          </p>

          <div className="features-metrics-row">
            {[
              { label: "CAGR", desc: "Compound annual growth rate" },
              { label: "Max Drawdown", desc: "Worst peak-to-trough decline" },
              { label: "Sharpe Ratio", desc: "Risk-adjusted return" },
              { label: "Volatility", desc: "Annualized standard deviation" },
              { label: "Turnover", desc: "Trading frequency impact" },
            ].map((m) => (
              <div key={m.label} className="features-metric-card">
                <h4>{m.label}</h4>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="features-callout">
            <strong>Fully offline.</strong> Once market data is cached, backtests
            run entirely on your CPU. No internet required. No data sent
            anywhere.
          </div>
        </section>

        {/* ===== CHAPTER 5: JOURNAL ===== */}
        <section id="chapter-5" className="features-section">
          <div className="features-section-badge">
            <BookOpen size={14} />
            Chapter 5
          </div>
          <h2 className="features-section-title">
            Your future self will thank you.
          </h2>
          <p className="features-section-lead">
            Every decision you make is logged with context — what you bought,
            why you bought it, what the market looked like, and which version
            of your plan was active. When you look back in a year, you won't
            be guessing.
          </p>

          <div className="features-journal-types">
            {[
              { type: "Reflection", color: "#607d8b", desc: "Market context and thesis thinking" },
              { type: "Buy", color: "#22c55e", desc: "Purchase decisions with rationale" },
              { type: "Sell", color: "#f97316", desc: "Exit decisions and reasoning" },
              { type: "Review", color: "#4caf50", desc: "Periodic strategy assessment" },
              { type: "Rebalance", color: "#9c27b0", desc: "Portfolio adjustment records" },
              { type: "Strategy", color: "#ff9800", desc: "Plan changes and version diffs" },
            ].map((entry) => (
              <div key={entry.type} className="features-journal-type" style={{ borderColor: entry.color }}>
                <span className="features-journal-dot" style={{ background: entry.color }}></span>
                <div>
                  <h4>{entry.type}</h4>
                  <p>{entry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CHAPTER 6: QUANT ===== */}
        <section id="chapter-6" className="features-section">
          <div className="features-section-badge">
            <BarChart3 size={14} />
            Chapter 6
          </div>
          <h2 className="features-section-title">
            When you want to go deeper.
          </h2>
          <p className="features-section-lead">
            The Quantitative Analysis dashboard gives you professional-grade
            tools — RSI, MACD, Bollinger Bands, correlation heatmaps, and
            factor drill-downs for every symbol in your universe.
          </p>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Technical Indicators</h4>
              <p>RSI, MACD, Bollinger Bands, and moving averages — computed locally with interactive charting.</p>
            </div>
            <div className="features-detail-card">
              <h4>Correlation Heatmaps</h4>
              <p>Visualize portfolio correlation. Find hidden concentration risk and diversification gaps.</p>
            </div>
            <div className="features-detail-card">
              <h4>Factor Drill-Down</h4>
              <p>Raw values, normalized scores, and factor contribution for every ranked symbol.</p>
            </div>
            <div className="features-detail-card">
              <h4>Statistical Analysis</h4>
              <p>Distribution analysis, return profiles, and risk metrics — all the data, no hand-waving.</p>
            </div>
          </div>
        </section>

        {/* ===== THE FOUNDATION ===== */}
        <section id="foundation" className="features-section">
          <p className="features-chapter-label">The Foundation</p>
          <h2 className="features-section-title features-title-large">
            Built on <span className="features-gradient-text">principles,</span><br />
            not compromises.
          </h2>

          <div className="features-foundation-grid">
            <div className="features-foundation-card">
              <Lock size={22} />
              <h4>Local-First</h4>
              <p>100% local data storage. Zero cloud dependencies. No telemetry. Your financial data never leaves your device.</p>
            </div>
            <div className="features-foundation-card">
              <Shield size={22} />
              <h4>Encrypted Secrets</h4>
              <p>API keys stored in Tauri Stronghold — an encrypted local vault. The frontend never touches your credentials.</p>
            </div>
            <div className="features-foundation-card">
              <Cpu size={22} />
              <h4>Local Compute</h4>
              <p>All factor scoring, backtesting, and analysis runs on your CPU. No server calls. No cloud compute fees.</p>
            </div>
            <div className="features-foundation-card">
              <Globe size={22} />
              <h4>Offline Mode</h4>
              <p>Fully functional without internet. View, analyze, journal, and backtest on cached data anywhere.</p>
            </div>
          </div>

          <div className="features-data-section">
            <h3>8 Data Providers, One Intelligent Layer</h3>
            <p className="features-section-lead">
              Flowfolio connects to 8 market data sources with automatic
              failover, rate limiting, circuit breakers, and 3-tier caching.
              You bring your own API keys — we never store or transmit them.
            </p>

            <div className="features-providers-compact">
              <div className="features-provider-group">
                <span className="features-tier-badge tier-1">Tier 1</span>
                <span>Alpaca Markets</span>
                <span className="features-provider-sep">·</span>
                <span>Yahoo Finance</span>
              </div>
              <div className="features-provider-group">
                <span className="features-tier-badge tier-2">Tier 2</span>
                <span>Finnhub</span>
                <span className="features-provider-sep">·</span>
                <span>Tiingo</span>
                <span className="features-provider-sep">·</span>
                <span>Twelve Data</span>
                <span className="features-provider-sep">·</span>
                <span>FMP</span>
              </div>
              <div className="features-provider-group">
                <span className="features-tier-badge tier-3">Tier 3</span>
                <span>Alpha Vantage</span>
                <span className="features-provider-sep">·</span>
                <span>Polygon.io</span>
              </div>
            </div>
          </div>

          <div className="features-platforms-row">
            {[
              { icon: <Monitor size={24} />, name: "Windows" },
              { icon: <Monitor size={24} />, name: "macOS" },
              { icon: <Monitor size={24} />, name: "Linux" },
              { icon: <Smartphone size={24} />, name: "Android" },
            ].map((p) => (
              <div key={p.name} className="features-platform-pill">
                {p.icon}
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ROADMAP ===== */}
        <section id="roadmap" className="features-section">
          <p className="features-chapter-label">What's Next</p>
          <h2 className="features-section-title features-title-large">
            The story is just <span className="features-gradient-text">getting started.</span>
          </h2>
          <p className="features-section-lead features-lead-large">
            Flowfolio is evolving fast. Here's what's on the horizon — the
            features that will take it from a powerful local tool to a
            complete investment platform.
          </p>

          <div className="features-roadmap-timeline">
            <div className="features-roadmap-item">
              <div className="features-roadmap-marker coming-soon"></div>
              <div className="features-roadmap-content">
                <span className="features-roadmap-label">Coming Soon</span>
                <h4><User size={16} /> Account & Login</h4>
                <p>
                  Optional account system for syncing preferences and plans
                  across devices. Your portfolio data stays local — only your
                  configuration travels.
                </p>
              </div>
            </div>

            <div className="features-roadmap-item">
              <div className="features-roadmap-marker coming-soon"></div>
              <div className="features-roadmap-content">
                <span className="features-roadmap-label">Coming Soon</span>
                <h4><Brain size={16} /> Latest AI Model Support</h4>
                <p>
                  Connect to the latest language models for smarter strategy
                  generation, natural language plan compilation, and AI-powered
                  portfolio insights. Local LLM adapter available for fully
                  offline operation.
                </p>
              </div>
            </div>

            <div className="features-roadmap-item">
              <div className="features-roadmap-marker coming-soon"></div>
              <div className="features-roadmap-content">
                <span className="features-roadmap-label">Coming Soon</span>
                <h4><GitBranch size={16} /> Flow Support</h4>
                <p>
                  Visual flow builder for creating complex investment
                  workflows. Chain strategy steps, data sources, and
                  decision logic into reusable, shareable flows — like
                  visual programming for your portfolio.
                </p>
              </div>
            </div>

            <div className="features-roadmap-item">
              <div className="features-roadmap-marker future"></div>
              <div className="features-roadmap-content">
                <span className="features-roadmap-label future-label">On the Horizon</span>
                <h4><MessageSquare size={16} /> Community Strategies</h4>
                <p>
                  Share and discover VibePlans from other investors. Import
                  community templates, compare approaches, and learn from
                  real strategies — all while keeping your data private.
                </p>
              </div>
            </div>

            <div className="features-roadmap-item">
              <div className="features-roadmap-marker future"></div>
              <div className="features-roadmap-content">
                <span className="features-roadmap-label future-label">On the Horizon</span>
                <h4><Smartphone size={16} /> iOS App</h4>
                <p>
                  Native iOS support to complete the mobile experience.
                  Same privacy guarantees, same local-first architecture,
                  in your pocket.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="features-section">
          <div className="features-cta-section">
            <h3>Ready to invest with intention?</h3>
            <p>
              Stop guessing. Start composing. Download Flowfolio and build
              your first strategy in minutes.
            </p>
            <a href="landing.html#download" className="features-cta-btn">
              Download Flowfolio
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="features-footer">
          <div className="features-footer-content">
            <span className="features-footer-brand">Flowfolio</span>
            <span className="features-footer-tagline">
              Vibe-investing, but like vibe-coding.
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
