const Package = require('../models/package');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const emailService = require('../services/email/emailService');


const createPackage = async (req, res) => {
  try {
    // Validate request using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const {
      name,
      description,
      price,
      duration,
      validity,
      features,
      rideLimit,
      discountPercentage,
      userEmail,
      userName
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !duration || !validity || !rideLimit) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    // Validate data types
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Price must be a positive number' 
      });
    }

    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Duration must be a positive number' 
      });
    }

    if (typeof rideLimit !== 'number' || rideLimit <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Ride limit must be a positive number' 
      });
    }

    // Validate validity dates
    if (!validity.startDate || !validity.endDate) {
      return res.status(400).json({ 
        success: false,
        error: 'Validity must include startDate and endDate' 
      });
    }

    const startDate = new Date(validity.startDate);
    const endDate = new Date(validity.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid date format for validity dates' 
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ 
        success: false,
        error: 'End date must be after start date' 
      });
    }

    // Create new package
    const newPackage = new Package({
      userId: req.user.userId, // Admin who created the package
      name,
      description,
      price,
      duration,
      validity: {
        startDate,
        endDate
      },
      features: features || [],
      rideLimit,
      discountPercentage: discountPercentage || 0,
      userEmail,
      userName
    });

    // Save package to database
    const savedPackage = await newPackage.save();
    
    // Send email notification if user email is provided
    if (userEmail) {
      try {
        await emailService.sendPackageCreatedNotification(userEmail, {
          userName: userName || 'Valued Customer',
          packageName: name,
          description,
          price,
          duration,
          rideLimit,
          validityStart: new Date(validity.startDate).toLocaleDateString(),
          validityEnd: new Date(validity.endDate).toLocaleDateString(),
          features: features || [],
          packageId: savedPackage._id
        });
      } catch (emailError) {
        // Log the error but don't fail the request
        logger.error('Failed to send package creation notification email:', emailError);
      }
    }
    
    logger.info(`Package created: ${savedPackage._id}`);
    return res.status(201).json({
      success: true,
      data: savedPackage
    });
  } catch (error) {
    logger.error('Error creating package:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: 'Package with this ID already exists' 
      });
    }
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ 
        success: false,
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Failed to create package',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      isActive
    } = req.query;
    
    // Build filter query
    const filter = {};
    
    // Only show active packages by default
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    } else {
      filter.isActive = true;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination and sorting
    const packages = await Package.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitValue);
    
    // Get total count for pagination
    const total = await Package.countDocuments(filter);
    
    return res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        total,
        page: parseInt(page),
        limit: limitValue,
        pages: Math.ceil(total / limitValue)
      }
    });
  } catch (error) {
    logger.error('Error fetching packages:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch packages',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;
    
    if (!packageId) {
      return res.status(400).json({ 
        success: false,
        error: 'Package ID is required' 
      });
    }
    
    const packageData = await Package.findOne({ packageId, isActive: true });
    
    if (!packageData) {
      return res.status(404).json({ 
        success: false,
        error: 'Package not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      data: packageData
    });
  } catch (error) {
    logger.error('Error fetching package:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch package',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const updateData = req.body;
    
    if (!packageId) {
      return res.status(400).json({ 
        success: false,
        error: 'Package ID is required' 
      });
    }
    
    // Validate data types if provided
    if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price <= 0)) {
      return res.status(400).json({ 
        success: false,
        error: 'Price must be a positive number' 
      });
    }
    
    if (updateData.duration !== undefined && (typeof updateData.duration !== 'number' || updateData.duration <= 0)) {
      return res.status(400).json({ 
        success: false,
        error: 'Duration must be a positive number' 
      });
    }
    
    if (updateData.rideLimit !== undefined && (typeof updateData.rideLimit !== 'number' || updateData.rideLimit <= 0)) {
      return res.status(400).json({ 
        success: false,
        error: 'Ride limit must be a positive number' 
      });
    }
    
    // Validate validity dates if provided
    if (updateData.validity) {
      if (updateData.validity.startDate && updateData.validity.endDate) {
        const startDate = new Date(updateData.validity.startDate);
        const endDate = new Date(updateData.validity.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return res.status(400).json({ 
            success: false,
            error: 'Invalid date format for validity dates' 
          });
        }
        
        if (startDate >= endDate) {
          return res.status(400).json({ 
            success: false,
            error: 'End date must be after start date' 
          });
        }
        
        // Convert to proper Date objects
        updateData.validity.startDate = startDate;
        updateData.validity.endDate = endDate;
      }
    }
    
    // Find and update package
    const updatedPackage = await Package.findOneAndUpdate(
      { packageId },
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return res.status(404).json({ 
        success: false,
        error: 'Package not found' 
      });
    }
    
    logger.info(`Package updated: ${packageId}`);
    return res.status(200).json({
      success: true,
      data: updatedPackage
    });
  } catch (error) {
    logger.error('Error updating package:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        error: 'Package with this ID already exists' 
      });
    }
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ 
        success: false,
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Failed to update package',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    
    if (!packageId) {
      return res.status(400).json({ 
        success: false,
        error: 'Package ID is required' 
      });
    }
    
    // Soft delete by setting isActive to false
    const deletedPackage = await Package.findOneAndUpdate(
      { packageId },
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!deletedPackage) {
      return res.status(404).json({ 
        success: false,
        error: 'Package not found' 
      });
    }
    
    logger.info(`Package deleted: ${packageId}`);
    return res.status(200).json({ 
      success: true,
      message: 'Package deleted successfully' 
    });
  } catch (error) {
    logger.error('Error deleting package:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to delete package',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const updatePaymentStatus = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { paymentStatus, paidAmount, transactionId } = req.body;

    // Validate payment status
    if (!paymentStatus || !['unpaid', 'paid', 'partially_paid'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment status. Must be one of: unpaid, paid, partially_paid'
      });
    }

    // Find the package
    const package = await Package.findOne({ packageId });
    if (!package) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    // Update payment status
    package.paymentStatus = paymentStatus;
    
    // Update payment details if provided
    if (paidAmount !== undefined) {
      package.paymentDetails.paidAmount = paidAmount;
    }
    
    if (transactionId) {
      package.paymentDetails.transactionId = transactionId;
    }
    
    // Set payment date to current date if status is paid or partially paid
    if (paymentStatus === 'paid' || paymentStatus === 'partially_paid') {
      package.paymentDetails.paymentDate = new Date();
    }

    // Save the updated package
    await package.save();

    logger.info(`Payment status updated for package: ${packageId} to ${paymentStatus}`);
    
    // Send email notification if user email is available
    if (package.userEmail) {
      try {
        await emailService.sendPaymentNotification(package.userEmail, {
          userName: package.userName || 'Valued Customer',
          packageName: package.name,
          paymentStatus,
          paidAmount: package.paymentDetails.paidAmount || 0,
          transactionId: package.paymentDetails.transactionId || 'N/A',
          paymentDate: package.paymentDetails.paymentDate ? 
            package.paymentDetails.paymentDate.toLocaleDateString() : 'N/A'
        });
      } catch (emailError) {
        // Log the error but don't fail the request
        logger.error('Failed to send payment notification email:', emailError);
      }
    }
    
    return res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    logger.error('Error updating payment status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update payment status',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  updatePaymentStatus
}; 