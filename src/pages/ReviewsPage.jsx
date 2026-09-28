import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Stars  from '../components/Stars.jsx';
import api    from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews,    setReviews]    = useState([]);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState({ message: '', rating: 5 });
  const [success,    setSuccess]    = useState('');
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = (p = 1) => {
    setLoading(true);
    api.get(`/reviews?page=${p}&limit=12`)
      .then(r => { setReviews(r.data.data); setTotalPages(r.data.total_pages); setPage(r.data.page); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(1); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError('');
    try {
      await api.post('/reviews', form);
      setSuccess('Спасибо за ваш отзыв!');
      setForm({ message: '', rating: 5 });
      fetchReviews(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/25 mb-8">
          <Link to="/" className="hover:text-white/60 transition-colors">Главная</Link>
          <span>/</span>
          <span className="text-white/50">Отзывы</span>
        </div>

        <div className="section-label">Отзывы</div>
        <div className="flex items-end justify-between mb-10">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text leading-tight">
            Отзывы клиентов
          </h1>
          {total > 0 && <span className="text-white/20 text-sm hidden sm:block mb-1">{total} отзывов</span>}
        </div>

        {/* Submit form */}
        {user ? (
          <div className="glass p-6 max-w-lg mb-12">
            <h2 className="font-bold text-white mb-5">Оставить отзыв</h2>
            {success && <div className="mb-4 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">{success}</div>}
            {error   && <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Оценка</label>
                <div className="flex gap-2 text-2xl">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      onClick={() => setForm(f => ({...f, rating: n}))}
                      className={`transition-transform hover:scale-110 ${n <= form.rating ? 'star-filled' : 'star-empty'}`}
                    >★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Сообщение</label>
                <textarea className="input resize-none" rows={4} placeholder="Поделитесь впечатлениями..."
                  value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  required minLength={3} maxLength={1000} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        ) : (
          <div className="glass p-5 max-w-sm mb-12 text-sm text-white/40">
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Войдите</Link>{' '}
            чтобы оставить отзыв
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-white/20">Загрузка...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-white/20">
            <div className="text-5xl mb-4">💬</div>
            <p>Отзывов пока нет</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map(r => (
                <div key={r.id} className="glass p-6 flex flex-col gap-4 hover:border-white/15 transition-all duration-300">
                  <Stars rating={r.rating} size="text-base" />
                  <p className="text-white/60 text-sm leading-relaxed flex-1">{r.message}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400/30 to-amber-400/30 border border-orange-400/20 flex items-center justify-center text-xs font-bold text-orange-300">
                        {r.user_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="text-white/60 text-sm font-medium">{r.user_name}</span>
                    </div>
                    <span className="text-white/20 text-xs">{new Date(r.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button disabled={page <= 1} onClick={() => fetchReviews(page - 1)}
                  className="px-4 py-2 glass text-sm font-medium text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl">
                  ← Назад
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => fetchReviews(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      p === page ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'glass text-white/40 hover:text-white'
                    }`}>
                    {p}
                  </button>
                ))}
                <button disabled={page >= totalPages} onClick={() => fetchReviews(page + 1)}
                  className="px-4 py-2 glass text-sm font-medium text-white/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-xl">
                  Вперёд →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
