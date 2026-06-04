"use client";

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mountain, Map, Compass, Camera, Bed, Utensils, Calendar, ChevronLeft, ChevronRight, Play, Sun, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HomeImages {
  hero?: string;
  hero_desktop?: string;
  atrativos?: string;
  cavernas?: string;
  hospedagem?: string;
  gastronomia?: string;
}

interface Destaque {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
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
    heroButtonText: 'DESCUBRA',
    heroVideoUrl: '/video/mobile.mp4',
    homeTitle: 'DESCUBRA JANUÁRIA',
    homeSubtitle: 'CULTURA, NATUREZA E HISTÓRIA',
    welcomeTitle: 'BEM-VINDO AO PORTAL DE TURISMO DE JANUÁRIA',
    welcomeDescription: 'Explore as melhores experiências turísticas da região. Aproveite paisagens, gastronomia, atrativos naturais e as culturas que fazem de Januária um destino único.',
    cavernasTitle: 'CAVERNAS DO PERUAÇU',
    cavernasDescription: 'Explore o maior patrimônio de cavernas do Brasil com mais de 140 grutas, paintings rupestres de 12 mil anos e a maior estalactite do mundo. Patrimônio mundial da UNESCO desde 2025.',
    hospedagemTitle: 'HOSPEDAGEM',
    hospedagemDescription: 'Pousadas, chalés e hotéis para todos os estilos. Encontre o lugar perfeito para descansar, aproveitar a vista e viver Januária com conforto e acolhimento.',
    gastronomiaTitle: 'GASTRONOMIA',
    gastronomiaDescription: 'Sabores únicos da culinária mineira e regional. Dos peixes do rio ao tradicional arroz com pequi, experiências gastronômicas que traduzem o verdadeiro sabor de Januária.'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [destaques, setDestaques] = useState<Destaque[]>([]);
  const [currentDestaque, setCurrentDestaque] = useState(0);

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
            heroButtonText: data.heroButtonText || prev.heroButtonText,
            heroVideoUrl: data.heroVideoUrl || prev.heroVideoUrl,
            homeTitle: data.homeTitle || prev.homeTitle,
            homeSubtitle: data.homeSubtitle || prev.homeSubtitle,
            welcomeTitle: data.welcomeTitle || prev.welcomeTitle,
            welcomeDescription: data.welcomeDescription || prev.welcomeDescription,
            cavernasTitle: data.cavernasTitle || prev.cavernasTitle,
            cavernasDescription: data.cavernasDescription || prev.cavernasDescription,
            hospedagemTitle: data.hospedagemTitle || prev.hospedagemTitle,
            hospedagemDescription: data.hospedagemDescription || prev.hospedagemDescription,
            gastronomiaTitle: data.gastronomiaTitle || prev.gastronomiaTitle,
            gastronomiaDescription: data.gastronomiaDescription || prev.gastronomiaDescription
          }));
        }
      }, (error) => {
        console.warn('Erro ao escutar configuracoes globais:', error);
      }),
      onSnapshot(query(collection(db, 'destaques'), orderBy('order', 'asc')), (snap) => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destaque)).filter(d => d.isActive);
        setDestaques(data);
      }, (error) => {
        console.warn('Erro ao escutar destaques:', error);
      })
    ];

    setIsLoading(false);

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  useEffect(() => {
    if (destaques.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentDestaque((prev) => (prev + 1) % destaques.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [destaques.length]);

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
              unoptimized
            />
          )}
          {heroDesktop && (
            <Image
              alt="Januária - Cultura e Natureza"
              className="object-cover opacity-50 hidden xl:block"
              src={heroDesktop}
              fill
              priority
              unoptimized
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
                {globalConfig.heroButtonText || 'DESCUBRA'}
              </button>
              <a
                href="https://www.google.com/maps/place/Janu%C3%A1ria,+MG,+39480-000/@-15.4831204,-44.3998399,8234m/data=!3m1!1e3!4m6!3m5!1s0x755e7568b04c947:0xba33d9bc5f08070e!8m2!3d-15.4887575!4d-44.3620074!16zL20vMDl6MF96?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-white px-6 py-3 sm:px-10 sm:py-3 rounded-full text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 bg-[#2b5b84] w-full sm:w-auto"
              >
                <Map className="w-4 h-4" />
                Mapa
              </a>
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

      {/* Seção Destaques (Carrossel Estilo Lume Studio + Design Januária) */}
      {destaques.length > 0 && (
        <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 my-10 sm:my-14">
          <div className="relative w-full h-[350px] sm:h-[450px] md:h-[520px] rounded-[2rem] overflow-hidden shadow-2xl bg-neutral-900 group border border-white/10">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentDestaque}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {/* Layer 1: Blurred Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-40 select-none"
                  style={{ backgroundImage: `url('${destaques[currentDestaque]?.imageUrl}')` }}
                />

                {/* Layer 2: Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Layer 3: Sharp Image Center */}
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-12 pointer-events-none">
                  <img
                    src={destaques[currentDestaque]?.imageUrl}
                    alt={destaques[currentDestaque]?.title}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Layer 4: Overlays */}
                {/* Badge */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                  <div className="inline-flex items-center gap-2 bg-amber-500/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg text-black">
                    <Sun className="w-4 h-4 animate-spin-slow" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Destaque</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="absolute bottom-8 left-4 right-20 sm:bottom-10 sm:left-6 sm:right-28 flex flex-col gap-2 text-white">
                  <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.1] drop-shadow-lg line-clamp-2">
                    {destaques[currentDestaque]?.title}
                  </h2>
                  <p className="font-sans text-sm sm:text-base md:text-lg text-white/90 font-medium drop-shadow-md line-clamp-2 md:line-clamp-3 max-w-2xl">
                    {destaques[currentDestaque]?.description}
                  </p>
                </div>

                {/* Cart/Arrow Button */}
                <div className="absolute bottom-8 right-4 sm:bottom-10 sm:right-6 pointer-events-auto">
                  <button
                    onClick={() => router.push(destaques[currentDestaque]?.link || '#')}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dots */}
            {destaques.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 z-20">
                {destaques.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentDestaque(idx)}
                    className={`transition-all duration-300 rounded-full ${currentDestaque === idx ? 'w-8 h-2 bg-amber-500' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Ir para o slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Wide Button Below Banner */}
          <button
            onClick={() => router.push(destaques[currentDestaque]?.link || '#')}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-xl text-sm sm:text-base font-bold uppercase tracking-[0.15em] transition-all shadow-lg hover:shadow-[0_10px_20px_rgba(245,158,11,0.3)] active:scale-95"
          >
            <span>{destaques[currentDestaque]?.buttonText || 'Ver detalhes'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
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
              <source src={globalConfig.heroVideoUrl || '/video/mobile.mp4'} type="video/mp4" />
              <source src={globalConfig.heroVideoUrl || '/video/mobile.mp4'} type="video/quicktime" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>
      )}
    </main>
  );
}
