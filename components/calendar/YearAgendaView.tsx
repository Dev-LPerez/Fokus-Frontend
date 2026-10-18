'use client';

import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { CalendarEventItem } from '@/app/(protected)/calendar/page';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface YearAgendaViewProps {
  currentYear: number;
  events: CalendarEventItem[];
  onSelectEvent: (event: CalendarEventItem) => void;
  onSelectMonth: (monthIdx: number) => void;
}

export function YearAgendaView({
  currentYear,
  events,
  onSelectEvent,
  onSelectMonth,
}: YearAgendaViewProps) {
  return (
    <div className="space-y-6">
      {/* 12-Month Mini Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONTH_NAMES.map((name, mIdx) => {
          const monthEvents = events.filter((ev) => {
            const d = new Date(ev.start);
            return d.getFullYear() === currentYear && d.getMonth() === mIdx;
          });

          return (
            <div
              key={name}
              onClick={() => onSelectMonth(mIdx)}
              className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 p-4 shadow-2xs hover:shadow-md hover:border-[#1c6662]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="font-display font-bold text-sm text-slate-900 group-hover:text-[#1c6662] transition-colors">
                  {name}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {monthEvents.length}
                </span>
              </div>

              {monthEvents.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {monthEvents.slice(0, 4).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className="text-[11px] truncate text-slate-600 hover:text-[#1c6662] flex items-center gap-1.5 font-sans"
                    >
                      <span className="font-mono text-[11px] text-slate-400 font-semibold">
                        {new Date(ev.start).getDate()}
                      </span>
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}
                  {monthEvents.length > 4 && (
                    <span className="text-[11px] text-[#1c6662] font-semibold block font-sans">
                      +{monthEvents.length - 4} compromisos
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic py-3 text-center font-sans">
                  Sin eventos agendados
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Strategic Annual Agenda Timeline */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/90 p-6 shadow-sm">
        <h2 className="font-display text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1c6662]" />
          Agenda y Metas Anuales {currentYear}
        </h2>

        {events.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center italic font-sans">
            No se encontraron eventos o compromisos para este año.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((ev) => {
              const d = new Date(ev.start);
              const dateLabel = `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
              const isDeepWork = ev.source === 'deep_work' || ev.title.toLowerCase().includes('deep work') || ev.title.toLowerCase().includes('foco');

              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="py-3 flex items-center justify-between hover:bg-white/60 px-3 rounded-2xl transition-colors cursor-pointer"
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
                        <span className="text-[11px] text-slate-400">
                          {ev.project}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isDeepWork ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 font-mono font-semibold">
                        ⚡ Deep Work
                      </span>
                    ) : ev.source === 'google_calendar' ? (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/70 font-mono">
                        Google Calendar
                      </span>
                    ) : (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        Tarea
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
