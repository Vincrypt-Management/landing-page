import { FaWindows } from "react-icons/fa6";
import { SiApple, SiLinux, SiAndroid } from "react-icons/si";

const RELEASE_BASE =
  "https://github.com/Vincrypt-Management/flowfolio/releases/download/v0.2.0";

const platforms = [
  {
    name: "Windows",
    icon: <FaWindows size={24} />,
    version: "v0.2.0",
    href: `${RELEASE_BASE}/FlowFolio-0.2.0-windows-x64-setup.exe`,
  },
  {
    name: "macOS",
    icon: <SiApple size={24} />,
    version: "v0.2.0",
    href: `${RELEASE_BASE}/FlowFolio-0.2.0-macos-aarch64.dmg`,
  },
  {
    name: "Linux",
    icon: <SiLinux size={24} />,
    version: "v0.2.0",
    href: `${RELEASE_BASE}/FlowFolio-0.2.0-linux-amd64.AppImage`,
  },
  {
    name: "Android",
    icon: <SiAndroid size={24} />,
    version: "v0.2.0",
    href: `${RELEASE_BASE}/FlowFolio-0.2.0-android.apk`,
  },
];

function DownloadSection() {
  return (
    <section className="landing-download-section" id="download">
      <div className="landing-download-section-content">
        <h2 className="landing-download-title">Download Flowfolio</h2>
        <p className="landing-download-subtitle">
          Free and open source. No account required.
        </p>
        <div className="landing-platform-buttons">
          {platforms.map((platform, index) => (
            <a
              key={index}
              href={platform.href}
              className="landing-platform-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {platform.icon}
              <span className="landing-platform-name">{platform.name}</span>
              <span className="landing-platform-version">{platform.version}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DownloadSection;
