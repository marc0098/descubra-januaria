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
{ nome: "Surubim Tropical", descricao: "O prato ícone de Januária. Consiste em filé de surubim (peixe nobre do Rio São Francisco) grelhado, acompanhado de um molho de frutas tropicais e ingredientes locais.", tipo: "Prato Típico", destaque: false },
  { nome: "Peixe Frito do São Francisco", descricao: "Tradicionalmente servido nos quiosques à beira-rio (Cais). Peixes como Curimatã, Piau e Surubim são fritos na hora e servidos com arroz, feijão tropeiro e salada.", tipo: "Prato Típico", destaque: false },
  { nome: "Cachaça de Januária", descricao: "Reconhecida mundialmente pela sua qualidade superior. Produzida em engenhos centenários, como os do distrito de Brejo do Amparo.", tipo: "Bebida Tradicional", destaque: false },
  { nome: "Restaurante Babalu", descricao: "Um dos restaurantes mais tradicionais e premiados da cidade. Oferece um cardápio variado que vai desde a comida mineira clássica até pratos sofisticados com peixes do Rio São Francisco.", endereco: "Rua Manoel Caetano, 127 - Centro, Januária - MG", telefone: "(38) 3621-1011", tipo: "Restaurante", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/6b/9a/9a/restaurante-babalu.jpg"] },
  { nome: "Restaurante e Peixaria Hawai", descricao: "Localizado no Cais de Januária, é o lugar perfeito para apreciar a vista do Rio São Francisco enquanto saboreia o melhor da culinária de peixes da região.", endereco: "Av. São Francisco, 512 - Centro (Cais), Januária - MG", telefone: "(38) 3621-5060", tipo: "Restaurante", destaque: true, imagens: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/29/afcf0c73427ce803e33f58702175a09f.png"] },
  { nome: "Restaurante Pimenta Mineira", descricao: "Conhecido pelo tempero caseiro e ambiente acolhedor. Serve pratos típicos do sertão mineiro com um toque de sofisticação.", endereco: "Rua Coronel Serrão, 409 - Centro, Januária - MG", telefone: "(38) 99972-7436", tipo: "Restaurante", destaque: false, imagens: ["https://www.januaria.mg.gov.br/portal/arquivos/paginas_dinamicas/4/pimenta-mineira.jpg"] },
  { nome: "Feira Agroecológica e Festival Gastronômico", descricao: "Januária possui um vibrante Festival Gastronômico anual. Na feira agroecológica, é possível encontrar o 'Arrumadinho de Carne de Sol', 'Macarrão na Chapa' e doces típicos do cerrado como o de Pequi.", tipo: "Comida de Rua / Evento", destaque: false },
  { nome: "Lucas Bar e Restaurante (Zé de Lucas)", descricao: "Endereço: Rua Geraldo Moura Luz, 180 - Jatobá Telefone: (38)3621-5235 Clique e saiba mais: @lucasbarerestaurante9", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/27/f32401d695f66a4f2c772eaeec1bef7a.png"] },
  { nome: "Bar e Restaurante Moradeiras", descricao: "Telefone: (38)99964-1101 Local: Comunidade Moradeiras Instagram: @novapousadamoradeiras", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/28/20c7e8489bef97d0b7a9a12ed7e538d1.jpg"] },
  { nome: "Restaurante e Peixaria Hawaí", descricao: "Endereço: Av. São Francisco, 512 - Centro (Cais de Januária) Telefones: (38)3621-5060 (38)3621-7067 (38) 99165-3020 Instagram: @hotel_hawai2018", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/29/afcf0c73427ce803e33f58702175a09f.png"] },
  { nome: "Restaurante Portal do Peruaçu", descricao: "Localização: BR 135, s/n Km 40 - Fabião I Telefones: (38)3623-1050 (38) 99311-4074 (38) 3623-1029 Instagram: @portaldoperuacu", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/30/78f942ed60856c05f18752f58a3f0a99.png"] },
  { nome: "Restaurante Pimenta Mineira", descricao: "Localização: Rua Coronel Serrão, 409 - Centro Telefone: (38) 99972-7436 Clique e saiba mais: @pimentamineirajanu", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/31/476c2d28513ae505aa928623416a9e6a.png"] },
  { nome: "Restaurante Babalu", descricao: "Localização: Rua Manoel Caetano, 127 - Centro Telefone: (38) 3621-1011 (38)3621-1096 (38) 99938-7775 Clique e saiba mais: @restaurante_babalu", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/32/77843fb2f05bdb9540f06b6be0a1a89c.png"] },
  { nome: "Kika's Bar e Restaurante", descricao: "Endereço: Rua Treze de Maio, 211 - Centro Telefone: (38) 3621-1868 (38) 99966-1868", tipo: "Restaurante", destaque: false, fotos: [] },
  { nome: "Spaghetti e cia", descricao: "Endereço: Rua Terêncio Torres, 68 - São Vicente Telefone: (38) 3621-4320 (38) 99143-0574 Instagram: @spaguetti_e_cia", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/34/99a11ba442825d4d1b7bf8426c7aba5b.png"] },
  { nome: "Restaurante Danado de Bom", descricao: "Endereço: Av. Marechal Eurico Gaspar Dutra, 177 - Centro Telefone: (38) 99927-9112 Clique e saiba mais: @restaurante_danado_de_bom23", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/35/da5f6b2b9d3c932401bec3cd0c2b9d38.png"] },
  { nome: "Restaurante Casa de Cheiro", descricao: "Endereço: Rua Antão Fernandes de Souza 355B – Boa Vista Telefone: (38)99804-1607 Clique e saiba mais: @casa_de_cheiro1", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/36/8e5dcc6cf026c2375d867d561790f886.jpg"] },
  { nome: "Restaurante Cozinha Sertaneja", descricao: "Localização: Olhos D'Água I, s/n Telefone: (38)99907-1589 (38)99181-9719", tipo: "Restaurante", destaque: false, fotos: [] },
  { nome: "Restaurante Sabor e SaúdePraça Dom Daniel, 31 - Centro (38) 3621-2208        (38) 98826-0316", descricao: "Restaurante Sabor e SaúdePraça Dom Daniel, 31 - Centro (38) 3621-2208 (38) 98826-0316 Endereço: Praça Dom Daniel, 31 - Centro Telefone: (38) 3621-2208 (38) 98826-0316", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/38/9afd7556ad0d2e33aaa3194c9582f460.png"] },
  { nome: "Restaurante Sertão Minas", descricao: "Endereço: Avenida Cônego Ramiro Leite, 198 - Centro Telefone: (38)98819-6625 Clique e saiba mais: @restaurantesertaominas", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/39/d29a84d6c62d2381a8d9809f5125c7b6.png"] },
  { nome: "Restaurante Veredas", descricao: "Endereço: Rua Padre Henrique, 48 - Centro Telefones: (38)99236-0603 (38)99806-9793 Clique e saiba mais: @restaurante_veredas", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/40/a3d0aceabba429ed4ec5be329dd78232.png"] },
  { nome: "Restaurante Caipira Grill", descricao: "Endereço: Avenida Coronel Cassiano, 99 - Centro Telefone: (38)99727-2525 Clique e saiba mais: @caipiragriljanu", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/41/1509225ddbe4b7bc05a04179c07bccab.png"] },
  { nome: "Bar e Restaurante No Engenho", descricao: "Endereço: Av. Cônego Ramiro Leite, 116 - Centro (ao lado do supermercado Montalvânia). Clique para saber mais: @no_engenho_retaurante", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/42/d100bbb72b5d88ea979f0caf23ca8c37.png"] },
  { nome: "Restaurante Recanto das Pedras", descricao: "Endereço: Fabião l – Januária Telefone: (38)99879-5710 Clique e saiba mais: @pousadarecantodaspedrasperuacu", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/43/ebc7cf34d7e478ddce511bf2c8734f87.jpg"] },
  { nome: "Restaurante Cozinha e Delivey", descricao: "Endereço: Rua Olíbrio Lima, 47 - Sagrada Família Telefone: (38)98424-8536 Clique e saiba mais: @cozdeliveryjanu", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/44/58743d0eb4da013cbd31cac420cbae6c.png"] },
  { nome: "Bar e Restaurante Santa Fome", descricao: "Endereço: Rua Hermílio Tupiná, 315 (ao lado do Posto Carrancas) Telefone: (38)99852-2092 Clique e saiba mais: @restaurantesanta_fome", tipo: "Restaurante", destaque: false, fotos: [] },
  { nome: "Restaurante Sabor de Casa", descricao: "Endereço: Rua Pe. João Maria, 21 – Centro Telefone: (38) 99900-8609", tipo: "Restaurante", destaque: false, fotos: [] },
  { nome: "Restaurante do Marcílio", descricao: "Rua Olíbrio Lima, 12 – Centro (38) 99130-2336", tipo: "Restaurante", destaque: false, fotos: [] },
  { nome: "Restaurante Bom Prato", descricao: "Endereço: Rua Francisco Sales, N° 142 - Centro Telefone: (38) 99214-5039 Clique e saiba mais: @restaurantebomprato", tipo: "Restaurante", destaque: false, fotos: [] },
  { nome: "Restaurante Sabor de Minas - Posto Oliveira", descricao: "Endereço: Av. Marechal Deodoro da Fonseca, 1.165 – Centro - Saída para Montes Claros Clique e saiba mais: @postooliveirajanuaria", tipo: "Restaurante", destaque: false, fotos: [] },
  { nome: "Cervejaria artesanal Lay Beer", descricao: "Telefone: (38)99742-7252 Instagram (clique e saiba mais): @cervejarialybeer", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/50/8f90026dccc2f41bfbd60db62d0f7ba8.png"] },
  { nome: "Cachaçaria Januária Franciscana e Cachaça Preparada com Raíz", descricao: "Fazenda Sítio – Brejo do Amparo Facebook – Produtos Delicia", tipo: "Restaurante", destaque: false, fotos: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/51/dfa077f14b6b969d05f108d33d2788f9.png"] }
];

const hoteisData = [
  { nome: "Hotel Rondônia", descricao: "Casarão histórico no coração de Januária com arquitetura colonial preservada.", endereco: "Praça Getúlio Vargas, 49 - Centro, Januária - MG", telefone: "(38) 3621-1592", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/9e/4a/5c/hotel-rondonia.jpg"] },
  { nome: "Viva Hotel e Restaurante", descricao: "Um dos hotéis mais tradicionais, com excelente restaurante.", endereco: "Av. São Francisco, 448 - Centro, Januária - MG", telefone: "(38) 3621-1414", destaque: true, imagens: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/185635848.jpg"] },
  { nome: "Hotel e Restaurante Hawai", descricao: "Combina hospitalidade e praticidade. Restaurante próprio e acomodações modernas.", endereco: "Av. São Francisco, 512 - Centro, Januária - MG", telefone: "(38) 99923-2487", destaque: false, imagens: ["https://www.januaria.mg.gov.br/fotos/paginas_dinamicas/29/afcf0c73427ce803e33f58702175a09f.png"] },
  { nome: "Pousada Sítio Rupestre", descricao: "7km da entrada do Parque Nacional. Ambiente rústico e acolhedor.", endereco: "Comunidade de Fabião / Distrito de Januária", telefone: "(38) 99830-3949", destaque: false, imagens: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/265635444.jpg"] },
];

const pontosData = [
{ nome: "Pântano Mineiro", descricao: "O refúgio estadual da vida silvestre em Pandeiros abriga o único Pantanal Mineiro, com extensas áreas alagadas.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/590be9c757b0f94efac53bb0e16092bf.jpg", localizacao: "Pandeiros" },
  { nome: "Cachoeiras do Rio Pandeiros", descricao: "Belíssimas cachoeiras localizadas no Refúgio da Vida Silvestre de Pandeiros.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/3a3616eb29e120ac2dc463688cbc6b8b.jpg", localizacao: "Pandeiros" },
  { nome: "Igreja N. Sra. do Rosário", descricao: "A segunda igreja mais antiga de Minas Gerais, localizada no distrito de Brejo do Amparo. Construída no século XVII.", categoria: "Histórico", imagem: "https://www.januaria.mg.gov.br/fotos/ced134ccf4d7664eb2f33ab2f7adf24b.png", localizacao: "Brejo do Amparo" },
  { nome: "Mirante do Brejo", descricao: "Mirante com o pôr do sol mais bonito da região. Vista espetacular do Rio São Francisco.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/49a898b24b56e4b4536c12947af8b236.jpg", localizacao: "Brejo do Amparo" },
  { nome: "Cavalhadas", descricao: "Espetáculo medieval tradicional que encena a batalha entre mouros e cristianos no Distrito de Brejo do Amparo.", categoria: "Cultural", imagem: "https://www.januaria.mg.gov.br/fotos/a602d2f9324f93d53b133f6ba805d30e.jpg", localizacao: "Brejo do Amparo" },
  { nome: "Distrito Histórico de Brejo do Amparo", descricao: "Distrito histórico com raízes no século XVIII. Ligado às rotas de bandeiras.", categoria: "Histórico", imagem: "https://www.januaria.mg.gov.br/fotos/97849770d4f2a4127514b3ac510c4113.jpg", localizacao: "Brejo do Amparo" },
  { nome: "Praia de Minas", descricao: "Areias às margens do rio São Francisco entre julho e outubro. Estrutura completa com barracas.", categoria: "Lazer", imagem: "https://www.januaria.mg.gov.br/fotos/21b5d9a3751033ef4c2dbd45ec3e7daf.jpg", localizacao: "Orla do Rio São Francisco" },
  { nome: "Cavernas do Peruaçu", descricao: "Patrimônio Mundial da UNESCO com cavernas gigantescas e sítios arqueológicos.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/f0b2d157558963284d71326d0901e7b4.jpg", localizacao: "Parque Nacional do Peruaçu" },
  { nome: "IGREJA NOSSA SENHORA DO ROSÁRIO", descricao: "A Igreja de Nossa Senhora do Rosário, no distrito de Brejo do Amparo, município de Januária, Minas Gerais, é a segunda mais velha de Minas. A origem da igreja está ligada há uma das mais antigas rotas de penetração de bandeiras no interior do...", categoria: "Natural", localizacao: "", imagem: "https://www.januaria.mg.gov.br/fotos/ced134ccf4d7664eb2f33ab2f7adf24b.png" },
  { nome: "FESTEJOS DE SANTA CRUZ", descricao: "Uma das manifestações mais tradicionais e festejadas pela comunidade religiosa do município de Januária acontece anualmente entre o final do mês de abril e início do mês de maio, os Festejos de Santa Cruz. Acontece sempre na Praça Santa Cruz (largo...", categoria: "Natural", localizacao: "", imagem: "https://www.januaria.mg.gov.br/fotos/d3aae777aa447c78ee278fa49ebd7d61.jpg" }
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
