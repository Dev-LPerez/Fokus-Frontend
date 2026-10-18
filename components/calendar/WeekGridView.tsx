'use client';

import React, { useMemo } from 'react';
import { CalendarEventItem } from '@/app/(protected)/calendar/page';
import { EventPill } from '@/components/calendar/EventPill';

const WEEKDAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface WeekGridViewProps {
  currentDate: Date;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, event: CalendarEventItem) => void;
}

export function WeekGridView({
  currentDate,
  events,
  onSelectEvent,
  onToggleTask,
}: WeekGridViewProps) {
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

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 p-4 sm:p-5 shadow-sm shadow-[#1c6662]/5 overflow-x-auto">
      <div className="grid grid-cols-7 gap-2.5 min-w-[700px]">
        {weekDays.map((dayDate, i) => {
          const dateStr = dayDate.toISOString().slice(0, 10);
          const isToday = dateStr === todayStr;
          const dayEvents = events.filter((ev) => ev.start.slice(0, 10) === dateStr);

          return (
            <div
              key={dateStr}
              className={`rounded-2xl border p-3 min-h-[420px] flex flex-col transition-all ${
                isToday
                  ? 'bg-amber-50/40 border-amber-200/80 shadow-xs'
                  : 'bg-white/80 border-white/95 hover:border-slate-300'
              }`}
            >
              {/* Day Header */}
              <div className="text-center pb-2.5 mb-2.5 border-b border-slate-200/60">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  {WEEKDAY_NAMES_SHORT[i]}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 mt-1 rounded-full text-xs font-bold font-mono ${
                    isToday ? 'bg-[#1c6662] text-white shadow-xs' : 'text-slate-800'
                  }`}
                >
                  {dayDate.getDate()}
                </span>
              </div>

              {/* Day Events */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayEvents.map((ev) => (
                  <EventPill
                    key={ev.id}
                    event={ev}
                    compact
                    onSelect={onSelectEvent}
                    onToggleTask={onToggleTask}
                  />
                ))}
                {dayEvents.length === 0 && (
                  <p className="text-[11px] text-slate-300 text-center pt-10 italic font-sans">
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
