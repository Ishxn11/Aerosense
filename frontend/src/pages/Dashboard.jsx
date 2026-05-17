// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Thermometer, Droplets, RefreshCw } from 'lucide-react';
import AqiCard      from '../components/AqiCard';
import MetricCard   from '../components/MetricCard';
import DeviceStatus from '../components/DeviceStatus';
import AqiChart     from '../components/AqiChart';
import GasChart     from '../components/GasChart';
import AlertBanner  from '../components/AlertBanner';
import LocationCard from '../components/LocationCard';
import { useWebSocket } from '../hooks/useWebSocket';
import { getLatestData, getHistory } from '../services/api';
import { formatDate } from '../utils/aqi';

export default function Dashboard({ setWsStatus, alerts, setAlerts }) {
  const [latest,     setLatest]     = useState(null);
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Track last alert time to prevent spam — only 1 alert per 30s
  const lastAlertTime = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [lat, hist] = await Promise.all([
        getLatestData(),
        getHistory({ limit: 30 }),
      ]);
      setLatest(lat);
      setHistory(hist.data ?? []);
      setLastUpdate(new Date());

      const settings  = JSON.parse(localStorage.getItem('aerosense-settings') || '{}');
const threshold = settings.aqiThreshold || 150;
const alertsOn  = settings.alertsEnabled ?? true;

if (alertsOn && lat.aqi > threshold) {
  const now = Date.now();
  if (now - lastAlertTime.current > 30000) {
    lastAlertTime.current = now;
    setAlerts(prev => [{
      type: 'AQI_ALERT',
      aqi: lat.aqi,
      threshold: threshold
    }, ...prev].slice(0, 3));
  }
}
    } catch {
      setError('Unable to connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, [fetchData]);

  const { status: wsStatus } = useWebSocket(useCallback((msg) => {
    if (msg.type === 'SENSOR_UPDATE') {
      setLatest(msg.data);
      setLastUpdate(new Date());
      setHistory(prev => [...prev, msg.data].slice(-50));
    }
    
    // Check AQI threshold from settings
const settings = JSON.parse(localStorage.getItem('aerosense-settings') || '{}');
const threshold = settings.aqiThreshold || 150;
const alertsOn  = settings.alertsEnabled ?? true;

if (alertsOn && msg.data.aqi > threshold) {
  const now = Date.now();
  if (now - lastAlertTime.current > 30000) {
    lastAlertTime.current = now;
    setAlerts(prev => [{
  type: 'AQI_ALERT',
  aqi: msg.data.aqi,
  threshold: threshold
}, ...prev].slice(0, 3));
  }
}

    if (msg.type === 'AQI_ALERT') {
      const now = Date.now();
      // Debounce: only fire alert once every 30 seconds
      if (now - lastAlertTime.current > 30000) {
        lastAlertTime.current = now;
        setAlerts(prev => [msg, ...prev].slice(0, 3));
      }
    }
  }, [setAlerts]));

  useEffect(() => { setWsStatus(wsStatus); }, [wsStatus, setWsStatus]);

  const dismissAlert = (i) => setAlerts(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Live Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {lastUpdate ? `Last updated ${formatDate(lastUpdate)}` : 'Connecting…'}
          </p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Alerts — max 3, debounced */}
      <AlertBanner alerts={alerts} onDismiss={dismissAlert} />

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm text-red-300"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AqiCard aqi={latest?.aqi} loading={loading} />
        <MetricCard
          label="Temperature"
          value={latest?.temperature}
          unit="°C"
          icon={Thermometer}
          color="text-orange-400"
          loading={loading}
          sub="DHT11 sensor reading"
        />
        <MetricCard
          label="Humidity"
          value={latest?.humidity}
          unit="%"
          icon={Droplets}
          color="text-blue-400"
          loading={loading}
          sub="DHT11 relative humidity"
        />
        <DeviceStatus
          online={latest?.deviceOnline}
          deviceId={latest?.deviceId}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AqiChart data={history} loading={loading} />
        <GasChart gasLevels={latest?.gasLevels} loading={loading} />
      </div>

      {/* Location */}
      <LocationCard />
    </div>
  );
}
