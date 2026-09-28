import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import Stars from '../../components/Stars.jsx';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash,   setFlash]   = useState('');

  const load = () => {
    setLoading(true);
    api.get('/reviews/admin').then(r => setReviews(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toast = msg => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const handleToggle = async id => {
    try { const r = await api.patch(`/reviews/${id}/toggle`); toast(r.data.message); load(); }
    catch { toast('Ошибка'); }
  };

  const handleDelete = async id => {
    if (!confirm('Удалить этот отзыв?')) return;
    try { await api.delete(`/reviews/${id}`); toast('Отзыв удалён'); load(); }
    catch { toast('Ошибка удаления'); }
  };

  const approved   = reviews.filter(r => r.is_approved).length;
  const unapproved = reviews.filter(r => !r.is_approved).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Отзывы</h2>
          <p className="text-white/30 text-sm mt-0.5">Модерация отзывов клиентов</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold rounded-lg">
            ✅ {approved}
          </span>
          <span className="px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold rounded-lg">
            ⏳ {unapproved}
          </span>
        </div>
      </div>

      {flash && <div className="mb-4 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">{flash}</div>}

      {loading ? (
        <div className="text-center py-20 text-white/20">Загрузка...</div>
      ) : reviews.length === 0 ? (
        <div className="glass p-16 text-center">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-white/30">Нет отзывов</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/6">
              <tr>
                {['ID','Пользователь','Оценка','Сообщение','Дата','Статус',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-white/30 text-xs font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {reviews.map(r => (
                <tr key={r.id} className={`hover:bg-white/3 transition-colors ${!r.is_approved ? 'bg-amber-400/3' : ''}`}>
                  <td className="px-4 py-3 text-white/20 font-mono text-xs">#{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400/30 to-amber-400/30 border border-orange-400/20 flex items-center justify-center text-[10px] font-bold text-orange-300 shrink-0">
                        {r.user_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="text-white/70 font-medium text-xs whitespace-nowrap">{r.user_name ?? <span className="text-white/20 italic">Удалён</span>}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Stars rating={r.rating} size="text-xs" /></td>
                  <td className="px-4 py-3 text-white/50 max-w-[200px]">
                    <span className="line-clamp-2 text-xs">{r.message}</span>
                  </td>
                  <td className="px-4 py-3 text-white/25 text-xs whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3">
                    {r.is_approved
                      ? <span className="px-2 py-1 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold rounded-lg">✅ Одобрен</span>
                      : <span className="px-2 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold rounded-lg">⏳ Скрыт</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => handleToggle(r.id)}
                      className={`font-medium transition-colors text-xs ${r.is_approved ? 'text-amber-400/70 hover:text-amber-400' : 'text-emerald-400/70 hover:text-emerald-400'}`}>
                      {r.is_approved ? 'Скрыть' : 'Одобрить'}
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-400/50 hover:text-red-400 font-medium transition-colors text-xs">
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
