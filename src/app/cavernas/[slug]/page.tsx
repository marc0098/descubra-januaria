import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, Mountain, Map, Compass, Anchor, Palmtree, Camera, Palette, Info } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

import { fetchDocumentById, fetchDocumentBySlug } from '@/lib/firestore-rest';

export const revalidate = 60; // Cache de 60 segundos (ISR)

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

async function getAtrativoData(slug: string): Promise<any> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    
    let data = await fetchDocumentById('atrativos', decodedSlug);
    if (data) return data;

    data = await fetchDocumentBySlug('atrativos', decodedSlug);
    if (data) return data;
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar atrativo no servidor:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getAtrativoData(resolvedParams.slug);
  
  if (!data) return { title: 'Atrativo não encontrado' };

  const nome = data.nome || 'Atrativo do Parque';
  const descricao = data.descricao || '';
  const imagem = data.imagem || '';

  return {
    title: `${nome} | Descubra Januária`,
    description: descricao,
    openGraph: {
      title: `${nome} | Descubra Januária`,
      description: descricao,
      images: imagem ? [imagem] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: nome,
      description: descricao,
      images: imagem ? [imagem] : [],
    }
  };
}

export default async function AtrativoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const item = await getAtrativoData(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const nome = item.nome || 'Atrativo Sem Nome';
  const categoria = item.categoria || 'Caverna';
  const descricao = item.descricao || '';
  const imagemPrincipal = item.imagem || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=800';
  const trilha = item.trilha || '';
  const dificuldade = item.dificuldade || '';
  const corTema = item.cor_tema || 'bg-primary';
  const textTema = item.text_tema || 'text-white';
  const iconeNome = item.icone || 'Mountain';
  
  const IconComponent = iconMap[iconeNome] || Mountain;

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <MobileNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link href="/cavernas" className="inline-flex items-center gap-2 text-primary font-sans text-sm font-bold uppercase tracking-wider mb-6 hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Voltar para o Parque
        </Link>

        <div className="bg-surface rounded-3xl lg:rounded-[32px] border border-outline-variant/30 overflow-hidden shadow-2xl">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] bg-surface-container">
            <img
              src={imagemPrincipal}
              alt={nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            
            <div className={`absolute top-6 left-6 ${corTema} px-5 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg`}>
              {categoria}
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight max-w-2xl">
                {nome}
              </h1>
              <div className={`hidden sm:flex p-4 rounded-2xl ${corTema} text-white shadow-xl backdrop-blur-md bg-opacity-90`}>
                <IconComponent size={32} />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 md:p-12 flex flex-col gap-8">
            <div className="sm:hidden flex items-center justify-between mb-2">
              <div className={`p-3 rounded-xl ${corTema} text-white shadow-md`}>
                <IconComponent size={24} />
              </div>
            </div>

            <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {descricao}
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-2">
              <div className="bg-surface-container p-5 sm:p-6 rounded-2xl border border-outline-variant/30">
                <span className="block text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest mb-2">Extensão da Trilha</span>
                <span className="font-sans text-lg sm:text-xl font-bold text-primary">{trilha}</span>
              </div>
              <div className="bg-surface-container p-5 sm:p-6 rounded-2xl border border-outline-variant/30">
                <span className="block text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest mb-2">Nível de Dificuldade</span>
                <span className={`font-sans text-lg sm:text-xl font-bold ${textTema}`}>{dificuldade}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-8 border-t border-outline-variant/30">
              <Link href="/guias" className={`flex-1 ${corTema} text-white py-4 sm:py-5 rounded-2xl sm:rounded-full font-sans text-sm font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3 group/btn shadow-xl`}>
                Agendar Passeio
                <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
