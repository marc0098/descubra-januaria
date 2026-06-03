"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ArrowRight, Waves } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

const FEATURES = [
  { label: 'Barracas & Estrutura', desc: 'Alimentação, sombra e conforto na beira do rio' },
  { label: 'Shows ao Vivo', desc: 'Música toda semana com os melhores artistas regionais' },
  { label: 'Esportes Aquáticos', desc: 'Canoagem, stand-up paddle e passeios de barco' },
  { label: 'Segurança 24h', desc: 'Salva-vidas e equipe de segurança sempre presentes' },
];

export default function PraiaPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="min-h-screen bg-[#060a0f] font-sans overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Parallax background */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 scale-110"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/praia.jpeg')" }}
          />
          {/* Layered overlays for cinematic look */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#060a0f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        </motion.div>

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
          }}
        />

        {/* Hero content */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="h-px w-8 bg-amber-400/60" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.3em]">
              100 Dias de Verão · Januária
            </span>
            <div className="h-px w-8 bg-amber-400/60" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight leading-[0.92] mb-6"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}
          >
            Temporada<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              de Praia
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/70 text-lg md:text-xl max-w-xl font-light leading-relaxed mb-10 tracking-wide"
          >
            Sol, águas refrescantes do São Francisco e o melhor verão
            do Norte de Minas esperando por você.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => router.push('/cavernas')}
              className="group flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(251,191,36,0.35)] hover:shadow-[0_0_60px_rgba(251,191,36,0.55)] hover:scale-[1.03] active:scale-[0.97]"
            >
              Ver Atrações
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => router.push('#estrutura')}
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200"
            >
              <Waves className="w-4 h-4" />
              Conhecer estrutura
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0 animate-pulse" />
          <span className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Role</span>
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={() => router.back()}
          className="absolute top-8 left-6 z-20 flex items-center gap-2 group"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-white/5 backdrop-blur-md group-hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </span>
          <span className="text-white/50 text-xs font-medium uppercase tracking-widest hidden sm:block group-hover:text-white/80 transition-colors">
            Voltar
          </span>
        </motion.button>
      </section>

      {/* ── FEATURES STRIP ───────────────────────────────────────── */}
      <section id="estrutura" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-16"
        >
          <div className="h-px w-12 bg-amber-400/50" />
          <span className="text-amber-400/80 text-xs font-bold uppercase tracking-[0.3em]">Estrutura completa</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06]">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group p-8 bg-[#060a0f] hover:bg-white/[0.03] transition-colors duration-300 cursor-default"
            >
              <div className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                <div>
                  <h3 className="text-white font-semibold text-base mb-1 tracking-tight">{f.label}</h3>
                  <p className="text-white/40 text-sm font-light leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="relative px-6 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-white/20 text-xs uppercase tracking-[0.4em] mb-5">Descubra Januária</p>
          <h2 className="text-white text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-8">
            O verão começa aqui.
          </h2>
          <button
            onClick={() => router.push('/cavernas')}
            className="group inline-flex items-center gap-3 border border-white/10 hover:border-amber-400/50 text-white/60 hover:text-white text-sm font-semibold uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 hover:bg-amber-400/5"
          >
            Explorar atrações
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>

    </main>
  );
}