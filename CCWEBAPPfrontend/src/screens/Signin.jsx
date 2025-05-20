
import React, { useState, useEffect } from "react";
import { FiEdit2, FiMail, FiLock, FiLogIn } from "react-icons/fi"; // Added FiLogIn
// Removed OtpInput import as we are using custom inputs
// Removed Input import as we are using standard inputs
import { signIn, verifySignIn } from "../services/operations/Auth"; // Combined imports
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // Added Link
import { motion, AnimatePresence } from "framer-motion";

function Signin() {
  const [formData, setFormData] = useState({ loginId: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [shake, setShake] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.loginId) {
      setErrors({ loginId: "Login ID is required" });
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(formData.loginId);
      if (result) {
        toast.success("OTP sent to your email.");
        setShowOtpForm(true);
        setTimeLeft(180);
      }
    } catch (err) {
      console.error(err);
      setErrors({ loginId: "Failed to send OTP" });
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value) => {
    setOtp(value);
    setOtpError(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      const result = await verifySignIn({ loginId: formData.loginId, otp }, dispatch);
      if (result) {
        toast.success("Login Successfully");
        // console.log(result);
        // Redirect to dashboard
        navigate(`/dashboard/${result.user.userId}`);
      } else {
        setOtpError(true);
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error verifying OTP. Please try again.");
      setOtpError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const result = await signIn(formData.loginId);
      if (result) {
        toast.success("OTP resent successfully");
        setTimeLeft(180);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!showOtpForm) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtpForm]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-md z-10 relative border border-gray-100" // Slightly adjusted padding, border, shadow
      >
        {/* Removed the top blue bar for a cleaner look */}
        {/* <motion.div 
          className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-t-2xl" // Gradient bar
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        /> */}
        
        {/* Logo Placeholder */}
        <div className="flex justify-center mb-5">
           {/* You can add your logo here */}
           {/* <img src="/path/to/your/logo.svg" alt="Corporate Cruise Logo" className="h-12" /> */}
           <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
             CC
           </div>
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-800 mb-2 text-center" // Adjusted size and weight
        >
          {showOtpForm ? "Verify Your Email" : "Welcome Back!"}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 text-base mb-8 text-center" // Adjusted size and margin
        >
          {showOtpForm ? "Verify your email" : "Welcome back!"}
        </motion.p>

        <AnimatePresence mode="wait">
          {showOtpForm ? (
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
                  <span className="text-center flex-grow">Code sent to <b>{formData.loginId}</b></span>
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
                        type="tel" // Use "tel" for numeric keyboard on mobile
                        maxLength="1"
                        value={otp[index] || ''}
                        onChange={(e) => {
                          const newOtp = [...otp];
                          newOtp[index] = e.target.value;
                          // Only allow digits
                          if (/^\d*$/.test(e.target.value)) {
                            handleOtpChange(newOtp.join(''));
                            // Move focus to next input if value entered and not the last input
                            if (e.target.value && index < 5) {
                              const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
                              if (nextInput) nextInput.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          // Move focus to previous input on backspace if current input is empty
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
                            if (prevInput) prevInput.focus();
                          }
                        }}
                        onFocus={(e) => e.target.select()} // Select content on focus
                        data-index={index}
                        className={`w-10 h-12 md:w-12 md:h-14 text-lg md:text-xl font-semibold bg-white 
                          border-2 rounded-lg text-center transition-all duration-200
                          ${otpError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} 
                          focus:outline-none focus:ring-1`}
                        autoFocus={index === 0}
                        inputMode="numeric" // Hint for numeric keyboard
                        pattern="\d*" // Pattern for digits
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
                      <span>Verify & Sign In</span>
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
            <motion.div
              key="signin-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6" // Increased spacing
            >
              <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                  <label htmlFor="loginId" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FiMail size={18} />
                    </div>
                    <input
                      id="loginId"
                      type="email"
                      name="loginId"
                      value={formData.loginId}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none transition duration-200 ${
                        errors.loginId 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } focus:ring-1`}
                      required
                      aria-invalid={errors.loginId ? "true" : "false"}
                      aria-describedby={errors.loginId ? "loginId-error" : undefined}
                    />
                  </div>
                  {errors.loginId && (
                    <motion.p 
                      id="loginId-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-xs mt-1"
                    >
                      {errors.loginId}
                    </motion.p>
                  )}
                </div>

                {/* Sign In Button */}
                <motion.button 
                  type="submit" 
                  className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                  }`}
                  disabled={loading}
                  whileHover={{ scale: !loading ? 1.03 : 1 }}
                  whileTap={{ scale: !loading ? 0.98 : 1 }}
                >
                  {loading ? (
                     <>
                      <motion.div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <FiLogIn size={18}/> 
                      <span>Continue with Email</span>
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

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Signin;
