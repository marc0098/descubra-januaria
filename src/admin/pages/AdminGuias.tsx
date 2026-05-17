import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, deleteField } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Upload, X, Loader2, Phone, Mail, MapPin } from 'lucide-react';

interface Guia {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  whatsapp: string;
  email: string;
  especialidades: string[];
  locality?: string;
}

const defaultEspecialidades = ['Cavernas', 'Cidade', 'Rurais', 'Grupos', 'Aventura'];

export default function AdminGuias() {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Guia | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Guia>>({});
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');

  const fetchGuias = async () => {
    try {
      const q = query(collection(db, 'guias'), orderBy('nome'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guia));
      setGuias(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuias(); }, []);

  const openModal = (guia?: Guia) => {
    if (guia) {
      setEditing(guia);
      setForm(guia);
    } else {
      setEditing(null);
      setForm({ nome: '', descricao: '', whatsapp: '', email: '', especialidades: [], foto: '' });
    }
    setFotoFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let fotoUrl = form.foto || '';
      if (fotoFile) {
        const storageRef = ref(storage, `guias/${Date.now()}_${fotoFile.name}`);
        await uploadBytes(storageRef, fotoFile);
        fotoUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        ...form,
        foto: fotoUrl,
        especialidades: form.especialidades || [],
      };

      if (editing) {
        await updateDoc(doc(db, 'guias', editing.id), payload);
      } else {
        await addDoc(collection(db, 'guias'), payload);
      }
      
      setShowModal(false);
      fetchGuias();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este guia?')) {
      await deleteDoc(doc(db, 'guias', id));
      fetchGuias();
    }
  };

  const toggleEspecialidade = (esp: string) => {
    const current = form.especialidades || [];
    if (current.includes(esp)) {
      setForm({ ...form, especialidades: current.filter(e => e !== esp) });
    } else {
      setForm({ ...form, especialidades: [...current, esp] });
    }
  };

  const filtered = guias.filter(g => g.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Guias Turísticos</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Novo Guia
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar guias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidades</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map(guia => (
                  <tr key={guia.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {guia.foto ? (
                        <img src={guia.foto} alt={guia.nome} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">?</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{guia.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{guia.whatsapp}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(guia.especialidades || []).slice(0, 3).map(esp => (
                          <span key={esp} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{esp}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(guia)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(guia.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-12 text-center text-gray-500">Nenhum guia encontrado</div>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editing ? 'Editar' : 'Novo'} Guia</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome || ''}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={form.descricao || ''}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={form.whatsapp || ''}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="(38) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
                <div className="flex flex-wrap gap-2">
                  {defaultEspecialidades.map(esp => (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => toggleEspecialidade(esp)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        form.especialidades?.includes(esp) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {esp}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                <div className="flex items-center gap-4">
                  {form.foto && <img src={form.foto} alt="Preview" className="w-20 h-20 rounded-full object-cover" />}
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setFotoFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
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