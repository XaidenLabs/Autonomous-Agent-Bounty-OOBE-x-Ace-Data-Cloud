import { riskColor } from './Shared';

export default function Ring({ value, size = 76, sw = 7 }) {
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const col = riskColor(value);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f1f1f" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * circ} ${circ}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column",
      }}>
        <span style={{ fontSize: "15px", fontWeight: "700", color: col, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: "8px", color: "#444", marginTop: 1 }}>/ 100</span>
      </div>
    </div>
  );
}
