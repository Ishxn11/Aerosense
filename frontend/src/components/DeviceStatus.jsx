// src/components/DeviceStatus.jsx
import { Cpu, CheckCircle2, XCircle, Thermometer, Wind } from 'lucide-react';

export default function DeviceStatus({ online, deviceId, loading }) {
  return (
    <div className="card-glass animate-fade-up flex flex-col gap-3">
      {/* Header row — removed SENSOR_01 label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl border ${online ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <Cpu className={`w-4 h-4 ${online ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Sensors</p>
        </div>
        {loading ? (
          <div className="w-16 h-5 bg-slate-800 rounded animate-pulse" />
        ) : (
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border
            ${online
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {online
              ? <><CheckCircle2 className="w-3 h-3" /> Online</>
              : <><XCircle className="w-3 h-3" /> Offline</>}
          </div>
        )}
      </div>

      {/* Sensor chips */}
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-1 justify-center"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}>
          <Wind className="w-3 h-3 text-green-400" />
          <span className="text-xs font-semibold text-green-300">MQ135</span>
          <span className="text-xs text-slate-500">Gas</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-1 justify-center"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)' }}>
          <Thermometer className="w-3 h-3 text-blue-400" />
          <span className="text-xs font-semibold text-blue-300">DHT11</span>
          <span className="text-xs text-slate-500">T/H</span>
        </div>
      </div>
    </div>
  );
}
