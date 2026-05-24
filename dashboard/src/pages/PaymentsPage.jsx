import { C, timeAgo, Pill, Row, SecTitle, trunc } from '../components/ui/Shared';

export default function PaymentsPage({ runs, status }) {
  const bal = status?.escrowBalance ?? 0;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { l: "Escrow Balance", v: bal.toLocaleString(), s: "lamports", c: C.green },
          { l: "Price Per Call", v: "5,000", s: "lamports/loop", c: C.orange },
          { l: "Total Settled", v: runs.length, s: "on-chain txs", c: C.orange },
          { l: "Calls Left", v: Math.floor(bal / 5000), s: "affordable calls", c: C.orange3 },
        ].map(m => (
          <div key={m.l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "15px 17px" }}>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{m.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: m.c, lineHeight: 1 }}>{m.v}</div>
            <div style={{ fontSize: 9, color: m.c + "88", marginTop: 5 }}>{m.s}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
          <SecTitle>Escrow Configuration</SecTitle>
          {[
            { l: "Security mode", v: "SelfReport (V2)" },
            { l: "Max calls", v: "Unlimited" },
            { l: "Expires", v: "Never" },
            { l: "Token", v: "Native SOL" },
            { l: "Volume curve", v: "3 tiers active" },
          ].map(({ l, v }) => <Row key={l} label={l} val={v} />)}
          <div style={{ marginTop: 14 }}>
            <SecTitle>Volume Discounts</SecTitle>
            {[
              { r: "0–50 calls", p: "5,000 lam", pct: "base" },
              { r: "50–200 calls", p: "4,000 lam", pct: "−20%" },
              { r: "200+ calls", p: "3,000 lam", pct: "−40%" },
            ].map(({ r, p, pct }) => (
              <div key={r} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border2}`, fontSize: 10
              }}>
                <span style={{ fontSize: 9, color: C.dim, letterSpacing: "0.04em" }}>{r}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 9, color: C.green }}>{p}</span>
                  <Pill col={C.green}>{pct}</Pill>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
          <SecTitle>Recent Settlements</SecTitle>
          {[...runs].reverse().slice(0, 7).map(r => (
            <div key={r.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: `1px solid ${C.border2}`,
            }}>
              <div>
                <div style={{ fontSize: 10, color: C.orange, fontFamily: "monospace", marginBottom: 2 }}>
                  {trunc(r.settlementTx, 10)}
                </div>
                <div style={{ fontSize: 9, color: C.dim }}>Loop #{r.id} · {timeAgo(r.timestamp)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>
                  {r.amountLamports?.toLocaleString() ?? 0} L
                </div>
                <Pill col={C.green}>✓ settled</Pill>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
