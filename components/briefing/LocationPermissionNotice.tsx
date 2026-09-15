'use client';

import React from 'react';
import { MapPinOff, Sparkles, RefreshCw, X, MessageSquareQuote } from 'lucide-react';

interface LocationPermissionNoticeProps {
  onClose: () => void;
  onRequestLocation?: () => void;
  onSetCityPrompt?: (prompt: string) => void;
  compact?: boolean;
}

export function LocationPermissionNotice({
  onClose,
  onRequestLocation,
  onSetCityPrompt,
  compact = false,
}: LocationPermissionNoticeProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-amber-50/90 backdrop-blur-md p-4 text-xs text-amber-900 shadow-2xs animate-fade-in transition-all">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5 shadow-2xs">
          <MapPinOff className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-xs text-amber-950 font-display flex items-center gap-1.5">
              <span>Permiso de ubicación no concedido</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-200/70 border border-amber-300 text-amber-900 font-normal">
                Opcional
              </span>
            </h4>

            <button
              onClick={onClose}
              className="text-amber-700 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-200/60 transition-colors cursor-pointer"
              title="Cerrar aviso"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-amber-900/90 leading-relaxed font-sans text-[11.5px]">
            Fokus solicita tu ubicación <strong>únicamente</strong> para mostrarte el pronóstico meteorológico local en tu Daily Briefing matutino. No rastreamos tus movimientos ni compartimos tu geolocalización.
          </p>

          {!compact && (
            <p className="text-amber-800/90 leading-relaxed font-sans text-[11px] pt-0.5">
              Si prefieres no habilitar la geolocalización del navegador, puedes indicarle tu ciudad directamente a Fokus en cualquier momento (ej. <em>&quot;Vivo en Medellín&quot;</em>) y él la recordará de forma permanente en tu perfil.
            </p>
          )}

          {/* Action pills */}
          <div className="flex items-center gap-2 pt-1.5 flex-wrap">
            {onSetCityPrompt && (
              <button
                type="button"
                onClick={() => onSetCityPrompt('Vivo en ')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] transition-colors cursor-pointer shadow-2xs"
              >
                <MessageSquareQuote className="w-3 h-3" />
                <span>Indicar mi ciudad en el chat</span>
              </button>
            )}

            {onRequestLocation && (
              <button
                type="button"
                onClick={onRequestLocation}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-900 font-medium text-[11px] transition-colors cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3 h-3 text-amber-700" />
                <span>Reintentar permiso</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-amber-800 hover:text-amber-950 underline px-1 py-1 text-[11px] transition-colors cursor-pointer ml-auto"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
