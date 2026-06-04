import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CavernasClient, { Atrativo } from './CavernasClient';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function CavernasPage() {
  let initialAtrativos: Atrativo[] = [];
  let initialConfig = {
    title: 'Cavernas do Peruaçu',
    subtitle: 'O Parque Nacional Cavernas do Peruaçu é um dos patrimônios naturais mais impressionantes do Brasil. Com mais de 140 cavernas catalogadas e pinturas rupestres de até 12.000 anos, é patrimônio mundial da UNESCO desde 2025. Explore abaixo os principais roteiros disponíveis.'
  };

  try {
    const configSnap = await getDoc(doc(db, 'configuracoes', 'global'));
    if (configSnap.exists()) {
      const data = configSnap.data();
      initialConfig = {
        title: data.cavernasPageTitle || initialConfig.title,
        subtitle: data.cavernasPageSubtitle || initialConfig.subtitle
      };
    }
  } catch (error) {
    console.warn("Could not fetch global config on server:", error);
  }

  try {
    const atrativosSnap = await getDocs(collection(db, 'atrativos'));
    initialAtrativos = atrativosSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
        nome: data.nome || '',
        categoria: data.categoria || '',
        descricao: data.descricao || '',
        imagem: data.imagem || '',
        trilha: data.trilha || '',
        dificuldade: data.dificuldade || '',
        cor_tema: data.cor_tema || 'bg-primary',
        text_tema: data.text_tema || 'text-white',
        border_tema: data.border_tema || 'border-primary',
        icone: data.icone || 'Mountain'
      } as Atrativo;
    });
  } catch (error) {
    console.error("Error fetching atrativos on server:", error);
  }

  return <CavernasClient initialAtrativos={initialAtrativos} initialConfig={initialConfig} />;
}
