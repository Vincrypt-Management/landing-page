import { FaWindows, FaApple, FaLinux, FaAndroid } from "react-icons/fa";

function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-content">
        {/* Animated Badge */}
        <a href="#features" className="landing-badge">
          <span className="landing-badge-text">Now Available for Download →</span>
        </a>

        {/* Shiny Hero Title */}
        <h1 className="landing-hero-title">
          <span className="shiny-text">
            Privacy-First Portfolio
            <br />
            Intelligence.
          </span>
        </h1>

        <p className="landing-hero-subtitle">
          Build explainable investment strategies that run entirely on your
          machine. No cloud. No tracking. Your data, your rules.
        </p>

        {/* Install Button - Cream/White Style */}
        <div className="landing-install-btn">
          <a href="#download" style={{ color: "inherit", textDecoration: "none" }}>
            Download now
          </a>
          <div className="landing-install-divider" />
          <div className="landing-install-icons">
            <a href="#download" title="Windows">
              <FaWindows size={26} />
            </a>
            <a href="#download" title="macOS">
              <FaApple size={26} />
            </a>
            <a href="#download" title="Linux">
              <FaLinux size={26} />
            </a>
            <a href="#download" title="Android">
              <FaAndroid size={26} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
