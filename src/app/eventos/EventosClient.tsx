"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Music, Cross, Instagram, Globe, Check
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import PageHeader from '@/components/PageHeader';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { trackClick } from '@/lib/analytics';

export interface Evento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  data_inicio: string;
  data_encerramento: string;
  diaBadge: string;
  mesBadge: string;
  isEncerrado: boolean;
  mes: string;
  horario: string;
  local: string;
  descricao: string;
  imagem: string;
  images?: string[];
  Highlights?: string[];
  instagramUrl?: string;
  websiteUrl?: string;
  slug?: string;
}

const mesesOrdem = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const categoryIcons: Record<string, React.ElementType> = {
  "Festa Popular": Calendar,
  "Tradicional": Calendar,
  "Festa Junina": Calendar,
  "Religioso": Cross,
  "Gastronomia": Calendar,
  "Tradição Medieval": Calendar,
  "Musical": Music,
  "Natalino": Calendar,
  "default": Calendar
};

export default function EventosClient({ initialEventos, initialConfig }: { initialEventos: Evento[], initialConfig: { title: string, subtitle: string } }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [eventos, setEventos] = useState<Evento[]>(initialEventos);
  const [pageConfig, setPageConfig] = useState(initialConfig);

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'configuracoes', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPageConfig({
          title: data.eventosPageTitle || 'Eventos',
          subtitle: data.eventosPageSubtitle || 'Calendário completo das tradições e festas de Januária.'
        });
      }
    });
    return () => unsubConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'eventos'), (snap) => {
      const firebaseData = snap.docs.map(doc => {
        const data = doc.data();
        
        const dataOrig = data.data || '';
        const dataInicioRaw = data.data_inicio || dataOrig || '';
        const dataEncerramentoRaw = data.data_encerramento || data.data_fim || '';
        const horarioRaw = data.horario || '';

        let diaBadge = '--';
        let mesBadge = '---';
        let isEncerrado = false;
        let mesStr = 'Janeiro';

        const parseDateString = (dateStr: string) => {
          if (!dateStr) return null;
          if (dateStr.includes('-')) {
             const parts = dateStr.split('-');
             if (parts.length === 3) {
               return { year: parseInt(parts[0]), month: parseInt(parts[1]) - 1, day: parseInt(parts[2]) };
             }
          } else if (dateStr.includes('/')) {
             const parts = dateStr.split('/');
             if (parts.length === 3) {
               return { year: parseInt(parts[2]), month: parseInt(parts[1]) - 1, day: parseInt(parts[0]) };
             }
          }
          return null;
        };

        const parsedInicio = parseDateString(dataInicioRaw);
        if (parsedInicio) {
           diaBadge = parsedInicio.day.toString().padStart(2, '0');
           mesBadge = mesesOrdem[parsedInicio.month]?.substring(0, 3).toUpperCase() || '---';
           mesStr = mesesOrdem[parsedInicio.month];
        }

        const parsedFim = parseDateString(dataEncerramentoRaw) || parsedInicio;
        if (parsedFim) {
           const eventEndDate = new Date(parsedFim.year, parsedFim.month, parsedFim.day);
           const today = new Date();
           today.setHours(0,0,0,0);
           if (eventEndDate < today) {
              isEncerrado = true;
           }
        }

        const formatBr = (d: string) => {
           if (!d) return '';
           if (d.includes('-') && d.split('-').length === 3) {
              const p = d.split('-');
              return `${p[2]}/${p[1]}/${p[0]}`;
           }
           return d;
        };

        const dataInicioFormated = formatBr(dataInicioRaw);
        const dataEncerramentoFormated = formatBr(dataEncerramentoRaw);

        return {
          id: doc.id,
          slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
          nome: data.nome || 'Sem nome',
          tipo: data.tipo || 'Festa Popular',
          data: dataOrig,
          data_inicio: dataInicioFormated,
          data_encerramento: dataEncerramentoFormated,
          diaBadge,
          mesBadge,
          isEncerrado,
          mes: data.mes || mesStr,
          horario: horarioRaw,
          local: data.local || '',
          descricao: data.descricao || '',
          imagem: data.imagem || '',
          images: data.images || [],
          Highlights: data.Highlights || [],
          instagramUrl: data.instagramUrl || '',
          websiteUrl: data.websiteUrl || ''
        } as Evento;
      });
      
      setEventos(firebaseData);
    }, (error) => {
      console.error("🔥 Erro Firebase (Eventos):", error);
    });
    return () => unsubscribe();
  }, []);

  const dataSource = eventos;

  const filteredEventos = useMemo(() => {
    return dataSource.filter(evento => {
      const matchesSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           evento.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = selectedMonth === 'Todos' || evento.mes === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [searchTerm, selectedMonth, dataSource]);

  const mesesUnicos = useMemo(() => {
    const meses = dataSource.map(e => e.mes);
    return ['Todos', ...Array.from(new Set(meses))].sort((a: string, b: string) => {
      return mesesOrdem.indexOf(a) - mesesOrdem.indexOf(b);
    });
  }, [dataSource]);

  return (
    <main className="min-h-screen bg-background pt-16 sm:pt-20">
      <MobileNav />

      <PageHeader
        title={pageConfig.title}
        subtitle={pageConfig.subtitle}
        count={dataSource.length}
        countLabel="eventos anuais"
        placeholder="Buscar eventos, festas..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        bgColor="bg-transparent"
      />

      {/* CONTEÚDO - EVENTOS */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12">

        <div className="hidden lg:flex items-center justify-between mb-5">
          <p className="font-sans text-xs text-on-surface-variant">
            <span className="font-bold text-on-surface">{filteredEventos.length}</span> evento{filteredEventos.length !== 1 ? 's' : ''} encontrado{filteredEventos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* LISTA DE EVENTOS HORIZONTAL */}
        <div className="flex flex-col gap-6">
            {filteredEventos.map((evento, index) => {
              const Icon = categoryIcons[evento.tipo] || categoryIcons.default;

              return (
                <Link 
                  key={evento.id} 
                  href={`/eventos/${evento.slug || evento.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedEvent(evento);
                    setCurrentImageIndex(0);
                  }}
                  passHref legacyBehavior
                >
                <div
                  className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden group transition-all duration-500 flex flex-col md:flex-row cursor-pointer premium-card-hover text-left break-inside-avoid w-full shadow-md hover:shadow-lg"
                >
                  {/* IMAGEM (ESQUERDA NO DESKTOP, TOPO NO MOBILE) */}
                  <div className="relative w-full md:w-[320px] lg:w-[360px] aspect-[4/3] md:aspect-auto md:min-h-[220px] shrink-0 overflow-hidden bg-surface-container">
                    <img
                      src={evento.imagem}
                      alt={evento.nome}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                    />
                    
                    {/* Calendário flutuante no canto inferior esquerdo */}
                    <div className="absolute bottom-4 left-4 bg-white text-center rounded-lg shadow-xl overflow-hidden flex flex-col min-w-[56px] border border-outline-variant/20 z-10">
                        <strong className="bg-white text-gray-800 text-xl font-black pt-2 pb-1 leading-none">{evento.diaBadge}</strong>
                        <span className="bg-primary text-white text-[10px] font-bold py-1.5 px-2 uppercase tracking-widest">{evento.mesBadge}</span>
                    </div>
                  </div>

                  {/* CONTEÚDO (DIREITA) */}
                  <div className="p-5 md:p-6 lg:p-8 flex flex-col flex-1">
                    
                    {/* Linha do Título e Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface uppercase pr-4">{evento.nome}</h2>
                      
                      {evento.isEncerrado && (
                        <div className="flex items-center gap-1.5 text-red-600 shrink-0 mt-1 sm:mt-0">
                          <span className="font-sans text-[11px] font-black uppercase tracking-widest">Encerrado</span>
                          <div className="bg-red-600 text-white rounded-full p-0.5">
                            <Check size={12} strokeWidth={4} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Descrição */}
                    <p className="font-sans text-sm text-on-surface-variant leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
                      {evento.descricao}
                    </p>

                    {/* Rodapé de Informações (Datas e Categoria) */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-auto pt-5 border-t border-outline-variant/30">
                       <div className="flex items-center gap-2">
                          <div className="bg-surface-container rounded-md p-1.5 shrink-0 text-on-surface-variant">
                             <Calendar size={14} />
                          </div>
                          <span className="font-sans text-xs sm:text-sm text-on-surface-variant">
                             <strong className="text-on-surface">Início:</strong> {evento.data_inicio} {evento.horario && `às ${evento.horario}`}
                          </span>
                       </div>
                       
                       {evento.data_encerramento && (
                         <div className="flex items-center gap-2">
                            <div className="bg-surface-container rounded-md p-1.5 shrink-0 text-on-surface-variant">
                               <Calendar size={14} />
                            </div>
                            <span className="font-sans text-xs sm:text-sm text-on-surface-variant">
                               <strong className="text-on-surface">Encerramento:</strong> {evento.data_encerramento}
                            </span>
                         </div>
                       )}

                       {evento.tipo && (
                         <div className="flex items-center gap-2">
                            <div className="bg-surface-container rounded-md p-1.5 shrink-0 text-on-surface-variant">
                               <Icon size={14} />
                            </div>
                            <span className="font-sans text-xs sm:text-sm text-on-surface-variant">
                               <strong className="text-on-surface">Categoria:</strong> {evento.tipo}
                            </span>
                         </div>
                       )}
                    </div>

                  </div>
                </div>
                </Link>
              );
            })}
        </div>

        {filteredEventos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant/40">
              <Calendar size={24} />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">Nenhum evento encontrado</h3>
            <p className="font-sans text-xs text-on-surface-variant mb-5">Tente ajustar sua busca ou mudar o filtro.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedMonth('Todos'); }}
              className="font-sans text-[11px] font-bold uppercase tracking-widest text-quaternary hover:underline"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}
      </section>

      {/* MODAL DETALHES */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="bg-surface rounded-2xl sm:rounded-3xl border border-outline-variant/30 overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const hasGallery = selectedEvent.images && selectedEvent.images.length > 0;
                const allImages = hasGallery ? [selectedEvent.imagem, ...selectedEvent.images] : [selectedEvent.imagem];
                const currentImage = allImages[currentImageIndex];

                const nextImage = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
                };

                const prevImage = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                };

                return (
                  <>
              {/* IMAGEM */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-surface-container shrink-0 overflow-hidden group/modalimg">
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={selectedEvent.nome}
                  className="w-full h-full object-cover animate-in fade-in duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {hasGallery && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all z-20 opacity-0 group-hover/modalimg:opacity-100 hidden sm:flex">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all z-20 opacity-0 group-hover/modalimg:opacity-100 hidden sm:flex">
                      <ChevronRight size={24} />
                    </button>
                    
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white font-sans text-xs font-bold z-20">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 transition-colors z-30"
                >
                  <X size={18} />
                </button>

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2 z-10">
                   <div className="bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 border border-outline-variant/20 w-fit">
                     <span className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-quaternary">{selectedEvent.tipo}</span>
                   </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-2 z-10">
                  {selectedEvent.isEncerrado && (
                     <div className="flex items-center gap-1.5 bg-red-600/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-[10px] font-black uppercase shadow-sm border border-red-500/50">
                        <span className="tracking-widest">Encerrado</span>
                        <Check size={12} strokeWidth={4} />
                     </div>
                  )}
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">{selectedEvent.nome}</h2>
                </div>
              </div>

              {/* CONTEÚDO */}
              <div className="p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto bg-surface">
                
                {/* Bloco Datas Modal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/30">
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <Calendar size={14} className="text-primary" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                         <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Início</span>
                         <span className="font-sans text-xs sm:text-sm font-semibold text-on-surface">
                            {selectedEvent.data_inicio} {selectedEvent.horario && `às ${selectedEvent.horario}`}
                         </span>
                      </div>
                   </div>
                   
                   {selectedEvent.data_encerramento && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                           <Calendar size={14} className="text-primary" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Encerramento</span>
                           <span className="font-sans text-xs sm:text-sm font-semibold text-on-surface">
                              {selectedEvent.data_encerramento}
                           </span>
                        </div>
                     </div>
                   )}
                </div>

                <div className="flex items-start gap-3 px-1">
                  <MapPin size={16} className="text-quaternary mt-0.5 shrink-0" />
                  <span className="font-sans text-sm text-on-surface-variant">{selectedEvent.local}</span>
                </div>

                <div className="w-full h-px bg-outline-variant/20" />

                <p className="font-sans text-sm text-on-surface-variant leading-relaxed px-1 whitespace-pre-wrap">{selectedEvent.descricao}</p>

                {selectedEvent.Highlights && (
                  <div className="pt-2">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-quaternary mb-3 block">O que você encontra</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.Highlights.map((item, idx) => (
                        <span key={idx} className="bg-surface-container px-3 py-1.5 rounded-full font-sans text-[11px] text-on-surface-variant border border-outline-variant/30 shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  {selectedEvent.instagramUrl && (
                    <a href={selectedEvent.instagramUrl} onClick={() => trackClick('eventos', selectedEvent.id, 'instagram')} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full bg-pink-600 text-white py-3.5 rounded-xl font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-pink-700 active:scale-[0.98] transition-all">
                      <Instagram size={15} /> Instagram Oficial
                    </a>
                  )}
                  {selectedEvent.websiteUrl && (
                    <a href={selectedEvent.websiteUrl} onClick={() => trackClick('eventos', selectedEvent.id, 'website')} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full bg-blue-600 text-white py-3.5 rounded-xl font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all">
                      <Globe size={15} /> Acessar Site
                    </a>
                  )}
                  <a href="https://wa.me/5538992664400?text=Olá, gostaria de informações sobre eventos em Januária." onClick={() => trackClick('eventos', selectedEvent.id, 'whatsapp')} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full bg-quaternary text-white py-3.5 rounded-xl font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-quaternary/90 active:scale-[0.98] transition-all">
                    <Calendar size={15} /> Mais informações
                  </a>
                </div>
              </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
