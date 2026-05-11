// src/components/MetricCard.jsx
export default function MetricCard({ label, value, unit, icon: Icon, color = 'text-aero-400', loading, sub }) {
  return (
    <div className="card-glass animate-fade-up flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</p>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/60">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-9 w-20 bg-slate-800 rounded-lg animate-pulse" />
      ) : (
        <div className="flex items-end gap-1.5">
          <span className={`font-display font-bold text-3xl leading-none ${color}`}>
            {value ?? '--'}
          </span>
          {unit && <span className="text-slate-500 text-sm mb-0.5">{unit}</span>}
        </div>
      )}

      {sub && <p className="text-xs text-slate-600">{sub}</p>}
    </div>
  );
}
