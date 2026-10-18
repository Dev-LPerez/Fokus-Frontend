'use client';

import React from 'react';
import { Trash2, RotateCcw } from 'lucide-react';

interface UndoToastProps {
  description: string;
  onUndo: () => void;
}

export function UndoToast({ description, onUndo }: UndoToastProps) {
  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-2xl border border-rose-200/90 px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-4 text-xs animate-fade-in text-stone-800"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </div>
        <div className="text-stone-700">
          <span className="font-semibold text-stone-900 font-sans">Tarea eliminada: </span>
          <span className="italic truncate max-w-[200px] inline-block align-bottom font-sans">
            &quot;{description}&quot;
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onUndo}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs ml-2"
      >
        <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
        <span>Deshacer (5s)</span>
      </button>
    </aside>
  );
}
