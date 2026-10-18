'use client';

import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-shortcuts-title"
      className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white/95 backdrop-blur-2xl border border-white/90 rounded-3xl w-full max-w-sm shadow-2xl p-5 space-y-4 animate-fade-in text-stone-800">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-[#1c6662]">
              <Keyboard className="w-3.5 h-3.5" />
            </div>
            <h3 id="modal-shortcuts-title" className="font-bold text-sm font-display text-stone-900">
              Atajos de Teclado
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-600 font-sans">Nueva Tarea</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200 text-[#1c6662] font-semibold text-[11px]">
              N
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-600 font-sans">Buscar compromisos</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200 text-[#1c6662] font-semibold text-[11px]">
              /
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-600 font-sans">Cerrar modal / Limpiar</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200 text-[#1c6662] font-semibold text-[11px]">
              Esc
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-stone-600 font-sans">Ver este menú de atajos</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200 text-[#1c6662] font-semibold text-[11px]">
              ?
            </kbd>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#1c6662] hover:bg-[#154f4c] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
