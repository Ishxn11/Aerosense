// src/components/Sidebar.jsx
import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, Wind, Activity, Camera, Pencil, Check, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const links = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
  { to: '/settings',  icon: Settings,        label: 'Settings'  },
];

// Built-in eco/environment avatar SVGs
const BUILT_IN_AVATARS = [
  {
    id: 'leaf',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#064e3b"/>
      <path d="M32 12 C20 16 12 28 16 44 C22 36 28 32 44 30 C38 22 32 12 32 12Z" fill="#22c55e"/>
      <path d="M16 44 C18 38 24 34 32 32" stroke="#86efac" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="32" cy="50" r="4" fill="#16a34a"/>
    </svg>`
  },
  {
    id: 'tree',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#052e16"/>
      <ellipse cx="32" cy="26" rx="14" ry="16" fill="#16a34a"/>
      <ellipse cx="32" cy="20" rx="10" ry="12" fill="#22c55e"/>
      <rect x="29" y="40" width="6" height="12" rx="2" fill="#78350f"/>
      <circle cx="22" cy="28" r="5" fill="#15803d"/>
      <circle cx="42" cy="28" r="5" fill="#15803d"/>
    </svg>`
  },
  {
    id: 'earth',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#0c4a6e"/>
      <circle cx="32" cy="32" r="20" fill="#0369a1"/>
      <path d="M18 26 Q24 20 28 26 Q22 32 18 26Z" fill="#16a34a"/>
      <path d="M30 20 Q36 18 38 26 Q32 28 30 20Z" fill="#22c55e"/>
      <path d="M36 32 Q42 30 44 38 Q38 40 36 32Z" fill="#16a34a"/>
      <path d="M20 36 Q26 34 28 42 Q22 42 20 36Z" fill="#15803d"/>
    </svg>`
  },
  {
    id: 'wind',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#1e1b4b"/>
      <path d="M14 28 Q22 24 26 28 Q22 32 14 28Z" fill="#818cf8" opacity="0.8"/>
      <path d="M14 35 Q24 31 30 35 Q24 39 14 35Z" fill="#a5b4fc" opacity="0.7"/>
      <path d="M14 42 Q20 38 24 42 Q20 46 14 42Z" fill="#818cf8" opacity="0.6"/>
      <circle cx="40" cy="26" r="8" fill="none" stroke="#6366f1" stroke-width="2"/>
      <path d="M36 22 Q44 22 44 30" stroke="#818cf8" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'sun',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#431407"/>
      <circle cx="32" cy="32" r="12" fill="#f97316"/>
      <circle cx="32" cy="32" r="8" fill="#fbbf24"/>
      <line x1="32" y1="10" x2="32" y2="16" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
      <line x1="32" y1="48" x2="32" y2="54" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
      <line x1="10" y1="32" x2="16" y2="32" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
      <line x1="48" y1="32" x2="54" y2="32" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
      <line x1="17" y1="17" x2="21" y2="21" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="43" y1="43" x2="47" y2="47" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="47" y1="17" x2="43" y2="21" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="21" y1="43" x2="17" y2="47" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'drop',
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#0c4a6e"/>
      <path d="M32 14 C32 14 18 28 18 38 C18 46 24.3 52 32 52 C39.7 52 46 46 46 38 C46 28 32 14 32 14Z" fill="#38bdf8"/>
      <path d="M32 14 C32 14 18 28 18 38 C18 46 24.3 52 32 52" fill="#0ea5e9" opacity="0.5"/>
      <ellipse cx="27" cy="36" rx="4" ry="6" fill="white" opacity="0.25" transform="rotate(-20 27 36)"/>
    </svg>`
  },
];

function AvatarPicker({ current, onSelect, onClose }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 p-3 rounded-2xl shadow-2xl"
      style={{ background: '#0a1f10', border: '1px solid rgba(34,197,94,0.25)', width: 200 }}>
      <p className="text-xs text-green-400/70 uppercase tracking-widest mb-2 text-center">Choose Avatar</p>
      <div className="grid grid-cols-3 gap-2">
        {BUILT_IN_AVATARS.map(av => (
          <button
            key={av.id}
            onClick={() => { onSelect(av.svg); onClose(); }}
            className={`w-14 h-14 rounded-xl overflow-hidden transition-all hover:scale-110 ${current === av.svg ? 'ring-2 ring-green-400' : ''}`}
            dangerouslySetInnerHTML={{ __html: av.svg }}
          />
        ))}
      </div>
      <button onClick={onClose} className="mt-2 w-full text-xs text-slate-500 hover:text-slate-300 transition text-center py-1">
        Cancel
      </button>
    </div>
  );
}

function ProfileSection() {
  const { user, updateUser } = useUser();
  const [editing,     setEditing]     = useState(false);
  const [draftName,   setDraftName]   = useState(user.name);
  const [draftRole,   setDraftRole]   = useState(user.role || 'Engineer');
  const [showPicker,  setShowPicker]  = useState(false);
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUser({ avatar: reader.result, avatarType: 'photo' });
    reader.readAsDataURL(file);
  };

  const handleBuiltIn = (svg) => {
    updateUser({ avatar: svg, avatarType: 'svg' });
  };

  const saveEdit = () => {
    if (!draftName.trim()) return;
    updateUser({ name: draftName.trim(), role: draftRole.trim() });
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraftName(user.name);
    setDraftRole(user.role || 'Engineer');
    setEditing(false);
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const isSvg    = user.avatarType === 'svg';

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-3 relative">
        <div className="relative group">
          <div
            className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-bold text-white cursor-pointer"
            style={!user.avatar ? { background: 'linear-gradient(135deg,#16a34a,#059669)', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' } : {}}
            onClick={() => setShowPicker(s => !s)}
          >
            {user.avatar
              ? isSvg
                ? <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: user.avatar }} />
                : <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              : initials
            }
          </div>
          {/* Camera badge for file upload */}
          <button
            onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-600 border-2 border-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white"
            title="Upload photo"
          >
            <Camera className="w-2.5 h-2.5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Avatar picker dropdown */}
        {showPicker && (
          <AvatarPicker current={user.avatar} onSelect={handleBuiltIn} onClose={() => setShowPicker(false)} />
        )}
      </div>

      {/* Name & role */}
      {editing ? (
        <div className="space-y-2">
          <input
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
            placeholder="Full name"
            className="w-full px-2.5 py-1.5 rounded-lg text-xs text-white outline-none"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
          />
          <input
            value={draftRole}
            onChange={e => setDraftRole(e.target.value)}
            placeholder="Role / title"
            className="w-full px-2.5 py-1.5 rounded-lg text-xs text-white outline-none"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
          />
          <div className="flex gap-2">
            <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-green-600 text-white text-xs font-medium">
              <Check className="w-3 h-3" /> Save
            </button>
            <button onClick={cancelEdit} className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-xs"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {/* Full name on ONE line, pencil inline */}
          <div className="flex items-center justify-center gap-1.5">
            <p className="font-semibold text-sm text-white truncate max-w-[150px]">
              {user.name}
            </p>
            <button onClick={() => setEditing(true)} className="text-green-600 hover:text-green-400 transition flex-shrink-0">
              <Pencil className="w-3 h-3" />
            </button>
          </div>
          {/* Role below */}
          <p className="text-xs mt-0.5" style={{ color: 'rgba(134,239,172,0.5)' }}>
            {user.role || 'Engineer'}
          </p>
          {/* Hint */}
          <p className="text-[9px] mt-1" style={{ color: 'rgba(34,197,94,0.3)' }}>
            tap avatar to change
          </p>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-auto`}
        style={{ background: 'linear-gradient(160deg, #052e16 0%, #064e3b 40%, #0f172a 100%)' }}
      >
        {/* Logo + Profile share ONE border */}
        <div className="border-b border-green-900/40">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center shadow-lg shadow-green-900/40">
              <Wind className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-none text-white">
                Aero<span className="text-green-400">Sense</span>
              </h1>
              <p className="text-[9.5px] mt-0.5 leading-snug" style={{ color: 'rgba(134,239,172,0.5)' }}>
                Data-Driven Insights for a<br />Healthier Environment
              </p>
            </div>
          </div>
          <ProfileSection />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                 ${isActive
                   ? 'bg-green-500/20 text-green-300 border border-green-500/30 shadow shadow-green-900/30'
                   : 'text-green-200/60 hover:text-green-100 hover:bg-green-900/30'}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-green-900/40">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(34,197,94,0.35)' }}>
            <Activity className="w-3 h-3" />
            <span>v1.0.0 · IoT Simulator Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
