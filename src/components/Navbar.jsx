// src/components/Navbar.jsx
import { NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onHome = pathname === "/";
  const onContact = pathname.startsWith("/contact");

  const skin = onContact
    ? "navbar-simpsons"
    : onHome
    ? "navbar-hero"
    : "navbar-default";

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <nav className={`navbar navbar-expand-lg ${skin} sticky-top py-3`}>
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Chris Bargh
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3 me-lg-3">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/resume" className="nav-link">
                Resume
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/portfolio" className="nav-link">
                API Portfolio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Search Form */}
          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn nav-search-btn" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}


