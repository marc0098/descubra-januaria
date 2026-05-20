"use client";

import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Upload, X, Loader2, MapPin } from 'lucide-react';

interface Hotel {
  id: string;
  nome: string;
  descricao: string;
  imagens: string[];
  endereco: string;
  telefone: string;
  destaque: boolean;
}

export default function AdminHoteis() {
  const [hoteis, setHoteis] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Hotel>>({});
  const [imagensFiles, setImagensFiles] = useState<File[]>([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'hoteis'), orderBy('nome'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Hotel));
      setHoteis(data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (item?: Hotel) => {
    if (item) { setEditing(item); setForm(item); }
    else { setEditing(null); setForm({ nome: '', descricao: '', imagens: [], endereco: '', telefone: '', destaque: false }); }
    setImagensFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imagensUrls = form.imagens || [];
      for (const file of imagensFiles) {
        const storageRef = ref(storage, `hoteis/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        imagensUrls = [...imagensUrls, await getDownloadURL(storageRef)];
      }
      const payload = { ...form, imagens: imagensUrls, destaque: form.destaque || false };
      if (editing) { await updateDoc(doc(db, 'hoteis', editing.id), payload); }
      else { await addDoc(collection(db, 'hoteis'), payload); }
      setShowModal(false);
      fetchData();
    } catch (error) { console.error('Error:', error); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Excluir este hotel?')) {
      await deleteDoc(doc(db, 'hoteis', id));
      fetchData();
    }
  };

  const filtered = hoteis.filter(h => (h.nome || '').toLowerCase().includes(search.toLowerCase()));

  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 font-sans text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-headline">Hotéis e Estadias</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors font-sans text-sm font-semibold">
          <Plus className="w-5 h-5" /> Novo Hotel
        </button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Buscar hotéis..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} w-full sm:w-64`} />
      </div>
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-cyan-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 bg-gray-200 dark:bg-zinc-800 relative">
                {item.imagens?.[0] ? <img src={item.imagens[0]} alt={item.nome} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-sans text-sm">Sem imagem</div>}
                {item.destaque && <span className="absolute top-2 right-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded font-sans font-bold">Destaque</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white font-sans">{item.nome}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 font-sans">{item.descricao}</p>
                {item.endereco && <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400"><MapPin className="w-3.5 h-3.5" /><span className="font-sans text-xs line-clamp-1">{item.endereco}</span></div>}
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => openModal(item)} className="p-2 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filtered.length === 0 && !loading && <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-sans">Nenhum hotel encontrado</div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-headline">{editing ? 'Editar' : 'Novo'} Hotel</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 rounded transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Nome</label><input type="text" value={form.nome || ''} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={inputClass} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Descrição</label><textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className={inputClass} rows={4} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Endereço</label><input type="text" value={form.endereco || ''} onChange={(e) => setForm({ ...form, endereco: e.target.value })} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Telefone</label><input type="tel" value={form.telefone || ''} onChange={(e) => setForm({ ...form, telefone: e.target.value })} className={inputClass} /></div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="destaque" checked={form.destaque || false} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} className="w-4 h-4 accent-cyan-600" />
                <label htmlFor="destaque" className="text-sm text-gray-700 dark:text-gray-300 font-sans">Marcar como destaque</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Imagens</label>
                <div className="flex flex-wrap gap-2">
                  {form.imagens?.map((url, i) => (
                    <div key={i} className="relative"><img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => setForm({ ...form, imagens: form.imagens?.filter((_, j) => j !== i) })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-sans text-sm">
                    <Upload className="w-5 h-5" /><span>Adicionar</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setImagensFiles(Array.from(e.target.files || []))} />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg text-gray-700 dark:text-gray-300 font-sans text-sm">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50 font-sans text-sm font-semibold flex items-center gap-2">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
