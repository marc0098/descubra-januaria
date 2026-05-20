"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, Home, Mountain, Compass, Bed, Calendar, X, Utensils, Sun, Moon } from 'lucide-react';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname() ?? '/';
  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Estado e persistência do tema (Modo Caverna)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Inicializar o tema no cliente para evitar incompatibilidades de SSR
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  // Leitor de Progresso de Leitura & Scroll
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

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const activeLinkClass = (path: string) => {
    const active = isActive(path);
    return `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${active ? 'text-secondary font-black' : 'opacity-90'}`;
  };

  const activeMobileLinkClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-all duration-200 ${
      active ? 'bg-primary text-white shadow-md' : 'text-on-surface hover:bg-surface-container'
    }`;
  };

  // Rotas admin: sem layout público
  if (isAdmin) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface transition-colors duration-300">
      
      {/* Indicador de progresso de scroll horizontal */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-secondary z-[60] transition-all duration-100 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* TopAppBar - Barra de navegação superior */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${!isHome || isScrolled ? 'glass-header shadow-lg' : 'bg-transparent'}`}>
        
        {/* Container desktop com logo/nome alinhado */}
        <div className="hidden xl:flex items-center justify-between px-4 sm:px-6 lg:px-16 pt-4 sm:pt-5 pb-4 2xl:px-24">
          <div className="flex items-center">
            <Link href="/">
              <span className="font-headline text-2xl font-bold text-white drop-shadow-md">Januária</span>
            </Link>
          </div>
          <nav className="hidden xl:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-6 lg:gap-10 xl:gap-14 2xl:gap-20">
              <Link href="/" className={activeLinkClass('/')}>Início</Link>
              <Link href="/cavernas" className={activeLinkClass('/cavernas')}>Cavernas</Link>
              <Link href="/gastronomia" className={activeLinkClass('/gastronomia')}>Gastronomia</Link>
              <Link href="/guias" className={activeLinkClass('/guias')}>Guias</Link>
              <Link href="/estadias" className={activeLinkClass('/estadias')}>Estadias</Link>
              <Link href="/eventos" className={activeLinkClass('/eventos')}>Eventos</Link>
            </div>
          </nav>
          
          {/* Seletor de Tema (Desktop) */}
          <div className="w-[80px] flex justify-end">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center"
              aria-label="Alternar Modo Caverna"
              title={theme === 'light' ? 'Ativar Modo Caverna' : 'Ativar Modo Sol'}
            >
              {theme === 'light' ? (
                <Mountain className="w-5 h-5 text-[#DC6037] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
              ) : (
                <Sun className="w-5 h-5 text-[#E0AC4B] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
              )}
            </button>
          </div>
        </div>

        {/* Container mobile */}
        <div className="flex xl:hidden items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="relative flex items-start w-[80px] sm:w-[100px] md:w-[110px] lg:w-[120px]">
            <Link className="w-full flex justify-start" href="/">
              <span className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md">Januária</span>
            </Link>
          </div>
          
          {/* Links de navegação desktop (mantido para lg mas não xl) */}
          <nav className="hidden lg:flex xl:hidden flex-1 justify-center items-center">
            <div className="flex items-center gap-6 lg:gap-10">
              <Link href="/" className={activeLinkClass('/')}>Início</Link>
              <Link href="/cavernas" className={activeLinkClass('/cavernas')}>Cavernas</Link>
              <Link href="/gastronomia" className={activeLinkClass('/gastronomia')}>Gastronomia</Link>
              <Link href="/guias" className={activeLinkClass('/guias')}>Guias</Link>
              <Link href="/estadias" className={activeLinkClass('/estadias')}>Estadias</Link>
              <Link href="/eventos" className={activeLinkClass('/eventos')}>Eventos</Link>
            </div>
          </nav>
          
          {/* Botões de menu e tema (Mobile) */}
          <div className="flex xl:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg active:scale-95 text-white hover:bg-white/10 transition-colors"
              aria-label="Alternar Modo Caverna"
            >
              {theme === 'light' ? (
                <Mountain className="w-5 h-5 sm:w-6 sm:h-6 text-[#DC6037]" />
              ) : (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-[#E0AC4B]" />
              )}
            </button>
            <button 
              className="p-1.5 sm:p-2 rounded-lg active:scale-95 text-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Overlay - Bottom Sheet estilo apps modernos */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop com blur */}
          <div 
            className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Slide-up */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-surface rounded-t-3xl shadow-2xl border-t border-outline-variant/30 animate-slideUp pb-safe">
            {/* Alça visual */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
            </div>
            
            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface">
              <div className="flex items-center gap-3">
                <span className="font-headline text-lg font-bold text-primary">Navegação</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-xs font-semibold text-on-surface"
                >
                  {theme === 'light' ? (
                    <>
                      <Mountain size={12} className="text-[#DC6037]" />
                      <span>Modo Caverna</span>
                    </>
                  ) : (
                    <>
                      <Sun size={12} className="text-[#E0AC4B]" />
                      <span>Modo Sol</span>
                    </>
                  )}
                </button>
              </div>
              <button 
                className="p-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-outline-variant/30 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Links de navegação */}
            <nav className="flex flex-col py-4 px-4 gap-1">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={activeMobileLinkClass('/')}
              >
                <span className="text-lg">🏠</span>
                Início
              </Link>
              <Link 
                href="/cavernas" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={activeMobileLinkClass('/cavernas')}
              >
                <span className="text-lg">⛰️</span>
                Cavernas do Peruaçu
              </Link>
              <Link 
                href="/gastronomia" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={activeMobileLinkClass('/gastronomia')}
              >
                <span className="text-lg">🍽️</span>
                Gastronomia
              </Link>
              <Link 
                href="/guias" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={activeMobileLinkClass('/guias')}
              >
                <span className="text-lg">🧭</span>
                Guias
              </Link>
              <Link 
                href="/estadias" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={activeMobileLinkClass('/estadias')}
              >
                <span className="text-lg">🏨</span>
                Hospedagem
              </Link>
              <Link 
                href="/eventos" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={activeMobileLinkClass('/eventos')}
              >
                <span className="text-lg">🎉</span>
                Eventos
              </Link>
              <Link 
                href="/pontos" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={activeMobileLinkClass('/pontos')}
              >
                <span className="text-lg">📍</span>
                Pontos Turísticos
              </Link>
            </nav>
            
            {/* Espaço extra para área segura */}
            <div className="h-4" />
          </div>
        </>
      )}

      {/* Área de Conteúdo Principal */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Rodapé institucional */}
      <footer className="bg-primary dark:bg-surface-container-lowest py-6 sm:py-8 text-white dark:text-on-surface mt-auto border-t border-white/5 dark:border-outline-variant/20 transition-all duration-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-16 max-w-[1200px]">
          {/* Layout em uma linha para desktop, empilhado para mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo/Nome */}
            <div className="flex items-center">
              <span className="font-headline text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">JANUÁRIA</span>
            </div>
            
            {/* Links de navegação rápida */}
            <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-white/80 dark:text-on-surface-variant">
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Sobre</a>
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Guias</a>
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Termos</a>
              <a className="hover:text-white dark:hover:text-primary transition" href="#">Privacidade</a>
            </div>
            
            {/* Contato */}
            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-white/70 dark:text-on-surface-variant/80">
              <span>Januária, MG</span>
              <span className="opacity-40">•</span>
              <a href="tel:38999999999" className="hover:text-white dark:hover:text-primary transition">(38) 99999-9999</a>
            </div>
          </div>
          
          {/* Copyright */}
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
