"use client";

import React, { useState } from 'react';
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
  Image, 
  LogOut,
  Menu,
  X,
  Database
} from 'lucide-react';

const menuItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/guias', icon: Users, label: 'Guias' },
  { to: '/admin/gastronomia', icon: UtensilsCrossed, label: 'Restaurantes' },
  { to: '/admin/hoteis', icon: Bed, label: 'Hotéis' },
  { to: '/admin/eventos', icon: Calendar, label: 'Eventos' },
  { to: '/admin/pontos', icon: MapPin, label: 'Pontos' },
  { to: '/admin/banners', icon: Image, label: 'Banners' },
  { to: '/admin/migracao', icon: Database, label: 'Migração' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return pathname === to;
    return pathname?.startsWith(to);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Januária</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.to, item.exact) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
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
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">Admin Januária</span>
          <div className="w-10" />
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
