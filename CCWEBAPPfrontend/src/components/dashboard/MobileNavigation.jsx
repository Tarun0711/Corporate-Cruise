import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMapPin, FiClock, FiCalendar, FiCreditCard, FiShare2, FiHome, FiLogOut, FiSettings, FiStar, FiHelpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MobileNavigation = ({ isOpen, onClose, userData, onProfileClick, setActiveTab }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <FiHome className="text-primary" size={20} /> },
    { id: 'rides', label: 'My Rides', icon: <FiClock className="text-blue-600" size={20} /> },
    { id: 'payments', label: 'Payments', icon: <FiCreditCard className="text-green-600" size={20} /> },
    { id: 'referrals', label: 'Referrals', icon: <FiShare2 className="text-purple-600" size={20} /> },
  ];

  // Check if user has a complete profile
  const hasCompleteProfile = 
    userData?.homeAddress && 
    userData?.workAddress && 
    userData?.weekSchedule?.length > 0;

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const linkVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white z-50 shadow-xl flex flex-col"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* User profile section */}
            <motion.div 
              variants={linkVariants}
              className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-light to-white"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mr-4">
                  {userData?.name ? userData.name.charAt(0) : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{userData?.name || "User"}</h3>
                  <p className="text-sm text-gray-600">{userData?.email || "user@example.com"}</p>
                  <div className="mt-2">
                    <button
                      onClick={onProfileClick}
                      className="text-xs px-3 py-1 rounded-full bg-primary text-white"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Profile completion status */}
              {!hasCompleteProfile && (
                <motion.div 
                  className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-xs text-yellow-700 flex items-center">
                    <FiStar className="mr-1 text-yellow-500" />
                    Complete your profile to expedite routing
                  </p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Navigation menu */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    variants={linkVariants}
                    className="w-full p-3 rounded-lg flex items-center hover:bg-gray-100 transition-colors"
                    onClick={() => handleTabClick(item.id)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="text-gray-800">{item.label}</span>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <motion.button
                  variants={linkVariants}
                  className="w-full p-3 rounded-lg flex items-center hover:bg-gray-100 transition-colors"
                  onClick={() => navigate('/help')}
                >
                  <FiHelpCircle className="mr-3 text-gray-600" size={20} />
                  <span className="text-gray-800">Help & Support</span>
                </motion.button>
                
                <motion.button
                  variants={linkVariants}
                  className="w-full p-3 rounded-lg flex items-center hover:bg-gray-100 transition-colors"
                  onClick={() => navigate('/settings')}
                >
                  <FiSettings className="mr-3 text-gray-600" size={20} />
                  <span className="text-gray-800">Settings</span>
                </motion.button>
                
                <motion.button
                  variants={linkVariants}
                  className="w-full p-3 rounded-lg flex items-center text-red-600 hover:bg-red-50 transition-colors mt-4"
                  onClick={() => {
                    onClose();
                    // Logout functionality would be called here
                  }}
                >
                  <FiLogOut className="mr-3" size={20} />
                  <span>Log Out</span>
                </motion.button>
              </div>
            </div>
            
            {/* App version */}
            <motion.div
              variants={linkVariants}
              className="p-4 text-center border-t border-gray-100"
            >
              <p className="text-xs text-gray-500">Corporate Cruise App v1.0.0</p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;