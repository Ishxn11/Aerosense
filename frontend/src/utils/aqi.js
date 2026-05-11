// src/utils/aqi.js

export function getAqiCategory(aqi) {
  if (aqi <= 50)  return { label: 'Good',        color: '#22c55e', bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30' };
  if (aqi <= 100) return { label: 'Moderate',     color: '#eab308', bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' };
  if (aqi <= 150) return { label: 'Unhealthy*',   color: '#f97316', bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' };
  if (aqi <= 200) return { label: 'Unhealthy',    color: '#ef4444', bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/30' };
  if (aqi <= 300) return { label: 'Very Unhealthy',color: '#a855f7', bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' };
  return           { label: 'Hazardous',          color: '#7f1d1d', bg: 'bg-red-900/30',    text: 'text-red-300',    border: 'border-red-800/50' };
}

export function formatTimestamp(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatDate(ts) {
  return new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
