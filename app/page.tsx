import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Zap,
  CalendarCheck2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Target,
  Lock,
  CheckCircle2,
  ChevronRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import { FokusLogo } from '@/components/brand/FokusLogo';
import { GoogleIcon } from '@/components/auth/AuthSplitView';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingShowcase } from '@/components/landing/LandingShowcase';
import { LandingMobileBar } from '@/components/landing/LandingMobileBar';

export const metadata: Metadata = {
  title: 'Fokus — Tu Espacio de Crecimiento Personal & Profesional',
  description:
    'Organiza tu vida, alcanza tus metas y protege tu tiempo: integración con Google Calendar, Matriz de Eisenhower y sesiones de enfoque profundo.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans relative overflow-x-hidden scroll-smooth">
      {/* Ambient Luminous Backdrops */}
      <div className="fixed -top-40 -left-40 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-teal-500/10 blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/4 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-indigo-500/10 blur-[110px] sm:blur-[150px] pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-cyan-500/10 blur-[100px] sm:blur-[130px] pointer-events-none -z-10" />
      <div className="fixed -bottom-40 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-amber-500/8 blur-[120px] sm:blur-[160px] pointer-events-none -z-10" />

      {/* Modern Responsive Header with Mobile Drawer */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-2xs backdrop-blur-md mb-5 sm:mb-6 animate-fade-in max-w-full">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse flex-shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate">
            Copiloto de Crecimiento Personal & Profesional
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-[#0F766E] font-medium flex-shrink-0">
            v2.0
          </span>
        </div>

        {/* Main Headline with Mobile-First Fluid Typography */}
        <h1 className="max-w-4xl mx-auto text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 leading-[1.15] sm:leading-[1.1]">
          Tu agenda. Tu tiempo.{' '}
          <span className="text-[#0F766E] block sm:inline mt-1 sm:mt-0">
            Tu enfoque protegido.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed px-2">
          Fokus trasciende el chatbot convencional: audita tu disponibilidad real, bloquea sesiones
          de concentración en Google Calendar, clasifica tus metas con la Matriz de Eisenhower y te
          acompaña cada mañana con briefings inteligentes.
        </p>

        {/* Action Buttons Hub with 48px Touch Targets & Instant Touch Feedback */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 max-w-md mx-auto w-full px-2 sm:px-0">
          <Link
            href="/register"
            className="w-full sm:w-auto min-h-[48px] px-6 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0F766E] via-teal-600 to-emerald-600 hover:brightness-105 active:scale-[0.98] text-white font-semibold text-sm sm:text-base shadow-lg shadow-teal-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Crear cuenta gratuita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto min-h-[48px] px-5 sm:px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold text-sm sm:text-base shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <GoogleIcon className="w-4 h-4 flex-shrink-0" />
            <span>Acceder con Google</span>
          </Link>
        </div>

        {/* Trust & Guarantee Markers */}
        <div className="mt-7 sm:mt-8 grid grid-cols-1 xs:grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-8 text-[11px] text-slate-500 font-mono px-4">
          <div className="flex items-center justify-center gap-1.5 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Google Calendar API</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1">
            <Lock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Tokens Cifrados AES-256</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Cero Venta de Datos</span>
          </div>
        </div>

        {/* Responsive Interactive UI Showcase (Segmented on Mobile, 3 Columns on Desktop) */}
        <LandingShowcase />
      </section>

      {/* Pillars Section */}
      <section id="pilares" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F766E]">
            Arquitectura de Hábitos
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Los 4 Pilares de Alto Rendimiento en Fokus
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Diseñado para profesionales que buscan serenidad mental, cero colisiones de horario y
            avance implacable en proyectos trascendentales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/85 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-50 border border-teal-200/60 text-[#0F766E] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Deep Work Autónomo
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Algoritmo de auditoría de jornada que identifica tus huecos libres de 90 minutos y los
              blinda directamente en tu calendario.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/85 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Google Calendar Sync
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Integración nativa vía OAuth 2.0. Consulta tu agenda en tiempo real y programa sesiones
              sin salir de la conversación.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/85 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-50 border border-cyan-200/60 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Matriz de Eisenhower
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Distingue al instante lo urgente de lo verdaderamente importante. Organiza tus metas en
              cuadrantes visuales de alta claridad.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/85 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group space-y-3 sm:space-y-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
              Daily Briefing con Audio
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Comienza la mañana con un resumen ejecutivo: clima actual, primeros compromisos y metas
              clave con síntesis de voz interactiva.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive: Deep Work & Calendar */}
      <section id="deep-work" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] sm:text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Protección activa contra interrupciones</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              Convierte el tiempo fragmentado en sesiones de impacto real
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
              El mayor enemigo de la productividad moderna es el horario disperso lleno de micro-reuniones.
              Fokus escanea tu día completo, detecta espacios de al menos 90 minutos y te propone
              blindarlos como bloques sagrados de Deep Work en tu Google Calendar con un solo toque.
            </p>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] flex-shrink-0 mt-0.5" />
                <span>Evita colisiones de horario consultando tu disponibilidad en tiempo real.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] flex-shrink-0 mt-0.5" />
                <span>Crea eventos con notificaciones y recordatorios automáticos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E] flex-shrink-0 mt-0.5" />
                <span>Asocia cada bloque a una tarea específica de tu tablero de proyectos.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F766E] hover:text-[#0d645e] transition-colors min-h-[44px]"
              >
                <span>Empieza a blindar tu tiempo hoy</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div id="calendar" className="lg:col-span-6">
            <div className="p-5 sm:p-8 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xl shadow-slate-900/5 space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold font-mono text-sm">
                    G
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Google Calendar OAuth 2.0</h4>
                    <p className="text-[11px] text-slate-500">Tokens seguros y almacenamiento cifrado</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  Certificado
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-[11px] sm:text-xs">
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex items-center justify-between">
                  <span className="truncate pr-2">Auditoría (get_calendar_agenda)</span>
                  <span className="text-teal-600 font-semibold flex-shrink-0">Listo ✓</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex items-center justify-between">
                  <span className="truncate pr-2">Huecos libres (find_free_work_slots)</span>
                  <span className="text-teal-600 font-semibold flex-shrink-0">Listo ✓</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex items-center justify-between">
                  <span className="truncate pr-2">Reserva (schedule_deep_work)</span>
                  <span className="text-teal-600 font-semibold flex-shrink-0">Listo ✓</span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-[11px] sm:text-xs leading-relaxed">
                <strong>Privacidad Garantizada:</strong> Fokus no lee correos ni documentos de Drive.
                El permiso se restringe estrictamente a eventos de tu agenda para blindar tu concentración.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive: Eisenhower Matrix */}
      <section id="eisenhower" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600">
            Claridad Estratégica
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight">
            La Matriz de Eisenhower en tu día a día
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
            Nunca más te sientas culpable por no terminarlo todo. Organiza tus compromisos bajo los
            cuatro cuadrantes y enfoca tu energía donde genera mayor retorno.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6 max-w-4xl mx-auto">
          {/* Q1 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-rose-50/60 border border-rose-200/70 space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono font-bold text-rose-700 uppercase">Cuadrante I · Hacer ya</span>
            <h4 className="text-sm sm:text-base font-bold text-rose-950">Urgente e Importante</h4>
            <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed">
              Crisis, entregas críticas y plazos ineludibles. Resuélvelos en tus primeros bloques del día.
            </p>
          </div>

          {/* Q2 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/70 border border-indigo-200/70 space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono font-bold text-indigo-700 uppercase">Cuadrante II · Planificar</span>
            <h4 className="text-sm sm:text-base font-bold text-indigo-950">No Urgente pero Trascendente</h4>
            <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
              Estrategia, estudio, salud y relaciones. Aquí se construye tu futuro; blindado con Deep Work.
            </p>
          </div>

          {/* Q3 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/60 border border-amber-200/70 space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">Cuadrante III · Delegar</span>
            <h4 className="text-sm sm:text-base font-bold text-amber-950">Urgente pero No Importante</h4>
            <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
              Interrupciones y peticiones ajenas. Automatiza, negocia o delega para proteger tu energía.
            </p>
          </div>

          {/* Q4 */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-100/70 border border-slate-200/80 space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-600 uppercase">Cuadrante IV · Eliminar</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">Ni Urgente Ni Importante</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ladrones de tiempo y distracciones digitales. Filtra sin piedad para mantener la calma.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Privacy Commitment */}
      <section id="seguridad" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto p-6 sm:p-12 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xl shadow-slate-900/5 text-center space-y-4 sm:space-y-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-teal-50 border border-teal-200/60 text-[#0F766E] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Compromiso Inquebrantable con tu Privacidad
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            En Fokus, tus datos personales, tareas y eventos de calendario son exclusivamente tuyos.
            Cumplimos rigurosamente con la Política de Datos de Usuario de los Servicios de API de Google
            (Google API Services User Data Policy) y los requisitos de Uso Limitado (Limited Use).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 sm:pt-4 text-left">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                Cero Venta de Datos
              </span>
              <p className="text-[11px] text-slate-500">Nunca comercializamos tu información con terceros ni anunciantes.</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                Cifrado en Tránsito y Reposo
              </span>
              <p className="text-[11px] text-slate-500">Conexiones HTTPS/TLS y tokens protegidos con claves seguras.</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-600 flex-shrink-0" />
                Control Total
              </span>
              <p className="text-[11px] text-slate-500">Desvincula Google Calendar o elimina tu cuenta en un clic cuando desees.</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/privacy"
              className="text-xs font-medium text-[#0F766E] hover:text-[#0d645e] underline underline-offset-4 min-h-[44px] inline-flex items-center"
            >
              Leer la Política de Privacidad completa →
            </Link>
          </div>
        </div>
      </section>

      {/* Pre-Footer Final CTA Card */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-14 bg-gradient-to-r from-[#0F766E] via-teal-700 to-slate-900 text-white shadow-2xl text-center space-y-4 sm:space-y-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            Comienza tu cambio hoy
          </span>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            Recupera el control consciente de tu tiempo y energía
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-teal-100 max-w-xl mx-auto leading-relaxed px-2">
            Únete a profesionales y creadores que planifican su jornada con serenidad, claridad y
            bloques protegidos de enfoque profundo.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto w-full">
            <Link
              href="/register"
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Crear cuenta gratis</span>
              <ArrowRight className="w-4 h-4 text-teal-800" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/20 text-white font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Iniciar con Google</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-10 sm:py-12 px-4 sm:px-6 lg:px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-xs text-slate-500 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <FokusLogo size={32} showTagline={true} />
            <p className="text-[11px] text-slate-400 mt-1">
              Desarrollado con dedicación por{' '}
              <a
                href="https://github.com/Dev-LPerez"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-slate-900 font-medium underline min-h-[30px] inline-flex items-center"
              >
                Dev-LPerez
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 font-medium text-[11px] sm:text-xs">
            <a href="#pilares" className="hover:text-slate-900 transition-colors py-1">
              Pilares
            </a>
            <a href="#deep-work" className="hover:text-slate-900 transition-colors py-1">
              Deep Work
            </a>
            <a href="#calendar" className="hover:text-slate-900 transition-colors py-1">
              Google Calendar
            </a>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors underline py-1">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors underline py-1">
              Condiciones del Servicio
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors font-semibold text-[#0F766E] py-1">
              Iniciar Sesión
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-200/50 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} Fokus. Todos los derechos reservados. Tu agenda. Tu tiempo. Tu enfoque.
        </div>
      </footer>

      {/* Floating Mobile Bottom Quick Action Bar */}
      <LandingMobileBar />
    </div>
  );
}
