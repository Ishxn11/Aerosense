// backend/server.js
require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const http        = require('http');
const { WebSocketServer } = require('ws');
const mongoose    = require('mongoose');
const sensorRoutes = require('./routes/sensorRoutes');
const { simulateSensor } = require('./simulator');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// Make wss accessible in controllers
app.set('wss', wss);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', sensorRoutes);

app.get('/', (req, res) => res.json({ status: 'AeroSense API running', version: '1.0.0' }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── WebSocket ───────────────────────────────────────────────────────────────
wss.on('connection', (ws, req) => {
  console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'AeroSense WebSocket ready' }));
  ws.on('close', () => console.log('[WS] Client disconnected'));
  ws.on('error', err => console.error('[WS] Error:', err.message));
});

// ── Database + Start ────────────────────────────────────────────────────────
const PORT     = process.env.PORT     || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aerosense';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀  AeroSense backend running on http://localhost:${PORT}`);
      console.log(`🔌  WebSocket server ready on ws://localhost:${PORT}`);
    });
    simulateSensor(wss);
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
