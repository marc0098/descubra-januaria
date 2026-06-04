import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type ClickType = 'whatsapp' | 'instagram' | 'website';

/**
 * Registra um clique de lead no Firestore.
 * Utiliza o increment(1) para economizar dados e evitar conflitos.
 * @param collectionName A coleção do item (ex: 'gastronomia', 'hoteis')
 * @param id O ID do documento
 * @param type O tipo de clique (whatsapp, instagram ou website)
 */
export const trackClick = async (collectionName: string, id: string, type: ClickType) => {
  if (!id) return;

  try {
    // Verifica a trava de segurança
    const configSnap = await getDoc(doc(db, 'configuracoes', 'global'));
    if (configSnap.exists() && configSnap.data().analyticsEnabled === false) {
      console.log(`[Analytics] Ignorado: Analytics desativado globalmente.`);
      return;
    }

    const docRef = doc(db, collectionName, id);
    
    // Incrementa apenas o contador especifico
    // E.g. analytics.whatsapp: increment(1)
    await updateDoc(docRef, {
      [`analytics.${type}`]: increment(1),
      [`analytics.total`]: increment(1)
    });
    
    console.log(`[Analytics] Registrado clique em ${type} para ${collectionName}/${id}`);
  } catch (error) {
    // Falhas de analytics não devem quebrar a experiência do usuário, então apenas logamos
    console.error(`[Analytics] Erro ao registrar clique em ${collectionName}/${id}:`, error);
  }
};
