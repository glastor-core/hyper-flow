export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hyper-Flow ⚡ Edge AI & Pipeline Control Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #07090e;
      --bg-card: rgba(15, 20, 32, 0.75);
      --bg-card-hover: rgba(22, 30, 48, 0.85);
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(99, 102, 241, 0.35);
      --accent-primary: #6366f1;
      --accent-secondary: #06b6d4;
      --accent-emerald: #10b981;
      --accent-pink: #ec4899;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --font-ui: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-ui);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Ambient lighting gradients */
    .ambient-glow {
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      filter: blur(140px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.18;
    }
    .glow-1 { top: -200px; left: -100px; background: radial-gradient(circle, #6366f1, transparent); }
    .glow-2 { top: 20%; right: -200px; background: radial-gradient(circle, #06b6d4, transparent); }
    .glow-3 { bottom: -150px; left: 30%; background: radial-gradient(circle, #ec4899, transparent); }

    /* Layout */
    .wrapper {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    /* Header */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .brand-logo {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.5rem;
      box-shadow: 0 0 25px rgba(99, 102, 241, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .brand-title h1 {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(to right, #fff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-title p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-glow);
      transform: translateY(-1px);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--accent-primary), #8b5cf6);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .btn-primary:hover {
      box-shadow: 0 6px 22px rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
    }

    /* Metric HUD cards */
    .hud-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    .hud-card {
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.25rem;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }

    .hud-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .hud-card:hover {
      border-color: var(--border-glow);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }

    .hud-card:hover::before {
      opacity: 1;
    }

    .hud-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .hud-value {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .hud-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 12px var(--accent-emerald);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    /* Main Workspace Columns */
    .workspace-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 1.75rem;
    }

    @media (max-width: 1024px) {
      .workspace-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Glass Panels */
    .glass-panel {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .panel-title {
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .panel-subtitle {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }

    /* AI Playground Form */
    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .topic-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .pill-btn {
      padding: 0.4rem 0.85rem;
      border-radius: 20px;
      border: 1px solid var(--border-subtle);
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pill-btn.active, .pill-btn:hover {
      background: rgba(99, 102, 241, 0.15);
      border-color: var(--accent-primary);
      color: var(--text-main);
    }

    textarea {
      width: 100%;
      background: rgba(7, 9, 14, 0.8);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 1rem;
      color: var(--text-main);
      font-family: var(--font-ui);
      font-size: 0.95rem;
      resize: vertical;
      min-height: 110px;
      transition: border-color 0.2s;
    }

    textarea:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    input[type="range"] {
      flex: 1;
      accent-color: var(--accent-primary);
      height: 6px;
    }

    .slider-val {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--accent-secondary);
      font-weight: 600;
      min-width: 40px;
    }

    /* Output Console */
    .terminal-box {
      margin-top: 1.5rem;
      background: #05070a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      overflow: hidden;
      font-family: var(--font-mono);
    }

    .terminal-bar {
      background: rgba(255, 255, 255, 0.03);
      padding: 0.6rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .terminal-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }

    .terminal-title {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .terminal-body {
      padding: 1.25rem;
      font-size: 0.85rem;
      line-height: 1.6;
      max-height: 280px;
      overflow-y: auto;
      color: #38bdf8;
    }

    .terminal-body pre {
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Architecture Visualizer Card */
    .arch-flow {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .flow-step {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.9rem 1.1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .flow-step:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .step-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .icon-bun { background: rgba(244, 114, 182, 0.15); border: 1px solid rgba(244, 114, 182, 0.3); }
    .icon-hono { background: rgba(249, 115, 22, 0.15); border: 1px solid rgba(249, 115, 22, 0.3); }
    .icon-deno { background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); }

    .step-info h4 {
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .step-info p {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    /* Test Trigger Buttons */
    .quick-tests {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .test-btn {
      padding: 0.75rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s;
    }

    .test-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: var(--accent-secondary);
    }

    .badge-code {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-secondary);
    }

    /* Footer info */
    footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: var(--text-dim);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
      margin-left: 1rem;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: var(--accent-primary);
    }
  </style>
</head>
<body>
  <div class="ambient-glow glow-1"></div>
  <div class="ambient-glow glow-2"></div>
  <div class="ambient-glow glow-3"></div>

  <div class="wrapper">
    <!-- Header -->
    <header>
      <div class="brand">
        <div class="brand-logo">⚡</div>
        <div class="brand-title">
          <h1>Hyper-Flow</h1>
          <p>The "Combo Letal" — Bun + Hono + Deno Deploy</p>
        </div>
      </div>
      <div class="nav-actions">
        <button class="btn-outline" onclick="pingHealth()">
          <span class="pulse-dot"></span>
          <span id="ping-text">Ping: -- ms</span>
        </button>
        <a href="/doc" class="btn-outline" target="_blank">
          📖 Scalar API Docs
        </a>
        <a href="/api/v1/openapi.json" class="btn-outline" target="_blank">
          📑 OpenAPI Spec
        </a>
        <a href="https://github.com" class="btn-primary" target="_blank">
          🚀 Pipeline CI/CD
        </a>
      </div>
    </header>

    <!-- Metrics HUD -->
    <section class="hud-grid">
      <div class="hud-card">
        <div class="hud-label">
          <span>Active Runtime</span>
          <span id="runtime-icon">⚡</span>
        </div>
        <div class="hud-value" id="hud-runtime">Detecting...</div>
        <div class="hud-sub">Auto-detected server core</div>
      </div>

      <div class="hud-card">
        <div class="hud-label">
          <span>Edge Health Status</span>
          <div class="pulse-dot"></div>
        </div>
        <div class="hud-value" id="hud-status" style="color: var(--accent-emerald);">ONLINE</div>
        <div class="hud-sub" id="hud-uptime">Uptime: 0.0s</div>
      </div>

      <div class="hud-card">
        <div class="hud-label">
          <span>Roundtrip Latency</span>
          <span>⚡</span>
        </div>
        <div class="hud-value" id="hud-latency">-- ms</div>
        <div class="hud-sub">Sub-millisecond local routing</div>
      </div>

      <div class="hud-card">
        <div class="hud-label">
          <span>Architecture Stack</span>
          <span>💎</span>
        </div>
        <div class="hud-value" style="font-size: 1.15rem; color: #a78bfa;">Bun + Hono + Deno</div>
        <div class="hud-sub">Zero Cold-Start Edge API</div>
      </div>
    </section>

    <!-- Workspace Columns -->
    <main class="workspace-grid">
      <!-- Left Column: Interactive Edge AI Playground -->
      <section class="glass-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">
              <span>🧠</span> Edge AI Live Playground
            </div>
            <div class="panel-subtitle">Ejecuta inferencias en milisegundos con validación Zod estricta</div>
          </div>
          <span class="badge-code" id="ai-status-badge">POST /api/v1/ai/generate</span>
        </div>

        <div class="form-group">
          <label>Topic Preset</label>
          <div class="topic-pills">
            <button class="pill-btn active" onclick="setTopic('quantum-physics', 'Explica el entrelazamiento cuántico en una frase')">⚛️ Quantum Physics</button>
            <button class="pill-btn" onclick="setTopic('edge-architecture', '¿Por qué Hono + Bun + Deno Deploy supera a Node tradicional?')">🌐 Edge Tech</button>
            <button class="pill-btn" onclick="setTopic('devsecops', '¿Cómo complementar Nemesis con un pipeline de entrega continua?')">🛡️ DevSecOps</button>
            <button class="pill-btn" onclick="setTopic('performance', 'Calcula la reducción de costes de CI al pasar de NPM a Bun')">📊 FinOps</button>
          </div>
        </div>

        <div class="form-group">
          <label for="ai-prompt">Prompt de Entrada</label>
          <textarea id="ai-prompt" placeholder="Escribe tu consulta para procesar en el Edge...">Explica el entrelazamiento cuántico en una frase</textarea>
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
            <label>Temperature (Creatividad)</label>
            <span class="slider-val" id="temp-val">0.7</span>
          </div>
          <div class="slider-container">
            <input type="range" id="ai-temp" min="0" max="2" step="0.1" value="0.7" oninput="document.getElementById('temp-val').textContent = this.value">
          </div>
        </div>

        <button class="btn-primary" style="width: 100%; justify-content: center; padding: 0.9rem;" onclick="runAiInference()" id="ai-submit-btn">
          <span>⚡ Ejecutar en el Edge</span>
          <span style="font-size: 0.75rem; opacity: 0.8;">(Ctrl + Enter)</span>
        </button>

        <!-- Terminal Output -->
        <div class="terminal-box">
          <div class="terminal-bar">
            <div class="terminal-dots">
              <div class="dot dot-red"></div>
              <div class="dot dot-yellow"></div>
              <div class="dot dot-green"></div>
            </div>
            <div class="terminal-title" id="terminal-status">inference-stream.json (Ready)</div>
            <div class="terminal-title" id="terminal-latency" style="color: var(--accent-emerald);">0 ms</div>
          </div>
          <div class="terminal-body" id="terminal-output">
            <pre>// Las respuestas de la inferencia Edge aparecerán aquí formateadas con telemetría en tiempo real...</pre>
          </div>
        </div>
      </section>

      <!-- Right Column: Architecture & Instant Test Runner -->
      <section style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Architecture Workflow Card -->
        <div class="glass-panel">
          <div class="panel-header">
            <div>
              <div class="panel-title">
                <span>🚀</span> El "Combo Letal" Pipeline
              </div>
              <div class="panel-subtitle">Sinergia entre los 3 motores</div>
            </div>
          </div>

          <div class="arch-flow">
            <div class="flow-step">
              <div class="step-icon icon-bun">⚡</div>
              <div class="step-info">
                <h4>1. Bun Runner</h4>
                <p>Instala dependencias y corre 9 tests en ~300ms en CI/CD.</p>
              </div>
            </div>

            <div class="flow-step">
              <div class="step-icon icon-hono">🔥</div>
              <div class="step-info">
                <h4>2. Hono Framework</h4>
                <p>Core isomórfico con Web Standards, Zod & OpenAPI 3.1.</p>
              </div>
            </div>

            <div class="flow-step">
              <div class="step-icon icon-deno">🦕</div>
              <div class="step-info">
                <h4>3. Deno Deploy</h4>
                <p>Despliegue distribuido en 35 regiones con cold-starts de ~0ms.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick API Endpoint Inspector -->
        <div class="glass-panel" style="flex: 1;">
          <div class="panel-header">
            <div>
              <div class="panel-title">
                <span>🩺</span> Inspector de Endpoints
              </div>
              <div class="panel-subtitle">Haz clic para probar respuestas reales del servidor</div>
            </div>
          </div>

          <div class="quick-tests">
            <button class="test-btn" onclick="testEndpoint('/health')">
              <span>GET /health</span>
              <span class="badge-code">200 OK</span>
            </button>
            <button class="test-btn" onclick="testEndpoint('/api/v1/info')">
              <span>GET /info</span>
              <span class="badge-code">Meta</span>
            </button>
          </div>

          <div class="terminal-box" style="margin-top: 0.5rem;">
            <div class="terminal-bar">
              <span class="terminal-title" id="inspector-endpoint">Output Console</span>
              <span class="badge-code" id="inspector-code">Ready</span>
            </div>
            <div class="terminal-body" id="inspector-output" style="max-height: 180px; color: #a5b4fc;">
              <pre>// Haz clic en cualquiera de los botones de prueba superiores para inspeccionar la carga útil en vivo.</pre>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer>
      <div>Hyper-Flow Edge Core • Desplegado en Deno Deploy & Desarrollado con Bun</div>
      <div class="footer-links">
        <a href="/doc">Scalar Docs</a>
        <a href="/api/v1/openapi.json">OpenAPI Spec</a>
        <a href="/health">Healthcheck</a>
      </div>
    </footer>
  </div>

  <script>
    let currentTopic = 'quantum-physics';

    function setTopic(topic, defaultPrompt) {
      currentTopic = topic;
      document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      if (defaultPrompt) {
        document.getElementById('ai-prompt').value = defaultPrompt;
      }
    }

    async function pingHealth() {
      const pingText = document.getElementById('ping-text');
      const start = performance.now();
      try {
        const res = await fetch('/health');
        const elapsed = Math.round(performance.now() - start);
        const data = await res.json();
        
        pingText.textContent = \`Ping: \${elapsed} ms\`;
        document.getElementById('hud-latency').textContent = \`\${elapsed} ms\`;
        document.getElementById('hud-runtime').textContent = data.runtime.toUpperCase();
        document.getElementById('hud-uptime').textContent = \`Uptime: \${data.uptimeSeconds}s\`;
        document.getElementById('runtime-icon').textContent = data.runtime === 'bun' ? '⚡' : '🦕';
      } catch (err) {
        pingText.textContent = 'Offline';
      }
    }

    async function runAiInference() {
      const prompt = document.getElementById('ai-prompt').value.trim();
      const temperature = parseFloat(document.getElementById('ai-temp').value);
      const submitBtn = document.getElementById('ai-submit-btn');
      const terminalOutput = document.getElementById('terminal-output');
      const terminalLatency = document.getElementById('terminal-latency');
      const terminalStatus = document.getElementById('terminal-status');

      if (!prompt) {
        alert('Por favor escribe un prompt');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      terminalStatus.textContent = 'Processing in Edge Runtime...';

      const start = performance.now();
      try {
        const res = await fetch('/api/v1/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, topic: currentTopic, temperature })
        });
        
        const latency = Math.round(performance.now() - start);
        const json = await res.json();
        
        terminalLatency.textContent = \`\${latency} ms\`;
        terminalStatus.textContent = \`HTTP \${res.status} OK • \${json.runtime}\`;
        terminalOutput.innerHTML = \`<pre>\${JSON.stringify(json, null, 2)}</pre>\`;
      } catch (e) {
        terminalStatus.textContent = 'Request Error';
        terminalOutput.innerHTML = \`<pre style="color: #ef4444;">Error de red al invocar la API Edge: \${e.message}</pre>\`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }

    async function testEndpoint(path) {
      const output = document.getElementById('inspector-output');
      const endpoint = document.getElementById('inspector-endpoint');
      const code = document.getElementById('inspector-code');
      
      endpoint.textContent = path;
      code.textContent = 'Fetching...';
      
      try {
        const res = await fetch(path);
        const json = await res.json();
        code.textContent = \`HTTP \${res.status}\`;
        output.innerHTML = \`<pre>\${JSON.stringify(json, null, 2)}</pre>\`;
      } catch (e) {
        code.textContent = 'ERR';
        output.innerHTML = \`<pre style="color: #ef4444;">\${e.message}</pre>\`;
      }
    }

    // Keyboard shortcut (Ctrl + Enter)
    document.getElementById('ai-prompt').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        runAiInference();
      }
    });

    // Initial ping on load
    window.addEventListener('DOMContentLoaded', () => {
      pingHealth();
      setInterval(pingHealth, 10000);
    });
  </script>
</body>
</html>`;
}
