const mongoose = require('mongoose');

const routePacketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['5-seater', '7-seater']
  },
  passengers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    pickupLocation: {
      type: String,
      required: true
    },
    dropLocation: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  routeDetails: {
    totalDistance: {
      type: String,
      required: true
    },
    totalTime: {
      type: String,
      required: true
    },
    waypoints: [{
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        enum: ['pickup', 'drop'],
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      order: {
        type: Number,
        required: true
      }
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
routePacketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better query performance
routePacketSchema.index({ 'passengers.userId': 1 });
routePacketSchema.index({ createdAt: -1 });

const RoutePacket = mongoose.model('RoutePacket', routePacketSchema);

module.exports = RoutePacket;
