import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-white/8 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg shadow-lg shadow-orange-500/30 group-hover:shadow-orange-400/50 transition-shadow">
              🚛
            </div>
            <span className="font-bold text-white text-lg tracking-tight">МАН Логистика</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Каталог',  href: '/#catalog'  },
              { label: 'О нас',    href: '/#about'    },
              { label: 'Отзывы',   href: '/reviews'   },
              { label: 'Контакты', href: '/#contacts' },
            ].map(({ label, href }) => (
              href.startsWith('/') && !href.includes('#')
                ? <Link key={label} to={href} className="px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 font-medium">{label}</Link>
                : <a key={label} href={href} className="px-3 py-2 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 font-medium">{label}</a>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 text-sm font-semibold rounded-lg transition-all">
                    ⚡ Панель
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-xs font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-white/70">{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-white/40 hover:text-red-400 transition-colors font-medium">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-white/70 hover:text-white font-medium transition-colors">
                  Войти
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Burger */}
          <button onClick={() => setOpen(o => !o)} className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all" aria-label="Меню">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f0f18]/95 backdrop-blur-2xl border-t border-white/8 px-4 py-4 space-y-1 animate-fade-in">
          <a href="/#catalog"  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">Каталог</a>
          <a href="/#about"    className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">О нас</a>
          <Link to="/reviews"  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">Отзывы</Link>
          <a href="/#contacts" className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">Контакты</a>
          <div className="border-t border-white/8 pt-3 mt-3 space-y-1">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2.5 text-sm text-orange-400 font-semibold hover:bg-orange-500/10 rounded-lg transition-all">⚡ Панель администратора</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  Выйти ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all">Войти</Link>
                <Link to="/register" className="block px-4 py-2.5 text-sm text-orange-400 font-semibold hover:bg-orange-500/10 rounded-lg transition-all">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
