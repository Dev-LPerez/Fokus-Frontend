'use client';

import React, { useMemo } from 'react';
import { Sparkles, Clock, CalendarDays } from 'lucide-react';
import { CalendarEventItem } from '@/app/(protected)/calendar/page';
import { EventPill } from '@/components/calendar/EventPill';

interface DayTimelineViewProps {
  currentDate: Date;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, event: CalendarEventItem) => void;
}

export function DayTimelineView({
  currentDate,
  events,
  onSelectEvent,
  onToggleTask,
}: DayTimelineViewProps) {
  // Hours from 07:00 to 22:00 for optimal focused day view
  const hours = useMemo(() => Array.from({ length: 16 }, (_, i) => i + 7), []);
  const targetDateStr = currentDate.toISOString().slice(0, 10);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isToday = targetDateStr === todayStr;

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  const dayEvents = useMemo(() => {
    return events.filter((ev) => ev.start.slice(0, 10) === targetDateStr);
  }, [events, targetDateStr]);

  return (
    <div className="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 p-5 sm:p-7 shadow-sm shadow-[#1c6662]/5 relative">
      {/* Subheader summary */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#1c6662]" />
          <h2 className="font-display text-base font-bold text-slate-800">
            Línea de Tiempo Diaria
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-white/70 px-2.5 py-1 rounded-full border border-white/90">
          {dayEvents.length} {dayEvents.length === 1 ? 'compromiso' : 'compromisos'} programados
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-4 relative">
        {hours.map((hour) => {
          const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
          const matchingEvents = dayEvents.filter((ev) => {
            const evHour = new Date(ev.start).getHours();
            return evHour === hour;
          });

          const isCurrentHourSlot = isToday && currentHour === hour;

          return (
            <div key={hour} className="flex gap-4 group min-h-[58px] relative">
              {/* Hour time mark */}
              <div className="w-14 text-right flex-shrink-0 pt-1">
                <span className={`text-xs font-mono transition-colors ${
                  isCurrentHourSlot ? 'text-[#1c6662] font-bold' : 'text-slate-400 group-hover:text-slate-700'
                }`}>
                  {hourLabel}
                </span>
              </div>

              {/* Slot line and events */}
              <div className="flex-1 border-t border-slate-200/60 pt-1.5 relative">
                {/* Current time line indicator */}
                {isCurrentHourSlot && (
                  <div 
                    className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                    style={{ top: `${(currentMinute / 60) * 100}%` }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1c6662] shadow-xs shadow-[#1c6662]/40 -ml-1.5" />
                    <div className="flex-1 h-0.5 bg-[#1c6662]/60" />
                  </div>
                )}

                {matchingEvents.length > 0 ? (
                  <div className="space-y-2">
                    {matchingEvents.map((ev) => (
                      <EventPill
                        key={ev.id}
                        event={ev}
                        onSelect={onSelectEvent}
                        onToggleTask={onToggleTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full min-h-[42px] rounded-xl hover:bg-white/60 transition-colors" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
