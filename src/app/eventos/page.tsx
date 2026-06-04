import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import EventosClient, { Evento } from './EventosClient';

export const revalidate = 60; // ISR cache for 60 seconds

const mesesOrdem = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default async function EventosPage() {
  let initialEventos: Evento[] = [];
  let initialConfig = {
    title: 'Eventos',
    subtitle: 'Calendário completo das tradições e festas de Januária.'
  };

  try {
    const configSnap = await getDoc(doc(db, 'configuracoes', 'global'));
    if (configSnap.exists()) {
      const data = configSnap.data();
      initialConfig = {
        title: data.eventosPageTitle || initialConfig.title,
        subtitle: data.eventosPageSubtitle || initialConfig.subtitle
      };
    }
  } catch (error) {
    console.warn("Could not fetch global config on server:", error);
  }

  try {
    const eventosSnap = await getDocs(collection(db, 'eventos'));
    initialEventos = eventosSnap.docs.map(doc => {
      const data = doc.data();
      
      let mesStr = 'Janeiro';
      if (data.data) {
        const monthIndex = parseInt(data.data.split('-')[1]) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          mesStr = mesesOrdem[monthIndex];
        }
      }

      let dataStr = data.data;
      if (data.data && data.data.includes('-')) {
        const parts = data.data.split('-');
        dataStr = `${parts[2]}/${parts[1]}`;
      }

      return {
        id: doc.id,
        slug: (data.slug && /^[a-zA-Z0-9_-]+$/.test(data.slug)) ? data.slug : doc.id,
        nome: data.nome || 'Sem nome',
        tipo: data.tipo || 'Festa Popular',
        data: dataStr || '',
        mes: data.mes || mesStr,
        horario: data.horario || '',
        local: data.local || '',
        descricao: data.descricao || '',
        imagem: data.imagem || '',
        Highlights: data.Highlights || [],
        instagramUrl: data.instagramUrl || '',
        websiteUrl: data.websiteUrl || ''
      } as Evento;
    });
  } catch (error) {
    console.error("Error fetching eventos on server:", error);
  }

  return <EventosClient initialEventos={initialEventos} initialConfig={initialConfig} />;
}
