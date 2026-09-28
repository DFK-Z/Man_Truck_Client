import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CookieBanner from '../components/CookieBanner.jsx';
import api from '../lib/api.js';

export default function TruckDetailPage() {
  const { id } = useParams();
  const [truck,   setTruck]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/trucks/${id}`)
      .then(r => setTruck(r.data))
      .catch(() => setError('Грузовик не найден'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/70 text-sm transition-colors mb-6 sm:mb-8 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          На главную
        </Link>

        {loading && <div className="text-center py-24 sm:py-32 text-white/20">Загрузка...</div>}

        {error && (
          <div className="text-center py-24 sm:py-32">
            <p className="text-white/40 text-lg sm:text-xl mb-6">{error}</p>
            <Link to="/" className="btn-primary">Вернуться</Link>
          </div>
        )}

        {truck && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-start">
            {/* Image */}
            <div className="glass overflow-hidden rounded-2xl">
              {truck.image ? (
                <img src={`/uploads/${truck.image}`}
                  alt={`${truck.brand} ${truck.model}`}
                  className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-6xl sm:text-8xl text-white/10 bg-white/3">🚛</div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="section-label">Грузовик</div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text leading-tight">{truck.brand}</h1>
                <p className="text-xl sm:text-2xl text-white/50 font-light mt-1">{truck.model}</p>
                <div className="flex items-center gap-2 mt-2 sm:mt-3 text-xs text-white/20">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {truck.views} просмотров
                </div>
              </div>

              <div className="glass p-4 sm:p-5 border-orange-500/20">
                <p className="text-white/50 text-sm leading-relaxed">
                  Заинтересовал этот грузовик? Свяжитесь с нами, чтобы уточнить условия аренды, стоимость доставки и доступность.
                </p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <a href="tel:+79023143540" className="btn-primary w-full text-sm sm:text-base py-3.5 sm:py-4">
                  📞 Позвонить
                </a>
                <a href={`mailto:guga-2005@mail.ru?subject=Запрос по ${truck.brand} ${truck.model}`}
                  className="btn-ghost w-full text-sm sm:text-base py-3.5 sm:py-4">
                  ✉️ Написать на email
                </a>
              </div>

              <div className="glass p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-white/30">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <div className="space-y-0.5">
                    <a href="tel:+79023143540" className="hover:text-white/70 transition-colors block">+7 902 314-35-40</a>
                    <a href="tel:+79023635400" className="hover:text-white/70 transition-colors block">+7 902 363-54-00</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href="mailto:guga-2005@mail.ru" className="hover:text-white/70 transition-colors break-all">guga-2005@mail.ru</a>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>Ежедневно 8:00 – 20:00</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
