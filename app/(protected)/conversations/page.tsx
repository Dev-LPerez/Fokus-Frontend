'use client';

import React, { useEffect, useState } from 'react';
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

  const fetchConversations = async () => {
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
  };

  useEffect(() => {
    fetchConversations();
  }, []);

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
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-y-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-2xs">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              Historial de Conversaciones
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consulta y gestiona las sesiones de chat previas asociadas a tu cuenta
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchConversations}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Recargar conversaciones"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <Link
            href="/chat"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:brightness-105 text-white text-xs font-medium rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva Conversación</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-rose-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs font-mono">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span>Cargando historial...</span>
        </div>
      ) : conversations.length === 0 ? (
        <div className="py-16 text-center bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-8 max-w-md mx-auto shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 font-display">No hay conversaciones registradas</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Inicia una nueva sesión con Fokus para comenzar a organizar tu jornada y agenda.
          </p>
          <div className="mt-5">
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:brightness-105 text-white text-xs font-medium rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Nueva conversación</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="group relative bg-white/80 backdrop-blur-md hover:bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Sesión
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-2 leading-snug transition-colors font-display">
                  {conv.title || 'Conversación'}
                </h3>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-2.5 font-mono">
                  <Calendar className="w-3 h-3 text-cyan-600" />
                  <span>{formatDate(conv.created_at)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <Link
                  href={`/chat?id=${conv.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {confirmDeleteId === conv.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(conv.id)}
                      disabled={deletingId === conv.id}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"
                    >
                      {deletingId === conv.id ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        'Borrar'
                      )}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(conv.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Eliminar conversación"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
