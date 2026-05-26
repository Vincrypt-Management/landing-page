import { useState } from "react";
import { Github, Menu, X } from "lucide-react";

function Navbar() {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="landing-navbar" aria-label="Primary">
      <div className="landing-navbar-content">
        <a href="index.html" className="landing-logo" aria-label="Flowfolio home">
          <img src={logoSrc} alt="" className="ff-brand-icon" width={22} height={22} />
          Flowfolio
        </a>

        <button
          type="button"
          className="landing-menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="landing-nav-links"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>

        <ul
          id="landing-nav-links"
          className={`landing-nav-links${open ? " landing-nav-links--open" : ""}`}
        >
          <li><a href="#features" onClick={close}>Features</a></li>
          <li><a href="features.html" onClick={close}>Docs</a></li>
          <li><a href="releases.html" onClick={close}>Releases</a></li>
          <li><a href="privacy.html" onClick={close}>Privacy</a></li>
          <li><a href="#download" onClick={close}>Download</a></li>
          <li>
            <a
              href="https://github.com/Vincrypt-Management/flowfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-nav-btn landing-nav-btn-outline"
              aria-label="Flowfolio on GitHub (opens in new tab)"
              onClick={close}
            >
              <Github size={14} aria-hidden="true" />
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
