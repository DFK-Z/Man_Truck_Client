import { useState } from 'react';
import api from '../lib/api.js';

export default function ContactForm() {
  const [form,    setForm]    = useState({ name: '', phone: '', message: '' });
  const [status,  setStatus]  = useState(null);
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setStatus(null);
    try {
      const res = await api.post('/contact', form);
      setMsg(res.data.message);
      setStatus('success');
      setForm({ name: '', phone: '', message: '' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Ошибка отправки. Попробуйте позвонить напрямую.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white">Перезвоните мне</h3>
        <p className="text-white/40 text-xs sm:text-sm mt-1">Оставьте номер — мы позвоним в течение 30 минут</p>
      </div>

      {status === 'success' && (
        <div className="mb-4 flex items-start gap-3 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">
          <span className="text-emerald-400 text-lg shrink-0">✅</span>
          <p className="text-emerald-400 text-sm">{msg}</p>
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 flex items-start gap-3 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          <span className="text-red-400 text-lg shrink-0">❌</span>
          <p className="text-red-400 text-sm">{msg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
              Ваше имя <span className="text-orange-400">*</span>
            </label>
            <input type="text" className="input text-sm sm:text-base" placeholder="Иван Иванов"
              value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          </div>
          <div>
            <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
              Телефон <span className="text-orange-400">*</span>
            </label>
            <input type="tel" className="input text-sm sm:text-base" placeholder="+7 900 000-00-00"
              value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} required />
          </div>
        </div>

        <div>
          <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
            Сообщение <span className="text-white/20 font-normal normal-case">(необязательно)</span>
          </label>
          <textarea className="input resize-none text-sm sm:text-base" rows={3}
            placeholder="Что вас интересует?.."
            value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
            maxLength={500} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 sm:py-4 text-sm sm:text-base">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Отправка...
            </span>
          ) : '📞 Жду звонка'}
        </button>

        <p className="text-white/20 text-xs text-center">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных
        </p>
      </form>
    </div>
  );
}
