import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fafbfc]">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 mb-4 shadow-2xs">
        <Compass className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
        Página no encontrada
      </h2>
      <p className="text-sm text-slate-500 max-w-sm mt-2 font-sans">
        El recurso o página a la que intentas acceder no existe o fue movido.
      </p>
      <Link
        href="/chat"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Fokus</span>
      </Link>
    </div>
  );
}
