'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { FocusShieldDeck } from '@/components/calendar/FocusShieldDeck';
import { DayTimelineView } from '@/components/calendar/DayTimelineView';
import { WeekGridView } from '@/components/calendar/WeekGridView';
import { MonthGridView } from '@/components/calendar/MonthGridView';
import { YearAgendaView } from '@/components/calendar/YearAgendaView';
import { CreateEventModal, EventDetailsModal } from '@/components/calendar/EventModals';

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

const WEEKDAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function CalendarPage() {
  const router = useRouter();
  const supabase = createClient();

  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
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
  const [newDuration, setNewDuration] = useState<number>(90);
  const [newProject, setNewProject] = useState<string>('Estratégico');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [newSyncGoogle, setNewSyncGoogle] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Selected event detail modal
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
      const firstOfMonth = new Date(y, m, 1);
      const lastOfMonth = new Date(y, m + 1, 0);
      const start = new Date(y, m, 1 - firstOfMonth.getDay(), 0, 0, 0);
      const end = new Date(y, m, lastOfMonth.getDate() + (6 - lastOfMonth.getDay()), 23, 59, 59);
      return {
        queryStart: start.toISOString(),
        queryEnd: end.toISOString()
      };
    } else {
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
        router.push('/login');
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

  // Quick Action from Focus Shield Sidecar: One-click 90m Deep Work block
  const handleQuickDeepWork = () => {
    setNewTitle('⚡ Bloque Deep Work: Enfoque Protegido');
    setNewDuration(90);
    setNewPriority('high');
    setNewProject('Estratégico');
    setNewDate(new Date().toISOString().slice(0, 10));
    setNewTime('10:00');
    setIsCreateModalOpen(true);
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
      const message = err instanceof Error ? err.message : 'Error al agendar';
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
    <div className="flex-1 flex flex-col h-full overflow-hidden p-3.5 sm:p-5 lg:p-6 gap-3.5 sm:gap-4 relative bg-[#edece9] selection:bg-[#f4e0ba] selection:text-slate-900">
      {/* Background ambient lighting blooms matching landing */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#1c6662]/5 blur-3xl z-0" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#f4e0ba]/30 blur-3xl z-0" 
      />

      {/* Top Floating Header & Filter Toolbar */}
      <div className="relative z-10">
        <CalendarHeader
          headerTitle={headerTitle}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          calendarConnected={calendarConnected}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterSource={filterSource}
          onFilterSourceChange={setFilterSource}
          totalEventsCount={events.length}
          onOpenCreateModal={() => {
            setNewTitle('');
            setNewDuration(60);
            setIsCreateModalOpen(true);
          }}
        />
      </div>

      {/* Main 70/30 Split Sanctuary Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden relative z-10">
        {/* Left 70%: Timeline and Calendar Viewport */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto pr-0 lg:pr-1">
          {loading ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center gap-3 text-slate-500 font-mono">
              <Loader2 className="w-7 h-7 animate-spin text-[#1c6662]" />
              <p className="text-xs">Sincronizando agenda y bloques de enfoque...</p>
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

        {/* Right 30%: Focus Shield & Telemetry Sidecar */}
        <div className="hidden lg:block">
          <FocusShieldDeck
            events={events}
            calendarConnected={calendarConnected}
            onQuickDeepWork={handleQuickDeepWork}
            onRefresh={() => fetchCalendarEvents(true)}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        title={newTitle}
        onTitleChange={setNewTitle}
        date={newDate}
        onDateChange={setNewDate}
        time={newTime}
        onTimeChange={setNewTime}
        duration={newDuration}
        onDurationChange={setNewDuration}
        project={newProject}
        onProjectChange={setNewProject}
        priority={newPriority}
        onPriorityChange={setNewPriority}
        syncGoogle={newSyncGoogle}
        onSyncGoogleChange={setNewSyncGoogle}
        calendarConnected={calendarConnected}
        isCreating={isCreating}
        createError={createError}
      />

      {/* Event Details Modal */}
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
    </div>
  );
}
