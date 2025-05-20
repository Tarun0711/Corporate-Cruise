import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Affordable from '../../../assets/logo/c.svg';
import Expensive from '../../../assets/hero/ola.png';
import disadvantages from '../../../assets/hero/uber.png';
import User from '../../../assets/hero/id.png';

const Comparison = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const AUTO_SCROLL_INTERVAL = 15000; // Increased to 15 seconds

  const comparisonPairs = [
    {
      title: "Pricing",
      advantage: {
        heading: "Affordable",
        description: "Same Price. Everytime.\n\nOur Services start from very low prices.",
        highlight: "Pricing almost equivalent to metro fares",
        logo: Affordable
      },
      disadvantage: {
        heading: "Expensive",
        description: "Higher fares at peak times, straining your budget.\n\nDuring surge time, prices rise significantly.",
        highlight: "Up to 3x surge pricing",
        logo: Expensive
      }
    },
    {
      title: "Booking Experience",
      advantage: {
        heading: "One-Time Registration",
        description: "Book one time and get cabs at your doorstep on time.",
        highlight: "Guaranteed on-time pickup",
        logo: Affordable
      },
      disadvantage: {
        heading: "Daily Booking Hassle",
        description: "Booking cabs daily is time consuming and have no punctuality",
        highlight: "Average 15min waiting time",
        logo: disadvantages
      }
    },
    {
      title: "Safety",
      advantage: {
        heading: "Safety Assurance",
        description: "Our drivers are verified and professionals. \n\n Enhanced security measures for women.",
        highlight: "100% verified drivers",
        logo: Affordable
      },
      disadvantage: {
        heading: "Unsafe",
        description: "No Security priviliges Drivers and passengers are not safe in a cab.",
        highlight: "Limited safety features",
        logo: User
      }
    },
    {
      title: "Convenience",
      advantage: {
        heading: "Door To Door",
        description: "We provide comfortable & luxurious rides directly at your doorstep",
        highlight: "Zero walking distance",
        logo: Affordable
      },
      disadvantage: {
        heading: "Long Walk",
        description: "Walk to meetup point for shuttles is tiring. \n\n Very tedious walk during monsoon times.",
        highlight: "15-20 min walk required",
        logo: disadvantages
      }
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % comparisonPairs.length);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [comparisonPairs.length]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-100 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-100 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span style={{color: '#1791c8'}}>Corporate</span> Cruise?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare our smart solutions with traditional services
          </p>
        </motion.div>

        <div className="relative px-4 sm:px-8">
          {/* Enhanced Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-30">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + comparisonPairs.length) % comparisonPairs.length)}
              className="pointer-events-auto relative -translate-x-4 md:-translate-x-8 bg-[#1791c8] hover:bg-blue-700 p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
            >
              <FiArrowLeft className="text-white text-lg md:text-xl transition-transform group-hover:-translate-x-1" />
              <span className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % comparisonPairs.length)}
              className="pointer-events-auto relative translate-x-4 md:translate-x-8 bg-[#1791c8] hover:bg-blue-700 p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
            >
              <FiArrowRight className="text-white text-lg md:text-xl transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors" />
            </button>
          </div>

          {/* Updated Cards Container */}
          <div className="overflow-hidden py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
                  {/* Enhanced Disadvantage Card */}
                  <motion.div
                    className="group bg-white hover:bg-gray-50 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative border border-gray-100 flex flex-col min-h-[320px] md:min-h-[380px] transform-gpu"
                    whileHover={{ 
                      scale: 1.02,
                      rotateZ: -0.5,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: 1000
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl shadow-inner" />
                    <motion.div 
                      className="absolute top-4 md:top-6 right-4 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-all"
                      whileHover={{ rotate: 5 }}
                    >
                      <img 
                        src={comparisonPairs[activeIndex].disadvantage.logo}
                        alt="Competition"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain opacity-70 group-hover:opacity-100 transition-all"
                      />
                    </motion.div>
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-gray-800 pr-20 leading-tight pt-2 mb-3">
                          {comparisonPairs[activeIndex].disadvantage.heading}
                        </h3>
                      </div>
                      <div className="space-y-3 flex-1 text-base md:text-lg flex-col">
                        {comparisonPairs[activeIndex].disadvantage.description.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-gray-600 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      <div className="mt-5 bg-red-50 text-red-700 px-5 py-2.5 rounded-lg font-semibold text-sm md:text-base inline-block">
                        {comparisonPairs[activeIndex].disadvantage.highlight}
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Advantage Card */}
                  <motion.div
                    className="group bg-white hover:bg-blue-50 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative border border-blue-100 flex flex-col min-h-[320px] md:min-h-[380px] transform-gpu"
                    whileHover={{ 
                      scale: 1.02,
                      rotateZ: 0.5,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: 1000
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl shadow-inner" />
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100/70 transition-all">
                      <img 
                        src={comparisonPairs[activeIndex].advantage.logo}
                        alt="Corporate Cruise"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1791c8] group-hover:text-blue-800 pr-20 leading-tight pt-2">
                          {comparisonPairs[activeIndex].advantage.heading}
                        </h3>
                      </div>
                      <div className="space-y-3 flex-1 text-base md:text-lg flex-col">
                        {comparisonPairs[activeIndex].advantage.description.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-gray-600 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      <div className="mt-5 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-lg font-semibold text-sm md:text-base inline-block">
                        {comparisonPairs[activeIndex].advantage.highlight}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Updated Carousel Indicators */}
          <div className="flex justify-center mt-6 md:mt-8 space-x-2">
            {comparisonPairs.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'w-5 md:w-6 bg-blue-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;