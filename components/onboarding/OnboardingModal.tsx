'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  X,
  Zap,
  Target,
  Layers,
  ChevronRight,
  PlusCircle,
  Play,
  BookOpen,
} from 'lucide-react';
import { FokusIcon } from '@/components/brand/FokusLogo';
import { createClient } from '@/lib/supabase/client';

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string | null;
  onStartAction?: (prompt: string) => void;
  onTasksSeeded?: () => void;
  hasCalendarConnected?: boolean;
  tasksCount?: number;
}

export function OnboardingModal({
  isOpen,
  onClose,
  userName,
  onStartAction,
  onTasksSeeded,
  hasCalendarConnected = false,
  tasksCount = 0,
}: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [seeding, setSeeding] = useState(false);
  const [seededDone, setSeededDone] = useState(false);
  const supabase = createClient();

  // Reset steps if reopened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const markCompletedOnBackend = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/onboarding/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      localStorage.setItem('executive_onboarding_v1_completed', 'true');
    } catch (e) {
      console.error('Error marking onboarding complete on backend:', e);
    }
  };

  const handleDismiss = () => {
    markCompletedOnBackend();
    onClose();
  };

  const handleSeedTasks = async () => {
    setSeeding(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/onboarding/seed-tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ project_name: 'Estrategia Q1' }),
      });

      if (res.ok) {
        setSeededDone(true);
        if (onTasksSeeded) onTasksSeeded();
      }
    } catch (e) {
      console.error('Error seeding tasks:', e);
    } finally {
      setSeeding(false);
    }
  };

  const nameGreeting = userName ? `, ${userName}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      {/* Modal Container in Liquid Glass */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 text-slate-800 animate-liquid-entrance overflow-hidden">
        
        {/* Subtle decorative Iris ambient blob */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none animate-aura-pulse" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-cyan-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition-colors cursor-pointer"
          title="Cerrar introducción"
          aria-label="Cerrar introducción"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Progress Stepper */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s as 1 | 2 | 3)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  step === s
                    ? 'w-8 bg-indigo-600'
                    : step > s
                    ? 'w-4 bg-indigo-300'
                    : 'w-4 bg-slate-200'
                }`}
                title={`Paso ${s}`}
                aria-label={`Paso ${s}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-slate-400 ml-auto font-medium">
            Paso {step} de 3
          </span>
        </div>

        {/* STEP 1: WELCOME & THE CHIEF OF STAFF PROMISE */}
        {step === 1 && (
          <div className="space-y-4 relative z-10 animate-fade-in">
            <div className="shadow-sm rounded-2xl inline-block">
              <FokusIcon size={46} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                ¡Te damos la bienvenida a Fokus{nameGreeting}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-sans">
                <strong>Fokus</strong> es tu espacio inteligente de crecimiento personal y profesional. Conéctate con <strong>Google Calendar</strong> y gestiona tus metas con la <strong>Matriz de Eisenhower</strong> para lograr tus objetivos con serenidad y constancia.
              </p>
            </div>

            {/* Value Pillars Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Defensa de Deep Work</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Audita tu agenda real y blinda de 60 a 90 min de foco libre sin esfuerzo manual.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  <span>Matriz de Eisenhower</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Distingue lo urgente de lo estratégico y tacha compromisos en tiempo real.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Omitir e ir directo
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
              >
                <span>Conectar y Activar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONNECT CALENDAR & SEED TASKS */}
        {step === 2 && (
          <div className="space-y-4 relative z-10 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-xs">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                Potencia tu Agenda Real
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-sans">
                Para que el copiloto detecte huecos libres y reserve bloques en vivo, conecta tu cuenta de Google Calendar o inicializa compromisos de trabajo.
              </p>
            </div>

            {/* Action modules */}
            <div className="space-y-2.5 pt-1">
              {/* Google Calendar Link option */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">Google Calendar</p>
                      {hasCalendarConnected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Conectado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {hasCalendarConnected
                        ? 'Sincronización activa para detección de huecos de concentración'
                        : 'Sincronización segura vía OAuth 2.0'}
                    </p>
                  </div>
                </div>

                {hasCalendarConnected ? (
                  <Link
                    href="/settings"
                    onClick={handleDismiss}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors flex-shrink-0"
                  >
                    <span>Ajustes</span>
                  </Link>
                ) : (
                  <Link
                    href="/settings"
                    onClick={handleDismiss}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs shadow-xs transition-colors flex-shrink-0"
                  >
                    <span>Conectar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Seed Tasks Option */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">Tablero y Matriz de Tareas</p>
                      {tasksCount > 0 || seededDone ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                          {tasksCount > 0 ? `${tasksCount} existentes` : 'Agregadas'}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {tasksCount > 0
                        ? 'Ya dispones de tareas registradas para la Matriz de Eisenhower'
                        : 'Agrega 4 compromisos iniciales para probar la matriz'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSeedTasks}
                  disabled={seeding || seededDone}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex-shrink-0 cursor-pointer ${
                    seededDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {seededDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Agregadas</span>
                    </>
                  ) : seeding ? (
                    <span>Cargando...</span>
                  ) : (
                    <>
                      <span>{tasksCount > 0 ? 'Cargar Más' : 'Cargar Demo'}</span>
                      <Zap className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
              >
                <span>Probar Primer Comando</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FIRST AHA MOMENT (COMMAND PROMPT STARTER) */}
        {step === 3 && (
          <div className="space-y-4 relative z-10 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
              <Play className="w-5 h-5 stroke-[2.2] ml-0.5" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                Tu Primer Momento de Valor
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-sans">
                Elige una acción para que tu Copiloto Ejecutivo la resuelva inmediatamente:
              </p>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-2 pt-1">
              {[
                {
                  title: 'Auditar mi disponibilidad y huecos libres',
                  desc: 'Busca huecos ideales para concentración ininterrumpida',
                  prompt: 'Audita mi agenda en Google Calendar y dime qué huecos de Deep Work tengo libres hoy.',
                  badge: 'Deep Work'
                },
                {
                  title: 'Organizar prioridades en Matriz Eisenhower',
                  desc: 'Clasifica tareas críticas vs urgentes',
                  prompt: 'Revisa mis tareas y organízalas según la Matriz de Eisenhower.',
                  badge: 'Eisenhower'
                },
                {
                  title: 'Daily Briefing matutino completo',
                  desc: 'Pronóstico de clima y timeline de reuniones',
                  prompt: 'Dame mi Daily Briefing matutino: cómo está el clima y cuáles son mis compromisos.',
                  badge: 'Briefing'
                }
              ].map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleDismiss();
                    if (onStartAction) onStartAction(opt.prompt);
                  }}
                  className="w-full p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-left transition-all cursor-pointer group shadow-2xs flex items-center justify-between gap-3 hover:border-indigo-300"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {opt.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate font-sans">
                      {opt.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Listo, explorar por mi cuenta</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
