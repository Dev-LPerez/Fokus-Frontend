'use client';

import React from 'react';
import { Briefcase, X, Loader2, Sparkles } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  desc: string;
  setDesc: (val: string) => void;
  project: string;
  setProject: (val: string) => void;
  priority: 'high' | 'medium' | 'low';
  setPriority: (val: 'high' | 'medium' | 'low') => void;
  dueDate: string;
  setDueDate: (val: string) => void;
  minutes: number;
  setMinutes: (val: number) => void;
  distinctProjects: string[];
  creating: boolean;
  actionError: string | null;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  desc,
  setDesc,
  project,
  setProject,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  minutes,
  setMinutes,
  distinctProjects,
  creating,
  actionError,
}: CreateTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-task-title"
      className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="p-4.5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-[#1c6662]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-task-title" className="font-bold text-sm text-stone-900 font-display">
                Registrar Compromiso Ejecutivo
              </h3>
              <p className="text-[11px] text-stone-500 font-mono">
                Presiona Esc para cancelar o Enter para guardar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {actionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
              {actionError}
            </div>
          )}

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="text-xs font-mono text-stone-700 block mb-1.5 font-medium">
              Descripción del compromiso *
            </label>
            <input
              id="task-desc"
              type="text"
              required
              autoFocus
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Ej. Revisión y entrega de propuesta de arquitectura..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#1c6662] transition-colors"
            />
          </div>

          {/* Project & Priority Row with Combobox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Project with Autocomplete */}
            <div>
              <label htmlFor="task-project" className="text-xs font-mono text-stone-700 block mb-1.5 font-medium">
                Proyecto / Metas
              </label>
              <input
                id="task-project"
                type="text"
                list="projects-datalist"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Escribe o selecciona..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#1c6662] transition-colors"
              />
              <datalist id="projects-datalist">
                {distinctProjects.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>

              {/* Quick Project Pills */}
              {distinctProjects.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  {distinctProjects.slice(0, 3).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProject(p)}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-[#1c6662] border border-stone-200/80 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="task-priority" className="text-xs font-mono text-stone-700 block mb-1.5 font-medium">
                Prioridad (Eisenhower)
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-900 focus:outline-none focus:border-[#1c6662] transition-colors cursor-pointer"
              >
                <option value="high">🔥 Alta (Urgente / Crítico)</option>
                <option value="medium">⚡ Media (Estratégico / Deep Work)</option>
                <option value="low">🌱 Baja (Rutina / Secundario)</option>
              </select>
            </div>
          </div>

          {/* Due Date & Estimated Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Due Date */}
            <div>
              <label htmlFor="task-due" className="text-xs font-mono text-stone-700 block mb-1.5 font-medium">
                Fecha y Hora Límite
              </label>
              <input
                id="task-due"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-900 focus:outline-none focus:border-[#1c6662] transition-colors"
              />
              <span className="text-[11px] text-teal-700 font-mono mt-1.5 block">
                ✓ Sincronización automática con Google Cal
              </span>
            </div>

            {/* Duration */}
            <div>
              <span className="text-xs font-mono text-stone-700 block mb-1.5 font-medium">
                Duración Estimada
              </span>
              <div className="flex items-center gap-1.5">
                {[30, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setMinutes(mins)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                      minutes === mins
                        ? 'bg-teal-50 text-[#1c6662] border-teal-200 font-semibold shadow-2xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200/80 hover:text-stone-900'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3.5 border-t border-stone-200/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancelar (Esc)
            </button>

            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white font-medium text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Crear Tarea</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
