'use client';

import React, { useMemo } from 'react';
import {
  Shield,
  Zap,
  Clock,
  Sparkles,
  CalendarCheck,
  RefreshCw,
  Plus,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { CalendarEventItem } from '@/app/(protected)/calendar/page';

interface FocusShieldDeckProps {
  events: CalendarEventItem[];
  calendarConnected: boolean;
  onQuickDeepWork: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function FocusShieldDeck({
  events,
  calendarConnected,
  onQuickDeepWork,
  onRefresh,
  isRefreshing,
}: FocusShieldDeckProps) {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Today's events calculations
  const { todayDeepWorkMinutes, todayMeetingMinutes, todayTotalHours, energyScore, nextEvent } = useMemo(() => {
    const todayEvents = events.filter((ev) => ev.start.slice(0, 10) === todayStr);

    let deepWorkMins = 0;
    let meetingMins = 0;

    const now = new Date();
    let upcoming: CalendarEventItem | null = null;

    todayEvents.forEach((ev) => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      const durationMins = Math.max(15, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));

      if (ev.source === 'deep_work' || ev.title.toLowerCase().includes('deep work') || ev.title.toLowerCase().includes('foco')) {
        deepWorkMins += durationMins;
      } else {
        meetingMins += durationMins;
      }

      if (start > now && (!upcoming || start < new Date(upcoming.start))) {
        upcoming = ev;
      }
    });

    const totalMinutes = deepWorkMins + meetingMins;
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Calculated energy score: rewards deep work, penalizes overload
    let score = 75;
    if (deepWorkMins >= 90) score += 15;
    else if (deepWorkMins >= 45) score += 8;

    if (meetingMins > 180) score -= 12;
    else if (meetingMins > 120) score -= 6;

    score = Math.min(98, Math.max(62, score));

    return {
      todayDeepWorkMinutes: deepWorkMins,
      todayMeetingMinutes: meetingMins,
      todayTotalHours: totalHours,
      energyScore: score,
      nextEvent: upcoming as CalendarEventItem | null,
    };
  }, [events, todayStr]);

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (energyScore / 100) * circumference;

  return (
    <aside className="w-full lg:w-80 xl:w-88 flex flex-col gap-4 flex-shrink-0">
      {/* Main Focus Shield Card */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 p-5 shadow-sm shadow-[#1c6662]/5 relative overflow-hidden">
        {/* Subtle Ambient Glow inside Card */}
        <div 
          aria-hidden="true" 
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#f4e0ba]/40 blur-2xl pointer-events-none" 
        />

        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1c6662]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
              Escudo de Enfoque
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1 rounded-lg text-slate-400 hover:text-[#1c6662] hover:bg-white/60 transition-colors cursor-pointer"
            title="Actualizar métricas"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1c6662]' : ''}`} />
          </button>
        </div>

        {/* Energy Radial Gauge */}
        <div className="py-4 flex items-center justify-center gap-5 relative z-10">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
              {/* Track */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#edece9"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Progress arc */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#1c6662"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-xl font-bold text-slate-900 tracking-tight leading-none">
                {energyScore}%
              </span>
              <span className="text-[11px] font-mono text-[#1c6662] font-semibold uppercase mt-0.5">
                Energía
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-display font-bold text-sm text-slate-900 leading-tight">
              {energyScore >= 80 ? 'Ritmo Óptimo' : energyScore >= 70 ? 'Ritmo Equilibrado' : 'Sobrecarga de Citas'}
            </span>
            <span className="text-xs text-slate-500 mt-0.5 leading-snug">
              {todayDeepWorkMinutes > 0
                ? `${Math.round(todayDeepWorkMinutes / 60 * 10) / 10}h blindadas contra interrupciones.`
                : 'Sin bloques blindados aún hoy.'}
            </span>
          </div>
        </div>

        {/* Time Breakdown Cards */}
        <div className="grid grid-cols-2 gap-2 pt-2 relative z-10">
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60">
            <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-semibold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Deep Work</span>
            </div>
            <span className="font-mono text-base font-bold text-slate-900 block mt-1">
              {Math.floor(todayDeepWorkMinutes / 60)}h {todayDeepWorkMinutes % 60}m
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-slate-200/60">
            <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Reuniones</span>
            </div>
            <span className="font-mono text-base font-bold text-slate-900 block mt-1">
              {Math.floor(todayMeetingMinutes / 60)}h {todayMeetingMinutes % 60}m
            </span>
          </div>
        </div>

        {/* Quick CTA to protect a 90m slot */}
        <div className="pt-4 relative z-10">
          <button
            onClick={onQuickDeepWork}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#1c6662] hover:bg-[#15524f] text-white text-xs font-semibold shadow-md shadow-[#1c6662]/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c6662]/40"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Blindar 90m Deep Work Ahora</span>
          </button>
        </div>
      </div>

      {/* Integration & Next Event Card */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 p-5 shadow-sm shadow-[#1c6662]/5 space-y-3">
        {/* Google Calendar Sync Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Google Calendar</span>
          {calendarConnected ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-teal-50 text-[#1c6662] border border-teal-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sincronizado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200">
              Modo Local
            </span>
          )}
        </div>

        {/* Next event snapshot */}
        <div className="p-3 rounded-2xl bg-[#edece9]/60 border border-white/80">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Siguiente Compromiso
          </span>
          {nextEvent ? (
            <div className="mt-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {nextEvent.title}
              </h4>
              <span className="text-[11px] font-mono text-[#1c6662] mt-0.5 block">
                {new Date(nextEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {nextEvent.project || 'Agenda'}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic mt-1">
              No hay compromisos pendientes para hoy.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
