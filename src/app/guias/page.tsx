import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GuiasClient, { Guia } from './GuiasClient';

export const revalidate = 60; // ISR cache for 60 seconds

export default async function GuiasPage() {
  let initialGuias: Guia[] = [];
  let initialConfig = {
    title: 'Guias',
    subtitle: 'Especialistas nativos para sua jornada em Januária.'
  };

  try {
    const configSnap = await getDoc(doc(db, 'configuracoes', 'global'));
    if (configSnap.exists()) {
      const data = configSnap.data();
      initialConfig = {
        title: data.guiasPageTitle || initialConfig.title,
        subtitle: data.guiasPageSubtitle || initialConfig.subtitle
      };
    }
  } catch (error) {
    console.warn("Could not fetch global config on server:", error);
  }

  try {
    const guiasSnap = await getDocs(collection(db, 'guias'));
    initialGuias = guiasSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
        name: data.nome || data.name || 'Guia sem nome',
        specialty: data.especialidades ? data.especialidades.join(', ') : (data.specialty || data.descricao || ''),
        category: data.category || 'Guia',
        rating: data.rating || 5,
        reviews: data.reviews || 0,
        whatsapp: data.whatsapp || '',
        image: data.foto || data.image || '',
        hasDetailedItinerary: data.hasDetailedItinerary || false,
        instagramUrl: data.instagramUrl || '',
        websiteUrl: data.websiteUrl || ''
      } as Guia;
    }).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching guias on server:", error);
  }

  return <GuiasClient initialGuias={initialGuias} initialConfig={initialConfig} />;
}
