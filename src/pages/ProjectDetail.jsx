// src/pages/ProjectDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRepo } from '../services/github';

const GITHUB_USER = 'chrisbargh88';

export default function ProjectDetail() {
  const { name } = useParams();
  const [repo, setRepo] = useState(null);
  const [error, setError] = useState('');

  // Set initial title
  useEffect(() => {
    document.title = `${name} • CHRISCV`;
  }, [name]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetchRepo(GITHUB_USER, name);
        if (!alive) return;
        setRepo(r);
        setError('');
        document.title = `${r.name} • CHRISCV`;
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Could not load repository details.');
      }
    })();
    return () => { alive = false; };
  }, [name]);

  if (error) {
    return (
      <main className="container py-4">
        <nav className="mb-3">
          <Link to="/portfolio" className="link-secondary">← Back to Portfolio</Link>
        </nav>
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      </main>
    );
  }

  if (!repo) {
    return (
      <main className="container py-4">
        <nav className="mb-3">
          <Link to="/portfolio" className="link-secondary">← Back to Portfolio</Link>
        </nav>
        <div className="placeholder-glow">
          <h1 className="h3 mb-3"><span className="placeholder col-6"></span></h1>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p className="placeholder col-8 mb-2"></p>
              <p className="placeholder col-5 mb-2"></p>
              <p className="placeholder col-7 mb-0"></p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <nav className="mb-3">
        <Link to="/portfolio" className="link-secondary">← Back to Portfolio</Link>
      </nav>

      {/* Header */}
      <header className="mb-3">
        <h1 className="h3 mb-1">{repo.name}</h1>
        <p className="text-muted mb-0">{repo.description || 'No description'}</p>
      </header>

      {/* Meta / Stats */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge text-bg-light border">
                  {repo.language || 'Unspecified'}
                </span>
                <span className="badge text-bg-light border">
                  ⭐ Stars: {repo.stars ?? repo.stargazers_count ?? 0}
                </span>
                <span className="badge text-bg-light border">
                  🍴 Forks: {repo.forks ?? 0}
                </span>
                <span className="badge text-bg-light border">
                  ❗ Issues: {repo.open_issues ?? 0}
                </span>
                <span className="badge text-bg-light border">
                  Branch: {repo.default_branch || 'main'}
                </span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  aria-label={`Open ${repo.name} on GitHub`}
                >
                  View on GitHub ↗
                </a>
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Project site ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar meta */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              {repo.license && (
                <p className="text-muted mb-2">
                  <span className="fw-semibold">License:</span> {repo.license}
                </p>
              )}
              <p className="text-muted mb-0">
                <span className="fw-semibold">Last updated:</span>{' '}
                {repo.updated_at ? new Date(repo.updated_at).toLocaleString() : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
