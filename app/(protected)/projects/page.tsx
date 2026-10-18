'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Plus,
  Loader2,
  Zap,
  Keyboard,
  Target,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';
import { EisenhowerMatrixView } from '@/components/projects/EisenhowerMatrixView';
import { ProjectKanbanView } from '@/components/projects/ProjectKanbanView';
import { PriorityListView } from '@/components/projects/PriorityListView';
import { CreateTaskModal } from '@/components/projects/CreateTaskModal';
import { ShortcutsModal } from '@/components/projects/ShortcutsModal';
import { UndoToast } from '@/components/projects/UndoToast';

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

  // View modes: 'eisenhower' (2x2 Matrix) | 'project' (Kanban by project) | 'priority' (List by priority)
  const [viewMode, setViewMode] = useState<'eisenhower' | 'project' | 'priority'>('eisenhower');
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
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
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
  }, [isModalOpen, showShortcuts, searchQuery]);

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
    if (pendingDelete) {
      commitDelete(pendingDelete.task.id);
    }

    setTasks((prev) => prev.filter((t) => t.id !== task.id));

    const timerId = setTimeout(() => {
      commitDelete(task.id);
      setPendingDelete(null);
    }, 5000);

    setPendingDelete({ task, timerId });
  };

  const handleUndoDelete = () => {
    if (!pendingDelete) return;
    clearTimeout(pendingDelete.timerId);
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
        estimated_minutes: newTaskMinutes,
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

      if (res.ok) {
        const createdTask = await res.json();
        setTasks((prev) => [createdTask, ...prev]);
      } else {
        // Fallback to Supabase
        const { data: supaTask, error: supaErr } = await supabase
          .from('reminders')
          .insert({
            user_id: session.user.id,
            description: payload.description,
            project: payload.project,
            priority: payload.priority,
            due_date: payload.due_date,
            estimated_minutes: payload.estimated_minutes,
            completed: false,
          })
          .select()
          .single();

        if (supaErr) throw supaErr;
        if (supaTask) setTasks((prev) => [supaTask, ...prev]);
      }

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

  // Deep Work trigger (routes to /chat?prompt=...)
  const handleScheduleDeepWork = (task: TaskItem) => {
    const duration = task.estimated_minutes || 90;
    const projectInfo = task.project ? ` para el proyecto '${task.project}'` : '';
    const prompt = `Bloquea ${duration} minutos de Deep Work en mi Google Calendar${projectInfo} enfocado en: "${task.description}"`;
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

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-transparent overflow-y-auto">
      {/* Executive Floating Header Toolbar */}
      <ProjectsHeader
        stats={stats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        distinctProjects={distinctProjects}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
        loading={loading}
        onRefresh={() => fetchTasks()}
        onOpenShortcuts={() => setShowShortcuts(true)}
        onOpenNewTask={() => setIsModalOpen(true)}
        searchInputRef={searchInputRef}
      />

      {/* Main Board Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 pb-24">
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchTasks()}
              className="font-bold underline hover:text-rose-950 ml-3 cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading && tasks.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-500 font-mono text-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[#1c6662]" />
            <span>Sincronizando compromisos ejecutivos...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/80 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50/90 border border-teal-200/80 flex items-center justify-center text-[#1c6662] mx-auto shadow-2xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              Sin compromisos pendientes
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              {searchQuery || selectedProject !== 'all'
                ? 'No hay resultados que coincidan con los filtros aplicados.'
                : 'Excelente. Tu tablero de proyectos y metas está al día. Puedes registrar una nueva meta estratégica o cargar compromisos de ejemplo para explorar.'}
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
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
                    const {
                      data: { session },
                    } = await supabase.auth.getSession();
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-[#1c6662] border border-stone-200 text-xs font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-[#1c6662]" />
                <span>{seedingDemo ? 'Cargando tareas...' : 'Cargar 4 compromisos de ejemplo'}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* View Render */}
            {viewMode === 'eisenhower' && (
              <EisenhowerMatrixView
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onScheduleDeepWork={handleScheduleDeepWork}
                onOpenNewTask={() => setIsModalOpen(true)}
              />
            )}

            {viewMode === 'project' && (
              <ProjectKanbanView
                tasks={filteredTasks}
                distinctProjects={distinctProjects}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onScheduleDeepWork={handleScheduleDeepWork}
                onOpenNewTaskWithProject={(proj) => {
                  setNewTaskProject(proj);
                  setIsModalOpen(true);
                }}
              />
            )}

            {viewMode === 'priority' && (
              <PriorityListView
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onScheduleDeepWork={handleScheduleDeepWork}
              />
            )}
          </>
        )}
      </main>

      {/* FLOATING ACTION DOCK (Option 1 Strategic Sanctuary Signature) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/85 backdrop-blur-2xl border border-white/90 shadow-xl px-4 py-2 rounded-full flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c6662] hover:bg-[#154f4c] text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Nueva Tarea</span>
            <kbd className="px-1.5 py-0.2 rounded bg-white/20 text-[11px] font-mono">N</kbd>
          </button>

          <div className="w-px h-4 bg-stone-300/80" />

          <button
            type="button"
            onClick={() => setShowShortcuts(true)}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100/80 transition-colors cursor-pointer"
            title="Atajos de teclado (?)"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              const strategicTask = tasks.find(
                (t) => !t.completed && (t.priority === 'high' || t.priority === 'medium')
              );
              if (strategicTask) {
                handleScheduleDeepWork(strategicTask);
              } else {
                router.push('/chat?prompt=Ayúdame%20a%20planificar%20mi%20próximo%20bloque%20de%20Deep%20Work');
              }
            }}
            className="p-1.5 text-stone-500 hover:text-[#1c6662] rounded-full hover:bg-teal-50/80 transition-colors cursor-pointer"
            title="Blindar Deep Work con Copiloto"
          >
            <Target className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* FLOATING UNDO TOAST */}
      {pendingDelete && (
        <UndoToast
          description={pendingDelete.task.description}
          onUndo={handleUndoDelete}
        />
      )}

      {/* MODAL: REGISTRAR NUEVA TAREA */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        desc={newTaskDesc}
        setDesc={setNewTaskDesc}
        project={newTaskProject}
        setProject={setNewTaskProject}
        priority={newTaskPriority}
        setPriority={setNewTaskPriority}
        dueDate={newTaskDueDate}
        setDueDate={setNewTaskDueDate}
        minutes={newTaskMinutes}
        setMinutes={setNewTaskMinutes}
        distinctProjects={distinctProjects}
        creating={creating}
        actionError={actionError}
      />

      {/* MODAL: SHORTCUTS HELP */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
