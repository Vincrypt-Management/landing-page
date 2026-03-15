import { FaWindows } from "react-icons/fa6";
import { SiApple, SiLinux, SiAndroid } from "react-icons/si";
import type { ReactNode } from "react";
import { useGitHubRelease } from "../hooks/useGitHubRelease";
import type { PlatformRelease } from "../hooks/useGitHubRelease";

// Icons live in the component — the hook owns no React UI concerns
const PLATFORM_ICONS: Record<PlatformRelease["name"], ReactNode> = {
  Windows: <FaWindows size={22} />,
  macOS:   <SiApple size={22} />,
  Linux:   <SiLinux size={22} />,
  Android: <SiAndroid size={22} />,
};

function DownloadSkeleton() {
  return (
    <div className="ff-platform-grid">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="landing-platform-btn landing-platform-btn--skeleton" aria-hidden="true">
          <div className="landing-skeleton-icon" />
          <div className="landing-skeleton-text landing-skeleton-text--name" />
          <div className="landing-skeleton-text landing-skeleton-text--version" />
        </div>
      ))}
    </div>
  );
}

function DownloadSection() {
  const { loading, platforms, detectedPlatform } = useGitHubRelease();

  return (
    <section className="landing-download-section" id="download">
      <div className="landing-download-section-content">
        <h2 className="landing-download-title">Download Flowfolio.</h2>
        <p className="landing-download-subtitle">
          Free and open source. No account required.
        </p>

        {loading ? (
          <DownloadSkeleton />
        ) : (
          <div className="ff-platform-grid">
            {platforms.map((platform) => {
              const isRecommended = platform.name === detectedPlatform;
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  className={`landing-platform-btn${isRecommended ? " landing-platform-btn--recommended" : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {isRecommended && (
                    <span className="landing-platform-recommended-badge">
                      Recommended
                    </span>
                  )}
                  {PLATFORM_ICONS[platform.name]}
                  <span className="landing-platform-name">{platform.name}</span>
                  <span className="landing-platform-version">{platform.version}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default DownloadSection;
