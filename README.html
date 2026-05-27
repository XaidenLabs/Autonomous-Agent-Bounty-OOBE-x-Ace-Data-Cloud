<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SolanaIntelAgent — OOBE × Ace Data Cloud</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  :root {
    --bg:      #080808;
    --bg2:     #0d0d0d;
    --bg3:     #111;
    --border:  #1a1a1a;
    --border2: #222;
    --orange:  #f97316;
    --orange2: #fb923c;
    --orange3: #fdba74;
    --green:   #4ade80;
    --red:     #f43f5e;
    --cyan:    #22d3ee;
    --text:    #e8e8e8;
    --muted:   #666;
    --dim:     #333;
    --mono:    'Share Tech Mono', monospace;
    --display: 'Orbitron', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--mono);
    font-size: 13px;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* ── SCANLINE OVERLAY ── */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.08) 2px,
      rgba(0,0,0,0.08) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* ── GRID BACKGROUND ── */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes scan {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
    50%      { box-shadow: 0 0 0 12px rgba(249,115,22,0); }
  }
  @keyframes pulseGreen {
    0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
    50%      { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
  }
  @keyframes glow {
    0%,100% { text-shadow: 0 0 10px rgba(249,115,22,0.5); }
    50%      { text-shadow: 0 0 30px rgba(249,115,22,0.9), 0 0 60px rgba(249,115,22,0.4); }
  }
  @keyframes glowCyan {
    0%,100% { text-shadow: 0 0 8px rgba(34,211,238,0.4); }
    50%      { text-shadow: 0 0 24px rgba(34,211,238,0.8); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes barGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes slideRight {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes flicker {
    0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
    20%,24%,55% { opacity: 0.4; }
  }

  /* ── REVEAL ON SCROLL ── */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── LAYOUT ── */
  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }

  /* ── TICKER ── */
  .ticker-wrap {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 8px 0;
    overflow: hidden;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .ticker-inner {
    display: flex;
    gap: 0;
    width: max-content;
    animation: ticker 30s linear infinite;
  }
  .ticker-item {
    padding: 0 32px;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--muted);
    white-space: nowrap;
    border-right: 1px solid var(--border2);
  }
  .ticker-item span { color: var(--orange); }
  .ticker-item.green span { color: var(--green); }

  /* ── HERO ── */
  .hero {
    padding: 80px 0 60px;
    text-align: center;
    position: relative;
  }

  .hero-orb {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 2px solid rgba(249,115,22,0.3);
    position: relative;
    margin: 0 auto 40px;
    animation: spin 20s linear infinite;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-orb::before {
    content: '';
    position: absolute; inset: 8px;
    border-radius: 50%;
    border: 1px solid rgba(249,115,22,0.2);
    animation: spin 10s linear infinite reverse;
  }
  .hero-orb-core {
    width: 50px; height: 50px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, #f97316, #92400e);
    animation: spin 20s linear infinite reverse;
    box-shadow: 0 0 30px rgba(249,115,22,0.6), 0 0 60px rgba(249,115,22,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    animation: pulse 3s ease-in-out infinite, spin 20s linear infinite reverse;
  }
  .hero-orb-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--orange);
    position: absolute;
    top: -4px; left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 8px var(--orange);
    animation: orbit 4s linear infinite;
  }
  .hero-orb-dot2 {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--cyan);
    position: absolute;
    bottom: -2px; left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 6px var(--cyan);
    animation: orbit 7s linear infinite reverse;
  }

  .hero-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--orange);
    text-transform: uppercase;
    margin-bottom: 16px;
    animation: fadeUp 0.6s ease both;
  }

  .hero-title {
    font-family: var(--display);
    font-size: clamp(32px, 6vw, 56px);
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 16px;
    animation: fadeUp 0.7s 0.1s ease both;
    animation: glow 3s ease-in-out infinite, fadeUp 0.7s 0.1s ease both;
  }
  .hero-title .accent { color: var(--orange); }

  .hero-sub {
    font-size: 12px;
    color: var(--muted);
    max-width: 520px;
    margin: 0 auto 32px;
    line-height: 1.8;
    animation: fadeUp 0.8s 0.2s ease both;
  }

  .hero-badges {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeUp 0.9s 0.3s ease both;
    margin-bottom: 40px;
  }
  .badge {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
    border: 1px solid;
  }
  .badge-orange { border-color: rgba(249,115,22,0.4); color: var(--orange); background: rgba(249,115,22,0.07); }
  .badge-green  { border-color: rgba(74,222,128,0.3); color: var(--green);  background: rgba(74,222,128,0.06); }
  .badge-cyan   { border-color: rgba(34,211,238,0.3); color: var(--cyan);   background: rgba(34,211,238,0.06); }
  .badge-dim    { border-color: var(--border2); color: var(--muted); background: transparent; }

  /* ── LIVE STATUS BAR ── */
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 14px 24px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 60px;
    animation: fadeIn 1s 0.5s ease both;
  }
  .status-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    letter-spacing: 0.08em;
  }
  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--green);
    animation: pulseGreen 2s ease-in-out infinite;
  }
  .status-dot.orange { background: var(--orange); animation: pulse 2s ease-in-out infinite; }
  .status-pipe { color: var(--border2); }

  /* ── SECTION ── */
  section { padding: 48px 0; border-top: 1px solid var(--border); }

  .sec-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--orange);
    text-transform: uppercase;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sec-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border2), transparent);
  }

  .sec-title {
    font-family: var(--display);
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .sec-desc {
    color: var(--muted);
    font-size: 12px;
    margin-bottom: 32px;
    max-width: 600px;
    line-height: 1.8;
  }

  /* ── LOOP FLOW DIAGRAM ── */
  .flow {
    display: flex;
    align-items: stretch;
    gap: 0;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  .flow-step {
    flex: 1;
    min-width: 110px;
    position: relative;
  }
  .flow-step-inner {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 12px;
    text-align: center;
    height: 100%;
    transition: border-color 0.2s, background 0.2s;
  }
  .flow-step-inner:hover {
    border-color: var(--orange);
    background: rgba(249,115,22,0.04);
  }
  .flow-icon {
    font-size: 20px;
    margin-bottom: 8px;
    display: block;
  }
  .flow-name {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--orange);
    font-weight: 600;
    margin-bottom: 4px;
  }
  .flow-desc {
    font-size: 9px;
    color: var(--muted);
    line-height: 1.5;
  }
  .flow-arrow {
    display: flex;
    align-items: center;
    padding: 0 4px;
    color: var(--border2);
    font-size: 16px;
    flex-shrink: 0;
    padding-bottom: 30px;
  }

  /* ── METRIC CARDS ── */
  .metrics {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 12px;
    margin-bottom: 32px;
  }
  .metric-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }
  .metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--orange), transparent);
  }
  .metric-label {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .metric-val {
    font-family: var(--display);
    font-size: 22px;
    font-weight: 700;
    color: var(--orange);
    line-height: 1;
    margin-bottom: 6px;
  }
  .metric-sub { font-size: 9px; color: var(--dim); }

  /* ── CODE BLOCKS ── */
  .code-wrap {
    background: #090909;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin: 20px 0;
  }
  .code-bar {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .code-dots { display: flex; gap: 5px; }
  .code-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .cd-r { background: #f43f5e; }
  .cd-y { background: #facc15; }
  .cd-g { background: #4ade80; }
  .code-title {
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.08em;
    margin-left: 4px;
  }
  .code-lang {
    margin-left: auto;
    font-size: 9px;
    color: var(--orange);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  pre {
    padding: 20px;
    overflow-x: auto;
    font-size: 11px;
    line-height: 1.7;
    font-family: var(--mono);
  }
  .kw  { color: #f43f5e; }
  .fn  { color: #fb923c; }
  .str { color: #4ade80; }
  .cm  { color: #374151; font-style: italic; }
  .num { color: #22d3ee; }
  .var { color: #a78bfa; }
  .op  { color: #64748b; }

  /* ── ARCHITECTURE GRID ── */
  .arch-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .arch-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px;
    transition: border-color 0.2s;
  }
  .arch-card:hover { border-color: rgba(249,115,22,0.3); }
  .arch-icon { font-size: 22px; margin-bottom: 10px; }
  .arch-name {
    font-family: var(--display);
    font-size: 12px;
    font-weight: 700;
    color: var(--orange);
    margin-bottom: 6px;
    letter-spacing: 0.04em;
  }
  .arch-desc { font-size: 10px; color: var(--muted); line-height: 1.7; }
  .arch-tag {
    display: inline-block;
    margin-top: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 9px;
    letter-spacing: 0.08em;
    background: rgba(249,115,22,0.08);
    color: var(--orange);
    border: 1px solid rgba(249,115,22,0.2);
  }

  /* ── SETUP STEPS ── */
  .steps { display: flex; flex-direction: column; gap: 0; }
  .step {
    display: flex;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .step:last-child { border-bottom: none; }
  .step-num {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 1px solid var(--orange);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--display);
    font-size: 11px;
    font-weight: 700;
    color: var(--orange);
    flex-shrink: 0;
    margin-top: 2px;
  }
  .step-content { flex: 1; }
  .step-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 6px;
    letter-spacing: 0.04em;
  }
  .step-desc { font-size: 10px; color: var(--muted); line-height: 1.7; }
  .step-cmd {
    display: inline-block;
    margin-top: 8px;
    padding: 5px 12px;
    background: #0a0a0a;
    border: 1px solid var(--border2);
    border-radius: 6px;
    font-size: 10px;
    color: var(--green);
    letter-spacing: 0.06em;
  }

  /* ── STACK PILLS ── */
  .stack { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .stack-pill {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 10px;
    letter-spacing: 0.08em;
    border: 1px solid var(--border2);
    color: var(--muted);
    background: var(--bg2);
    transition: all 0.2s;
  }
  .stack-pill:hover { border-color: var(--orange); color: var(--orange); }
  .stack-pill.hi { border-color: rgba(249,115,22,0.3); color: var(--orange); background: rgba(249,115,22,0.06); }

  /* ── DEPLOYMENT ── */
  .deploy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .deploy-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px;
  }
  .deploy-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .deploy-title-icon { font-size: 14px; }
  .deploy-step {
    display: flex;
    gap: 10px;
    padding: 7px 0;
    border-bottom: 1px solid var(--border);
    font-size: 10px;
    color: var(--muted);
    align-items: flex-start;
  }
  .deploy-step:last-child { border-bottom: none; }
  .deploy-num {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(249,115,22,0.1);
    color: var(--orange);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ── CATEGORY BANNER ── */
  .cat-banner {
    background: linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,88,12,0.04));
    border: 1px solid rgba(249,115,22,0.25);
    border-radius: 14px;
    padding: 28px 32px;
    position: relative;
    overflow: hidden;
  }
  .cat-banner::before {
    content: '1';
    position: absolute;
    right: 24px; top: 50%;
    transform: translateY(-50%);
    font-family: var(--display);
    font-size: 120px;
    font-weight: 900;
    color: rgba(249,115,22,0.04);
    line-height: 1;
    pointer-events: none;
  }
  .cat-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 8px;
  }
  .cat-title {
    font-family: var(--display);
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 10px;
  }
  .cat-desc { font-size: 11px; color: var(--muted); line-height: 1.8; max-width: 560px; }

  /* ── ANIMATED BARS ── */
  .bar-demo {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 60px;
    margin-top: 20px;
  }
  .bar-demo div {
    flex: 1;
    border-radius: 3px 3px 0 0;
    transform-origin: bottom;
    animation: barGrow 1s ease both;
  }

  /* ── INLINE CODE ── */
  code {
    background: rgba(249,115,22,0.08);
    color: var(--orange);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-family: var(--mono);
    border: 1px solid rgba(249,115,22,0.15);
  }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding: 32px 0;
    text-align: center;
  }
  .footer-logo {
    font-family: var(--display);
    font-size: 16px;
    font-weight: 900;
    color: var(--orange);
    margin-bottom: 8px;
    animation: glow 3s ease-in-out infinite;
  }
  .footer-sub { font-size: 10px; color: var(--dim); letter-spacing: 0.1em; margin-bottom: 20px; }
  .footer-links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
  .footer-link {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--orange); }

  /* ── CURSOR ── */
  .cursor {
    display: inline-block;
    width: 8px;
    height: 14px;
    background: var(--orange);
    margin-left: 2px;
    vertical-align: middle;
    animation: blink 1s step-end infinite;
  }

  /* ── DIVIDER ── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border2), transparent);
    margin: 8px 0;
  }

  /* ── TABLE ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 9px 12px;
    border-bottom: 1px solid var(--border);
    text-align: left;
    font-weight: 600;
    background: var(--bg2);
  }
  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    font-size: 10px;
    color: var(--muted);
  }
  td:first-child { color: var(--text); font-weight: 600; }
  tr:hover td { background: rgba(249,115,22,0.02); }

  /* ── RESPONSIVE ── */
  @media (max-width: 700px) {
    .metrics { grid-template-columns: 1fr 1fr; }
    .arch-grid, .deploy-grid { grid-template-columns: 1fr; }
    .flow { flex-direction: column; }
    .flow-arrow { transform: rotate(90deg); padding: 4px 0; }
    .status-bar { flex-direction: column; gap: 10px; }
    .status-pipe { display: none; }
  }
</style>
</head>
<body>

<!-- LIVE TICKER -->
<div class="ticker-wrap">
  <div class="ticker-inner" id="ticker">
    <span class="ticker-item">SAP MAINNET <span>LIVE</span></span>
    <span class="ticker-item">LOOP INTERVAL <span>10MIN</span></span>
    <span class="ticker-item green">SENTINEL <span>ACTIVE</span></span>
    <span class="ticker-item">CATEGORY <span>01 · PAYMENT VOLUME</span></span>
    <span class="ticker-item">SDK <span>v0.9.3</span></span>
    <span class="ticker-item green">ESCROW <span>OPEN</span></span>
    <span class="ticker-item">ACE DATA CLOUD <span>3 SERVICES</span></span>
    <span class="ticker-item">SETTLEMENT <span>5,000 LAM / LOOP</span></span>
    <span class="ticker-item green">AGENT <span>REGISTERED</span></span>
    <span class="ticker-item">OOBE × ACE DATA CLOUD <span>BOUNTY 2026</span></span>
    <!-- duplicate for seamless loop -->
    <span class="ticker-item">SAP MAINNET <span>LIVE</span></span>
    <span class="ticker-item">LOOP INTERVAL <span>10MIN</span></span>
    <span class="ticker-item green">SENTINEL <span>ACTIVE</span></span>
    <span class="ticker-item">CATEGORY <span>01 · PAYMENT VOLUME</span></span>
    <span class="ticker-item">SDK <span>v0.9.3</span></span>
    <span class="ticker-item green">ESCROW <span>OPEN</span></span>
    <span class="ticker-item">ACE DATA CLOUD <span>3 SERVICES</span></span>
    <span class="ticker-item">SETTLEMENT <span>5,000 LAM / LOOP</span></span>
    <span class="ticker-item green">AGENT <span>REGISTERED</span></span>
    <span class="ticker-item">OOBE × ACE DATA CLOUD <span>BOUNTY 2026</span></span>
  </div>
</div>

<!-- HERO -->
<div class="container">
  <div class="hero">
    <div class="hero-orb">
      <div class="hero-orb-dot"></div>
      <div class="hero-orb-dot2"></div>
      <div class="hero-orb-core">⬡</div>
    </div>

    <div class="hero-label">OOBE Protocol × Ace Data Cloud · Bounty Submission 2026</div>

    <h1 class="hero-title">
      Solana<span class="accent">Intel</span><br>Agent
      <span class="cursor"></span>
    </h1>

    <p class="hero-sub">
      A fully autonomous blockchain intelligence daemon that discovers tools,
      executes AI-powered analysis, inscribes intelligence onto the chain,
      and settles high-frequency payment volume — zero human input required.
    </p>

    <div class="hero-badges">
      <span class="badge badge-orange">🏆 Category 1 · General Payment Volume</span>
      <span class="badge badge-green">✓ SAP Mainnet Registered</span>
      <span class="badge badge-cyan">⬡ x402 Escrow Active</span>
      <span class="badge badge-dim">TypeScript · Node.js · React</span>
      <span class="badge badge-dim">Solana Mainnet</span>
    </div>

    <!-- Live status bar -->
    <div class="status-bar">
      <div class="status-item">
        <div class="status-dot"></div>
        <span style="color:#4ade80">AGENT ACTIVE</span>
      </div>
      <span class="status-pipe">|</span>
      <div class="status-item">
        <div class="status-dot orange"></div>
        <span style="color:#f97316">LOOP EXECUTING</span>
      </div>
      <span class="status-pipe">|</span>
      <div class="status-item" style="color:#666">
        SETTLEMENT · <span style="color:#f97316">5,000 LAM / RUN</span>
      </div>
      <span class="status-pipe">|</span>
      <div class="status-item" style="color:#666">
        SENTINEL · <span style="color:#4ade80">CONNECTED</span>
      </div>
      <span class="status-pipe">|</span>
      <div class="status-item" style="color:#666">
        INTERVAL · <span style="color:#22d3ee">10 MIN</span>
      </div>
    </div>
  </div>

  <!-- ══ CATEGORY BANNER ═════════════════════════════════════════ -->
  <div class="cat-banner reveal">
    <div class="cat-label">🏆 Bounty Submission</div>
    <div class="cat-title">Category 1 — General Payment Volume on SAP</div>
    <div class="cat-desc">
      Every 10 minutes, the SolanaIntelAgent executes a real on-chain
      <code>settleCallsV2</code> CPI, debiting its own x402 Escrow Account by
      <strong style="color:#f97316">5,000 lamports</strong> per loop. This generates verifiable,
      auditable payment volume directly within the SAP ecosystem. No wash trading.
      No artificial loops. Real economic activity — every run, every time.
    </div>
    <div class="bar-demo" id="barDemo"></div>
  </div>

  <!-- ══ METRICS ════════════════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Performance</div>
    <div class="metrics">
      <div class="metric-card">
        <div class="metric-label">Loop Interval</div>
        <div class="metric-val" id="cnt1">10</div>
        <div class="metric-sub">minutes between runs</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Settlement / Loop</div>
        <div class="metric-val">5,000</div>
        <div class="metric-sub">lamports per execution</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">AI Services Used</div>
        <div class="metric-val" style="color:#4ade80">3</div>
        <div class="metric-sub">distinct Ace Data endpoints</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">On-Chain PDAs</div>
        <div class="metric-val" style="color:#22d3ee">5+</div>
        <div class="metric-sub">Agent · Escrow · Session · Ledger · Tools</div>
      </div>
    </div>
  </section>

  <!-- ══ HOW IT WORKS ═══════════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Autonomous Loop</div>
    <h2 class="sec-title">How the Agent Works</h2>
    <p class="sec-desc">
      A single <code>npm start</code> command launches the daemon. From that point,
      every phase executes autonomously — no human input, no manual triggers, no intervention.
    </p>

    <div class="flow">
      <div class="flow-step">
        <div class="flow-step-inner">
          <span class="flow-icon">◎</span>
          <div class="flow-name">Discover</div>
          <div class="flow-desc">Scans SAP network. Fetches Sentinel profile. Reads live agent registry.</div>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-inner">
          <span class="flow-icon">🧠</span>
          <div class="flow-name">Analyze</div>
          <div class="flow-desc">Calls Ace Data LLM. Produces risk score 0–100 + market insights.</div>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-inner">
          <span class="flow-icon">🎨</span>
          <div class="flow-name">Visualize</div>
          <div class="flow-desc">Generates a visual report card via Ace Data image generation.</div>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-inner">
          <span class="flow-icon">🎵</span>
          <div class="flow-name">Sonify</div>
          <div class="flow-desc">Produces a sentiment audio clip. Third distinct Ace Data service.</div>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-inner">
          <span class="flow-icon">⬟</span>
          <div class="flow-name">Sentinel</div>
          <div class="flow-desc">Pays Synapse Sentinel via x402. Mandatory SAP validation service.</div>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-inner">
          <span class="flow-icon">📝</span>
          <div class="flow-name">Inscribe</div>
          <div class="flow-desc">Writes intelligence to on-chain SessionLedger PDA. Permanent record.</div>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-inner">
          <span class="flow-icon">💰</span>
          <div class="flow-name">Settle</div>
          <div class="flow-desc">Calls settleCallsV2. Debits escrow 5,000 lam. Volume generated.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══ CODE SAMPLES ══════════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Implementation</div>
    <h2 class="sec-title">Core Functions</h2>
    <p class="sec-desc">
      Three key functions drive the agent. Each one maps to a specific phase of the autonomous loop.
    </p>

    <!-- LLM -->
    <div class="code-wrap">
      <div class="code-bar">
        <div class="code-dots">
          <div class="code-dot cd-r"></div>
          <div class="code-dot cd-y"></div>
          <div class="code-dot cd-g"></div>
        </div>
        <span class="code-title">src/ace/llm.ts — Market Intelligence</span>
        <span class="code-lang">TypeScript</span>
      </div>
<pre><span class="cm">// Service 1: LLM Analysis via Ace Data Cloud</span>
<span class="kw">const</span> <span class="var">response</span> <span class="op">=</span> <span class="kw">await</span> <span class="fn">acePost</span>(<span class="str">"/v1/chat/completions"</span>, {
  model: <span class="str">"gpt-4o-mini"</span>,
  messages: [
    {
      role: <span class="str">"system"</span>,
      content: <span class="str">"You are a Solana analyst. Respond ONLY in JSON. "</span> +
               <span class="str">"Format: {analysisText, riskScore, insights[]}"</span>,
    },
    {
      role: <span class="str">"user"</span>,
      content: <span class="str">`Analyze Solana ecosystem at ${</span><span class="var">timestamp</span><span class="str">}.`</span>
    }
  ],
  response_format: { type: <span class="str">"json_object"</span> }
});

<span class="cm">// riskScore: 0 (healthy) → 100 (critical)</span>
<span class="kw">const</span> { <span class="var">analysisText</span>, <span class="var">riskScore</span>, <span class="var">insights</span> } <span class="op">=</span> <span class="var">response</span>;</pre>
    </div>

    <!-- Settlement -->
    <div class="code-wrap">
      <div class="code-bar">
        <div class="code-dots">
          <div class="code-dot cd-r"></div>
          <div class="code-dot cd-y"></div>
          <div class="code-dot cd-g"></div>
        </div>
        <span class="code-title">src/oobe/payments.ts — On-Chain Settlement</span>
        <span class="code-lang">TypeScript</span>
      </div>
<pre><span class="cm">// Category 1: Real payment volume via settleCallsV2 CPI</span>
<span class="kw">const</span> <span class="var">txSig</span> <span class="op">=</span> <span class="kw">await</span> <span class="var">client</span>.program.methods
  .<span class="fn">settleCallsV2</span>({
    caller: <span class="var">wallet</span>,
    amountLamports: <span class="kw">new</span> <span class="fn">BN</span>(<span class="num">5000</span>),  <span class="cm">// 5,000 lam per loop</span>
    amountUsd: <span class="kw">null</span>,
    serviceTokenMint: <span class="kw">null</span>,
    notes: <span class="str">"SolanaIntel Agent routine execution"</span>,
  })
  .<span class="fn">accountsStrict</span>({
    sapState: <span class="var">pdas</span>.state,
    agent: <span class="var">agentPda</span>,
    escrowAccount: <span class="var">escrowPda</span>,    <span class="cm">// x402 Escrow PDA</span>
    feeRecipient: <span class="var">FEE_RECIPIENT</span>,
    systemProgram: <span class="var">web3</span>.SystemProgram.programId,
  })
  .<span class="fn">rpc</span>();  <span class="cm">// Returns confirmed TX signature</span></pre>
    </div>

    <!-- Session -->
    <div class="code-wrap">
      <div class="code-bar">
        <div class="code-dots">
          <div class="code-dot cd-r"></div>
          <div class="code-dot cd-y"></div>
          <div class="code-dot cd-g"></div>
        </div>
        <span class="code-title">src/oobe/session.ts — On-Chain Memory Inscription</span>
        <span class="code-lang">TypeScript</span>
      </div>
<pre><span class="cm">// Inscribe intelligence permanently into SessionLedger PDA</span>
<span class="kw">const</span> <span class="var">txSig</span> <span class="op">=</span> <span class="kw">await</span> <span class="var">client</span>.program.methods
  .<span class="fn">inscribeMemory</span>(
    <span class="kw">new</span> <span class="fn">BN</span>(<span class="var">sequence</span>),
    [
      { key: <span class="str">"insight"</span>,      value: <span class="var">llmResult</span>.analysisText.<span class="fn">substring</span>(<span class="num">0</span>, <span class="num">100</span>) },
      { key: <span class="str">"riskScore"</span>,    value: <span class="var">llmResult</span>.riskScore.<span class="fn">toString</span>() },
      { key: <span class="str">"settlement_tx"</span>, value: <span class="var">settlementTx</span> },
    ]
  )
  .<span class="fn">accountsStrict</span>({
    sessionLedger: <span class="var">pdas</span>.sessionLedger,  <span class="cm">// Permanent on-chain memory</span>
    agent: <span class="var">agentPda</span>,
    authority: <span class="var">wallet</span>,
    systemProgram: <span class="var">web3</span>.SystemProgram.programId,
  })
  .<span class="fn">rpc</span>();  <span class="cm">// Intelligence is now immutable ✓</span></pre>
    </div>
  </section>

  <!-- ══ ARCHITECTURE ══════════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Architecture</div>
    <h2 class="sec-title">System Components</h2>
    <p class="sec-desc">Every component has a single responsibility. The daemon wires them together.</p>

    <div class="arch-grid">
      <div class="arch-card">
        <div class="arch-icon">🤖</div>
        <div class="arch-name">Daemon Loop</div>
        <div class="arch-desc">
          The master orchestrator. Runs infinitely via <code>setInterval</code>
          every 10 minutes. Calls each phase in sequence. Handles errors gracefully
          — a single phase failure never stops the loop.
        </div>
        <div class="arch-tag">src/daemon/loop.ts</div>
      </div>
      <div class="arch-card">
        <div class="arch-icon">◎</div>
        <div class="arch-name">Discovery Registry</div>
        <div class="arch-desc">
          Queries the SAP on-chain agent registry every loop. Fetches Synapse
          Sentinel's live profile. Scans A2A-compatible agents. Proves genuine
          tool discovery, not hardcoded addresses.
        </div>
        <div class="arch-tag">src/oobe/discovery.ts</div>
      </div>
      <div class="arch-card">
        <div class="arch-icon">🧠</div>
        <div class="arch-name">Ace Data Cloud (3 Services)</div>
        <div class="arch-desc">
          Three clearly distinct AI services: LLM text analysis, Stable Diffusion
          image generation, and Suno audio generation. Each call is a separate
          x402 payment through the Ace Data facilitator.
        </div>
        <div class="arch-tag">src/ace/llm.ts · image.ts · audio.ts</div>
      </div>
      <div class="arch-card">
        <div class="arch-icon">⬡</div>
        <div class="arch-name">x402 Escrow (V2)</div>
        <div class="arch-desc">
          Pre-funded EscrowV2 PDA. Settles 5,000 lamports per loop via
          <code>settleCallsV2</code>. Auto-refills when balance drops below 10
          affordable calls. Volume curves provide tiered discounts.
        </div>
        <div class="arch-tag">src/oobe/payments.ts</div>
      </div>
      <div class="arch-card">
        <div class="arch-icon">📝</div>
        <div class="arch-name">Session Memory</div>
        <div class="arch-desc">
          Writes each loop's intelligence to a <code>SessionLedger</code> PDA.
          Seals every 10 runs into a permanent <code>LedgerPage</code> PDA archive.
          Creates an immutable, auditable trail of all agent activity.
        </div>
        <div class="arch-tag">src/oobe/session.ts</div>
      </div>
      <div class="arch-card">
        <div class="arch-icon">⬟</div>
        <div class="arch-name">Synapse Sentinel</div>
        <div class="arch-desc">
          Mandatory SAP validation service. The agent opens a dedicated x402
          payment channel to Sentinel's wallet and settles one call per loop.
          Satisfies the bounty's Sentinel interaction requirement.
        </div>
        <div class="arch-tag">src/sentinel/interact.ts</div>
      </div>
    </div>
  </section>

  <!-- ══ STACK ════════════════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Technology</div>
    <h2 class="sec-title">Full Stack</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Runtime</td>
            <td><code>TypeScript · Node.js 18+</code></td>
            <td>All daemon logic and setup scripts</td>
          </tr>
          <tr>
            <td>Blockchain</td>
            <td><code>Solana Mainnet</code></td>
            <td>All PDAs, transactions, escrow</td>
          </tr>
          <tr>
            <td>OOBE SDK</td>
            <td><code>@oobe-protocol-labs/synapse-sap-sdk</code></td>
            <td>AgentBuilder, Discovery, X402, Session, EscrowV2</td>
          </tr>
          <tr>
            <td>Anchor</td>
            <td><code>@coral-xyz/anchor · @solana/web3.js</code></td>
            <td>SAP program instruction dispatch</td>
          </tr>
          <tr>
            <td>AI Layer</td>
            <td><code>Ace Data Cloud APIs</code></td>
            <td>LLM analysis · Image generation · Audio generation</td>
          </tr>
          <tr>
            <td>Frontend</td>
            <td><code>React · Vite</code></td>
            <td>Real-time mission control dashboard</td>
          </tr>
          <tr>
            <td>Deployment</td>
            <td><code>PM2 · Vercel</code></td>
            <td>Daemon persistence · Dashboard hosting</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="stack">
      <span class="stack-pill hi">TypeScript</span>
      <span class="stack-pill hi">Solana</span>
      <span class="stack-pill hi">OOBE Protocol</span>
      <span class="stack-pill hi">Ace Data Cloud</span>
      <span class="stack-pill">Node.js 18+</span>
      <span class="stack-pill">@coral-xyz/anchor</span>
      <span class="stack-pill">@solana/web3.js</span>
      <span class="stack-pill">React</span>
      <span class="stack-pill">Vite</span>
      <span class="stack-pill">PM2</span>
      <span class="stack-pill">Vercel</span>
      <span class="stack-pill">dotenv</span>
    </div>
  </section>

  <!-- ══ SETUP ════════════════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Get Started</div>
    <h2 class="sec-title">Setup & Run</h2>
    <p class="sec-desc">
      From zero to autonomous agent in 5 steps. Assumes you have Node.js 18+
      and a funded Solana wallet.
    </p>

    <div class="steps">
      <div class="step">
        <div class="step-num">01</div>
        <div class="step-content">
          <div class="step-title">Install Dependencies</div>
          <div class="step-desc">
            Clone the repository and install all required packages.
            The OOBE SDK and its Solana peer dependencies install together.
          </div>
          <div class="step-cmd">npm install</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">02</div>
        <div class="step-content">
          <div class="step-title">Configure Environment</div>
          <div class="step-desc">
            Copy <code>.env.example</code> to <code>.env</code> and fill in your three keys:
            <code>SOLANA_PRIVATE_KEY</code>, <code>SYNAPSE_RPC_URL</code>, and
            <code>ACE_DATA_API_KEY</code>. Never commit <code>.env</code> to git.
          </div>
          <div class="step-cmd">cp .env.example .env</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">03</div>
        <div class="step-content">
          <div class="step-title">Register the Agent On-Chain</div>
          <div class="step-desc">
            Creates your <code>AgentAccount PDA</code> and <code>AgentStats PDA</code>
            on Solana mainnet. Run once only. Costs ~0.01 SOL in rent.
            Verify at <code>explorer.oobeprotocol.ai/agents/YOUR_WALLET</code>.
          </div>
          <div class="step-cmd">npm run register</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">04</div>
        <div class="step-content">
          <div class="step-title">Publish Tool Descriptors</div>
          <div class="step-desc">
            Inscribes your agent's capabilities as on-chain Tool PDAs with JSON Schema
            hashes. Makes your agent discoverable by other agents on the SAP network.
          </div>
          <div class="step-cmd">npm run publish-tools</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">05</div>
        <div class="step-content">
          <div class="step-title">Start the Autonomous Daemon</div>
          <div class="step-desc">
            Initializes the escrow, opens the Sentinel payment channel, and starts
            the 10-minute autonomous loop. Walk away — it runs forever.
          </div>
          <div class="step-cmd">npm start</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══ DEPLOYMENT ════════════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Deployment</div>
    <h2 class="sec-title">Production Setup</h2>

    <div class="deploy-grid">
      <div class="deploy-card">
        <div class="deploy-title">
          <span class="deploy-title-icon">🖥️</span>
          VPS — Backend Daemon (PM2)
        </div>
        <div class="deploy-step">
          <div class="deploy-num">1</div>
          <span>SSH into your VPS and clone the repository</span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">2</div>
          <span>Create your <code>.env</code> with production keys</span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">3</div>
          <span>Run <code>npm run register</code> and <code>npm run publish-tools</code></span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">4</div>
          <span>Start daemon: <code>pm2 start npm --name "solana-backend" -- start</code></span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">5</div>
          <span>Persist across reboots: <code>pm2 save && pm2 startup</code></span>
        </div>
      </div>

      <div class="deploy-card">
        <div class="deploy-title">
          <span class="deploy-title-icon">▲</span>
          Vercel — Dashboard Frontend
        </div>
        <div class="deploy-step">
          <div class="deploy-num">1</div>
          <span>Connect your GitHub repository to Vercel</span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">2</div>
          <span>Set <strong>Root Directory</strong> to <code>dashboard</code></span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">3</div>
          <span>Add environment variable: <code>VITE_API_BASE=http://YOUR_VPS_IP:3005</code></span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">4</div>
          <span>Click Deploy — Vercel handles the rest</span>
        </div>
        <div class="deploy-step">
          <div class="deploy-num">5</div>
          <span>Dashboard auto-polls backend every 5 seconds for live data</span>
        </div>
      </div>
    </div>

    <!-- env file preview -->
    <div class="code-wrap" style="margin-top:20px">
      <div class="code-bar">
        <div class="code-dots">
          <div class="code-dot cd-r"></div>
          <div class="code-dot cd-y"></div>
          <div class="code-dot cd-g"></div>
        </div>
        <span class="code-title">.env.example</span>
        <span class="code-lang">ENV</span>
      </div>
<pre><span class="cm"># ── Solana Wallet ─────────────────────────────</span>
<span class="var">SOLANA_PRIVATE_KEY</span>=<span class="str">[12,34,56,...your key bytes array...]</span>

<span class="cm"># ── OOBE Protocol ─────────────────────────────</span>
<span class="var">SYNAPSE_RPC_URL</span>=<span class="str">https://staging.oobeprotocol.ai:8080/rpc?api_key=YOUR</span>

<span class="cm"># ── Ace Data Cloud ────────────────────────────</span>
<span class="var">ACE_DATA_API_KEY</span>=<span class="str">your_ace_data_account_token_here</span>

<span class="cm"># ── Agent Config ──────────────────────────────</span>
<span class="var">AGENT_NAME</span>=<span class="str">SolanaIntelAgent</span>
<span class="var">LOOP_INTERVAL_MS</span>=<span class="num">600000</span>

<span class="cm"># ── Constants (do not change) ─────────────────</span>
<span class="var">SENTINEL_WALLET</span>=<span class="str">Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph</span>
<span class="var">SAP_PROGRAM_ID</span>=<span class="str">SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ</span></pre>
    </div>
  </section>

  <!-- ══ ACKNOWLEDGEMENTS ══════════════════════════════════════ -->
  <section class="reveal">
    <div class="sec-label">Acknowledgements</div>
    <h2 class="sec-title">Built With</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:8px">
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:20px;display:flex;align-items:flex-start;gap:14px">
        <div style="font-size:28px">⬡</div>
        <div>
          <div style="font-family:var(--display);font-size:13px;font-weight:700;color:var(--orange);margin-bottom:5px">OOBE Protocol</div>
          <div style="font-size:10px;color:var(--muted);line-height:1.7">
            Building infrastructure for autonomous agents across execution,
            coordination, and developer tooling. The Synapse Agent Protocol (SAP)
            powers agent identity, discovery, and on-chain payment settlement.
          </div>
          <div style="margin-top:10px">
            <code>oobeprotocol.ai</code>
          </div>
        </div>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:20px;display:flex;align-items:flex-start;gap:14px">
        <div style="font-size:28px">✦</div>
        <div>
          <div style="font-family:var(--display);font-size:13px;font-weight:700;color:var(--orange);margin-bottom:5px">Ace Data Cloud</div>
          <div style="font-size:10px;color:var(--muted);line-height:1.7">
            AI infrastructure platform providing 83+ services via a unified API
            with pay-per-use access. Powers the LLM, image, and audio generation
            capabilities of the SolanaIntelAgent.
          </div>
          <div style="margin-top:10px">
            <code>acedata.cloud</code>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:16px;padding:16px;background:rgba(249,115,22,0.04);border:1px solid rgba(249,115,22,0.15);border-radius:8px;font-size:10px;color:var(--muted);line-height:1.8">
      Built for the <strong style="color:var(--orange)">Autonomous Agent Bounty — OOBE Protocol × Ace Data Cloud 2026</strong>.
      All transactions generated by this agent occur directly on the Solana blockchain
      and utilize the official SAP Program ID <code>SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ</code>.
      Volume is real economic activity — no wash trading, no artificial loops.
    </div>
  </section>
</div>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-logo">SolanaIntelAgent</div>
    <div class="footer-sub">OOBE × Ace Data Cloud · Category 1 · General Payment Volume · 2026</div>
    <div class="footer-links">
      <a href="https://explorer.oobeprotocol.ai" class="footer-link">SAP Explorer</a>
      <a href="https://platform.acedata.cloud" class="footer-link">Ace Data Cloud</a>
      <a href="https://synapse.oobeprotocol.ai" class="footer-link">Synapse Gateway</a>
      <a href="#" class="footer-link">GitHub Repository</a>
      <a href="#" class="footer-link">Demo Video</a>
    </div>
    <div style="margin-top:24px;font-size:9px;color:var(--dim);letter-spacing:0.12em">
      SAP PROGRAM · SAPpUhsWLJG1FfkGRcXagEDMrMsWGjbky7AyhGpFETZ
    </div>
  </div>
</footer>

<script>
  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => observer.observe(r));

  /* ── ANIMATED BAR CHART ── */
  const barDemo = document.getElementById('barDemo');
  const heights = [28,42,35,61,48,72,38,55,44,68,52,80,47,63];
  const colors  = ['#f97316','#fb923c','#f97316','#fdba74','#f97316',
                   '#ea580c','#fb923c','#f97316','#fdba74','#f97316',
                   '#fb923c','#ea580c','#f97316','#fb923c'];
  heights.forEach((h,i) => {
    const bar = document.createElement('div');
    bar.style.cssText = `
      flex:1;border-radius:3px 3px 0 0;
      height:${h}px;background:${colors[i]};opacity:0.7;
      animation:barGrow 0.6s ${i*0.05}s ease both;
      transform-origin:bottom;
    `;
    barDemo.appendChild(bar);
  });

  /* ── LIVE COUNTER ANIMATION ── */
  function animateCount(el, target, duration=1500) {
    const start = Date.now();
    const update = () => {
      const p = Math.min((Date.now()-start)/duration,1);
      const ease = 1-Math.pow(1-p,3);
      el.textContent = Math.round(ease*target);
      if(p<1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ── TYPEWRITER for hero title ── */
  // Already rendered statically, cursor handles the animation

  /* ── STAGGER flow steps ── */
  document.querySelectorAll('.flow-step').forEach((el,i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.5s ${i*0.08}s ease, transform 0.5s ${i*0.08}s ease`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 600 + i * 80);
  });

  /* ── STAGGER arch cards ── */
  document.querySelectorAll('.arch-card').forEach((el,i) => {
    el.style.opacity = '0';
    el.style.animationDelay = `${i*0.1}s`;
  });

  /* ── METRIC hover glow ── */
  document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'rgba(249,115,22,0.4)';
      card.style.boxShadow = '0 0 20px rgba(249,115,22,0.08)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    });
  });
</script>
</body>
</html>