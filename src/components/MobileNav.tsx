import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Mountain, Utensils, Compass, Bed, Calendar, MapPin } from 'lucide-react';

const navItems = [
  { id: 'cavernas', label: 'Cavernas', icon: Mountain, path: '/cavernas', color: '#8B4513' },
  { id: 'pontos', label: 'Pontos', icon: MapPin, path: '/pontos', color: '#136862' },
  { id: 'guias', label: 'Guias', icon: Compass, path: '/guias', color: '#1565C0' },
  { id: 'estadias', label: 'Hotéis', icon: Bed, path: '/estadias', color: '#C9A227' },
  { id: 'gastronomia', label: 'Gastro', icon: Utensils, path: '/gastronomia', color: '#2E8B57' },
  { id: 'eventos', label: 'Eventos', icon: Calendar, path: '/eventos', color: '#6B3FA0' },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 z-30 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)] transition-all duration-300">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center min-w-[50px] py-1.5 px-1
                ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant/70 hover:text-primary'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-primary text-white shadow-md' : 'bg-transparent text-on-surface-variant/60'}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[9px] font-medium leading-none mt-1.5 transition-colors ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant/70'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}