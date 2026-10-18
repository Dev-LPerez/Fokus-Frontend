'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Sparkles,
  Plus,
  Home,
  Compass,
  BookOpen,
  History,
  Briefcase,
  Search,
  Trash2,
  LogOut,
  ChevronLeft,
  Loader2,
  RefreshCw,
  Settings,
  Command,
  Calendar,
} from 'lucide-react';
import { signOut } from '@/app/auth/actions';
import { createClient } from '@/lib/supabase/client';
import { FokusIcon } from '@/components/brand/FokusLogo';

interface ConversationItem {
  id: string;
  title?: string | null;
  created_at: string;
}

interface SidebarProps {
  userEmail?: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ userEmail, isOpen, onToggle }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeConversationId = searchParams.get('id');

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const supabase = createClient();

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      await signOut();
    } catch {
      router.push('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  const fetchConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/conversations`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : data.conversations || []);
      }
    } catch {
      // Ignore background error
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const handleUpdate = () => fetchConversations(true);
    window.addEventListener('conversation_updated', handleUpdate);
    return () => window.removeEventListener('conversation_updated', handleUpdate);
  }, [activeConversationId, pathname]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    setDeletingId(id);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeConversationId === id) {
          router.push('/chat');
        }
      }
    } catch {
      // Ignore error
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (email?: string | null) => {
    if (!email) return 'CO';
    const namePart = email.split('@')[0];
    return namePart.slice(0, 2).toUpperCase();
  };

  const filteredConversations = conversations.filter((c) =>
    (c.title || 'Conversación').toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col h-full bg-[#edece9]/95 md:bg-[#edece9]/70 border-r border-white/70 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 sm:w-68 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0'
        } overflow-hidden`}
      >
        <div className="w-64 sm:w-68 flex flex-col h-full">
          {/* Logo Brand matching official Fokus design */}
          <div className="p-5 pb-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="shadow-md shadow-[#1c6662]/15 group-hover:scale-105 transition-transform rounded-2xl">
                <FokusIcon size={34} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                  Fokus
                </span>
                <span className="text-[11px] text-[#1c6662] font-mono tracking-wider font-semibold">
                  Personal & Pro
                </span>
              </div>
            </Link>

            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors cursor-pointer md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c6662]/30"
              title="Cerrar panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action: Nueva Sesión */}
          <div className="px-4 pt-1 pb-2">
            <Link
              href="/chat"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#1c6662] hover:bg-[#15524f] text-white text-xs font-semibold shadow-xs shadow-[#1c6662]/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c6662]/40"
              title="Iniciar nuevo chat o bloque"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Sesión de Foco</span>
            </Link>
          </div>

          {/* Quick Search Input with ⌘K badge */}
          <div className="px-4 py-1.5">
            <div className="relative flex items-center bg-white/80 border border-white/90 rounded-xl px-3 py-1.5 shadow-2xs focus-within:border-[#1c6662]/50 focus-within:ring-2 focus-within:ring-[#1c6662]/10 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Buscar sesión..."
                aria-label="Buscar en historial"
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-sans"
              />
              <span className="text-[11px] font-mono text-slate-400 bg-white/70 px-1 py-0.5 rounded border border-white/80 ml-1">
                ⌘K
              </span>
            </div>
          </div>

          {/* Core Navigation Items */}
          <nav className="px-3 py-2 space-y-1 font-sans">
            <Link
              href="/chat"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                pathname === '/chat' && !activeConversationId
                  ? 'bg-white/95 text-[#1c6662] font-semibold shadow-2xs border border-white/95'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-4 h-4 ${pathname === '/chat' && !activeConversationId ? 'text-[#1c6662]' : 'text-slate-400'}`} />
                <span>Copiloto</span>
              </div>
              {pathname === '/chat' && !activeConversationId && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c6662]" />
              )}
            </Link>

            <Link
              href="/calendar"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                pathname === '/calendar'
                  ? 'bg-white/95 text-[#1c6662] font-semibold shadow-2xs border border-white/95'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={`w-4 h-4 ${pathname === '/calendar' ? 'text-[#1c6662]' : 'text-slate-400'}`} />
                <span>Calendario & Deep Work</span>
              </div>
              {pathname === '/calendar' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c6662]" />
              )}
            </Link>

            <Link
              href="/projects"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                pathname === '/projects'
                  ? 'bg-white/95 text-[#1c6662] font-semibold shadow-2xs border border-white/95'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className={`w-4 h-4 ${pathname === '/projects' ? 'text-[#1c6662]' : 'text-slate-400'}`} />
                <span>Proyectos & Matriz</span>
              </div>
              {pathname === '/projects' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c6662]" />
              )}
            </Link>

            <Link
              href="/conversations"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                pathname === '/conversations'
                  ? 'bg-white/95 text-[#1c6662] font-semibold shadow-2xs border border-white/95'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className={`w-4 h-4 ${pathname === '/conversations' ? 'text-[#1c6662]' : 'text-slate-400'}`} />
                <span>Historial de Sesiones</span>
              </div>
              {pathname === '/conversations' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c6662]" />
              )}
            </Link>
          </nav>

          {/* Chronological Section Titles (Recientes) */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-400 px-2 block mb-1.5">
                Sesiones Recientes
              </span>

              {loading && conversations.length === 0 && (
                <div className="py-3 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin text-[#1c6662]" />
                  <span>Cargando...</span>
                </div>
              )}

              {filteredConversations.length === 0 && !loading && (
                <p className="text-[11px] text-slate-400 px-2 py-2 italic font-sans">
                  Sin sesiones previas
                </p>
              )}

              <div className="space-y-0.5">
                {filteredConversations.slice(0, 10).map((conv) => {
                  const isActive = activeConversationId === conv.id;
                  return (
                    <Link
                      key={conv.id}
                      href={`/chat?id=${conv.id}`}
                      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-white/90 text-[#1c6662] font-semibold shadow-2xs border border-white/95'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <span className="truncate pr-1">
                        {conv.title || 'Sesión en Fokus'}
                      </span>

                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        disabled={deletingId === conv.id}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 rounded transition-opacity cursor-pointer focus-visible:opacity-100"
                        title="Eliminar sesión"
                        aria-label="Eliminar sesión"
                      >
                        {deletingId === conv.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User Profile Pill Card at bottom */}
          <div className="p-3 border-t border-white/60 bg-white/40 backdrop-blur-md">
            <div className="p-2.5 rounded-2xl bg-white/85 border border-white/90 shadow-2xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1c6662] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs font-display">
                  {getInitials(userEmail)}
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-semibold text-slate-800 truncate" title={userEmail || ''}>
                    {userEmail ? (userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)) : 'Usuario'}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {userEmail || 'Sesión activa'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href="/settings"
                  className="p-1.5 text-slate-400 hover:text-[#1c6662] rounded-lg hover:bg-white/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c6662]/30"
                  title="Ajustes de cuenta"
                  aria-label="Ajustes de cuenta"
                >
                  <Settings className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/80 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  {isSigningOut ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
