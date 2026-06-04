import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GastronomiaClient, { GastronomiaItem } from './GastronomiaClient';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function GastronomiaPage() {
  let initialGastronomia: GastronomiaItem[] = [];
  let initialConfig = {
    title: 'Gastronomia',
    subtitle: 'Sabores únicos da culinária mineira e regional.'
  };

  try {
    const configSnap = await getDoc(doc(db, 'configuracoes', 'global'));
    if (configSnap.exists()) {
      const data = configSnap.data();
      initialConfig = {
        title: data.gastronomiaPageTitle || initialConfig.title,
        subtitle: data.gastronomiaPageSubtitle || initialConfig.subtitle
      };
    }
  } catch (error) {
    console.warn("Could not fetch global config on server:", error);
  }

  try {
    const gastSnap = await getDocs(collection(db, 'gastronomia'));
    initialGastronomia = gastSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
        tipo: data.tipo || 'Restaurante',
        nome: data.nome || data.name || 'Sem nome',
        descricao: data.descricao || data.sobre || '',
        sobre: data.descricao || data.sobre || '',
        onde_encontrar: data.onde_encontrar || data.endereco || '',
        endereco: data.endereco || '',
        telefone: data.telefone || '',
        especialidade: data.especialidade || '',
        fotos: data.imagens && data.imagens.length > 0 ? data.imagens : (data.fotos || []),
        redes_sociais: data.redes_sociais || '',
        instagramUrl: data.instagramUrl || '',
        websiteUrl: data.websiteUrl || ''
      };
    }).sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error("Error fetching gastronomia on server:", error);
  }

  return <GastronomiaClient initialGastronomia={initialGastronomia} initialConfig={initialConfig} />;
}
