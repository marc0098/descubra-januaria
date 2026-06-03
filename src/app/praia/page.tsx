"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Compass, Sun } from 'lucide-react';
import { motion } from 'motion/react';

export default function PraiaPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black">
      <section 
        className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/praia.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-0"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-lg"
          >
            <Sun className="w-10 h-10 text-amber-400 fill-current animate-pulse" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white font-headline text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight drop-shadow-lg mb-6 leading-tight"
          >
            A Temporada de Praia<br/>Vai Começar
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/90 font-sans text-lg md:text-xl max-w-2xl font-medium mb-10 drop-shadow-md"
          >
            Prepare-se para o melhor verão do Norte de Minas. Sol, águas refrescantes do São Francisco e diversão garantida.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button 
              onClick={() => router.push('/cavernas')} 
              className="font-sans text-white bg-amber-500 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(245,158,11,0.4)] flex items-center gap-3"
            >
              <Compass className="w-5 h-5" />
              Ver Atrações
            </button>
          </motion.div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-24 sm:top-32 left-4 sm:left-8 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white hover:bg-black/50 transition-colors shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider hidden sm:block">Voltar</span>
        </button>
      </section>
    </main>
  );
}
