"use client";

import React, { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Database, Loader2, Check, AlertTriangle } from 'lucide-react';

// Dados de seed para migração
const guiasData = [
  { nome: "Evandro Neto", descricao: "Especialista em ecoturismo e cavernas do Peruaçu", whatsapp: "5538999999999", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200", especialidades: ["Cavernas", "Ecoturismo"] }
];

const gastronomiaData = [
  { nome: "Surubim Tropical", descricao: "O prato ícone de Januária. Filé de surubim grelhado com molho de frutas tropicais.", tipo: "Prato Típico", destaque: false },
  { nome: "Peixe Frito do São Francisco", descricao: "Peixe frito na hora servido com arroz, feijão tropeiro e salada.", tipo: "Prato Típico", destaque: false },
  { nome: "Cachaça de Januária", descricao: "Reconhecida mundialmente pela qualidade superior. Produzida em engenhos centenários.", tipo: "Bebida Tradicional", destaque: false },
  { nome: "Restaurante Babalu", descricao: "Um dos restaurantes mais tradicionais e premiados da cidade.", endereco: "Rua Manoel Caetano, 127 - Centro, Januária - MG", telefone: "(38) 3621-1011", tipo: "Restaurante", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/6b/9a/9a/restaurante-babalu.jpg"] },
  { nome: "Restaurante e Peixaria Hawai", descricao: "No Cais de Januária, com vista para o Rio São Francisco.", endereco: "Av. São Francisco, 512 - Centro, Januária - MG", telefone: "(38) 3621-5060", tipo: "Restaurante", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/3d/45/9a/hotel-e-restaurante-hawai.jpg"] },
  { nome: "Feira Agroecológica", descricao: "Festival gastronômico com 'Arrumadinho de Carne de Sol', 'Macarrão na Chapa' e doces típicos.", tipo: "Comida de Rua / Evento", destaque: false }
];

const hoteisData = [
  { nome: "Hotel Rondônia", descricao: "Casarão histórico no coração de Januária com arquitetura colonial preservada.", endereco: "Praça Getúlio Vargas, 49 - Centro, Januária - MG", telefone: "(38) 3621-1592", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/9e/4a/5c/hotel-rondonia.jpg"] },
  { nome: "Viva Hotel e Restaurante", descricao: "Um dos hotéis mais tradicionais, com excelente restaurante.", endereco: "Av. São Francisco, 448 - Centro, Januária - MG", telefone: "(38) 3621-1414", destaque: true, imagens: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/185635848.jpg"] },
  { nome: "Hotel e Restaurante Hawai", descricao: "Combina hospitalidade e praticidade. Restaurante próprio e acomodações modernas.", endereco: "Av. São Francisco, 512 - Centro, Januária - MG", telefone: "(38) 99923-2487", destaque: false, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/3d/45/9a/hotel-e-restaurante-hawai.jpg"] },
  { nome: "Pousada Sítio Rupestre", descricao: "7km da entrada do Parque Nacional. Ambiente rústico e acolhedor.", endereco: "Comunidade de Fabião / Distrito de Januária", telefone: "(38) 99830-3949", destaque: false, imagens: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/265635444.jpg"] },
];

const pontosData = [
  { nome: "Pântano Mineiro", descricao: "O único Pantanal Mineiro, em Pandeiros, com extensas áreas alagadas.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/590be9c757b0f94efac53bb0e16092bf.jpg", localizacao: "Pandeiros" },
  { nome: "Igreja N. Sra. do Rosário", descricao: "A segunda igreja mais antiga de Minas Gerais, construída no século XVII.", categoria: "Histórico", imagem: "https://www.januaria.mg.gov.br/fotos/ced134ccf4d7664eb2f33ab2f7adf24b.png", localizacao: "Brejo do Amparo" },
  { nome: "Cavernas do Peruaçu", descricao: "Patrimônio Mundial da UNESCO com cavernas gigantescas e sítios arqueológicos.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/f0b2d157558963284d71326d0901e7b4.jpg", localizacao: "Parque Nacional do Peruaçu" },
  { nome: "Cavalhadas de Brejo do Amparo", descricao: "Espetáculo medieval tradicional encenando a batalha entre mouros e cristãos.", categoria: "Cultural", imagem: "https://www.januaria.mg.gov.br/fotos/a602d2f9324f93d53b133f6ba805d30e.jpg", localizacao: "Brejo do Amparo" },
];

const eventosData = [
  { nome: "Carnaval de Rua", descricao: "O maior carnaval do Norte de Minas Gerais com blocos e bandas.", data: "2027-02-28", tipo: "Festa Popular", imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800", destaque: true },
  { nome: "Festa de São João", descricao: "Tradicional festa junina com quadrilhas e shows regionais.", data: "2027-06-15", tipo: "Festa Junina", imagem: "https://images.unsplash.com/photo-1561489401-fc2876ced162?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festival Gastronômico e Cultural", descricao: "Festival que celebra os sabores e saberes do sertão mineiro.", data: "2027-08-08", tipo: "Gastronomia", imagem: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800", destaque: true },
  { nome: "Cavalhadas de Brejo do Amparo", descricao: "A mais antiga Cavalhada de Minas Gerais.", data: "2027-09-22", tipo: "Tradição Medieval", imagem: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&q=80&w=800", destaque: true },
];

interface MigrationResult {
  collection: string;
  success: boolean;
  count: number;
  error?: string;
}

export default function Migracao() {
  const [migrando, setMigrando] = useState(false);
  const [resultados, setResultados] = useState<MigrationResult[]>([]);

  const migrarTudo = async () => {
    setMigrando(true);
    setResultados([]);
    const results: MigrationResult[] = [];

    const migrarColecao = async (nomeColecao: string, dados: Record<string, unknown>[]) => {
      try {
        const snap = await getDocs(collection(db, nomeColecao));
        for (const docSnap of snap.docs) { await deleteDoc(doc(db, nomeColecao, docSnap.id)); }
        for (const item of dados) { await addDoc(collection(db, nomeColecao), item); }
        results.push({ collection: nomeColecao, success: true, count: dados.length });
      } catch (e) {
        results.push({ collection: nomeColecao, success: false, count: 0, error: String(e) });
      }
    };

    await migrarColecao('guias', guiasData as Record<string, unknown>[]);
    await migrarColecao('gastronomia', gastronomiaData as Record<string, unknown>[]);
    await migrarColecao('hoteis', hoteisData as Record<string, unknown>[]);
    await migrarColecao('pontos', pontosData as Record<string, unknown>[]);
    await migrarColecao('eventos', eventosData as Record<string, unknown>[]);

    setResultados(results);
    setMigrando(false);
  };

  const totalMigrado = resultados.filter(r => r.success).reduce((acc, r) => acc + r.count, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-headline mb-6">Migração de Dados</h1>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 mb-6 transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-sans">Importar Dados para o Banco</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">Esta ação vai importar todos os dados iniciais para o Firebase Firestore</p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium font-sans">Atenção</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 font-sans mt-0.5">Esta ação vai substituir TODOS os dados existentes nas coleções. Dados antigos serão excluídos permanentemente.</p>
            </div>
          </div>
        </div>

        <button
          onClick={migrarTudo}
          disabled={migrando}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 font-sans text-sm font-semibold transition-colors"
        >
          {migrando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
          {migrando ? 'Migrando dados...' : 'Iniciar Migração'}
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 transition-all">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-headline mb-4">Resultados da Migração</h2>
          <div className="space-y-3">
            {resultados.map((result) => (
              <div key={result.collection} className={`flex items-center justify-between p-3 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2">
                  {result.success ? <Check className="w-5 h-5 text-green-600 dark:text-green-400" /> : <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  <span className="font-medium font-sans text-gray-900 dark:text-gray-100 text-sm">{result.collection}</span>
                </div>
                <span className={`font-sans text-sm font-semibold ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result.success ? `${result.count} itens` : `Erro: ${result.error}`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-semibold text-blue-800 dark:text-blue-300 font-sans text-sm">✅ Total migrado: <strong>{totalMigrado} itens</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}
