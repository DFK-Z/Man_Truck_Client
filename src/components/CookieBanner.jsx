import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_accepted')) {
      setTimeout(() => setVisible(true), 1500);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_accepted', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-fade-up">
      <div className="glass-strong p-5 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🍪</span>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm leading-relaxed">
              Мы используем cookie для улучшения работы сайта.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={accept}
                className="btn-primary !py-1.5 !px-4 text-sm flex-1"
              >
                Принять
              </button>
              <button
                onClick={() => setVisible(false)}
                className="px-3 py-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
