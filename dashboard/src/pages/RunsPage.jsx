import { C, timeAgo, riskColor, Pill, trunc } from '../components/ui/Shared';

export default function RunsPage({ runs, filtered, search, isMobile }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
          All Runs — {filtered.length} records{search && ` · "${search}"`}
        </div>
        <button style={{
          background: "none", border: `1px solid ${C.border}`, color: C.dim,
          fontSize: 9, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
          fontFamily: "inherit", letterSpacing: "0.06em",
        }}>↑ Export CSV</button>
      </div>
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
        <thead>
          <tr>
            {["#", "Time", "Insight", "Risk", "Duration", "Lamports", "Settlement TX", "Sentinel TX", "Status"].map(h => (
              <th key={h} style={{
                fontSize: 9, color: C.dim, letterSpacing: "0.1em",
                textTransform: "uppercase", padding: "7px 10px",
                borderBottom: `1px solid ${C.border2}`, textAlign: "left", fontWeight: 600,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...filtered].reverse().map((r, i) => (
            <tr key={r.id || i}>
              <td style={{ padding: "10px", fontSize: 11, color: C.orange, fontWeight: 700, borderBottom: `1px solid ${C.border2}` }}>#{r.id}</td>
              <td style={{ padding: "10px", fontSize: 9, color: C.dim, borderBottom: `1px solid ${C.border2}` }}>{timeAgo(r.timestamp)}</td>
              <td style={{ padding: "10px", fontSize: 9, color: C.muted, borderBottom: `1px solid ${C.border2}`, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.insight}</td>
              <td style={{ padding: "10px", borderBottom: `1px solid ${C.border2}` }}>
                <Pill col={riskColor(r.riskScore)}>{r.riskScore}</Pill>
              </td>
              <td style={{ padding: "10px", fontSize: 9, color: C.dim, borderBottom: `1px solid ${C.border2}` }}>{r.durationMs}ms</td>
              <td style={{ padding: "10px", fontSize: 10, color: C.muted, borderBottom: `1px solid ${C.border2}` }}>{r.amountLamports?.toLocaleString() ?? 0}</td>
              <td style={{ padding: "10px", fontSize: 9, color: C.orange, fontFamily: "monospace", borderBottom: `1px solid ${C.border2}` }}>{trunc(r.settlementTx, 9)}</td>
              <td style={{ padding: "10px", fontSize: 9, color: C.orange2, fontFamily: "monospace", borderBottom: `1px solid ${C.border2}` }}>{trunc(r.sentinelTx, 9)}</td>
              <td style={{ padding: "12px", borderBottom: `1px solid ${C.border2}` }}>
                <Pill col={r.hasError ? C.red : C.green}>{r.hasError ? "✗ Failed" : "✓ Done"}</Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
