'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface AuthActionResult {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function signIn(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor, ingresa tu correo y contraseña.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Credenciales inválidas. Verifica tu correo y contraseña.' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Debes confirmar tu correo electrónico antes de iniciar sesión.' };
    }
    return { error: error.message || 'Error al iniciar sesión.' };
  }

  revalidatePath('/', 'layout');
  redirect('/chat');
}

export async function signUp(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password) {
    return { error: 'Por favor, completa todos los campos requeridos.' };
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (
      error.message.toLowerCase().includes('already registered') ||
      error.message.toLowerCase().includes('already exists')
    ) {
      return { error: 'Este correo ya se encuentra registrado.' };
    }
    return { error: error.message || 'Error al registrar la cuenta.' };
  }

  if (data.user && !data.session) {
    return {
      success: true,
      message:
        'Registro exitoso. Se ha enviado un enlace de confirmación a tu correo. Por favor confírmalo antes de iniciar sesión.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/chat');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
