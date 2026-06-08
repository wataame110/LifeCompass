import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-lc-dark-card/80 backdrop-blur-md border-b border-gray-200 dark:border-lc-dark-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 font-bold text-lg">
          <Compass className="w-6 h-6" />
          <span>Life Compass</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="テーマ切り替え"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>

          {!isHome && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="メニュー"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {menuOpen && !isHome && (
        <nav className="border-t border-gray-200 dark:border-lc-dark-border bg-white dark:bg-lc-dark-card px-4 py-3 space-y-2">
          <Link to="/" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>ホーム</Link>
          <Link to="/diagnosis" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>診断を始める</Link>
          <Link to="/result" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>診断結果</Link>
          <Link to="/export" className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(false)}>データ管理</Link>
        </nav>
      )}
    </header>
  );
}
