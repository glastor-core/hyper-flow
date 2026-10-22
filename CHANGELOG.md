# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Rate limiting middleware para protección perimetral DoS en `/api/v1/ai/generate`.
- Integración directa con proveedores de LLM reales (OpenAI, Groq) manteniendo el simulador Edge como fallback de ultra-baja latencia.

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

### Changed
- **Alineación con Rama `master`**: Actualizados los triggers y condiciones de despliegue en `.github/workflows/edge-pipeline.yml` para soportar plenamente la rama `master`.
- **Compatibilidad Multi-Runtime Unificada**: Implementación de helper `getEnv` en `src/db/client.ts` con soporte transparente para `Deno.env.get()` y `process.env`.

[Unreleased]: https://github.com/glastor-core/hyper-flow/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/glastor-core/hyper-flow/releases/tag/v1.0.0
