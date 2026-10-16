# 🚀 Hyper-Flow — Edge AI API Master Pipeline

> **API de IA de Alto Rendimiento en el Edge.**\
> Implementando el *"Combo Letal"*: **Bun** (desarrollo, instalación ultra-rápida y tests), **Deno / Deno Deploy** (runtime de producción Edge y despliegue global en < 5s) y **Hono** (framework web estándar de última generación con OpenAPI & Scalar).

---

## ⚡ Arquitectura del "Combo Letal"

```
[ Desarrollador / GitHub PR ]
              │
              ▼
    ╔═══════════════════════════════════════════════╗
    ║       GitHub Actions Master Pipeline          ║
    ╠═══════════════════════════════════════════════╣
    ║ 1. ⚡ Bun Runner (< 5s)                       ║
    ║    • bun install --frozen-lockfile            ║
    ║    • bun test (Unit Tests + AI Evals)         ║
    ║                                               ║
    ║ 2. 🗄️ Edge Database Migration                 ║
    ║    • bun run db:migrate (Drizzle / LibSQL)    ║
    ║                                               ║
    ║ 3. 🚀 Deno Deploy (Edge Global < 3s)          ║
    ║    • Deployctl: Preview URL (PR) o Prod (Main)║
    ║    • Comentario automático con Swagger en PR  ║
    ║                                               ║
    ║ 4. 🩺 Post-Deploy Verification                ║
    ║    • Smoke Test de latencia (< 50ms) & Health ║
    ╚═══════════════════════════════════════════════╝
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Rol Principal |
| :--- | :--- | :--- |
| **Framework Web** | [Hono v4](https://hono.dev) | Rápido, ligero, estándar Web (`Fetch/Request/Response`). |
| **Documentación** | `@hono/zod-openapi` + `@scalar/hono-api-reference` | Especificación OpenAPI 3.1 viva con UI moderna en `/doc`. |
| **Test Runner & Dev** | [Bun](https://bun.sh) | Instalación en segundos y tests en < 200ms en CI/CD. |
| **Edge Hosting** | [Deno Deploy](https://deno.com/deploy) | Despliegue en 35+ regiones en milisegundos con cold starts de ~0ms. |
| **Base de Datos** | [Drizzle ORM](https://orm.drizzle.team) + LibSQL / SQLite | Compatible nativo con Edge, transacciones rápidas. |

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
deno task dev
# o bien:
bun run deno:dev
```

El servidor estará disponible en `http://localhost:8000`:
* **Documentación Interactiva (Scalar):** `http://localhost:8000/doc`
* **Especificación OpenAPI:** `http://localhost:8000/api/v1/openapi.json`
* **Healthcheck:** `http://localhost:8000/health`

---

## 🧪 Pruebas y Evaluaciones de IA

Este proyecto separa las pruebas tradicionales de las **evaluaciones de regresión de IA (AI Evals)**:

```bash
# Correr toda la suite de pruebas con Bun (< 300ms)
bun test

# Correr solo pruebas unitarias de endpoints
bun run test:api

# Correr evaluaciones de regresión de Prompts & Schemas
bun run test:evals
```

### ¿Qué validan las AI Evals?
1. **Conformidad Estricta de Esquema**: Asegura que el modelo siempre responda con el formato JSON y tipos validados con Zod.
2. **Presupuesto de Latencia (Latency Budget)**: Falla el pipeline si la inferencia en el edge supera el umbral estipulado.
3. **No-Regresión de Respuestas**: Garantiza que los prompts mantengan calidad ante cambios en dependencias o middleware.

---

## 🌐 Endpoints Principales

### `GET /health`
Devuelve el estado de la instancia, tiempo activa y el **runtime que la está ejecutando** (`bun`, `deno`, etc.):
```json
{
  "status": "healthy",
  "uptimeSeconds": 14.2,
  "runtime": "deno",
  "timestamp": "2026-10-16T21:40:00.000Z",
  "version": "1.0.0"
}
```

### `POST /api/v1/ai/generate`
Punto de entrada de inferencia en el Edge validado con Zod:
```bash
curl -X POST http://localhost:8000/api/v1/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explica la computación en el Edge",
    "topic": "cloud",
    "temperature": 0.7
  }'
```

---

## ⚙️ Configuración en GitHub Actions

Para habilitar el despliegue automático hacia Deno Deploy:

1. Ve a tu repositorio en GitHub: **Settings -> Secrets and variables -> Actions**.
2. Añade los siguientes secretos:
   * `DENO_DEPLOY_TOKEN`: Generado en tu cuenta de [Deno Deploy Tokens](https://dash.deno.com/account#access-tokens).
   * `DATABASE_URL` *(Opcional)*: URL de conexión a tu base de datos Turso/LibSQL o Neon Postgres.
   * `DATABASE_AUTH_TOKEN` *(Opcional)*: Token de autenticación de tu base de datos remota.

---

## 🛡️ Sinergia con Nemesis (DevSecOps)

Si usas [Nemesis](https://github.com/glastor-dev/nemesis) en tu repositorio:
* **Nemesis** se encarga de: SAST, escaneo de secretos, análisis de licencias, SBOM y auto-remediación de archivos basura.
* **Hyper-Flow Pipeline** se encarga de: Tests ultra-rápidos, AI Evals, migraciones de datos, despliegues atómicos y smoke tests de latencia.
