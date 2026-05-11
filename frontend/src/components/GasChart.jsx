// src/components/GasChart.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="font-semibold text-white">{payload[0].value} <span className="text-slate-500 text-xs">{label === 'CO2' ? 'ppm' : label === 'PM2.5' ? 'µg/m³' : 'ppm'}</span></p>
    </div>
  );
};

export default function GasChart({ gasLevels, loading }) {
  if (loading || !gasLevels) {
    return (
      <div className="card-glass animate-fade-up">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Gas Levels</p>
        <div className="h-48 bg-slate-800/40 rounded-xl animate-pulse" />
      </div>
    );
  }

  const data = [
    { name: 'CO₂',   value: gasLevels.CO2  ?? 0 },
    { name: 'CO',    value: gasLevels.CO   ?? 0 },
    { name: 'NO₂',   value: (gasLevels.NO2 ?? 0) * 1000 }, // scale for visibility
    { name: 'PM2.5', value: gasLevels.PM25 ?? 0 },
  ];

  return (
    <div className="card-glass animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Gas Levels (Latest)</p>
        <span className="text-xs text-slate-600">ppm / µg/m³</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b60' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
