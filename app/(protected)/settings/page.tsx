'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Settings,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Unlink,
  Link2,
  ExternalLink,
  ShieldCheck,
  User,
  LogOut,
  MapPin,
  MessageSquare,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { signOut } from '@/app/auth/actions';

interface IntegrationStatus {
  connected: boolean;
  email?: string | null;
  account?: string | null;
}

interface ConversationItem {
  id: string;
  title?: string | null;
  created_at: string;
  user_id?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialTab = (searchParams.get('tab') as 'account' | 'history' | 'preferences') || 'account';
  const [activeTab, setActiveTab] = useState<'account' | 'history' | 'preferences'>(initialTab);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Usuario');
  const [loadingUser, setLoadingUser] = useState(true);

  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Conversations history state
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [deletingConvId, setDeletingConvId] = useState<string | null>(null);

  // Preferences
  const [defaultCity, setDefaultCity] = useState('Bogotá, Colombia');
  const [citySaved, setCitySaved] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      await signOut();
    } catch {
      router.push('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email ?? null);
      const name =
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        (session.user.email ? session.user.email.split('@')[0] : 'Usuario');
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      setLoadingUser(false);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/integrations/status`, {
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
        throw new Error(`Error ${res.status} al consultar estado de integraciones`);
      }

      const data = await res.json();

      if (data.google_calendar) {
        setIntegrationStatus({
          connected: Boolean(data.google_calendar.connected),
          email: data.google_calendar.email || data.google_calendar.account || null,
        });
      } else if (data.google) {
        setIntegrationStatus({
          connected: Boolean(data.google.connected),
          email: data.google.email || data.google.account || null,
        });
      } else {
        setIntegrationStatus({
          connected: Boolean(data.connected),
          email: data.email || data.account || null,
        });
      }
    } catch (err: unknown) {
      setIntegrationStatus({ connected: false });
    } finally {
      setLoadingStatus(false);
    }
  }, [supabase, router]);

  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/conversations`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : data.conversations || []);
      }
    } catch {
      // Non-blocking
    } finally {
      setLoadingConversations(false);
    }
  }, [supabase]);

  // Handle query param callbacks from backend OAuth redirect
  useEffect(() => {
    const googleParam = searchParams.get('google');
    const errorParam = searchParams.get('error');

    if (googleParam === 'connected') {
      setFeedback({
        type: 'success',
        message: '¡Google Calendar se ha conectado correctamente!',
      });
      window.history.replaceState({}, '', window.location.pathname);
    } else if (googleParam === 'error' || errorParam) {
      setFeedback({
        type: 'error',
        message:
          errorParam ||
          'No se pudo conectar con Google Calendar. Por favor, inténtalo nuevamente.',
      });
      window.history.replaceState({}, '', window.location.pathname);
    }

    fetchStatus();
    fetchConversations();
  }, [searchParams, fetchStatus, fetchConversations]);

  const handleConnect = async () => {
    setConnecting(true);
    setFeedback(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/integrations/google/connect`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.detail || `Error ${res.status} al iniciar conexión con Google`
        );
      }

      const data = await res.json();
      const authUrl = data.auth_url || data.url;

      if (!authUrl) {
        throw new Error('No se recibió la URL de autorización de Google.');
      }

      window.location.href = authUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al conectar';
      setFeedback({
        type: 'error',
        message: msg,
      });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = window.confirm(
      '¿Deseas desconectar Google Calendar? Tu copiloto dejará de auditar tu disponibilidad y no podrá programar bloques de Deep Work automáticamente hasta que lo vuelvas a conectar.'
    );

    if (!confirmed) return;

    setDisconnecting(true);
    setFeedback(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/integrations/google`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok && res.status !== 204 && res.status !== 200) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.detail || `Error al desconectar la cuenta (${res.status})`
        );
      }

      setIntegrationStatus({ connected: false });
      setFeedback({
        type: 'info',
        message: 'Tu cuenta de Google Calendar ha sido desconectada.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al desconectar Google Calendar';
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (!window.confirm('¿Eliminar esta conversación del historial?')) return;
    setDeletingConvId(id);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // Non-blocking
    } finally {
      setDeletingConvId(null);
    }
  };

  const formatSessionDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#edece9] overflow-y-auto relative">
      {/* Ambient Atmospheric Glows */}
      <div
        className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#1c6662]/[0.05] rounded-full blur-[80px] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#f4e0ba]/30 rounded-full blur-[90px] pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Floating Header Toolbar with Central Tabs Pill (Option 2: Zen Tabbed Suite) */}
      <header className="border-b border-stone-200/80 bg-white/75 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 flex-wrap">
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-[#1c6662]">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-stone-900 font-display tracking-tight">
                Fokus Suite
              </h1>
              <p className="text-[11px] font-mono text-stone-500">
                Ajustes & Gestión de Entorno
              </p>
            </div>
          </div>

          {/* Central Floating Tab Switcher */}
          <nav aria-label="Secciones de configuración" className="flex items-center bg-white/80 border border-stone-200/80 rounded-2xl p-1 shadow-2xs font-sans text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-[#1c6662] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cuenta & Integraciones
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-[#1c6662] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Historial de Sesiones</span>
              {conversations.length > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${
                    activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {conversations.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preferences')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'preferences'
                  ? 'bg-[#1c6662] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Preferencias
            </button>
          </nav>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {integrationStatus?.connected ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">Google Cal Activo</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="hidden sm:inline">Sin Calendario</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative z-10">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs mb-6 flex items-center justify-between gap-3 animate-fade-in shadow-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-900'
                : feedback.type === 'error'
                ? 'bg-rose-50/90 border border-rose-200 text-rose-900'
                : 'bg-teal-50/90 border border-teal-200 text-teal-900'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-[11px] font-mono font-medium underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (68% / 8 cols): Active Tab Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* TAB 1: CUENTA & INTEGRACIONES */}
            {activeTab === 'account' && (
              <>
                {/* Profile Card */}
                <section className="bg-white/80 backdrop-blur-xl border border-white/85 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center justify-between gap-4 flex-wrap pb-5 border-b border-stone-200/70">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#1c6662] text-white flex items-center justify-center font-display font-bold text-lg shadow-sm">
                        {initials}
                      </div>
                      <div>
                        <h2 className="font-bold text-base text-stone-900 font-display">
                          {userName}
                        </h2>
                        <p className="text-xs font-mono text-stone-500 mt-0.5">
                          {userEmail || 'Cargando correo...'}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700">
                          Plan Fokus Pro · Acceso Completo
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-rose-700 text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isSigningOut ? 'Saliendo...' : 'Cerrar Sesión'}</span>
                    </button>
                  </div>
                </section>

                {/* Google Calendar Integration Card */}
                <section className="bg-white/85 backdrop-blur-xl border-2 border-[#1c6662]/30 rounded-3xl p-6 shadow-sm relative overflow-hidden ring-1 ring-[#f4e0ba]/80">
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200/70 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-[#1c6662]">
                        <Calendar className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-base text-stone-900 font-display">
                            Google Calendar
                          </h2>
                          {integrationStatus?.connected && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>OAuth 2.0 Verificado</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 font-sans mt-0.5">
                          Sincronización en tiempo real de eventos y bloques de Deep Work de 90m.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fetchStatus()}
                      disabled={loadingStatus}
                      className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                      title="Refrescar estado de conexión"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin text-[#1c6662]' : ''}`} />
                    </button>
                  </div>

                  <div className="pt-4 space-y-4">
                    {loadingStatus ? (
                      <div className="py-6 flex items-center justify-center gap-2 text-stone-500 text-xs font-mono">
                        <Loader2 className="w-4 h-4 animate-spin text-[#1c6662]" />
                        <span>Verificando credenciales de Google Calendar...</span>
                      </div>
                    ) : integrationStatus?.connected ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80 flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <span className="text-[11px] uppercase font-mono text-stone-500 tracking-wider block font-semibold">
                              Cuenta Vinculada
                            </span>
                            <p className="text-xs font-semibold text-stone-800 font-mono mt-0.5">
                              {integrationStatus.email || userEmail}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleDisconnect}
                            disabled={disconnecting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
                          >
                            <Unlink className="w-3.5 h-3.5" />
                            <span>{disconnecting ? 'Desconectando...' : 'Desconectar'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/60 text-stone-700">
                            <span className="font-semibold text-stone-900 block font-sans">
                              ✓ Bloqueo Automático
                            </span>
                            <span className="text-[11px] text-stone-600 font-sans mt-0.5 block">
                              El Copiloto puede agendar bloques de Deep Work protegidos sin colisiones.
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/60 text-stone-700">
                            <span className="font-semibold text-stone-900 block font-sans">
                              ✓ Detección de Disponibilidad
                            </span>
                            <span className="text-[11px] text-stone-600 font-sans mt-0.5 block">
                              Audita tus huecos libres diarios para sugerir sesiones de concentración óptimas.
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-3">
                        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed font-sans">
                          Conecta tu cuenta de Google Calendar para que Fokus pueda sincronizar tus compromisos, detectar huecos libres y blindar tus sesiones de Deep Work.
                        </p>
                        <button
                          type="button"
                          onClick={handleConnect}
                          disabled={connecting}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white text-xs font-medium shadow-xs transition-all cursor-pointer"
                        >
                          {connecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Link2 className="w-4 h-4" />
                          )}
                          <span>{connecting ? 'Iniciando conexión...' : 'Conectar Google Calendar'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* TAB 2: HISTORIAL DE SESIONES */}
            {activeTab === 'history' && (
              <section className="bg-white/80 backdrop-blur-xl border border-white/85 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200/70">
                  <div>
                    <h2 className="font-bold text-base text-stone-900 font-display">
                      Historial de Conversaciones con Fokus
                    </h2>
                    <p className="text-xs text-stone-500 font-sans mt-0.5">
                      Accede a tus sesiones de foco previas y reanuda el diálogo en cualquier momento.
                    </p>
                  </div>

                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white font-mono text-[11px] font-medium transition-colors cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Nueva Sesión</span>
                  </Link>
                </div>

                {loadingConversations ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2 text-stone-500 font-mono text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-[#1c6662]" />
                    <span>Cargando sesiones archivadas...</span>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="py-12 text-center max-w-sm mx-auto space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#1c6662] mx-auto">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-stone-600 font-sans leading-relaxed">
                      No hay conversaciones guardadas aún. Inicia tu primera sesión con el Copiloto para organizar tu jornada.
                    </p>
                    <Link
                      href="/chat"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#1c6662] font-semibold hover:underline"
                    >
                      <span>Ir al Copiloto ahora →</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.map((conv) => (
                      <article
                        key={conv.id}
                        className="bg-white/90 hover:bg-white border border-stone-200/80 hover:border-teal-300 rounded-2xl p-4 transition-all duration-200 shadow-2xs flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>{formatSessionDate(conv.created_at)}</span>
                          </span>
                          <h3 className="font-semibold text-xs text-stone-900 mt-1 truncate font-display">
                            {conv.title || 'Sesión de Foco'}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            href={`/chat?id=${conv.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#1c6662] text-xs font-medium border border-teal-200/80 transition-colors"
                          >
                            <span>Reanudar</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteConversation(conv.id)}
                            disabled={deletingConvId === conv.id}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar sesión"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 3: PREFERENCIAS */}
            {activeTab === 'preferences' && (
              <section className="bg-white/80 backdrop-blur-xl border border-white/85 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="pb-4 border-b border-stone-200/70">
                  <h2 className="font-bold text-base text-stone-900 font-display">
                    Preferencias de Entorno & Productividad
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Personaliza la ubicación del Daily Briefing y los parámetros de trabajo profundo.
                  </p>
                </div>

                {/* Ciudad por Defecto */}
                <div className="space-y-2">
                  <label htmlFor="pref-city" className="text-xs font-mono text-stone-700 block font-medium">
                    Ciudad por Defecto (Clima & Daily Briefing)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="pref-city"
                        type="text"
                        value={defaultCity}
                        onChange={(e) => {
                          setDefaultCity(e.target.value);
                          setCitySaved(false);
                        }}
                        placeholder="Ej. Bogotá, Colombia..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-900 focus:outline-none focus:border-[#1c6662] transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCitySaved(true);
                        setTimeout(() => setCitySaved(false), 2500);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white text-xs font-medium shadow-xs transition-all cursor-pointer font-mono"
                    >
                      {citySaved ? '✓ Guardado' : 'Guardar'}
                    </button>
                  </div>
                </div>

                {/* Atajos Globales */}
                <div className="pt-4 border-t border-stone-200/70 space-y-3">
                  <span className="text-xs font-mono font-medium text-stone-700 block">
                    Atajos Globales Activos
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                      <span className="text-stone-600 font-sans">Nueva Tarea</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-[#1c6662] font-semibold text-[11px]">N</kbd>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                      <span className="text-stone-600 font-sans">Buscador</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-[#1c6662] font-semibold text-[11px]">/</kbd>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                      <span className="text-stone-600 font-sans">Atajos</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-[#1c6662] font-semibold text-[11px]">?</kbd>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column (32% / 4 cols): Status Inspector (No Fake Telemetry) */}
          <aside aria-label="Inspector de estado" className="lg:col-span-4 space-y-4">
            <div className="bg-white/80 backdrop-blur-xl border border-white/85 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-700">
                Resumen del Sistema
              </h3>

              {/* Sessions Stat */}
              <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-stone-500 block">Sesiones Guardadas</span>
                  <span className="font-display font-bold text-lg text-stone-900">
                    {conversations.length}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#1c6662]">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>

              {/* Google Calendar Stat */}
              <div className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-stone-500 block">Google Calendar</span>
                  <span className={`text-xs font-semibold ${integrationStatus?.connected ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {integrationStatus?.connected ? 'Conectado & Verificado' : 'Pendiente de Conexión'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#1c6662]">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/60 text-[11px] text-stone-700 font-sans leading-relaxed">
                <span className="font-semibold text-stone-900 block font-mono text-[11px] text-[#1c6662] mb-1">
                  🛡️ PRIVACIDAD & SEGURIDAD
                </span>
                Tus credenciales y datos de agenda están encriptados a nivel de usuario. Fokus nunca comparte tu calendario con terceros.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
