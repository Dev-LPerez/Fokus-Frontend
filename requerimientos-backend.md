# Requerimientos del Backend — Agente de IA con Function Calling

> Este documento sirve como contexto de referencia para el desarrollo. Debe mantenerse actualizado a medida que el proyecto evolucione.

**Stack:** FastAPI · Gemini API (`google-genai`) · Supabase (PostgreSQL & Supabase Auth) · Despliegue en Render
**Presupuesto:** $0 (exclusivamente servicios en tier gratuito)

---

## 1. Requerimientos funcionales (RF)

### 1.1 Chat
- RF-01: El sistema debe exponer un endpoint que reciba un mensaje de texto del usuario y devuelva la respuesta del agente.
- RF-02: La respuesta debe entregarse en modo streaming (Server-Sent Events), no como bloque único.
- RF-03: Cada mensaje (usuario y asistente) debe persistirse en la base de datos, asociado a una conversación.
- RF-04: El sistema debe soportar múltiples conversaciones independientes (historial separado por conversación).

### 1.2 Agente / Function calling
- RF-05: El agente debe decidir de forma autónoma si un mensaje requiere ejecutar una función (tool) o si puede responder directamente con texto.
- RF-06: El sistema debe soportar, como mínimo, estas tools en el MVP:
  - `get_weather(city)` — clima actual de una ciudad
  - `create_reminder(description, due_date)` — crear un recordatorio
  - `search_web(query)` — búsqueda de información en la web
- RF-07: El agente debe poder encadenar más de una llamada a función dentro de la misma respuesta si el mensaje lo requiere.
- RF-08: Si una función falla (timeout, error de API externa, etc.), el sistema debe capturar el error y permitir que el agente lo comunique al usuario de forma clara, sin romper la respuesta completa.
- RF-09: El sistema debe emitir eventos intermedios (vía streaming) indicando qué función se está ejecutando, para que el frontend pueda mostrarlo.

### 1.3 Gestión de datos
- RF-10: El sistema debe exponer endpoints para listar, consultar y eliminar conversaciones.
- RF-11: El sistema debe exponer un endpoint que liste las tools disponibles con su nombre y descripción (consumido por el frontend). [Implementado]
- RF-12: Los recordatorios creados por la tool `create_reminder` deben quedar consultables y persistidos en base de datos. [Implementado]

### 1.4 Salud del servicio
- RF-13: El sistema debe exponer un endpoint `GET /health` que confirme que el servicio y la conexión a base de datos están operativos (sin autenticación).

### 1.5 Autenticación y Gestión de Usuarios (Supabase Auth)
- RF-14: Todo endpoint que exponga datos (`/chat`, `/conversations/*`) debe requerir un token JWT válido de Supabase en el header `Authorization: Bearer <token>`.
- RF-15: Cada conversación y cada recordatorio deben quedar asociados al `user_id` del usuario autenticado que los creó.
- RF-16: Un usuario solo puede ver, listar o eliminar sus propias conversaciones — nunca las de otro usuario (aislamiento total, retornando 404 ante intentos no autorizados).

---

## 2. Requerimientos no funcionales (RNF)

- RNF-01: **Costo cero** — ningún componente del backend debe requerir tarjeta de crédito ni exceder límites de tier gratuito bajo uso normal de desarrollo/demo.
- RNF-02: **Rate limiting de Gemini** — el cliente de Gemini debe implementar retry con backoff exponencial (~15 req/min en el tier free) para evitar fallos por límite excedido.
- RNF-03: **Latencia aceptable** — la primera respuesta en streaming debe iniciar en menos de 3-5 segundos bajo condiciones normales (excluyendo cold start de Render tras inactividad).
- RNF-04: **Cold start conocido** — el servicio en Render puede tardar hasta ~50 segundos en responder tras un periodo de inactividad; esto es una limitación aceptada del tier gratuito, no un bug.
- RNF-05: **Seguridad de credenciales** — ninguna API key (`GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, `DATABASE_URL`) debe quedar hardcodeada en el código ni expuesta en logs; todas se manejan vía variables de entorno.
- RNF-06: **Modularidad de tools** — cada función del agente debe poder añadirse o quitarse sin modificar el orquestador central (patrón de registro de tools).
- RNF-07: **Separación de capas** — el código debe distinguir claramente entre routers (HTTP), services (lógica de negocio/orquestación), models/schemas (datos) y core/auth (seguridad).
- RNF-08: **Manejo de errores consistente** — todos los endpoints deben devolver errores HTTP con estructura predecible (código, mensaje), sin exponer stack traces al cliente.
- RNF-09: **CORS configurado** — el backend debe permitir peticiones desde el dominio del frontend en Vercel (y `localhost` en desarrollo).
- RNF-10: **Verificación local de JWT** — la verificación del JWT de Supabase se realiza localmente en el backend usando firmas asimétricas/JWKS (ES256/RS256) con caché en memoria, sin añadir llamadas HTTP adicionales a Supabase en cada request.

---

## 3. Requerimientos técnicos

### 3.1 Dependencias (`requirements.txt`)
```text
fastapi==0.141.1
uvicorn[standard]==0.52.4
google-genai==2.19.0
sqlalchemy[asyncio]==2.0.52
asyncpg==0.31.0
alembic==1.19.1
pydantic-settings==2.15.0
python-dotenv==1.2.3
httpx==0.28.1
tenacity==9.1.4
beautifulsoup4==4.15.0
pyjwt[crypto]==2.13.0
tzdata==2026.3
pytest==9.1.1
pytest-asyncio==1.4.0
pytest-mock==3.15.1
respx==0.23.1
aiosqlite==0.22.1
```

### 3.2 Variables de entorno requeridas
| Variable | Descripción |
|---|---|
| `GEMINI_API_KEY` | API key del proyecto en Google AI Studio |
| `DATABASE_URL` | Cadena de conexión async a Supabase (`postgresql+asyncpg://...`) |
| `OPENWEATHER_API_KEY` | API key gratuita de OpenWeatherMap |
| `SUPABASE_URL` | URL del proyecto en Supabase (ej. `https://xxxx.supabase.co`) para JWKS |
| `ENVIRONMENT` | `development` \| `production` |
| `FRONTEND_URL` | URL del frontend en Vercel, para configurar CORS |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` |
| `GEMINI_FALLBACK_MODEL` | `gemini-3.1-flash-lite` |

### 3.3 Modelo de datos

```sql
conversations
  id UUID PK
  user_id UUID NOT NULL (INDEX)
  title TEXT
  created_at TIMESTAMPTZ

messages
  id UUID PK
  conversation_id UUID FK -> conversations.id (CASCADE)
  role TEXT CHECK (role IN ('user','assistant','tool'))
  content TEXT
  tool_name TEXT NULL
  created_at TIMESTAMPTZ

reminders
  id UUID PK
  user_id UUID NOT NULL (INDEX)
  description TEXT NOT NULL
  due_date TIMESTAMPTZ
  created_at TIMESTAMPTZ
```

### 3.4 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/chat` | Bearer JWT | Enviar mensaje, respuesta en streaming (SSE) o JSON |
| GET | `/conversations` | Bearer JWT | Listar conversaciones del usuario actual |
| GET | `/conversations/{id}` | Bearer JWT | Historial de una conversación del usuario actual |
| DELETE | `/conversations/{id}` | Bearer JWT | Eliminar conversación del usuario actual |
| GET | `/tools` | Pública | Listar tools disponibles del agente |
| GET | `/health` | Pública | Verificación de estado del servicio y base de datos |

---

## 4. Riesgos conocidos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Rate limit de Gemini (~15 req/min) | Retry con backoff exponencial (`tenacity`) + Fallback a `gemini-3.1-flash-lite` |
| Cold start de Render tras inactividad | Endpoint `/health`, aviso en frontend, no tratar como error |
| Supabase se pausa por inactividad | Aceptado como limitación del tier gratuito |
| Fallo de una tool externa (clima, búsqueda) | Captura de excepción por tool, respuesta controlada al agente en vez de error 500 |
| Latencia en validación de tokens | Validación local con JWKS cacheado en memoria (sin round-trips a Supabase) |

---

## 5. Fuera de alcance del MVP

- Memoria vectorial / RAG sobre documentos — posible extensión futura
- Notificaciones push para recordatorios — posible extensión futura