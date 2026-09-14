'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Info,
  LogOut,
} from 'lucide-react';
import { signOut } from '@/app/auth/actions';

interface IntegrationStatus {
  connected: boolean;
  email?: string | null;
  account?: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

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
      
      // Support various backend payload formats:
      // { connected: true, email: '...' }
      // { google_calendar: { connected: true, email: '...' } }
      // { google: { connected: true, email: '...' } }
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
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor';
      // Default to disconnected if status endpoint fails
      setIntegrationStatus({ connected: false });
      console.error('Error fetching integration status:', msg);
    } finally {
      setLoadingStatus(false);
    }
  }, [supabase, router]);

  // Handle query param callbacks from backend OAuth redirect
  useEffect(() => {
    const googleParam = searchParams.get('google');
    const errorParam = searchParams.get('error');

    if (googleParam === 'connected') {
      setFeedback({
        type: 'success',
        message: '¡Google Calendar se ha conectado correctamente!',
      });
      // Clean query parameter from URL
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
  }, [searchParams, fetchStatus]);

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

      // Redirect user to Google OAuth consent screen
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

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-y-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-2xs">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-display">
              Configuración y Perfil
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Administra tu información de cuenta y las integraciones con servicios externos
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loadingStatus}
          className="self-start sm:self-auto p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2 text-xs font-medium cursor-pointer shadow-2xs"
          title="Recargar estado"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin text-indigo-600' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>

      {/* Notifications / Alerts */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}
        >
          {feedback.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
          )}
          {feedback.type === 'error' && (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
          )}
          {feedback.type === 'info' && (
            <Info className="w-4 h-4 flex-shrink-0 text-indigo-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold capitalize">{feedback.type === 'info' ? 'Aviso' : feedback.type}</p>
            <p className="mt-0.5 opacity-90">{feedback.message}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 font-mono ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* User Account Card */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Cuenta de Usuario</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <span className="text-xs text-slate-500">Correo electrónico registrado:</span>
            {loadingUser ? (
              <div className="flex items-center gap-2 mt-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500 font-mono">Cargando sesión...</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900 font-mono mt-0.5">
                {userEmail || 'No disponible'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sesión activa</span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
              ) : (
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>{isSigningOut ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            <Link2 className="w-4 h-4 text-indigo-600" />
            <span>Integraciones Externas</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            OAuth 2.0
          </span>
        </div>

        {/* Google Calendar Card */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-bold text-slate-900 font-display">Google Calendar</h3>
                  {loadingStatus ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                      <span>verificando...</span>
                    </span>
                  ) : integrationStatus?.connected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Conectado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-500 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      No conectado
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                  Sincroniza tu agenda para que Fokus pueda auditar tus huecos libres y blindar sesiones de Deep Work directamente en tu calendario.
                </p>

                {integrationStatus?.connected && integrationStatus?.email && (
                  <p className="text-xs text-indigo-600 font-mono mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Vinculado a: {integrationStatus.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:self-center">
              {loadingStatus ? (
                <div className="px-4 py-2 text-xs text-slate-500 font-mono flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Cargando...</span>
                </div>
              ) : integrationStatus?.connected ? (
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {disconnecting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Desconectando...</span>
                    </>
                  ) : (
                    <>
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Desconectar</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:brightness-105 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Redirigiendo a Google...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Conectar Google Calendar</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
