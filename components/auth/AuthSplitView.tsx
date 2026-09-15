'use client';

import React, { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  CalendarCheck2,
  BrainCircuit,
  Target,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { signIn, signUp, AuthActionResult } from '@/app/auth/actions';
import { FokusIcon } from '@/components/brand/FokusLogo';
import { createClient } from '@/lib/supabase/client';

export function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

interface AuthSplitViewProps {
  initialMode?: 'login' | 'register';
}

export function AuthSplitView({ initialMode = 'login' }: AuthSplitViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const isLogin = mode === 'login';

  const [loginState, loginFormAction, isLoginPending] = useActionState(signIn, null);
  const [registerState, registerFormAction, isRegisterPending] = useActionState(signUp, null);

  const activeState = isLogin ? loginState : registerState;
  const activeFormAction = isLogin ? loginFormAction : registerFormAction;
  const isPending = isLogin ? isLoginPending : isRegisterPending;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('error') === 'oauth_failed') {
        setGoogleError('No se pudo completar el inicio de sesión con Google. Inténtalo de nuevo.');
      }
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setGoogleError(null);
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/chat`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setGoogleError(error.message);
        setIsGoogleLoading(false);
      }
    } catch {
      setGoogleError('Error de conexión al iniciar sesión con Google.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#f8fafc] text-slate-800 relative overflow-hidden selection:bg-indigo-500/20 selection:text-indigo-900 font-sans">
      {/* Luminous Ambient Gradients matching /chat & AppLayout */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar with Mobile Safe Padding */}
      <header className="h-16 px-4 sm:px-8 lg:px-10 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between z-20 relative">
        <Link href="/" className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 rounded-xl p-1">
          <div className="shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform rounded-2xl">
            <FokusIcon size={32} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
              Fokus
            </span>
            <span className="text-xs text-[#0F766E] font-mono tracking-wider font-semibold mt-0.5">
              Personal & Pro
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="min-h-[38px] text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 shadow-2xs transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
          >
            <span>Conoce Fokus</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </header>

      {/* Central Content Canvas with Fluid Responsive Padding */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 xl:p-12 relative z-10 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: Product Showcase matching /chat Empty State & DeepWork Cards */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 text-slate-700 text-xs font-medium shadow-2xs backdrop-blur-md w-fit">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Tu compañero inteligente de crecimiento</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-bold text-3xl xl:text-4xl text-slate-900 tracking-tight leading-tight">
                ¿Qué meta impulsamos <span className="text-indigo-600">hoy?</span>
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                Organiza tu agenda con intencionalidad, blinda momentos de concentración profunda en Google Calendar y avanza en tus proyectos clave sin abrumarte.
              </p>
            </div>

            {/* Feature Cards matching /chat suggestions & cards */}
            <div className="space-y-3 pt-2 max-w-lg">
              {/* Card 1: Deep Work */}
              <div className="p-3.5 bg-white/85 hover:bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-3.5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">Bloques de Deep Work</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">
                      Google Calendar
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Reserva 90 min de concentración sin interrupciones
                  </p>
                </div>
              </div>

              {/* Card 2: Eisenhower Matrix & Balance */}
              <div className="p-3.5 bg-white/85 hover:bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-3.5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200/60 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">Matriz de Prioridades</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-medium">
                      Eisenhower 2x2
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Separa lo crítico de lo urgente y equilibra tu vida diaria
                  </p>
                </div>
              </div>

              {/* Card 3: Morning Executive Briefing */}
              <div className="p-3.5 bg-white/85 hover:bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center gap-3.5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">Daily Briefing con Audio</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">
                      Sincronizado
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Clima, reuniones matutinas y síntesis de voz en tu inicio
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture / Privacy footer badge */}
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 font-mono">
              <div className="flex items-center gap-1.5 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Supabase Auth JWT</span>
              </div>
              <span>·</span>
              <span>Tokens Cifrados</span>
              <span>·</span>
              <span>Next.js 15 & FastAPI</span>
            </div>
          </div>

          {/* Right Side: Clean Liquid Glass Authentication Card */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 relative">
              {/* Pill Switcher with 44px min touch targets */}
              <div className="p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 grid grid-cols-2 gap-1 text-xs font-semibold mb-6">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`min-h-[40px] py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center ${
                    isLogin
                      ? 'bg-white text-indigo-700 font-bold shadow-xs border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`min-h-[40px] py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center ${
                    !isLogin
                      ? 'bg-white text-indigo-700 font-bold shadow-xs border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Title & Description */}
              <div className="mb-6 space-y-1">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  {isLogin ? 'Acceso a tu espacio Fokus' : 'Crea tu cuenta en Fokus'}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isLogin
                    ? 'Ingresa tus credenciales para retomar tus bloques de enfoque.'
                    : 'Configura tu acceso para potenciar tu productividad y bienestar.'}
                </p>
              </div>

              {/* Alerts: Error */}
              {googleError && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-2xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <p className="font-semibold text-rose-900">Google OAuth</p>
                    <p className="text-rose-700 mt-0.5 leading-relaxed">{googleError}</p>
                  </div>
                </div>
              )}

              {activeState?.error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-2xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <p className="font-semibold text-rose-900">Atención</p>
                    <p className="text-rose-700 mt-0.5 leading-relaxed">{activeState.error}</p>
                  </div>
                </div>
              )}

              {/* Alerts: Success */}
              {activeState?.success && activeState?.message && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-900">¡Registro exitoso!</p>
                    <p className="text-emerald-700 mt-0.5 leading-relaxed">{activeState.message}</p>
                  </div>
                </div>
              )}

              {/* Google OAuth Button */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-2xl shadow-2xs flex items-center justify-center gap-3 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      <span className="text-slate-500">Conectando con Google...</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{isLogin ? 'Continuar con Google' : 'Registrarse con Google'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Elegant Divider */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/80" />
                </div>
                <div className="relative bg-white/95 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  o con correo
                </div>
              </div>

              {/* Form Element with iOS 16px font-size protection to avoid Safari zoom */}
              <form key={mode} action={activeFormAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="tu@email.com"
                      className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700" htmlFor="password">
                      Contraseña
                    </label>
                    {isLogin && (
                      <span className="text-[11px] text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer font-medium p-1">
                        ¿Olvidaste tu contraseña?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      placeholder="••••••••"
                      className="w-full min-h-[44px] pl-10 pr-12 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 pl-2 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer min-h-[44px]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="confirmPassword">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full min-h-[44px] pl-10 pr-12 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full min-h-[48px] mt-3 py-3 px-4 bg-gradient-to-r from-[#0F766E] via-teal-600 to-emerald-600 hover:brightness-105 text-white text-sm font-semibold rounded-2xl shadow-md shadow-teal-900/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Entrar a Fokus' : 'Comenzar ahora'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-slate-400">
                    Al continuar, aceptas nuestras{' '}
                    <Link href="/terms" className="text-slate-600 hover:text-slate-900 underline">
                      Condiciones
                    </Link>{' '}
                    y{' '}
                    <Link href="/privacy" className="text-slate-600 hover:text-slate-900 underline">
                      Privacidad
                    </Link>.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>

      {/* Bottom Legal / Navigation Bar */}
      <footer className="py-4 px-6 text-xs text-slate-500 border-t border-slate-200/60 bg-white/40 backdrop-blur-xs relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            ← Volver a la página de bienvenida de Fokus
          </Link>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-slate-800 transition-colors underline">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="hover:text-slate-800 transition-colors underline">
              Condiciones del Servicio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
