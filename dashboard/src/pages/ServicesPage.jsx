import { C, Pill, Row } from '../components/ui/Shared';

export default function ServicesPage({ runs, isMobile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 14 }}>
      {[
        {
          name: "LLM Analysis", icon: "🧠", col: C.orange,
          endpoint: "/openai/v1/chat/completions", model: "gpt-4o-mini",
          desc: "Core intelligence. Analyzes Solana ecosystem activity, produces structured JSON risk reports with ecosystem insights.",
          avgMs: 1100
        },
        {
          name: "Image Generation", icon: "🎨", col: C.orange2,
          endpoint: "/stabilityai/v1/generation/...", model: "stable-diffusion-xl",
          desc: "Visual report card synthesis. Creates a unique dashboard graphic each loop representing current risk state.",
          avgMs: 2400
        },
        {
          name: "Audio Generation", icon: "🎵", col: C.orange3,
          endpoint: "/suno/v1/music", model: "suno-v4",
          desc: "Sentiment audio. Generates a 10-second ambient track reflecting market mood — calm, tense, or urgent.",
          avgMs: 4200
        },
      ].map(s => (
        <div key={s.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 9,
            background: `${s.col}14`, border: `1px solid ${s.col}28`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, marginBottom: 12,
          }}>{s.icon}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 5 }}>{s.name}</div>
          <div style={{ fontSize: 9, color: C.dim, lineHeight: 1.7, marginBottom: 14 }}>{s.desc}</div>
          {[
            { l: "Endpoint", v: s.endpoint }, { l: "Model", v: s.model },
            { l: "Total calls", v: runs.length }, { l: "Avg latency", v: `${s.avgMs}ms` },
          ].map(({ l, v }) => <Row key={l} label={l} val={v} valCol={s.col} />)}
          <div style={{ marginTop: 12 }}><Pill col={C.green}>✓ OPERATIONAL</Pill></div>
        </div>
      ))}
    </div>
  );
}
