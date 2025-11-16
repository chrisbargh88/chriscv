// src/pages/Search.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchRepos } from '../services/github';
import { searchLocal } from '../services/siteSearch';

const GITHUB_USER = 'chrisbargh88';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialQ = params.get('q') || '';

  const [q, setQ] = useState(initialQ);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = `Search: ${initialQ || 'All'} • CHRISCV`;
  }, [initialQ]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchRepos(GITHUB_USER);
        if (!alive) return;
        setRepos(data);
        setError('');
      } catch (err) {
        if (!alive) return;
        setError(err?.message || 'Could not load repositories for search.');
        setRepos([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  // Local résumé results
  const resumeResults = useMemo(() => searchLocal(initialQ), [initialQ]);

  // GitHub results
  const repoResults = useMemo(() => {
    const term = initialQ.toLowerCase().trim();
    if (!term) return [];
    return repos.filter((r) => {
      const name = r.name?.toLowerCase() || '';
      const desc = (r.description || '').toLowerCase();
      const lang = (r.language || '').toLowerCase();
      return name.includes(term) || desc.includes(term) || lang.includes(term);
    });
  }, [repos, initialQ]);

  const hasAny = initialQ && (resumeResults.length > 0 || repoResults.length > 0);

  return (
    <main className="about-page">
      <div className="container py-5">

        {/* Header */}
        <header className="about-card-secondary mb-4">
          <p className="about-kicker mb-2">SEARCH</p>
          <h1 className="about-title mb-1">Search CHRISCV</h1>
          <p className="about-subtitle mb-0">
            Find content across the résumé and GitHub projects — workflows, stacks, platforms,
            and more.
          </p>
        </header>

        {/* Search bar */}
        <section className="about-card mb-4">
          <form className="row g-3 align-items-center" onSubmit={handleSubmit}>
            <div className="col-12 col-md">
              <input
                className="form-control form-control-lg tech-input"
                placeholder="e.g. Xcellerate IT, SAP, workflow, React…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search site content and projects"
              />
            </div>
            <div className="col-12 col-md-auto d-grid">
              <button type="submit" className="btn btn-ghost-80s btn-lg">
                Search
              </button>
            </div>
          </form>
          {initialQ && (
            <p className="small text-muted mt-3 mb-0">
              Showing results for <strong>“{initialQ}”</strong>
            </p>
          )}
          {!initialQ && (
            <p className="small text-muted mt-3 mb-0">
              Start typing a term above to search across résumé content and GitHub repositories.
            </p>
          )}
        </section>

        {/* Error state */}
        {error && (
          <section className="about-card-secondary mb-4">
            <p className="small mb-0 text-warning">
              {error}
            </p>
          </section>
        )}

        {/* Résumé results */}
        {initialQ && (
          <section className="mb-5" aria-label="Résumé search results">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Résumé</h2>
              {resumeResults.length > 0 && (
                <span className="small text-muted">
                  {resumeResults.length} match{resumeResults.length !== 1 ? 'es' : ''}
                </span>
              )}
            </div>

            <div className="row g-3">
              {resumeResults.map((r) => (
                <div key={r.id} className="col-12 col-md-6">
                  <article className="about-card-secondary h-100">
                    <h3 className="h6 mb-1">
                      <Link to={r.url} className="link-80s-subtle text-decoration-none">
                        {r.title}
                      </Link>
                    </h3>
                    <p className="small text-muted mb-2">{r.excerpt}</p>
                    <div className="d-flex flex-wrap gap-1">
                      {r.tags.slice(0, 6).map((tag) => (
                        <span key={tag} className="chip chip-light">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>
              ))}

              {resumeResults.length === 0 && (
                <div className="col-12">
                  <div className="about-card-secondary">
                    <p className="small mb-0">No résumé matches for this term.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* GitHub results */}
        {initialQ && (
          <section aria-label="GitHub search results">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">GitHub Projects</h2>
              {repoResults.length > 0 && (
                <span className="small text-muted">
                  {repoResults.length} match{repoResults.length !== 1 ? 'es' : ''}
                </span>
              )}
            </div>

            <div className="row g-3">
              {repoResults.map((repo) => (
                <div key={repo.id} className="col-12 col-md-6 col-lg-4">
                  <article className="about-card-secondary h-100 d-flex flex-column">
                    <h3 className="h6 fw-semibold mb-1">
                      <Link
                        to={`/portfolio/${repo.name}`}
                        className="link-80s-subtle text-decoration-none"
                      >
                        {repo.name}
                      </Link>
                    </h3>
                    <p className="small text-muted flex-grow-1 mb-3">
                      {repo.description || 'No description'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span
                        className={`badge lang-badge ${
                          repo.language?.toLowerCase() || 'neutral'
                        }`}
                      >
                        {repo.language || 'Unspecified'}
                      </span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="small link-80s-subtle"
                      >
                        GitHub ↗
                      </a>
                    </div>
                  </article>
                </div>
              ))}

              {repoResults.length === 0 && (
                <div className="col-12">
                  <div className="about-card-secondary">
                    <p className="small mb-0">No GitHub matches for this term.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* No results at all */}
        {initialQ && !hasAny && (
          <section className="about-card-secondary mt-4">
            <p className="small mb-0">No results found across résumé or GitHub projects.</p>
          </section>
        )}
      </div>
    </main>
  );
}


