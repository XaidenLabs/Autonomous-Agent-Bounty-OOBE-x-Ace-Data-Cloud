import { useState } from 'react';
import { C, timeAgo, riskColor, riskLabel, Pill, Row, SecTitle, trunc } from '../components/ui/Shared';
import Sparkline from '../components/ui/Sparkline';
import Ring from '../components/ui/Ring';
import Bars from '../components/ui/Bars';

export default function OverviewPage({ runs, filtered, search, setPage, status }) {
  const [timeframe, setTimeframe] = useState("ALL");
  const tfOptions = [
    { label: "15M", ms: 15 * 60 * 1000 },
    { label: "1H", ms: 60 * 60 * 1000 },
    { label: "24H", ms: 24 * 60 * 60 * 1000 },
    { label: "1M", ms: 30 * 24 * 60 * 60 * 1000 },
    { label: "1Y", ms: 365 * 24 * 60 * 60 * 1000 },
    { label: "ALL", ms: Infinity },
  ];

  const now = Date.now();
  const currentTfMs = tfOptions.find(o => o.label === timeframe)?.ms || Infinity;
  const tfRuns = runs.filter(r => (now - r.timestamp) <= currentTfMs);
  const tfFiltered = (filtered || runs).filter(r => (now - r.timestamp) <= currentTfMs);

  const latest = tfFiltered[tfFiltered.length - 1];
  const avgRisk = Math.round(tfFiltered.reduce((a, r) => a + r.riskScore, 0) / (tfFiltered.length || 1)) || 0;
  const totalLam = tfFiltered.reduce((a, r) => a + r.amountLamports, 0);
  const bal = status?.escrowBalance ?? 0;

  const handleAction = (label) => {
    if (label === "Run Now") {
      fetch("http://localhost:3001/api/run-now", { method: "POST" });
    } else if (label === "Export") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(runs, null, 2));
      const a = document.createElement('a');
      a.setAttribute("href", dataStr);
      a.setAttribute("download", "agent_runs.json");
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (label === "Explorer") {
      if (status?.agentWallet) window.open(`https://explorer.solana.com/address/${status.agentWallet}`, "_blank");
    } else if (label === "Solscan") {
      if (status?.agentWallet) window.open(`https://solscan.io/account/${status.agentWallet}`, "_blank");
    }
  };

  return (
    <>
      {/* Metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          {
            label: "Total Loops", val: tfFiltered.length, sub: "+1 every 10 min",
            spark: tfFiltered.map((_, i) => i + 1), col: C.orange
          },
          {
            label: "Avg Risk Score", val: avgRisk, sub: riskLabel(avgRisk) + " risk",
            spark: tfFiltered.map(r => r.riskScore), col: riskColor(avgRisk)
          },
          {
            label: "Total Lamports", val: totalLam.toLocaleString(),
            sub: `≈ $${(totalLam * 0.00000002).toFixed(4)}`,
            spark: tfFiltered.map(r => r.amountLamports), col: C.orange
          },
          {
            label: "Escrow Balance", val: bal.toLocaleString(),
            sub: `${Math.floor(bal / 5000)} calls left`,
            spark: runs.map(() => Math.floor(Math.random() * 5 + 3)), col: C.green
          },
        ].map(m => (
          <div key={m.label} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "15px 17px",
          }}>
            <div style={{
              fontSize: 9, color: C.dim, letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 8
            }}>{m.label}</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: m.col, lineHeight: 1 }}>
              {m.val}
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-end", marginTop: 10,
            }}>
              <span style={{ fontSize: 9, color: m.col + "99" }}>{m.sub}</span>
              <Sparkline data={m.spark} color={m.col} h={26} />
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 16 }}>
        <div>
          {/* Chart card */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "16px 18px", marginBottom: 16,
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: 16,
            }}>
              <div>
                <div style={{
                  fontSize: 9, color: C.dim, letterSpacing: "0.14em",
                  textTransform: "uppercase", marginBottom: 6
                }}>Risk Score Flow</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1 }}>
                  {latest?.riskScore ?? 0}
                  <span style={{ fontSize: 12, color: C.dim, marginLeft: 4 }}>/100</span>
                </div>
                <div style={{ fontSize: 9, color: riskColor(latest?.riskScore ?? 0), marginTop: 5 }}>
                  Latest loop — {riskLabel(latest?.riskScore ?? 0)} RISK
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {tfOptions.map((t) => (
                  <button key={t.label} onClick={() => setTimeframe(t.label)} style={{
                    padding: "5px 9px", borderRadius: 6, border: "none",
                    fontFamily: "inherit", fontSize: 9, fontWeight: 600,
                    cursor: "pointer", letterSpacing: "0.06em",
                    background: timeframe === t.label ? "linear-gradient(135deg,#f97316,#ea580c)" : "#1a1a1a",
                    color: timeframe === t.label ? "#fff" : C.dim,
                  }}>{t.label}</button>
                ))}
              </div>
            </div>
            <Bars runs={tfRuns} highlightedRuns={tfFiltered} isSearching={!!search} />
            <div style={{
              display: "flex", gap: 18, marginTop: 12,
              borderTop: `1px solid ${C.border2}`, paddingTop: 12,
            }}>
              {[
                { l: "Low (<30)", c: C.green, n: tfFiltered.filter(r => !r.hasError && r.riskScore < 30).length },
                { l: "Medium", c: C.orange, n: tfFiltered.filter(r => !r.hasError && r.riskScore >= 30 && r.riskScore < 60).length },
                { l: "High (>60)", c: C.red, n: tfFiltered.filter(r => !r.hasError && r.riskScore >= 60).length },
                { l: "Failed", c: C.dim, n: tfFiltered.filter(r => r.hasError).length },
              ].map(b => (
                <div key={b.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: b.c, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, color: C.dim }}>{b.l}</span>
                  <span style={{ fontSize: 10, color: b.c, fontWeight: 700 }}>{b.n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Run table */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "16px 18px",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 12,
            }}>
              <SecTitle>Recent Runs</SecTitle>
              <button onClick={() => setPage("runs")} style={{
                background: "none", border: `1px solid ${C.border}`,
                color: C.dim, fontSize: 9, padding: "4px 10px",
                borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "0.06em",
              }}>View All →</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Loop", "Insight", "Risk", "Lamports", "Status"].map(h => (
                    <th key={h} style={{
                      fontSize: 9, color: C.dim, letterSpacing: "0.12em",
                      textTransform: "uppercase", padding: "7px 10px",
                      borderBottom: `1px solid ${C.border2}`,
                      textAlign: "left", fontWeight: 600,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...tfFiltered].slice(-5).reverse().map(r => (
                  <tr key={r.id} style={{ animation: "fadein 0.3s ease" }}>
                    <td style={{
                      padding: "10px", fontSize: 11, color: C.orange, fontWeight: 700,
                      borderBottom: `1px solid ${C.border2}`
                    }}>#{r.id}</td>
                    <td style={{
                      padding: "10px", fontSize: 10, color: C.muted,
                      borderBottom: `1px solid ${C.border2}`, maxWidth: 160,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      {r.insight}</td>
                    <td style={{ padding: "10px", borderBottom: `1px solid ${C.border2}` }}>
                      <Pill col={riskColor(r.riskScore)}>{r.riskScore} {riskLabel(r.riskScore)}</Pill></td>
                    <td style={{
                      padding: "10px", fontSize: 10, color: C.muted,
                      borderBottom: `1px solid ${C.border2}`
                    }}>
                      {r.amountLamports?.toLocaleString() ?? 0}</td>
                    <td style={{ padding: "10px", borderBottom: `1px solid ${C.border2}` }}>
                      <Pill col={r.hasError ? C.red : C.green}>{r.hasError ? "✗ Failed" : "✓ Done"}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Latest risk card */}
          {latest && (
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "15px 17px",
            }}>
              <div style={{
                fontSize: 9, color: C.dim, letterSpacing: "0.14em",
                textTransform: "uppercase", marginBottom: 12
              }}>◎ Latest Risk</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <Ring value={latest.riskScore} />
                <div>
                  <div style={{ marginBottom: 6 }}>
                    <Pill col={riskColor(latest.riskScore)}>{riskLabel(latest.riskScore)} RISK</Pill>
                  </div>
                  <div style={{ fontSize: 10, color: C.dim, lineHeight: 1.6 }}>
                    {latest.insight}
                  </div>
                  <div style={{ fontSize: 9, color: C.dimmer, marginTop: 5 }}>
                    {timeAgo(latest.timestamp)}
                  </div>
                </div>
              </div>
              {[
                { l: "Sentinel TX", v: trunc(latest.sentinelTx), c: C.orange },
                { l: "Settlement TX", v: trunc(latest.settlementTx), c: C.orange2 },
                { l: "Session PDA", v: trunc(latest.sessionPda), c: C.muted },
                { l: "Duration", v: `${latest.durationMs}ms`, c: C.muted },
              ].map(({ l, v, c }) => <Row key={l} label={l} val={v} valCol={c} />)}
            </div>
          )}

          {/* AI services card */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "15px 17px",
          }}>
            <div style={{
              fontSize: 9, color: C.dim, letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 12
            }}>✦ Ace Data Services</div>
            {[
              { name: "LLM Analysis", icon: "✦", calls: filtered.length, col: C.orange },
              { name: "Image Gen", icon: "◈", calls: filtered.length, col: C.orange2 },
              { name: "Audio Gen", icon: "♪", calls: filtered.length, col: C.orange3 },
            ].map(s => (
              <div key={s.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 0", borderBottom: `1px solid ${C.border2}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 29, height: 29, borderRadius: 7,
                    background: `${s.col}14`, border: `1px solid ${s.col}28`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12,
                  }}>{s.icon}</div>
                  <span style={{ fontSize: 10, color: C.muted }}>{s.name}</span>
                </div>
                <Pill col={s.col}>{s.calls} calls</Pill>
              </div>
            ))}
          </div>

          {/* Quick actions (like the reference UI) */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "15px 17px",
          }}>
            <div style={{
              fontSize: 9, color: C.dim, letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 12
            }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Run Now", icon: "▶", primary: true },
                { label: "Export", icon: "↑", primary: false },
                { label: "Explorer", icon: "◎", primary: false },
                { label: "Solscan", icon: "⬡", primary: false },
              ].map(a => (
                <button key={a.label} onClick={() => handleAction(a.label)} style={{
                  padding: "9px 8px", borderRadius: 8,
                  background: a.primary ? "linear-gradient(135deg,#f97316,#ea580c)" : "#1a1a1a",
                  border: `1px solid ${a.primary ? "transparent" : C.border}`,
                  color: a.primary ? "#fff" : C.dim,
                  fontSize: 9, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", letterSpacing: "0.08em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}>
                  <span>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Network */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: "15px 17px",
          }}>
            <div style={{
              fontSize: 9, color: C.dim, letterSpacing: "0.14em",
              textTransform: "uppercase", marginBottom: 12
            }}>◎ SAP Network</div>
            {[
              { l: "Total agents", v: latest?.networkAgents ?? 0 },
              { l: "Sentinel", v: "✅ Active" },
              { l: "Protocols", v: "A2A · MCP · x402" },
              { l: "Plan", v: "Free · Unlimited" },
            ].map(({ l, v }) => <Row key={l} label={l} val={v} />)}
          </div>
        </div>
      </div>
    </>
  );
}
