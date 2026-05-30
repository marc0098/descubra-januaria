"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/admin/context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  Bed, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  LogOut,
  Menu,
  X,
  Database,
  Loader2,
  Settings,
  Mountain
} from 'lucide-react';

const menuItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
  { to: '/admin/guias', icon: Users, label: 'Guias' },
  { to: '/admin/gastronomia', icon: UtensilsCrossed, label: 'Restaurantes' },
  { to: '/admin/hoteis', icon: Bed, label: 'Hotéis' },
  { to: '/admin/eventos', icon: Calendar, label: 'Eventos' },
  { to: '/admin/pontos', icon: MapPin, label: 'Pontos' },
  { to: '/admin/cavernas', icon: Mountain, label: 'Cavernas' },
  { to: '/admin/banners', icon: ImageIcon, label: 'Banners' },
  { to: '/admin/migracao', icon: Database, label: 'Migração' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, loading, pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const isActive = (to: string) => {
    if (to === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(to);
  };

  // Se for a tela de login, não renderiza o layout administrativo
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null; // Evita piscar conteúdo administrativo antes do redirecionamento
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-800 flex flex-col">
          <Link href="/" className="font-headline text-lg font-bold hover:text-secondary transition-colors mb-2">
            Descubra Januária
          </Link>
          <div className="h-px bg-gray-800 my-2" />
          <h1 className="text-xl font-bold">Painel Admin</h1>
          <p className="text-xs text-gray-400 mt-1 truncate" title={user.email || ''}>{user.email}</p>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-sans text-sm
                  ${active 
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/20' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-gray-800 transition-colors font-sans text-sm font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white dark:bg-zinc-900 shadow-sm p-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <Menu className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">Admin Januária</span>
          <div className="w-10" />
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 md:p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
