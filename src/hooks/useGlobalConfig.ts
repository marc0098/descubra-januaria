"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GlobalConfig {
  // Home
  homeTitle: string;
  homeSubtitle: string;
  
  // Welcome Section
  welcomeTitle: string;
  welcomeDescription: string;
  
  // Section: Cavernas
  cavernasTitle: string;
  cavernasDescription: string;
  
  // Section: Hospedagem
  hospedagemTitle: string;
  hospedagemDescription: string;
  
  // Section: Gastronomia
  gastronomiaTitle: string;
  gastronomiaDescription: string;
  
  // Page: Cavernas
  cavernasPageTitle: string;
  cavernasPageSubtitle: string;
  
  // Page: Gastronomia
  gastronomiaPageTitle: string;
  gastronomiaPageSubtitle: string;
  
  // Page: Eventos
  eventosPageTitle: string;
  eventosPageSubtitle: string;
  
  // Page: Pontos
  pontosPageTitle: string;
  pontosPageSubtitle: string;
  
  // Page: Hospedagem
  hospedagemPageTitle: string;
  hospedagemPageSubtitle: string;
  
  // Page: Guias
  guiasPageTitle: string;
  guiasPageSubtitle: string;
  
  // Contact
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
  
  // Social
  socialInstagram: string;
  socialFacebook: string;
  
  // SEO
  siteTitle: string;
  siteMetaDescription: string;
  
  // Footer
  footerCopyright: string;
  footerQuickLinks: string;
}

const defaultConfig: GlobalConfig = {
  homeTitle: 'DESCUBRA JANUÁRIA',
  homeSubtitle: 'CULTURA, NATUREZA E HISTÓRIA',
  welcomeTitle: 'BEM-VINDO AO PORTAL DE TURISMO DE JANUÁRIA',
  welcomeDescription: 'Explore as melhores experiências turísticas da região. Aproveite paisagens, gastronomia, atrativos naturais e as culturas que fazem de Januária um destino único.',
  cavernasTitle: 'CAVERNAS DO PERUAÇU',
  cavernasDescription: 'Explore o maior patrimônio de cavernas do Brasil com mais de 140 grutas, paintings rupestres de 12 mil anos e a maior estalactite do mundo. Patrimônio mundial da UNESCO desde 2025.',
  hospedagemTitle: 'HOSPEDAGEM',
  hospedagemDescription: 'Pousadas, chalés e hotéis para todos os estilos. Encontre o lugar perfeito para descansar, aproveitar a vista e viver Januária com conforto e acolhimento.',
  gastronomiaTitle: 'GASTRONOMIA',
  gastronomiaDescription: 'Sabores únicos da culinária mineira e regional. Dos peixes do rio ao tradicional arroz com pequi, experiências gastronômicas que traduzem o verdadeiro sabor de Januária.',
  cavernasPageTitle: 'Cavernas do Peruaçu',
  cavernasPageSubtitle: 'O Parque Nacional Cavernas do Peruaçu é um dos patrimônios naturais mais impressionantes do Brasil. Com mais de 140 cavernas catalogadas e pinturas rupestres de até 12.000 anos, é patrimônio mundial da UNESCO desde 2025.',
  gastronomiaPageTitle: 'Gastronomia',
  gastronomiaPageSubtitle: 'Sabores únicos da culinária mineira e regional.',
  eventosPageTitle: 'Eventos',
  eventosPageSubtitle: 'Calendário completo das tradições e festas de Januária.',
  pontosPageTitle: 'Pontos Turísticos',
  pontosPageSubtitle: 'Explore a história, natureza e cultura de Januária.',
  hospedagemPageTitle: 'Hospedagem',
  hospedagemPageSubtitle: 'Encontre a hospedagem perfeita para sua viagem.',
  guiasPageTitle: 'Guias',
  guiasPageSubtitle: 'Especialistas nativos para sua jornada em Januária.',
  contactPhone: '(38) 9999-9999',
  contactWhatsapp: '553899999999',
  contactAddress: 'Centro, Januária - MG',
  socialInstagram: 'https://instagram.com/descubrajanuaria',
  socialFacebook: 'https://facebook.com/descubrajanuaria',
  siteTitle: 'Descubra Januária - Portal de Turismo',
  siteMetaDescription: 'Descubra as melhores experiências turísticas em Januária, MG. Cavernas, gastronomia, hospedagem, eventos e muito mais no Norte de Minas.',
  footerCopyright: '© 2026 Portal de Turismo de Januária. Todos os direitos reservados.',
  footerQuickLinks: 'Sobre,Guias,Termos,Privacidade'
};

export function useGlobalConfig() {
  const [config, setConfig] = useState<GlobalConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'configuracoes', 'global'), (snap) => {
      if (snap.exists()) {
        setConfig(prev => ({ ...prev, ...snap.data() }));
      }
      setLoading(false);
    }, (error) => {
      console.warn('Erro ao escutar configuracoes globais:', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { config, loading };
}
