const express = require("express");
const router = express.Router();
const UserService = require("../services/userService");
const {  isAdmin } = require("../middleware/auth");
const UserStatusController = require("../controllers/userStatusController");
const User = require("../models/user");

// JWT Authentication Middleware
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

    const decoded = await UserService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, mobile, email, homeAddress, workAddress, referralId } =
      req.body;

    // Validate required fields
    if (!name || !mobile || !email || !homeAddress || !workAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await UserService.signup({
      name,
      mobile,
      email,
      homeAddress,
      workAddress,
      referralId,
    });

    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes("already exists")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Verify email route
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const result = await UserService.verifyEmail(email, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resend verification email route
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await UserService.resendVerificationEmail(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { loginId } = req.body;

    // Validate required fields
    if (!loginId) {
      return res.status(400).json({ error: "Login ID is required" });
    }

    const result = await UserService.login(loginId);
    res.status(200).json(result);
  } catch (error) {
    // Handle specific error cases
    if (error.message.includes("User not found")) {
      return res.status(404).json({ error: error.message });
    }
    if (
      error.message.includes("Invalid password") ||
      error.message.includes("Please verify")
    ) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-signin", async (req, res) => {
  try {
    const { loginId, otp } = req.body;

    if (!loginId || !otp) {
      return res.status(400).json({ error: "Login ID and OTP are required" });
    }

    const result = await UserService.verifyLoginOTP(loginId, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

// Logout route
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const result = await UserService.logout(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected route example
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      homeAddress: user.homeAddress,
      workAddress: user.workAddress,
      isVerified: user.isVerified,
    };

    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile route
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, mobile, homeAddress, workAddress } = req.body;
    const userId = req.user.userId;

    const result = await UserService.updateProfile(userId, {
      name,
      mobile,
      homeAddress,
      workAddress,
    });

    // Get the complete updated user data
    const updatedUser = await UserService.getUserById(userId);
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 

// Update user status (admin only)
router.put("/:userId/:status", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("Request params:", req.params); // Debugging log
    if (!req.params || !req.params.userId) {
      return res.status(400).json({ error: "User ID is missing in request parameters" });
    }
    const { userId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const result = await UserStatusController.updateUserStatus(userId, status);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes("User not found")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get("/all", authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await UserService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get users by status (admin only)

router.get('/getUserByStatus', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const result = await UserService.getUsersByStatus(status, page, limit, sortBy, sortOrder);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

 
// Get single user with profile (admin only)
router.get("/:userId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await UserService.getUserById(userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes("User not found")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Development-only route to set user as admin
if (process.env.NODE_ENV !== 'production') {
  router.post("/dev/make-admin/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find user
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Update user to be admin
      user.isAdmin = true;
      await user.save();
      
      return res.status(200).json({ 
        message: "User set as admin successfully", 
        userId: user.userId,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Error setting user as admin:", error);
      return res.status(500).json({ error: error.message });
    }
  });
}

module.exports = router;

