// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getHistory, getStats } from '../services/api';
import { formatTimestamp } from '../utils/aqi';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function StatBox({ label, value, unit, trend }) {
  return (
    <div className="card-glass text-center">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="font-display font-bold text-2xl text-white">
        {typeof value === 'number' ? value.toFixed(1) : '--'}
        <span className="text-sm text-slate-500 font-normal ml-1">{unit}</span>
      </p>
      {trend && (
        <div className="mt-1 flex justify-center">
          {trend === 'up'   && <TrendingUp   className="w-4 h-4 text-red-400" />}
          {trend === 'down' && <TrendingDown  className="w-4 h-4 text-green-400" />}
          {trend === 'flat' && <Minus         className="w-4 h-4 text-slate-400" />}
        </div>
      )}
    </div>
  );
}

export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [stats,   setStats]   = useState(null);
  const [hours,   setHours]   = useState(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getHistory({ limit: 100, hours }), getStats({ hours })])
      .then(([h, s]) => { setHistory(h.data ?? []); setStats(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [hours]);

  const chartData = history.map(d => ({
    time:  formatTimestamp(d.createdAt),
    aqi:   d.aqi,
    temp:  d.temperature,
    hum:   d.humidity,
  }));

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Analytics</h2>
          <p className="text-sm text-slate-500">Historical sensor data & statistics</p>
        </div>
        {/* Time range picker */}
        <div className="flex gap-2">
          {[6, 12, 24, 48].map(h => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${hours === h
                  ? 'bg-aero-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBox label="Avg AQI"  value={stats?.avgAqi}  unit="" />
        <StatBox label="Max AQI"  value={stats?.maxAqi}  unit="" trend="up" />
        <StatBox label="Min AQI"  value={stats?.minAqi}  unit="" trend="down" />
        <StatBox label="Avg Temp" value={stats?.avgTemp} unit="°C" />
        <StatBox label="Avg Hum"  value={stats?.avgHum}  unit="%" />
        <StatBox label="Readings" value={stats?.count}   unit="" />
      </div>

      {/* Area chart — AQI */}
      <div className="card-glass">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-5">
          AQI Over Last {hours}h
        </p>
        {loading ? (
          <div className="h-56 bg-slate-800/40 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 'dataMax + 20']} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                labelStyle={{ color: '#64748b', fontSize: 11 }}
                itemStyle={{ color: '#14b8a6' }}
              />
              <Area type="monotone" dataKey="aqi" stroke="#14b8a6" strokeWidth={2} fill="url(#aqiGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Temp + Humidity area chart */}
      <div className="card-glass">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-5">
          Temperature & Humidity
        </p>
        {loading ? (
          <div className="h-56 bg-slate-800/40 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
                labelStyle={{ color: '#64748b', fontSize: 11 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f97316" strokeWidth={2} fill="url(#tempGrad)" dot={false} />
              <Area type="monotone" dataKey="hum"  name="Humidity (%)" stroke="#6366f1" strokeWidth={2} fill="url(#humGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
