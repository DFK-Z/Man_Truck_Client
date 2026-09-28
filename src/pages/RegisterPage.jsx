import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// ── Password strength calculator ─────────────────────────────────────────────
function getStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };

  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: 'Очень слабый', color: 'bg-red-500',    text: 'text-red-400'    };
  if (score === 2) return { score, label: 'Слабый',       color: 'bg-orange-500', text: 'text-orange-400' };
  if (score === 3) return { score, label: 'Средний',      color: 'bg-yellow-400', text: 'text-yellow-400' };
  if (score === 4) return { score, label: 'Хороший',      color: 'bg-lime-400',   text: 'text-lime-400'   };
  return               { score, label: 'Отличный',      color: 'bg-emerald-400', text: 'text-emerald-400' };
}

// ── Eye icon ──────────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,       setForm]       = useState({ name: '', email: '', password: '' });
  const [showPwd,    setShowPwd]    = useState(false);
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Пароль должен содержать не менее 6 символов'); return; }
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-2xl shadow-xl shadow-orange-500/30">🚛</div>
            <span className="text-xl font-bold text-white">МАН Логистика</span>
          </Link>
          <h1 className="text-2xl font-black gradient-text mt-5">Создать аккаунт</h1>
          <p className="text-white/30 text-sm mt-1">Зарегистрируйтесь бесплатно</p>
        </div>

        <div className="glass-strong p-8">
          {error && (
            <div className="mb-5 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Имя</label>
              <input id="name" type="text" className="input" placeholder="Иван Иванов"
                value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                required autoComplete="name" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
              <input id="email" type="email" className="input" placeholder="your@email.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                required autoComplete="email" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Пароль</label>

              {/* Input + toggle */}
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="Минимум 6 символов"
                  value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                  aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  <EyeIcon open={showPwd} />
                </button>
              </div>

              {/* Strength bar — only shows when user starts typing */}
              {form.password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {/* 5 segments */}
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          n <= strength.score ? strength.color : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Label + tips */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${strength.text}`}>{strength.label}</span>
                    <span className="text-white/20 text-xs">{form.password.length} симв.</span>
                  </div>
                  {/* Hints */}
                  {strength.score < 4 && (
                    <ul className="text-white/25 text-xs space-y-0.5 mt-1">
                      {form.password.length < 10   && <li>• Минимум 10 символов для надёжного пароля</li>}
                      {!/[A-Z]/.test(form.password) && <li>• Добавьте заглавную букву</li>}
                      {!/[0-9]/.test(form.password) && <li>• Добавьте цифру</li>}
                      {!/[^A-Za-z0-9]/.test(form.password) && <li>• Добавьте спецсимвол (!@#$...)</li>}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5 mt-2">
              {loading ? 'Регистрация...' : 'Создать аккаунт →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/6 text-center">
            <p className="text-white/30 text-sm">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Войти</Link>
            </p>
            <Link to="/" className="inline-block mt-3 text-xs text-white/20 hover:text-white/40 transition-colors">← На главную</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
