import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Upload, Loader2, Image, Trash2, Mountain, LayoutTemplate, Bed, Utensils } from 'lucide-react';

type BannerTipo = 'hero' | 'hero_desktop' | 'atrativos' | 'cavernas' | 'hospedagem' | 'gastronomia';

interface Banner {
  id: string;
  url: string;
  tipo: BannerTipo;
  titulo: string;
}

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
            data.push({ 
              id: tipo, 
              url: docSnap.data().url, 
              tipo,
              titulo: getTitulo(tipo)
            });
          }
        } catch (error) {
          console.warn(`Erro ao buscar banner ${tipo}:`, error);
        }
      }
      setBanners(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      alert('Erro ao fazer upload. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (tipo: BannerTipo) => {
    if (confirm(`Tem certeza que deseja remover "${getTitulo(tipo)}"?`)) {
      setSaving(true);
      try {
        await setDoc(doc(db, 'banners', tipo), { url: '' });
        fetchBanners();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const bannerData = [
    { tipo: 'hero' as BannerTipo, titulo: 'Hero Mobile', descricao: 'Imagem principal do topo (exibida em mobile)', tamanho: '1920x1080' },
    { tipo: 'hero_desktop' as BannerTipo, titulo: 'Hero Desktop', descricao: 'Imagem principal do topo (exibida em desktop)', tamanho: '1920x1080' },
    { tipo: 'atrativos' as BannerTipo, titulo: 'Seção Atrativos', descricao: 'Background da seção de atrativos na home', tamanho: '1920x800' },
    { tipo: 'cavernas' as BannerTipo, titulo: 'Seção Cavernas do Peruaçu', descricao: 'Banner da seção Cavernas na home', tamanho: '1200x400' },
    { tipo: 'hospedagem' as BannerTipo, titulo: 'Seção Hospedagem', descricao: 'Background da seção Hospedagem na home', tamanho: '1920x800' },
    { tipo: 'gastronomia' as BannerTipo, titulo: 'Seção Gastronomia', descricao: 'Background da seção Gastronomia na home', tamanho: '1920x800' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Imagens da Home</h1>
      <p className="text-sm text-gray-500 mb-6">Gerencie as imagens exibidas na página inicial</p>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bannerData.map(item => {
            const banner = banners.find(b => b.tipo === item.tipo);
            return (
              <div key={item.tipo} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                  {item.tipo === 'cavernas' ? <Mountain className="w-5 h-5 text-tertiary" /> : item.tipo === 'hospedagem' ? <Bed className="w-5 h-5 text-quaternary" /> : item.tipo === 'gastronomia' ? <Utensils className="w-5 h-5 text-[#264b27]" /> : <LayoutTemplate className="w-5 h-5 text-blue-600" />}
                  <h2 className="font-semibold text-gray-900">{item.titulo}</h2>
                </div>
                
                <div className="p-5">
                  <p className="text-xs text-gray-500 mb-3">{item.descricao}</p>
                  <p className="text-xs text-gray-400 mb-4">Tamanho recomendado: {item.tamanho}</p>
                  
                  {banner?.url ? (
                    <div className="space-y-3">
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img src={banner.url} alt={item.titulo} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm font-medium">
                          <Upload className="w-4 h-4" />
                          <span>Alterar Imagem</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(item.tipo, e.target.files[0])} />
                        </label>
                        <button onClick={() => handleDelete(item.tipo)} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition">
                      <Image className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Clique para enviar imagem</span>
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}