import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CookieBanner from '../components/CookieBanner.jsx';
import Stars from '../components/Stars.jsx';
import ContactForm from '../components/ContactForm.jsx';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomePage() {
  const { user } = useAuth();
  const [trucks,  setTrucks]  = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form,    setForm]    = useState({ message: '', rating: 5 });
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/trucks').then(r => setTrucks(r.data)).catch(() => {});
    api.get('/reviews/latest').then(r => setReviews(r.data)).catch(() => {});
  }, []);

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError('');
    try {
      await api.post('/reviews', form);
      setSuccess('Спасибо за ваш отзыв!');
      setForm({ message: '', rating: 5 });
      api.get('/reviews/latest').then(r => setReviews(r.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute inset-0 bg-hero-glow" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Orange blob */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="section-label animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse-slow" />
              Волгоград · Работаем с 2014 года
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-fade-up" style={{animationDelay:'0.1s'}}>
              <span className="gradient-text">Грузоперевозки</span><br />
              <span className="gradient-text-orange">и доставка</span><br />
              <span className="gradient-text">материалов</span>
            </h1>

            <p className="text-white/50 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl animate-fade-up" style={{animationDelay:'0.2s'}}>
              Песок, щебень, асфальт, бетон, блоки и камень — профессиональная доставка по Волгограду и области на грузовиках MAN.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{animationDelay:'0.3s'}}>
              <a href="#catalog" className="btn-primary text-base px-8 py-4">
                Смотреть каталог →
              </a>
              <a href="#contacts" className="btn-ghost text-base px-8 py-4">
                Связаться с нами
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-16 animate-fade-up" style={{animationDelay:'0.4s'}}>
              {[
                { num: '10+',   label: 'лет опыта'       },
                { num: '500+',  label: 'выполненных заказов' },
                { num: '24/7',  label: 'поддержка'        },
              ].map(s => (
                <div key={s.num}>
                  <div className="text-3xl font-black gradient-text-orange">{s.num}</div>
                  <div className="text-white/40 text-sm mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs animate-pulse-slow">
          <span>Листай вниз</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* ── CATALOG ───────────────────────────────────────────────────────── */}
      <section id="catalog" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d18] to-[#0a0a0f]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="section-label">Автопарк</div>
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-4xl sm:text-5xl font-black gradient-text leading-tight">
              Наши грузовики
            </h2>
            {trucks.length > 0 && (
              <span className="text-white/30 text-sm hidden sm:block">{trucks.length} единиц техники</span>
            )}
          </div>

          {trucks.length === 0 ? (
            <div className="text-center py-20 text-white/20">
              <div className="text-6xl mb-4">🚛</div>
              <p>Грузовики пока не добавлены</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trucks.map((truck, i) => (
                <Link
                  key={truck.id}
                  to={`/truck/${truck.id}`}
                  className="group glass hover:border-white/20 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="aspect-video bg-white/3 overflow-hidden">
                    {truck.image ? (
                      <img
                        src={`/uploads/${truck.image}`}
                        alt={`${truck.brand} ${truck.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl text-white/10">🚛</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-lg">{truck.brand}</h3>
                        <p className="text-white/50 text-sm mt-0.5">{truck.model}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                        →
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/6 flex items-center gap-2 text-xs text-white/25">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      {truck.views} просмотров
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0d0d18]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="section-label">О компании</div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black gradient-text leading-tight mb-6">
                ИП Авакян<br />Шаген Вараздатович
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Надёжный перевозчик строительных материалов в Волгограде и области. Обслуживаем строительные компании, частных заказчиков и оптовых покупателей.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Песок','Щебень','Асфальт','Бетон','Блоки','Камень'].map(m => (
                  <span key={m} className="px-4 py-2 glass border-orange-500/20 text-white/70 text-sm rounded-xl hover:border-orange-500/40 hover:text-white transition-all">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass p-6 space-y-4">
              <h3 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">Реквизиты</h3>
              {[
                { label: 'Организация', value: 'ИП Авакян Шаген Вараздатович' },
                { label: 'ИНН',         value: '344304731643' },
                { label: 'ОГРНИП',      value: '321344300045781' },
                { label: 'Регистрация', value: '28 июля 2021 г.' },
                { label: 'Город',       value: 'Волгоград' },
              ].map(r => (
                <div key={r.label} className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0 last:pb-0">
                  <span className="text-white/30 text-sm shrink-0">{r.label}</span>
                  <span className="text-white/80 text-sm text-right font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="section-label">Отзывы</div>
              <h2 className="text-4xl sm:text-5xl font-black gradient-text leading-tight">
                Что говорят<br />клиенты
              </h2>
            </div>
            <Link to="/reviews" className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors hidden sm:flex items-center gap-1.5 mb-1">
              Все отзывы <span>→</span>
            </Link>
          </div>

          {reviews.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 mb-12">
              {reviews.map(r => (
                <div key={r.id} className="glass p-6 flex flex-col gap-4 hover:border-white/15 transition-all duration-300">
                  <Stars rating={r.rating} size="text-base" />
                  <p className="text-white/60 text-sm leading-relaxed flex-1 line-clamp-4">{r.message}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400/40 to-amber-400/40 border border-orange-400/20 flex items-center justify-center text-xs font-bold text-orange-300">
                        {r.user_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="text-white/60 text-sm font-medium">{r.user_name}</span>
                    </div>
                    <span className="text-white/25 text-xs">{new Date(r.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit form */}
          {user ? (
            <div className="glass p-6 max-w-lg">
              <h3 className="font-bold text-white mb-5">Оставить отзыв</h3>
              {success && <div className="mb-4 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">{success}</div>}
              {error   && <div className="mb-4 text-sm text-red-400    bg-red-400/10    border border-red-400/20    rounded-xl px-4 py-3">{error}</div>}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
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
                    value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}
                    required minLength={3} maxLength={1000} />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Отправка...' : 'Отправить отзыв'}
                </button>
              </form>
            </div>
          ) : (
            <div className="glass p-6 max-w-lg text-center">
              <p className="text-white/40 text-sm">
                <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Войдите</Link>{' '}
                чтобы оставить отзыв
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACTS ──────────────────────────────────────────────────────── */}
      <section id="contacts" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[#0d0d18]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="section-label">Контакты</div>
          <h2 className="text-4xl sm:text-5xl font-black gradient-text leading-tight mb-12">
            Свяжитесь с нами
          </h2>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left — contact cards */}
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: '📍', label: 'Адрес',  lines: ['г. Волгоград'] },
                  { icon: '🕐', label: 'График',  lines: ['Ежедневно', '8:00 – 20:00'] },
                ].map(c => (
                  <div key={c.label} className="glass p-5 hover:border-white/20 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xl mb-3 group-hover:bg-orange-500/15 transition-colors">
                      {c.icon}
                    </div>
                    <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">{c.label}</div>
                    {c.lines.map(line => <div key={line} className="text-white/80 font-medium text-sm">{line}</div>)}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass p-5 hover:border-white/20 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xl mb-3 group-hover:bg-orange-500/15 transition-colors">📞</div>
                  <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">Телефон</div>
                  <a href="tel:+79023143540" className="block text-white/80 font-medium text-sm hover:text-orange-400 transition-colors">+7 902 314-35-40</a>
                  <a href="tel:+79023635400" className="block text-white/80 font-medium text-sm hover:text-orange-400 transition-colors">+7 902 363-54-00</a>
                </div>
                <div className="glass p-5 hover:border-white/20 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xl mb-3 group-hover:bg-orange-500/15 transition-colors">✉️</div>
                  <div className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-1">Email</div>
                  <a href="mailto:guga-2005@mail.ru" className="block text-white/80 font-medium text-sm hover:text-orange-400 transition-colors">guga-2005@mail.ru</a>
                </div>
              </div>

              {/* Quick call buttons */}
              <div className="flex gap-3">
                <a href="tel:+79023143540" className="btn-primary flex-1 justify-center">📞 Позвонить</a>
                <a href="mailto:guga-2005@mail.ru" className="btn-ghost flex-1 justify-center">✉️ Email</a>
              </div>
            </div>

            {/* Right — callback form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Scroll-to-top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-10 h-10 glass border-white/15 hover:border-orange-500/40 text-white/50 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 z-40 hover:bg-orange-500/10"
        aria-label="Наверх"
      >
        ↑
      </button>

      <Footer />
      <CookieBanner />
    </div>
  );
}
