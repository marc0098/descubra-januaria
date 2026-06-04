import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Instagram, Globe, Compass, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

async function getPontoData(slug: string): Promise<any> {
  try {
    // 1. Tentar buscar por ID
    const docRef = doc(db, 'pontos', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };

    // 2. Tentar buscar pelo campo slug
    const q = query(collection(db, 'pontos'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar ponto no servidor:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPontoData(params.slug);
  
  if (!data) return { title: 'Ponto não encontrado' };

  const nome = data.nome || data.title || 'Ponto Turístico';
  const descricao = data.descricao || data.content || '';
  const imagem = data.imagem || (data.images && data.images[0]) || '';

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

export default async function PontoSlugPage({ params }: { params: { slug: string } }) {
  const ponto = await getPontoData(params.slug);

  if (!ponto) {
    notFound();
  }

  const nome = ponto.nome || ponto.title || 'Ponto sem nome';
  const categoria = ponto.categoria || ponto.category || 'Natural';
  const descricao = ponto.descricao || ponto.content || '';
  const imagens = ponto.images || (ponto.imagem ? [ponto.imagem] : []);
  const imagemPrincipal = imagens[0] || '';

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <MobileNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link href="/pontos" className="inline-flex items-center gap-2 text-primary font-sans text-sm font-bold uppercase tracking-wider mb-6 hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Voltar para Pontos
        </Link>

        <div className="bg-surface rounded-3xl border border-outline-variant/30 overflow-hidden shadow-2xl">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] bg-surface-container">
            {imagemPrincipal && (
              <img
                src={imagemPrincipal}
                alt={nome}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-outline-variant/20">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                {categoria}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 flex flex-col gap-6">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
              {nome}
            </h1>

            <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {descricao}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {ponto.instagramUrl && (
                <a href={ponto.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-pink-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-pink-700 active:scale-[0.98] transition-all">
                  <Instagram size={18} /> Instagram Oficial
                </a>
              )}
              {ponto.websiteUrl && (
                <a href={ponto.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-blue-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all">
                  <Globe size={18} /> Acessar Site
                </a>
              )}
              <Link href="/guias" className="flex-1 flex items-center justify-center gap-2.5 bg-primary text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all">
                <Compass size={18} /> Visitar com Guia
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
