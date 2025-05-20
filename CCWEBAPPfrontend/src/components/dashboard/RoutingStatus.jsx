import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiClock, FiCheckCircle, FiActivity, FiUserCheck, 
  FiCreditCard, FiTruck, FiAlertTriangle, FiCalendar,
  FiMap, FiMessageCircle, FiChevronDown, FiChevronUp, FiPhoneCall
} from 'react-icons/fi';

const RoutingStatus = ({ status }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  
  // Process timeline data
  const processTimeline = [
    {
      id: 'route_request',
      label: 'Route Request Submitted',
      date: '16 Aug 2024',
      time: '14:30',
      description: 'Your route request has been successfully received',
      completed: true
    },
    {
      id: 'verification',
      label: 'Address Verification',
      date: '17 Aug 2024',
      time: '11:15',
      description: 'Home and office addresses verified',
      completed: status !== 'under_verification'
    },
    {
      id: 'route_planning',
      label: 'Route Planning',
      date: status === 'routing' ? 'In Progress' : '18 Aug 2024',
      time: status === 'routing' ? '' : '15:40',
      description: 'Our system is optimizing the most efficient route',
      completed: ['AssigningDriver', 'payment', 'completed'].includes(status),
      active: status === 'routing'
    },
    {
      id: 'driver_assignment',
      label: 'Driver Assignment',
      date: status === 'AssigningDriver' ? 'In Progress' : (status === 'payment' || status === 'completed') ? '19 Aug 2024' : 'Upcoming',
      time: (status === 'payment' || status === 'completed') ? '09:20' : '',
      description: 'Matching you with the right driver for your route',
      completed: ['payment', 'completed'].includes(status),
      active: status === 'AssigningDriver'
    },
    {
      id: 'payment',
      label: 'Payment & Confirmation',
      date: status === 'payment' ? 'Awaiting' : status === 'completed' ? '20 Aug 2024' : 'Upcoming',
      time: status === 'completed' ? '10:05' : '',
      description: 'Finalize your payment to confirm the route',
      completed: status === 'completed',
      active: status === 'payment'
    }
  ];
  
  const getStatusIcon = (itemStatus) => {
    switch(itemStatus) {
      case 'under_verification':
        return <FiUserCheck className="text-blue-500" />;
      case 'routing':
        return <FiMap className="text-indigo-600" />;
      case 'AssigningDriver':
        return <FiTruck className="text-purple-500" />;
      case 'payment':
        return <FiCreditCard className="text-green-600" />;
      case 'completed':
        return <FiCheckCircle className="text-green-600" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };
  
  const getStatusHeading = () => {
    switch(status) {
      case 'under_verification':
        return "Verifying Your Addresses";
      case 'routing':
        return "Creating Your Optimal Route";
      case 'AssigningDriver':
        return "Finding Your Perfect Driver Match";
      case 'payment':
        return "Ready for Payment & Confirmation";
      case 'completed':
        return "All Set! Your Commute is Ready";
      default:
        return "Processing Your Request";
    }
  };
  
  const getStatusDescription = () => {
    switch(status) {
      case 'under_verification':
        return "We're confirming your home and office locations to ensure accurate routing.";
      case 'routing':
        return "Our systems are calculating the most efficient route based on your location and schedule.";
      case 'AssigningDriver':
        return "We're matching you with a driver whose schedule aligns perfectly with yours.";
      case 'payment':
        return "Your route is optimized! Complete payment to confirm your commute plan.";
      case 'completed':
        return "Your commute plan is confirmed and your driver is ready to go!";
      default:
        return "We're processing your commute request.";
    }
  };
  
  const getStatusTimeEstimate = () => {
    switch(status) {
      case 'under_verification':
        return "Estimated completion: 24 hours";
      case 'routing':
        return "Estimated completion: 2-3 business days";
      case 'AssigningDriver':
        return "Estimated completion: 1-2 business days";
      case 'payment':
        return "Awaiting your action";
      case 'completed':
        return "Commute starts from tomorrow";
      default:
        return "";
    }
  };

  const getCurrentStepIndex = () => {
    if (status === 'under_verification') return 1;
    if (status === 'routing') return 2;
    if (status === 'AssigningDriver') return 3;
    if (status === 'payment') return 4;
    if (status === 'completed') return 5;
    return 0;
  };
  
  // Countdown timer for estimated completion
  useEffect(() => {
    if (status === 'completed' || status === 'payment') return;
    
    const calculateTimeLeft = () => {
      // This would normally use actual timestamps from backend
      const futureDate = new Date();
      
      if (status === 'under_verification') {
        futureDate.setHours(futureDate.getHours() + 24);
      } else if (status === 'routing') {
        futureDate.setDate(futureDate.getDate() + 2);
      } else if (status === 'AssigningDriver') {
        futureDate.setDate(futureDate.getDate() + 1);
      }
      
      const difference = futureDate - new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        
        return `${days > 0 ? `${days}d ` : ''}${hours}h remaining`;
      }
      
      return '';
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [status]);
  
  const TicketModal = () => (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Contact Support</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowTicketModal(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 text-sm">
              <option>Route Optimization Request</option>
              <option>Address Change</option>
              <option>Schedule Adjustment</option>
              <option>Payment Issue</option>
              <option>Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm h-24"
              placeholder="Please describe your issue or question..."
            ></textarea>
          </div>
          
          <div className="flex gap-3">
            <button 
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
              onClick={() => setShowTicketModal(false)}
            >
              Cancel
            </button>
            <button 
              className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark"
              onClick={() => {
                alert("Support ticket submitted successfully!");
                setShowTicketModal(false);
              }}
            >
              Submit
            </button>
          </div>
          
          <div className="text-center border-t border-gray-100 pt-3 mt-3">
            <p className="text-sm text-gray-600">Need immediate assistance?</p>
            <button 
              className="text-primary font-medium text-sm flex items-center justify-center w-full mt-2"
            >
              <FiPhoneCall className="mr-2" /> Call Support: 1800-123-4567
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              {getStatusIcon(status)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getStatusHeading()}</h2>
              <p className="text-gray-600">{getStatusDescription()}</p>
            </div>
          </div>
          
          {status !== 'completed' && (
            <div className="mt-4 md:mt-0 flex items-center">
              <FiClock className="text-primary mr-2" />
              <span className="text-sm font-medium">{getStatusTimeEstimate()}</span>
              {timeLeft && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {timeLeft}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Progress indicators */}
        <div className="relative mb-8 mt-6">
          <div className="flex w-full justify-between">
            {processTimeline.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${step.completed ? 'bg-green-500 text-white' : 
                    step.active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step.completed ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <p className={`text-xs mt-2 text-center font-medium 
                  ${step.completed ? 'text-green-600' : 
                    step.active ? 'text-primary' : 'text-gray-500'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
          
          {/* Progress line */}
          <div className="absolute top-4 left-0 transform -translate-y-1/2 h-0.5 bg-gray-200 w-full z-0"></div>
          <div 
            className="absolute top-4 left-0 transform -translate-y-1/2 h-0.5 bg-green-500 z-0 transition-all duration-500"
            style={{ width: `${Math.max(0, (getCurrentStepIndex() - 1) * 25)}%` }}
          ></div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-5">
          {status === 'payment' && (
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center hover:bg-primary-dark transition-colors">
              <FiCreditCard className="mr-2" /> Make Payment
            </button>
          )}
          
          {status === 'completed' && (
            <button className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center hover:bg-green-700 transition-colors">
              <FiCheckCircle className="mr-2" /> View Commute Details
            </button>
          )}
          
          <button 
            className="flex-1 border border-primary text-primary px-6 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center hover:bg-primary/5 transition-colors"
            onClick={() => setShowTicketModal(true)}
          >
            <FiMessageCircle className="mr-2" /> Contact Support
          </button>
          
          <button 
            className="flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm font-medium"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>Less Details <FiChevronUp className="ml-1" /></>
            ) : (
              <>More Details <FiChevronDown className="ml-1" /></>
            )}
          </button>
        </div>
      </div>
      
      {/* Detailed timeline */}
      {showDetails && (
        <motion.div 
          className="bg-gray-50 border-t border-gray-100 p-5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Detailed Process Timeline</h3>
          
          <div className="space-y-6 relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
            
            {processTimeline.map((step) => (
              <div key={step.id} className="flex relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                  ${step.completed ? 'bg-green-500 text-white' : 
                    step.active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step.completed ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : step.active ? (
                    <FiActivity className="w-4 h-4" />
                  ) : (
                    <FiClock className="w-4 h-4" />
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h4 className={`font-medium ${step.completed ? 'text-green-700' : step.active ? 'text-primary' : 'text-gray-700'}`}>
                      {step.label}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1 sm:mt-0">
                      <FiCalendar className="mr-1" />
                      <span>{step.date}</span>
                      {step.time && (
                        <>
                          <span className="mx-1">•</span>
                          <FiClock className="mr-1" />
                          <span>{step.time}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  
                  {step.active && status === 'routing' && (
                    <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <div className="flex items-start">
                        <FiAlertTriangle className="text-yellow-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-800 font-medium">High Traffic in Your Area</p>
                          <p className="text-xs text-yellow-700 mt-0.5">We're optimizing for alternate routes to minimize your commute time during peak hours.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Support ticket modal */}
      {showTicketModal && <TicketModal />}
    </div>
  );
};

export default RoutingStatus;