import { useGitHubRelease } from "../hooks/useGitHubRelease";

function Hero() {
  const demoVideo = `${import.meta.env.BASE_URL}flowfolio-app-showcase.mp4`;
  const { version } = useGitHubRelease();

  return (
    <section className="ff-hero">
      <div className="ff-hero-inner">
        {/* Eyebrow badge */}
        <div className="ff-eyebrow-badge">
          Open Source · Zero Telemetry · {version}
        </div>

        {/* Rule */}
        <div className="ff-hero-rule" />

        {/* Headline */}
        <h1 className="ff-hero-title">
          Portfolio intelligence,<br />without the cloud.
        </h1>

        {/* Subtext */}
        <p className="ff-hero-subtitle">
          Build explainable investment strategies that run entirely on your
          machine. No cloud. No tracking. Your data, your rules.
        </p>

        {/* Actions row */}
        <div className="ff-hero-actions">
          <a href="#download" className="ff-cta-primary">Download free →</a>
          <a
            href="https://github.com/Vincrypt-Management/flowfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="ff-cta-secondary"
          >
            View on GitHub
          </a>
        </div>

        {/* Trust stats */}
        <div className="ff-trust-stats">
          <div className="ff-trust-stat">
            <span className="ff-trust-number">100%</span>
            <span className="ff-trust-label">Offline</span>
          </div>
          <div className="ff-trust-stat">
            <span className="ff-trust-number">0 bytes</span>
            <span className="ff-trust-label">Data shared</span>
          </div>
          <div className="ff-trust-stat">
            <span className="ff-trust-number">4</span>
            <span className="ff-trust-label">Platforms</span>
          </div>
          <div className="ff-trust-stat">
            <span className="ff-trust-number">Free</span>
            <span className="ff-trust-label">Forever</span>
          </div>
        </div>
      </div>

      {/* Product video — full width, outside inner max-width */}
      <div className="ff-hero-video-wrap">
        <div className="ff-hero-video-container">
          <video src={demoVideo} autoPlay loop muted playsInline />
        </div>
      </div>
    </section>
  );
}

export default Hero;
