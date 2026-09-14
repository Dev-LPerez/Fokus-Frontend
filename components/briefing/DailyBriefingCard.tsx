'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sun,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Volume2,
  VolumeX,
  Target,
  ArrowRight,
  Sparkles,
  CloudSun,
  ExternalLink,
  Flame,
  MapPin,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export interface CalendarEvent {
  id?: string;
  summary: string;
  start: string;
  end: string;
  description?: string | null;
}

export interface CriticalTask {
  id: string;
  description: string;
  due_date?: string | null;
  project?: string | null;
  priority: string;
  estimated_minutes?: number | null;
}

export interface BriefingData {
  date: string;
  weather: {
    city?: string | null;
    country?: string | null;
    temp?: number | null;
    description?: string | null;
    is_default_location?: boolean;
  };
  calendar_connected: boolean;
  events_today: CalendarEvent[];
  critical_tasks: CriticalTask[];
  pending_tasks_count: number;
  free_slots_summary: string;
}

interface DailyBriefingCardProps {
  onQuickAction?: (prompt: string) => void;
}

export function DailyBriefingCard({ onQuickAction }: DailyBriefingCardProps) {
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const supabase = createClient();

  const fetchBriefing = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      // Try to acquire browser geolocation if available
      let queryParams = '';
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        try {
          const coords = await new Promise<{ latitude: number; longitude: number } | null>(
            (resolve) => {
              navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                () => resolve(null),
                { timeout: 4000, maximumAge: 300000 }
              );
            }
          );
          if (coords) {
            queryParams = `?lat=${coords.latitude}&lon=${coords.longitude}`;
          }
        } catch {
          // Geolocation unavailable or denied, proceed with default
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/briefing${queryParams}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error al obtener briefing (${res.status})`);
      }

      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar resumen ejecutivo');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [supabase.auth]);

  useEffect(() => {
    fetchBriefing();

    // Listen to updates from chat when tasks or events change
    const handleUpdate = () => fetchBriefing(true);
    window.addEventListener('conversation_updated', handleUpdate);
    return () => window.removeEventListener('conversation_updated', handleUpdate);
  }, [fetchBriefing]);

  // Audio narration with Web Speech API
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en este navegador.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!data) return;

    // Generate natural executive spoken speech
    const weatherText = data.weather?.temp
      ? `El clima de hoy marca ${Math.round(data.weather.temp)} grados centígrados con ${data.weather.description || 'cielo despejado'}.`
      : 'Clima no disponible en este momento.';

    const meetingsCount = data.events_today.length;
    const meetingsText = !data.calendar_connected
      ? 'Aún no has conectado tu Google Calendar.'
      : meetingsCount === 0
      ? 'Tienes tu agenda libre de reuniones hoy, un escenario perfecto para trabajo profundo.'
      : `Tienes ${meetingsCount} compromiso${meetingsCount === 1 ? '' : 's'} agendados para hoy. Primer evento: ${data.events_today[0].summary} a las ${data.events_today[0].start.split(' ')[1] || 'las primeras horas'}.`;

    const tasksCount = data.critical_tasks.length;
    const tasksText = tasksCount > 0
      ? `Tienes ${tasksCount} tarea${tasksCount === 1 ? '' : 's'} de alta prioridad pendientes. ${data.free_slots_summary}`
      : `No tienes tareas críticas pendientes urgentes para hoy. ${data.free_slots_summary}`;

    const speechText = `Buenos días. Este es tu resumen ejecutivo del día. ${weatherText} ${meetingsText} ${tasksText}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const formatEventTime = (timeStr: string) => {
    try {
      if (timeStr.includes(' ')) {
        const parts = timeStr.split(' ');
        return parts[1] || timeStr;
      }
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  };

  const formatTodayDate = (dateStr?: string) => {
    try {
      const d = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
      return d.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    } catch {
      return dateStr || 'Hoy';
    }
  };

  return (
    <div className="w-full bg-white/80 border-b border-slate-200/80 backdrop-blur-md transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Header Bar (Always visible) */}
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform flex-shrink-0">
              <Sun className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 tracking-wide font-display">
                  Resumen Ejecutivo del Día
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono capitalize">
                  · {formatTodayDate(data?.date)}
                </span>
              </div>

              {/* Quick Badges in Header */}
              {data && (
                <div className="hidden md:flex items-center gap-2">
                  {data.weather?.temp !== undefined && data.weather?.temp !== null && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-amber-700 font-mono shadow-2xs">
                      <CloudSun className="w-3 h-3 text-amber-500" />
                      <span>
                        {data.weather.city ? `${data.weather.city}: ` : ''}
                        {Math.round(data.weather.temp)}°C
                      </span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-cyan-700 font-mono shadow-2xs">
                    <Calendar className="w-3 h-3 text-cyan-600" />
                    <span>
                      {data.calendar_connected
                        ? `${data.events_today.length} reunión${data.events_today.length === 1 ? '' : 'es'}`
                        : 'Sin conectar'}
                    </span>
                  </span>

                  {data.critical_tasks.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-mono">
                      <Flame className="w-3 h-3 text-rose-500" />
                      <span>{data.critical_tasks.length} prioritarias</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Audio narration button (Fase ECS-F4) */}
            <button
              type="button"
              onClick={handleToggleAudio}
              disabled={loading || !data}
              className={`p-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
              title={isPlayingAudio ? 'Detener lectura en voz alta' : 'Escuchar resumen del día en voz alta'}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline text-[11px]">Leyendo...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline text-[11px]">Escuchar</span>
                </>
              )}
            </button>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchBriefing()}
              disabled={loading}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Actualizar resumen del día"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Expand / Collapse Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title={isExpanded ? 'Ocultar desglose detallado' : 'Mostrar desglose detallado'}
            >
              <span className="text-[11px] font-mono hidden sm:inline">
                {isExpanded ? 'Ocultar desglose' : 'Ver detalle'}
              </span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* EXPANDED CONTENT AREA */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-3 drawer-content-enter">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={() => fetchBriefing()}
                  className="text-xs font-bold underline hover:text-rose-900 ml-2"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Google Calendar Warning Banner if not connected */}
            {data && !data.calendar_connected && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-800">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="truncate">
                    Google Calendar no está conectado. Conéctalo para auditar reuniones y reservar bloques de Deep Work.
                  </span>
                </div>
                <Link
                  href="/settings"
                  className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-amber-800 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>Conectar en Ajustes</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* 3 Executive Metric Columns */}
            {data && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Clima & Contexto Ambiental */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between text-slate-500 text-xs">
                      <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <CloudSun className="w-4 h-4 text-amber-500" />
                        <span>Clima & Jornada</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700">
                        {data.weather?.city ? `${data.weather.city}` : 'Tiempo real'}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl font-bold text-slate-900 font-mono">
                          {data.weather?.temp !== undefined && data.weather?.temp !== null
                            ? `${Math.round(data.weather.temp)}°C`
                            : 'N/D'}
                        </span>
                        <span className="text-xs text-slate-700 capitalize font-medium">
                          {data.weather?.description || 'Sin datos meteorológicos'}
                        </span>
                      </div>
                      {data.weather?.city && (
                        <div className="mt-1 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span>{data.weather.city}{data.weather.country ? `, ${data.weather.country}` : ''}</span>
                          {data.weather.is_default_location && (
                            <span className="text-slate-400 text-[10px]">(predeterminado)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 leading-relaxed bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {data.events_today.length > 0
                        ? 'Tienes traslados o reuniones hoy; considera el clima al salir.'
                        : 'Condiciones óptimas para permanecer enfocado en tu centro de trabajo.'}
                    </span>
                  </div>
                </div>

                {/* 2. Reuniones del Día (Timeline) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 text-xs pb-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span>Agenda de Hoy</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {data.events_today.length} evento{data.events_today.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {!data.calendar_connected ? (
                      <p className="text-xs text-slate-500 py-2">
                        Vincula Google Calendar para visualizar tus reuniones.
                      </p>
                    ) : data.events_today.length === 0 ? (
                      <div className="py-2 text-center text-xs text-slate-500 flex flex-col items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Sin reuniones agendadas hoy.</span>
                      </div>
                    ) : (
                      data.events_today.map((ev, idx) => (
                        <div
                          key={ev.id || idx}
                          className="flex items-start gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200/80"
                        >
                          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-700 min-w-[90px] flex-shrink-0">
                            <Clock className="w-3 h-3 text-cyan-600" />
                            <span>
                              {formatEventTime(ev.start)} - {formatEventTime(ev.end)}
                            </span>
                          </div>
                          <span className="text-slate-800 font-medium truncate flex-1" title={ev.summary}>
                            {ev.summary}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {data.calendar_connected && (
                    <a
                      href="https://calendar.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1 pt-1 justify-end font-medium"
                    >
                      <span>Abrir Google Calendar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* 3. Foco & Tareas Críticas + Deep Work */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 text-xs pb-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span>Foco & Tareas Críticas</span>
                    </span>
                    <Link
                      href="/projects"
                      className="text-[10px] font-mono text-emerald-700 hover:underline inline-flex items-center gap-0.5 font-medium"
                    >
                      <span>Ver tablero</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>

                  {/* Free slots for Deep Work summary */}
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-snug">{data.free_slots_summary}</p>
                  </div>

                  {/* List of critical tasks */}
                  <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {data.critical_tasks.length === 0 ? (
                      <p className="text-xs text-slate-500 py-1">
                        No hay tareas críticas marcadas como urgentes hoy.
                      </p>
                    ) : (
                      data.critical_tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                        >
                          <span className="text-slate-800 truncate flex-1 font-medium">
                            {task.description}
                          </span>
                          {task.project && (
                            <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 flex-shrink-0">
                              {task.project}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Deep work trigger button */}
                  {onQuickAction && (
                    <button
                      type="button"
                      onClick={() =>
                        onQuickAction('Bloquea 2 horas de trabajo enfocado sin interrupciones en mi calendario')
                      }
                      className="w-full mt-1 py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-medium text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Agendar Deep Work con Agente</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
