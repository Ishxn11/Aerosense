// src/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:5000`;

export function useWebSocket(onMessage) {
  const ws        = useRef(null);
  const [status, setStatus] = useState('connecting'); // connecting | open | closed
  const reconnectTimer = useRef(null);
  const onMsgRef  = useRef(onMessage);
  onMsgRef.current = onMessage;

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        setStatus('open');
        console.log('[WS] Connected');
      };

      ws.current.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          onMsgRef.current?.(msg);
        } catch { /* ignore malformed */ }
      };

      ws.current.onclose = () => {
        setStatus('closed');
        console.log('[WS] Disconnected — reconnecting in 5s');
        reconnectTimer.current = setTimeout(connect, 5000);
      };

      ws.current.onerror = () => {
        ws.current?.close();
      };
    } catch (err) {
      console.error('[WS] Error:', err);
      setStatus('closed');
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  return { status };
}
