import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onHome = pathname === '/';
  const onPortfolio = pathname.startsWith('/portfolio');

  useEffect(() => {
    if (onPortfolio) document.body.classList.add('portfolio-active');
    else document.body.classList.remove('portfolio-active');
  }, [onPortfolio]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const skin =
    onHome ? 'navbar-hero' :
    onPortfolio ? 'navbar-tech' :
    'navbar-default';

  return (
    <nav className={`navbar navbar-expand-lg ${skin} sticky-top py-3`}>
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">Chris Bargh</Link>

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
            <li className="nav-item"><NavLink to="/" end className="nav-link">Home</NavLink></li>
            <li className="nav-item"><NavLink to="/resume" className="nav-link">Resume</NavLink></li>
            <li className="nav-item"><NavLink to="/portfolio" className="nav-link">API Portfolio</NavLink></li>
            <li className="nav-item"><NavLink to="/about" className="nav-link">About</NavLink></li>
            <li className="nav-item"><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
          </ul>

          {/* SEARCH FORM */}
          <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search…"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn nav-search-btn" type="submit" aria-label="Submit search">
              <i className="bi bi-search" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}


