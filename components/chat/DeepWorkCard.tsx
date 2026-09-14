'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  CalendarCheck,
  Clock,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Zap,
  ArrowRight,
} from 'lucide-react';

export interface FreeSlot {
  start: string;
  end: string;
  duration_minutes?: number;
  label?: string;
  is_recommended?: boolean;
}

export interface DeepWorkCardProps {
  taskDescription?: string;
  project?: string | null;
  scheduledStart?: string;
  scheduledEnd?: string;
  durationMinutes?: number;
  googleEventId?: string | null;
  message?: string;
  // Interactive slot selection support
  availableSlots?: FreeSlot[];
  onSelectSlot?: (slot: FreeSlot) => void;
  isBooking?: boolean;
}

export function DeepWorkCard({
  taskDescription,
  project,
  scheduledStart,
  scheduledEnd,
  durationMinutes = 90,
  googleEventId,
  message,
  availableSlots,
  onSelectSlot,
  isBooking = false,
}: DeepWorkCardProps) {
  const isConfirmed = Boolean(scheduledStart && (googleEventId || scheduledEnd));
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  // Focus Timer state (Pomodoro / Immersion tracker)
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState((durationMinutes || 90) * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerSecondsLeft]);

  // Format hours nicely (e.g. "10:30 AM - 12:00 PM")
  const formatTimeRange = (start?: string, end?: string, mins = durationMinutes) => {
    if (!start || !end) {
      if (mins) {
        const hours = mins >= 60 ? `${Math.floor(mins / 60)}h` : '';
        const m = mins % 60 > 0 ? `${mins % 60}m` : '';
        return `Bloque de ${[hours, m].filter(Boolean).join(' ')}`;
      }
      return 'Horario bloqueado';
    }

    const parsePart = (val: string) => {
      try {
        if (val.includes('T')) {
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
        if (val.includes(' ') && val.split(' ')[1]) {
          return val.split(' ')[1];
        }
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return val;
      } catch {
        return val;
      }
    };

    const startFmt = parsePart(start);
    const endFmt = parsePart(end);
    const hours = mins >= 60 ? `${(mins / 60).toFixed(1).replace('.0', '')}h` : `${mins}m`;

    return `${startFmt} — ${endFmt} (${hours})`;
  };

  const formatSeconds = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCalendarLink = () => {
    return 'https://calendar.google.com';
  };

  // Case A: Interactive Slot Picker (Before final confirmation)
  if (!isConfirmed && availableSlots && availableSlots.length > 0) {
    const currentSelected = availableSlots[selectedSlotIndex] || availableSlots[0];

    return (
      <div className="w-full my-3 bg-white/95 backdrop-blur-xl border border-indigo-200/90 rounded-2xl p-4 sm:p-5 shadow-sm shadow-indigo-500/5 animate-fade-in text-slate-800 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 font-display">
                  Huecos Libres Detectados
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-50 border border-sky-200 text-sky-700 font-medium">
                  <Calendar className="w-3 h-3 text-sky-600" />
                  <span>Google Calendar</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                Elige el momento de mayor energía para blindar tu concentración
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 flex-shrink-0">
            <Zap className="w-3 h-3 text-indigo-600" />
            <span>{availableSlots.length} Opciones</span>
          </span>
        </div>

        {/* Slot Selection Grid */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-3 relative z-10">
          {taskDescription && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block font-semibold">
                Objetivo
              </span>
              <p className="font-semibold text-slate-800 truncate mt-0.5">
                {taskDescription}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {availableSlots.map((slot, idx) => {
              const isSelected = selectedSlotIndex === idx;
              const rangeText = formatTimeRange(slot.start, slot.end, slot.duration_minutes);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSlotIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-400/90 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">
                      Opción {idx + 1}
                    </span>
                    {(slot.is_recommended || idx === 0) && (
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-100/70 border border-amber-300/60 text-amber-800">
                        Óptimo
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-900 block">
                    {rangeText}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                    {slot.duration_minutes || durationMinutes} min ininterrumpidos
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Button */}
          {onSelectSlot && (
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Bloqueo con 1 clic en agenda real</span>
              </div>

              <button
                type="button"
                disabled={isBooking}
                onClick={() => onSelectSlot(currentSelected)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:brightness-105 active:scale-[0.98] text-white font-medium text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
              >
                {isBooking ? (
                  <span>Sincronizando...</span>
                ) : (
                  <>
                    <span>Bloquear en Google Calendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case B: Confirmed Deep Work Block (Production Rich Card)
  return (
    <div className="w-full my-3 bg-white/95 backdrop-blur-xl border border-indigo-200/80 rounded-2xl p-4 sm:p-5 shadow-md shadow-indigo-500/5 animate-liquid-entrance text-slate-800 relative overflow-hidden">
      {/* Decorative subtle iris glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none animate-aura-pulse" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-xs">
            <Target className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 font-display">
                Bloque de Deep Work Confirmado
              </h4>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Google Calendar</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Tiempo de concentración protegido contra interrupciones
            </p>
          </div>
        </div>

        {/* Priority Badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-amber-50 border border-amber-200 text-amber-700 flex-shrink-0">
          <Flame className="w-3 h-3 text-amber-600" />
          <span>Alta Prioridad</span>
        </span>
      </div>

      {/* Content Details */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-3 relative z-10">
        {/* Task description */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block font-semibold">
            Objetivo de Enfoque
          </span>
          <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">
            {taskDescription || 'Sesión de trabajo concentrado'}
          </p>
        </div>

        {/* Schedule & Project info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Horario Reservado */}
          <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 font-mono block">Horario Reservado</span>
              <span className="text-xs font-bold text-slate-900 font-mono truncate block">
                {formatTimeRange(scheduledStart, scheduledEnd, durationMinutes)}
              </span>
            </div>
          </div>

          {/* Proyecto */}
          <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <Briefcase className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-500 font-mono block">Proyecto / Cliente</span>
              <span className="text-xs font-semibold text-slate-800 truncate block">
                {project || 'Operaciones Generales'}
              </span>
            </div>
          </div>
        </div>

        {/* Immersion Tracker / Focus Timer Bar */}
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] font-mono font-bold text-slate-700">
              Temporizador de Inmersión:
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-xs tracking-wider">
              {formatSeconds(timerSecondsLeft)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsTimerActive(!isTimerActive)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs"
              title={isTimerActive ? 'Pausar foco' : 'Iniciar temporizador de inmersión'}
            >
              {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsTimerActive(false);
                setTimerSecondsLeft((durationMinutes || 90) * 60);
              }}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer shadow-2xs"
              title="Reiniciar temporizador"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Confirmation message note */}
        {message && (
          <p className="text-[11px] text-slate-600 leading-relaxed italic bg-white/70 p-2 rounded-lg border border-slate-200/60">
            &ldquo;{message}&rdquo;
          </p>
        )}

        {/* Google Calendar Action Link */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sincronizado con tu agenda real</span>
          </div>

          <a
            href={getCalendarLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:brightness-105 text-white font-medium text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer flex-shrink-0"
          >
            <CalendarCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Ver en Google Calendar</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
