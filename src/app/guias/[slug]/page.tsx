import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Instagram, Globe, MessageCircle, ArrowLeft, Star, Shield, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

export const revalidate = 60; // Cache de 60 segundos (ISR)

async function getGuiaData(slug: string): Promise<any> {
  try {
    const docRef = doc(db, 'guias', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };

    const q = query(collection(db, 'guias'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar guia no servidor:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getGuiaData(resolvedParams.slug);
  
  if (!data) return { title: 'Guia não encontrado' };

  const nome = data.nome || data.name || 'Guia de Turismo';
  const descricao = data.especialidades ? data.especialidades.join(', ') : (data.specialty || data.descricao || '');
  const imagem = data.foto || data.image || '';

  return {
    title: `${nome} - Guia | Descubra Januária`,
    description: `Guia de turismo em Januária: ${descricao}`,
    openGraph: {
      title: `${nome} - Guia | Descubra Januária`,
      description: `Guia de turismo em Januária: ${descricao}`,
      images: imagem ? [imagem] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: nome,
      description: `Guia de turismo em Januária: ${descricao}`,
      images: imagem ? [imagem] : [],
    }
  };
}

export default async function GuiaSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const guia = await getGuiaData(resolvedParams.slug);

  if (!guia) {
    notFound();
  }

  const nome = guia.nome || guia.name || 'Guia sem nome';
  const especialidade = guia.especialidades ? guia.especialidades.join(', ') : (guia.specialty || guia.descricao || '');
  const category = guia.category || 'Guia';
  const rating = guia.rating || 5;
  const whatsapp = guia.whatsapp || '';
  const imagem = guia.foto || guia.image || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=800';

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <MobileNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link href="/guias" className="inline-flex items-center gap-2 text-primary font-sans text-sm font-bold uppercase tracking-wider mb-6 hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Voltar para Guias
        </Link>

        <div className="bg-surface rounded-3xl border border-outline-variant/30 overflow-hidden shadow-2xl">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] bg-surface-container">
            <img
              src={imagem}
              alt={nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            
            <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
              <Star className="text-quaternary fill-quaternary" size={14} />
              <span className="font-sans text-xs font-black text-on-surface">{rating}</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 flex flex-col gap-6 -mt-16 sm:-mt-24 relative z-10">
            <div className="bg-surface p-6 rounded-2xl shadow-lg border border-outline-variant/30">
              <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-secondary">
                {category}
              </span>
              <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface leading-tight mt-1">
                {nome}
              </h1>

              <div className="flex items-center gap-4 mt-4 text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  <span className="font-sans text-sm font-medium">ICMBio Autorizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="font-sans text-sm font-medium">Januária</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-2xl p-6">
              <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-primary mb-3">Especialidades</h2>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                {especialidade}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}?text=Olá ${nome}, vi seu perfil no Descubra Januária e gostaria de agendar um roteiro.`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-primary text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all">
                  <MessageCircle size={18} /> Contatar via WhatsApp
                </a>
              )}
              {guia.hasDetailedItinerary && (
                <Link href="/guias/peruacu" className="flex-1 flex items-center justify-center gap-2.5 bg-secondary text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-secondary/90 active:scale-[0.98] transition-all">
                  <ExternalLink size={18} /> Ver Roteiro Detalhado
                </Link>
              )}
            </div>

            {(guia.instagramUrl || guia.websiteUrl) && (
              <div className="flex flex-col sm:flex-row gap-3">
                {guia.instagramUrl && (
                  <a href={guia.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-pink-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-pink-700 active:scale-[0.98] transition-all">
                    <Instagram size={18} /> Instagram Oficial
                  </a>
                )}
                {guia.websiteUrl && (
                  <a href={guia.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-blue-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all">
                    <Globe size={18} /> Acessar Site
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
