import { C, timeAgo, Pill, Row, SecTitle, trunc } from '../components/ui/Shared';

export default function AgentPage({ runs, status }) {
  const latest = runs[runs.length - 1];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
        <SecTitle>On-Chain Identity</SecTitle>
        {[
          { l: "Name", v: "SolanaIntelAgent" }, { l: "Status", v: "✅ Active" },
          { l: "SAP Program", v: trunc(status?.programId, 10) },
          { l: "Protocols", v: "A2A · MCP · x402" },
          { l: "Capabilities", v: "3 registered" },
          { l: "SDK Version", v: "v0.9.3" },
        ].map(({ l, v }) => <Row key={l} label={l} val={v} />)}
        <div style={{ marginTop: 14 }}>
          <SecTitle>Capabilities</SecTitle>
          {[
            { id: "solana:analyze", proto: "solana", col: C.orange, desc: "Analyze on-chain events, produce structured reports" },
            { id: "ace:inference", proto: "A2A", col: C.orange2, desc: "Multi-modal AI: LLM, image, audio generation" },
            { id: "payment:x402", proto: "x402", col: C.green, desc: "Autonomous micropayment settlement via escrow" },
          ].map(cap => (
            <div key={cap.id} style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              padding: "10px 0", borderBottom: `1px solid ${C.border2}`,
            }}>
              <Pill col={cap.col}>{cap.proto}</Pill>
              <div>
                <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginBottom: 3 }}>{cap.id}</div>
                <div style={{ fontSize: 9, color: C.dim }}>{cap.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
        <SecTitle>⬟ Synapse Sentinel</SecTitle>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px", background: "rgba(249,115,22,0.06)",
          borderRadius: 8, border: "1px solid rgba(249,115,22,0.18)", marginBottom: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", border: "2px solid #f97316",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, animation: "pulseRing 3s infinite", flexShrink: 0,
          }}>⬟</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Synapse Sentinel</div>
            <div style={{ fontSize: 9, color: C.orange, marginTop: 2 }}>6 capabilities · Active</div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: "monospace", marginTop: 2 }}>{trunc(status?.sentinelPubkey, 14)}</div>
          </div>
        </div>
        {[
          { l: "Wallet", v: trunc(status?.sentinelPubkey, 10) }, { l: "x402 enabled", v: "✅ Yes" },
          { l: "Escrow opened", v: "✅ Yes" }, { l: "Calls paid", v: runs.length },
          { l: "Total paid", v: `${(runs.length * 1000).toLocaleString()} lam` },
          { l: "Last call", v: latest ? timeAgo(latest.timestamp) : "—" },
        ].map(({ l, v }) => <Row key={l} label={l} val={v} />)}
      </div>
    </div>
  );
}
