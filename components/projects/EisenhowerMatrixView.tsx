'use client';

import React from 'react';
import { Target, Sparkles, Plus } from 'lucide-react';
import type { TaskItem } from '@/app/(protected)/projects/page';
import { TaskCard } from './TaskCard';

interface EisenhowerMatrixViewProps {
  tasks: TaskItem[];
  onToggleComplete: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onScheduleDeepWork: (task: TaskItem) => void;
  onOpenNewTask: () => void;
}

export function EisenhowerMatrixView({
  tasks,
  onToggleComplete,
  onDelete,
  onScheduleDeepWork,
  onOpenNewTask,
}: EisenhowerMatrixViewProps) {
  // Q1: Urgente e Importante (High priority)
  const q1Tasks = tasks.filter((t) => t.priority === 'high');

  // Q2: Importante, No Urgente (Medium priority with duration >= 60m, or without due date)
  const q2Tasks = tasks.filter(
    (t) => t.priority === 'medium' && Boolean(t.estimated_minutes && t.estimated_minutes >= 60)
  );

  // Q3: Urgente, Menor Impacto (Medium priority with duration < 60m)
  const q3Tasks = tasks.filter(
    (t) => t.priority === 'medium' && (!t.estimated_minutes || t.estimated_minutes < 60)
  );

  // Q4: Baja Prioridad / Rutina
  const q4Tasks = tasks.filter((t) => t.priority === 'low');

  const quadrants = [
    {
      key: 'q1',
      title: 'Cuadrante I: Urgente & Crítico',
      subtitle: 'Acción Inmediata · Resolver Hoy',
      dotColor: 'bg-rose-500',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      containerClass: 'bg-white/75 backdrop-blur-xl border border-white/80 shadow-xs hover:border-rose-200/60',
      tasks: q1Tasks,
      recommendation: 'Atender con máxima concentración antes de iniciar otras tareas.',
      isLead: false,
    },
    {
      key: 'q2',
      title: 'Cuadrante II: Estratégico & Deep Work',
      subtitle: 'Alto Impacto · Enfoque Protegido',
      dotColor: 'bg-[#1c6662]',
      badgeBg: 'bg-teal-50 border-teal-200 text-[#1c6662]',
      containerClass:
        'bg-white/85 backdrop-blur-xl border-2 border-[#1c6662]/30 shadow-sm relative overflow-hidden ring-1 ring-[#f4e0ba]/80',
      tasks: q2Tasks,
      recommendation: 'Blindar bloques de 90m en Google Calendar para avanzar sin distracciones.',
      isLead: true,
    },
    {
      key: 'q3',
      title: 'Cuadrante III: Rutina & Operaciones',
      subtitle: 'Agilidad · Despacho Breve',
      dotColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      containerClass: 'bg-white/75 backdrop-blur-xl border border-white/80 shadow-xs hover:border-amber-200/60',
      tasks: q3Tasks,
      recommendation: 'Agrupar y despachar en bloques rápidos de 25 minutos.',
      isLead: false,
    },
    {
      key: 'q4',
      title: 'Cuadrante IV: Secundario / Rutina',
      subtitle: 'Baja Prioridad · Si Sobra Tiempo',
      dotColor: 'bg-stone-400',
      badgeBg: 'bg-stone-100 border-stone-200 text-stone-600',
      containerClass: 'bg-white/70 backdrop-blur-xl border border-white/70 shadow-xs hover:border-stone-200/60',
      tasks: q4Tasks,
      recommendation: 'Automatizar o resolver cuando la energía cognitiva sea baja.',
      isLead: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      {quadrants.map((quad) => (
        <section
          key={quad.key}
          className={`rounded-3xl p-5 flex flex-col transition-all duration-200 ${quad.containerClass}`}
          aria-label={quad.title}
        >
          {/* Subtle Ambient bloom on Q2 */}
          {quad.isLead && (
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#1c6662]/10 via-[#f4e0ba]/20 to-transparent blur-2xl pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Quadrant Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-stone-200/70 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full ${quad.dotColor} flex-shrink-0 shadow-2xs`} />
              <div className="min-w-0">
                <h2 className="font-bold text-sm text-stone-900 truncate font-display tracking-tight">
                  {quad.title}
                </h2>
                <p className="text-[11px] text-stone-500 font-mono truncate">
                  {quad.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Q2 Quick Action: Blindar Deep Work */}
              {quad.isLead && (
                <button
                  type="button"
                  onClick={() => {
                    const firstTask = quad.tasks[0];
                    if (firstTask) {
                      onScheduleDeepWork(firstTask);
                    } else {
                      onOpenNewTask();
                    }
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200/90 text-[#1c6662] font-mono text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                  title="Blindar bloque de Deep Work para este cuadrante"
                >
                  <Sparkles className="w-3 h-3 text-[#1c6662]" />
                  <span>Blindar 90m</span>
                </button>
              )}

              {/* Task Count Badge */}
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border font-semibold ${quad.badgeBg}`}
              >
                {quad.tasks.length}
              </span>
            </div>
          </div>

          {/* Quadrant Recommendation Note */}
          <div className="mb-3.5 px-3 py-1.5 rounded-xl bg-stone-100/60 border border-stone-200/50 text-[11px] text-stone-600 font-mono flex items-center justify-between gap-2">
            <span>💡 {quad.recommendation}</span>
          </div>

          {/* Tasks List */}
          <div className="space-y-2.5 relative z-10">
            {quad.tasks.length === 0 ? (
              <div className="py-8 text-center rounded-2xl border border-dashed border-stone-200/80 bg-white/40">
                <p className="text-xs text-stone-500 font-sans italic mb-2">
                  Sin compromisos en este cuadrante.
                </p>
                <button
                  type="button"
                  onClick={onOpenNewTask}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1c6662] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Registrar compromiso (N)</span>
                </button>
              </div>
            ) : (
              quad.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  viewMode="eisenhower"
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onScheduleDeepWork={onScheduleDeepWork}
                />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
