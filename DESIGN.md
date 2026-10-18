---
name: Fokus
description: Tu agenda. Tu tiempo. Tu enfoque. Crecimiento personal y profesional.
colors:
  primary: "#1c6662"
  primary-hover: "#15524f"
  accent-amber: "#f4e0ba"
  accent-amber-focus: "#F59E0B"
  accent-indigo: "#6366F1"
  accent-cyan: "#06B6D4"
  accent-rose: "#f43f5e"
  neutral-ground: "#edece9"
  neutral-card: "#FFFFFF"
  neutral-ink: "#0f1014"
  neutral-muted: "#475569"
  border-glass: "rgba(255, 255, 255, 0.75)"
  border-subtle: "rgba(226, 232, 240, 0.7)"
typography:
  display:
    fontFamily: "var(--font-wix-madefor), 'Wix Madefor Display', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.125rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-wix-madefor), var(--font-space-grotesk), sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-space-grotesk), sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "var(--font-dm-sans), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-card}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.85)"
    rounded: "{rounded.2xl}"
    padding: "24px 28px"
---

# Design System: Fokus (Luminous Liquid Glass & Focus Shield)

## Overview

**Creative North Star: "Luminous Liquid Glass & Focus Shield" (Comp 3 Refined)**

Fokus está concebido como un santuario digital de claridad, calma mental y blindaje cognitivo para el alto rendimiento personal y profesional. Su estética huye de la frialdad corporativa y de las interfaces oscuras sobrecargadas, ofreciendo un lienzo diáfano y cálido donde el tiempo de trabajo profundo (*Deep Work*) y los hábitos esenciales se perciben protegidos, tangibles y serenos.

La experiencia visual se fundamenta en tres pilares de identidad:
1. **Lienzo Orgánico Sereno (`#edece9`):** Una base cálida de arena suave con halos ambientales etéreos en ámbar miel (`#f4e0ba`) y esmeralda sutil (`#1c6662`), acompañada de un sutil split visual vertical.
2. **Cristal Líquido Refractivo (Liquid Glass):** Superficies translúcidas con transmitancia de luz real (`bg-white/40` a `bg-white/60`), desenfoque óptico profundo (`backdrop-blur-2xl`), sobresaturación cromática (`backdrop-saturate-[180%]`) y micro-biseles interiores reflectivos (`inset 0 1px 1px rgba(255, 255, 255, 0.9)`).
3. **Jerarquía Tipográfica Esculpida:** Contraste armónico entre la contundencia geométrica y moderna de **Wix Madefor Display**, la precisión estructural de **Space Grotesk**, el confort de lectura continua de **DM Sans**, y la fidelidad técnica de **JetBrains Mono**.

---

## Colors

### Primary & Accent Roles
- **Sanctuary Teal Primario (`#1c6662`):** El ancla de confianza y autoridad serena de la marca. Utilizado en los botones principales de llamada a la acción, indicadores clave de progreso y el contenedor oficial del isotipo.
  - Hover: `#15524f` | Suave: `rgba(28, 102, 98, 0.08)`
- **Amber Miel (`#f4e0ba`):** El color del estado activo, energía matutina y solidez de hábitos. Utilizado como resplandor de fondo en tarjetas activas, pestañas seleccionadas y reflejos ambientales.
- **Amber Focus Dot (`#F59E0B`):** El punto cardinal del isotipo y baliza de alerta viva en badges de foco ("SISTEMA DE HÁBITOS & FOCO").
- **Índigo Concentración (`#6366f1`):** Empleado en cuadrantes estratégicos de la Matriz Eisenhower ("2. Agendar / Planificar") y tags analíticos.
- **Rosa Urgente (`#f43f5e`):** Distintivo exclusivo del cuadrante de atención inmediata ("1. Hacer Ya").
- **Cian / Esmeralda Claro (`#06b6d4` / `teal-600`):** Indicadores de sincronización con Google Calendar y estados exitosos.

### Neutral Grounds & Inks
- **Ground Cálido (`#edece9`):** Lienzo principal de la aplicación, descansado y de bajo estrés visual.
- **Surface Pure (`#ffffff`):** Tarjetas elevadas y capas base de cristal.
- **Deep Ink (`#0f1014`):** Tinta tipográfica principal de máximo contraste y nitidez.
- **Slate Text (`#334155` / `#475569`):** Subtítulos y textos de lectura secundaria.
- **Muted Mono (`#64748b`):** Marcas de tiempo, metadatos y micro-etiquetas.
- **Glass Highlights:** `rgba(255, 255, 255, 0.9)` para biseles superiores e interiores; `rgba(226, 232, 240, 0.6)` para bordes tenues.

---

## Typography

| Nivel | Tipografía | Peso | Tamaño / Leading | Uso Principal |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | Wix Madefor Display | Bold (700/800) | `text-3xl` a `text-[49px]` (lh: 1.08) | Título principal de la vista y encabezados de gran impacto. |
| **Headline** | Wix Madefor Display | Bold (700) | `text-2xl` a `text-3xl` (lh: 1.2) | Títulos de secciones principales (Pilares, Método, Ecosistema). |
| **Title** | Space Grotesk | Semi-bold (600/700) | `text-base` a `text-lg` (lh: 1.3) | Nombres de tarjetas, bloques de Deep Work y cuadrantes. |
| **Body** | DM Sans | Regular (400) / Medium (500) | `text-sm` a `text-[17px]` (lh: 1.6) | Párrafos explicativos, descripciones de tareas y chats. |
| **Mono / Tag** | JetBrains Mono / font-mono | Bold (700) | `text-[10px]` a `text-[11px]` (tracking-wide) | Badges, horas de sesión (08:00 AM), cronómetros de cuenta atrás. |

---

## Layout & Spatial Geometry

1. **Top Floating / Peel-off Navbar:**
   - En reposo superior (`scrollY <= 30`), ocupa el ancho completo con borde inferior tenue.
   - Al hacer scroll (`scrollY > 30`), se desprende con `transition-all duration-500` transformándose en una cápsula flotante centrada (`max-w-[1101px] rounded-full`).
2. **Cockpit Split 2-Columnas (Hero / Workspace):**
   - **Columna Izquierda:** Tesis clara de la vista, badge contextual, titular y llamada a la acción primordial.
   - **Columna Derecha (Cockpit):** Stepper dinámico segmentado en la parte superior y tarjeta de acción central debajo.
3. **Malla Modular de Tarjetas (Cards Grid):**
   - Pilares y métricas en cuadrículas de 2 a 4 columnas (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`).
   - Fases del método en tríada horizontal con tarjeta central resaltada (`border-2 border-teal-700/50 shadow-md`).
4. **Límites de Lectura y Contenedores:**
   - Máximo ancho general: `max-w-6xl` (1152px) a `max-w-[1376px]` para vistas panorámicas.

---

## Elevation & Depth (Fórmulas Liquid Glass)

La profundidad no utiliza sombras negras artificiales ni drop-shadows saturadas; se genera mediante **estratificación de capas de luz**:

1. **Cápsula Flotante (Liquid Glass Navbar):**
   ```css
   background: rgba(255, 255, 255, 0.55);
   backdrop-filter: blur(24px) saturate(180%);
   -webkit-backdrop-filter: blur(24px) saturate(180%);
   border: 1px solid rgba(255, 255, 255, 0.75);
   box-shadow: 0 12px 40px -10px rgba(15, 23, 42, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9);
   ```
2. **Tarjeta de Cristal Elevada (Interactive Showcase Card):**
   ```css
   background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 60%, rgba(240, 253, 250, 0.5) 100%);
   backdrop-filter: blur(24px);
   border: 1px solid rgba(255, 255, 255, 0.9);
   box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.1);
   ```
3. **Pestaña Activa con Brillo Ámbar (Active Stepper Tab):**
   ```css
   background-color: #f4e0ba;
   border: 1px solid rgba(252, 211, 77, 0.9);
   box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.2);
   ```

---

## Shapes & Radii

- **`rounded-full` (Píldora):** Navbar, botones de llamada a la acción primarios, badges de estado y selectores.
- **`rounded-3xl` (24px a 32px):** Contenedores principales, tarjetas de Deep Work y banner de conversión.
- **`rounded-2xl` (16px):** Pestañas de stepper, tarjetas de pilares individuales y cuadrantes de tareas.
- **`rounded-xl` (12px):** Chips de tareas internas, cajas de clima e inputs.

---

## Components & Code Recipes

### 1. Botón Principal de Conversión
```tsx
<button className="group inline-flex items-center justify-between gap-4 px-8 py-4 rounded-full bg-[#1c6662] hover:bg-[#15524f] hover:scale-[1.03] active:scale-[0.98] text-white font-semibold text-[17px] shadow-xl shadow-amber-500/20 hover:shadow-2xl transition-all duration-300">
  <span>Acción Principal</span>
  <span className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center p-1 shadow-xs group-hover:scale-110 transition-transform text-[#1c6662]">
    <Icon className="w-4 h-4" />
  </span>
</button>
```

### 2. Cronómetro Circular de Concentración con Espaciado de Respiración
Para evitar que los números toquen el trazo del círculo, la relación de aspecto y el radio deben preservar al menos 15px de margen:
```tsx
const radius = 48; // Para viewBox="0 0 120 120"
const circumference = 2 * Math.PI * radius;

<div className="relative w-36 h-36 mx-auto flex items-center justify-center">
  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r={radius} stroke="#e2e8f0" strokeWidth="5.5" fill="transparent" />
    <circle
      cx="60"
      cy="60"
      r={radius}
      stroke="#1c6662"
      strokeWidth="5.5"
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      fill="transparent"
      className="transition-all duration-1000 ease-linear"
    />
  </svg>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-[19px] font-mono font-bold text-slate-950 tracking-normal">
      {timeFormatted}
    </span>
    <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 font-semibold mt-0.5">
      En Progreso
    </span>
  </div>
</div>
```

### 3. Matriz de Eisenhower 2×2 Mini
```tsx
<div className="grid grid-cols-2 gap-2 text-[11px]">
  <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/60">
    <span className="font-bold text-rose-800 block text-[10px] uppercase font-mono">1. Hacer Ya</span>
    <span className="text-slate-800 font-semibold truncate block mt-0.5">Tarea Urgente</span>
  </div>
  <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200/60">
    <span className="font-bold text-teal-800 block text-[10px] uppercase font-mono">2. Agendar (Foco)</span>
    <span className="text-slate-800 font-semibold truncate block mt-0.5">Proyecto Clave</span>
  </div>
  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60">
    <span className="font-bold text-amber-800 block text-[10px] uppercase font-mono">3. Delegar</span>
    <span className="text-slate-700 font-medium truncate block mt-0.5">Petición Externa</span>
  </div>
  <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200/60">
    <span className="font-bold text-slate-600 block text-[10px] uppercase font-mono">4. Descartar</span>
    <span className="text-slate-600 font-medium truncate block mt-0.5">Distracción</span>
  </div>
</div>
```

---

## Guía de Replicación en Otras Vistas de Fokus

### En `/projects` (Tablero Kanban & Matriz):
- Mantener el fondo cálido `#edece9` o `#fafbfc` con sutil resplandor ambiental.
- Sustituir tarjetas blancas planas por tarjetas Liquid Glass con borde `border-white/80` y micro-sombra interior.
- Usar **Wix Madefor Display** para los encabezados de columnas ("Por Hacer", "En Curso", "Completado").
- Incorporar chips de estado en píldoras con tipografía JetBrains Mono a 11px.

### En `/chat` (Copiloto Fokus):
- La barra de input inferior debe adoptar la fórmula de la navbar flotante (`rounded-full`, `bg-white/60 backdrop-blur-2xl border-white/85 shadow-lg`).
- Los mensajes del copiloto se presentan en tarjetas de cristal blanco diáfano, mientras las sugerencias de bloques de Deep Work adoptan el anillo y el badge `Google Calendar Sincronizado`.

### En `/briefing` (Resumen Diario):
- Organizar el timeline con los mismos Stepper Tabs cálidos (`#f4e0ba` para el bloque activo).
- Presentar el pronóstico meteorológico y el reproductor de audio síntesis con la misma distribución minimalista.

---

## Do's and Don'ts

### Do:
- **Do** utilizar `backdrop-saturate-[180%]` y `backdrop-blur-2xl` en las barras flotantes para que los colores de fondo sangren con un degradé luminoso en lugar de apagarse.
- **Do** usar Wix Madefor Display para títulos principales y DM Sans para lectura.
- **Do** dar al menos 15px de margen libre entre los números y los anillos circulares de progreso.
- **Do** emplear el Teal `#1c6662` como color de acción prioritario y el Ámbar `#f4e0ba` / `#F59E0B` como calor y enfoque.

### Don't:
- **Don't** aplicar fondos completamente opacos (`bg-white` o `bg-slate-100`) a barras de navegación fijas o flotantes.
- **Don't** usar sombras negras duras (`shadow-2xl shadow-black`); preferir sombras multicapa coloreadas (`shadow-slate-900/5` o `shadow-amber-500/20`).
- **Don't** saturar el diseño con más de tres familias tipográficas en un mismo componente.
- **Don't** permitir que textos dentro de tarjetas no lleven reglas de desborde (`truncate` o `break-words`) en pantallas móviles.
