const User = require('../models/user');
const redisClient = require('./redis/redisClient');
const emailService = require('./email/emailService');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class UserService {
  static async signup(userData) { 
    try {
      // Check if email or phone number already exists
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { mobile: userData.mobile }
        ]
      });
  
      if (existingUser) {
        throw new Error('Email or phone number already exists');
      }

      // Only validate referral ID if it's provided
      if (userData.referralId) {
        const existingReferalId = await User.findOne({
          userId: userData.referralId
        });
        if(!existingReferalId){
          throw new Error('Referral ID not found');
        }
      }
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      
      // Store user data in Redis with 10 minutes expiry
      const userDataForRedis = {
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        homeAddress: userData.homeAddress,
        workAddress: userData.workAddress,
        referralId: userData.referralId,
        otp
      };
      console.log(otp)

      await redisClient.set(
        `user:${userData.email}`,
        userDataForRedis,
        'EX',
        600 // 10 minutes expiry
      );
  
      // Send verification email
      await emailService.sendVerificationEmail(userData.email, otp);
      logger.info(`Verification email sent to ${userData.email}`);
  
      // Return response with user data (excluding sensitive info)
      return { 
        message: 'Verification email sent successfully', 
        user: {
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          homeAddress: userData.homeAddress,
          workAddress: userData.workAddress,
          referralId: userData.referralId
        }
      };
    } catch (error) {
      logger.error('Error during signup:', error);
      throw error;
    }
  }

  static async verifyEmail(email, otp) {
    try {
      // Get user data from Redis 
      const userData = await redisClient.get(`user:${email}`);
      
      if (!userData) {
        throw new Error('Verification expired or invalid');
      }
      
      if (userData.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      // Generate user ID
      const userId = `CC-${Date.now().toString(36).toUpperCase()}`;

      // Create user in database
      const user = new User({
        userId,
        name: userData.name,
        mobile: userData.mobile,
        email: userData.email,
        homeAddress: userData.homeAddress,
        workAddress: userData.workAddress,
        referralId: userData.referralId,
        status: 'under_verification',
        isVerified: true
      });

      await user.save();
      // If user signed up with a referral ID, update the referrer's stats
      if (userData.referralId) {
        const referrer = await User.findOne({ userId: userData.referralId });
        if (referrer) {
          referrer.referralCount += 1;
          referrer.referredUsers.push(user.userId);
          await referrer.save();
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.userId,
          email: user.email,
          role: user.isAdmin ? 'admin' : 'user',
          isAdmin: user.isAdmin || false
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Store token in Redis
      await redisClient.set(
        `token:${user.userId}`,
        token,
        'EX',
        86400 // 24 hours expiry
      );

      // Delete verification data from Redis
      await redisClient.del(`user:${email}`);

      logger.info(`User ${email} verified successfully`);
      
      // Return user data (excluding sensitive info) and token
      const userResponse = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        homeAddress: user.homeAddress,
        workAddress: user.workAddress,
        isVerified: user.isVerified,
        referralId: user.referralId,
        status: user.status,
        createdAt: user.createdAt,
      };

      return { 
        message: 'Email verified successfully', 
        user: userResponse,
        token
      };
    } catch (error) {
      logger.error('Error during email verification:', error);
      throw error;
    }
  }

  static async login(loginId) {
    try {
      // Find user by email, mobile, or userId - Using index for O(1) lookup
      const user = await User.findOne({
        $or: [
          { email: loginId },
          { mobile: loginId },
          { userId: loginId }
        ]
      }).select('email userId isVerified').lean(); // Optimize by selecting only needed fields

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isVerified) {
        throw new Error('Please verify your email first');
      }

      // Generate 6-digit OTP - O(1) operation
      const otp = crypto.randomInt(100000, 999999).toString();
      
      // Store OTP in Redis with 5 minutes expiry - O(1) operation
      await redisClient.set(
        `login:${user.email}`,
        otp,
        'EX',
        300 // 5 minutes expiry
      );

      // Send OTP via email
      await emailService.sendLoginOTP(user.email, otp);
      console.log(otp)

      logger.info(`Login OTP sent to ${user.email}`);
      return { 
        message: 'Login OTP sent successfully',
        email: user.email
      };
    } catch (error) {
      logger.error('Error during login:', error);
      throw new Error('Login failed: ' + error.message);
    }
  }

  static async verifyLoginOTP(loginId, otp) {
    try {
      // Get stored OTP from Redis - O(1) operation
      const storedOTP = await redisClient.get(`login:${loginId}`);
      
      if (!storedOTP) {
        throw new Error('OTP expired or invalid');
      }

      if (storedOTP.toString() !== otp.toString()) {
        throw new Error('Invalid OTP');
      }

      // Find user and get necessary data - Using index for O(1) lookup
      const user = await User.findOne({ 
        $or: [
          { email: loginId },
          { mobile: loginId },
          { userId: loginId }
        ]
      }).select('-password').lean();
      
      if (!user) {
        throw new Error('User not found');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.userId,
          email: user.email,
          role: user.isAdmin ? 'admin' : 'user',
          isAdmin: user.isAdmin || false
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Store token in Redis
      await redisClient.set(
        `token:${user.userId}`,
        token,
        'EX',
        86400 // 24 hours expiry
      );

      // Delete OTP from Redis
      await redisClient.del(`login:${loginId}`);

      logger.info(`User ${loginId} logged in successfully`);
      return { 
        message: 'Login successful', 
        user,
        token 
      };
    } catch (error) {
      logger.error('Error during OTP verification:', error);
      throw new Error('OTP verification failed: ' + error.message);
    }
  }

  // Add a method to verify JWT token
  // static async verifyToken(token) {
  //   try {
  //     if (!token) {
  //       throw new Error('No token provided');
  //     }

  //     // Verify token
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

  //     // Check if token is blacklisted in Redis
  //     const storedToken = await redisClient.get(`token:${decoded.userId}`);
  //     if (!storedToken || storedToken !== token) {
  //       throw new Error('Token is invalid or expired');
  //     }
  //     const user = await User.findOne({ userId: decoded.userId }).select('-password').lean();
  //     if (!user) {
  //       throw new Error('User not found');
  //     }
  //     return user;
  //   } catch (error) {
  //     logger.error('Token verification failed:', error);
  //     throw new Error('Token verification failed: ' + error.message);
  //   }
  // }
  static async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('No token provided');
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  
      // Check if token is blacklisted in Redis
      const storedToken = await redisClient.get(`token:${decoded.userId}`);
      if (!storedToken || storedToken !== token) {
        throw new Error('Token is invalid or expired');
      }
  
      // Fetch user and include the isAdmin field
      const user = await User.findOne({ userId: decoded.userId })
        .select('-password') // Exclude sensitive fields like password
        .lean();
  
      if (!user) {
        throw new Error('User not found');
      }
  
      return user; // Ensure the user object includes isAdmin
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw new Error('Token verification failed: ' + error.message);
    }
  }
  // Add a method to logout (blacklist token)
  static async logout(userId) {
    try {
      await redisClient.del(`token:${userId}`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout failed:', error);
      throw new Error('Logout failed: ' + error.message);
    }
  }
  static async updateProfile(userId, updateData) {
    try {
      const user = await User.findOne({ userId });
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update only the provided fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          user[key] = updateData[key];
        }
      });

      await user.save();

      // Return updated user data (excluding sensitive info)
      const updatedUser = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        homeAddress: user.homeAddress,
        workAddress: user.workAddress,
        isVerified: user.isVerified,
        status: user.status
      };

      return { 
        message: 'Profile updated successfully', 
        user: updatedUser 
      };
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findOne({ userId })
        .select('-password')
        .populate({
          path: 'profile',
          select: 'gender officeTimings sharing workingDays oneSideRoute isCompleted'
        })
        .lean();
      
      if (!user) {
        throw new Error('User not found');
      }

      // Return user data with profile information
      return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        homeAddress: user.homeAddress,
        workAddress: user.workAddress,
        isVerified: user.isVerified,
        status: user.status,
        referralId: user.referralId,
        referralCount: user.referralCount,
        referredUsers: user.referredUsers,
        profile: user.profile || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
        
      };
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  static async updateUserStatus(userId, status) {
    try {
      const user = await User.findOne({ userId });
      
      if (!user) {
        throw new Error('User not found');
      }

      // Validate status against enum values
      const validStatuses = ['under_verfication', 'routing', 'payment', 'AssigningDriver', 'completed'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }

      user.status = status;
      await user.save();

      return {
        message: 'User status updated successfully',
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          status: user.status
        }
      };
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      // Fetch all users excluding sensitive information and populate profile
      const users = await User.find({})
        .select('-password')
        .populate({
          path: 'profile',
          select: 'gender officeTimings sharing workingDays oneSideRoute isCompleted'
        })
        .lean();
      
      if (!users || users.length === 0) {
        return { message: 'No users found', users: [] };
      }

      // Map the users to include only necessary information
      const formattedUsers = users.map(user => ({
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        homeAddress: user.homeAddress,
        workAddress: user.workAddress,
        isVerified: user.isVerified,
        status: user.status,
        referralId: user.referralId,
        referralCount: user.referralCount,
        referredUsers: user.referredUsers,
        profile: user.profile || null, // Include profile information
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      return { 
        message: 'Users fetched successfully',
        count: users.length,
        users: formattedUsers 
      };
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw error;
    }
  }

  static async getUsersByStatus(status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') {
    try {
      // Prepare query
      const query = status ? { status } : {};
      
      // Parse pagination parameters
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
      const skip = (pageInt - 1) * limitInt;
      
      // Prepare sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Fetch users with pagination and sorting
      const users = await User.find(query)
        .select('-password')
        .populate({
          path: 'profile',
          select: 'gender officeTimings sharing workingDays oneSideRoute isCompleted'
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limitInt)
        .lean();
      
      // Count total matching documents for pagination
      const total = await User.countDocuments(query);
      
      if (!users || users.length === 0) {
        return { 
          message: 'No users found',
          users: [],
          pagination: {
            total,
            page: pageInt,
            limit: limitInt,
            pages: Math.ceil(total / limitInt)
          }
        };
      }

      // Map the users to include only necessary information
      const formattedUsers = users.map(user => ({
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        homeAddress: user.homeAddress,
        workAddress: user.workAddress,
        isVerified: user.isVerified,
        status: user.status,
        referralId: user.referralId,
        referralCount: user.referralCount,
        referredUsers: user.referredUsers,
        profile: user.profile || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      return { 
        message: 'Users fetched successfully',
        users: formattedUsers,
        pagination: {
          total,
          page: pageInt,
          limit: limitInt,
          pages: Math.ceil(total / limitInt)
        }
      };
    } catch (error) {
      logger.error('Error fetching users by status:', error);
      throw error;
    }
  }
}

module.exports = UserService; 