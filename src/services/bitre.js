// src/services/bitre.js
// BITRE fetcher with 3 paths + month padding:
// 1) CKAN JSON (GET + sort) via CRA proxy
// 2) CSV download via CRA proxy (Papa Parse)
// 3) CSV via public CORS helper (for prod without proxy)
//
// Export: fetchBitreLatest(limit = 5000, { scope = 'ALL' })
//  - rows: per-airline rows (optionally filtered to Departing_Port = 'Sydney' when scope === 'SYD')
//  - monthsAsc: [[key,label], ...] built from ALL rows, then PADDED to a continuous range

import Papa from 'papaparse';

const RESOURCE_ID = 'cf663ed1-0c5e-497f-aea9-e74bfda9cf44';

// Relative (proxied in dev via "proxy": "https://data.gov.au" in package.json)
const CKAN_URL = `/data/api/action/datastore_search?resource_id=${RESOURCE_ID}&limit=5000&sort=Year%20desc,%20Month_Num%20desc`;
const CSV_URL  = `/data/dataset/29128ebd-dbaa-4ff5-8b86-d9f30de56452/resource/${RESOURCE_ID}/download/otp_time_series_web.csv`;

// Final fallback (adds permissive CORS headers for static/prod demos)
const CORS_HELPER = (url) => `https://cors.isomorphic-git.org/${encodeURI(url)}`;

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const pad2 = (n) => String(n).padStart(2, '0');
const num = (v) => {
  if (v == null || v === '') return null;
  if (typeof v === 'string') v = v.trim();
  const n = typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : Number(v);
  return Number.isFinite(n) ? n : null;
};

function monthFromRow(r) {
  const y = num(r.Year);
  const m = num(r.Month_Num);
  if (y && m) return { key: `${y}-${pad2(m)}`, label: `${MON[m-1] || ''} ${y}` };
  const s = (r.Month ?? '').toString().trim();
  return { key: '', label: s };
}

// Prefer explicit average delay if present; otherwise derive a proxy from on-time ratio.
function deriveAvgDelay(r) {
  const explicit = num(r.Average_Delay) ?? num(r['Average Delay (mins)']);
  if (explicit != null) return { value: explicit, explicit: true };

  const onTime = num(r.Departures_On_Time);
  let delayed = num(r.Departures_Delayed);
  const flown = num(r.Sectors_Flown);

  if (delayed == null && flown != null && onTime != null) delayed = Math.max(0, flown - onTime);

  let operated = null;
  if (onTime != null && delayed != null) operated = onTime + delayed;
  else if (flown != null) operated = flown;

  if (operated && operated > 0 && onTime != null) {
    const onTimePct = (onTime / operated) * 100;
    const latePct = Math.max(0, Math.min(100, 100 - onTimePct));
    return { value: +(15 * (latePct / 100)).toFixed(1), explicit: false };
  }
  return { value: null, explicit: false };
}

// Per-airline normalisation (excludes "All Airlines"), optional SYD port filter.
function normaliseAirlineRows(rows, scope = 'ALL') {
  const wantSydney = scope === 'SYD';
  return rows
    .filter(r => {
      const airline = (r.Airline ?? '').toString().trim();
      if (!airline || airline === 'All Airlines') return false;
      if (!wantSydney) return true;
      // BITRE uses full city names, e.g., 'Sydney'
      return (r.Departing_Port ?? '').toString().trim() === 'Sydney';
    })
    .map(r => {
      const airline = r.Airline.toString().trim();
      const { key, label } = monthFromRow(r);
      const { value, explicit } = deriveAvgDelay(r);
      return {
        monthKey: key,
        monthLabel: label,
        airline,
        airportCode: wantSydney ? 'SYD' : '',
        airportName: wantSydney ? 'Sydney (Departures)' : '',
        avg_delay: value,
        _hasExplicitDelay: explicit,
        raw: r,
      };
    });
}

// Helper to step month-by-month
function stepMonths(y, m) {
  m += 1;
  if (m > 12) { m = 1; y += 1; }
  return [y, m];
}

// Build month dropdown from ALL rows, then PAD to a continuous range (latest 24 kept).
function collectMonthsAscFromAllRows(allRows) {
  const labelMap = new Map(); // key -> label
  for (const r of allRows) {
    const { key, label } = monthFromRow(r);
    const k = key || label;
    const v = label || key;
    if (k) labelMap.set(k, v);
  }

  // Get normalized YYYY-MM keys
  const yymm = Array.from(labelMap.keys()).filter(k => /^\d{4}-\d{2}$/.test(k));
  if (yymm.length === 0) {
    // Fallback: no normalized keys, just return latest 24 distinct labels
    const desc = Array.from(labelMap.entries()).sort((a,b)=> (b[0] > a[0] ? 1 : -1));
    const latest24 = desc.slice(0, 24);
    latest24.sort((a,b)=> (a[0] > b[0] ? 1 : -1));
    return latest24;
  }

  yymm.sort(); // asc
  const minKey = yymm[0];
  const maxKey = yymm[yymm.length - 1];

  const [minY, minM] = minKey.split('-').map(Number);
  const [maxY, maxM] = maxKey.split('-').map(Number);

  // Generate continuous range min..max
  const padded = [];
  let y = minY, m = minM;
  while (y < maxY || (y === maxY && m <= maxM)) {
    const key = `${y}-${pad2(m)}`;
    const label = labelMap.get(key) || `${MON[m-1]} ${y}`;
    padded.push([key, label]);
    [y, m] = stepMonths(y, m);
  }

  // Keep only latest 24 months for a compact UI
  const latest24 = padded.slice(Math.max(0, padded.length - 24));
  return latest24;
}

// Keep only latest 24 months in per-airline rows; output ASC for UI.
function keepLatest24MonthsAsc(records) {
  const desc = [...records].sort((a,b) => (b.monthKey > a.monthKey ? 1 : b.monthKey < a.monthKey ? -1 : 0));
  const monthsDesc = Array.from(new Set(desc.map(r => r.monthKey).filter(Boolean)));
  const latestSet = new Set(monthsDesc.slice(0, 24));
  const trimmed = desc.filter(r => !r.monthKey || latestSet.has(r.monthKey));
  trimmed.sort((a,b) => (a.monthKey > b.monthKey ? 1 : -1));
  return trimmed;
}

// ---- CKAN JSON via proxy ----
async function fetchViaJson(scope) {
  const res = await fetch(CKAN_URL, { method: 'GET' });
  if (!res.ok) throw new Error(`CKAN GET failed (${res.status})`);
  const data = await res.json();
  if (!data.success || !data.result) throw new Error('CKAN JSON unsuccessful');

  const allRowsRaw = data.result.records || [];
  const monthsAsc = collectMonthsAscFromAllRows(allRowsRaw);
  const airlineRows = normaliseAirlineRows(allRowsRaw, scope);
  const rows = keepLatest24MonthsAsc(airlineRows);

  return { rows, monthsAsc };
}

// ---- CSV via proxy (Papa Parse) ----
async function fetchViaCsv(url = CSV_URL, scope) {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`CSV fetch failed (${res.status})`);
  const csv = await res.text();

  const parsed = Papa.parse(csv, { header: true, dynamicTyping: false, skipEmptyLines: true });
  if (parsed.errors?.length) {
    throw new Error(`CSV parse error: ${parsed.errors[0].message || 'unknown'}`);
  }

  const allRowsRaw = parsed.data || [];
  const monthsAsc = collectMonthsAscFromAllRows(allRowsRaw);
  const airlineRows = normaliseAirlineRows(allRowsRaw, scope);
  const rows = keepLatest24MonthsAsc(airlineRows);

  return { rows, monthsAsc };
}

// PUBLIC API with scope + 3-step fallback
export async function fetchBitreLatest(limit = 5000, { scope = 'ALL' } = {}) {
  try {
    const { rows, monthsAsc } = await fetchViaJson(scope);
    return { rows: rows.slice(0, Math.min(limit, rows.length)), monthsAsc };
  } catch {
    try {
      const { rows, monthsAsc } = await fetchViaCsv(CSV_URL, scope);
      return { rows: rows.slice(0, Math.min(limit, rows.length)), monthsAsc };
    } catch {
      // Final fallback using public CORS helper (works even without CRA proxy)
      const rawUrl = 'https://data.gov.au/data/dataset/29128ebd-dbaa-4ff5-8b86-d9f30de56452/resource/cf663ed1-0c5e-497f-aea9-e74bfda9cf44/download/otp_time_series_web.csv';
      const { rows, monthsAsc } = await fetchViaCsv(CORS_HELPER(rawUrl), scope);
      return { rows: rows.slice(0, Math.min(limit, rows.length)), monthsAsc };
    }
  }
}



