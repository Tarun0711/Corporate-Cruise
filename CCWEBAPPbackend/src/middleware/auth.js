const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const User = require('../models/user');
const logger = require('../utils/logger');

// Protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    console.log("authenticating token");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' }); 
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

const isOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const resourceUserId = req.params.userId;

  if (String(req.user._id) !== String(resourceUserId)) {
    return res.status(403).json({ error: 'Access denied. You are not the owner of this resource.' });
  }

  next();
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    logger.info(`Admin check for user: ${req.user._id}`);
    console.log('req.user:', req.user);

    if (req.user.isAdmin === undefined) {
      logger.warn(`User role not defined for user: ${req.user._id}`);
      return res.status(403).json({ error: 'Access denied. User role not defined.' });
    }

    if (!req.user.isAdmin) {
      logger.warn(`Non-admin user ${req.user._id} attempted admin access`);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    logger.info(`Admin user ${req.user._id} accessed admin route`);
    next();
  } catch (error) {
    logger.error('Error in isAdmin middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  protect,
  authenticateToken,
  authorizeRoles,
  isOwner,
  isAdmin
};
 