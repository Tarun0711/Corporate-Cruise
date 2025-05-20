const express = require('express');
const router = express.Router();
const routingController = require('../controllers/routingController');
const { protect } = require('../middleware/auth');

// Route packets routes
router.post('/route-packets', protect, routingController.createRoutePacket);
router.get('/route-packets', protect, routingController.getAllRoutePackets);
router.get('/route-packets/:id', protect, routingController.getRoutePacketById);
router.put('/route-packets/:id', protect, routingController.updateRoutePacket);
router.delete('/route-packets/:id', protect, routingController.deleteRoutePacket);

// Users with routing preferences
router.get('/users/preferences', protect, routingController.getUsersWithRoutingPreferences);

// Route statistics
router.get('/statistics', protect, routingController.getRouteStatistics);

module.exports = router; 