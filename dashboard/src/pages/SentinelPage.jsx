import { C, timeAgo, Pill, Row, SecTitle, trunc } from '../components/ui/Shared';

export default function SentinelPage({ runs, status, isMobile }) {
  const latest = runs[runs.length - 1];

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px", background: "rgba(249,115,22,0.05)",
          borderRadius: 10, border: "1px solid rgba(249,115,22,0.18)", marginBottom: 16,
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%", border: "2px solid #f97316",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0, animation: "pulseRing 3s infinite",
          }}>⬟</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Synapse Sentinel</div>
            <div style={{ fontSize: 9, color: C.orange, marginTop: 2 }}>On-chain validation · SAP Mainnet</div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: "monospace", marginTop: 3 }}>{trunc(status?.sentinelPubkey, 16)}</div>
          </div>
        </div>
        <SecTitle>Interaction Stats</SecTitle>
        {[
          { l: "Escrow", v: "✅ Open" }, { l: "Total calls", v: runs.length },
          { l: "Total paid", v: `${(runs.length * 1000).toLocaleString()} lam` },
          { l: "Last call", v: latest ? timeAgo(latest.timestamp) : "—" },
          { l: "x402", v: "✅ Enabled" }, { l: "Reputation", v: "High" },
        ].map(({ l, v }) => <Row key={l} label={l} val={v} />)}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
        <SecTitle>Sentinel Call Log</SecTitle>
        {[...runs].reverse().slice(0, 8).map((r, i) => (
          <div key={r.uid || `sent-${i}`} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: `1px solid ${C.border2}`,
          }}>
            <div>
              <div style={{ fontSize: 9, color: C.orange, fontFamily: "monospace", marginBottom: 2 }}>
                {trunc(r.sentinelTx, 12)}
              </div>
              <div style={{ fontSize: 9, color: C.dim }}>Loop #{r.id} · {timeAgo(r.timestamp)}</div>
            </div>
            <Pill col={C.green}>✓ paid</Pill>
          </div>
        ))}
      </div>
    </div>
  );
}
