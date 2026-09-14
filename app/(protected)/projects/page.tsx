'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Flame,
  Search,
  ExternalLink,
  Target,
  Sparkles,
  Loader2,
  X,
  RefreshCw,
  RotateCcw,
  CalendarClock,
  Grid2X2,
  ListFilter,
  Zap,
  Check,
  ChevronDown,
  Keyboard,
  ArrowRight,
  Info,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export interface TaskItem {
  id: string;
  description: string;
  due_date?: string | null;
  completed: boolean;
  google_event_id?: string | null;
  project?: string | null;
  priority: 'high' | 'medium' | 'low';
  estimated_minutes?: number | null;
  created_at: string;
}

interface PendingDelete {
  task: TaskItem;
  timerId: NodeJS.Timeout;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View modes: 'project' (Kanban by project) | 'eisenhower' (2x2 Matrix) | 'priority' (Linear list by urgency)
  const [viewMode, setViewMode] = useState<'project' | 'eisenhower' | 'priority'>('eisenhower');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Optimistic Undo Toast state
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  // Modal: Nueva Tarea
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState<number>(60);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal: Deep Work Booking
  const [deepWorkTask, setDeepWorkTask] = useState<TaskItem | null>(null);

  // Modal: Shortcuts Help
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchTasks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/reminders?include_completed=true`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error al consultar compromisos (${res.status})`);
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      // Direct Supabase client fallback
      try {
        const { data: supaData, error: supaErr } = await supabase
          .from('reminders')
          .select('*')
          .order('completed', { ascending: true })
          .order('due_date', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (supaErr) throw supaErr;
        setTasks(supaData || []);
      } catch {
        setError(err instanceof Error ? err.message : 'Error al cargar tareas');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Global Keyboard Shortcuts (N, Esc, ?, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (deepWorkTask) setDeepWorkTask(null);
        if (showShortcuts) setShowShortcuts(false);
        if (searchQuery) setSearchQuery('');
        return;
      }

      if (isInput) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsModalOpen(true);
      } else if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, deepWorkTask, showShortcuts, searchQuery]);

  // Clean up delete timer on unmount
  useEffect(() => {
    return () => {
      if (pendingDelete) {
        clearTimeout(pendingDelete.timerId);
      }
    };
  }, [pendingDelete]);

  // Distinct active projects
  const distinctProjects = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.project && t.project.trim()) {
        set.add(t.project.trim());
      }
    });
    return Array.from(set).sort();
  }, [tasks]);

  // Toggle complete with optimistic update
  const handleToggleComplete = async (task: TaskItem) => {
    const nextCompleted = !task.completed;

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/reminders/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ completed: nextCompleted }),
      });

      if (!res.ok) {
        await supabase
          .from('reminders')
          .update({ completed: nextCompleted })
          .eq('id', task.id);
      }
      window.dispatchEvent(new CustomEvent('conversation_updated'));
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      );
    }
  };

  // Optimistic Deletion with 5-second Undo
  const handleDeleteTask = (task: TaskItem) => {
    // If another delete was pending, commit it immediately
    if (pendingDelete) {
      commitDelete(pendingDelete.task.id);
    }

    // Remove optimistically from state
    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    // Start 5-second countdown timer before backend deletion
    const timerId = setTimeout(() => {
      commitDelete(task.id);
      setPendingDelete(null);
    }, 5000);

    setPendingDelete({ task, timerId });
  };

  const handleUndoDelete = () => {
    if (!pendingDelete) return;
    clearTimeout(pendingDelete.timerId);

    // Restore task in state
    setTasks((prev) => [pendingDelete.task, ...prev]);
    setPendingDelete(null);
  };

  const commitDelete = async (taskId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/reminders/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        await supabase.from('reminders').delete().eq('id', taskId);
      }
      window.dispatchEvent(new CustomEvent('conversation_updated'));
    } catch {
      // Silent error on background delete
    }
  };

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;

    setCreating(true);
    setActionError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa.');

      const payload = {
        description: newTaskDesc.trim(),
        project: newTaskProject.trim() || null,
        priority: newTaskPriority,
        due_date: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
        estimated_minutes: newTaskMinutes || null,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Error al guardar tarea (${res.status})`);
      }

      const created = await res.json();
      setTasks((prev) => [created, ...prev]);

      // Reset form
      setNewTaskDesc('');
      setNewTaskProject('');
      setNewTaskDueDate('');
      setNewTaskMinutes(60);
      setNewTaskPriority('medium');
      setIsModalOpen(false);

      window.dispatchEvent(new CustomEvent('conversation_updated'));
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Error al crear la tarea');
    } finally {
      setCreating(false);
    }
  };

  // Send Deep Work request to Chat Copilot
  const handleScheduleDeepWork = (task: TaskItem) => {
    const duration = task.estimated_minutes || 90;
    const projectInfo = task.project ? ` para el proyecto '${task.project}'` : '';
    const prompt = `Bloquea ${duration} minutos de Deep Work en mi calendario${projectInfo} enfocado en: "${task.description}"`;

    // Navigate to /chat and pass prompt via session or url
    router.push(`/chat?prompt=${encodeURIComponent(prompt)}`);
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (!showCompleted && t.completed) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesProj = (t.project || '').toLowerCase().includes(q);
        if (!matchesDesc && !matchesProj) return false;
      }
      if (selectedProject !== 'all') {
        if (selectedProject === '__none__') {
          if (t.project) return false;
        } else {
          if ((t.project || '').toLowerCase() !== selectedProject.toLowerCase()) return false;
        }
      }
      return true;
    });
  }, [tasks, showCompleted, searchQuery, selectedProject]);

  // Executive Metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = total - completedCount;
    const highPriorityCount = tasks.filter((t) => !t.completed && t.priority === 'high').length;
    const calendarSyncedCount = tasks.filter((t) => Boolean(t.google_event_id)).length;
    return { total, completedCount, pendingCount, highPriorityCount, calendarSyncedCount };
  }, [tasks]);

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

  // Grouping logic for the 3 view modes
  const groupedData = useMemo(() => {
    if (viewMode === 'eisenhower') {
      // Authentic 2x2 Matrix:
      // Q1: Urgente e Importante (High priority) -> Hacer Ya
      // Q2: Importante, No Urgente (Medium priority with estimated minutes) -> Planificar / Deep Work
      // Q3: Urgente, Menor Impacto (Medium priority without estimated minutes) -> Resolver / Delegar
      // Q4: Baja Prioridad / Rutina -> Eliminar / Si sobra tiempo
      const q1 = filteredTasks.filter((t) => t.priority === 'high');
      const q2 = filteredTasks.filter((t) => t.priority === 'medium' && Boolean(t.estimated_minutes && t.estimated_minutes >= 60));
      const q3 = filteredTasks.filter((t) => t.priority === 'medium' && (!t.estimated_minutes || t.estimated_minutes < 60));
      const q4 = filteredTasks.filter((t) => t.priority === 'low');

      return [
        {
          key: 'q1',
          title: 'Cuadrante I: Urgente & Crítico',
          subtitle: 'Acción Inmediata',
          accent: 'border-rose-500/40 text-rose-300',
          dot: 'bg-rose-400',
          tasks: q1,
          recommendation: 'Resolver hoy sin postergar.',
        },
        {
          key: 'q2',
          title: 'Cuadrante II: Estratégico & Deep Work',
          subtitle: 'Alto Impacto · Concentración',
          accent: 'border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          tasks: q2,
          recommendation: 'Bloquear Deep Work en calendario.',
        },
        {
          key: 'q3',
          title: 'Cuadrante III: Rutina & Operaciones',
          subtitle: 'Agilidad · Resolver Rápido',
          accent: 'border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          tasks: q3,
          recommendation: 'Despachar en bloques breves.',
        },
        {
          key: 'q4',
          title: 'Cuadrante IV: Secundario / Espera',
          subtitle: 'Baja Prioridad',
          accent: 'border-slate-700 text-slate-400',
          dot: 'bg-slate-500',
          tasks: q4,
          recommendation: 'Ejecutar si queda tiempo libre.',
        },
      ];
    } else if (viewMode === 'priority') {
      const high = filteredTasks.filter((t) => t.priority === 'high');
      const medium = filteredTasks.filter((t) => t.priority === 'medium');
      const low = filteredTasks.filter((t) => t.priority === 'low');

      return [
        {
          key: 'high',
          title: 'Prioridad Alta',
          subtitle: 'Crítico',
          accent: 'border-rose-500/40 text-rose-300',
          dot: 'bg-rose-400',
          tasks: high,
          recommendation: 'Atención primaria del día.',
        },
        {
          key: 'medium',
          title: 'Prioridad Media',
          subtitle: 'Importante',
          accent: 'border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          tasks: medium,
          recommendation: 'Continuidad operativa.',
        },
        {
          key: 'low',
          title: 'Prioridad Baja',
          subtitle: 'Rutina',
          accent: 'border-slate-700 text-slate-400',
          dot: 'bg-slate-500',
          tasks: low,
          recommendation: 'Sin urgencia temporal.',
        },
      ];
    } else {
      // Group by Project
      const map: Record<string, TaskItem[]> = {};
      filteredTasks.forEach((t) => {
        const proj = t.project?.trim() || 'General / Sin Proyecto';
        if (!map[proj]) map[proj] = [];
        map[proj].push(t);
      });

      return Object.entries(map).map(([projName, projTasks]) => ({
        key: projName,
        title: projName,
        subtitle: `${projTasks.length} compromiso${projTasks.length === 1 ? '' : 's'}`,
        accent: 'border-emerald-500/30 text-emerald-300',
        dot: 'bg-emerald-400',
        tasks: projTasks,
        recommendation: 'Agrupado por área de negocio.',
      }));
    }
  }, [viewMode, filteredTasks]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-transparent overflow-y-auto">
      {/* Streamlined Executive Toolbar (Single Header Layer) */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2.5">
          {/* Executive Pulse Strip (Live stats + Action shortcuts) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 sm:gap-5 flex-wrap font-mono">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>{stats.pendingCount} pendientes</span>
              </div>

              {stats.highPriorityCount > 0 && (
                <div className="flex items-center gap-1.5 text-rose-600">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>{stats.highPriorityCount} críticas</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-cyan-700">
                <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                <span>{stats.calendarSyncedCount} en Google Cal</span>
              </div>

              <div className="flex items-center gap-1.5 text-indigo-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{stats.completedCount} completadas</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowShortcuts(true)}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Atajos de teclado (?)"
                aria-label="Ver atajos de teclado"
              >
                <Keyboard className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => fetchTasks()}
                disabled={loading}
                className="p-1.5 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Actualizar compromisos"
                aria-label="Actualizar lista de tareas"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              </button>

              <Link
                href="/chat"
                className="text-[11px] font-mono text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-white border border-slate-200/80 shadow-2xs"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Copiloto</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:brightness-105 text-white font-medium text-xs shadow-md shadow-indigo-500/15 transition-all cursor-pointer ml-1"
                aria-label="Crear nueva tarea"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nueva Tarea</span>
                <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-white/20 text-[9px] font-mono">
                  N
                </kbd>
              </button>
            </div>
          </div>

          {/* Unified Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/60">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar compromisos... (Presiona /)"
                aria-label="Buscar compromisos"
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Buttons & Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 text-xs font-mono shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('eisenhower')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'eisenhower'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Matriz de Eisenhower 2x2"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                  <span>Eisenhower</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('project')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'project'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Agrupar por Proyecto"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Proyecto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('priority')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'priority'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Lista por Prioridad"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Prioridad</span>
                </button>
              </div>

              {/* Project Filter */}
              {distinctProjects.length > 0 && (
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  aria-label="Filtrar por proyecto"
                  className="bg-white border border-slate-200/80 text-xs text-slate-600 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
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

              {/* Show/Hide Completed */}
              <button
                type="button"
                onClick={() => setShowCompleted(!showCompleted)}
                className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  showCompleted
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                    : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900'
                }`}
              >
                {showCompleted ? 'Ocultar completadas' : 'Ver completadas'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Board Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchTasks()}
              className="font-bold underline hover:text-white ml-3"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading && tasks.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span>Sincronizando compromisos ejecutivos...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">Sin compromisos pendientes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {searchQuery || selectedProject !== 'all'
                ? 'No hay resultados que coincidan con los filtros aplicados.'
                : 'Excelente. Tu tablero de proyectos y metas está completamente al día. Puedes registrar una nueva meta o solicitar a Fokus que reserve tiempo de enfoque profundo.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white text-xs font-medium shadow-md shadow-indigo-500/15 hover:brightness-105 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Registrar compromiso (N)</span>
              </button>

              <button
                type="button"
                disabled={seedingDemo}
                onClick={async () => {
                  setSeedingDemo(true);
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
                      await fetchTasks(true);
                    }
                  } catch (e) {
                    console.error('Error seeding tasks:', e);
                  } finally {
                    setSeedingDemo(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 border border-slate-200/90 text-xs font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>{seedingDemo ? 'Cargando tareas...' : 'Cargar 4 compromisos de ejemplo'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Kanban / Matrix Grid */
          <div
            className={`grid gap-5 items-start ${
              viewMode === 'eisenhower'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {groupedData.map((group) => (
              <section
                key={group.key}
                className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 flex flex-col shadow-xs transition-all"
                aria-label={group.title}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${group.dot} flex-shrink-0`} />
                    <div className="min-w-0">
                      <h2 className="font-bold text-sm text-slate-900 truncate font-display" title={group.title}>
                        {group.title}
                      </h2>
                      <p className="text-[10.5px] text-slate-500 font-mono truncate">
                        {group.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {group.tasks.length}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  {group.tasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 italic">
                      Sin compromisos en este cuadrante. Presiona &apos;N&apos; para crear uno.
                    </div>
                  ) : (
                    group.tasks.map((task) => (
                      <article
                        key={task.id}
                        className={`group p-3 rounded-xl border transition-all ${
                          task.completed
                            ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                            : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-indigo-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Complete Checkbox */}
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(task)}
                            className="mt-0.5 min-w-[28px] min-h-[28px] flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
                            title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                            aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          {/* Task Body */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium leading-relaxed break-words ${
                                task.completed
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-800'
                              }`}
                            >
                              {task.description}
                            </p>

                            {/* Metadata Row: Clean, Monochromatic & Purposeful */}
                            <div className="flex items-center gap-2 flex-wrap mt-2 text-[10.5px] font-mono text-slate-500">
                              {/* Priority Dot */}
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                                  task.priority === 'high'
                                    ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium'
                                    : task.priority === 'medium'
                                    ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium'
                                    : 'bg-slate-100 border-slate-200 text-slate-600'
                                }`}
                              >
                                {task.priority === 'high' && <Flame className="w-2.5 h-2.5 text-rose-500" />}
                                <span>{task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</span>
                              </span>

                              {/* Project (if not grouped by project) */}
                              {viewMode !== 'project' && task.project && (
                                <span className="text-slate-600 truncate max-w-[130px] font-sans font-medium" title={task.project}>
                                  · {task.project}
                                </span>
                              )}

                              {/* Scheduled Date */}
                              {task.due_date && (
                                <span className="inline-flex items-center gap-1 text-cyan-700 font-medium">
                                  <Clock className="w-3 h-3 text-cyan-600" />
                                  <span>{formatDueDate(task.due_date)}</span>
                                </span>
                              )}

                              {/* Duration */}
                              {task.estimated_minutes && (
                                <span className="text-slate-500">
                                  ({task.estimated_minutes}m)
                                </span>
                              )}

                              {/* Google Calendar Sync Indicator */}
                              {task.google_event_id && (
                                <a
                                  href="https://calendar.google.com"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 ml-auto text-[10px] font-medium"
                                  title="Evento en Google Calendar (clic para abrir)"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                                  <span>Cal</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons: Deep Work & Delete */}
                          <div className="flex items-center gap-1 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            {/* Schedule Deep Work shortcut */}
                            {!task.completed && (
                              <button
                                type="button"
                                onClick={() => handleScheduleDeepWork(task)}
                                className="min-w-[28px] min-h-[28px] p-1 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                                title="Reservar bloque de Deep Work en Google Calendar para este compromiso"
                                aria-label="Programar Deep Work para esta tarea"
                              >
                                <Target className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Button (Optimistic + Undo) */}
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task)}
                              className="min-w-[28px] min-h-[28px] p-1 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                              title="Eliminar tarea"
                              aria-label="Eliminar tarea"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* FLOATING UNDO TOAST (Optimistic deletion without blocking confirm modal) */}
      {pendingDelete && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl border border-rose-300 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-4 text-xs animate-fade-in text-slate-800"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span className="font-medium">Tarea eliminada</span>
          </div>

          <button
            type="button"
            onClick={handleUndoDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Deshacer (5s)</span>
          </button>
        </aside>
      )}

      {/* MODAL: REGISTRAR NUEVA TAREA */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h3 id="modal-title" className="font-bold text-sm text-slate-900 font-display">
                  Registrar Compromiso Ejecutivo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {actionError}
                </div>
              )}

              {/* Description */}
              <div>
                <label htmlFor="task-desc" className="text-xs font-mono text-slate-600 block mb-1">
                  Descripción del compromiso *
                </label>
                <input
                  id="task-desc"
                  type="text"
                  required
                  autoFocus
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Ej. Revisión y firma de acuerdo con cliente..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Project & Priority Row with Combobox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Project with Autocomplete / Quick Select */}
                <div>
                  <label htmlFor="task-project" className="text-xs font-mono text-slate-600 block mb-1">
                    Proyecto / Cliente
                  </label>
                  <input
                    id="task-project"
                    type="text"
                    list="projects-datalist"
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    placeholder="Escribe o selecciona..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <datalist id="projects-datalist">
                    {distinctProjects.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>

                  {/* Quick Project Pills */}
                  {distinctProjects.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      {distinctProjects.slice(0, 3).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTaskProject(p)}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-indigo-600 border border-slate-200"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="task-priority" className="text-xs font-mono text-slate-600 block mb-1">
                    Prioridad (Eisenhower)
                  </label>
                  <select
                    id="task-priority"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">🔥 Alta (Urgente / Crítico)</option>
                    <option value="medium">⚡ Media (Importante / Estratégico)</option>
                    <option value="low">🌱 Baja (Secundario / Rutina)</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Estimated Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Due Date */}
                <div>
                  <label htmlFor="task-due" className="text-xs font-mono text-slate-600 block mb-1">
                    Fecha y Hora Límite
                  </label>
                  <input
                    id="task-due"
                    type="datetime-local"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-cyan-600 font-mono mt-1 block">
                    ✓ Se sincroniza con Google Calendar
                  </span>
                </div>

                {/* Duration */}
                <div>
                  <span className="text-xs font-mono text-slate-600 block mb-1">
                    Duración Estimada
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[30, 60, 90, 120].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setNewTaskMinutes(mins)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                          newTaskMinutes === mins
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancelar (Esc)
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:brightness-105 text-white font-medium text-xs shadow-md shadow-indigo-500/15 transition-all cursor-pointer flex items-center gap-2"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{creating ? 'Guardando...' : 'Crear Tarea'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SHORTCUTS HELP */}
      {showShortcuts && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4 animate-fade-in text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm font-display text-slate-900">Atajos de Teclado</h3>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Nueva Tarea</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-indigo-700 font-semibold">N</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Buscar compromisos</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-indigo-700 font-semibold">/</kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Cerrar modal / Limpiar</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-indigo-700 font-semibold">Esc</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Ver este menú de atajos</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-indigo-700 font-semibold">?</kbd>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowShortcuts(false)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
