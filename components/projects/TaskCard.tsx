'use client';

import React from 'react';
import {
  Check,
  Flame,
  Clock,
  ExternalLink,
  Target,
  Trash2,
  CalendarCheck,
} from 'lucide-react';
import type { TaskItem } from '@/app/(protected)/projects/page';

interface TaskCardProps {
  task: TaskItem;
  viewMode: 'eisenhower' | 'project' | 'priority';
  onToggleComplete: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onScheduleDeepWork: (task: TaskItem) => void;
}

export function TaskCard({
  task,
  viewMode,
  onToggleComplete,
  onDelete,
  onScheduleDeepWork,
}: TaskCardProps) {
  const formatDueDate = (isoStr?: string | null) => {
    if (!isoStr) return null;
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      const today = new Date();
      const isToday = d.toDateString() === today.toDateString();
      const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (isToday) {
        return `Hoy · ${timePart}`;
      }
      return `${d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} · ${timePart}`;
    } catch {
      return isoStr;
    }
  };

  return (
    <article
      className={`group relative p-3.5 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-white/40 border-stone-200/60 opacity-60'
          : 'bg-white/85 hover:bg-white/95 border-white/80 hover:border-teal-600/30 shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Tactile Circular Complete Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
            task.completed
              ? 'bg-[#1c6662] text-white border border-[#1c6662] shadow-xs'
              : 'border-2 border-stone-300 hover:border-[#1c6662] bg-white/60 hover:bg-white text-transparent'
          }`}
          title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          <Check className={`w-3 h-3 stroke-[3] ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {/* Task Body */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-medium leading-relaxed break-words font-sans ${
              task.completed
                ? 'text-stone-400 line-through'
                : 'text-stone-800'
            }`}
          >
            {task.description}
          </p>

          {/* Micro-Metadata Row (Strict Type Ramp: text-[11px]) */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono border ${
                task.priority === 'high'
                  ? 'bg-rose-50/90 border-rose-200/80 text-rose-800 font-medium'
                  : task.priority === 'medium'
                  ? 'bg-[#f4e0ba]/40 border-amber-300/60 text-amber-900 font-medium'
                  : 'bg-stone-100/90 border-stone-200/80 text-stone-600'
              }`}
            >
              {task.priority === 'high' && <Flame className="w-2.5 h-2.5 text-rose-600" />}
              <span>{task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</span>
            </span>

            {/* Project Tag (if not inside project column) */}
            {viewMode !== 'project' && task.project && (
              <span
                className="inline-flex items-center text-[11px] font-medium text-stone-700 bg-stone-100/80 border border-stone-200/70 px-2 py-0.5 rounded-lg truncate max-w-[140px]"
                title={task.project}
              >
                {task.project}
              </span>
            )}

            {/* Due Date */}
            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-800 bg-cyan-50/70 border border-cyan-200/60 px-2 py-0.5 rounded-lg">
                <Clock className="w-2.5 h-2.5 text-cyan-600" />
                <span>{formatDueDate(task.due_date)}</span>
              </span>
            )}

            {/* Estimated Minutes */}
            {task.estimated_minutes && (
              <span className="inline-flex items-center text-[11px] font-mono text-stone-500 bg-white/70 border border-stone-200/60 px-1.5 py-0.5 rounded-md">
                {task.estimated_minutes}m
              </span>
            )}

            {/* Google Calendar Sync Chip */}
            {task.google_event_id && (
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#1c6662] hover:text-[#124542] text-[11px] font-mono font-medium bg-teal-50/80 border border-teal-200/80 px-2 py-0.5 rounded-lg transition-colors ml-auto"
                title="Evento vinculado en Google Calendar (clic para abrir)"
              >
                <CalendarCheck className="w-3 h-3 text-[#1c6662]" />
                <span>GCal</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons: Deep Work & Delete */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {/* Deep Work Reservation Trigger */}
          {!task.completed && (
            <button
              type="button"
              onClick={() => onScheduleDeepWork(task)}
              className="w-7 h-7 rounded-xl text-stone-500 hover:text-[#1c6662] hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors cursor-pointer flex items-center justify-center"
              title="Blindar bloque de Deep Work para este compromiso"
              aria-label="Blindar bloque de Deep Work para este compromiso"
            >
              <Target className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button (with optimistic 5s undo) */}
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="w-7 h-7 rounded-xl text-stone-400 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer flex items-center justify-center"
            title="Eliminar tarea"
            aria-label="Eliminar tarea"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
