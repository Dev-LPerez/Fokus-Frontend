'use client';

import React from 'react';
import { Flame, Zap, CircleDot } from 'lucide-react';
import type { TaskItem } from '@/app/(protected)/projects/page';
import { TaskCard } from './TaskCard';

interface PriorityListViewProps {
  tasks: TaskItem[];
  onToggleComplete: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onScheduleDeepWork: (task: TaskItem) => void;
}

export function PriorityListView({
  tasks,
  onToggleComplete,
  onDelete,
  onScheduleDeepWork,
}: PriorityListViewProps) {
  const highTasks = tasks.filter((t) => t.priority === 'high');
  const mediumTasks = tasks.filter((t) => t.priority === 'medium');
  const lowTasks = tasks.filter((t) => t.priority === 'low');

  const groups = [
    {
      key: 'high',
      title: 'Prioridad Alta',
      subtitle: 'Impacto Crítico · Resolver Primero',
      icon: Flame,
      iconColor: 'text-rose-600',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      tasks: highTasks,
    },
    {
      key: 'medium',
      title: 'Prioridad Media',
      subtitle: 'Estratégico · Planificar en Deep Work',
      icon: Zap,
      iconColor: 'text-[#1c6662]',
      badgeBg: 'bg-teal-50 border-teal-200 text-[#1c6662]',
      tasks: mediumTasks,
    },
    {
      key: 'low',
      title: 'Prioridad Baja',
      subtitle: 'Operaciones Menores / Rutina',
      icon: CircleDot,
      iconColor: 'text-stone-400',
      badgeBg: 'bg-stone-100 border-stone-200 text-stone-600',
      tasks: lowTasks,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {groups.map((grp) => {
        const IconComponent = grp.icon;
        return (
          <section
            key={grp.key}
            className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl p-4.5 flex flex-col shadow-xs transition-all duration-200"
            aria-label={grp.title}
          >
            {/* Group Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-stone-200/70">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shadow-2xs flex-shrink-0">
                  <IconComponent className={`w-3.5 h-3.5 ${grp.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm text-stone-900 truncate font-display tracking-tight">
                    {grp.title}
                  </h2>
                  <p className="text-[11px] text-stone-500 font-mono truncate">
                    {grp.subtitle}
                  </p>
                </div>
              </div>

              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border font-semibold ${grp.badgeBg}`}
              >
                {grp.tasks.length}
              </span>
            </div>

            {/* Tasks in Priority Group */}
            <div className="space-y-2.5">
              {grp.tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400 italic rounded-2xl border border-dashed border-stone-200/80 bg-white/40">
                  Sin tareas en este nivel de prioridad.
                </div>
              ) : (
                grp.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    viewMode="priority"
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onScheduleDeepWork={onScheduleDeepWork}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
