# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Profesionales, creadores y personas proactivas que buscan gestionar su tiempo con intencionalidad, blindar bloques de concentración (*Deep Work*) y mantener un equilibrio saludable entre sus metas laborales y hábitos personales (ejercicio, descanso, vida personal) sin sufrir sobrecarga o agobio.

## Product Purpose

Actuar como un compañero inteligente de **Crecimiento Personal y Profesional**: un gestor visual de tareas y hábitos enfocado en el seguimiento diario y métricas de progreso, apoyado por un asistente que ayuda a auditar la jornada, descubrir disponibilidad, priorizar compromisos bajo la Matriz de Eisenhower y brindar claridad diaria. El éxito se traduce en mayor serenidad, avance continuo en metas de alto impacto y hábitos consolidados en el tiempo.

## Positioning

A diferencia de agendas pasivas o listas de tareas desconectadas que se convierten en fuentes de estrés, Fokus combina un **gestor visual interactivo con métricas de progreso tangibles** y asistencia proactiva conectada a herramientas del mundo real (Google Calendar, PostgreSQL/Supabase y backend con inteligencia conversacional). Ayuda a pasar de la intención a la ejecución visualizando el progreso real de la jornada.

## Operating Context

- **Rituales diarios:**
  - *Inicio de jornada:* Revisión del Daily Briefing matutino (pronóstico del clima, compromisos y tareas críticas) con opción de lectura o escucha por síntesis de voz (Web Speech API).
  - *Bloques de enfoque:* Identificación de espacios libres y reserva de bloques protegidos de *Deep Work*.
  - *Seguimiento y cierre:* Monitoreo del progreso de proyectos, hábitos y tareas en el tablero Kanban y cuadrantes de Eisenhower con atajos de teclado rápidos.
- **Entorno operativo:** Navegadores web modernos en escritorio y dispositivos móviles (diseño responsive adaptable).
- **Herramientas conectadas:** Supabase Auth y base de datos relacional PostgreSQL, Google Calendar (OAuth 2.0), y backend FastAPI con streaming en tiempo real (Server-Sent Events) impulsado por modelos de lenguaje.

## Capabilities and Constraints

- **Capacidades confirmadas:**
  - Gestor visual de tareas y proyectos (`/projects`) con filtrado por proyecto, prioridad y Matriz de Eisenhower 2x2.
  - Tablero interactivo con métricas de progreso diario y estado de compromisos.
  - Copiloto conversacional reactivo en tiempo real (`/chat`) con ejecución de herramientas y streaming SSE.
  - Detección algorítmica de disponibilidad y programación de bloques de concentración protegidos (*Deep Work*).
  - Integración bidireccional con Google Calendar para auditoría y creación de eventos.
  - Daily Briefing matutino (`/briefing`) con clima contextual y síntesis de voz opcional.
  - Onboarding interactivo para configuración inicial del perfil del usuario.
- **Restricciones técnicas:**
  - Frontend construido en Next.js 15 (App Router), TypeScript y Tailwind CSS.
  - Backend en FastAPI con arquitectura desacoplada y endpoints de streaming.
  - Aislamiento estricto de datos por identificador de usuario (`user_id`).
  - Manejo resiliente de arranques en frío (*cold starts*) con estados visuales informativos.

## Brand Commitments

- **Nombre oficial:** Fokus.
- **Subtítulo de rol / Eslogan:** Personal & Pro · *Tu agenda. Tu tiempo. Tu enfoque.*
- **Identidad gráfica oficial:** Isotipo vectorial [FokusIcon](components/brand/FokusLogo.tsx) compuesto por 4 esquinas de enfoque y punto focal central ámbar (`#F59E0B`), sobre contenedor redondeado en Teal profundo (`#0F766E`).
- **Paleta y estética:** *Luminous Liquid Glass* — fondos claros luminosos (`#f8fafc` a `#fafbfc`), tarjetas translúcidas de cristal suave con desenfoque de fondo (`backdrop-blur-md`), acentos en Teal (`#0F766E`), Índigo (`#6366f1`) y Ámbar cálido (`#F59E0B`), con bordes finos reflectivos y tipografía legible (Space Grotesk para títulos y DM Sans para lectura).
- **Voz y tono:** Cercano, motivador, sereno y constructivo. Prioriza la acción sobre la culpa y promueve el progreso constante y realista.

## Evidence on Hand

- Frontend Next.js 15 completamente funcional con App Router, TypeScript, Tailwind CSS y Supabase Client en `app/` y `components/`.
- Backend FastAPI con suite completa de tests automatizados en `Backend/tests/`.
- Integraciones funcionales existentes: Supabase Auth/DB, Google Calendar OAuth 2.0 y servicios auxiliares.
- Rutas implementadas: `/projects` (tablero/matriz), `/chat` (copiloto interactivo), `/briefing` (resumen diario), `/settings` y flujos de autenticación.

## Product Principles

1. **Progreso visual y medible:** Hacer tangible el avance diario mediante métricas de progreso claras y hábitos consolidados.
2. **Protección activa de la atención:** Defender los bloques de trabajo profundo (*Deep Work*) y el descanso consciente frente a la reactividad diaria.
3. **Claridad y bajo esfuerzo cognitivo:** Interfaces limpias, directas y sin fricción para registrar, revisar y avanzar sin sobrecarga.
4. **Equilibrio integral (Matriz de Eisenhower):** Distinguir lo urgente de lo importante, balanceando compromisos profesionales con hábitos personales.
5. **Acción, control y transparencia:** Toda interacción o modificación en agenda y tareas es comprensible, visible y controlada por el usuario.

## Accessibility & Inclusion

- Contraste visual estricto (cumplimiento WCAG AA) sobre interfaces diáfanas y controles interactivos.
- Atajos globales de teclado para navegación ágil (`?`, `N`, `Esc`, `⌘K`).
- Soporte alternativo de accesibilidad mediante síntesis de voz (Web Speech API).
- Navegación completa por teclado con anillos de foco visibles y atributos descriptivos accesibles.
