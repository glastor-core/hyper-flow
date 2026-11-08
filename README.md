<div align="center">

# 🚀 Hyper-Flow

### *Ultra-Fast Edge AI Gateway & CI/CD Master Pipeline*

[![Edge Pipeline](https://github.com/glastor-core/hyper-flow/actions/workflows/edge-pipeline.yml/badge.svg)](https://github.com/glastor-core/hyper-flow/actions/workflows/edge-pipeline.yml)
[![Security Audit](https://github.com/glastor-core/hyper-flow/actions/workflows/security-audit.yml/badge.svg)](https://github.com/glastor-core/hyper-flow/actions/workflows/security-audit.yml)
[![Release](https://img.shields.io/github/v/release/glastor-core/hyper-flow?color=6366f1&label=Release&logo=github)](https://github.com/glastor-core/hyper-flow/releases/latest)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1.0-06b6d4?logo=openapi-initiative&logoColor=white)](https://github.com/glastor-core/hyper-flow/blob/master/openapi.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](LICENSE)

<p align="center">
  <b>High-performance AI inference in the Edge powered by the <i>Lethal Combo</i>:</b><br/>
  <b>Bun</b> (ultra-fast dev & test runner) • <b>Deno Deploy</b> (sub-3s multi-region edge hosting) • <b>Hono v4</b> (Web-standard REST API).
</p>

[Architecture](#-architecture) • [Features](#-core-capabilities) • [Tech Stack](#-tech-stack) • [Quickstart](#-quickstart) • [API Reference](#-api-endpoints) • [Ecosystem Synergy](#-glastor-ecosystem-synergy)

---

</div>

## ⚡ Architecture

Hyper-Flow couples an Edge AI Gateway with an automated DevSecOps CI/CD pipeline integrated with the GLASTOR® ecosystem (`specter@v1`, `vortex@v1`, `nemesis@v1`).

<div align="center">

![Hyper-Flow Edge AI Gateway Architecture](assets/architecture.svg)

</div>

---

## ✨ Core Capabilities

<table>
<tr>
<td width="50%" valign="top">

### 🧠 Multi-Provider Edge AI Gateway
- **Native Groq & OpenAI Adapters**: Sub-300ms ultra-fast inference with `llama-3.3-70b-versatile` or `gpt-4o-mini`.
- **Zero-Dependency Fallback**: Deterministic synthetic Edge completion if external networks or providers timeout.
- **Strict Latency Budget**: Enforced timeouts via `AbortController` (`AI_TIMEOUT_MS`).

</td>
<td width="50%" valign="top">

### 🛡️ Edge Perimeter & Security
- **Sliding-Window Rate Limiter**: Compatible with Edge memory, automated periodic cleanups and RFC headers (`X-RateLimit-*`, `Retry-After`).
- **Flexible API Key Protection**: Configurable per-route auth via `Authorization: Bearer <key>` or `X-API-Key`.
- **OWASP Hardening**: `nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin` and configurable `ALLOWED_ORIGINS`.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📖 Live OpenAPI 3.1 & Scalar Docs
- **Zero Drift**: Generated directly from `@hono/zod-openapi` schema definitions.
- **Interactive UI**: Embedded Scalar API Reference served at `/doc`.
- **Machine Contract**: Raw OpenAPI 3.1 specification at `/api/v1/openapi.json` and attached to GitHub Releases.

</td>
<td width="50%" valign="top">

### 🗄️ Resilient Edge Database
- **Readiness Probes**: Active `GET /health/ready` connection check (`SELECT 1`) distinguishing Liveness from Readiness.
- **Privacy & Compliance**: Configurable data retention (`STORE_PROMPTS_CONTENT=false`) redacting plain text prompts to `[REDACTED_FOR_PRIVACY]`.
- **Non-blocking Telemetry**: Edge persistence with Drizzle ORM + LibSQL.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Web Engine** | [Hono](https://hono.dev) | `^4.7.2` | Ultra-lightweight Web-standard request/response framework. |
| **Contracts & Validation** | [Zod](https://zod.dev) + `@hono/zod-openapi` | `^3.24.2` | Type-safe declarative schemas and OpenAPI 3.1 generation. |
| **Interactive Docs** | [Scalar](https://scalar.com) | `^0.5.168` | Modern, responsive API Reference theme at `/doc`. |
| **Development & Testing** | [Bun](https://bun.sh) | `^1.3` | Instant local server execution and test runs in `< 300ms`. |
| **Production Target** | [Deno Deploy](https://console.deno.com) | `v2.x` | Global serverless deployment across 35+ regions with ~0ms cold starts. |
| **Persistence** | [Drizzle ORM](https://orm.drizzle.team) + LibSQL | `^0.45.4` | Edge-native SQL queries and schema migrations. |
| **Ecosystem Auditing** | [GLASTOR® Suite](https://github.com/glastor-core) | `v1` | `specter@v1` (AST contract), `vortex@v1` (AST CI), `nemesis@v1` (DevSecOps). |

---

## 🚀 Quickstart

### Prerequisites
- [Bun](https://bun.sh) (`v1.2+`) installed locally, or [Deno](https://deno.com) (`v2.0+`).

### 1. Clone & Install
```bash
git clone https://github.com/glastor-core/hyper-flow.git
cd hyper-flow
bun install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Run Schema Migrations
```bash
bun run db:migrate
```

### 4. Start Development Server

```bash
# Option A — Bun (Fastest local feedback loop)
bun run dev

# Option B — Deno (Emulate Deno Deploy edge runtime)
bun run deno:dev
```

Server listening at `http://localhost:8000`:
* 📊 **Dashboard:** [http://localhost:8000/](http://localhost:8000/)
* 📚 **API Docs (Scalar):** [http://localhost:8000/doc](http://localhost:8000/doc)
* 📜 **OpenAPI Spec:** [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)
* 🩺 **Liveness Probe:** [http://localhost:8000/health](http://localhost:8000/health)
* 🗄️ **Readiness Probe:** [http://localhost:8000/health/ready](http://localhost:8000/health/ready)

---

## 🧪 Tests & Quality Gates

Run tests, typechecking, and AI regression evals locally:

```bash
# Run complete test suite (Unit Tests + AI Evals)
bun test

# Run endpoint contract tests only
bun run test:api

# Run AI prompt & latency budget regression evals
bun run test:evals

# Strict TypeScript compiler verification
bun run typecheck
```

---

## 🌐 API Endpoints

### Endpoint Summary

| Method | Route | Description | Auth | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/health` | Liveness probe (uptime, runtime, version) | Public | ✕ |
| `GET` | `/health/ready` | Readiness probe (database connectivity `SELECT 1`) | Public | ✕ |
| `GET` | `/api/v1/info` | Architecture metadata & active AI provider | Public | ✕ |
| `POST` | `/api/v1/ai/generate` | Edge AI inference with multi-provider fallback | Optional / Key | 60 req/min |
| `GET` | `/api/v1/openapi.json` | OpenAPI 3.1.0 JSON contract specification | Public | ✕ |
| `GET` | `/doc` | Interactive Scalar API Reference UI | Public | ✕ |
| `GET` | `/` | Real-time Glassmorphism Control Center | Public | ✕ |

<details>
<summary><b>🔍 Sample Request & Responses (Click to expand)</b></summary>

#### `POST /api/v1/ai/generate`
```bash
curl -X POST http://localhost:8000/api/v1/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPTIONAL_API_KEY" \
  -d '{
    "prompt": "Explain edge computing in one sentence",
    "topic": "cloud",
    "temperature": 0.7
  }'
```

```json
{
  "id": "ai_1731063600000_abc12",
  "prompt": "Explain edge computing in one sentence",
  "topic": "cloud",
  "response": "Edge computing processes data closer to where it is generated, drastically minimizing latency and bandwidth usage.",
  "latencyMs": 28,
  "runtime": "deno",
  "provider": "groq",
  "model": "llama-3.3-70b-versatile",
  "timestamp": "2026-11-08T10:00:00.000Z"
}
```

#### `GET /health/ready`
```json
{
  "status": "ready",
  "database": "connected",
  "uptimeSeconds": 142.5,
  "runtime": "deno",
  "timestamp": "2026-11-08T10:00:00.000Z"
}
```

</details>

---

## ⚙️ Configuration & Secrets

<details>
<summary><b>📋 Environment Variables Reference (.env)</b></summary>

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `8000` | Local HTTP listening port. |
| `NODE_ENV` | `development` | Environment mode (`production` sanitizes stack traces). |
| `HYPERFLOW_API_KEY` | *(empty)* | When set, enforces API key check on `/api/v1/ai/*`. |
| `ALLOWED_ORIGINS` | *(empty = `*`)* | Comma-separated CORS allowed origins list. |
| `RATE_LIMIT_ENABLED` | `true` | Enables sliding-window edge rate limiting. |
| `RATE_LIMIT_MAX_REQ` | `60` | Maximum requests permitted per sliding window. |
| `RATE_LIMIT_WINDOW_SEC` | `60` | Duration of the rate limiting window in seconds. |
| `STORE_PROMPTS_CONTENT`| `true` | If `false`, redacts prompts before database write. |
| `DATABASE_URL` | `file:local.db` | SQLite path or remote LibSQL / Turso connection URL. |
| `DATABASE_AUTH_TOKEN` | *(empty)* | Authentication token for remote LibSQL / Turso. |
| `GROQ_API_KEY` | *(empty)* | Groq API Key for ultra-fast Llama-3.3 inference. |
| `OPENAI_API_KEY` | *(empty)* | OpenAI API Key for GPT models. |
| `AI_API_BASE_URL` | *(empty)* | Custom OpenAI-compatible base URL (e.g. Ollama, vLLM). |
| `AI_TIMEOUT_MS` | `8000` | Gateway upstream timeout before falling back to synthetic. |

</details>

<details>
<summary><b>🔐 GitHub Repository Secrets for Actions Deployment</b></summary>

Configure these in **Settings -> Secrets and variables -> Actions**:

* `DENO_DEPLOY_TOKEN`: *(Required for production)* Access token from [Deno Deploy Console](https://console.deno.com).
* `DATABASE_URL`: *(Optional)* Production Turso/LibSQL database URL.
* `DATABASE_AUTH_TOKEN`: *(Optional)* Production database token.
* `GROQ_API_KEY` / `OPENAI_API_KEY`: *(Optional)* Production LLM provider credentials.
* `HYPERFLOW_API_KEY`: *(Optional)* Production perimeter protection key.

</details>

---

## 🛡️ GLASTOR® Ecosystem Synergy

Hyper-Flow seamlessly integrates official GLASTOR® DevSecOps tools with **zero collisions and zero commit races**:

<div align="center">

![GLASTOR Ecosystem Synergy](assets/ecosystem-synergy.svg)

</div>

| Component | Responsibility | Anti-Conflict & Gatekeeper Role |
| :--- | :--- | :--- |
| 👻 **[Specter (`@v1`)](https://github.com/glastor-core/specter)** | **API Contract & SemVer Audit** | Scans 24 exported TypeScript AST symbols in `< 10ms`. Catches *Trojan Breaking Changes* and exports SARIF + CycloneDX 1.5 SBOM reports. |
| 🌪️ **[Vortex (`@v1`)](https://github.com/glastor-core/vortex)** | **Predictive CI & LPT Sharding** | Builds AST blast-radius DAG (`src/**` → `test/**`), balancing test suites across parallel runners to reduce CI wall-clock time by ~26%. |
| 🛡️ **[Nemesis (`@v1`)](https://github.com/glastor-core/nemesis)** | **Continuous DevSecOps** | Scans secrets, SAST, SCA, licenses, and hygiene with `fail-on-critical: true` in `.github/workflows/security-audit.yml`. |
| 🏷️ **Hyper-Flow Auto-Triage** | **Repository Management** | Automatically tags PRs (`area:database`, `area:ai-gateway`, `area:ci-cd`) via GitHub REST API without modifying commit history. |
| 🛡️ **Ephemeral PR Isolation** | **Supply-Chain Defense** | Pull Requests run migrations against ephemeral SQLite databases with **zero production secrets**. |
| 📦 **Smart SemVer Bumper** | **Automated Releases** | Intelligently calculates next version (`feat:` → minor, `fix:` → patch, `!` → major) and attaches `OpenAPI-3.1-Contract.json`. |

---

<div align="center">

<sub>© 2010–2026 [GLASTOR®](https://glastor.es/) (INPI Reg. 4559568 & 4559567) • Dual-Hub Operations (Spain & Argentina · Factura E) • Led by [@glastor-dev](https://github.com/glastor-dev) (GitHub Developer Program Member).</sub>

</div>
