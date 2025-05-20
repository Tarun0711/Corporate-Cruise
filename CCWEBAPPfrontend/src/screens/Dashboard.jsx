import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../components/Footer';
import { FiShare2, FiClock, FiCalendar, FiMapPin, FiUser, FiHome, FiBriefcase, FiTrendingUp, FiStar, FiList, FiCheckCircle, FiHelpCircle } from "react-icons/fi";
import  { motion, AnimatePresence } from 'framer-motion';
import {
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  InstapaperShareButton,
  InstapaperIcon,
} from "react-share";

import { checkProfileCompletion, logoutUser } from '../services/operations/UserServices';
import { setProfileComplete, logout } from '../store/userReducer';
import { LogOut, Bell, Settings, HelpCircle, Minus, Award, BarChart2, Clock, Triangle } from 'lucide-react';

// Import dashboard components
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardTabs from '../components/dashboard/DashboardTabs';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import DashboardRides from '../components/dashboard/DashboardRides';
import DashboardPayments from '../components/dashboard/DashboardPayments';
import DashboardReferrals from '../components/dashboard/DashboardReferrals';
import ProfileManagement from '../components/dashboard/ProfileManagement';
import RoutingStatus from '../components/dashboard/RoutingStatus';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MobileNavigation from '../components/dashboard/MobileNavigation';
import LogoutButton from '../components/dashboard/LogoutButton';
import ProfileCompletionBanner from '../components/dashboard/ProfileCompletionBanner';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);
  const isProfileComplete = useSelector(state => state.auth.isProfileComplete);
  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('Welcome back');
  const [showFAQ, setShowFAQ] = useState(false);
  
  // This state would normally come from a backend API
  // We'll use this while building, and would be replaced with real data fetching
  const routingStatus = user?.status || 'routing'; // under_verfication, routing, AssigningDriver, payment, completed
  
  const shareUrl = `${window.location.origin}/signup?ref=${user?.userId}`;

  // Set current date and greeting
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // Format current date: Monday, 19 August, 2024
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  }, []);
  
  // Check profile completion on component mount
  useEffect(() => {
    const checkProfile = async () => {
      try {
        setIsLoading(true);
        const completed = await checkProfileCompletion(token);
        dispatch(setProfileComplete(completed));
      } catch (error) {
        console.error('Error checking profile completion:', error);
        dispatch(setProfileComplete(false));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
      checkProfile();
    }
  }, [dispatch, token]);

  const handleCompleteProfile = () => {
    navigate('/onboarding');
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(token);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, we'll still clear the local state
      dispatch(logout());
      navigate("/");
    }
  };

  // Animation variants for staggered animations
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

  // Frequently Asked Questions data
  const faqData = [
    {
      question: "How long does the routing process take?",
      answer: "The routing process typically takes 2-3 business days. Our team carefully plans the optimal route based on all passengers' locations and preferences."
    },
    {
      question: "Can I change my home or office address?",
      answer: "Yes, you can update your addresses in your profile settings. Please note that this might require a re-routing process which can take 2-3 additional business days."
    },
    {
      question: "How does the referral program work?",
      answer: "For every friend you refer who signs up and completes their first ride, you earn free kilometers. The first referral earns you 75km, the second another 75km, and the third 100km plus priority support - for a total of 250km in free rides!"
    },
    {
      question: "When will I be assigned a driver?",
      answer: "Driver assignment happens after your route has been finalized and payment has been received. This usually happens within 1-2 days after payment."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, and net banking transfers."
    }
  ];

  // Referral data showing triangular distribution
  const referralCount = user?.referralCount || 0;
  
  const getFreeKilometers = (count) => {
    if (count >= 3) return 250;
    if (count === 2) return 150;
    if (count === 1) return 75;
    return 0;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom background pattern */}
      <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none z-0"></div>
      
      {/* Navbar with glassmorphism */}
      <div className="sticky top-0 z-50">
        <DashboardNavbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleProfileClick={handleProfileClick} 
          user={user} 
          handleLogout={handleLogout}
        />
      </div>

      <AnimatePresence>
        <motion.div 
          className="p-4 md:p-6 max-w-7xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
            {/* Welcome Header Section - Spans Full Width */}
            <motion.div 
              className="col-span-12 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{currentDate}</p>
                  <h1 className="text-2xl md:text-3xl font-bold mt-1">
                    {greeting}, {user?.name || 'Passenger'}
                  </h1>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2 md:gap-3">
                  <button 
                    className="btn-outline-primary px-4 py-2 text-sm rounded-lg flex items-center"
                    onClick={() => setShowFAQ(!showFAQ)}
                  >
                    <FiHelpCircle className="h-4 w-4 mr-2" /> FAQs
                  </button>
                  <button className="btn-primary px-4 py-2 text-sm rounded-lg flex items-center">
                    <FiShare2 className="h-4 w-4 mr-2" /> Refer a Friend
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Profile Completion Banner */}
            {!isLoading && !isProfileComplete && (
              <motion.div
                className="col-span-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ProfileCompletionBanner 
                  handleCompleteProfile={handleCompleteProfile} 
                  dispatch={dispatch} 
                  setProfileComplete={setProfileComplete} 
                />
              </motion.div>
            )}

            {/* Routing Status - Displays the current stage in the user's journey */}
            {isProfileComplete && routingStatus !== 'completed' && (
              <motion.div
                className="col-span-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RoutingStatus 
                  status={routingStatus}
                  estimatedDays="2-3 Business Days"
                />
              </motion.div>
            )}

            {/* Regular Stats Cards - 2 side by side */}
            <motion.div 
              className="col-span-12 md:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FiCheckCircle className="text-green-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold">Regular Ride</h3>
              </div>
              
              <div className="mb-2 flex justify-between items-end">
                <span className="text-sm text-gray-500">15/25</span>
                <span className="text-sm text-gray-500">75% Done!</span>
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </motion.div>

            <motion.div 
              className="col-span-12 md:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiStar className="text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold">Upcoming Trips</h3>
              </div>
              
              <div className="mb-2 flex justify-between items-end">
                <span className="text-sm text-gray-500">12/20</span>
                <span className="text-sm text-gray-500">60% Ready!</span>
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </motion.div>

            {/* Timeline Section - Single Column on Mobile, Left Column on Desktop */}
            <motion.div 
              className="col-span-12 md:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Timeline & Schedule</h3>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 text-xs border rounded-lg bg-gray-50 hover:bg-gray-100">Day View</button>
                  <button className="px-3 py-1 text-xs border rounded-lg bg-primary text-white">Week</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-full flex border-b pb-2 mb-3">
                  <div className="flex-1 text-center text-sm text-gray-500">08:00</div>
                  <div className="flex-1 text-center text-sm text-gray-500">09:30</div>
                  <div className="flex-1 text-center text-sm text-gray-500">10:00</div>
                  <div className="flex-1 text-center text-sm text-gray-500">15:30</div>
                  <div className="flex-1 text-center text-sm text-gray-500">17:00</div>
                  <div className="flex-1 text-center text-sm text-gray-500">19:30</div>
                </div>
                
                <div className="relative pb-10">
                  {/* Timeline line */}
                  <div className="absolute top-0 bottom-0 left-1/2 -ml-px w-0.5 bg-gray-200"></div>
                  
                  {/* Events on timeline */}
                  <div className="relative flex items-center mb-8 left-[25%]">
                    <div className="absolute -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                    <div className="ml-6 bg-blue-50 rounded-lg p-3 shadow-sm">
                      <p className="text-xs font-medium text-blue-800">09:00 - Morning Pickup</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center mb-8 left-[41.67%]">
                    <div className="absolute -left-2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
                    <div className="ml-6 bg-gray-50 rounded-lg p-3 shadow-sm">
                      <p className="text-xs font-medium text-gray-600">10:00 - Arrive at Office</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center left-[83.33%]">
                    <div className="absolute -left-2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
                    <div className="ml-6 bg-gray-50 rounded-lg p-3 shadow-sm">
                      <p className="text-xs font-medium text-gray-600">19:00 - Evening Pickup</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Referral Triangle Section - Right Column on Desktop */}
            <motion.div 
              className="col-span-12 md:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Referral Triangle</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${referralCount >= 3 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-600'}`}>
                  {getFreeKilometers(referralCount)} KM Free
                </span>
              </div>
              
              <div className="relative py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Triangle visualization showing referral tiers */}
                    <svg width="200" height="160" viewBox="0 0 200 160" className="mx-auto">
                      {/* Bottom tier - First 75 KM */}
                      <polygon 
                        points="30,140 170,140 100,40" 
                        fill={referralCount >= 1 ? "#4ade80" : "#e2e8f0"} 
                        stroke="#94a3b8" 
                        strokeWidth="1"
                      />
                      
                      {/* Middle tier - Second 75 KM */}
                      <polygon 
                        points="55,115 145,115 100,40" 
                        fill={referralCount >= 2 ? "#60a5fa" : "#e2e8f0"} 
                        stroke="#94a3b8" 
                        strokeWidth="1" 
                      />
                      
                      {/* Top tier - Final 100 KM */}
                      <polygon 
                        points="80,90 120,90 100,40" 
                        fill={referralCount >= 3 ? "#8b5cf6" : "#e2e8f0"} 
                        stroke="#94a3b8" 
                        strokeWidth="1" 
                      />
                      
                      {/* Tier labels */}
                      <text x="100" y="125" textAnchor="middle" fill="#4b5563" fontSize="11">75 KM</text>
                      <text x="100" y="100" textAnchor="middle" fill="#4b5563" fontSize="11">75 KM</text>
                      <text x="100" y="75" textAnchor="middle" fill="#4b5563" fontSize="11">100 KM</text>
                      
                      {/* Top indicator */}
                      <circle cx="100" cy="40" r="5" fill={referralCount >= 3 ? "#8b5cf6" : "#e2e8f0"} />
                    </svg>
                    
                    {/* Referral counts */}
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                      <p className="text-sm font-semibold">Referrals: {referralCount}/3</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
                    onClick={() => setActiveTab('referrals')}
                  >
                    Share Your Referral Link
                  </button>
                </div>
              </div>
            </motion.div>

            {/* FAQ Section - Collapsible */}
            {showFAQ && (
              <motion.div 
                className="col-span-12 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FiHelpCircle className="mr-2 text-primary" /> 
                    Frequently Asked Questions
                  </h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowFAQ(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Performance Graph Section */}
            <motion.div 
              className="col-span-12 md:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Performance</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-2">Weekly</span>
                    <select className="text-xs border rounded px-1">
                      <option>This Week</option>
                      <option>Last Week</option>
                      <option>Last Month</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
                  <div className="text-2xl font-bold">16 hr 30 min</div>
                  <div className="text-sm text-gray-500">Total time worked</div>
                </div>
              </div>
              
              {/* Performance Chart */}
              <div className="mt-4 h-28 md:h-40">
                <div className="relative h-full">
                  {/* Chart background grid */}
                  <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200"></div>
                  <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200"></div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 -translate-y-1/2 text-xs text-gray-500">100%</div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-gray-500">50%</div>
                  <div className="absolute left-0 bottom-0 -translate-y-1/2 text-xs text-gray-500">0.0%</div>
                  
                  {/* Chart line (SVG would be better in a real implementation) */}
                  <div className="absolute inset-x-5 inset-y-0 flex items-end">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d="M0,70 C10,60 15,40 25,45 C35,50 40,20 50,15 C60,10 65,30 75,40 C85,50 90,35 100,30"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                      />
                      <circle cx="90" cy="35" r="4" fill="#8b5cf6" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-right mt-2">20 Aug, 2024</div>
            </motion.div>

            {/* Recommended Task Section */}
            <motion.div 
              className="col-span-12 md:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recommended Task</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500 mb-1">Projects</div>
                  <div className="text-sm text-gray-500 flex justify-between">
                    <span>Assignee</span>
                    <span>Status</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-sm font-medium">Complete Profile Details</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">In Progress</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-sm font-medium">Verify Office Location</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Review</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-sm font-medium">Set Travel Schedule</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Pending</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Tab Content Area */}
          {(activeTab !== 'overview') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-6 bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              {activeTab === 'rides' && (
                <DashboardRides />
              )}

              {activeTab === 'payments' && (
                <DashboardPayments />
              )}

              {activeTab === 'referrals' && (
                <DashboardReferrals shareUrl={shareUrl} referralCount={referralCount} />
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <Footer />
      
      {/* Profile Management Modal (Desktop) */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <ProfileManagement 
            userData={user} 
            onClose={() => setIsProfileModalOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Logout Button */}
      <LogoutButton handleLogout={handleLogout} />
      
      {/* CSS for hiding scrollbar but allowing scroll */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;  /* Chrome, Safari, Opera */
          }
          
          .bg-dot-pattern {
            background-image: radial-gradient(circle, #e0e7ff 1px, transparent 1px);
            background-size: 20px 20px;
          }
          
          .btn-primary {
            background-color: var(--color-primary);
            color: white;
            border-radius: 0.5rem;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .btn-primary:hover {
            background-color: var(--color-primary-dark);
          }
          
          .btn-outline-primary {
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
            background-color: transparent;
            border-radius: 0.5rem;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .btn-outline-primary:hover {
            background-color: var(--color-primary-light);
          }
          
          :root {
            --color-primary: #6366f1;
            --color-primary-light: #e0e7ff;
            --color-primary-dark: #4f46e5;
            --color-secondary: #7c3aed;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
