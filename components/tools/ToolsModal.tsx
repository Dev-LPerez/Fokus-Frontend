'use client';

import React, { useEffect, useState } from 'react';
import {
  Wrench,
  X,
  CloudSun,
  CalendarClock,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface ToolInfo {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ToolsModal({ isOpen, onClose }: ToolsModalProps) {
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTools = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/tools`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setTools(data);
        } else if (data && Array.isArray(data.tools)) {
          setTools(data.tools);
        } else {
          setTools([]);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'No se pudieron cargar las herramientas';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [isOpen]);

  if (!isOpen) return null;

  const getToolIcon = (name: string) => {
    const clean = name.toLowerCase();
    if (clean.includes('weather') || clean.includes('clima')) {
      return <CloudSun className="w-4 h-4 text-amber-400" />;
    }
    if (clean.includes('reminder') || clean.includes('recordatorio')) {
      return <CalendarClock className="w-4 h-4 text-emerald-600" />;
    }
    if (clean.includes('search') || clean.includes('buscar')) {
      return <Search className="w-4 h-4 text-sky-600" />;
    }
    return <Sparkles className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-900">Herramientas del Agente</h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Function Calling Schema registrado en FastAPI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-transparent">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs font-mono">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span>Consultando tools registradas en FastAPI...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold">Error de conexión</p>
                <p className="text-slate-600 text-[11px] mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && tools.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No se encontraron herramientas activas.
            </div>
          )}

          {!loading && !error && tools.length > 0 && (
            <div className="grid gap-2.5">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-300 transition-all flex items-start gap-3.5 shadow-2xs"
                >
                  <div className="p-2 rounded-lg bg-white border border-slate-200 flex-shrink-0 mt-0.5">
                    {getToolIcon(tool.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {tool.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        online
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                      {tool.description || 'Sin descripción disponible.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
