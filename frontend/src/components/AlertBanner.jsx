// src/components/AlertBanner.jsx
import { AlertTriangle, X } from 'lucide-react';

export default function AlertBanner({ alerts, onDismiss }) {
  if (!alerts.length) return null;

  return (
    <div className="space-y-2 animate-fade-up">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
          <span className="flex-1 text-red-300">
            <span className="font-semibold">AQI Alert:</span> Level {alert.aqi} exceeds threshold of {alert.threshold}
          </span>
          <button
            onClick={() => onDismiss(i)}
            className="text-red-500 hover:text-red-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
