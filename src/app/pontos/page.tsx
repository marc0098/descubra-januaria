import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PontosClient, { PontoTuristico } from './PontosClient';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function PontosPage() {
  let initialPontos: PontoTuristico[] = [];
  let initialConfig = {
    title: 'Pontos Turísticos',
    subtitle: 'Explore a história, natureza e cultura de Januária.'
  };

  try {
    const configSnap = await getDoc(doc(db, 'configuracoes', 'global'));
    if (configSnap.exists()) {
      const data = configSnap.data();
      initialConfig = {
        title: data.pontosPageTitle || initialConfig.title,
        subtitle: data.pontosPageSubtitle || initialConfig.subtitle
      };
    }
  } catch (error) {
    console.warn("Could not fetch global config on server:", error);
  }

  try {
    const pontosSnap = await getDocs(collection(db, 'pontos'));
    initialPontos = pontosSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
        nome: data.nome || data.title || 'Ponto sem nome',
        categoria: data.categoria || data.category || 'Natural',
        category: data.categoria || data.category || 'Natural',
        descricao: data.descricao || data.content || '',
        imagem: data.imagem || (data.images && data.images[0]) || '',
        images: data.images || (data.imagem ? [data.imagem] : []),
        instagramUrl: data.instagramUrl || '',
        websiteUrl: data.websiteUrl || ''
      };
    }).sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  } catch (error) {
    console.error("Error fetching pontos on server:", error);
  }

  return <PontosClient initialPontos={initialPontos} initialConfig={initialConfig} />;
}
