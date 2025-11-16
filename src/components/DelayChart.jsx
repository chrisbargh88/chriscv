import { useEffect, useMemo, useState } from 'react';
import { fetchBitreLatest } from '../services/bitre';

export default function DelayChart() {
  const [records, setRecords] = useState([]);
  const [monthsAsc, setMonthsAsc] = useState([]);
  const [month, setMonth] = useState('');
  const [airline, setAirline] = useState('');
  const [scope, setScope] = useState('SYD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingProxy, setUsingProxy] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const { rows, monthsAsc } = await fetchBitreLatest(5000, { scope });
        if (!alive) return;
        setRecords(rows);
        setMonthsAsc(monthsAsc);
        setUsingProxy(rows.some(r => !r._hasExplicitDelay));
        if (monthsAsc && monthsAsc.length) setMonth(monthsAsc[monthsAsc.length - 1][0]);
        setError('');
      } catch (e) {
        if (!alive) return;
        setError(e?.message || 'Could not load BITRE lateness data.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [scope]);

  const dataset = useMemo(() => {
    const monthRows = records.filter(r => (r.monthKey || r.monthLabel) === month);
    const groups = new Map();
    for (const r of monthRows) {
      const key = (r.airline || '').trim();
      if (!key) continue;
      const val = Number.isFinite(r.avg_delay) ? r.avg_delay : null;
      if (!groups.has(key)) groups.set(key, { airline: key, delays: [] });
      if (val !== null) groups.get(key).delays.push(val);
    }
    let grouped = Array.from(groups.values()).map(g => ({
      airline: g.airline,
      avg_delay: g.delays.length ? g.delays.reduce((a,b)=>a+b,0)/g.delays.length : null
    }));
    if (airline.trim()) {
      const needle = airline.trim().toLowerCase();
      grouped = grouped.filter(g => g.airline.toLowerCase().includes(needle));
    }
    grouped.sort((a,b) => (b.avg_delay ?? -1) - (a.avg_delay ?? -1));
    return grouped;
  }, [records, month, airline]);

  if (loading) return <div className="placeholder-glow"><div className="placeholder col-6 mb-2"></div><div className="placeholder col-8"></div></div>;
  if (error) return <div className="alert alert-warning">{error}</div>;

  const noAirlineRowsThisMonth = dataset.length === 0 && monthsAsc.length > 0;

  return (
    <div>
      {/* Controls */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-md-3">
          <label className="form-label">Scope:</label>
          <select className="form-select" value={scope} onChange={e => setScope(e.target.value)}>
            <option value="SYD">SYD (Departures)</option>
            <option value="ALL">All Ports</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label">Month:</label>
          <select className="form-select" value={month} onChange={e => setMonth(e.target.value)}>
            {monthsAsc.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-5">
          <label className="form-label">Airline filter:</label>
          <input className="form-control" placeholder="e.g. Qantas" value={airline} onChange={e => setAirline(e.target.value)} />
        </div>
      </div>

      {/* Output */}
      {dataset.length === 0 ? (
        <div className="alert alert-light border">
          {noAirlineRowsThisMonth
            ? 'No per-airline breakdown published for this month yet.'
            : 'No records for the selected filters.'}
        </div>
      ) : (
        <ul className="list-group">
          {dataset.slice(0, 30).map((g, i) => (
            <li key={`${g.airline}-${i}`} className="list-group-item d-flex justify-content-between">
              <span>{g.airline}</span>
              <span className="text-muted">{Number.isFinite(g.avg_delay) ? `${g.avg_delay.toFixed(1)} mins` : '—'}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="form-text mt-2">
        Source: BITRE (Data.gov.au). Averages derived from on-time vs operated counts when explicit delay is unavailable.
      </p>
    </div>
  );
}
