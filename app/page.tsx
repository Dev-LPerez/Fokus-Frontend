import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  BrainCircuit,
  Target,
  Calendar,
  Compass,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { FokusLogo } from '@/components/brand/FokusLogo';
import { GoogleIcon } from '@/components/auth/AuthSplitView';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingShowcase } from '@/components/landing/LandingShowcase';

export const metadata: Metadata = {
  title: 'Fokus — Tu Espacio de Crecimiento Personal & Profesional',
  description:
    'Tu jornada blindada, de la mañana a la noche: integración con Google Calendar, Matriz de Eisenhower y sesiones de enfoque profundo.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#edece9] text-[#0f1014] font-sans relative overflow-x-clip selection:bg-[#f4e0ba]">
      {/* Comp 3 Ambient Glows and Subtle Right-Hand Split Background */}
      <div className="fixed top-0 right-0 w-1/2 h-full bg-white/25 pointer-events-none -z-10 border-l border-black/5" />
      <div className="fixed -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-[#f4e0ba]/60 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 -left-20 w-[450px] h-[450px] rounded-full bg-[#1c6662]/10 blur-[140px] pointer-events-none -z-10" />

      {/* Floating Header */}
      <LandingHeader />

      {/* Hero Section (Comp 3 Balanced Split Topology) */}
      <section className="relative pt-28 xl:pt-36 pb-20 px-4 sm:px-8 max-w-[1376px] xl:px-[138px] mx-auto min-h-[690px] flex items-center">
        <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
          {/* Left Column: Hero Copy & Actions */}
          <div className="w-full lg:max-w-[500px] space-y-6 text-left pt-2">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-300/70 shadow-2xs hover:scale-105 transition-transform duration-200 cursor-default">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase font-mono text-slate-800">
                SISTEMA DE HÁBITOS &amp; FOCO
              </span>
            </div>

            {/* Main Headline (Comp 3: Solid #0f1014 color, cap height 36px, 49px font) */}
            <h1 className="text-3xl sm:text-5xl lg:text-[49px] font-display font-bold tracking-tight text-[#0f1014] leading-[1.08] break-words">
              Tu jornada blindada,<br />de la mañana a la noche.
            </h1>

            {/* Subtitle (Calibrated to 15.2px cap height) */}
            <p className="text-[16px] sm:text-[17px] text-slate-700 leading-relaxed max-w-[480px] font-normal">
              Avanza cada día con claridad. Consolida hábitos sostenibles y protege tus bloques de enfoque sin agotamiento.
            </p>

            {/* Primary Action Button (Comp 3: Single dark teal pill with amber glow & Google icon, 366x66px) */}
            <div className="pt-2">
              <Link
                href="/login"
                className="group inline-flex items-center justify-between gap-4 w-full sm:w-[366px] max-w-[366px] h-[64px] sm:h-[66px] px-6 sm:px-8 rounded-full bg-[#1c6662] hover:bg-[#15524f] hover:scale-[1.03] active:scale-[0.98] text-white font-semibold text-[16px] sm:text-[17px] shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-teal-900/35 transition-all duration-300 cursor-pointer"
              >
                <span>Empezar gratis con Google</span>
                <span className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center p-1 shadow-xs group-hover:scale-110 transition-transform">
                  <GoogleIcon className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Comp-3 Stepper & Deep Work Shield (Width 413px aligned to 826px) */}
          <div className="w-full lg:w-[413px] lg:flex-shrink-0">
            <LandingShowcase />
          </div>
        </div>
      </section>

      {/* Pillars Section (#pilares) */}
      <section id="pilares" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-300/60 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1c6662]">
            Arquitectura de Hábitos
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Los 4 Pilares de Alto Rendimiento en Fokus
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Diseñado para profesionales que buscan serenidad mental, cero colisiones de horario y
            avance implacable en proyectos trascendentales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#1c6662] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Deep Work Autónomo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algoritmo de auditoría de jornada que identifica tus huecos libres de 90 minutos y los
              blinda directamente en tu calendario.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Matriz de Eisenhower
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Priorización dinámica que distingue lo urgente de lo importante, asegurando que tus
              metas críticas jamás se posterguen.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Google Calendar
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sincronización en tiempo real vía OAuth 2.0. El agente visualiza tus reuniones y crea
              eventos protegidos sin salir del chat.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Daily Briefing con Audio
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada mañana recibes un resumen conversacional con el pronóstico del clima, compromisos
              críticos y síntesis de voz nativa opcional.
            </p>
          </div>
        </div>
      </section>

      {/* Ecosystem Section (#ecosistema) */}
      <section id="ecosistema" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-300/60 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1c6662]">
            Ecosistema Integrado
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            De la Intención a la Ejecución Sin Fricción
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Fokus unifica tus herramientas cotidianas en un asistente cognitivo proactivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white/85 border border-white/90 shadow-md space-y-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h4 className="font-display font-bold text-lg text-slate-900">
              Resumen Matutino (Briefing)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al comenzar el día, Fokus te presenta tus 3 metas cardinales, el estado del clima y te sugiere el momento exacto para tu sesión de trabajo profundo.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/85 border border-white/90 shadow-md space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h4 className="font-display font-bold text-lg text-slate-900">
              Blindaje de Bloques Deep Work
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tus bloques de 90 minutos se inscriben en Google Calendar como eventos "No Molestar", evitando que otras personas programen reuniones que fragmenten tu atención.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/85 border border-white/90 shadow-md space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100/70 text-indigo-800 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h4 className="font-display font-bold text-lg text-slate-900">
              Reequilibrio en Matriz 2×2
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cualquier imprevisto se reorganiza automáticamente en los cuadrantes de Eisenhower, permitiéndote cerrar el día con sensación de triunfo y control.
            </p>
          </div>
        </div>
      </section>

      {/* Método Section (#metodo) */}
      <section id="metodo" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-300/60 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1c6662]">
            El Método Fokus
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Blindaje Cognitivo en 3 Fases Diarias
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Inspirado en la neurociencia del trabajo profundo y la gestión de energía mental para lograr resultados excepcionales sin agotamiento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1 */}
          <div className="p-7 rounded-3xl bg-white/85 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#1c6662] uppercase tracking-wider">
                Fase 1 • Mañana
              </span>
              <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                08:00
              </span>
            </div>
            <h4 className="font-display font-bold text-lg text-slate-900">
              Diagnóstico &amp; Briefing
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comienza antes de abrir el correo. El copiloto sintetiza el pronóstico del clima, tus reuniones inamovibles y define las 3 victorias cardinales del día.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="p-7 rounded-3xl bg-white/90 border-2 border-teal-700/50 shadow-md space-y-4 hover:shadow-lg transition-all relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-teal-800 uppercase tracking-wider">
                Fase 2 • Hiperenfoque
              </span>
              <span className="w-8 h-8 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center font-bold text-xs">
                10:30
              </span>
            </div>
            <h4 className="font-display font-bold text-lg text-slate-900">
              Ciclo Ultradiano (90 min)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              El tiempo se sella en Google Calendar bajo el estado "No Molestar". Tu atención se canaliza en una única meta estratégica guiada por el cronómetro visual.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-7 rounded-3xl bg-white/85 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-indigo-700 uppercase tracking-wider">
                Fase 3 • Cierre
              </span>
              <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                16:00
              </span>
            </div>
            <h4 className="font-display font-bold text-lg text-slate-900">
              Reequilibrio Eisenhower
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evalúa los avances, delega tareas imprevistas y descarta lo accesorio. Cierra la pantalla con la tranquilidad de tener la jornada de mañana preparada.
            </p>
          </div>
        </div>

        {/* Final Conversion Banner */}
        <div className="mt-14 p-6 sm:p-12 rounded-3xl bg-gradient-to-r from-teal-900 via-[#1c6662] to-[#15524f] text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl shadow-teal-950/20">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              Tu tiempo más valioso empieza hoy
            </h3>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              Sincroniza tu Google Calendar en segundos y experimenta la serenidad de una jornada protegida.
            </p>
          </div>
          <Link
            href="/login"
            className="group inline-flex items-center justify-between gap-3 sm:gap-4 w-full sm:w-auto max-w-[340px] px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.03] active:scale-[0.98] font-bold text-sm sm:text-base shadow-xl transition-all duration-300 cursor-pointer"
          >
            <span>Empezar gratis con Google</span>
            <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center p-1 shadow-xs group-hover:scale-110 transition-transform flex-shrink-0">
              <GoogleIcon className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-300/60 bg-white/60 py-8 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FokusLogo size={22} showTagline={false} />
            <span className="text-slate-400">·</span>
            <span>Tu agenda. Tu tiempo. Tu enfoque.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">
              Términos
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Acceso
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
