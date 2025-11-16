// src/pages/ProjectDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRepo } from '../services/github';

const GITHUB_USER = 'chrisbargh88';

export default function ProjectDetail() {
  const { name } = useParams();
  const [repo, setRepo] = useState(null);
  const [error, setError] = useState('');

  // Initial title
  useEffect(() => {
    document.title = `${name} • CHRISCV`;
  }, [name]);

  // Load repo details
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
    return () => {
      alive = false;
    };
  }, [name]);

  // ---- Error state ----
  if (error) {
    return (
      <main className="portfolio-page">
        <div className="container-xl py-5">
          <nav className="mb-3">
            <Link to="/portfolio" className="link-80s">
              ← Back to Portfolio
            </Link>
          </nav>
          <div className="alert alert-80s" role="alert">
            {error}
          </div>
        </div>
      </main>
    );
  }

  // ---- Loading state ----
  if (!repo) {
    return (
      <main className="portfolio-page">
        <div className="container-xl py-5">
          <nav className="mb-3">
            <Link to="/portfolio" className="link-80s">
              ← Back to Portfolio
            </Link>
          </nav>
          <div className="placeholder-glow">
            <h1 className="neon-title mb-3">
              <span className="placeholder col-6"></span>
            </h1>
            <div className="card portfolio-card dark border-0">
              <div className="card-body">
                <p className="placeholder col-8 mb-2"></p>
                <p className="placeholder col-5 mb-2"></p>
                <p className="placeholder col-7 mb-0"></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ---- Ready ----
  return (
    <main className="portfolio-page">
      <div className="container-xl py-5">
        <nav className="mb-3">
          <Link to="/portfolio" className="link-80s">
            ← Back to Portfolio
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-3">
          <h1 className="neon-title mb-2">{repo.name}</h1>
          <p className="muted-80s mb-0">
            {repo.description || 'No description'}
          </p>
        </header>

        <div className="row g-4">
          {/* Main panel */}
          <div className="col-12 col-lg-8">
            <div className="card portfolio-card dark h-100 border-0">
              <div className="card-body">
                <h2 className="panel-title mb-3">Repository Details</h2>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge lang-badge neutral">
                    {repo.language || 'Unspecified'}
                  </span>
                  <span className="badge lang-badge neutral">
                    ⭐ Stars: {repo.stars ?? repo.stargazers_count ?? 0}
                  </span>
                  <span className="badge lang-badge neutral">
                    🍴 Forks: {repo.forks ?? 0}
                  </span>
                  <span className="badge lang-badge neutral">
                    ❗ Issues: {repo.open_issues ?? 0}
                  </span>
                  <span className="badge lang-badge neutral">
                    Branch: {repo.default_branch || 'main'}
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost-80s"
                    aria-label={`Open ${repo.name} on GitHub`}
                  >
                    View on GitHub ↗
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost-80s"
                    >
                      Project Site ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="card portfolio-card dark h-100 border-0">
              <div className="card-body">
                <h2 className="panel-title mb-3">Metadata</h2>

                {repo.license && (
                  <p className="muted-80s mb-2">
                    <span
                      className="fw-semibold"
                      style={{ color: 'var(--tech-accent)' }}
                    >
                      License:
                    </span>{' '}
                    {repo.license}
                  </p>
                )}
                <p className="muted-80s mb-0">
                  <span
                    className="fw-semibold"
                    style={{ color: 'var(--tech-accent)' }}
                  >
                    Last updated:
                  </span>{' '}
                  {repo.updated_at
                    ? new Date(repo.updated_at).toLocaleString()
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
