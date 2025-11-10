import { useEffect, useState } from "react";
import { fetchLiveFlightsCount } from "../services/opensky";

export default function LiveFlightsStat() {
  const [status, setStatus] = useState("Loading…");
  const [count, setCount] = useState(null);
  const [source, setSource] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { count, source } = await fetchLiveFlightsCount();
        if (!mounted) return;
        setCount(count);
        setSource(source);
        setStatus("OK");
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setStatus("Error");
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{
      padding: "16px",
      borderRadius: 12,
      background: "#0f172a",
      color: "#e5e7eb",
      display: "flex",
      alignItems: "center",
      gap: 12
    }}>
      <div style={{ fontSize: 14, color: "#94a3b8" }}>Live flights near SYD</div>
      <div style={{ fontSize: 28, fontWeight: 600 }}>
        {status === "OK" ? count : "—"}
      </div>
      <div style={{ marginLeft: "auto", fontSize: 12, color: "#64748b" }}>
        {status === "OK" ? source : status}
      </div>
    </div>
  );
}
