import React from 'react';

interface FokusLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'color' | 'monochrome' | 'inverted';
  showText?: boolean;
  showTagline?: boolean;
}

/**
 * Fokus Official Brand Icon & Logotype
 * Basado fielmente en el concepto visual fokus_logo_concept.svg:
 * - Isotipo de precisión de enfoque: 4 marcas angulares en las esquinas + punto focal central (#F59E0B / ámbar)
 * - Contenedor con radio de curvatura ergonómico y tono Teal profundo (#0F766E)
 */
export function FokusIcon({
  size = 32,
  className = '',
  variant = 'color',
}: {
  size?: number | string;
  className?: string;
  variant?: 'color' | 'monochrome' | 'inverted';
}) {
  const isMonochrome = variant === 'monochrome';
  const isInverted = variant === 'inverted';

  // Base background & strokes matching fokus_logo_concept.svg
  const bgColor = isMonochrome
    ? 'rgba(15, 23, 42, 0.06)'
    : isInverted
    ? 'rgba(255, 255, 255, 0.12)'
    : '#0F766E';

  const strokeColor = isMonochrome
    ? '#0F172A'
    : isInverted
    ? '#FFFFFF'
    : '#FFFFFF';

  const dotColor = isMonochrome
    ? '#0F172A'
    : '#F59E0B';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      aria-label="Fokus Logo Icon"
      role="img"
    >
      {/* Background Rounded Container (rx=26 matching concept) */}
      <rect
        x="0"
        y="0"
        width="110"
        height="110"
        rx="26"
        fill={bgColor}
      />

      {/* Top-Left Focus Corner */}
      <path
        d="M20 36 L20 20 L36 20"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top-Right Focus Corner */}
      <path
        d="M74 20 L90 20 L90 36"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom-Left Focus Corner */}
      <path
        d="M20 74 L20 90 L36 90"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom-Right Focus Corner */}
      <path
        d="M90 74 L90 90 L74 90"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Focus Dot */}
      <circle
        cx="55"
        cy="55"
        r="9.5"
        fill={dotColor}
      />
    </svg>
  );
}

/**
 * Logotipo Completo (Icono + Tipografía Fokus + Tagline opcional)
 */
export function FokusLogo({
  size = 36,
  className = '',
  variant = 'color',
  showText = true,
  showTagline = false,
}: FokusLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <FokusIcon size={size} variant={variant} />

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-base sm:text-lg tracking-tight leading-none text-slate-900 dark:text-white">
            Fokus
          </span>
          {showTagline ? (
            <span className="text-[11px] text-slate-500 font-sans mt-0.5 leading-none">
              Tu agenda. Tu tiempo. Tu enfoque.
            </span>
          ) : (
            <span className="text-[10px] text-[#0F766E] font-mono font-semibold tracking-wider mt-0.5 leading-none">
              Personal & Pro
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default FokusLogo;
