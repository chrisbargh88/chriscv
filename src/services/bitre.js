// src/services/bitre.js

// Primary local CSV (place bitre_otp_latest.csv in your /public folder)
const LOCAL_CSV = "/bitre_otp_latest.csv";

/** Fetch CSV text from /public with a final CORS-mirror fallback (rarely needed in dev). */
async function fetchCsvText() {
  try {
    const r = await fetch(LOCAL_CSV, { cache: "no-store" });
    if (r.ok) return await r.text();
  } catch {}
  // Fallback: mirror (should be unnecessary for /public, but left as a safety net)
  const mirror = "https://cors.isomorphic-git.org/";
  const url = LOCAL_CSV.startsWith("/") ? window.location.origin + LOCAL_CSV : LOCAL_CSV;
  const r2 = await fetch(mirror + url, { cache: "no-store" });
  if (!r2.ok) throw new Error("Could not load BITRE CSV");
  return await r2.text();
}

/** Minimal CSV parser that handles quotes and commas inside quotes. */
function parseCsv(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };

  const split = (line) => {
    const out = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === "," && !inQ) {
        out.push(cur);
        cur = "";
      } else {
        cur += c;
      }
    }
    out.push(cur);
    return out;
  };

  const rawHeaders = split(lines[0]).map(h => h.trim());
  const lower = rawHeaders.map(h => h.toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = split(lines[i]);
    if (!cols.length) continue;
    const obj = {};
    for (let j = 0; j < lower.length; j++) {
      obj[lower[j]] = (cols[j] ?? "").trim();
    }
    rows.push(obj);
  }

  return { headers: rawHeaders, rows };
}

/** Helper: get first non-empty property by alias list. */
function get(o, aliases, def = "") {
  for (const a of aliases) {
    const v = o[a.toLowerCase()];
    if (v !== undefined && v !== "") return v;
  }
  return def;
}

/**
 * Transform rows → {months, monthData} for Sydney departures.
 * - monthData[YYYY-MM] = [{ airline, avg_delay_min, flights, pct_delayed? }, ...]
 */
function transformBitre(rows, depPort = "Sydney") {
  // Header alias lists (include our normalized CSV names)
  const colAirline = ["airline", "airline name", "carrier"];
  const colDep = [
    "departing_port", "departure port", "departure airport", "dep airport",
    "from", "port of departure"
  ];
  const colArr = ["arriving_port", "arrival port", "arriving port", "to", "destination"];
  const colMonth = ["month", "period", "reporting month", "year_month"];
  const colOntime = [
    "on_time_departures_pct",
    "on time departures (%)",
    "on-time departures (%)",
    "on time departures percent",
    "departures on time (%)"
  ];
  const colAvgDelay = [
    "avg_departure_delay_mins",
    "average departure delay (minutes)",
    "avg departure delay (mins)",
    "average departure delay (mins)",
    "avg dep delay (min)"
  ];
  const colDepFlights = [
    "sectors_flown",
    "sectors flown",
    "total departures",
    "departures",
    "number of departures"
  ];

  // Normalize Month → YYYY-MM
  const normMonth = (s) => {
    if (!s) return "";
    const raw = (s + "").trim();
    // Already YYYY-MM?
    if (/^\d{4}-\d{2}$/.test(raw)) return raw;
    // Parse with Date
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    }
    // Try formats like "Sep 2025" / "September 2025"
    const year = (raw.match(/\b(19|20)\d{2}\b/) || [""])[0];
    const monthNames = {
      jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
      jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
    };
    const m3 = raw.slice(0, 3).toLowerCase();
    if (year && monthNames[m3]) return `${year}-${monthNames[m3]}`;
    return raw; // last resort
  };

  // Gather months
  const monthSet = new Set();
  for (const r of rows) {
    const m = normMonth(get(r, colMonth));
    if (m) monthSet.add(m);
  }
  const months = Array.from(monthSet).sort(); // oldest → newest

  // Aggregate by month → airline (departures from Sydney)
  const byMonth = {};
  for (const r of rows) {
    const dep = get(r, colDep);
    if (!dep || dep.toLowerCase() !== depPort.toLowerCase()) continue;

    const m = normMonth(get(r, colMonth));
    if (!m) continue;

    const airline = get(r, colAirline) || "Unknown";
    const onTimeStr = get(r, colOntime);
    const avgDelayStr = get(r, colAvgDelay);
    const flightsStr = get(r, colDepFlights);

    const onTime = parseFloat((onTimeStr + "").replace("%", ""));
    const avgDelay = parseFloat(avgDelayStr);
    const flights = parseInt(flightsStr || "0", 10);

    // Lateness preference: avg delay minutes if available; else proxy from on-time %
    const lateness = Number.isFinite(avgDelay)
      ? avgDelay
      : (Number.isFinite(onTime) ? Math.max(0, 100 - onTime) : null);

    if (lateness == null) continue;

    byMonth[m] ||= {};
    byMonth[m][airline] ||= { airline, sum: 0, n: 0, flights: 0, delayedFlights: 0 };

    byMonth[m][airline].sum += lateness;
    byMonth[m][airline].n += 1;
    if (Number.isFinite(flights)) byMonth[m][airline].flights += flights;

    if (Number.isFinite(onTime) && Number.isFinite(flights) && flights > 0) {
      const delayed = Math.round((100 - onTime) / 100 * flights);
      byMonth[m][airline].delayedFlights += delayed;
    }
  }

  // Finalize averages per month/airline
  const monthData = {};
  for (const m of Object.keys(byMonth)) {
    const arr = Object.values(byMonth[m]).map(a => {
      const avg = a.sum / (a.n || 1);
      const flights = a.flights || a.n; // fallback to row count
      const pctDelayed = a.delayedFlights && flights ? (a.delayedFlights / flights) * 100 : undefined;
      return {
        airline: a.airline,
        avg_delay_min: Math.round(avg * 10) / 10,
        flights,
        pct_delayed: pctDelayed != null ? Math.round(pctDelayed * 10) / 10 : undefined,
      };
    });
    // Keep only reasonable sample sizes
    monthData[m] = arr.filter(x => x.flights >= 3).sort((x, y) => y.avg_delay_min - x.avg_delay_min);
  }

  return { months, monthData, source: "BITRE" };
}

/** Public: load and transform the local CSV into { months, monthData, source }. */
export async function loadBitreOtp() {
  const csv = await fetchCsvText();
  const { rows } = parseCsv(csv);
  return transformBitre(rows, "Sydney"); // departures from Sydney
}

/**
 * Backwards-compatible helper:
 * Returns { month, items, source } for the latest month only (same shape as your mock).
 */
export async function fetchSydLatenessLatestMonth() {
  const { months, monthData, source } = await loadBitreOtp();
  const latest = months[months.length - 1];
  return { month: latest, items: monthData[latest] || [], source };
}
