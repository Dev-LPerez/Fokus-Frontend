'use client';

import React, { useMemo } from 'react';
import { CalendarEventItem } from '@/app/(protected)/calendar/page';

const WEEKDAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface MonthGridViewProps {
  currentDate: Date;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, event: CalendarEventItem) => void;
  onSelectDay: (date: Date) => void;
}

export function MonthGridView({
  currentDate,
  events,
  onSelectEvent,
  onToggleTask,
  onSelectDay,
}: MonthGridViewProps) {
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

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 p-4 sm:p-5 shadow-sm shadow-[#1c6662]/5">
      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
        {WEEKDAY_NAMES_SHORT.map((name) => (
          <div key={name} className="py-1">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map(({ date, isCurrentMonth }) => {
          const dateStr = date.toISOString().slice(0, 10);
          const isToday = dateStr === todayStr;
          const dayEvents = events.filter((ev) => ev.start.slice(0, 10) === dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDay(date)}
              className={`min-h-[110px] p-2.5 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer group ${
                isToday
                  ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                  : isCurrentMonth
                  ? 'bg-white/85 border-white/90 hover:border-[#1c6662]/40 hover:shadow-2xs'
                  : 'bg-slate-50/40 border-slate-100 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center font-mono ${
                    isToday
                      ? 'bg-[#1c6662] text-white font-bold'
                      : isCurrentMonth
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-[#1c6662] font-semibold">
                    {dayEvents.length} {dayEvents.length === 1 ? 'evento' : 'eventos'}
                  </span>
                )}
              </div>

              {/* Event preview stack */}
              <div className="space-y-1 mt-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((ev) => {
                  const isDeepWork = ev.source === 'deep_work' || ev.title.toLowerCase().includes('deep work') || ev.title.toLowerCase().includes('foco');
                  const isGoogle = ev.source === 'google_calendar';

                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-medium truncate flex items-center gap-1.5 transition-all ${
                        isDeepWork
                          ? 'bg-amber-100/80 text-amber-900 border border-amber-200/80 font-semibold'
                          : isGoogle
                          ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                          : ev.priority === 'high'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200/60'
                          : 'bg-white text-slate-800 border border-slate-200/60'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current" />
                      <span className="truncate">{ev.title}</span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="text-[11px] text-slate-400 block font-mono pl-1">
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
