import { C } from '../ui/Shared';

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "runs", label: "Run History" },
  { id: "payments", label: "Payments" },
  { id: "agent", label: "Agent Profile" },
  { id: "services", label: "AI Services" },
  { id: "sentinel", label: "Sentinel" },
];

export default function Topbar({ page, runsLength, search, setSearch, running, runLoop, cd, runs, isMobile, mobileMenuOpen, setMobileMenuOpen, onStartTour }) {
  const fmtCd = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{
      padding: isMobile ? "13px 14px" : "13px 22px", background: C.side,
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isMobile && (
          <button onClick={() => setMobileMenuOpen(true)} style={{
            background: "none", border: "none", color: C.orange, fontSize: 18, cursor: "pointer"
          }}>☰</button>
        )}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            {NAV.find(n => n.id === page)?.label}
          </div>
          <div style={{ fontSize: 9, color: C.dim, marginTop: 2 }}>
            Loop #{runsLength} · {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        {!isMobile && (
          <div
            data-tour="topbar-search"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#161616", border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "7px 12px", width: 260,
            }}>
            <span style={{ color: C.dim, fontSize: 12 }}>⌕</span>
            <input
              style={{
                background: "none", border: "none", outline: "none",
                color: C.text, fontSize: 10, fontFamily: "inherit", flex: 1,
              }}
              placeholder="Search runs, tx, insights..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <span style={{ color: C.dim, cursor: "pointer", fontSize: 9 }} onClick={() => setSearch("")}>✕</span>}
          </div>
        )}

        {/* Status pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 11px", borderRadius: 20,
          background: running ? "rgba(249,115,22,0.1)" : "rgba(74,222,128,0.07)",
          border: `1px solid ${running ? "rgba(249,115,22,0.3)" : "rgba(74,222,128,0.2)"}`,
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
          color: running ? C.orange : C.green,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: running ? C.orange : C.green,
            boxShadow: `0 0 6px ${running ? C.orange : C.green}`,
            animation: running ? "blink 1s infinite" : "none",
          }} />
          {running ? "EXECUTING" : "STANDBY"}
        </div>

        {(!isMobile && cd !== null) && (
          <div style={{ fontSize: 9, color: C.dim }}>
            Next <span style={{ color: C.orange, fontWeight: 700 }}>{fmtCd(cd)}</span>
          </div>
        )}

        {!isMobile && (
          <button onClick={() => {
            if (!runs) return;
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(runs, null, 2));
            const a = document.createElement('a');
            a.setAttribute("href", dataStr);
            a.setAttribute("download", "agent_runs.json");
            document.body.appendChild(a);
            a.click();
            a.remove();
          }} style={{
            padding: "7px 12px", borderRadius: 7, background: "#1a1a1a",
            border: `1px solid ${C.border}`, color: C.muted,
            fontSize: 9, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", letterSpacing: "0.06em",
          }}>↑ EXPORT</button>
        )}

        {/* ? — replay tour */}
        {onStartTour && (
          <button
            onClick={onStartTour}
            title="Replay onboarding tour"
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#1a1a1a", border: `1px solid ${C.border}`,
              color: C.dim, fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.dim; }}
          >?</button>
        )}

        {/* Run Now */}
        <button
          data-tour="run-now-btn"
          onClick={runLoop}
          disabled={running}
          style={{
            padding: "7px 16px", borderRadius: 7,
            background: running ? "#1a1a1a" : "linear-gradient(135deg,#f97316,#ea580c)",
            border: "none", color: running ? C.dim : "#fff",
            fontSize: 9, fontWeight: 700, cursor: running ? "not-allowed" : "pointer",
            fontFamily: "inherit", letterSpacing: "0.08em",
            display: "flex", alignItems: "center", gap: 6,
            animation: !running ? "pulseRing 2.5s infinite" : "none",
          }}
        >
          {running ? "⏳ RUNNING..." : "▶ NEW RUN"}
        </button>
      </div>
    </div>
  );
}
