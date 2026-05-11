// backend/simulator.js
// Simulates IoT sensor by POSTing random readings to the backend

const SensorData = require('./models/SensorData');

let deviceOnline = true;

function generateReading() {
  // Simulate occasional device offline
  deviceOnline = Math.random() > 0.05;

  const aqi         = Math.round(Math.random() * 200 + 10);
  const temperature = parseFloat((Math.random() * 20 + 20).toFixed(1)); // 20–40°C
  const humidity    = parseFloat((Math.random() * 50 + 30).toFixed(1)); // 30–80%
  const gasLevels   = {
    CO2:  Math.round(Math.random() * 1000 + 400),  // ppm
    CO:   parseFloat((Math.random() * 5).toFixed(2)), // ppm
    NO2:  parseFloat((Math.random() * 0.2).toFixed(3)),
    PM25: parseFloat((Math.random() * 75).toFixed(1)),
  };

  return { aqi, temperature, humidity, gasLevels, deviceId: 'SENSOR_01', deviceOnline };
}

async function simulateSensor(wss) {
  const interval = setInterval(async () => {
    try {
      const reading = generateReading();
      const entry   = new SensorData(reading);
      const saved   = await entry.save();

      if (wss) {
        const payload = JSON.stringify({ type: 'SENSOR_UPDATE', data: saved });
        wss.clients.forEach(client => {
          if (client.readyState === 1) client.send(payload);
        });
      }

      // Alert check
      const threshold = parseInt(process.env.AQI_ALERT_THRESHOLD) || 150;
      if (saved.aqi > threshold) {
        const alert = JSON.stringify({ type: 'AQI_ALERT', aqi: saved.aqi, threshold, timestamp: saved.createdAt });
        if (wss) wss.clients.forEach(c => { if (c.readyState === 1) c.send(alert); });
        console.warn(`⚠️  AQI ALERT: ${saved.aqi} exceeds threshold ${threshold}`);
      }

      console.log(`[Simulator] AQI: ${saved.aqi}, Temp: ${saved.temperature}°C, Hum: ${saved.humidity}%`);
    } catch (err) {
      console.error('[Simulator] Error:', err.message);
    }
  }, 4000);

  return interval;
}

module.exports = { simulateSensor };
