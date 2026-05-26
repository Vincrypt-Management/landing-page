function Footer() {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
  return (
    <footer className="landing-footer">
      <div className="landing-footer-content">
        <div className="landing-footer-brand">
          <span className="landing-footer-logo">
            <img src={logoSrc} alt="" className="ff-brand-icon" width={20} height={20} />
            Flowfolio
          </span>
          <span className="landing-footer-tagline">
            Made for privacy-conscious investors.
          </span>
          <span className="landing-footer-copy">
            &copy; {new Date().getFullYear()} Flowfolio · Open source under the project license
          </span>
        </div>
        <nav className="landing-footer-links" aria-label="Footer">
          <a
            href="https://github.com/Vincrypt-Management/flowfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="features.html">Documentation</a>
          <a href="releases.html">Releases</a>
          <a href="privacy.html">Privacy</a>
          <a
            href="https://www.instagram.com/flowfolio.ai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
