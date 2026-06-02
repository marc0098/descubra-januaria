"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Sun, Music, Utensils, ShieldCheck, Umbrella, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function PraiaPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600">
        <div className="absolute inset-0 pointer-events-none opacity-20">
           <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none">
              <path fill="#ffffff" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,272,576,250.7C672,229,768,160,864,138.7C960,117,1056,144,1152,160C1248,176,1344,181,1392,184L1440,186.7L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 shadow-lg"
          >
            <Sun className="w-10 h-10 text-yellow-300 fill-current animate-pulse" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white font-headline text-5xl md:text-7xl font-bold uppercase tracking-tight drop-shadow-md mb-4"
          >
            100 Dias de Praia
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/90 font-sans text-lg md:text-xl max-w-2xl font-medium"
          >
            A melhor temporada de verão do Norte de Minas. Sol, águas refrescantes do São Francisco e uma estrutura completa para você e sua família.
          </motion.p>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-24 sm:top-32 left-4 sm:left-8 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider hidden sm:block">Voltar</span>
        </button>
      </section>

      {/* Info Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
              <Umbrella className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-headline text-gray-900 dark:text-white mb-2">Estrutura Completa</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
              Ampla faixa de areia com barracas padronizadas, mesas, cadeiras e guarda-sóis à beira do rio.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mb-4">
              <Utensils className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-headline text-gray-900 dark:text-white mb-2">Pólo Gastronômico</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
              Os melhores petiscos de peixe, porções variadas, cerveja gelada e drinks tropicais.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mb-4">
              <Music className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-headline text-gray-900 dark:text-white mb-2">Shows e Eventos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
              Programação musical aos finais de semana com artistas regionais para animar o pôr do sol.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl shadow-black/5 border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-headline text-gray-900 dark:text-white mb-2">Segurança</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
              Área demarcada para banhistas, presença de salva-vidas e policiamento reforçado.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <h2 className="text-3xl font-headline font-bold text-gray-900 dark:text-white mb-6 uppercase">
          Não fique de fora do maior evento da cidade
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-sans text-lg mb-8 max-w-2xl mx-auto">
          Durante os 100 dias, a cidade recebe milhares de turistas. Recomendamos que você reserve sua hospedagem com antecedência.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => router.push('/estadias')}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
          >
            Onde Ficar
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push('/gastronomia')}
            className="w-full sm:w-auto bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-colors border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center justify-center gap-2"
          >
            Onde Comer
          </button>
        </div>
      </section>
    </main>
  );
}
