"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Bed, MapPin, Phone, ArrowRight, Star
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import PageHeader from '@/components/PageHeader';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Hotel {
  id?: string;
  nome: string;
  categoria: string;
  endereco: string;
  telefone: string;
  sobre: string;
  fotos: string[];
  redes_sociais?: string;
  distancia_parque?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  "Centro": Bed,
  "Próximo ao Peruaçu": Bed,
  "Rural / Próximo ao Peruaçu": Bed,
  "default": Bed
};

export default function EstadiasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [hoteis, setHoteis] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageConfig, setPageConfig] = useState({
    title: 'Hospedagem',
    subtitle: 'Encontre a hospedagem perfeita para sua viagem.'
  });

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'configuracoes', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPageConfig({
          title: data.hospedagemPageTitle || 'Hospedagem',
          subtitle: data.hospedagemPageSubtitle || 'Encontre a hospedagem perfeita para sua viagem.'
        });
      }
    });
    return () => unsubConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'hoteis'), (snap) => {
      const firebaseHoteis = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome || 'Sem nome',
          categoria: data.categoria || 'Centro',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          sobre: data.descricao || data.sobre || '',
          fotos: data.imagens && data.imagens.length > 0 ? data.imagens : (data.fotos || []),
          redes_sociais: data.redes_sociais || '',
          distancia_parque: data.distancia_parque || ''
        } as Hotel;
      });
      
      const unique = firebaseHoteis.sort((a, b) => a.nome.localeCompare(b.nome));
      setHoteis(unique);
      setIsLoading(false);
    }, (error) => {
      console.error("🔥 Erro Firebase (Estadias):", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const dataSource = hoteis;

  const categories = useMemo(() => {
    const cats = dataSource.map(h => h.categoria);
    return ['Todos', ...Array.from(new Set(cats))];
  }, [dataSource]);

  const filteredHoteis = useMemo(() => {
    return dataSource.filter(hotel => {
      const matchesSearch = hotel.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (hotel.sobre || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || hotel.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, dataSource]);

  return (
    <main className="min-h-screen bg-background pt-16 sm:pt-20 md:pt-28">
      <MobileNav />

      <PageHeader
        title={pageConfig.title}
        subtitle={pageConfig.subtitle}
        count={dataSource.length}
        countLabel="hoteis"
        placeholder="Buscar hoteis, pousadas..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        bgColor="bg-transparent"
      />

      {/* CONTEÚDO */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12">

        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || categoryIcons.default;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/15'
                    : 'bg-surface-container text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {cat !== 'Todos' && <Icon size={12} />}
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-5">
          <p className="font-sans text-xs text-on-surface-variant">
            <span className="font-bold text-on-surface">{filteredHoteis.length}</span> resultado{filteredHoteis.length !== 1 ? 's' : ''}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-on-surface-variant font-sans text-sm">Carregando estadias...</span>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredHoteis.map((hotel, index) => {
                const Icon = categoryIcons[hotel.categoria] || categoryIcons.default;

                return (
                  <motion.article
                    layout
                    key={hotel.nome}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden group transition-all duration-500 flex flex-col cursor-pointer premium-card-hover"
                    onClick={() => setSelectedHotel(hotel)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                      <img
                        src={hotel.fotos && hotel.fotos.length > 0 ? hotel.fotos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'}
                        alt={hotel.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                      <div className="absolute top-2.5 left-2.5">
                        <div className="bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-outline-variant/20">
                          <Icon className="text-secondary" size={10} />
                          <span className="font-sans text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-on-surface">{hotel.categoria}</span>
                        </div>
                      </div>

                      {hotel.distancia_parque && (
                        <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                          <MapPin size={10} className="text-white/70" />
                          <span className="font-sans text-[9px] font-bold text-white">{hotel.distancia_parque}</span>
                        </div>
                      )}

                      <div className="absolute bottom-2.5 left-3 right-3">
                        <h2 className="font-headline text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">{hotel.nome}</h2>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2.5">
                      <p className="font-sans text-[11px] sm:text-xs text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
                        {hotel.sobre}
                      </p>

                      <div className="flex items-center gap-1 text-on-surface-variant/60">
                        <MapPin size={10} />
                        <span className="font-sans text-[9px] line-clamp-1">{hotel.endereco}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-outline-variant/30">
                        <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-primary group-hover:text-secondary transition-colors">Ver detalhes</span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-on-surface-variant">
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredHoteis.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant/40">
              <Bed size={24} />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">Nenhum hotel encontrado</h3>
            <p className="font-sans text-xs text-on-surface-variant mb-5">Tente ajustar sua busca ou mudar o filtro.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
              className="font-sans text-[11px] font-bold uppercase tracking-widest text-secondary hover:underline"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}
      </section>

      {/* MODAL DETALHES */}
      <AnimatePresence>
        {selectedHotel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedHotel(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="bg-surface rounded-2xl sm:rounded-3xl border border-outline-variant/30 overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-surface-container shrink-0 overflow-hidden">
                <img
                  src={selectedHotel.fotos && selectedHotel.fotos.length > 0 ? selectedHotel.fotos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'}
                  alt={selectedHotel.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                <button
                  onClick={() => setSelectedHotel(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 border border-outline-variant/20">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-primary">{selectedHotel.categoria}</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface leading-tight">{selectedHotel.nome}</h2>
                
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{selectedHotel.sobre}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-primary mt-0.5" />
                    <span className="font-sans text-xs text-on-surface-variant">{selectedHotel.endereco}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="text-primary mt-0.5" />
                    <span className="font-sans text-xs text-on-surface-variant">{selectedHotel.telefone}</span>
                  </div>
                  {selectedHotel.distancia_parque && (
                    <div className="flex items-start gap-2">
                      <Bed size={14} className="text-primary mt-0.5" />
                      <span className="font-sans text-xs text-on-surface-variant">{selectedHotel.distancia_parque} do Parque</span>
                    </div>
                  )}
                  {selectedHotel.redes_sociais && (
                    <div className="flex items-start gap-2">
                      <Star size={14} className="text-primary mt-0.5" />
                      <span className="font-sans text-xs text-on-surface-variant">{selectedHotel.redes_sociais}</span>
                    </div>
                  )}
                </div>

                <a
                  href={`https://wa.me/${selectedHotel.telefone.replace(/\D/g, '')}?text=Olá ${selectedHotel.nome}, vi seu perfil no Descubra Januária e gostaria de fazer uma reserva.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-primary text-white py-3.5 rounded-xl font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all mt-1"
                >
                  <Phone size={15} />
                  Reservar / Contatar
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
