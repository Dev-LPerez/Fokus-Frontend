'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Briefcase,
  Sparkles,
  Zap,
  Compass,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface ProductiveRailProps {
  onSelectPrompt: (prompt: string) => void;
  hasCalendarConnected: boolean;
  tasksCount: number;
}

export function ProductiveRail({
  onSelectPrompt,
  hasCalendarConnected,
  tasksCount,
}: ProductiveRailProps) {
  const actions = [
    {
      id: 'deep-work',
      title: 'Blindar 90m Deep Work',
      subtitle: 'Google Calendar',
      prompt: 'Bloquea 90 minutos de Deep Work en mi Google Calendar para avanzar en mi tarea más crítica.',
      icon: Zap,
      accent: 'text-[#1c6662]',
      bg: 'hover:bg-teal-50/80 hover:border-teal-200/80',
    },
    {
      id: 'audit-calendar',
      title: 'Auditar Huecos Libres',
      subtitle: 'Disponibilidad real',
      prompt: 'Audita mi agenda de hoy en Google Calendar y dime qué huecos de trabajo libre tengo disponibles.',
      icon: Compass,
      accent: 'text-[#0f766e]',
      bg: 'hover:bg-teal-50/80 hover:border-teal-200/80',
    },
    {
      id: 'eisenhower-prioritize',
      title: 'Priorizar con Eisenhower',
      subtitle: 'Matriz estratégica',
      prompt: 'Revisa mi lista de tareas y organízalas según la Matriz de Eisenhower para saber qué resolver de inmediato.',
      icon: Briefcase,
      accent: 'text-amber-800',
      bg: 'hover:bg-amber-50/80 hover:border-amber-200/80',
    },
    {
      id: 'daily-briefing',
      title: 'Daily Briefing Matutino',
      subtitle: 'Clima y reuniones',
      prompt: 'Dame mi Daily Briefing matutino: cómo está el clima y cuáles son mis reuniones más importantes de hoy.',
      icon: Sparkles,
      accent: 'text-amber-700',
      bg: 'hover:bg-amber-50/80 hover:border-amber-200/80',
    },
  ];

  return (
    <aside
      aria-label="Rail de acciones productivas"
      className="hidden xl:flex flex-col w-64 flex-shrink-0 bg-white/70 backdrop-blur-xl border-r border-stone-200/80 p-4 space-y-4 overflow-y-auto"
    >
      {/* Header of the Rail */}
      <div>
        <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-700">
          Acciones Rápidas
        </h3>
        <p className="text-[11px] text-stone-500 font-sans mt-0.5 leading-relaxed">
          Disparadores directos para interactuar con tu Copiloto Fokus.
        </p>
      </div>

      {/* Action Triggers List */}
      <div className="space-y-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectPrompt(act.prompt)}
              className={`w-full text-left p-3 rounded-2xl bg-white/80 border border-stone-200/70 transition-all duration-200 cursor-pointer shadow-2xs group flex items-start gap-3 ${act.bg}`}
            >
              <div className="w-7 h-7 rounded-xl bg-stone-100/80 border border-stone-200/80 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                <Icon className={`w-3.5 h-3.5 ${act.accent}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-stone-800 group-hover:text-stone-950 truncate font-sans">
                  {act.title}
                </p>
                <p className="text-[11px] font-mono text-stone-500 truncate">
                  {act.subtitle}
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#1c6662] transition-colors flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
            </button>
          );
        })}
      </div>

      {/* Real Ecosystem Quick Links */}
      <div className="pt-3 border-t border-stone-200/70 space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
          Ecosistema Conectado
        </span>

        {/* Calendar Link */}
        <Link
          href="/calendar"
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 hover:bg-white border border-stone-200/60 transition-all text-xs font-medium text-stone-700 hover:text-[#1c6662] shadow-2xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-[#1c6662]" />
            <span className="truncate">Calendario & Foco</span>
          </div>
          {hasCalendarConnected ? (
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/70">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              <span>Conectado</span>
            </span>
          ) : (
            <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/70">
              Pendiente
            </span>
          )}
        </Link>

        {/* Projects Link */}
        <Link
          href="/projects"
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 hover:bg-white border border-stone-200/60 transition-all text-xs font-medium text-stone-700 hover:text-[#1c6662] shadow-2xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Briefcase className="w-3.5 h-3.5 text-amber-700" />
            <span className="truncate">Compromisos & Metas</span>
          </div>
          <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-md border border-stone-200">
            {tasksCount}
          </span>
        </Link>
      </div>
    </aside>
  );
}
