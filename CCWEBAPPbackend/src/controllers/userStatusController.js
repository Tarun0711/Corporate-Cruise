const User = require('../models/user');
const logger = require('../utils/logger');

class UserStatusController {
  static async updateUserStatus(userId, status) {
    try {
      console.log(`Updating status for user ${userId} to ${status}`);
  
      // Validate status
      const validStatuses = ['under_verification', 'routing', 'payment', 'AssigningDriver', 'completed'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be one of: under_verification, routing, payment, AssigningDriver, completed');
      }
  
      // Verify user exists
      const user = await User.findOne({ userId });
      if (!user) {
        throw new Error('User not found');
      }
  
      // Update user status
      user.status = status;
      await user.save();
  
      logger.info(`User ${userId} status updated to ${status}`);
  
      return {
        success: true,
        message: 'User status updated successfully',
        data: {
          userId: user.userId,
          status: user.status,
        },
      };
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw new Error(error.message);
    }
  }

  static async getUserStatus(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findOne({ userId }).select('userId status');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          userId: user.userId,
          status: user.status
        }
      });

    } catch (error) {
      logger.error('Error fetching user status:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // static async getUsersByStatus(req, res) {
  //   try {
  //     const { page = 1, limit = 10, sortBy = 'userId', sortOrder = 'asc', status } = req.query;
  //     const skip = (page - 1) * limit;
  
  //     // Validate status if provided
  //     if (status) {
  //       const validStatuses = ['under_verification', 'routing', 'payment', 'AssigningDriver', 'completed'];
  //       if (!validStatuses.includes(status)) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'Invalid status. Must be one of: under_verification, routing, payment, AssigningDriver, completed'
  //         });
  //       }
  //     }
  
  //     // Build query
  //     const query = status ? { status } : {};
      
  //     // Build sort object
  //     const sort = {};
  //     sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  //     // Execute query with pagination and sorting
  //     const users = await User.find(query)
  //       .select('userId status name email createdAt updatedAt')
  //       .sort(sort)
  //       .skip(skip)
  //       .limit(parseInt(limit));
  
  //     // Get total count for pagination
  //     const total = await User.countDocuments(query);
  
  //     return res.status(200).json({
  //       success: true,
  //       data: {
  //         users,
  //         pagination: {
  //           total,
  //           page: parseInt(page),
  //           limit: parseInt(limit),
  //           pages: Math.ceil(total / limit)
  //         }
  //       }
  //     });
  
  //   } catch (error) {
  //     logger.error('Error fetching users by status:', error);
  //     return res.status(500).json({
  //       success: false,
  //       message: 'Internal server error',
  //       error: error.message
  //     });
  //   }
  // }
  static async getUsersByStatus(req, res) {
    try {
      const { status, search } = req.query;

      // Build query
      let query = {};
      if (status) {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ];
      }

      // Get all users without pagination
      const users = await User.find(query)
        .populate('profile')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: {
          users
        }
      });

    } catch (error) {
      logger.error('Error fetching users by status:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getRoutingUsers(req, res) {
    try {
      // Get all users with routing status
      const users = await User.find({ status: 'routing' })
        .populate('profile')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: {
          users
        }
      });

    } catch (error) {
      logger.error('Error fetching routing users:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = UserStatusController;