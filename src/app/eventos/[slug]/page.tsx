import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Instagram, Globe, Calendar, ArrowLeft, MapPin, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';
import { fetchDocumentById, fetchDocumentBySlug } from '@/lib/firestore-rest';

export const revalidate = 60; // Cache de 60 segundos (ISR)

async function getEventoData(slug: string): Promise<any> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    
    let data = await fetchDocumentById('eventos', decodedSlug);
    if (data) return data;

    data = await fetchDocumentBySlug('eventos', decodedSlug);
    if (data) return data;
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar evento no servidor:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getEventoData(resolvedParams.slug);
  
  if (!data) return { title: 'Evento não encontrado' };

  const nome = data.nome || 'Evento';
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

export default async function EventoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const evento = await getEventoData(resolvedParams.slug);

  if (!evento) {
    notFound();
  }

  const nome = evento.nome || 'Sem nome';
  const tipo = evento.tipo || 'Evento';
  const mes = evento.mes || '';
  const data = evento.data || '';
  const horario = evento.horario || '';
  const local = evento.local || '';
  const descricao = evento.descricao || '';
  const imagemPrincipal = evento.imagem || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800';

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <MobileNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link href="/eventos" className="inline-flex items-center gap-2 text-quaternary font-sans text-sm font-bold uppercase tracking-wider mb-6 hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Voltar para Eventos
        </Link>

        <div className="bg-surface rounded-3xl border border-outline-variant/30 overflow-hidden shadow-2xl">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] bg-surface-container">
            <img
              src={imagemPrincipal}
              alt={nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-outline-variant/20 flex gap-2">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-quaternary">
                {tipo}
              </span>
              <span className="font-sans text-[10px] text-on-surface-variant">·</span>
              <span className="font-sans text-[10px] font-bold text-on-surface">{mes}</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 flex flex-col gap-6">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
              {nome}
            </h1>

            <div className="flex flex-wrap gap-4 text-on-surface-variant">
              {data && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-quaternary" />
                  <span className="font-sans text-base">{data}</span>
                </div>
              )}
              {horario && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-quaternary" />
                  <span className="font-sans text-base">{horario}</span>
                </div>
              )}
            </div>

            {local && (
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-quaternary mt-0.5 shrink-0" />
                <span className="font-sans text-base text-on-surface-variant">{local}</span>
              </div>
            )}

            <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {descricao}
            </p>

            {evento.Highlights && evento.Highlights.length > 0 && (
              <div className="pt-4 border-t border-outline-variant/30">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-quaternary mb-3 block">O que você encontra</span>
                <div className="flex flex-wrap gap-2">
                  {evento.Highlights.map((item: string, idx: number) => (
                    <span key={idx} className="bg-surface-container px-4 py-2 rounded-full font-sans text-xs text-on-surface-variant">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {evento.instagramUrl && (
                <a href={evento.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-pink-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-pink-700 active:scale-[0.98] transition-all">
                  <Instagram size={18} /> Instagram Oficial
                </a>
              )}
              {evento.websiteUrl && (
                <a href={evento.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-blue-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all">
                  <Globe size={18} /> Acessar Site
                </a>
              )}
              <a href="https://wa.me/5538992664400?text=Olá, gostaria de informações sobre eventos em Januária." target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-quaternary text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-quaternary/90 active:scale-[0.98] transition-all">
                <Calendar size={18} /> Mais informações
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
