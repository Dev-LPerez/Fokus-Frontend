'use client';

import React from 'react';
import { Briefcase, Plus, CheckCircle2 } from 'lucide-react';
import type { TaskItem } from '@/app/(protected)/projects/page';
import { TaskCard } from './TaskCard';

interface ProjectKanbanViewProps {
  tasks: TaskItem[];
  distinctProjects: string[];
  onToggleComplete: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onScheduleDeepWork: (task: TaskItem) => void;
  onOpenNewTaskWithProject: (projectName: string) => void;
}

export function ProjectKanbanView({
  tasks,
  distinctProjects,
  onToggleComplete,
  onDelete,
  onScheduleDeepWork,
  onOpenNewTaskWithProject,
}: ProjectKanbanViewProps) {
  // Columns: distinct projects + "Sin proyecto" if there are any tasks without project
  const unassignedTasks = tasks.filter((t) => !t.project || !t.project.trim());

  const columns = [
    ...distinctProjects.map((p) => {
      const colTasks = tasks.filter(
        (t) => (t.project || '').trim().toLowerCase() === p.trim().toLowerCase()
      );
      const completedCount = colTasks.filter((t) => t.completed).length;
      const progress = colTasks.length > 0 ? Math.round((completedCount / colTasks.length) * 100) : 0;
      return {
        key: `project-${p}`,
        name: p,
        tasks: colTasks,
        completedCount,
        progress,
        isUnassigned: false,
      };
    }),
    ...(unassignedTasks.length > 0
      ? [
          {
            key: 'project-unassigned',
            name: 'Sin Proyecto / General',
            tasks: unassignedTasks,
            completedCount: unassignedTasks.filter((t) => t.completed).length,
            progress:
              unassignedTasks.length > 0
                ? Math.round(
                    (unassignedTasks.filter((t) => t.completed).length / unassignedTasks.length) * 100
                  )
                : 0,
            isUnassigned: true,
          },
        ]
      : []),
  ];

  if (columns.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-3 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#1c6662] mx-auto shadow-2xs">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 font-display">Sin proyectos definidos</h3>
        <p className="text-xs text-stone-500 leading-relaxed font-sans">
          Organiza tus compromisos asignando un nombre de proyecto al registrarlos o déjate guiar por la matriz de Eisenhower.
        </p>
        <button
          type="button"
          onClick={() => onOpenNewTaskWithProject('')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Registrar Compromiso</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
      {columns.map((col) => (
        <section
          key={col.key}
          className="bg-white/75 backdrop-blur-xl border border-white/80 rounded-3xl p-4.5 flex flex-col shadow-xs transition-all duration-200 hover:border-teal-600/20"
          aria-label={col.name}
        >
          {/* Column Header */}
          <div className="pb-3.5 mb-3.5 border-b border-stone-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-teal-50/80 border border-teal-200/70 flex items-center justify-center text-[#1c6662] flex-shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <h2
                  className="font-bold text-sm text-stone-900 truncate font-display tracking-tight"
                  title={col.name}
                >
                  {col.name}
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-lg">
                  {col.tasks.length}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenNewTaskWithProject(col.isUnassigned ? '' : col.name)}
                  className="p-1 rounded-lg text-stone-400 hover:text-[#1c6662] hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-colors cursor-pointer"
                  title={`Añadir tarea a ${col.name}`}
                  aria-label={`Añadir tarea a ${col.name}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Completion Progress Bar */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500">
              <div className="flex-1 h-1.5 rounded-full bg-stone-200/70 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1c6662] to-teal-500 transition-all duration-500 rounded-full"
                  style={{ width: `${col.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-600 font-medium">
                {col.progress}%
              </span>
            </div>
          </div>

          {/* Tasks in Column */}
          <div className="space-y-2.5">
            {col.tasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400 italic rounded-2xl border border-dashed border-stone-200/80 bg-white/40">
                Sin tareas en este proyecto.
              </div>
            ) : (
              col.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  viewMode="project"
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
