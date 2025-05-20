import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiUser, 
  FiClock,
  FiCalendar,
  FiUsers,
  FiMap,
  FiInfo,
  FiCheckCircle,
  FiArrowRight,
  FiMapPin,
  FiAward,
  FiShield,
  FiMail
} from 'react-icons/fi';
import { apiConnector } from '../../../services/apiconnector';
import { profileEndpoints } from '../../../services/api';
import Cookies from 'js-cookie';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../../../assets/logo/c.svg';
import carIllustration from '../../../assets/hero/car_3-removebg.png';
import CompletionModal from '../../common/CompletionModal';

// Stepper Component Definition
const OnboardingStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Create Account', icon: FiUser, description: 'Enter your basic details' },
    { id: 2, name: 'Verify Email', icon: FiMail, description: 'Confirm your email address' },
    { id: 3, name: 'Complete Profile', icon: FiUser, description: 'Customize your travel preferences' },
  ];

  return (
    <div className="space-y-6">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > step.id ? (
                <div className="group flex flex-col border-l-4 border-cyan-300 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-200 flex items-center">
                    <FiCheckCircle className="mr-1 text-cyan-200" size={14} />
                    Step {step.id}
                  </span>
                  <span className="text-sm font-medium text-white">{step.name}</span>
                </div>
              ) : currentStep === step.id ? (
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
        
        {currentStep === 3 && (
          <ul className="mt-3 space-y-2 text-xs text-blue-100">
            <li className="flex items-start">
              <FiMapPin className="mr-2 mt-0.5 text-cyan-300 flex-shrink-0" size={12} />
              <span>Set your commute preferences for better matching</span>
            </li>
            <li className="flex items-start">
              <FiUsers className="mr-2 mt-0.5 text-cyan-300 flex-shrink-0" size={12} />
              <span>Tell us how many people you'd like to share with</span>
            </li>
            <li className="flex items-start">
              <FiCalendar className="mr-2 mt-0.5 text-cyan-300 flex-shrink-0" size={12} />
              <span>Choose your working days for accurate scheduling</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

// Updated sharing options for better icon consistency
const sharingOptions = [
  { value: 'Private', label: 'Private', icon: FiUser },
  { value: 'Double', label: 'Double', icon: FiUsers },
  { value: 'Triple', label: 'Triple', icon: FiUsers },
  { value: 'Max', label: 'Max Sharing', icon: FiUsers }
];

const workingDays = [
  { full: 'Monday', short: 'M' },
  { full: 'Tuesday', short: 'T' }, 
  { full: 'Wednesday', short: 'W' },
  { full: 'Thursday', short: 'T' },
  { full: 'Friday', short: 'F' },
  { full: 'Saturday', short: 'S' },
  { full: 'Sunday', short: 'S' }
]; 

const genderOptions = [
  { value: 'Male', label: 'Male' }, 
  { value: 'Female', label: 'Female' }, 
  { value: 'Other', label: 'Other' }
];

// Benefit icons and descriptions
const benefitItems = [
  { 
    icon: FiMapPin, 
    title: "Personalized Routes", 
    description: "Find the perfect commute match based on your preferences."
  },
  { 
    icon: FiAward, 
    title: "Save on Commute", 
    description: "Reduce travel costs by sharing rides with colleagues."
  },
  { 
    icon: FiShield, 
    title: "Secure & Reliable", 
    description: "Only connect with verified professionals from your company."
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false); // State for modal visibility
  
  const [formData, setFormData] = useState({
    sharingPreference: 'Max',
    oneSideRoute: false,
    gender: 'Male',
    officeTiming: {
      in: '09:00',
      out: '17:00'
    },
    workingDays: []
  });

  const handleSharingChange = (e) => {
    setFormData(prev => ({
      ...prev,
      sharingPreference: e.target.value
    }));
  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({
      ...prev,
      gender: e.target.value
    }));
  };

  const handleOneSideRouteChange = (e) => {
    setFormData(prev => ({
      ...prev,
      oneSideRoute: e.target.checked
    }));
  };

  const handleTimingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      officeTiming: {
        ...prev.officeTiming,
        [name]: value
      }
    }));
  };

  const handleWorkingDaysChange = (day) => {
    setFormData(prev => {
      const newWorkingDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day];
      return {
        ...prev,
        workingDays: newWorkingDays
      };
    });
  };

  const handleSelectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      workingDays: workingDays.map(day => day.full)
    }));
  };

  const handleDeselectAllDays = () => {
    setFormData(prev => ({
      ...prev,
      workingDays: []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      if (
        !formData.gender ||
        !formData.sharingPreference ||
        !formData.officeTiming.in ||
        !formData.officeTiming.out ||
        formData.workingDays.length === 0
      ) {
        toast.error('Please fill in all details');
        return;
      }

      const profileData = {
        gender: formData.gender,
        officeTimings: {
          inTime: formData.officeTiming.in,
          outTime: formData.officeTiming.out
        },
        sharing: formData.sharingPreference,
        workingDays: formData.workingDays,
        oneSideRoute: formData.oneSideRoute ? 'Yes' : 'No'
      };

      const response = await apiConnector(
        'POST',
        profileEndpoints.CREATE_PROFILE_API,
        profileData,
        {
          Authorization: `Bearer ${token}`
        }
      );

      if (response.data) {
        toast.success('Profile created successfully!');
        setShowCompletionModal(true); // Show the modal instead of navigating
        //navigate(`/dashboard/${user.userId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  // Reusable Radio Group Component
  const RadioGroup = ({ label, name, options, selectedValue, onChange, icon: LabelIcon, infoText }) => (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
        {LabelIcon && <LabelIcon className="mr-2 text-gray-500" size={18} />}
        {label}
        {infoText && (
          <div className="relative ml-2 group">
            <FiInfo className="text-gray-400 hover:text-gray-600 cursor-pointer" size={14}/>
            <div className="absolute left-0 bottom-full mb-2 w-60 bg-gray-800 text-white p-2 rounded-lg shadow-lg text-xs invisible group-hover:visible z-10 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              {infoText}
            </div>
          </div>
        )}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map(({ value, label: optionLabel, icon: OptionIcon }) => (
          <motion.div
            key={value}
            whileHover={{ scale: selectedValue !== value ? 1.03 : 1 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium border ${
              selectedValue === value
                ? 'bg-blue-600 text-white shadow-md border-blue-600'
                : 'bg-white text-gray-700 hover:bg-blue-50 border-gray-300 hover:border-blue-300'
            }`}
          >
            <label className="flex items-center justify-center w-full cursor-pointer">
              <input
                type="radio"
                name={name}
                value={value}
                checked={selectedValue === value}
                onChange={onChange}
                className="hidden"
                aria-label={optionLabel || value}
              />
              {OptionIcon && <OptionIcon className={`mr-2 ${selectedValue === value ? 'text-white' : 'text-gray-500'}`} size={16} />}
              {optionLabel || value}
            </label>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Reusable Time Input Component
  const TimeInput = ({ label, name, value, onChange }) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        required
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2.5 bg-white text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500"
      />
    </div>
  );

  // Reusable Toggle Component
  const ToggleSwitch = ({ label, description, checked, onChange, icon: Icon }) => (
     <motion.div 
       whileHover={{ scale: 1.01 }}
       className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
     >
       <div>
         <span className="text-sm font-medium text-gray-700 flex items-center">
           {Icon && <Icon className="mr-2 text-gray-500" size={18}/>}
           {label}
         </span>
         {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
       </div>
       <label className="relative inline-flex items-center cursor-pointer">
         <input
           type="checkbox"
           checked={checked}
           onChange={onChange}
           className="sr-only peer"
           aria-label={label}
         />
         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
       </label>
     </motion.div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white p-4 md:p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 'w-96 h-96', color: 'bg-blue-600/5', x: '-top-20 -left-20', delay: 0 },
          { size: 'w-80 h-80', color: 'bg-cyan-500/5', x: 'bottom-0 right-10', delay: 0.2 },
          { size: 'w-64 h-64', color: 'bg-indigo-500/5', x: 'top-40 right-0', delay: 0.4 },
        ].map((circle, i) => (
          <motion.div
            key={i}
            className={`${circle.size} rounded-full absolute ${circle.color} ${circle.x}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: circle.delay, ease: "easeOut" }}
          />
        ))}
      </div>
    
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl z-10 relative border border-gray-100 flex flex-col md:flex-row overflow-hidden"
      >
        {/* Mobile view top info section */}
        <div className="md:hidden bg-gradient-to-r from-cyan-400 to-blue-600 p-5 text-white">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src={logo} alt="Corporate Cruise Logo" className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold">Corporate Cruise</h1>
          </div>
          
          <h2 className="text-xl font-bold text-center mb-2">
            Complete Your Profile
          </h2>
          
          <div className="flex justify-center space-x-6 pt-2">
            {[1, 2, 3].map(step => (
              <div 
                key={step}
                className={`relative flex flex-col items-center ${
                  step === 3 ? 'text-white' : step < 3 ? 'text-blue-100' : 'text-blue-200/60'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                  step === 3 ? 'bg-white text-blue-600' : 
                  step < 3 ? 'bg-blue-100 text-blue-600' : 'bg-blue-200/30 text-blue-100'
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
    
        {/* Left Panel (Branding/Info) - Desktop view */}
        <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-gradient-to-br from-cyan-400 to-blue-600 p-8 text-white flex-col justify-between relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            {/* Logo and title */}
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="Corporate Cruise Logo" className="w-10 h-10" />
              <h1 className="text-xl font-bold">Corporate Cruise</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-3">One Last Step!</h2>
            <p className="text-blue-100 text-lg mb-6">Tell us about your commute preferences to find your ideal carpool match.</p>
          </div>
          
          {/* Stepper component */}
          <div className="relative z-10 my-8">
            <OnboardingStepper currentStep={3} />
          </div>
          
          {/* Benefits section */}
          <div className="relative z-10 mt-auto mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Why Complete Your Profile?</h3>
            <div className="space-y-4">
              {benefitItems.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <item.icon className="text-cyan-200" size={16} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">{item.title}</h4>
                    <p className="text-blue-100 text-xs">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Car illustration at bottom */}
          {/* <div className="relative z-10">
            <motion.img 
              src={carIllustration} 
              alt="Corporate Cruise Car" 
              className="w-48 h-auto object-contain mx-auto"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "mirror", 
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </div> */}
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full md:w-1/2 lg:w-7/12 p-6 md:p-10 overflow-y-auto">
          {/* Header */}
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-800 mb-1 text-center md:text-left"
          >
            Your Commute Preferences
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-sm mb-6 text-center md:text-left"
          >
            Help us match you with the perfect commute partners.
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Gender */}
            <RadioGroup
              label="Gender"
              name="gender"
              options={genderOptions}
              selectedValue={formData.gender}
              onChange={handleGenderChange}
              icon={FiUser}
            />

            {/* Sharing Preference */}
            <RadioGroup
              label="Sharing Preference"
              name="sharingPreference"
              options={sharingOptions}
              selectedValue={formData.sharingPreference}
              onChange={handleSharingChange}
              icon={FiUsers}
              infoText="Choose how many people you're comfortable sharing your ride with."
            />
            
            {/* One Side Route Toggle */}
            <ToggleSwitch
              label="One Side Route"
              description="Only need commute in one direction (e.g., only morning or evening)"
              checked={formData.oneSideRoute}
              onChange={handleOneSideRouteChange}
              icon={FiMap}
            />

            {/* Office Timing */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <FiClock className="mr-2 text-gray-500" size={18} />
                Office Timing (Approx.)
              </label>
              <div className="flex items-center gap-4">
                <TimeInput 
                  label="In Time"
                  name="in"
                  value={formData.officeTiming.in}
                  onChange={handleTimingChange}
                />
                <TimeInput 
                  label="Out Time"
                  name="out"
                  value={formData.officeTiming.out}
                  onChange={handleTimingChange}
                />
              </div>
            </div>

            {/* Working Days */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FiCalendar className="mr-2 text-gray-500" size={18} />
                  Working Days
                </label>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={formData.workingDays.length === workingDays.length ? handleDeselectAllDays : handleSelectAllDays}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {formData.workingDays.length === workingDays.length ? 'Deselect All' : 'Select All'}
                </motion.button>
              </div>
              <div className="flex justify-center flex-wrap gap-2">
                {workingDays.map((day) => (
                  <motion.div
                    key={day.full}
                    className="flex items-center flex-col gap-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <label
                      title={day.full}
                      className={`flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-all duration-200 border ${formData.workingDays.includes(day.full)
                        ? 'bg-blue-600 text-white shadow-sm border-blue-600'
                        : 'bg-white text-gray-600 hover:bg-blue-50 border-gray-300 hover:border-blue-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day.full)}
                        onChange={() => handleWorkingDaysChange(day.full)}
                        className="hidden"
                        aria-label={day.full}
                      />
                      <span className="text-xs font-medium">{day.short}</span>
                    </label>
                    
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit Button - Consistent with Signup/Signin */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: !loading ? 1.03 : 1 }}
              whileTap={{ scale: !loading ? 0.97 : 1 }}
              className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 mt-4 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                }`}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Profile</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </motion.button>
            
            {/* Skip for now */}
            <div className="text-center">
              <motion.button
                type="button"
                onClick={() => setShowCompletionModal(true)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Skip for now
              </motion.button>
            </div>
          </form>
        </div>
        
        {/* Completion Modal */}
        <AnimatePresence>
          {showCompletionModal && (
            <CompletionModal onClose={() => setShowCompletionModal(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Onboarding;
