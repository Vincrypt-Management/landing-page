import { FaWindows } from "react-icons/fa6";
import { SiApple, SiLinux, SiAndroid } from "react-icons/si";

function Hero() {
  const demoVideo = `${import.meta.env.BASE_URL}flowfolio-app-showcase.mp4`;

  return (
    <section className="landing-hero">
      <div className="landing-hero-inner">
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

          {/* CTA Button */}
          <div className="landing-install-btn">
            <a href="#download" style={{ color: "inherit", textDecoration: "none" }}>
              Download now
            </a>
            <div className="landing-install-divider" />
            <div className="landing-install-icons">
              <a href="#download" title="Windows">
                <FaWindows size={24} />
              </a>
              <a href="#download" title="macOS">
                <SiApple size={24} />
              </a>
              <a href="#download" title="Linux">
                <SiLinux size={24} />
              </a>
              <a href="#download" title="Android">
                <SiAndroid size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Product Video */}
        <div className="landing-hero-video">
          <div className="landing-hero-video-frame">
            <video
              src={demoVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
