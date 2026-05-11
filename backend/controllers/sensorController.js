// backend/controllers/sensorController.js
const SensorData = require('../models/SensorData');

// GET /api/data — latest reading
exports.getLatest = async (req, res) => {
  try {
    const data = await SensorData.findOne().sort({ createdAt: -1 });
    if (!data) return res.status(404).json({ error: 'No sensor data found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// POST /api/data — insert new reading
exports.insertData = async (req, res) => {
  try {
    const { aqi, temperature, humidity, gasLevels, deviceId, deviceOnline } = req.body;

    if (aqi === undefined || temperature === undefined || humidity === undefined || !gasLevels) {
      return res.status(400).json({ error: 'Missing required fields: aqi, temperature, humidity, gasLevels' });
    }
    if (aqi < 0 || aqi > 500)    return res.status(400).json({ error: 'AQI must be 0–500' });
    if (humidity < 0 || humidity > 100) return res.status(400).json({ error: 'Humidity must be 0–100' });

    const entry = new SensorData({ aqi, temperature, humidity, gasLevels, deviceId, deviceOnline });
    const saved  = await entry.save();

    // Broadcast via WebSocket if server has wss attached
    const wss = req.app.get('wss');
    if (wss) {
      const payload = JSON.stringify({ type: 'SENSOR_UPDATE', data: saved });
      wss.clients.forEach(client => {
        if (client.readyState === 1) client.send(payload);
      });
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// GET /api/history — last N readings (default 50)
exports.getHistory = async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit)  || 50, 500);
    const hours  = parseInt(req.query.hours) || 24;
    const since  = new Date(Date.now() - hours * 60 * 60 * 1000);

    const data = await SensorData
      .find({ createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ count: data.length, data: data.reverse() });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// GET /api/stats — min/max/avg summary
exports.getStats = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const [result] = await SensorData.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          avgAqi:  { $avg: '$aqi' },
          maxAqi:  { $max: '$aqi' },
          minAqi:  { $min: '$aqi' },
          avgTemp: { $avg: '$temperature' },
          avgHum:  { $avg: '$humidity' },
          count:   { $sum: 1 },
        },
      },
    ]);
    res.json(result || {});
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
