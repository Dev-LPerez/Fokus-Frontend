import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { FokusLogo } from '@/components/brand/FokusLogo';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, RefreshCw, Scale, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Condiciones del Servicio — Fokus',
  description: 'Términos y condiciones de uso de la plataforma Fokus.',
};

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
            Acuerdo Legal
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Condiciones del Servicio
          </h1>
          <p className="text-sm text-slate-500 font-mono">
            Última actualización: Septiembre 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />
              <span>1.</span> Aceptación de los Términos
            </h2>
            <p>
              Al registrarte o utilizar la plataforma <strong>Fokus</strong> en{' '}
              <a href="https://fokus.lgperez.dev" className="text-[#0F766E] underline">
                https://fokus.lgperez.dev
              </a>
              , aceptas cumplir y estar sujeto a las presentes Condiciones del Servicio y a nuestra{' '}
              <Link href="/privacy" className="text-[#0F766E] underline font-medium">
                Política de Privacidad
              </Link>
              . Si no estás de acuerdo con alguna de estas cláusulas, no debes acceder ni utilizar el servicio.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#0F766E]" />
              <span>2.</span> Descripción del Servicio
            </h2>
            <p>
              Fokus es una aplicación web de asistencia inteligente para la gestión del tiempo, organización de proyectos,
              priorización de tareas bajo la Matriz de Eisenhower y sincronización de sesiones de enfoque profundo (*Deep Work*)
              integradas con calendarios digitales y proveedores de productividad.
            </p>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#0F766E]" />
              <span>3.</span> Cuentas y Servicios de Terceros
            </h2>
            <p>
              Para acceder a ciertas funciones avanzadas, puedes vincular tu cuenta con servicios de terceros, tales como Google
              (mediante autenticación OAuth 2.0 y Google Calendar API):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Eres responsable de mantener la seguridad y confidencialidad de tus credenciales de inicio de sesión.</li>
              <li>El uso de integraciones de terceros está sujeto a las políticas y términos de servicio de los respectivos proveedores.</li>
              <li>Puedes desvincular estas conexiones en cualquier momento sin penalización alguna.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>4.</span> Uso Aceptable
            </h2>
            <p>
              Te comprometes a utilizar Fokus únicamente con fines lícitos y personales o profesionales legítimos. Queda terminantemente prohibido:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Intentar vulnerar, descompilar, realizar ingeniería inversa o interrumpir la infraestructura tecnológica del servicio.</li>
              <li>Utilizar el servicio para el envío de spam, ataques automatizados o scraping no autorizado.</li>
              <li>Alojar contenido ilícito, difamatorio o que infrinja los derechos de propiedad intelectual de terceros.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#0F766E]" />
              <span>5.</span> Limitación de Responsabilidad y Garantías
            </h2>
            <p>
              Fokus se proporciona &ldquo;tal cual&rdquo; (&ldquo;as is&rdquo;) y &ldquo;según disponibilidad&rdquo;. Aunque nos esforzamos al máximo por
              garantizar la alta disponibilidad y precisión de los cálculos de disponibilidad y agendamiento, no garantizamos
              que el servicio sea completamente ininterrumpido ni libre de errores imprevistos.
            </p>
          </section>

          {/* Section 6 */}
          <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
              <span>6.</span> Modificaciones del Servicio
            </h2>
            <p>
              Nos reservamos el derecho de actualizar, modificar o discontinuar funciones del servicio en cualquier momento con el fin
              de mejorar la experiencia del usuario o adaptarnos a nuevas normativas legales y técnicas.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Fokus. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-800 transition-colors underline">
              Política de Privacidad
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
