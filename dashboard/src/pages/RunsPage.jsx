import { useState } from 'react';
import { C, timeAgo, riskColor, Pill, trunc } from '../components/ui/Shared';
import RunModal from '../components/ui/RunModal';

export default function RunsPage({ runs, filtered, search, isMobile, isTablet, isNarrow }) {
  const [selectedRun, setSelectedRun] = useState(null);

  return (
    <>
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
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? 300 : 600 }}>
        <thead>
          <tr>
            {[
              { h: "#", show: true }, 
              { h: "Time", show: true }, 
              { h: "Insight", show: true }, 
              { h: "Risk", show: !isNarrow }, 
              { h: "Duration", show: !isTablet }, 
              { h: "Lamports", show: !isTablet }, 
              { h: "Settlement TX", show: !isMobile }, 
              { h: "Sentinel TX", show: !isMobile }, 
              { h: "Status", show: true, align: "right" }
            ].map(col => (
              col.show && (
                <th key={col.h} style={{
                  fontSize: 9, color: C.dim, letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "7px 10px",
                  borderBottom: `1px solid ${C.border2}`, textAlign: col.align || "left", fontWeight: 600,
                }}>{col.h}</th>
              )
            ))}
          </tr>
        </thead>
        <tbody>
          {[...filtered].reverse().slice(0, 500).map((r, i) => (
            <tr key={r.uid || `run-${i}`} onClick={() => setSelectedRun(r)} style={{ cursor: "pointer", opacity: 0.9 }}>
              <td style={{ padding: "10px", fontSize: 11, color: C.orange, fontWeight: 700, borderBottom: `1px solid ${C.border2}` }}>#{r.id}</td>
              <td style={{ padding: "10px", fontSize: 9, color: C.dim, borderBottom: `1px solid ${C.border2}` }}>{timeAgo(r.timestamp)}</td>
              <td style={{ padding: "10px", fontSize: 9, color: C.muted, borderBottom: `1px solid ${C.border2}`, maxWidth: isNarrow ? 120 : 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.insight}</td>
              {!isNarrow && (
                <td style={{ padding: "10px", borderBottom: `1px solid ${C.border2}` }}>
                  <Pill col={riskColor(r.riskScore)}>{r.riskScore}</Pill>
                </td>
              )}
              {!isTablet && <td style={{ padding: "10px", fontSize: 9, color: C.dim, borderBottom: `1px solid ${C.border2}` }}>{r.durationMs}ms</td>}
              {!isTablet && <td style={{ padding: "10px", fontSize: 10, color: C.muted, borderBottom: `1px solid ${C.border2}` }}>{r.amountLamports?.toLocaleString() ?? 0}</td>}
              {!isMobile && <td style={{ padding: "10px", fontSize: 9, color: C.orange, fontFamily: "monospace", borderBottom: `1px solid ${C.border2}` }}>{trunc(r.settlementTx, 9)}</td>}
              {!isMobile && <td style={{ padding: "10px", fontSize: 9, color: C.orange2, fontFamily: "monospace", borderBottom: `1px solid ${C.border2}` }}>{trunc(r.sentinelTx, 9)}</td>}
              <td style={{ padding: "12px 10px", borderBottom: `1px solid ${C.border2}`, textAlign: "right" }}>
                <Pill col={r.hasError ? C.red : C.green}>{r.hasError ? "✗" : "✓"}</Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    <RunModal run={selectedRun} onClose={() => setSelectedRun(null)} />
    </>
  );
}
