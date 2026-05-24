export const PHASES = [
  { key: 'discovery', label: 'Network Discovery', icon: '◎', col: '#f97316' },
  { key: 'llm',       label: 'LLM Analysis',      icon: '✦', col: '#fb923c' },
  { key: 'image',     label: 'Image Generation',  icon: '◈', col: '#fdba74' },
  { key: 'audio',     label: 'Audio Generation',  icon: '♪', col: '#fed7aa' },
  { key: 'sentinel',  label: 'Sentinel Validate', icon: '⬟', col: '#f97316' },
  { key: 'session',   label: 'Session Write',     icon: '◇', col: '#fb923c' },
  { key: 'payment',   label: 'Settlement',        icon: '⬡', col: '#fdba74' },
];

export const C = {
  bg: '#0b0b0b', side: '#0f0f0f', card: '#141414', card2: '#111',
  border: '#1c1c1c', border2: '#191919',
  orange: '#f97316', orange2: '#fb923c', orange3: '#fdba74',
  green: '#4ade80', red: '#f43f5e',
  text: '#e8e8e8', muted: '#888', dim: '#444', dimmer: '#2a2a2a',
};

export const trunc = (s, n = 10) => s ? `${s.slice(0, n)}...${s.slice(-4)}` : '—';

export const timeAgo = ms => {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

export const riskColor = r => r < 30 ? '#4ade80' : r < 60 ? '#f97316' : '#f43f5e';
export const riskLabel = r => r < 30 ? 'LOW' : r < 60 ? 'MED' : 'HIGH';

export const Pill = ({ col, children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
    borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', background: `${col}22`, color: col,
  }}>
    {children}
  </span>
);

export const Row = ({ label, val, valCol = C.muted }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${C.border2}`, fontSize: 11
  }}>
    <span style={{ fontSize: 10, color: C.dim, letterSpacing: '0.06em' }}>{label}</span>
    <span style={{ fontFamily: 'monospace', fontSize: 10, color: valCol }}>{val}</span>
  </div>
);

export const SecTitle = ({ children }) => (
  <div style={{
    fontSize: 9, color: C.dim, letterSpacing: '0.14em',
    textTransform: 'uppercase', marginBottom: 12, fontWeight: 600
  }}>{children}</div>
);
