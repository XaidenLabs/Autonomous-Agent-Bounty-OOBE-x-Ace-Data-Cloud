import { useState, useEffect, useCallback } from 'react';
import { C } from './Shared';

const TOUR_KEY = 'sap_onboarding_v3';
const TOOLTIP_W = 310;

// ─── Tour step definitions ────────────────────────────────────────────────────
const STEPS = [
  {
    target: null,
    placement: 'center',
    icon: '⬡',
    title: 'Welcome to SolanaIntel Agent',
    body: 'This autonomous AI agent monitors the Solana network every 10 minutes — scanning for activity, scoring risk, generating AI media, and settling payments on-chain.\n\nLet\'s show you how everything works.',
  },
  {
    target: '[data-tour="sidebar-nav"]',
    placement: 'right',
    icon: '◈',
    title: 'Navigate the Dashboard',
    body: 'The sidebar gives you access to all six sections:\n\n• Overview — live metrics & charts\n• Run History — every completed loop\n• Payments — on-chain settlement ledger\n• Agent — wallet & program identity\n• AI Services — Ace Data Cloud API usage\n• Sentinel — escrow & guardian status',
  },
  {
    target: '[data-tour="metrics-row"]',
    placement: 'bottom',
    icon: '◎',
    title: 'Live Metrics',
    body: 'Four stat cards give you an instant pulse:\n\n• Total Loops completed by the agent\n• Average Risk Score across runs\n• Total Lamports settled on-chain\n• Escrow Balance funding API calls\n\nAll four update every 3 seconds.',
  },
  {
    target: '[data-tour="risk-chart"]',
    placement: 'top',
    icon: '✦',
    title: 'Risk Score Flow',
    body: 'Each bar = one completed loop.\n\nGreen (<30) = Low risk\nOrange (30–60) = Medium risk\nRed (>60) = High risk\n\nUse the timeframe buttons to zoom in, and click the legend chips below the chart to filter runs by risk level.',
  },
  {
    target: '[data-tour="run-table"]',
    placement: 'top',
    icon: '◇',
    title: 'Run History Table',
    body: 'The recent runs table shows the latest completed loops. Click any row to open a full breakdown:\n\n• AI-generated insight\n• Risk score\n• Sentinel & Settlement TXs\n• Session PDA\n• Audio mood & duration',
  },
  {
    target: '[data-tour="topbar-search"]',
    placement: 'bottom',
    icon: '⌕',
    title: 'Search & Filter',
    body: 'Type a loop number, transaction hash, or any keyword from an AI insight to instantly filter the run table. Results update live as you type.',
  },
  {
    target: '[data-tour="run-now-btn"]',
    placement: 'bottom',
    icon: '▶',
    title: 'Force a Run',
    body: 'Don\'t want to wait 10 minutes? Click NEW RUN to trigger an immediate intelligence cycle right now — network scan, LLM analysis, image/audio generation, and on-chain settlement.',
  },
  {
    target: '[data-tour="quick-actions"]',
    placement: 'left',
    icon: '⚡',
    title: 'Quick Actions',
    body: '• Run Now — trigger an immediate loop\n• Export — download all run data as JSON\n• Explorer — view wallet on Solana Explorer\n• Solscan — view wallet on Solscan',
  },
  {
    target: null,
    placement: 'center',
    icon: '✅',
    title: "You're all set!",
    body: 'The agent runs fully autonomously. Keep the daemon running (`npm start`) and this dashboard updates every 3 seconds automatically.\n\nClick the ? button in the top-right corner anytime to replay this tour.',
  },
];

// ─── Hook (auto-launches for first-time users) ────────────────────────────────
export function useOnboardingTour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const startTour = useCallback(() => setOpen(true), []);
  const closeTour = useCallback(() => {
    localStorage.setItem(TOUR_KEY, '1');
    setOpen(false);
  }, []);

  return { tourOpen: open, startTour, closeTour };
}

// ─── Compute tooltip pixel position beside the spotlight rect ─────────────────
function computePos(rect, placement) {
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const pad = 18;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const estH = 300;

  switch (placement) {
    case 'right':
      return {
        top: Math.max(pad, Math.min(winH - estH - pad, cy - estH / 2)),
        left: Math.min(rect.right + pad, winW - TOOLTIP_W - pad),
      };
    case 'left':
      return {
        top: Math.max(pad, Math.min(winH - estH - pad, cy - estH / 2)),
        left: Math.max(pad, rect.left - TOOLTIP_W - pad),
      };
    case 'bottom':
      return {
        top: Math.min(rect.bottom + pad, winH - estH - pad),
        left: Math.max(pad, Math.min(winW - TOOLTIP_W - pad, cx - TOOLTIP_W / 2)),
      };
    case 'top':
    default:
      return {
        top: Math.max(pad, rect.top - estH - pad),
        left: Math.max(pad, Math.min(winW - TOOLTIP_W - pad, cx - TOOLTIP_W / 2)),
      };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingTour({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState(null); // { rect, pos }

  const current = STEPS[step];
  const total = STEPS.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const isCentered = !current.target;

  // Reset step when tour opens
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Measure & scroll to target element
  const measureStep = useCallback((s) => {
    const stepDef = STEPS[s];
    if (!stepDef.target) { setSpotlight(null); return; }
    const el = document.querySelector(stepDef.target);
    if (!el) { setSpotlight(null); return; }

    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

    const t = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setSpotlight({ rect, pos: computePos(rect, stepDef.placement) });
    }, 380);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    return measureStep(step);
  }, [step, open, measureStep]);

  // Re-measure on resize
  useEffect(() => {
    if (!open) return;
    const handler = () => measureStep(step);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [step, open, measureStep]);

  const next = () => { if (isLast) { onClose(); } else { setSpotlight(null); setStep(s => s + 1); } };
  const back = () => { if (!isFirst) { setSpotlight(null); setStep(s => s - 1); } };

  if (!open) return null;

  const { rect, pos } = spotlight || {};

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      {/* When spotlighting: box-shadow on the cutout provides the dark overlay.
          When centered: we use a flat dark backdrop. */}
      {isCentered && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9996,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(3px)',
            animation: 'tourFadeIn 0.25s ease',
          }}
        />
      )}

      {/* When spotlighting, a transparent overlay handles clicks outside */}
      {!isCentered && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 9996, background: 'transparent' }}
        />
      )}

      {/* ── Spotlight cutout ─────────────────────────────────── */}
      {rect && (
        <div
          key={`spot-${step}`}
          style={{
            position: 'fixed',
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            borderRadius: 12,
            // The giant box-shadow is what darkens everything OUTSIDE this div
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.82), 0 0 0 2px rgba(249,115,22,0.8)',
            border: '2px solid rgba(249,115,22,0.6)',
            zIndex: 9997,
            pointerEvents: 'none',
            animation: 'spotGlow 2s ease-in-out infinite',
          }}
        />
      )}

      {/* ── Tooltip / centered card ───────────────────────────── */}
      <div
        key={`card-${step}`}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          zIndex: 9999,
          ...(isCentered
            ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(380px,92vw)' }
            : { top: pos?.top ?? '50%', left: pos?.left ?? '50%', width: TOOLTIP_W }
          ),
          background: '#0f0f0f',
          border: '1px solid #272727',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px #1c1c1c, 0 24px 80px rgba(0,0,0,0.95)',
          fontFamily: "'IBM Plex Mono','Fira Code','Courier New',monospace",
          animation: 'cardSlideIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Orange accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#f97316,#fb923c,#fdba74)' }} />

        {/* Dot progress + close */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 18px 0',
        }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => { setSpotlight(null); setStep(i); }}
                style={{
                  width: i === step ? 18 : 6, height: 6, borderRadius: 3,
                  background: i === step ? '#f97316' : i < step ? '#3a3a3a' : '#1e1e1e',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 9, color: '#2e2e2e', letterSpacing: '0.12em' }}>{step + 1} / {total}</span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#2e2e2e', fontSize: 15, cursor: 'pointer', padding: 0, lineHeight: 1 }}
            >✕</button>
          </div>
        </div>

        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px 4px' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 19,
          }}>
            {current.icon}
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>
              Step {step + 1} of {total}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, lineHeight: 1.25 }}>
              {current.title}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: '8px 18px 14px', paddingLeft: 72,
          fontSize: 10, color: '#7a7a7a', lineHeight: 1.85, whiteSpace: 'pre-line',
        }}>
          {current.body}
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, margin: '0 18px', background: '#181818', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 1,
            width: `${((step + 1) / total) * 100}%`,
            background: 'linear-gradient(90deg,#f97316,#fdba74)',
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Footer nav */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px 16px',
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#282828',
              fontSize: 9, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.1em',
            }}
          >SKIP TOUR</button>

          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirst && (
              <button
                onClick={back}
                style={{
                  padding: '7px 16px', borderRadius: 8,
                  background: '#181818', border: '1px solid #222',
                  color: C.dim, fontSize: 9, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em',
                }}
              >← Back</button>
            )}
            <button
              onClick={next}
              style={{
                padding: '7px 22px', borderRadius: 8,
                background: isLast ? 'linear-gradient(135deg,#4ade80,#22c55e)' : 'linear-gradient(135deg,#f97316,#ea580c)',
                border: 'none', color: '#fff',
                fontSize: 9, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em',
                boxShadow: isLast ? '0 4px 18px rgba(74,222,128,0.3)' : '0 4px 18px rgba(249,115,22,0.3)',
              }}
            >
              {isLast ? '✓ Get Started' : 'Next →'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tourFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes cardSlideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spotGlow {
          0%,100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.82), 0 0 0 2px rgba(249,115,22,0.4); }
          50%      { box-shadow: 0 0 0 9999px rgba(0,0,0,0.82), 0 0 0 6px rgba(249,115,22,0.7); }
        }
      `}</style>
    </>
  );
}
