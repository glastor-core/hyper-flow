# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.1.0] - 2026-11-07

### Added
- **Integración del Ecosistema GLASTOR (`specter@v1`, `vortex@v1`, `nemesis@v1`)**:
  - Integrado `glastor-core/specter@v1` en `.github/workflows/edge-pipeline.yml` para auditoría AST de la superficie de API pública TypeScript / OpenAPI 3.1, detección de *Trojan Breaking Changes* y exportación de reportes SARIF 2.1.0 y CycloneDX 1.5 SBOM.
  - Integrado `glastor-core/vortex@v1` en `.github/workflows/edge-pipeline.yml` para análisis de radio de impacto AST y particionado predictivo LPT de suites de prueba en Bun.
  - Añadido workflow `.github/workflows/security-audit.yml` con `glastor-core/nemesis@v1` (`fail-on-critical: true`, SAST, SCA, escaneo de secretos, licencias, higiene, SARIF y SBOM).
  - Estandarizados los archivos de gobernanza en `.github/` (`SECURITY.md`, `CODEOWNERS`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SUPPORT.md`, `dependabot.yml` con soporte `npm` + `github-actions`, y plantillas de Issues/PRs) alineados a `glastor-core/hyper-flow`.
- **Edge AI Gateway & Adaptador Multi-Proveedor** (`src/ai/provider.ts`, `src/ai/types.ts`):
  - Integración nativa con proveedores LLM reales: **Groq** (`llama-3.3-70b-versatile`) para inferencia ultra-rápida sub-300ms en Edge, **OpenAI** (`gpt-4o-mini`) y endpoints compatibles con OpenAI (`AI_API_BASE_URL`).
  - Fallback determinista y resiliente hacia el simulador Edge sintético ante ausencia de claves de API, timeouts o fallos de red externos.
  - Control de timeouts estricto mediante `AbortController` (`AI_TIMEOUT_MS`).
- **Readiness Probe de Base de Datos** (`GET /health/ready`):
  - Separación entre Liveness (`/health`) y Readiness (`/health/ready`).
  - Verificación activa de conectividad mediante `SELECT 1` a LibSQL/SQLite, reportando estado `ready` (HTTP 200) o `degraded` (HTTP 503).
- **Autenticación Perimetral por API Key** (`src/middleware/auth.ts`):
  - Middleware de protección perimetral configurable (`HYPERFLOW_API_KEY`) mediante cabeceras `Authorization: Bearer <key>` o `X-API-Key`.
- **Protección contra Abuso y DoS (Rate Limiting en Edge)** (`src/middleware/rate-limit.ts`):
  - Algoritmo sliding-window compatible con Edge con recolección periódica de memoria y cabeceras estándar (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`).
- **Política de Privacidad y Retención de Datos**:
  - Control configurable vía `STORE_PROMPTS_CONTENT=false` para ofuscar prompts y respuestas (`[REDACTED_FOR_PRIVACY]`) en la telemetría persistida en base de datos.
- **Smart SemVer Bumper en CI/CD**:
  - Detección inteligente de Conventional Commits en GitHub Actions para distinguir bumps Major (`BREAKING CHANGE`), Minor (`feat:`) y Patch (`fix:`).

### Security
- **Aislamiento de Secretos en Pull Requests (Principio de Menor Privilegio)**:
  - Separación en dos jobs en `.github/workflows/edge-pipeline.yml`: los PRs ejecutan migraciones exclusivamente contra SQLite efímero local (`file:ephemeral-pr.db`) con **cero secretos de producción**, eliminando riesgos de ejecución de código no confiable.
- **Modernización y Desacople de Deno Deploy**:
  - Migración completa desde la acción archivada `denoland/deployctl@v1` hacia la CLI nativa de Deno 2 (`denoland/setup-deno@v2` + `deno deploy`) enlazada con `console.deno.com`.
- **Smoke Test Estricto con Fallo de Pipeline**:
  - El smoke test post-despliegue ahora falla de forma determinista (`exit 1`) si el endpoint no responde HTTP 200 o si la latencia excede el presupuesto estipulado.
- **Sanitización de Logs de Error en Producción (CWE-209)**:
  - `app.onError` omite stack traces internos en consola cuando `NODE_ENV === "production"`.
- **CORS Configurable**:
  - Soporte para orígenes restringidos vía variable de entorno `ALLOWED_ORIGINS`.

---

## [1.0.0] - 2026-10-22

### Added
- **Edge AI API Gateway**: Motor de inferencia en el Edge (`POST /api/v1/ai/generate`) con validación declarativa de esquemas con Zod y latencia sub-50ms.
- **Observabilidad & Healthcheck**: Endpoint `GET /health` con métricas de uptime en segundos, versión y detección dinámica del runtime activo (`bun`, `deno`, `cloudflare-worker`, `node`).
- **Arquitectura & Metadatos**: Endpoint `GET /api/v1/info` con especificación de la arquitectura técnica del ecosistema.
- **Documentación Interactiva Viva**:
  - Especificación OpenAPI 3.1 viva servida en `GET /api/v1/openapi.json`.
  - UI interactiva moderna con `@scalar/hono-api-reference` en `GET /doc`.
- **Dashboard Web de Control**: Interfaz Glassmorphism servida en la raíz (`GET /`) con iluminación ambiental en gradientes, métricas HUD en tiempo real, playground interactivo de prompts de IA e inspector en vivo de endpoints.
- **Capa de Persistencia Edge**: Integración con Drizzle ORM y LibSQL / SQLite (`src/db/schema.ts`, `src/db/client.ts`, `src/db/migrate.ts`) para registro no bloqueante de telemetría de inferencia.
- **Suite de Pruebas & Evaluaciones de IA (AI Evals)**:
  - Pruebas unitarias de endpoints con Bun Test Runner (`test/api.test.ts`).
  - Evaluaciones de regresión de Prompts & Esquemas con presupuesto de latencia (`test/evals.test.ts`).
- **GitHub Actions Master Pipeline** (`.github/workflows/edge-pipeline.yml`):
  - Auto-triage y etiquetado automático de Pull Requests por área de impacto.
  - Ejecución ultra-rápida de tests en Bun (< 5s).
  - Migración y sincronización de base de datos Edge.
  - Despliegue atómico a Deno Deploy con URL de preview y comentario automático en PRs.
  - Smoke test post-despliegue con verificación de presupuesto de latencia (< 50ms).
  - Versionado semántico automatizado con publicación de release y asset OpenAPI 3.1.
  - Dispatch downstream hacia repositorios cliente consumidores.

### Security
- **Prevención de Filtración de Secretos & Claves**: Blindaje de `.gitignore` con exclusión proactiva de claves criptográficas (`*.pem`, `*.key`, `*.cert`, `*.crt`, `*.pfx`, `*.p12`, `id_rsa*`, `id_ed25519*`), credenciales de nube (`credentials.json`, `service-account*.json`) y variables locales (`.dev.vars`, `.env*`).
- **Mitigación de Inyección DOM XSS (CWE-79)**: Eliminación de asignaciones directas con `.innerHTML` en el panel de control (`src/views/dashboard.ts`), implementando construcción segura de nodos del DOM mediante `document.createElement('pre')`, `textContent` y `replaceChildren()`.
- **Protección contra Divulgación de Stack Traces & Credenciales (CWE-209)**: Manejador de errores global `app.onError` en `src/server.ts` que rediseña y redacta los errores en producción evitando exponer cadenas de conexión o trazas internas.
- **Cabeceras de Seguridad OWASP & CORS**: Integración de middleware `secureHeaders` (`nosniff`, `SAMEORIGIN`, `referrerPolicy`) y `cors()` global para mitigar ataques de clickjacking y sniffing de tipos MIME.
- **Remediación de Vulnerabilidad de Dependencias (CVE-2026-39356 / GHSA-gpj5-g38j-94v9)**: Actualizado `drizzle-orm` a `^0.45.4` erradicando vulnerabilidad de inyección SQL por identificadores no escapados reportada por Dependabot.

### Changed
- **Alineación con Rama `master`**: Actualizados los triggers y condiciones de despliegue en `.github/workflows/edge-pipeline.yml` para soportar plenamente la rama `master`.
- **Compatibilidad Multi-Runtime Unificada**: Implementación de helper `getEnv` en `src/db/client.ts` con soporte transparente para `Deno.env.get()` y `process.env`.

[Unreleased]: https://github.com/glastor-core/hyper-flow/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/glastor-core/hyper-flow/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/glastor-core/hyper-flow/releases/tag/v1.0.0
