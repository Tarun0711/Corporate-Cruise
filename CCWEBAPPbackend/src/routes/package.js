const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, isAdmin, packageController.createPackage);

router.get('/', packageController.getAllPackages);


router.get('/:packageId', packageController.getPackageById);


router.put('/:packageId', authenticateToken, isAdmin, packageController.updatePackage);

router.delete('/:packageId', authenticateToken, isAdmin, packageController.deletePackage);

// New route for updating payment status
router.patch('/:packageId/payment', authenticateToken, packageController.updatePaymentStatus);

module.exports = router; 