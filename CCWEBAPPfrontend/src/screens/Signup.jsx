import React, { useState, useEffect } from "react";
// Removed Input import, will use standard inputs
import { FiUser, FiMail, FiPhone, FiHash, FiHome, FiBriefcase, FiEdit2, FiLogIn, FiArrowRight, FiCheckCircle, FiMapPin, FiClock } from "react-icons/fi"; // Added more icons
import { toast } from "react-toastify";
import { signUp, verifyOtp, resendOtp } from "../services/operations/Auth";
// Removed OtpInput import, will use custom inputs
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Added Link
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { useDispatch } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc"; // Keep if Google Sign-in is planned
import logo from '../assets/logo/c.svg'; // Import the logo
import carIllustration from '../assets/hero/car_3-removebg.png'; // Import car illustration

const libraries = ['places'];

// Enhanced Stepper Component with Animation
const SignupStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Create Account', icon: FiUser, description: 'Enter your basic details' },
    { id: 2, name: 'Verify Email', icon: FiMail, description: 'Confirm your email address' },
    { id: 3, name: 'Complete Profile', icon: FiUser, description: 'Finish setting up your account' },
  ];

  return (
    <div className="space-y-6">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > step.id ? (
                // Completed Step
                <div className="group flex flex-col border-l-4 border-cyan-300 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-200 flex items-center">
                    <FiCheckCircle className="mr-1 text-cyan-200" size={14} />
                    Step {step.id}
                  </span>
                  <span className="text-sm font-medium text-white">{step.name}</span>
                </div>
              ) : currentStep === step.id ? (
                // Current Step
                <div className="flex flex-col border-l-4 border-cyan-300 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0" aria-current="step">
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-200 flex items-center">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                      className="mr-1 w-3.5 h-3.5 bg-cyan-300 rounded-full"
                    />
                    Step {step.id}
                  </span>
                  <span className="text-sm font-medium text-white">{step.name}</span>
                </div>
              ) : (
                // Upcoming Step
                <div className="group flex flex-col border-l-4 border-blue-800 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">Step {step.id}</span>
                  <span className="text-sm font-medium text-blue-200">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Step Details */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 text-left">
        <h3 className="text-white text-sm font-medium mb-2 flex items-center">
          {steps[currentStep-1].icon({ className: "mr-2", size: 16 })}
          {steps[currentStep-1].name}
        </h3>
        <p className="text-xs text-blue-100">{steps[currentStep-1].description}</p>
        
        {currentStep === 1 && (
          <ul className="mt-3 space-y-2 text-xs text-blue-100">
            <li className="flex items-start">
              <FiMapPin className="mr-2 mt-0.5 text-cyan-300 flex-shrink-0" size={12} />
              <span>We'll use your addresses to find optimal commute matches</span>
            </li>
            <li className="flex items-start">
              <FiPhone className="mr-2 mt-0.5 text-cyan-300 flex-shrink-0" size={12} />
              <span>Your phone number helps coordinate with commute partners</span>
            </li>
          </ul>
        )}

        {currentStep === 2 && (
          <ul className="mt-3 space-y-2 text-xs text-blue-100">
            <li className="flex items-start">
              <FiMail className="mr-2 mt-0.5 text-cyan-300 flex-shrink-0" size={12} />
              <span>Enter the 6-digit code sent to your email</span>
            </li>
            <li className="flex items-start">
              <FiClock className="mr-2 mt-0.5 text-cyan-300 flex-shrink-0" size={12} />
              <span>Codes expire after 3 minutes - you can request a new one if needed</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};


function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    referralId: "",
    homeAddress: {
      address: "",
      latitude: null,
      longitude: null
    },
    workAddress: {
      address: "",
      latitude: null,
      longitude: null
    },
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [shake, setShake] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pickupSearchBox, setPickupSearchBox] = useState(null);
  const [dropSearchBox, setDropSearchBox] = useState(null);

  // Check for expired session on component mount
  React.useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      const { expiry } = JSON.parse(userSession);
      if (new Date().getTime() > expiry) {
        localStorage.removeItem('userSession');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    }
  }, []);

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

  React.useEffect(() => {
    let timer;
    if (showOtpForm && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOtpForm, timeLeft]);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setFormData(prev => ({ ...prev, referralId: ref }));
  }, [searchParams]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("Input changed:", name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    
    if (!formData.homeAddress?.address?.trim()) {
      newErrors.homeAddress = "Home address is required";
    }
    
    if (!formData.workAddress?.address?.trim()) {
      newErrors.workAddress = "Work address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(formData);
      if (result) {
        setShowOtpForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
    if (otpError) {
      setOtpError(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await dispatch(verifyOtp(otp, formData.email));
  
      if (response && response.token) {
        navigate(`/onboarding`);
      }
    } catch (error) {
      setShake(true);
      setOtpError(true);
      setOtp('');
      setTimeout(() => setShake(false), 500);
      toast.error(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    
    try {
      await resendOtp(formData.email);
      setTimeLeft(180); // Reset timer
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    }
  };

  return (
    // Main container with split layout on medium screens and up
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white p-4 md:p-6 mt-20 md:mt-0">
      {/* Decorative circles in the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 'w-96 h-96', color: 'bg-blue-600/5', x: '-top-20 -left-20', delay: 0 },
          { size: 'w-80 h-80', color: 'bg-cyan-500/5', x: 'bottom-0 right-10', delay: 0.2 },
          { size: 'w-64 h-64', color: 'bg-indigo-500/5', x: 'top-40 right-0', delay: 0.4 },
        ].map((circle, index) => (
          <motion.div
            key={index}
            className={`${circle.size} rounded-full absolute ${circle.color} ${circle.x}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: circle.delay, ease: "easeOut" }}
          />
        ))}
      </div>
      
      {/* Card Container */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl z-10 relative border border-gray-100 flex flex-col md:flex-row overflow-hidden" // Flex row for split
      >
        {/* Left Panel Content - Visible on medium screens and up */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-cyan-400 to-blue-600 p-8 text-white flex-col justify-between relative">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          {/* Top content with logo and app name */}
          <div className="relative z-10 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <img src={logo} alt="Corporate Cruise Logo" className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold">Corporate Cruise</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-3">Smart Carpooling for Professionals</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Join our community of commuters and find your ideal carpool match.
            </p>
          </div>
          
          {/* Middle content with stepper and instructions */}
          <div className="relative z-10 flex-grow my-6">
            <SignupStepper currentStep={showOtpForm ? 2 : 1} />
          </div>
          
          {/* Car illustration at bottom */}
          <div className="relative z-10 mt-auto">
            <div className="flex justify-center">
              <motion.img 
                src={carIllustration} 
                alt="Corporate Cruise Car" 
                className="w-56 h-auto object-contain mt-4"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Mobile View Top Panel (only visible on mobile) */}
        <div className="md:hidden bg-gradient-to-r from-cyan-400 to-blue-600 p-5 text-white">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src={logo} alt="Corporate Cruise Logo" className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold">Corporate Cruise</h1>
          </div>
          
          <h2 className="text-xl font-bold text-center mb-2">
            {showOtpForm ? "Verify Your Email" : "Create Your Account"}
          </h2>
          
          <div className="flex justify-center space-x-6 pt-2">
            {[1, 2, 3].map(step => (
              <div 
                key={step}
                className={`relative flex flex-col items-center ${
                  showOtpForm ? (step === 2 ? 'text-white' : step < 2 ? 'text-blue-100' : 'text-blue-200/60') 
                             : (step === 1 ? 'text-white' : 'text-blue-200/60')
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  showOtpForm ? (
                    step === 2 ? 'bg-white text-blue-600' : 
                    step < 2 ? 'bg-blue-100 text-blue-600' : 'bg-blue-200/30 text-blue-100'
                  ) : (
                    step === 1 ? 'bg-white text-blue-600' : 'bg-blue-200/30 text-blue-100'
                  )
                }`}>
                  {step}
                </div>
                <div className="text-xs font-medium whitespace-nowrap">
                  {step === 1 ? 'Account' : step === 2 ? 'Verify' : 'Profile'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto"> 
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold text-gray-800 mb-2 text-center md:text-left"
          >
            {showOtpForm ? "Verify Your Email" : "Create Account"}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-base mb-8 text-center md:text-left"
          >
            {showOtpForm ? "We've sent a verification code to your email." : "Join our community of carpoolers!"}
          </motion.p>

          <AnimatePresence mode="wait">
            {showOtpForm ? (
              // OTP Form (Similar styling to Signin)
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOtp} 
                className="w-full"
              >
                <div className="flex flex-col items-center space-y-6">
                  {/* Email display and edit button */}
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm w-full bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="text-center flex-grow">Code sent to <b>{formData.email}</b></span>
                    <button
                      type="button"
                      onClick={() => setShowOtpForm(false)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors flex-shrink-0"
                      title="Change email"
                    >
                      <FiEdit2 size={14} />
                    </button>
                  </div>
                  
                  {/* OTP Input Section */}
                  <div className="w-full">
                    <label htmlFor="otp-input" className="block text-center text-sm font-medium text-gray-700 mb-3">
                      Enter 6-digit verification code
                    </label>
                    
                    {/* Custom OTP Input Implementation */}
                    <div className={`flex justify-center space-x-2 ${shake ? 'animate-shake' : ''}`}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input
                          key={index}
                          id={index === 0 ? "otp-input" : undefined}
                          type="tel"
                          maxLength="1"
                          value={otp[index] || ''}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[index] = e.target.value;
                            if (/^\d*$/.test(e.target.value)) {
                              handleOtpChange(newOtp.join(''));
                              if (e.target.value && index < 5) {
                                const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
                                if (nextInput) nextInput.focus();
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                              const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
                              if (prevInput) prevInput.focus();
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          data-index={index}
                          className={`w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl font-semibold bg-white 
                            border-2 rounded-lg text-center transition-all duration-200
                            ${otpError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} 
                            focus:outline-none focus:ring-1`}
                          autoFocus={index === 0}
                          inputMode="numeric"
                          pattern="\d*"
                        />
                      ))}
                    </div>
                    
                    {otpError && (
                      <p className="text-red-500 text-center text-xs mt-2">
                        Invalid code. Please try again.
                      </p>
                    )}
                  </div>

                  {/* Resend Code Section */}
                  <div className="text-center text-sm text-gray-500 w-full">
                    <span>Didn't receive code? </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timeLeft > 0 || loading}
                      className={`font-medium transition-colors ${
                        timeLeft > 0 || loading
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:text-blue-800 hover:underline"
                      }`}
                    >
                      Resend
                    </button>
                    {timeLeft > 0 && (
                      <span className="text-gray-400 ml-1">
                        ({formatTime(timeLeft)})
                      </span>
                    )}
                  </div>

                  {/* Verify Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      loading || otp.length !== 6
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg"
                    }`}
                    whileHover={{ scale: (otp.length === 6 && !loading) ? 1.03 : 1 }}
                    whileTap={{ scale: (otp.length === 6 && !loading) ? 0.98 : 1 }}
                  >
                    {loading ? (
                      <>
                        <motion.div 
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <FiLogIn size={18}/> 
                        <span>Verify & Continue</span>
                      </>
                    )}
                  </motion.button>
                  
                  {/* Support Link */}
                  <div className="text-center text-xs text-gray-500 mt-2">
                    Having trouble? <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
                  </div>
                </div>
              </motion.form>
            ) : (
              // Signup Form
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-5" // Adjusted spacing
              >
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                  {isLoaded ? (
                    <>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <FiUser size={18} />
                          </div>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none transition duration-200 ${
                              errors.name 
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } focus:ring-1`}
                            required
                          />
                        </div>
                        {errors.name && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-xs mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <FiMail size={18} />
                          </div>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none transition duration-200 ${
                              errors.email 
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } focus:ring-1`}
                            required
                          />
                        </div>
                        {errors.email && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-xs mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <FiPhone size={18} />
                          </div>
                          <input
                            id="phoneNumber"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber || ''}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none transition duration-200 ${
                              errors.phoneNumber 
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } focus:ring-1`}
                            required
                          />
                        </div>
                        {errors.phoneNumber && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-xs mt-1"
                          >
                            {errors.phoneNumber}
                          </motion.p>
                        )}
                      </div>
                  
                      {/* Home Address with StandaloneSearchBox */}
                      <div>
                        <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                        <StandaloneSearchBox
                          onLoad={onLoadPickup} 
                          onPlacesChanged={() => handlePlaceChanged(pickupSearchBox, 'homeAddress')}
                        >
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <FiHome size={18} />
                            </div>
                            <input 
                              id="homeAddress"
                              name="homeAddressInput"
                              type="text"
                              placeholder="Enter your home address"
                              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none transition duration-200 ${
                                errors.homeAddress 
                                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              } focus:ring-1`}
                              required
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setFormData(prev => ({
                                  ...prev,
                                  homeAddress: {
                                    ...prev.homeAddress,
                                    address: newValue
                                  }
                                }));
                              }}
                              value={formData.homeAddress.address || ''}
                            />
                          </div>
                        </StandaloneSearchBox>
                        {errors.homeAddress && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-xs mt-1"
                          >
                            {errors.homeAddress}
                          </motion.p>
                        )}
                      </div>
                  
                      {/* Work Address with StandaloneSearchBox */}
                      <div>
                        <label htmlFor="workAddress" className="block text-sm font-medium text-gray-700 mb-1">Work Address</label>
                        <StandaloneSearchBox
                          onLoad={onLoadDrop}
                          onPlacesChanged={() => handlePlaceChanged(dropSearchBox, 'workAddress')}
                        >
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <FiBriefcase size={18} />
                            </div>
                            <input 
                              id="workAddress"
                              name="workAddressInput"
                              type="text"
                              placeholder="Enter your work address"
                              className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none transition duration-200 ${
                                errors.workAddress 
                                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                              } focus:ring-1`}
                              required
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setFormData(prev => ({
                                  ...prev,
                                  workAddress: {
                                    ...prev.workAddress,
                                    address: newValue
                                  }
                                }));
                              }}
                              value={formData.workAddress.address || ''}
                            />
                          </div>
                        </StandaloneSearchBox>
                        {errors.workAddress && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-xs mt-1"
                          >
                            {errors.workAddress}
                          </motion.p>
                        )}
                      </div>
                  
                      <div>
                        <label htmlFor="referralId" className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          Referral ID (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <FiHash size={18} />
                          </div>
                          <input
                            id="referralId"
                            type="text"
                            name="referralId"
                            value={formData.referralId}
                            onChange={handleChange}
                            placeholder="Referral ID (Optional)"
                            className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none transition duration-200 ${
                              errors.referralId 
                                ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } focus:ring-1`}
                          />
                        </div>
                        {errors.referralId && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 text-xs mt-1"
                          >
                            {errors.referralId}
                          </motion.p>
                        )}
                      </div>
                    </>
                  ) : (
                    // Loading indicator while Google Maps loads
                    <div className="flex justify-center items-center py-10">
                      <motion.div 
                        className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="ml-3 text-gray-600">Loading maps...</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 mt-2 ${
                      loading || !isLoaded
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                    }`}
                    disabled={loading || !isLoaded}
                    whileHover={{ scale: !(loading || !isLoaded) ? 1.03 : 1 }}
                    whileTap={{ scale: !(loading || !isLoaded) ? 0.98 : 1 }}
                  >
                    {loading ? (
                      <>
                        <motion.div 
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <FiArrowRight size={18}/>
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/signin" // Corrected link
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
