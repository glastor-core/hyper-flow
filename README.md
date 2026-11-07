# 🚀 Hyper-Flow — Edge AI Gateway & CI/CD Master Pipeline

> **API de IA de Alto Rendimiento en el Edge.**\
> Implementando el *"Combo Letal"*: **Bun** (desarrollo, instalación ultra-rápida y tests), **Deno / Deno Deploy** (runtime de producción Edge y despliegue global en < 3s) y **Hono** (framework web estándar con OpenAPI & Scalar).

---

## ⚡ Arquitectura del "Combo Letal" & Pipeline Blindado

```
[ Desarrollador / GitHub PR ]
              │
              ▼
    ╔═══════════════════════════════════════════════════════╗
    ║       GitHub Actions Master Pipeline                  ║
    ╠═══════════════════════════════════════════════════════╣
    ║ 1. ⚡ Bun Runner + Specter & Vortex AST (< 5s)        ║
    ║    • bun install --frozen-lockfile                    ║
    ║    • bun run typecheck (Strict TypeScript)            ║
    ║    • glastor-core/specter@v1 (API Contract & SemVer)  ║
    ║    • glastor-core/vortex@v1 (AST Impact & LPT Shards) ║
    ║    • bun test (Unit Tests + AI Evals)                 ║
    ║                                                       ║
    ║ 2. 🛡️ DevSecOps & Secret Scan                         ║
    ║    • glastor-core/nemesis@v1 (SAST/SCA/SARIF/SBOM)    ║
    ║                                                       ║
    ║ 3. 🗄️ Aislamiento de Base de Datos                    ║
    ║    • PR: SQLite Efímero (Zero secretos de producción) ║
    ║    • Push Master: Migración con credenciales seguras  ║
    ║                                                       ║
    ║ 4. 🚀 Deno Deploy (Deno 2 CLI Nativo < 3s)            ║
    ║    • Despliegue seguro a console.deno.com             ║
    ║                                                       ║
    ║ 5. 🩺 Post-Deploy Verification Estricto               ║
    ║    • Smoke Test /health (Liveness & Latency Budget)   ║
    ║    • Falla inmediatamente (exit 1) ante errores HTTP  ║
    ║                                                       ║
    ║ 6. 📦 Automated Release & Smart SemVer                ║
    ║    • Bumping semántico según commits (feat/fix/break) ║
    ║    • Publicación de release y asset OpenAPI 3.1       ║
    ╚═══════════════════════════════════════════════════════╝
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Rol Principal |
| :--- | :--- | :--- |
| **Framework Web** | [Hono v4](https://hono.dev) | Rápido, ligero, estándar Web (`Fetch/Request/Response`). |
| **Documentación** | `@hono/zod-openapi` + `@scalar/hono-api-reference` | Especificación OpenAPI 3.1 viva con UI moderna en `/doc`. |
| **Test Runner & Dev** | [Bun](https://bun.sh) | Instalación en segundos y tests en < 200ms en CI/CD. |
| **Edge Hosting** | [Deno Deploy](https://console.deno.com) | Despliegue en 35+ regiones en milisegundos con cold starts de ~0ms. |
| **Base de Datos** | [Drizzle ORM](https://orm.drizzle.team) + LibSQL / SQLite | Compatible nativo con Edge, transacciones rápidas. |
| **Motor de Inferencia** | Adaptador Multi-Proveedor | Soporte nativo para **Groq** (<300ms), **OpenAI**, compatibles y fallback Edge sintético. |

---

## 🚀 Inicio Rápido Local

### Requisitos
* [Bun](https://bun.sh) (v1.2+) o [Deno](https://deno.com) (v2.0+)

### 1. Clonar e Instalar
```bash
bun install
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

### 3. Ejecutar Migraciones de Base de Datos
```bash
bun run db:migrate
```

### 4. Iniciar el Servidor de Desarrollo

**Opción A — Con Bun (Recomendado para desarrollo local):**
```bash
bun run dev
```

**Opción B — Con Deno (Para emular el runtime de Deno Deploy):**
```bash
bun run deno:dev
```

El servidor estará disponible en `http://localhost:8000`:
* **Dashboard Interactivo:** `http://localhost:8000/`
* **Documentación Interactiva (Scalar):** `http://localhost:8000/doc`
* **Especificación OpenAPI:** `http://localhost:8000/api/v1/openapi.json`
* **Liveness Probe:** `http://localhost:8000/health`
* **Readiness Probe:** `http://localhost:8000/health/ready`

---

## 🧪 Pruebas y Evaluaciones de IA

```bash
# Correr toda la suite de pruebas con Bun (< 300ms)
bun test

# Correr solo pruebas unitarias de endpoints
bun run test:api

# Correr evaluaciones de regresión de Prompts & Schemas
bun run test:evals

# Verificación de tipos estricta
bun run typecheck
```

---

## 🌐 Endpoints Principales

### `GET /health` (Liveness Probe)
Devuelve el estado de la instancia, tiempo activa y runtime activo (`bun`, `deno`, etc.):
```json
{
  "status": "healthy",
  "uptimeSeconds": 14.2,
  "runtime": "deno",
  "timestamp": "2026-10-24T12:00:00.000Z",
  "version": "1.0.0"
}
```

### `GET /health/ready` (Readiness Probe)
Verifica activamente la conectividad con la base de datos de Edge (`SELECT 1`):
```json
{
  "status": "ready",
  "database": "connected",
  "uptimeSeconds": 14.2,
  "runtime": "deno",
  "timestamp": "2026-10-24T12:00:00.000Z"
}
```

### `POST /api/v1/ai/generate` (Inferencia Edge)
Punto de entrada de inferencia en el Edge validado con Zod, protegido con Rate Limiter y API Key opcional:
```bash
curl -X POST http://localhost:8000/api/v1/ai/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY_OPCIONAL" \
  -d '{
    "prompt": "Explica la computación en el Edge",
    "topic": "cloud",
    "temperature": 0.7
  }'
```

---

## ⚙️ Configuración en GitHub Actions

Para habilitar el despliegue automático y seguro hacia Deno Deploy:

1. Ve a tu repositorio en GitHub: **Settings -> Secrets and variables -> Actions**.
2. Añade los siguientes secretos:
   * `DENO_DEPLOY_TOKEN`: Generado en tu cuenta de [Deno Deploy Console](https://console.deno.com).
   * `DATABASE_URL` *(Opcional)*: URL de conexión a tu base de datos Turso/LibSQL o SQLite remoto.
   * `DATABASE_AUTH_TOKEN` *(Opcional)*: Token de autenticación de tu base de datos.
   * `GROQ_API_KEY` o `OPENAI_API_KEY` *(Opcional)*: Clave de proveedor de LLM para inferencia real en producción.
   * `HYPERFLOW_API_KEY` *(Opcional)*: Clave para proteger los endpoints perimetrales con autenticación.

---

## 🛡️ Sinergia con el Ecosistema GLASTOR (`specter@v1`, `vortex@v1`, `nemesis@v1`)

Este pipeline integra nativamente las acciones oficiales de **[glastor-core](https://github.com/glastor-core)** con **cero colisiones ni carreras de commits**:

| Función | Responsable | Mecanismo Anti-Conflicto |
| :--- | :--- | :--- |
| **Auditoría de Contratos API & SemVer** | 👻 **[Specter (`@v1`)](https://github.com/glastor-core/specter)** | Audita los símbolos públicos exportados en AST TypeScript y bloquea *Trojan Breaking Changes* + genera SARIF y SBOM CycloneDX 1.5. |
| **CI Predictivo & Balanceo LPT** | 🌪️ **[Vortex (`@v1`)](https://github.com/glastor-core/vortex)** | Analiza el grafo de impacto AST (`src/**` → `test/**`), calcula el radio de explosión y particiona los shards de prueba. |
| **Seguridad (SAST/SCA/Secretos)** | 🛡️ **[Nemesis (`@v1`)](https://github.com/glastor-core/nemesis)** | Audita el código con Semgrep, Trivy y Gitleaks en `.github/workflows/security-audit.yml` con `fail-on-critical: true`. |
| **Compatibilidad con `[skip ci]`** | ⚡ **Hyper-Flow** | Hyper-Flow ignora commits `[skip ci]`, evitando builds redundantes. |
| **Clasificación y Auto-Triage** | 🏷️ **Hyper-Flow** | Etiqueta PRs (`area:database`, `area:ai-gateway`) vía API sin tocar Git. |
| **Aislamiento de Secretos en PR** | 🛡️ **Hyper-Flow** | PRs usan SQLite efímero sin acceso a secretos de producción. |
| **Pruebas y AI Evals** | ⚡ **Hyper-Flow** | 13 tests unitarios y validación de contratos de IA con Bun. |
| **Despliegue Edge Global** | 🦕 **Hyper-Flow** | Deno 2 CLI (`deno deploy`) hacia `console.deno.com`. |
| **Releases & SemVer Inteligente** | 📦 **Hyper-Flow** | Bumping inteligente (`feat:` -> minor, `fix:` -> patch, breaking -> major) y publicación del contrato OpenAPI 3.1. |
