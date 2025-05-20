import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiTruck, FiUsers, FiShield, FiClock } from 'react-icons/fi';

const JoinFleetSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const headlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={headlineVariants}
        className="text-center mb-16 space-y-4"
      >
        <motion.h2 
         className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
         variants={headlineVariants}
        >
          You can always{' '}
          <span className="animate-gradient-text text-transparent bg-clip-text">count on</span><br />
          <span className="animate-gradient-text text-transparent bg-clip-text">us</span> for your daily office journey.
        </motion.h2>
      </motion.div>

      <motion.div
        variants={headlineVariants}
        className="text-center mb-12"
      >
        <h3 className="text-3xl md:text-4xl font-semibold">Choose Your Journey With Us</h3>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 px-4">
        {/* Driver Card */}
        <motion.div
          variants={cardVariants}
          className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 md:p-10 text-white 
                   hover:shadow-2xl transition-all duration-300 group relative overflow-hidden
                   hover:-translate-y-2 hover:rotate-[1deg]"
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 
                         group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Header with icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <FiTruck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white drop-shadow-md">Drive For Us</h3>
          </div>

          {/* Feature list */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-white/20 rounded-full mt-1">
                <FiClock className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90 text-lg">Flexible schedule with guaranteed weekly earnings</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-white/20 rounded-full mt-1">
                <FiUsers className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90 text-lg">Drive premium customers on predefined routes</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-white/20 rounded-full mt-1">
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90 text-lg">Excellent benefits and supportive work environment</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSeFmOPFOnyd9jyZWFe05Bowjw43SHmdLWKEhYHgyOlTOPXwLA/viewform?usp=sf_link'}
            className="relative overflow-hidden bg-white text-[#1791c8] px-8 py-3 rounded-full font-semibold 
                      transition-all duration-300 hover:bg-blue-50
                      shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center">
              Apply Now
              <svg 
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.button>
        </motion.div>

        {/* Rider Card */}
        <motion.div
          variants={cardVariants}
          className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 md:p-10 text-white 
                   hover:shadow-2xl transition-all duration-300 group relative overflow-hidden
                   hover:-translate-y-2 hover:-rotate-[1deg]"
          whileHover={{ scale: 1.01 }}
        >
          {/* Overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 
                         group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Header with icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <FiUsers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white drop-shadow-md">Ride With Us</h3>
          </div>

          {/* Feature list */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-white/20 rounded-full mt-1">
                <FiClock className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90 text-lg">99.9% on-time pickups, guaranteed daily</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-white/20 rounded-full mt-1">
                <FiUsers className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90 text-lg">Fixed monthly pricing with zero surge costs</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-white/20 rounded-full mt-1">
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/90 text-lg">Premium vehicles with business-class comfort</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/signup'}
            className="relative overflow-hidden bg-white text-[#1791c8] px-8 py-3 rounded-full font-semibold 
                      transition-all duration-300 hover:bg-blue-50
                      shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center">
              Pre-book Now
              <svg 
                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinFleetSection;