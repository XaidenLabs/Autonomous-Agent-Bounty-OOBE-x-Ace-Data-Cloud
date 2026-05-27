import { C, riskColor, riskLabel, Pill, Row, trunc } from './Shared';

export default function RunModal({ run, onClose }) {
  if (!run) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadein 0.2s ease",
    }}>
      <div style={{
        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
        width: "100%", maxWidth: 500, overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${C.border2}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: C.card,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.orange }}>
            Loop #{run.id || run.loopId}
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: C.dim, fontSize: 16, cursor: "pointer",
          }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", maxHeight: "70vh", overflowY: "auto" }}>
          
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
              Insight
            </div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>
              {run.insight}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ background: C.card, padding: 12, borderRadius: 10, border: `1px solid ${C.border2}` }}>
              <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Risk Score</div>
              <Pill col={riskColor(run.riskScore)}>{run.riskScore} {riskLabel(run.riskScore)}</Pill>
            </div>
            <div style={{ background: C.card, padding: 12, borderRadius: 10, border: `1px solid ${C.border2}` }}>
              <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Status</div>
              <Pill col={run.hasError ? C.red : C.green}>{run.hasError ? "✗ Failed" : "✓ Settled"}</Pill>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
              Execution Details
            </div>
            {[
              { l: "Time", v: new Date(run.timestamp).toLocaleString(), c: C.muted },
              { l: "Duration", v: `${run.durationMs}ms`, c: C.muted },
              { l: "Lamports Paid", v: run.amountLamports?.toLocaleString() ?? 0, c: C.green },
            ].map(({ l, v, c }) => <Row key={l} label={l} val={v} valCol={c} />)}
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
              On-Chain Identifiers
            </div>
            {[
              { l: "Settlement TX", v: run.settlementTx || "—", c: C.orange },
              { l: "Sentinel TX", v: run.sentinelTx || "—", c: C.orange2 },
              { l: "Session PDA", v: run.sessionPda || "—", c: C.dim },
            ].map(({ l, v, c }) => (
              <div key={l} style={{
                padding: "10px 0", borderBottom: `1px solid ${C.border2}`,
              }}>
                <div style={{ fontSize: 9, color: C.dim, marginBottom: 4 }}>{l}</div>
                <div style={{ fontSize: 10, color: c, fontFamily: "monospace", wordBreak: "break-all" }}>
                  {v}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
