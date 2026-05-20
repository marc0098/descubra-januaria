"use client";

import React from 'react';
import { MapPin, Clock, ChevronRight, ArrowLeft, Phone, Star, Check, Camera, Mountain, Waves, TreePine, Sun } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

export default function GuiaPeruacuPage() {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      {/* Banner de Herói com Imagem de Fundo */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden pt-16" aria-labelledby="peruacu-title">
        <img 
          src="https://images.unsplash.com/photo-1558452048-e4a88a5502b4?auto=format&fit=crop&q=80&w=1920" 
          alt="Paisagem deslumbrante do Vale do Peruaçu" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        {/* Botão de Voltar */}
        <div className="absolute top-6 left-6 md:top-8 md:left-10">
          <Link href="/guias" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full" aria-label="Voltar para a lista de guias">
            <ArrowLeft size={18} />
            <span className="font-sans text-sm font-medium">Voltar aos Guias</span>
          </Link>
        </div>

        {/* Informações Principais do Roteiro */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14 xl:p-20">
          <div className="max-w-[1300px] mx-auto">
            <span className="inline-block bg-quaternary text-white text-xs md:text-sm font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4">
              Roteiro Exclusivo
            </span>
            <h1 id="peruacu-title" className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight uppercase">
              Roteiro Peruaçu
            </h1>
            <p className="text-white/90 font-sans text-lg md:text-xl lg:text-2xl max-w-2xl">
              Descubra a magia do Vale do Peruaçu em uma experiência inesquecível.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-10 md:py-14 lg:py-16 xl:py-20">
        {/* Cards de Destaque (Duração, Distância, etc) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-14">
          <div className="bg-surface rounded-2xl p-5 shadow-md border border-outline-variant/30 premium-card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-quaternary/10 flex items-center justify-center">
              <Clock className="text-quaternary w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-sans text-xs text-on-surface-variant/70 uppercase tracking-wider">Duração</p>
              <p className="font-sans font-bold text-primary dark:text-secondary">2 dias</p>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-5 shadow-md border border-outline-variant/30 premium-card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-quaternary/10 flex items-center justify-center">
              <MapPin className="text-quaternary w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-sans text-xs text-on-surface-variant/70 uppercase tracking-wider">Distância</p>
              <p className="font-sans font-bold text-primary dark:text-secondary">450 km</p>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-5 shadow-md border border-outline-variant/30 premium-card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-quaternary/10 flex items-center justify-center">
              <Camera className="text-quaternary w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-sans text-xs text-on-surface-variant/70 uppercase tracking-wider">Atrações</p>
              <p className="font-sans font-bold text-primary dark:text-secondary">8 pontos</p>
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-5 shadow-md border border-outline-variant/30 premium-card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-quaternary/10 flex items-center justify-center">
              <Star className="text-quaternary w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-sans text-xs text-on-surface-variant/70 uppercase tracking-wider">Dificuldade</p>
              <p className="font-sans font-bold text-primary dark:text-secondary">Moderada</p>
            </div>
          </div>
        </section>

        {/* Descrição do Roteiro */}
        <section className="mb-10 md:mb-14">
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-primary dark:text-on-surface mb-6 uppercase">Sobre o Roteiro</h2>
          <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-lg border border-outline-variant/30 premium-card-hover">
            <p className="font-sans text-on-surface-variant text-base md:text-lg leading-relaxed mb-6">
              O Roteiro Peruaçu é uma experiência única que combina história, natureza e cultura no coração do Norte de Minas Gerais. 
              Você conhecerá formações rochosas milenares, pinturas rupestres, cachoeiras cristalinas e a rica biodiversidade da região.
            </p>
            <p className="font-sans text-on-surface-variant text-base md:text-lg leading-relaxed">
              Ideal para quem busca aventura e contemplação, este roteiro oferece uma imersão completa no patrimônio natural 
              e cultural do Vale do Peruaçu, com trilhas, cavernas e momentos de integração com a natureza.
            </p>
          </div>
        </section>

        {/* Seção: O que Inclui */}
        <section className="mb-10 md:mb-14">
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-primary dark:text-on-surface mb-6 md:mb-8 uppercase">O que Inclui</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Mountain, text: "Acompanhamento de guia especializado" },
              { icon: Waves, text: "Trilhas em áreas de preservação" },
              { icon: TreePine, text: "Visitas a cavernas e grutas" },
              { icon: Camera, text: "Observação de pinturas rupestres" },
              { icon: Sun, text: "Cachoeiras e mirantes naturais" },
              { icon: Check, text: "Material de apoio e mapas" }
            ].map((item, index) => (
              <div key={index} className="bg-surface rounded-2xl p-5 md:p-6 shadow-md border border-outline-variant/30 premium-card-hover flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-quaternary flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-white w-5 h-5" aria-hidden="true" />
                </div>
                <span className="font-sans text-on-surface text-sm md:text-base">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Programação do Itinerário */}
        <section className="mb-10 md:mb-14">
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-primary dark:text-on-surface mb-6 md:mb-8 uppercase">Programação</h2>
          <div className="space-y-4 md:space-y-6">
            {/* Dia 1 */}
            <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-lg border border-outline-variant/30 premium-card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-quaternary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="font-headline text-xl md:text-2xl font-bold text-primary dark:text-on-surface uppercase">Dia 1 - A Magia das Cavernas</h3>
              </div>
              <ul className="space-y-3 ml-16">
                {[
                  "Saída às 7h de Januária em direção ao Complexo Cavernas do Peruaçu",
                  "Visita às cavernas com formação rochosa única",
                  "Almoço típico regional (não incluído)",
                  "Trilha até a Cachoeira do Buracão",
                  "Pernoite em hotel fazenda na região"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-quaternary w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="font-sans text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dia 2 */}
            <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-lg border border-outline-variant/30 premium-card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-quaternary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="font-headline text-xl md:text-2xl font-bold text-primary dark:text-on-surface uppercase">Dia 2 - Trilhas e História</h3>
              </div>
              <ul className="space-y-3 ml-16">
                {[
                  "Café da manhã no hotel (não incluído)",
                  "Trilha até o Mirante do Vale com vista panorâmica",
                  "Visita às pinturas rupestres da Lapa dos Índios",
                  "Almoço às margens do Rio Peruaçu",
                  "Retorno a Januária aproximadamente às 17h"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-quaternary w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="font-sans text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Itens Essenciais (O que levar) */}
        <section className="mb-10 md:mb-14">
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-primary dark:text-on-surface mb-6 md:mb-8 uppercase">O que Levar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              "Água mineral (mínimo 2L)",
              "Protetor solar e repelente",
              "Chapéu ou boné",
              "Calçados confortáveis",
              "Roupas leves e respiráveis",
              "Câmera fotográfica",
              "Binóculos para observação",
              "Bolsa ou mochila leve"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-surface rounded-xl p-4 shadow-sm border border-outline-variant/30 premium-card-hover">
                <Check className="text-quaternary w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-sans text-on-surface">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Chamada para Ação Final */}
        <section className="bg-primary rounded-3xl p-6 md:p-10 text-center">
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 uppercase">
            Pronto para essa Aventura?
          </h2>
          <p className="font-sans text-white/85 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato para verificar disponibilidade e agendar seu roteiro personalizado com nossos guias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-primary font-sans font-bold py-4 px-8 rounded-full hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2"
              aria-label="Agendar roteiro pelo telefone"
            >
              <Phone size={20} />
              <span>Agendar Agora</span>
            </button>
            <Link 
              href="/guias" 
              className="border-2 border-white text-white font-sans font-bold py-4 px-8 rounded-full hover:bg-white hover:text-primary transition-colors flex items-center justify-center gap-2"
              aria-label="Ver lista completa de guias"
            >
              <ChevronRight size={20} />
              <span>Ver Todos os Guias</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
