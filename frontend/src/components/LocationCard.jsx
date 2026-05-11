// src/components/LocationCard.jsx
import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, AlertCircle, RefreshCw } from 'lucide-react';

function GtaRadar({ lat, lon }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, r = W / 2 - 2;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Background radial
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    bg.addColorStop(0, '#0d2b1a');
    bg.addColorStop(0.6, '#0a1f12');
    bg.addColorStop(1, '#06120b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Street grid
    ctx.strokeStyle = 'rgba(34,197,94,0.12)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo((W/6)*i, 0); ctx.lineTo((W/6)*i, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (H/6)*i); ctx.lineTo(W, (H/6)*i); ctx.stroke();
    }

    // Diagonal roads
    ctx.strokeStyle = 'rgba(34,197,94,0.07)';
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W,H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W,0); ctx.lineTo(0,H); ctx.stroke();

    // District blocks
    [
      { x:15, y:20, w:35, h:25, c:'rgba(22,163,74,0.15)' },
      { x:60, y:15, w:40, h:30, c:'rgba(5,150,105,0.12)' },
      { x:10, y:65, w:30, h:40, c:'rgba(20,184,166,0.10)' },
      { x:55, y:60, w:50, h:35, c:'rgba(16,185,129,0.13)' },
      { x:30, y:40, w:45, h:20, c:'rgba(34,197,94,0.08)' },
    ].forEach(b => { ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.w, b.h); });

    // Main roads
    ctx.strokeStyle = 'rgba(74,222,128,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    ctx.strokeStyle = 'rgba(74,222,128,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(20,0); ctx.lineTo(W, H-20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,30); ctx.lineTo(W-30, H); ctx.stroke();

    // Compass ring
    ctx.strokeStyle = 'rgba(34,197,94,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r-6, 0, Math.PI*2); ctx.stroke();

    // N marker
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx, 12);

    ctx.restore();

    // Outer border
    ctx.strokeStyle = 'rgba(34,197,94,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();

    // Player dot
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur  = 10;
    ctx.fillStyle   = '#4ade80';
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur  = 0;

    // Direction triangle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, cy-4);
    ctx.lineTo(cx-3, cy+3);
    ctx.lineTo(cx+3, cy+3);
    ctx.closePath();
    ctx.fill();

  }, [lat, lon]);

  return (
    <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
      <canvas ref={canvasRef} width={120} height={120} style={{ borderRadius: '50%', display: 'block' }} />
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: '0 0 18px rgba(34,197,94,0.25), inset 0 0 10px rgba(0,0,0,0.4)' }} />
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <span className="font-mono text-[7px] text-green-600/80">
          {lat?.toFixed(2)}°N {Math.abs(lon??0)?.toFixed(2)}°E
        </span>
      </div>
    </div>
  );
}

export default function LocationCard() {
  const [location, setLocation] = useState(null);
  const [geo,      setGeo]      = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      fetchLocation(18.5204, 73.8567);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => fetchLocation(pos.coords.latitude, pos.coords.longitude),
      ()  => fetchLocation(18.5204, 73.8567),
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  const fetchLocation = async (lat, lon) => {
    setGeo({ lat, lon });
    setLoading(true);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const a    = data.address || {};

      // Build street-level line: road/street name + house number if available
      const street = [
        a.house_number,
        a.road || a.pedestrian || a.footway || a.path || a.cycleway,
      ].filter(Boolean).join(', ');

      // Neighbourhood / locality
      const neighbourhood = a.neighbourhood || a.suburb || a.quarter || a.hamlet || '';

      // Area / block
      const area = a.residential || a.industrial || a.commercial || '';

      // City-level
      const city = a.city || a.town || a.village || a.municipality || a.county || '';

      // District
      const district = a.city_district || a.state_district || a.county || '';

      setLocation({
        street,
        neighbourhood,
        area,
        city,
        district,
        state:    a.state    || '',
        country:  a.country  || '',
        postcode: a.postcode || '',
        // Full formatted display address (Nominatim gives this)
        display:  data.display_name || '',
      });
    } catch {
      setError('Could not fetch address details');
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setError('');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchLocation(pos.coords.latitude, pos.coords.longitude),
        ()  => fetchLocation(18.5204, 73.8567),
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      fetchLocation(18.5204, 73.8567);
    }
  };

  return (
    <div className="card-glass animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-green-400" />
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Live Location</p>
        {!loading && !error && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            GPS Active
          </span>
        )}
        {error && (
          <button onClick={retry} className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-green-400 transition">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 rounded-full flex-shrink-0" style={{ background: 'rgba(15,28,18,0.5)', animation: 'pulse 2s infinite' }} />
          <div className="space-y-2 flex-1">
            {[75, 55, 65, 50, 40].map((w, i) => (
              <div key={i} className="h-3 rounded animate-pulse" style={{ width: `${w}%`, background: 'rgba(34,197,94,0.12)' }} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      ) : (
        <div className="flex items-start gap-5">
          <GtaRadar lat={geo?.lat} lon={geo?.lon} />

          <div className="flex-1 min-w-0 space-y-1.5">

            {/* Street address — most detailed */}
            {location.street && (
              <div className="flex items-start gap-1.5">
                <span className="text-green-500 flex-shrink-0 mt-0.5">🏠</span>
                <p className="font-semibold text-sm text-white leading-snug">{location.street}</p>
              </div>
            )}

            {/* Neighbourhood */}
            {location.neighbourhood && (
              <div className="flex items-center gap-1.5">
                <span className="text-green-400 flex-shrink-0">📍</span>
                <p className="text-sm text-green-300 font-medium">{location.neighbourhood}</p>
              </div>
            )}

            {/* Area/residential */}
            {location.area && location.area !== location.neighbourhood && (
              <div className="flex items-center gap-1.5">
                <span className="flex-shrink-0">🏘️</span>
                <p className="text-xs text-slate-300">{location.area}</p>
              </div>
            )}

            {/* City */}
            {location.city && (
              <div className="flex items-center gap-1.5">
                <span className="flex-shrink-0">🏙️</span>
                <p className="text-xs text-slate-400">{location.city}{location.postcode ? ` — ${location.postcode}` : ''}</p>
              </div>
            )}

            {/* District + State */}
            {(location.district || location.state) && (
              <div className="flex items-center gap-1.5">
                <span className="flex-shrink-0">🗺️</span>
                <p className="text-xs text-slate-500">
                  {[location.district, location.state].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* Country */}
            {location.country && (
              <div className="flex items-center gap-1.5">
                <span className="flex-shrink-0">🌐</span>
                <p className="text-xs text-slate-600">{location.country}</p>
              </div>
            )}

            {/* Coordinates pill */}
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <Navigation className="w-2.5 h-2.5 text-green-500" />
              <span className="font-mono text-xs text-green-400">
                {geo?.lat?.toFixed(5)}°N, {geo?.lon?.toFixed(5)}°E
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
