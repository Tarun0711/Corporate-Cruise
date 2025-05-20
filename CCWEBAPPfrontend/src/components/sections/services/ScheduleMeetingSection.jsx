import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiDollarSign, FiUsers, FiClock, FiShield, FiPhone, FiMail, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import PropTypes from 'prop-types';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl p-8 max-w-md w-full relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <FiXCircle className="w-6 h-6" />
      </button>
      {children}
    </motion.div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
};

const CustomCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get current month's details
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDayIndex = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();
  
  // Get days from previous month to fill the first week
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  const prevMonthDays = Array.from({ length: startingDayIndex }, (_, i) => ({
    day: prevMonthLastDay - startingDayIndex + i + 1,
    isCurrentMonth: false,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - startingDayIndex + i + 1)
  }));

  // Current month days
  const currentMonthDays = Array.from({ length: totalDays }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
  }));

  // Next month days to complete the calendar
  const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length); // 42 = 6 rows * 7 days
  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false,
    date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i + 1)
  }));

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  const weeks = Array.from({ length: 6 }, (_, i) => allDays.slice(i * 7, (i + 1) * 7));

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const isWeekend = (dayIndex) => dayIndex === 5 || dayIndex === 6; // Saturday or Sunday

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateYear = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear() + direction, currentDate.getMonth(), 1));
  };

  return (
    <div className="w-full">
      {/* Navigation */}
      <div className="flex justify-between items-center bg-gray-100 p-4 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateYear(-1)} className="p-2">
            <FiChevronsLeft className="w-5 h-5" />
          </button>
          <button onClick={() => navigateMonth(-1)} className="p-2">
            <FiChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <span className="text-xl font-medium">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => navigateMonth(1)} className="p-2">
            <FiChevronRight className="w-5 h-5" />
          </button>
          <button onClick={() => navigateYear(1)} className="p-2">
            <FiChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-bold text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIndex) => (
          week.map((dayObj, dayIndex) => {
            const isWeekendDay = isWeekend(dayIndex);
            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => dayObj.isCurrentMonth && onDateSelect(dayObj.date)}
                className={`
                  p-2 text-center relative
                  ${!dayObj.isCurrentMonth ? 'text-gray-300' : 
                    isWeekendDay ? 'text-red-500' : 'text-gray-900'}
                  ${isToday(dayObj.date) ? 'bg-yellow-100' : ''}
                  ${isSelected(dayObj.date) ? 'bg-blue-500 text-white' : ''}
                  ${dayObj.isCurrentMonth ? 'hover:bg-gray-50' : ''}
                `}
                disabled={!dayObj.isCurrentMonth}
              >
                {dayObj.day}
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
};

const ScheduleMeetingSection = () => {
  const [currentStep, setCurrentStep] = useState('date');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState({ show: false, type: '', message: '' });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const handleBack = () => {
    if (currentStep === 'time') setCurrentStep('date');
    else if (currentStep === 'form') setCurrentStep('time');
  };

  const handleNext = () => {
    if (currentStep === 'date' && selectedDate) setCurrentStep('time');
    else if (currentStep === 'time' && selectedTime) setCurrentStep('form');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const meetingData = {
      name: formData.name,
      company: formData.company,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
      date: selectedDate,
      time: selectedTime
    };

    try {
      const response = await fetch('https://api.corporatecruise.in/api/schedule-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData)
      });

      if (response.ok) {
        setModal({
          show: true,
          type: 'success',
          message: 'Meeting scheduled successfully! We will contact you shortly.'
        });
        // Reset form
        setFormData({ name: '', company: '', phone: '', email: '', message: '' });
        setSelectedDate(null);
        setSelectedTime(null);
        setCurrentStep('date');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setModal({
        show: true,
        type: 'error',
        message: 'Failed to schedule meeting. Please try again later.'
      });
    }
  };

  const isValidForm = () => {
    return (
      formData.name.trim() &&
      formData.company.trim() &&
      /^\d{10}$/.test(formData.phone) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      {modal.show && (
        <Modal onClose={() => setModal({ ...modal, show: false })}>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              {modal.type === 'success' ? (
                <FiCheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <FiXCircle className="w-12 h-12 text-red-500" />
              )}
            </div>
            <h3 className="text-xl font-bold mb-4">{modal.type === 'success' ? 'Success!' : 'Error!'}</h3>
            <p className="text-gray-600 mb-6">{modal.message}</p>
          </div>
        </Modal>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Corporate Commute Program
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Schedule a consultation with our mobility experts to discover how Corporate Cruise can:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiDollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Reduce Transportation Costs</h3>
                    <p className="text-gray-600">Save up to 40% with optimized routes and shared rides</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FiUsers className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Boost Employee Satisfaction</h3>
                    <p className="text-gray-600">Reliable, comfortable commutes improve retention</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FiShield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ensure Safety Compliance</h3>
                    <p className="text-gray-600">GPS tracking and verified drivers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Section */}
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-xl h-auto flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Schedule Consultation</h3>
              <div className="flex gap-2">
                {currentStep !== 'date' && (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-gray-600 hover:text-primary transition-colors"
                  >
                    ← Back
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {currentStep === 'date' && (
                <div className="space-y-6">
                  <CustomCalendar
                    selectedDate={selectedDate}
                    onDateSelect={(date) => setSelectedDate(date)}
                  />
                  <button
                    onClick={handleNext}
                    disabled={!selectedDate}
                    className="w-full bg-primary text-white py-4 rounded-xl font-semibold disabled:opacity-50"
                  >
                    Next → Choose Time
                  </button>
                </div>
              )}

              {currentStep === 'time' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold">Select Time Slot</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg text-sm ${
                          selectedTime === time
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={!selectedTime}
                    className="w-full bg-primary text-white py-4 rounded-xl font-semibold disabled:opacity-50"
                  >
                    Next → Fill Details
                  </button>
                </div>
              )}

              {currentStep === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      className="w-full p-3 border rounded-lg"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company Name *"
                      className="w-full p-3 border rounded-lg"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      className="w-full p-3 border rounded-lg"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      className="w-full p-3 border rounded-lg"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Additional Message"
                      className="w-full p-3 border rounded-lg"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg"
                    >
                      ← Back
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold disabled:opacity-50"
                      disabled={!isValidForm()}
                    >
                      Schedule Meeting
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScheduleMeetingSection; 