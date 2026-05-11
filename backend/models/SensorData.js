// backend/models/SensorData.js
const mongoose = require('mongoose');

const gasLevelsSchema = new mongoose.Schema({
  CO2: { type: Number, required: true, min: 0 },
  CO:  { type: Number, required: true, min: 0 },
  NO2: { type: Number, required: true, min: 0 },
  PM25:{ type: Number, required: true, min: 0 },
}, { _id: false });

const sensorDataSchema = new mongoose.Schema(
  {
    aqi:         { type: Number, required: true, min: 0, max: 500 },
    temperature: { type: Number, required: true },
    humidity:    { type: Number, required: true, min: 0, max: 100 },
    gasLevels:   { type: gasLevelsSchema, required: true },
    deviceId:    { type: String, default: 'SENSOR_01' },
    deviceOnline:{ type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for efficient time-range queries
sensorDataSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);
