import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  PieChart,
  FlaskConical,
  BookOpen,
  BarChart3,
  Shield,
  Monitor,
  ChevronRight,
  Github,
  FileText,
  Menu,
  X,
  Layers,
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
  Database,
  Activity,
  Zap,
  Cloud,
  HelpCircle,
  TrendingDown,
  Laptop,
  LayoutGrid,
  Terminal,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const sections = [
  { id: "prologue", label: "The Problem", icon: <Layers size={16} /> },
  { id: "vision", label: "The Vision", icon: <Sparkles size={16} /> },
  { id: "chapter-1", label: "1. The Plan Compiler", icon: <Code size={16} /> },
  { id: "chapter-2", label: "2. Scoring Engine", icon: <TrendingUp size={16} /> },
  { id: "chapter-3", label: "3. Portfolio Engine", icon: <PieChart size={16} /> },
  { id: "chapter-4", label: "4. Backtest Lab", icon: <FlaskConical size={16} /> },
  { id: "chapter-5", label: "5. Decision Journal", icon: <BookOpen size={16} /> },
  { id: "chapter-6", label: "6. Quant Dashboard", icon: <BarChart3 size={16} /> },
  { id: "foundation", label: "Architecture", icon: <Database size={16} /> },
  { id: "ai", label: "AI Integration", icon: <Brain size={16} /> },
  { id: "roadmap", label: "Roadmap", icon: <Rocket size={16} /> },
];

const FAQ_ITEMS = [
  {
    q: "Does Flowfolio work without an internet connection?",
    a: "Yes — entirely. All strategy logic, rankings, portfolio tracking, and backtesting run locally. The only time the app uses your network is when you explicitly request fresh market data (prices, fundamentals). You can run it in airplane mode indefinitely with cached data.",
  },
  {
    q: "Is it really free? What's the catch?",
    a: "There is no catch. Flowfolio is free to download and use with no feature limits. We're building trust first. Premium tiers may come later, but the core product will always have a generous free tier.",
  },
  {
    q: "What data sources does it use for prices and fundamentals?",
    a: "Flowfolio fetches data from public financial APIs. No premium data subscription is required — the free tiers of these APIs are sufficient for most users.",
  },
  {
    q: "How does the local AI work? Does it phone home?",
    a: "The local AI runs entirely on your machine using a small bundled model. It never makes network requests. Your prompts, portfolio context, and AI responses stay on your device.",
  },
  {
    q: "Can I use this on Windows or Linux?",
    a: "Yes. Flowfolio is available for macOS (Apple Silicon and Intel), Windows 10/11, and Linux (x86_64, AppImage). See the compatibility table above for details.",
  },
  {
    q: "Where is my data stored? Can I back it up?",
    a: "All data is stored in a local SQLite database in your app data directory. You can back it up by copying this folder. The exact path is shown in Settings → Storage.",
  },
];

function FeaturesPage() {
  const [activeSection, setActiveSection] = useState("prologue");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

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
          <a href="index.html" className="features-back">
            <span className="ff-logo-dot" />
            <span>Flowfolio</span>
          </a>
        </div>
        <span className="features-topbar-title">Documentation</span>
        <div className="features-topbar-right">
          <a href="releases.html" className="features-topbar-link">
            Releases
          </a>
          <a href="privacy.html" className="features-topbar-link">
            Privacy
          </a>
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
          <div className="features-sidebar-heading">
            <span className="ff-logo-dot" />
            Documentation
          </div>
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
          <a href="index.html#download" className="features-sidebar-cta">
            Download Flowfolio
          </a>
        </div>
      </aside>

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
              <Cloud size={24} className="features-problem-icon" />
              <h4>Cloud-dependent</h4>
              <p>Your financial data lives on someone else's servers. You hope they're trustworthy.</p>
            </div>
            <div className="features-problem-card">
              <HelpCircle size={24} className="features-problem-icon" />
              <h4>Opaque decisions</h4>
              <p>"Buy this stock." Why? The algorithm doesn't explain. You just click.</p>
            </div>
            <div className="features-problem-card">
              <TrendingDown size={24} className="features-problem-icon" />
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
              <p>Natural language → validated plan with factor weights, filters, and constraints.</p>
            </div>
            <div className="features-flow-arrow"><ArrowRight size={16} /></div>
            <div className="features-flow-step">
              <div className="features-flow-number">2</div>
              <h4>Rank</h4>
              <p>Composite scoring across every symbol. Normalized 0–100, weighted by your factors.</p>
            </div>
            <div className="features-flow-arrow"><ArrowRight size={16} /></div>
            <div className="features-flow-step">
              <div className="features-flow-number">3</div>
              <h4>Execute</h4>
              <p>Allocation engine produces buy lists. 4 methods: equal-weight to mean-variance.</p>
            </div>
            <div className="features-flow-arrow"><ArrowRight size={16} /></div>
            <div className="features-flow-step">
              <div className="features-flow-number">4</div>
              <h4>Learn</h4>
              <p>Backtest with 10,000 Monte Carlo iterations. Journal every decision with plan versioning.</p>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 1: PLAN COMPILER ===== */}
        <section id="chapter-1" className="features-section">
          <div className="features-section-badge">
            <Code size={14} />
            Chapter 1
          </div>
          <h2 className="features-section-title">
            The Plan Compiler
          </h2>
          <p className="features-section-lead">
            A VibePlan is a structured configuration object that defines your
            entire investment strategy. The plan compiler validates, normalizes,
            and transforms your input into an executable ruleset.
          </p>

          <h3 className="features-subsection-title">Plan Structure</h3>
          <div className="features-code-block">
            <div className="features-code-header">
              <span className="features-code-dot" style={{ background: "#ef4444" }}></span>
              <span className="features-code-dot" style={{ background: "#f59e0b" }}></span>
              <span className="features-code-dot" style={{ background: "#00e599" }}></span>
              <span className="features-code-title">VibePlan schema</span>
            </div>
            <pre className="features-code-content">
{`VibePlan {
  name: string
  universe: {
    exchanges: ["NYSE", "NASDAQ"]     // Target exchanges
    regions: ["US", "EU"]             // Geographic scope
    sectors: ["Technology", ...]      // Sector filters
    exclude_list: ["TICKER", ...]     // Blacklisted symbols
  }
  filters: Filter[]                   // Screening criteria
  ranking: {
    factors: Factor[]                 // Scoring factors + weights
  }
  portfolio: PortfolioConfig          // Allocation rules
  cadence: CadenceConfig              // Rebalance schedule
  risk: RiskConfig                    // Risk constraints
}`}
            </pre>
          </div>

          <h3 className="features-subsection-title">Filter Operators</h3>
          <p className="features-section-lead">
            Filters screen the universe before scoring. Each filter applies a
            comparison operator to a fundamental or technical metric.
          </p>
          <div className="features-table-wrap">
            <table className="features-table">
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Description</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>gt</code></td><td>Greater than</td><td><code>market_cap gt 10B</code></td></tr>
                <tr><td><code>lt</code></td><td>Less than</td><td><code>pe_ratio lt 30</code></td></tr>
                <tr><td><code>gte</code></td><td>Greater than or equal</td><td><code>roe gte 0.15</code></td></tr>
                <tr><td><code>lte</code></td><td>Less than or equal</td><td><code>debt_equity lte 1.5</code></td></tr>
                <tr><td><code>eq</code></td><td>Equal to</td><td><code>sector eq "Technology"</code></td></tr>
                <tr><td><code>between</code></td><td>Range (inclusive)</td><td><code>dividend_yield between [2%, 6%]</code></td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="features-subsection-title">Compiler Pipeline</h3>
          <div className="features-pipeline">
            <div className="features-pipeline-step">
              <div className="features-pipeline-num">1</div>
              <div>
                <h4>Load Plan</h4>
                <p>Parse plan from template or user input. Validate schema structure and required fields.</p>
              </div>
            </div>
            <div className="features-pipeline-step">
              <div className="features-pipeline-num">2</div>
              <div>
                <h4>Extract Config</h4>
                <p>Pull factor definitions, weights, and scoring parameters. Ensure weights are valid (non-negative, non-zero sum).</p>
              </div>
            </div>
            <div className="features-pipeline-step">
              <div className="features-pipeline-num">3</div>
              <div>
                <h4>Apply Filters</h4>
                <p>Screen the universe using filter operators. Remove symbols that fail any condition.</p>
              </div>
            </div>
            <div className="features-pipeline-step">
              <div className="features-pipeline-num">4</div>
              <div>
                <h4>Score & Rank</h4>
                <p>Batch-score surviving symbols using <code>score_symbols_batch</code>. Normalize to 0–100 scale.</p>
              </div>
            </div>
            <div className="features-pipeline-step">
              <div className="features-pipeline-num">5</div>
              <div>
                <h4>Allocate</h4>
                <p>Apply portfolio config to generate target weights. Output buy/sell recommendations with rationale.</p>
              </div>
            </div>
          </div>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>6 Pre-Built Templates</h4>
              <p>
                Growth, Value, Balanced, Dividend Calm, Quality Compounders,
                AI Picks & Shovels — each a valid starting plan you can fork and modify.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Real-Time Validation</h4>
              <p>
                Factor weights must be non-negative. Position limits enforced within 0–100%.
                Sector caps checked. Invalid plans won't compile — you get specific error messages.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Version Control</h4>
              <p>
                Every edit creates a version linked to a <code>plan_version</code> string.
                Journal entries reference which version was active. Roll back like reverting a commit.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Advanced Mode</h4>
              <p>
                Edit the raw plan structure directly. Modify constraints,
                test compilation, and preview the output before applying.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 2: SCORING ENGINE ===== */}
        <section id="chapter-2" className="features-section">
          <div className="features-section-badge">
            <TrendingUp size={14} />
            Chapter 2
          </div>
          <h2 className="features-section-title">
            The Scoring Engine
          </h2>
          <p className="features-section-lead">
            Every symbol in your universe gets a composite score based on
            weighted factors. No black boxes — every number is traceable
            from raw data to final rank.
          </p>

          <h3 className="features-subsection-title">Composite Score Formula</h3>
          <div className="features-formula-block">
            <div className="features-formula">
              <span className="features-formula-label">Total Score</span>
              <span className="features-formula-eq">score = Σ ( normalized_value<sub>i</sub> × weight<sub>i</sub> )</span>
            </div>
            <div className="features-formula">
              <span className="features-formula-label">Factor Contribution</span>
              <span className="features-formula-eq">contribution<sub>i</sub> = normalized_value<sub>i</sub> × weight<sub>i</sub></span>
            </div>
          </div>

          <p className="features-section-lead">
            Each factor's raw value is normalized to a <strong>0–100 scale</strong> before
            weighting. This ensures factors with different units (percentages, ratios,
            dollar amounts) are comparable. The final score determines rank position.
          </p>

          <h3 className="features-subsection-title">Factor Breakdown</h3>
          <p className="features-section-lead" style={{ marginBottom: "1rem" }}>
            Each factor tracks four values per symbol:
            <code>raw_value</code>, <code>normalized_value</code>, <code>weight</code>,
            and <code>contribution</code>. Weights are user-configurable per plan.
          </p>
          <div className="features-factor-grid">
            {[
              { name: "Quality", value: "35%", desc: "ROE, ROIC, margin stability, debt-to-equity ratio, profitability metrics" },
              { name: "Growth", value: "25%", desc: "Revenue growth rate, EPS growth, earnings consistency across quarters" },
              { name: "Value", value: "20%", desc: "Normalized P/E, P/B, P/S ratios, earnings yield relative to sector" },
              { name: "Momentum", value: "20%", desc: "12-month price momentum, RSI (14-period), MACD signal crossovers" },
              { name: "Size", value: "adj.", desc: "Market capitalization factor, small-cap premium adjustment applied post-score" },
              { name: "Volatility", value: "adj.", desc: "Annualized price volatility, max drawdown history, beta-adjusted risk" },
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

          <h3 className="features-subsection-title">Score Traceability</h3>
          <div className="features-callout">
            <strong>"Why included?"</strong> — Every ranked symbol shows its full
            scoring trace: which filters it passed, the raw → normalized value
            for each factor, individual contributions, and the composite total.
            You can see <em>exactly</em> why AAPL scored 87.3 and MSFT scored 84.1.
          </div>
        </section>

        {/* ===== CHAPTER 3: PORTFOLIO ENGINE ===== */}
        <section id="chapter-3" className="features-section">
          <div className="features-section-badge">
            <PieChart size={14} />
            Chapter 3
          </div>
          <h2 className="features-section-title">
            The Portfolio Engine
          </h2>
          <p className="features-section-lead">
            Once symbols are ranked, the portfolio engine determines <em>how much</em> to
            allocate to each position. Four allocation methods are available, each
            with configurable constraints and risk limits.
          </p>

          <h3 className="features-subsection-title">Allocation Methods</h3>
          <div className="features-table-wrap">
            <table className="features-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>How It Works</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>equal_weight</code></td>
                  <td>Each position gets <code>1/n</code> of the portfolio</td>
                  <td>Simple, no concentration bias</td>
                </tr>
                <tr>
                  <td><code>market_cap_weight</code></td>
                  <td>Weight proportional to market capitalization</td>
                  <td>Tracks the market naturally</td>
                </tr>
                <tr>
                  <td><code>risk_parity</code></td>
                  <td>Each position contributes equal <em>risk</em>, not equal capital</td>
                  <td>Balanced risk exposure</td>
                </tr>
                <tr>
                  <td><code>mean_variance</code></td>
                  <td>Optimize for maximum Sharpe ratio on the efficient frontier</td>
                  <td>Maximum risk-adjusted return</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="features-subsection-title">Risk Constraints</h3>
          <p className="features-section-lead">
            The portfolio agent enforces hard limits to prevent concentrated
            or excessively risky portfolios. These are checked before any
            allocation is finalized.
          </p>
          <div className="features-table-wrap">
            <table className="features-table">
              <thead>
                <tr>
                  <th>Constraint</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Max Single Asset Allocation</td><td><code>25%</code></td><td>No position can exceed this weight</td></tr>
                <tr><td>Min Assets</td><td><code>8</code></td><td>Minimum number of holdings for diversification</td></tr>
                <tr><td>Min Diversification Score</td><td><code>60/100</code></td><td>Correlation-based diversification check</td></tr>
                <tr><td>Max Probability of Loss</td><td><code>15%</code></td><td>Monte Carlo simulated probability threshold</td></tr>
                <tr><td>Min Sharpe Ratio</td><td><code>0.5</code></td><td>Minimum acceptable risk-adjusted return</td></tr>
                <tr><td>Max Volatility</td><td><code>20%</code></td><td>Annualized volatility ceiling</td></tr>
                <tr><td>Defensive Asset Min</td><td><code>15%</code></td><td>Minimum allocation to defensive/stable assets</td></tr>
                <tr><td>Hedge on High Risk</td><td><code>+10%</code></td><td>Additional defensive allocation when risk is elevated</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="features-subsection-title">Cadence System</h3>
          <p className="features-section-lead">
            The cadence config defines how often the portfolio is reviewed and
            what happens at each interval.
          </p>
          <div className="features-cadence-timeline">
            <div className="features-cadence-item">
              <div className="features-cadence-marker monthly"></div>
              <div className="features-cadence-content">
                <h4>Monthly</h4>
                <p>
                  New contributions allocated to the most underweight
                  positions with the highest conviction scores. No selling —
                  only buying into the drift.
                </p>
              </div>
            </div>
            <div className="features-cadence-item">
              <div className="features-cadence-marker quarterly"></div>
              <div className="features-cadence-content">
                <h4>Quarterly</h4>
                <p>
                  If any position drifts beyond the <code>rebalanceThreshold</code> (default: 5%
                  from target), a full rebalance is triggered. The system generates specific
                  trim/add actions with share counts.
                </p>
              </div>
            </div>
            <div className="features-cadence-item">
              <div className="features-cadence-marker yearly"></div>
              <div className="features-cadence-content">
                <h4>Yearly</h4>
                <p>
                  Full thesis review. Factor drift detection — are the factors that
                  originally drove your plan still working? The system suggests plan
                  refactoring points.
                </p>
              </div>
            </div>
          </div>

          <div className="features-code-block">
            <div className="features-code-header">
              <span className="features-code-dot" style={{ background: "#ef4444" }}></span>
              <span className="features-code-dot" style={{ background: "#f59e0b" }}></span>
              <span className="features-code-dot" style={{ background: "#00e599" }}></span>
              <span className="features-code-title">CadenceConfig schema</span>
            </div>
            <pre className="features-code-content">
{`CadenceConfig {
  frequency: "daily" | "weekly" | "monthly" | "quarterly"
  dayOfWeek?: 0-6          // 0 = Sunday (for weekly)
  dayOfMonth?: 1-31        // (for monthly)
}

PortfolioConfig {
  allocationMethod: "equal_weight" | "market_cap_weight"
                  | "risk_parity" | "mean_variance"
  maxPositions: number     // max holdings count
  maxPositionSize: number  // max % per position (0-1)
  rebalanceThreshold: number  // drift % trigger (e.g., 0.05)
}`}
            </pre>
          </div>
        </section>

        {/* ===== CHAPTER 4: BACKTEST LAB ===== */}
        <section id="chapter-4" className="features-section">
          <div className="features-section-badge">
            <FlaskConical size={14} />
            Chapter 4
          </div>
          <h2 className="features-section-title">
            The Backtest Lab
          </h2>
          <p className="features-section-lead">
            Simulate your strategy across years of historical data with
            monthly contributions, rebalance rules, and realistic
            cadence — all computed locally on your machine.
          </p>

          <h3 className="features-subsection-title">Backtest Parameters</h3>
          <div className="features-code-block">
            <div className="features-code-header">
              <span className="features-code-dot" style={{ background: "#ef4444" }}></span>
              <span className="features-code-dot" style={{ background: "#f59e0b" }}></span>
              <span className="features-code-dot" style={{ background: "#00e599" }}></span>
              <span className="features-code-title">Backtest input configuration</span>
            </div>
            <pre className="features-code-content">
{`BacktestConfig {
  start_date: ISO date        // e.g., "2020-01-01"
  end_date: ISO date          // e.g., "2024-12-31"
  initial_cash: number        // starting capital ($)
  monthly_contribution: number // recurring deposit ($)
  rebalance_frequency: "daily" | "weekly" | "monthly" | "quarterly"
  rebalance_threshold: number // drift % to trigger (e.g., 0.05)
  symbols: string[]           // tickers to include
  allocation_method: string   // equal_weight, risk_parity, etc.
  benchmarkSymbol?: string    // e.g., "SPY" for comparison
  riskFreeRate?: number       // default: 0.045 (4.5%)
  transactionCost?: number    // per-trade cost for realism
}`}
            </pre>
          </div>

          <h3 className="features-subsection-title">Output Metrics</h3>
          <p className="features-section-lead">
            All calculations use <strong>252 trading days</strong> for annualization and
            a <strong>4.5% risk-free rate</strong>. Variance is computed using Welford's
            algorithm for numerical stability with large datasets.
          </p>

          <div className="features-table-wrap">
            <table className="features-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Formula</th>
                  <th>What It Tells You</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sharpe Ratio</td>
                  <td><code>(R<sub>p</sub> − R<sub>f</sub>) / σ<sub>p</sub></code></td>
                  <td>Return per unit of total risk. Higher = better risk-adjusted performance.</td>
                </tr>
                <tr>
                  <td>Sortino Ratio</td>
                  <td><code>(R<sub>p</sub> − R<sub>f</sub>) / σ<sub>d</sub></code></td>
                  <td>Like Sharpe, but only penalizes <em>downside</em> volatility. More relevant for loss-averse investors.</td>
                </tr>
                <tr>
                  <td>Calmar Ratio</td>
                  <td><code>R<sub>p</sub> / |MaxDD|</code></td>
                  <td>Annual return divided by worst drawdown. How well are you compensated for the pain?</td>
                </tr>
                <tr>
                  <td>Max Drawdown</td>
                  <td><code>(Trough − Peak) / Peak</code></td>
                  <td>Worst peak-to-trough decline. The maximum loss you'd have experienced.</td>
                </tr>
                <tr>
                  <td>Alpha (Jensen's)</td>
                  <td><code>R<sub>p</sub> − [R<sub>f</sub> + β(R<sub>m</sub> − R<sub>f</sub>)]</code></td>
                  <td>Excess return above what CAPM predicts. Positive alpha = you beat the benchmark risk-adjusted.</td>
                </tr>
                <tr>
                  <td>Beta</td>
                  <td><code>Cov(R<sub>p</sub>, R<sub>m</sub>) / Var(R<sub>m</sub>)</code></td>
                  <td>Systematic risk. Beta {">"} 1 = more volatile than market; {"<"} 1 = less volatile.</td>
                </tr>
                <tr>
                  <td>Value at Risk (95%)</td>
                  <td><code>Historical simulation</code></td>
                  <td>The maximum loss you'd expect 95% of the time. Uses annualized historical returns.</td>
                </tr>
                <tr>
                  <td>CVaR (Expected Shortfall)</td>
                  <td><code>Avg loss beyond VaR</code></td>
                  <td>Average loss in the worst 5% of scenarios. How bad is "bad"?</td>
                </tr>
                <tr>
                  <td>Treynor Ratio</td>
                  <td><code>(R<sub>p</sub> − R<sub>f</sub>) / β</code></td>
                  <td>Return per unit of <em>systematic</em> risk only. Useful for diversified portfolios.</td>
                </tr>
                <tr>
                  <td>Information Ratio</td>
                  <td><code>Active Return / Tracking Error</code></td>
                  <td>How consistently you outperform the benchmark. Higher = more reliable outperformance.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="features-subsection-title">Monte Carlo Simulation</h3>
          <div className="features-callout">
            <strong>10,000 iterations.</strong> The portfolio agent runs Monte Carlo
            simulations to estimate probability of loss, scenario distributions, and
            confidence intervals. This feeds directly into the risk constraints —
            if your simulated probability of loss exceeds 15%, the allocation is flagged.
          </div>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <Activity size={18} className="features-detail-icon" />
              <h4>Annualization Constants</h4>
              <p>
                <code>TRADING_DAYS = 252</code><br />
                <code>√252 ≈ 15.87</code> for volatility annualization<br />
                <code>RISK_FREE_RATE = 0.045</code>
              </p>
            </div>
            <div className="features-detail-card">
              <Zap size={18} className="features-detail-icon" />
              <h4>Fully Offline</h4>
              <p>
                Once market data is cached, backtests run entirely on your CPU.
                No internet required. No data sent anywhere. Typical runs complete in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 5: JOURNAL ===== */}
        <section id="chapter-5" className="features-section">
          <div className="features-section-badge">
            <BookOpen size={14} />
            Chapter 5
          </div>
          <h2 className="features-section-title">
            The Decision Journal
          </h2>
          <p className="features-section-lead">
            Every decision is logged with context — what you traded,
            why, the market conditions, and which version of your plan was
            active. Structured data, not just notes.
          </p>

          <h3 className="features-subsection-title">Entry Schema</h3>
          <div className="features-code-block">
            <div className="features-code-header">
              <span className="features-code-dot" style={{ background: "#ef4444" }}></span>
              <span className="features-code-dot" style={{ background: "#f59e0b" }}></span>
              <span className="features-code-dot" style={{ background: "#00e599" }}></span>
              <span className="features-code-title">JournalEntry structure</span>
            </div>
            <pre className="features-code-content">
{`JournalEntry {
  id: string                          // unique identifier
  timestamp: ISO string               // when it was created
  event_type: string                  // "reflection" | "buy" | "sell" | ...
  title: string                       // human summary
  content: string                     // detailed notes
  plan_version?: string               // links to active plan version
  metadata: Record<string, string>    // key-value context data
  tags: string[]                      // user-defined tags
}`}
            </pre>
          </div>

          <h3 className="features-subsection-title">Entry Types</h3>
          <div className="features-journal-types">
            {[
              { type: "Reflection", color: "#607d8b", desc: "Market context, thesis thinking, sentiment notes" },
              { type: "Buy", color: "#22c55e", desc: "Purchase decisions with rationale, prices, conviction level" },
              { type: "Sell", color: "#f97316", desc: "Exit decisions, stop-loss triggers, profit-taking reasoning" },
              { type: "Review", color: "#4caf50", desc: "Periodic strategy assessment, performance vs expectations" },
              { type: "Rebalance", color: "#9c27b0", desc: "Portfolio adjustment records, drift amounts, actions taken" },
              { type: "Strategy", color: "#ff9800", desc: "Plan changes and version diffs, why the thesis evolved" },
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

          <h3 className="features-subsection-title">Aggregated Statistics</h3>
          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Entries by Type</h4>
              <p>
                Automatic count per <code>event_type</code>. See how many buys vs sells,
                how often you reflect, and whether your review cadence is consistent.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Monthly Activity</h4>
              <p>
                Entries aggregated by month. Track consistency — are you journaling
                regularly or only when things go wrong?
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Common Tags</h4>
              <p>
                Tag frequency analysis. Discover patterns — are you always
                tagging "momentum" entries? That's a signal about your thesis.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Markdown Export</h4>
              <p>
                Export your entire journal as structured Markdown via
                <code>export_journal_markdown</code>. Keep a portable, readable backup.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 6: QUANT DASHBOARD ===== */}
        <section id="chapter-6" className="features-section">
          <div className="features-section-badge">
            <BarChart3 size={14} />
            Chapter 6
          </div>
          <h2 className="features-section-title">
            The Quant Dashboard
          </h2>
          <p className="features-section-lead">
            Professional-grade analysis tools available for every symbol.
            Technical indicators, correlation analysis, and factor drill-downs
            — all computed locally with interactive charting.
          </p>

          <h3 className="features-subsection-title">Technical Indicators</h3>
          <div className="features-table-wrap">
            <table className="features-table">
              <thead>
                <tr>
                  <th>Indicator</th>
                  <th>Parameters</th>
                  <th>What It Measures</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RSI</td>
                  <td>14-period (default)</td>
                  <td>Momentum oscillator. &gt;70 = overbought, &lt;30 = oversold</td>
                </tr>
                <tr>
                  <td>MACD</td>
                  <td>12, 26, 9 (signal)</td>
                  <td>Trend direction and momentum. Signal crossovers indicate entry/exit points</td>
                </tr>
                <tr>
                  <td>Bollinger Bands</td>
                  <td>20-period, 2σ</td>
                  <td>Volatility envelope. Price touching bands suggests mean reversion opportunity</td>
                </tr>
                <tr>
                  <td>Moving Averages</td>
                  <td>SMA 20, 50, 200</td>
                  <td>Trend identification. Golden cross (50 &gt; 200) = bullish, death cross = bearish</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Correlation Heatmaps</h4>
              <p>
                Cross-asset correlation matrix for your portfolio. Identify hidden concentration risk
                where "diversified" holdings actually move together. Highlights correlation &gt; 0.7.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Factor Drill-Down</h4>
              <p>
                For any ranked symbol: raw value → normalized score (0–100) → weighted contribution.
                Compare factor profiles side-by-side across your top holdings.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Return Distribution</h4>
              <p>
                Histogram of daily/monthly returns. Skewness and kurtosis metrics reveal
                whether returns are normally distributed or have fat tails.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Available Tools</h4>
              <p>
                <code>fetch_stock_data</code> · <code>fetch_multiple_stocks</code> ·
                <code>calculate_technical_indicators</code> · <code>analyze_portfolio_metrics</code>
              </p>
            </div>
          </div>
        </section>

        {/* ===== ARCHITECTURE ===== */}
        <section id="foundation" className="features-section">
          <p className="features-chapter-label">Architecture</p>
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
              <p>API keys stored in Tauri Stronghold — an encrypted local vault. The frontend never touches your credentials directly.</p>
            </div>
            <div className="features-foundation-card">
              <Cpu size={22} />
              <h4>Local Compute</h4>
              <p>Factor scoring, backtesting, Monte Carlo — all on your CPU. No server calls. No cloud compute fees.</p>
            </div>
            <div className="features-foundation-card">
              <Globe size={22} />
              <h4>Offline Mode</h4>
              <p>Fully functional without internet. View, analyze, journal, and backtest on cached data anywhere.</p>
            </div>
          </div>

          {/* Data Provider Architecture */}
          <div className="features-data-section">
            <h3>Data Provider Architecture</h3>
            <p className="features-section-lead">
              Flowfolio connects to 8 market data sources through an intelligent
              proxy layer with automatic failover, rate limiting, and circuit breakers.
              All API calls route through the Tauri backend — the frontend never
              makes direct network requests.
            </p>

            <h4 className="features-subsection-title" style={{ fontSize: "0.9375rem", marginBottom: "0.75rem" }}>Provider Tiers & Rate Limits</h4>
            <div className="features-table-wrap">
              <table className="features-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Providers</th>
                    <th>Priority</th>
                    <th>Rate Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="features-tier-badge tier-1">Tier 1</span></td>
                    <td>Alpaca Markets, Yahoo Finance</td>
                    <td>10, 9</td>
                    <td>Generous / unlimited</td>
                  </tr>
                  <tr>
                    <td><span className="features-tier-badge tier-2">Tier 2</span></td>
                    <td>Finnhub, Tiingo, Twelve Data, FMP</td>
                    <td>8–5</td>
                    <td>60/min – 800/day</td>
                  </tr>
                  <tr>
                    <td><span className="features-tier-badge tier-3">Tier 3</span></td>
                    <td>Alpha Vantage, Polygon.io</td>
                    <td>2, 1</td>
                    <td>5/min (free tier)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="features-subsection-title" style={{ fontSize: "0.9375rem", marginTop: "1.5rem", marginBottom: "0.75rem" }}>Resilience Configuration</h4>
            <div className="features-table-wrap">
              <table className="features-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Circuit Breaker Threshold</td><td><code>5 failures</code></td><td>Provider is temporarily disabled after 5 consecutive failures</td></tr>
                  <tr><td>Recovery Timeout</td><td><code>30 seconds</code></td><td>Time before a tripped circuit breaker is re-tested</td></tr>
                  <tr><td>Max Retries</td><td><code>3</code></td><td>Retry attempts before moving to next provider</td></tr>
                  <tr><td>Backoff Strategy</td><td><code>2× exponential</code></td><td>100ms initial → 200ms → 400ms (max 5s)</td></tr>
                  <tr><td>Request Dedup Window</td><td><code>100ms</code></td><td>Identical requests within this window are deduplicated</td></tr>
                  <tr><td>Default Timeout</td><td><code>30 seconds</code></td><td>Maximum wait per API request</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="features-subsection-title" style={{ fontSize: "0.9375rem", marginTop: "1.5rem", marginBottom: "0.75rem" }}>Local Cache (IndexedDB)</h4>
            <p className="features-section-lead">
              All fetched data is cached in IndexedDB with type-specific TTLs and LRU eviction.
              When cache limits are reached, the oldest 10% of entries are evicted.
            </p>
            <div className="features-table-wrap">
              <table className="features-table">
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>TTL</th>
                    <th>Max Entries</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Prices</td><td>2 hours</td><td>500</td></tr>
                  <tr><td>Fundamentals</td><td>48 hours</td><td>200</td></tr>
                  <tr><td>Sentiment</td><td>6 hours</td><td>200</td></tr>
                  <tr><td>Analyst Ratings</td><td>48 hours</td><td>200</td></tr>
                  <tr><td>Historical</td><td>48 hours</td><td>100</td></tr>
                  <tr><td>Quant Data</td><td>4 hours</td><td>300</td></tr>
                </tbody>
              </table>
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

        {/* ===== AI INTEGRATION ===== */}
        <section id="ai" className="features-section">
          <p className="features-chapter-label">AI Integration</p>
          <h2 className="features-section-title features-title-large">
            AI-powered, <span className="features-gradient-text">human-controlled.</span>
          </h2>
          <p className="features-section-lead features-lead-large">
            Flowfolio uses AI through OpenRouter for strategy generation, portfolio
            analysis, and natural language plan compilation. All AI calls go through
            the backend — your API key never touches the browser.
          </p>

          <h3 className="features-subsection-title">Token Budgets</h3>
          <p className="features-section-lead">
            Different analysis tasks have different token budgets to balance quality and cost.
          </p>
          <div className="features-table-wrap">
            <table className="features-table">
              <thead>
                <tr>
                  <th>Budget Tier</th>
                  <th>Max Tokens</th>
                  <th>Used For</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Small</td><td><code>1,000</code></td><td>Quick classifications, simple lookups</td></tr>
                <tr><td>Medium</td><td><code>1,500</code></td><td>Factor analysis summaries</td></tr>
                <tr><td>Standard</td><td><code>2,000</code></td><td>Portfolio recommendations, plan suggestions</td></tr>
                <tr><td>Large</td><td><code>2,500</code></td><td>Comprehensive analysis reports</td></tr>
                <tr><td>Default</td><td><code>4,000</code></td><td>Full strategy generation, narrative reports</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="features-subsection-title">AI Capabilities</h3>
          <div className="features-detail-grid">
            <div className="features-detail-card">
              <h4>Strategy Generation</h4>
              <p>
                Describe your investment thesis in natural language. The AI generates a valid
                VibePlan with factors, weights, filters, and constraints.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Portfolio Analysis</h4>
              <p>
                AI-powered narrative reports on your portfolio composition, risk exposure,
                concentration issues, and optimization suggestions.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>JSON Mode</h4>
              <p>
                Structured output via <code>response_format: {"{"} type: "json_object" {"}"}</code>
                ensures AI responses are machine-parseable for plan compilation.
              </p>
            </div>
            <div className="features-detail-card">
              <h4>Error Handling</h4>
              <p>
                Graceful fallbacks for missing API keys, rate limits, insufficient credits,
                and invalid responses. AI features degrade, never break the app.
              </p>
            </div>
          </div>
        </section>

        {/* ===== ROADMAP ===== */}
        <section id="roadmap" className="features-section">
          <p className="features-chapter-label">Roadmap</p>
          <h2 className="features-section-title features-title-large">
            What's <span className="features-gradient-text">coming next.</span>
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
                  Plug in any model via OpenRouter — Claude, GPT, Gemini, Llama,
                  or local models via Ollama. Configurable temperature, top-p, and
                  token budgets per task. Local LLM adapter for fully offline AI.
                </p>
              </div>
            </div>

            <div className="features-roadmap-item">
              <div className="features-roadmap-marker coming-soon"></div>
              <div className="features-roadmap-content">
                <span className="features-roadmap-label">Coming Soon</span>
                <h4><GitBranch size={16} /> Flow Support</h4>
                <p>
                  Visual flow builder for creating complex investment workflows.
                  Chain data sources → filters → scoring → allocation → execution
                  into reusable, shareable flows — like visual programming for your portfolio.
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

        {/* ── Compatibility Matrix ─────────────────────────── */}
        <section className="features-compat-section">
          <div className="features-compat-inner">
            <p className="features-compat-eyebrow">Platform Support</p>
            <h2 className="features-compat-title">What runs where.</h2>
            <div className="features-compat-table">
              {/* Header */}
              <div className="features-compat-row features-compat-row--header">
                <div className="features-compat-cell">Platform</div>
                <div className="features-compat-cell">Download</div>
                <div className="features-compat-cell">Offline</div>
                <div className="features-compat-cell">Local AI</div>
                <div className="features-compat-cell">Status</div>
              </div>
              {/* macOS Apple Silicon */}
              <div className="features-compat-row">
                <div className="features-compat-cell features-compat-cell--platform">
                  <Laptop size={14} />macOS — Apple Silicon
                </div>
                <div className="features-compat-cell features-compat-cell--check">
                  <Check size={13} />.dmg
                </div>
                <div className="features-compat-cell features-compat-cell--check"><Check size={13} /></div>
                <div className="features-compat-cell features-compat-cell--check"><Check size={13} /></div>
                <div className="features-compat-cell"><span className="features-compat-status features-compat-status--recommended">Recommended</span></div>
              </div>
              {/* macOS Intel */}
              <div className="features-compat-row">
                <div className="features-compat-cell features-compat-cell--platform">
                  <Laptop size={14} />macOS — Intel
                </div>
                <div className="features-compat-cell features-compat-cell--check">
                  <Check size={13} />.dmg
                </div>
                <div className="features-compat-cell features-compat-cell--check"><Check size={13} /></div>
                <div className="features-compat-cell features-compat-cell--check"><Check size={13} /></div>
                <div className="features-compat-cell"><span className="features-compat-status features-compat-status--stable">Stable</span></div>
              </div>
              {/* Windows */}
              <div className="features-compat-row">
                <div className="features-compat-cell features-compat-cell--platform">
                  <LayoutGrid size={14} />Windows 10 / 11
                </div>
                <div className="features-compat-cell features-compat-cell--check">
                  <Check size={13} />.msi
                </div>
                <div className="features-compat-cell features-compat-cell--check"><Check size={13} /></div>
                <div className="features-compat-cell features-compat-cell--check"><Check size={13} /></div>
                <div className="features-compat-cell"><span className="features-compat-status features-compat-status--stable">Stable</span></div>
              </div>
              {/* Linux */}
              <div className="features-compat-row">
                <div className="features-compat-cell features-compat-cell--platform">
                  <Terminal size={14} />Linux (x86_64)
                </div>
                <div className="features-compat-cell features-compat-cell--check">
                  <Check size={13} />.AppImage
                </div>
                <div className="features-compat-cell features-compat-cell--check"><Check size={13} /></div>
                <div className="features-compat-cell features-compat-cell--partial">—</div>
                <div className="features-compat-cell"><span className="features-compat-status features-compat-status--beta">Beta</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="features-faq-section">
          <div className="features-faq-inner">
            <p className="features-faq-eyebrow">FAQ</p>
            <h2 className="features-faq-title">Common questions.</h2>
            <div className="features-faq-list">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`features-faq-item${faqOpen === i ? " features-faq-item--open" : ""}`}
                >
                  <button
                    className="features-faq-question"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    {item.q}
                    {faqOpen === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {faqOpen === i && (
                    <div className="features-faq-answer">{item.a}</div>
                  )}
                </div>
              ))}
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
            <a href="index.html#download" className="features-cta-btn">
              Download Flowfolio
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="features-footer">
          <div className="features-footer-content">
            <span className="features-footer-brand">
              <span className="ff-logo-dot" />
              Flowfolio
            </span>
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
            <a href="index.html">
              <FileText size={16} />
              Home
            </a>
            <a href="privacy.html">Privacy</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default FeaturesPage;
