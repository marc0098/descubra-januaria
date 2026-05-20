"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Upload, Loader2, Image as ImageIcon, Trash2, Mountain, LayoutTemplate, Bed, Utensils } from 'lucide-react';

type BannerTipo = 'hero' | 'hero_desktop' | 'atrativos' | 'cavernas' | 'hospedagem' | 'gastronomia';

interface Banner {
  id: string;
  url: string;
  tipo: BannerTipo;
  titulo: string;
}

const getTitulo = (tipo: BannerTipo): string => {
  const titulos: Record<BannerTipo, string> = {
    hero: 'Hero Mobile',
    hero_desktop: 'Hero Desktop',
    atrativos: 'Seção Atrativos',
    cavernas: 'Seção Cavernas',
    hospedagem: 'Seção Hospedagem',
    gastronomia: 'Seção Gastronomia'
  };
  return titulos[tipo];
};

const bannerData = [
  { tipo: 'hero' as BannerTipo, titulo: 'Hero Mobile', descricao: 'Imagem principal do topo (mobile)', tamanho: '1920x1080' },
  { tipo: 'hero_desktop' as BannerTipo, titulo: 'Hero Desktop', descricao: 'Imagem principal do topo (desktop)', tamanho: '1920x1080' },
  { tipo: 'atrativos' as BannerTipo, titulo: 'Seção Atrativos', descricao: 'Background da seção de atrativos na home', tamanho: '1920x800' },
  { tipo: 'cavernas' as BannerTipo, titulo: 'Seção Cavernas', descricao: 'Banner da seção Cavernas na home', tamanho: '1200x400' },
  { tipo: 'hospedagem' as BannerTipo, titulo: 'Seção Hospedagem', descricao: 'Background da seção Hospedagem na home', tamanho: '1920x800' },
  { tipo: 'gastronomia' as BannerTipo, titulo: 'Seção Gastronomia', descricao: 'Background da seção Gastronomia na home', tamanho: '1920x800' }
];

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    try {
      const tipos: BannerTipo[] = ['hero', 'hero_desktop', 'atrativos', 'cavernas', 'hospedagem', 'gastronomia'];
      const data: Banner[] = [];
      for (const tipo of tipos) {
        try {
          const docSnap = await getDoc(doc(db, 'banners', tipo));
          if (docSnap.exists() && docSnap.data().url) {
            data.push({ id: tipo, url: docSnap.data().url, tipo, titulo: getTitulo(tipo) });
          }
        } catch (error) { console.warn(`Erro ao buscar banner ${tipo}:`, error); }
      }
      setBanners(data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleUpload = async (tipo: BannerTipo, file: File) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `banners/${tipo}_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await setDoc(doc(db, 'banners', tipo), { url });
      fetchBanners();
    } catch (error) {
      console.error('Error:', error);
      if (typeof window !== 'undefined') alert('Erro ao fazer upload. Tente novamente.');
    } finally { setUploading(false); }
  };

  const handleDelete = async (tipo: BannerTipo) => {
    if (typeof window !== 'undefined' && window.confirm(`Remover "${getTitulo(tipo)}"?`)) {
      setSaving(true);
      try {
        await setDoc(doc(db, 'banners', tipo), { url: '' });
        fetchBanners();
      } catch (error) { console.error('Error:', error); }
      finally { setSaving(false); }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-headline mb-1">Imagens da Home</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-sans">Gerencie as imagens exibidas na página inicial</p>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bannerData.map(item => {
            const banner = banners.find(b => b.tipo === item.tipo);
            return (
              <div key={item.tipo} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="bg-gray-50 dark:bg-zinc-800/50 px-5 py-3 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
                  {item.tipo === 'cavernas' ? <Mountain className="w-5 h-5 text-orange-600" /> 
                  : item.tipo === 'hospedagem' ? <Bed className="w-5 h-5 text-cyan-600" />
                  : item.tipo === 'gastronomia' ? <Utensils className="w-5 h-5 text-green-700" />
                  : <LayoutTemplate className="w-5 h-5 text-blue-600" />}
                  <h2 className="font-semibold text-gray-900 dark:text-white font-sans">{item.titulo}</h2>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-sans">{item.descricao}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 font-sans">Tamanho: <strong>{item.tamanho}</strong></p>

                  {banner?.url ? (
                    <div className="space-y-3">
                      <div className="relative aspect-video bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                        <img src={banner.url} alt={item.titulo} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer text-sm font-semibold font-sans transition-colors">
                          <Upload className="w-4 h-4" /><span>Alterar Imagem</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(item.tipo, e.target.files[0])} />
                        </label>
                        <button onClick={() => handleDelete(item.tipo)} className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-sans transition-colors">
                          <Trash2 className="w-4 h-4" />Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition">
                      <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-sans">Clique para enviar imagem</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(item.tipo, e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(saving || uploading) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 flex items-center gap-4 shadow-2xl border border-gray-200 dark:border-zinc-800">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="font-sans text-gray-900 dark:text-white font-semibold">Enviando imagem...</span>
          </div>
        </div>
      )}
    </div>
  );
}
