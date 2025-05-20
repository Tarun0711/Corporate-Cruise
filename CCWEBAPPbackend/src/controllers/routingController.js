const RoutePacket = require('../models/routing');
const User = require('../models/user');

// Create a new route packet
exports.createRoutePacket = async (req, res) => {
  try {
    const { name, vehicleType, passengers, routeDetails } = req.body;

    // Validate vehicle capacity
    const maxPassengers = vehicleType === '5-seater' ? 4 : 6;
    if (passengers.length > maxPassengers) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${maxPassengers} passengers allowed for ${vehicleType}`
      });
    }

    // Create new route packet
    const routePacket = new RoutePacket({
      name,
      vehicleType,
      passengers,
      routeDetails
    });

    await routePacket.save();

    res.status(201).json({
      success: true,
      data: routePacket
    });
  } catch (error) {
    console.error('Error creating route packet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create route packet',
      error: error.message
    });
  }
};

// Get all route packets
exports.getAllRoutePackets = async (req, res) => {
  try {
    const routePackets = await RoutePacket.find()
      .sort({ createdAt: -1 })
      .populate('passengers.userId', 'name email phone');

    res.status(200).json({
      success: true,
      data: routePackets
    });
  } catch (error) {
    console.error('Error fetching route packets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route packets',
      error: error.message
    });
  }
};

// Get a single route packet by ID
exports.getRoutePacketById = async (req, res) => {
  try {
    const routePacket = await RoutePacket.findById(req.params.id)
      .populate('passengers.userId', 'name email phone');

    if (!routePacket) {
      return res.status(404).json({
        success: false,
        message: 'Route packet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: routePacket
    });
  } catch (error) {
    console.error('Error fetching route packet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route packet',
      error: error.message
    });
  }
};

// Update a route packet
exports.updateRoutePacket = async (req, res) => {
  try {
    const { name, vehicleType, passengers, routeDetails } = req.body;

    // Validate vehicle capacity
    const maxPassengers = vehicleType === '5-seater' ? 4 : 6;
    if (passengers.length > maxPassengers) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${maxPassengers} passengers allowed for ${vehicleType}`
      });
    }

    const routePacket = await RoutePacket.findByIdAndUpdate(
      req.params.id,
      {
        name,
        vehicleType,
        passengers,
        routeDetails,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('passengers.userId', 'name email phone');

    if (!routePacket) {
      return res.status(404).json({
        success: false,
        message: 'Route packet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: routePacket
    });
  } catch (error) {
    console.error('Error updating route packet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route packet',
      error: error.message
    });
  }
};

// Delete a route packet
exports.deleteRoutePacket = async (req, res) => {
  try {
    const routePacket = await RoutePacket.findByIdAndDelete(req.params.id);

    if (!routePacket) {
      return res.status(404).json({
        success: false,
        message: 'Route packet not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Route packet deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting route packet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete route packet',
      error: error.message
    });
  }
};

// Get all users with their routing preferences
exports.getUsersWithRoutingPreferences = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email phone pickupLocation dropLocation')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users with routing preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users with routing preferences',
      error: error.message
    });
  }
};

// Get route statistics
exports.getRouteStatistics = async (req, res) => {
  try {
    const statistics = await RoutePacket.aggregate([
      {
        $group: {
          _id: '$vehicleType',
          count: { $sum: 1 },
          totalDistance: { $sum: { $toDouble: '$routeDetails.totalDistance' } },
          totalTime: { $sum: { $toDouble: '$routeDetails.totalTime' } },
          averagePassengers: { $avg: { $size: '$passengers' } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching route statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route statistics',
      error: error.message
    });
  }
}; 