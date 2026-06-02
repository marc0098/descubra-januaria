"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mountain, Map, Compass, Camera, Bed, Utensils, Calendar, ChevronLeft, ChevronRight, Play, Sun } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HomeImages {
  hero?: string;
  hero_desktop?: string;
  atrativos?: string;
  cavernas?: string;
  hospedagem?: string;
  gastronomia?: string;
}

export default function HomePage() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [images, setImages] = useState<HomeImages>({
    hero: "https://firebasestorage.googleapis.com/v0/b/atheris-delivery.firebasestorage.app/o/banners%2Fhero_1776786143775_WhatsApp%20Image%202026-04-08%20at%2023.25.08.jpeg?alt=media&token=b2c07c40-9b4a-4b88-8ad3-94c84f0335ed",
    hero_desktop: "https://firebasestorage.googleapis.com/v0/b/atheris-delivery.firebasestorage.app/o/banners%2Fhero_desktop_1776810085306_WhatsApp%20Image%202026-04-21%20at%2012.56.47.jpeg?alt=media&token=ca75d938-2981-4a50-9043-af1c266b411b",
    atrativos: "https://firebasestorage.googleapis.com/v0/b/atheris-delivery.firebasestorage.app/o/banners%2Fatrativos_1776787469379_WhatsApp%20Image%202026-04-21%20at%2012.56.41.jpeg?alt=media&token=d78d7b31-0819-4cfd-a0b4-f356964ac23e",
    hospedagem: "https://firebasestorage.googleapis.com/v0/b/atheris-delivery.firebasestorage.app/o/banners%2Fhospedagem_1776789297328_WhatsApp%20Image%202026-04-21%20at%2012.56.43.jpeg?alt=media&token=768cade6-ff85-42af-bbc0-e9eb7ba96d5e",
    gastronomia: "https://firebasestorage.googleapis.com/v0/b/atheris-delivery.firebasestorage.app/o/banners%2Fgastronomia_1776789311518_WhatsApp%20Image%202026-04-21%20at%2012.56.42.jpeg?alt=media&token=06ff9c3e-aa92-4313-8196-541eab5716d5"
  });
  const [globalConfig, setGlobalConfig] = useState({
    homeTitle: 'DESCUBRA JANUÁRIA',
    homeSubtitle: 'CULTURA, NATUREZA E HISTÓRIA',
    welcomeTitle: 'BEM-VINDO AO PORTAL DE TURISMO DE JANUÁRIA',
    welcomeDescription: 'Explore as melhores experiências turísticas da região. Aproveite paisagens, gastronomia, atrativos naturais e as culturas que fazem de Januária um destino único.',
    cavernasTitle: 'CAVERNAS DO PERUAÇU',
    cavernasDescription: 'Explore o maior patrimônio de cavernas do Brasil com mais de 140 grutas, paintings rupestres de 12 mil anos e a maior estalactite do mundo. Patrimônio mundial da UNESCO desde 2025.',
    hospedagemTitle: 'HOSPEDAGEM',
    hospedagemDescription: 'Pousadas, chalés e hotéis para todos os estilos. Encontre o lugar perfeito para descansar, aproveitar a vista e viver Januária com conforto e acolhimento.',
    hospedagemDescription: 'Pousadas, chalés e hotéis para todos os estilos. Encontre o lugar perfeito para descansar, aproveitar a vista e viver Januária com conforto e acolhimento.',
    gastronomiaTitle: 'GASTRONOMIA',
    gastronomiaDescription: 'Sabores únicos da culinária mineira e regional. Dos peixes do rio ao tradicional arroz com pequi, experiências gastronômicas que traduzem o verdadeiro sabor de Januária.',
    praiaAtivo: false,
    praiaTitle: 'TEMPORADA DE PRAIA 100 DIAS',
    praiaDescription: 'Prepare-se para o evento mais esperado do ano! 100 dias de sol, areia, shows e muita animação nas margens do majestoso Rio São Francisco.'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoSource, setVideoSource] = useState('/video/mobile.mp4');

  // Detectar tamanho da tela para escolher o vídeo correto
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setVideoSource(isDesktop ? '/video/mobile.mp4' : '/video/mobile.mp4');
    };

    // Inicializar com o tamanho atual
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubs = [
      onSnapshot(doc(db, 'banners', 'hero'), (snap) => {
        setImages(prev => ({ ...prev, hero: snap.exists() ? snap.data().url : prev.hero || '' }));
      }, (error) => {
        console.warn('Erro ao escutar banners/hero:', error);
      }),
      onSnapshot(doc(db, 'banners', 'hero_desktop'), (snap) => {
        setImages(prev => ({ ...prev, hero_desktop: snap.exists() ? snap.data().url : prev.hero_desktop || '' }));
      }, (error) => {
        console.warn('Erro ao escutar banners/hero_desktop:', error);
      }),
      onSnapshot(doc(db, 'banners', 'atrativos'), (snap) => {
        setImages(prev => ({ ...prev, atrativos: snap.exists() ? snap.data().url : prev.atrativos || '' }));
      }, (error) => {
        console.warn('Erro ao escutar banners/atrativos:', error);
      }),
      onSnapshot(doc(db, 'banners', 'cavernas'), (snap) => {
        setImages(prev => ({ ...prev, cavernas: snap.exists() ? snap.data().url : prev.cavernas || '' }));
      }, (error) => {
        console.warn('Erro ao escutar banners/cavernas:', error);
      }),
      onSnapshot(doc(db, 'banners', 'hospedagem'), (snap) => {
        setImages(prev => ({ ...prev, hospedagem: snap.exists() ? snap.data().url : prev.hospedagem || '' }));
      }, (error) => {
        console.warn('Erro ao escutar banners/hospedagem:', error);
      }),
      onSnapshot(doc(db, 'banners', 'gastronomia'), (snap) => {
        setImages(prev => ({ ...prev, gastronomia: snap.exists() ? snap.data().url : prev.gastronomia || '' }));
      }, (error) => {
        console.warn('Erro ao escutar banners/gastronomia:', error);
      }),
      onSnapshot(doc(db, 'configuracoes', 'global'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setGlobalConfig(prev => ({
            ...prev,
            homeTitle: data.homeTitle || prev.homeTitle,
            homeSubtitle: data.homeSubtitle || prev.homeSubtitle,
            welcomeTitle: data.welcomeTitle || prev.welcomeTitle,
            welcomeDescription: data.welcomeDescription || prev.welcomeDescription,
            cavernasTitle: data.cavernasTitle || prev.cavernasTitle,
            cavernasDescription: data.cavernasDescription || prev.cavernasDescription,
            hospedagemTitle: data.hospedagemTitle || prev.hospedagemTitle,
            hospedagemDescription: data.hospedagemDescription || prev.hospedagemDescription,
            hospedagemDescription: data.hospedagemDescription || prev.hospedagemDescription,
            gastronomiaTitle: data.gastronomiaTitle || prev.gastronomiaTitle,
            gastronomiaDescription: data.gastronomiaDescription || prev.gastronomiaDescription,
            praiaAtivo: data.praiaAtivo || false,
            praiaTitle: data.praiaTitle || prev.praiaTitle,
            praiaDescription: data.praiaDescription || prev.praiaDescription
          }));
        }
      }, (error) => {
        console.warn('Erro ao escutar configuracoes globais:', error);
      })
    ];

    setIsLoading(false);

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const heroMobile = images.hero || '';
  const heroDesktop = images.hero_desktop || images.hero || '';
  const atrativosImg = images.atrativos || '';
  const hospedagemImg = images.hospedagem || '';
  const gastronomiaImg = images.gastronomia || '';

  const curveX = useTransform(scrollYProgress, [0, 1], [-200, 100]);
  const curveOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.6, 0.4]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <main className="flex flex-col relative overflow-hidden">
      <motion.img
        id="curva-1"
        className="curva-1 fixed top-[20%] -z-10 pointer-events-none opacity-20"
        src="/assets/graphics/curva-1.svg"
        alt="Grafismo"
        style={{ left: curveX, opacity: curveOpacity }}
      />

      <section className="relative w-full h-[85vh] sm:h-[90vh] lg:h-[85vh] xl:h-[90vh] 2xl:h-[85vh] overflow-hidden bg-black">
        <div className="absolute inset-0">
          {heroMobile && (
            <Image
              alt="Januária - Cultura e Natureza"
              className="object-cover opacity-50 xl:hidden"
              src={heroMobile}
              fill
              priority
            />
          )}
          {heroDesktop && (
            <Image
              alt="Januária - Cultura e Natureza"
              className="object-cover opacity-50 hidden xl:block"
              src={heroDesktop}
              fill
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80 pointer-events-none"></div>
        </div>

        <div className="relative z-20 flex flex-col justify-center h-full w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-16 sm:pt-20 md:pt-24">
          <div className="w-full max-w-[1200px] flex flex-col items-start">
            <motion.div 
              style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, 80]) }}
              className="flex flex-col items-start text-white text-left drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] mb-6 sm:mb-8"
            >
              <h1 className="flex flex-col">
                <span className="font-headline text-[clamp(28px,8vw,60px)] lg:text-[72px] xl:text-[90px] 2xl:text-[100px] font-bold tracking-[-0.01em] leading-[1.1] uppercase drop-shadow-lg">
                  {globalConfig.homeTitle}
                </span>
              </h1>
              <span className="font-sans text-[clamp(12px,2.5vw,22px)] lg:text-[24px] xl:text-[28px] font-semibold tracking-[0.1em] uppercase mt-3 sm:mt-4">
                {globalConfig.homeSubtitle}
              </span>
            </motion.div>

            {/* Botões de Chamada para Ação (CTA) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsVideoOpen(true)}
                className="font-sans text-white px-6 py-3 sm:px-10 sm:py-3 rounded-full text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:scale-105 transition-all duration-300 shadow-lg bg-secondary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                DESCUBRA
              </button>
              <button
                onClick={() => router.push('/cavernas')}
                className="font-sans text-white px-6 py-3 sm:px-10 sm:py-3 rounded-full text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 bg-[#2b5b84] w-full sm:w-auto"
              >
                <Map className="w-4 h-4" />
                Mapa
              </button>
            </div>
          </div>
        </div>

        {/* Carrossel de Navegação Inferior (Cápsulas) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-2 xl:hidden">
          <nav className="relative w-full py-3 sm:py-[25px]">
            {/* Gradientes laterais para indicação de scroll no mobile */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 sm:w-10 bg-gradient-to-r from-black/80 to-transparent z-30 lg:hidden"></div>
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 sm:w-10 bg-gradient-to-l from-black/80 to-transparent z-30 lg:hidden"></div>

            {/* Controles de scroll manuais para mobile/tablet */}
            <button onClick={scrollLeft} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-40 bg-black/40 sm:bg-black/30 rounded-full p-1 hover:bg-black/60 transition lg:hidden" aria-label="Anterior">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            <button onClick={scrollRight} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-40 bg-black/40 sm:bg-black/30 rounded-full p-1 hover:bg-black/60 transition lg:hidden" aria-label="Próximo">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Container das cápsulas de navegação */}
            <div ref={scrollContainerRef} className="w-full flex overflow-x-auto scrollbar-hide px-3 sm:px-4 md:px-8 lg:px-12 max-w-[1200px] mx-auto justify-start md:justify-center snap-x snap-mandatory gap-3 sm:gap-4 md:gap-8 lg:gap-10 xl:gap-16">

              {/* Cápsula: Cavernas */}
              <div onClick={() => router.push('/cavernas')} className="relative flex flex-col items-center justify-start shrink-0 text-white group snap-center cursor-pointer" style={{ width: '100px', gap: '8px' }}>
                <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-[#264b27]/90 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#264b27] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Mountain className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] md:text-[13px] font-[800] tracking-[-0.02em] uppercase text-center w-full">Cavernas</span>
                <span className="absolute top-1/2 -translate-y-1/2 h-[80%] border-r border-[#F3ECE2] opacity-60 hidden sm:block" style={{ right: '-12px' }}></span>
              </div>

              {/* Cápsula: Pontos */}
              <div onClick={() => router.push('/pontos')} className="relative flex flex-col items-center justify-start shrink-0 text-white group snap-center cursor-pointer" style={{ width: '100px', gap: '8px' }}>
                <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-[#5B8C5A]/90 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#5B8C5A] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Map className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] md:text-[13px] font-[800] tracking-[-0.02em] uppercase text-center w-full">Pontos</span>
                <span className="absolute top-1/2 -translate-y-1/2 h-[80%] border-r border-[#F3ECE2] opacity-60 hidden sm:block" style={{ right: '-12px' }}></span>
              </div>

              {/* Cápsula: Guias */}
              <div onClick={() => router.push('/guias')} className="relative flex flex-col items-center justify-start shrink-0 text-white group snap-center cursor-pointer" style={{ width: '100px', gap: '8px' }}>
                <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-[#DC6037]/90 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#DC6037] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] md:text-[13px] font-[800] tracking-[-0.02em] uppercase text-center w-full">Guias</span>
                <span className="absolute top-1/2 -translate-y-1/2 h-[80%] border-r border-[#F3ECE2] opacity-60 hidden sm:block" style={{ right: '-12px' }}></span>
              </div>

              {/* Cápsula: Hospedagem */}
              <div onClick={() => router.push('/estadias')} className="relative flex flex-col items-center justify-start shrink-0 text-white group snap-center cursor-pointer" style={{ width: '100px', gap: '8px' }}>
                <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-[#2B5B84]/90 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2B5B84] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Bed className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] md:text-[13px] font-[800] tracking-[-0.02em] uppercase text-center w-full">Hospedagem</span>
                <span className="absolute top-1/2 -translate-y-1/2 h-[80%] border-r border-[#F3ECE2] opacity-60 hidden sm:block" style={{ right: '-12px' }}></span>
              </div>

              {/* Cápsula: Gastronomia */}
              <div onClick={() => router.push('/gastronomia')} className="relative flex flex-col items-center justify-start shrink-0 text-white group snap-center cursor-pointer" style={{ width: '100px', gap: '8px' }}>
                <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-[#C0623D]/90 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C0623D] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] md:text-[13px] font-[800] tracking-[-0.02em] uppercase text-center w-full">Gastronomia</span>
                <span className="absolute top-1/2 -translate-y-1/2 h-[80%] border-r border-[#F3ECE2] opacity-60 hidden sm:block" style={{ right: '-12px' }}></span>
              </div>

              {/* Cápsula: Eventos */}
              <div onClick={() => router.push('/eventos')} className="relative flex flex-col items-center justify-start shrink-0 text-white group snap-center cursor-pointer" style={{ width: '100px', gap: '8px' }}>
                <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[64px] md:h-[64px] rounded-full bg-[#572847]/90 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#572847] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <span className="font-sans text-[10px] sm:text-[11px] md:text-[13px] font-[800] tracking-[-0.02em] uppercase text-center w-full">Eventos</span>
              </div>

            </div>
          </nav>
        </div>
      </section>

      {/* Seção de Boas-Vindas */}
      <section className="w-full py-10 sm:py-14 md:py-16 lg:py-20 bg-emerald-50/70 dark:bg-emerald-950/10 border-y border-outline-variant/15 transition-all duration-300">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 lg:gap-12">
          <div className="md:w-1/2 lg:w-[45%] flex items-center justify-start">
            <h2 className="font-headline text-[clamp(24px,4vw,32px)] lg:text-[36px] sm:text-[28px] md:text-[32px] leading-[clamp(28px,5vw,40px)] lg:leading-[44px] font-bold uppercase text-primary">
              {globalConfig.welcomeTitle}
            </h2>
          </div>
          <div className="md:w-1/2 lg:w-[50%] flex items-center justify-start">
            <p className="font-sans text-[clamp(14px,2vw,19px)] lg:text-[17px] sm:text-[16px] md:text-[17px] leading-[clamp(22px,4vw,28px)] lg:leading-[28px] text-on-surface">
              {globalConfig.welcomeDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Seção Condicional: Temporada de Praia */}
      {globalConfig.praiaAtivo && (
        <section className="relative w-full py-16 sm:py-24 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 overflow-hidden text-white">
          {/* Grafismo de Ondas e Sol no fundo */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,272,576,250.7C672,229,768,160,864,138.7C960,117,1056,144,1152,160C1248,176,1344,181,1392,184L1440,186.7L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
              <div className="flex items-center gap-3 mb-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-sm">
                <Sun className="w-5 h-5 text-yellow-300 fill-current animate-pulse" />
                <span className="font-sans text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-white">
                  Evento Especial
                </span>
              </div>
              <h2 className="font-headline text-[clamp(32px,5vw,56px)] leading-[1.1] font-bold uppercase drop-shadow-md mb-6">
                {globalConfig.praiaTitle}
              </h2>
              <p className="font-sans text-[clamp(15px,2vw,18px)] leading-relaxed text-white/90 mb-8 max-w-xl">
                {globalConfig.praiaDescription}
              </p>
              <button 
                onClick={() => router.push('/praia')} 
                className="font-sans text-orange-600 bg-white px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-yellow-50 hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center gap-2"
              >
                Garantir o Verão
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0 relative">
              {/* Efeito de Vidro Flutuante com Destaques */}
              <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-[40px] bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl p-6 flex flex-col justify-between overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-400/30 rounded-full blur-3xl -ml-10 -mb-10"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold font-headline mb-2 text-yellow-50">O que te espera:</h3>
                  <ul className="space-y-3 font-sans text-sm text-white/90">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div> Shows ao vivo todo fim de semana</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div> Barracas com gastronomia típica</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div> Segurança reforçada 24h</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-300"></div> Pôr do sol inesquecível no rio</li>
                  </ul>
                </div>
                
                <div className="relative z-10 w-full bg-black/20 backdrop-blur-sm rounded-2xl p-4 mt-6 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-black/30 transition-colors" onClick={() => router.push('/praia')}>
                  <span className="font-bold text-sm">Ver Programação Completa</span>
                  <div className="w-8 h-8 rounded-full bg-white text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex flex-col">
        {/* Seção: Atrativos Naturais (Destaque Peruaçu) */}
        <section className="relative w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${atrativosImg})` }}>
          <div className="absolute top-0 right-0 bg-surface/90 backdrop-blur-md border-l border-b border-outline-variant/30 w-full h-[340px] sm:w-[85%] sm:h-[360px] md:w-[70%] md:h-[380px] lg:w-[60%] lg:h-[400px] xl:w-[50%] xl:h-[450px] 2xl:w-[45%] 2xl:h-[480px] rounded-bl-[60px] sm:rounded-bl-[100px] md:rounded-bl-[180px] z-10 p-4 sm:p-6 md:p-8 flex items-center transition-all duration-300 shadow-xl">
            <div className="flex flex-col md:flex-col lg:flex-row items-center md:items-center lg:items-start gap-4 md:gap-5 lg:gap-8 w-full h-full justify-center">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-[52px] md:w-[52px] lg:h-[56px] lg:w-[56px] shrink-0 items-center justify-center rounded-t-[100px] sm:rounded-t-[150px] rounded-b-[8px] md:rounded-b-[10px] bg-tertiary shadow-md">
                <Mountain className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 h-6 text-white" />
              </div>
              <div className="w-full max-w-[90%] sm:max-w-[520px] md:max-w-[420px] lg:max-w-[480px] flex flex-col gap-4 md:gap-5 lg:gap-5 text-center items-center md:text-center md:items-center lg:text-left lg:items-start">
                <h2 className="font-headline text-[clamp(22px,5vw,44px)] lg:text-[38px] leading-[clamp(26px,6vw,50px)] lg:leading-[48px] font-bold uppercase text-primary">{globalConfig.cavernasTitle}</h2>
                <p className="font-sans text-[clamp(14px,2vw,17px)] lg:text-[16px] leading-[clamp(22px,4vw,28px)] lg:leading-[26px] text-on-surface-variant">
                  {globalConfig.cavernasDescription}
                </p>
                <button onClick={() => router.push('/cavernas')} className="font-sans text-white px-6 sm:px-8 lg:px-8 py-2.5 sm:py-3 lg:py-2.5 rounded-full text-[11px] sm:text-[12px] lg:text-[12px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:opacity-90 active:scale-95 transition bg-tertiary w-full sm:w-auto lg:w-auto shadow-md">
                  SAIBA MAIS
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Hospedagem */}
        <section className="relative w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: hospedagemImg ? `url(${hospedagemImg})` : undefined }}>
          <div className="absolute top-0 left-0 bg-surface/90 backdrop-blur-md border-r border-b border-outline-variant/30 w-full h-[340px] sm:w-[85%] sm:h-[360px] md:w-[70%] md:h-[380px] lg:w-[60%] lg:h-[400px] xl:w-[50%] xl:h-[450px] 2xl:w-[45%] 2xl:h-[480px] rounded-br-[60px] sm:rounded-br-[100px] md:rounded-br-[180px] z-10 p-4 sm:p-6 md:p-8 flex items-center transition-all duration-300 shadow-xl">
            <div className="flex flex-col md:flex-col lg:flex-row items-center md:items-center lg:items-start gap-4 md:gap-5 lg:gap-8 w-full h-full justify-center">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-[52px] md:w-[52px] lg:h-[56px] lg:w-[56px] shrink-0 items-center justify-center rounded-t-[100px] sm:rounded-t-[150px] rounded-b-[8px] md:rounded-b-[10px] bg-quaternary shadow-md">
                <Bed className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 h-6 text-white" />
              </div>
              <div className="w-full max-w-[90%] sm:max-w-[520px] md:max-w-[420px] lg:max-w-[480px] flex flex-col gap-4 md:gap-5 lg:gap-5 text-center items-center md:text-center md:items-center lg:text-left lg:items-start">
                <h2 className="font-headline text-[clamp(22px,5vw,44px)] lg:text-[38px] leading-[clamp(26px,6vw,50px)] lg:leading-[48px] font-bold uppercase text-primary">{globalConfig.hospedagemTitle}</h2>
                <p className="font-sans text-[clamp(14px,2vw,17px)] lg:text-[16px] leading-[clamp(22px,4vw,28px)] lg:leading-[26px] text-on-surface-variant">
                  {globalConfig.hospedagemDescription}
                </p>
                <button onClick={() => router.push('/estadias')} className="font-sans text-white px-6 sm:px-8 lg:px-8 py-2.5 sm:py-3 lg:py-2.5 rounded-full text-[11px] sm:text-[12px] lg:text-[12px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:opacity-90 active:scale-95 transition bg-quaternary w-full sm:w-auto lg:w-auto shadow-md">
                  SAIBA MAIS
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Gastronomia */}
        <section className="relative w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: gastronomiaImg ? `url(${gastronomiaImg})` : undefined }}>
          <div className="absolute top-0 right-0 bg-surface/90 backdrop-blur-md border-l border-b border-outline-variant/30 w-full h-[340px] sm:w-[85%] sm:h-[360px] md:w-[70%] md:h-[380px] lg:w-[60%] lg:h-[400px] xl:w-[50%] xl:h-[450px] 2xl:w-[45%] 2xl:h-[480px] rounded-bl-[60px] sm:rounded-bl-[100px] md:rounded-bl-[180px] z-10 p-4 sm:p-6 md:p-8 flex items-center transition-all duration-300 shadow-xl">
            <div className="flex flex-col md:flex-col lg:flex-row items-center md:items-center lg:items-start gap-4 md:gap-5 lg:gap-8 w-full h-full justify-center">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-[52px] md:w-[52px] lg:h-[56px] lg:w-[56px] shrink-0 items-center justify-center rounded-t-[100px] sm:rounded-t-[150px] rounded-b-[8px] md:rounded-b-[10px] bg-primary shadow-md">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 h-6 text-white" />
              </div>
              <div className="w-full max-w-[90%] sm:max-w-[520px] md:max-w-[420px] lg:max-w-[480px] flex flex-col gap-4 md:gap-5 lg:gap-5 text-center items-center md:text-center md:items-center lg:text-left lg:items-start">
                <h2 className="font-headline text-[clamp(22px,5vw,44px)] lg:text-[38px] leading-[clamp(26px,6vw,50px)] lg:leading-[48px] font-bold uppercase text-primary">{globalConfig.gastronomiaTitle}</h2>
                <p className="font-sans text-[clamp(14px,2vw,17px)] lg:text-[16px] leading-[clamp(22px,4vw,28px)] lg:leading-[26px] text-on-surface-variant">
                  {globalConfig.gastronomiaDescription}
                </p>
                <button onClick={() => router.push('/gastronomia')} className="font-sans text-white px-6 sm:px-8 lg:px-8 py-2.5 sm:py-3 lg:py-2.5 rounded-full text-[11px] sm:text-[12px] lg:text-[12px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:opacity-90 active:scale-95 transition bg-primary w-full sm:w-auto lg:w-auto shadow-md">
                  SAIBA MAIS
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Vídeo em Tela Cheia */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-20 p-2 rounded-full bg-black/20 backdrop-blur-sm"
            aria-label="Fechar vídeo"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full h-full max-w-[1200px] max-h-[80vh] flex items-center justify-center p-4">
            <video
              className="w-full h-full object-contain rounded-lg"
              controls
              autoPlay
            >
              <source src={videoSource} type="video/mp4" />
              <source src={videoSource} type="video/quicktime" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>
      )}
    </main>
  );
}
