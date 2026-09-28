import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#06060c] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg">🚛</div>
              <span className="font-bold text-white text-lg">МАН Логистика</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Профессиональная доставка строительных материалов по Волгограду и области с 2014 года.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Навигация</h4>
            <div className="space-y-2">
              {[
                { label: 'Каталог',  href: '/#catalog'  },
                { label: 'О нас',    href: '/#about'    },
                { label: 'Отзывы',   to:   '/reviews'   },
                { label: 'Контакты', href: '/#contacts' },
              ].map(l => l.to
                ? <Link key={l.label} to={l.to} className="block text-sm text-white/40 hover:text-white/80 transition-colors">{l.label}</Link>
                : <a key={l.label} href={l.href} className="block text-sm text-white/40 hover:text-white/80 transition-colors">{l.label}</a>
              )}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Контакты</h4>
            <div className="space-y-2 text-sm text-white/40">
              <a href="tel:+79023143540" className="block hover:text-white/80 transition-colors">+7 902 314-35-40</a>
              <a href="tel:+79023635400" className="block hover:text-white/80 transition-colors">+7 902 363-54-00</a>
              <a href="mailto:guga-2005@mail.ru" className="block hover:text-white/80 transition-colors">guga-2005@mail.ru</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/25">
          <p>© {new Date().getFullYear()} ИП Авакян Шаген Вараздатович. Все права защищены.</p>
          <p>ИНН: 344304731643 · ОГРНИП: 321344300045781</p>
        </div>
      </div>
    </footer>
  );
}
