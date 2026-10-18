'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Briefcase,
  Flame,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { CalendarEventItem } from '@/app/(protected)/calendar/page';
import { createClient } from '@/lib/supabase/client';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  onTitleChange: (v: string) => void;
  date: string;
  onDateChange: (v: string) => void;
  time: string;
  onTimeChange: (v: string) => void;
  duration: number;
  onDurationChange: (v: number) => void;
  project: string;
  onProjectChange: (v: string) => void;
  priority: 'high' | 'medium' | 'low';
  onPriorityChange: (v: 'high' | 'medium' | 'low') => void;
  syncGoogle: boolean;
  onSyncGoogleChange: (v: boolean) => void;
  calendarConnected: boolean;
  isCreating: boolean;
  createError: string | null;
}

export function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  onTitleChange,
  date,
  onDateChange,
  time,
  onTimeChange,
  duration,
  onDurationChange,
  project,
  onProjectChange,
  priority,
  onPriorityChange,
  syncGoogle,
  onSyncGoogleChange,
  calendarConnected,
  isCreating,
  createError,
}: CreateEventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1c6662] border border-teal-100 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Agendar Sesión o Compromiso
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {createError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{createError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título del compromiso o bloque
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Ej: Bloque Deep Work: Estrategia Q3"
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1c6662] focus:ring-2 focus:ring-[#1c6662]/10 transition-all font-sans"
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
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1c6662] transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hora de inicio
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1c6662] transition-all font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duración
              </label>
              <select
                value={duration}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1c6662] transition-all cursor-pointer font-sans"
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
                value={priority}
                onChange={(e) => onPriorityChange(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1c6662] transition-all cursor-pointer font-sans"
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
              value={project}
              onChange={(e) => onProjectChange(e.target.value)}
              placeholder="Ej: Ejecutivo, Producto, Finanzas"
              className="w-full px-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1c6662] transition-all font-sans"
            />
          </div>

          {calendarConnected && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="syncGoogleCheckbox"
                checked={syncGoogle}
                onChange={(e) => onSyncGoogleChange(e.target.checked)}
                className="rounded border-slate-300 text-[#1c6662] focus:ring-[#1c6662] cursor-pointer"
              />
              <label htmlFor="syncGoogleCheckbox" className="text-xs text-slate-600 cursor-pointer select-none font-sans">
                Sincronizar automáticamente en Google Calendar
              </label>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1c6662] hover:bg-[#15524f] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#1c6662]/20 disabled:opacity-50 transition-all cursor-pointer"
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
  );
}

interface EventDetailsModalProps {
  event: CalendarEventItem;
  onClose: () => void;
  onToggleTask: (e: React.MouseEvent, ev: CalendarEventItem) => void;
  onEventDeleted: () => void;
}

export function EventDetailsModal({
  event,
  onClose,
  onToggleTask,
  onEventDeleted,
}: EventDetailsModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono ${
                event.source === 'google_calendar'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200/80'
                  : 'bg-amber-50 text-amber-900 border border-amber-200/80'
              }`}
            >
              {event.source === 'google_calendar' ? 'Google Calendar' : 'Tarea / Deep Work'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
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
              <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap font-sans">
                {event.description}
              </p>
            )}
          </div>

          <div className="space-y-2 text-xs bg-[#edece9]/50 p-3.5 rounded-2xl border border-white/80">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-[#1c6662] flex-shrink-0" />
              <span className="font-sans">
                {startDate.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {event.project && (
              <div className="flex items-center gap-2 text-slate-700">
                <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-sans">Proyecto: <strong className="font-semibold text-slate-900">{event.project}</strong></span>
              </div>
            )}

            {event.priority && (
              <div className="flex items-center gap-2 text-slate-700">
                <Flame className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="font-sans">Prioridad: <strong className="capitalize text-slate-900">{event.priority}</strong></span>
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1c6662] hover:bg-[#15524f] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
