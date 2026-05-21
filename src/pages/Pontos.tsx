import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, ImageOff, X,
  MapPin, ArrowRight, History, Mountain, Palmtree, Camera, Compass, Search
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import PageHeader from '@/components/PageHeader';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PontoTuristico {
  id: string;
  title?: string;
  nome?: string;
  category?: string;
  categoria?: string;
  content?: string;
  descricao?: string;
  images?: string[];
  imagem?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  "Natureza": Mountain,
  "História e Cultura": History,
  "Lazer e Eventos": Palmtree,
  "default": MapPin
};

export default function Pontos() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [pontos, setPontos] = useState<PontoTuristico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pontos'), (snap) => {
      const firebaseData = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome || data.title || 'Ponto sem nome',
          categoria: data.categoria || data.category || 'Natural',
          category: data.categoria || data.category || 'Natural',
          descricao: data.descricao || data.content || '',
          imagem: data.imagem || (data.images && data.images[0]) || '',
          images: data.images || (data.imagem ? [data.imagem] : [])
        } as PontoTuristico;
      });
      
      const unique = firebaseData.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
      setPontos(unique);
      setIsLoading(false);
    }, (error) => {
      console.error("🔥 Erro Firebase (Pontos):", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const dataSource = pontos;

  const categories = useMemo(() => {
    const cats = dataSource.map(p => p.categoria || p.category);
    return ['Todos', ...Array.from(new Set(cats))];
  }, [dataSource]);

  const filteredPontos = useMemo(() => {
    return dataSource.filter(ponto => {
      const nome = ponto.nome || ponto.title || '';
      const desc = ponto.descricao || ponto.content || '';
      const matchesSearch = nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || (ponto.categoria || ponto.category) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, dataSource]);

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Galeria handlers
  const openGallery = useCallback((ponto: PontoTuristico) => {
    setSelectedPonto(ponto);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeGallery = useCallback(() => {
    setSelectedPonto(null);
    setActiveImageIndex(0);
    document.body.style.overflow = '';
  }, []);

  const nextImage = useCallback(() => {
    if (selectedPonto?.images && selectedPonto.images.length > 0) {
      setActiveImageIndex((prev: number) => (prev + 1) % selectedPonto.images.length);
    }
  }, [selectedPonto]);

  const prevImage = useCallback(() => {
    if (selectedPonto?.images && selectedPonto.images.length > 0) {
      const len = selectedPonto.images.length;
      setActiveImageIndex((prev: number) => (prev - 1 + len) % len);
    }
  }, [selectedPonto]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedPonto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPonto, closeGallery, nextImage, prevImage]);

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        title="Pontos Turísticos"
        subtitle="Explore a história, natureza e cultura de Januária."
        count={dataSource.length}
        countLabel="locais"
        placeholder="Buscar locais, atrações..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        bgColor="bg-transparent"
      />
      <MobileNav />


      {/* ═══════════════════════════════════════════════════════════════
          CONTEÚDO — Cards compactos
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12">

        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
          {categories.filter((cat): cat is string => cat !== undefined).map((cat) => {
            const Icon = categoryIcons[cat as keyof typeof categoryIcons] || categoryIcons.default;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as string)}
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

        {/* Counter */}
        <div className="flex items-center justify-between mb-5">
          <p className="font-sans text-xs text-on-surface-variant">
            <span className="font-bold text-on-surface">{filteredPontos.length}</span> resultado{filteredPontos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredPontos.map((ponto, index) => {
              const Icon = categoryIcons[(ponto.category || 'default') as keyof typeof categoryIcons] || categoryIcons.default;

              return (
                <motion.article
                  layout
                  key={ponto.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden group transition-all duration-500 flex flex-col cursor-pointer premium-card-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGallery(ponto);
                  }}
                >
                  {/* Imagem */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {imageErrors[ponto.id] ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-6 h-6 text-on-surface-variant/20" />
                      </div>
                    ) : (
                      <img
                        src={ponto.images?.[0] || ponto.imagem || ''}
                        alt={ponto.nome || ponto.title || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={() => handleImageError(ponto.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <div className="bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-outline-variant/20">
                        <Icon className="text-secondary" size={10} />
                        <span className="font-sans text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-on-surface">{ponto.categoria || ponto.category}</span>
                      </div>
                    </div>

                    {/* Fotos count */}
                    <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Camera size={10} className="text-white/70" />
                      <span className="font-sans text-[9px] font-bold text-white/70">{ponto.images?.length || 0}</span>
                    </div>

                    {/* Título */}
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h2 className="font-headline text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">{ponto.nome || ponto.title}</h2>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2.5">
                    <p className="font-sans text-[11px] sm:text-xs text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
                      {ponto.descricao || ponto.content}
                    </p>

                    {/* CTA */}
                    <Link
                      href="/guias"
                      className="flex items-center justify-between pt-2.5 border-t border-outline-variant/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-primary group-hover:text-secondary transition-colors">Explorar</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-on-surface-variant">
                        <ArrowRight size={13} />
                      </div>
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Estado Vazio */}
        {filteredPontos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant/40">
              <Search size={24} />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">Nenhum ponto encontrado</h3>
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

      {/* ═══════════════════════════════════════════════════════════════
          CURIOSIDADE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pb-20">
        <div className="relative bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-quaternary to-primary" />
          <div className="p-8 sm:p-12 flex flex-col sm:flex-row items-start gap-8">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
              <History size={26} />
            </div>
            <div>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-secondary mb-3 block">Você sabia?</span>
              <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
                Januária abriga a Igreja N. Sra. do Rosário, datada de 1688, sendo a segunda mais antiga de Minas Gerais. Sua história é o reflexo vivo do desbravamento do sertão mineiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL GALERIA
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedPonto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={closeGallery}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="bg-surface rounded-2xl sm:rounded-3xl border border-outline-variant/30 overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagem principal com navegação */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-surface-container shrink-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={selectedPonto.images?.[activeImageIndex] || selectedPonto.imagem || ''}
                    alt={`${selectedPonto.nome || selectedPonto.title} - Foto ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* Botão fechar */}
                <button
                  onClick={closeGallery}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Contador de fotos */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Camera size={12} className="text-white/70" />
                  <span className="font-sans text-[11px] font-bold text-white">{activeImageIndex + 1} / {(selectedPonto.images?.length ?? 0)}</span>
                </div>

                {/* Navegação prev/next */}
                {(selectedPonto.images?.length ?? 0) > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {(selectedPonto.images?.length ?? 0) > 1 && (
                <div className="flex gap-2 px-4 sm:px-6 pt-4 overflow-x-auto no-scrollbar scrollbar-hide shrink-0">
                  {(selectedPonto.images || []).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                        idx === activeImageIndex
                          ? 'border-secondary shadow-md scale-105'
                          : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Info do ponto */}
              <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
                {/* Categoria */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = categoryIcons[selectedPonto.categoria || selectedPonto.category || ''] || categoryIcons.default;
                    return <Icon size={14} className="text-secondary" />;
                  })()}
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{selectedPonto.categoria || selectedPonto.category}</span>
                </div>

                {/* Título */}
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-on-surface leading-tight">{selectedPonto.nome || selectedPonto.title}</h2>

                {/* Descrição */}
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{selectedPonto.descricao || selectedPonto.content}</p>

                {/* Botão Visitar */}
                <Link
                  href="/guias"
                  onClick={closeGallery}
                  className="flex items-center justify-center gap-2.5 w-full bg-primary text-white py-3.5 rounded-xl font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all mt-1"
                >
                  <Compass size={15} />
                  Visitar com Guia
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}