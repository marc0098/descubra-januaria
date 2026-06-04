"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, MessageCircle, ExternalLink, 
  Award, Shield, MapPin, Users, Instagram, Globe
} from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import PageHeader from '@/components/PageHeader';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { trackClick } from '@/lib/analytics';

export interface Guia {
  id: string;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  reviews: number;
  whatsapp: string;
  image: string;
  hasDetailedItinerary: boolean;
  instagramUrl?: string;
  websiteUrl?: string;
  slug?: string;
}

export default function GuiasClient({ initialGuias, initialConfig }: { initialGuias: Guia[], initialConfig: { title: string, subtitle: string } }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [guias, setGuias] = useState<Guia[]>(initialGuias);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [pageConfig, setPageConfig] = useState(initialConfig);

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'configuracoes', 'global'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPageConfig({
          title: data.guiasPageTitle || 'Guias',
          subtitle: data.guiasPageSubtitle || 'Especialistas nativos para sua jornada em Januária.'
        });
      }
    });
    return () => unsubConfig();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'guias'), (snap) => {
      setFirebaseError(null);
      const firebaseData = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
          name: data.nome || data.name || 'Guia sem nome',
          specialty: data.especialidades ? data.especialidades.join(', ') : (data.specialty || data.descricao || ''),
          category: data.category || 'Guia',
          rating: data.rating || 5,
          reviews: data.reviews || 0,
          whatsapp: data.whatsapp || '',
          image: data.foto || data.image || '',
          hasDetailedItinerary: data.hasDetailedItinerary || false,
          instagramUrl: data.instagramUrl || '',
          websiteUrl: data.websiteUrl || ''
        } as Guia;
      });
      
      const unique = firebaseData.sort((a, b) => a.name.localeCompare(b.name));
      setGuias(unique);
    }, (error) => {
      console.error("🔥 Erro Firebase (Guias):", error);
      setFirebaseError(error.message);
    });
    return () => unsubscribe();
  }, []);

  const dataSource = guias;

  const categories = useMemo(() => {
    const cats = dataSource.map(g => g.category);
    return ['Todos', ...Array.from(new Set(cats))];
  }, [dataSource]);

  const filteredGuias = useMemo(() => {
    return dataSource.filter(guia => {
      const matchesSearch = guia.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           guia.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || guia.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, dataSource]);

  return (
    <main className="min-h-screen bg-background pt-16 sm:pt-20 md:pt-28">
      <MobileNav />

      {firebaseError && (
        <div className="bg-red-500 text-white p-4 text-center text-sm font-bold">
          Falha de conexão com o Firebase: {firebaseError} <br/> (Verifique as regras do Firestore!)
        </div>
      )}

      <PageHeader
        title={pageConfig.title}
        subtitle={pageConfig.subtitle}
        count={dataSource.length}
        countLabel="guias"
        placeholder="Buscar guias, especialidades..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        bgColor="bg-transparent"
      />

      {/* ═══════════════════════════════════════════════════════════════
          CONTEÚDO — Cards compactos, 2 colunas em mobile
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12">

        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/15'
                  : 'bg-surface-container text-on-surface-variant hover:bg-primary/5 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid — 2col mobile, 3col tablet, 4col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filteredGuias.map((guia, index) => (
              <article
                key={guia.id}
                className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden group premium-card-hover flex flex-col w-full h-full"
              >
                {/* Imagem compacta */}
                <Link href={`/guias/${guia.slug || guia.id}`} className="relative overflow-hidden bg-surface-container block aspect-[3/2] shrink-0">
                  <img
                    src={guia.image}
                    alt={guia.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* Rating badge */}
                  <div className="absolute top-2.5 right-2.5 bg-surface/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
                    <Star className="text-quaternary fill-quaternary" size={11} />
                    <span className="font-sans text-[10px] font-black text-on-surface">{guia.rating}</span>
                  </div>

                  {/* Nome sobre imagem */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-secondary">{guia.category}</span>
                    <h3 className="font-headline text-sm sm:text-base font-bold text-white leading-tight mt-0.5 line-clamp-1">{guia.name}</h3>
                  </div>
                </Link>

                {/* Body compacto */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 gap-3">
                  <p className="font-sans text-[11px] sm:text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-1 flex-1">{guia.specialty}</p>

                  {/* Meta compacto */}
                  <div className="flex items-center gap-2 text-on-surface-variant/60">
                    <Shield size={11} shrink-0 />
                    <span className="font-sans text-[10px] font-medium">ICMBio</span>
                    <div className="w-px h-3 bg-outline-variant" />
                    <MapPin size={11} shrink-0 />
                    <span className="font-sans text-[10px] font-medium">Januária</span>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-1.5 mt-auto pt-2">
                    <div className="flex gap-1.5">
                      <a
                        href={`https://wa.me/${guia.whatsapp}?text=Olá ${guia.name}, vi seu perfil no Descubra Januária e gostaria de agendar um roteiro.`}
                        onClick={() => trackClick('guias', guia.id, 'whatsapp')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 sm:py-3 rounded-xl font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-primary/90 active:scale-[0.98] transition-all"
                      >
                        <MessageCircle size={13} />
                        <span className="hidden sm:inline">WhatsApp</span>
                        <span className="sm:hidden">Contato</span>
                      </a>

                      {guia.hasDetailedItinerary && (
                        <Link
                          href="/guias/peruacu"
                          className="flex items-center justify-center w-10 bg-surface-container rounded-xl text-on-surface-variant hover:bg-secondary hover:text-white transition-all"
                          title="Ver Roteiro"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}
                    </div>
                    {(guia.instagramUrl || guia.websiteUrl) && (
                      <div className="flex gap-1.5">
                        {guia.instagramUrl && (
                          <a href={guia.instagramUrl} onClick={() => trackClick('guias', guia.id, 'instagram')} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-pink-600 text-white py-2.5 rounded-xl font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-pink-700 active:scale-[0.98] transition-all">
                            <Instagram size={13} /> Instagram
                          </a>
                        )}
                        {guia.websiteUrl && (
                          <a href={guia.websiteUrl} onClick={() => trackClick('guias', guia.id, 'website')} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 active:scale-[0.98] transition-all">
                            <Globe size={13} /> Site
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
        </div>

        {/* Estado Vazio */}
        {filteredGuias.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant/40">
              <Users size={24} />
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface uppercase mb-2">Nenhum guia encontrado</h3>
            <p className="font-sans text-xs text-on-surface-variant mb-5">Tente outra especialidade.</p>
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
          CTA COMPACTO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pb-16">
        <div className="relative bg-primary rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" 
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
          />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent" />

          <div className="relative z-10 p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Award size={14} className="text-secondary" />
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">Oportunidade</span>
              </div>
              <h2 className="font-headline text-xl sm:text-2xl font-bold text-white uppercase leading-tight mb-2">
                Você é guia local?
              </h2>
              <p className="font-sans text-white/80 text-xs sm:text-sm leading-relaxed max-w-md">
                Cadastre-se e conecte-se com turistas que buscam experiências autênticas.
              </p>
            </div>
            <button className="w-full sm:w-auto bg-white text-primary px-7 py-3.5 rounded-xl font-sans text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-secondary hover:text-white transition-colors duration-300 whitespace-nowrap shadow-lg">
              Cadastrar Perfil
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
