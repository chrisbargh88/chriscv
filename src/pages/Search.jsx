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

  useEffect(() => { document.title = `Search: ${initialQ} • CHRISCV`; }, [initialQ]);

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
    return () => { alive = false; };
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
    return repos.filter(r => {
      const name = r.name?.toLowerCase() || '';
      const desc = (r.description || '').toLowerCase();
      const lang = (r.language || '').toLowerCase();
      return name.includes(term) || desc.includes(term) || lang.includes(term);
    });
  }, [repos, initialQ]);

  const hasAny = initialQ && (resumeResults.length > 0 || repoResults.length > 0);

  return (
    <main className="container-xl py-5">
      <header className="mb-4">
        <h1 className="h3 mb-2">Search</h1>
        <p className="text-muted mb-0">Search across résumé content and GitHub projects.</p>
      </header>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-center" onSubmit={handleSubmit}>
            <div className="col-12 col-md">
              <input
                className="form-control form-control-lg"
                placeholder="e.g. Xcellerate IT, SAP, workflow, React…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search site content and projects"
              />
            </div>
            <div className="col-12 col-md-auto d-grid">
              <button type="submit" className="btn btn-primary btn-lg">Search</button>
            </div>
          </form>
          {initialQ && (
            <p className="small text-muted mt-2 mb-0">
              Showing results for <strong>“{initialQ}”</strong>
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {/* Résumé results */}
      {initialQ && (
        <>
          <h2 className="h5 mb-3">Résumé</h2>
          <div className="row g-4 mb-5">
            {resumeResults.map((r) => (
              <div key={r.id} className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h3 className="h6 mb-1">
                      <Link to={r.url} className="text-decoration-none">{r.title}</Link>
                    </h3>
                    <p className="small text-muted mb-2">{r.excerpt}</p>
                    <div className="d-flex flex-wrap gap-1">
                      {r.tags.slice(0, 6).map(tag => (
                        <span key={tag} className="badge bg-light text-dark border">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {resumeResults.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border">No résumé matches.</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* GitHub results */}
      {initialQ && (
        <>
          <h2 className="h5 mb-3">GitHub Projects</h2>
          <div className="row g-4">
            {repoResults.map(repo => (
              <div key={repo.id} className="col-12 col-md-6 col-lg-4">
                <div className="card repo-card h-100 border-0">
                  <div className="card-body d-flex flex-column">
                    <h3 className="h6 fw-semibold mb-1">
                      <Link to={`/portfolio/${repo.name}`} className="link-dark text-decoration-none">
                        {repo.name}
                      </Link>
                    </h3>
                    <p className="small text-muted flex-grow-1 mb-3">{repo.description || 'No description'}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className={`badge lang-badge ${repo.language?.toLowerCase() || 'neutral'}`}>
                        {repo.language || 'Unspecified'}
                      </span>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="small link-secondary">
                        GitHub ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {repoResults.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border">No GitHub matches.</div>
              </div>
            )}
          </div>
        </>
      )}

      {!initialQ && (
        <div className="alert alert-light border">Enter a search term above to get started.</div>
      )}

      {initialQ && !hasAny && (
        <div className="alert alert-light border mt-4">No results found anywhere.</div>
      )}
    </main>
  );
}

