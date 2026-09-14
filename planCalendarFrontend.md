# Plan de Desarrollo — Gestor de Tareas + Google Calendar (Frontend)

**Rol:** entrégale este documento a tu asistente de IA de código, fase por fase, después de que el backend (Fases T0-T7) esté funcionando.

**Nota:** el gestor de tareas en sí no requiere UI nueva obligatoria — el usuario puede gestionar sus tareas 100% por chat ("muéstrame mis tareas pendientes", "marca la primera como hecha"). Lo que sí necesita UI es la conexión con Google Calendar, porque es un flujo de autorización que no tiene sentido hacer por chat.

---

## Fase G-F0 — Actualización de requerimientos

**Instrucción para el asistente:**
> Actualiza `requerimientos-frontend.md` añadiendo:
> - RF-17: El usuario debe poder conectar y desconectar su cuenta de Google Calendar desde una sección de configuración/perfil.
> - RF-18: La interfaz debe mostrar claramente si Google Calendar está conectado o no.

---

## Fase G-F1 — Página de configuración/perfil

**Instrucción para el asistente:**
> Crea `app/(protected)/settings/page.tsx`. Debe mostrar el email del usuario (ya disponible en la sesión de Supabase) y una sección "Integraciones" con el estado de Google Calendar, consumiendo `GET {NEXT_PUBLIC_API_URL}/integrations/status` (con el JWT en el header, igual que el resto de llamadas al backend). Añade el enlace a esta página en la navegación (`Navbar` o el layout protegido ya existente).

**Criterio de aceptación:** la página carga y muestra correctamente "No conectado" cuando el usuario no ha vinculado Google Calendar.

---

## Fase G-F2 — Conectar y desconectar Google Calendar

**Instrucción para el asistente:**
> En la sección de Integraciones de `settings/page.tsx`, añade:
> - Un botón **"Conectar Google Calendar"** que llame a `GET {NEXT_PUBLIC_API_URL}/integrations/google/connect` (con el JWT), reciba la URL de autorización de Google, y redirija al usuario ahí (`window.location.href = authUrl`).
> - Maneja el retorno: el backend redirige de vuelta a `FRONTEND_URL/settings?google=connected` (o `?google=error` si algo falló) tras completar el flujo OAuth. Lee ese query param al montar la página y muestra una confirmación visual (toast o mensaje) según corresponda, luego limpia el parámetro de la URL.
> - Un botón **"Desconectar"** (visible solo si ya está conectado) que llame a `DELETE {NEXT_PUBLIC_API_URL}/integrations/google`, con confirmación antes de ejecutar.

**Criterio de aceptación:** el flujo completo funciona de punta a punta contra el backend real: conectar redirige a Google, autorizar regresa a `/settings` mostrando "Conectado", y desconectar vuelve al estado "No conectado".

---

## Fase G-F3 — Reflejo visual del estado de sincronización en el chat

**Instrucción para el asistente:**
> Cuando el agente cree una tarea con `create_reminder` y la respuesta de la tool incluya `calendar_synced: false` (usuario sin Google Calendar conectado), el `ToolIndicator` o el propio mensaje del agente ya lo comunicará en texto (esto lo resuelve el LLM de forma natural, según el `note` que le llega del backend — no necesita lógica especial en el frontend). Verifica únicamente que el componente `ToolIndicator` no oculte ni trunque ese tipo de mensajes informativos cuando la tool devuelve campos adicionales como `calendar_synced` o `note`.

**Criterio de aceptación:** al pedirle al agente crear una tarea sin tener Google Calendar conectado, el usuario ve en el chat una respuesta que menciona que puede conectar su calendario para recibir notificaciones — sin necesidad de UI dedicada para esto.

---

## Fase G-F4 (opcional) — Vista dedicada de tareas

**Solo si después de usar el chat sientes que hace falta una vista visual tipo lista, no conversacional:**

**Instrucción para el asistente:**
> Crea `app/(protected)/tasks/page.tsx`, listando las tareas del usuario (necesitarías un endpoint `GET /reminders` en el backend, que no está en el plan actual — si llegas a esta fase, primero hay que añadirlo al backend). Cada tarea muestra su estado (pendiente/completada) y si está sincronizada con Calendar. Permite marcar como completada y eliminar directamente desde la lista.

**Nota:** esta fase es la única que requiere un endpoint adicional en el backend no contemplado en el plan T0-T7. Trátala como una extensión futura, no como parte del alcance actual — el gestor de tareas ya es completamente funcional vía chat sin esta vista.

---

## Orden recomendado

| Fase | Depende de |
|---|---|
| G-F0 | — |
| G-F1 | G-F0 |
| G-F2 | G-F1, backend Fase T4 funcionando |
| G-F3 | backend Fase T6 funcionando |
| G-F4 (opcional) | G-F2, y un endpoint nuevo en el backend |