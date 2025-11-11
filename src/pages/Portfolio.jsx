import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchRepos } from '../services/github';
import LiveFlightsStat from '../components/LiveFlightsStat';
import DelayChart from '../components/DelayChart';
import LiveFlightsList from '../components/LiveFlightsList';

const GITHUB_USER = 'chrisbargh88';

export default function Portfolio() {
  useEffect(() => { document.title = 'Chris Bargh'; }, []);

  const [repos, setRepos] = useState([]);
  const [q, setQ] = useState('');
  const [lang, setLang] = useState('all');
  const [error, setError] = useState('');

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
        setError(err?.message || 'Could not load GitHub repositories.');
        setRepos([
          { id: 1, name: 'api-projects-demo', description: 'Demo portfolio card (fallback)', language: 'JavaScript', html_url: `https://github.com/${GITHUB_USER}` },
          { id: 2, name: 'chris-resume-site', description: 'Personal site scaffold (fallback)', language: 'React', html_url: `https://github.com/${GITHUB_USER}` },
        ]);
      }
    })();
    return () => { alive = false; };
  }, []);

  const languages = useMemo(() => {
    const set = new Set(repos.map(r => r.language).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [repos]);

  const filtered = useMemo(() => {
    const qLower = q.toLowerCase();
    return repos.filter(r => {
      const name = r.name?.toLowerCase() || '';
      const desc = (r.description || '').toLowerCase();
      const langLower = (r.language || '').toLowerCase();
      const matchQ = !qLower || name.includes(qLower) || desc.includes(qLower);
      const matchLang = lang === 'all' || langLower === lang.toLowerCase();
      return matchQ && matchLang;
    });
  }, [repos, q, lang]);

  return (
    <main className="portfolio theme-tech container-xl py-5">
      {/* Header */}
      <header className="mb-4 text-center">
        <h1 className="neon-title mb-1">Portfolio</h1>
        <p className="muted-80s mb-0">Live aviation analytics & GitHub projects — workflow • data • automation</p>
      </header>

      {/* API widgets */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card portfolio-card dark h-100">
            <div className="card-body">
              <h2 className="panel-title mb-3">Live Flights (OpenSky)</h2>
              <LiveFlightsStat />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card portfolio-card dark h-100">
            <div className="card-body">
              <h2 className="panel-title mb-3">SYD — Average Lateness (Monthly)</h2>
              <DelayChart />
            </div>
          </div>
        </div>
      </div>

      {/* Live flights list */}
      <div className="card portfolio-card dark mb-5">
        <div className="card-body">
          <h2 className="panel-title mb-3">Live Flight Data (Detail)</h2>
          <LiveFlightsList />
        </div>
      </div>

      {/* Search + Filters */}
      <div className="portfolio-filter dark card border-0 mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-center" onSubmit={e => e.preventDefault()}>
            <div className="col-12 col-md">
              <input
                className="form-control form-control-lg tech-input"
                placeholder="Search projects…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-auto">
              <select
                className="form-select form-select-lg tech-input"
                value={lang}
                onChange={e => setLang(e.target.value)}
              >
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-auto d-grid">
              <button
                type="button"
                className="btn btn-ghost-80s btn-lg"
                onClick={() => { setQ(''); setLang('all'); }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-80s mb-4" role="alert">
          <strong>Heads up:</strong> {error}
          <div className="small mt-1">
            Unauthenticated GitHub calls can be rate-limited (~60/hour). Fallback cards are shown.
          </div>
        </div>
      )}

      {/* GitHub Repos */}
      <h2 className="section-subtitle mb-3">GitHub Projects</h2>
      <div className="row g-4">
        {filtered.map(repo => (
          <div key={repo.id} className="col-12 col-md-6 col-lg-4">
            <div className="card repo-card dark h-100 border-0">
              <div className="card-body d-flex flex-column">
                <h3 className="h6 fw-semibold mb-1">
                  <Link to={`/portfolio/${repo.name}`} className="link-80s text-decoration-none">
                    {repo.name}
                  </Link>
                </h3>
                <p className="small muted-80s flex-grow-1 mb-3">{repo.description || 'No description'}</p>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className={`badge lang-badge ${repo.language?.toLowerCase() || 'neutral'}`}>
                    {repo.language || 'Unspecified'}
                  </span>
                  <a href={repo.html_url} target="_blank" rel="noreferrer" className="small link-80s-subtle">
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-12">
            <div className="alert alert-80s border-0">No matching projects — try resetting filters.</div>
          </div>
        )}
      </div>
    </main>
  );
}

