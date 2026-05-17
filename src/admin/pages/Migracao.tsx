import { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Database, Loader2, Check, AlertTriangle } from 'lucide-react';

const guiasData = [
  { nome: "Evandro Neto", descricao: "Especialista em ecoturismo e cavernas do Peruaçu", whatsapp: "5538999999999", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200", especialidades: ["Cavernas", "Ecoturismo"] }
];

const gastronomiaData = [
  { nome: "Surubim Tropical", descricao: "O prato ícone de Januária. Consiste em filé de surubim (peixe nobre do Rio São Francisco) grelhado, acompanhado de um molho de frutas tropicais e ingredientes locais.", tipo: "Prato Típico", destaque: false },
  { nome: "Peixe Frito do São Francisco", descricao: "Tradicionalmente servido nos quiosques à beira-rio (Cais). Peixes como Curimatã, Piau e Surubim são fritos na hora e servidos com arroz, feijão tropeiro e salada.", tipo: "Prato Típico", destaque: false },
  { nome: "Cachaça de Januária", descricao: "Reconhecida mundialmente pela sua qualidade superior. Produzida em engenhos centenários, como os do distrito de Brejo do Amparo.", tipo: "Bebida Tradicional", destaque: false },
  { nome: "Restaurante Babalu", descricao: "Um dos restaurantes mais tradicionais e premiados da cidade. Oferece um cardápio variado que vai desde a comida mineira clássica até pratos sofisticados com peixes do Rio São Francisco.", endereco: "Rua Manoel Caetano, 127 - Centro, Januária - MG", telefone: "(38) 3621-1011", tipo: "Restaurante", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/6b/9a/9a/restaurante-babalu.jpg"] },
  { nome: "Restaurante e Peixaria Hawai", descricao: "Localizado no Cais de Januária, é o lugar perfeito para apreciar a vista do Rio São Francisco enquanto saboreia o melhor da culinária de peixes da região.", endereco: "Av. São Francisco, 512 - Centro (Cais), Januária - MG", telefone: "(38) 3621-5060", tipo: "Restaurante", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/3d/45/9a/hotel-e-restaurante-hawai.jpg"] },
  { nome: "Restaurante Pimenta Mineira", descricao: "Conhecido pelo tempero caseiro e ambiente acolhedor. Serve pratos típicos do sertão mineiro com um toque de sofisticação.", endereco: "Rua Coronel Serrão, 409 - Centro, Januária - MG", telefone: "(38) 99972-7436", tipo: "Restaurante", destaque: false, imagens: ["https://www.januaria.mg.gov.br/portal/arquivos/paginas_dinamicas/4/pimenta-mineira.jpg"] },
  { nome: "Feira Agroecológica e Festival Gastronômico", descricao: "Januária possui um vibrante Festival Gastronômico anual. Na feira agroecológica, é possível encontrar o 'Arrumadinho de Carne de Sol', 'Macarrão na Chapa' e doces típicos do cerrado como o de Pequi.", tipo: "Comida de Rua / Evento", destaque: false }
];

const hoteisData = [
  { nome: "Hotel Rondônia", descricao: "Localizado em um casarão histórico no coração de Januária, o Hotel Rondônia oferece uma experiência autêntica com arquitetura colonial preservada.", endereco: "Praça Getúlio Vargas, 49 - Centro, Januária - MG", telefone: "(38) 3621-1592", destaque: true, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/9e/4a/5c/hotel-rondonia.jpg"] },
  { nome: "Viva Hotel e Restaurante (Viva Maria)", descricao: "Um dos hotéis mais tradicionais da cidade, conhecido pelo seu excelente restaurante.", endereco: "Av. São Francisco, 448 - Centro, Januária - MG", telefone: "(38) 3621-1414", destaque: true, imagens: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/185635848.jpg"] },
  { nome: "Hotel e Restaurante Hawai", descricao: "O Hotel Hawai combina hospitalidade e praticidade. Conta com restaurante próprio e acomodações modernas.", endereco: "Av. São Francisco, 512 - Centro, Januária - MG", telefone: "(38) 99923-2487", destaque: false, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/3d/45/9a/hotel-e-restaurante-hawai.jpg"] },
  { nome: "Pousada Sítio Rupestre", descricao: "Localizada estrategicamente a apenas 7km da entrada do Parque Nacional Cavernas do Peruaçu. Oferece um ambiente rústico e acolhedor.", endereco: "Comunidade de Fabião / Distrito de Januária (40km do centro)", telefone: "(38) 99830-3949", destaque: false, imagens: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/265635444.jpg"] },
  { nome: "Pousada Portal do Peruaçu", descricao: "Uma opção estratégica para quem deseja visitar as cavernas. A pousada é elogiada pelo atendimento familiar.", endereco: "BR 135, s/n - Próximo à entrada do Parque", telefone: "(31) 99311-4074", destaque: false, imagens: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/217576232.jpg"] },
  { nome: "Pousada Recanto das Pedras", descricao: "Localizada na comunidade do Fabião, esta pousada oferece uma experiência de turismo rural.", endereco: "Fabião I, s/n - Januária - MG", telefone: "(38) 99219-6283", destaque: false, imagens: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/31/02/21/pousada-recanto-das-pedras.jpg"] },
  { nome: "Hotel Fazenda Arizona", descricao: "Localizado na rodovia que leva ao Peruaçu, oferece estrutura completa de lazer com piscina e área verde.", endereco: "BR 135, Km 190 s/n - Januária - MG", telefone: "(38) 99817-5858", destaque: false, imagens: ["https://www.januaria.mg.gov.br/portal/arquivos/paginas_dinamicas/3/hotel-fazenda-arizona.jpg"] }
];

const pontosData = [
  { nome: "Pântano Mineiro", descricao: "O refúgio estadual da vida silvestre em Pandeiros abriga o único Pantanal Mineiro, com extensas áreas alagadas.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/590be9c757b0f94efac53bb0e16092bf.jpg", localizacao: "Pandeiros" },
  { nome: "Cachoeiras do Rio Pandeiros", descricao: "Belíssimas cachoeiras localizadas no Refúgio da Vida Silvestre de Pandeiros.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/3a3616eb29e120ac2dc463688cbc6b8b.jpg", localizacao: "Pandeiros" },
  { nome: "Igreja N. Sra. do Rosário", descricao: "A segunda igreja mais antiga de Minas Gerais, localizada no distrito de Brejo do Amparo. Construída no século XVII.", categoria: "Histórico", imagem: "https://www.januaria.mg.gov.br/fotos/ced134ccf4d7664eb2f33ab2f7adf24b.png", localizacao: "Brejo do Amparo" },
  { nome: "Mirante do Brejo", descricao: "Mirante com o pôr do sol mais bonito da região. Vista espetacular do Rio São Francisco.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/49a898b24b56e4b4536c12947af8b236.jpg", localizacao: "Brejo do Amparo" },
  { nome: "Cavalhadas", descricao: "Espetáculo medieval tradicional que encena a batalha entre mouros e cristianos no Distrito de Brejo do Amparo.", categoria: "Cultural", imagem: "https://www.januaria.mg.gov.br/fotos/a602d2f9324f93d53b133f6ba805d30e.jpg", localizacao: "Brejo do Amparo" },
  { nome: "Distrito Histórico de Brejo do Amparo", descricao: "Distrito histórico com raízes no século XVIII. Ligado às rotas de bandeiras.", categoria: "Histórico", imagem: "https://www.januaria.mg.gov.br/fotos/97849770d4f2a4127514b3ac510c4113.jpg", localizacao: "Brejo do Amparo" },
  { nome: "Praia de Minas", descricao: "Areias às margens do rio São Francisco entre julho e outubro. Estrutura completa com barracas.", categoria: "Lazer", imagem: "https://www.januaria.mg.gov.br/fotos/21b5d9a3751033ef4c2dbd45ec3e7daf.jpg", localizacao: "Orla do Rio São Francisco" },
  { nome: "Cavernas do Peruaçu", descricao: "Patrimônio Mundial da UNESCO com cavernas gigantescas e sítios arqueológicos.", categoria: "Natural", imagem: "https://www.januaria.mg.gov.br/fotos/f0b2d157558963284d71326d0901e7b4.jpg", localizacao: "Parque Nacional do Peruaçu" }
];

const eventosData = [
  { nome: "Carnaval de Rua", descricao: "O maior carnival do Norte de Minas Gerais retorna com blocos, bandas e muita folia.", data: "2027-02-28", tipo: "Festa Popular", imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800", destaque: true },
  { nome: "11ª CAVALGADA VALE O PERUAÇU", descricao: "Cavalgada que reúne centenas de cavaleiros e amazonas em uma tradição sertaneja.", data: "2027-01-13", tipo: "Tradicional", imagem: "https://images.unsplash.com/photo-1553285991-4c74211f508a?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festa de São João", descricao: "Tradicional festa junina com quadrilhas, comidas típicas, novenas e shows regionais.", data: "2027-06-15", tipo: "Festa Junina", imagem: "https://images.unsplash.com/photo-1561489401-fc2876ced162?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festa de Santo Antônio", descricao: "Festa tradicional com novenas, comidas típicas e shows regionais.", data: "2027-06-05", tipo: "Religioso", imagem: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festival Gastronômico e Cultural", descricao: "4ª edição do festival que celebra os sabores e saberes do sertão mineiro.", data: "2027-08-08", tipo: "Gastronomia", imagem: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800", destaque: true },
  { nome: "Festival da Cachaça", descricao: "Degustação das melhores cachaças artesanais da região.", data: "2027-08-15", tipo: "Gastronomia", imagem: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festa de Santa Cruz", descricao: "Uma das mais tradicionais festas religiosas de Januária. nove dias de novenas.", data: "2027-05-03", tipo: "Religioso", imagem: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Cavalhadas de Brejo do Amparo", descricao: "A mais antiga Cavalhada de Minas Gerais, um espetáculo medieval.", data: "2027-09-22", tipo: "Tradição Medieval", imagem: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&q=80&w=800", destaque: true },
  { nome: "Encontro de Violeiros", descricao: "Uma tarde dedicada à música de raiz, celebrando a cultura sertaneja.", data: "2027-09-10", tipo: "Musical", imagem: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festa dos Santos do Rio", descricao: "As imagens de São Pedro e São Francisco são conduzidas em barcos.", data: "2027-10-04", tipo: "Religioso", imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festa do Rosário", descricao: "A manifestação religiosa da Igreja Católica mais antiga da região.", data: "2027-10-27", tipo: "Religioso", imagem: "https://images.unsplash.com/photo-1516820827085-1b4a53d382c6?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Natal dos Sonhos", descricao: "Decoraçao natalina que transforma a cidade em um cenário mágico.", data: "2027-12-01", tipo: "Natalino", imagem: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800", destaque: true },
  { nome: "Festival do Mel e Auto de Natal", descricao: "Evento que fortalece o setor apícola local com degustação de mel.", data: "2027-12-17", tipo: "Gastronomia", imagem: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800", destaque: false },
  { nome: "Festa do Peão - Riacho da Cruz", descricao: "Tradicional festa de peão com rodeio, shows country e muito forró.", data: "2027-06-29", tipo: "Tradicional", imagem: "https://images.unsplash.com/photo-1531379410329-1d4d808c1c54?auto=format&fit=crop&q=80&w=800", destaque: false }
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

    try {
      // 1. Guias
      try {
        const guiasSnap = await getDocs(collection(db, 'guias'));
        for (const docSnap of guiasSnap.docs) {
          await deleteDoc(doc(db, 'guias', docSnap.id));
        }
        for (const guia of guiasData) {
          await addDoc(collection(db, 'guias'), guia);
        }
        results.push({ collection: 'guias', success: true, count: guiasData.length });
      } catch (e) {
        results.push({ collection: 'guias', success: false, count: 0, error: String(e) });
      }

      // 2. Gastronomia
      try {
        const gastSnap = await getDocs(collection(db, 'gastronomia'));
        for (const docSnap of gastSnap.docs) {
          await deleteDoc(doc(db, 'gastronomia', docSnap.id));
        }
        for (const item of gastronomiaData) {
          await addDoc(collection(db, 'gastronomia'), item);
        }
        results.push({ collection: 'gastronomia', success: true, count: gastronomiaData.length });
      } catch (e) {
        results.push({ collection: 'gastronomia', success: false, count: 0, error: String(e) });
      }

      // 3. Hotéis
      try {
        const hoteisSnap = await getDocs(collection(db, 'hoteis'));
        for (const docSnap of hoteisSnap.docs) {
          await deleteDoc(doc(db, 'hoteis', docSnap.id));
        }
        for (const hotel of hoteisData) {
          await addDoc(collection(db, 'hoteis'), hotel);
        }
        results.push({ collection: 'hoteis', success: true, count: hoteisData.length });
      } catch (e) {
        results.push({ collection: 'hoteis', success: false, count: 0, error: String(e) });
      }

      // 4. Pontos
      try {
        const pontosSnap = await getDocs(collection(db, 'pontos'));
        for (const docSnap of pontosSnap.docs) {
          await deleteDoc(doc(db, 'pontos', docSnap.id));
        }
        for (const ponto of pontosData) {
          await addDoc(collection(db, 'pontos'), ponto);
        }
        results.push({ collection: 'pontos', success: true, count: pontosData.length });
      } catch (e) {
        results.push({ collection: 'pontos', success: false, count: 0, error: String(e) });
      }

      // 5. Eventos
      try {
        const eventosSnap = await getDocs(collection(db, 'eventos'));
        for (const docSnap of eventosSnap.docs) {
          await deleteDoc(doc(db, 'eventos', docSnap.id));
        }
        for (const evento of eventosData) {
          await addDoc(collection(db, 'eventos'), evento);
        }
        results.push({ collection: 'eventos', success: true, count: eventosData.length });
      } catch (e) {
        results.push({ collection: 'eventos', success: false, count: 0, error: String(e) });
      }

    } catch (error) {
      console.error('Error na migração:', error);
    }

    setResultados(results);
    setMigrando(false);
  };

  const totalMigrao = resultados.filter(r => r.success).reduce((acc, r) => acc + r.count, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Migração de Dados</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Database className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold">Importar Dados para o Banco</h2>
            <p className="text-sm text-gray-500">Esta ação vai importar todos os dados do site para o Firebase Firestore</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Atenção</p>
              <p className="text-sm text-yellow-700">Esta ação vai substituir TODOS os dados existentes nas coleções. Dados antigos serão excluídos.</p>
            </div>
          </div>
        </div>

        <button
          onClick={migrarTudo}
          disabled={migrando}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {migrando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
          {migrando ? 'Migrando...' : 'Iniciar Migração'}
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Resultados da Migração</h2>
          <div className="space-y-3">
            {resultados.map((result) => (
              <div key={result.collection} className={`flex items-center justify-between p-3 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2">
                  {result.success ? <Check className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
                  <span className="font-medium">{result.collection}</span>
                </div>
                <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                  {result.success ? `${result.count} itens` : 'Erro'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold text-blue-800">Total migrado: {totalMigrao} itens</p>
          </div>
        </div>
      )}
    </div>
  );
}