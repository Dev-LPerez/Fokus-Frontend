# Frontend — Agente de IA con Function Calling

Frontend web interactivo para el Agente de IA autónomo. Construido con **Next.js (App Router)**, **Supabase Auth (`@supabase/ssr`)**, **Tailwind CSS** y streaming SSE en tiempo real conectado al backend FastAPI en Render.

---

## 🚀 Características

- 🔐 **Autenticación con Supabase Auth:** Soporte para el nuevo sistema de API Keys de Supabase con **Publishable Key** (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), manejo de sesiones seguras mediante cookies HTTP-Only y SSR (`@supabase/ssr`).
- ⚡ **Streaming SSE en Tiempo Real:** Visualización token a token de las respuestas del modelo Gemini mediante `ReadableStream` manual con headers JWT Bearer.
- 🛠️ **Indicadores de Function Calling:** Feedback visual inmediato cuando el agente ejecuta herramientas (`get_weather`, `create_reminder`, `search_web`).
- 📜 **Historial de Conversaciones:** Consulta, reapertura y eliminación de sesiones de chat persistidas en base de datos.
- 🧰 **Panel de Herramientas Dinámicas:** Inspección de las tools registradas en el backend (`GET /tools`).
- ⏳ **Manejo de Cold Start:** Avisos inteligentes ante periodos de inactividad del tier gratuito de Render.
- 📱 **Diseño 100% Responsive y Moderno:** Interfaz estilizada con Tailwind CSS y modo oscuro.

---

## 📦 Stack Tecnológico

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Estilos:** Tailwind CSS
- **Autenticación:** `@supabase/ssr` & `@supabase/supabase-js` (nuevo sistema con Publishable Key)
- **Iconografía:** `lucide-react`
- **Gestor de Paquetes:** `pnpm`
- **Despliegue:** Vercel (Free Tier)

---

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto basado en `.env.example`:

```env
# Supabase (Nuevo sistema con Publishable Key)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-publishable-key

# Backend FastAPI (Local o Render)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🛠️ Instalación y Ejecución Local

1. **Instalar dependencias con pnpm:**
   ```bash
   pnpm install
   ```

2. **Ejecutar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

3. **Abrir en el navegador:**
   Visita [http://localhost:3000](http://localhost:3000).

---

## 🌐 Despliegue en Vercel

1. Sube tu repositorio a GitHub / GitLab.
2. Inicia sesión en [Vercel](https://vercel.com) e importa el proyecto.
3. En la sección **Environment Variables**, configura:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_API_URL` (URL de tu backend en Render, ej. `https://mi-backend.onrender.com`)
4. Haz clic en **Deploy**. ¡Listo!
