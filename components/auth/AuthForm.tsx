'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Bot, Mail, Lock, AlertCircle, CheckCircle2, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { AuthActionResult } from '@/app/auth/actions';

interface AuthFormProps {
  mode: 'login' | 'register';
  action: (_prevState: AuthActionResult | null, formData: FormData) => Promise<AuthActionResult>;
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';

  return (
    <div className="w-full max-w-sm p-7 bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400 mb-3 shadow-sm">
          <Bot className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-1.5">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          {isLogin
            ? 'Accede para interactuar con tu Agente de IA'
            : 'Crea tu cuenta para comenzar a chatear'}
        </p>
      </div>

      {state?.error && (
        <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-red-300/80 mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      {state?.success && state?.message && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
          <div>
            <p className="font-semibold">¡Cuenta creada!</p>
            <p className="text-emerald-300/80 mt-0.5">{state.message}</p>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1" htmlFor="email">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
              className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/30 transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1" htmlFor="password">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              className="w-full pl-9 pr-9 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/30 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/30 transition-all font-mono"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isLogin ? 'Ingresando...' : 'Creando cuenta...'}</span>
            </>
          ) : (
            <>
              <span>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
        {isLogin ? (
          <p>
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="text-zinc-200 hover:text-white font-semibold underline underline-offset-2 transition-colors"
            >
              Regístrate
            </Link>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-zinc-200 hover:text-white font-semibold underline underline-offset-2 transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
