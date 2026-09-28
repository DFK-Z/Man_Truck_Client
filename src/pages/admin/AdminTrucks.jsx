import { useEffect, useState, useRef } from 'react';
import api from '../../lib/api.js';

const EMPTY = { brand: '', model: '' };

export default function AdminTrucks() {
  const [trucks,  setTrucks]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [flash,   setFlash]   = useState('');
  const fileRef = useRef(null);

  const load = () => {
    setLoading(true);
    api.get('/trucks').then(r => setTrucks(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toast = msg => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const openCreate = () => { setForm(EMPTY); setFile(null); setPreview(''); setError(''); setModal('create'); };
  const openEdit   = t  => { setForm({ brand: t.brand, model: t.model }); setFile(null); setPreview(t.image ? `/uploads/${t.image}` : ''); setError(''); setModal(t); };
  const close      = () => { setModal(null); setError(''); };

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const data = new FormData();
    data.append('brand', form.brand.trim());
    data.append('model', form.model.trim());
    if (file) data.append('image', file);
    try {
      if (modal === 'create') {
        await api.post('/trucks', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast('Грузовик добавлен!');
      } else {
        await api.put(`/trucks/${modal.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast('Грузовик обновлён!');
      }
      load(); close();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm('Удалить этот грузовик?')) return;
    try { await api.delete(`/trucks/${id}`); toast('Грузовик удалён!'); load(); }
    catch { alert('Ошибка удаления'); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Грузовики</h2>
          <p className="text-white/30 text-sm mt-0.5">{trucks.length} единиц техники</p>
        </div>
        <button onClick={openCreate} className="btn-primary !py-2.5 !px-5 text-sm">
          + Добавить
        </button>
      </div>

      {flash && <div className="mb-4 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">{flash}</div>}

      {loading ? (
        <div className="text-center py-20 text-white/20">Загрузка...</div>
      ) : trucks.length === 0 ? (
        <div className="glass p-16 text-center">
          <div className="text-5xl mb-4">🚛</div>
          <p className="text-white/30 mb-4">Грузовики не добавлены</p>
          <button onClick={openCreate} className="btn-primary !py-2 !px-5 text-sm">Добавить первый</button>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/6">
              <tr>
                {['Фото','ID','Бренд','Модель','Просм.',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {trucks.map(t => (
                <tr key={t.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    {t.image
                      ? <img src={`/uploads/${t.image}`} alt={t.brand} className="w-16 h-10 object-cover rounded-lg border border-white/8" />
                      : <div className="w-16 h-10 bg-white/4 rounded-lg flex items-center justify-center text-white/20 text-lg">🚛</div>
                    }
                  </td>
                  <td className="px-4 py-3 text-white/20 font-mono text-xs">#{t.id}</td>
                  <td className="px-4 py-3 font-semibold text-white/90">{t.brand}</td>
                  <td className="px-4 py-3 text-white/50">{t.model}</td>
                  <td className="px-4 py-3 text-white/25">{t.views}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(t)} className="text-blue-400 hover:text-blue-300 font-medium transition-colors text-xs">Изменить</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-400/70 hover:text-red-400 font-medium transition-colors text-xs">Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={e => e.target === e.currentTarget && close()}>
          <div className="glass-strong w-full max-w-md p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {modal === 'create' ? '+ Добавить грузовик' : 'Редактировать'}
              </h3>
              <button onClick={close} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all">✕</button>
            </div>

            {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Бренд</label>
                <input type="text" className="input" placeholder="MAN"
                  value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} required />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Модель</label>
                <input type="text" className="input" placeholder="TGS 26.440"
                  value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))} required />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                  Фото {modal !== 'create' && <span className="normal-case font-normal text-white/20">(оставьте пустым чтобы не менять)</span>}
                </label>
                {preview && (
                  <img src={preview} alt="preview" className="w-full h-36 object-cover rounded-xl mb-3 border border-white/10" />
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFile}
                  className="block w-full text-sm text-white/30 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/15 file:text-orange-400 hover:file:bg-orange-500/25 cursor-pointer transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button type="button" onClick={close} className="flex-1 py-3 glass border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-xl font-medium transition-all text-sm">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
