export default function Sparkline({ data, color = "#f97316", h = 32 }) {
  if (!data || data.length === 0) return null;
  const w = 100, max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1 || 1)) * w},${h - (v / max) * (h - 2) + 1}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible", display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={(data.length - 1) / (data.length - 1 || 1) * w}
        cy={h - (data[data.length - 1] / max) * (h - 2) + 1} r="3" fill={color} />
    </svg>
  );
}
