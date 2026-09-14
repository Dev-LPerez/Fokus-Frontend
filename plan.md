# Plan de Desarrollo — Frontend del Agente de IA

**Rol:** entrégale este documento a tu asistente de IA de código, fase por fase, igual que hicimos con el backend.

**Stack confirmado:** Next.js (App Router) + Supabase Auth (`@supabase/ssr`) + Tailwind CSS + consumo del backend FastAPI en Render.

---

## Fase F0 — Estructura del proyecto y setup base

**Instrucción para el asistente:**
> Crea un proyecto Next.js (App Router, TypeScript, Tailwind CSS) llamado `frontend`. Instala `@supabase/ssr` y `@supabase/supabase-js`. Crea `.env.example` con las variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_API_URL` (sin valores reales). Configura la estructura de carpetas según `requerimientos-frontend.md` sección 3.4.

**Criterio de aceptación:** `npm run dev` levanta el proyecto sin errores en `localhost:3000`.

---

## Fase F1 — Clientes de Supabase y middleware de sesión

**Instrucción para el asistente:**
> Crea `lib/supabase/client.ts` (cliente de navegador con `createBrowserClient`) y `lib/supabase/server.ts` (cliente de servidor con `createServerClient`, leyendo/escribiendo cookies con `next/headers`). Crea `middleware.ts` en la raíz que:
> 1. Refresque la sesión de Supabase en cada request.
> 2. Redirija a `/login` si el usuario intenta acceder a una ruta bajo `(protected)/` sin sesión válida (usar `getClaims()` para verificar).
> 3. Redirija a `/chat` si un usuario ya autenticado intenta acceder a `/login` o `/register`.

**Criterio de aceptación:** acceder a `localhost:3000/chat` sin sesión redirige a `/login`; tras loguearse, redirige de vuelta a `/chat`.

---

## Fase F2 — Páginas de login y registro

**Instrucción para el asistente:**
> Crea `app/login/page.tsx` y `app/register/page.tsx` con formularios simples (email + contraseña). Implementa `app/auth/actions.ts` con Server Actions `signIn`, `signUp` y `signOut` que usen el cliente de servidor de Supabase. Muestra errores de autenticación de forma clara en el formulario (credenciales inválidas, email ya registrado, etc.). Tras un registro exitoso, informa al usuario si Supabase requiere confirmación de email antes de poder iniciar sesión.

**Criterio de aceptación:** un usuario nuevo puede registrarse, iniciar sesión, y cerrar sesión, con los errores comunes manejados sin que la app se rompa.

---

## Fase F3 — Layout protegido y navegación base

**Instrucción para el asistente:**
> Crea `app/(protected)/layout.tsx`, que envuelve las rutas de chat e historial, verifica la sesión (redundante con el middleware, pero como capa adicional a nivel de Server Component), y renderiza una navegación simple: logo/nombre del proyecto, acceso al historial de conversaciones, botón de cerrar sesión, y el email del usuario actual.

**Criterio de aceptación:** el layout se ve consistente en `/chat` y `/conversations`, con el botón de logout funcional.

---

## Fase F4 — Vista de chat sin streaming (versión simple primero)

**Instrucción para el asistente:**
> Crea `app/(protected)/chat/page.tsx` con los componentes `ChatWindow`, `MessageBubble` y `ChatInput`. Por ahora, conecta contra `POST {NEXT_PUBLIC_API_URL}/chat?stream=false`, enviando el JWT de la sesión activa (`session.access_token`) en el header `Authorization`. Muestra la respuesta completa del agente una vez llega (sin streaming todavía — eso es la Fase F5). Maneja el estado de "cargando" mientras se espera la respuesta, y errores (401, 500, timeout) con un mensaje claro para el usuario.

**Criterio de aceptación:** el usuario puede enviar un mensaje y ver la respuesta del agente en pantalla, incluyendo el caso de cold start del backend (mensaje de espera, no una pantalla congelada).

---

## Fase F5 — Streaming SSE real

**Instrucción para el asistente:**
> Cambia la llamada de la Fase F4 a `POST {NEXT_PUBLIC_API_URL}/chat` (streaming, el default). Como `EventSource` no permite headers custom, implementa el consumo manual con `fetch` + `response.body.getReader()`, parseando los eventos `tool_start`, `message` y `done`/`error` según el formato definido en el backend. Actualiza `MessageBubble` para que el texto del agente se vaya construyendo token a token en tiempo real. Implementa `ToolIndicator` para mostrar cuando el agente está ejecutando una herramienta (ej. "🔍 Buscando en la web...").

**Criterio de aceptación:** al enviar un mensaje que dispare una tool (ej. "¿qué clima hace en Montería?"), el usuario ve primero el indicador de la tool ejecutándose, y luego el texto de la respuesta apareciendo progresivamente, no todo de golpe.

---

## Fase F6 — Historial de conversaciones

**Instrucción para el asistente:**
> Crea `app/(protected)/conversations/page.tsx` que liste las conversaciones del usuario (`GET /conversations`, con el JWT en el header). Cada conversación debe poder abrirse (carga `GET /conversations/{id}` y muestra el historial completo en la vista de chat) o eliminarse (`DELETE /conversations/{id}`, con confirmación antes de borrar). Añade el botón "Nueva conversación" para limpiar el estado del chat actual.

**Criterio de aceptación:** el usuario puede navegar entre conversaciones anteriores sin perder el historial, y eliminar una conversación la remueve tanto de la lista como de la base de datos (verificable recargando la página).

---

## Fase F7 — Panel de herramientas disponibles

**Instrucción para el asistente:**
> Añade un componente que consuma `GET /tools` (no requiere autenticación) y muestre, en un panel lateral o modal accesible desde el chat, el nombre y descripción de cada herramienta disponible del agente.

**Criterio de aceptación:** el panel refleja exactamente las tools registradas en el backend, sin hardcodear la lista en el frontend.

---

## Fase F8 — Pulido, manejo de errores global y despliegue en Vercel

**Instrucción para el asistente:**
> Revisa todos los puntos de llamada al backend y asegura manejo consistente de errores (401 → redirigir a login por sesión expirada; 5xx → mensaje de "el servidor no está disponible, intenta de nuevo"). Verifica que la app sea responsive (probar en viewport móvil). Documenta en `README.md` los pasos para desplegar en Vercel: conectar el repo, configurar las 3 variables de entorno, y el dominio resultante.

**Criterio de aceptación:** deploy exitoso en Vercel, login/chat/historial funcionando de punta a punta contra el backend real en Render.

---

## Orden recomendado de ejecución

| Fase | Qué entrega | Depende de |
|---|---|---|
| F0 | Proyecto Next.js base | — |
| F1 | Auth: clientes Supabase + middleware | F0 |
| F2 | Login / registro | F1 |
| F3 | Layout protegido | F2 |
| F4 | Chat sin streaming | F3 |
| F5 | Chat con streaming SSE | F4 |
| F6 | Historial de conversaciones | F3 (puede ir en paralelo con F4/F5) |
| F7 | Panel de tools | F3 |
| F8 | Pulido y despliegue | F5, F6, F7 |

**Recomendación:** al llegar a la Fase F5 (streaming), pruébalo primero contra tu backend corriendo localmente antes de asumir que un problema es del frontend — el formato exacto de los eventos SSE debe coincidir entre ambos lados.