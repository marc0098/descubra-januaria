import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mountain, Map, Compass, Anchor, Palmtree, Camera, 
  Palette, Info, ChevronRight, ArrowRight, X 
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const iconMap: Record<string, React.ElementType> = {
  Mountain,
  Map,
  Compass,
  Anchor,
  Palmtree,
  Camera,
  Palette,
  Info
};

interface Atrativo {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  imagem: string;
  trilha: string;
  dificuldade: string;
  cor_tema: string;
  text_tema: string;
  border_tema: string;
  icone: string;
}

export default function Cavernas() {
  const [showMap, setShowMap] = useState(false);
  const [atrativos, setAtrativos] = useState<Atrativo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'atrativos'), (snap) => {
      const firebaseData = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome || '',
          categoria: data.categoria || '',
          descricao: data.descricao || '',
          imagem: data.imagem || '',
          trilha: data.trilha || '',
          dificuldade: data.dificuldade || '',
          cor_tema: data.cor_tema || 'bg-primary',
          text_tema: data.text_tema || 'text-white',
          border_tema: data.border_tema || 'border-primary',
          icone: data.icone || 'Mountain'
        } as Atrativo;
      });
      setAtrativos(firebaseData);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro Firebase (Cavernas):", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="pt-16 sm:pt-20 md:pt-28 lg:pt-32 2xl:pt-36 pb-24 sm:pb-12 md:pb-16 lg:pb-20 2xl:pb-24 bg-background min-h-screen">
      <MobileNav />
      <div className="max-w-[1300px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-24 py-6 md:py-10 2xl:py-12">
        
        {/* Cabeçalho da Página */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 rounded-t-[100px] sm:rounded-t-[200px] rounded-b-[8px] sm:rounded-b-[10px] bg-cavernas flex items-center justify-center">
            <Mountain className="text-white w-5 h-5 sm:w-6 sm:h-6" size={20} />
          </div>
          <h2 className="font-headline text-[clamp(22px,5vw,44px)] lg:text-[40px] leading-[clamp(26px,6vw,50px)] lg:leading-[48px] font-bold text-primary uppercase">Cavernas do Peruaçu</h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-on-surface-variant font-sans text-[clamp(14px,2vw,17px)] lg:text-[17px] leading-[clamp(22px,4vw,28px)] lg:leading-[28px] mb-8 max-w-3xl"
        >
          O Parque Nacional Cavernas do Peruaçu é um dos patrimônios naturais mais impressionantes do Brasil. Com mais de 140 cavernas catalogadas e pinturas rupestres de até 12.000 anos, é patrimônio mundial da UNESCO desde 2025. Explore abaixo os principais roteiros disponíveis.
        </motion.p>

        {/* Seção do Mapa do Território */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 relative group cursor-pointer"
          onClick={() => setShowMap(true)}
        >
          <div className="absolute inset-0 bg-primary/5 rounded-[32px] -m-2 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative overflow-hidden rounded-[32px] border-4 border-surface shadow-2xl aspect-[16/7] md:aspect-[21/8] transition-all duration-300">
            <img 
              src="/img/Mapa peruaçu.jpeg" 
              alt="Mapa do Parque Nacional Cavernas do Peruaçu" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-10">
              <div className="flex items-center gap-4 text-white">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                  <Map size={24} />
                </div>
                <div>
                  <h3 className="font-headline text-xl md:text-2xl font-bold uppercase">Mapa do Território</h3>
                  <p className="font-sans text-xs md:text-sm opacity-80">Clique no mapa para ampliar e explorar as trilhas</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid de Atrativos do Parque */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 2xl:gap-14">
          {atrativos.map((item, index) => {
            const IconComponent = iconMap[item.icone] || Mountain;
            
            return (
              <motion.div 
                key={item.id}
                id={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden shadow-xl flex flex-col border border-outline-variant/30 group premium-card-hover"
              >
                {/* Imagem Container */}
                <div className="h-56 sm:h-64 lg:h-72 2xl:h-80 relative overflow-hidden">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover" 
                    src={item.imagem} 
                    alt={item.nome} 
                  />
                  <div className={`absolute top-4 left-4 ${item.cor_tema} px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider shadow-lg`}>
                    {item.categoria}
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 sm:p-8 lg:p-10 2xl:p-12 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-headline text-[clamp(20px,3vw,28px)] lg:text-[26px] 2xl:text-[28px] font-bold text-on-surface uppercase leading-tight">
                      {item.nome}
                    </h3>
                    <div className={`p-2 rounded-lg ${item.cor_tema} text-white`}>
                      <IconComponent size={20} />
                    </div>
                  </div>
                  
                  <p className="text-on-surface-variant font-sans text-[clamp(14px,2vw,16px)] lg:text-[15px] 2xl:text-[16px] leading-[26px] 2xl:leading-[28px] mb-6 flex-1">
                    {item.descricao}
                  </p>

                  {/* Badges de Info Técnica */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-surface-container p-3 rounded-2xl border border-outline-variant/30">
                      <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Trilha</span>
                      <span className="font-sans text-xs font-bold text-primary">{item.trilha}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-2xl border border-outline-variant/30">
                      <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Dificuldade</span>
                      <span className={`font-sans text-xs font-bold ${item.text_tema}`}>{item.dificuldade}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link href="/guias" className={`flex-1 ${item.cor_tema} text-white py-3 2xl:py-3.5 rounded-full font-sans text-[11px] sm:text-[12px] 2xl:text-[13px] font-bold uppercase tracking-[0.2em] hover:opacity-95 transition-all flex items-center justify-center gap-2 group/btn`}>
                      Agendar Passeio
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <button 
                      className={`w-12 h-12 2xl:w-14 2xl:h-14 rounded-full border-2 ${item.border_tema} flex items-center justify-center ${item.text_tema} hover:${item.cor_tema} hover:text-white transition-colors`} 
                      aria-label="Abrir localização"
                    >
                      <Map size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Informações Adicionais de Visitação (Centralizado) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-24 bg-surface rounded-3xl lg:rounded-[40px] p-8 sm:p-12 lg:p-16 shadow-2xl border border-outline-variant/30 xl:max-w-6xl xl:mx-auto relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-bl-full"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-tertiary/15 flex items-center justify-center text-tertiary">
              <Info size={24} />
            </div>
            <h3 className="font-headline text-[clamp(20px,3vw,32px)] lg:text-[32px] font-bold text-primary uppercase">Guia de Visitação</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
            <div className="flex flex-col group/info">
              <span className="font-sans text-[12px] font-bold text-tertiary uppercase mb-2 tracking-widest border-b border-tertiary/20 pb-1 w-fit">Entrada</span>
              <span className="font-sans text-[16px] text-on-surface font-medium">Franca</span>
            </div>
            <div className="flex flex-col group/info">
              <span className="font-sans text-[12px] font-bold text-tertiary uppercase mb-2 tracking-widest border-b border-tertiary/20 pb-1 w-fit">Horário</span>
              <span className="font-sans text-[16px] text-on-surface font-medium">8h às 18h</span>
            </div>
            <div className="flex flex-col group/info">
              <span className="font-sans text-[12px] font-bold text-tertiary uppercase mb-2 tracking-widest border-b border-tertiary/20 pb-1 w-fit">Modalidade</span>
              <span className="font-sans text-[16px] text-on-surface font-medium">Apenas com Condutor</span>
            </div>
            <div className="flex flex-col group/info">
              <span className="font-sans text-[12px] font-bold text-tertiary uppercase mb-2 tracking-widest border-b border-tertiary/20 pb-1 w-fit">Território</span>
              <span className="font-sans text-[16px] text-on-surface font-medium">56.448 hectares</span>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-outline-variant/30 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary/5 p-6 rounded-2xl flex-1">
              <p className="font-sans text-[15px] lg:text-[16px] text-on-surface-variant leading-relaxed italic">
                <strong>Importante:</strong> A visitação requer agendamento prévio. É necessário contratar um condutor credenciado (máximo 8 pessoas por grupo, exceto Lapa Bonita onde o limite é 5).
              </p>
            </div>
            <button className="whitespace-nowrap bg-primary text-white px-8 py-4 rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
              Agendar Visita
            </button>
          </div>
        </motion.div>

      </div>

      {/* Modal do Mapa (Lightbox) */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setShowMap(false)}
          >
            <motion.button 
              className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform p-3 bg-white/10 rounded-full z-10"
              onClick={() => setShowMap(false)}
              aria-label="Fechar mapa"
            >
              <X size={32} />
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src="/img/Mapa peruaçu.jpeg" 
                alt="Mapa em tamanho real" 
                className="rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[85vh] w-auto h-auto object-contain border border-white/10"
              />
              <div className="mt-6 text-center text-white/50 font-sans text-xs uppercase tracking-widest">
                Clique fora ou no X para fechar
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
