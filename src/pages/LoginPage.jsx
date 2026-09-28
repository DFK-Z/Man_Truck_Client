import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form,     setForm]     = useState({ email: '', password: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl shadow-xl shadow-orange-500/30">🚛</div>
            <span className="text-xl font-bold text-white">МАН Логистика</span>
          </Link>
          <h1 className="text-2xl font-black gradient-text mt-5">Добро пожаловать</h1>
          <p className="text-white/30 text-sm mt-1">Войдите в свой аккаунт</p>
        </div>

        <div className="glass-strong p-8">
          {error && (
            <div className="mb-5 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
              <input id="email" type="email" className="input" placeholder="your@email.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Пароль</label>
              <div className="relative">
                <input id="password" type={showPwd ? 'text' : 'password'} className="input pr-11" placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  required autoComplete="current-password" />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                  aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5 mt-2">
              {loading ? 'Вход...' : 'Войти →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/6 text-center">
            <p className="text-white/30 text-sm">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                Зарегистрироваться
              </Link>
            </p>
            <Link to="/" className="inline-block mt-3 text-xs text-white/20 hover:text-white/40 transition-colors">← На главную</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
