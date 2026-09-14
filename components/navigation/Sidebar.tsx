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
        className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col h-full bg-[#f8fafc]/90 border-r border-slate-200/70 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 sm:w-68 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0'
        } overflow-hidden`}
      >
        <div className="w-64 sm:w-68 flex flex-col h-full">
          {/* Logo Brand matching official Fokus design */}
          <div className="p-5 pb-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform rounded-2xl">
                <FokusIcon size={34} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                  Fokus
                </span>
                <span className="text-[10px] text-[#0F766E] font-mono tracking-wider font-semibold">
                  Personal & Pro
                </span>
              </div>
            </Link>

            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer md:hidden"
              title="Cerrar panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Input with ⌘K badge */}
          <div className="px-4 py-2">
            <div className="relative flex items-center bg-white border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-2xs focus-within:border-indigo-500/60 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Buscar..."
                aria-label="Buscar en historial"
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded border border-slate-200/60 ml-1">
                ⌘K
              </span>
            </div>
          </div>

          {/* Core Navigation Items (Clean minimal list matching image.png) */}
          <nav className="px-3 py-2 space-y-0.5 font-sans">
            <Link
              href="/chat"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === '/chat' && !activeConversationId
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Home className={`w-4 h-4 ${pathname === '/chat' && !activeConversationId ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Copiloto</span>
            </Link>

            <Link
              href="/calendar"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === '/calendar'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Calendar className={`w-4 h-4 ${pathname === '/calendar' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Calendario & Agenda</span>
            </Link>

            <Link
              href="/projects"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === '/projects'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Briefcase className={`w-4 h-4 ${pathname === '/projects' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Proyectos & Matriz</span>
            </Link>

            <Link
              href="/conversations"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === '/conversations'
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <History className={`w-4 h-4 ${pathname === '/conversations' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Historial Completo</span>
            </Link>
          </nav>

          {/* Chronological Section Titles (Tomorrow / 7 Days Ago matching image.png) */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <div>
              <span className="text-[11px] font-medium text-slate-400 px-2 block mb-1.5 font-sans">
                Recientes
              </span>

              {loading && conversations.length === 0 && (
                <div className="py-3 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                  <span>Cargando...</span>
                </div>
              )}

              {filteredConversations.length === 0 && !loading && (
                <p className="text-[11px] text-slate-400 px-2 py-2 italic">
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
                          ? 'bg-white text-indigo-900 font-semibold shadow-2xs border border-slate-200/80'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                      }`}
                    >
                      <span className="truncate pr-1">
                        {conv.title || 'Nueva sesión en Fokus'}
                      </span>

                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        disabled={deletingId === conv.id}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 rounded transition-opacity cursor-pointer"
                        title="Eliminar sesión"
                        aria-label="Eliminar sesión"
                      >
                        {deletingId === conv.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
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

          {/* User Profile Pill Card at bottom matching image.png */}
          <div className="p-3 border-t border-slate-200/60 bg-white/40">
            <div className="p-2 rounded-2xl bg-white border border-slate-200/70 shadow-2xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  {getInitials(userEmail)}
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="text-xs font-semibold text-slate-800 truncate" title={userEmail || ''}>
                    {userEmail ? (userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)) : 'Usuario'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {userEmail || 'Sesión activa'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href="/settings"
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Ajustes de cuenta"
                  aria-label="Ajustes de cuenta"
                >
                  <Settings className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
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
