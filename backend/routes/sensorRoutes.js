// backend/routes/sensorRoutes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/sensorController');

router.get('/data',    controller.getLatest);
router.post('/data',   controller.insertData);
router.get('/history', controller.getHistory);
router.get('/stats',   controller.getStats);

module.exports = router;
