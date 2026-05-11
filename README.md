# 🌬️ AeroSense — Smart Air Quality Monitor

A full-stack real-time air quality dashboard with IoT simulation, WebSocket live updates, and a modern React UI.

---

## 🗂️ Project Structure

```
aerosense/
├── backend/
│   ├── controllers/
│   │   └── sensorController.js   ← API logic
│   ├── models/
│   │   └── SensorData.js         ← Mongoose schema
│   ├── routes/
│   │   └── sensorRoutes.js       ← Express routes
│   ├── server.js                 ← Entry point + WebSocket
│   ├── simulator.js              ← IoT data generator
│   ├── .env                      ← Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AqiCard.jsx
    │   │   ├── AqiChart.jsx
    │   │   ├── AlertBanner.jsx
    │   │   ├── DeviceStatus.jsx
    │   │   ├── GasChart.jsx
    │   │   ├── MetricCard.jsx
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── ThemeContext.jsx
    │   ├── hooks/
    │   │   └── useWebSocket.js
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Analytics.jsx
    │   │   └── Settings.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── aqi.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017
  - Install: https://www.mongodb.com/try/download/community
  - Or use MongoDB Atlas (update `MONGO_URI` in `.env`)

---

## 🚀 Quick Start

### 1. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows — start MongoDB service from Services panel
```

### 2. Setup & Start Backend

```bash
cd aerosense/backend
npm install
npm run dev       # uses nodemon for auto-reload
# or: npm start
```

Backend starts at: **http://localhost:5000**
WebSocket at: **ws://localhost:5000**

The **IoT simulator** starts automatically — generating a new reading every 4 seconds.

### 3. Setup & Start Frontend

```bash
cd aerosense/frontend
npm install
npm run dev
```

Frontend at: **http://localhost:3000**

---

## 🔌 REST API Reference

| Method | Endpoint        | Description                           |
|--------|-----------------|---------------------------------------|
| GET    | `/api/data`     | Latest sensor reading                 |
| POST   | `/api/data`     | Insert new reading                    |
| GET    | `/api/history`  | Historical data (`?limit=50&hours=24`)|
| GET    | `/api/stats`    | Aggregated stats (`?hours=24`)        |

### POST `/api/data` — Body

```json
{
  "aqi": 87,
  "temperature": 28.5,
  "humidity": 62.3,
  "gasLevels": {
    "CO2": 820,
    "CO": 1.2,
    "NO2": 0.05,
    "PM25": 34.1
  }
}
```

---

## 🔴 WebSocket Events

Connect to `ws://localhost:5000`

| Event Type      | Description                       |
|-----------------|-----------------------------------|
| `CONNECTED`     | Initial connection confirmation   |
| `SENSOR_UPDATE` | New sensor reading (every ~4s)    |
| `AQI_ALERT`     | AQI exceeded threshold            |

---

## 📊 AQI Color Scale

| AQI Range | Category       | Color  |
|-----------|----------------|--------|
| 0 – 50    | Good           | Green  |
| 51 – 100  | Moderate       | Yellow |
| 101 – 150 | Unhealthy*     | Orange |
| 151 – 200 | Unhealthy      | Red    |
| 201 – 300 | Very Unhealthy | Purple |
| 300+      | Hazardous      | Maroon |

---

## 🌿 Environment Variables (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/aerosense
AQI_ALERT_THRESHOLD=150
```

---

## ✨ Features

- ✅ Real-time AQI, Temperature, Humidity display
- ✅ WebSocket live push updates (4s interval)
- ✅ AQI trend line chart (Recharts)
- ✅ Gas levels bar chart (CO₂, CO, NO₂, PM2.5)
- ✅ AQI alert system with dismissible banners
- ✅ Analytics page with area charts and stats
- ✅ Dark/light mode toggle
- ✅ Responsive mobile + desktop layout
- ✅ Device online/offline indicator
- ✅ Polling fallback if WebSocket disconnects
- ✅ Settings page
