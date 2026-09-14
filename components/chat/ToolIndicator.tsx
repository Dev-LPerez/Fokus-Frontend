'use client';

import React, { useState } from 'react';
import {
  CloudSun,
  Calendar,
  CalendarPlus,
  CalendarX,
  CalendarCheck,
  Search,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle2,
  ExternalLink,
  Code,
  ListTodo,
  Clock,
  MapPin,
  Target,
} from 'lucide-react';

export interface ToolIndicatorProps {
  toolName: string;
  status: 'running' | 'done' | 'error';
  input?: Record<string, unknown>;
  result?: Record<string, unknown> | string;
}

export function ToolIndicator({ toolName, status, input, result }: ToolIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  // Normalize parsed result
  const parsedResult: Record<string, any> | null =
    typeof result === 'string'
      ? (() => {
          try {
            return JSON.parse(result);
          } catch {
            return { raw: result };
          }
        })()
      : result || null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Determine tool category & metadata
  const getToolMeta = (name: string, inp?: Record<string, unknown>) => {
    const clean = name.toLowerCase();

    if (clean.includes('weather') || clean.includes('clima')) {
      const city = inp?.city ? String(inp.city) : '';
      return {
        label: city ? `Clima en ${city}` : 'Consulta de clima',
        category: 'weather',
        icon: CloudSun,
        accent: 'text-amber-400',
        bgAccent: 'bg-amber-500/10 border-amber-500/20',
      };
    }

    if (clean.includes('create_reminder') || clean.includes('crear_recordatorio')) {
      const desc = inp?.description ? `"${inp.description}"` : '';
      return {
        label: desc ? `Guardar recordatorio: ${desc}` : 'Crear recordatorio',
        category: 'create_reminder',
        icon: CalendarPlus,
        accent: 'text-[#d4af37]',
        bgAccent: 'bg-[#d4af37]/10 border-[#d4af37]/20',
      };
    }

    if (clean.includes('list_reminders') || clean.includes('listar_recordatorios')) {
      return {
        label: 'Consultar lista de recordatorios',
        category: 'list_reminders',
        icon: ListTodo,
        accent: 'text-indigo-400',
        bgAccent: 'bg-indigo-500/10 border-indigo-500/20',
      };
    }

    if (clean.includes('delete_reminder') || clean.includes('eliminar_recordatorio')) {
      return {
        label: 'Eliminar recordatorio',
        category: 'delete_reminder',
        icon: CalendarX,
        accent: 'text-rose-400',
        bgAccent: 'bg-rose-500/10 border-rose-500/20',
      };
    }

    if (clean.includes('complete_reminder') || clean.includes('completar_recordatorio')) {
      return {
        label: 'Completar recordatorio',
        category: 'complete_reminder',
        icon: CalendarCheck,
        accent: 'text-emerald-400',
        bgAccent: 'bg-emerald-500/10 border-emerald-500/20',
      };
    }

    if (clean.includes('schedule_deep_work')) {
      const task = inp?.task_description ? `"${inp.task_description}"` : '';
      return {
        label: task ? `Bloquear Deep Work: ${task}` : 'Programar bloque de Deep Work',
        category: 'schedule_deep_work',
        icon: Target,
        accent: 'text-emerald-400',
        bgAccent: 'bg-emerald-500/10 border-emerald-500/20',
      };
    }

    if (clean.includes('get_calendar_agenda') || clean.includes('calendar_agenda')) {
      return {
        label: 'Consultar agenda de Google Calendar',
        category: 'get_calendar_agenda',
        icon: Calendar,
        accent: 'text-cyan-400',
        bgAccent: 'bg-cyan-500/10 border-cyan-500/20',
      };
    }

    if (clean.includes('find_free_work_slots') || clean.includes('free_work_slots')) {
      return {
        label: 'Auditar disponibilidad & huecos libres',
        category: 'find_free_work_slots',
        icon: Clock,
        accent: 'text-teal-400',
        bgAccent: 'bg-teal-500/10 border-teal-500/20',
      };
    }

    if (clean.includes('search') || clean.includes('web') || clean.includes('buscar')) {
      const q = inp?.query ? `"${inp.query}"` : '';
      return {
        label: q ? `Búsqueda web: ${q}` : 'Búsqueda en internet',
        category: 'search_web',
        icon: Search,
        accent: 'text-sky-400',
        bgAccent: 'bg-sky-500/10 border-sky-500/20',
      };
    }

    return {
      label: name,
      category: 'generic',
      icon: Sparkles,
      accent: 'text-zinc-300',
      bgAccent: 'bg-zinc-800 border-zinc-700',
    };
  };

  const meta = getToolMeta(toolName, input);
  const Icon = meta.icon;

  // Build human-friendly summary text
  const getFriendlySummary = () => {
    if (!parsedResult) return null;

    if (meta.category === 'weather') {
      const temp = parsedResult.temperature ?? parsedResult.temp;
      const desc = parsedResult.description ?? parsedResult.desc ?? '';
      const humidity = parsedResult.humidity;
      const city = parsedResult.city || input?.city;
      const country = parsedResult.country;
      const parts = [];
      if (temp !== undefined) parts.push(`${Math.round(Number(temp))} °C`);
      if (desc) parts.push(desc.charAt(0).toUpperCase() + desc.slice(1));
      if (humidity !== undefined) parts.push(`humedad ${humidity}%`);
      const location = city ? `${city}${country ? `, ${country}` : ''}` : '';
      return `${location ? `${location}: ` : ''}${parts.join(' · ')}`;
    }

    if (meta.category === 'create_reminder') {
      const desc = parsedResult.description || input?.description;
      const due = formatDate(parsedResult.due_date || (input?.due_date as string));
      const synced = parsedResult.calendar_synced === true;
      const syncNote = synced
        ? '✓ Sincronizado con Google Calendar'
        : parsedResult.note || 'Guardado localmente';
      return `Recordatorio creado para ${due || 'la fecha indicada'} · ${syncNote}`;
    }

    if (meta.category === 'list_reminders') {
      const reminders = Array.isArray(parsedResult.reminders)
        ? parsedResult.reminders
        : Array.isArray(parsedResult)
        ? parsedResult
        : [];
      const total = parsedResult.total ?? reminders.length;
      if (total === 0) return 'No hay recordatorios pendientes registrados.';
      return `${total} recordatorio${total === 1 ? '' : 's'} en total`;
    }

    if (meta.category === 'delete_reminder') {
      const gDeleted = parsedResult.calendar_deleted === true;
      return `Recordatorio eliminado correctamente${
        gDeleted ? ' (y retirado de Google Calendar)' : ''
      }`;
    }

    if (meta.category === 'complete_reminder') {
      return 'Recordatorio marcado como completado exitosamente.';
    }

    if (meta.category === 'search_web') {
      const resList = Array.isArray(parsedResult.results)
        ? parsedResult.results
        : Array.isArray(parsedResult)
        ? parsedResult
        : [];
      return `${resList.length} resultados web encontrados`;
    }

    if (meta.category === 'schedule_deep_work') {
      return parsedResult.message || 'Bloque de Deep Work programado y sincronizado';
    }

    if (meta.category === 'get_calendar_agenda') {
      const events = Array.isArray(parsedResult.events) ? parsedResult.events : [];
      const total = parsedResult.total_events ?? events.length;
      return total === 0 ? 'Sin eventos programados para este día' : `${total} reunión(es) en Google Calendar`;
    }

    if (meta.category === 'find_free_work_slots') {
      const slots = Array.isArray(parsedResult.free_slots) ? parsedResult.free_slots : [];
      const total = parsedResult.total_slots ?? slots.length;
      return total === 0 ? 'No se detectaron bloques libres suficientes' : `${total} bloque(s) libre(s) detectado(s)`;
    }

    if (parsedResult.message) {
      return String(parsedResult.message);
    }

    return null;
  };

  const friendlySummary = getFriendlySummary();

  return (
    <div
      className={`w-full my-2 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 text-xs shadow-xs transition-all animate-liquid-entrance ${
        status === 'running' ? 'liquid-shimmer border-indigo-300/80 ring-1 ring-indigo-500/20' : ''
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bgAccent}`}
          >
            <Icon className={`w-3.5 h-3.5 ${meta.accent}`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-xs truncate">
                {meta.label}
              </span>
            </div>

            {/* Quick summary below title when collapsed */}
            {friendlySummary && !isExpanded && (
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-sans">
                {friendlySummary}
              </p>
            )}
          </div>
        </div>

        {/* Status badges & Expand button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {status === 'running' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
              <span>procesando</span>
            </span>
          )}

          {status === 'done' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
              <Check className="w-3 h-3 stroke-[2.5] text-emerald-600" />
              <span>completado</span>
            </span>
          )}

          {status === 'error' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-rose-600 bg-rose-50 border border-rose-200">
              <AlertCircle className="w-3 h-3" />
              <span>error</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isExpanded ? 'Contraer detalles' : 'Ver detalles visuales'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* EXPANDED RICH VISUAL DETAILS */}
      {isExpanded && (
        <div className="p-3.5 pt-0 space-y-3 animate-fade-in border-t border-slate-200/80 mt-3.5">
          {/* 1. WEATHER RICH CARD */}
          {meta.category === 'weather' && parsedResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Main Weather Card */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-medium">
                    {parsedResult.city || input?.city || 'Ciudad'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold font-mono text-slate-800">
                      {parsedResult.temperature !== undefined
                        ? `${Math.round(parsedResult.temperature)}°C`
                        : parsedResult.temp !== undefined
                        ? `${Math.round(parsedResult.temp)}°C`
                        : '--'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 capitalize mt-0.5 block font-medium">
                    {parsedResult.description || 'Despejado'}
                  </span>
                </div>
                <CloudSun className="w-10 h-10 text-amber-500 opacity-90" />
              </div>

              {/* Metrics Grid */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-around gap-2 text-xs shadow-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sensación</span>
                  </span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {parsedResult.feels_like ? `${Math.round(parsedResult.feels_like)}°C` : '--'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    <span>Humedad</span>
                  </span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {parsedResult.humidity ? `${parsedResult.humidity}%` : '--'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Wind className="w-3.5 h-3.5 text-teal-600" />
                    <span>Viento</span>
                  </span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {parsedResult.wind_speed ? `${parsedResult.wind_speed} m/s` : '--'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. REMINDER CREATED RICH CARD */}
          {meta.category === 'create_reminder' && parsedResult && (
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    {parsedResult.description || input?.description || 'Recordatorio creado'}
                  </span>
                </div>

                {parsedResult.google_event_id && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-sky-700 bg-sky-50 border border-sky-200 font-medium">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Google Calendar Sincronizado
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80">
                <Clock className="w-4 h-4 flex-shrink-0 text-indigo-600" />
                <span>
                  Fecha programada:{' '}
                  <strong className="text-slate-900 font-semibold">
                    {formatDate(parsedResult.due_date || (input?.due_date as string))}
                  </strong>
                </span>
              </div>

              {parsedResult.note && (
                <p className="text-xs text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-200/60">
                  ℹ️ {parsedResult.note}
                </p>
              )}
            </div>
          )}

          {/* 3. LIST REMINDERS RICH CARD */}
          {meta.category === 'list_reminders' && parsedResult && (
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <ListTodo className="w-4 h-4 text-indigo-600" />
                  <span>Recordatorios Registrados</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-medium">
                  Total: {parsedResult.reminders?.length || parsedResult.total || 0}
                </span>
              </div>

              {Array.isArray(parsedResult.reminders) && parsedResult.reminders.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {parsedResult.reminders.map((rem: any, idx: number) => (
                    <div
                      key={rem.id || idx}
                      className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-start justify-between gap-2.5 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {rem.description || 'Recordatorio'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(rem.due_date)}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {rem.google_event_id && (
                          <span
                            className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded text-[10px] font-mono font-medium"
                            title="Sincronizado con Google Calendar"
                          >
                            Cal
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono border font-medium ${
                            rem.status === 'completed'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          {rem.status === 'completed' ? 'Hecho' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2 text-center italic">
                  No hay recordatorios registrados actualmente.
                </p>
              )}
            </div>
          )}

          {/* 4. WEB SEARCH RICH CARD */}
          {meta.category === 'search_web' && parsedResult && (
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-sky-600" />
                  <span>Resultados de Búsqueda Web</span>
                </span>
                <span className="text-[10.5px] font-mono text-slate-500">
                  DuckDuckGo
                </span>
              </div>

              {Array.isArray(parsedResult.results) && parsedResult.results.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {parsedResult.results.map((item: any, idx: number) => {
                    const title = item.title || item.name || `Resultado ${idx + 1}`;
                    const url = item.link || item.url || item.href;
                    const snippet = item.snippet || item.body || item.description || '';

                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                            {title}
                          </h4>
                          {url && (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 flex-shrink-0 p-0.5 rounded transition-colors"
                              title="Abrir enlace externo"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {snippet && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {snippet}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-1">
                  Búsqueda procesada exitosamente.
                </p>
              )}
            </div>
          )}

          {/* 5. FIND FREE WORK SLOTS RICH CARD */}
          {meta.category === 'find_free_work_slots' && parsedResult && (
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Huecos Libres Detectados en Google Calendar</span>
                </span>
                <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-medium">
                  {parsedResult.total_slots ?? (Array.isArray(parsedResult.free_slots) ? parsedResult.free_slots.length : 0)} disponibles
                </span>
              </div>

              {Array.isArray(parsedResult.free_slots) && parsedResult.free_slots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parsedResult.free_slots.map((slot: any, idx: number) => {
                    const startStr = slot.start ? new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--';
                    const endStr = slot.end ? new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--';
                    const mins = slot.duration_minutes || 90;
                    return (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold font-mono text-slate-800 block">
                            {startStr} — {endStr}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                            {mins >= 60 ? `${(mins / 60).toFixed(1).replace('.0', '')}h` : `${mins}m`} disponible
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-50 border border-indigo-200 text-indigo-700">
                          {idx === 0 ? 'Recomendado' : 'Disponible'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-1 text-center italic">
                  No se detectaron huecos libres con la duración requerida.
                </p>
              )}
            </div>
          )}

          {/* 6. GOOGLE CALENDAR AGENDA RICH CARD */}
          {meta.category === 'get_calendar_agenda' && parsedResult && (
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Agenda de Google Calendar</span>
                </span>
                <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200 font-medium">
                  {parsedResult.total_events ?? (Array.isArray(parsedResult.events) ? parsedResult.events.length : 0)} eventos
                </span>
              </div>

              {Array.isArray(parsedResult.events) && parsedResult.events.length > 0 ? (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {parsedResult.events.map((ev: any, idx: number) => {
                    const title = ev.summary || ev.title || 'Reunión sin título';
                    const startStr = ev.start?.dateTime ? new Date(ev.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ev.start?.date || '';
                    const endStr = ev.end?.dateTime ? new Date(ev.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    return (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {title}
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                            {startStr}{endStr ? ` — ${endStr}` : ''}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-50 border border-sky-200 text-sky-700 flex-shrink-0">
                          GCal
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-1 text-center italic">
                  No hay compromisos agendados para hoy. Agenda completamente despejada.
                </p>
              )}
            </div>
          )}

          {/* 7. GENERIC / DELETE / COMPLETE CONFIRMATION CARD */}
          {(meta.category === 'delete_reminder' ||
            meta.category === 'complete_reminder' ||
            meta.category === 'generic') &&
            parsedResult && (
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-700 flex items-center gap-2.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {parsedResult.message || friendlySummary || 'Operación completada con éxito.'}
                </span>
              </div>
            )}

          {/* Discreet Developer Toggle: View Raw JSON */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowJsonRaw(!showJsonRaw)}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Code className="w-3 h-3" />
              <span>{showJsonRaw ? 'Ocultar JSON técnico' : 'Ver JSON técnico (desarrollador)'}</span>
            </button>
          </div>

          {showJsonRaw && (
            <div className="space-y-2 pt-2 border-t border-slate-200 font-mono text-[11px] animate-fade-in">
              {input && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Input:</span>
                  <pre className="mt-1 p-2 rounded-xl bg-slate-100 text-slate-800 overflow-x-auto border border-slate-200">
                    {JSON.stringify(input, null, 2)}
                  </pre>
                </div>
              )}
              {result && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Output:</span>
                  <pre className="mt-1 p-2 rounded-xl bg-slate-100 text-slate-800 overflow-x-auto border border-slate-200">
                    {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
