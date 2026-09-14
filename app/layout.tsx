import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f8fafc',
};

export const metadata: Metadata = {
  title: 'Fokus — Tu Espacio de Crecimiento Personal & Profesional',
  description: 'Organiza tu vida, alcanza tus metas y protege tu tiempo con inteligencia: sincronización con Google Calendar, Matriz de Eisenhower y sesiones de enfoque profundo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
        {children}
      </body>
    </html>
  );
}
