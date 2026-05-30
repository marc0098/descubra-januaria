"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, Home, Mountain, Compass, Bed, Calendar, X, Utensils, Sun, Moon } from 'lucide-react';

/**
 * Componente de Layout principal (legado - substituído por LayoutWrapper no App Router).
 * Mantido para compatibilidade mas não utilizado diretamente nas rotas do Next.js.
 */
export default function Layout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface transition-colors duration-300">
      
      <div 
        className="fixed top-0 left-0 h-[3px] bg-secondary z-[60] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${!isHome || isScrolled ? 'glass-header shadow-lg' : 'bg-transparent'}`}>
        <div className="hidden xl:flex items-center justify-between px-4 sm:px-6 lg:px-16 pt-4 sm:pt-5 pb-4 2xl:px-24">
          <div className="flex items-center">
            <Link href="/">
              <span className="font-headline text-2xl font-bold text-white drop-shadow-md">Januária</span>
            </Link>
          </div>
          <nav className="hidden xl:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-6 lg:gap-10 xl:gap-14 2xl:gap-20">
              <Link href="/" className="font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors">Início</Link>
              <Link href="/cavernas" className="font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors">Cavernas</Link>
              <Link href="/gastronomia" className="font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors">Gastronomia</Link>
              <Link href="/guias" className="font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors">Guias</Link>
              <Link href="/estadias" className="font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors">Estadias</Link>
              <Link href="/eventos" className="font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors">Eventos</Link>
              <Link href="/pontos" className="font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors">Pontos</Link>
            </div>
          </nav>
          <div className="w-[80px] flex justify-end">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center"
              aria-label="Alternar Modo Caverna"
            >
              {theme === 'light' ? (
                <Mountain className="w-5 h-5 text-[#DC6037] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
              ) : (
                <Sun className="w-5 h-5 text-[#E0AC4B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-primary dark:bg-surface-container-lowest py-6 sm:py-8 text-white dark:text-on-surface mt-auto border-t border-white/5 dark:border-outline-variant/20 transition-all duration-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-16 max-w-[1200px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <span className="font-headline text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">JANUÁRIA</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-white/80 dark:text-on-surface-variant">
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Sobre</a>
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Guias</a>
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Termos</a>
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Privacidade</a>
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-white/70 dark:text-on-surface-variant/80">
              <span>Januária, MG</span>
              <span className="opacity-40">•</span>
              <a href="tel:38999999999" className="hover:text-white dark:hover:text-primary transition">(38) 99999-9999</a>
            </div>
          </div>
          <div className="text-center mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-white/10 dark:border-outline-variant/10">
            <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.05em] text-white/50 dark:text-on-surface-variant/60">
              © 2026 Portal de Turismo de Januária. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
