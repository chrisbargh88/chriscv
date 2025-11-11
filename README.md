# CHRISCV — React Portfolio (Chris Bargh)

A single-page React application showcasing my résumé, portfolio, and live aviation analytics. Built with modern React (hooks, functional components, React Router), Bootstrap styling, and live public data sources.

Live demo (Render): https://chrisbargh.onrender.com/

---

## ✨ Features

- **SPA with React Router**: `Home`, `Resume`, `Portfolio`, `Project Detail`, `Search`, `About`, `Contact`.
- **Search (assignment requirement)**  
  - Navbar search navigates to `/search?q=...`.  
  - Searches **GitHub repositories** (via GitHub REST) and **Résumé content** (local index).
  - Results open to their **own page** (e.g., `/portfolio/:name`).
- **Live Data / APIs**
  - **OpenSky**: live flights nearby (JSON REST).
  - **BITRE (data.gov.au / CKAN)**: monthly on-time performance for AU airlines.
- **Accessible, responsive UI** with Bootstrap 5 + icons (CDN).
- **Dual theme**  
  - Light default for pages like Resume.  
  - “Tech” dark theme on Portfolio + Project pages with subtle neon accents.
- **No Redux**, minimal footprint, modern ES6+.

---

## 🧰 Tech / Dependencies

- **Runtime**: Node >= 18, npm >= 9
- **Framework**: React (CRA)
- **Router**: `react-router-dom`
- **Parsing**: `papaparse` (CSV parsing helper)
- **Styles**: Bootstrap 5 (CDN), Bootstrap Icons (CDN), custom `App.css`
- **Version control**: git + GitHub

> Installed via `package.json`:
>
> - `react`, `react-dom`, `react-scripts` (CRA)
> - `react-router-dom`
> - `papaparse`

---

## 🚀 Quick Start (Local)

```bash
# 1) Clone
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2) Install deps
npm install

# 3) Start dev server
npm start
# opens http://localhost:3000
```

Stop the dev server any time with **Ctrl + C** in the terminal.

---

## 📦 Build

```bash
npm run build
# Outputs a production-ready /build folder
```

---

## 📁 Project Structure (key files)

```
/public
  index.html            # base HTML (Bootstrap & Icons via CDN)
  hero-bg.jpg           # hero image used on Home
/src
  App.js                # Router, layout (Navbar + Footer + main)
  App.css               # all styles (light + dark themes)
  /components
    Navbar.jsx          # route-aware skins (home transparent, portfolio dark)
    Footer.jsx
    LiveFlightsStat.jsx # OpenSky widget
    LiveFlightsList.jsx # OpenSky list
    DelayChart.jsx      # BITRE monthly lateness (textual/derived)
  /pages
    Home.jsx
    Resume.jsx
    Portfolio.jsx
    ProjectDetail.jsx
    Search.jsx          # combined search (resume + GitHub)
    About.jsx
    Contact.jsx
  /services
    github.js           # fetchRepos(), fetchRepo()
    bitre.js            # fetch & normalize BITRE via CKAN datastore_search_sql
    opensky.js          # nearby aircraft; minimal transform
    siteSearch.js       # local résumé index + search
```

---

## 🔌 APIs (Live Data)

### 1) OpenSky Network (JSON)
- Public REST (no API key used here).  
- Used in `LiveFlightsStat.jsx` and `LiveFlightsList.jsx`.  
- Notes: unauthenticated calls have rate limits; widgets are defensive.

### 2) BITRE / data.gov.au (CKAN datastore)
- Resource ID: `cf663ed1-0c5e-497f-aea9-e74bfda9cf44`
- Access via **`datastore_search_sql`** (GET) to obtain latest months and airlines.  
- In `bitre.js`, we:  
  - Pull months, airlines, and totals;  
  - Derive **average delay** from on-time counts when explicit delay isn’t provided;  
  - Deduplicate airlines for the month (choose the most complete record).  
- If the API is temporarily unavailable, widgets show a friendly message.

---

## 🔍 Search (How it Works)

- **Navbar** form → `navigate('/search?q=...')`.
- `/pages/Search.jsx`:
  - Pulls **GitHub repos** with `fetchRepos()` and filters by name/description/language.
  - Queries **local résumé index** from `siteSearch.js` (e.g., “Xcellerate IT”, “SAP”, “QUT”).
- Every **GitHub result** links to `/portfolio/:name` (own page ✔).

---

## 🎨 Theming

- **Light theme** (default) for most pages.
- **Dark “tech” theme** on Portfolio and Project Detail:
  - The Navbar adds `body.portfolio-active` for `/portfolio` routes.
  - Dark panels use `.theme-tech`, `.portfolio-card.dark`, `.neon-title`, etc.
- All CSS consolidated in `src/App.css` (no inline styles).

---

## 🧪 Assignment Alignment Checklist

- ✅ **SPA** with React Router.
- ✅ **Hooks & functional components** (no classes, no Redux).
- ✅ **Events handled in React** (not in HTML).
- ✅ **Data via REST APIs** (OpenSky JSON, BITRE CKAN). No local CSVs in production UI.
- ✅ **Search feature** with results that open to their own page.
- ✅ **No inline styles**; Bootstrap + custom CSS only.
- ✅ **Code documented**; this README covers purpose, features, setup, architecture, license.
- ✅ **Version control** with GitHub (commit often with messages).
- ✅ **License** included (MIT recommended).

---

## 📝 Environment / Secrets

- **No secrets** required for public demo.  
- If you add keys later, use a `.env` file (not committed) and reference via `process.env.REACT_APP_*`.

---

## 🪪 License

This project is released under the **MIT License**.

---

## 🤝 Contributing

1. Fork the repo and create a feature branch.  
2. Commit with clear messages.  
3. Submit a PR describing the change.

Report issues via GitHub Issues with steps to reproduce.

---

## 🛫 Deploy to Render (Static Site)

**Prereq:** Your repo is on GitHub and builds locally with `npm run build`.

1. **Push to GitHub**
   ```bash
   git add -A
   git commit -m "feat: search + portfolio dark theme + BITRE API"
   git push origin main
   ```

2. **Create a new *Static Site* on Render**
   - Dashboard → **New** → **Static Site**.
   - Connect your GitHub repo.
   - **Build Command:** `npm install && npm run build`  
   - **Publish Directory:** `build`
   - Click **Create Static Site**.

3. **SPA Rewrite (very important)**  
   In Render → your Static Site → **Redirects/Rewrites** → add:
   - **Source:** `/*`  
   - **Destination:** `/index.html`  
   - **Action:** `Rewrite`

That’s it — Render will auto-deploy on each push to the selected branch.

---

## 🧹 Submission Tips (for Markers)

- Before submission, **delete `node_modules/`** to reduce bundle size.
- Marker setup:
  ```bash
  npm install
  npm start
  ```
- If testing the production build:
  ```bash
  npm run build
  npx serve -s build
  ```
- If a public API rate-limits, components show a friendly note/fallback.

---

## ⚠️ Known Notes

- GitHub unauthenticated requests: ~60/hr rate-limit.  
- OpenSky free endpoint can be intermittent; widgets degrade gracefully.  
- BITRE CKAN occasionally lags a month or two on refresh; we dedupe and normalize incoming monthly rows.

---

## 📚 Tools Used

- **VS Code**, **Git**, **Chrome DevTools**  
- Optional: GitHub Desktop for visual git flow
