'use client';

import React from 'react';
import {
  CheckCircle2,
  Circle,
  Briefcase,
  Sparkles,
  Zap,
  Clock,
} from 'lucide-react';
import { CalendarEventItem } from '@/app/(protected)/calendar/page';

interface EventPillProps {
  event: CalendarEventItem;
  compact?: boolean;
  onSelect: (ev: CalendarEventItem) => void;
  onToggleTask: (e: React.MouseEvent, ev: CalendarEventItem) => void;
}

export function EventPill({
  event,
  compact = false,
  onSelect,
  onToggleTask,
}: EventPillProps) {
  const isGoogle = event.source === 'google_calendar';
  const isDeepWork = event.source === 'deep_work' || event.title.toLowerCase().includes('deep work') || event.title.toLowerCase().includes('foco');
  const isHighPriority = event.priority === 'high';
  const isCompleted = Boolean(event.completed);

  return (
    <div
      onClick={() => onSelect(event)}
      className={`group rounded-2xl border p-2.5 sm:p-3 text-xs transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
        isCompleted
          ? 'bg-slate-50 text-slate-400 border-slate-200/60 opacity-60'
          : isDeepWork
          ? 'bg-gradient-to-r from-amber-50/95 to-amber-100/90 border-amber-300/80 text-amber-950 hover:border-amber-400 shadow-xs shadow-amber-500/10'
          : isGoogle
          ? 'bg-teal-50/80 border-teal-200/70 text-teal-950 hover:bg-teal-50 hover:border-[#1c6662]/50'
          : isHighPriority
          ? 'bg-rose-50/80 border-rose-200/70 text-rose-950 hover:bg-rose-50'
          : 'bg-white/90 border-white/95 text-slate-800 hover:border-[#1c6662]/40 hover:bg-white'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {!isGoogle && (
            <button
              onClick={(e) => onToggleTask(e, event)}
              className="text-slate-400 hover:text-[#1c6662] transition-colors flex-shrink-0 cursor-pointer"
              title={isCompleted ? 'Desmarcar tarea' : 'Completar tarea'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
          )}

          {isDeepWork && (
            <span className="w-5 h-5 rounded-lg bg-amber-200/60 flex items-center justify-center text-amber-800 flex-shrink-0">
              <Zap className="w-3 h-3 fill-amber-700 text-amber-700" />
            </span>
          )}

          <span
            className={`font-semibold truncate ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {event.title}
          </span>
        </div>

        {!compact && (
          <span className="text-[11px] font-mono text-slate-500 flex-shrink-0 bg-white/60 px-1.5 py-0.5 rounded-md border border-white/80">
            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {!compact && (
        <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
          {event.project ? (
            <div className="flex items-center gap-1 text-slate-500 truncate">
              <Briefcase className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{event.project}</span>
            </div>
          ) : <span />}

          {isDeepWork ? (
            <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-200/50 px-2 py-0.5 rounded-full border border-amber-300/60">
              ⚡ 90m Deep Work
            </span>
          ) : isGoogle ? (
            <span className="text-[11px] font-mono text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-full border border-teal-200/60">
              Google Calendar
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
