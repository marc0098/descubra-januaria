"use client";

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Settings, Save, Loader2, Check, Globe, Home, Map, Bed, Utensils, Share2, Search, FileText, Calendar, Compass } from 'lucide-react';

interface ConfigState {
  homeTitle: string;
  homeSubtitle: string;
  welcomeTitle: string;
  welcomeDescription: string;
  cavernasTitle: string;
  cavernasDescription: string;
  hospedagemTitle: string;
  hospedagemDescription: string;
  gastronomiaTitle: string;
  gastronomiaDescription: string;
  cavernasPageTitle: string;
  cavernasPageSubtitle: string;
  gastronomiaPageTitle: string;
  gastronomiaPageSubtitle: string;
  eventosPageTitle: string;
  eventosPageSubtitle: string;
  pontosPageTitle: string;
  pontosPageSubtitle: string;
  hospedagemPageTitle: string;
  hospedagemPageSubtitle: string;
  guiasPageTitle: string;
  guiasPageSubtitle: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
  socialInstagram: string;
  socialFacebook: string;
  siteTitle: string;
  siteMetaDescription: string;
  footerCopyright: string;
  footerQuickLinks: string;
}

const defaultConfig: ConfigState = {
  homeTitle: 'Descubra Januária',
  homeSubtitle: 'Natureza, Cultura e Sabores Únicos no Norte de Minas',
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

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const [config, setConfig] = useState<ConfigState>(defaultConfig);

  useEffect(() => {
    async function loadConfig() {
      try {
        const docRef = doc(db, 'configuracoes', 'global');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setConfig(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await setDoc(doc(db, 'configuracoes', 'global'), config, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: 'home', label: 'Página Inicial', icon: Home },
    { id: 'sections', label: 'Seções', icon: Map },
    { id: 'pages', label: 'Páginas', icon: FileText },
    { id: 'contact', label: 'Contato', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Search },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-headline">Configurações Globais</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
              <Home className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold font-headline">Página Inicial (Hero)</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título Principal</label>
                <input
                  type="text"
                  name="homeTitle"
                  value={config.homeTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtítulo</label>
                <input
                  type="text"
                  name="homeSubtitle"
                  value={config.homeSubtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <h3 className="text-md font-bold font-headline mb-4 text-gray-800 dark:text-gray-200">Seção de Boas-Vindas</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    name="welcomeTitle"
                    value={config.welcomeTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea
                    name="welcomeDescription"
                    value={config.welcomeDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTIONS TAB */}
        {activeTab === 'sections' && (
          <div className="space-y-8">
            {/* Cavernas */}
            <div className="pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Map className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold font-headline">Seção: Cavernas do Peruaçu</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input type="text" name="cavernasTitle" value={config.cavernasTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea name="cavernasDescription" value={config.cavernasDescription} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>

            {/* Hospedagem */}
            <div className="pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Bed className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold font-headline">Seção: Hospedagem</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input type="text" name="hospedagemTitle" value={config.hospedagemTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea name="hospedagemDescription" value={config.hospedagemDescription} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>

            {/* Gastronomia */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold font-headline">Seção: Gastronomia</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input type="text" name="gastronomiaTitle" value={config.gastronomiaTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea name="gastronomiaDescription" value={config.gastronomiaDescription} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGES TAB */}
        {activeTab === 'pages' && (
          <div className="space-y-8">
            {/* Cavernas Page */}
            <div className="pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Map className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold font-headline">Página: Cavernas</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título da Página</label>
                  <input type="text" name="cavernasPageTitle" value={config.cavernasPageTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtítulo / Descrição</label>
                  <textarea name="cavernasPageSubtitle" value={config.cavernasPageSubtitle} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>

            {/* Gastronomia Page */}
            <div className="pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold font-headline">Página: Gastronomia</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título da Página</label>
                  <input type="text" name="gastronomiaPageTitle" value={config.gastronomiaPageTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtítulo / Descrição</label>
                  <textarea name="gastronomiaPageSubtitle" value={config.gastronomiaPageSubtitle} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>

            {/* Eventos Page */}
            <div className="pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold font-headline">Página: Eventos</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título da Página</label>
                  <input type="text" name="eventosPageTitle" value={config.eventosPageTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtítulo / Descrição</label>
                  <textarea name="eventosPageSubtitle" value={config.eventosPageSubtitle} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>

            {/* Pontos Page */}
            <div className="pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Map className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold font-headline">Página: Pontos Turísticos</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título da Página</label>
                  <input type="text" name="pontosPageTitle" value={config.pontosPageTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtítulo / Descrição</label>
                  <textarea name="pontosPageSubtitle" value={config.pontosPageSubtitle} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>

            {/* Hospedagem Page */}
            <div className="pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Bed className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold font-headline">Página: Hospedagem</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título da Página</label>
                  <input type="text" name="hospedagemPageTitle" value={config.hospedagemPageTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtítulo / Descrição</label>
                  <textarea name="hospedagemPageSubtitle" value={config.hospedagemPageSubtitle} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>

            {/* Guias Page */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold font-headline">Página: Guias</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título da Página</label>
                  <input type="text" name="guiasPageTitle" value={config.guiasPageTitle} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtítulo / Descrição</label>
                  <textarea name="guiasPageSubtitle" value={config.guiasPageSubtitle} onChange={handleChange} rows={3}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
              <Share2 className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold font-headline">Contato e Redes Sociais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Telefone (Exibição)</label>
                <input type="text" name="contactPhone" value={config.contactPhone} onChange={handleChange} placeholder="(38) 9999-9999"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">WhatsApp (Apenas Números)</label>
                <input type="text" name="contactWhatsapp" value={config.contactWhatsapp} onChange={handleChange} placeholder="553899999999"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all dark:text-white" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Endereço</label>
              <input type="text" name="contactAddress" value={config.contactAddress} onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all dark:text-white" />
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <h3 className="text-md font-bold font-headline mb-4 text-gray-800 dark:text-gray-200">Redes Sociais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Link Instagram</label>
                  <input type="text" name="socialInstagram" value={config.socialInstagram} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Link Facebook</label>
                  <input type="text" name="socialFacebook" value={config.socialFacebook} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <h3 className="text-md font-bold font-headline mb-4 text-gray-800 dark:text-gray-200">Rodapé</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Copyright</label>
                  <input type="text" name="footerCopyright" value={config.footerCopyright} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Links Rápidos (separados por vírgula)</label>
                  <input type="text" name="footerQuickLinks" value={config.footerQuickLinks} onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-zinc-800">
              <Globe className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold font-headline">SEO Básico</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Título Global do Site</label>
                <input type="text" name="siteTitle" value={config.siteTitle} onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white" />
                <p className="text-xs text-gray-500 mt-1">Aparece na aba do navegador e nos resultados de busca</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição Meta Padrão</label>
                <textarea name="siteMetaDescription" value={config.siteMetaDescription} onChange={handleChange} rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white resize-none" />
                <p className="text-xs text-gray-500 mt-1">Descrição que aparece abaixo do título nos resultados do Google</p>
              </div>
            </div>

            {/* Preview */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Pré-visualização Google</h3>
              <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 max-w-lg">
                <p className="text-blue-700 dark:text-blue-400 text-lg font-medium truncate">{config.siteTitle}</p>
                <p className="text-green-700 dark:text-green-500 text-sm truncate">descubra-januaria.com.br</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{config.siteMetaDescription}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl disabled:opacity-50 font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (saveSuccess ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />)}
          {saving ? 'Salvando...' : (saveSuccess ? 'Salvo com Sucesso!' : 'Salvar Configurações')}
        </button>
      </div>
    </div>
  );
}
