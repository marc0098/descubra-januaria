"use client";

import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Upload, X, Loader2, Calendar } from 'lucide-react';

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  imagem: string;
  destaque: boolean;
}

export default function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Evento | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Evento>>({});
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'eventos'), orderBy('data', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Evento));
      setEventos(data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (item?: Evento) => {
    if (item) { setEditing(item); setForm(item); }
    else { setEditing(null); setForm({ nome: '', descricao: '', data: '', imagem: '', destaque: false }); }
    setImagemFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imagemUrl = form.imagem || '';
      if (imagemFile) {
        const storageRef = ref(storage, `eventos/${Date.now()}_${imagemFile.name}`);
        await uploadBytes(storageRef, imagemFile);
        imagemUrl = await getDownloadURL(storageRef);
      }
      const payload = { ...form, imagem: imagemUrl, destaque: form.destaque || false };
      if (editing) { await updateDoc(doc(db, 'eventos', editing.id), payload); }
      else { await addDoc(collection(db, 'eventos'), payload); }
      setShowModal(false);
      fetchData();
    } catch (error) { console.error('Error:', error); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Excluir este evento?')) {
      await deleteDoc(doc(db, 'eventos', id));
      fetchData();
    }
  };

  const filtered = eventos.filter(e => (e.nome || '').toLowerCase().includes(search.toLowerCase()));
  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 font-sans text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-headline">Eventos</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-sans text-sm font-semibold">
          <Plus className="w-5 h-5" /> Novo Evento
        </button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Buscar eventos..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} w-full sm:w-64`} />
      </div>
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
              <div className="h-40 bg-gray-200 dark:bg-zinc-800 relative">
                {item.imagem ? <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-sans text-sm">Sem imagem</div>}
                {item.destaque && <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded font-sans font-bold">Destaque</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white font-sans">{item.nome}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 font-sans">{item.descricao}</p>
                <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400 text-xs font-sans">
                  <Calendar className="w-3.5 h-3.5" />{item.data}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => openModal(item)} className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filtered.length === 0 && !loading && <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-sans">Nenhum evento encontrado</div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-headline">{editing ? 'Editar' : 'Novo'} Evento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 rounded transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Nome</label><input type="text" value={form.nome || ''} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={inputClass} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Descrição</label><textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className={inputClass} rows={4} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Data</label><input type="date" value={form.data || ''} onChange={(e) => setForm({ ...form, data: e.target.value })} className={inputClass} required /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="destaque" checked={form.destaque || false} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} className="w-4 h-4 accent-purple-600" />
                <label htmlFor="destaque" className="text-sm text-gray-700 dark:text-gray-300 font-sans">Mostrar na home</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Imagem</label>
                <div className="flex items-center gap-4">
                  {form.imagem && <img src={form.imagem} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-zinc-800" />}
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-sans text-sm">
                    <Upload className="w-5 h-5" /><span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImagemFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg text-gray-700 dark:text-gray-300 font-sans text-sm">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 font-sans text-sm font-semibold flex items-center gap-2">
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
