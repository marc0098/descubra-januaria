import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { User, Menu, Home, Mountain, Compass, Bed, Calendar, X, Utensils } from 'lucide-react';

/**
 * Componente de Layout principal.
 * Fornece a estrutura comum de navegação (Header) e rodapé (Footer) para todas as páginas.
 * 
 * Funcionalidades:
 * - Header dinâmico: Transparente na Home, sólido em outras páginas.
 * - Menu Mobile: Overlay em tela cheia para dispositivos pequenos.
 * - Footer: Informações institucionais e de contato.
 */
export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* TopAppBar - Barra de navegação superior */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${!isHome || isScrolled ? 'bg-[#264b27] shadow-lg' : ''}`}>
        {/* Container desktop com logo/nome alinhado */}
        <div className="hidden xl:flex items-center justify-between px-4 sm:px-6 lg:px-16 pt-4 sm:pt-5 2xl:px-24">
          <div className="flex items-center">
            <NavLink to="/">
              <span className="font-headline text-2xl font-bold text-white">Januária</span>
            </NavLink>
          </div>
          <nav className="hidden xl:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-6 lg:gap-10 xl:gap-14 2xl:gap-20">
              <NavLink to="/" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Início</NavLink>
              <NavLink to="/cavernas" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Cavernas</NavLink>
              <NavLink to="/gastronomia" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Gastronomia</NavLink>
              <NavLink to="/guias" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Guias</NavLink>
              <NavLink to="/estadias" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Estadias</NavLink>
              <NavLink to="/eventos" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Eventos</NavLink>
            </div>
          </nav>
          <div className="w-[80px]"></div>
        </div>

        {/* Container mobile */}
        <div className="flex xl:hidden items-center justify-between px-4 sm:px-6 lg:left-16 top-0">
          <div className="relative flex items-start w-[80px] sm:w-[100px] md:w-[110px] lg:w-[120px] xl:w-[150px] 2xl:w-[170px]">
            <NavLink className="w-full flex justify-center" to="/">
              <span className="font-headline text-lg sm:text-xl md:text-2xl mt-4 sm:mt-5 md:mt-6 font-bold text-white">Januária</span>
            </NavLink>
          </div>
          
          {/* Links de navegação desktop (mantido para lg mas não xl) */}
          <nav className="hidden lg:flex xl:hidden flex-1 justify-center items-center">
            <div className="flex items-center gap-6 lg:gap-10 xl:gap-14 2xl:gap-20">
              <NavLink to="/" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Início</NavLink>
              <NavLink to="/cavernas" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Cavernas</NavLink>
              <NavLink to="/gastronomia" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Gastronomia</NavLink>
              <NavLink to="/guias" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Guias</NavLink>
              <NavLink to="/estadias" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Estadias</NavLink>
              <NavLink to="/eventos" className={({ isActive }) => `font-sans text-white font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-secondary transition-colors ${isActive ? 'text-secondary' : ''}`}>Eventos</NavLink>
            </div>
          </nav>
          
          {/* Botão de menu hambúrguer para mobile */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
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
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-2xl animate-slideUp pb-safe">
            {/* Alça visual */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="font-headline text-lg font-bold text-[#264b27]">Navegação</span>
              <button 
                className="p-2 rounded-full bg-gray-100 text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Links de navegação */}
            <nav className="flex flex-col py-4 px-4 gap-1">
              <NavLink 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-colors
                  ${isActive ? 'bg-[#264b27] text-white' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">🏠</span>
                Início
              </NavLink>
              <NavLink 
                to="/cavernas" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-colors
                  ${isActive ? 'bg-[#264b27] text-white' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">⛰️</span>
                Cavernas do Peruaçu
              </NavLink>
              <NavLink 
                to="/gastronomia" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-colors
                  ${isActive ? 'bg-[#264b27] text-white' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">🍽️</span>
                Gastronomia
              </NavLink>
              <NavLink 
                to="/guias" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-colors
                  ${isActive ? 'bg-[#264b27] text-white' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">🧭</span>
                Guias
              </NavLink>
              <NavLink 
                to="/estadias" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-colors
                  ${isActive ? 'bg-[#264b27] text-white' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">🏨</span>
                Hospedagem
              </NavLink>
              <NavLink 
                to="/eventos" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-colors
                  ${isActive ? 'bg-[#264b27] text-white' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">🎉</span>
                Eventos
              </NavLink>
              <NavLink 
                to="/pontos" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-base font-semibold transition-colors
                  ${isActive ? 'bg-[#264b27] text-white' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">📍</span>
                Pontos Turísticos
              </NavLink>
            </nav>
            
            {/* Espaço extra para área segura */}
            <div className="h-4" />
          </div>
        </>
      )}

      {/* Área de Conteúdo Principal - Onde as rotas filhas são renderizadas */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - Rodapé institucional */}
      <footer className="bg-[#264b27] py-3 sm:py-4 text-white mt-auto">
        <div className="mx-auto px-4 sm:px-6 lg:px-16 max-w-[1200px]">
          {/* Layout em uma linha para desktop, empilhado para mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Logo/Nome */}
            <div className="flex items-center">
              <span className="font-headline text-[11px] sm:text-[12px] font-bold tracking-[0.15em] uppercase">JANUÁRIA</span>
            </div>
            
            {/* Links de navegação rápida */}
            <div className="flex items-center gap-4 sm:gap-6 text-[9px] sm:text-[10px]">
              <a className="hover:text-gray-300 transition" href="#">Sobre</a>
              <a className="hover:text-gray-300 transition" href="#">Guias</a>
              <a className="hover:text-gray-300 transition" href="#">Termos</a>
              <a className="hover:text-gray-300 transition" href="#">Privacidade</a>
            </div>
            
            {/* Contato */}
            <div className="flex items-center gap-3 text-[9px] sm:text-[10px] text-gray-200">
              <span>Januária, MG</span>
              <span className="hidden sm:inline">•</span>
              <a href="tel:38999999999" className="hover:text-white transition">(38) 99999-9999</a>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center mt-2 sm:mt-2.5 pt-2 sm:pt-2.5 border-t border-white/20">
            <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.05em] text-white/60">
              © 2026 Portal de Turismo de Januária. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
