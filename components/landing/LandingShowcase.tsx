'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Play,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ShieldCheck,
  CalendarCheck2,
} from 'lucide-react';

export function LandingShowcase() {
  const [activeTab, setActiveTab] = useState<'briefing' | 'deepwork' | 'eisenhower'>('deepwork');

  // Real-time Countdown Timer (starts at 01:14:20 = 4460 seconds)
  const INITIAL_SECONDS = 4460;
  const TOTAL_SECONDS = 5400; // 90 min = 5400s
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SECONDS);

  useEffect(() => {
    // Settle initial capture, then start live 1-second countdown
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            return TOTAL_SECONDS; // Reset to 90 min when reaching zero
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [TOTAL_SECONDS]);

  // Format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressFraction = (TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS;
  const strokeRadius = 48;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference * (1 - progressFraction);

  return (
    <div className="w-full max-w-[430px] mx-auto space-y-3">
      {/* Comp 3 Stepper Tabs with Warm Amber Glow & Interactive State */}
      <div className="flex items-center justify-between gap-2 relative">
        {/* Tab 1: Daily Briefing & Clima */}
        <button
          type="button"
          onClick={() => setActiveTab('briefing')}
          className={`flex-1 min-w-0 py-1.5 sm:py-2 px-1 sm:px-2.5 rounded-2xl text-left transition-all duration-300 cursor-pointer ${
            activeTab === 'briefing'
              ? 'bg-[#f4e0ba] border border-amber-300/90 shadow-md shadow-amber-500/20 transform scale-[1.02]'
              : 'hover:bg-white/60 opacity-80 hover:opacity-100'
          }`}
        >
          <span className="block text-[9px] sm:text-[11px] font-mono font-bold tracking-tight text-slate-600 leading-tight">
            08:00 AM •
          </span>
          <span className="block text-[11px] sm:text-[14px] font-bold text-slate-900 leading-tight mt-0.5 truncate">
            Daily Briefing
          </span>
          <span className="block text-[10px] sm:text-[13px] font-bold text-slate-800 leading-tight truncate">
            &amp; Clima
          </span>
        </button>

        {/* Tab 2: Bloque Deep Work (Active default) */}
        <button
          type="button"
          onClick={() => setActiveTab('deepwork')}
          className={`flex-1 min-w-0 py-1.5 sm:py-2 px-1 sm:px-2 rounded-2xl text-center transition-all duration-300 cursor-pointer ${
            activeTab === 'deepwork'
              ? 'bg-[#f4e0ba] border border-amber-300/90 shadow-md shadow-amber-500/20 transform scale-[1.03]'
              : 'hover:bg-white/60 opacity-80 hover:opacity-100'
          }`}
        >
          <span className="block text-[9px] sm:text-[11px] font-mono font-bold text-amber-900 tracking-wider">
            • 10:30 AM •
          </span>
          <span className="block text-[11px] sm:text-[14px] font-bold text-slate-950 leading-tight mt-0.5 truncate">
            Deep Work
          </span>
          <span className="block text-[9px] sm:text-[11px] text-amber-900/90 font-semibold leading-tight truncate">
            (90 min)
          </span>
        </button>

        {/* Tab 3: Matriz Eisenhower */}
        <button
          type="button"
          onClick={() => setActiveTab('eisenhower')}
          className={`flex-1 min-w-0 py-1.5 sm:py-2 px-1 sm:px-2.5 rounded-2xl text-right transition-all duration-300 cursor-pointer ${
            activeTab === 'eisenhower'
              ? 'bg-[#f4e0ba] border border-amber-300/90 shadow-md shadow-amber-500/20 transform scale-[1.02]'
              : 'hover:bg-white/60 opacity-80 hover:opacity-100'
          }`}
        >
          <span className="block text-[9px] sm:text-[11px] font-mono font-bold tracking-tight text-slate-600 leading-tight">
            04:00 PM •
          </span>
          <span className="block text-[11px] sm:text-[14px] font-bold text-slate-900 leading-tight mt-0.5 truncate">
            Matriz
          </span>
          <span className="block text-[10px] sm:text-[13px] font-bold text-slate-800 leading-tight truncate">
            Eisenhower
          </span>
        </button>
      </div>

      {/* Floating Glass Showcase Container with Animated Transition */}
      <div className="w-full h-[320px] rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-white/95 via-white/85 to-teal-50/50 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-teal-950/10 flex flex-col justify-between transition-all duration-400 overflow-hidden relative">
        {/* VIEW 1: Daily Briefing & Clima */}
        {activeTab === 'briefing' && (
          <div className="h-full flex flex-col justify-between animate-fadeIn text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-4 h-4 text-amber-600 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">
                    Clima &amp; Energía
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    21°C Despejado • Óptimo
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-[11px] font-semibold text-teal-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Matutino
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Compromisos prioritarios hoy
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-slate-200/70 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">
                    10:30 AM — Arquitectura Fokus (90m blindados)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-slate-200/70 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span className="font-medium text-slate-700 truncate">
                    03:00 PM — Revisión métricas con equipo
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between bg-slate-100/70 p-2.5 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-700" />
                <span className="text-[11px] font-semibold text-slate-700">
                  Audio Síntesis (1:45 min)
                </span>
              </div>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                title="Reproducir briefing"
              >
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: Deep Work Shield (Real-time timer & Circular countdown) */}
        {activeTab === 'deepwork' && (
          <div className="h-full flex flex-col justify-between animate-fadeIn text-center">
            {/* Countdown Progress Ring with generous breathing space for digits */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-0.5">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={strokeRadius}
                  stroke="#e2e8f0"
                  strokeWidth="5.5"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={strokeRadius}
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
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-800 font-semibold mt-0.5">
                  En progreso
                </span>
              </div>
            </div>

            {/* Session Info */}
            <div className="space-y-0.5 my-1">
              <h3 className="text-[16px] font-display font-bold text-slate-900 tracking-tight">
                Arquitectura de Sistema
              </h3>
              <p className="text-[12px] font-semibold text-slate-700">
                Fokus • Bloque Blindado
              </p>
            </div>

            {/* Status Badge */}
            <div className="pt-1 flex flex-col items-center justify-center gap-0.5 text-[12px] text-slate-600 max-w-full px-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 bg-teal-50 px-2.5 sm:px-3 py-1 rounded-full border border-teal-200/60 shadow-2xs text-[11px] sm:text-[12px] max-w-full">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                <span className="truncate">Google Calendar Sincronizado</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-full">
                Modo No Molestar Activo • Cero Colisiones
              </span>
            </div>
          </div>
        )}

        {/* VIEW 3: Matriz Eisenhower */}
        {activeTab === 'eisenhower' && (
          <div className="h-full flex flex-col justify-between animate-fadeIn text-left space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">
                    Matriz Eisenhower 2×2
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Priorización automática
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-semibold">
                4 cuadrantes
              </span>
            </div>

            {/* 2x2 Mini Matrix Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {/* Q1: Urgente & Importante */}
              <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-200/60">
                <span className="font-bold text-rose-800 block text-[10px] uppercase font-mono">
                  1. Hacer Ya
                </span>
                <span className="text-slate-800 font-semibold truncate block mt-0.5">
                  Deploy API V2
                </span>
              </div>

              {/* Q2: No urgente & Importante */}
              <div className="p-2 rounded-xl bg-teal-50/80 border border-teal-200/60">
                <span className="font-bold text-teal-800 block text-[10px] uppercase font-mono">
                  2. Agendar (Foco)
                </span>
                <span className="text-slate-800 font-semibold truncate block mt-0.5">
                  Diseño Fokus
                </span>
              </div>

              {/* Q3: Urgente & No importante */}
              <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/60">
                <span className="font-bold text-amber-800 block text-[10px] uppercase font-mono">
                  3. Delegar
                </span>
                <span className="text-slate-700 font-medium truncate block mt-0.5">
                  Responder emails
                </span>
              </div>

              {/* Q4: Ni urgente ni importante */}
              <div className="p-2 rounded-xl bg-slate-100/80 border border-slate-200/60">
                <span className="font-bold text-slate-600 block text-[10px] uppercase font-mono">
                  4. Descartar
                </span>
                <span className="text-slate-600 font-medium truncate block mt-0.5">
                  Reunión sin orden
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
              <span className="flex items-center gap-1.5 font-medium">
                <CalendarCheck2 className="w-3.5 h-3.5 text-teal-700" />
                Sincronizado con Google Calendar
              </span>
              <span className="font-mono text-teal-800 font-bold text-[10px]">
                En sincronía
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
