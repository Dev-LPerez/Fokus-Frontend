import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Bot,
  Shield,
  CloudSun,
  CalendarClock,
  Search,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { FokusIcon } from '@/components/brand/FokusLogo';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-white selection:bg-[#d4af37] selection:text-[#07090e]">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1f2533] bg-[#07090e]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="shadow-lg shadow-teal-900/30 group-hover:scale-105 transition-transform rounded-2xl">
              <FokusIcon size={38} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                Fokus
              </span>
              <span className="text-[10px] text-teal-400 font-mono mt-1 leading-none font-semibold">
                Crecimiento Personal & Profesional
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#8e9bb0]">
            <a href="#caracteristicas" className="hover:text-white transition-colors">
              Capacidades
            </a>
            <a href="#herramientas" className="hover:text-white transition-colors">
              Herramientas
            </a>
            <a href="#arquitectura" className="hover:text-white transition-colors">
              Arquitectura
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#8e9bb0] hover:text-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#d4af37] via-[#fae188] to-[#d4af37] hover:brightness-110 text-[#07090e] px-4 py-2 rounded-xl transition-all shadow-md shadow-[#d4af37]/20 hover:scale-[1.02]"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e121b] border border-[#d4af37]/30 text-[#fae188] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span>Fokus · Tu Espacio de Crecimiento Integral</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[56px] tracking-tight leading-[1.1] text-white">
              Haz espacio para <br />
              <span className="text-[#fae188]">lo que de verdad importa</span> <br />
              en tu vida y carrera.
            </h1>

            <p className="text-sm sm:text-base text-[#8e9bb0] leading-relaxed max-w-lg">
              <strong>Fokus</strong> es tu aliado inteligente para cultivar hábitos, avanzar tus proyectos profesionales y equilibrar tu tiempo. Sincronizado con Google Calendar y la Matriz de Eisenhower para convertir tus metas en progreso real cada día.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/chat"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae188] to-[#d4af37] hover:brightness-110 text-[#07090e] font-bold text-sm shadow-md shadow-[#d4af37]/20 transition-all hover:scale-[1.02]"
              >
                <Bot className="w-4 h-4 stroke-[2.5]" />
                <span>Explorar Fokus</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0e121b] hover:bg-[#141925] border border-[#1f2533] text-white text-sm font-medium transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#8e9bb0]" />
                <span>Iniciar sesión</span>
              </Link>
            </div>

            {/* Tool bullet names */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-[#fae188]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                schedule_deep_work
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                find_free_work_slots
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                get_calendar_agenda
              </span>
            </div>
          </div>

          {/* Right Column: Simulated Terminal (agente-stream.py) */}
          <div className="lg:col-span-6">
            <div className="bg-[#0a0d14] border border-[#1f2533] rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-left">
              {/* Terminal Titlebar */}
              <div className="px-4 py-3 bg-[#07090e] border-b border-[#1f2533] flex items-center gap-2 text-[#8e9bb0]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-2 text-[11px] text-[#8e9bb0]">agente-stream.py</span>
              </div>

              {/* Terminal Body */}
              <div className="p-6 space-y-3.5 bg-[#0a0d14] text-zinc-300">
                <div className="space-y-1">
                  <p className="text-zinc-400">
                    <span className="text-[#8e9bb0] mr-2">❯</span>
                    <span>usuario: Ayúdame a reservar 90 min para mi proyecto y organizar el día</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[#fae188] flex items-center gap-2">
                    <span>⚡</span>
                    <span>ejecutando schedule_deep_work</span>
                    <span className="text-[#8e9bb0]">&#123;"tarea": "Proyecto de Innovación", "minutos": 90&#125;</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-emerald-400 flex items-center gap-2">
                    <span className="mr-1.5 text-emerald-400">✓</span>
                    <span>bloque reservado en Google Calendar (16:00 - 17:30)</span>
                  </p>
                </div>

                <div className="mt-3 p-3.5 rounded-xl bg-[#0e121b] border border-[#1f2533] text-zinc-200 text-xs leading-relaxed">
                  He protegido 90 minutos en tu calendario para avanzar en tu proyecto sin interrupciones y clasifiqué tus tareas en la Matriz de Eisenhower. ¿Quieres revisar tus prioridades personales de hoy?
                  <span className="caret-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Diseñado para acción */}
      <section id="caracteristicas" className="py-24 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="space-y-3 mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Diseñado para acción
          </h2>
          <p className="text-sm text-[#8e9bb0] max-w-xl mx-auto">
            Cada mensaje puede convertirse en una llamada a servicios externos. Tú ves el proceso, no solo la respuesta.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-[#0a0d14] border border-[#1f2533] p-7 rounded-2xl space-y-4 hover:border-[#d4af37]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#3a2e15] flex items-center justify-center text-[#fae188] border border-[#d4af37]/30 shadow-inner">
              <Zap className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white">
              Streaming en vivo
            </h3>
            <p className="text-xs sm:text-sm text-[#8e9bb0] leading-relaxed">
              Observa cómo el agente redacta la respuesta token a token, sin esperar al final.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0a0d14] border border-[#1f2533] p-7 rounded-2xl space-y-4 hover:border-[#d4af37]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#3a2e15] flex items-center justify-center text-[#fae188] border border-[#d4af37]/30 shadow-inner">
              <Bot className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white">
              Function calling
            </h3>
            <p className="text-xs sm:text-sm text-[#8e9bb0] leading-relaxed">
              El modelo decide cuándo llamar a una herramienta, pasa los argumentos y muestra la traza de ejecución.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0a0d14] border border-[#1f2533] p-7 rounded-2xl space-y-4 hover:border-[#d4af37]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#3a2e15] flex items-center justify-center text-[#fae188] border border-[#d4af37]/30 shadow-inner">
              <Shield className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h3 className="font-display font-semibold text-lg text-white">
              Autenticación segura
            </h3>
            <p className="text-xs sm:text-sm text-[#8e9bb0] leading-relaxed">
              Inicio de sesión con Supabase Auth. Cada usuario tiene su historial de conversaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Herramientas conectadas */}
      <section id="herramientas" className="py-24 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="space-y-3 mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Herramientas conectadas
          </h2>
          <p className="text-sm text-[#8e9bb0] max-w-xl mx-auto">
            Elige una sugerencia o escribe lo que necesites. El agente detecta la intención y ejecuta la función correcta.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {/* Card 1: get_weather */}
          <div className="bg-[#0a0d14] border border-[#1f2533] p-6 rounded-2xl space-y-4 hover:border-[#d4af37]/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0e121b] border border-[#1f2533] flex items-center justify-center text-[#fae188]">
                <CloudSun className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-mono text-xs text-[#fae188]">get_weather</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              “¿Cómo está el clima en Medellín?”
            </h4>
            <p className="text-xs text-[#8e9bb0] font-mono leading-relaxed">
              → 28 °C, parcialmente nublado · probabilidad de lluvia 20 %
            </p>
          </div>

          {/* Card 2: create_reminder */}
          <div className="bg-[#0a0d14] border border-[#1f2533] p-6 rounded-2xl space-y-4 hover:border-[#d4af37]/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0e121b] border border-[#1f2533] flex items-center justify-center text-[#fae188]">
                <CalendarClock className="w-4 h-4 text-[#d4af37]" />
              </div>
              <span className="font-mono text-xs text-[#fae188]">create_reminder</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              “Recuérdame estudiar mañana a las 8 pm”
            </h4>
            <p className="text-xs text-[#8e9bb0] font-mono leading-relaxed">
              → Recordatorio creado para mañana, 20:00.
            </p>
          </div>

          {/* Card 3: search_web */}
          <div className="bg-[#0a0d14] border border-[#1f2533] p-6 rounded-2xl space-y-4 hover:border-[#d4af37]/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0e121b] border border-[#1f2533] flex items-center justify-center text-[#fae188]">
                <Search className="w-4 h-4 text-sky-400" />
              </div>
              <span className="font-mono text-xs text-[#fae188]">search_web</span>
            </div>
            <h4 className="text-sm font-semibold text-white">
              “Busca noticias sobre agentes de IA”
            </h4>
            <p className="text-xs text-[#8e9bb0] font-mono leading-relaxed">
              → 3 resultados relevantes · OpenAI, Anthropic, Google
            </p>
          </div>
        </div>
      </section>

      {/* Section: Arquitectura del proyecto */}
      <section id="arquitectura" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Description & Stack Rows */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Arquitectura del proyecto
            </h2>
            <p className="text-sm text-[#8e9bb0] leading-relaxed">
              Frontend en React + TanStack Start / Next.js, backend en FastAPI con Gemini, autenticación y persistencia en Supabase. La comunicación con el modelo usa Server-Sent Events para entregar cada fragmento de respuesta al instante.
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-[#0a0d14] border border-[#1f2533] px-5 py-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#8e9bb0]">Frontend</span>
                <span className="font-semibold text-white font-mono">React / TanStack Start / Tailwind CSS v4</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f2533] px-5 py-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#8e9bb0]">Backend</span>
                <span className="font-semibold text-white font-mono">FastAPI / Gemini 2.5 Flash / SSE streaming</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f2533] px-5 py-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#8e9bb0]">Auth</span>
                <span className="font-semibold text-white font-mono">Supabase Auth (email + Google OAuth)</span>
              </div>
              <div className="bg-[#0a0d14] border border-[#1f2533] px-5 py-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#8e9bb0]">Datos</span>
                <span className="font-semibold text-white font-mono">Supabase PostgreSQL + Vector store</span>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Flow Box */}
          <div className="lg:col-span-6">
            <div className="bg-[#0a0d14] border border-[#1f2533] rounded-2xl p-8 space-y-3.5 text-center font-mono text-xs">
              {/* Box 1: Usuario */}
              <div className="w-full bg-[#0e121b] border border-[#1f2533] py-3 rounded-xl text-white font-medium">
                Usuario
              </div>

              {/* Arrow */}
              <div className="text-[#fae188] text-xs font-semibold">
                ↑ mensaje ↓
              </div>

              {/* Box 2: FastAPI / Gemini */}
              <div className="w-full bg-[#0e121b] border border-[#d4af37]/50 py-3.5 rounded-xl text-[#fae188] font-bold shadow-md shadow-[#d4af37]/10">
                FastAPI / Gemini
              </div>

              {/* Row: 3 tools */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="bg-[#07090e] border border-[#1f2533] py-2 px-1 rounded-lg text-zinc-300 text-[11px] truncate">
                  get_weather
                </div>
                <div className="bg-[#07090e] border border-[#1f2533] py-2 px-1 rounded-lg text-zinc-300 text-[11px] truncate">
                  create_reminder
                </div>
                <div className="bg-[#07090e] border border-[#1f2533] py-2 px-1 rounded-lg text-zinc-300 text-[11px] truncate">
                  search_web
                </div>
              </div>

              {/* Arrow */}
              <div className="text-[#fae188] text-xs font-semibold pt-1">
                ↑ resultados ↓
              </div>

              {/* Box 3: Respuesta final */}
              <div className="w-full bg-[#0e121b] border border-[#1f2533] py-3 rounded-xl text-white font-medium">
                Respuesta final
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 text-center border-t border-[#1f2533] bg-[#07090e]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Alcanza tu mejor versión con <span className="text-[#fae188]">Fokus</span>
          </h2>
          <p className="text-sm text-[#8e9bb0] max-w-lg mx-auto leading-relaxed">
            Comienza tu camino hacia una vida más ordenada y enfocada. Protege tu tiempo, supera la postergación y construye tus metas día a día.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fae188] to-[#d4af37] hover:brightness-110 text-[#07090e] font-bold text-sm shadow-lg shadow-[#d4af37]/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Bot className="w-4 h-4 stroke-[2.5]" />
              <span>Empezar con Fokus</span>
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-[#0e121b] hover:bg-[#141925] border border-[#1f2533] text-white text-sm font-medium transition-all cursor-pointer"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#1f2533] bg-[#07090e] py-8 px-6 text-xs text-[#8e9bb0]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FokusIcon size={26} />
            <span className="font-display font-bold text-sm text-white">Fokus</span>
          </div>

          <p className="font-mono text-[11px] text-[#8e9bb0]">
            Crecimiento Personal & Profesional · Next.js · FastAPI · Gemini · Google Calendar
          </p>
        </div>
      </footer>
    </div>
  );
}
