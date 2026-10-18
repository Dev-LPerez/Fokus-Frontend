'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CheckCircle2,
  Calendar,
  Flame,
  Search,
  Sparkles,
  RefreshCw,
  Grid2X2,
  ListFilter,
  Keyboard,
  ArrowRight,
  Plus,
  X,
} from 'lucide-react';

interface ProjectsHeaderProps {
  stats: {
    total: number;
    completedCount: number;
    pendingCount: number;
    highPriorityCount: number;
    calendarSyncedCount: number;
  };
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  viewMode: 'eisenhower' | 'project' | 'priority';
  setViewMode: (mode: 'eisenhower' | 'project' | 'priority') => void;
  selectedProject: string;
  setSelectedProject: (proj: string) => void;
  distinctProjects: string[];
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
  loading: boolean;
  onRefresh: () => void;
  onOpenShortcuts: () => void;
  onOpenNewTask: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ProjectsHeader({
  stats,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  selectedProject,
  setSelectedProject,
  distinctProjects,
  showCompleted,
  setShowCompleted,
  loading,
  onRefresh,
  onOpenShortcuts,
  onOpenNewTask,
  searchInputRef,
}: ProjectsHeaderProps) {
  return (
    <header className="border-b border-stone-200/80 bg-white/70 backdrop-blur-xl sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Row 1: Executive Pulse Strip (Live stats + Action shortcuts) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Pending count */}
            <div className="flex items-center gap-1.5 text-stone-700 bg-stone-100/80 border border-stone-200/80 px-2.5 py-1 rounded-xl font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
              <span className="font-semibold">{stats.pendingCount}</span>
              <span className="text-stone-500">pendientes</span>
            </div>

            {/* High priority */}
            {stats.highPriorityCount > 0 && (
              <div className="flex items-center gap-1.5 text-rose-800 bg-rose-50/80 border border-rose-200/80 px-2.5 py-1 rounded-xl font-mono text-[11px]">
                <Flame className="w-3 h-3 text-rose-600" />
                <span className="font-semibold">{stats.highPriorityCount}</span>
                <span className="text-rose-600">críticas</span>
              </div>
            )}

            {/* Calendar synced */}
            <div className="flex items-center gap-1.5 text-[#1c6662] bg-teal-50/80 border border-teal-200/80 px-2.5 py-1 rounded-xl font-mono text-[11px]">
              <Calendar className="w-3 h-3 text-[#1c6662]" />
              <span className="font-semibold">{stats.calendarSyncedCount}</span>
              <span className="text-teal-700">en Google Cal</span>
            </div>

            {/* Completed */}
            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1 rounded-xl font-mono text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="font-semibold">{stats.completedCount}</span>
              <span className="text-emerald-700">completadas</span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white border border-stone-200/80 rounded-xl transition-colors cursor-pointer shadow-xs"
              title="Atajos de teclado (?)"
              aria-label="Ver atajos de teclado"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white border border-stone-200/80 rounded-xl transition-colors cursor-pointer shadow-xs"
              title="Actualizar compromisos"
              aria-label="Actualizar lista de tareas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#1c6662]' : ''}`} />
            </button>

            <Link
              href="/chat"
              className="text-[11px] font-mono text-[#1c6662] hover:text-[#124542] inline-flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-stone-200/80 shadow-xs"
              title="Consultar al Copiloto Fokus"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Copiloto</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>

            <button
              type="button"
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white font-medium text-xs shadow-xs transition-all cursor-pointer ml-1"
              aria-label="Crear nueva tarea"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nueva Tarea</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/20 text-[11px] font-mono">
                N
              </kbd>
            </button>
          </div>
        </div>

        {/* Row 2: Unified Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-stone-200/60">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar compromisos... (Presiona /)"
              aria-label="Buscar compromisos"
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white/90 border border-stone-200/80 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#1c6662] transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Buttons & Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher Pills */}
            <div className="flex items-center bg-white/80 border border-stone-200/80 rounded-xl p-0.5 text-xs font-mono shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('eisenhower')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer text-xs ${
                  viewMode === 'eisenhower'
                    ? 'bg-[#1c6662] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Matriz de Eisenhower 2x2"
              >
                <Grid2X2 className="w-3.5 h-3.5" />
                <span>Eisenhower</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('project')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer text-xs ${
                  viewMode === 'project'
                    ? 'bg-[#1c6662] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Agrupar por Proyecto"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Proyecto</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('priority')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer text-xs ${
                  viewMode === 'priority'
                    ? 'bg-[#1c6662] text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Lista por Prioridad"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Prioridad</span>
              </button>
            </div>

            {/* Project Filter Dropdown */}
            {distinctProjects.length > 0 && (
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                aria-label="Filtrar por proyecto"
                className="bg-white/80 border border-stone-200/80 text-xs text-stone-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#1c6662] cursor-pointer shadow-2xs"
              >
                <option value="all">Todos los proyectos</option>
                {distinctProjects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
                <option value="__none__">Sin proyecto</option>
              </select>
            )}

            {/* Show / Hide Completed Toggle */}
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                showCompleted
                  ? 'bg-teal-50 border-teal-200 text-[#1c6662] font-medium'
                  : 'bg-white/80 border-stone-200/80 text-stone-600 hover:text-stone-900'
              }`}
            >
              {showCompleted ? 'Ocultar completadas' : 'Ver completadas'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
