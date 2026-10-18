'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  History,
  MessageSquare,
  Trash2,
  Calendar,
  ArrowRight,
  Plus,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ConversationItem {
  id: string;
  title?: string | null;
  created_at: string;
  user_id?: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/conversations`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.status === 401) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron cargar las conversaciones.`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);
      } else if (data && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
      } else {
        setConversations([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    setSuccessMessage(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.status === 401) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      if (!res.ok && res.status !== 204 && res.status !== 200) {
        throw new Error(`Error al eliminar la conversación (${res.status})`);
      }

      setConversations((prev) => prev.filter((c) => c.id !== id));
      setSuccessMessage('Conversación eliminada correctamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo eliminar la conversación';
      setError(msg);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#edece9] overflow-y-auto relative">
      {/* Ambient Atmospheric Glows */}
      <div
        className="absolute top-12 left-10 w-[500px] h-[500px] bg-[#1c6662]/[0.05] rounded-full blur-[80px] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#f4e0ba]/30 rounded-full blur-[90px] pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Floating Header Toolbar */}
      <header className="border-b border-stone-200/80 bg-white/75 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-[#1c6662]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm text-stone-900 font-display tracking-tight">
                  Historial de Sesiones
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-600">
                  {conversations.length} {conversations.length === 1 ? 'sesión' : 'sesiones'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-stone-500">
                Archivo cronológico de diálogos con Fokus Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchConversations}
              disabled={loading}
              className="p-2 text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
              title="Recargar conversaciones"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#1c6662]' : ''}`} />
            </button>

            <Link
              href="/settings?tab=account"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-mono font-medium transition-colors shadow-2xs"
            >
              Ajustes de Suite
            </Link>

            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Sesión</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative z-10 space-y-6">
        {/* Error Feedback */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-3 animate-fade-in shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[11px] font-mono underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Success Feedback */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-fade-in shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-[11px] font-mono underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Content View */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-stone-500 text-xs font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-[#1c6662]" />
            <span>Cargando historial de sesiones...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-16 text-center bg-white/80 backdrop-blur-xl border border-white/85 rounded-3xl p-8 max-w-md mx-auto shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#1c6662] mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 font-display">
                No hay conversaciones registradas
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-1 max-w-xs mx-auto leading-relaxed">
                Inicia una nueva sesión con Fokus Copilot para comenzar a organizar tu jornada y proteger tus bloques de Deep Work.
              </p>
            </div>
            <div>
              <Link
                href="/chat"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c6662] hover:bg-[#154f4c] text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer font-sans"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Iniciar primera sesión</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {conversations.map((conv) => (
              <article
                key={conv.id}
                className="group relative bg-white/85 hover:bg-white backdrop-blur-xl border border-white/85 hover:border-[#1c6662]/40 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-1.5 rounded-xl bg-teal-50 border border-teal-200/60 text-[#1c6662]">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200/80">
                      Sesión Fokus
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-stone-900 group-hover:text-[#1c6662] line-clamp-2 leading-snug transition-colors font-display">
                    {conv.title || 'Sesión de Foco'}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-3 font-mono">
                    <Calendar className="w-3 h-3 text-[#1c6662]/70" />
                    <span>{formatDate(conv.created_at)}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3.5 border-t border-stone-200/70 flex items-center justify-between gap-2">
                  <Link
                    href={`/chat?id=${conv.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1c6662] hover:text-[#154f4c] font-mono transition-colors"
                  >
                    <span>Reanudar diálogo</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  {confirmDeleteId === conv.id ? (
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleDelete(conv.id)}
                        disabled={deletingId === conv.id}
                        className="px-2 py-0.5 font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
                      >
                        {deletingId === conv.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          'Confirmar'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(conv.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar conversación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
