import { C } from '../ui/Shared';

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "runs", label: "Run History", icon: "◎" },
  { id: "payments", label: "Payments", icon: "⬡" },
  { id: "agent", label: "Agent Profile", icon: "◇" },
  { id: "services", label: "AI Services", icon: "✦" },
  { id: "sentinel", label: "Sentinel", icon: "⬟" },
];

export default function Sidebar({ page, setPage, slim, setSlim, isMobile, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <>
      {isMobile && mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", zIndex: 99,
          }}
        />
      )}
      <div style={{
        width: isMobile ? 250 : (slim ? 58 : 210), 
        transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)", 
        flexShrink: 0,
        background: C.side, 
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", overflow: "hidden",
        position: isMobile ? "absolute" : "relative",
        height: "100%",
        zIndex: 100,
        transform: isMobile ? (mobileMenuOpen ? "translateX(0)" : "translateX(-100%)") : "none",
      }}>
        {/* Logo */}
        <div style={{
          padding: "18px 14px 14px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg,#f97316,#ea580c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.02em",
          }}>Si</div>
          {!slim && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: "0.06em" }}>
                SolanaIntel
              </div>
              <div style={{ fontSize: 9, color: C.dimmer, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Agent v1.0
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        {!isMobile && (
          <button onClick={() => setSlim(!slim)} style={{
            background: "none", border: "none", color: C.dim, cursor: "pointer",
            padding: "9px 14px", fontSize: 11, textAlign: "left",
            display: "flex", alignItems: "center", gap: 8,
            borderBottom: `1px solid ${C.border}`,
          }}>
            <span>{slim ? "▷" : "◁"}</span>
            {!slim && <span style={{ fontSize: 9, letterSpacing: "0.08em" }}>COLLAPSE</span>}
          </button>
        )}

        {isMobile && (
          <button onClick={() => setMobileMenuOpen(false)} style={{
            background: "none", border: "none", color: C.dim, cursor: "pointer",
            padding: "12px 14px", fontSize: 13, textAlign: "right",
            borderBottom: `1px solid ${C.border}`,
          }}>
            ✕ Close Menu
          </button>
        )}

        {/* Nav */}
        <div data-tour="sidebar-nav" style={{ flex: 1, padding: "8px 0" }}>
          {!slim && <div style={{
            fontSize: 9, color: C.dimmer, letterSpacing: "0.14em",
            padding: "6px 14px 4px", textTransform: "uppercase",
          }}>MAIN</div>}
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <div key={n.id} onClick={() => setPage(n.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: slim ? "11px 0" : "9px 14px",
                justifyContent: slim ? "center" : "flex-start",
                cursor: "pointer",
                background: active ? "rgba(249,115,22,0.09)" : "transparent",
                borderLeft: active ? `2px solid ${C.orange}` : "2px solid transparent",
                margin: "1px 0",
              }}>
                <span style={{ fontSize: 13, color: active ? C.orange : C.dim, flexShrink: 0 }}>{n.icon}</span>
                {(!slim || isMobile) && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
                    color: active ? C.orange : "#666", whiteSpace: "nowrap",
                  }}>{n.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom */}
        <div style={{ padding: "14px", borderTop: `1px solid ${C.border}` }}>
          {(!slim || isMobile) ? (
            <div style={{
              background: "rgba(249,115,22,0.07)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: 10, padding: "12px",
            }}>
              <div style={{ fontSize: 9, color: C.orange, fontWeight: 700, marginBottom: 4 }}>
                ⬡ MAINNET ACTIVE
              </div>
              <div style={{ fontSize: 9, color: C.dim, lineHeight: 1.5 }}>
                Free tier · Unlimited quota
              </div>
              <div style={{
                marginTop: 10, padding: "6px 10px", borderRadius: 6,
                background: "linear-gradient(135deg,#f97316,#ea580c)",
                fontSize: 9, fontWeight: 700, color: "#fff", textAlign: "center",
                cursor: "pointer", letterSpacing: "0.06em",
              }}>↑ UPGRADE RPC</div>
            </div>
          ) : (
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: C.green,
              margin: "0 auto", boxShadow: `0 0 6px ${C.green}`,
            }} />
          )}
        </div>
      </div>
    </>
  );
}
