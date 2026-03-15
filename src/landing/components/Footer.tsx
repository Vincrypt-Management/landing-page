function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-content">
        <div className="landing-footer-brand">
          <span className="landing-footer-logo">
            <span className="ff-logo-dot" />
            Flowfolio
          </span>
          <span className="landing-footer-tagline">
            Made for privacy-conscious investors.
          </span>
        </div>
        <div className="landing-footer-links">
          <a
            href="https://github.com/Vincrypt-Management/flowfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Vincrypt-Management/flowfolio#readme"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <a href="releases.html">Releases</a>
          <a href="privacy.html">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
