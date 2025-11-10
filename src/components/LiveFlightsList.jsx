import { useEffect, useState } from "react";
import { fetchLiveFlightsStates } from "../services/opensky";

export default function LiveFlightsList() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("Loading…");
  const [limit, setLimit] = useState(30);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchLiveFlightsStates(limit);
        if (!alive) return;
        setRows(data);
        setStatus("OK");
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setStatus("Error loading flights");
      }
    })();
    return () => { alive = false; };
  }, [limit]);

  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#0f172a", color: "#e5e7eb" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Flights near SYD</h3>
        <label style={{ marginLeft: "auto", fontSize: 14, color: "#94a3b8" }}>
          Show:&nbsp;
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {[10, 20, 30, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {status !== "OK" ? (
        <div style={{ color: "#94a3b8" }}>{status}</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", fontSize: 12, color: "#94a3b8" }}>
                <th style={{ padding: "6px 8px" }}>Callsign</th>
                <th style={{ padding: "6px 8px" }}>Country</th>
                <th style={{ padding: "6px 8px" }}>Dist (NM)</th>
                <th style={{ padding: "6px 8px" }}>Alt (ft)</th>
                <th style={{ padding: "6px 8px" }}>Speed (kt)</th>
                <th style={{ padding: "6px 8px" }}>Heading</th>
                <th style={{ padding: "6px 8px" }}>On ground</th>
                <th style={{ padding: "6px 8px" }}>Age (s)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.icao24}-${r.callsign}-${r.dist_nm}`} style={{ borderTop: "1px solid #1f2937" }}>
                  <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>{r.callsign}</td>
                  <td style={{ padding: "6px 8px" }}>{r.origin_country}</td>
                  <td style={{ padding: "6px 8px" }}>{r.dist_nm ?? "—"}</td>
                  <td style={{ padding: "6px 8px" }}>{r.alt_ft ?? "—"}</td>
                  <td style={{ padding: "6px 8px" }}>{r.speed_kts ?? "—"}</td>
                  <td style={{ padding: "6px 8px" }}>{r.heading ?? "—"}</td>
                  <td style={{ padding: "6px 8px" }}>{r.on_ground ? "Yes" : "No"}</td>
                  <td style={{ padding: "6px 8px" }}>{r.age_s ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
        Data: OpenSky states/all. Callsigns are airline+number when available (e.g., QFAxxx, VOZxxx, JSTxxx).
        Distances are to YSSY (approx). Values update on refresh.
      </p>
    </div>
  );
}
