import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import OverviewPage from "./pages/OverviewPage";
import RunsPage from "./pages/RunsPage";
import PaymentsPage from "./pages/PaymentsPage";
import AgentPage from "./pages/AgentPage";
import ServicesPage from "./pages/ServicesPage";
import SentinelPage from "./pages/SentinelPage";
import { C, PHASES, trunc } from "./components/ui/Shared";
import OnboardingTour, { useOnboardingTour } from "./components/ui/OnboardingTour";
import SkeletonLoader from "./components/ui/SkeletonLoader";

// In production (Vercel), use relative paths so vercel.json rewrites can proxy to the VPS.
// In dev, connect directly to the VPS IP or localhost.
const API_BASE = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_BASE || `http://${window.location.hostname}:3005`);
const POLL_INTERVAL = 3000;

export default function AgentDashboard() {
  const [page, setPage] = useState("dashboard");
  const [runs, setRuns] = useState([]);
  const [status, setStatus] = useState(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(null);
  const [progress, setProg] = useState(0);
  const [cd, setCd] = useState(null);
  const [search, setSearch] = useState("");
  const [slim, setSlim] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1100);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768);
  const [isNarrow, setIsNarrow] = useState(window.innerWidth <= 480);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cdRef = useRef(null);
  const [triggering, setTriggering] = useState(false);
  const [riskFilter, setRiskFilter] = useState(null);
  const { tourOpen, startTour, closeTour } = useOnboardingTour();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1100;
      setIsMobile(mobile);
      setIsTablet(window.innerWidth <= 768);
      setIsNarrow(window.innerWidth <= 480);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Convert daemon API data to the format the UI components expect
  const mapApiRunToUiRun = (r, idx) => ({
    id: r.loopCount || r.loopId,
    // uid is guaranteed unique — used as React key instead of id
    uid: `${new Date(r.timestamp).getTime()}-${r.loopId || r.loopCount || idx}`,
    loopId: r.loopId,
    timestamp: new Date(r.timestamp).getTime(),
    riskScore: r.aceData?.riskScore ?? (r.partialResults?.riskScore ?? 0),
    insight: Array.isArray(r.aceData?.insights) 
      ? r.aceData.insights[0] 
      : (r.aceData?.insights || (r.error ? `Error: ${r.failedPhase}` : "")),
    settlementTx: r.onChain?.settlementTx || (r.partialResults?.settlementTx || ""),
    sentinelTx: r.onChain?.sentinelTx || (r.partialResults?.sentinelTx || ""),
    sessionPda: r.onChain?.sessionPda || (r.partialResults?.sessionPda || ""),
    amountLamports: parseInt(r.onChain?.amountLamports || (r.partialResults?.settlementTx ? "1000" : "0"), 10),
    durationMs: r.durationMs || 0,
    audioMood: r.aceData?.audioMood || "calm",
    networkAgents: r.discovery?.networkAgents || (r.partialResults?.discovery?.networkAgents || 0),
    hasError: !!r.error,
  });

  const fetchData = useCallback(async () => {
    try {
      const [runsRes, statusRes] = await Promise.all([
        fetch(`${API_BASE}/api/runs`),
        fetch(`${API_BASE}/api/status`),
      ]);
      if (!runsRes.ok || !statusRes.ok) throw new Error('API error');
      
      const rawRuns = await runsRes.json();
      const statusData = await statusRes.json();

      // The API returns newest first. The UI expects oldest first (so newest is at the end).
      const formattedRuns = (Array.isArray(rawRuns) ? rawRuns : [])
        .map(mapApiRunToUiRun)
        .reverse()
        // Stamp uid AFTER reverse so index is stable and always unique
        .map((r, i) => ({ ...r, uid: `run-${i}` }));
      
      setRuns(formattedRuns);
      setStatus(statusData);
      
      const isDaemonRunning = !!statusData.currentPhase;
      setRunning(isDaemonRunning);
      
      if (isDaemonRunning) {
        const phaseIdx = PHASES.findIndex(p => p.key === statusData.currentPhase);
        setPhase(phaseIdx >= 0 ? phaseIdx : 0);
        setProg(Math.round(((Math.max(0, phaseIdx) + 1) / PHASES.length) * 100));
        setCd(null);
      } else {
        setPhase(null);
        setProg(0);
        // We could compute time remaining based on lastRunTimestamp and 10min interval here if desired
      }
      setInitialLoading(false);
    } catch (e) {
      console.warn("Failed to fetch daemon data", e);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Persistent countdown effect
  useEffect(() => {
    if (running || !runs || runs.length === 0) {
      setCd(null);
      return;
    }
    const latestRun = runs[runs.length - 1];
    const lastRunTime = latestRun.timestamp;
    const nextRunTime = lastRunTime + 600000; // 10 minutes

    const updateCd = () => {
      const now = Date.now();
      let diffSecs = Math.floor((nextRunTime - now) / 1000);
      if (diffSecs < 0) diffSecs = 600 - (Math.abs(diffSecs) % 600);
      setCd(diffSecs);
    };

    updateCd();
    const interval = setInterval(updateCd, 1000);
    return () => clearInterval(interval);
  }, [runs, running]);

  const handleForceRun = async () => {
    if (running || triggering) return;
    setTriggering(true);
    try {
      await fetch(`${API_BASE}/api/run-now`, { method: 'POST' });
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setTriggering(false), 2000);
    }
  };

  const filtered = runs.filter(r => {
    let matchSearch = !search || 
      r.insight.toLowerCase().includes(search.toLowerCase()) || 
      r.settlementTx.includes(search) || 
      String(r.id).includes(search);
    
    let matchRisk = true;
    if (riskFilter === 'low') matchRisk = !r.hasError && r.riskScore < 30;
    else if (riskFilter === 'medium') matchRisk = !r.hasError && r.riskScore >= 30 && r.riskScore < 60;
    else if (riskFilter === 'high') matchRisk = !r.hasError && r.riskScore >= 60;
    else if (riskFilter === 'failed') matchRisk = r.hasError;

    return matchSearch && matchRisk;
  });

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: C.bg, color: C.text,
      fontFamily: "'IBM Plex Mono','Fira Code','Courier New',monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#0b0b0b}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.35)}50%{box-shadow:0 0 0 8px rgba(249,115,22,0)}}
        button:hover{opacity:.88!important;}
      `}</style>

      <Sidebar 
        page={page} 
        setPage={(p) => { setPage(p); setMobileMenuOpen(false); }} 
        slim={slim} 
        setSlim={setSlim} 
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        
        <Topbar 
          page={page} 
          runsLength={runs.length} 
          search={search} 
          setSearch={setSearch} 
          running={running || triggering} 
          runLoop={handleForceRun} 
          cd={cd} 
          runs={runs}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onStartTour={startTour}
        />

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: isMobile ? "14px 12px" : "18px 22px" }}>
          
          {/* Active loop banner */}
          {(running || triggering) && (
            <div style={{
              background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.22)",
              borderRadius: 12, padding: "14px 18px", marginBottom: 16, animation: "fadein 0.3s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", border: "2px solid #f97316",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, flexShrink: 0, animation: "pulseRing 2s infinite",
                }}>⚡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 3 }}>
                    Loop #{runs.length + 1} executing autonomously
                  </div>
                  <div style={{ fontSize: 9, color: C.dim, marginBottom: 9 }}>
                    {phase !== null ? PHASES[phase]?.label + "..." : "Initiating..."}
                  </div>
                  <div style={{ height: 2, background: "#1e1e1e", borderRadius: 1, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${progress}%`, borderRadius: 1,
                      background: "linear-gradient(90deg,#f97316,#fdba74)",
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 9 }}>
                    {PHASES.map((p, i) => (
                      <div key={p.key} style={{
                        fontSize: 9, color: i < phase ? "#4ade80" : i === phase ? p.col : "#555",
                        display: "flex", alignItems: "center", gap: 3, transition: "all 0.3s",
                        opacity: i > phase ? 0.6 : 1, fontWeight: i === phase ? 700 : 400
                      }}>
                        <span>{p.icon}</span><span>{p.label.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === "dashboard" && (
            initialLoading
              ? <SkeletonLoader isMobile={isMobile} isTablet={isTablet} />
              : <OverviewPage runs={runs} filtered={filtered} search={search} setPage={setPage} status={status} isMobile={isMobile} isTablet={isTablet} isNarrow={isNarrow} cd={cd} riskFilter={riskFilter} setRiskFilter={setRiskFilter} />
          )}
          {page === "runs" && <RunsPage runs={runs} filtered={filtered} search={search} isMobile={isMobile} isTablet={isTablet} isNarrow={isNarrow} />}
          {page === "payments" && <PaymentsPage runs={filtered} status={status} isMobile={isMobile} />}
          {page === "agent" && <AgentPage runs={filtered} status={status} isMobile={isMobile} />}
          {page === "services" && <ServicesPage runs={filtered} status={status} isMobile={isMobile} />}
          {page === "sentinel" && <SentinelPage runs={filtered} status={status} isMobile={isMobile} />}

          <OnboardingTour open={tourOpen} onClose={closeTour} />

          {/* Footer */}
          <div style={{
            marginTop: 22, padding: "13px 0", borderTop: `1px solid ${C.border2}`,
            display: "flex", justifyContent: isMobile ? "flex-start" : "space-between",
            flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 0,
            fontSize: 9, color: "#2e2e2e", letterSpacing: "0.1em",
            flexWrap: "wrap"
          }}>
            <span>SAP v0.9.3 · {trunc(status?.programId, 10)}</span>
            <span>SENTINEL · {trunc(status?.sentinelPubkey, 10)}</span>
            <span>CATEGORY 1 · GENERAL PAYMENT VOLUME</span>
            <span>OOBE × ACE DATA CLOUD · 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
