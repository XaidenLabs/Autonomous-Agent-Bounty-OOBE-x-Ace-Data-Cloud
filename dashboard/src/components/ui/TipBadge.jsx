import { useState, useEffect, useRef, useCallback } from 'react';
import { C } from './Shared';

const NS = 'sap_tip_v1_';

// ─── Global reset event ──────────────────────────────────────────────────────
const RESET_EVENT = 'sap_tips_reset';
export function resetAllTips() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(NS))
    .forEach(k => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent(RESET_EVENT));
}

// ─── Hook used by the ? button in Topbar ─────────────────────────────────────
export function useTips() {
  return { resetTips: resetAllTips };
}

// ─── Directions the popover can open ─────────────────────────────────────────
const ARROW = {
  top:    { borderBottom: '6px solid #1e1e1e', borderTop: 'none',   top: '100%', left: '50%', transform: 'translateX(-50%)' },
  bottom: { borderTop:    '6px solid #1e1e1e', borderBottom: 'none', bottom: '100%', left: '50%', transform: 'translateX(-50%)' },
  left:   { borderRight:  '6px solid #1e1e1e', borderLeft: 'none',  top: '50%', left: '100%', transform: 'translateY(-50%)' },
  right:  { borderLeft:   '6px solid #1e1e1e', borderRight: 'none', top: '50%', right: '100%', transform: 'translateY(-50%)' },
};

const POP_OFFSET = {
  top:    { bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' },
  bottom: { top:    'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' },
  left:   { right:  'calc(100% + 10px)', top: '50%',  transform: 'translateY(-50%)' },
  right:  { left:   'calc(100% + 10px)', top: '50%',  transform: 'translateY(-50%)' },
};

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * @param {string}  id        unique tip identifier
 * @param {string}  title     bold heading in the popover
 * @param {string}  body      description text
 * @param {'top'|'bottom'|'left'|'right'} dir  which side the popover opens
 * @param {number}  width     popover width in px (default 240)
 * @param {object}  style     extra CSS for the badge wrapper (e.g. position offsets)
 */
export default function TipBadge({ id, title, body, dir = 'top', width = 240, style: wrapStyle = {} }) {
  const key = NS + id;
  const [seen,  setSeen]  = useState(() => !!localStorage.getItem(key));
  const [open,  setOpen]  = useState(false);
  const popRef = useRef(null);

  // Listen for global reset
  useEffect(() => {
    const handler = () => { setSeen(false); setOpen(false); };
    window.addEventListener(RESET_EVENT, handler);
    return () => window.removeEventListener(RESET_EVENT, handler);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const dismiss = useCallback((e) => {
    e.stopPropagation();
    localStorage.setItem(key, '1');
    setSeen(true);
    setOpen(false);
  }, [key]);

  const toggle = useCallback((e) => {
    e.stopPropagation();
    setOpen(v => !v);
  }, []);

  if (seen) return null;

  const arrowStyle = ARROW[dir];
  const popStyle   = POP_OFFSET[dir];

  return (
    <div
      ref={popRef}
      style={{
        position: 'absolute',
        zIndex: 500,
        ...wrapStyle,
      }}
    >
      {/* Pulsing dot */}
      <div
        onClick={toggle}
        style={{
          width: 14, height: 14, borderRadius: '50%',
          background: 'radial-gradient(circle, #f97316 30%, #ea580c 100%)',
          boxShadow: open
            ? '0 0 0 3px rgba(249,115,22,0.5)'
            : '0 0 0 0px rgba(249,115,22,0)',
          cursor: 'pointer',
          animation: open ? 'none' : 'tipPulse 2s ease-in-out infinite',
          transition: 'box-shadow 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 8, color: '#fff', fontWeight: 900, lineHeight: 1 }}>i</span>
      </div>

      {/* Popover */}
      {open && (
        <div
          style={{
            position: 'absolute',
            width,
            background: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: 12,
            boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px #1e1e1e',
            overflow: 'hidden',
            animation: 'tipPopIn 0.2s cubic-bezier(0.16,1,0.3,1)',
            fontFamily: "'IBM Plex Mono','Fira Code',monospace",
            ...popStyle,
          }}
        >
          {/* Orange top bar */}
          <div style={{ height: 2, background: 'linear-gradient(90deg,#f97316,#fdba74)' }} />

          <div style={{ padding: '12px 14px 14px' }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', gap: 8, marginBottom: 8,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: C.text,
                lineHeight: 1.3, flex: 1,
              }}>
                <span style={{ color: C.orange, marginRight: 5 }}>◈</span>{title}
              </div>
              <button
                onClick={dismiss}
                style={{
                  background: 'none', border: 'none', color: '#333',
                  fontSize: 12, cursor: 'pointer', padding: 0,
                  lineHeight: 1, flexShrink: 0, marginTop: 1,
                }}
              >✕</button>
            </div>

            {/* Body */}
            <div style={{
              fontSize: 10, color: '#777', lineHeight: 1.7,
              paddingLeft: 16,
            }}>
              {body}
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end',
              marginTop: 10, paddingTop: 8,
              borderTop: '1px solid #1e1e1e',
            }}>
              <button
                onClick={dismiss}
                style={{
                  padding: '5px 12px', borderRadius: 6,
                  background: 'rgba(249,115,22,0.12)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  color: C.orange, fontSize: 9, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  letterSpacing: '0.08em',
                }}
              >
                GOT IT ✓
              </button>
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            position: 'absolute',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            ...arrowStyle,
          }} />
        </div>
      )}

      <style>{`
        @keyframes tipPulse {
          0%,100% { box-shadow: 0 0 0 0px rgba(249,115,22,0.7); }
          50%      { box-shadow: 0 0 0 5px rgba(249,115,22,0); }
        }
        @keyframes tipPopIn {
          from { opacity:0; transform: scale(0.92) ${dir === 'top' ? 'translateY(6px)' : dir === 'bottom' ? 'translateY(-6px)' : ''}; }
          to   { opacity:1; transform: scale(1) translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
