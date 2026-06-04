import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EstadiasClient, { Hotel } from './EstadiasClient';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function EstadiasPage() {
  let initialHoteis: Hotel[] = [];
  let initialConfig = {
    title: 'Hospedagem',
    subtitle: 'Encontre a hospedagem perfeita para sua viagem.'
  };

  try {
    const configSnap = await getDoc(doc(db, 'configuracoes', 'global'));
    if (configSnap.exists()) {
      const data = configSnap.data();
      initialConfig = {
        title: data.hospedagemPageTitle || initialConfig.title,
        subtitle: data.hospedagemPageSubtitle || initialConfig.subtitle
      };
    }
  } catch (error) {
    console.warn("Could not fetch global config on server:", error);
  }

  try {
    const hoteisSnap = await getDocs(collection(db, 'hoteis'));
    initialHoteis = hoteisSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
        nome: data.nome || 'Sem nome',
        categoria: data.categoria || 'Centro',
        endereco: data.endereco || '',
        telefone: data.telefone || '',
        sobre: data.descricao || data.sobre || '',
        fotos: data.imagens && data.imagens.length > 0 ? data.imagens : (data.fotos || []),
        redes_sociais: data.redes_sociais || '',
        distancia_parque: data.distancia_parque || '',
        instagramUrl: data.instagramUrl || '',
        websiteUrl: data.websiteUrl || ''
      } as Hotel;
    }).sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error("Error fetching estadias on server:", error);
  }

  return <EstadiasClient initialHoteis={initialHoteis} initialConfig={initialConfig} />;
}
