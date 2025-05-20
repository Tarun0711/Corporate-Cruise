import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiPackage, FiCreditCard } from 'react-icons/fi';

const DashboardHeader = ({ userData, onProfileClick }) => {
  // Get user's first name for more personal greeting
  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Passenger';
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
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
      className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* User profile and greeting */}
          {/* <motion.div 
            className="flex items-center mb-6 md:mb-0"
            variants={itemVariants}
          >
            <div 
              className="relative group cursor-pointer"
              onClick={onProfileClick}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg overflow-hidden transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                <span className="text-white text-2xl font-bold">
                  {userData?.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}
                </span>
              </div>
              <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            
            <div className="ml-5">
              <motion.h1 
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
                variants={itemVariants}
              >
                {firstName}'s Dashboard
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                variants={itemVariants}
              >
                {userData?.package?.status === 'Active' 
                  ? 'Your carpooling service is active'
                  : 'Complete your profile to get started'}
              </motion.p>
            </div>
          </motion.div> */}
          
          {/* Stats cards */}
          {/* <div className="md:ml-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"> */}
            <motion.div 
              className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <FiClock className="text-primary text-xl mb-2" />
              <p className="text-xs text-gray-500 mb-1">Next Ride</p>
              <p className="text-sm font-semibold text-primary text-center">
                {userData?.package?.status === 'Active' ? 'Tomorrow, 9:00 AM' : 'Not Scheduled'}
              </p>
            </motion.div>
            <motion.div 
              className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <FiClock className="text-primary text-xl mb-2" />
              <p className="text-xs text-gray-500 mb-1">Next Ride</p>
              <p className="text-sm font-semibold text-primary text-center">
                {userData?.package?.status === 'Active' ? 'Tomorrow, 9:00 AM' : 'Not Scheduled'}
              </p>
            </motion.div>
            <motion.div 
              className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <FiClock className="text-primary text-xl mb-2" />
              <p className="text-xs text-gray-500 mb-1">Next Ride</p>
              <p className="text-sm font-semibold text-primary text-center">
                {userData?.package?.status === 'Active' ? 'Tomorrow, 9:00 AM' : 'Not Scheduled'}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-green-50 rounded-xl p-4 flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <FiPackage className="text-green-600 text-xl mb-2" />
              <p className="text-xs text-gray-500 mb-1">Package</p>
              <p className="text-sm font-semibold text-green-600 text-center">
                {userData?.package?.name || 'Not Selected'}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <FiCreditCard className="text-yellow-600 text-xl mb-2" />
              <p className="text-xs text-gray-500 mb-1">Payment</p>
              <p className={`text-sm font-semibold text-center ${
                userData?.payment?.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {userData?.payment?.status || 'Pending'}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-purple-50 rounded-xl p-4 flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <FiMapPin className="text-purple-600 text-xl mb-2" />
              <p className="text-xs text-gray-500 mb-1">Distance</p>
              <p className="text-sm font-semibold text-purple-600 text-center">
                {userData?.distance || '0'} KM
              </p>
            </motion.div>
          </div>
        </div>
      {/* </div> */}
    </motion.div>
  );
};

export default DashboardHeader;
