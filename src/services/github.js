// src/services/github.js
const GH_BASE = 'https://api.github.com';

function friendlyHeaders() {
  return {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'CHRISCV-Portfolio', // helps avoid occasional soft blocks
  };
}

function handleRateLimit(r) {
  if (r.status === 403) {
    const reset = r.headers.get('x-ratelimit-reset');
    const when = reset ? new Date(parseInt(reset, 10) * 1000).toLocaleTimeString() : 'soon';
    throw new Error(`GitHub API rate limited. Try again at ${when}.`);
  }
}

/** List repos for a user (public, up to 100), sorted by update time. */
export async function fetchRepos(username) {
  const url = `${GH_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
  const r = await fetch(url, { headers: friendlyHeaders() });
  handleRateLimit(r);
  if (!r.ok) throw new Error(`GitHub API error ${r.status}`);
  const data = await r.json();
  return (Array.isArray(data) ? data : []).map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    html_url: repo.html_url,
    updated_at: repo.updated_at,
  }));
}

/** Fetch a single repo by owner/name (used by ProjectDetail.jsx). */
export async function fetchRepo(username, repoName) {
  const url = `${GH_BASE}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}`;
  const r = await fetch(url, { headers: friendlyHeaders() });
  handleRateLimit(r);
  if (!r.ok) throw new Error(`GitHub API error ${r.status}`);
  const repo = await r.json();
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    html_url: repo.html_url,
    homepage: repo.homepage,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    open_issues: repo.open_issues_count,
    license: repo.license?.spdx_id || repo.license?.name || null,
    updated_at: repo.updated_at,
    default_branch: repo.default_branch,
  };
}
