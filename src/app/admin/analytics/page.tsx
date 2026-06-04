"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart3, TrendingUp, Phone, Instagram, Globe, Loader2, ArrowUpDown } from 'lucide-react';

interface AnalyticItem {
  id: string;
  nome: string;
  colecao: string;
  tipo: string;
  whatsapp: number;
  instagram: number;
  website: number;
  total: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof AnalyticItem>('total');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const collectionsToFetch = [
        { name: 'gastronomia', label: 'Gastronomia' },
        { name: 'hoteis', label: 'Hospedagem' },
        { name: 'guias', label: 'Guia Turístico' },
        { name: 'eventos', label: 'Evento' },
        { name: 'pontos', label: 'Ponto Turístico' }
      ];

      try {
        let allItems: AnalyticItem[] = [];

        for (const col of collectionsToFetch) {
          const snap = await getDocs(collection(db, col.name));
          snap.forEach(doc => {
            const d = doc.data();
            const analytics = d.analytics || {};
            
            // Apenas adiciona se tiver algum clique registrado
            if (analytics.total > 0 || analytics.whatsapp > 0 || analytics.instagram > 0 || analytics.website > 0) {
              allItems.push({
                id: doc.id,
                nome: d.nome || d.name || d.title || 'Sem nome',
                colecao: col.label,
                tipo: d.tipo || d.categoria || d.category || '-',
                whatsapp: analytics.whatsapp || 0,
                instagram: analytics.instagram || 0,
                website: analytics.website || 0,
                total: analytics.total || ((analytics.whatsapp || 0) + (analytics.instagram || 0) + (analytics.website || 0))
              });
            }
          });
        }

        setData(allItems);
      } catch (error) {
        console.error("Erro ao carregar analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totals = useMemo(() => {
    return data.reduce((acc, item) => ({
      whatsapp: acc.whatsapp + item.whatsapp,
      instagram: acc.instagram + item.instagram,
      website: acc.website + item.website,
      total: acc.total + item.total,
    }), { whatsapp: 0, instagram: 0, website: 0, total: 0 });
  }, [data]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDesc ? 1 : -1;
      if (a[sortField] > b[sortField]) return sortDesc ? -1 : 1;
      return 0;
    });
  }, [data, sortField, sortDesc]);

  const handleSort = (field: keyof AnalyticItem) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500 font-sans text-sm animate-pulse">Carregando métricas de leads...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-headline flex items-center gap-3">
          <BarChart3 className="text-blue-600" />
          Estatísticas & Leads
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-sans text-sm max-w-2xl">
          Monitore o desempenho do seu site e descubra quantos clientes em potencial você está gerando para os estabelecimentos e parceiros locais. Use esses dados para fechar acordos e demonstrar o valor da plataforma.
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp size={16} />
            </div>
            <span className="font-sans text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total de Leads</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-headline">{totals.total}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
              <Phone size={16} />
            </div>
            <span className="font-sans text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">WhatsApp</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-headline">{totals.whatsapp}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-pink-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <Instagram size={16} />
            </div>
            <span className="font-sans text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instagram</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-headline">{totals.instagram}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Globe size={16} />
            </div>
            <span className="font-sans text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-headline">{totals.website}</p>
        </div>
      </div>

      {/* Tabela de Ranking */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-headline">Ranking de Engajamento</h2>
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-xs font-bold">
            {data.length} locais com métricas
          </span>
        </div>

        {data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-1">Nenhum dado registrado</h3>
            <p className="text-gray-500 font-sans text-sm max-w-sm mx-auto">
              Os cliques começarão a aparecer aqui assim que os usuários acessarem os links do WhatsApp, Instagram e Site nas páginas públicas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-zinc-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('nome')}>
                    <div className="flex items-center gap-1">Estabelecimento <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-gray-900 dark:hover:text-white" onClick={() => handleSort('colecao')}>
                    <div className="flex items-center gap-1">Categoria <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-green-600" onClick={() => handleSort('whatsapp')}>
                    <div className="flex items-center gap-1 justify-end"><Phone size={12} /> WhatsApp <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-pink-600" onClick={() => handleSort('instagram')}>
                    <div className="flex items-center gap-1 justify-end"><Instagram size={12} /> Instagram <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('website')}>
                    <div className="flex items-center gap-1 justify-end"><Globe size={12} /> Site <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-blue-600" onClick={() => handleSort('total')}>
                    <div className="flex items-center gap-1 justify-end">Total de Leads <ArrowUpDown size={12} /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {sortedData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{item.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                        {item.colecao}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-300">
                      {item.whatsapp > 0 ? item.whatsapp : <span className="text-gray-300 dark:text-zinc-700">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-300">
                      {item.instagram > 0 ? item.instagram : <span className="text-gray-300 dark:text-zinc-700">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-300">
                      {item.website > 0 ? item.website : <span className="text-gray-300 dark:text-zinc-700">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg font-bold">
                        {item.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
