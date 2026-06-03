"use client";

import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Upload, X, Loader2, Megaphone, Power, PowerOff } from 'lucide-react';

interface Destaque {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

export default function AdminDestaques() {
  const [destaques, setDestaques] = useState<Destaque[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Destaque | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Destaque>>({});
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'destaques'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Destaque));
      setDestaques(data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (item?: Destaque) => {
    if (item) { setEditing(item); setForm(item); }
    else { setEditing(null); setForm({ title: '', description: '', buttonText: 'Saiba Mais', link: '', imageUrl: '', isActive: true, order: 0 }); }
    setImagemFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let url = form.imageUrl || '';
      if (imagemFile) {
        const storageRef = ref(storage, `destaques/${Date.now()}_${imagemFile.name}`);
        await uploadBytes(storageRef, imagemFile);
        url = await getDownloadURL(storageRef);
      }
      const payload = { 
        title: form.title || '',
        description: form.description || '',
        buttonText: form.buttonText || 'Saiba Mais',
        link: form.link || '',
        imageUrl: url,
        isActive: form.isActive ?? true,
        order: Number(form.order) || 0
      };
      
      if (editing) { await updateDoc(doc(db, 'destaques', editing.id), payload); }
      else { await addDoc(collection(db, 'destaques'), payload); }
      setShowModal(false);
      fetchData();
    } catch (error) { console.error('Error:', error); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Excluir este destaque permanente?')) {
      await deleteDoc(doc(db, 'destaques', id));
      fetchData();
    }
  };

  const toggleActive = async (item: Destaque) => {
    await updateDoc(doc(db, 'destaques', item.id), { isActive: !item.isActive });
    fetchData();
  };

  const filtered = destaques.filter(e => (e.title || '').toLowerCase().includes(search.toLowerCase()));
  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 font-sans text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-headline flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-amber-500" /> Destaques & Anúncios
        </h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors font-sans text-sm font-semibold shadow-md">
          <Plus className="w-5 h-5" /> Novo Destaque
        </button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Buscar destaques..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} w-full sm:w-64`} />
      </div>
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item.id} className={`bg-white dark:bg-zinc-900 border ${item.isActive ? 'border-amber-200 dark:border-amber-900/50 shadow-md shadow-amber-500/10' : 'border-gray-200 dark:border-zinc-800 opacity-60'} rounded-xl overflow-hidden transition-all duration-300`}>
              <div className="h-48 bg-gray-200 dark:bg-zinc-800 relative group">
                {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-sans text-sm">Sem imagem</div>}
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-1 rounded font-sans font-bold text-xs text-white ${item.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {item.isActive ? 'Online' : 'Pausado'}
                  </span>
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                  <span className="px-2 py-1 rounded font-sans font-bold text-xs bg-black/50 text-white backdrop-blur-md">
                    Ordem: {item.order}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white font-sans text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 font-sans mb-3">{item.description}</p>
                <div className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 p-2 rounded text-gray-500 truncate mb-4">
                  Btn: {item.buttonText} → {item.link || 'Sem link'}
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-100 dark:border-zinc-800 pt-3">
                  <button onClick={() => toggleActive(item)} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${item.isActive ? 'text-amber-700 bg-amber-100 hover:bg-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:hover:bg-amber-900/50' : 'text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-400 dark:bg-green-900/30 dark:hover:bg-green-900/50'}`}>
                    {item.isActive ? <><PowerOff className="w-3.5 h-3.5" /> Pausar</> : <><Power className="w-3.5 h-3.5" /> Ativar</>}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(item)} className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filtered.length === 0 && !loading && <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-sans">Nenhum anúncio encontrado</div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-headline flex items-center gap-2">
                {editing ? 'Editar' : 'Novo'} Destaque
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 rounded transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Título Grande</label><input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} required placeholder="Ex: Festival de Verão" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Descrição / Subtítulo</label><textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={3} placeholder="Breve texto sobre o atrativo..." /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Texto do Botão</label><input type="text" value={form.buttonText || ''} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className={inputClass} required placeholder="Ex: Saiba Mais" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Link do Botão</label><input type="text" value={form.link || ''} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inputClass} placeholder="Ex: /cavernas ou https://..." /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Ordem de Exibição (Número)</label><input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} /></div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" checked={form.isActive ?? true} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                <label htmlFor="isActive" className="text-sm font-bold text-gray-700 dark:text-gray-300 font-sans cursor-pointer">Ativo (Aparecer no Carrossel da Home)</label>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">Imagem de Fundo (Horizontal recomendada)</label>
                <div className="flex items-center gap-4">
                  {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-gray-200 dark:border-zinc-800" />}
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-3 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:border-amber-500 transition-all font-sans text-sm font-medium w-full justify-center">
                    <Upload className="w-5 h-5 text-amber-500" /><span>Selecionar Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImagemFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                {imagemFile && <p className="text-xs text-amber-600 mt-2 font-medium ml-1">Arquivo selecionado: {imagemFile.name}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-zinc-800 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg text-gray-700 dark:text-gray-300 font-sans text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50 font-sans text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Destaque'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
