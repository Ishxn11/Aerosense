// src/components/AqiChart.jsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { formatTimestamp } from '../utils/aqi';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="font-display font-bold text-aero-400 text-lg">{payload[0].value} <span className="text-xs font-normal text-slate-500">AQI</span></p>
    </div>
  );
};

export default function AqiChart({ data, loading }) {
  const chartData = data.map(d => ({
    time: formatTimestamp(d.createdAt),
    aqi:  d.aqi,
  }));

  if (loading) {
    return (
      <div className="card-glass animate-fade-up">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">AQI Trend</p>
        <div className="h-48 bg-slate-800/40 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="card-glass animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">AQI Trend (Last {data.length} readings)</p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-3 h-0.5 bg-aero-500 inline-block" /> AQI
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#475569', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'dataMax + 20']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={150} stroke="#ef444450" strokeDasharray="4 4" />
          <ReferenceLine y={100} stroke="#eab30850" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#22c55e', stroke: '#16a34a', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
