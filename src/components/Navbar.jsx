import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', query);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top py-3 ${
        isHome ? 'navbar-hero' : 'navbar-default'
      }`}
    >
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          CHRISCV
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
            {[
              { path: '/', label: 'Home', end: true },
              { path: '/resume', label: 'Resume' },
              { path: '/portfolio', label: 'Portfolio' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' },
            ].map((link, i) => (
              <li key={i} className="nav-item">
                <NavLink
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    'nav-link' + (isActive ? ' active' : '')
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input
              className="form-control me-2 nav-search"
              type="search"
              placeholder="Search..."
              aria-label="Search"
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

