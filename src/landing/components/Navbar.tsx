function Navbar() {
  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-content">
        <a href="#" className="landing-logo">
          <span className="ff-logo-dot" />
          Flowfolio
        </a>
        <ul className="landing-nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="features.html">Docs</a>
          </li>
          <li>
            <a href="releases.html">Releases</a>
          </li>
          <li>
            <a href="#download">Download</a>
          </li>
          <li>
            <a
              href="https://github.com/Vincrypt-Management/flowfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-nav-btn landing-nav-btn-outline"
            >
              <span className="ff-nav-dot" />
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
