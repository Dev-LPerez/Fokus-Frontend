# Contexto General del Proyecto — Agente de IA con Function Calling

> Documento de referencia rápida. Da la visión completa del proyecto antes de entrar en detalle técnico (ver `requerimientos-backend.md` para el detalle del backend).

---

## 1. ¿Qué es este proyecto?

Un **agente de IA conversacional que no solo responde preguntas, sino que ejecuta acciones reales** a partir del lenguaje natural del usuario. A diferencia de un chatbot tradicional, este agente puede decidir por sí mismo cuándo necesita usar una herramienta externa (consultar el clima, crear un recordatorio, buscar información en la web) para completar lo que el usuario pidió, ejecutarla, y responder con el resultado real — no una respuesta genérica o inventada.

Es un proyecto universitario, con presupuesto $0, construido enteramente sobre tecnologías con tier gratuito.

---

## 2. Problema que resuelve / motivación

Los chatbots basados solo en LLM están limitados al conocimiento con el que fueron entrenados y no pueden interactuar con el mundo real (no saben el clima de hoy, no pueden crear una tarea en un sistema, no pueden buscar información actualizada). Este proyecto demuestra el patrón de **function calling / agentic AI**, que es la tendencia actual en productos de IA (Copilot, Cursor, asistentes empresariales): un LLM que actúa como orquestador de herramientas, no solo como generador de texto.

---

## 3. Objetivo del proyecto

Construir un agente funcional, desplegado y accesible públicamente, que:
- Mantenga conversaciones naturales con el usuario
- Decida de forma autónoma cuándo ejecutar una función/herramienta
- Ejecute esas funciones contra servicios reales (APIs externas o base de datos propia)
- Muestre al usuario, de forma transparente, qué está haciendo el agente en cada momento
- Autentique a los usuarios mediante Supabase Auth y aísle completamente sus datos (`user_id`)
- Todo esto sin incurrir en ningún costo

---

## 4. Alcance funcional (resumen)

- **Autenticación multiusuario:** Registro e inicio de sesión gestionado por Supabase Auth en el frontend, con validación de tokens JWT (ES256/RS256 vía JWKS) en el backend.
- **Aislamiento estricto de datos:** Cada conversación y recordatorio pertenece a un `user_id`; los usuarios solo pueden acceder y operar sobre su propia información.
- **Chat interactivo:** Con streaming de respuestas en tiempo real (Server-Sent Events).
- **Tools funcionales:** Al menos 3 herramientas integradas: clima (`get_weather`), recordatorios (`create_reminder`), búsqueda web (`search_web`).
- **Historial persistente:** Persistencia en PostgreSQL (Supabase) separada por usuario y conversación.
- **Interfaz transparente:** Visibilidad en tiempo real del ciclo de ejecución del agente.

*(El detalle completo de requerimientos funcionales y no funcionales del backend está en `requerimientos-backend.md`.)*

---

## 5. Arquitectura general

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend       │ ──Bearer JWT─▶│   Backend        │ ──API──▶│  Gemini API      │
│   Next.js        │ ──HTTP/SSE──▶│   FastAPI        │         │  (LLM + function │
│   (Vercel)       │◀────────────│   (Render)       │         │   calling)        │
└────────┬────────┘         └────────┬─────────┘         └─────────────────┘
         │                             │
         │ Auth (login/signup)         ├──────────────┬──────────────┐
         ▼                             ▼              ▼              ▼
   ┌──────────┐                  ┌──────────┐  ┌────────────┐  ┌──────────────┐
   │ Supabase │◀──JWKS (keys)────│ Supabase │  │OpenWeather │  │ DuckDuckGo    │
   │   Auth   │                  │(Postgres)│  │    Map     │  │  (scraping)   │
   └──────────┘                  └──────────┘  └────────────┘  └──────────────┘
```

El **backend es el cerebro del sistema**: verifica el token JWT del usuario, recibe el mensaje, decide junto con Gemini si hay que ejecutar una función, la ejecuta asociándola al `user_id`, y transmite la respuesta en streaming al frontend. El **frontend es la capa de presentación**: autentica con Supabase y muestra la conversación.

---

## 6. Stack tecnológico

| Capa | Tecnología | Despliegue |
|---|---|---|
| Frontend | Next.js | Vercel |
| Backend | FastAPI (Python) | Render |
| Autenticación | Supabase Auth (JWT ES256/RS256 vía JWKS) | Supabase (cloud) |
| LLM / Agente | Google Gemini API (`google-genai` function calling) | — |
| Base de datos | PostgreSQL vía Supabase | Supabase (cloud) |

**Restricción de diseño transversal:** todo el stack debe operar en tier gratuito, sin tarjeta de crédito. Esto condiciona decisiones como el manejo de rate limits de Gemini, el "cold start" de Render tras inactividad, y la ausencia de backups automáticos en Supabase.

---

## 7. Estado actual del proyecto

- ✅ Definición de alcance, stack y arquitectura
- ✅ Requerimientos del backend documentados (incluyendo RF-14/15/16 y RNF-10)
- ✅ Implementación de autenticación JWT y aislamiento por `user_id`
- ✅ Plan de desarrollo del backend por fases (ver `plan.md` y `plan-implementacion-usuarios.md`)
- ✅ Desarrollo y tests del backend completados
- 🔲 Desarrollo del frontend (pendiente)
- 🔲 Despliegue e integración final

---

## 8. Documentos relacionados en este proyecto

- `requerimientos-backend.md` — requerimientos funcionales, no funcionales y técnicos del backend
- `plan.md` — plan de desarrollo del backend por fases
- `plan-implementacion-usuarios.md` — especificación de la integración de Supabase Auth