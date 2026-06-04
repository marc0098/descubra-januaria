"use client";

import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Upload, X, Loader2, MapPin } from 'lucide-react';

interface Restaurante {
  id: string;
  nome: string;
  descricao: string;
  imagens: string[];
  endereco: string;
  telefone: string;
  instagramUrl?: string;
  websiteUrl?: string;
  destaque: boolean;
}

export default function AdminGastronomia() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Restaurante | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Restaurante>>({});
  const [imagensFiles, setImagensFiles] = useState<File[]>([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'gastronomia'), orderBy('nome'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Restaurante));
      setRestaurantes(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (item?: Restaurante) => {
    if (item) { setEditing(item); setForm(item); }
    else { setEditing(null); setForm({ nome: '', descricao: '', imagens: [], endereco: '', telefone: '', instagramUrl: '', websiteUrl: '', destaque: false }); }
    setImagensFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imagensUrls = form.imagens || [];
      for (const file of imagensFiles) {
        const storageRef = ref(storage, `gastronomia/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imagensUrls = [...imagensUrls, url];
      }
      const payload = { ...form, imagens: imagensUrls, destaque: form.destaque || false };
      if (editing) { await updateDoc(doc(db, 'gastronomia', editing.id), payload); }
      else { await addDoc(collection(db, 'gastronomia'), payload); }
      setShowModal(false);
      fetchData();
    } catch (error) { console.error('Error:', error); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && window.confirm('Excluir este restaurante?')) {
      await deleteDoc(doc(db, 'gastronomia', id));
      fetchData();
    }
  };

  const filtered = restaurantes.filter(r => (r.nome || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-headline">Gastronomia</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-sans text-sm font-semibold">
          <Plus className="w-5 h-5" /> Novo Item
        </button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" />
      </div>
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="h-40 bg-gray-200 dark:bg-zinc-800 relative">
                {item.imagens?.[0] ? (
                  <img src={item.imagens[0]} alt={item.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-sans text-sm">Sem imagem</div>
                )}
                {item.destaque && (<span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-sans font-bold">Destaque</span>)}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white font-sans">{item.nome}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 font-sans">{item.descricao}</p>
                {item.endereco && (
                  <div className="flex items-center gap-1 mt-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-sans text-xs line-clamp-1">{item.endereco}</span>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => openModal(item)} className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filtered.length === 0 && !loading && <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-sans">Nenhum item encontrado</div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-headline">{editing ? 'Editar' : 'Novo'} Item</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 rounded transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Nome</label>
                <input type="text" value={form.nome || ''} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Descrição</label>
                <textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" rows={4} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Endereço</label>
                  <input type="text" value={form.endereco || ''} onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Telefone</label>
                  <input type="tel" value={form.telefone || ''} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Link do Instagram</label>
                  <input type="url" placeholder="https://instagram.com/..." value={form.instagramUrl || ''} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Link do Site / Outro</label>
                  <input type="url" placeholder="https://..." value={form.websiteUrl || ''} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="destaque" checked={form.destaque || false} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} className="w-4 h-4 accent-orange-600" />
                <label htmlFor="destaque" className="text-sm text-gray-700 dark:text-gray-300 font-sans">Marcar como destaque</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">Imagens (URLs ou Upload)</label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {form.imagens?.map((url, i) => (
                      <div key={i} className="relative">
                        <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-zinc-800" />
                        <button type="button" onClick={() => setForm({ ...form, imagens: form.imagens?.filter((_, j) => j !== i) })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    {imagensFiles.map((file, i) => (
                      <div key={'file'+i} className="relative"><img src={URL.createObjectURL(file)} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-dashed border-orange-500" />
                        <button type="button" onClick={() => setImagensFiles(imagensFiles.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex-1 w-full flex items-center gap-2">
                      <input type="url" id="url-input-gastronomia" placeholder="Cole o link da imagem e clique Adicionar..." className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 font-sans text-sm" />
                      <button type="button" onClick={() => {
                        const input = document.getElementById('url-input-gastronomia') as HTMLInputElement;
                        if (input && input.value) {
                          setForm({ ...form, imagens: [...(form.imagens || []), input.value] });
                          input.value = '';
                        }
                      }} className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 rounded-lg text-sm font-bold whitespace-nowrap hover:bg-gray-300 dark:hover:bg-zinc-700">Adicionar URL</button>
                    </div>
                    <span className="text-xs text-gray-500 font-sans mx-1">ou</span>
                    <label className="flex items-center justify-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 font-sans text-sm whitespace-nowrap w-full sm:w-auto">
                      <Upload className="w-5 h-5" /><span>PC</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) setImagensFiles(prev => [...prev, ...files]);
                      }} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg text-gray-700 dark:text-gray-300 font-sans text-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 font-sans text-sm font-semibold flex items-center gap-2 transition-colors">
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
