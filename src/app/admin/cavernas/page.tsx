"use client";

import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Upload, X, Loader2, Mountain, Map, Compass, Anchor, Palmtree, Camera, Palette, Info } from 'lucide-react';

interface Atrativo {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  imagem: string;
  trilha: string;
  dificuldade: string;
  cor_tema: string;
  text_tema: string;
  border_tema: string;
  icone: string;
}

const iconMap: Record<string, React.ElementType> = {
  Mountain, Map, Compass, Anchor, Palmtree, Camera, Palette, Info
};
const iconsList = Object.keys(iconMap);

const temasList = [
  { label: 'Primário', bg: 'bg-primary', text: 'text-primary', border: 'border-primary' },
  { label: 'Secundário', bg: 'bg-secondary', text: 'text-secondary', border: 'border-secondary' },
  { label: 'Terciário', bg: 'bg-tertiary', text: 'text-tertiary', border: 'border-tertiary' }
];

const atrativosLocaisDefault: Atrativo[] = [
  {
    id: 'lapa-do-janelao',
    nome: 'Caverna do Janelão',
    categoria: 'Caverna Monumental',
    descricao: 'O cartão-postal do parque, destaca-se por sua monumentalidade, claraboias naturais e abriga a "Perna da Bailarina", a maior estalactite do mundo com 28 metros.',
    imagem: '/img/janelao.jpeg',
    trilha: 'Trilha do Janelão',
    dificuldade: 'Média/Alta',
    cor_tema: 'bg-primary',
    text_tema: 'text-primary',
    border_tema: 'border-primary',
    icone: 'Mountain'
  },
  {
    id: 'lapa-bonita',
    nome: 'Lapa Bonita',
    categoria: 'Caverna',
    descricao: 'Rica em espeleotemas como estalactites e estalagmites. É uma das poucas cavernas totalmente escuras abertas à visitação, oferecendo uma experiência imersiva com lanternas.',
    imagem: '/img/gruta-bonita.jpeg',
    trilha: 'Trilha da Lapa Bonita',
    dificuldade: 'Fácil/Média',
    cor_tema: 'bg-tertiary',
    text_tema: 'text-tertiary',
    border_tema: 'border-tertiary',
    icone: 'Mountain'
  },
  {
    id: 'lapa-do-boquete',
    nome: 'Lapa do Boquete',
    categoria: 'Sítio Arqueológico',
    descricao: 'Um dos sítios arqueológicos mais importantes do parque. Escavações revelaram sepultamentos e instrumentos que comprovam a ocupação humana de até 12.000 anos.',
    imagem: '/img/lapa-do-boquete.jpeg',
    trilha: 'Trilha do Boquete',
    dificuldade: 'Fácil',
    cor_tema: 'bg-secondary',
    text_tema: 'text-secondary',
    border_tema: 'border-secondary',
    icone: 'Map'
  },
  {
    id: 'lapa-do-indio',
    nome: 'Lapa do Índio',
    categoria: 'Sítio Arqueológico',
    descricao: 'Localizada em uma área alta, oferece não apenas impressionantes painéis de pinturas rupestres, mas também um mirante com uma bela vista para a abertura do Janelão.',
    imagem: '/img/lapa-do-indio.jpeg',
    trilha: 'Trilha da Lapa do Índio',
    dificuldade: 'Fácil',
    cor_tema: 'bg-primary',
    text_tema: 'text-primary',
    border_tema: 'border-primary',
    icone: 'Palette'
  },
  {
    id: 'lapa-do-caboclo',
    nome: 'Lapa do Caboclo',
    categoria: 'Sítio Arqueológico',
    descricao: 'Destaca-se pelos paredões rochosos repletos de pinturas rupestres do "estilo Caboclo", caracterizado por formas geométricas bem definidas.',
    imagem: '/img/lapa-do-caboclo.jpeg',
    trilha: 'Trilha do Caboclo e Carlúcio',
    dificuldade: 'Média',
    cor_tema: 'bg-tertiary',
    text_tema: 'text-tertiary',
    border_tema: 'border-tertiary',
    icone: 'Palette'
  },
  {
    id: 'lapa-do-cascudo',
    nome: 'Lapa do Cascudo',
    categoria: 'Caverna',
    descricao: 'O nome deriva da presença de peixes cascudos em trechos onde o Rio Peruaçu ressurge dentro da cavidade. Faz parte dos roteiros mais profundos do parque.',
    imagem: '/img/lapa-do-cascudo.jpeg',
    trilha: 'Arco do André / Lapa dos Troncos',
    dificuldade: 'Alta',
    cor_tema: 'bg-secondary',
    text_tema: 'text-secondary',
    border_tema: 'border-secondary',
    icone: 'Anchor'
  },
  {
    id: 'lapa-dos-troncos',
    nome: 'Lapa dos Troncos',
    categoria: 'Caverna',
    descricao: 'Frequentemente visitada como parte da trilha do Arco do André, uma rota exigente e voltada para aventureiros que buscam contato intenso com a natureza e mirantes.',
    imagem: '/img/lapa-dos-troncos.jpeg',
    trilha: 'Arco do André',
    dificuldade: 'Alta',
    cor_tema: 'bg-primary',
    text_tema: 'text-primary',
    border_tema: 'border-primary',
    icone: 'Compass'
  },
  {
    id: 'mirante-mundo-inteiro',
    nome: 'Mirante Mundo Inteiro',
    categoria: 'Mirante',
    descricao: 'Oferece vistas privilegiadas e panorâmicas da paisagem do parque, permitindo contemplar as formações rochosas e a grandiosidade do cânion do Rio Peruaçu.',
    imagem: '/img/mirante-mundo-inteiro.jpeg',
    trilha: 'Arco do André',
    dificuldade: 'Alta',
    cor_tema: 'bg-tertiary',
    text_tema: 'text-tertiary',
    border_tema: 'border-tertiary',
    icone: 'Camera'
  }
];

export default function AdminCavernas() {
  const [atrativos, setAtrativos] = useState<Atrativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Atrativo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Atrativo>>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');

  const fetchAtrativos = async () => {
    try {
      const q = query(collection(db, 'atrativos'), orderBy('nome'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Atrativo));
      setAtrativos(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAtrativos(); }, []);

  const handleMigrate = async () => {
    if (confirm('Deseja popular o banco com os 8 atrativos iniciais (apenas os que ainda não existem)?')) {
      setLoading(true);
      try {
        for (const item of atrativosLocaisDefault) {
          const exists = atrativos.find(a => a.nome === item.nome);
          if (!exists) {
            const { id, ...data } = item;
            await addDoc(collection(db, 'atrativos'), data);
          }
        }
        await fetchAtrativos();
        alert('Migração concluída com sucesso!');
      } catch (error) {
        console.error(error);
        alert('Erro ao migrar atrativos.');
      } finally {
        setLoading(false);
      }
    }
  };

  const openModal = (atrativo?: Atrativo) => {
    if (atrativo) {
      setEditing(atrativo);
      setForm(atrativo);
    } else {
      setEditing(null);
      setForm({ 
        nome: '', 
        categoria: 'Caverna', 
        descricao: '', 
        trilha: '', 
        dificuldade: 'Média', 
        imagem: '',
        icone: 'Mountain',
        cor_tema: 'bg-primary',
        text_tema: 'text-primary',
        border_tema: 'border-primary'
      });
    }
    setFotoFile(null);
    setShowModal(true);
  };

  const handleTemaChange = (index: number) => {
    const tema = temasList[index];
    setForm({
      ...form,
      cor_tema: tema.bg,
      text_tema: tema.text,
      border_tema: tema.border
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let fotoUrl = form.imagem || '';
      if (fotoFile) {
        const storageRef = ref(storage, `atrativos/${Date.now()}_${fotoFile.name}`);
        await uploadBytes(storageRef, fotoFile);
        fotoUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        ...form,
        imagem: fotoUrl,
      };

      if (editing) {
        await updateDoc(doc(db, 'atrativos', editing.id), payload);
      } else {
        await addDoc(collection(db, 'atrativos'), payload);
      }
      
      setShowModal(false);
      fetchAtrativos();
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao salvar o atrativo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Tem certeza que deseja excluir este atrativo?')) {
      await deleteDoc(doc(db, 'atrativos', id));
      fetchAtrativos();
    }
  };

  const filtered = atrativos.filter(a => (a.nome || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-headline">Atrativos & Cavernas</h1>
        <div className="flex items-center gap-3">
          {atrativos.length === 0 && !loading && (
            <button onClick={handleMigrate} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-sans text-sm font-semibold">
              Migrar Dados Iniciais
            </button>
          )}
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-sans text-sm font-semibold">
            <Plus className="w-5 h-5" /> Novo Atrativo
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar atrativos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase font-sans">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase font-sans">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase font-sans">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase font-sans">Trilha</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase font-sans">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {filtered.map(atrativo => {
                  const Icon = iconMap[atrativo.icone] || Mountain;
                  return (
                    <tr key={atrativo.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        {atrativo.imagem ? (
                          <img src={atrativo.imagem} alt={atrativo.nome} className="w-16 h-12 rounded-lg object-cover border border-gray-200 dark:border-zinc-700" />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                            <Mountain className="text-gray-400 dark:text-gray-500 w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 font-sans text-sm">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          {atrativo.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-sans text-sm">{atrativo.categoria}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-sans text-sm">{atrativo.trilha}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openModal(atrativo)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(atrativo.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-sans">Nenhum atrativo encontrado</div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-headline">{editing ? 'Editar' : 'Novo'} Atrativo</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Nome do Atrativo</label>
                  <input
                    type="text"
                    value={form.nome || ''}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Categoria</label>
                  <input
                    type="text"
                    value={form.categoria || ''}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                    placeholder="Ex: Caverna, Mirante..."
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Descrição</label>
                <textarea
                  value={form.descricao || ''}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Trilha/Roteiro</label>
                  <input
                    type="text"
                    value={form.trilha || ''}
                    onChange={(e) => setForm({ ...form, trilha: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                    placeholder="Ex: Arco do André"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Dificuldade</label>
                  <select
                    value={form.dificuldade || 'Média'}
                    onChange={(e) => setForm({ ...form, dificuldade: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Fácil/Média">Fácil/Média</option>
                    <option value="Média">Média</option>
                    <option value="Média/Alta">Média/Alta</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Ícone</label>
                  <select
                    value={form.icone || 'Mountain'}
                    onChange={(e) => setForm({ ...form, icone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                  >
                    {iconsList.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Tema Visual</label>
                  <select
                    value={temasList.findIndex(t => t.bg === form.cor_tema)}
                    onChange={(e) => handleTemaChange(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 font-sans text-sm"
                  >
                    {temasList.map((t, idx) => <option key={t.bg} value={idx}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Imagem</label>
                <div className="flex items-center gap-4">
                  {form.imagem && <img src={form.imagem} alt="Preview" className="w-32 h-20 rounded-lg object-cover border border-gray-200 dark:border-zinc-800" />}
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors font-sans text-sm font-semibold">
                    <Upload className="w-5 h-5" />
                    <span>Fazer Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setFotoFile(e.target.files?.[0] || null)} />
                  </label>
                  {fotoFile && <span className="text-sm text-green-600">Arquivo selecionado: {fotoFile.name}</span>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-sans text-sm transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 font-sans text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Atrativo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
