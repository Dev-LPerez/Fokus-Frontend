'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  Flame,
  Briefcase,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  Layers,
  CalendarDays,
  CalendarRange,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export type CalendarViewMode = 'day' | 'week' | 'month' | 'year';

export interface CalendarEventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  source: 'google_calendar' | 'task' | 'deep_work';
  description?: string;
  all_day?: boolean;
  priority?: 'high' | 'medium' | 'low' | null;
  project?: string | null;
  completed?: boolean | null;
  estimated_minutes?: number | null;
  google_event_id?: string | null;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const WEEKDAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function CalendarPage() {
  const router = useRouter();
  const supabase = createClient();

  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [calendarConnected, setCalendarConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSource, setFilterSource] = useState<'all' | 'google_calendar' | 'task'>('all');

  // Modal State for New Event / Deep Work
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [newTime, setNewTime] = useState<string>('09:00');
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newProject, setNewProject] = useState<string>('Ejecutivo');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newSyncGoogle, setNewSyncGoogle] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Selected event detail modal / drawer
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);

  // Helper date calculations based on currentDate and viewMode
  const { queryStart, queryEnd } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    if (viewMode === 'day') {
      const start = new Date(y, m, currentDate.getDate(), 0, 0, 0);
      const end = new Date(y, m, currentDate.getDate(), 23, 59, 59);
      return {
        queryStart: start.toISOString(),
        queryEnd: end.toISOString()
      };
    } else if (viewMode === 'week') {
      const dayOfWeek = currentDate.getDay();
      const start = new Date(y, m, currentDate.getDate() - dayOfWeek, 0, 0, 0);
      const end = new Date(y, m, currentDate.getDate() + (6 - dayOfWeek), 23, 59, 59);
      return {
        queryStart: start.toISOString(),
        queryEnd: end.toISOString()
      };
    } else if (viewMode === 'month') {
      // Month with adjacent padding days (first day of grid to last day of grid)
      const firstOfMonth = new Date(y, m, 1);
      const lastOfMonth = new Date(y, m + 1, 0);
      const start = new Date(y, m, 1 - firstOfMonth.getDay(), 0, 0, 0);
      const end = new Date(y, m, lastOfMonth.getDate() + (6 - lastOfMonth.getDay()), 23, 59, 59);
      return {
        queryStart: start.toISOString(),
        queryEnd: end.toISOString()
      };
    } else {
      // Year view: whole year from Jan 1 to Dec 31
      const start = new Date(y, 0, 1, 0, 0, 0);
      const end = new Date(y, 11, 31, 23, 59, 59);
      return {
        queryStart: start.toISOString(),
        queryEnd: end.toISOString()
      };
    }
  }, [currentDate, viewMode]);

  // Fetch events from Backend API
  const fetchCalendarEvents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const url = `${apiUrl}/calendar/events?start=${encodeURIComponent(queryStart)}&end=${encodeURIComponent(queryEnd)}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setCalendarConnected(Boolean(data.calendar_connected));
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [queryStart, queryEnd, supabase, router]);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  // Date Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    else if (viewMode === 'year') next.setFullYear(next.getFullYear() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'year') next.setFullYear(next.getFullYear() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Toggle task completion from calendar
  const handleToggleTask = async (e: React.MouseEvent, eventItem: CalendarEventItem) => {
    e.stopPropagation();
    if (eventItem.source === 'google_calendar') return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const newCompleted = !eventItem.completed;
      // Optimistic update
      setEvents(prev => prev.map(ev => ev.id === eventItem.id ? { ...ev, completed: newCompleted } : ev));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/reminders/${eventItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ completed: newCompleted }),
      });
    } catch (err) {
      console.error('Failed to toggle task status:', err);
      fetchCalendarEvents(true);
    }
  };

  // Create new Event / Deep Work block
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const startTimeIso = new Date(`${newDate}T${newTime}:00`).toISOString();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const res = await fetch(`${apiUrl}/calendar/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          start_time: startTimeIso,
          duration_minutes: Number(newDuration),
          project: newProject.trim() || 'Calendario',
          priority: newPriority,
          sync_to_google: newSyncGoogle && calendarConnected,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'No se pudo crear el evento');
      }

      setIsCreateModalOpen(false);
      setNewTitle('');
      fetchCalendarEvents(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al agendar';
      setCreateError(message);
    } finally {
      setIsCreating(false);
    }
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.project && event.project.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSource =
        filterSource === 'all' ||
        (filterSource === 'google_calendar' && event.source === 'google_calendar') ||
        (filterSource === 'task' && (event.source === 'task' || event.source === 'deep_work'));

      return matchesSearch && matchesSource;
    });
  }, [events, searchQuery, filterSource]);

  // Format header title according to viewMode
  const headerTitle = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    if (viewMode === 'day') {
      return `${WEEKDAY_NAMES_FULL[currentDate.getDay()]}, ${currentDate.getDate()} de ${MONTH_NAMES[m]} ${y}`;
    } else if (viewMode === 'week') {
      const dayOfWeek = currentDate.getDay();
      const start = new Date(y, m, currentDate.getDate() - dayOfWeek);
      const end = new Date(y, m, currentDate.getDate() + (6 - dayOfWeek));
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} – ${end.getDate()} de ${MONTH_NAMES[m]} ${y}`;
      } else {
        return `${start.getDate()} ${MONTH_NAMES[start.getMonth()].slice(0, 3)} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()].slice(0, 3)} ${y}`;
      }
    } else if (viewMode === 'month') {
      return `${MONTH_NAMES[m]} ${y}`;
    } else {
      return `Año ${y}`;
    }
  }, [currentDate, viewMode]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafbfc] overflow-hidden">
      {/* Top Bar / Header */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                {headerTitle}
              </h1>
              {calendarConnected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Google Calendar Sincronizado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Modo Local & Tareas
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Tu agenda inteligente: sesiones de enfoque profundo, hábitos, reuniones y metas personales y profesionales
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Switcher: Day, Week, Month, Year */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs text-xs font-medium">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'year'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Año / Agenda
            </button>
          </div>

          {/* Navigation Controls: Today, Prev, Next */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-2xs">
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Hoy
            </button>
            <div className="w-px h-3.5 bg-slate-200" />
            <button
              onClick={handlePrev}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              title="Anterior"
              aria-label="Período anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              title="Siguiente"
              aria-label="Período siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchCalendarEvents(true)}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200/80 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            title="Actualizar agenda"
            aria-label="Actualizar agenda"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Primary CTA: Agendar Evento / Deep Work */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuevo Compromiso</span>
          </button>
        </div>
      </header>

      {/* Filter / Quick Search Sub-toolbar */}
      <div className="px-6 py-2.5 bg-white/50 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs focus-within:border-indigo-500 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por evento, proyecto o notas..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold font-mono">
            Fuente:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setFilterSource('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterSource === 'all'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({events.length})
            </button>
            <button
              onClick={() => setFilterSource('google_calendar')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterSource === 'google_calendar'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Calendar
            </button>
            <button
              onClick={() => setFilterSource('task')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterSource === 'task'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tareas & Deep Work
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-24 gap-3 text-slate-400 font-mono">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm">Sincronizando agenda ejecutiva...</p>
          </div>
        ) : (
          <>
            {viewMode === 'day' && (
              <DayTimelineView
                currentDate={currentDate}
                events={filteredEvents}
                onSelectEvent={setSelectedEvent}
                onToggleTask={handleToggleTask}
              />
            )}

            {viewMode === 'week' && (
              <WeekGridView
                currentDate={currentDate}
                events={filteredEvents}
                onSelectEvent={setSelectedEvent}
                onToggleTask={handleToggleTask}
              />
            )}

            {viewMode === 'month' && (
              <MonthGridView
                currentDate={currentDate}
                events={filteredEvents}
                onSelectEvent={setSelectedEvent}
                onToggleTask={handleToggleTask}
                onSelectDay={(dayDate) => {
                  setCurrentDate(dayDate);
                  setViewMode('day');
                }}
              />
            )}

            {viewMode === 'year' && (
              <YearAgendaView
                currentYear={currentDate.getFullYear()}
                events={filteredEvents}
                onSelectEvent={setSelectedEvent}
                onSelectMonth={(monthIdx) => {
                  const next = new Date(currentDate);
                  next.setMonth(monthIdx);
                  setCurrentDate(next);
                  setViewMode('month');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Event Details Drawer / Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onToggleTask={handleToggleTask}
          onEventDeleted={() => {
            setSelectedEvent(null);
            fetchCalendarEvents(true);
          }}
        />
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Agendar Sesión o Compromiso
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del compromiso o sesión
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Bloque Deep Work: Revisión Q3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duración estimada
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>1 hora (Foco)</option>
                    <option value={90}>1.5 horas (Deep Work)</option>
                    <option value={120}>2 horas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="high">Alta (Urgente)</option>
                    <option value="medium">Media (Estratégico)</option>
                    <option value="low">Baja (Mantenimiento)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proyecto o Área
                </label>
                <input
                  type="text"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="Ej: Finanzas, Operaciones, Estrategia"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {calendarConnected && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="syncGoogleCheckbox"
                    checked={newSyncGoogle}
                    onChange={(e) => setNewSyncGoogle(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="syncGoogleCheckbox" className="text-xs text-slate-600 cursor-pointer select-none">
                    Sincronizar automáticamente en Google Calendar
                  </label>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isCreating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Agendar Ahora</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Day View (Hourly Timeline with Current Time Indicator)
// -------------------------------------------------------------
function DayTimelineView({
  currentDate,
  events,
  onSelectEvent,
  onToggleTask,
}: {
  currentDate: Date;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, event: CalendarEventItem) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const targetDateStr = currentDate.toISOString().slice(0, 10);

  const dayEvents = useMemo(() => {
    return events.filter(ev => {
      const evDateStr = ev.start.slice(0, 10);
      return evDateStr === targetDateStr;
    });
  }, [events, targetDateStr]);

  return (
    <div className="liquid-glass-card rounded-2xl p-6 shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <h2 className="font-display text-base font-bold text-slate-800">
          Línea de Tiempo Diaria
        </h2>
        <span className="text-xs font-mono text-slate-500">
          {dayEvents.length} {dayEvents.length === 1 ? 'compromiso' : 'compromisos'} programados
        </span>
      </div>

      <div className="space-y-3">
        {hours.map((hour) => {
          const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
          const matchingEvents = dayEvents.filter(ev => {
            const evHour = new Date(ev.start).getHours();
            return evHour === hour;
          });

          return (
            <div key={hour} className="flex gap-4 group min-h-[52px]">
              <div className="w-14 text-right flex-shrink-0 pt-1">
                <span className="text-xs font-mono text-slate-400 group-hover:text-indigo-600 transition-colors">
                  {hourLabel}
                </span>
              </div>
              <div className="flex-1 border-t border-slate-100 pt-1 relative">
                {matchingEvents.length > 0 ? (
                  <div className="space-y-1.5">
                    {matchingEvents.map(ev => (
                      <EventPill
                        key={ev.id}
                        event={ev}
                        onSelect={onSelectEvent}
                        onToggleTask={onToggleTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full min-h-[36px] rounded-lg hover:bg-indigo-50/30 transition-colors" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Week View (7-Day Grid with event columns)
// -------------------------------------------------------------
function WeekGridView({
  currentDate,
  events,
  onSelectEvent,
  onToggleTask,
}: {
  currentDate: Date;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, event: CalendarEventItem) => void;
}) {
  const weekDays = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(y, m, currentDate.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="liquid-glass-card rounded-2xl p-4 shadow-sm border border-slate-200/80 overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 min-w-[720px]">
        {weekDays.map((dayDate, i) => {
          const dateStr = dayDate.toISOString().slice(0, 10);
          const isToday = dateStr === todayStr;
          const dayEvents = events.filter(ev => ev.start.slice(0, 10) === dateStr);

          return (
            <div
              key={dateStr}
              className={`rounded-xl border p-2.5 min-h-[380px] flex flex-col transition-all ${
                isToday
                  ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                  : 'bg-white/80 border-slate-200/70 hover:border-slate-300'
              }`}
            >
              {/* Day Header */}
              <div className="text-center pb-2 mb-2 border-b border-slate-100">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {WEEKDAY_NAMES_SHORT[i]}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 mt-0.5 rounded-full text-xs font-bold font-mono ${
                    isToday ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-800'
                  }`}
                >
                  {dayDate.getDate()}
                </span>
              </div>

              {/* Day Events */}
              <div className="flex-1 space-y-1.5 overflow-y-auto">
                {dayEvents.map(ev => (
                  <EventPill
                    key={ev.id}
                    event={ev}
                    compact
                    onSelect={onSelectEvent}
                    onToggleTask={onToggleTask}
                  />
                ))}
                {dayEvents.length === 0 && (
                  <p className="text-[11px] text-slate-300 text-center pt-8 italic">
                    Sin eventos
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Month View (7x5 or 7x6 standard calendar matrix)
// -------------------------------------------------------------
function MonthGridView({
  currentDate,
  events,
  onSelectEvent,
  onToggleTask,
  onSelectDay,
}: {
  currentDate: Date;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, event: CalendarEventItem) => void;
  onSelectDay: (date: Date) => void;
}) {
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(y, m, 1);
    const lastDayOfMonth = new Date(y, m + 1, 0);

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Leading padding days from previous month
    const startDayOfWeek = firstDayOfMonth.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(y, m, -i);
      days.push({ date: d, isCurrentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({ date: new Date(y, m, i), isCurrentMonth: true });
    }

    // Trailing padding days for next month
    const totalDays = days.length;
    const remaining = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(y, m + 1, i), isCurrentMonth: false });
    }

    return days;
  }, [y, m]);

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="liquid-glass-card rounded-2xl p-4 shadow-sm border border-slate-200/80">
      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
        {WEEKDAY_NAMES_SHORT.map((name) => (
          <div key={name} className="py-1">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map(({ date, isCurrentMonth }) => {
          const dateStr = date.toISOString().slice(0, 10);
          const isToday = dateStr === todayStr;
          const dayEvents = events.filter(ev => ev.start.slice(0, 10) === dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDay(date)}
              className={`min-h-[108px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group ${
                isToday
                  ? 'bg-indigo-50/50 border-indigo-300 shadow-2xs'
                  : isCurrentMonth
                  ? 'bg-white border-slate-200/70 hover:border-indigo-300 hover:shadow-2xs'
                  : 'bg-slate-50/50 border-slate-100 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center font-mono ${
                    isToday
                      ? 'bg-indigo-600 text-white font-bold'
                      : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-600 font-medium">
                    {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventos'}
                  </span>
                )}
              </div>

              {/* Event preview stack */}
              <div className="space-y-1 mt-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 transition-all ${
                      ev.source === 'google_calendar'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
                        : ev.priority === 'high'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200/60 hover:bg-rose-100'
                        : 'bg-indigo-50 text-indigo-800 border border-indigo-200/60 hover:bg-indigo-100'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current" />
                    <span className="truncate">{ev.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[9px] text-slate-400 block font-mono pl-1">
                    +{dayEvents.length - 3} más
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Year / Multi-Month Agenda View
// -------------------------------------------------------------
function YearAgendaView({
  currentYear,
  events,
  onSelectEvent,
  onSelectMonth,
}: {
  currentYear: number;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onSelectMonth: (monthIdx: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 12-Month Mini Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONTH_NAMES.map((name, mIdx) => {
          const monthEvents = events.filter(ev => {
            const d = new Date(ev.start);
            return d.getFullYear() === currentYear && d.getMonth() === mIdx;
          });

          return (
            <div
              key={name}
              onClick={() => onSelectMonth(mIdx)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {name}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {monthEvents.length}
                </span>
              </div>

              {monthEvents.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {monthEvents.slice(0, 4).map(ev => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className="text-[11px] truncate text-slate-600 hover:text-indigo-600 flex items-center gap-1.5"
                    >
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(ev.start).getDate()}
                      </span>
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}
                  {monthEvents.length > 4 && (
                    <span className="text-[10px] text-indigo-600 font-medium block">
                      +{monthEvents.length - 4} compromisos
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic py-3 text-center">
                  Sin eventos agendados
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Strategic Annual Agenda Timeline */}
      <div className="liquid-glass-card rounded-2xl p-6 shadow-sm border border-slate-200/80">
        <h2 className="font-display text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Agenda y Metas Anuales {currentYear}
        </h2>

        {events.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center italic">
            No se encontraron eventos o compromisos para este año.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map(ev => {
              const d = new Date(ev.start);
              const dateLabel = `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;

              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 w-28 flex-shrink-0">
                      {dateLabel}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">
                        {ev.title}
                      </h4>
                      {ev.project && (
                        <span className="text-[10px] text-slate-400">
                          {ev.project}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.source === 'google_calendar' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Google Calendar
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Tarea / Foco
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Event Pill Component
// -------------------------------------------------------------
function EventPill({
  event,
  compact = false,
  onSelect,
  onToggleTask,
}: {
  event: CalendarEventItem;
  compact?: boolean;
  onSelect: (ev: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, ev: CalendarEventItem) => void;
}) {
  const isGoogle = event.source === 'google_calendar';
  const isHighPriority = event.priority === 'high';
  const isCompleted = Boolean(event.completed);

  return (
    <div
      onClick={() => onSelect(event)}
      className={`group rounded-xl border p-2 text-xs transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
        isCompleted
          ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
          : isGoogle
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-50'
          : isHighPriority
          ? 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-50'
          : 'bg-indigo-50/70 border-indigo-200 text-indigo-900 hover:bg-indigo-50'
      }`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {!isGoogle && (
            <button
              onClick={(e) => onToggleTask(e, event)}
              className="text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0 cursor-pointer"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <span className={`font-semibold truncate ${isCompleted ? 'line-through text-slate-400' : ''}`}>
            {event.title}
          </span>
        </div>

        {!compact && (
          <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {!compact && event.project && (
        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
          <Briefcase className="w-3 h-3 text-slate-400" />
          <span className="truncate">{event.project}</span>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Event Details Modal
// -------------------------------------------------------------
function EventDetailsModal({
  event,
  onClose,
  onToggleTask,
  onEventDeleted,
}: {
  event: CalendarEventItem;
  onClose: () => void;
  onToggleTask: (e: React.MouseEvent, ev: CalendarEventItem) => void;
  onEventDeleted: () => void;
}) {
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const handleDelete = async () => {
    if (!confirm('¿Deseas eliminar este evento de la agenda?')) return;

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/calendar/events/${encodeURIComponent(event.id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        onEventDeleted();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                event.source === 'google_calendar'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}
            >
              {event.source === 'google_calendar' ? 'Google Calendar' : 'Tarea / Deep Work'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">
                {event.description}
              </p>
            )}
          </div>

          <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>
                {startDate.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {event.project && (
              <div className="flex items-center gap-2 text-slate-700">
                <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Proyecto: <strong className="font-semibold">{event.project}</strong></span>
              </div>
            )}

            {event.priority && (
              <div className="flex items-center gap-2 text-slate-700">
                <Flame className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Prioridad: <strong className="capitalize">{event.priority}</strong></span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar de agenda'}
            </button>

            {event.source !== 'google_calendar' && (
              <button
                onClick={(e) => {
                  onToggleTask(e, event);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{event.completed ? 'Marcar como pendiente' : 'Completar tarea'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
