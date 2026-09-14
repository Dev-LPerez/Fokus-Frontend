# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Profesionales, creadores y personas proactivas que buscan gestionar su tiempo con intencionalidad, proteger sus horas de estudio y trabajo profundo, y mantener un equilibrio saludable entre sus metas laborales y hábitos personales (ejercicio, descanso, vida personal) sin sufrir sobrecarga o agobio.

## Product Purpose

Actuar como un compañero inteligente de **Crecimiento Personal y Profesional**: un copiloto proactivo que trasciende el rol de un chatbot convencional al integrarse directamente con la vida real del usuario (su Google Calendar y su tablero de tareas). Existe para auditar la jornada, descubrir espacios de disponibilidad, agendar y blindar bloques de *Deep Work*, clasificar compromisos bajo la Matriz de Eisenhower y brindar claridad mental diaria mediante briefings matutinos interactivos y con síntesis de voz. El éxito se traduce en mayor serenidad, cero colisiones de horario y avance continuo en proyectos de alto impacto.

## Positioning

A diferencia de asistentes genéricos o chatbots desconectados que solo generan texto pasivo, Fokus opera mediante **Function Calling bidireccional y autónomo** conectado a servicios reales (Google Calendar API y base de datos relacional PostgreSQL con Supabase). El sistema no se limita a sugerir; visualiza la agenda real, bloquea eventos de concentración protegidos, detecta huecos libres algorítmicamente y organiza tareas dinámicamente con retroalimentación instantánea en la interfaz *Liquid Glass*.

## Operating Context

- **Rituales diarios:**
  - *Inicio de jornada:* Revisión del Daily Briefing matutino (pronóstico del clima, compromisos y tareas críticas) con opción de lectura o escucha por síntesis de voz nativa (Web Speech API).
  - *Bloques de enfoque:* Auditoría de disponibilidad y reserva de 90 min de *Deep Work* en Google Calendar.
  - *Seguimiento y cierre:* Organización de proyectos y tareas en el tablero Kanban y cuadrantes de Eisenhower con atajos de teclado rápidos.
- **Entorno operativo:** Navegadores web modernos en escritorio y dispositivos móviles (diseño responsive adaptable).
- **Herramientas conectadas:** Google Calendar (OAuth 2.0 con tokens cifrados), Supabase Auth (aislamiento multiusuario estricto por JWT), y API backend FastAPI con streaming en tiempo real (Server-Sent Events) impulsada por Gemini.

## Capabilities and Constraints

- **Capacidades confirmadas:**
  - Conversación reactiva con streaming en tiempo real (SSE) y ejecución autónoma de herramientas (Function Calling).
  - Consulta y auditoría de reuniones en Google Calendar (get_calendar_agenda).
  - Detección algorítmica de disponibilidad y huecos de concentración (ind_free_work_slots).
  - Bloqueo y sincronización de sesiones de concentración (schedule_deep_work) con tarjetas visuales interactivas (DeepWorkCard).
  - Consulta de clima contextual (get_weather) y búsqueda web informativa (search_web).
  - Tablero interactivo de tareas y proyectos (/projects) con filtrado por proyecto, prioridad y Matriz de Eisenhower 2x2.
  - Briefing diario colapsable (/briefing) con clima, timeline y tareas críticas.
  - Onboarding dinámico para usuarios nuevos y existentes (OnboardingModal).
- **Restricciones técnicas:**
  - Despliegue en infraestructura serverless y contenedores (Next.js 15 en Vercel / local, FastAPI en Render, PostgreSQL y Auth en Supabase).
  - Manejo transparente de arranques en frío (*cold starts*) del backend con avisos visuales amigables.
  - Aislamiento estricto y seguro por identificador único de usuario (user_id).

## Brand Commitments

- **Nombre oficial:** Fokus.
- **Subtítulo de rol / Eslogan:** Personal & Pro · *Tu agenda. Tu tiempo. Tu enfoque.*
- **Identidad gráfica oficial:** Isotipo vectorial [FokusIcon](components/brand/FokusLogo.tsx) compuesto por 4 esquinas de enfoque y punto focal central ámbar (#F59E0B), montado sobre contenedor con bordes redondeados y tono Teal profundo (#0F766E).
- **Paleta y estética:** *Luminous Liquid Glass* — fondos claros luminosos (#f8fafc a #fafbfc), tarjetas translúcidas de cristal suave con desenfoque de fondo (ackdrop-blur-md), acentos en Teal (#0F766E), Índigo (#6366f1) y Ámbar cálido (#F59E0B), con bordes limpios y tipografía de alta legibilidad (Space Grotesk para títulos y DM Sans para lectura continua).
- **Voz y tono:** Cercano, empático, motivador y claro. Evita la jerga burocrática o fría; prioriza la serenidad, la acción constructiva y el respeto por el tiempo del usuario.

## Evidence on Hand

- Frontend Next.js 15 completamente funcional con App Router, TypeScript, Tailwind CSS y Supabase Client en pp/ y components/.
- Backend FastAPI con suite completa de 64 tests automatizados pasando al 100% en Backend/tests/.
- Integraciones operativas probadas: Google Calendar OAuth 2.0, OpenWeatherMap y DuckDuckGo search.
- Tablero de tareas en /projects, copiloto en tiempo real en /chat, ajustes y cierre de sesión en /settings, pantalla de autenticación consistente en /login y /register.

## Product Principles

1. **Protección activa del tiempo:** El tiempo de concentración ininterrumpida y el descanso personal son sagrados; el sistema busca y defiende proactivamente esos espacios antes de que se dispersen en la rutina.
2. **Acción sobre conversación:** Preferir siempre realizar acciones concretas (crear evento, tachar compromiso, agendar bloque) y mostrar interfaces interactivas estructuradas en lugar de respuestas de texto pasivas.
3. **Calidez y claridad sin ruido:** Mantener una experiencia fluida, libre de fricción cognitiva o abrumamiento visual. Menos pasos, mayor tranquilidad.
4. **Transparencia total:** Cada interacción con herramientas externas y calendario es visible, comprensible y reversible por el usuario.
5. **Equilibrio integral (Matriz de Eisenhower):** Ayudar a distinguir lo urgente de lo importante, asegurando que las metas personales y profesionales no queden asfixiadas por la urgencia inmediata.

## Accessibility & Inclusion

- Contraste visual estricto (cumplimiento WCAG AA) sobre interfaces diáfanas y elementos interactivos.
- Atajos globales de teclado para navegación eficiente (N, ?, Esc, ⌘K).
- Soporte alternativo de accesibilidad mediante síntesis de voz (Web Speech API) para fatiga visual o situaciones de movilidad.
- Estados de foco evidentes, etiquetas ria-label descriptivas y soporte completo para navegación con teclado.
