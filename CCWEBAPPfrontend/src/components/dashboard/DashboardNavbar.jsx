import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiClock, FiCreditCard, FiUsers, FiBell, FiHelpCircle, FiSettings, FiLogOut, FiStar } from 'react-icons/fi';
import logo from '../../assets/logo/c.svg';

const DashboardNavbar = ({ activeTab, setActiveTab, handleProfileClick, user, handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Track window size to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { id: 'rides', label: 'My Rides', icon: <FiClock className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <FiCreditCard className="w-5 h-5" /> },
    { id: 'referrals', label: 'Referrals', icon: <FiUsers className="w-5 h-5" /> },
  ];
  
  const supportItems = [
    { id: 'help', label: 'Help & Support', icon: <FiHelpCircle className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleProfileIconClick = () => {
    if (isDesktop) {
      handleProfileClick();
    } else {
      toggleSidebar();
    }
  };
  
  // Framer Motion variants
  const sidebarVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <>
      <nav className="bg-white backdrop-blur-md shadow-sm border-b border-gray-100 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center gap-x-2">
              <img src={logo} alt="Corporate Cruise" className="h-16 md:h-18 w-auto" />
            </div>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Notification */}
            <button className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:bg-gray-100 relative">
              <FiBell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Profile */}
            <button 
              onClick={handleProfileIconClick}
              className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">Passenger</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Only - Right Side Drawer with Animation */}
      <AnimatePresence>
        {!isDesktop && isSidebarOpen && (
          <>
            {/* Backdrop overlay with fade animation */}
            <motion.div 
              className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            
            {/* Sidebar panel with slide animation */}
            <motion.div 
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col z-50"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* User profile section */}
              <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center relative bg-gradient-to-br from-blue-50 to-indigo-50">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white p-2 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                  onClick={toggleSidebar}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <motion.div variants={itemVariants} className="mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-medium shadow-lg">
                    {user?.name?.charAt(0) || "R"}
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="text-center">
                  <h3 className="text-xl font-semibold">{user?.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{user?.email}</p>
                  <button 
                    onClick={() => {
                      handleProfileClick();
                      toggleSidebar();
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    View Profile
                  </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-4 w-full">
                  {(!user?.profileComplete) && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex items-start space-x-2 shadow-sm">
                      <FiStar className="text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm text-yellow-800">Complete your profile to expedite routing</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* Navigation items */}
              <div className="px-4 py-4 flex-1 overflow-y-auto">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <motion.button 
                      key={item.id}
                      variants={itemVariants}
                      onClick={() => {
                        setActiveTab(item.id);
                        toggleSidebar();
                      }}
                      className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === item.id 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-4 border-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={`mr-3 ${activeTab === item.id ? 'text-indigo-600' : ''}`}>{item.icon}</span>
                      {item.label}
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-8 border-t border-gray-100 pt-4">
                  {supportItems.map((item) => (
                    <motion.button 
                      key={item.id}
                      variants={itemVariants}
                      className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Logout button */}
              <motion.div variants={itemVariants} className="mt-auto border-t border-gray-100">
                <motion.button 
                  className="flex items-center w-full px-4 py-4 text-red-600 font-medium text-sm hover:bg-red-50 transition-all duration-200"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                >
                  <FiLogOut className="w-5 h-5 mr-3" /> Log Out
                </motion.button>
                <div className="p-4 text-center text-xs text-gray-500">
                  Corporate Cruise App v1.0.0
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardNavbar;
