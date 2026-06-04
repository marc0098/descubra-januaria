import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Instagram, Globe, Phone, ArrowLeft, MapPin, Bed, Star } from 'lucide-react';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

export const revalidate = 60; // Cache de 60 segundos (ISR)

async function getHotelData(slug: string): Promise<any> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const docRef = doc(db, 'hoteis', decodedSlug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };

    const q = query(collection(db, 'hoteis'), where('slug', '==', decodedSlug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() };
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar hotel no servidor:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getHotelData(resolvedParams.slug);
  
  if (!data) return { title: 'Hotel não encontrado' };

  const nome = data.nome || 'Hotel';
  const descricao = data.descricao || data.sobre || '';
  const imagem = (data.imagens && data.imagens[0]) || (data.fotos && data.fotos[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';

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

export default async function EstadiaSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const hotel = await getHotelData(resolvedParams.slug);

  if (!hotel) {
    notFound();
  }

  const nome = hotel.nome || 'Sem nome';
  const categoria = hotel.categoria || 'Centro';
  const endereco = hotel.endereco || '';
  const telefone = hotel.telefone || '';
  const sobre = hotel.descricao || hotel.sobre || '';
  const fotos = hotel.imagens && hotel.imagens.length > 0 ? hotel.imagens : (hotel.fotos || []);
  const imagemPrincipal = fotos[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <MobileNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Link href="/estadias" className="inline-flex items-center gap-2 text-primary font-sans text-sm font-bold uppercase tracking-wider mb-6 hover:opacity-80 transition-opacity">
          <ArrowLeft size={16} /> Voltar para Hospedagem
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
                {categoria}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10 flex flex-col gap-6">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
              {nome}
            </h1>

            <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
              {sobre}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {endereco && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{endereco}</span>
                </div>
              )}
              {telefone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{telefone}</span>
                </div>
              )}
              {hotel.distancia_parque && (
                <div className="flex items-start gap-3">
                  <Bed size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{hotel.distancia_parque} do Parque</span>
                </div>
              )}
              {hotel.redes_sociais && (
                <div className="flex items-start gap-3">
                  <Star size={18} className="text-primary mt-0.5" />
                  <span className="font-sans text-sm text-on-surface-variant">{hotel.redes_sociais}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {hotel.instagramUrl && (
                <a href={hotel.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-pink-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-pink-700 active:scale-[0.98] transition-all">
                  <Instagram size={18} /> Instagram Oficial
                </a>
              )}
              {hotel.websiteUrl && (
                <a href={hotel.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-blue-600 text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all">
                  <Globe size={18} /> Acessar Site
                </a>
              )}
              {telefone && (
                <a href={`https://wa.me/${telefone.replace(/\D/g, '')}?text=Olá ${nome}, vi seu perfil no Descubra Januária e gostaria de fazer uma reserva.`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2.5 bg-primary text-white py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all">
                  <Phone size={18} /> Reservar
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
