import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Utensils, Star, MapPin, Phone, ArrowRight, Clock
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import PageHeader from '@/components/PageHeader';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GastronomiaItem {
  tipo: string;
  nome: string;
  descricao?: string;
  sobre?: string;
  onde_encontrar?: string;
  endereco?: string;
  telefone?: string;
  especialidade?: string;
  fotos: string[];
  redes_sociais?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  "Prato Típico": Utensils,
  "Bebida Tradicional": Utensils,
  "Restaurante": Utensils,
  "Comida de Rua / Evento": Utensils,
  "default": Utensils
};

export default function Gastronomia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState<GastronomiaItem | null>(null);
  const [gastronomia, setGastronomia] = useState<GastronomiaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'gastronomia'), (snap) => {
      const firebaseData = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          tipo: data.tipo || 'Restaurante',
          nome: data.nome || data.name || 'Sem nome',
          descricao: data.descricao || data.sobre || '',
          sobre: data.descricao || data.sobre || '',
          onde_encontrar: data.onde_encontrar || data.endereco || '',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          especialidade: data.especialidade || '',
          fotos: data.imagens && data.imagens.length > 0 ? data.imagens : (data.fotos || []),
          redes_sociais: data.redes_sociais || ''
        } as GastronomiaItem;
      });
      
      const unique = firebaseData.sort((a, b) => a.nome.localeCompare(b.nome));
      setGastronomia(unique);
      setIsLoading(false);
    }, (error) => {
      console.error("🔥 Erro Firebase (Gastronomia):", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const dataSource = gastronomia;

  const categories = useMemo(() => {
    const cats = dataSource.map(item => item.tipo);
    return ['Todos', ...Array.from(new Set(cats))];
  }, [dataSource]);

  const filteredItems = useMemo(() => {
    return dataSource.filter(item => {
      const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (item.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                           (item.sobre?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === 'Todos' || item.tipo === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, dataSource]);

  return (
    <main className="min-h-screen bg-background">
      <MobileNav />

      <PageHeader
        title="Gastronomia"
        subtitle="Sabores únicos da culinária mineira e regional."
        count={dataSource.length}
        countLabel="experiências gastronômicas"
        placeholder="Buscar pratos, restaurantes..."
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
                    ? 'bg-gastronomia text-white shadow-md shadow-gastronomia/15'
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
            <span className="font-bold text-on-surface">{filteredItems.length}</span> resultado{filteredItems.length !== 1 ? 's' : ''}
          </p>
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const Icon = categoryIcons[item.tipo] || categoryIcons.default;

              return (
                <motion.article
                  layout
                  key={item.nome}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden group transition-all duration-500 flex flex-col cursor-pointer premium-card-hover"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    <img
                      src={item.fotos[0]}
                      alt={item.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5">
                      <div className="bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-outline-variant/20">
                        <Icon className="text-secondary" size={10} />
                        <span className="font-sans text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-on-surface">{item.tipo}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h2 className="font-headline text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">{item.nome}</h2>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2.5">
                    <p className="font-sans text-[11px] sm:text-xs text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
                      {item.descricao || item.sobre}
                    </p>

                    {item.tipo === 'Restaurante' && item.endereco && (
                      <div className="flex items-center gap-1 text-on-surface-variant/60">
                        <MapPin size={10} />
                        <span className="font-sans text-[9px] line-clamp-1">{item.endereco}</span>
                      </div>
                    )}

                    {item.tipo !== 'Restaurante' && item.onde_encontrar && (
                      <div className="flex items-center gap-1 text-on-surface-variant/60">
                        <MapPin size={10} />
                        <span className="font-sans text-[9px] line-clamp-1">{item.onde_encontrar}</span>
                      </div>
                    )}

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

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant/40">
              <Utensils size={24} />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">Nenhum item encontrado</h3>
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
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedItem(null)}
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
                  src={selectedItem.fotos[0]}
                  alt={selectedItem.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 border border-outline-variant/20">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-primary">{selectedItem.tipo}</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface leading-tight">{selectedItem.nome}</h2>
                
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{selectedItem.descricao || selectedItem.sobre}</p>

                {selectedItem.tipo === 'Restaurante' && (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedItem.endereco && (
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-primary mt-0.5" />
                        <span className="font-sans text-xs text-on-surface-variant">{selectedItem.endereco}</span>
                      </div>
                    )}
                    {selectedItem.telefone && (
                      <div className="flex items-start gap-2">
                        <Phone size={14} className="text-primary mt-0.5" />
                        <span className="font-sans text-xs text-on-surface-variant">{selectedItem.telefone}</span>
                      </div>
                    )}
                    {selectedItem.especialidade && (
                      <div className="flex items-start gap-2">
                        <Utensils size={14} className="text-primary mt-0.5" />
                        <span className="font-sans text-xs text-on-surface-variant">{selectedItem.especialidade}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem.tipo !== 'Restaurante' && selectedItem.onde_encontrar && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-primary mt-0.5" />
                    <span className="font-sans text-xs text-on-surface-variant">{selectedItem.onde_encontrar}</span>
                  </div>
                )}

                {selectedItem.telefone && selectedItem.tipo === 'Restaurante' && (
                  <a
                    href={`https://wa.me/${selectedItem.telefone.replace(/\D/g, '')}?text=Olá ${selectedItem.nome}, vi seu perfil no Descubra Januária e gostaria de fazer uma reserva.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full bg-primary text-white py-3.5 rounded-xl font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all mt-1"
                  >
                    <Phone size={15} />
                    Reservar / Contatar
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}