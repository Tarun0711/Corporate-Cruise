import React from 'react';
import { motion } from 'framer-motion';
import DashboardCards from './DashboardCards';
import { FiMapPin, FiClock, FiPackage, FiCreditCard, FiUsers, FiGift } from 'react-icons/fi';

const DashboardOverview = ({ userData, referralCount }) => {
  const getFreeKilometers = (count) => {
    if (count >= 3) return 250;
    if (count === 2) return 150;
    if (count === 1) return 75;
    return 0;
  };

  // Add default values for package and payment if they don't exist
  const packageStatus = userData?.package?.status || 'Not Available';
  const paymentDueDate = userData?.payment?.nextDue || 'Not Available';

  // Get next ride information if available
  const nextRide = userData?.rides?.find(ride => new Date(ride.date) > new Date());
  const hasNextRide = Boolean(nextRide);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Dashboard Grid - Updated with new card styles */}
      <motion.div variants={itemVariants}>
        <DashboardCards userData={userData} />
      </motion.div>

      {/* Additional Information Section */}
      <motion.div 
        className="mt-8"
        variants={itemVariants}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button 
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 flex items-center text-left"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiMapPin className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Update Route</h3>
              <p className="text-xs text-gray-500">Modify pickup/dropoff</p>
            </div>
          </motion.button>
          
          <motion.button 
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 flex items-center text-left"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiClock className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Manage Schedule</h3>
              <p className="text-xs text-gray-500">Adjust ride timings</p>
            </div>
          </motion.button>
          
          <motion.button 
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 flex items-center text-left"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FiGift className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Refer & Earn</h3>
              <p className="text-xs text-gray-500">Share your referral code</p>
            </div>
          </motion.button>
          
          <motion.button 
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 flex items-center text-left"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FiCreditCard className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">View Payments</h3>
              <p className="text-xs text-gray-500">Check transaction history</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
