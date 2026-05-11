// src/components/AqiCard.jsx
import { getAqiCategory } from '../utils/aqi';
import { Wind } from 'lucide-react';

export default function AqiCard({ aqi, loading }) {
  const cat = getAqiCategory(aqi ?? 0);

  return (
    <div className={`card-glass border ${cat.border} relative overflow-hidden animate-fade-up`}>
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: cat.color }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Air Quality Index</p>
          {loading ? (
            <div className="h-14 w-24 bg-slate-800 rounded-xl animate-pulse mt-1" />
          ) : (
            <p className="font-display font-extrabold text-6xl leading-none text-white">
              {aqi ?? '--'}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${cat.bg} border ${cat.border}`}>
          <Wind className={`w-5 h-5 ${cat.text}`} />
        </div>
      </div>

      {!loading && (
        <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${cat.bg} ${cat.text} border ${cat.border}`}>
          <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: cat.color }} />
          {cat.label}
        </div>
      )}

      <p className="text-xs text-slate-600 mt-3">Updated in real-time via WebSocket</p>
    </div>
  );
}
