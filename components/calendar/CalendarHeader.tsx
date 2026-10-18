'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Search,
  X,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';
import { CalendarViewMode } from '@/app/(protected)/calendar/page';

interface CalendarHeaderProps {
  headerTitle: string;
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  calendarConnected: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterSource: 'all' | 'google_calendar' | 'task';
  onFilterSourceChange: (source: 'all' | 'google_calendar' | 'task') => void;
  totalEventsCount: number;
  onOpenCreateModal: () => void;
}

export function CalendarHeader({
  headerTitle,
  viewMode,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  calendarConnected,
  searchQuery,
  onSearchChange,
  filterSource,
  onFilterSourceChange,
  totalEventsCount,
  onOpenCreateModal,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-3 flex-shrink-0">
      {/* Top Floating Liquid Glass Navigation Bar */}
      <div className="px-5 py-3.5 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Title & Google Calendar Sync Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1c6662] text-white flex items-center justify-center shadow-md shadow-[#1c6662]/20 flex-shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {headerTitle}
              </h1>

              {calendarConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-teal-50 text-[#1c6662] border border-teal-200/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Google Calendar Sincronizado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200/70">
                  Modo Local
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5 hidden sm:block">
              Tu agenda diáfana: sesiones de enfoque profundo, reuniones y compromisos blindados
            </p>
          </div>
        </div>

        {/* Right: Controls, View Switcher & CTA */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end">
          {/* View Switcher: Día / Semana / Mes / Año */}
          <div className="flex items-center bg-white/80 p-1 rounded-2xl border border-white/95 shadow-2xs text-xs font-semibold">
            {(['day', 'week', 'month', 'year'] as CalendarViewMode[]).map((mode) => {
              const labels: Record<CalendarViewMode, string> = {
                day: 'Día',
                week: 'Semana',
                month: 'Mes',
                year: 'Año',
              };
              const isActive = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-sans ${
                    isActive
                      ? 'bg-[#1c6662] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls: Hoy, Prev, Next */}
          <div className="flex items-center gap-1 bg-white/80 border border-white/95 rounded-2xl p-1 shadow-2xs">
            <button
              onClick={onToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#1c6662] hover:bg-white/60 rounded-xl transition-colors cursor-pointer"
            >
              Hoy
            </button>
            <div className="w-px h-3.5 bg-slate-200" />
            <button
              onClick={onPrev}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-colors cursor-pointer"
              title="Período anterior"
              aria-label="Período anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNext}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-colors cursor-pointer"
              title="Período siguiente"
              aria-label="Período siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1c6662] hover:bg-[#15524f] text-white rounded-2xl text-xs font-semibold shadow-md shadow-[#1c6662]/20 transition-all cursor-pointer flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar Bloque</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Search & Source Filter Tabs */}
      <div className="px-5 py-2 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full flex items-center bg-white/80 border border-white/90 rounded-xl px-2.5 py-1.5 shadow-2xs focus-within:border-[#1c6662]/50 focus-within:ring-2 focus-within:ring-[#1c6662]/10 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar compromiso, proyecto o notas..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold font-mono">
            Filtrar:
          </span>
          <div className="flex items-center gap-1 bg-white/70 p-0.5 rounded-xl border border-white/90 shadow-2xs">
            <button
              onClick={() => onFilterSourceChange('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                filterSource === 'all'
                  ? 'bg-[#1c6662] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({totalEventsCount})
            </button>
            <button
              onClick={() => onFilterSourceChange('google_calendar')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                filterSource === 'google_calendar'
                  ? 'bg-[#1c6662] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Calendar
            </button>
            <button
              onClick={() => onFilterSourceChange('task')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                filterSource === 'task'
                  ? 'bg-[#1c6662] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tareas & Deep Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
