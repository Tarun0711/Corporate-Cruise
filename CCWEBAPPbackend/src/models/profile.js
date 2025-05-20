const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: true
  },
  officeTimings: {
    inTime: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time format! Use HH:MM format`
      }
    },
    outTime: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time format! Use HH:MM format`
      }
    }
  },
  sharing: {
    type: String,
    enum: ['Private', 'Double', 'Triple', 'Max'],
    required: true
  },
  workingDays: {
    type: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: props => 'At least one working day is required'
    }
  },
  oneSideRoute: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps and check completion before saving
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Check if all required fields are filled
  this.isCompleted = !!(
    this.gender &&
    this.officeTimings &&
    this.officeTimings.inTime &&
    this.officeTimings.outTime &&
    this.sharing &&
    this.workingDays &&
    this.workingDays.length > 0 &&
    this.oneSideRoute
  );
  
  next();
});

module.exports = mongoose.model('Profile', profileSchema);