// src/pages/Settings.jsx
import { useState } from 'react';
import { Save, Bell, Wifi, Database, RefreshCw, LogOut, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-slate-800/60 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-green-600' : 'bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function Settings({ onLogout }) {
  const { dark, toggle } = useTheme();
  const [aqiThreshold,  setAqiThreshold]  = useState(150);
  const [pollInterval,  setPollInterval]  = useState(10);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [wsEnabled,     setWsEnabled]     = useState(true);
  const [saved,         setSaved]         = useState(false);

  const handleSave = () => {
    localStorage.setItem('aerosense-settings', JSON.stringify({ aqiThreshold, pollInterval, alertsEnabled, wsEnabled }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Settings</h2>
        <p className="text-sm text-slate-500">Configure your AeroSense dashboard</p>
      </div>

      {/* Appearance */}
      <div className="card-glass">
        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2 pb-3 border-b border-slate-800/60">
          Appearance
        </p>
        <SettingRow label="Dark Mode" description="Use dark theme across the dashboard">
          <Toggle value={dark} onChange={toggle} />
        </SettingRow>
      </div>

      {/* Alerts */}
      <div className="card-glass">
        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2 pb-3 border-b border-slate-800/60 flex items-center gap-2">
          <Bell className="w-3 h-3" /> Alerts
        </p>
        <SettingRow label="AQI Alerts" description="Show banner when AQI exceeds threshold">
          <Toggle value={alertsEnabled} onChange={setAlertsEnabled} />
        </SettingRow>
        <SettingRow label="AQI Alert Threshold" description="Alert fires when AQI exceeds this value">
          <input
            type="number"
            value={aqiThreshold}
            min={50} max={400}
            onChange={e => setAqiThreshold(Number(e.target.value))}
            className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white text-center focus:outline-none focus:border-green-500"
          />
        </SettingRow>
      </div>

      {/* Connection */}
      <div className="card-glass">
        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2 pb-3 border-b border-slate-800/60 flex items-center gap-2">
          <Wifi className="w-3 h-3" /> Connection
        </p>
        <SettingRow label="WebSocket" description="Real-time data via WebSocket (recommended)">
          <Toggle value={wsEnabled} onChange={setWsEnabled} />
        </SettingRow>
        <SettingRow label="Polling Interval" description="Fallback polling interval in seconds">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pollInterval}
              min={5} max={60}
              onChange={e => setPollInterval(Number(e.target.value))}
              className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white text-center focus:outline-none focus:border-green-500"
            />
            <span className="text-xs text-slate-500">sec</span>
          </div>
        </SettingRow>
      </div>

      {/* Hardware Info */}
      <div className="card-glass">
        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2 pb-3 border-b border-slate-800/60 flex items-center gap-2">
          <Cpu className="w-3 h-3" /> Hardware Sensors
        </p>
        <SettingRow label="MQ135 Gas Sensor" description="Measures CO₂, CO, NO₂, NH₃ gas levels">
          <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Connected
          </div>
        </SettingRow>
        <SettingRow label="DHT11 Sensor" description="Measures ambient temperature & humidity">
          <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Connected
          </div>
        </SettingRow>
        <SettingRow label="Data Interval" description="Sensor readings pushed every ~4 seconds">
          <div className="flex items-center gap-1.5 text-xs text-green-400">
            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
            Active
          </div>
        </SettingRow>
      </div>

      {/* Database */}
      <div className="card-glass">
        <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2 pb-3 border-b border-slate-800/60 flex items-center gap-2">
          <Database className="w-3 h-3" /> System Info
        </p>
        <SettingRow label="Backend URL" description="REST API base URL">
          <code className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-green-400 font-mono">aerosense-usjt.onrender.com</code>
        </SettingRow>
        <SettingRow label="Database" description="MongoDB connection">
          <code className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-green-400 font-mono">aerosense</code>
        </SettingRow>
        <SettingRow label="Version" description="AeroSense platform version">
          <code className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-green-400 font-mono">v1.0.0</code>
        </SettingRow>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
