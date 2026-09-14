# Requerimientos del Frontend — Agente de IA con Function Calling

> Documento de referencia técnica. Complementa `contexto-general.md` y `requerimientos-backend.md`.

**Stack:** Next.js (App Router) · Supabase Auth (vía `@supabase/ssr`) · Tailwind CSS
**Backend consumido:** FastAPI desplegado en Render (ver `requerimientos-backend.md`)
**Presupuesto:** $0 (Vercel free tier)

---

## 1. Requerimientos funcionales (RF)

### 1.1 Autenticación
- RF-01: El usuario debe poder registrarse con email y contraseña.
- RF-02: El usuario debe poder iniciar sesión con email y contraseña.
- RF-03: El usuario debe poder cerrar sesión.
- RF-04: Las rutas del chat y del historial de conversaciones deben estar protegidas — un usuario no autenticado que intente acceder debe ser redirigido a login.
- RF-05: La sesión debe persistir entre recargas de página (cookies, no solo estado en memoria).

### 1.2 Chat
- RF-06: El usuario debe poder escribir un mensaje y enviarlo al agente.
- RF-07: La respuesta del agente debe mostrarse en streaming (token a token), consumiendo el endpoint SSE del backend.
- RF-08: Mientras el agente ejecuta una herramienta (tool), la interfaz debe mostrar un indicador visual de qué está haciendo (ej. "Consultando el clima...").
- RF-09: Los mensajes del usuario y del agente deben distinguirse visualmente (burbujas o alineación diferenciada).
- RF-10: El usuario debe poder iniciar una conversación nueva.
- RF-11: Si el backend tarda en responder (cold start de Render tras inactividad), la interfaz debe mostrar un estado de carga claro, no parecer congelada.

### 1.3 Historial de conversaciones
- RF-12: El usuario debe poder ver una lista de sus conversaciones anteriores.
- RF-13: El usuario debe poder abrir una conversación anterior y ver su historial completo de mensajes.
- RF-14: El usuario debe poder eliminar una conversación.

### 1.4 Herramientas del agente
- RF-15: La interfaz debe mostrar, en algún punto accesible (ej. sidebar o panel de ayuda), qué herramientas tiene disponibles el agente (consumiendo `GET /tools` del backend).
- RF-16: El usuario debe poder consultar detalles de cada herramienta disponible.

### 1.5 Integraciones (Google Calendar)
- RF-17: El usuario debe poder conectar y desconectar su cuenta de Google Calendar desde una sección de configuración/perfil.
- RF-18: La interfaz debe mostrar claramente si Google Calendar está conectado o no.

---

## 2. Requerimientos no funcionales (RNF)

- RNF-01: **Costo cero** — Vercel free tier, sin exceder límites de build/bandwidth bajo uso normal de desarrollo.
- RNF-02: **Responsive** — usable en móvil y escritorio.
- RNF-03: **Sesión segura** — el token de sesión de Supabase se maneja vía cookies HTTP-only mediante `@supabase/ssr`, nunca expuesto en `localStorage` ni en el código del cliente de forma manual.
- RNF-04: **Autorización consistente con el backend** — cada petición a la API del backend debe incluir el JWT de la sesión activa en el header `Authorization: Bearer <token>`.
- RNF-05: **Manejo de errores de red** — si el backend no responde (caído, cold start extendido, error 401/500), la interfaz debe informar al usuario de forma clara, sin quedarse en un estado de carga infinito.
- RNF-06: **Consistencia visual** — un único sistema de diseño (Tailwind) para toda la app, sin mezclar estilos ad-hoc.

---

## 3. Requerimientos técnicos

### 3.1 Dependencias principales
```
next
react
tailwindcss
@supabase/ssr
@supabase/supabase-js
```
Opcional según necesidad: `zustand` (estado del chat si el Context de React se queda corto), `lucide-react` (iconos).

### 3.2 Variables de entorno
| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key de Supabase (la que corresponda según el sistema de tu proyecto — confirmar en el dashboard) |
| `NEXT_PUBLIC_API_URL` | URL del backend desplegado en Render |

### 3.3 Arquitectura de autenticación (Supabase + Next.js App Router, patrón actual recomendado)

- Cliente de navegador (`lib/supabase/client.ts`) con `createBrowserClient` — para Client Components (formularios de login/registro, interacciones del chat).
- Cliente de servidor (`lib/supabase/server.ts`) con `createServerClient` — para Server Components y Route Handlers, leyendo/escribiendo cookies.
- **Middleware** (`middleware.ts`) que refresca la sesión en cada request y protege las rutas privadas, redirigiendo a `/login` si no hay sesión válida.
- Para verificar la sesión en el servidor, usar `supabase.auth.getClaims()` (recomendado actualmente por Supabase para autorización) en vez de confiar en `getSession()` para decisiones de acceso.
- El JWT de la sesión activa (`session.access_token`) es lo que se envía al backend FastAPI en cada petición — el backend ya lo verifica de forma independiente vía JWKS (ver `requerimientos-backend.md`), así que el frontend no necesita lógica adicional de verificación, solo transportar el token correctamente.

### 3.4 Páginas / rutas (App Router)
```
app/
├── layout.tsx
├── page.tsx                  # landing simple o redirect a /chat o /login
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
├── (protected)/
│   ├── layout.tsx             # verifica sesión, envuelve rutas privadas
│   ├── chat/
│   │   └── page.tsx           # vista principal del chat
│   ├── conversations/
│   │   └── page.tsx           # historial
│   └── settings/
│       └── page.tsx           # perfil e integraciones (Google Calendar)
├── auth/
│   └── actions.ts             # server actions: signIn, signUp, signOut
└── api/                       # solo si se necesita un proxy propio; normalmente no hace falta
```

### 3.5 Componentes clave
- `ChatWindow` — contenedor con scroll automático al último mensaje
- `MessageBubble` — burbuja diferenciada usuario/agente/tool
- `ToolIndicator` — indicador de qué tool se está ejecutando (parseando los eventos SSE)
- `ChatInput` — input con envío por Enter o botón, deshabilitado mientras se espera respuesta
- `ConversationSidebar` — lista de conversaciones, botón de nueva conversación
- `AuthForm` — formulario reutilizable para login/registro

### 3.6 Consumo del streaming SSE del backend
- El endpoint `POST /chat` del backend responde con `text/event-stream`. En el cliente, usar `fetch` con lectura manual del `ReadableStream` (los navegadores no permiten enviar headers custom como `Authorization` con `EventSource` nativo, así que no se usa `EventSource` directamente — se parsea el stream a mano con `fetch` + `response.body.getReader()`).
- Formato esperado de eventos (definido en el backend): `event: tool_start`, `event: message`, `event: done`, `event: error` — cada uno con un bloque `data: {...}` en JSON.

### 3.7 Despliegue
- Plataforma: **Vercel** (free tier)
- Variables de entorno configuradas en el panel de Vercel (Production/Preview/Development)
- Build command y output por defecto de Next.js — sin configuración especial

---

## 4. Riesgos conocidos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Cold start del backend en Render | Estado de carga explícito ("Despertando al agente...") en vez de spinner genérico indefinido |
| Expiración de sesión de Supabase a mitad de una conversación | El middleware refresca el token automáticamente; si falla, redirigir a login sin perder el mensaje que el usuario estaba escribiendo (guardarlo en estado local antes de redirigir) |
| `EventSource` no soporta headers custom | Se usa `fetch` + streaming manual, no `EventSource`, para poder enviar el JWT |
| Confusión anon key vs publishable key | Confirmar en el dashboard de Supabase cuál corresponde a tu proyecto antes de configurar `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

---

## 5. Fuera de alcance del MVP

- Edición de mensajes ya enviados
- Búsqueda dentro del historial de conversaciones
- Notificaciones en tiempo real de recordatorios (push/email)
- Modo oscuro/claro configurable (se puede dejar un tema fijo bien diseñado)