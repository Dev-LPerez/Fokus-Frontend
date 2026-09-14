import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FokusLogo } from '@/components/brand/FokusLogo';
import { ArrowLeft, ShieldCheck, Lock, Calendar, EyeOff, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Fokus',
  description: 'Política de privacidad de Fokus: cómo recopilamos, usamos y protegemos tus datos, incluyendo el acceso a Google Calendar.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <FokusLogo size={32} showTagline={false} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#0F766E] hover:text-[#0d645e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Fokus
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Transparencia y Privacidad
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-sm text-slate-500 font-mono">
            Última actualización: Septiembre 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <span>1.</span> Introducción e Identidad
            </h2>
            <p>
              Bienvenido a <strong>Fokus</strong> (accesible desde{' '}
              <a href="https://fokus.lgperez.dev" className="text-[#0F766E] underline">
                https://fokus.lgperez.dev
              </a>
              ), un copiloto inteligente de crecimiento personal y gestión del tiempo desarrollado por LPerez Dev.
              Esta Política de Privacidad describe de manera transparente cómo tratamos la información que recopilamos
              cuando utilizas nuestra plataforma web y nuestras integraciones oficiales.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0F766E]" />
              <span>2.</span> Datos que recopilamos
            </h2>
            <p>
              Fokus recopila únicamente los datos estrictamente necesarios para ofrecerte las funciones de organización,
              bloques de concentración (*Deep Work*) y agenda interactiva:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Datos de Autenticación de Cuenta:</strong> Tu nombre, correo electrónico y foto de perfil
                proporcionados al iniciar sesión mediante nuestro proveedor de autenticación seguro (Supabase Auth y Google Sign-In).
              </li>
              <li>
                <strong>Datos de Google Calendar (mediante OAuth 2.0):</strong> Si decides conectar tu calendario de Google,
                solicitamos acceso para leer tus eventos programados (para auditar disponibilidad y evitar colisiones)
                y crear eventos de sesiones de trabajo (*Deep Work*) solicitados explícitamente por ti.
              </li>
              <li>
                <strong>Tareas y Metas de Enfoque:</strong> Los títulos de tareas, prioridades (Matriz de Eisenhower) y notas
                que guardas dentro del tablero de proyectos.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-amber-600" />
              <span>3.</span> Cómo usamos tu información y no-venta de datos
            </h2>
            <p>
              Utilizamos tu información exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Identificar tu cuenta de usuario de manera segura mediante tokens cifrados.</li>
              <li>Calcular huecos de tiempo libre y sugerir bloques de productividad sin interrumpir compromisos previos.</li>
              <li>Crear eventos en tu Google Calendar cuando le pides al asistente agendar una sesión de trabajo.</li>
            </ul>
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-sm font-medium mt-3">
              <strong>Compromiso inquebrantable:</strong> Fokus <u>nunca</u> vende, alquila, comercializa ni transfiere tus datos
              personales ni la información de tu calendario a intermediarios, empresas de publicidad ni a terceros con fines comerciales.
            </div>
          </section>

          {/* Section 4 - Google API Disclosure */}
          <section className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>4.</span> Cumplimiento de la Política de Datos de Usuario de las APIs de Google
            </h2>
            <p className="text-emerald-950 font-medium text-sm sm:text-base">
              El uso y la transferencia que Fokus realiza a cualquier otra aplicación de la información recibida a través de las APIs de Google se ajusta estrictamente a la{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline font-semibold"
              >
                Política de Datos de Usuario de los Servicios de API de Google (Google API Services User Data Policy)
              </a>
              , incluidos los requisitos de <strong>Uso Limitado (Limited Use)</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-emerald-900">
              <li>No utilizamos los datos de las APIs de Google para entrenar modelos de inteligencia artificial generalizados.</li>
              <li>El acceso a Google Calendar se limita a las acciones expresamente solicitadas por el usuario en la interfaz.</li>
              <li>Ningún humano lee tus datos de calendario privados a menos que tengamos tu consentimiento expreso o sea requerido por ley.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0F766E]" />
              <span>5.</span> Seguridad y Almacenamiento
            </h2>
            <p>
              Implementamos protocolos rigurosos de seguridad para proteger tu información:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Todas las comunicaciones viajan a través de canales cifrados HTTPS/TLS.</li>
              <li>Los tokens de acceso y credenciales de OAuth están protegidos con mecanismos de aislamiento multiusuario y cifrado seguro en base de datos PostgreSQL.</li>
              <li>Las sesiones son gestionadas con cookies seguras (HttpOnly, SameSite).</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#0F766E]" />
              <span>6.</span> Tus derechos y revocación de permisos
            </h2>
            <p>
              Eres el único dueño de tus datos. En cualquier momento puedes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>
                <strong>Revocar el acceso de Google Calendar:</strong> Puedes desvincular la integración desde los ajustes de Fokus o en cualquier momento desde la página de seguridad de Google en{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0F766E] underline"
                >
                  myaccount.google.com/permissions
                </a>
                .
              </li>
              <li>
                <strong>Eliminar tus datos:</strong> Puedes solicitar la eliminación definitiva de tu cuenta y todos los registros asociados escribiéndonos directamente.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#0F766E]" />
              <span>7.</span> Contacto y Consultas
            </h2>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad o el tratamiento de tus datos, puedes ponerte en contacto con el equipo de Fokus:
            </p>
            <p className="text-sm font-mono text-slate-600 bg-slate-100 p-3 rounded-lg">
              Sitio web:{' '}
              <a href="https://fokus.lgperez.dev" className="text-[#0F766E] underline">
                https://fokus.lgperez.dev
              </a>
              <br />
              Desarrollador:{' '}
              <a href="https://github.com/Dev-LPerez" className="text-[#0F766E] underline">
                Dev-LPerez
              </a>
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Fokus. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-slate-800 transition-colors underline">
              Condiciones del Servicio
            </Link>
            <Link href="/login" className="hover:text-slate-800 transition-colors underline">
              Iniciar Sesión
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
