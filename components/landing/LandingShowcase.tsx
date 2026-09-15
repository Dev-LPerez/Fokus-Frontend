'use client';

import React, { useState } from 'react';
import {
  CloudSun,
  Volume2,
  BrainCircuit,
  Clock,
  Target,
  CalendarCheck2,
} from 'lucide-react';

export function LandingShowcase() {
  const [activeMobileTab, setActiveMobileTab] = useState<'briefing' | 'deepwork' | 'eisenhower'>('deepwork');

  return (
    <div className="mt-10 sm:mt-14 relative max-w-5xl mx-auto rounded-3xl p-2.5 sm:p-3 bg-gradient-to-b from-white/90 via-white/70 to-white/40 border border-slate-200/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      {/* Simulated App Topbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50/90 rounded-2xl border border-slate-200/70 mb-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-slate-400 ml-1 sm:ml-2 text-[11px] truncate">
            fokus.lgperez.dev
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono flex-shrink-0 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-700 font-semibold hidden sm:inline">Google Calendar Conectado</span>
          <span className="text-emerald-700 font-semibold sm:hidden">Sincronizado</span>
        </div>
      </div>

      {/* Mobile Segmented Tab Switcher (Visible only on mobile/tablet < 1024px) */}
      <div className="lg:hidden p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 grid grid-cols-3 gap-1 mb-3 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveMobileTab('briefing')}
          className={`min-h-[38px] py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 text-[11px] cursor-pointer ${
            activeMobileTab === 'briefing'
              ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CloudSun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="truncate">Briefing</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab('deepwork')}
          className={`min-h-[38px] py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 text-[11px] cursor-pointer ${
            activeMobileTab === 'deepwork'
              ? 'bg-white text-[#0F766E] shadow-xs font-bold border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0" />
          <span className="truncate">Deep Work</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab('eisenhower')}
          className={`min-h-[38px] py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 text-[11px] cursor-pointer ${
            activeMobileTab === 'eisenhower'
              ? 'bg-white text-indigo-700 shadow-xs font-bold border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="truncate">Prioridades</span>
        </button>
      </div>

      {/* Grid: On Desktop shows all 3 columns; on Mobile shows selected tab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 text-left">
        {/* Column 1: Morning Briefing */}
        <div
          className={`lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-3 transition-opacity ${
            activeMobileTab === 'briefing' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-800">Daily Briefing</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
              Hoy · 09:30 AM
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Bogotá, CO</span>
              <span className="font-mono text-slate-500">22°C Despejado</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              2 reuniones agendadas hoy. Bloque óptimo de Deep Work disponible a las 10:00 AM.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium pt-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Lectura por voz disponible</span>
          </div>
        </div>

        {/* Column 2: Deep Work Block Card */}
        <div
          className={`lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white/90 to-emerald-50/60 border border-teal-200/70 shadow-2xs space-y-3 transition-opacity ${
            activeMobileTab === 'deepwork' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#0F766E] flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-900">
                Sesión de Deep Work Programada
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
              Google Calendar
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/90 border border-teal-200/60 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                🎯 Arquitectura & Lanzamiento MVP
              </h4>
              <span className="text-xs font-mono font-bold text-[#0F766E]">90 min</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span>10:00 AM – 11:30 AM · Sincronizado en tu agenda</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 rounded-full w-3/4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Detectado y blindado automáticamente contra colisiones de horario.
          </p>
        </div>

        {/* Column 3: Eisenhower Mini Matrix */}
        <div
          className={`lg:col-span-3 p-4 sm:p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs space-y-3 transition-opacity ${
            activeMobileTab === 'eisenhower' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-800">Matriz 2x2</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Prioridades</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200/70 text-rose-900 flex items-center justify-between">
              <span className="font-medium text-[11px]">Urgente & Importante</span>
              <span className="font-mono text-[11px] font-bold">2 tareas</span>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200/70 text-indigo-900 flex items-center justify-between">
              <span className="font-medium text-[11px]">Estratégico (Planificar)</span>
              <span className="font-mono text-[11px] font-bold">4 tareas</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Score de claridad semanal: <strong className="text-teal-700 font-mono">94%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
