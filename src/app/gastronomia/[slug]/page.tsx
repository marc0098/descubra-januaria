import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Instagram, Globe, Phone, ArrowLeft, MapPin, Utensils } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

export const revalidate = 60; // Cache de 60 segundos (ISR)

async function getGastronomiaData(slug: string): Promise<any> {
  try {
    const docRef = doc(db, 'gastronomia', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };

    const q = query(collection(db, 'gastronomia'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar gastronomia no servidor:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getGastronomiaData(params.slug);
  
  if (!data) return { title: 'Item não encontrado' };

  const nome = data.nome || data.name || 'Gastronomia';
  const descricao = data.descricao || data.sobre || '';
  const imagem = (data.imagens && data.imagens[0]) || (data.fotos && data.fotos[0]) || '';

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

export default async function GastronomiaSlugPage({ params }: { params: { slug: string } }) {
  const item = await getGastronomiaData(params.slug);

  if (!item) {
    notFound();
  }

  const nome = item.nome || item.name || 'Sem nome';
  const tipo = item.tipo || 'Restaurante';
  const descricao = item.descricao || item.sobre || '';
  const endereco = item.endereco || '';
  const onde_encontrar = item.onde_encontrar || item.endereco || '';
  const telefone = item.telefone || '';
  const especialidade = item.especialidade || '';
  const fotos = item.imagens && item.imagens.length > 0 ? item.imagens : (item.fotos || []);
  const imagemPrincipal = fotos[0] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800';

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <MobileNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link href="/gastronomia" className="inline-flex items-center gap-2 text-primary font-sans text-sm font-bold uppercase tracking-wider mb-6 hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Voltar para Gastronomia
        </Link>

        <div className="bg-surface rounded-3xl border border-outline-variant/30 overflow-hidden shadow-2xl">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] bg-surface-container">
            <img
              src={imagemPrincipal}
              alt={nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-outline-variant/20">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {tipo}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tipo === 'Restaurante' && endereco && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{endereco}</span>
                </div>
              )}
              {tipo !== 'Restaurante' && onde_encontrar && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{onde_encontrar}</span>
                </div>
              )}
              {telefone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{telefone}</span>
                </div>
              )}
              {especialidade && (
                <div className="flex items-start gap-3">
                  <Utensils size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{especialidade}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {item.instagramUrl && (
                <a href={item.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-pink-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-pink-700 active:scale-[0.98] transition-all">
                  <Instagram size={18} /> Instagram Oficial
                </a>
              )}
              {item.websiteUrl && (
                <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-blue-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all">
                  <Globe size={18} /> Acessar Site
                </a>
              )}
              {telefone && (
                <a href={`https://wa.me/${telefone.replace(/\D/g, '')}?text=Olá ${nome}, vi seu perfil no Descubra Januária e gostaria de fazer um pedido ou reserva.`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-primary text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all">
                  <Phone size={18} /> Fazer Pedido / Reserva
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
