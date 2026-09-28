import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
        : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <header className="bg-[#0d0d18]/90 backdrop-blur-2xl border-b border-white/8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-sm">⚡</div>
            <span className="font-bold text-white/90 text-sm">Панель администратора</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-white/30 hover:text-white/70 transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              На сайт
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-[10px] font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-white/60 text-xs">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="text-white/25 hover:text-red-400 transition-colors text-xs font-medium">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-1">
            <NavLink to="/admin/trucks"  className={navClass} end>
              <span>🚛</span> Грузовики
            </NavLink>
            <NavLink to="/admin/reviews" className={navClass}>
              <span>💬</span> Отзывы
            </NavLink>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
