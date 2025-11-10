import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend,
} from "chart.js";
import { loadBitreOtp } from "../services/bitre";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

export default function DelayChart() {
  const [status, setStatus] = useState("Loading…");
  const [months, setMonths] = useState([]);
  const [monthData, setMonthData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { months, monthData } = await loadBitreOtp();
        if (!alive) return;
        setMonths(months);
        setMonthData(monthData);
        setSelectedMonth(months[months.length - 1]); // latest month
        setStatus("OK");
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setStatus("Error loading BITRE data");
      }
    })();
    return () => { alive = false; };
  }, []);

  const items = useMemo(() => {
    const arr = monthData[selectedMonth] || [];
    const f = filter.trim().toLowerCase();
    return f ? arr.filter(i => i.airline.toLowerCase().includes(f)) : arr;
  }, [monthData, selectedMonth, filter]);

  if (status !== "OK") return <div style={{ padding: 8, color: "#64748b" }}>{status}</div>;

  const labels = items.map(i => i.airline);
  const mins = items.map(i => i.avg_delay_min);
  const flights = items.map(i => i.flights);
  const pct = items.map(i => i.pct_delayed);

  const chartData = {
    labels,
    datasets: [{
      label: `Avg delay (mins) — ${selectedMonth}`,
      data: mins,
      backgroundColor: "rgba(255,255,255,0.4)",
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const i = ctx.dataIndex;
            return [
              `Avg delay: ${mins[i]} min`,
              `Flights: ${flights[i]}`,
              ...(pct[i] != null ? [`% delayed: ${pct[i]}%`] : []),
            ];
          }
        }
      }
    },
    scales: { y: { beginAtZero: true, title: { display: true, text: "Minutes late (avg)" } } }
  };

  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#0b1220", color: "#e5e7eb" }}>
      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr", marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>SYD — Average lateness by airline (monthly)</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 14, color: "#94a3b8" }}>
            Month:&nbsp;
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 14, color: "#94a3b8" }}>
            Airline filter:&nbsp;
            <input
              placeholder="e.g. Qantas"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #334155",
                       background: "#0f172a", color: "#e5e7eb" }}
            />
          </label>
        </div>
      </div>
      <Bar data={chartData} options={options} height={120} />
      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
        Lateness uses BITRE monthly on-time performance for departures from Sydney (SYD).
        Shows average departure delay (mins) when available; else a proxy derived from on-time %.
        Only airlines with ≥3 flights shown.
      </p>
    </div>
  );
}
