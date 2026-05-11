// src/App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider }  from './context/UserContext';
import { useTheme }      from './context/ThemeContext';
import Sidebar   from './components/Sidebar';
import Navbar    from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings  from './pages/Settings';
import Login     from './pages/Login';

function ProtectedLayout({ wsStatus, setWsStatus, alerts, setAlerts }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark } = useTheme();

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #020d07 0%, #041a0c 30%, #061f10 55%, #050e18 80%, #030812 100%)'
          : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 35%, #ecfdf5 65%, #f0fdf4 100%)',
      }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen(o => !o)}
          wsStatus={wsStatus}
          alerts={alerts}
          onClearAlerts={() => setAlerts([])}
        />
        <main className="flex-1 overflow-y-auto" style={{ background: 'transparent' }}>
          <Routes>
            <Route path="/"          element={<Dashboard setWsStatus={setWsStatus} alerts={alerts} setAlerts={setAlerts} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings"  element={<Settings onLogout={() => { localStorage.removeItem('aerosense-auth'); window.location.reload(); }} />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppInner() {
  const [authed,   setAuthed]   = useState(() => localStorage.getItem('aerosense-auth') === 'true');
  const [wsStatus, setWsStatus] = useState('connecting');
  const [alerts,   setAlerts]   = useState([]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <ProtectedLayout
      wsStatus={wsStatus}
      setWsStatus={setWsStatus}
      alerts={alerts}
      setAlerts={setAlerts}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppInner />
      </UserProvider>
    </ThemeProvider>
  );
}
