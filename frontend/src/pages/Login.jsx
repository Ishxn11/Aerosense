// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [shake,    setShake]    = useState(false);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const validate = () => {
    const name = username.trim();
    if (!name)         return 'Please enter your name.';
    if (name.length < 3) return 'Name must be at least 3 characters.';
    if (!password)     return 'Please enter a password.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); triggerShake(); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    // Store the FULL name exactly as typed (e.g. "Ishan Tele")
    const fullName = username.trim();
    localStorage.setItem('aerosense-auth', 'true');
    localStorage.setItem('aerosense-user', JSON.stringify({
      name:       fullName,
      role:       'Engineer',
      avatar:     null,
      avatarType: null,
    }));
    onLogin();
    navigate('/');
    setLoading(false);
  };

  const fillDemo = () => { setUsername('Ishan Tele'); setPassword('aerosense123'); setError(''); };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #052e16 0%, #064e3b 45%, #0f172a 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(34,197,94,0.10)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(52,211,153,0.08)' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Card */}
      <div
        className={`relative w-full max-w-md mx-4 ${shake ? 'animate-shake' : ''}`}
        style={{
          background: 'rgba(2,20,10,0.82)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(74,222,128,0.22)',
          borderRadius: '28px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(34,197,94,0.06)',
          padding: '44px 40px',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', boxShadow: '0 8px 32px rgba(34,197,94,0.4)' }}>
            <Wind className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-4xl tracking-tight"
            style={{ color: '#fff', textShadow: '0 0 40px rgba(74,222,128,0.45)', letterSpacing: '-0.5px' }}>
            Aero<span style={{ color: '#4ade80' }}>Sense</span>
          </h1>
          <p className="text-sm mt-1.5" style={{ color: 'rgba(134,239,172,0.6)' }}>
            Air Quality Monitoring System
          </p>
          <div className="flex items-center gap-2 mt-3">
            {['MQ135','DHT11','IoT Live'].map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(34,197,94,0.10)', color: '#86efac', border: '1px solid rgba(34,197,94,0.18)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'rgba(134,239,172,0.65)' }}>
              Full Name
            </label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="e.g. Ishan Tele"
              required
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{ background: 'rgba(15,30,20,0.8)', border: '1.5px solid rgba(74,222,128,0.16)', color: '#fff' }}
              onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.16)'}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: 'rgba(134,239,172,0.65)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter any password (6+ chars)"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ background: 'rgba(15,30,20,0.8)', border: '1.5px solid rgba(74,222,128,0.16)', color: '#fff' }}
                onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.16)'}
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                style={{ color: 'rgba(134,239,172,0.45)' }}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
            style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', boxShadow: loading ? 'none' : '0 4px 24px rgba(34,197,94,0.35)' }}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        {/* Demo box */}
        <div className="mt-5 p-4 rounded-xl cursor-pointer transition-all duration-200"
          style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.13)' }}
          onClick={fillDemo}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4ade80' }}>Demo Credentials</span>
            <span className="text-xs ml-auto" style={{ color: 'rgba(100,116,139,0.7)' }}>click to autofill</span>
          </div>
          <p className="text-xs mb-1.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
            Or type any name (3+ chars) + any password (6+ chars)
          </p>
          <div className="font-mono text-xs space-y-0.5" style={{ color: '#94a3b8' }}>
            <p>Name: <span style={{ color: '#4ade80' }}>Ishan Tele</span></p>
            <p>Password: <span style={{ color: '#4ade80' }}>aerosense123</span></p>
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'rgba(71,85,105,0.7)' }}>
          AeroSense v1.0.0 · MQ135 + DHT11 Platform
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{ transform:translateX(0) }
          20%    { transform:translateX(-8px) }
          40%    { transform:translateX(8px) }
          60%    { transform:translateX(-5px) }
          80%    { transform:translateX(5px) }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        input::placeholder { color: rgba(100,116,139,0.45); }
      `}</style>
    </div>
  );
}
