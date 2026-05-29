import { riskColor } from './Shared';

export default function Bars({ runs, highlightedRuns, isSearching }) {
  // Take up to 100 runs so we don't overflow the flex container infinitely, but use what's passed
  const displayRuns = runs.slice(-100);
  const max = Math.max(...displayRuns.map(r => r.riskScore), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "72px", flex: 1, width: "100%" }}>
      {displayRuns.map((r, i) => {
          const isHighlighted = !isSearching || highlightedRuns.some(h => h.id === r.id);
          return (
            <div key={i}
              title={`Loop ${r.id || r.loopId}: ${r.riskScore}`}
              style={{
                flex: 1, borderRadius: "2px 2px 0 0",
                height: `${Math.max(8, (r.riskScore / max) * 100)}%`,
                background: isHighlighted ? (r.hasError ? '#444' : riskColor(r.riskScore)) : '#222',
                opacity: isHighlighted ? (i === displayRuns.length - 1 ? 1 : (r.hasError ? 0.4 : 0.7)) : 0.3,
                transition: "height 0.4s ease, background 0.4s ease, opacity 0.4s ease",
              }} />
          );
        }
      )}
    </div>
  );
}
