// src/components/Navbar.jsx
import { Menu, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onMenuClick, wsStatus, alerts, onClearAlerts }) {
  const { dark, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-10 h-14 flex items-center px-4 gap-4"
      style={{
        background: dark
          ? 'rgba(4, 10, 6, 0.85)'
          : 'rgba(240, 253, 244, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        /* No border-bottom at all — removes the line */
        borderBottom: 'none',
        boxShadow: dark
          ? '0 1px 0 rgba(34,197,94,0.08)'
          : '0 1px 0 rgba(134,239,172,0.25)',
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg transition"
        style={{ color: dark ? '#94a3b8' : '#374151' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <span
          className="font-display font-semibold hidden md:block"
          style={{ color: dark ? '#ffffff' : '#0f172a' }}
        >
          Dashboard
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* Bell */}
        <button
          onClick={onClearAlerts}
          className="relative p-2 rounded-lg transition"
          style={{ color: dark ? '#94a3b8' : '#374151' }}
        >
          <Bell className="w-4 h-4" />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg transition"
          style={{ color: dark ? '#94a3b8' : '#374151' }}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
