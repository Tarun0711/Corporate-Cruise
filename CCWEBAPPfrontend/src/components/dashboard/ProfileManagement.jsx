import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/userReducer';
import { FiUser, FiMapPin, FiCalendar, FiClock, FiHome, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiUsers } from 'react-icons/fi';

const libraries = ['places'];

const ProfileManagement = ({ userData, onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('viewProfile');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(userData || {});
  const [pickupSearchBox, setPickupSearchBox] = useState(null);
  const [dropSearchBox, setDropSearchBox] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    gender: userData?.gender || '',
    mobile: userData?.mobile || '',
    homeAddress: {
      address: userData?.homeAddress?.address || '',
      latitude: userData?.homeAddress?.latitude || null,
      longitude: userData?.homeAddress?.longitude || null
    },
    workAddress: {
      address: userData?.workAddress?.address || '',
      latitude: userData?.workAddress?.latitude || null,
      longitude: userData?.workAddress?.longitude || null
    },
    timing: userData?.timing || '',
    officeStartTime: userData?.officeStartTime || '09:00',
    officeEndTime: userData?.officeEndTime || '18:00',
    preference: userData?.preference || 'Any',
    weekSchedule: userData?.weekSchedule || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });
  
  // Days of the week for selection
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Preference options
  const preferenceOptions = ['Any', 'Same Gender', 'Women Only', 'Men Only', 'Colleagues Only'];
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data) {
          setUserProfile(response.data.user);
          
          // Update form data with fetched values
          setFormData(prev => ({
            ...prev,
            name: response.data.user?.name || prev.name,
            gender: response.data.user?.gender || prev.gender,
            mobile: response.data.user?.mobile || prev.mobile,
            homeAddress: response.data.user?.homeAddress || prev.homeAddress,
            workAddress: response.data.user?.workAddress || prev.workAddress,
            timing: response.data.user?.timing || prev.timing,
            officeStartTime: response.data.user?.officeStartTime || prev.officeStartTime,
            officeEndTime: response.data.user?.officeEndTime || prev.officeEndTime,
            preference: response.data.user?.preference || prev.preference,
            weekSchedule: response.data.user?.weekSchedule || prev.weekSchedule
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [token]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const handlePlaceChanged = (searchBox, field) => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const location = place.geometry.location;

    setFormData(prev => ({
      ...prev,
      [field]: {
        address: place.formatted_address,
        latitude: location.lat(),
        longitude: location.lng()
      }
    }));
  };

  const onLoadPickup = ref => setPickupSearchBox(ref);
  const onLoadDrop = ref => setDropSearchBox(ref);

  const handleWeekdayToggle = (day) => {
    setFormData(prev => {
      const newSchedule = prev.weekSchedule.includes(day)
        ? prev.weekSchedule.filter(d => d !== day)
        : [...prev.weekSchedule, day];
      
      return {
        ...prev,
        weekSchedule: newSchedule
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update Redux store with new user data
        dispatch(setUser(response.data.user));
        setUserProfile(response.data.user);
        toast.success('Profile updated successfully');
        setActiveSection('viewProfile');
        // Update the parent component with new user data
        if (typeof onClose === 'function') {
          onClose(response.data.user);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'homeAddress' || name === 'workAddress') {
      setFormData(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          address: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative flex justify-between items-center">
            <motion.div 
              className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
            </motion.div>
            
            <div className="ml-28">
              <motion.h3 
                className="text-xl font-bold text-white"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Profile Management
              </motion.h3>
              <motion.p 
                className="text-indigo-200 text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                View and update your details
              </motion.p>
            </div>
            
            <motion.button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <FiX />
            </motion.button>
          </div>
          
          <div className="pt-14 pb-5 px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-gray-900">{userProfile?.name}</h3>
              <p className="text-gray-600 text-sm">{userProfile?.email}</p>
              <div className="mt-2 flex space-x-2 flex-wrap gap-y-2">
                {userProfile?.gender && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {userProfile.gender}
                  </span>
                )}
                {userProfile?.package?.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {userProfile.package.status}
                  </span>
                )}
                {userProfile?.preference && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {userProfile.preference} Preference
                  </span>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Profile Navigation */}
          <div className="flex pb-1 px-6 border-b">
            <motion.button
              onClick={() => setActiveSection('viewProfile')}
              className={`flex-1 py-2 font-medium text-sm transition-colors ${
                activeSection === 'viewProfile' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Profile Details
            </motion.button>
            <motion.button
              onClick={() => setActiveSection('editProfile')}
              className={`flex-1 py-2 font-medium text-sm transition-colors ${
                activeSection === 'editProfile' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Edit Profile
            </motion.button>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(90vh-240px)] p-6">
            {/* View Profile Section */}
            {activeSection === 'viewProfile' && (
              <motion.div 
                className="space-y-5"
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                <motion.div variants={itemVariants} className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-5 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <FiUser />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">Personal Information</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium text-gray-800">{userProfile?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Gender</p>
                      <p className="font-medium text-gray-800">{userProfile?.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-medium text-gray-800">{userProfile?.email || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="font-medium text-gray-800">{userProfile?.mobile || 'Not set'}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <FiMapPin />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">Address Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Home Address</p>
                      <p className="font-medium text-gray-800">{userProfile?.homeAddress?.address || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Office Address</p>
                      <p className="font-medium text-gray-800">{userProfile?.workAddress?.address || 'Not specified'}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="rounded-xl bg-gradient-to-br from-green-50 to-teal-50 p-5 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <FiClock />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">Office Timing</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Start Time</p>
                      <p className="font-medium text-gray-800">{userProfile?.officeStartTime || '09:00'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">End Time</p>
                      <p className="font-medium text-gray-800">{userProfile?.officeEndTime || '18:00'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Commute Timing</p>
                      <p className="font-medium text-gray-800">{userProfile?.timing || 'Not specified'}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 p-5 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                      <FiCalendar />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">Work Schedule</h4>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Working Days</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {daysOfWeek.map(day => (
                        <span 
                          key={day}
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                            userProfile?.weekSchedule?.includes(day)
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <FiUsers />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">Ride Preferences</h4>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ride Sharing Preference</p>
                    <p className="font-medium text-gray-800">{userProfile?.preference || 'Any'}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-center mt-6"
                  variants={itemVariants}
                >
                  <motion.button
                    onClick={() => setActiveSection('editProfile')}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg flex items-center mx-auto text-sm font-medium shadow-md hover:shadow-lg"
                    whileHover={{ y: -2, boxShadow: "0 5px 15px rgba(99, 102, 241, 0.4)" }}
                    whileTap={{ y: 0 }}
                  >
                    <FiEdit2 className="mr-2" /> Edit Profile
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Edit Profile Section */}
            {activeSection === 'editProfile' && (
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                <motion.p className="text-sm text-gray-600" variants={itemVariants}>
                  Update your profile information below. Your changes will be reflected across your account.
                </motion.p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <motion.div variants={itemVariants} className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="text-sm font-semibold mb-3 text-indigo-700">Personal Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <FiUser className="mr-1.5 text-indigo-500" /> Full Name
                          </span>
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <FiUser className="mr-1.5 text-indigo-500" /> Gender
                          </span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <FiPhone className="mr-1.5 text-indigo-500" /> Phone Number
                          </span>
                        </label>
                        <input 
                          type="tel" 
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Address Information */}
                  <motion.div variants={itemVariants} className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-semibold mb-3 text-blue-700">Address Information</h3>
                    {isLoaded && (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <span className="flex items-center">
                              <FiHome className="mr-1.5 text-blue-500" /> Home Address
                            </span>
                          </label>
                          <StandaloneSearchBox
                            onLoad={onLoadPickup}
                            onPlacesChanged={() => handlePlaceChanged(pickupSearchBox, 'homeAddress')}
                          >
                            <input
                              type="text"
                              name="homeAddress"
                              value={formData.homeAddress?.address || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your home address"
                            />
                          </StandaloneSearchBox>
                        </div>
                      
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <span className="flex items-center">
                              <FiMapPin className="mr-1.5 text-blue-500" /> Office Address
                            </span>
                          </label>
                          <StandaloneSearchBox
                            onLoad={onLoadDrop}
                            onPlacesChanged={() => handlePlaceChanged(dropSearchBox, 'workAddress')}
                          >
                            <input
                              type="text"
                              name="workAddress"
                              value={formData.workAddress?.address || ''}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Enter your office address"
                            />
                          </StandaloneSearchBox>
                        </div>
                      </>
                    )}
                  </motion.div>
                  
                  {/* Office Timing */}
                  <motion.div variants={itemVariants} className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm font-semibold mb-3 text-green-700">Office Timing</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <FiClock className="mr-1.5 text-green-500" /> Start Time
                          </span>
                        </label>
                        <input 
                          type="time" 
                          name="officeStartTime"
                          value={formData.officeStartTime}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <FiClock className="mr-1.5 text-green-500" /> End Time
                          </span>
                        </label>
                        <input 
                          type="time" 
                          name="officeEndTime"
                          value={formData.officeEndTime}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <FiClock className="mr-1.5 text-green-500" /> Commute Timing
                          </span>
                        </label>
                        <select
                          name="timing"
                          value={formData.timing}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        >
                          <option value="">Select Timing</option>
                          <option value="Morning Only">Morning Only</option>
                          <option value="Evening Only">Evening Only</option>
                          <option value="Both Ways">Both Ways</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Work Schedule */}
                  <motion.div variants={itemVariants} className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="text-sm font-semibold mb-3 text-orange-700">Work Schedule</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleWeekdayToggle(day)}
                          className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                            formData.weekSchedule.includes(day)
                              ? 'bg-orange-200 text-orange-800'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Ride Preferences */}
                  <motion.div variants={itemVariants} className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-sm font-semibold mb-3 text-purple-700">Ride Preferences</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <FiUsers className="mr-1.5 text-purple-500" /> Ride Sharing Preference
                      </span>
                    </label>
                    <select
                      name="preference"
                      value={formData.preference}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    >
                      {preferenceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </motion.div>
                  
                  {/* Action Buttons */}
                  <motion.div variants={itemVariants} className="pt-3 flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={() => setActiveSection('viewProfile')}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition-colors flex items-center justify-center"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <FiX className="mr-1.5" /> Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                      whileHover={{ y: -2, boxShadow: "0 5px 15px rgba(99, 102, 241, 0.4)" }}
                      whileTap={{ y: 0 }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-1.5" /> Save Changes
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileManagement;